'use server';

/**
 * @fileOverview A Genkit flow that controls the output language of the generated email draft.
 *
 * - controlOutputLanguage - A function that handles the email draft generation with language control.
 * - ControlOutputLanguageInput - The input type for the controlOutputLanguage function.
 * - ControlOutputLanguageOutput - The return type for the controlOutputLanguage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ControlOutputLanguageInputSchema = z.object({
  scenario: z.string().describe('The scenario or template selected by the user.'),
  input: z.string().describe('The user input for the email draft.'),
  tone: z.string().describe('The tone or formality level selected by the user.'),
  language: z.string().describe('The language selected by the user (e.g., English, Español, Français).'),
});

export type ControlOutputLanguageInput = z.infer<typeof ControlOutputLanguageInputSchema>;

const ControlOutputLanguageOutputSchema = z.object({
  draft: z.string().describe('The generated email draft in the selected language.'),
});

export type ControlOutputLanguageOutput = z.infer<typeof ControlOutputLanguageOutputSchema>;

export async function controlOutputLanguage(input: ControlOutputLanguageInput): Promise<ControlOutputLanguageOutput> {
  return controlOutputLanguageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'controlOutputLanguagePrompt',
  input: {schema: ControlOutputLanguageInputSchema},
  output: {schema: ControlOutputLanguageOutputSchema},
  prompt: `You are an assistant specialized in generating email drafts in multiple languages.
  The user has selected the following language: {{{language}}}.
  Generate the email draft in the user's selected language. Ensure the draft is well-written and contextually appropriate.

  Scenario: {{{scenario}}}
  Input: {{{input}}}
  Tone: {{{tone}}}

  Draft:`,
});

const controlOutputLanguageFlow = ai.defineFlow(
  {
    name: 'controlOutputLanguageFlow',
    inputSchema: ControlOutputLanguageInputSchema,
    outputSchema: ControlOutputLanguageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
