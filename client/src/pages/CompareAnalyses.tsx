import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LocalStorageProvider } from '../services/storage';
import type { SavedAnalysis } from '../types';
import { SeverityChip, EmptyState } from '../components/ui';

const analysisStore = new LocalStorageProvider<SavedAnalysis>('analyses');

export default function CompareAnalysesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const idA = searchParams.get('a');
  const idB = searchParams.get('b');

  const [a, setA] = useState<SavedAnalysis | null>(null);
  const [b, setB] = useState<SavedAnalysis | null>(null);

  useEffect(() => {
    if (idA) setA(analysisStore.get(idA));
    if (idB) setB(analysisStore.get(idB));
  }, [idA, idB]);

  if (!idA || !idB || !a || !b) {
    return (
      <div className="p-6">
        <EmptyState
          title="Select two analyses to compare"
          description="Go to My Decisions, check two analyses, and click Compare."
          action={
            <button onClick={() => navigate('/app/decisions')} className="btn-primary">
              Go to My Decisions
            </button>
          }
        />
      </div>
    );
  }

  const renderColumn = (analysis: SavedAnalysis) => (
    <div className="flex-1 min-w-0 space-y-4">
      <div className="p-4 rounded-xl border border-accent/20 bg-accent/05">
        <div className="eclipse-sm mb-2" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
        <h2 className="font-heading text-base text-ivory">{analysis.title}</h2>
        <p className="text-xs text-muted mt-1">
          {new Date(analysis.createdAt).toLocaleDateString()} · {analysis.result.blindSpots.length} blind spots
        </p>
      </div>

      {/* Executive summary */}
      <div>
        <p className="label-xs mb-2">Executive Summary</p>
        <p className="text-sm text-muted leading-relaxed">{analysis.result.executiveSummary}</p>
      </div>

      {/* Blind spots */}
      <div>
        <p className="label-xs mb-2">Blind Spots</p>
        <div className="space-y-2">
          {analysis.result.blindSpots.map((bs) => (
            <div key={bs.id} className="p-3 rounded-lg border border-white/06 bg-card/40">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-ivory">{bs.title}</span>
                <SeverityChip severity={bs.severity} />
              </div>
              <p className="text-xs text-muted">{bs.whatWasNoticed}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reasoning pattern */}
      <div>
        <p className="label-xs mb-1">Reasoning Pattern</p>
        <p className="text-sm text-ivory italic">{analysis.result.decisionDna.reasoningPattern}</p>
      </div>

      {/* Critical questions */}
      <div>
        <p className="label-xs mb-2">Critical Questions</p>
        <ol className="space-y-1">
          {analysis.result.criticalQuestions.map((q, i) => (
            <li key={i} className="text-xs text-muted">
              <span className="text-accent">{i + 1}.</span> {q}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="label-xs mb-2">Compare Analyses</div>
          <h1 className="font-heading text-3xl text-ivory">Side-by-Side Comparison</h1>
        </div>
        <button onClick={() => navigate('/app/decisions')} className="btn-ghost text-sm">
          ← Back
        </button>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        {renderColumn(a)}
        <div className="w-px bg-white/08 hidden md:block" aria-hidden="true" />
        {renderColumn(b)}
      </div>
    </div>
  );
}
