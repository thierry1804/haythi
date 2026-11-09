#!/usr/bin/env bash
# Déploie front + API + UI admin vers ubuntu@148.113.46.75
# Une seule connexion SSH (un seul mot de passe). Sudo peut encore demander
# son mot de passe une fois sur le VPS si sudo n'est pas NOPASSWD.
#
# Usage (depuis la racine du dépôt, terminal interactif) :
#   bash scripts/deploy-vps.sh
# Windows :
#   & "C:\Program Files\Git\bin\bash.exe" scripts/deploy-vps.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE="${REMOTE:-ubuntu@148.113.46.75}"
SSH_OPTS=(-o StrictHostKeyChecking=accept-new)
STAGE="${TMPDIR:-/tmp}/haythi-deploy-stage-$$"

cd "$ROOT"

need() {
  command -v "$1" >/dev/null || { echo "Manquant: $1"; exit 1; }
}
need ssh
need tar
need npm

cleanup() {
  rm -rf "$STAGE"
}
trap cleanup EXIT

echo "=== Build local ==="
npm run build
npm --prefix admin run build
test -f dist/index.html
test -f admin/dist/index.html
test -f admin/Dockerfile

echo "=== Préparation du paquet ==="
rm -rf "$STAGE"
mkdir -p "$STAGE/api" "$STAGE/admin" "$STAGE/dist"

# API (sans secrets ni base)
tar -C server -cf - \
  --exclude=node_modules \
  --exclude=.env \
  --exclude=data \
  --exclude='*.sqlite*' \
  . | tar -C "$STAGE/api" -xf -

# Admin (sources + dist buildé, sans node_modules)
tar -C admin -cf - \
  --exclude=node_modules \
  . | tar -C "$STAGE/admin" -xf -

# Front public
tar -C dist -cf - . | tar -C "$STAGE/dist" -xf -

cat > "$STAGE/go.sh" <<'REMOTE'
#!/usr/bin/env bash
set -euo pipefail
BASE="$(cd "$(dirname "$0")" && pwd)"

echo "=== [1/4] Sync API → /opt/haythi-api ==="
sudo mkdir -p /opt/haythi-api
sudo rsync -a --delete \
  --exclude node_modules \
  --exclude .env \
  --exclude data \
  "$BASE/api/" /opt/haythi-api/

if [ ! -f /opt/haythi-api/package.json ]; then
  echo "ERREUR: package.json API manquant après sync"
  exit 1
fi

echo "=== npm ci (API) ==="
sudo mkdir -p /tmp/haythi-npm-cache /tmp/haythi-npm-home
sudo rm -rf /opt/haythi-api/node_modules
sudo env -i \
  PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" \
  HOME="/tmp/haythi-npm-home" \
  npm_config_cache="/tmp/haythi-npm-cache" \
  bash -c 'cd /opt/haythi-api && npm --prefix /opt/haythi-api ci --omit=dev'

if [ ! -d /opt/haythi-api/node_modules/express ]; then
  echo "ci incomplete — fallback npm install"
  sudo env -i \
    PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" \
    HOME="/tmp/haythi-npm-home" \
    npm_config_cache="/tmp/haythi-npm-cache" \
    bash -c 'cd /opt/haythi-api && npm --prefix /opt/haythi-api install --omit=dev'
fi

sudo cp /opt/haythi-api/deploy/haythi-contact.service /etc/systemd/system/haythi-contact.service
sudo systemctl daemon-reload
sudo systemctl enable haythi-contact

echo "=== [2/4] Compléter .env admin ==="
ENV=/opt/haythi-api/.env
if [ ! -f "$ENV" ]; then
  echo "ERREUR: $ENV absent — crée-le d'abord avec RESEND_*"
  exit 1
fi
sudo cp -a "$ENV" "${ENV}.bak.$(date +%s)"
ensure() {
  local key="$1" val="$2"
  if sudo grep -q "^${key}=" "$ENV"; then
    echo "  $key déjà présent"
  else
    echo "${key}=${val}" | sudo tee -a "$ENV" >/dev/null
    echo "  + $key"
  fi
}
SECRET=$(openssl rand -base64 48 | tr -d '\n')
ensure SESSION_SECRET "$SECRET"
ensure ADMIN_ORIGIN "https://admin.haythi.mg"
ensure DATABASE_PATH "data/haythi.sqlite"
# Plafonds IP : les anciennes valeurs (3/h, 8/j) bloquaient les vrais contacts
# après quelques tests, avec faux succès et sans lead.
ensure IP_HOUR_MAX "30"
ensure IP_DAY_MAX "80"
# Si la clé existe déjà avec une valeur trop basse, la remonter.
sudo sed -i -E 's/^IP_HOUR_MAX=.*/IP_HOUR_MAX=30/' "$ENV"
sudo sed -i -E 's/^IP_DAY_MAX=.*/IP_DAY_MAX=80/' "$ENV"

sudo chown -R www-data:www-data /opt/haythi-api
sudo chmod 600 "$ENV"
sudo install -d -o www-data -g www-data -m 750 /opt/haythi-api/data

# Reset compteurs IP du jour (sinon les tests récents gardent le blocage).
if [ -f /opt/haythi-api/data/quota.json ]; then
  sudo -u www-data python3 - <<'PY'
import json
from pathlib import Path
p = Path("/opt/haythi-api/data/quota.json")
try:
    data = json.loads(p.read_text() or "{}")
except Exception:
    data = {}
data["byIp"] = {}
p.write_text(json.dumps(data, indent=2) + "\n")
print("quota byIp cleared")
PY
fi

sudo systemctl restart haythi-contact
sleep 1
curl -fsS http://127.0.0.1:8787/healthz; echo
sudo journalctl -u haythi-contact -n 15 --no-pager | tail -n 20

echo "=== [3/4] Admin Docker ==="
command -v docker >/dev/null || { echo "Docker manquant — installe docker puis relance"; exit 1; }
sudo mkdir -p /opt/haythi-admin
sudo rsync -a --delete "$BASE/admin/" /opt/haythi-admin/
cd /opt/haythi-admin
sudo docker compose up -d --build
curl -sI http://127.0.0.1:8090/ | head -8

echo "=== [4/4] Front → /var/www/html ==="
sudo rsync -a "$BASE/dist/" /var/www/html/
echo FRONT_OK

rm -rf "$BASE"
echo
echo "=== Déployé (code) ==="
REMOTE

# LF only (Windows / Git Bash)
if command -v sed >/dev/null; then
  sed -i 's/\r$//' "$STAGE/go.sh" 2>/dev/null || true
fi
chmod +x "$STAGE/go.sh"

echo
echo "Connexion SSH unique à $REMOTE (mot de passe demandé une fois)…"
echo "Sudo peut encore demander son mot de passe une fois sur le VPS."
echo

tar -C "$STAGE" -czf - . | ssh -t "${SSH_OPTS[@]}" "$REMOTE" \
  'rm -rf /tmp/haythi-deploy && mkdir -p /tmp/haythi-deploy && tar -xzf - -C /tmp/haythi-deploy && bash /tmp/haythi-deploy/go.sh'

echo
echo "Reste éventuel (voir docs/backoffice-deploy.md) :"
echo "  - Apache /api/t, Access, create-admin, ufw Cloudflare"
echo "Vérifs :"
echo "  curl -sI https://haythi.mg/ | head -5"
echo "  curl -s -o /dev/null -w '%{http_code}\\n' -X POST https://haythi.mg/api/contact -H 'Content-Type: application/json' -H 'Origin: https://haythi.mg' -d '{}'"
