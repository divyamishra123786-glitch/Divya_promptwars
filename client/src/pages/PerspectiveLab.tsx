import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { LocalStorageProvider } from '../services/storage';
import type { SavedAnalysis, PerspectiveResult, PerspectiveType } from '../types';
import { DEMO_SAVED_ANALYSIS } from '../services/demoData';
import { ErrorBanner, EclipseLoader } from '../components/ui';
import { api } from '../services/api';

const analysisStore = new LocalStorageProvider<SavedAnalysis>('analyses');
const PERSPECTIVES: PerspectiveType[] = [
  'Recruiter',
  'Career Mentor',
  'Financial Advisor',
  'Family Member',
  'Future Self',
];

export default function PerspectiveLabPage() {
  const location = useLocation();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>('');
  const [selectedPerspective, setSelectedPerspective] = useState<PerspectiveType>('Recruiter');
  const [comparePerspective, setComparePerspective] = useState<PerspectiveType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PerspectiveResult | null>(null);
  const [compareResult, setCompareResult] = useState<PerspectiveResult | null>(null);

  useEffect(() => {
    let list = analysisStore.list();
    if (list.length === 0) {
      list = [DEMO_SAVED_ANALYSIS];
    }
    setAnalyses(list);

    const fromState = (location.state as { analysisId?: string } | null)?.analysisId;
    if (fromState && list.some((a) => a.id === fromState)) {
      setSelectedAnalysisId(fromState);
    } else {
      setSelectedAnalysisId(list[0].id);
    }
  }, [location.state]);

  const selectedAnalysis = analyses.find((a) => a.id === selectedAnalysisId) || DEMO_SAVED_ANALYSIS;

  const loadPerspective = async (perspective: PerspectiveType, isCompare = false) => {
    if (!selectedAnalysis) return;

    // Check if cached on analysis object or in demo data
    const cached =
      selectedAnalysis.perspectives?.[perspective] ||
      (selectedAnalysis.id === DEMO_SAVED_ANALYSIS.id
        ? DEMO_SAVED_ANALYSIS.perspectives?.[perspective]
        : undefined);

    if (cached) {
      if (isCompare) setCompareResult(cached);
      else setResult(cached);
      return;
    }

    if (!isCompare) {
      setLoading(true);
      setError('');
    }

    try {
      const res = await api.perspective({
        analysisId: selectedAnalysis.id,
        perspective,
        decisionContext: {
          title: selectedAnalysis.input.title,
          decision: selectedAnalysis.input.decision,
          situation: selectedAnalysis.input.situation,
          options: selectedAnalysis.input.options,
          priorities: selectedAnalysis.input.priorities,
          leaningToward: selectedAnalysis.input.leaningToward,
        },
      });

      if (isCompare) {
        setCompareResult(res);
      } else {
        setResult(res);
      }

      // Cache on local analysis if real saved record
      if (selectedAnalysis.id !== DEMO_SAVED_ANALYSIS.id) {
        const updated = {
          ...selectedAnalysis,
          perspectives: {
            ...selectedAnalysis.perspectives,
            [perspective]: res,
          },
        };
        analysisStore.save(updated);
      }
    } catch (err: any) {
      if (!isCompare) setError(err.message || 'Failed to generate perspective lens');
    } finally {
      if (!isCompare) setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAnalysis) {
      loadPerspective(selectedPerspective, false);
      if (comparePerspective) {
        loadPerspective(comparePerspective, true);
      }
    }
  }, [selectedAnalysisId, selectedPerspective]);

  useEffect(() => {
    if (comparePerspective && selectedAnalysis) {
      loadPerspective(comparePerspective, true);
    } else {
      setCompareResult(null);
    }
  }, [comparePerspective]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="label-xs mb-2">Perspective Lab</div>
        <h1 className="font-heading text-3xl font-bold text-ivory flex items-center gap-3">
          <Users className="w-7 h-7 text-accent" /> 5-Stakeholder Lens Simulation
        </h1>
        <p className="text-muted mt-1 text-sm">
          Simulate how 5 distinct stakeholders view your decision to uncover hidden blind spots.
        </p>
      </div>

      {/* Decision Selector & Compare Switcher */}
      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="label-xs block mb-1 text-muted" htmlFor="perspective-analysis-select">
              Select Decision
            </label>
            <select
              id="perspective-analysis-select"
              value={selectedAnalysisId}
              onChange={(e) => setSelectedAnalysisId(e.target.value)}
              className="input-field w-full text-sm font-medium"
            >
              {analyses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} {a.id === DEMO_SAVED_ANALYSIS.id ? '(DEMO Example)' : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() =>
              setComparePerspective(
                comparePerspective ? null : PERSPECTIVES.find((p) => p !== selectedPerspective) || 'Career Mentor'
              )
            }
            className={`btn-ghost text-xs flex items-center gap-2 self-end sm:self-center px-4 py-2.5 ${
              comparePerspective ? 'bg-accent/20 text-accent border border-accent/30' : ''
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            {comparePerspective ? 'Exit Side-by-Side Compare' : 'Compare Two Lenses'}
          </button>
        </div>

        {/* Perspective Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/06">
          {PERSPECTIVES.map((p) => {
            const isPrimary = p === selectedPerspective;
            const isCompare = p === comparePerspective;
            return (
              <button
                key={p}
                onClick={() => {
                  if (comparePerspective && isPrimary) return;
                  setSelectedPerspective(p);
                }}
                className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                  isPrimary
                    ? 'bg-accent text-bg font-bold shadow-md shadow-accent/20'
                    : isCompare
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-white/04 border border-white/08 text-muted hover:text-ivory'
                }`}
              >
                {p}
                {isCompare && <span className="text-[10px] uppercase font-bold">(Compare)</span>}
              </button>
            );
          })}
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Main Perspective View */}
      {loading ? (
        <div className="card py-16 text-center">
          <EclipseLoader message={`Generating ${selectedPerspective} lens evaluation...`} />
        </div>
      ) : (
        <div className={`grid grid-cols-1 ${comparePerspective ? 'md:grid-cols-2' : ''} gap-6`}>
          {/* Primary Result */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card space-y-5">
              <div className="flex items-center justify-between border-b border-white/06 pb-3">
                <h3 className="font-heading text-lg font-bold text-ivory flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" /> {result.perspective} Lens
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/05 text-muted border border-white/10">
                  Simulated Viewpoint
                </span>
              </div>

              <div className="space-y-1">
                <div className="label-xs text-accent">Lens Summary</div>
                <p className="text-sm text-ivory/90 leading-relaxed font-medium">{result.lensSummary}</p>
              </div>

              <div className="space-y-2">
                <div className="label-xs text-muted">Key Considerations</div>
                <ul className="space-y-1.5">
                  {result.considerations.map((c, idx) => (
                    <li key={idx} className="text-xs text-ivory/80 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="label-xs text-warning">Overlooked Factors</div>
                <ul className="space-y-1.5">
                  {result.overlookedFactors.map((o, idx) => (
                    <li key={idx} className="text-xs text-amber-200/90 flex items-start gap-2">
                      <span className="text-amber-400 shrink-0">•</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="label-xs text-critical">Concerns Raised</div>
                <ul className="space-y-1.5">
                  {result.concerns.map((cn, idx) => (
                    <li key={idx} className="text-xs text-rose-300/90 flex items-start gap-2">
                      <span className="text-rose-400 shrink-0">!</span>
                      <span>{cn}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-white/03 border border-white/06 space-y-1">
                <div className="label-xs text-accent">Critical Question to Ask</div>
                <p className="text-xs italic text-ivory">"{result.criticalQuestions[0]}"</p>
              </div>

              <p className="text-[11px] text-muted text-center pt-2 italic">
                Simulated viewpoint — not professional advice.
              </p>
            </motion.div>
          )}

          {/* Comparison Result */}
          {comparePerspective && compareResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card space-y-5 border-amber-500/30">
              <div className="flex items-center justify-between border-b border-white/06 pb-3">
                <h3 className="font-heading text-lg font-bold text-amber-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> {compareResult.perspective} Lens (Compare)
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Simulated Viewpoint
                </span>
              </div>

              <div className="space-y-1">
                <div className="label-xs text-amber-300">Lens Summary</div>
                <p className="text-sm text-ivory/90 leading-relaxed font-medium">{compareResult.lensSummary}</p>
              </div>

              <div className="space-y-2">
                <div className="label-xs text-muted">Key Considerations</div>
                <ul className="space-y-1.5">
                  {compareResult.considerations.map((c, idx) => (
                    <li key={idx} className="text-xs text-ivory/80 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="label-xs text-warning">Overlooked Factors</div>
                <ul className="space-y-1.5">
                  {compareResult.overlookedFactors.map((o, idx) => (
                    <li key={idx} className="text-xs text-amber-200/90 flex items-start gap-2">
                      <span className="text-amber-400 shrink-0">•</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="label-xs text-critical">Concerns Raised</div>
                <ul className="space-y-1.5">
                  {compareResult.concerns.map((cn, idx) => (
                    <li key={idx} className="text-xs text-rose-300/90 flex items-start gap-2">
                      <span className="text-rose-400 shrink-0">!</span>
                      <span>{cn}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-white/03 border border-white/06 space-y-1">
                <div className="label-xs text-amber-300">Critical Question to Ask</div>
                <p className="text-xs italic text-ivory">"{compareResult.criticalQuestions[0]}"</p>
              </div>

              <p className="text-[11px] text-muted text-center pt-2 italic">
                Simulated viewpoint — not professional advice.
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
