param(
  [Parameter(Mandatory = $true)]
  [string]$BackgroundSource,

  [Parameter(Mandatory = $true)]
  [string]$IconSource
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$targets = @("gt.r", "gt.s")
$fitnessBg = [System.Drawing.Color]::FromArgb(255, 5, 8, 6)
$fitnessPanel = [System.Drawing.Color]::FromArgb(255, 20, 26, 21)
$fitnessPanel2 = [System.Drawing.Color]::FromArgb(255, 30, 37, 31)
$fitnessStroke = [System.Drawing.Color]::FromArgb(255, 72, 84, 70)
$fitnessGreen = [System.Drawing.Color]::FromArgb(255, 182, 246, 64)
$fitnessMint = [System.Drawing.Color]::FromArgb(255, 111, 235, 174)
$fitnessBlue = [System.Drawing.Color]::FromArgb(255, 88, 177, 255)
$fitnessRose = [System.Drawing.Color]::FromArgb(255, 255, 91, 129)
$fitnessRed = [System.Drawing.Color]::FromArgb(255, 255, 88, 96)
$fitnessText = [System.Drawing.Color]::FromArgb(255, 246, 249, 244)
$fitnessMuted = [System.Drawing.Color]::FromArgb(255, 154, 164, 151)
$lime = $fitnessGreen
$cyan = $fitnessMint
$orange = [System.Drawing.Color]::FromArgb(255, 224, 188, 74)
$red = $fitnessRed
$blue = $fitnessBlue
$white = $fitnessText
$navy = $fitnessBg

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
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
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

function New-RoundedRect([single]$x, [single]$y, [single]$width, [single]$height, [single]$radius) {
  $diameter = $radius * 2
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $path.AddArc($x, $y, $diameter, $diameter, 180, 90)
  $path.AddArc($x + $width - $diameter, $y, $diameter, $diameter, 270, 90)
  $path.AddArc($x + $width - $diameter, $y + $height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($x, $y + $height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Resize-Cover([string]$source, [string]$path, [int]$width, [int]$height) {
  $inputImage = [System.Drawing.Image]::FromFile($source)
  $bitmap = New-Bitmap $width $height
  $graphics = New-Graphics $bitmap
  $graphics.Clear($navy)

  $targetRatio = $width / $height
  $sourceRatio = $inputImage.Width / $inputImage.Height
  if ($sourceRatio -gt $targetRatio) {
    $sourceHeight = $inputImage.Height
    $sourceWidth = [int]($sourceHeight * $targetRatio)
    $sourceX = [int](($inputImage.Width - $sourceWidth) / 2)
    $sourceY = 0
  } else {
    $sourceWidth = $inputImage.Width
    $sourceHeight = [int]($sourceWidth / $targetRatio)
    $sourceX = 0
    $sourceY = [int](($inputImage.Height - $sourceHeight) / 2)
  }

  $destination = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
  $crop = [System.Drawing.Rectangle]::new($sourceX, $sourceY, $sourceWidth, $sourceHeight)
  $graphics.DrawImage($inputImage, $destination, $crop, [System.Drawing.GraphicsUnit]::Pixel)
  $graphics.Dispose()
  $inputImage.Dispose()
  Save-Bitmap $bitmap $path
}

function Draw-FitnessBackground([string]$path, [int]$width, [int]$height) {
  $bitmap = New-Bitmap $width $height
  $graphics = New-Graphics $bitmap
  $graphics.Clear($fitnessBg)

  $leftGlow = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.RectangleF]::new(-$width * 0.35, $height * 0.58, $width * 0.86, $height * 0.58),
    [System.Drawing.Color]::FromArgb(54, $fitnessGreen),
    [System.Drawing.Color]::FromArgb(0, $fitnessGreen),
    [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
  )
  $graphics.FillEllipse($leftGlow, -$width * 0.35, $height * 0.58, $width * 0.86, $height * 0.58)
  $leftGlow.Dispose()

  $topGlow = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(20, $fitnessBlue))
  $graphics.FillEllipse($topGlow, $width * 0.48, -$height * 0.22, $width * 0.75, $height * 0.55)
  $topGlow.Dispose()

  $centerX = [single]($width * 0.82)
  $centerY = [single]($height * 0.29)
  $diameters = @(
    @{ d = [single]($width * 0.86); color = $fitnessGreen; alpha = 88; width = 7 },
    @{ d = [single]($width * 0.70); color = $fitnessBlue; alpha = 45; width = 5 },
    @{ d = [single]($width * 0.54); color = $fitnessRose; alpha = 34; width = 4 }
  )
  foreach ($ring in $diameters) {
    $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb($ring.alpha, $ring.color), $ring.width)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $d = $ring.d
    $graphics.DrawArc($pen, $centerX - ($d / 2), $centerY - ($d / 2), $d, $d, 206, 238)
    $pen.Dispose()
  }

  $veil = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(48, 0, 0, 0))
  $graphics.FillRectangle($veil, 0, 0, $width, $height)
  $veil.Dispose()

  $graphics.Dispose()
  Save-Bitmap $bitmap $path
}

