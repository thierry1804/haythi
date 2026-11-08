$ErrorActionPreference = 'Stop'
$Remote = 'ubuntu@148.113.46.75'
$gitBash = @('C:\Program Files\Git\bin\bash.exe','C:\Program Files (x86)\Git\bin\bash.exe') | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $gitBash) { throw 'Git Bash introuvable' }

$script = @'
set -euo pipefail
echo "=== service ==="
sudo systemctl --no-pager --full status haythi-contact || true
curl -fsS http://127.0.0.1:8787/healthz && echo || echo "API locale KO"

echo "=== nginx sites ==="
ls -la /etc/nginx/sites-enabled /etc/nginx/conf.d 2>/dev/null || true
SITE=""
for f in /etc/nginx/sites-enabled/* /etc/nginx/conf.d/*; do
  [ -f "$f" ] || continue
  echo "FILE $f"
  sudo grep -n "server_name\|location\|root\|proxy_pass\|haythi\|api" "$f" || true
  SITE="$f"
done

if [ -z "$SITE" ]; then
  echo "Aucun site nginx"
  exit 1
fi

echo "Using SITE=$SITE"
if ! sudo grep -q 'location = /api/contact' "$SITE"; then
  sudo cp "$SITE" "$SITE.bak.fixapi.$(date +%s)"
  sudo python3 - "$SITE" <<'PY'
from pathlib import Path
import sys
site = Path(sys.argv[1])
text = site.read_text()
snippet = """
    location = /api/contact {
        limit_except POST { deny all; }
        proxy_pass http://127.0.0.1:8787;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 16k;
        proxy_read_timeout 20s;
        proxy_connect_timeout 5s;
    }
"""
if 'location = /api/contact' in text:
    print('already present')
    raise SystemExit(0)
idx = text.rfind('}')
if idx < 0:
    raise SystemExit('no closing brace')
site.write_text(text[:idx] + '\n' + snippet + '\n' + text[idx:])
print('inserted')
PY
  sudo nginx -t
  sudo systemctl reload nginx
  echo "nginx proxy ajoute"
else
  echo "proxy deja present"
fi

# ensure service up
if [ -f /opt/haythi-api/src/index.js ]; then
  sudo systemctl enable haythi-contact || true
  sudo systemctl restart haythi-contact || true
  sleep 1
  curl -fsS http://127.0.0.1:8787/healthz && echo
  sudo systemctl is-active haythi-contact
else
  echo "MANQUE /opt/haythi-api — relancer repair-api-setup.ps1"
  exit 2
fi
echo DONE
'@

$tmp = Join-Path $env:TEMP 'haythi-fix-nginx.sh'
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
