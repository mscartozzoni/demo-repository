const express = require('express');
const router = express.Router();
const fs = require('fs');
const {
  gerarOrcamentoPDF,
  gerarRelatorioPDF,
  gerarTermoPDF,
  gerarReciboPDF,
  gerarPDFHTML,
  enviarPDFEmail
} = require('../services/pdfService');

/**
 * POST /api/gerar-orcamento-pdf
 * Gera um orçamento em PDF
 */
router.post('/gerar-orcamento-pdf', async (req, res) => {
  try {
    const dados = req.body;

    // Validar dados mínimos
    if (!dados.paciente || !dados.procedimentos) {
      return res.status(400).json({ error: 'Dados incompletos. Necessário: paciente e procedimentos' });
    }

    // Gerar PDF
    const { filepath, filename } = await gerarOrcamentoPDF(dados);

    // Se solicitado envio por email
    if (dados.enviarEmail && dados.paciente.email) {
      await enviarPDFEmail(
        filepath,
        dados.paciente.email,
        'Seu Orçamento - Portal Clinic',
        `Olá ${dados.paciente.nome},\n\nSegue em anexo o orçamento solicitado.\n\nAtenciosamente,\nEquipe Portal Clinic`
      );

      // Remover arquivo após enviar
      fs.unlinkSync(filepath);

      return res.json({ 
        success: true, 
        message: 'PDF gerado e enviado por email com sucesso',
        filename 
      });
    }

    // Retornar PDF para download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    // Remover arquivo após enviar
    fileStream.on('end', () => {
      fs.unlinkSync(filepath);
    });

  } catch (error) {
    console.error('Erro ao gerar orçamento PDF:', error);
    res.status(500).json({ error: 'Erro ao gerar PDF', details: error.message });
  }
});

/**
 * POST /api/gerar-relatorio-pdf
 * Gera um relatório médico em PDF
 */
router.post('/gerar-relatorio-pdf', async (req, res) => {
  try {
    const dados = req.body;

    if (!dados.paciente) {
      return res.status(400).json({ error: 'Dados do paciente são obrigatórios' });
    }

    const { filepath, filename } = await gerarRelatorioPDF(dados);

    if (dados.enviarEmail && dados.paciente.email) {
      await enviarPDFEmail(
        filepath,
        dados.paciente.email,
        'Relatório Médico - Portal Clinic',
        `Olá ${dados.paciente.nome},\n\nSegue em anexo seu relatório médico.\n\nAtenciosamente,\nEquipe Portal Clinic`
      );

      fs.unlinkSync(filepath);

      return res.json({ 
        success: true, 
        message: 'Relatório gerado e enviado por email com sucesso',
        filename 
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      fs.unlinkSync(filepath);
    });

  } catch (error) {
    console.error('Erro ao gerar relatório PDF:', error);
    res.status(500).json({ error: 'Erro ao gerar PDF', details: error.message });
  }
});

/**
 * POST /api/gerar-termo-pdf
 * Gera um termo de consentimento em PDF
 */
router.post('/gerar-termo-pdf', async (req, res) => {
  try {
    const dados = req.body;

    if (!dados.paciente || !dados.procedimento) {
      return res.status(400).json({ error: 'Dados do paciente e procedimento são obrigatórios' });
    }

    const { filepath, filename } = await gerarTermoPDF(dados);

    if (dados.enviarEmail && dados.paciente.email) {
      await enviarPDFEmail(
        filepath,
        dados.paciente.email,
        'Termo de Consentimento - Portal Clinic',
        `Olá ${dados.paciente.nome},\n\nSegue em anexo o termo de consentimento para o procedimento: ${dados.procedimento}.\n\nPor favor, leia atentamente e traga assinado no dia do procedimento.\n\nAtenciosamente,\nEquipe Portal Clinic`
      );

      fs.unlinkSync(filepath);

      return res.json({ 
        success: true, 
        message: 'Termo gerado e enviado por email com sucesso',
        filename 
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      fs.unlinkSync(filepath);
    });

  } catch (error) {
    console.error('Erro ao gerar termo PDF:', error);
    res.status(500).json({ error: 'Erro ao gerar PDF', details: error.message });
  }
});

/**
 * POST /api/gerar-recibo-pdf
 * Gera um recibo em PDF
 */
router.post('/gerar-recibo-pdf', async (req, res) => {
  try {
    const dados = req.body;

    if (!dados.pagador || !dados.valor) {
      return res.status(400).json({ error: 'Dados do pagador e valor são obrigatórios' });
    }

    const { filepath, filename } = await gerarReciboPDF(dados);

    if (dados.enviarEmail && dados.pagador.email) {
      await enviarPDFEmail(
        filepath,
        dados.pagador.email,
        'Recibo - Portal Clinic',
        `Olá ${dados.pagador.nome},\n\nSegue em anexo o recibo do pagamento.\n\nAtenciosamente,\nEquipe Portal Clinic`
      );

      fs.unlinkSync(filepath);

      return res.json({ 
        success: true, 
        message: 'Recibo gerado e enviado por email com sucesso',
        filename 
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      fs.unlinkSync(filepath);
    });

  } catch (error) {
    console.error('Erro ao gerar recibo PDF:', error);
    res.status(500).json({ error: 'Erro ao gerar PDF', details: error.message });
  }
});

/**
 * POST /api/gerar-pdf-html
 * Gera PDF a partir de HTML customizado
 */
router.post('/gerar-pdf-html', async (req, res) => {
  try {
    const dados = req.body;

    if (!dados.html) {
      return res.status(400).json({ error: 'HTML é obrigatório' });
    }

    const { filepath, filename } = await gerarPDFHTML(dados);

    if (dados.enviarEmail && dados.email) {
      await enviarPDFEmail(
        filepath,
        dados.email,
        'Documento PDF - Portal Clinic',
        'Segue em anexo o documento solicitado.'
      );

      fs.unlinkSync(filepath);

      return res.json({ 
        success: true, 
        message: 'PDF gerado e enviado por email com sucesso',
        filename 
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      fs.unlinkSync(filepath);
    });

  } catch (error) {
    console.error('Erro ao gerar PDF HTML:', error);
    res.status(500).json({ error: 'Erro ao gerar PDF', details: error.message });
  }
});

module.exports = router;
