'use server';

/**
 * @fileOverview Suggests optimal crops based on farmer's input.
 *
 * - cropSuggestion - A function that suggests crops.
 * - CropSuggestionInput - The input type for the cropSuggestion function.
 * - CropSuggestionOutput - The return type for the cropSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropSuggestionInputSchema = z.object({
  location: z.string().describe('The location of the farm (e.g., village, district, state).'),
  soilType: z.string().describe('The type of soil in the farm (e.g., Loamy, Clay, Sandy).'),
  waterAvailability: z.string().describe('The availability of water for irrigation (e.g., Abundant, Moderate, Scarce).'),
  farmerPreference: z.string().describe('The farmer\'s primary goal (e.g., Maximize Profit, Drought Resistant, Low Maintenance).'),
});
export type CropSuggestionInput = z.infer<typeof CropSuggestionInputSchema>;

const CropSuggestionOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      name: z.string().describe('The name of the suggested crop.'),
      justification: z.string().describe('Why this crop is a good choice based on the inputs.'),
      estimatedProfit: z.string().describe('A qualitative estimate of the profit potential (e.g., High, Medium, Low).'),
      waterNeeds: z.string().describe('The water requirement for this crop (e.g., High, Moderate, Low).'),
      growingSeason: z.string().describe('The typical growing season for this crop (e.g., Kharif, Rabi, All-season).'),
    })
  ).describe('A list of recommended crops.'),
});
export type CropSuggestionOutput = z.infer<typeof CropSuggestionOutputSchema>;


export async function cropSuggestion(input: CropSuggestionInput): Promise<CropSuggestionOutput> {
  return cropSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropSuggestionPrompt',
  input: {schema: CropSuggestionInputSchema},
  output: {schema: CropSuggestionOutputSchema},
  prompt: `You are an expert agronomist providing crop recommendations to farmers in India.
  Based on the farmer's inputs, suggest up to 3 suitable crops.
  Infer the general climate and weather patterns from the provided location.

  Farmer's Inputs:
  - Location: {{{location}}}
  - Soil Type: {{{soilType}}}
  - Water Availability: {{{waterAvailability}}}
  - Primary Goal: {{{farmerPreference}}}

  For each suggested crop, provide:
  1.  A clear justification explaining why it's suitable based on the combination of location (climate), soil, water, and the farmer's goal.
  2.  An estimated profit potential (High, Medium, or Low).
  3.  The crop's typical water needs (High, Moderate, or Low).
  4.  The typical growing season (e.g., Kharif, Rabi, Zaid, All-season).

  Return the response in the specified JSON format.
`,
});

const cropSuggestionFlow = ai.defineFlow(
  {
    name: 'cropSuggestionFlow',
    inputSchema: CropSuggestionInputSchema,
    outputSchema: CropSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
