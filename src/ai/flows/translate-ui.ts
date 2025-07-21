
'use server';

/**
 * @fileOverview Translates UI text elements to a specified language.
 *
 * - translateUI - A function that handles the translation process.
 * - TranslateUIInput - The input type for the translateUI function.
 * - TranslateUIOutput - The return type for the translateUI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { proModel } from '@/ai/genkit';

const TranslateUIInputSchema = z.object({
  language: z.string().describe('The target language to translate the text into (e.g., "Hindi", "Tamil").'),
  jsonToTranslate: z.string().describe('A JSON string containing key-value pairs of the UI text in English that needs to be translated.'),
});
export type TranslateUIInput = z.infer<typeof TranslateUIInputSchema>;

const TranslateUIOutputSchema = z.object({
  translatedJson: z.string().describe('A JSON string containing the translated key-value pairs.'),
});
export type TranslateUIOutput = z.infer<typeof TranslateUIOutputSchema>;


export async function translateUI(input: TranslateUIInput): Promise<TranslateUIOutput> {
  return translateUIFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateUIPrompt',
  input: {schema: TranslateUIInputSchema},
  output: {schema: TranslateUIOutputSchema},
  prompt: `You are a professional translator specializing in user interfaces for an agricultural application in India.
  Translate the values of the following JSON object from English to {{language}}.
  - DO NOT translate the keys.
  - Your response MUST be a valid JSON string.
  - Ensure the translation is accurate and culturally appropriate for the agricultural context in India.

  JSON to translate:
  {{{jsonToTranslate}}}

  Return ONLY the translated JSON string in the 'translatedJson' field.
`,
});

const translateUIFlow = ai.defineFlow(
  {
    name: 'translateUIFlow',
    inputSchema: TranslateUIInputSchema,
    outputSchema: TranslateUIOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
