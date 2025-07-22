
import {genkit} from 'genkit';
import {openai} from 'genkitx-openai';

export const ai = genkit({
  plugins: [
    // TODO: The OpenAI plugin configuration is currently broken and causing a runtime error.
    // Please uncomment the following lines and ensure you have the correct syntax
    // and package versions for `genkitx-openai`.
    // openai({
    //     apiKey: process.env.OPENAI_API_KEY,
    // }),
  ],
  logSinks: [],
});

export const fastModel = 'gpt-4o-mini';
export const proModel = 'gpt-4o';
