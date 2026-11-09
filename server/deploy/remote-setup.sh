#!/usr/bin/env bash
set -euo pipefail

echo '[setup] Node check'
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
node -v
npm -v
echo "npm prefix (user)=$(npm config get prefix 2>/dev/null || echo '?')"
echo "which npm=$(command -v npm)"

echo '[setup] sync /opt/haythi-api'
sudo mkdir -p /opt/haythi-api
sudo rsync -a --delete \
  --exclude node_modules \
  --exclude .env \
  --exclude data \
  /tmp/haythi-api-upload/ /opt/haythi-api/

if [ -f /tmp/haythi-api.env ]; then
  sudo install -o www-data -g www-data -m 600 /tmp/haythi-api.env /opt/haythi-api/.env
  shred -u /tmp/haythi-api.env 2>/dev/null || rm -f /tmp/haythi-api.env
fi

echo '[setup] npm install (env propre)'
echo '--- /opt/haythi-api ---'
ls -la /opt/haythi-api

if [ ! -f /opt/haythi-api/package.json ]; then
  echo 'ERROR: /opt/haythi-api/package.json manquant'
  exit 1
fi

sudo mkdir -p /tmp/haythi-npm-cache /tmp/haythi-npm-home
sudo rm -rf /opt/haythi-api/node_modules

# Cause racine: npmrc global avec prefix=/opt → npm lit /opt/package.json
# Fix: HOME vierge + npm --prefix AVANT la sous-commande (ordre obligatoire)
sudo env -i \
  PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" \
  HOME="/tmp/haythi-npm-home" \
  npm_config_cache="/tmp/haythi-npm-cache" \
  bash -c 'cd /opt/haythi-api && npm --prefix /opt/haythi-api ci --omit=dev'

if [ ! -d /opt/haythi-api/node_modules/express ]; then
  echo 'ci failed/incomplete — fallback npm install'
  sudo env -i \
    PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" \
    HOME="/tmp/haythi-npm-home" \
    npm_config_cache="/tmp/haythi-npm-cache" \
    bash -c 'cd /opt/haythi-api && npm --prefix /opt/haythi-api install --omit=dev'
fi

test -d /opt/haythi-api/node_modules/express
test -d /opt/haythi-api/node_modules/resend
sudo chown -R www-data:www-data /opt/haythi-api

echo '[setup] systemd'
sudo cp /opt/haythi-api/deploy/haythi-contact.service /etc/systemd/system/haythi-contact.service
sudo systemctl daemon-reload
sudo systemctl enable haythi-contact
sudo systemctl restart haythi-contact
sleep 1
sudo systemctl --no-pager --full status haythi-contact || true
curl -fsS http://127.0.0.1:8787/healthz || true
echo

echo '[setup] nginx location /api/contact'
SITE=''
for f in /etc/nginx/sites-enabled/* /etc/nginx/conf.d/*; do
  [ -f "$f" ] || continue
  SITE="$f"
  break
done

if [ -z "$SITE" ]; then
  echo 'WARN: aucun site nginx trouve — ajoute le proxy a la main'
else
  echo "nginx site: $SITE"
  if sudo grep -q 'location = /api/contact' "$SITE"; then
    echo 'proxy deja present'
  else
    sudo cp "$SITE" "$SITE.bak.haythi.$(date +%s)"
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
    raise SystemExit('no closing brace in nginx site')
site.write_text(text[:idx] + '\n' + snippet + '\n' + text[idx:])
print('inserted location block')
PY
    sudo nginx -t
    sudo systemctl reload nginx
    echo 'nginx reloade'
  fi
fi

echo '[setup] deploy frontend'
if [ -d /tmp/haythi-dist-upload ]; then
  sudo rsync -a /tmp/haythi-dist-upload/ /var/www/html/
fi
sudo rm -f /var/www/html/api/contact.php \
  /var/www/html/api/config.local.php \
  /var/www/html/api/config.sample.php 2>/dev/null || true

echo
echo '=== DONE ==='
sudo systemctl is-active haythi-contact
curl -fsS http://127.0.0.1:8787/healthz
echo
