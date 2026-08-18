'use server';

import { contentScenarios, ContentScenarioId, SocialPlatform } from '@/lib/content-scenarios';
import { generateBlogArticle, generateSocialPost } from '@/ai/flows/generate-content-draft';

export type ContentSuccessState =
  | { type: 'blog'; titleOptions: string[]; metaDescription: string; body: string }
  | { type: 'social'; post: string; hashtags: string[] };

export type ContentFormState = ContentSuccessState | { error: string };

export async function generateContentDraftAction(formData: FormData): Promise<ContentFormState> {
  try {
    const scenarioId = formData.get('scenarioId') as ContentScenarioId;
    const scenarioDetails = contentScenarios[scenarioId];

    if (!scenarioDetails) {
      return { error: 'Invalid content type selected.' };
    }

    const tone = formData.get('tone') as string;
    const language = formData.get('language') as string;

    const fieldsToValidate: Record<string, any> = {};
    for (const field of scenarioDetails.fields) {
      fieldsToValidate[field] = formData.get(field);
    }

    const parsedFormData = scenarioDetails.formSchema.safeParse(fieldsToValidate);
    if (!parsedFormData.success) {
      const errorMessages = Object.values(parsedFormData.error.flatten().fieldErrors).flat().join(', ');
      return { error: `Invalid form data: ${errorMessages}` };
    }

    const data = parsedFormData.data as Record<string, string>;

    if (scenarioDetails.kind === 'blog') {
      const result = await generateBlogArticle({
        topic: data.topic,
        targetKeyword: data.target_keyword,
        targetAudience: data.target_audience,
        keyPoints: data.key_points,
        callToAction: data.call_to_action,
        authorName: data.your_name,
        tone,
        language,
      });

      if (!result.body) {
        return { error: 'Failed to generate the article. Please try again.' };
      }

      return {
        type: 'blog',
        titleOptions: result.titleOptions,
        metaDescription: result.metaDescription,
        body: result.body,
      };
    }

    const result = await generateSocialPost({
      topic: data.topic,
      targetAudience: data.target_audience,
      keyPoints: data.key_points,
      callToAction: data.call_to_action,
      link: data.link,
      platform: scenarioId as SocialPlatform,
      tone,
      language,
    });

    if (!result.post) {
      return { error: 'Failed to generate the post. Please try again.' };
    }

    return { type: 'social', post: result.post, hashtags: result.hashtags };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred.' };
  }
}
