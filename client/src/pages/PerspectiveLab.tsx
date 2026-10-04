import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LocalStorageProvider } from '../services/storage';
import type { SavedAnalysis, PerspectiveResult, PerspectiveType } from '../types';
import { EmptyState, ErrorBanner, EclipseLoader } from '../components/ui';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const analysisStore = new LocalStorageProvider<SavedAnalysis>('analyses');
const PERSPECTIVES: PerspectiveType[] = ['Recruiter', 'Career Mentor', 'Financial Advisor', 'Family Member', 'Future Self'];

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

  const loadPerspective = async (perspective: PerspectiveType, isCompare = false) => {
    if (!selectedAnalysis) return;
    const cached = selectedAnalysis.perspectives?.[perspective];
    if (cached) {
      if (isCompare) setCompareResult(cached);
      else setResult(cached);
      return;
    }

    if (!isCompare) { setLoading(true); setError(''); }
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

      // Cache it
      const updated: SavedAnalysis = {
        ...selectedAnalysis,
        perspectives: { ...selectedAnalysis.perspectives, [perspective]: res },
        updatedAt: new Date().toISOString(),
      };
      analysisStore.save(updated);
      setAnalyses(analysisStore.list());

      if (isCompare) setCompareResult(res);
      else setResult(res);
    } catch (err) {
      if (!isCompare) setError((err as Error).message ?? 'Failed to load perspective');
    } finally {
      if (!isCompare) setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAnalysisId) {
      setResult(null);
      setCompareResult(null);
      loadPerspective(selectedPerspective);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnalysisId]);

  useEffect(() => {
    if (selectedAnalysisId) {
      setResult(null);
      loadPerspective(selectedPerspective);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPerspective]);

  useEffect(() => {
    if (comparePerspective && selectedAnalysisId) {
      setCompareResult(null);
      loadPerspective(comparePerspective, true);
    } else {
      setCompareResult(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comparePerspective]);

  if (analyses.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          title="No analyses to explore"
          description="Analyze a decision first, then come back to explore different perspectives."
        />
      </div>
    );
  }

  const renderPerspectiveContent = (pr: PerspectiveResult) => (
    <div className="space-y-4">
      {pr.notRelevant ? (
        <div className="p-3 rounded bg-white/03 border border-white/08">
          <p className="text-sm text-muted italic">
            This perspective may not be highly relevant: {pr.notRelevantReason}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-ivory leading-relaxed">{pr.lensSummary}</p>
          {pr.considerations.length > 0 && (
            <div>
              <p className="label-xs mb-2">Key considerations</p>
              <ul className="space-y-1">
                {pr.considerations.map((c, i) => (
                  <li key={i} className="text-sm text-muted flex items-start gap-2">
                    <span className="text-accent shrink-0 mt-0.5">◦</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {pr.overlookedFactors.length > 0 && (
            <div>
              <p className="label-xs mb-2">Overlooked factors</p>
              <ul className="space-y-1">
                {pr.overlookedFactors.map((f, i) => (
                  <li key={i} className="text-sm text-muted flex items-start gap-2">
                    <span className="text-warning shrink-0 mt-0.5">◦</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {pr.concerns.length > 0 && (
            <div>
              <p className="label-xs mb-2">Concerns</p>
              <ul className="space-y-1">
                {pr.concerns.map((c, i) => (
                  <li key={i} className="text-sm text-critical/80 flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">◦</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {pr.criticalQuestions.length > 0 && (
            <div>
              <p className="label-xs mb-2">Questions from this viewpoint</p>
              <ul className="space-y-1">
                {pr.criticalQuestions.map((q, i) => (
                  <li key={i} className="text-sm text-ivory italic flex items-start gap-2">
                    <span className="text-accent shrink-0 mt-0.5">{i + 1}.</span>{q}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs text-muted italic border-t border-white/05 pt-2">
            Simulated viewpoint — not professional advice
          </p>
        </>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <div className="label-xs mb-2">Perspective Lab</div>
        <h1 className="font-heading text-3xl text-ivory">See Through Other Eyes</h1>
        <p className="text-muted mt-2">Each perspective triggers a fresh AI analysis of your decision context.</p>
      </div>

      {/* Analysis selector */}
      <div>
        <label htmlFor="perspective-analysis-select" className="label-xs block mb-2">
          Choose a decision to explore
        </label>
        <select
          id="perspective-analysis-select"
          className="input-field max-w-sm"
          value={selectedAnalysisId}
          onChange={(e) => setSelectedAnalysisId(e.target.value)}
        >
          {analyses.map((a) => (
            <option key={a.id} value={a.id}>{a.title}</option>
          ))}
        </select>
      </div>

      {error && <ErrorBanner message={error} onRetry={() => loadPerspective(selectedPerspective)} />}

      {/* Perspective pills */}
      <div>
        <p className="label-xs mb-3">Primary perspective</p>
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Select perspective"
        >
          {PERSPECTIVES.map((p) => (
            <button
              key={p}
              role="tab"
              aria-selected={selectedPerspective === p}
              id={`lab-perspective-${p.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedPerspective(p)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  const idx = PERSPECTIVES.indexOf(p);
                  setSelectedPerspective(PERSPECTIVES[(idx + 1) % PERSPECTIVES.length]);
                }
                if (e.key === 'ArrowLeft') {
                  const idx = PERSPECTIVES.indexOf(p);
                  setSelectedPerspective(PERSPECTIVES[(idx - 1 + PERSPECTIVES.length) % PERSPECTIVES.length]);
                }
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedPerspective === p
                  ? 'bg-accent text-bg'
                  : 'bg-card border border-white/08 text-muted hover:text-ivory hover:border-accent/30'
              }`}
            >
              {p}
              {selectedAnalysis?.perspectives?.[p] && (
                <span className="ml-1 text-xs opacity-60">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Compare toggle */}
      <div>
        <p className="label-xs mb-2">Compare with another perspective (optional)</p>
        <div className="flex flex-wrap gap-2">
          {PERSPECTIVES.filter((p) => p !== selectedPerspective).map((p) => (
            <button
              key={p}
              id={`compare-perspective-${p.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setComparePerspective(comparePerspective === p ? null : p)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all border ${
                comparePerspective === p
                  ? 'border-sage/40 bg-sage/10 text-sage'
                  : 'border-white/08 text-muted hover:text-ivory'
              }`}
            >
              {comparePerspective === p ? '✓ ' : '+ '}{p}
            </button>
          ))}
          {comparePerspective && (
            <button
              onClick={() => setComparePerspective(null)}
              className="px-3 py-1.5 rounded-full text-xs border border-white/08 text-muted"
            >
              Clear compare
            </button>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className={`grid gap-6 ${comparePerspective ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Primary */}
        <div className="p-5 rounded-xl border border-white/08 bg-card/50">
          <p className="label-xs text-accent mb-3">{selectedPerspective}</p>
          {loading ? (
            <EclipseLoader message={`Loading ${selectedPerspective} perspective…`} />
          ) : result ? (
            <AnimatePresence mode="wait">
              <motion.div key={selectedPerspective} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {renderPerspectiveContent(result)}
              </motion.div>
            </AnimatePresence>
          ) : (
            <p className="text-sm text-muted">Loading…</p>
          )}
        </div>

        {/* Compare */}
        {comparePerspective && (
          <div className="p-5 rounded-xl border border-sage/15 bg-sage/03">
            <p className="label-xs text-sage mb-3">{comparePerspective}</p>
            {!compareResult ? (
              <EclipseLoader message={`Loading ${comparePerspective} perspective…`} />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={comparePerspective} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {renderPerspectiveContent(compareResult)}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
