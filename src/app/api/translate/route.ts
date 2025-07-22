
import { NextResponse } from 'next/server';
import { translate } from '@/actions/translate';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { texts, target } = body;

    if (!Array.isArray(texts) || !target) {
      return NextResponse.json({ error: 'Missing required parameters: texts array and target language code.' }, { status: 400 });
    }

    // The current translate action expects a key-value object.
    // We will convert our array to that format and back.
    const textsObject: { [key: string]: string } = {};
    texts.forEach((text, index) => {
        textsObject[`key_${index}`] = text;
    });

    const translatedObject = await translate(textsObject, target);

    // Convert back to an array in the original order.
    const translatedTexts = texts.map((_, index) => translatedObject[`key_${index}`]);
    
    // The context expects an object with a `translatedTexts` property
    return NextResponse.json({ translatedTexts });

  } catch (error) {
    console.error('Translation API route error:', error);
    // Mimic the behavior of the original action on failure: return original texts
    const body = await request.json();
    return NextResponse.json({ translatedTexts: body.texts });
  }
}
