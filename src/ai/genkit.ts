
import {genkit} from 'genkit';
import {openai} from 'genkitx-openai';

export const ai = genkit({
  plugins: [
    openai,
  ],
  logSinks: [],
});

export const fastModel = 'gpt-4o-mini';
export const proModel = 'gpt-4o';
