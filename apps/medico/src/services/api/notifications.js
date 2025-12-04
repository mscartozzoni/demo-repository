import { handleApiError } from './utils';

// A função getNewsCarouselData foi movida para utils.js para unificar a lógica de retry.
// Re-exportando de lá para manter a consistência da API.
export { getNewsCarouselData } from './utils';