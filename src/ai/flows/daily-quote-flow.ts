'use server';
/**
 * @fileOverview An AI flow for generating an inspirational daily quote.
 * 
 * - generateDailyQuote - A function that generates a short, hopeful quote.
 * - GenerateDailyQuoteOutput - The return type for the generateDailyQuote function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';


const GenerateDailyQuoteOutputSchema = z.object({
  quote: z.string().describe('A short, inspirational, and hopeful quote for the day, suitable for a general Christian audience.'),
  verse: z.string().describe('A relevant Bible verse that complements the quote (e.g., "John 3:16").'),
});
export type GenerateDailyQuoteOutput = z.infer<typeof GenerateDailyQuoteOutputSchema>;


export async function generateDailyQuote(): Promise<GenerateDailyQuoteOutput> {
  return dailyQuoteFlow();
}

const prompt = ai.definePrompt({
  name: 'dailyQuotePrompt',
  output: { schema: GenerateDailyQuoteOutputSchema },
  prompt: `You are a source of daily encouragement for a Christian community. 
  
  Your task is to generate a single, uplifting quote for the day. It should be concise and filled with hope.
  
  Also, provide a single, relevant Bible verse that underpins the message of the quote.`,
});

const dailyQuoteFlow = ai.defineFlow(
  {
    name: 'dailyQuoteFlow',
    outputSchema: GenerateDailyQuoteOutputSchema,
  },
  async () => {
    const { output } = await prompt({});
    return output!;
  }
);
