
'use server';

/**
 * @fileOverview Translates UI text elements using a public Gemini API endpoint.
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


const translateTextsFlow = ai.defineFlow(
    {
        name: 'translateTextsFlow',
        inputSchema: TranslateTextInputSchema,
        outputSchema: TranslateTextOutputSchema,
    },
    async ({ texts, targetLanguage }) => {
        const translatedTexts = await Promise.all(
            texts.map(async (text) => {
                const prompt = `Translate the following text to ${targetLanguage}. Do not add any extra explanation or formatting, just return the translated text. Text: "${text}"`;
                try {
                    const response = await fetch('https://gemini-apis.vercel.app/api/?prompt=' + encodeURIComponent(prompt));
                    if (!response.ok) {
                        return text; // Return original text on error
                    }
                    const translatedText = await response.text();
                    // Clean up potential markdown or extra quotes
                    return translatedText.replace(/`/g, '').replace(/"/g, '').trim();
                } catch (error) {
                    console.error('Error translating text:', error);
                    return text; // Return original text on error
                }
            })
        );
        
        return { translatedTexts };
    }
);
