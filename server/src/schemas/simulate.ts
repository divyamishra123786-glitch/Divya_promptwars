import { z } from 'zod';

export const SimulateRequestSchema = z.object({
  analysisId: z.string().min(1),
  originalContext: z.object({
    title: z.string(),
    decision: z.string(),
    situation: z.string(),
    priorities: z.string(),
    leaningToward: z.string().optional(),
  }),
  hypotheticals: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      active: z.boolean(),
      customText: z.string().optional(),
    })
  ).max(10),
});

export type SimulateRequest = z.infer<typeof SimulateRequestSchema>;

export const SimulateResultSchema = z.object({
  summary: z.string(),
  shiftedRisks: z.array(z.object({
    risk: z.string(),
    change: z.enum(['increased', 'decreased', 'new', 'resolved']),
    explanation: z.string(),
  })),
  brokenAssumptions: z.array(z.string()),
  newQuestions: z.array(z.string()),
  overallImpact: z.enum(['Low', 'Medium', 'High']),
});

export type SimulateResult = z.infer<typeof SimulateResultSchema>;

export const SIMULATE_GEMINI_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    shiftedRisks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          risk: { type: 'string' },
          change: { type: 'string', enum: ['increased', 'decreased', 'new', 'resolved'] },
          explanation: { type: 'string' },
        },
        required: ['risk', 'change', 'explanation'],
      },
    },
    brokenAssumptions: { type: 'array', items: { type: 'string' } },
    newQuestions: { type: 'array', items: { type: 'string' } },
    overallImpact: { type: 'string', enum: ['Low', 'Medium', 'High'] },
  },
  required: ['summary', 'shiftedRisks', 'brokenAssumptions', 'newQuestions', 'overallImpact'],
};
