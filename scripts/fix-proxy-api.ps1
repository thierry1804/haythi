$ErrorActionPreference = 'Stop'
$Remote = 'ubuntu@148.113.46.75'
$gitBash = @('C:\Program Files\Git\bin\bash.exe','C:\Program Files (x86)\Git\bin\bash.exe') | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $gitBash) { throw 'Git Bash introuvable' }

$script = @'
set -euo pipefail
echo "=== web stack ==="
command -v nginx && nginx -v 2>&1 || echo "no nginx bin"
command -v apache2 && apache2 -v 2>&1 | head -n1 || true
command -v httpd && httpd -v 2>&1 | head -n1 || true
command -v caddy && caddy version || true
systemctl is-active nginx 2>/dev/null || true
systemctl is-active apache2 2>/dev/null || true
systemctl is-active httpd 2>/dev/null || true
systemctl is-active caddy 2>/dev/null || true

echo "=== listeners 80/443 ==="
sudo ss -tlnp | grep -E ':80 |:443 ' || sudo ss -tlnp | head -n 40

echo "=== nginx tree ==="
sudo ls -la /etc/nginx 2>/dev/null || true
sudo ls -la /etc/nginx/sites-enabled 2>/dev/null || true
sudo ls -la /etc/nginx/sites-available 2>/dev/null || true
sudo ls -la /etc/nginx/conf.d 2>/dev/null || true
if [ -f /etc/nginx/nginx.conf ]; then
  echo "--- nginx.conf include ---"
  sudo grep -nE 'include|server_name|root|listen' /etc/nginx/nginx.conf || true
fi

echo "=== apache ==="
sudo ls -la /etc/apache2/sites-enabled 2>/dev/null || true
sudo ls -la /etc/httpd/conf.d 2>/dev/null || true

echo "=== find vhost with haythi or /var/www/html ==="
sudo grep -RIn --include='*.conf' -E 'haythi|/var/www/html|server_name' /etc/nginx /etc/apache2 /etc/httpd /etc/caddy 2>/dev/null | head -n 80 || true

echo "=== local API ==="
curl -fsS http://127.0.0.1:8787/healthz; echo
'@

$tmp = Join-Path $env:TEMP 'haythi-detect-web.sh'
[IO.File]::WriteAllText($tmp, ($script -replace "`r`n","`n" -replace "`r","`n"))
$posix = ($tmp -replace '\\','/')
if ($posix -match '^[A-Za-z]:') { $posix = '/' + $posix.Substring(0,1).ToLowerInvariant() + $posix.Substring(2) }

Write-Host 'Mot de passe SSH une fois (detect)...' -ForegroundColor Yellow
& $gitBash -lc "ssh -t -o StrictHostKeyChecking=accept-new $Remote 'bash -s' < '$posix'"
$code = $LASTEXITCODE
Remove-Item $tmp -Force -EA SilentlyContinue
if ($code -ne 0) { throw "detect echoue ($code)" }
Write-Host 'Appuie sur une touche...'
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
