const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');

// Diretório para PDFs temporários
const PDF_DIR = '/tmp/portal-clinic-pdfs';

// Criar diretório se não existir
if (!fs.existsSync(PDF_DIR)) {
  fs.mkdirSync(PDF_DIR, { recursive: true });
}

// Configurar transporter de email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true' || true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

/**
 * Gera um orçamento em PDF
 */
async function gerarOrcamentoPDF(dados) {
  return new Promise((resolve, reject) => {
    try {
      const filename = `orcamento-${dados.id || Date.now()}.pdf`;
      const filepath = path.join(PDF_DIR, filename);
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Cabeçalho
      doc.fontSize(20).text('ORÇAMENTO', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Orçamento Nº: ${dados.id || 'N/A'}`, { align: 'center' });
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
      doc.moveDown(2);

      // Dados do Paciente
      doc.fontSize(14).text('Dados do Paciente', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);
      doc.text(`Nome: ${dados.paciente.nome}`);
      doc.text(`CPF: ${dados.paciente.cpf}`);
      doc.text(`Telefone: ${dados.paciente.telefone}`);
      if (dados.paciente.email) {
        doc.text(`Email: ${dados.paciente.email}`);
      }
      doc.moveDown(2);

      // Procedimentos
      doc.fontSize(14).text('Procedimentos', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);

      let total = 0;
      dados.procedimentos.forEach((proc, index) => {
        doc.text(`${index + 1}. ${proc.nome} - R$ ${proc.valor.toFixed(2).replace('.', ',')}`);
        if (proc.observacoes) {
          doc.fontSize(9).fillColor('#666666');
          doc.text(`   ${proc.observacoes}`, { indent: 20 });
          doc.fillColor('#000000').fontSize(10);
        }
        total += proc.valor;
      });

      doc.moveDown();
      doc.fontSize(12).text(`TOTAL: R$ ${total.toFixed(2).replace('.', ',')}`, { align: 'right' });
      doc.moveDown(2);

      // Formas de Pagamento
      if (dados.formasPagamento && dados.formasPagamento.length > 0) {
        doc.fontSize(14).text('Formas de Pagamento', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10);
        dados.formasPagamento.forEach(forma => {
          doc.text(`• ${forma}`);
        });
        doc.moveDown(2);
      }

      // Observações
      if (dados.observacoes) {
        doc.fontSize(14).text('Observações', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).text(dados.observacoes);
        doc.moveDown(2);
      }

      // Validade
      if (dados.validade) {
        doc.fontSize(9).fillColor('#666666');
        doc.text(`Validade deste orçamento: ${dados.validade}`, { align: 'center' });
      }

      doc.end();

      stream.on('finish', () => {
        resolve({ filepath, filename });
      });

      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Gera um relatório médico em PDF
 */
async function gerarRelatorioPDF(dados) {
  return new Promise((resolve, reject) => {
    try {
      const filename = `relatorio-${dados.id || Date.now()}.pdf`;
      const filepath = path.join(PDF_DIR, filename);
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Cabeçalho
      doc.fontSize(20).text('RELATÓRIO MÉDICO', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Relatório Nº: ${dados.id || 'N/A'}`, { align: 'center' });
      doc.text(`Data: ${dados.data || new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
      doc.moveDown(2);

      // Dados do Paciente
      doc.fontSize(14).text('Identificação do Paciente', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);
      doc.text(`Nome: ${dados.paciente.nome}`);
      if (dados.paciente.dataNascimento) {
        doc.text(`Data de Nascimento: ${dados.paciente.dataNascimento}`);
      }
      if (dados.paciente.cpf) {
        doc.text(`CPF: ${dados.paciente.cpf}`);
      }
      doc.moveDown(2);

      // Anamnese
      if (dados.anamnese) {
        doc.fontSize(14).text('Anamnese', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).text(dados.anamnese, { align: 'justify' });
        doc.moveDown(2);
      }

      // Exame Físico
      if (dados.exame) {
        doc.fontSize(14).text('Exame Físico', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).text(dados.exame, { align: 'justify' });
        doc.moveDown(2);
      }

      // Diagnóstico
      if (dados.diagnostico) {
        doc.fontSize(14).text('Diagnóstico', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).text(dados.diagnostico, { align: 'justify' });
        doc.moveDown(2);
      }

      // Conduta
      if (dados.conduta) {
        doc.fontSize(14).text('Conduta', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).text(dados.conduta, { align: 'justify' });
        doc.moveDown(2);
      }

      // Assinatura
      doc.moveDown(3);
      doc.fontSize(10).text('_'.repeat(50), { align: 'center' });
      doc.text('Assinatura do Médico', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve({ filepath, filename });
      });

      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Gera um termo de consentimento em PDF
 */
async function gerarTermoPDF(dados) {
  return new Promise((resolve, reject) => {
    try {
      const filename = `termo-${dados.id || Date.now()}.pdf`;
      const filepath = path.join(PDF_DIR, filename);
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Cabeçalho
      doc.fontSize(18).text('TERMO DE CONSENTIMENTO INFORMADO', { align: 'center' });
      doc.moveDown(2);

      // Dados
      doc.fontSize(12).text(`Procedimento: ${dados.procedimento}`);
      doc.moveDown();
      doc.text(`Paciente: ${dados.paciente.nome}`);
      doc.text(`CPF: ${dados.paciente.cpf}`);
      doc.moveDown(2);

      // Texto padrão
      doc.fontSize(10);
      doc.text('Declaro que fui informado(a) de forma clara e detalhada sobre:', { align: 'justify' });
      doc.moveDown(0.5);
      doc.text('• Os objetivos, benefícios e riscos do procedimento proposto;', { indent: 20 });
      doc.text('• As alternativas de tratamento disponíveis;', { indent: 20 });
      doc.text('• Os cuidados pré e pós-operatórios necessários;', { indent: 20 });
      doc.text('• As possíveis complicações e seus respectivos tratamentos;', { indent: 20 });
      doc.text('• A necessidade de seguir todas as orientações médicas.', { indent: 20 });
      doc.moveDown(2);

      doc.text('Todas as minhas dúvidas foram esclarecidas e autorizo a realização do procedimento.', { align: 'justify' });
      doc.moveDown(4);

      // Assinaturas
      doc.text('_'.repeat(40));
      doc.text('Assinatura do Paciente');
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`);
      doc.moveDown(2);

      doc.text('_'.repeat(40));
      doc.text('Assinatura do Médico');
      doc.text('CRM: _______________');

      doc.end();

      stream.on('finish', () => {
        resolve({ filepath, filename });
      });

      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Gera um recibo em PDF
 */
async function gerarReciboPDF(dados) {
  return new Promise((resolve, reject) => {
    try {
      const filename = `recibo-${dados.numero || Date.now()}.pdf`;
      const filepath = path.join(PDF_DIR, filename);
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Cabeçalho
      doc.fontSize(22).text('RECIBO', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Nº ${dados.numero}`, { align: 'center' });
      doc.moveDown(2);

      // Valor
      doc.fontSize(14).text(`Valor: R$ ${dados.valor.toFixed(2).replace('.', ',')}`, { align: 'center' });
      doc.fontSize(10).text(`(${dados.valorExtenso})`, { align: 'center' });
      doc.moveDown(2);

      // Dados
      doc.fontSize(12);
      doc.text('Recebemos de:', { continued: false });
      doc.fontSize(10);
      doc.text(`Nome: ${dados.pagador.nome}`);
      doc.text(`CPF: ${dados.pagador.cpf}`);
      doc.moveDown();

      doc.fontSize(12).text('Referente a:', { continued: false });
      doc.fontSize(10).text(dados.referente);
      doc.moveDown(2);

      // Local e data
      doc.text(`${dados.local || 'São Paulo'}, ${dados.data || new Date().toLocaleDateString('pt-BR')}`);
      doc.moveDown(3);

      // Assinatura
      doc.text('_'.repeat(50), { align: 'center' });
      doc.text('Assinatura', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve({ filepath, filename });
      });

      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Gera PDF a partir de HTML usando Puppeteer
 */
async function gerarPDFHTML(dados) {
  const filename = dados.filename || `documento-${Date.now()}.pdf`;
  const filepath = path.join(PDF_DIR, filename);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(dados.html);
  await page.pdf({
    path: filepath,
    format: 'A4',
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm'
    }
  });

  await browser.close();

  return { filepath, filename };
}

/**
 * Envia PDF por email
 */
async function enviarPDFEmail(filepath, destinatario, assunto, mensagem) {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'Portal Clinic <noreply@portal-clinic.com>',
    to: destinatario,
    subject: assunto,
    text: mensagem,
    html: `<p>${mensagem}</p>`,
    attachments: [
      {
        filename: path.basename(filepath),
        path: filepath
      }
    ]
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Limpa PDFs antigos (mais de 24 horas)
 */
function limparPDFsAntigos() {
  const files = fs.readdirSync(PDF_DIR);
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 horas

  files.forEach(file => {
    const filepath = path.join(PDF_DIR, file);
    const stats = fs.statSync(filepath);
    const age = now - stats.mtimeMs;

    if (age > maxAge) {
      fs.unlinkSync(filepath);
      console.log(`PDF antigo removido: ${file}`);
    }
  });
}

// Executar limpeza a cada 6 horas
setInterval(limparPDFsAntigos, 6 * 60 * 60 * 1000);

module.exports = {
  gerarOrcamentoPDF,
  gerarRelatorioPDF,
  gerarTermoPDF,
  gerarReciboPDF,
  gerarPDFHTML,
  enviarPDFEmail,
  limparPDFsAntigos
};
