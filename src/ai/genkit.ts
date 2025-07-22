
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

export const fastModel = 'gemma-7b-it';
export const proModel = 'gemma-7b-it';
