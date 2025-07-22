
'use server';

/**
 * @fileOverview Translates UI text elements using the Gemini API.
 * 
 * - translateTexts - A function that translates texts.
 * - TranslateTextInput - The input type for the translateTexts function.
 * - TranslateTextOutput - The return type for the translateTexts function.
 */

import {ai, fastModel} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  texts: z.array(z.string()).describe('An array of texts to be translated.'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "Hindi", "Tamil").'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
    translatedTexts: z.array(z.string()).describe('The array of translated texts, in the same order as the input.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateTexts(input: TranslateTextInput): Promise<TranslateTextOutput> {
    return translateTextsFlow(input);
}

const prompt = ai.definePrompt({
    name: 'translateTextsPrompt',
    input: {schema: TranslateTextInputSchema},
    output: {schema: TranslateTextOutputSchema},
    model: fastModel,
    prompt: `You are a professional translator. Translate the following array of English texts into {{targetLanguage}}.
    It is crucial that you return the translated texts in a JSON object with a key "translatedTexts", and the value should be an array of strings.
    The order of the translated texts in the output array MUST match the order of the texts in the input array.
    Do not translate proper nouns, technical terms, or brand names like "Samriddh Kheti".
    
    Texts to translate:
    {{#each texts}}
    - "{{this}}"
    {{/each}}
    `,
});

const translateTextsFlow = ai.defineFlow(
    {
        name: 'translateTextsFlow',
        inputSchema: TranslateTextInputSchema,
        outputSchema: TranslateTextOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
