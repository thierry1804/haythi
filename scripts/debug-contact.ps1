$ErrorActionPreference = 'Stop'
$Remote = 'ubuntu@148.113.46.75'
$gitBash = @('C:\Program Files\Git\bin\bash.exe','C:\Program Files (x86)\Git\bin\bash.exe') | Where-Object { Test-Path $_ } | Select-Object -First 1
$script = @'
set -euo pipefail
echo "=== service ==="
sudo systemctl is-active haythi-contact || true
curl -sS http://127.0.0.1:8787/healthz || echo HEALTH_FAIL
echo
echo "=== journal last 50 ==="
sudo journalctl -u haythi-contact -n 50 --no-pager || true
echo "=== files api ==="
ls -la /opt/haythi-api/src/
test -f /opt/haythi-api/src/ackEmail.js && echo HAS_ACK || echo NO_ACK
echo "=== .env keys (no secrets) ==="
sudo grep -E '^[A-Z_]+=' /opt/haythi-api/.env | sed -E 's/(KEY|SECRET)=.*/\1=***/' || true
echo "=== quota ==="
sudo cat /opt/haythi-api/data/quota.json 2>/dev/null || echo no_quota
echo "=== apache error tail ==="
sudo tail -n 30 /var/log/apache2/error.log 2>/dev/null || true
echo "=== local POST via node ==="
curl -sS -w "\nHTTP:%{http_code}\n" -X POST http://127.0.0.1:8787/api/contact \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://haythi.mg' \
  -H 'Referer: https://haythi.mg/#contact' \
  --data '{"name":"Debug Server","company":"Haythi","email":"debug-server-'$(date +%s)'@example.com","subject":"consulting","message":"Debug from server local curl after user error.","website":"","startedAt":'$(($(date +%s%3N)-8000))',"lang":"FR"}' || true
echo "=== local POST via apache Host haythi.mg ==="
curl -sS -w "\nHTTP:%{http_code}\n" -X POST http://127.0.0.1/api/contact \
  -H 'Content-Type: application/json' \
  -H 'Host: haythi.mg' \
  -H 'Origin: https://haythi.mg' \
  -H 'Referer: https://haythi.mg/#contact' \
  --data '{"name":"Debug Apache","company":"Haythi","email":"debug-apache-'$(date +%s)'@example.com","subject":"consulting","message":"Debug via apache vhost proxy.","website":"","startedAt":'$(($(date +%s%3N)-8000))',"lang":"FR"}' || true
echo "=== index asset hash ==="
grep -o 'assets/[^"]*' /var/www/html/index.html || true
ls -la /var/www/html/assets/ | head
echo "=== apache Location contact ==="
sudo grep -A8 'api/contact' /etc/apache2/sites-enabled/000-default-le-ssl.conf || true
'@
$tmp = Join-Path $env:TEMP 'haythi-debug-contact.sh'
[IO.File]::WriteAllText($tmp, ($script -replace "`r`n","`n" -replace "`r","`n"))
$posix = ($tmp -replace '\\','/')
if ($posix -match '^[A-Za-z]:') { $posix = '/' + $posix.Substring(0,1).ToLowerInvariant() + $posix.Substring(2) }
Write-Host 'mdp SSH 1x...' -ForegroundColor Yellow
& $gitBash -lc "ssh -t -o StrictHostKeyChecking=accept-new $Remote 'bash -s' < '$posix'"
$code = $LASTEXITCODE
Remove-Item $tmp -Force -EA SilentlyContinue
if ($code -ne 0) { throw "debug echoue ($code)" }
Write-Host 'DONE' -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
