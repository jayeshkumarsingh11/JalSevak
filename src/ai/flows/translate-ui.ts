'use server';

/**
 * @fileOverview Translates UI text elements to a specified language.
 *
 * - translateUI - A function that handles the UI translation.
 * - TranslateUIInput - The input type for the translateUI function.
 * - TranslateUIOutput - The return type for the translateUI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateUIInputSchema = z.object({
  language: z.string().describe('The target language for translation (e.g., "Hindi", "Tamil").'),
  texts: z.record(z.string()).describe('A JSON object where keys are the translation keys and values are the English text to be translated.'),
});
export type TranslateUIInput = z.infer<typeof TranslateUIInputSchema>;

const TranslateUIOutputSchema = z.object({
  translations: z.record(z.string()).describe('A JSON object where keys are the original translation keys and values are the translated text.'),
});
export type TranslateUIOutput = z.infer<typeof TranslateUIOutputSchema>;


export async function translateUI(input: TranslateUIInput): Promise<TranslateUIOutput> {
  return translateUIFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateUIPrompt',
  input: {schema: TranslateUIInputSchema},
  output: {schema: TranslateUIOutputSchema},
  prompt: `You are a translation expert. Translate the JSON values from the 'texts' object into the specified 'language'.
  The user wants to translate their web application's UI.
  Return a new JSON object where the keys are the same as the input, but the values are the translated strings.
  Do not translate keys that look like code identifiers (e.g., 'Jayesh Kumar Singh').
  The target language is: {{language}}
  The texts to translate are:
  {{{JSON.stringify texts}}}
  
  Provide only the final JSON object in the 'translations' field.
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
