'use server';

/**
 * @fileOverview Blog article and social media post generation agents.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { socialPlatforms, SocialPlatform } from '@/lib/content-scenarios';

const ContentInputSchema = z.object({
  topic: z.string(),
  targetAudience: z.string(),
  keyPoints: z.string(),
  callToAction: z.string(),
  tone: z.string(),
  language: z.string(),
});

// ---------------------------------------------------------------------------
// Blog article
// ---------------------------------------------------------------------------

const GenerateBlogArticleInputSchema = ContentInputSchema.extend({
  targetKeyword: z.string(),
  authorName: z.string(),
});
export type GenerateBlogArticleInput = z.infer<typeof GenerateBlogArticleInputSchema>;

const GenerateBlogArticleOutputSchema = z.object({
  titleOptions: z.array(z.string()).describe('Three SEO title options, each aiming for 50-60 characters.'),
  metaDescription: z.string().describe('A meta description aiming for 150-160 characters.'),
  body: z.string().describe('The full article body in Markdown, including headings, an FAQ section, internal link placeholders, and source placeholders.'),
});
export type GenerateBlogArticleOutput = z.infer<typeof GenerateBlogArticleOutputSchema>;

export async function generateBlogArticle(input: GenerateBlogArticleInput): Promise<GenerateBlogArticleOutput> {
  return generateBlogArticleFlow(input);
}

const blogPrompt = ai.definePrompt({
  name: 'generateBlogArticlePrompt',
  input: {
    schema: z.object({
      topic: z.string(),
      targetKeyword: z.string(),
      targetAudience: z.string(),
      keyPoints: z.string(),
      callToAction: z.string(),
      tone: z.string(),
      language: z.string(),
      authorName: z.string(),
      publishDate: z.string(),
    }),
  },
  output: { schema: GenerateBlogArticleOutputSchema },
  prompt: `You are an expert SEO content writer and editor. Write a blog article that is genuinely useful, specific, and structured to rank well and convert readers, following the rules below exactly.

Topic: {{{topic}}}
Target keyword: {{{targetKeyword}}}
Target audience: {{{targetAudience}}}
Key points to cover: {{{keyPoints}}}
Desired call to action: {{{callToAction}}}
Tone: {{{tone}}}
Language: {{{language}}}
Author name: {{{authorName}}}
Publish date: {{{publishDate}}}

Produce three things:

1. "titleOptions": exactly 3 distinct SEO title options. Each must be as close to 50-60 characters as possible, include the target keyword naturally (preferably near the start), and be compelling enough to earn a click.

2. "metaDescription": one meta description as close to 150-160 characters as possible, including the target keyword, that accurately previews the article and includes a soft call to action.

3. "body": the full article in Markdown, written in the specified language and tone, following this structure:
   - First line: "*By {{{authorName}}} | Last updated {{{publishDate}}}*"
   - A hook opening paragraph that earns the reader's attention without keyword-stuffing.
   - The target keyword must appear naturally within the first 100 words.
   - Organize the body under clear "## " (H2) and "### " (H3) headings covering the key points provided. Use at least one H2 that contains the target keyword.
   - Write with concrete, specific detail (real-world examples, practical steps, named specifics) rather than generic filler - this signals genuine expertise and experience to both readers and search engines.
   - Wherever you state a statistic, study, or a claim that should be backed by an external source, insert a placeholder in the exact format: [Source needed: brief description of the claim]. Do not invent fake citations or URLs.
   - Naturally weave in 2 to 4 internal link placeholders wherever a related resource on the reader's own site would help, in the exact format: [Internal link: suggested anchor text -> topic it should point to]. Place these inline within relevant sentences, not clustered together.
   - Include a "## Frequently Asked Questions" section near the end with 3 relevant questions as "###" headings, each with a concise, direct answer.
   - End with a short closing section that delivers on the call to action: {{{callToAction}}}.

The article must read as well-researched and trustworthy. Never fabricate statistics, studies, or sources - always use the [Source needed: ...] placeholder instead.
`,
});

const generateBlogArticleFlow = ai.defineFlow(
  {
    name: 'generateBlogArticleFlow',
    inputSchema: GenerateBlogArticleInputSchema,
    outputSchema: GenerateBlogArticleOutputSchema,
  },
  async (input) => {
    const publishDate = new Date().toLocaleDateString(input.language === 'English' ? 'en-US' : undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const { output } = await blogPrompt({
      topic: input.topic,
      targetKeyword: input.targetKeyword,
      targetAudience: input.targetAudience,
      keyPoints: input.keyPoints,
      callToAction: input.callToAction,
      tone: input.tone,
      language: input.language,
      authorName: input.authorName,
      publishDate,
    });
    return output!;
  }
);

// ---------------------------------------------------------------------------
// Social media posts
// ---------------------------------------------------------------------------

const PLATFORM_GUIDELINES: Record<SocialPlatform, string> = {
  linkedin_post: `Platform: LinkedIn.
- Start with a short, scroll-stopping hook line (max ~10 words) on its own line.
- Use short paragraphs (1-2 sentences) with line breaks between them - LinkedIn's feed rewards easy scanning.
- Aim for roughly 900-1300 characters total; engagement drops sharply beyond that.
- End with a soft call to action, ideally phrased as a question that invites comments, followed by the requested call to action.
- Finish with 3-5 relevant hashtags on their own line at the very end.`,
  x_post: `Platform: X (Twitter).
- Write ONE punchy post that fits within 280 characters, including any hashtags.
- Lead with the most attention-grabbing part of the idea - no throat-clearing.
- Use at most 1-2 hashtags, only if they add discoverability.
- Make the call to action fit naturally within the character limit.`,
  instagram_post: `Platform: Instagram.
- First line must work as a standalone hook, since Instagram truncates captions after ~125 characters before "more".
- Conversational, engaging tone; tasteful emoji are welcome but don't overdo it.
- End with a clear call to action, mentioning "link in bio" if relevant instead of a raw URL.
- Finish with a block of 8-12 relevant hashtags, separated from the caption by a line break.`,
  facebook_post: `Platform: Facebook.
- Conversational and personable, front-load the value in the first two lines since Facebook truncates long posts.
- Aim for roughly 400-600 characters for best engagement, though the hard limit is much higher.
- End with a clear call to action, ideally a question that invites comments.
- Use at most 1-2 hashtags; Facebook hashtags don't drive much discovery.`,
  youtube_description: `Platform: YouTube video description.
- First two lines must work as a standalone hook, since YouTube truncates the description before "show more".
- After the hook, include a short paragraph summarizing what the video covers.
- Include a clear call to action (subscribe, visit a link, etc).
- Finish with a line of 3-5 relevant hashtags/tags.`,
};

const GenerateSocialPostInputSchema = ContentInputSchema.extend({
  platform: z.enum(socialPlatforms),
  link: z.string().optional(),
});
export type GenerateSocialPostInput = z.infer<typeof GenerateSocialPostInputSchema>;

const GenerateSocialPostOutputSchema = z.object({
  post: z.string().describe('The full post text, ready to publish, following the platform-specific guidelines given.'),
  hashtags: z.array(z.string()).describe('The hashtags used, without the # symbol.'),
});
export type GenerateSocialPostOutput = z.infer<typeof GenerateSocialPostOutputSchema>;

export async function generateSocialPost(input: GenerateSocialPostInput): Promise<GenerateSocialPostOutput> {
  return generateSocialPostFlow(input);
}

const socialPrompt = ai.definePrompt({
  name: 'generateSocialPostPrompt',
  input: {
    schema: z.object({
      topic: z.string(),
      targetAudience: z.string(),
      keyPoints: z.string(),
      callToAction: z.string(),
      tone: z.string(),
      language: z.string(),
      link: z.string(),
      platformGuidelines: z.string(),
    }),
  },
  output: { schema: GenerateSocialPostOutputSchema },
  prompt: `You are an expert social media copywriter who writes high-converting, platform-native posts.

Topic: {{{topic}}}
Target audience: {{{targetAudience}}}
Key points to include: {{{keyPoints}}}
Desired call to action: {{{callToAction}}}
Link to reference (if any): {{{link}}}
Tone: {{{tone}}}
Language: {{{language}}}

{{{platformGuidelines}}}

Write the post following those platform rules exactly, in the specified language and tone. Return the finished post text in "post", and return the hashtags you used (without the # symbol) as a separate list in "hashtags" - do not duplicate the hashtags inside "post" if they are already listed separately, unless the platform's convention is to keep them inline (X and Facebook: keep any hashtags inline within "post" and also list them in "hashtags"; LinkedIn, Instagram, YouTube: put hashtags only in "hashtags", not inside "post").
`,
});

const generateSocialPostFlow = ai.defineFlow(
  {
    name: 'generateSocialPostFlow',
    inputSchema: GenerateSocialPostInputSchema,
    outputSchema: GenerateSocialPostOutputSchema,
  },
  async (input) => {
    const { output } = await socialPrompt({
      topic: input.topic,
      targetAudience: input.targetAudience,
      keyPoints: input.keyPoints,
      callToAction: input.callToAction,
      tone: input.tone,
      language: input.language,
      link: input.link || '',
      platformGuidelines: PLATFORM_GUIDELINES[input.platform],
    });
    return output!;
  }
);
