'use server';

/**
 * @fileOverview A Genkit flow for summarizing comments using AI.
 *
 * - summarizeComments - A function that summarizes a given text.
 * - SummarizeCommentsInput - The input type for the summarizeComments function.
 * - SummarizeCommentsOutput - The return type for the summarizeComments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCommentsInputSchema = z.object({
  text: z.string().describe('The text to summarize.'),
});

export type SummarizeCommentsInput = z.infer<typeof SummarizeCommentsInputSchema>;

const SummarizeCommentsOutputSchema = z.object({
  summary: z.string().describe('The summarized text.'),
});

export type SummarizeCommentsOutput = z.infer<typeof SummarizeCommentsOutputSchema>;

export async function summarizeComments(input: SummarizeCommentsInput): Promise<SummarizeCommentsOutput> {
  return summarizeCommentsFlow(input);
}

const summarizeCommentsPrompt = ai.definePrompt({
  name: 'summarizeCommentsPrompt',
  input: {schema: SummarizeCommentsInputSchema},
  output: {schema: SummarizeCommentsOutputSchema},
  prompt: `Summarize the following text:\n\n{{text}}`,
});

const summarizeCommentsFlow = ai.defineFlow(
  {
    name: 'summarizeCommentsFlow',
    inputSchema: SummarizeCommentsInputSchema,
    outputSchema: SummarizeCommentsOutputSchema,
  },
  async input => {
    const {output} = await summarizeCommentsPrompt(input);
    return output!;
  }
);
