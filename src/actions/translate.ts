'use server';

import {Translate} from '@google-cloud/translate/build/src/v2';

// This is safe to run on the server, as API keys are not exposed to the client.
const translate = new Translate({
    key: process.env.TRANSLATE_API_KEY,
});

/**
 * Translates an array of texts to the specified target language.
 * @param texts - An array of strings to translate.
 * @param targetLanguageCode - The ISO 639-1 code for the target language (e.g., 'hi' for Hindi).
 * @returns A promise that resolves to an array of translated strings.
 */
export async function translateTexts(texts: string[], targetLanguageCode: string): Promise<string[]> {
    if (!texts || texts.length === 0) {
        return [];
    }

    if (!process.env.TRANSLATE_API_KEY) {
        console.error('TRANSLATE_API_KEY is not set. Translation will be skipped.');
        // Return original texts if API key is not available to prevent errors.
        return texts;
    }

    try {
        // The `translate` method can accept an array of strings.
        const [translations] = await translate.translate(texts, targetLanguageCode);
        return Array.isArray(translations) ? translations : [translations];
    } catch (error) {
        console.error('ERROR in Google Cloud Translation API:', error);
        // In case of an error, return the original texts to prevent the UI from breaking.
        return texts;
    }
}
