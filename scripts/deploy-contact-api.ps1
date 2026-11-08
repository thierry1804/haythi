$ErrorActionPreference = 'Stop'
$Remote = 'ubuntu@148.113.46.75'
$Root = Split-Path -Parent $PSScriptRoot
$ServerDir = Join-Path $Root 'server'
$DistDir = Join-Path $Root 'dist'
$SetupSh = Join-Path $ServerDir 'deploy\remote-setup.sh'
$EnvTmp = Join-Path $env:TEMP 'haythi-api.env'
$StageDir = Join-Path $env:TEMP 'haythi-api-stage'

Write-Host ''
Write-Host '=== HAYTHI deploy API Node + frontend ===' -ForegroundColor Cyan
Write-Host "server -> $ServerDir"
Write-Host "dist   -> $DistDir"
Write-Host ''

if (-not (Test-Path (Join-Path $ServerDir 'src\index.js'))) {
  throw 'server/src/index.js introuvable'
}
if (-not (Test-Path (Join-Path $DistDir 'index.html'))) {
  throw 'dist/ manquant — npm run build avant'
}
if (-not (Test-Path $SetupSh)) {
  throw 'remote-setup.sh introuvable'
}

$ApiKey = Read-Host 'Colle RESEND API key (re_...)'
if ($ApiKey -notmatch '^re_') {
  throw 'Cle invalide: doit commencer par re_'
}

@(
  'NODE_ENV=production'
  'HOST=127.0.0.1'
  'PORT=8787'
  "RESEND_API_KEY=$ApiKey"
  'RESEND_FROM=HAYTHI <contact@mail.haythi.mg>'
  'RESEND_TO=contact@haythi.mg'
  'ALLOWED_ORIGINS=https://haythi.mg,https://www.haythi.mg'
) | Set-Content -Path $EnvTmp -Encoding ascii

# Stage SANS node_modules (sinon scp tourne des heures)
if (Test-Path $StageDir) { Remove-Item -Recurse -Force $StageDir }
New-Item -ItemType Directory -Path $StageDir | Out-Null
Copy-Item (Join-Path $ServerDir 'package.json') $StageDir
Copy-Item (Join-Path $ServerDir 'package-lock.json') $StageDir
Copy-Item (Join-Path $ServerDir '.env.example') $StageDir -ErrorAction SilentlyContinue
Copy-Item (Join-Path $ServerDir 'src') (Join-Path $StageDir 'src') -Recurse
Copy-Item (Join-Path $ServerDir 'deploy') (Join-Path $StageDir 'deploy') -Recurse

$stageCount = (Get-ChildItem $StageDir -Recurse -File).Count
Write-Host "Stage API: $stageCount fichiers (node_modules exclus)" -ForegroundColor DarkGray

Write-Host ''
Write-Host 'Mot de passe SSH demande plusieurs fois (mkdir / scp / setup).' -ForegroundColor DarkYellow
Write-Host ''

Write-Host '[1/5] mkdir distant...' -ForegroundColor Yellow
ssh $Remote 'rm -rf /tmp/haythi-api-upload /tmp/haythi-dist-upload; mkdir -p /tmp/haythi-api-upload /tmp/haythi-dist-upload'

Write-Host '[2/5] upload server (leger)...' -ForegroundColor Yellow
scp -r "$StageDir\*" "${Remote}:/tmp/haythi-api-upload/"

Write-Host '[3/5] upload dist/ + .env + setup...' -ForegroundColor Yellow
scp -r "$DistDir\*" "${Remote}:/tmp/haythi-dist-upload/"
scp $EnvTmp "${Remote}:/tmp/haythi-api.env"
scp $SetupSh "${Remote}:/tmp/haythi-remote-setup.sh"

Remove-Item -Force $EnvTmp -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $StageDir -ErrorAction SilentlyContinue

Write-Host '[4/5] remote-setup.sh (sudo + npm ci sur serveur)...' -ForegroundColor Yellow
ssh -t $Remote 'bash /tmp/haythi-remote-setup.sh && rm -f /tmp/haythi-remote-setup.sh'
if ($LASTEXITCODE -ne 0) {
  throw "remote-setup a echoue (code $LASTEXITCODE)"
}

Write-Host ''
Write-Host 'OK. Teste https://haythi.mg/#contact' -ForegroundColor Green
Write-Host 'Appuie sur une touche pour fermer...'
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
