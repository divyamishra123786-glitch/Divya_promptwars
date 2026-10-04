import { describe, it, expect, beforeEach } from 'vitest';
import { DEMO_SAVED_ANALYSIS } from '../services/demoData';
import { LocalStorageProvider } from '../services/storage';
import type { SavedAnalysis } from '../types';

describe('BlindSpot AI Client Tests', () => {
  let storage: LocalStorageProvider<SavedAnalysis>;

  beforeEach(() => {
    localStorage.clear();
    storage = new LocalStorageProvider<SavedAnalysis>('test_analyses');
  });

  it('provides a complete golden demo analysis object', () => {
    expect(DEMO_SAVED_ANALYSIS.id).toBe('demo-internship-6mo');
    expect(DEMO_SAVED_ANALYSIS.result.blindSpots.length).toBeGreaterThanOrEqual(4);
    expect(DEMO_SAVED_ANALYSIS.result.assumptions.length).toBeGreaterThanOrEqual(3);
    expect(DEMO_SAVED_ANALYSIS.result.riskRadar.length).toBeGreaterThanOrEqual(4);
    expect(DEMO_SAVED_ANALYSIS.perspectives?.Recruiter).toBeDefined();
  });

  it('persists and retrieves analysis records in LocalStorageProvider', () => {
    storage.save(DEMO_SAVED_ANALYSIS);
    const list = storage.list();
    expect(list.length).toBe(1);
    expect(list[0].title).toBe('Should I accept the 6-month internship offer?');

    const retrieved = storage.get('demo-internship-6mo');
    expect(retrieved?.id).toBe('demo-internship-6mo');

    storage.delete('demo-internship-6mo');
    expect(storage.list().length).toBe(0);
  });
});
