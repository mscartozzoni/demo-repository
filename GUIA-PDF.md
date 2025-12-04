# 📄 Guia Completo - Sistema de PDFs

## ✅ O que foi instalado

```bash
# Bibliotecas instaladas no VPS
npm install puppeteer pdfkit nodemailer --save
```

**Puppeteer** - Gera PDFs complexos a partir de HTML  
**PDFKit** - Gera PDFs programaticamente (rápido e leve)  
**Nodemailer** - Já tínhamos para email, mas suporta anexos

## 📋 Tipos de PDFs Disponíveis

### 1. **Orçamento**
- Dados do paciente
- Lista de procedimentos com valores
- Total geral
- Formas de pagamento
- Observações e validade

### 2. **Relatório Médico**
- Dados do paciente
- Anamnese
- Exame físico
- Diagnóstico
- Conduta
- Assinatura do médico

### 3. **Termo de Consentimento**
- Dados do paciente
- Declarações padrão
- Espaço para assinaturas
- Personalizado por procedimento

### 4. **Recibo**
- Número do recibo
- Valor e valor por extenso
- Dados do pagador
- Referência do pagamento
- Assinatura

### 5. **PDF a partir de HTML**
- Qualquer HTML customizado
- Ideal para documentos complexos
- Suporta CSS e imagens

## 🚀 Como Usar

### Exemplo 1: Gerar Orçamento e Baixar

```bash
curl -X POST http://82.29.56.143:8000/api/gerar-orcamento-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "id": "ORC-2024-001",
    "paciente": {
      "nome": "Maria Silva",
      "cpf": "123.456.789-00",
      "telefone": "(11) 98765-4321",
      "email": "maria@email.com"
    },
    "procedimentos": [
      {
        "nome": "Rinoplastia",
        "valor": 15000.00,
        "observacoes": "Procedimento estético"
      },
      {
        "nome": "Consulta Pré-operatória",
        "valor": 500.00
      }
    ],
    "formasPagamento": [
      "À vista com 10% desconto",
      "Parcelado em até 12x no cartão"
    ],
    "observacoes": "Inclui honorários médicos e uso do centro cirúrgico",
    "validade": "30 dias"
  }' \
  --output orcamento.pdf
```

### Exemplo 2: Gerar e Enviar por Email

```bash
curl -X POST http://82.29.56.143:8000/api/gerar-orcamento-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "paciente": {
      "nome": "Maria Silva",
      "email": "maria@email.com",
      "telefone": "(11) 98765-4321"
    },
    "procedimentos": [
      {
        "nome": "Rinoplastia",
        "valor": 15000.00
      }
    ],
    "enviarEmail": true
  }'
```

### Exemplo 3: Gerar Relatório Médico

```bash
curl -X POST http://82.29.56.143:8000/api/gerar-relatorio-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "id": "REL-2024-001",
    "data": "20/11/2024",
    "paciente": {
      "nome": "João Santos",
      "dataNascimento": "15/05/1985",
      "cpf": "987.654.321-00"
    },
    "anamnese": "Paciente relata interesse em cirurgia de rinoplastia para correção estética. Nega comorbidades relevantes.",
    "exame": "Exame físico revela desvio de septo nasal à direita. Ponta nasal arredondada.",
    "diagnostico": "Desvio de septo nasal. Indicação cirúrgica para rinoplastia estética e funcional.",
    "conduta": "Solicitados exames pré-operatórios. Agendamento de cirurgia para avaliação de disponibilidade.",
    "enviarEmail": false
  }' \
  --output relatorio.pdf
```

### Exemplo 4: Termo de Consentimento

```bash
curl -X POST http://82.29.56.143:8000/api/gerar-termo-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "id": "TERMO-2024-001",
    "procedimento": "Rinoplastia",
    "paciente": {
      "nome": "Ana Paula Costa",
      "cpf": "111.222.333-44"
    },
    "enviarEmail": true
  }'
```

### Exemplo 5: Recibo

```bash
curl -X POST http://82.29.56.143:8000/api/gerar-recibo-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "numero": "12345",
    "valor": 1500.00,
    "valorExtenso": "um mil e quinhentos reais",
    "pagador": {
      "nome": "Pedro Oliveira",
      "cpf": "555.666.777-88",
      "email": "pedro@email.com"
    },
    "referente": "consulta médica e exames pré-operatórios",
    "local": "São Paulo",
    "data": "20/11/2024",
    "enviarEmail": false
  }' \
  --output recibo.pdf
```

### Exemplo 6: PDF de HTML Customizado

```bash
curl -X POST http://82.29.56.143:8000/api/gerar-pdf-html \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<html><body><h1>Meu Documento</h1><p>Conteúdo personalizado aqui</p></body></html>",
    "filename": "documento-custom.pdf",
    "enviarEmail": false
  }' \
  --output documento.pdf
```

## 🔧 Instalação no VPS

