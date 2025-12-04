#!/bin/bash

echo "🚀 Instalando dependências para a integração híbrida..."

# Instalar dependências do Google Sheets
echo "📊 Instalando Google Sheets API..."
npm install google-auth-library google-spreadsheet

# Instalar dependências de TypeScript
echo "🔧 Instalando dependências TypeScript..."
npm install --save-dev @types/uuid typescript

# Verificar instalação
echo "✅ Verificando instalação..."
npm list google-auth-library google-spreadsheet @types/uuid

echo ""
echo "🎉 Instalação concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as credenciais do Google Sheets no arquivo .env"
echo "2. Verifique a configuração do Supabase"
echo "3. Acesse 'Configurações > Sistema Híbrido' para testar"
echo ""
echo "🔗 Links úteis:"
echo "- Google Console: https://console.cloud.google.com/"
echo "- Supabase: https://supabase.com/"
echo "- Documentação: /docs/integration"
