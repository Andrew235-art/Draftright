import { Briefcase, MessageSquare, TrendingUp, UserMinus, MailQuestion, Handshake, Users, CalendarPlus, FileX2 } from 'lucide-react';
import { z } from 'zod';

export const tones = ['formal', 'friendly', 'direct', 'humble'] as const;
export type Tone = typeof tones[number];

// Existing Schemas
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

// New Schemas
export const informationalInterviewSchema = z.object({
  recipient_name: z.string().min(1, 'Recipient name is required.'),
  recipient_role_company: z.string().min(1, "Recipient's role and company are required."),
  field_of_interest: z.string().min(1, 'Your field of interest is required.'),
  your_name: z.string().min(1, 'Your name is required.'),
});

export const postInterviewFollowUpSchema = z.object({
  recipient_name: z.string().min(1, "Interviewer's name is required."),
  job_title: z.string().min(1, 'Job title is required.'),
  key_discussion_point: z.string().min(1, 'A key discussion point is required.'),
  your_name: z.string().min(1, 'Your name is required.'),
});

export const networkingFollowUpSchema = z.object({
  recipient_name: z.string().min(1, 'Recipient name is required.'),
  event_context: z.string().min(1, 'The event or context is required.'),
  point_of_connection: z.string().min(1, 'A point of connection is required.'),
  your_name: z.string().min(1, 'Your name is required.'),
});

export const meetingRequestSchema = z.object({
  recipient_name: z.string().min(1, 'Recipient name is required.'),
  meeting_purpose: z.string().min(1, 'The meeting purpose is required.'),
  proposed_times: z.string().min(1, 'Proposed times are required.'),
  your_name: z.string().min(1, 'Your name is required.'),
});

export const declineRequestSchema = z.object({
  recipient_name: z.string().min(1, 'Recipient name is required.'),
  request_declined: z.string().min(1, 'The request being declined is required.'),
  reason: z.string().min(1, 'A reason for declining is required.'),
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
  },
  informational_interview: {
    id: 'informational_interview',
    i18n_key: 'informational_interview',
    icon: MailQuestion,
    formSchema: informationalInterviewSchema,
    fields: ['recipient_name', 'recipient_role_company', 'field_of_interest', 'your_name'] as const
  },
  post_interview_follow_up: {
    id: 'post_interview_follow_up',
    i18n_key: 'post_interview_follow_up',
    icon: Handshake,
    formSchema: postInterviewFollowUpSchema,
    fields: ['recipient_name', 'job_title', 'key_discussion_point', 'your_name'] as const
  },
  networking_follow_up: {
    id: 'networking_follow_up',
    i18n_key: 'networking_follow_up',
    icon: Users,
    formSchema: networkingFollowUpSchema,
    fields: ['recipient_name', 'event_context', 'point_of_connection', 'your_name'] as const
  },
  meeting_request: {
    id: 'meeting_request',
    i18n_key: 'meeting_request',
    icon: CalendarPlus,
    formSchema: meetingRequestSchema,
    fields: ['recipient_name', 'meeting_purpose', 'proposed_times', 'your_name'] as const
  },
  decline_request: {
    id: 'decline_request',
    i18n_key: 'decline_request',
    icon: FileX2,
    formSchema: declineRequestSchema,
    fields: ['recipient_name', 'request_declined', 'reason', 'your_name'] as const
  }
};

export type ScenarioId = keyof typeof scenarios;
export type Scenario = typeof scenarios[ScenarioId];
export type FormFields = Scenario['fields'][number];
