'use server';

/**
 * @fileOverview Provides government scheme suggestions based on farmer's location, crop type, and land area.
 *
 * - governmentSchemeSuggestions - A function that suggests relevant government subsidies.
 * - GovernmentSchemeSuggestionsInput - The input type for the governmentSchemeSuggestions function.
 * - GovernmentSchemeSuggestionsOutput - The return type for the governmentSchemeSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GovernmentSchemeSuggestionsInputSchema = z.object({
  location: z.string().describe('The location of the farm (e.g., village, district).'),
  cropType: z.string().describe('The type of crop being cultivated.'),
  landArea: z.number().describe('The size of the farm land in acres.'),
});
export type GovernmentSchemeSuggestionsInput = z.infer<typeof GovernmentSchemeSuggestionsInputSchema>;

const GovernmentSchemeSuggestionsOutputSchema = z.object({
  schemes: z.array(
    z.object({
      name: z.string().describe('The name of the government scheme.'),
      description: z.string().describe('A brief description of the scheme.'),
      eligibilityCriteria: z.string().describe('The eligibility criteria for the scheme.'),
      benefits: z.string().describe('The benefits offered under the scheme.'),
      applicationProcedure: z.string().describe('The procedure to apply for the scheme.'),
    })
  ).describe('A list of relevant government schemes.'),
});
export type GovernmentSchemeSuggestionsOutput = z.infer<typeof GovernmentSchemeSuggestionsOutputSchema>;

export async function governmentSchemeSuggestions(input: GovernmentSchemeSuggestionsInput): Promise<GovernmentSchemeSuggestionsOutput> {
  return governmentSchemeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'governmentSchemeSuggestionsPrompt',
  input: {schema: GovernmentSchemeSuggestionsInputSchema},
  output: {schema: GovernmentSchemeSuggestionsOutputSchema},
  prompt: `You are an expert in Indian agricultural government schemes.
  Based on the farmer's location, crop type, and land area, suggest relevant government subsidies.

  Location: {{{location}}}
  Crop Type: {{{cropType}}}
  Land Area: {{{landArea}}} acres

  Suggest government schemes that are relevant to the farmer.
  Provide the name, description, eligibility criteria, benefits, and application procedure for each scheme. Return it in the specified JSON format.
`,
});

const governmentSchemeSuggestionsFlow = ai.defineFlow(
  {
    name: 'governmentSchemeSuggestionsFlow',
    inputSchema: GovernmentSchemeSuggestionsInputSchema,
    outputSchema: GovernmentSchemeSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
