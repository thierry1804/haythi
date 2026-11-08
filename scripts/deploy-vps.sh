#!/usr/bin/env bash
# Déploie front + API + UI admin vers ubuntu@148.113.46.75
# Usage (depuis la racine du dépôt, terminal interactif) :
#   bash scripts/deploy-vps.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE="${REMOTE:-ubuntu@148.113.46.75}"
SSH_OPTS=(-o StrictHostKeyChecking=accept-new)

cd "$ROOT"

need() {
  command -v "$1" >/dev/null || { echo "Manquant: $1"; exit 1; }
}
need ssh
need tar
need npm

echo "=== Build local ==="
npm run build
npm --prefix admin run build
test -f dist/index.html
test -f admin/dist/index.html
test -f admin/Dockerfile

echo
echo "Connexion SSH à $REMOTE (mot de passe demandé)…"
echo "Puis éventuellement sudo sur le VPS."
echo

# 1) API upload
echo "=== [1/4] Upload API server/ ==="
tar -czf - \
  --exclude=node_modules \
  --exclude=.env \
  --exclude=data \
  --exclude='*.sqlite*' \
  -C server . \
| ssh "${SSH_OPTS[@]}" "$REMOTE" \
  'rm -rf /tmp/haythi-api-upload && mkdir -p /tmp/haythi-api-upload && tar -xzf - -C /tmp/haythi-api-upload && bash /tmp/haythi-api-upload/deploy/remote-setup.sh'

# 2) Patch .env (n'écrase pas Resend)
echo "=== [2/4] Compléter .env admin (SESSION_SECRET / ADMIN_ORIGIN) ==="
ssh -t "${SSH_OPTS[@]}" "$REMOTE" 'bash -s' <<'REMOTE'
set -euo pipefail
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
sudo chown www-data:www-data "$ENV"
sudo chmod 600 "$ENV"
sudo install -d -o www-data -g www-data -m 750 /opt/haythi-api/data
sudo systemctl restart haythi-contact
sleep 1
curl -fsS http://127.0.0.1:8787/healthz; echo
sudo journalctl -u haythi-contact -n 15 --no-pager | tail -n 20
REMOTE

# 3) Admin Docker
echo "=== [3/4] Upload UI admin + docker compose ==="
tar -czf - \
  --exclude=node_modules \
  -C admin . \
| ssh "${SSH_OPTS[@]}" "$REMOTE" \
  'rm -rf /tmp/haythi-admin-upload && mkdir -p /tmp/haythi-admin-upload && tar -xzf - -C /tmp/haythi-admin-upload && \
   sudo mkdir -p /opt/haythi-admin && sudo rsync -a --delete /tmp/haythi-admin-upload/ /opt/haythi-admin/ && \
   cd /opt/haythi-admin && (command -v docker >/dev/null || { echo "Docker manquant — installe docker puis relance"; exit 1; }) && \
   sudo docker compose up -d --build && \
   curl -sI http://127.0.0.1:8090/ | head -8'

# 4) Front public
echo "=== [4/4] Upload dist/ -> /var/www/html ==="
tar -czf - -C dist . \
| ssh "${SSH_OPTS[@]}" "$REMOTE" \
  'rm -rf /tmp/haythi-dist && mkdir -p /tmp/haythi-dist && tar -xzf - -C /tmp/haythi-dist && \
   sudo rsync -a /tmp/haythi-dist/ /var/www/html/ && rm -rf /tmp/haythi-dist && echo FRONT_OK'

echo
echo "=== Déployé (code) ==="
echo "Reste à faire manuellement (voir docs/backoffice-deploy.md) :"
echo "  1. Apache vhost admin.haythi.mg (snippet /opt/haythi-api/deploy/apache-admin.conf.snippet) + cert SSL"
echo "  2. Inclure apache-api-t.conf.snippet dans le vhost haythi.mg puis reload"
echo "  3. DNS admin + Cloudflare Access (email unique)"
echo "  4. create-admin sur le VPS :"
echo "       cd /opt/haythi-api && sudo -u www-data node scripts/create-admin.js VOTRE_EMAIL 'MOT_DE_PASSE'"
echo "  5. Pare-feu Cloudflare IPs (ufw) — corriger le curl avec -w '\\n' avant apply"
echo
echo "Vérifs rapides :"
echo "  curl -fsS http://127.0.0.1:8787/healthz   # sur le VPS"
echo "  curl -sI https://haythi.mg/ | head -5"
echo "  curl -sL https://haythi.mg/ | grep -E 'description|application/ld' | head -3"
