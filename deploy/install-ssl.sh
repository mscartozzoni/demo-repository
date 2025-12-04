#!/bin/bash

# Script para instalar SSL com Let's Encrypt (Certbot)
# Configura HTTPS para todos os domínios do Portal Clinic

set -e

VPS_HOST="root@82.29.56.143"
EMAIL="contato@marcioplasticsurgery.com"

# Lista de domínios
DOMAINS=(
    "api.portal-clinic.com.br"
    "medico.portal-clinic.com.br"
    "paciente.portal-clinic.com.br"
    "financeiro.marcioplasticsurgery.com"
    "orcamento.portal-clinic.com.br"
    "app.portal-clinic.com.br"
    "portal-clinic.com.br"
    "www.portal-clinic.com.br"
)

echo "🔐 Instalando SSL/TLS com Let's Encrypt"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📧 Email: $EMAIL"
echo "🌐 Domínios:"
for domain in "${DOMAINS[@]}"; do
    echo "   • $domain"
done
echo ""

# Instalar Certbot no VPS
echo "📦 Instalando Certbot..."
ssh $VPS_HOST << 'ENDSSH'
apt update
apt install -y certbot python3-certbot-nginx
ENDSSH

echo "✅ Certbot instalado!"
echo ""

# Obter certificados para cada domínio
echo "🔑 Obtendo certificados SSL..."
echo ""

ssh $VPS_HOST << ENDSSH
set -e

# API
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Configurando SSL para: api.portal-clinic.com.br"
certbot --nginx -d api.portal-clinic.com.br \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --redirect \
    --hsts \
    --staple-ocsp

# Medico
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Configurando SSL para: medico.portal-clinic.com.br"
certbot --nginx -d medico.portal-clinic.com.br \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --redirect \
    --hsts \
    --staple-ocsp

# Paciente
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Configurando SSL para: paciente.portal-clinic.com.br"
certbot --nginx -d paciente.portal-clinic.com.br \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --redirect \
    --hsts \
    --staple-ocsp

# Financeiro
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Configurando SSL para: financeiro.marcioplasticsurgery.com"
certbot --nginx -d financeiro.marcioplasticsurgery.com \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --redirect \
    --hsts \
    --staple-ocsp

# Orcamento
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Configurando SSL para: orcamento.portal-clinic.com.br"
certbot --nginx -d orcamento.portal-clinic.com.br \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --redirect \
    --hsts \
    --staple-ocsp

# App (múltiplos domínios)
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Configurando SSL para: app + portal-clinic.com.br"
certbot --nginx \
    -d app.portal-clinic.com.br \
    -d portal-clinic.com.br \
    -d www.portal-clinic.com.br \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --redirect \
    --hsts \
    --staple-ocsp

# Configurar renovação automática
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚙️  Configurando renovação automática..."

# Testar renovação
certbot renew --dry-run

# Adicionar cron job para renovação automática (já vem configurado, mas garantir)
systemctl enable certbot.timer
systemctl start certbot.timer

echo ""
echo "✅ Renovação automática configurada!"
echo ""
echo "📊 Status dos certificados:"
certbot certificates

echo ""
echo "🔄 Recarregando Nginx..."
nginx -t && systemctl reload nginx

ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ SSL INSTALADO COM SUCESSO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔐 Todos os domínios agora usam HTTPS!"
echo ""
echo "🌐 URLs seguras:"
echo "   • https://api.portal-clinic.com.br"
echo "   • https://medico.portal-clinic.com.br"
echo "   • https://paciente.portal-clinic.com.br"
echo "   • https://financeiro.marcioplasticsurgery.com"
echo "   • https://orcamento.portal-clinic.com.br"
echo "   • https://app.portal-clinic.com.br"
echo "   • https://portal-clinic.com.br"
echo ""
echo "📝 Notas importantes:"
echo "   • Certificados válidos por 90 dias"
echo "   • Renovação automática configurada"
echo "   • HTTP redireciona automaticamente para HTTPS"
echo "   • HSTS habilitado para segurança extra"
echo ""
