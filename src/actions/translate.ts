
'use server';

/**
 * @fileOverview Translates UI text elements using the LibreTranslate API.
 */

const LIBRETRANSLATE_API_URL = 'https://libretranslate.de/translate';

interface TranslatePayload {
  q: string[];
  source: string;
  target: string;
  format: 'text';
}

interface TranslateResponse {
  translatedText: string[];
}

/**
 * Translates a key-value map of UI texts into a specified language using LibreTranslate.
 * @param texts - A JSON object where keys are stable identifiers and values are the English texts.
 * @param targetLanguageCode - The ISO 639-1 code for the target language (e.g., 'hi' for Hindi).
 * @returns A promise that resolves to a JSON object with translated values.
 */
export async function translate(
  texts: { [key: string]: string },
  targetLanguageCode: string
): Promise<{ [key: string]: string }> {
  const originalKeys = Object.keys(texts);
  const textsToTranslate = Object.values(texts);

  if (!textsToTranslate.length) {
    return {};
  }

  try {
    const payload: TranslatePayload = {
      q: textsToTranslate,
      source: 'en',
      target: targetLanguageCode,
      format: 'text',
    };

    const response = await fetch(LIBRETRANSLATE_API_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      // Log the detailed error on the server for debugging
      console.error(`LibreTranslate API error: ${response.status} ${response.statusText} - ${errorBody}`);
      // Return original texts to prevent a crash
      return texts;
    }

    const result: TranslateResponse = await response.json();
    const translatedTexts = result.translatedText;
    
    // Sometimes the API returns the original text on failure, check for that
    if (translatedTexts && translatedTexts.length > 0 && translatedTexts[0] === textsToTranslate[0]) {
      console.error('LibreTranslate returned original text, indicating a translation failure for target:', targetLanguageCode);
      return texts;
    }

    const translatedObject: { [key: string]: string } = {};
    originalKeys.forEach((key, index) => {
      translatedObject[key] = translatedTexts[index];
    });

    return translatedObject;

  } catch (error) {
    console.error('Failed to fetch from LibreTranslate:', error);
    // In case of a network error or other exception, return the original English texts.
    return texts;
  }
}
