// ── Shared types ──────────────────────────────────────────────────────────────

export type Severity = 'Low' | 'Medium' | 'High';
export type Likelihood = 'Low' | 'Medium' | 'High';
export type Impact = 'Low' | 'Medium' | 'High';
export type Mode = 'live' | 'demo';

export interface BlindSpot {
  id: string;
  title: string;
  category: string;
  whatWasNoticed: string;
  whyItMatters: string;
  whatIsUncertain: string;
  whatToInvestigate: string;
  severity: Severity;
}

export interface Assumption {
  id: string;
  assumption: string;
  risk: string;
  severity: Severity;
}

export interface RiskItem {
  id: string;
  risk: string;
  likelihood: Likelihood;
  impact: Impact;
  category: string;
}

export interface ConflictingPriority {
  id: string;
  factor1: string;
  factor2: string;
  tension: string;
}

export interface DecisionDna {
  coreGoal: string;
  priorities: string[];
  reasoningPattern: string;
  statedPriorities: string[];
  impliedPriorities: string[];
}

export interface AnalysisResult {
  mode: Mode;
  executiveSummary: string;
  decisionDna: DecisionDna;
  blindSpots: BlindSpot[];
  assumptions: Assumption[];
  riskRadar: RiskItem[];
  conflictingPriorities: ConflictingPriority[];
  missingInformation: string[];
  criticalQuestions: string[];
}

export interface AnalyzeRequest {
  title: string;
  decision: string;
  situation: string;
  options?: string;
  priorities: string;
  leaningToward?: string;
  concerns?: string;
  constraints?: string;
  budget?: string;
  timeline?: string;
}

// ── Perspective types ─────────────────────────────────────────────────────────

export type PerspectiveType = 'Recruiter' | 'Career Mentor' | 'Financial Advisor' | 'Family Member' | 'Future Self';

export interface PerspectiveResult {
  perspective: string;
  lensSummary: string;
  considerations: string[];
  overlookedFactors: string[];
  concerns: string[];
  criticalQuestions: string[];
  notRelevant?: boolean;
  notRelevantReason?: string;
}

// ── Simulate types ────────────────────────────────────────────────────────────

export interface Hypothetical {
  id: string;
  label: string;
  active: boolean;
  customText?: string;
}

export interface ShiftedRisk {
  risk: string;
  change: 'increased' | 'decreased' | 'new' | 'resolved';
  explanation: string;
}

export interface SimulateResult {
  summary: string;
  shiftedRisks: ShiftedRisk[];
  brokenAssumptions: string[];
  newQuestions: string[];
  overallImpact: Severity;
}

// ── Challenge types ───────────────────────────────────────────────────────────

export interface ChallengeExchange {
  question: string;
  answer: string;
}

export interface ChallengeNextResult {
  nextQuestion: string;
  newlyRecognisedFactors: string[];
  clarifiedAssumptions: string[];
  remainingUncertainties: string[];
  followUpQuestions: string[];
  sessionComplete: boolean;
}

export interface ReflectResult {
  summary: string;
  keyInsights: string[];
  thinkingEvolution: string;
  remainingQuestions: string[];
}

// ── Storage types ─────────────────────────────────────────────────────────────

export interface SavedAnalysis {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  input: AnalyzeRequest;
  result: AnalysisResult;
  perspectives?: Record<string, PerspectiveResult>;
  challengeSession?: {
    id: string;
    history: ChallengeExchange[];
    reflection?: ReflectResult;
    completedAt?: string;
  };
  category?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  linkedAnalysisId?: string;
  linkedAnalysisTitle?: string;
  initialThoughts: string;
  whatOverlooked: string;
  whatLearned: string;
  informationNeeded: string;
  nextSteps: string;
}

export interface AppSettings {
  demoMode: boolean;
  version: number;
}

// ── API error ─────────────────────────────────────────────────────────────────

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export function isApiError(val: unknown): val is ApiError {
  return (
    typeof val === 'object' &&
    val !== null &&
    'error' in val &&
    typeof (val as ApiError).error === 'object'
  );
}
