'use server';
/**
 * @fileOverview An AI flow for generating church event ideas.
 * 
 * - generateEventIdeas - A function that generates event ideas based on keywords.
 * - GenerateEventIdeasInput - The input type for the generateEventIdeas function.
 * - GenerateEventIdeasOutput - The return type for the generateEventIdeas function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateEventIdeasInputSchema = z.object({
  keywords: z.string().describe('A comma-separated list of keywords to base the event ideas on.'),
});
export type GenerateEventIdeasInput = z.infer<typeof GenerateEventIdeasInputSchema>;

const GenerateEventIdeasOutputSchema = z.object({
  eventIdeas: z.array(z.object({
    title: z.string().describe('A creative and catchy title for the event.'),
    description: z.string().describe('A brief, one-paragraph description of the event concept.'),
  })).describe('An array of 3 creative event ideas.'),
});
export type GenerateEventIdeasOutput = z.infer<typeof GenerateEventIdeasOutputSchema>;


export async function generateEventIdeas(input: GenerateEventIdeasInput): Promise<GenerateEventIdeasOutput> {
  return eventIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'eventIdeaPrompt',
  input: { schema: GenerateEventIdeasInputSchema },
  output: { schema: GenerateEventIdeasOutputSchema },
  prompt: `You are an expert event planner for a Christian church.
  
  Your task is to generate 3 creative and engaging event ideas based on the following keywords: {{{keywords}}}.
  
  For each idea, provide a compelling title and a short description.
  The ideas should be suitable for a church community context.`,
});

const eventIdeaFlow = ai.defineFlow(
  {
    name: 'eventIdeaFlow',
    inputSchema: GenerateEventIdeasInputSchema,
    outputSchema: GenerateEventIdeasOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
