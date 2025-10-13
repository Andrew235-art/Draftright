
"use server";

import { z } from "zod";
import { generateEmailDraft } from "@/ai/flows/generate-email-draft";
import { scenarios, ScenarioId } from "@/lib/scenarios";

export type FormState = {
  draft?: string;
  error?: string;
};

export async function generateDraftAction(formData: FormData): Promise<FormState> {
  try {
    const scenarioId = formData.get('scenarioId') as ScenarioId;
    const scenarioDetails = scenarios[scenarioId];
    
    if (!scenarioDetails) {
      return { error: "Invalid scenario selected." };
    }

    const tone = formData.get('tone') as string;
    const language = formData.get('language') as string;
    
    // Extract only the fields relevant to the current scenario for validation.
    const fieldsToValidate: Record<string, any> = {};
    for (const field of scenarioDetails.fields) {
        fieldsToValidate[field] = formData.get(field);
    }
    
    // Validate the extracted data.
    const parsedFormData = scenarioDetails.formSchema.safeParse(fieldsToValidate);
    if (!parsedFormData.success) {
        console.error(parsedFormData.error.flatten().fieldErrors);
        const errorMessages = Object.values(parsedFormData.error.flatten().fieldErrors).flat().join(', ');
        return { error: `Invalid form data: ${errorMessages}` };
    }
    
    const result = await generateEmailDraft({
      scenario: scenarioDetails.i18n_key,
      input: parsedFormData.data, // Use the successfully validated data.
      tone: tone,
      language: language,
    });

    if (!result.draft) {
      return { error: 'Failed to generate draft. Please try again.' };
    }

    return { draft: result.draft };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred.' };
  }
}
