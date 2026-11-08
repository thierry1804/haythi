$ErrorActionPreference = 'Stop'
$Remote = 'ubuntu@148.113.46.75'
$Root = Split-Path -Parent $PSScriptRoot
$ServerDir = Join-Path $Root 'server'
$StageDir = Join-Path $env:TEMP 'haythi-api-only'
$gitBash = @('C:\Program Files\Git\bin\bash.exe','C:\Program Files (x86)\Git\bin\bash.exe') | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $gitBash) { throw 'Git Bash introuvable' }

if (Test-Path $StageDir) { Remove-Item -Recurse -Force $StageDir }
New-Item -ItemType Directory -Path (Join-Path $StageDir 'src') | Out-Null
New-Item -ItemType Directory -Path (Join-Path $StageDir 'deploy') | Out-Null
Copy-Item (Join-Path $ServerDir 'src\*') (Join-Path $StageDir 'src\')
Copy-Item (Join-Path $ServerDir 'deploy\haythi-contact.service') (Join-Path $StageDir 'deploy\')
Copy-Item (Join-Path $ServerDir '.env.example') $StageDir -EA SilentlyContinue

$go = @'
#!/usr/bin/env bash
set -euo pipefail
BASE="$(cd "$(dirname "$0")" && pwd)"
sudo mkdir -p /opt/haythi-api/src /opt/haythi-api/data
sudo cp -a "$BASE/src/." /opt/haythi-api/src/
sudo cp "$BASE/deploy/haythi-contact.service" /etc/systemd/system/haythi-contact.service
# Ajoute quotas dans .env si absents
if [ -f /opt/haythi-api/.env ]; then
  grep -q '^DAILY_SEND_LIMIT=' /opt/haythi-api/.env || echo 'DAILY_SEND_LIMIT=80' | sudo tee -a /opt/haythi-api/.env >/dev/null
  grep -q '^MONTHLY_SEND_LIMIT=' /opt/haythi-api/.env || echo 'MONTHLY_SEND_LIMIT=2500' | sudo tee -a /opt/haythi-api/.env >/dev/null
  grep -q '^EMAIL_COOLDOWN_MS=' /opt/haythi-api/.env || echo 'EMAIL_COOLDOWN_MS=3600000' | sudo tee -a /opt/haythi-api/.env >/dev/null
  grep -q '^IP_HOUR_MAX=' /opt/haythi-api/.env || echo 'IP_HOUR_MAX=3' | sudo tee -a /opt/haythi-api/.env >/dev/null
  grep -q '^IP_DAY_MAX=' /opt/haythi-api/.env || echo 'IP_DAY_MAX=8' | sudo tee -a /opt/haythi-api/.env >/dev/null
fi
sudo chown -R www-data:www-data /opt/haythi-api
sudo systemctl daemon-reload
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

Write-Host '=== Deploy API quotas/antispam (1x mdp SSH) ===' -ForegroundColor Cyan
& $gitBash -lc "tar -czf - -C '$stagePosix' . | ssh -o StrictHostKeyChecking=accept-new $Remote 'rm -rf /tmp/haythi-api-patch && mkdir -p /tmp/haythi-api-patch && tar -xzf - -C /tmp/haythi-api-patch && bash /tmp/haythi-api-patch/go.sh'"
$code = $LASTEXITCODE
Remove-Item -Recurse -Force $StageDir -EA SilentlyContinue
if ($code -ne 0) { throw "deploy echoue ($code)" }
Write-Host 'OK' -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
