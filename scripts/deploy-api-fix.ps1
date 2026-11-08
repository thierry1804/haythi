$ErrorActionPreference = 'Stop'
$Remote = 'ubuntu@148.113.46.75'
$Root = Split-Path -Parent $PSScriptRoot
$ServerDir = Join-Path $Root 'server'
$StageDir = Join-Path $env:TEMP 'haythi-api-fix'
$gitBash = @('C:\Program Files\Git\bin\bash.exe','C:\Program Files (x86)\Git\bin\bash.exe') | Where-Object { Test-Path $_ } | Select-Object -First 1

if (Test-Path $StageDir) { Remove-Item -Recurse -Force $StageDir }
New-Item -ItemType Directory -Path (Join-Path $StageDir 'src') | Out-Null
Copy-Item (Join-Path $ServerDir 'src\*') (Join-Path $StageDir 'src\')

$go = @'
#!/usr/bin/env bash
set -euo pipefail
BASE="$(cd "$(dirname "$0")" && pwd)"
sudo mkdir -p /opt/haythi-api/src /opt/haythi-api/data
sudo cp -a "$BASE/src/." /opt/haythi-api/src/
# reset quotas/rate counters + permissions
sudo rm -f /opt/haythi-api/data/quota.json
sudo touch /opt/haythi-api/data/quota.json
echo '{"day":"","month":"","dayCount":0,"monthCount":0,"byEmail":{},"byIp":{}}' | sudo tee /opt/haythi-api/data/quota.json >/dev/null
# bump env limits if present
if [ -f /opt/haythi-api/.env ]; then
  sudo sed -i 's/^IP_HOUR_MAX=.*/IP_HOUR_MAX=10/' /opt/haythi-api/.env || true
  sudo sed -i 's/^IP_DAY_MAX=.*/IP_DAY_MAX=20/' /opt/haythi-api/.env || true
  grep -q '^IP_HOUR_MAX=' /opt/haythi-api/.env || echo 'IP_HOUR_MAX=10' | sudo tee -a /opt/haythi-api/.env >/dev/null
  grep -q '^IP_DAY_MAX=' /opt/haythi-api/.env || echo 'IP_DAY_MAX=20' | sudo tee -a /opt/haythi-api/.env >/dev/null
fi
sudo chown -R www-data:www-data /opt/haythi-api
sudo chmod 750 /opt/haythi-api/data
sudo chmod 640 /opt/haythi-api/data/quota.json /opt/haythi-api/.env
# Forward vrai IP Cloudflare vers Node
for SITE in /etc/apache2/sites-available/000-default-le-ssl.conf /etc/apache2/sites-available/000-default.conf; do
  if [ -f "$SITE" ] && sudo grep -q 'api/contact' "$SITE"; then
    if ! sudo grep -q 'CF-Connecting-IP' "$SITE"; then
      sudo sed -i '/Location "\/api\/contact"/,/<\/Location>/ s/RequestHeader set X-Forwarded-Proto "https" env=HTTPS/RequestHeader set X-Forwarded-Proto "https" env=HTTPS\n        RequestHeader set X-Real-IP %{REMOTE_ADDR}s\n        RequestHeader set CF-Connecting-IP %{HTTP:CF-Connecting-IP}e/' "$SITE" || true
    fi
  fi
done
sudo apache2ctl configtest && sudo systemctl reload apache2 || true

sudo systemctl restart haythi-contact
sleep 2
echo "=== status ==="
sudo systemctl --no-pager --full status haythi-contact | head -n 20
echo "=== health ==="
curl -fsS http://127.0.0.1:8787/healthz; echo
echo "=== local post ==="
curl -sS -w "\nHTTP:%{http_code}\n" -X POST http://127.0.0.1:8787/api/contact \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://haythi.mg' \
  -H 'CF-Connecting-IP: 203.0.113.50' \
  --data '{"name":"Fix Probe","company":"Haythi","email":"mahefa75+fix'$(date +%s)'@gmail.com","subject":"consulting","message":"Post-fix probe after quota reset and IP limit bump.","website":"","startedAt":'$(($(date +%s%3N)-9000))',"lang":"FR"}'
echo
echo "=== journal ==="
sudo journalctl -u haythi-contact -n 30 --no-pager
rm -rf "$BASE"
echo DONE
'@
[IO.File]::WriteAllText((Join-Path $StageDir 'go.sh'), ($go -replace "`r`n","`n" -replace "`r","`n"))
$stagePosix = $StageDir -replace '\\','/'
if ($stagePosix -match '^[A-Za-z]:') { $stagePosix = '/' + $stagePosix.Substring(0,1).ToLowerInvariant() + $stagePosix.Substring(2) }

Write-Host '=== Deploy API fix (1x mdp) ===' -ForegroundColor Cyan
& $gitBash -lc "tar -czf - -C '$stagePosix' . | ssh -o StrictHostKeyChecking=accept-new $Remote 'rm -rf /tmp/haythi-api-fix && mkdir -p /tmp/haythi-api-fix && tar -xzf - -C /tmp/haythi-api-fix && bash /tmp/haythi-api-fix/go.sh'"
$code = $LASTEXITCODE
Remove-Item -Recurse -Force $StageDir -EA SilentlyContinue
if ($code -ne 0) { throw "deploy echoue ($code)" }
Write-Host 'OK' -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
