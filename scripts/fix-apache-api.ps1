$ErrorActionPreference = 'Stop'
$Remote = 'ubuntu@148.113.46.75'
$gitBash = @('C:\Program Files\Git\bin\bash.exe','C:\Program Files (x86)\Git\bin\bash.exe') | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $gitBash) { throw 'Git Bash introuvable' }

$script = @'
set -euo pipefail

echo "[0] revive API"
sudo systemctl enable haythi-contact >/dev/null 2>&1 || true
sudo systemctl restart haythi-contact || true
sleep 2
sudo systemctl --no-pager --full status haythi-contact || true
echo "--- journal ---"
sudo journalctl -u haythi-contact -n 40 --no-pager || true

if ! curl -fsS http://127.0.0.1:8787/healthz >/dev/null 2>&1; then
  echo "API encore down — start manuel"
  if [ -f /opt/haythi-api/src/index.js ]; then
    ls -la /opt/haythi-api
    ls -la /opt/haythi-api/.env || echo "NO .env"
    # test run foreground 3s
    sudo -u www-data bash -c 'cd /opt/haythi-api && timeout 3 node src/index.js' || true
  else
    echo "MANQUE /opt/haythi-api"
    exit 2
  fi
  sudo systemctl restart haythi-contact || true
  sleep 2
fi

curl -fsS http://127.0.0.1:8787/healthz
echo

echo "[1] modules proxy"
sudo a2enmod proxy proxy_http headers >/dev/null
sudo systemctl restart apache2

for SITE in /etc/apache2/sites-available/000-default-le-ssl.conf /etc/apache2/sites-available/000-default.conf; do
  [ -f "$SITE" ] || continue
  echo "[2] patch $SITE"
  if sudo grep -q '127.0.0.1:8787/api/contact' "$SITE"; then
    echo "  deja present"
    continue
  fi
  sudo cp "$SITE" "$SITE.bak.haythi.$(date +%s)"
  sudo python3 - "$SITE" <<'PY'
from pathlib import Path
import sys
path = Path(sys.argv[1])
text = path.read_text()
snippet = """
    # HAYTHI contact API (Node/Resend)
    ProxyPreserveHost On
    ProxyRequests Off
    <Location \"/api/contact\">
        ProxyPass http://127.0.0.1:8787/api/contact
        ProxyPassReverse http://127.0.0.1:8787/api/contact
        RequestHeader set X-Forwarded-Proto \"https\" env=HTTPS
        LimitRequestBody 16384
    </Location>
"""
if '127.0.0.1:8787/api/contact' in text:
    print('already present')
    raise SystemExit(0)
marker = '</VirtualHost>'
idx = text.rfind(marker)
if idx < 0:
    raise SystemExit('no VirtualHost end in ' + str(path))
path.write_text(text[:idx] + snippet + '\n' + text[idx:])
print('inserted')
PY
done

echo "[3] apachectl configtest"
sudo apache2ctl configtest
sudo systemctl reload apache2

echo "[4] recheck API"
curl -fsS http://127.0.0.1:8787/healthz; echo
sudo systemctl is-active haythi-contact
echo DONE
'@

$tmp = Join-Path $env:TEMP 'haythi-fix-apache.sh'
[IO.File]::WriteAllText($tmp, ($script -replace "`r`n","`n" -replace "`r","`n"))
$posix = ($tmp -replace '\\','/')
if ($posix -match '^[A-Za-z]:') { $posix = '/' + $posix.Substring(0,1).ToLowerInvariant() + $posix.Substring(2) }

Write-Host 'Mot de passe SSH une fois...' -ForegroundColor Yellow
& $gitBash -lc "ssh -t -o StrictHostKeyChecking=accept-new $Remote 'bash -s' < '$posix'"
$code = $LASTEXITCODE
Remove-Item $tmp -Force -EA SilentlyContinue
if ($code -ne 0) { throw "fix echoue ($code)" }
Write-Host 'OK' -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
