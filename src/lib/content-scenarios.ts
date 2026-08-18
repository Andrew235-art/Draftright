import { Newspaper, Linkedin, Twitter, Instagram, Facebook, Youtube } from 'lucide-react';
import { z } from 'zod';

// Character limits used for the platform-fit indicators in the output UI.
// These are the platforms' actual hard/practical limits, not stylistic advice.
export const PLATFORM_CHAR_LIMITS: Record<string, number> = {
  x_post: 280,
  instagram_post: 2200,
  linkedin_post: 3000,
  facebook_post: 63206,
  youtube_description: 5000,
};

// SEO standards used for the blog title/meta description length indicators.
export const SEO_TITLE_RANGE = { min: 50, max: 60 };
export const SEO_META_DESCRIPTION_RANGE = { min: 150, max: 160 };

export const blogArticleSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  target_keyword: z.string().min(1, 'Target keyword is required.'),
  target_audience: z.string().min(1, 'Target audience is required.'),
  key_points: z.string().min(1, 'Key points are required.'),
  call_to_action: z.string().min(1, 'A call to action is required.'),
  your_name: z.string().min(1, 'Your name is required.'),
});

export const linkedinPostSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  target_audience: z.string().min(1, 'Target audience is required.'),
  key_points: z.string().min(1, 'Key points are required.'),
  call_to_action: z.string().min(1, 'A call to action is required.'),
});

export const xPostSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  target_audience: z.string().min(1, 'Target audience is required.'),
  key_points: z.string().min(1, 'Key points are required.'),
  call_to_action: z.string().min(1, 'A call to action is required.'),
});

export const instagramPostSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  target_audience: z.string().min(1, 'Target audience is required.'),
  key_points: z.string().min(1, 'Key points are required.'),
  call_to_action: z.string().min(1, 'A call to action is required.'),
});

export const facebookPostSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  target_audience: z.string().min(1, 'Target audience is required.'),
  key_points: z.string().min(1, 'Key points are required.'),
  call_to_action: z.string().min(1, 'A call to action is required.'),
  link: z.string().optional(),
});

export const youtubeDescriptionSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  target_audience: z.string().min(1, 'Target audience is required.'),
  key_points: z.string().min(1, 'Key points are required.'),
  call_to_action: z.string().min(1, 'A call to action is required.'),
  link: z.string().optional(),
});

export const contentScenarios = {
  blog_article: {
    id: 'blog_article',
    i18n_key: 'blog_article',
    kind: 'blog' as const,
    icon: Newspaper,
    formSchema: blogArticleSchema,
    fields: ['topic', 'target_keyword', 'target_audience', 'key_points', 'call_to_action', 'your_name'] as const,
  },
  linkedin_post: {
    id: 'linkedin_post',
    i18n_key: 'linkedin_post',
    kind: 'social' as const,
    icon: Linkedin,
    formSchema: linkedinPostSchema,
    fields: ['topic', 'target_audience', 'key_points', 'call_to_action'] as const,
  },
  x_post: {
    id: 'x_post',
    i18n_key: 'x_post',
    kind: 'social' as const,
    icon: Twitter,
    formSchema: xPostSchema,
    fields: ['topic', 'target_audience', 'key_points', 'call_to_action'] as const,
  },
  instagram_post: {
    id: 'instagram_post',
    i18n_key: 'instagram_post',
    kind: 'social' as const,
    icon: Instagram,
    formSchema: instagramPostSchema,
    fields: ['topic', 'target_audience', 'key_points', 'call_to_action'] as const,
  },
  facebook_post: {
    id: 'facebook_post',
    i18n_key: 'facebook_post',
    kind: 'social' as const,
    icon: Facebook,
    formSchema: facebookPostSchema,
    fields: ['topic', 'target_audience', 'key_points', 'call_to_action', 'link'] as const,
  },
  youtube_description: {
    id: 'youtube_description',
    i18n_key: 'youtube_description',
    kind: 'social' as const,
    icon: Youtube,
    formSchema: youtubeDescriptionSchema,
    fields: ['topic', 'target_audience', 'key_points', 'call_to_action', 'link'] as const,
  },
};

export type ContentScenarioId = keyof typeof contentScenarios;
export type ContentScenario = typeof contentScenarios[ContentScenarioId];
export type ContentFormFields = ContentScenario['fields'][number];

export const socialPlatforms = ['linkedin_post', 'x_post', 'instagram_post', 'facebook_post', 'youtube_description'] as const;
export type SocialPlatform = typeof socialPlatforms[number];
