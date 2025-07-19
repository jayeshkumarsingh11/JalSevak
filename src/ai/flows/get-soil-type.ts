'use server';

/**
 * @fileOverview Determines the predominant soil type based on a given location in India.
 *
 * - getSoilType - A function that returns the soil type for a location.
 * - GetSoilTypeInput - The input type for the getSoilType function.
 * - GetSoilTypeOutput - The return type for the getSoilType function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetSoilTypeInputSchema = z.object({
  location: z.string().describe('The location in India (e.g., village, district, state).'),
});
export type GetSoilTypeInput = z.infer<typeof GetSoilTypeInputSchema>;

const GetSoilTypeOutputSchema = z.object({
  soilType: z.string().describe('The most common soil type for the given location.'),
});
export type GetSoilTypeOutput = z.infer<typeof GetSoilTypeOutputSchema>;

export async function getSoilType(input: GetSoilTypeInput): Promise<GetSoilTypeOutput> {
  return getSoilTypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getSoilTypePrompt',
  input: {schema: GetSoilTypeInputSchema},
  output: {schema: GetSoilTypeOutputSchema},
  prompt: `You are an Indian soil expert. Based on the provided location, determine the most common soil type.
  The output must be one of the following values: "Alluvial", "Black Soil", "Red and Yellow Soil", "Laterite Soil", "Arid", "Forest and Mountain", "Saline and Alkaline", "Peaty and Marshy", "Loamy", "Clay", "Sandy".
  If the location is broad, pick the most predominant type.

  Location: {{{location}}}

  Return only the soil type in the specified JSON format.
`,
});

const getSoilTypeFlow = ai.defineFlow(
  {
    name: 'getSoilTypeFlow',
    inputSchema: GetSoilTypeInputSchema,
    outputSchema: GetSoilTypeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
