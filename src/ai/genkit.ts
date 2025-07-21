
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { gemini15Flash, gemini15Pro } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-pro-latest',
  embedder: 'googleai/text-embedding-004',
  textToSpeech: 'googleai/gemini-2.5-flash-preview-tts',
  imageGenerator: 'googleai/gemini-2.0-flash-preview-image-generation'
});

export const fastModel = 'googleai/gemini-1.5-flash-latest';
export const proModel = 'googleai/gemini-1.5-pro-latest';
