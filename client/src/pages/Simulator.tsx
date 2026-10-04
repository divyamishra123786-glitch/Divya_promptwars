import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LocalStorageProvider } from '../services/storage';
import type { SavedAnalysis, SimulateResult } from '../types';
import { EmptyState, ErrorBanner, EclipseLoader, SeverityChip } from '../components/ui';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const analysisStore = new LocalStorageProvider<SavedAnalysis>('analyses');

const PRESET_HYPOTHETICALS = [
  'What if the compensation/stipend is reduced by 30%?',
  'What if the duration is extended from 6 months to 12 months?',
  'What if I have to move to a different city for this role?',
  'What if the direct manager leaves after 2 months?',
  'What if I receive a competing offer with higher pay but worse learning?',
];

export default function SimulatorPage() {
  const location = useLocation();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>('');
  const [hypotheticalText, setHypotheticalText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SimulateResult | null>(null);

  useEffect(() => {
    const list = analysisStore.list();
    setAnalyses(list);
    const fromState = (location.state as { analysisId?: string } | null)?.analysisId;
    if (fromState) {
      setSelectedAnalysisId(fromState);
    } else if (list.length > 0) {
      setSelectedAnalysisId(list[0].id);
    }
  }, [location.state]);

  const selectedAnalysis = analyses.find((a) => a.id === selectedAnalysisId);

  const handleSimulate = async () => {
    if (!selectedAnalysis || !hypotheticalText.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.simulate({
        analysisId: selectedAnalysis.id,
        originalContext: {
          title: selectedAnalysis.input.title,
          decision: selectedAnalysis.input.decision,
          situation: selectedAnalysis.input.situation,
          priorities: selectedAnalysis.input.priorities,
          leaningToward: selectedAnalysis.input.leaningToward,
        },
        hypotheticals: [
          {
            id: 'h-1',
            label: hypotheticalText.trim(),
            active: true,
            customText: hypotheticalText.trim(),
          },
        ],
      });
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to run scenario simulation');
    } finally {
      setLoading(false);
    }
  };

  if (analyses.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="label-xs">What-If Simulator</div>
        <h1 className="font-heading text-3xl text-ivory">Stress-Test Your Decision</h1>
        <EmptyState
          title="No Decisions Analyzed Yet"
          description="Create your first decision analysis to run what-if scenario simulations."
          action={
            <a href="/app/new" className="btn-primary">
              Analyze a Decision
            </a>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <div className="label-xs mb-2">What-If Simulator</div>
        <h1 className="font-heading text-3xl text-ivory">Stress-test under hypothetical scenarios.</h1>
        <p className="text-muted mt-2">
          Change key variables or test unexpected plot twists to see how your blind spots shift.
        </p>
      </div>

      {/* Selector & Scenario Input */}
      <div className="card space-y-5">
        <div>
          <label className="label-xs block mb-2" htmlFor="analysis-select">
            Select Decision to Stress-Test
          </label>
          <select
            id="analysis-select"
            value={selectedAnalysisId}
            onChange={(e) => setSelectedAnalysisId(e.target.value)}
            className="input-field w-full"
          >
            {analyses.map((a) => (
              <option key={a.id} value={a.id}>
                {a.input.title} ({new Date(a.createdAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-xs block mb-2" htmlFor="hypothetical-input">
            What-If Scenario / Hypothetical Change
          </label>
          <textarea
            id="hypothetical-input"
            rows={3}
            value={hypotheticalText}
            onChange={(e) => setHypotheticalText(e.target.value)}
            placeholder="e.g. What if the internship stipend is cut by 50% and I must commute 2 hours daily?"
            className="input-field w-full"
          />
        </div>

        <div>
          <div className="label-xs mb-2">Preset Quick Scenarios</div>
          <div className="flex flex-wrap gap-2">
            {PRESET_HYPOTHETICALS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setHypotheticalText(preset)}
                className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/03 hover:bg-white/08 text-muted hover:text-ivory transition-colors text-left"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        <button
          onClick={handleSimulate}
          disabled={loading || !hypotheticalText.trim()}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? <EclipseLoader size="sm" /> : 'Run Scenario Simulation'}
        </button>
      </div>

      {/* Simulation Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card space-y-4 border-accent/30 bg-accent/05">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl text-accent">⟳</span>
                  <h2 className="font-heading text-lg text-ivory">Scenario Impact Summary</h2>
                </div>
                <SeverityChip severity={result.overallImpact} label={`Overall Impact: ${result.overallImpact}`} />
              </div>
              <p className="text-ivory text-sm leading-relaxed">{result.summary}</p>
            </div>

            {/* Shifted Risks */}
            {result.shiftedRisks.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-heading text-lg text-ivory">Shifted Risk Dynamics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.shiftedRisks.map((risk, idx) => (
                    <div key={idx} className="card space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-sm text-ivory font-medium">{risk.risk}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/05 text-accent uppercase font-mono">
                          {risk.change}
                        </span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">{risk.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Broken Assumptions */}
            {result.brokenAssumptions.length > 0 && (
              <div className="card space-y-3">
                <h3 className="font-heading text-base text-warning">Broken Assumptions</h3>
                <ul className="space-y-1 text-sm text-ivory/90 list-disc list-inside">
                  {result.brokenAssumptions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* New Questions */}
            {result.newQuestions.length > 0 && (
              <div className="card space-y-3">
                <h3 className="font-heading text-base text-accent">New Critical Questions</h3>
                <ul className="space-y-1 text-sm text-ivory/90 list-disc list-inside">
                  {result.newQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
