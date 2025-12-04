import { handleApiError } from './utils';

export const generateBlogPost = async (prompt) => {
  console.warn("generateBlogPost is using mock data.");
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!prompt) {
    return handleApiError({ message: "Prompt is required." }, 'generateBlogPost', true);
  }

  const mockTitle = `Tudo sobre: ${prompt}`;
  const mockContent = `Este é um post gerado por IA sobre ${prompt}.\n\nParágrafo 1: Aprofundando no tema, podemos ver que ${prompt} é um assunto de grande interesse.\n\nParágrafo 2: Muitos especialistas concordam que as nuances de ${prompt} são complexas e fascinantes. É importante considerar todos os ângulos antes de formar uma opinião.`;

  return { success: true, data: { title: mockTitle, content: mockContent } };
};