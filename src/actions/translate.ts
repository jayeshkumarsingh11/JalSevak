
'use server';

/**
 * Translates an array of texts to the specified target language using Google Cloud Translation API v3.
 * @param texts - An array of strings to translate.
 * @param targetLanguageCode - The ISO 639-1 code for the target language (e.g., 'hi' for Hindi).
 * @returns A promise that resolves to an array of translated strings.
 */
export async function translateTexts(texts: string[], targetLanguageCode: string): Promise<string[]> {
    if (!texts || texts.length === 0) {
        return [];
    }

    const apiKey = process.env.TRANSLATE_API_KEY;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

    if (!apiKey || !projectId) {
        console.error('TRANSLATE_API_KEY or GOOGLE_CLOUD_PROJECT_ID is not set. Translation cannot proceed. Returning original texts.');
        return texts;
    }

    const url = `https://translate.googleapis.com/v3/projects/${projectId}:translateText`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`, // Note: v3 typically uses OAuth, but API keys can work for simple cases. Ensure key is properly restricted.
                'x-goog-user-project': projectId,
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                contents: texts,
                targetLanguageCode: targetLanguageCode,
                sourceLanguageCode: 'en', // Assuming source is always English
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error('ERROR in Google Cloud Translation API:', JSON.stringify(errorBody, null, 2));
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.translations && Array.isArray(data.translations)) {
             return data.translations.map((t: { translatedText: string }) => t.translatedText);
        } else {
             throw new Error('Invalid response format from translation API.');
        }

    } catch (error) {
        console.error('Failed to translate texts due to a fetch/API error:', error);
        // Re-throw the error to be handled by the caller so the UI can be notified.
        throw new Error('Failed to translate texts due to an API error.');
    }
}
