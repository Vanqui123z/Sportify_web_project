$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$htmlPath = Join-Path $currentDir "src\test.html"
Write-Host "Mở file $htmlPath"
Start-Process $htmlPath