function Draw-CenteredText(
  $graphics,
  [string]$text,
  [System.Drawing.Font]$font,
  [System.Drawing.Brush]$brush,
  [System.Drawing.RectangleF]$rect
) {
  $format = [System.Drawing.StringFormat]::GenericTypographic.Clone()
  $format.Alignment = [System.Drawing.StringAlignment]::Near
  $format.LineAlignment = [System.Drawing.StringAlignment]::Near
  $format.FormatFlags = $format.FormatFlags -bor [System.Drawing.StringFormatFlags]::NoClip
  $format.SetMeasurableCharacterRanges(@([System.Drawing.CharacterRange]::new(0, $text.Length)))

  $measureRect = [System.Drawing.RectangleF]::new(0, 0, 1000, 1000)
  $regions = $graphics.MeasureCharacterRanges($text, $font, $measureRect, $format)
  $bounds = $regions[0].GetBounds($graphics)
  $x = [single]($rect.X + (($rect.Width - $bounds.Width) / 2) - $bounds.X)
  $y = [single]($rect.Y + (($rect.Height - $bounds.Height) / 2) - $bounds.Y)

  $graphics.DrawString($text, $font, $brush, [System.Drawing.PointF]::new($x, $y), $format)
  $regions[0].Dispose()
  $format.Dispose()
}

function Draw-LabelButton(
  [string]$path,
  [int]$width,
  [int]$height,
  [string]$label,
  [System.Drawing.Color]$left,
  [System.Drawing.Color]$right,
  [bool]$outline = $false
) {
  $bitmap = New-Bitmap $width $height
  $graphics = New-Graphics $bitmap
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $rect = [System.Drawing.RectangleF]::new(1, 1, $width - 2, $height - 2)
  $pathShape = New-RoundedRect 1 1 ($width - 2) ($height - 2) ([Math]::Min(18, $height / 2 - 1))

  if ($outline) {
    $fill = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(38, $left))
    $graphics.FillPath($fill, $pathShape)
    $fill.Dispose()
    $pen = [System.Drawing.Pen]::new($left, 2)
    $graphics.DrawPath($pen, $pathShape)
    $pen.Dispose()
  } else {
    $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
      $rect,
      $left,
      $right,
      [System.Drawing.Drawing2D.LinearGradientMode]::Horizontal
    )
    $graphics.FillPath($brush, $pathShape)
    $brush.Dispose()
  }

  $fontSize = if ($height -lt 48) { 14 } elseif ($width -lt 130) { 15 } else { 17 }
  $font = [System.Drawing.Font]::new("Segoe UI Semibold", $fontSize, [System.Drawing.FontStyle]::Bold)
  $textBrush = [System.Drawing.SolidBrush]::new($white)
  Draw-CenteredText $graphics $label $font $textBrush $rect
  $textBrush.Dispose()
  $font.Dispose()
  $pathShape.Dispose()
  $graphics.Dispose()
  Save-Bitmap $bitmap $path
}

function Draw-FitnessButton(
  [string]$path,
  [int]$width,
  [int]$height,
  [string]$label,
  [string]$variant = "secondary"
) {
  $bitmap = New-Bitmap $width $height
  $graphics = New-Graphics $bitmap
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $rect = [System.Drawing.RectangleF]::new(1, 1, $width - 2, $height - 2)
  $shape = New-RoundedRect 1 1 ($width - 2) ($height - 2) ([Math]::Min($height / 2 - 1, 24))

  if ($variant -eq "primary") {
    $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
      $rect,
      $fitnessGreen,
      $fitnessMint,
      [System.Drawing.Drawing2D.LinearGradientMode]::Horizontal
    )
    $graphics.FillPath($brush, $shape)
    $brush.Dispose()
    $textColor = [System.Drawing.Color]::FromArgb(255, 7, 14, 7)
  } elseif ($variant -eq "danger") {
    $fill = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(46, $fitnessRed))
    $graphics.FillPath($fill, $shape)
    $fill.Dispose()
    $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(190, $fitnessRed), 2)
    $graphics.DrawPath($pen, $shape)
    $pen.Dispose()
    $textColor = $fitnessText
  } else {
    $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
      $rect,
      $fitnessPanel2,
      $fitnessPanel,
      [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
    )
    $graphics.FillPath($brush, $shape)
    $brush.Dispose()
    $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(150, $fitnessStroke), 1)
    $graphics.DrawPath($pen, $shape)
    $pen.Dispose()
    $textColor = $fitnessText
  }

  $fontSize = if ($height -lt 48) { 13 } elseif ($width -lt 130) { 14 } else { 16 }
  $font = [System.Drawing.Font]::new("Segoe UI Semibold", $fontSize, [System.Drawing.FontStyle]::Bold)
  $textBrush = [System.Drawing.SolidBrush]::new($textColor)
  Draw-CenteredText $graphics $label $font $textBrush $rect
  $textBrush.Dispose()
  $font.Dispose()
  $shape.Dispose()
  $graphics.Dispose()
  Save-Bitmap $bitmap $path
}

function Draw-FitnessCardSurface(
  $graphics,
  [int]$width,
  [int]$height
) {
  $shadow = New-RoundedRect 5 7 ($width - 10) ($height - 12) 22
  $shadowBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(92, 0, 0, 0))
  $graphics.FillPath($shadowBrush, $shadow)
  $shadowBrush.Dispose()
  $shadow.Dispose()

  $rect = [System.Drawing.RectangleF]::new(2, 1, $width - 4, $height - 4)
  $shape = New-RoundedRect 2 1 ($width - 4) ($height - 4) 20
  $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $rect,
    [System.Drawing.Color]::FromArgb(245, $fitnessPanel2),
    [System.Drawing.Color]::FromArgb(238, $fitnessPanel),
    [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
  )
  $graphics.FillPath($brush, $shape)
  $brush.Dispose()

  $glow = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(18, $fitnessGreen))
  $graphics.FillEllipse($glow, -$width * 0.18, -$height * 0.30, $width * 0.80, $height * 0.96)
  $glow.Dispose()

  $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(124, $fitnessStroke), 1)
  $graphics.DrawPath($pen, $shape)
  $pen.Dispose()
  $shape.Dispose()
}

