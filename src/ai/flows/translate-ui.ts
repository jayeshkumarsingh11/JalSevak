
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
  language: z.string().describe('The target language to translate the texts into (e.g., "Hindi", "Tamil").'),
  texts: z.record(z.string()).describe('A JSON object where keys are the original English texts and values are also the English texts to be translated.'),
});
export type TranslateUIInput = z.infer<typeof TranslateUIInputSchema>;

const TranslateUIOutputSchema = z.object({
    translations: z.record(z.string()).describe('A JSON object where keys are the original English text and values are the translated text in the target language.')
}).describe('The translated UI texts.');
export type TranslateUIOutput = z.infer<typeof TranslateUIOutputSchema>;


export async function translateUI(input: TranslateUIInput): Promise<TranslateUIOutput> {
  return translateUIFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateUIPrompt',
  input: {schema: z.object({ language: z.string(), textsJson: z.string() })},
  output: {schema: TranslateUIOutputSchema},
  prompt: `You are a translation expert for a farming application. Your task is to translate the user interface elements from English to the target language specified.
  
  Translate the following JSON object's values to {{language}}. The keys of the JSON object must remain unchanged.
  The keys represent the original English text, and are used for mapping. You must only translate the *values*.
  
  Return the result as a single JSON object in the format { "translations": { "original_text_1": "translated_text_1", "original_text_2": "translated_text_2", ... } }.
  
  JSON with texts to translate:
  {{{textsJson}}}
`,
});

const translateUIFlow = ai.defineFlow(
  {
    name: 'translateUIFlow',
    inputSchema: TranslateUIInputSchema,
    outputSchema: TranslateUIOutputSchema,
  },
  async (input) => {
    const textsJson = JSON.stringify(input.texts);
    const {output} = await prompt({ language: input.language, textsJson });
    return output!;
  }
);
