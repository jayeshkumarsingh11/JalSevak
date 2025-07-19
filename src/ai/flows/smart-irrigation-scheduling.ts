'use server';
/**
 * @fileOverview An AI agent that analyzes weather and soil data to recommend optimal irrigation schedules.
 *
 * - smartIrrigationSchedule - A function that handles the smart irrigation scheduling process.
 * - SmartIrrigationScheduleInput - The input type for the smartIrrigationSchedule function.
 * - SmartIrrigationScheduleOutput - The return type for the smartIrrigationSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartIrrigationScheduleInputSchema = z.object({
  cropType: z.string().describe('The type of crop being grown.'),
  farmArea: z.number().describe('The area of the farm in acres.'),
  waterSource: z.string().describe('The source of water for irrigation.'),
  location: z.string().describe('The location of the farm.'),
  weatherData: z.string().describe('Real-time weather data for the location.'),
  soilData: z.string().describe('Real-time soil data for the location.'),
});
export type SmartIrrigationScheduleInput = z.infer<typeof SmartIrrigationScheduleInputSchema>;

const SmartIrrigationScheduleOutputSchema = z.object({
  irrigationSchedule: z.string().describe('The recommended irrigation schedule.'),
  waterAmount: z.number().describe('The recommended amount of water to use for irrigation.'),
  justification: z.string().describe('The justification for the recommended irrigation schedule.'),
});
export type SmartIrrigationScheduleOutput = z.infer<typeof SmartIrrigationScheduleOutputSchema>;

export async function smartIrrigationSchedule(input: SmartIrrigationScheduleInput): Promise<SmartIrrigationScheduleOutput> {
  return smartIrrigationScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartIrrigationSchedulePrompt',
  input: {schema: SmartIrrigationScheduleInputSchema},
  output: {schema: SmartIrrigationScheduleOutputSchema},
  prompt: `You are an expert agricultural advisor specializing in irrigation. Based on the provided information, recommend an optimal irrigation schedule for the farmer.

Crop Type: {{{cropType}}}
Farm Area: {{{farmArea}}} acres
Water Source: {{{waterSource}}}
Location: {{{location}}}
Weather Data: {{{weatherData}}}
Soil Data: {{{soilData}}}

Consider the crop's water requirements, the farm area, the water source, the weather conditions, and the soil conditions to determine the best irrigation schedule. Provide a justification for your recommendation.

Output the irrigation schedule, the recommended amount of water to use, and the justification for the schedule. Make sure to output the irrigation schedule as an easy to read text.
`,
});

const smartIrrigationScheduleFlow = ai.defineFlow(
  {
    name: 'smartIrrigationScheduleFlow',
    inputSchema: SmartIrrigationScheduleInputSchema,
    outputSchema: SmartIrrigationScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
