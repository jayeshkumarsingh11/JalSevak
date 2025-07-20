
'use server';

/**
 * @fileOverview Translates UI text into a specified language.
 *
 * - translateUi - A function that translates a JSON object of strings.
 * - TranslateUiInput - The input type for the translateUi function.
 * - TranslateUiOutput - The return type for the translateUi function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateUiInputSchema = z.object({
  texts: z.record(z.string()).describe('A JSON object where keys are identifiers and values are the English strings to be translated.'),
  language: z.string().describe('The target language for translation (e.g., "Hindi", "Tamil", "Marathi").'),
});
export type TranslateUiInput = z.infer<typeof TranslateUiInputSchema>;

const TranslateUiOutputSchema = z.record(z.string());
export type TranslateUiOutput = z.infer<typeof TranslateUiOutputSchema>;

export async function translateUi(input: TranslateUiInput): Promise<TranslateUiOutput> {
  return translateUiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateUiPrompt',
  input: {schema: TranslateUiInputSchema},
  output: {schema: TranslateUiOutputSchema},
  prompt: `You are an expert translator specializing in Indian languages.
  Translate the values of the following JSON object from English to {{{language}}}.
  It is critical that you ONLY translate the string values and preserve the JSON keys exactly as they are.
  Your response must be a valid JSON object.

  JSON to translate:
  {{{json texts}}}

  Return only the translated JSON object.
`,
});

const translateUiFlow = ai.defineFlow(
  {
    name: 'translateUiFlow',
    inputSchema: TranslateUiInputSchema,
    outputSchema: TranslateUiOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
