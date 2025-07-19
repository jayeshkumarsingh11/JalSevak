'use server';

/**
 * @fileOverview Provides information about government-set crop prices (MSP).
 *
 * - cropPriceInfo - A function that provides analysis on crop prices.
 * - CropPriceInfoInput - The input type for the cropPriceInfo function.
 * - CropPriceInfoOutput - The return type for the cropPriceInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropPriceInfoInputSchema = z.object({
  cropName: z.string().describe('The name of the crop.'),
});
export type CropPriceInfoInput = z.infer<typeof CropPriceInfoInputSchema>;

const CropPriceInfoOutputSchema = z.object({
  analysis: z.string().describe('A brief analysis of the price trend for the specified crop.'),
  currentMsp: z.number().describe('The current Minimum Support Price (MSP) in rupees per quintal.'),
  lastYearMsp: z.number().describe('The Minimum Support Price (MSP) from the previous year in rupees per quintal.'),
});
export type CropPriceInfoOutput = z.infer<typeof CropPriceInfoOutputSchema>;


export async function cropPriceInfo(input: CropPriceInfoInput): Promise<CropPriceInfoOutput> {
  return cropPriceInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropPriceInfoPrompt',
  input: {schema: CropPriceInfoInputSchema},
  output: {schema: CropPriceInfoOutputSchema},
  prompt: `You are an agricultural economist specializing in Indian crop prices.
  Analyze the provided crop name and generate a brief analysis of its Minimum Support Price (MSP) trend.
  Assume the current year is the latest data point. Provide a mock current MSP and last year's MSP for the crop.
  The price should be in rupees per quintal.

  Crop Name: {{{cropName}}}

  Based on this, provide a short analysis, the current MSP, and last year's MSP.
  For example, if the crop is Wheat, the current MSP might be 2275 and last year's 2125.
  The analysis could be: "The MSP for Wheat has shown a steady increase, reflecting rising input costs and ensuring profitability for farmers."
  
  Return the response in the specified JSON format.
`,
});

const cropPriceInfoFlow = ai.defineFlow(
  {
    name: 'cropPriceInfoFlow',
    inputSchema: CropPriceInfoInputSchema,
    outputSchema: CropPriceInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
