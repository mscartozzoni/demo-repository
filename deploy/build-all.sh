#!/bin/bash

# Script para fazer build de todas as aplicações
# Este script faz o build otimizado para produção

set -e  # Exit on error

echo "🏗️  Iniciando build de todas as aplicações..."
echo ""

BASE_DIR="/Users/marcioscartozzoni/Downloads/Portal-Clinic-Unified/apps"

# Função para fazer build de uma aplicação
build_app() {
    local app_dir=$1
    local app_name=$2
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📦 Building: $app_name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    cd "$app_dir"
    
    # Instalar dependências se necessário
    if [ ! -d "node_modules" ]; then
        echo "📥 Instalando dependências..."
        npm install --legacy-peer-deps
    fi
    
    # Build
    echo "🔨 Building $app_name..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ $app_name build concluído com sucesso!"
        
        # Verificar tamanho do build
        if [ -d "dist" ]; then
            BUILD_SIZE=$(du -sh dist | cut -f1)
            echo "📊 Tamanho do build: $BUILD_SIZE"
        fi
    else
        echo "❌ Erro no build de $app_name"
        return 1
    fi
}

# Build Portal-Api
build_app "$BASE_DIR/api" "Portal-Api"

# Build Portal-Medico
build_app "$BASE_DIR/medico" "Portal-Medico"

# Build Portal-Paciente
build_app "$BASE_DIR/paciente" "Portal-Paciente"

# Build Portal-Financeiro
build_app "$BASE_DIR/financeiro" "Portal-Financeiro"

# Build Portal-Orcamento
build_app "$BASE_DIR/orcamento" "Portal-Orcamento"

# Build Portal-Clinic-Bot (Frontend)
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Building: Portal-Clinic-Bot (Frontend)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$BASE_DIR/bot"

if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências..."
    npm install --legacy-peer-deps
fi

echo "🔨 Building Bot Frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Bot Frontend build concluído com sucesso!"
    if [ -d "dist" ]; then
        BUILD_SIZE=$(du -sh dist | cut -f1)
        echo "📊 Tamanho do build: $BUILD_SIZE"
    fi
else
    echo "❌ Erro no build do Bot Frontend"
    exit 1
fi

# Build Bot Backend (não precisa de build, mas vamos instalar deps)
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Preparando: Bot Backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$BASE_DIR/bot/backend"

if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências do backend..."
    npm install
    echo "✅ Dependências do backend instaladas!"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ BUILD COMPLETO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Resumo dos builds:"
echo ""

for app in api medico paciente financeiro orcamento bot; do
    if [ -d "$BASE_DIR/$app/dist" ]; then
        SIZE=$(du -sh "$BASE_DIR/$app/dist" | cut -f1)
        echo "  ✅ $app: $SIZE"
    fi
done

echo ""
echo "🚀 Pronto para deploy!"
