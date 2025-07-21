import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { gemini15Flash, gemini15Pro } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Pro,
  embedder: 'googleai/text-embedding-004',
  textToSpeech: 'googleai/gemini-2.5-flash-preview-tts',
  imageGenerator: 'googleai/gemini-2.0-flash-preview-image-generation'
});

export const fastModel = gemini15Flash;
export const proModel = gemini15Pro;
