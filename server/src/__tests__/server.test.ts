import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';

// Mock Gemini service
vi.mock('../services/gemini', () => ({
  isLiveMode: vi.fn(() => false),
  callGemini: vi.fn(),
  checkForVerdicts: vi.fn(() => false),
  stripVerdicts: vi.fn((text: string) => text),
}));

describe('GET /api/health', () => {
  it('returns status ok with mode', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(['live', 'demo']).toContain(res.body.mode);
  });
});

describe('POST /api/analyze', () => {
  const validPayload = {
    title: 'Should I accept the internship?',
    decision: 'I am a student deciding whether to accept a 6-month internship at a local company.',
    situation: 'I am in my third year. The company is 20 minutes from home. The stipend is reasonable.',
    priorities: 'Financial support, industry experience, staying close to home',
    leaningToward: 'Accepting — stipend is good and it is close to home',
    concerns: 'Impact on academics',
    options: 'Accept the internship, Decline and focus on studies, Look for other opportunities',
  };

  it('returns demo analysis when in demo mode', async () => {
    const res = await request(app).post('/api/analyze').send(validPayload);
    expect(res.status).toBe(200);
    expect(res.body.mode).toBe('demo');
    expect(res.body.blindSpots).toBeDefined();
    expect(Array.isArray(res.body.blindSpots)).toBe(true);
    expect(res.body.criticalQuestions).toHaveLength(5);
  });

  it('rejects missing required fields', async () => {
    const res = await request(app).post('/api/analyze').send({ title: 'Too short' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects decision that is too short', async () => {
    const res = await request(app).post('/api/analyze').send({
      ...validPayload,
      decision: 'Too short',
    });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects oversized payload', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({
        ...validPayload,
        decision: 'x'.repeat(3000),
      });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/simulate', () => {
  it('rejects when no active hypotheticals', async () => {
    const res = await request(app).post('/api/simulate').send({
      analysisId: 'test-123',
      originalContext: {
        title: 'Test decision',
        decision: 'Testing',
        situation: 'Test situation',
        priorities: 'Test priorities',
      },
      hypotheticals: [{ id: 'h1', label: 'Something changes', active: false }],
    });
    expect(res.status).toBe(400);
  });

  it('returns demo simulation in demo mode', async () => {
    const res = await request(app).post('/api/simulate').send({
      analysisId: 'test-123',
      originalContext: {
        title: 'Test decision',
        decision: 'Testing',
        situation: 'Test situation',
        priorities: 'Test priorities',
      },
      hypotheticals: [{ id: 'h1', label: 'Something changes', active: true }],
    });
    expect(res.status).toBe(200);
    expect(res.body.summary).toBeDefined();
  });
});

describe('POST /api/challenge/next', () => {
  it('returns first question in demo mode', async () => {
    const res = await request(app).post('/api/challenge/next').send({
      sessionId: 'sess-1',
      decisionContext: {
        title: 'Internship decision',
        decision: 'Should I take the internship?',
        situation: 'Third year student with a good offer',
        priorities: 'Learning, stipend, location',
      },
      history: [],
    });
    expect(res.status).toBe(200);
    expect(res.body.nextQuestion).toBeDefined();
    expect(typeof res.body.nextQuestion).toBe('string');
    expect(res.body.nextQuestion.length).toBeGreaterThan(10);
  });
});

describe('Guardrail: no verdict language in demo data', () => {
  it('demo analysis contains no verdict language', async () => {
    const res = await request(app).post('/api/analyze').send({
      title: 'Should I accept the internship?',
      decision: 'I am a student deciding whether to accept a 6-month internship at a local company.',
      situation: 'I am in my third year. The company is 20 minutes from home. The stipend is reasonable.',
      priorities: 'Financial support, industry experience, staying close to home',
    });
    const body = JSON.stringify(res.body);
    expect(body).not.toMatch(/you should accept/i);
    expect(body).not.toMatch(/you should reject/i);
    expect(body).not.toMatch(/best option/i);
    expect(body).not.toMatch(/I recommend/i);
  });
});
