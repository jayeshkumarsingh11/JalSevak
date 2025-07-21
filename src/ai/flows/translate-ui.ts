
'use server';

/**
 * @fileOverview Translates UI text elements into a specified language using an AI model.
 *
 * - translateUI - A function that translates a key-value map of UI texts.
 * - TranslateUIInput - The input type for the translateUI function.
 * - TranslateUIOutput - The return type for the translateUI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateUIInputSchema = z.object({
  texts: z.record(z.string()).describe('A JSON object where keys are stable identifiers and values are the English texts to be translated.'),
  language: z.string().describe('The target language for translation (e.g., "Hindi", "Tamil").'),
});
export type TranslateUIInput = z.infer<typeof TranslateUIInputSchema>;

const TranslateUIOutputSchema = z.object({
    translations: z.record(z.string()).describe('A JSON object where keys are the original stable identifiers and values are the translated texts.'),
});
export type TranslateUIOutput = z.infer<typeof TranslateUIOutputSchema>;

export async function translateUI(input: TranslateUIInput): Promise<TranslateUIOutput> {
  return translateUIFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateUIPrompt',
  input: {schema: TranslateUIInputSchema },
  output: {schema: TranslateUIOutputSchema},
  prompt: `You are an expert translator. Translate the values of the following JSON object into the specified target language: {{language}}.

Return a JSON object where the keys are the same as the input object, but the values are the translated texts.

IMPORTANT:
- Translate only the 'value' for each key-value pair.
- The 'key' must remain unchanged.
- The entire output must be a single, valid JSON object.

Translate this JSON object:
{{{texts}}}
`,
});

const translateUIFlow = ai.defineFlow(
  {
    name: 'translateUIFlow',
    inputSchema: TranslateUIInputSchema,
    outputSchema: TranslateUIOutputSchema,
  },
  async (input) => {
    // Genkit prompts expect a flat object, so we stringify the texts object.
    const textsJson = JSON.stringify(input.texts);
    const {output} = await prompt({ language: input.language, texts: textsJson });
    return output!;
  }
);
