/**
 * Portal Clinic - PDF Service
 * Geração de PDFs profissionais para:
 * - Orçamentos
 * - Relatórios médicos
 * - Formulários de consentimento
 * - Recibos e comprovantes
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { sendEmail } = require('./emailService');

// Diretório temporário para PDFs
const PDF_TEMP_DIR = '/tmp/portal-clinic-pdfs';
if (!fs.existsSync(PDF_TEMP_DIR)) {
  fs.mkdirSync(PDF_TEMP_DIR, { recursive: true });
}

/**
 * Gera PDF de Orçamento usando PDFKit
 */
async function gerarOrcamentoPDF(dados) {
  return new Promise((resolve, reject) => {
    try {
      const filename = `orcamento-${dados.id || Date.now()}.pdf`;
      const filepath = path.join(PDF_TEMP_DIR, filename);
      const doc = new PDFDocument({ margin: 50 });
      
      doc.pipe(fs.createWriteStream(filepath));

      // Header
      doc.fontSize(20).text('ORÇAMENTO', { align: 'center' });
      doc.fontSize(10).text('Dr. Márcio Scartozzoni', { align: 'center' });
      doc.text('CRM 123456 - Cirurgia Plástica', { align: 'center' });
      doc.moveDown();

      // Linha divisória
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Dados do Paciente
      doc.fontSize(14).text('DADOS DO PACIENTE', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);
      doc.text(`Nome: ${dados.paciente.nome}`);
      doc.text(`CPF: ${dados.paciente.cpf || 'Não informado'}`);
      doc.text(`Telefone: ${dados.paciente.telefone}`);
      doc.text(`Email: ${dados.paciente.email}`);
      doc.moveDown();

      // Procedimentos
      doc.fontSize(14).text('PROCEDIMENTOS', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);

      let total = 0;
      dados.procedimentos.forEach((proc, index) => {
        doc.text(`${index + 1}. ${proc.nome}`);
        doc.text(`   Valor: R$ ${proc.valor.toFixed(2).replace('.', ',')}`, { indent: 20 });
        if (proc.observacoes) {
          doc.text(`   Obs: ${proc.observacoes}`, { indent: 20 });
        }
        doc.moveDown(0.5);
        total += proc.valor;
      });

      // Total
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);
      doc.fontSize(14).text(`VALOR TOTAL: R$ ${total.toFixed(2).replace('.', ',')}`, { align: 'right' });
      doc.moveDown();

      // Formas de pagamento
      if (dados.formasPagamento && dados.formasPagamento.length > 0) {
        doc.fontSize(12).text('FORMAS DE PAGAMENTO:', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10);
        dados.formasPagamento.forEach(forma => {
          doc.text(`• ${forma}`);
        });
        doc.moveDown();
      }

      // Observações
      if (dados.observacoes) {
        doc.fontSize(12).text('OBSERVAÇÕES:', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).text(dados.observacoes);
        doc.moveDown();
      }

      // Validade
      doc.fontSize(10).text(`Validade: ${dados.validade || '30 dias'}`, { align: 'center' });
      doc.moveDown();

      // Footer
      doc.fontSize(8).text(
        'Este orçamento não constitui compromisso de realização do procedimento. Valores sujeitos a alteração.',
        { align: 'center', color: 'gray' }
      );

      doc.end();

      doc.on('finish', () => {
        resolve({ success: true, filepath, filename });
      });

      doc.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Gera PDF de Relatório Médico
 */
async function gerarRelatorioMedicoPDF(dados) {
  return new Promise((resolve, reject) => {
    try {
      const filename = `relatorio-${dados.id || Date.now()}.pdf`;
      const filepath = path.join(PDF_TEMP_DIR, filename);
      const doc = new PDFDocument({ margin: 50 });
      
      doc.pipe(fs.createWriteStream(filepath));

      // Header
      doc.fontSize(20).text('RELATÓRIO MÉDICO', { align: 'center' });
      doc.fontSize(10).text('Dr. Márcio Scartozzoni', { align: 'center' });
      doc.text('CRM 123456 - Cirurgia Plástica', { align: 'center' });
      doc.moveDown();

      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Data
      doc.fontSize(10).text(`Data: ${dados.data || new Date().toLocaleDateString('pt-BR')}`, { align: 'right' });
      doc.moveDown();

      // Paciente
      doc.fontSize(14).text('PACIENTE', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);
      doc.text(`Nome: ${dados.paciente.nome}`);
      doc.text(`Data de Nascimento: ${dados.paciente.dataNascimento || 'Não informado'}`);
      doc.text(`CPF: ${dados.paciente.cpf || 'Não informado'}`);
      doc.moveDown();

      // Anamnese
      if (dados.anamnese) {
        doc.fontSize(14).text('ANAMNESE', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).text(dados.anamnese);
        doc.moveDown();
      }

      // Exame físico
      if (dados.exame) {
        doc.fontSize(14).text('EXAME FÍSICO', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).text(dados.exame);
        doc.moveDown();
      }

      // Diagnóstico
      if (dados.diagnostico) {
        doc.fontSize(14).text('DIAGNÓSTICO', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).text(dados.diagnostico);
        doc.moveDown();
      }

      // Conduta
      if (dados.conduta) {
        doc.fontSize(14).text('CONDUTA', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10).text(dados.conduta);
        doc.moveDown();
      }

      // Assinatura
      doc.moveDown(3);
      doc.moveTo(200, doc.y).lineTo(400, doc.y).stroke();
      doc.moveDown(0.5);
      doc.fontSize(10).text('Dr. Márcio Scartozzoni', { align: 'center' });
      doc.text('CRM 123456', { align: 'center' });

      doc.end();

      doc.on('finish', () => {
        resolve({ success: true, filepath, filename });
      });

      doc.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Gera PDF de Termo de Consentimento
 */
async function gerarTermoConsentimentoPDF(dados) {
  return new Promise((resolve, reject) => {
    try {
      const filename = `termo-consentimento-${dados.id || Date.now()}.pdf`;
      const filepath = path.join(PDF_TEMP_DIR, filename);
      const doc = new PDFDocument({ margin: 50 });
      
      doc.pipe(fs.createWriteStream(filepath));

      // Header
      doc.fontSize(18).text('TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(dados.procedimento.toUpperCase(), { align: 'center', underline: true });
      doc.moveDown(2);

      // Conteúdo
      doc.fontSize(10);
      
      doc.text('Eu, ', { continued: true });
      doc.text(dados.paciente.nome, { underline: true, continued: true });
      doc.text(`, portador(a) do CPF ${dados.paciente.cpf}, declaro que:`);
      doc.moveDown();

      const declaracoes = [
        'Fui devidamente informado(a) sobre o procedimento cirúrgico a ser realizado, seus benefícios, riscos e possíveis complicações.',
        'Tive oportunidade de esclarecer todas as minhas dúvidas com o médico cirurgião.',
        'Estou ciente de que o resultado pode variar de pessoa para pessoa.',
        'Autorizo a realização de fotografias para fins de documentação médica.',
        'Comprometo-me a seguir todas as orientações pré e pós-operatórias.',
      ];

      declaracoes.forEach((item, index) => {
        doc.text(`${index + 1}. ${item}`);
        doc.moveDown(0.5);
      });

      doc.moveDown(2);

      // Assinaturas
      doc.text(`Local: __________________ Data: ___/___/______`);
      doc.moveDown(3);

      doc.moveTo(50, doc.y).lineTo(250, doc.y).stroke();
      doc.text('Assinatura do Paciente', 50, doc.y + 5);
      
      doc.moveTo(300, doc.y - 5).lineTo(500, doc.y - 5).stroke();
      doc.text('Dr. Márcio Scartozzoni - CRM 123456', 300, doc.y + 5);

      doc.end();

      doc.on('finish', () => {
        resolve({ success: true, filepath, filename });
      });

      doc.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Gera PDF de Recibo
 */
async function gerarReciboPDF(dados) {
  return new Promise((resolve, reject) => {
    try {
      const filename = `recibo-${dados.id || Date.now()}.pdf`;
      const filepath = path.join(PDF_TEMP_DIR, filename);
      const doc = new PDFDocument({ margin: 50 });
      
      doc.pipe(fs.createWriteStream(filepath));

      // Header
      doc.fontSize(20).text('RECIBO', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Nº ${dados.numero || Math.floor(Math.random() * 10000)}`, { align: 'right' });
      doc.moveDown();

      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Valor
      doc.fontSize(14);
      doc.text(`Valor: R$ ${dados.valor.toFixed(2).replace('.', ',')}`, { align: 'center' });
      doc.moveDown(2);

      // Texto
      doc.fontSize(11);
      const valorExtenso = dados.valorExtenso || 'valor por extenso';
      doc.text(`Recebi de ${dados.pagador.nome}, inscrito(a) no CPF ${dados.pagador.cpf || 'não informado'}, a quantia de ${valorExtenso} (R$ ${dados.valor.toFixed(2).replace('.', ',')}) referente a ${dados.referente}.`);
      doc.moveDown(2);

      // Data e local
      doc.fontSize(10);
      doc.text(`${dados.local || 'São Paulo'}, ${dados.data || new Date().toLocaleDateString('pt-BR')}`);
      doc.moveDown(3);

      // Assinatura
      doc.moveTo(200, doc.y).lineTo(400, doc.y).stroke();
      doc.moveDown(0.5);
      doc.text('Dr. Márcio Scartozzoni', { align: 'center' });
      doc.text('CRM 123456 - CPF: XXX.XXX.XXX-XX', { align: 'center' });

      doc.end();

      doc.on('finish', () => {
        resolve({ success: true, filepath, filename });
      });

      doc.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Gera PDF a partir de HTML usando Puppeteer
 */
async function gerarPDFdeHTML(html, options = {}) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const filename = options.filename || `documento-${Date.now()}.pdf`;
    const filepath = path.join(PDF_TEMP_DIR, filename);
    
    await page.pdf({
      path: filepath,
      format: options.format || 'A4',
      printBackground: true,
      margin: options.margin || { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });
    
    await browser.close();
    
    return { success: true, filepath, filename };
  } catch (error) {
    await browser.close();
    throw error;
  }
}

/**
 * Envia PDF por email
 */
async function enviarPDFporEmail(pdfPath, destinatario, assunto, mensagem) {
  try {
    const result = await sendEmail({
      to: destinatario,
      subject: assunto,
      html: mensagem,
      attachments: [
        {
          filename: path.basename(pdfPath),
          path: pdfPath
        }
      ]
    });
    
    return result;
  } catch (error) {
    throw new Error(`Erro ao enviar PDF por email: ${error.message}`);
  }
}

/**
 * Limpa PDFs antigos (mais de 24h)
 */
function limparPDFsAntigos() {
  try {
    const files = fs.readdirSync(PDF_TEMP_DIR);
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    files.forEach(file => {
      const filepath = path.join(PDF_TEMP_DIR, file);
      const stats = fs.statSync(filepath);
      
      if (now - stats.mtimeMs > oneDayMs) {
        fs.unlinkSync(filepath);
        console.log(`PDF antigo removido: ${file}`);
      }
    });
  } catch (error) {
    console.error('Erro ao limpar PDFs antigos:', error);
  }
}

// Limpar PDFs antigos a cada 6 horas
setInterval(limparPDFsAntigos, 6 * 60 * 60 * 1000);

module.exports = {
  gerarOrcamentoPDF,
  gerarRelatorioMedicoPDF,
  gerarTermoConsentimentoPDF,
  gerarReciboPDF,
  gerarPDFdeHTML,
  enviarPDFporEmail,
  limparPDFsAntigos,
  PDF_TEMP_DIR
};
