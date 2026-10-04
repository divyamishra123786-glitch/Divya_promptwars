import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LocalStorageProvider } from '../services/storage';
import type { SavedAnalysis, RiskItem, Likelihood, Impact } from '../types';
import { SeverityChip, DemoModeBanner, ErrorBanner, EmptyState, ExpandablePanel } from '../components/ui';
import { exportAnalysisPDF } from '../services/pdf';

const analysisStore = new LocalStorageProvider<SavedAnalysis>('analyses');

const LIKELIHOOD_ORDER: Record<Likelihood, number> = { Low: 0, Medium: 1, High: 2 };
const IMPACT_ORDER: Record<Impact, number> = { Low: 0, Medium: 1, High: 2 };

function RiskMatrix({ risks }: { risks: RiskItem[] }) {
  const levels: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];

  const getDotsAt = (likelihood: Likelihood, impact: Impact) =>
    risks.filter((r) => r.likelihood === likelihood && r.impact === impact);

  const cellColor = (likelihood: Likelihood, impact: Impact) => {
    const l = LIKELIHOOD_ORDER[likelihood];
    const i = IMPACT_ORDER[impact];
    const score = l + i;
    if (score >= 3) return 'bg-critical/15 border-critical/25';
    if (score >= 2) return 'bg-warning/15 border-warning/25';
    return 'bg-sage/10 border-sage/15';
  };

  return (
    <div role="img" aria-label="Risk matrix showing likelihood vs impact">
      <p className="label-xs mb-1">AI-estimated, not statistical</p>
      <div className="mt-4">
        {/* Y-axis label */}
        <div className="flex gap-2">
          <div className="flex flex-col justify-around text-center w-16 shrink-0">
            {['High', 'Medium', 'Low'].map((l) => (
              <div key={l} className="label-xs py-2">{l}</div>
            ))}
          </div>
          {/* Grid */}
          <div className="flex-1">
            {(['High', 'Medium', 'Low'] as Likelihood[]).map((likelihood) => (
              <div key={likelihood} className="flex gap-2 mb-2">
                {levels.map((impact) => {
                  const dots = getDotsAt(likelihood, impact);
                  return (
                    <div
                      key={impact}
                      className={`flex-1 min-h-14 rounded-lg border p-2 ${cellColor(likelihood, impact)} flex flex-wrap gap-1 items-start content-start`}
                    >
                      {dots.map((r) => (
                        <span
                          key={r.id}
                          className="w-2 h-2 rounded-full bg-accent"
                          title={r.risk}
                          aria-label={r.risk}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
            {/* X-axis */}
            <div className="flex gap-2 mt-1">
              {levels.map((l) => (
                <div key={l} className="flex-1 text-center label-xs">{l}</div>
              ))}
            </div>
            <p className="text-center label-xs mt-1">← Impact →</p>
          </div>
        </div>
        <p className="text-center label-xs mt-1 rotate-90 absolute -left-8 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none" aria-hidden="true">Likelihood</p>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-1">
        {risks.map((r) => (
          <div key={r.id} className="flex items-center gap-2 text-xs text-muted">
            <span className="w-2 h-2 rounded-full bg-accent shrink-0" aria-hidden="true" />
            <span className="text-ivory">{r.risk}</span>
            <span className="text-muted">— {r.likelihood} likelihood / {r.impact} impact</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const PERSPECTIVES = ['Recruiter', 'Career Mentor', 'Financial Advisor', 'Family Member', 'Future Self'] as const;

export default function AnalysisResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<SavedAnalysis | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  useEffect(() => {
    if (!id) { setNotFound(true); return; }
    const a = analysisStore.get(id);
    if (!a) { setNotFound(true); return; }
    setAnalysis(a);
  }, [id]);

  const handleExportPDF = async () => {
    if (!analysis) return;
    setExporting(true);
    setExportError('');
    try {
      await exportAnalysisPDF(analysis);
    } catch {
      setExportError('PDF export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (notFound) {
    return (
      <div className="p-6">
        <EmptyState
          title="Analysis not found"
          description="This analysis may have been deleted or the link is incorrect."
          action={
            <button onClick={() => navigate('/app/decisions')} className="btn-primary">
              View My Decisions
            </button>
          }
        />
      </div>
    );
  }

  if (!analysis) {
    return <div className="p-6 text-muted">Loading…</div>;
  }

  const { result, title, createdAt, input } = analysis;
  const highBlindSpots = result.blindSpots.filter(b => b.severity === 'High');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/06 bg-bg/95 backdrop-blur-md px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/app/decisions')} className="btn-ghost text-xs">
              ← My Decisions
            </button>
            <span className="text-white/20">|</span>
            <div className="eclipse-sm" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
            <span className="font-heading text-sm text-ivory truncate max-w-64">{title}</span>
            {result.mode === 'demo' && (
              <span className="chip-medium text-xs">DEMO</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              id="export-pdf-btn"
              onClick={handleExportPDF}
              disabled={exporting}
              className="btn-ghost text-xs"
            >
              {exporting ? 'Exporting…' : '⤓ Export PDF'}
            </button>
            <button
              id="challenge-btn"
              onClick={() => navigate('/app/challenge', { state: { analysisId: id } })}
              className="btn-secondary text-xs py-2"
            >
              ◇ Challenge Thinking
            </button>
            <button
              id="simulator-btn"
              onClick={() => navigate('/app/simulator', { state: { analysisId: id } })}
              className="btn-secondary text-xs py-2"
            >
              ⟳ What-If
            </button>
          </div>
        </div>
      </div>

      <div id="analysis-content" className="max-w-5xl mx-auto p-6 space-y-8">
        {exportError && <ErrorBanner message={exportError} />}

        {result.mode === 'demo' && <DemoModeBanner />}

        {/* Editorial headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="label-xs">
            Analysis · {new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="font-heading text-4xl md:text-5xl text-ivory leading-tight">
            {highBlindSpots.length > 0
              ? `You see ${input.priorities?.split(',')[0]?.trim() ?? 'the benefits'}. Here's what sits just outside the frame.`
              : `${title} — a wider view.`}
          </h1>
        </motion.div>

        {/* Signpost strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'What you see', content: input.leaningToward ?? input.priorities ?? 'Your stated reasoning', col: 'text-ivory' },
            { label: 'What you know', content: input.priorities ?? 'Your known priorities', col: 'text-sage' },
            { label: 'What you miss', content: result.blindSpots.slice(0, 2).map(b => b.title).join(', ') || 'Identified above', col: 'text-accent', highlighted: true },
            { label: 'What could change everything', content: result.criticalQuestions[0] ?? 'See critical questions below', col: 'text-critical' },
          ].map((cell) => (
            <div key={cell.label} className={`signpost-cell ${cell.highlighted ? 'highlighted' : ''}`}>
              <p className={`label-xs mb-2 ${cell.col}`}>{cell.label}</p>
              <p className="text-xs text-muted leading-relaxed">{cell.content}</p>
            </div>
          ))}
        </div>

        {/* Executive Summary */}
        <section aria-labelledby="exec-summary">
          <h2 id="exec-summary" className="font-heading text-xl text-ivory mb-3">Executive Summary</h2>
          <p className="text-ivory/90 leading-relaxed">{result.executiveSummary}</p>
        </section>

        {/* Decision DNA */}
        <section aria-labelledby="decision-dna">
          <ExpandablePanel
            title={<span id="decision-dna">Decision DNA</span>}
            defaultOpen={true}
            badge={<span className="chip-low text-xs ml-2">Reasoning Pattern</span>}
          >
            <div className="pt-4 space-y-4">
              <div>
                <p className="label-xs mb-1">Core Goal</p>
                <p className="text-sm text-ivory">{result.decisionDna.coreGoal}</p>
              </div>
              <div>
                <p className="label-xs mb-1">Reasoning Pattern</p>
                <p className="text-sm text-ivory italic">{result.decisionDna.reasoningPattern}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="label-xs mb-2">Stated priorities</p>
                  <div className="flex flex-wrap gap-2">
                    {result.decisionDna.statedPriorities.map((p) => (
                      <span key={p} className="px-2 py-1 rounded text-xs bg-white/05 text-ivory border border-white/08">{p}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="label-xs mb-2">Implied priorities</p>
                  <div className="flex flex-wrap gap-2">
                    {result.decisionDna.impliedPriorities.map((p) => (
                      <span key={p} className="px-2 py-1 rounded text-xs bg-accent/08 text-accent border border-accent/15">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ExpandablePanel>
        </section>

        {/* Blind Spots */}
        <section aria-labelledby="blind-spots-heading">
          <h2 id="blind-spots-heading" className="font-heading text-xl text-ivory mb-4">
            Blind Spots
            <span className="ml-3 chip-high">{result.blindSpots.length} found</span>
          </h2>
          <div className="space-y-4">
            {result.blindSpots.map((bs, i) => (
              <motion.div
                key={bs.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-xl border border-white/06 bg-card/50 hover:border-accent/15 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-accent text-sm font-bold">#{i + 1}</span>
                      <h3 className="font-heading text-base text-ivory">{bs.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <SeverityChip severity={bs.severity} />
                      <span className="label-xs">{bs.category}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="label-xs text-muted mb-1">What was noticed</p>
                    <p className="text-sm text-ivory leading-relaxed">{bs.whatWasNoticed}</p>
                  </div>
                  <div>
                    <p className="label-xs text-muted mb-1">Why it matters</p>
                    <p className="text-sm text-ivory/80 leading-relaxed">{bs.whyItMatters}</p>
                  </div>
                  <div>
                    <p className="label-xs text-muted mb-1">What is uncertain</p>
                    <p className="text-sm text-muted italic">{bs.whatIsUncertain}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-sage/08 border border-sage/15">
                    <p className="label-xs text-sage mb-1">Investigate →</p>
                    <p className="text-sm text-ivory/90 leading-relaxed">{bs.whatToInvestigate}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Assumptions */}
        <section aria-labelledby="assumptions-heading">
          <ExpandablePanel
            title={<span id="assumptions-heading">Assumptions</span>}
            badge={<span className="chip-medium text-xs ml-2">{result.assumptions.length}</span>}
          >
            <div className="pt-4 space-y-3">
              {result.assumptions.map((a) => (
                <div key={a.id} className="p-4 rounded-lg border border-white/06 bg-card/30">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-ivory">{a.assumption}</p>
                    <SeverityChip severity={a.severity} />
                  </div>
                  <p className="text-xs text-muted">Risk if false: {a.risk}</p>
                </div>
              ))}
            </div>
          </ExpandablePanel>
        </section>

        {/* Risk Radar */}
        <section aria-labelledby="risk-radar-heading">
          <ExpandablePanel
            title={<span id="risk-radar-heading">Risk Radar</span>}
            badge={<span className="chip-high text-xs ml-2">{result.riskRadar.length} risks</span>}
          >
            <div className="pt-4">
              <RiskMatrix risks={result.riskRadar} />
            </div>
          </ExpandablePanel>
        </section>

        {/* Conflicting Priorities */}
        {result.conflictingPriorities.length > 0 && (
          <section aria-labelledby="conflicts-heading">
            <ExpandablePanel title={<span id="conflicts-heading">Conflicting Priorities</span>}>
              <div className="pt-4 space-y-3">
                {result.conflictingPriorities.map((cp) => (
                  <div key={cp.id} className="p-4 rounded-lg border border-warning/15 bg-warning/05">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-sm font-medium text-ivory">{cp.factor1}</span>
                      <span className="text-warning text-xs">⟷</span>
                      <span className="text-sm font-medium text-ivory">{cp.factor2}</span>
                    </div>
                    <p className="text-xs text-muted">{cp.tension}</p>
                  </div>
                ))}
              </div>
            </ExpandablePanel>
          </section>
        )}

        {/* Perspective Switch */}
        <section aria-labelledby="perspective-heading">
          <h2 id="perspective-heading" className="font-heading text-xl text-ivory mb-2">Perspective Switch</h2>
          <p className="text-xs text-muted mb-4 italic">
            Simulated viewpoint — not professional advice. Each perspective is a fresh AI analysis.
          </p>
          <PerspectiveSwitcher analysis={analysis} onUpdate={setAnalysis} />
        </section>

        {/* Missing Information */}
        {result.missingInformation.length > 0 && (
          <section aria-labelledby="missing-info-heading">
            <ExpandablePanel title={<span id="missing-info-heading">Missing Information</span>}>
              <div className="pt-4">
                <ul className="space-y-2">
                  {result.missingInformation.map((info, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted">
                      <span className="text-accent shrink-0 mt-0.5">◦</span>
                      {info}
                    </li>
                  ))}
                </ul>
              </div>
            </ExpandablePanel>
          </section>
        )}

        {/* Critical Questions */}
        <section aria-labelledby="questions-heading">
          <h2 id="questions-heading" className="font-heading text-xl text-ivory mb-4">Critical Questions</h2>
          <div className="space-y-3">
            {result.criticalQuestions.map((q, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border border-white/06 bg-card/40 hover:border-accent/15 transition-colors">
                <span className="font-heading text-2xl font-bold text-accent/30 shrink-0 w-8 text-center">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-sm text-ivory leading-relaxed self-center">{q}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/06">
          <button
            id="results-challenge-btn"
            onClick={() => navigate('/app/challenge', { state: { analysisId: id } })}
            className="btn-secondary"
          >
            ◇ Challenge Your Thinking
          </button>
          <button
            id="results-simulator-btn"
            onClick={() => navigate('/app/simulator', { state: { analysisId: id } })}
            className="btn-secondary"
          >
            ⟳ What-If Simulator
          </button>
          <button
            id="results-journal-btn"
            onClick={() => navigate('/app/journal', { state: { linkedAnalysisId: id, linkedAnalysisTitle: title } })}
            className="btn-secondary"
          >
            ◻ Add Journal Entry
          </button>
          <button
            id="results-export-btn"
            onClick={handleExportPDF}
            disabled={exporting}
            className="btn-ghost"
          >
            {exporting ? 'Exporting…' : '⤓ Export PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Perspective Switcher component
function PerspectiveSwitcher({ analysis, onUpdate }: { analysis: SavedAnalysis; onUpdate: (a: SavedAnalysis) => void }) {
  const [selected, setSelected] = useState<typeof PERSPECTIVES[number]>('Recruiter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cached = analysis.perspectives?.[selected];

  const loadPerspective = async () => {
    if (cached) return;
    setLoading(true);
    setError('');
    try {
      const { api } = await import('../services/api');
      const result = await api.perspective({
        analysisId: analysis.id,
        perspective: selected,
        decisionContext: {
          title: analysis.input.title,
          decision: analysis.input.decision,
          situation: analysis.input.situation,
          options: analysis.input.options,
          priorities: analysis.input.priorities,
          leaningToward: analysis.input.leaningToward,
        },
      });

      const updated: SavedAnalysis = {
        ...analysis,
        perspectives: {
          ...analysis.perspectives,
          [selected]: result,
        },
        updatedAt: new Date().toISOString(),
      };

      const { LocalStorageProvider } = await import('../services/storage');
      const store = new LocalStorageProvider<SavedAnalysis>('analyses');
      store.save(updated);
      onUpdate(updated);
    } catch (err) {
      setError((err as Error).message ?? 'Failed to load perspective');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (p: typeof PERSPECTIVES[number]) => {
    setSelected(p);
    setError('');
  };

  useEffect(() => {
    if (!cached && !loading) {
      // Auto-load if not cached
      loadPerspective();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className="space-y-4">
      {/* Pill bar */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Perspectives">
        {PERSPECTIVES.map((p) => (
          <button
            key={p}
            role="tab"
            aria-selected={selected === p}
            id={`perspective-tab-${p.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={() => handleSelect(p)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                const idx = PERSPECTIVES.indexOf(p);
                handleSelect(PERSPECTIVES[(idx + 1) % PERSPECTIVES.length]);
              }
              if (e.key === 'ArrowLeft') {
                const idx = PERSPECTIVES.indexOf(p);
                handleSelect(PERSPECTIVES[(idx - 1 + PERSPECTIVES.length) % PERSPECTIVES.length]);
              }
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selected === p
                ? 'bg-accent text-bg'
                : 'bg-card border border-white/08 text-muted hover:text-ivory hover:border-accent/30'
            }`}
          >
            {p}
            {analysis.perspectives?.[p] && (
              <span className="ml-1 text-xs opacity-60">✓</span>
            )}
          </button>
        ))}
      </div>

      {error && <ErrorBanner message={error} onRetry={loadPerspective} />}

      {/* Content */}
      <div className="p-5 rounded-xl border border-white/08 bg-card/50 min-h-32">
        {loading ? (
          <div className="flex items-center gap-3 py-4">
            <div className="eclipse-sm animate-pulse" aria-hidden="true" />
            <p className="text-sm text-muted" aria-live="polite">
              Generating {selected} perspective…
            </p>
          </div>
        ) : cached ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {cached.notRelevant ? (
                <div className="p-3 rounded bg-white/03 border border-white/08">
                  <p className="text-sm text-muted italic">
                    This perspective ({selected}) may not be highly relevant to this specific decision:
                    {cached.notRelevantReason && ` ${cached.notRelevantReason}`}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-ivory leading-relaxed">{cached.lensSummary}</p>
                  {cached.considerations.length > 0 && (
                    <div>
                      <p className="label-xs mb-2">Key considerations</p>
                      <ul className="space-y-1">
                        {cached.considerations.map((c, i) => (
                          <li key={i} className="text-sm text-muted flex items-start gap-2">
                            <span className="text-accent shrink-0 mt-0.5">◦</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {cached.overlookedFactors.length > 0 && (
                    <div>
                      <p className="label-xs mb-2">Overlooked factors</p>
                      <ul className="space-y-1">
                        {cached.overlookedFactors.map((f, i) => (
                          <li key={i} className="text-sm text-muted flex items-start gap-2">
                            <span className="text-warning shrink-0 mt-0.5">◦</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {cached.concerns.length > 0 && (
                    <div>
                      <p className="label-xs mb-2">Concerns</p>
                      <ul className="space-y-1">
                        {cached.concerns.map((c, i) => (
                          <li key={i} className="text-sm text-critical/80 flex items-start gap-2">
                            <span className="shrink-0 mt-0.5">◦</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {cached.criticalQuestions.length > 0 && (
                    <div>
                      <p className="label-xs mb-2">Critical questions from this perspective</p>
                      <ul className="space-y-1">
                        {cached.criticalQuestions.map((q, i) => (
                          <li key={i} className="text-sm text-ivory italic flex items-start gap-2">
                            <span className="text-accent shrink-0 mt-0.5">{i + 1}.</span>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
              <p className="text-xs text-muted pt-2 border-t border-white/05 italic">
                Simulated viewpoint — not professional advice
              </p>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-4">
            <button onClick={loadPerspective} className="btn-secondary text-sm">
              Load {selected} Perspective
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
