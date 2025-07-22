
import {config} from 'dotenv';
config();

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  logSinks: [],
});

export const fastModel = 'gemini-1.5-flash';
export const proModel = 'gemini-1.5-pro';
