'use server';
/**
 * @fileOverview Classifies the moat rating of a company based on provided analysis.
 *
 * - classifyMoatRating - A function that classifies the moat rating.
 * - ClassifyMoatRatingInput - The input type for the classifyMoatRating function.
 * - ClassifyMoatRatingOutput - The return type for the classifyMoatRating function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyMoatRatingInputSchema = z.object({
  analysisSummary: z
    .string()
    .describe('A summary of the company analysis.'),
});
export type ClassifyMoatRatingInput = z.infer<
  typeof ClassifyMoatRatingInputSchema
>;

const ClassifyMoatRatingOutputSchema = z.object({
  moatRating: z
    .enum(['Wide', 'Narrow', 'None'])
    .describe('The moat rating of the company.'),
  summary: z.string().describe('A short summary of the moat analysis.'),
});
export type ClassifyMoatRatingOutput = z.infer<
  typeof ClassifyMoatRatingOutputSchema
>;

export async function classifyMoatRating(
  input: ClassifyMoatRatingInput
): Promise<ClassifyMoatRatingOutput> {
  return classifyMoatRatingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyMoatRatingPrompt',
  input: {schema: ClassifyMoatRatingInputSchema},
  output: {schema: ClassifyMoatRatingOutputSchema},
  prompt: `You are an expert financial analyst specializing in assessing the competitive advantages (or "moats") of companies.

  Based on the following analysis summary, classify the company's moat rating as either "Wide", "Narrow", or "None".  Also provide a very short (one sentence) summary of the analysis.

  Analysis Summary: {{{analysisSummary}}}
  `,
});

const classifyMoatRatingFlow = ai.defineFlow(
  {
    name: 'classifyMoatRatingFlow',
    inputSchema: ClassifyMoatRatingInputSchema,
    outputSchema: ClassifyMoatRatingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
