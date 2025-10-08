"use server";

import { z } from "zod";
import { generateEmailDraft } from "@/ai/flows/generate-email-draft";
import { scenarios, ScenarioId } from "@/lib/scenarios";

const formSchema = z.object({
  scenarioId: z.custom<ScenarioId>(),
  tone: z.string(),
  language: z.string(),
  formData: z.record(z.string()),
});

export type FormState = {
  draft?: string;
  error?: string;
  timestamp?: number;
};

export async function generateDraftAction(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const rawData = {
      scenarioId: formData.get('scenarioId'),
      tone: formData.get('tone'),
      language: formData.get('language'),
      formData: JSON.parse(formData.get('formData') as string),
    };

    const validatedData = formSchema.safeParse(rawData);

    if (!validatedData.success) {
      console.error(validatedData.error);
      return { error: 'Invalid input data.', timestamp: Date.now() };
    }

    const { scenarioId, tone, language, formData: input } = validatedData.data;
    
    const scenarioDetails = scenarios[scenarioId];
    if (!scenarioDetails) {
      return { error: "Invalid scenario selected.", timestamp: Date.now() };
    }

    // Validate form data against scenario schema
    const parsedFormData = scenarioDetails.formSchema.safeParse(input);
    if (!parsedFormData.success) {
        return { error: 'Form data is invalid.', timestamp: Date.now() };
    }

    const result = await generateEmailDraft({
      scenario: scenarioDetails.i18n_key,
      input: parsedFormData.data,
      tone,
      language,
    });

    if (!result.draft) {
      return { error: 'Failed to generate draft. Please try again.', timestamp: Date.now() };
    }

    return { draft: result.draft };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred.', timestamp: Date.now() };
  }
}