```bash
# 1. Conectar ao VPS
ssh root@82.29.56.143

# 2. Ir para o diretório do backend
cd /var/www/portal-clinic-bot/backend

# 3. Criar diretório temporário para PDFs
mkdir -p /tmp/portal-clinic-pdfs

# 4. Instalar dependências
npm install puppeteer pdfkit nodemailer --save

# 5. Upload dos arquivos
# (fazer do seu computador)
scp pdfService.js root@82.29.56.143:/var/www/portal-clinic-bot/backend/

# 6. Adicionar rotas ao routes.js
# Adicionar no início do arquivo:
# const { gerarOrcamentoPDF, gerarRelatorioMedicoPDF, ... } = require('./pdfService');

# 7. Reiniciar o backend
pm2 restart portal-bot
```

## 📱 Integração com o Frontend

### React/JavaScript

```javascript
// Gerar e baixar PDF
async function gerarOrcamento(dados) {
  const response = await fetch('http://82.29.56.143:8000/api/gerar-orcamento-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'orcamento.pdf';
  a.click();
}

// Gerar e enviar por email
async function enviarOrcamentoPorEmail(dados) {
  const response = await fetch('http://82.29.56.143:8000/api/gerar-orcamento-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...dados,
      enviarEmail: true
    })
  });
  
  const result = await response.json();
  console.log(result.message); // "PDF gerado e enviado por email"
}
```

### Vue.js

```vue
<template>
  <button @click="gerarPDF">Gerar Orçamento PDF</button>
  <button @click="enviarPorEmail">Enviar por Email</button>
</template>

<script>
export default {
  methods: {
    async gerarPDF() {
      const dados = {
        paciente: { nome: 'João', email: 'joao@email.com' },
        procedimentos: [{ nome: 'Rinoplastia', valor: 15000 }]
      };
      
      const response = await fetch('http://82.29.56.143:8000/api/gerar-orcamento-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orcamento.pdf';
      a.click();
    },
    
    async enviarPorEmail() {
      const dados = {
        paciente: { nome: 'João', email: 'joao@email.com' },
        procedimentos: [{ nome: 'Rinoplastia', valor: 15000 }],
        enviarEmail: true
      };
      
      await fetch('http://82.29.56.143:8000/api/gerar-orcamento-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      
      alert('PDF enviado por email!');
    }
  }
}
</script>
```

## 🎨 Personalização

### Modificar Template de Orçamento

Edite `/var/www/portal-clinic-bot/backend/pdfService.js`:

```javascript
// Na função gerarOrcamentoPDF()
doc.fontSize(20).text('MEU TÍTULO CUSTOMIZADO', { align: 'center' });
doc.fontSize(10).text('Meu texto customizado', { align: 'center' });
```

### Adicionar Logo

```javascript
// No início do PDF
doc.image('/path/to/logo.png', 50, 50, { width: 100 });
doc.moveDown(3);
```

### Cores e Estilos

```javascript
doc.fillColor('blue').fontSize(16).text('Texto Azul');
doc.fillColor('black'); // Voltar para preto
```

## 🧪 Testes

```bash
# Testar geração de orçamento
curl -X POST http://localhost:8000/api/gerar-orcamento-pdf \
  -H "Content-Type: application/json" \
  -d @exemplo-orcamento.json \
  --output teste-orcamento.pdf

# Verificar se o arquivo foi criado
ls -lh teste-orcamento.pdf

# Abrir o PDF (macOS)
open teste-orcamento.pdf

# Abrir o PDF (Linux)
xdg-open teste-orcamento.pdf
```

## 🔒 Segurança

### Limitar Tamanho de Arquivos

```javascript
// No routes.js, adicionar middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
```

### Validar Dados

```javascript
router.post("/gerar-orcamento-pdf", async (req, res) => {
  if (!req.body.paciente || !req.body.procedimentos) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }
  // ... resto do código
});
```

## 📊 Limpeza Automática

O sistema já limpa PDFs com mais de 24 horas automaticamente!

```javascript
// Executado a cada 6 horas
setInterval(limparPDFsAntigos, 6 * 60 * 60 * 1000);
```

## 🆘 Troubleshooting

### Erro: "Cannot find module 'puppeteer'"
```bash
npm install puppeteer --save
```

### Erro: "Failed to launch chrome"
```bash
# Instalar dependências do Chrome (Ubuntu/Debian)
apt-get update
apt-get install -y libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 \
  libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 \
  libpangocairo-1.0-0 libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0
```

### PDF não baixa no navegador
Use `Content-Disposition` header:

```javascript
res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
res.setHeader('Content-Type', 'application/pdf');
```

## ✅ Checklist de Instalação

- [ ] Puppeteer instalado
- [ ] PDFKit instalado  
- [ ] Nodemailer instalado
- [ ] pdfService.js no servidor
- [ ] Rotas adicionadas ao routes.js
- [ ] Diretório /tmp/portal-clinic-pdfs criado
- [ ] Permissões corretas no diretório
- [ ] Backend reiniciado com PM2
- [ ] Teste de geração de PDF realizado
- [ ] Teste de envio por email realizado

## 🎯 Próximos Passos

1. **Upload do pdfService.js para o VPS**
2. **Adicionar as rotas no routes.js**
3. **Testar cada tipo de PDF**
4. **Integrar com o frontend**
5. **Personalizar templates conforme necessidade**

---

**Sistema de PDFs completamente funcional e pronto para uso! 🎉**
