$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$source = Join-Path $root "public\icon-512.png"
$res = Join-Path $root "android\app\src\main\res"

Add-Type -AssemblyName System.Drawing

$sizes = @{
  "mipmap-mdpi" = 48
  "mipmap-hdpi" = 72
  "mipmap-xhdpi" = 96
  "mipmap-xxhdpi" = 144
  "mipmap-xxxhdpi" = 192
}

$image = [System.Drawing.Image]::FromFile($source)
try {
  foreach ($entry in $sizes.GetEnumerator()) {
    $dir = Join-Path $res $entry.Key
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    $bitmap = New-Object System.Drawing.Bitmap($entry.Value, $entry.Value)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.DrawImage($image, 0, 0, $entry.Value, $entry.Value)
      $bitmap.Save((Join-Path $dir "arknest_icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
      $graphics.Dispose()
      $bitmap.Dispose()
    }
  }
}
finally {
  $image.Dispose()
}
