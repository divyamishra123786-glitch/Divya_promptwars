import { z } from 'zod';

// ── Request schema ────────────────────────────────────────────────────────────
export const AnalyzeRequestSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  decision: z.string().min(20, 'Please describe your decision in at least 20 characters').max(2000),
  situation: z.string().min(10, 'Situation must be at least 10 characters').max(2000),
  options: z.string().max(2000).optional(),
  priorities: z.string().min(5, 'Please list at least one priority').max(1000),
  leaningToward: z.string().max(1000).optional(),
  concerns: z.string().max(1000).optional(),
  constraints: z.string().max(1000).optional(),
  budget: z.string().max(500).optional(),
  timeline: z.string().max(500).optional(),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

// ── Severity type ─────────────────────────────────────────────────────────────
const Severity = z.enum(['Low', 'Medium', 'High']);
const Likelihood = z.enum(['Low', 'Medium', 'High']);
const Impact = z.enum(['Low', 'Medium', 'High']);

// ── Response schema ───────────────────────────────────────────────────────────
export const AnalysisResultSchema = z.object({
  mode: z.enum(['live', 'demo']).default('live'),
  executiveSummary: z.string(),
  decisionDna: z.object({
    coreGoal: z.string(),
    priorities: z.array(z.string()),
    reasoningPattern: z.string(),
    statedPriorities: z.array(z.string()),
    impliedPriorities: z.array(z.string()),
  }),
  blindSpots: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      category: z.string(),
      whatWasNoticed: z.string(),
      whyItMatters: z.string(),
      whatIsUncertain: z.string(),
      whatToInvestigate: z.string(),
      severity: Severity,
    })
  ).min(1).max(8),
  assumptions: z.array(
    z.object({
      id: z.string(),
      assumption: z.string(),
      risk: z.string(),
      severity: Severity,
    })
  ),
  riskRadar: z.array(
    z.object({
      id: z.string(),
      risk: z.string(),
      likelihood: Likelihood,
      impact: Impact,
      category: z.string(),
    })
  ),
  conflictingPriorities: z.array(
    z.object({
      id: z.string(),
      factor1: z.string(),
      factor2: z.string(),
      tension: z.string(),
    })
  ),
  missingInformation: z.array(z.string()),
  criticalQuestions: z.array(z.string()).length(5),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// Gemini response schema (for structured output)
export const ANALYSIS_GEMINI_SCHEMA = {
  type: 'object',
  properties: {
    executiveSummary: { type: 'string' },
    decisionDna: {
      type: 'object',
      properties: {
        coreGoal: { type: 'string' },
        priorities: { type: 'array', items: { type: 'string' } },
        reasoningPattern: { type: 'string' },
        statedPriorities: { type: 'array', items: { type: 'string' } },
        impliedPriorities: { type: 'array', items: { type: 'string' } },
      },
      required: ['coreGoal', 'priorities', 'reasoningPattern', 'statedPriorities', 'impliedPriorities'],
    },
    blindSpots: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          category: { type: 'string' },
          whatWasNoticed: { type: 'string' },
          whyItMatters: { type: 'string' },
          whatIsUncertain: { type: 'string' },
          whatToInvestigate: { type: 'string' },
          severity: { type: 'string', enum: ['Low', 'Medium', 'High'] },
        },
        required: ['id', 'title', 'category', 'whatWasNoticed', 'whyItMatters', 'whatIsUncertain', 'whatToInvestigate', 'severity'],
      },
    },
    assumptions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          assumption: { type: 'string' },
          risk: { type: 'string' },
          severity: { type: 'string', enum: ['Low', 'Medium', 'High'] },
        },
        required: ['id', 'assumption', 'risk', 'severity'],
      },
    },
    riskRadar: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          risk: { type: 'string' },
          likelihood: { type: 'string', enum: ['Low', 'Medium', 'High'] },
          impact: { type: 'string', enum: ['Low', 'Medium', 'High'] },
          category: { type: 'string' },
        },
        required: ['id', 'risk', 'likelihood', 'impact', 'category'],
      },
    },
    conflictingPriorities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          factor1: { type: 'string' },
          factor2: { type: 'string' },
          tension: { type: 'string' },
        },
        required: ['id', 'factor1', 'factor2', 'tension'],
      },
    },
    missingInformation: {
      type: 'array',
      items: { type: 'string' },
    },
    criticalQuestions: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['executiveSummary', 'decisionDna', 'blindSpots', 'assumptions', 'riskRadar', 'conflictingPriorities', 'missingInformation', 'criticalQuestions'],
};
