import type {
  AnalyzeRequest,
  AnalysisResult,
  PerspectiveType,
  PerspectiveResult,
  SimulateResult,
  Hypothetical,
  ChallengeExchange,
  ChallengeNextResult,
  ReflectResult,
} from '../types';
import { isApiError } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}/api${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  const data = await res.json() as T | { error: { code: string; message: string } };

  if (!res.ok) {
    if (isApiError(data)) {
      throw new Error(data.error.message);
    }
    throw new Error(`Request failed: ${res.status}`);
  }

  return data as T;
}

export const api = {
  health: () =>
    request<{ status: string; mode: string; model: string; timestamp: string }>('/health'),

  analyze: (body: AnalyzeRequest) =>
    request<AnalysisResult>('/analyze', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  perspective: (body: {
    analysisId: string;
    perspective: PerspectiveType;
    decisionContext: {
      title: string;
      decision: string;
      situation: string;
      options?: string;
      priorities: string;
      leaningToward?: string;
    };
  }) =>
    request<PerspectiveResult>('/perspective', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  simulate: (body: {
    analysisId: string;
    originalContext: {
      title: string;
      decision: string;
      situation: string;
      priorities: string;
      leaningToward?: string;
    };
    hypotheticals: Hypothetical[];
  }) =>
    request<SimulateResult>('/simulate', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  challengeNext: (body: {
    sessionId: string;
    decisionContext: {
      title: string;
      decision: string;
      situation: string;
      priorities: string;
      leaningToward?: string;
    };
    history: ChallengeExchange[];
    currentAnswer?: string;
  }) =>
    request<ChallengeNextResult>('/challenge/next', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  reflect: (body: {
    sessionId: string;
    decisionContext: { title: string; decision: string };
    history: ChallengeExchange[];
  }) =>
    request<ReflectResult>('/reflect', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
