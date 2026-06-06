param(
  [string]$Source = "",
  [string]$OutputRoot = "",
  [string]$SymbolRoot = "",
  [string[]]$TileIds = @(),
  [switch]$OverwriteApproved
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
if (-not $Source) {
  $Source = Join-Path $root "tmp\symbol-prototypes\style-board-v2-flat.png"
}
if (-not $OutputRoot) {
  $OutputRoot = Join-Path $root "tmp\symbol-prototypes\b-style"
}
if (-not $SymbolRoot) {
  $SymbolRoot = Join-Path $root "resources\symbols"
}

$sourceImage = [System.Drawing.Bitmap]::new((Resolve-Path $Source).Path)
$frameCount = 12
$canvasWidth = 320
$canvasHeight = 240

$defaultTileIds = @("quad", "hamstring", "hipflexor", "sidelunge", "shoulder", "catcow")
if ($TileIds.Count -eq 0) {
  $TileIds = $defaultTileIds
}
if ($TileIds.Count -eq 1 -and $TileIds[0] -match ",") {
  $TileIds = $TileIds[0] -split "," | ForEach-Object { $_.Trim() } | Where-Object { $_ }
}
if ($TileIds.Count -ne 6) {
  throw "TileIds must contain exactly 6 ids for the 3x2 style board."
}

$tileRects = @(
  @{ x = 21; y = 21; w = 483; h = 474 },
  @{ x = 527; y = 21; w = 483; h = 474 },
  @{ x = 1033; y = 21; w = 483; h = 474 },
  @{ x = 21; y = 523; w = 483; h = 480 },
  @{ x = 527; y = 523; w = 483; h = 480 },
  @{ x = 1033; y = 523; w = 483; h = 480 }
)

$tiles = for ($index = 0; $index -lt $tileRects.Count; $index += 1) {
  @{
    id = $TileIds[$index]
    x = $tileRects[$index].x
    y = $tileRects[$index].y
    w = $tileRects[$index].w
    h = $tileRects[$index].h
  }
}

function New-Bitmap([int]$width, [int]$height) {
  return [System.Drawing.Bitmap]::new(
    $width,
    $height,
    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
  )
}

function New-Graphics([System.Drawing.Bitmap]$bitmap) {
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  return $graphics
}

function Save-Bitmap([System.Drawing.Bitmap]$bitmap, [string]$path) {
  $directory = Split-Path $path -Parent
  if (-not (Test-Path $directory)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

function Get-SubjectSprite($tile) {
  $crop = New-Bitmap $tile.w $tile.h
  $cropGraphics = New-Graphics $crop
  $cropGraphics.DrawImage(
    $sourceImage,
    [System.Drawing.Rectangle]::new(0, 0, $tile.w, $tile.h),
    [System.Drawing.Rectangle]::new($tile.x, $tile.y, $tile.w, $tile.h),
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $cropGraphics.Dispose()

  $minX = $crop.Width
  $minY = $crop.Height
  $maxX = -1
  $maxY = -1

  for ($x = 0; $x -lt $crop.Width; $x += 1) {
    for ($y = 0; $y -lt $crop.Height; $y += 1) {
      $color = $crop.GetPixel($x, $y)
      $isBody = (
        $color.G -gt 42 -and
        $color.G -gt ($color.R * 0.92) -and
        $color.G -gt ($color.B * 1.18)
      )
      $isMuscle = (
        $color.R -gt 145 -and
        $color.G -gt 42 -and
        $color.G -lt 225 -and
        $color.B -lt 118
      )
      $alpha = if ($isBody -or $isMuscle) {
        [Math]::Min(255, [Math]::Max(0, [int](($color.G - 35) * 6)))
      } else {
        0
      }

      if ($alpha -gt 18) {
        $crop.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $color.R, $color.G, $color.B))
        $minX = [Math]::Min($minX, $x)
        $minY = [Math]::Min($minY, $y)
        $maxX = [Math]::Max($maxX, $x)
        $maxY = [Math]::Max($maxY, $y)
      } else {
        $crop.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
      }
    }
  }

  if ($maxX -lt $minX -or $maxY -lt $minY) {
    $crop.Dispose()
    throw "No subject pixels found for $($tile.id)"
  }

  $padding = 8
  $left = [Math]::Max(0, $minX - $padding)
  $top = [Math]::Max(0, $minY - $padding)
  $right = [Math]::Min($crop.Width - 1, $maxX + $padding)
  $bottom = [Math]::Min($crop.Height - 1, $maxY + $padding)
  $width = $right - $left + 1
  $height = $bottom - $top + 1
  $sprite = New-Bitmap $width $height
  $graphics = New-Graphics $sprite
  $graphics.DrawImage(
    $crop,
    [System.Drawing.Rectangle]::new(0, 0, $width, $height),
    [System.Drawing.Rectangle]::new($left, $top, $width, $height),
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $graphics.Dispose()
  $crop.Dispose()
  return $sprite
}

function Get-MuscleOverlay([System.Drawing.Bitmap]$sprite) {
  $overlay = New-Bitmap $sprite.Width $sprite.Height
  for ($x = 0; $x -lt $sprite.Width; $x += 1) {
    for ($y = 0; $y -lt $sprite.Height; $y += 1) {
      $color = $sprite.GetPixel($x, $y)
      if (
        $color.A -gt 0 -and
        $color.R -gt 205 -and
        $color.G -gt 62 -and
        $color.G -lt 205 -and
        $color.B -lt 82
      ) {
        $overlay.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($color.A, 255, 139, 17))
      }
    }
  }
  return $overlay
}

function Draw-WithOpacity(
  $graphics,
  [System.Drawing.Image]$image,
  [System.Drawing.Rectangle]$destination,
  [single]$opacity
) {
  $matrix = [System.Drawing.Imaging.ColorMatrix]::new()
  $matrix.Matrix33 = $opacity
  $attributes = [System.Drawing.Imaging.ImageAttributes]::new()
  $attributes.SetColorMatrix($matrix)
  $graphics.DrawImage(
    $image,
    $destination,
    0,
    0,
    $image.Width,
    $image.Height,
    [System.Drawing.GraphicsUnit]::Pixel,
    $attributes
  )
  $attributes.Dispose()
}

function Draw-CenteredSprite([string]$path, [System.Drawing.Bitmap]$sprite) {
  $maxWidth = 258
  $maxHeight = 212
  $fit = [Math]::Min($maxWidth / $sprite.Width, $maxHeight / $sprite.Height)
  $width = [int]($sprite.Width * $fit)
  $height = [int]($sprite.Height * $fit)
  $x = [int](($canvasWidth - $width) / 2)
  $y = [int](($canvasHeight - $height) / 2)

  $bitmap = New-Bitmap $canvasWidth $canvasHeight
  $graphics = New-Graphics $bitmap
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.DrawImage($sprite, [System.Drawing.Rectangle]::new($x, $y, $width, $height))
  $graphics.Dispose()
  Save-Bitmap $bitmap $path
}

New-Item -ItemType Directory -Path $SymbolRoot -Force | Out-Null

foreach ($tile in $tiles) {
  $sprite = Get-SubjectSprite $tile
  $muscle = Get-MuscleOverlay $sprite

  $sourcePath = Join-Path $SymbolRoot "$($tile.id)-source.png"
  if ($OverwriteApproved -or -not (Test-Path $sourcePath)) {
    Draw-CenteredSprite $sourcePath $sprite
  } else {
    Write-Host "Kept existing approved source: $sourcePath"
  }

  for ($frame = 0; $frame -lt $frameCount; $frame += 1) {
    $phase = 2 * [Math]::PI * $frame / $frameCount
    $wave = [Math]::Sin($phase)
    $pulse = ($wave + 1) / 2

    $maxWidth = 258
    $maxHeight = 212
    $fit = [Math]::Min($maxWidth / $sprite.Width, $maxHeight / $sprite.Height)
    $width = [int]($sprite.Width * $fit)
    $height = [int]($sprite.Height * $fit)
    $x = [int](($canvasWidth - $width) / 2)
    $y = [int](($canvasHeight - $height) / 2)
    $destination = [System.Drawing.Rectangle]::new($x, $y, $width, $height)

    $bitmap = New-Bitmap $canvasWidth $canvasHeight
    $graphics = New-Graphics $bitmap
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.DrawImage($sprite, $destination)

    # Keep the posture fixed. Only the target muscle expands and brightens subtly.
    $muscleScale = 1 + 0.065 * $pulse
    $muscleWidth = [int]($width * $muscleScale)
    $muscleHeight = [int]($height * $muscleScale)
    $muscleX = [int]($x - ($muscleWidth - $width) / 2)
    $muscleY = [int]($y - ($muscleHeight - $height) / 2)
    $muscleDestination = [System.Drawing.Rectangle]::new(
      $muscleX,
      $muscleY,
      $muscleWidth,
      $muscleHeight
    )
    Draw-WithOpacity $graphics $muscle $muscleDestination ([single](0.18 + 0.48 * $pulse))
    Draw-WithOpacity $graphics $muscle $destination ([single](0.24 + 0.56 * $pulse))

    $graphics.Dispose()
    Save-Bitmap $bitmap (Join-Path $OutputRoot "$($tile.id)\f_$frame.png")
  }

  $muscle.Dispose()
  $sprite.Dispose()
}

$sourceImage.Dispose()
Write-Host "Generated $($tiles.Count) B-style preview animations in $OutputRoot"
