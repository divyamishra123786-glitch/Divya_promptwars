import { z } from 'zod';

export const ChallengeNextRequestSchema = z.object({
  sessionId: z.string().min(1),
  decisionContext: z.object({
    title: z.string(),
    decision: z.string(),
    situation: z.string(),
    priorities: z.string(),
    leaningToward: z.string().optional(),
  }),
  history: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ).max(20),
  currentAnswer: z.string().max(2000).optional(),
});

export type ChallengeNextRequest = z.infer<typeof ChallengeNextRequestSchema>;

export const ChallengeNextResultSchema = z.object({
  nextQuestion: z.string(),
  newlyRecognisedFactors: z.array(z.string()),
  clarifiedAssumptions: z.array(z.string()),
  remainingUncertainties: z.array(z.string()),
  followUpQuestions: z.array(z.string()),
  sessionComplete: z.boolean(),
});

export type ChallengeNextResult = z.infer<typeof ChallengeNextResultSchema>;

export const CHALLENGE_NEXT_GEMINI_SCHEMA = {
  type: 'object',
  properties: {
    nextQuestion: { type: 'string' },
    newlyRecognisedFactors: { type: 'array', items: { type: 'string' } },
    clarifiedAssumptions: { type: 'array', items: { type: 'string' } },
    remainingUncertainties: { type: 'array', items: { type: 'string' } },
    followUpQuestions: { type: 'array', items: { type: 'string' } },
    sessionComplete: { type: 'boolean' },
  },
  required: ['nextQuestion', 'newlyRecognisedFactors', 'clarifiedAssumptions', 'remainingUncertainties', 'followUpQuestions', 'sessionComplete'],
};

export const ReflectRequestSchema = z.object({
  sessionId: z.string().min(1),
  decisionContext: z.object({
    title: z.string(),
    decision: z.string(),
  }),
  history: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});

export type ReflectRequest = z.infer<typeof ReflectRequestSchema>;

export const ReflectResultSchema = z.object({
  summary: z.string(),
  keyInsights: z.array(z.string()),
  thinkingEvolution: z.string(),
  remainingQuestions: z.array(z.string()),
});

export type ReflectResult = z.infer<typeof ReflectResultSchema>;

export const REFLECT_GEMINI_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    keyInsights: { type: 'array', items: { type: 'string' } },
    thinkingEvolution: { type: 'string' },
    remainingQuestions: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary', 'keyInsights', 'thinkingEvolution', 'remainingQuestions'],
};
