
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
        console.error('TRANSLATE_API_KEY is not set. Translation cannot proceed. Returning original texts.');
        // Return original texts to prevent a crash and allow the UI to handle it.
        return texts;
    }

    try {
        // The `translate` method can accept an array of strings.
        const [translations] = await translate.translate(texts, targetLanguageCode);
        return Array.isArray(translations) ? translations : [translations];
    } catch (error) {
        console.error('ERROR in Google Cloud Translation API:', error);
        // Re-throw the error to be handled by the caller so the UI can be notified.
        throw new Error('Failed to translate texts due to an API error.');
    }
}
