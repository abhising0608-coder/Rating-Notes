// src/ai/flows/extract-table.ts
'use server';

/**
 * @fileOverview A flow for extracting table data from pasted text. The
 * flow takes text as input and attempts to extract a table structure from it.
 *
 * - extractTable - A function that handles the table extraction process.
 * - ExtractTableInput - The input type for the extractTable function.
 * - ExtractTableOutput - The return type for the extractTable function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTableInputSchema = z.object({
  text: z
    .string()
    .describe(
      'The text to extract the table data from. This could be pasted from Excel or other sources.'
    ),
});
export type ExtractTableInput = z.infer<typeof ExtractTableInputSchema>;

const ExtractTableOutputSchema = z.object({
  tableData: z
    .string()
    .describe('A JSON string representing the extracted table data.'),
});
export type ExtractTableOutput = z.infer<typeof ExtractTableOutputSchema>;

export async function extractTable(input: ExtractTableInput): Promise<ExtractTableOutput> {
  return extractTableFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTablePrompt',
  input: {schema: ExtractTableInputSchema},
  output: {schema: ExtractTableOutputSchema},
  prompt: `You are a highly skilled data extraction expert. Your task is to extract table data from the given text.

  The output should be a JSON string representing the table data. Each object in the array represents a row in the table.

  Here's the text to extract the table from:
  {{{text}}}
  
  Ensure the JSON is valid and parsable.
`,
});

const extractTableFlow = ai.defineFlow(
  {
    name: 'extractTableFlow',
    inputSchema: ExtractTableInputSchema,
    outputSchema: ExtractTableOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
