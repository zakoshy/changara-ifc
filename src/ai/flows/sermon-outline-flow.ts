'use server';
/**
 * @fileOverview An AI flow for generating a sermon outline.
 * 
 * - generateSermonOutline - A function that generates a sermon outline based on a topic and scripture.
 * - GenerateSermonOutlineInput - The input type for the generateSermonOutline function.
 * - GenerateSermonOutlineOutput - The return type for the generateSermonOutline function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateSermonOutlineInputSchema = z.object({
  topic: z.string().describe('The main topic or title of the sermon.'),
  scriptures: z.string().describe('A comma-separated list of key bible verses or passages.'),
});
export type GenerateSermonOutlineInput = z.infer<typeof GenerateSermonOutlineInputSchema>;

const SermonPointSchema = z.object({
    pointTitle: z.string().describe("The title of this section of the sermon (e.g., Introduction, Main Point 1, Conclusion)."),
    content: z.string().describe("The detailed content for this section, including explanations, illustrations, and applications."),
    supportingVerses: z.array(z.string()).describe("A list of supporting scripture references for this point."),
});

const GenerateSermonOutlineOutputSchema = z.object({
  sermonTitle: z.string().describe("A compelling title for the sermon based on the topic."),
  outline: z.array(SermonPointSchema).describe('An array of sermon points, including an introduction, at least two main points, and a conclusion.'),
});
export type GenerateSermonOutlineOutput = z.infer<typeof GenerateSermonOutlineOutputSchema>;


export async function generateSermonOutline(input: GenerateSermonOutlineInput): Promise<GenerateSermonOutlineOutput> {
  return sermonOutlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sermonOutlinePrompt',
  input: { schema: GenerateSermonOutlineInputSchema },
  output: { schema: GenerateSermonOutlineOutputSchema },
  prompt: `You are an expert theologian and pastor, skilled at crafting clear and impactful sermons for a Christian congregation.

Your task is to create a sermon outline based on the provided topic and scriptures.

Topic: {{{topic}}}
Key Scriptures: {{{scriptures}}}

The outline must include:
1.  A compelling sermon title.
2.  An "Introduction" that grabs the audience's attention and introduces the topic.
3.  At least two "Main Points" that develop the topic, using the provided scriptures as a foundation. Explain the scriptures and provide practical applications.
4.  A "Conclusion" that summarizes the key takeaways and offers a call to action or encouragement.

For each point in the outline, provide a title, detailed content, and a list of supporting verses.`,
});

const sermonOutlineFlow = ai.defineFlow(
  {
    name: 'sermonOutlineFlow',
    inputSchema: GenerateSermonOutlineInputSchema,
    outputSchema: GenerateSermonOutlineOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