function Draw-ProgressCard([string]$path, [int]$width, [int]$height) {
  $bitmap = New-Bitmap $width $height
  $graphics = New-Graphics $bitmap
  $graphics.Clear([System.Drawing.Color]::Transparent)
  Draw-FitnessCardSurface $graphics $width $height

  $ringSize = [Math]::Min(50, $height - 28)
  $x = [single]($width - $ringSize - 18)
  $y = [single](($height - $ringSize) / 2)
  $track = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(54, $fitnessMuted), 5)
  $graphics.DrawEllipse($track, $x, $y, $ringSize, $ringSize)
  $track.Dispose()

  $progress = [System.Drawing.Pen]::new($fitnessGreen, 6)
  $progress.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $progress.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawArc($progress, $x, $y, $ringSize, $ringSize, -90, 252)
  $progress.Dispose()

  $dotAngle = (-90 + 252) * [Math]::PI / 180
  $dotX = [single]($x + ($ringSize / 2) + [Math]::Cos($dotAngle) * ($ringSize / 2))
  $dotY = [single]($y + ($ringSize / 2) + [Math]::Sin($dotAngle) * ($ringSize / 2))
  $dotBrush = [System.Drawing.SolidBrush]::new($fitnessRose)
  $graphics.FillEllipse($dotBrush, $dotX - 3, $dotY - 3, 6, 6)
  $dotBrush.Dispose()

  $graphics.Dispose()
  Save-Bitmap $bitmap $path
}

function Draw-TrendCard([string]$path, [int]$width, [int]$height) {
  $bitmap = New-Bitmap $width $height
  $graphics = New-Graphics $bitmap
  $graphics.Clear([System.Drawing.Color]::Transparent)
  Draw-FitnessCardSurface $graphics $width $height

  $line = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $line.StartFigure()
  $line.AddLine($width * 0.48, $height * 0.66, $width * 0.58, $height * 0.52)
  $line.AddLine($width * 0.68, $height * 0.58, $width * 0.78, $height * 0.34)
  $line.AddLine($width * 0.90, $height * 0.42, $width * 0.94, $height * 0.26)
  $shadowPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(42, $fitnessBlue), 8)
  $shadowPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $shadowPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $shadowPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $graphics.DrawPath($shadowPen, $line)
  $shadowPen.Dispose()

  $pen = [System.Drawing.Pen]::new($fitnessBlue, 3)
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $graphics.DrawPath($pen, $line)
  $pen.Dispose()

  foreach ($point in @(
    @{ x = $width * 0.48; y = $height * 0.66; color = $fitnessMuted },
    @{ x = $width * 0.68; y = $height * 0.58; color = $fitnessGreen },
    @{ x = $width * 0.78; y = $height * 0.34; color = $fitnessRose },
    @{ x = $width * 0.94; y = $height * 0.26; color = $fitnessBlue }
  )) {
    $brush = [System.Drawing.SolidBrush]::new($point.color)
    $pointX = [single]$point.x
    $pointY = [single]$point.y
    $graphics.FillEllipse($brush, $pointX - 3, $pointY - 3, 6, 6)
    $brush.Dispose()
  }

  $line.Dispose()
  $graphics.Dispose()
  Save-Bitmap $bitmap $path
}

function Draw-SelectRowCard([string]$path, [int]$width, [int]$height) {
  $bitmap = New-Bitmap $width $height
  $graphics = New-Graphics $bitmap
  $graphics.Clear([System.Drawing.Color]::Transparent)

  $shadow = New-RoundedRect 4 5 ($width - 8) ($height - 9) 18
  $shadowBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(56, 0, 0, 0))
  $graphics.FillPath($shadowBrush, $shadow)
  $shadowBrush.Dispose()
  $shadow.Dispose()

  $rect = [System.Drawing.RectangleF]::new(1, 1, $width - 3, $height - 4)
  $shape = New-RoundedRect 1 1 ($width - 3) ($height - 4) 18
  $fill = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $rect,
    [System.Drawing.Color]::FromArgb(196, 27, 34, 28),
    [System.Drawing.Color]::FromArgb(172, 14, 20, 16),
    [System.Drawing.Drawing2D.LinearGradientMode]::Horizontal
  )
  $graphics.FillPath($fill, $shape)
  $fill.Dispose()

  $accent = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(190, $fitnessGreen), 3)
  $accent.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $accent.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawLine($accent, 13, 14, 13, $height - 17)
  $accent.Dispose()

  $glow = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(18, $fitnessBlue))
  $graphics.FillEllipse($glow, $width * 0.62, -$height * 0.25, $width * 0.45, $height * 1.15)
  $glow.Dispose()

  $stroke = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(82, $fitnessStroke), 1)
  $graphics.DrawPath($stroke, $shape)
  $stroke.Dispose()
  $shape.Dispose()

  $graphics.Dispose()
  Save-Bitmap $bitmap $path
}

