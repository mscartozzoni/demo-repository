#!/bin/bash

# Script de Instalação do Chatwoot no VPS
# Portal Clinic - Sistema Omnichannel

set -e

VPS_HOST="root@82.29.56.143"
CHATWOOT_DOMAIN="chat.portal-clinic.com.br"

echo "🚀 Instalando Chatwoot no VPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 VPS: $VPS_HOST"
echo "🌐 Domínio: $CHATWOOT_DOMAIN"
echo ""

ssh $VPS_HOST << ENDSSH
set -e

echo "📦 Atualizando sistema..."
apt update

echo "📥 Baixando instalador do Chatwoot..."
cd /opt
wget -q https://get.chatwoot.app/linux/install.sh
chmod +x install.sh

echo "🔧 Instalando Chatwoot..."
echo ""
echo "⚠️  Durante a instalação, forneça:"
echo "   • Domain: $CHATWOOT_DOMAIN"
echo "   • SSL: Yes (após DNS propagar)"
echo "   • Email: contato@marcioplasticsurgery.com"
echo ""

# Executar instalador
./install.sh --install

echo ""
echo "✅ Chatwoot instalado!"
echo ""
echo "🔑 Credenciais padrão:"
echo "   Email: admin@${CHATWOOT_DOMAIN}"
echo "   Senha: (será criada no primeiro acesso)"
echo ""
echo "🌐 Acesse: http://$CHATWOOT_DOMAIN"
echo "   Ou: http://82.29.56.143:3000"
echo ""

ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ INSTALAÇÃO CONCLUÍDA!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1. Configure DNS:"
echo "   chat.portal-clinic.com.br → 82.29.56.143"
echo ""
echo "2. Instale SSL:"
echo "   sudo chatwoot ssl install"
echo ""
echo "3. Acesse Chatwoot:"
echo "   https://$CHATWOOT_DOMAIN"
echo ""
echo "4. Configure integração:"
echo "   • Email inbox"
echo "   • WhatsApp"
echo "   • Widget web"
echo ""
