#!/bin/bash

# Script de déploiement manuel sur le VPS
# Usage: ./deploy.sh

set -e

# Configuration (à adapter selon votre environnement)
VPS_HOST="${VPS_HOST:-votre-serveur.com}"
VPS_USER="${VPS_USER:-root}"
VPS_PASSWORD="${VPS_PASSWORD:-}"
VPS_PORT="${VPS_PORT:-22}"
VPS_DEPLOY_DIR="${VPS_DEPLOY_DIR:-/var/www/haythi}"

# Vérifier si sshpass est installé (nécessaire pour l'authentification par mot de passe)
if [ -n "$VPS_PASSWORD" ] && ! command -v sshpass &> /dev/null; then
    echo "⚠️  sshpass n'est pas installé. Installation..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y sshpass
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install hudochenkov/sshpass/sshpass
    else
        echo "❌ Veuillez installer sshpass manuellement pour votre système"
        exit 1
    fi
fi

echo "🚀 Démarrage du déploiement en mode PRODUCTION..."

# Définir l'environnement de production
export NODE_ENV=production

# Build du projet
echo "📦 Construction du projet (production)..."
npm run build

# Création de l'archive
echo "📦 Création de l'archive..."
cd out
tar -czf ../deploy.tar.gz .
cd ..

# Transfert vers le VPS
echo "📤 Transfert vers le VPS..."
if [ -n "$VPS_PASSWORD" ]; then
    sshpass -p "$VPS_PASSWORD" scp -o StrictHostKeyChecking=no -P "$VPS_PORT" deploy.tar.gz "$VPS_USER@$VPS_HOST:/tmp/"
else
    echo "⚠️  VPS_PASSWORD non défini, tentative de connexion sans mot de passe..."
    scp -o StrictHostKeyChecking=no -P "$VPS_PORT" deploy.tar.gz "$VPS_USER@$VPS_HOST:/tmp/"
fi

# Déploiement sur le VPS
echo "🔧 Déploiement sur le VPS..."
if [ -n "$VPS_PASSWORD" ]; then
    sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" << 'ENDSSH'
  DEPLOY_DIR="${VPS_DEPLOY_DIR:-/var/www/haythi}"
  
  # Créer le répertoire de déploiement
  mkdir -p $DEPLOY_DIR
  
  # Sauvegarder l'ancienne version
  if [ -d "$DEPLOY_DIR/current" ]; then
    BACKUP_DIR="$DEPLOY_DIR/backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p $DEPLOY_DIR/backups
    mv $DEPLOY_DIR/current $BACKUP_DIR
    echo "✅ Ancienne version sauvegardée dans $BACKUP_DIR"
  fi
  
  # Extraire la nouvelle version
  mkdir -p $DEPLOY_DIR/current
  tar -xzf /tmp/deploy.tar.gz -C $DEPLOY_DIR/current
  
  # Nettoyer
  rm -f /tmp/deploy.tar.gz
  
  echo "✅ Déploiement terminé dans $DEPLOY_DIR/current"
ENDSSH
else
    ssh -o StrictHostKeyChecking=no -p "$VPS_PORT" "$VPS_USER@$VPS_HOST" << 'ENDSSH'
  DEPLOY_DIR="${VPS_DEPLOY_DIR:-/var/www/haythi}"
  
  # Créer le répertoire de déploiement
  mkdir -p $DEPLOY_DIR
  
  # Sauvegarder l'ancienne version
  if [ -d "$DEPLOY_DIR/current" ]; then
    BACKUP_DIR="$DEPLOY_DIR/backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p $DEPLOY_DIR/backups
    mv $DEPLOY_DIR/current $BACKUP_DIR
    echo "✅ Ancienne version sauvegardée dans $BACKUP_DIR"
  fi
  
  # Extraire la nouvelle version
  mkdir -p $DEPLOY_DIR/current
  tar -xzf /tmp/deploy.tar.gz -C $DEPLOY_DIR/current
  
  # Nettoyer
  rm -f /tmp/deploy.tar.gz
  
  echo "✅ Déploiement terminé dans $DEPLOY_DIR/current"
ENDSSH
fi

# Nettoyage local
rm -f deploy.tar.gz

echo "✅ Déploiement terminé avec succès!"

