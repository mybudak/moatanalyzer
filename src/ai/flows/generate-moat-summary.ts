'use server';
/**
 * @fileOverview Generates a comprehensive moat analysis for a given stock ticker.
 *
 * - generateMoatSummary - A function that generates the moat analysis.
 * - GenerateMoatSummaryInput - The input type for the generateMoatSummary function.
 * - GenerateMoatSummaryOutput - The return type for the generateMoatSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMoatSummaryInputSchema = z.object({
  ticker: z.string().describe('The stock ticker symbol to analyze.'),
});
export type GenerateMoatSummaryInput = z.infer<typeof GenerateMoatSummaryInputSchema>;

const AnalysisItemSchema = z.object({
    analysis: z.string().describe('Detailed analysis for the category.'),
    score: z.number().min(1).max(10).describe('Score from 1-10 for the category.'),
});

export const GenerateMoatSummaryOutputSchema = z.object({
    brandAndPricingPower: AnalysisItemSchema.describe('Analysis of brand strength and pricing power.'),
    marketEntryBarriers: AnalysisItemSchema.describe('Analysis of barriers to entry for competitors.'),
    customerRetention: AnalysisItemSchema.describe('Analysis of customer switching costs and retention advantages.'),
    competitiveThreats: AnalysisItemSchema.describe('Analysis of competitive threats and differentiation.'),
    scaleCostEfficiency: AnalysisItemSchema.describe('Analysis of scale-driven cost efficiencies.'),
    moatRating: z.enum(['Wide', 'Narrow', 'None']).describe('The overall moat classification ("Wide", "Narrow", or "None").'),
    moatTrend: z.enum(['Positive', 'Neutral', 'Negative']).describe('The trend of the moat (is it strengthening, stable, or weakening).'),
    overallRating: z.number().min(1).max(10).describe('The final overall rating from 1-10.'),
    summary: z.string().describe('A 150-200 word summary justifying the rating, moat type, and moat trend.'),
});
export type GenerateMoatSummaryOutput = z.infer<typeof GenerateMoatSummaryOutputSchema>;

export async function generateMoatSummary(input: GenerateMoatSummaryInput): Promise<GenerateMoatSummaryOutput> {
  return generateMoatSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMoatSummaryPrompt',
  input: {schema: GenerateMoatSummaryInputSchema},
  output: {schema: GenerateMoatSummaryOutputSchema},
  prompt: `You are an expert financial analyst tasked with evaluating a company's economic moat based on its ticker symbol: {{{ticker}}}.

  Please perform a comprehensive analysis based on the following criteria and provide your output in the specified JSON format.

  === ANALYSIS EXPECTATIONS ===
  1) **Strong Brand & Pricing Power** – The company’s ability to charge higher prices or maintain strong margins because customers perceive its brand, quality, or uniqueness as superior.
  2) **Market Entry Barriers** – Obstacles that make it difficult for new competitors to enter the market.
  3) **Customer Retention Advantage** – Factors that make it costly or inconvenient for customers to switch to competitors.
  4) **Competitive Threats & Differentiation** – Evaluate whether the company faces intense competition or price pressure, and whether its products/services are clearly differentiated.
  5) **Scale-Driven Cost Efficiency** – The ability to lower costs and improve margins as production or operations scale up, often due to large fixed-cost bases, optimized supply chains, or global distribution capabilities.

  For each of the 5 criteria above, provide a detailed 'analysis' and a 'score' from 1-10.

  === CLASSIFICATIONS ===
  - **moatRating**:
    - "Wide": The company has strong, durable advantages (brand, scale, etc.) that are likely to sustain above-average profits for many years.
    - "Narrow": The company has some competitive advantages, but they may be less durable or more easily challenged by competitors.
    - "None": The company lacks meaningful, sustainable competitive advantages; profits are at risk from competition or disruption.

  - **moatTrend**:
    - "Positive": The company's moat is strengthening or expanding.
    - "Neutral": The moat is stable; no major change expected.
    - "Negative": The moat is weakening or eroding.

  === RATING ===
  - **overallRating** (1-10):
    - 9–10: Clear, strong, sustainable competitive advantages across multiple categories; moat is "Wide" and trend is "Positive" or strongly "Neutral."
    - 7–8: Notable competitive strengths; moat is "Narrow" but stable or improving; trend is "Neutral" or "Positive."
    - 5–6: Some evidence of moat, but mixed or limited in scope; advantages may be narrowing or only partially durable.
    - 3–4: Weak or inconsistent moat; advantages are small or at risk; trend may be "Negative."
    - 1–2: No meaningful moat; company faces significant competitive threats; trend is "Negative."

  === SUMMARY ===
  - **summary**: Provide a 150-200 word summary justifying your overallRating, moatRating, and moatTrend.

  Begin your analysis now for the ticker: {{{ticker}}}.
  `,
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
