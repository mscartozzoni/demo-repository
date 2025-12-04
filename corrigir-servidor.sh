#!/bin/bash

echo "=========================================="
echo "  CORREÇÃO DO SERVIDOR - PORTAL CLINIC"
echo "=========================================="
echo ""

# Conectar ao servidor e executar correções
ssh root@82.29.56.143 << 'ENDSSH'

echo "🔧 1. Navegando para o diretório do backend..."
cd /var/www/portal-clinic-bot/backend || exit 1

echo ""
echo "🔧 2. Verificando/Instalando dependências..."
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências..."
    npm install
else
    echo "✅ node_modules já existe"
fi

echo ""
echo "🔧 3. Instalando dependências específicas..."
npm install mysql2 dotenv express cors body-parser

echo ""
echo "🔧 4. Parando processos existentes..."
pm2 stop portal-bot 2>/dev/null || echo "Nenhum processo para parar"
pm2 delete portal-bot 2>/dev/null || echo "Nenhum processo para deletar"

echo ""
echo "🔧 5. Iniciando servidor..."
pm2 start src/server.js --name portal-bot --time

echo ""
echo "🔧 6. Liberando porta 8000 no firewall..."
ufw allow 8000/tcp
ufw status | grep 8000

echo ""
echo "🔧 7. Salvando configuração do PM2..."
pm2 save

echo ""
echo "🔧 8. Verificando status..."
pm2 list

echo ""
echo "🔧 9. Exibindo logs..."
pm2 logs portal-bot --lines 20 --nostream

echo ""
echo "=========================================="
echo "  CORREÇÃO COMPLETA"
echo "=========================================="

ENDSSH

echo ""
echo "✅ Correção finalizada!"
echo ""
echo "Testando conexão..."
sleep 3
curl -s http://82.29.56.143:8000/health && echo "" || echo "❌ Servidor ainda não responde"
