
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
    const scenarioId = formData.get('scenarioId') as ScenarioId;
    const scenarioDetails = scenarios[scenarioId];
    
    if (!scenarioDetails) {
      return { error: "Invalid scenario selected.", timestamp: Date.now() };
    }

    const rawData: Record<string, any> = {
      scenarioId: scenarioId,
      tone: formData.get('tone'),
      language: formData.get('language'),
    };
    
    // Extract form data based on scenario fields
    const scenarioFormData: Record<string, any> = {};
    for (const field of scenarioDetails.fields) {
      scenarioFormData[field] = formData.get(field);
    }
    
    // Validate form data against scenario schema
    const parsedFormData = scenarioDetails.formSchema.safeParse(scenarioFormData);
    if (!parsedFormData.success) {
        console.error(parsedFormData.error);
        return { error: 'Form data is invalid.', timestamp: Date.now() };
    }
    
    const result = await generateEmailDraft({
      scenario: scenarioDetails.i18n_key,
      input: parsedFormData.data,
      tone: rawData.tone,
      language: rawData.language,
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