function Draw-CircleIcon([string]$path, [int]$size, [string]$kind, [System.Drawing.Color]$accent) {
  $bitmap = New-Bitmap $size $size
  $graphics = New-Graphics $bitmap
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $glow = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(35, $accent))
  $graphics.FillEllipse($glow, 1, 1, $size - 2, $size - 2)
  $glow.Dispose()
  $pen = [System.Drawing.Pen]::new($accent, [Math]::Max(3, $size / 14))
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

  switch ($kind) {
    "pause" {
      $graphics.DrawLine($pen, $size * 0.39, $size * 0.30, $size * 0.39, $size * 0.70)
      $graphics.DrawLine($pen, $size * 0.61, $size * 0.30, $size * 0.61, $size * 0.70)
    }
    "check" {
      $graphics.DrawEllipse($pen, $size * 0.12, $size * 0.12, $size * 0.76, $size * 0.76)
      $graphics.DrawLines($pen, @(
        [System.Drawing.PointF]::new($size * 0.29, $size * 0.51),
        [System.Drawing.PointF]::new($size * 0.44, $size * 0.65),
        [System.Drawing.PointF]::new($size * 0.72, $size * 0.36)
      ))
    }
    "stop" {
      $graphics.DrawEllipse($pen, $size * 0.12, $size * 0.12, $size * 0.76, $size * 0.76)
      $graphics.DrawRectangle($pen, $size * 0.37, $size * 0.37, $size * 0.26, $size * 0.26)
    }
    "help" {
      $font = [System.Drawing.Font]::new("Segoe UI Semibold", $size * 0.48, [System.Drawing.FontStyle]::Bold)
      $format = [System.Drawing.StringFormat]::new()
      $format.Alignment = [System.Drawing.StringAlignment]::Center
      $format.LineAlignment = [System.Drawing.StringAlignment]::Center
      $brush = [System.Drawing.SolidBrush]::new($accent)
      $graphics.DrawString("?", $font, $brush, [System.Drawing.RectangleF]::new(0, 0, $size, $size), $format)
      $brush.Dispose()
      $format.Dispose()
      $font.Dispose()
    }
  }

  $pen.Dispose()
  $graphics.Dispose()
  Save-Bitmap $bitmap $path
}

function Draw-Arrow([string]$path, [bool]$next) {
  $bitmap = New-Bitmap 40 40
  $graphics = New-Graphics $bitmap
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $pen = [System.Drawing.Pen]::new($fitnessGreen, 4)
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  if ($next) {
    $graphics.DrawLines($pen, @(
      [System.Drawing.PointF]::new(14, 9),
      [System.Drawing.PointF]::new(25, 20),
      [System.Drawing.PointF]::new(14, 31)
    ))
  } else {
    $graphics.DrawLines($pen, @(
      [System.Drawing.PointF]::new(26, 9),
      [System.Drawing.PointF]::new(15, 20),
      [System.Drawing.PointF]::new(26, 31)
    ))
  }
  $pen.Dispose()
  $graphics.Dispose()
  Save-Bitmap $bitmap $path
}

function Draw-SportIcon([string]$path, [string]$kind, [System.Drawing.Color]$accent, [int]$size = 64) {
  $bitmap = New-Bitmap $size $size
  $graphics = New-Graphics $bitmap
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $scale = [single]($size / 64.0)
  $graphics.ScaleTransform($scale, $scale)

  $fill = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(48, $accent))
  $graphics.FillEllipse($fill, 2, 2, 60, 60)
  $fill.Dispose()
  $ring = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(180, $accent), 2)
  $graphics.DrawEllipse($ring, 3, 3, 58, 58)
  $ring.Dispose()

  $pen = [System.Drawing.Pen]::new($white, 4)
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $thin = [System.Drawing.Pen]::new($white, 2)
  $thin.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $thin.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

  switch ($kind) {
    "cardio" {
      $graphics.DrawLines($pen, @(
        (Point 11 34), (Point 22 34), (Point 27 23),
        (Point 35 44), (Point 41 31), (Point 53 31)
      ))
    }
    "strength" {
      $graphics.DrawLine($pen, 16, 32, 48, 32)
      $graphics.DrawLine($pen, 19, 22, 19, 42)
      $graphics.DrawLine($pen, 25, 25, 25, 39)
      $graphics.DrawLine($pen, 39, 25, 39, 39)
      $graphics.DrawLine($pen, 45, 22, 45, 42)
    }
    "ball" {
      $graphics.DrawEllipse($pen, 16, 16, 32, 32)
      $graphics.DrawArc($thin, 16, 24, 32, 16, 0, 180)
      $graphics.DrawArc($thin, 24, 16, 16, 32, 90, 180)
    }
    "run" {
      $graphics.FillEllipse([System.Drawing.SolidBrush]::new($white), 29, 10, 8, 8)
      $graphics.DrawLine($pen, 31, 21, 27, 36)
      $graphics.DrawLine($pen, 28, 28, 18, 33)
      $graphics.DrawLine($pen, 29, 25, 41, 28)
      $graphics.DrawLine($pen, 27, 36, 17, 49)
      $graphics.DrawLine($pen, 27, 36, 42, 47)
    }
    "cycle" {
      $graphics.DrawEllipse($thin, 10, 34, 17, 17)
      $graphics.DrawEllipse($thin, 39, 34, 17, 17)
      $graphics.DrawLine($thin, 18, 42, 31, 29)
      $graphics.DrawLine($thin, 31, 29, 47, 42)
      $graphics.DrawLine($thin, 18, 42, 42, 42)
      $graphics.DrawLine($thin, 31, 29, 36, 42)
      $graphics.DrawLine($thin, 28, 26, 36, 26)
    }
    "bodyweight" {
      $graphics.FillEllipse([System.Drawing.SolidBrush]::new($white), 28, 10, 8, 8)
      $graphics.DrawLine($pen, 32, 20, 32, 38)
      $graphics.DrawLine($pen, 32, 23, 19, 16)
      $graphics.DrawLine($pen, 32, 23, 45, 16)
      $graphics.DrawLine($pen, 32, 38, 21, 51)
      $graphics.DrawLine($pen, 32, 38, 43, 51)
    }
    "basketball" {
      $graphics.DrawEllipse($pen, 15, 15, 34, 34)
      $graphics.DrawLine($thin, 15, 32, 49, 32)
      $graphics.DrawArc($thin, 23, 15, 18, 34, 90, 180)
      $graphics.DrawArc($thin, 23, 15, 18, 34, 270, 180)
    }
    "soccer" {
      $graphics.DrawEllipse($pen, 15, 15, 34, 34)
      $graphics.DrawPolygon($thin, @((Point 32 23), (Point 39 28), (Point 36 36), (Point 28 36), (Point 25 28)))
    }
    "tennis" {
      $graphics.DrawEllipse($pen, 15, 15, 34, 34)
      $graphics.DrawArc($thin, 7, 19, 32, 25, 300, 110)
      $graphics.DrawArc($thin, 25, 19, 32, 25, 120, 110)
    }
    "badminton" {
      $graphics.DrawEllipse($thin, 27, 12, 10, 8)
      $graphics.DrawLine($pen, 30, 20, 21, 48)
      $graphics.DrawLine($pen, 34, 20, 43, 48)
      $graphics.DrawLine($thin, 21, 48, 43, 48)
      $graphics.DrawLine($thin, 25, 36, 39, 36)
      $graphics.DrawLine($thin, 28, 27, 36, 27)
    }
  }

  $pen.Dispose()
  $thin.Dispose()
  $graphics.Dispose()
  Save-Bitmap $bitmap $path
}

