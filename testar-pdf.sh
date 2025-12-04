#!/bin/bash

# Script de Teste - Sistema de PDFs Portal Clinic
# Execute: ./testar-pdf.sh

VPS="82.29.56.143"
API="http://$VPS:8000/api"

echo "🧪 TESTE DO SISTEMA DE PDFs - Portal Clinic"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Criar diretório para os PDFs gerados
mkdir -p pdfs-gerados

echo "📋 1. Testando Geração de Orçamento..."
curl -X POST $API/gerar-orcamento-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "id": "ORC-2024-001",
    "paciente": {
      "nome": "Maria Silva Teste",
      "cpf": "123.456.789-00",
      "telefone": "(11) 98765-4321",
      "email": "teste@portalclinic.com"
    },
    "procedimentos": [
      {
        "nome": "Rinoplastia",
        "valor": 15000.00,
        "observacoes": "Procedimento estético completo"
      },
      {
        "nome": "Consulta",
        "valor": 500.00
      }
    ],
    "formasPagamento": [
      "À vista com 10% desconto",
      "Parcelado em até 12x"
    ],
    "observacoes": "Inclui honorários e centro cirúrgico",
    "validade": "30 dias"
  }' \
  --output pdfs-gerados/orcamento.pdf 2>/dev/null

if [ -f "pdfs-gerados/orcamento.pdf" ]; then
  echo "   ✅ Orçamento gerado com sucesso!"
  ls -lh pdfs-gerados/orcamento.pdf
else
  echo "   ❌ Erro ao gerar orçamento"
fi
echo ""

echo "📄 2. Testando Geração de Relatório Médico..."
curl -X POST $API/gerar-relatorio-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "data": "20/11/2024",
    "paciente": {
      "nome": "João Santos Teste",
      "dataNascimento": "15/05/1985",
      "cpf": "987.654.321-00"
    },
    "anamnese": "Paciente relata interesse em rinoplastia estética.",
    "exame": "Exame físico revela desvio de septo nasal.",
    "diagnostico": "Desvio de septo nasal - Indicação cirúrgica",
    "conduta": "Solicitados exames pré-operatórios"
  }' \
  --output pdfs-gerados/relatorio.pdf 2>/dev/null

if [ -f "pdfs-gerados/relatorio.pdf" ]; then
  echo "   ✅ Relatório gerado com sucesso!"
  ls -lh pdfs-gerados/relatorio.pdf
else
  echo "   ❌ Erro ao gerar relatório"
fi
echo ""

echo "📝 3. Testando Geração de Termo de Consentimento..."
curl -X POST $API/gerar-termo-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "procedimento": "Rinoplastia",
    "paciente": {
      "nome": "Ana Paula Teste",
      "cpf": "111.222.333-44"
    }
  }' \
  --output pdfs-gerados/termo.pdf 2>/dev/null

if [ -f "pdfs-gerados/termo.pdf" ]; then
  echo "   ✅ Termo gerado com sucesso!"
  ls -lh pdfs-gerados/termo.pdf
else
  echo "   ❌ Erro ao gerar termo"
fi
echo ""

echo "💰 4. Testando Geração de Recibo..."
curl -X POST $API/gerar-recibo-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "numero": "12345",
    "valor": 1500.00,
    "valorExtenso": "um mil e quinhentos reais",
    "pagador": {
      "nome": "Pedro Oliveira Teste",
      "cpf": "555.666.777-88"
    },
    "referente": "consulta médica",
    "local": "São Paulo",
    "data": "20/11/2024"
  }' \
  --output pdfs-gerados/recibo.pdf 2>/dev/null

if [ -f "pdfs-gerados/recibo.pdf" ]; then
  echo "   ✅ Recibo gerado com sucesso!"
  ls -lh pdfs-gerados/recibo.pdf
else
  echo "   ❌ Erro ao gerar recibo"
fi
echo ""

echo "🌐 5. Testando PDF de HTML Customizado..."
curl -X POST $API/gerar-pdf-html \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<html><head><style>body{font-family:Arial;padding:40px;}h1{color:#2c3e50;}</style></head><body><h1>Documento de Teste</h1><p>Este é um PDF gerado a partir de HTML customizado.</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul></body></html>",
    "filename": "teste-html.pdf"
  }' \
  --output pdfs-gerados/html-custom.pdf 2>/dev/null

if [ -f "pdfs-gerados/html-custom.pdf" ]; then
  echo "   ✅ PDF HTML gerado com sucesso!"
  ls -lh pdfs-gerados/html-custom.pdf
else
  echo "   ❌ Erro ao gerar PDF HTML"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESULTADO DOS TESTES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
ls -lh pdfs-gerados/
echo ""
echo "✅ Todos os PDFs foram salvos em: pdfs-gerados/"
echo ""
echo "🖥️  Para visualizar os PDFs:"
echo "   macOS:   open pdfs-gerados/*.pdf"
echo "   Linux:   xdg-open pdfs-gerados/*.pdf"
echo "   Windows: start pdfs-gerados/*.pdf"
echo ""

# Perguntar se quer testar envio por email
read -p "📧 Deseja testar envio de PDF por email? (s/n): " TESTAR_EMAIL

if [ "$TESTAR_EMAIL" = "s" ]; then
  read -p "Digite seu email: " EMAIL
  
  echo ""
  echo "📧 Enviando orçamento por email para $EMAIL..."
  
  curl -X POST $API/gerar-orcamento-pdf \
    -H "Content-Type: application/json" \
    -d "{
      \"paciente\": {
        \"nome\": \"Teste Email\",
        \"email\": \"$EMAIL\",
        \"telefone\": \"(11) 98765-4321\"
      },
      \"procedimentos\": [
        {
          \"nome\": \"Teste de Envio de PDF\",
          \"valor\": 1000.00
        }
      ],
      \"enviarEmail\": true
    }"
  
  echo ""
  echo "✅ Email enviado! Verifique sua caixa de entrada."
fi

echo ""
echo "🎉 Testes concluídos!"
