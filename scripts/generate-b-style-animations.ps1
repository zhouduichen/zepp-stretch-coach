param(
  [string]$SourceRoot = "",
  [string]$AssetRoot = ""
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
if (-not $SourceRoot) {
  $SourceRoot = Join-Path $root "resources\symbols"
}
if (-not $AssetRoot) {
  $AssetRoot = Join-Path $root "assets"
}

$targets = @("gt.r", "gt.s")
$animations = @{
  quad = 8; hamstring = 4; calf = 4; hipflexor = 4; glute = 4; sidelunge = 6
  seated_hamstring = 4; backtwist = 4; shoulder = 4; chest = 4; neck = 4
  triceps = 4; lat = 4; bicep = 4; wrist = 4; catcow = 6; legswing = 6
  sidelegswing = 6; walking_hamstring = 6; hipcircle = 6; torsotwist = 6
  armcircle = 6; ankle = 4; groin = 4
}
$SingleSidePrefixes = @(
  "quad",
  "hamstring",
  "calf",
  "hipflexor",
  "glute",
  "seated_hamstring",
  "backtwist",
  "shoulder",
  "neck",
  "triceps",
  "lat",
  "wrist",
  "legswing",
  "sidelegswing",
  "walking_hamstring",
  "hipcircle",
  "ankle"
)

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

function Get-MirroredBitmap([System.Drawing.Bitmap]$source) {
  $clone = $source.Clone(
    [System.Drawing.Rectangle]::new(0, 0, $source.Width, $source.Height),
    $source.PixelFormat
  )
  $clone.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
  return $clone
}

function Get-VisibleBounds(
  [System.Drawing.Bitmap]$source,
  [int]$alphaThreshold = 5
) {
  $minX = $source.Width
  $minY = $source.Height
  $maxX = -1
  $maxY = -1

  for ($x = 0; $x -lt $source.Width; $x += 1) {
    for ($y = 0; $y -lt $source.Height; $y += 1) {
      $color = $source.GetPixel($x, $y)
      if ($color.A -gt $alphaThreshold) {
        $minX = [Math]::Min($minX, $x)
        $minY = [Math]::Min($minY, $y)
        $maxX = [Math]::Max($maxX, $x)
        $maxY = [Math]::Max($maxY, $y)
      }
    }
  }

  if ($maxX -lt $minX -or $maxY -lt $minY) {
    return $null
  }

  return [System.Drawing.Rectangle]::new(
    $minX,
    $minY,
    $maxX - $minX + 1,
    $maxY - $minY + 1
  )
}

function Get-NormalizedSourceSprite([System.Drawing.Bitmap]$source) {
  $bounds = Get-VisibleBounds $source
  if ($null -eq $bounds) {
    throw "B-style source sprite has no visible pixels"
  }

  $targetLongSide = 210.0
  $targetArea = 33000.0
  $maxUpscale = 1.06
  $maxSide = [Math]::Max($bounds.Width, $bounds.Height)
  $area = [double]$bounds.Width * [double]$bounds.Height
  $scaleByLongSide = $targetLongSide / $maxSide
  $scaleByArea = [Math]::Sqrt($targetArea / $area)
  $scale = [Math]::Min($maxUpscale, [Math]::Min($scaleByLongSide, $scaleByArea))

  $bitmap = New-Bitmap 320 240
  $graphics = New-Graphics $bitmap
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $scaledWidth = [int][Math]::Round($source.Width * $scale)
  $scaledHeight = [int][Math]::Round($source.Height * $scale)
  $destX = [int][Math]::Round((320 - $scaledWidth) / 2)
  $destY = [int][Math]::Round((240 - $scaledHeight) / 2)
  $graphics.DrawImage(
    $source,
    [System.Drawing.Rectangle]::new($destX, $destY, $scaledWidth, $scaledHeight),
    0,
    0,
    $source.Width,
    $source.Height,
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $graphics.Dispose()

  return $bitmap
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

function Get-MuscleSprite([System.Drawing.Bitmap]$source) {
  $minX = $source.Width
  $minY = $source.Height
  $maxX = -1
  $maxY = -1

  for ($x = 0; $x -lt $source.Width; $x += 1) {
    for ($y = 0; $y -lt $source.Height; $y += 1) {
      $color = $source.GetPixel($x, $y)
      $isMuscle = (
        $color.A -gt 0 -and
        $color.R -gt 205 -and
        $color.G -gt 62 -and
        $color.G -lt 210 -and
        $color.B -lt 100
      )
      if ($isMuscle) {
        $minX = [Math]::Min($minX, $x)
        $minY = [Math]::Min($minY, $y)
        $maxX = [Math]::Max($maxX, $x)
        $maxY = [Math]::Max($maxY, $y)
      }
    }
  }

  if ($maxX -lt $minX -or $maxY -lt $minY) {
    return $null
  }

  $padding = 6
  $left = [Math]::Max(0, $minX - $padding)
  $top = [Math]::Max(0, $minY - $padding)
  $right = [Math]::Min($source.Width - 1, $maxX + $padding)
  $bottom = [Math]::Min($source.Height - 1, $maxY + $padding)
  $width = $right - $left + 1
  $height = $bottom - $top + 1
  $sprite = New-Bitmap $width $height

  for ($x = 0; $x -lt $width; $x += 1) {
    for ($y = 0; $y -lt $height; $y += 1) {
      $color = $source.GetPixel($left + $x, $top + $y)
      $isMuscle = (
        $color.A -gt 0 -and
        $color.R -gt 205 -and
        $color.G -gt 62 -and
        $color.G -lt 210 -and
        $color.B -lt 100
      )
      if ($isMuscle) {
        $sprite.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($color.A, 255, 139, 17))
      } else {
        $sprite.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
      }
    }
  }

  return @{
    bitmap = $sprite
    bounds = [System.Drawing.Rectangle]::new($left, $top, $width, $height)
  }
}

function Draw-BStyleFrame(
  [string]$path,
  [System.Drawing.Bitmap]$source,
  $muscle,
  [int]$frame,
  [int]$count
) {
  $bitmap = New-Bitmap 320 240
  $graphics = New-Graphics $bitmap
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.DrawImage($source, 0, 0, 320, 240)

  if ($muscle) {
    $phase = 2 * [Math]::PI * $frame / $count
    $pulse = ([Math]::Sin($phase) + 1) / 2
    $bounds = $muscle.bounds
    $scale = 1 + 0.085 * $pulse
    $pulseWidth = [int]($bounds.Width * $scale)
    $pulseHeight = [int]($bounds.Height * $scale)
    $pulseX = [int]($bounds.X - (($pulseWidth - $bounds.Width) / 2))
    $pulseY = [int]($bounds.Y - (($pulseHeight - $bounds.Height) / 2))

    Draw-WithOpacity $graphics $muscle.bitmap ([System.Drawing.Rectangle]::new($pulseX, $pulseY, $pulseWidth, $pulseHeight)) ([single](0.16 + 0.44 * $pulse))
    Draw-WithOpacity $graphics $muscle.bitmap $bounds ([single](0.22 + 0.52 * $pulse))
  }

  $graphics.Dispose()
  Save-Bitmap $bitmap $path
}

function Write-BStyleAnimation(
  [string]$outputDir,
  [System.Drawing.Bitmap]$source,
  $muscle,
  [int]$count
) {
  New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

  for ($frame = 0; $frame -lt $count; $frame += 1) {
    Draw-BStyleFrame (Join-Path $outputDir "f_$frame.png") $source $muscle $frame $count
  }

  return $count
}

$generated = 0
foreach ($prefix in $animations.Keys) {
  $sourcePath = Join-Path $SourceRoot "$prefix-source.png"
  if (-not (Test-Path $sourcePath)) {
    throw "Missing B-style source sprite: $sourcePath"
  }

  $rawSource = [System.Drawing.Bitmap]::new((Resolve-Path $sourcePath).Path)
  $source = $null
  $muscle = $null
  $rightSource = $null
  $rightMuscle = $null
  try {
    if ($rawSource.Width -ne 320 -or $rawSource.Height -ne 240) {
      throw "B-style source sprite must be 320x240: $sourcePath is $($rawSource.Width)x$($rawSource.Height)"
    }

    $source = Get-NormalizedSourceSprite $rawSource
    $muscle = Get-MuscleSprite $source
    if (-not $muscle) {
      throw "B-style source sprite has no detectable orange muscle region: $sourcePath"
    }

    if ($SingleSidePrefixes -contains $prefix) {
      $rightSource = Get-MirroredBitmap $source
      $rightMuscle = Get-MuscleSprite $rightSource
      if (-not $rightMuscle) {
        throw "Mirrored B-style source sprite has no detectable orange muscle region: $sourcePath"
      }
    }

    foreach ($target in $targets) {
      $count = $animations[$prefix]
      $generated += Write-BStyleAnimation (Join-Path $AssetRoot "$target\animations\$prefix") $source $muscle $count

      if ($SingleSidePrefixes -contains $prefix) {
        $generated += Write-BStyleAnimation (Join-Path $AssetRoot "$target\animations\${prefix}_left") $source $muscle $count
        $generated += Write-BStyleAnimation (Join-Path $AssetRoot "$target\animations\${prefix}_right") $rightSource $rightMuscle $count
      }
    }
  } finally {
    if ($rightMuscle) {
      $rightMuscle.bitmap.Dispose()
    }
    if ($rightSource) {
      $rightSource.Dispose()
    }
    if ($muscle) {
      $muscle.bitmap.Dispose()
    }
    if ($source) {
      $source.Dispose()
    }
    $rawSource.Dispose()
  }
}

Write-Host "Generated $generated B-style animation frame(s) from $SourceRoot."