function Point([single]$x, [single]$y) {
  return [System.Drawing.PointF]::new($x, $y)
}

function New-DefaultPose([single]$phase) {
  $bob = [single](2 * [Math]::Sin($phase))
  return @{
    head = Point 160 (38 + $bob)
    neck = Point 160 (59 + $bob)
    leftShoulder = Point 140 (70 + $bob)
    rightShoulder = Point 180 (70 + $bob)
    leftElbow = Point 128 (105 + $bob)
    rightElbow = Point 192 (105 + $bob)
    leftWrist = Point 126 (140 + $bob)
    rightWrist = Point 194 (140 + $bob)
    leftHip = Point 147 (128 + $bob)
    rightHip = Point 173 (128 + $bob)
    leftKnee = Point 145 (178 + $bob)
    rightKnee = Point 176 (178 + $bob)
    leftAnkle = Point 143 (224 + $bob)
    rightAnkle = Point 179 (224 + $bob)
  }
}

function Set-Point($pose, [string]$name, [single]$x, [single]$y) {
  $pose[$name] = Point $x $y
}

function Get-Pose([string]$prefix, [int]$frame, [int]$count) {
  $phase = [single](2 * [Math]::PI * $frame / $count)
  $wave = [single][Math]::Sin($phase)
  $pose = New-DefaultPose $phase

  switch ($prefix) {
    "quad" {
      Set-Point $pose rightKnee 185 177
      Set-Point $pose rightAnkle (214 + 4 * $wave) 142
      Set-Point $pose rightWrist (211 + 4 * $wave) 142
      Set-Point $pose rightElbow 196 112
    }
    "hamstring" {
      Set-Point $pose head 181 75
      Set-Point $pose neck 170 90
      Set-Point $pose leftShoulder 153 97
      Set-Point $pose rightShoulder 178 100
      Set-Point $pose leftHip 145 135
      Set-Point $pose leftKnee 112 173
      Set-Point $pose leftAnkle 66 194
      Set-Point $pose rightKnee 180 174
      Set-Point $pose rightAnkle 194 220
    }
    "calf" {
      Set-Point $pose head 176 47
      Set-Point $pose leftHip 151 130
      Set-Point $pose rightHip 173 130
      Set-Point $pose leftKnee 120 171
      Set-Point $pose leftAnkle 74 211
      Set-Point $pose rightKnee 186 169
      Set-Point $pose rightAnkle 216 215
      Set-Point $pose leftWrist 217 105
      Set-Point $pose rightWrist 220 125
    }
    "hipflexor" {
      Set-Point $pose leftHip 146 129
      Set-Point $pose rightHip 173 129
      Set-Point $pose leftKnee 113 179
      Set-Point $pose leftAnkle 78 216
      Set-Point $pose rightKnee 185 185
      Set-Point $pose rightAnkle 209 215
    }
    "glute" {
      Set-Point $pose rightKnee 188 165
      Set-Point $pose rightAnkle (142 + 3 * $wave) 165
      Set-Point $pose rightWrist 170 165
      Set-Point $pose leftWrist 142 165
    }
    "sidelunge" {
      Set-Point $pose leftHip (142 - 16 * $wave) 135
      Set-Point $pose rightHip (174 - 16 * $wave) 135
      Set-Point $pose leftKnee (112 - 28 * $wave) 181
      Set-Point $pose leftAnkle (62 - 20 * $wave) 218
      Set-Point $pose rightKnee (203 - 14 * $wave) 181
      Set-Point $pose rightAnkle (252 - 10 * $wave) 218
    }
    "seated_hamstring" {
      Set-Point $pose head 165 88
      Set-Point $pose neck 157 103
      Set-Point $pose leftShoulder 143 112
      Set-Point $pose rightShoulder 169 115
      Set-Point $pose leftHip 143 157
      Set-Point $pose rightHip 165 157
      Set-Point $pose leftKnee 112 181
      Set-Point $pose leftAnkle 62 202
      Set-Point $pose rightKnee 198 181
      Set-Point $pose rightAnkle 248 202
      Set-Point $pose leftWrist (101 + 4 * $wave) 181
      Set-Point $pose rightWrist (125 + 4 * $wave) 178
    }
    "backtwist" {
      Set-Point $pose head 165 75
      Set-Point $pose neck 160 96
      Set-Point $pose leftHip 146 157
      Set-Point $pose rightHip 171 157
      Set-Point $pose leftKnee 113 184
      Set-Point $pose leftAnkle 70 205
      Set-Point $pose rightKnee 198 184
      Set-Point $pose rightAnkle 240 205
      Set-Point $pose leftWrist 190 130
      Set-Point $pose rightWrist 122 137
    }
    "shoulder" {
      Set-Point $pose leftElbow 181 91
      Set-Point $pose leftWrist 218 98
      Set-Point $pose rightElbow 175 112
      Set-Point $pose rightWrist 188 97
    }
    "chest" {
      Set-Point $pose leftElbow (105 - 3 * $wave) 82
      Set-Point $pose leftWrist (73 - 5 * $wave) 72
      Set-Point $pose rightElbow (215 + 3 * $wave) 82
      Set-Point $pose rightWrist (247 + 5 * $wave) 72
    }
    "neck" {
      Set-Point $pose head (153 + 3 * $wave) 39
      Set-Point $pose leftWrist 150 43
    }
    "triceps" {
      Set-Point $pose leftElbow 150 35
      Set-Point $pose leftWrist 174 62
      Set-Point $pose rightElbow 190 48
      Set-Point $pose rightWrist 156 37
    }
    "lat" {
      Set-Point $pose leftElbow 137 42
      Set-Point $pose leftWrist 112 24
      Set-Point $pose rightElbow 168 38
      Set-Point $pose rightWrist 142 24
    }
    "bicep" {
      Set-Point $pose leftElbow 111 90
      Set-Point $pose leftWrist 83 110
      Set-Point $pose rightElbow 209 90
      Set-Point $pose rightWrist 237 110
    }
    "wrist" {
      Set-Point $pose leftElbow 118 92
      Set-Point $pose leftWrist 75 92
      Set-Point $pose rightElbow 136 105
      Set-Point $pose rightWrist 78 100
    }
    "catcow" {
      Set-Point $pose head 216 (110 - 8 * $wave)
      Set-Point $pose neck 194 (119 - 6 * $wave)
      Set-Point $pose leftShoulder 180 (126 - 4 * $wave)
      Set-Point $pose rightShoulder 180 (126 - 4 * $wave)
      Set-Point $pose leftHip 118 (130 + 10 * $wave)
      Set-Point $pose rightHip 118 (130 + 10 * $wave)
      Set-Point $pose leftElbow 190 166
      Set-Point $pose rightElbow 190 166
      Set-Point $pose leftWrist 210 205
      Set-Point $pose rightWrist 210 205
      Set-Point $pose leftKnee 112 173
      Set-Point $pose rightKnee 112 173
      Set-Point $pose leftAnkle 91 205
      Set-Point $pose rightAnkle 91 205
    }
    "legswing" {
      Set-Point $pose leftKnee (146 + 18 * $wave) (178 - 20 * $wave)
      Set-Point $pose leftAnkle (143 + 65 * $wave) (224 - 48 * [Math]::Max(0, $wave))
    }
    "sidelegswing" {
      Set-Point $pose leftKnee (145 - 18 * $wave) (178 - 9 * [Math]::Abs($wave))
      Set-Point $pose leftAnkle (143 - 70 * $wave) (224 - 24 * [Math]::Abs($wave))
    }
    "walking_hamstring" {
      Set-Point $pose leftKnee (132 - 20 * $wave) (177 - 12 * $wave)
      Set-Point $pose leftAnkle (101 - 38 * $wave) (218 - 14 * $wave)
    }
    "hipcircle" {
      $offsetX = [single](10 * [Math]::Cos($phase))
      $offsetY = [single](6 * [Math]::Sin($phase))
      Set-Point $pose leftHip (147 + $offsetX) (128 + $offsetY)
      Set-Point $pose rightHip (173 + $offsetX) (128 + $offsetY)
    }
    "torsotwist" {
      Set-Point $pose leftElbow (122 + 20 * $wave) 103
      Set-Point $pose leftWrist (88 + 42 * $wave) 104
      Set-Point $pose rightElbow (198 - 20 * $wave) 103
      Set-Point $pose rightWrist (232 - 42 * $wave) 104
    }
    "armcircle" {
      Set-Point $pose leftElbow (140 + 40 * [Math]::Cos($phase)) (70 + 34 * [Math]::Sin($phase))
      Set-Point $pose leftWrist (140 + 72 * [Math]::Cos($phase)) (70 + 62 * [Math]::Sin($phase))
      Set-Point $pose rightElbow (180 - 40 * [Math]::Cos($phase)) (70 + 34 * [Math]::Sin($phase))
      Set-Point $pose rightWrist (180 - 72 * [Math]::Cos($phase)) (70 + 62 * [Math]::Sin($phase))
    }
    "ankle" {
      Set-Point $pose leftKnee 145 178
      Set-Point $pose leftAnkle (143 + 9 * [Math]::Cos($phase)) (224 + 5 * [Math]::Sin($phase))
    }
    "groin" {
      Set-Point $pose head 160 75
      Set-Point $pose neck 160 96
      Set-Point $pose leftHip 146 156
      Set-Point $pose rightHip 174 156
      Set-Point $pose leftKnee 98 186
      Set-Point $pose leftAnkle 145 202
      Set-Point $pose rightKnee 222 186
      Set-Point $pose rightAnkle 175 202
      Set-Point $pose leftWrist 133 197
      Set-Point $pose rightWrist 187 197
    }
  }

  return $pose
}

