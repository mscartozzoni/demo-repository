#!/bin/bash

# Script para copiar aplicações para o monorepo
# Exclui node_modules para economizar espaço e tempo

echo "🚀 Iniciando cópia das aplicações..."

BASE_DIR="/Users/marcioscartozzoni/Downloads"
TARGET_DIR="$BASE_DIR/Portal-Clinic-Unified/apps"

# Função para copiar aplicação
copy_app() {
    local src=$1
    local dest=$2
    local name=$3
    
    echo ""
    echo "📦 Copiando $name..."
    rsync -a \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='dist' \
        --exclude='build' \
        --exclude='.DS_Store' \
        "$src/" "$dest/"
    
    if [ $? -eq 0 ]; then
        echo "✅ $name copiado com sucesso"
    else
        echo "❌ Erro ao copiar $name"
        return 1
    fi
}

# Copiar cada aplicação
copy_app "$BASE_DIR/Portal-Clinic-Bot" "$TARGET_DIR/bot" "Portal-Clinic-Bot"
copy_app "$BASE_DIR/Portal-Api-38325f55-8074-4477-941b-770c4b661777" "$TARGET_DIR/api" "Portal-Api"
copy_app "$BASE_DIR/Portal-Medico39a7f0d8-ec20-48ff-a6d8-8134b005225f" "$TARGET_DIR/medico" "Portal-Medico"
copy_app "$BASE_DIR/Portal-Paciente-a08ef2bf-27f1-42ac-af5a-ab368c23e153" "$TARGET_DIR/paciente" "Portal-Paciente"
copy_app "$BASE_DIR/Portal-Financeiro-547f3fdb-e880-4a16-9016-49dd1ae25608" "$TARGET_DIR/financeiro" "Portal-Financeiro"
copy_app "$BASE_DIR/Portal-Orcamento-cc24dc13-621f-458b-ac99-3e880bab10b0" "$TARGET_DIR/orcamento" "Portal-Orcamento"

echo ""
echo "✨ Cópia concluída!"
echo ""
echo "📊 Estrutura criada:"
ls -lh "$TARGET_DIR"
