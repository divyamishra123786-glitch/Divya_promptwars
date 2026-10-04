import { z } from 'zod';

export const PerspectiveRequestSchema = z.object({
  analysisId: z.string().min(1),
  perspective: z.enum(['Recruiter', 'Career Mentor', 'Financial Advisor', 'Family Member', 'Future Self']),
  decisionContext: z.object({
    title: z.string(),
    decision: z.string(),
    situation: z.string(),
    options: z.string().optional(),
    priorities: z.string(),
    leaningToward: z.string().optional(),
  }),
});

export type PerspectiveRequest = z.infer<typeof PerspectiveRequestSchema>;

export const PerspectiveResultSchema = z.object({
  perspective: z.string(),
  lensSummary: z.string(),
  considerations: z.array(z.string()),
  overlookedFactors: z.array(z.string()),
  concerns: z.array(z.string()),
  criticalQuestions: z.array(z.string()),
  notRelevant: z.boolean().optional(),
  notRelevantReason: z.string().optional(),
});

export type PerspectiveResult = z.infer<typeof PerspectiveResultSchema>;

export const PERSPECTIVE_GEMINI_SCHEMA = {
  type: 'object',
  properties: {
    perspective: { type: 'string' },
    lensSummary: { type: 'string' },
    considerations: { type: 'array', items: { type: 'string' } },
    overlookedFactors: { type: 'array', items: { type: 'string' } },
    concerns: { type: 'array', items: { type: 'string' } },
    criticalQuestions: { type: 'array', items: { type: 'string' } },
    notRelevant: { type: 'boolean' },
    notRelevantReason: { type: 'string' },
  },
  required: ['perspective', 'lensSummary', 'considerations', 'overlookedFactors', 'concerns', 'criticalQuestions'],
};
