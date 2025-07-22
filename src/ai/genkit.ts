
import {genkit} from 'genkit';
import {openai} from 'genkitx-openai';

export const ai = genkit({
  plugins: [
    openai({
        apiKey: process.env.OPENAI_API_KEY,
    }),
  ],
  logSinks: [],
});

export const fastModel = 'gpt-4o-mini';
export const proModel = 'gpt-4o';
