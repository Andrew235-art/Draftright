import { Briefcase, MessageSquare, TrendingUp, UserMinus } from 'lucide-react';
import { z } from 'zod';

export const tones = ['formal', 'friendly', 'direct', 'humble'] as const;
export type Tone = typeof tones[number];

export const salaryNegotiationSchema = z.object({
  recipient_name: z.string().min(1, 'Recipient name is required.'),
  current_salary: z.string().min(1, 'Current salary is required.'),
  desired_salary: z.string().min(1, 'Desired salary is required.'),
  key_achievements: z.string().min(1, 'Please list at least one achievement.'),
  your_name: z.string().min(1, 'Your name is required.'),
});

export const projectUpdateSchema = z.object({
  recipient_name: z.string().min(1, 'Recipient name is required.'),
  project_name: z.string().min(1, 'Project name is required.'),
  progress_summary: z.string().min(1, 'Progress summary is required.'),
  blockers: z.string().optional(),
  next_steps: z.string().min(1, 'Next steps are required.'),
  your_name: z.string().min(1, 'Your name is required.'),
});

export const feedbackRequestSchema = z.object({
    recipient_name: z.string().min(1, 'Recipient name is required.'),
    work_item: z.string().min(1, 'Work item is required.'),
    specific_questions: z.string().optional(),
    your_name: z.string().min(1, 'Your name is required.'),
});

export const resignationLetterSchema = z.object({
    recipient_name: z.string().min(1, 'Recipient name is required.'),
    last_day: z.string().min(1, 'Last day is required.'),
    your_name: z.string().min(1, 'Your name is required.'),
});


export const scenarios = {
  salary_negotiation: {
    id: 'salary_negotiation',
    i18n_key: 'salary_negotiation',
    icon: TrendingUp,
    formSchema: salaryNegotiationSchema,
    fields: ['recipient_name', 'current_salary', 'desired_salary', 'key_achievements', 'your_name'] as const
  },
  project_update: {
    id: 'project_update',
    i18n_key: 'project_update',
    icon: Briefcase,
    formSchema: projectUpdateSchema,
    fields: ['recipient_name', 'project_name', 'progress_summary', 'blockers', 'next_steps', 'your_name'] as const
  },
  feedback_request: {
    id: 'feedback_request',
    i18n_key: 'feedback_request',
    icon: MessageSquare,
    formSchema: feedbackRequestSchema,
    fields: ['recipient_name', 'work_item', 'specific_questions', 'your_name'] as const
  },
  resignation_letter: {
    id: 'resignation_letter',
    i18n_key: 'resignation_letter',
    icon: UserMinus,
    formSchema: resignationLetterSchema,
    fields: ['recipient_name', 'last_day', 'your_name'] as const
  }
};

export type ScenarioId = keyof typeof scenarios;
export type Scenario = typeof scenarios[ScenarioId];
export type FormFields = Scenario['fields'][number];
