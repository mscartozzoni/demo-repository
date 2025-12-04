#!/bin/bash

# Script para renovar certificados SSL manualmente
# Normalmente a renovação é automática, mas este script pode ser usado se necessário

set -e

VPS_HOST="root@82.29.56.143"

echo "🔄 Renovando certificados SSL..."
echo ""

ssh $VPS_HOST << 'ENDSSH'
echo "📋 Certificados atuais:"
certbot certificates

echo ""
echo "🔄 Tentando renovar certificados..."
certbot renew --force-renewal

echo ""
echo "✅ Renovação concluída!"

echo ""
echo "🔄 Recarregando Nginx..."
nginx -t && systemctl reload nginx

echo ""
echo "📋 Certificados após renovação:"
certbot certificates
ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ CERTIFICADOS RENOVADOS COM SUCESSO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
