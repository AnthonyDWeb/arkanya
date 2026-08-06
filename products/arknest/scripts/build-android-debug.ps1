$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$androidDir = Join-Path $root "android"

if (-not $env:JAVA_HOME) {
  $studioJdk = "C:\Program Files\Android\Android Studio\jbr"
  if (Test-Path -LiteralPath $studioJdk) { $env:JAVA_HOME = $studioJdk }
}
if (-not $env:ANDROID_HOME) {
  $localSdk = Join-Path $env:LOCALAPPDATA "Android\Sdk"
  if (Test-Path -LiteralPath $localSdk) { $env:ANDROID_HOME = $localSdk }
}
if ($env:JAVA_HOME) { $env:Path = "$env:JAVA_HOME\bin;$env:Path" }
if ($env:ANDROID_HOME) {
  $sdkPath = $env:ANDROID_HOME.Replace("\", "\\")
  Set-Content -Path (Join-Path $androidDir "local.properties") -Value "sdk.dir=$sdkPath" -Encoding ASCII
}

$downloadDir = Join-Path $root "public\downloads"
$publicApk = Join-Path $downloadDir "arknest.apk"
$tempApk = Join-Path ([System.IO.Path]::GetTempPath()) "arknest-debug-previous-$([guid]::NewGuid()).apk"
$hadPreviousApk = Test-Path -LiteralPath $publicApk
if ($hadPreviousApk) { Move-Item -LiteralPath $publicApk -Destination $tempApk -Force }

try {
  pnpm run build
  if ($LASTEXITCODE -ne 0) { throw "Le build Next a echoue avec le code $LASTEXITCODE." }
  pnpm exec cap sync android
  if ($LASTEXITCODE -ne 0) { throw "La synchronisation Capacitor a echoue avec le code $LASTEXITCODE." }
  Push-Location $androidDir
  try {
    .\gradlew.bat assembleDebug
    if ($LASTEXITCODE -ne 0) { throw "L'assemblage Gradle a echoue avec le code $LASTEXITCODE." }
  }
  finally { Pop-Location }

  $apkPath = Join-Path $androidDir "app\build\outputs\apk\debug\app-debug.apk"
  if (-not (Test-Path -LiteralPath $apkPath)) { throw "Gradle n'a pas produit l'APK attendu." }
  New-Item -ItemType Directory -Force -Path $downloadDir | Out-Null
  Copy-Item -LiteralPath $apkPath -Destination $publicApk -Force
  if (Test-Path -LiteralPath $tempApk) { Remove-Item -LiteralPath $tempApk -Force }
  Write-Host "APK de test publiee : $publicApk"
}
catch {
  if ($hadPreviousApk -and (Test-Path -LiteralPath $tempApk)) {
    Move-Item -LiteralPath $tempApk -Destination $publicApk -Force
  }
  throw
}
