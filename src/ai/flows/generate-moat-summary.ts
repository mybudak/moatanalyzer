'use server';
/**
 * @fileOverview Generates a summary of the moat analysis for a given stock ticker.
 *
 * - generateMoatSummary - A function that generates the moat summary.
 * - GenerateMoatSummaryInput - The input type for the generateMoatSummary function.
 * - GenerateMoatSummaryOutput - The return type for the generateMoatSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMoatSummaryInputSchema = z.object({
  ticker: z.string().describe('The stock ticker symbol to analyze.'),
});
export type GenerateMoatSummaryInput = z.infer<typeof GenerateMoatSummaryInputSchema>;

const GenerateMoatSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the moat analysis for the given stock ticker.'),
});
export type GenerateMoatSummaryOutput = z.infer<typeof GenerateMoatSummaryOutputSchema>;

export async function generateMoatSummary(input: GenerateMoatSummaryInput): Promise<GenerateMoatSummaryOutput> {
  return generateMoatSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMoatSummaryPrompt',
  input: {schema: GenerateMoatSummaryInputSchema},
  output: {schema: GenerateMoatSummaryOutputSchema},
  prompt: `You are an expert financial analyst. Provide a concise summary of the moat analysis for {{ticker}}.`,
});

const generateMoatSummaryFlow = ai.defineFlow(
  {
    name: 'generateMoatSummaryFlow',
    inputSchema: GenerateMoatSummaryInputSchema,
    outputSchema: GenerateMoatSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
