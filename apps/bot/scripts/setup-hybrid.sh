#!/bin/bash

# Portal Clinic Bot - Setup da Integração Híbrida
# Este script configura automaticamente a integração entre Google Sheets e Supabase

echo "🚀 Portal Clinic Bot - Setup da Integração Híbrida"
echo "=================================================="
echo ""

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm encontrados"
echo ""

# Criar diretórios necessários se não existirem
echo "📁 Criando estrutura de diretórios..."
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/components
mkdir -p scripts
mkdir -p docs

# Instalar dependências
echo "📦 Instalando dependências..."
echo ""

# Dependências principais
npm install google-auth-library google-spreadsheet

# Dependências de desenvolvimento
npm install --save-dev @types/uuid typescript

# Verificar se todas as dependências foram instaladas
echo ""
echo "🔍 Verificando instalação das dependências..."
echo ""

# Verificar Google Sheets
if npm list google-auth-library google-spreadsheet &> /dev/null; then
    echo "✅ Google Sheets API instalada com sucesso"
else
    echo "❌ Erro ao instalar Google Sheets API"
    exit 1
fi

# Verificar TypeScript
if npm list @types/uuid typescript &> /dev/null; then
    echo "✅ TypeScript dependências instaladas com sucesso"
else
    echo "❌ Erro ao instalar dependências TypeScript"
    exit 1
fi

echo ""
echo "🎉 Instalação das dependências concluída!"
echo ""

# Verificar configuração do .env
echo "⚙️ Verificando configuração do ambiente..."

if [ ! -f ".env" ]; then
    echo "⚠️ Arquivo .env não encontrado. Criando template..."
    cat > .env.template << 'EOF'
# Google Sheets Configuration
VITE_GOOGLE_SHEET_ID=sua_planilha_id_aqui
VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=email@projeto.iam.gserviceaccount.com
VITE_GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
COLE_SUA_CHAVE_PRIVADA_AQUI
-----END PRIVATE KEY-----"

# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui

# Other configurations...
EOF
    echo "📝 Template .env.template criado. Copie para .env e configure suas credenciais."
else
    echo "✅ Arquivo .env encontrado"
    
    # Verificar se as variáveis necessárias estão configuradas
    if grep -q "VITE_GOOGLE_SHEET_ID" .env && grep -q "VITE_SUPABASE_URL" .env; then
        echo "✅ Variáveis de ambiente configuradas"
    else
        echo "⚠️ Algumas variáveis de ambiente podem estar faltando. Verifique o arquivo .env"
    fi
fi

echo ""

# Verificar estrutura dos arquivos criados
echo "📋 Verificando arquivos da integração híbrida..."

files_to_check=(
    "src/services/HybridDataService.ts"
    "src/services/GoogleSheetsService.ts"
    "src/hooks/useHybridData.ts"
    "src/components/HybridConnectionStatus.jsx"
    "src/components/HybridApiDemo.jsx"
    "HYBRID-INTEGRATION.md"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (não encontrado)"
    fi
done

echo ""
echo "🚀 Setup da Integração Híbrida concluído!"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. 📝 Configure as credenciais no arquivo .env:"
echo "   - VITE_GOOGLE_SHEET_ID (ID da sua planilha Google)"
echo "   - VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL (Email da Service Account)"
echo "   - VITE_GOOGLE_PRIVATE_KEY (Chave privada da Service Account)"
echo "   - VITE_SUPABASE_URL (URL do seu projeto Supabase)"
echo "   - VITE_SUPABASE_ANON_KEY (Chave anônima do Supabase)"
echo ""
echo "2. 🗃️ Configure o Google Sheets:"
echo "   - Crie uma planilha no Google Sheets"
echo "   - Compartilhe com o email da Service Account (permissão Editor)"
echo "   - Copie o ID da planilha para VITE_GOOGLE_SHEET_ID"
echo ""
echo "3. 🗄️ Configure o Supabase:"
echo "   - Acesse https://supabase.com/"
echo "   - Crie um projeto ou use existente"
echo "   - Copie a URL e chave anônima para o .env"
echo ""
echo "4. 🖥️ Inicie o servidor de desenvolvimento:"
echo "   npm run dev"
echo ""
echo "5. 🔧 Teste a integração:"
echo "   - Acesse 'Configurações > Sistema Híbrido'"
echo "   - Verifique o status das conexões"
echo "   - Use a aba 'Demo da API' para testar"
echo ""
echo "📚 Documentação:"
echo "   - Leia HYBRID-INTEGRATION.md para detalhes completos"
echo "   - Acesse 'Configurações > Sistema Híbrido' no painel"
echo ""
echo "🆘 Suporte:"
echo "   - Verifique os logs do navegador para erros"
echo "   - Consulte a seção Troubleshooting no HYBRID-INTEGRATION.md"
echo ""
echo "🎉 Parabéns! Seu Portal Clinic Bot está pronto para a arquitetura híbrida!"
