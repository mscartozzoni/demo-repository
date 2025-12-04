#!/bin/bash

# Script para fazer deploy no VPS
# VPS IP: 82.29.56.143

set -e

VPS_HOST="root@82.29.56.143"
VPS_DIR="/var/www"
LOCAL_BASE="/Users/marcioscartozzoni/Downloads/Portal-Clinic-Unified/apps"

echo "🚀 Iniciando deploy para VPS..."
echo "📍 VPS: $VPS_HOST"
echo ""

# Função para fazer deploy de uma aplicação
deploy_app() {
    local app_name=$1
    local local_dir=$2
    local remote_dir=$3
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📤 Deploy: $app_name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Criar diretório no VPS se não existir
    ssh $VPS_HOST "mkdir -p $remote_dir"
    
    # Fazer upload do build
    echo "📦 Enviando arquivos..."
    rsync -avz --delete \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='.env' \
        "$local_dir/" "$VPS_HOST:$remote_dir/"
    
    if [ $? -eq 0 ]; then
        echo "✅ $app_name deployed com sucesso!"
    else
        echo "❌ Erro no deploy de $app_name"
        return 1
    fi
}

# Deploy Frontend Apps
deploy_app "Portal-Api" "$LOCAL_BASE/api/dist" "$VPS_DIR/portal-api"
deploy_app "Portal-Medico" "$LOCAL_BASE/medico/dist" "$VPS_DIR/portal-medico"
deploy_app "Portal-Paciente" "$LOCAL_BASE/paciente/dist" "$VPS_DIR/portal-paciente"
deploy_app "Portal-Financeiro" "$LOCAL_BASE/financeiro/dist" "$VPS_DIR/portal-financeiro"
deploy_app "Portal-Orcamento" "$LOCAL_BASE/orcamento/dist" "$VPS_DIR/portal-orcamento"
deploy_app "Bot-Frontend" "$LOCAL_BASE/bot/dist" "$VPS_DIR/portal-clinic-bot/frontend"

# Deploy Backend
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📤 Deploy: Bot Backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ssh $VPS_HOST "mkdir -p $VPS_DIR/portal-clinic-bot/backend"

rsync -avz --delete \
    --exclude='node_modules' \
    --exclude='.git' \
    "$LOCAL_BASE/bot/backend/" "$VPS_HOST:$VPS_DIR/portal-clinic-bot/backend/"

# Instalar dependências do backend no VPS
echo "📥 Instalando dependências do backend no VPS..."
ssh $VPS_HOST "cd $VPS_DIR/portal-clinic-bot/backend && npm install --production"

# Copiar .env file
echo "📝 Copiando arquivo .env para o backend..."
scp "$LOCAL_BASE/bot/backend/.env" "$VPS_HOST:$VPS_DIR/portal-clinic-bot/backend/.env"

echo "✅ Backend deployed com sucesso!"

# Restart PM2
echo ""
echo "🔄 Reiniciando aplicações no PM2..."
ssh $VPS_HOST "pm2 restart all || pm2 start $VPS_DIR/portal-clinic-bot/backend/index.js --name portal-bot"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ DEPLOY COMPLETO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Aplicações disponíveis:"
echo "  • Portal API: http://82.29.56.143:3001"
echo "  • Portal Médico: http://82.29.56.143:3002"
echo "  • Portal Paciente: http://82.29.56.143:3003"
echo "  • Portal Financeiro: http://82.29.56.143:3004"
echo "  • Portal Orçamento: http://82.29.56.143:3005"
echo "  • Bot Backend: http://82.29.56.143:8000"
echo ""
echo "📝 Configure o Nginx para servir as aplicações nos domínios corretos"
