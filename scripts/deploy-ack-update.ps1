$ErrorActionPreference = 'Stop'
$Remote = 'ubuntu@148.113.46.75'
$Root = Split-Path -Parent $PSScriptRoot
$ServerDir = Join-Path $Root 'server'
$DistDir = Join-Path $Root 'dist'
$StageDir = Join-Path $env:TEMP 'haythi-ack-stage'
$gitBash = @('C:\Program Files\Git\bin\bash.exe','C:\Program Files (x86)\Git\bin\bash.exe') | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $gitBash) { throw 'Git Bash introuvable' }
if (-not (Test-Path (Join-Path $DistDir 'index.html'))) { throw 'dist manquant' }

if (Test-Path $StageDir) { Remove-Item -Recurse -Force $StageDir }
New-Item -ItemType Directory -Path (Join-Path $StageDir 'src') | Out-Null
New-Item -ItemType Directory -Path (Join-Path $StageDir 'dist') | Out-Null
Copy-Item (Join-Path $ServerDir 'src\*') (Join-Path $StageDir 'src\')
Copy-Item "$DistDir\*" (Join-Path $StageDir 'dist\') -Recurse

$go = @'
#!/usr/bin/env bash
set -euo pipefail
BASE="$(cd "$(dirname "$0")" && pwd)"
sudo cp -a "$BASE/src/." /opt/haythi-api/src/
sudo rsync -a "$BASE/dist/" /var/www/html/
sudo chown -R www-data:www-data /opt/haythi-api
sudo systemctl restart haythi-contact
sleep 1
curl -fsS http://127.0.0.1:8787/healthz; echo
sudo systemctl is-active haythi-contact
rm -rf "$BASE"
echo DONE
'@
[IO.File]::WriteAllText((Join-Path $StageDir 'go.sh'), ($go -replace "`r`n","`n" -replace "`r","`n"))

$stagePosix = $StageDir -replace '\\','/'
if ($stagePosix -match '^[A-Za-z]:') {
  $stagePosix = '/' + $stagePosix.Substring(0,1).ToLowerInvariant() + $stagePosix.Substring(2)
}

Write-Host '=== Deploy ack FR/EN + template (1x mdp) ===' -ForegroundColor Cyan
& $gitBash -lc "tar -czf - -C '$stagePosix' . | ssh -o StrictHostKeyChecking=accept-new $Remote 'rm -rf /tmp/haythi-ack && mkdir -p /tmp/haythi-ack && tar -xzf - -C /tmp/haythi-ack && bash /tmp/haythi-ack/go.sh'"
$code = $LASTEXITCODE
Remove-Item -Recurse -Force $StageDir -EA SilentlyContinue
if ($code -ne 0) { throw "deploy echoue ($code)" }
Write-Host 'OK' -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
