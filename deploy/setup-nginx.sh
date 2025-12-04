#!/bin/bash

# Script para configurar Nginx no VPS
# Este script copia as configurações e configura o Nginx

set -e

VPS_HOST="root@82.29.56.143"
NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"
LOCAL_CONFIGS="/Users/marcioscartozzoni/Downloads/Portal-Clinic-Unified/deploy/nginx-configs"

echo "🔧 Configurando Nginx no VPS..."
echo ""

# Parar serviço que está usando porta 80 (Docker)
echo "🛑 Parando serviços na porta 80..."
ssh $VPS_HOST "docker ps -q | xargs -r docker stop || true"

# Copiar configurações para o VPS
echo "📤 Enviando configurações do Nginx..."
scp $LOCAL_CONFIGS/*.conf $VPS_HOST:/tmp/

# Instalar configurações
echo "⚙️  Instalando configurações..."
ssh $VPS_HOST << 'ENDSSH'
# Remover configuração default
rm -f /etc/nginx/sites-enabled/default

# Mover configurações para sites-available
mv /tmp/*.conf /etc/nginx/sites-available/

# Criar symlinks para sites-enabled
cd /etc/nginx/sites-enabled
ln -sf ../sites-available/api.portal-clinic.com.br.conf .
ln -sf ../sites-available/medico.portal-clinic.com.br.conf .
ln -sf ../sites-available/paciente.portal-clinic.com.br.conf .
ln -sf ../sites-available/financeiro.marcioplasticsurgery.com.conf .
ln -sf ../sites-available/orcamento.portal-clinic.com.br.conf .
ln -sf ../sites-available/app.portal-clinic.com.br.conf .

# Testar configuração
echo ""
echo "🧪 Testando configuração do Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuração válida!"
    echo ""
    echo "🔄 Reiniciando Nginx..."
    systemctl restart nginx
    systemctl enable nginx
    echo "✅ Nginx reiniciado e habilitado!"
else
    echo "❌ Erro na configuração do Nginx!"
    exit 1
fi

# Configurar firewall
echo ""
echo "🔒 Configurando firewall (UFW)..."
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable

echo ""
echo "📊 Status do Nginx:"
systemctl status nginx --no-pager | head -10

echo ""
echo "🌐 Portas abertas:"
netstat -tlnp | grep nginx || ss -tlnp | grep nginx
ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ NGINX CONFIGURADO COM SUCESSO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Próximos passos:"
echo "  1. Fazer deploy das aplicações"
echo "  2. Configurar DNS dos domínios para apontar para 82.29.56.143"
echo "  3. Instalar SSL com Let's Encrypt"
echo ""
echo "🌐 Domínios configurados:"
echo "  • api.portal-clinic.com.br"
echo "  • medico.portal-clinic.com.br"
echo "  • paciente.portal-clinic.com.br"
echo "  • financeiro.marcioplasticsurgery.com"
echo "  • orcamento.portal-clinic.com.br"
echo "  • app.portal-clinic.com.br"
echo "  • portal-clinic.com.br"
