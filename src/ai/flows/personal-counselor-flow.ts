'use server';
/**
 * @fileOverview An AI flow for providing Christian counsel on personal problems.
 * 
 * - generateCounselingResponse - A function that provides a hopeful, scripture-based response to a user's problem.
 * - GenerateCounselingResponseInput - The input type for the function.
 * - GenerateCounselingResponseOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateCounselingResponseInputSchema = z.object({
  problem: z.string().describe('The personal problem or struggle the user is facing and seeking advice on.'),
});
export type GenerateCounselingResponseInput = z.infer<typeof GenerateCounselingResponseInputSchema>;


const GenerateCounselingResponseOutputSchema = z.object({
  hopefulMessage: z.string().describe("A compassionate and encouraging message that acknowledges the user's struggle and offers hope from a Christian perspective."),
  relevantScriptures: z.array(z.string()).describe("An array of 2-3 key Bible verses that directly address the user's problem, providing comfort and guidance."),
  practicalAdvice: z.string().describe("Gentle, practical, and actionable advice based on Christian principles. This should not be medical advice but spiritual guidance, suggesting steps like prayer, reflection, or seeking community support."),
});
export type GenerateCounselingResponseOutput = z.infer<typeof GenerateCounselingResponseOutputSchema>;


export async function generateCounselingResponse(input: GenerateCounselingResponseInput): Promise<GenerateCounselingResponseOutput> {
  return personalCounselorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalCounselorPrompt',
  input: { schema: GenerateCounselingResponseInputSchema },
  output: { schema: GenerateCounselingResponseOutputSchema },
  prompt: `You are a wise, empathetic, and experienced Christian pastor and counselor. A member of your community has come to you seeking guidance for a personal struggle.

  Your task is to provide a response that is filled with hope, grounded in scripture, and offers gentle, practical advice. You must not give medical or clinical advice, but rather spiritual and pastoral guidance.

  The user is struggling with: {{{problem}}}

  Your response must be structured into three parts:
  1.  A "Hopeful Message": Start with a warm, compassionate message. Acknowledge their pain and courage for reaching out. Remind them of God's love, grace, and power to bring healing and restoration.
  2.  "Relevant Scriptures": Identify and list 2-3 key Bible verses that speak directly to their situation. 
  3.  "Practical Advice": Offer a few gentle, actionable steps they can take. This should be spiritual in nature, such as specific prayers, journaling prompts for reflection, or encouragement to connect with a trusted friend or the church community for support. Frame this as a spiritual next step, not a clinical treatment plan.

  Your tone should always be loving, non-judgmental, and encouraging.`,
});

const personalCounselorFlow = ai.defineFlow(
  {
    name: 'personalCounselorFlow',
    inputSchema: GenerateCounselingResponseInputSchema,
    outputSchema: GenerateCounselingResponseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
