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
$frameCount = 8

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

function New-QuadPath {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $path.StartFigure()
  $path.AddBezier(158.1, 113.1, 163.4, 113.8, 166.7, 118.4, 167.7, 125.2)
  $path.AddBezier(167.7, 125.2, 169.0, 134.2, 168.2, 143.0, 165.4, 151.0)
  $path.AddBezier(165.4, 151.0, 163.7, 155.6, 161.5, 158.8, 159.3, 160.0)
  $path.AddBezier(159.3, 160.0, 156.2, 158.4, 154.3, 154.4, 153.4, 148.8)
  $path.AddBezier(153.4, 148.8, 152.1, 141.4, 152.2, 133.2, 152.8, 126.2)
  $path.AddBezier(152.8, 126.2, 153.4, 119.9, 155.0, 115.5, 158.1, 113.1)
  $path.CloseFigure()
  return $path
}

function New-QuadCorePath {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $path.StartFigure()
  $path.AddBezier(159.1, 116.5, 162.1, 119.8, 163.9, 125.2, 164.6, 131.7)
  $path.AddBezier(164.6, 131.7, 165.3, 138.2, 164.8, 144.4, 163.1, 149.7)
  $path.AddBezier(163.1, 149.7, 162.1, 152.8, 160.9, 154.9, 159.6, 156.0)
  $path.AddBezier(159.6, 156.0, 158.1, 153.6, 157.1, 149.8, 156.7, 145.0)
  $path.AddBezier(156.7, 145.0, 156.2, 138.7, 156.3, 132.1, 156.7, 126.4)
  $path.AddBezier(156.7, 126.4, 157.0, 121.8, 157.7, 118.5, 159.1, 116.5)
  $path.CloseFigure()
  return $path
}

function New-WarmWaveBrush([System.Drawing.RectangleF]$rect, [single]$pulse, [single]$alpha) {
  $phaseShift = ($pulse - 0.5) * 0.16
  $center = [Math]::Min(0.62, [Math]::Max(0.38, 0.50 + $phaseShift))
  $left = [Math]::Max(0.20, $center - 0.18)
  $right = [Math]::Min(0.80, $center + 0.18)
  $toAlpha = [int]([Math]::Min(255, [Math]::Max(0, $alpha * 255)))

  $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $rect,
    [System.Drawing.Color]::FromArgb($toAlpha, 255, 138, 24),
    [System.Drawing.Color]::FromArgb($toAlpha, 255, 118, 24),
    [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
  )
  $blend = [System.Drawing.Drawing2D.ColorBlend]::new(5)
  $blend.Positions = [single[]]@(0, $left, $center, $right, 1)
  $blend.Colors = [System.Drawing.Color[]]@(
    [System.Drawing.Color]::FromArgb($toAlpha, 255, 138, 24),
    [System.Drawing.Color]::FromArgb($toAlpha, 255, 163, 35),
    [System.Drawing.Color]::FromArgb($toAlpha, 255, 226, 113),
    [System.Drawing.Color]::FromArgb($toAlpha, 255, 163, 35),
    [System.Drawing.Color]::FromArgb($toAlpha, 255, 118, 24)
  )
  $brush.InterpolationColors = $blend
  return $brush
}

function Fill-ApprovedQuadOverlay($graphics, [int]$frameIndex) {
  $phase = 2 * [Math]::PI * $frameIndex / $frameCount
  $pulse = ([Math]::Sin($phase) + 1) / 2
  $scale = 1 + 0.045 * $pulse
  $baseAlpha = 0.34 + 0.34 * $pulse
  $coreAlpha = 0.22 + 0.46 * $pulse

  $quadPath = New-QuadPath
  $corePath = New-QuadCorePath
  $state = $graphics.Save()

  $graphics.SetClip($quadPath)
  $graphics.TranslateTransform(160.5, 136.5)
  $graphics.ScaleTransform([single]$scale, 1)
  $graphics.TranslateTransform(-160.5, -136.5)

  $quadBounds = [System.Drawing.RectangleF]::new(152, 112, 18, 50)
  $quadBrush = New-WarmWaveBrush $quadBounds $pulse $baseAlpha
  $graphics.FillPath($quadBrush, $quadPath)
  $quadBrush.Dispose()

  $coreBounds = [System.Drawing.RectangleF]::new(156, 116, 10, 40)
  $coreBrush = New-WarmWaveBrush $coreBounds $pulse $coreAlpha
  $graphics.FillPath($coreBrush, $corePath)
  $coreBrush.Dispose()

  $graphics.Restore($state)
  $quadPath.Dispose()
  $corePath.Dispose()
}

function Generate-QuadAnimation {
  $sourcePath = Join-Path $SourceRoot "quad-source.png"
  if (-not (Test-Path $sourcePath)) {
    throw "Missing approved source sprite: $sourcePath"
  }

  $source = [System.Drawing.Bitmap]::new((Resolve-Path $sourcePath).Path)
  try {
    foreach ($target in $targets) {
      $outputDir = Join-Path $AssetRoot "$target\animations\quad"
      New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

      for ($frame = 0; $frame -lt $frameCount; $frame += 1) {
        $bitmap = New-Bitmap 320 240
        $graphics = New-Graphics $bitmap
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $graphics.DrawImage($source, 0, 0, 320, 240)
        Fill-ApprovedQuadOverlay $graphics $frame
        $graphics.Dispose()
        Save-Bitmap $bitmap (Join-Path $outputDir "f_$frame.png")
      }
    }
  } finally {
    $source.Dispose()
  }
}

Generate-QuadAnimation
Write-Host "Generated approved static quad animation: $frameCount frames for $($targets.Count) targets."
