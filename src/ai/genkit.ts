
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

export const fastModel = 'gemma-3n-e2b-it';
export const proModel = 'gemma-3n-e2b-it';
