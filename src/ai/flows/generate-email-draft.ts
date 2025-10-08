'use server';

/**
 * @fileOverview An email draft generation AI agent.
 *
 * - generateEmailDraft - A function that handles the email draft generation process.
 * - GenerateEmailDraftInput - The input type for the generateEmailDraft function.
 * - GenerateEmailDraftOutput - The return type for the generateEmailDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmailDraftInputSchema = z.object({
  scenario: z.string().describe('The scenario or template for the email.'),
  input: z.record(z.string()).describe('A map of input fields required for the scenario.'),
  tone: z.string().describe('The tone of the email (e.g., Formal, Friendly, Direct, Humble).'),
  language: z.string().describe('The language in which to generate the email (e.g., English, Español, Français).'),
});
export type GenerateEmailDraftInput = z.infer<typeof GenerateEmailDraftInputSchema>;

const GenerateEmailDraftOutputSchema = z.object({
  draft: z.string().describe('The generated email draft.'),
});
export type GenerateEmailDraftOutput = z.infer<typeof GenerateEmailDraftOutputSchema>;

export async function generateEmailDraft(input: GenerateEmailDraftInput): Promise<GenerateEmailDraftOutput> {
  return generateEmailDraftFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailDraftPrompt',
  input: {schema: GenerateEmailDraftInputSchema},
  output: {schema: GenerateEmailDraftOutputSchema},
  prompt: `You are an AI assistant specializing in generating email drafts based on user-selected scenarios, structured input, desired tone, and language.

  Scenario: {{{scenario}}}
  Input: {{#each input}}{{{@key}}}: {{{this}}}
  {{/each}}
  Tone: {{{tone}}}
  Language: {{{language}}}

  Generate an email draft that is appropriate for the given scenario, input, and tone. The draft should be written in the specified language.
  Ensure that the generated draft is well-structured, grammatically correct, and contextually relevant.
  The generated draft should be free of any potentially harmful or inappropriate content.
  Only return the email draft. Do not include any extraneous information.
  `,
});

const generateEmailDraftFlow = ai.defineFlow(
  {
    name: 'generateEmailDraftFlow',
    inputSchema: GenerateEmailDraftInputSchema,
    outputSchema: GenerateEmailDraftOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
