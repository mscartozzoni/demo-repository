#!/bin/bash

echo "=========================================="
echo "  DEPLOY BACKEND - PORTAL CLINIC"
echo "=========================================="
echo ""

SERVER="root@82.29.56.143"
REMOTE_PATH="/var/www/portal-clinic-bot/backend"
LOCAL_PATH="/Users/marcioscartozzoni/Downloads/Portal-Clinic-Unified/backend"

echo "📦 1. Criando diretório no servidor..."
ssh $SERVER "mkdir -p $REMOTE_PATH"

echo ""
echo "📦 2. Copiando arquivos do backend..."
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '*.log' \
  $LOCAL_PATH/ $SERVER:$REMOTE_PATH/

echo ""
echo "📦 3. Copiando arquivo .env..."
scp /Users/marcioscartozzoni/Downloads/Portal-Clinic-Unified/ARQUIVO.env $SERVER:$REMOTE_PATH/.env

echo ""
echo "📦 4. Instalando dependências no servidor..."
ssh $SERVER << 'ENDSSH'
cd /var/www/portal-clinic-bot/backend
npm install

echo ""
echo "📦 5. Parando processos antigos..."
pm2 stop portal-bot 2>/dev/null || true
pm2 delete portal-bot 2>/dev/null || true

echo ""
echo "📦 6. Iniciando servidor..."
pm2 start src/server.js --name portal-bot --time

echo ""
echo "📦 7. Salvando configuração..."
pm2 save
pm2 startup

echo ""
echo "📦 8. Status do servidor..."
pm2 list
pm2 logs portal-bot --lines 20 --nostream

ENDSSH

echo ""
echo "=========================================="
echo "  DEPLOY COMPLETO"
echo "=========================================="
echo ""
echo "Testando conexão em 5 segundos..."
sleep 5
curl -s http://82.29.56.143:8000/health && echo "" && echo "✅ Servidor está respondendo!" || echo "❌ Servidor não responde"