function Draw-Segment($graphics, $pose, [string]$a, [string]$b, [System.Drawing.Color]$color, [single]$width) {
  $from = $pose[$a]
  $to = $pose[$b]
  $glow = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(45, $color), $width + 8)
  $glow.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $glow.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawLine($glow, $from.X, $from.Y, $to.X, $to.Y)
  $glow.Dispose()

  $pen = [System.Drawing.Pen]::new($color, $width)
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawLine($pen, $from.X, $from.Y, $to.X, $to.Y)
  $pen.Dispose()
}

function Draw-AthleteSegment($graphics, $pose, [string]$a, [string]$b, [System.Drawing.Color]$color, [single]$width, [int]$alpha) {
  $from = $pose[$a]
  $to = $pose[$b]

  $shadow = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(42, 25, 45, 22), $width + 8)
  $shadow.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $shadow.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawLine($shadow, $from.X, $from.Y + 2, $to.X, $to.Y + 2)
  $shadow.Dispose()

  $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb($alpha, $color), $width)
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawLine($pen, $from.X, $from.Y, $to.X, $to.Y)
  $pen.Dispose()
}

function Draw-AthleteTorso($graphics, $pose) {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $path.StartFigure()
  $path.AddLine($pose.leftShoulder.X, $pose.leftShoulder.Y, $pose.rightShoulder.X, $pose.rightShoulder.Y)
  $path.AddLine($pose.rightShoulder.X, $pose.rightShoulder.Y, $pose.rightHip.X, $pose.rightHip.Y)
  $path.AddLine($pose.rightHip.X, $pose.rightHip.Y, $pose.leftHip.X, $pose.leftHip.Y)
  $path.AddLine($pose.leftHip.X, $pose.leftHip.Y, $pose.leftShoulder.X, $pose.leftShoulder.Y)
  $path.CloseFigure()

  $shadowMatrix = [System.Drawing.Drawing2D.Matrix]::new()
  $shadowMatrix.Translate(0, 2)
  $shadowPath = $path.Clone()
  $shadowPath.Transform($shadowMatrix)
  $shadow = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(42, 25, 45, 22))
  $graphics.FillPath($shadow, $shadowPath)
  $shadow.Dispose()
  $shadowPath.Dispose()
  $shadowMatrix.Dispose()

  $torsoBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.RectangleF]::new(120, 92, 80, 72),
    [System.Drawing.Color]::FromArgb(255, 194, 255, 70),
    [System.Drawing.Color]::FromArgb(255, 128, 224, 46),
    [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
  )
  $graphics.FillPath($torsoBrush, $path)
  $torsoBrush.Dispose()
  $path.Dispose()
}

