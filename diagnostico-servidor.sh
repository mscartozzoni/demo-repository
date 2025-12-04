#!/bin/bash

echo "=========================================="
echo "  DIAGNÓSTICO DO SERVIDOR - PORTAL CLINIC"
echo "=========================================="
echo ""

# Conectar ao servidor e executar diagnóstico
ssh root@82.29.56.143 << 'ENDSSH'

echo "📋 1. Verificando status do PM2..."
pm2 list

echo ""
echo "📋 2. Verificando logs do portal-bot..."
pm2 logs portal-bot --lines 30 --nostream

echo ""
echo "📋 3. Verificando se a porta 8000 está aberta..."
netstat -tlnp | grep 8000 || echo "❌ Porta 8000 não está em uso"

echo ""
echo "📋 4. Verificando processos Node.js..."
ps aux | grep node | grep -v grep

echo ""
echo "📋 5. Verificando firewall (UFW)..."
ufw status | grep 8000 || echo "⚠️  Porta 8000 não está liberada no firewall"

echo ""
echo "📋 6. Verificando se o diretório existe..."
ls -la /var/www/portal-clinic-bot/backend/ 2>/dev/null || echo "❌ Diretório não encontrado"

echo ""
echo "📋 7. Verificando arquivo .env..."
if [ -f /var/www/portal-clinic-bot/backend/.env ]; then
    echo "✅ Arquivo .env existe"
    grep "^PORT=" /var/www/portal-clinic-bot/backend/.env
else
    echo "❌ Arquivo .env não encontrado"
fi

echo ""
echo "📋 8. Verificando dependências instaladas..."
if [ -d /var/www/portal-clinic-bot/backend/node_modules ]; then
    echo "✅ node_modules existe"
    ls /var/www/portal-clinic-bot/backend/node_modules/ | grep -E "(mysql2|dotenv|express)" || echo "⚠️  Dependências podem estar faltando"
else
    echo "❌ node_modules não encontrado - executar npm install"
fi

echo ""
echo "=========================================="
echo "  DIAGNÓSTICO COMPLETO"
echo "=========================================="

ENDSSH

echo ""
echo "✅ Diagnóstico finalizado!"
