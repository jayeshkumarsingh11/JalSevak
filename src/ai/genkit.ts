
import {config} from 'dotenv';
config();

import {genkit} from 'genkit';
import {openai} from 'genkitx-openai';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI(),
    openai({
        apiKey: process.env.OPENAI_API_KEY,
    }),
  ],
  logSinks: [],
});

export const fastModel = 'gpt-4o-mini';
export const proModel = 'gpt-4o';