function Draw-AthleteHead($graphics, $pose) {
  $headGlow = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(48, $lime))
  $graphics.FillEllipse($headGlow, $pose.head.X - 18, $pose.head.Y - 18, 36, 36)
  $headGlow.Dispose()

  $head = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.RectangleF]::new($pose.head.X - 12, $pose.head.Y - 12, 24, 24),
    [System.Drawing.Color]::FromArgb(255, 210, 255, 67),
    [System.Drawing.Color]::FromArgb(255, 155, 236, 45),
    [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
  )
  $graphics.FillEllipse($head, $pose.head.X - 12, $pose.head.Y - 12, 24, 24)
  $head.Dispose()
}

function Draw-MusclePulse($graphics, $pose, [string]$a, [string]$b, [int]$frame, [int]$count) {
  $from = $pose[$a]
  $to = $pose[$b]
  $phase = 2 * [Math]::PI * $frame / [Math]::Max(1, $count)
  $pulse = ([Math]::Sin($phase) + 1) / 2
  $width = [single](13 + 5 * $pulse)
  $alpha = [int](165 + 70 * $pulse)

  $halo = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb([int](48 + 42 * $pulse), 255, 145, 22), $width + 10)
  $halo.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $halo.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawLine($halo, $from.X, $from.Y, $to.X, $to.Y)
  $halo.Dispose()

  $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb($alpha, 255, 134, 24), $width)
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawLine($pen, $from.X, $from.Y, $to.X, $to.Y)
  $pen.Dispose()

  $hotspotX = [single]($from.X + (($to.X - $from.X) * (0.38 + 0.24 * $pulse)))
  $hotspotY = [single]($from.Y + (($to.Y - $from.Y) * (0.38 + 0.24 * $pulse)))
  $hotspot = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb([int](78 + 70 * $pulse), 255, 226, 113))
  $graphics.FillEllipse($hotspot, $hotspotX - 5, $hotspotY - 5, 10, 10)
  $hotspot.Dispose()
}

function Draw-AnimationFrame([string]$path, [string]$prefix, [int]$frame, [int]$count) {
  $bitmap = New-Bitmap 320 240
  $graphics = New-Graphics $bitmap
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $pose = Get-Pose $prefix $frame $count

  $segments = @(
    @("neck", "leftShoulder"), @("neck", "rightShoulder"),
    @("leftShoulder", "rightShoulder"), @("leftShoulder", "leftElbow"),
    @("leftElbow", "leftWrist"), @("rightShoulder", "rightElbow"),
    @("rightElbow", "rightWrist"), @("neck", "leftHip"),
    @("neck", "rightHip"), @("leftHip", "rightHip"),
    @("leftHip", "leftKnee"), @("leftKnee", "leftAnkle"),
    @("rightHip", "rightKnee"), @("rightKnee", "rightAnkle")
  )

  Draw-AthleteTorso $graphics $pose
  foreach ($segment in $segments) {
    Draw-AthleteSegment $graphics $pose $segment[0] $segment[1] $lime 11 245
  }

  $highlightSegments = switch ($prefix) {
    { $_ -in @("quad", "legswing") } { @(@("rightHip", "rightKnee")); break }
    { $_ -in @("hamstring", "seated_hamstring", "walking_hamstring") } { @(@("leftHip", "leftKnee")); break }
    "calf" { @(@("leftKnee", "leftAnkle")); break }
    { $_ -in @("hipflexor", "glute", "hipcircle", "sidelunge", "groin", "sidelegswing") } { @(@("leftHip", "leftKnee"), @("rightHip", "rightKnee")); break }
    { $_ -in @("shoulder", "chest", "triceps", "lat", "bicep", "wrist", "armcircle") } { @(@("leftShoulder", "leftElbow"), @("rightShoulder", "rightElbow")); break }
    default { @(@("neck", "leftHip"), @("neck", "rightHip")) }
  }
  foreach ($segment in $highlightSegments) {
    Draw-MusclePulse $graphics $pose $segment[0] $segment[1] $frame $count
  }

  Draw-AthleteHead $graphics $pose

  $graphics.Dispose()
  Save-Bitmap $bitmap $path
}

