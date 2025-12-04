// Dados simulados de issues encontradas
const mockIssues = [
  {
    id: 1,
    category: 'performance',
    title: 'Desempenho lento',
    description:
      'O tempo de carregamento da página está acima do recomendado. Imagens não otimizadas e cache ineficiente foram detectados.',
    status: 'detected',
  },
  {
    id: 2,
    category: 'security',
    title: 'Vulnerabilidade de segurança',
    description:
      'A versão do WordPress ou de um plugin está desatualizada, expondo o site a riscos de segurança conhecidos.',
    status: 'detected',
  },
  {
    id: 3,
    category: 'plugins',
    title: 'Conflito de plugins',
    description:
      'Identificamos um possível conflito entre os plugins "Exemplo A" e "Exemplo B" que pode causar erros.',
    status: 'detected',
  },
];

// Função principal de análise (mock)
export const analyzeSite = async (url) => {
  const target = String(url || '').trim();
  console.log(`[Mock Analyze] Analisando site: ${target}`);

  // Simula atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 2500));

  // Validação simples
  if (!target) {
    return {
      success: false,
      message: 'URL inválida. Informe um endereço válido e tente novamente.',
    };
  }

  // Simula erro proposital quando a URL contém "error"
  if (target.toLowerCase().includes('error')) {
    return {
      success: false,
      message:
        'Não foi possível conectar ao site. Verifique a URL e tente novamente.',
    };
  }

  // Retorna resultado de sucesso com os issues resetados
  return {
    success: true,
    data: {
      url: target,
      wordpressVersion: '6.4.3',
      issues: mockIssues.map((issue) => ({ ...issue, status: 'detected' })), // reset de status a cada análise
    },
  };
};