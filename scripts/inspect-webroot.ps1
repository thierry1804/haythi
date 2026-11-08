$ErrorActionPreference = 'Stop'
$Remote = 'ubuntu@148.113.46.75'
$gitBash = @('C:\Program Files\Git\bin\bash.exe','C:\Program Files (x86)\Git\bin\bash.exe') | Where-Object { Test-Path $_ } | Select-Object -First 1
$script = @'
set -euo pipefail
echo "=== /var/www/html top ==="
ls -la /var/www/html | head -n 40
echo "=== index ==="
ls -la /var/www/html/index.html /var/www/html/index.htm 2>/dev/null || true
head -n 40 /var/www/html/index.html 2>/dev/null || true
echo "=== _next? assets? ==="
ls -la /var/www/html/_next 2>/dev/null | head || echo no_next
ls -la /var/www/html/assets 2>/dev/null | head || echo no_assets
echo "=== apache ssl vhost (proxy/root) ==="
sudo grep -nE 'DocumentRoot|ProxyPass|ProxyPassReverse|Rewrite|ServerName|Location|port-300' /etc/apache2/sites-enabled/*.conf
echo "=== listeners node ==="
sudo ss -tlnp | grep -E '3000|3001|3002|8787|next' || true
echo "=== curl local headers ==="
curl -sI http://127.0.0.1/ | head -n 20
curl -sI http://127.0.0.1:3001/ 2>/dev/null | head -n 15 || true
'@
$tmp = Join-Path $env:TEMP 'haythi-inspect-web.sh'
[IO.File]::WriteAllText($tmp, ($script -replace "`r`n","`n" -replace "`r","`n"))
$posix = ($tmp -replace '\\','/')
if ($posix -match '^[A-Za-z]:') { $posix = '/' + $posix.Substring(0,1).ToLowerInvariant() + $posix.Substring(2) }
Write-Host 'mdp SSH 1x...' -ForegroundColor Yellow
& $gitBash -lc "ssh -t -o StrictHostKeyChecking=accept-new $Remote 'bash -s' < '$posix'"
Remove-Item $tmp -Force -EA SilentlyContinue
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