function Generate-UiAssets([string]$target, [int]$screenWidth, [int]$screenHeight) {
  $assetRoot = Join-Path $root "assets\$target"
  $categoryIconSize = if ($target -eq "gt.r") { 32 } else { 24 }
  $sportIconSize = if ($target -eq "gt.r") { 42 } else { 38 }
  $cardWidth = if ($target -eq "gt.r") { 168 } else { 148 }
  $cardHeight = if ($target -eq "gt.r") { 88 } else { 80 }
  $rowWidth = if ($target -eq "gt.r") { 432 } else { 362 }
  $rowHeight = if ($target -eq "gt.r") { 64 } else { 60 }
  Draw-FitnessBackground (Join-Path $assetRoot "bg.png") $screenWidth $screenHeight
  Resize-Cover $IconSource (Join-Path $assetRoot "icon.png") 256 256

  Draw-CircleIcon (Join-Path $assetRoot "ask.png") 64 "help" $fitnessGreen
  Draw-CircleIcon (Join-Path $assetRoot "btn_pause_red.png") 50 "pause" $fitnessRed
  Draw-CircleIcon (Join-Path $assetRoot "icon_complete.png") 80 "check" $fitnessGreen
  Draw-CircleIcon (Join-Path $assetRoot "icon_stop.png") 80 "stop" $fitnessRed
  Draw-Arrow (Join-Path $assetRoot "btn_prev.png") $false
  Draw-Arrow (Join-Path $assetRoot "btn_next.png") $true

  Draw-FitnessButton (Join-Path $assetRoot "btn_start.png") 200 60 "START" "primary"
  Draw-FitnessButton (Join-Path $assetRoot "btn_safety.png") 200 60 "GUIDE" "secondary"
  Draw-FitnessButton (Join-Path $assetRoot "btn_settings.png") 200 60 "VIBRATION" "secondary"
  Draw-FitnessButton (Join-Path $assetRoot "btn_ok.png") 120 50 "OK" "primary"
  Draw-FitnessButton (Join-Path $assetRoot "btn_home.png") 140 55 "HOME" "secondary"
  Draw-FitnessButton (Join-Path $assetRoot "btn_back.png") 100 50 "BACK" "secondary"
  Draw-FitnessButton (Join-Path $assetRoot "btn_resume_green.png") 100 50 "RESUME" "primary"
  Draw-FitnessButton (Join-Path $assetRoot "btn_skip.png") 100 50 "SKIP" "secondary"
  Draw-FitnessButton (Join-Path $assetRoot "btn_end.png") 100 50 "END" "danger"
  Draw-ProgressCard (Join-Path $assetRoot "card_progress.png") $cardWidth $cardHeight
  Draw-TrendCard (Join-Path $assetRoot "card_trend.png") $cardWidth $cardHeight
  Draw-SelectRowCard (Join-Path $assetRoot "row_card.png") $rowWidth $rowHeight

  Draw-SportIcon (Join-Path $assetRoot "cat_cardio.png") "cardio" $fitnessGreen $categoryIconSize
  Draw-SportIcon (Join-Path $assetRoot "cat_strength.png") "strength" $fitnessGreen $categoryIconSize
  Draw-SportIcon (Join-Path $assetRoot "cat_ball.png") "ball" $fitnessGreen $categoryIconSize
  Draw-SportIcon (Join-Path $assetRoot "sport_run.png") "run" $fitnessGreen $sportIconSize
  Draw-SportIcon (Join-Path $assetRoot "sport_cycle.png") "cycle" $fitnessGreen $sportIconSize
  Draw-SportIcon (Join-Path $assetRoot "sport_strength.png") "strength" $fitnessGreen $sportIconSize
  Draw-SportIcon (Join-Path $assetRoot "sport_bodyweight.png") "bodyweight" $fitnessGreen $sportIconSize
  Draw-SportIcon (Join-Path $assetRoot "sport_basketball.png") "basketball" $fitnessGreen $sportIconSize
  Draw-SportIcon (Join-Path $assetRoot "sport_soccer.png") "soccer" $fitnessGreen $sportIconSize
  Draw-SportIcon (Join-Path $assetRoot "sport_tennis.png") "tennis" $fitnessGreen $sportIconSize
  Draw-SportIcon (Join-Path $assetRoot "sport_badminton.png") "badminton" $fitnessGreen $sportIconSize
}

$animations = @{
  quad = 8; hamstring = 4; calf = 4; hipflexor = 4; glute = 4; sidelunge = 6
  seated_hamstring = 4; backtwist = 4; shoulder = 4; chest = 4; neck = 4
  triceps = 4; lat = 4; bicep = 4; wrist = 4; catcow = 6; legswing = 6
  sidelegswing = 6; walking_hamstring = 6; hipcircle = 6; torsotwist = 6
  armcircle = 6; ankle = 4; groin = 4
}

Generate-UiAssets "gt.r" 480 480
Generate-UiAssets "gt.s" 390 450
Resize-Cover $IconSource (Join-Path $root "icon.png") 256 256

& (Join-Path $PSScriptRoot "generate-b-style-animations.ps1") -AssetRoot (Join-Path $root "assets")

Write-Host "Generated formal UI assets and $($animations.Values | Measure-Object -Sum | Select-Object -ExpandProperty Sum) frames per screen target."
