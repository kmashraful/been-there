<#
resize-photo.ps1 · Been There

Resize one photo to a web-friendly JPEG using the .NET System.Drawing
library that ships with Windows. No installs required.

Usage (from the project root):
  powershell -File tools\resize-photo.ps1 -In "images_and_descrip\San_Francisco\goldengate.JPG" -Out "images\san-francisco\golden-gate.jpg"

Optional parameters:
  -MaxEdge 1600   longest side of the output in pixels (default 1600)
  -Quality 80     JPEG quality, 1 to 100 (default 80)

The script applies EXIF rotation so phone photos come out upright,
creates the output folder if it does not exist, and strips metadata
(the resized copy carries no EXIF, including GPS location).
#>

param(
  [Parameter(Mandatory = $true)][string]$In,
  [Parameter(Mandatory = $true)][string]$Out,
  [int]$MaxEdge = 1600,
  [int]$Quality = 80
)

Add-Type -AssemblyName System.Drawing

# .NET resolves relative paths against the process directory, not the
# PowerShell location, so make both paths absolute up front.
$inPath = (Resolve-Path $In).Path
if (-not [System.IO.Path]::IsPathRooted($Out)) {
  $Out = Join-Path (Get-Location).Path $Out
}

$img = [System.Drawing.Image]::FromFile($inPath)
try {
  # EXIF orientation tag is property 274
  if ($img.PropertyIdList -contains 274) {
    switch ($img.GetPropertyItem(274).Value[0]) {
      3 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
      6 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
      8 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
    }
  }

  $scale = [Math]::Min(1.0, $MaxEdge / [double][Math]::Max($img.Width, $img.Height))
  $w = [Math]::Max(1, [int][Math]::Round($img.Width * $scale))
  $h = [Math]::Max(1, [int][Math]::Round($img.Height * $scale))

  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $gfx = [System.Drawing.Graphics]::FromImage($bmp)
  try {
    $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gfx.DrawImage($img, 0, 0, $w, $h)

    $dir = Split-Path -Parent $Out
    if ($dir -and -not (Test-Path $dir)) {
      New-Item -ItemType Directory -Force $dir | Out-Null
    }

    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
             Where-Object { $_.MimeType -eq "image/jpeg" }
    $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
      [System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
    $bmp.Save($Out, $codec, $ep)
  }
  finally {
    $gfx.Dispose()
    $bmp.Dispose()
  }
}
finally {
  $img.Dispose()
}

$kb = [Math]::Round((Get-Item $Out).Length / 1KB)
Write-Output ("{0}  ->  {1}  ({2}x{3}, {4} KB)" -f $inPath, $Out, $w, $h, $kb)
