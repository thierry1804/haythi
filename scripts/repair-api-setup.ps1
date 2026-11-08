$ErrorActionPreference = 'Stop'
$Remote = 'ubuntu@148.113.46.75'
$Root = Split-Path -Parent $PSScriptRoot
$ServerDir = Join-Path $Root 'server'
$DistDir = Join-Path $Root 'dist'
$SetupSh = Join-Path $ServerDir 'deploy\remote-setup.sh'
$StageDir = Join-Path $env:TEMP 'haythi-api-stage'

Write-Host '=== HAYTHI repair (1x mot de passe SSH) ===' -ForegroundColor Cyan

if (-not (Test-Path (Join-Path $DistDir 'index.html'))) {
  throw 'dist/ manquant — npm run build avant'
}

if (Test-Path $StageDir) { Remove-Item -Recurse -Force $StageDir }
New-Item -ItemType Directory -Path (Join-Path $StageDir 'api') | Out-Null
New-Item -ItemType Directory -Path (Join-Path $StageDir 'dist') | Out-Null

Copy-Item (Join-Path $ServerDir 'package.json') (Join-Path $StageDir 'api\')
Copy-Item (Join-Path $ServerDir 'package-lock.json') (Join-Path $StageDir 'api\')
Copy-Item (Join-Path $ServerDir '.npmrc') (Join-Path $StageDir 'api\') -ErrorAction SilentlyContinue
Copy-Item (Join-Path $ServerDir '.env.example') (Join-Path $StageDir 'api\') -ErrorAction SilentlyContinue
Copy-Item (Join-Path $ServerDir 'src') (Join-Path $StageDir 'api\src') -Recurse
Copy-Item (Join-Path $ServerDir 'deploy') (Join-Path $StageDir 'api\deploy') -Recurse
Copy-Item "$DistDir\*" (Join-Path $StageDir 'dist\') -Recurse
Copy-Item $SetupSh (Join-Path $StageDir 'remote-setup.sh')

if (Select-String -Path (Join-Path $StageDir 'api\package.json') -Pattern 'file:' -SimpleMatch -Quiet) {
  throw 'package.json contient encore file:.. — stop'
}

$goSh = @'
#!/usr/bin/env bash
set -euo pipefail
BASE="$(cd "$(dirname "$0")" && pwd)"
echo "[go] extract ok in $BASE"
ls -la "$BASE"
rm -rf /tmp/haythi-api-upload /tmp/haythi-dist-upload
mkdir -p /tmp/haythi-api-upload /tmp/haythi-dist-upload
cp -a "$BASE/api/." /tmp/haythi-api-upload/
cp -a "$BASE/dist/." /tmp/haythi-dist-upload/
if [ -f "$BASE/haythi-api.env" ]; then
  cp "$BASE/haythi-api.env" /tmp/haythi-api.env
fi
chmod +x "$BASE/remote-setup.sh"
bash "$BASE/remote-setup.sh"
rm -rf "$BASE"
'@
[IO.File]::WriteAllText(
  (Join-Path $StageDir 'go.sh'),
  ($goSh -replace "`r`n", "`n" -replace "`r", "`n")
)

Write-Host ''
Write-Host 'API key: colle re_... OU Entree vide pour garder .env serveur' -ForegroundColor DarkYellow
$ApiKey = Read-Host 'RESEND_API_KEY'
if ($ApiKey -match '^re_') {
  $envBody = @(
    'NODE_ENV=production'
    'HOST=127.0.0.1'
    'PORT=8787'
    "RESEND_API_KEY=$ApiKey"
    'RESEND_FROM=HAYTHI <contact@mail.haythi.mg>'
    'RESEND_TO=contact@haythi.mg'
    'ALLOWED_ORIGINS=https://haythi.mg,https://www.haythi.mg'
  ) -join "`n"
  [IO.File]::WriteAllText((Join-Path $StageDir 'haythi-api.env'), $envBody + "`n")
  Write-Host 'Cle incluse dans le bundle.' -ForegroundColor DarkGray
} else {
  Write-Host 'Pas de nouvelle cle — .env serveur conserve si present.' -ForegroundColor DarkGray
}

Write-Host ''
Write-Host 'Mot de passe SSH UNE fois...' -ForegroundColor Yellow

$stagePosix = $StageDir -replace '\\', '/'
if ($stagePosix -match '^[A-Za-z]:') {
  $drive = $stagePosix.Substring(0, 1).ToLowerInvariant()
  $stagePosix = "/$drive" + $stagePosix.Substring(2)
}

$gitBash = @(
  'C:\Program Files\Git\bin\bash.exe'
  'C:\Program Files (x86)\Git\bin\bash.exe'
) | Where-Object { Test-Path $_ } | Select-Object -First 1

$remoteCmd = "rm -rf /tmp/haythi-in && mkdir -p /tmp/haythi-in && tar -xzf - -C /tmp/haythi-in && bash /tmp/haythi-in/go.sh"

if ($gitBash) {
  Write-Host "Pipe via Git Bash: $gitBash" -ForegroundColor DarkGray
  & $gitBash -lc "tar -czf - -C '$stagePosix' . | ssh -o StrictHostKeyChecking=accept-new $Remote '$remoteCmd'"
  $code = $LASTEXITCODE
} else {
  Write-Host 'Pipe via cmd.exe tar|ssh' -ForegroundColor DarkGray
  $cmdLine = 'tar -czf - -C "' + $StageDir + '" . | ssh -o StrictHostKeyChecking=accept-new ' + $Remote + ' "' + $remoteCmd + '"'
  cmd /c $cmdLine
  $code = $LASTEXITCODE
}

Remove-Item -Recurse -Force $StageDir -ErrorAction SilentlyContinue

if ($code -ne 0) { throw "setup echoue ($code)" }

Write-Host 'OK. Teste https://haythi.mg/#contact' -ForegroundColor Green
Write-Host 'Appuie sur une touche...'
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
