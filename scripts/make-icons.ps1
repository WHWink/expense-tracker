# Generate PWA icons (indigo square + glyph). Rerun after changing colors:
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/make-icons.ps1
Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot '..\public\icons'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

# U+8BB0 is the CJK glyph drawn on the icon
$glyph = [string][char]0x8BB0

function New-Icon {
  param([int]$Size, [string]$Path)
  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $bg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 79, 70, 229))
  $g.FillRectangle($bg, 0, 0, $Size, $Size)

  $fontSize = [int]($Size * 0.62)
  $font = New-Object System.Drawing.Font ('Microsoft YaHei', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
  $layout = New-Object System.Drawing.RectangleF (0, 0, $Size, $Size)
  $g.DrawString($glyph, $font, [System.Drawing.Brushes]::White, $layout, $sf)

  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  Write-Host "OK $Path"
}

New-Icon -Size 192 -Path (Join-Path $outDir 'icon-192.png')
New-Icon -Size 512 -Path (Join-Path $outDir 'icon-512.png')
