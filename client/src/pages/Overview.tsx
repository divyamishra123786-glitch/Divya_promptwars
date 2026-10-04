import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalStorageProvider } from '../services/storage';
import type { SavedAnalysis, JournalEntry } from '../types';
import { EmptyState, DemoModeBanner } from '../components/ui';
import { api } from '../services/api';

const analysisStore = new LocalStorageProvider<SavedAnalysis>('analyses');
const journalStore = new LocalStorageProvider<JournalEntry>('journal');

const DAILY_QUESTIONS = [
  'What is one assumption you are making about this decision that you haven\'t questioned?',
  'Who is most affected by this decision that you haven\'t consulted?',
  'What would you regret more: acting on this, or not acting?',
  'What information would change your mind entirely?',
  'In 5 years, what will this decision have taught you?',
  'What are you optimising for — and is that actually what matters most?',
  'What does the version of you with no fear choose?',
  'What constraints do you think are fixed that might actually be flexible?',
];

export default function OverviewPage() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [journalCount, setJournalCount] = useState(0);
  const [mode, setMode] = useState<'live' | 'demo'>('demo');
  const [dailyQuestion, setDailyQuestion] = useState('');

  useEffect(() => {
    setAnalyses(analysisStore.list());
    setJournalCount(journalStore.list().length);
    api.health().then((h) => setMode(h.mode as 'live' | 'demo')).catch(() => {});

    // Rotate daily question based on date
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setDailyQuestion(DAILY_QUESTIONS[dayOfYear % DAILY_QUESTIONS.length]);
  }, []);

  const recentAnalyses = analyses.slice(0, 5);
  const highSeverityCount = analyses.reduce((n, a) => n + (a.result.blindSpots.filter(b => b.severity === 'High').length), 0);
  const avgBlindSpots = analyses.length ? (analyses.reduce((n, a) => n + a.result.blindSpots.length, 0) / analyses.length).toFixed(1) : '—';

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="label-xs mb-2">Overview</div>
          <h1 className="font-heading text-3xl text-ivory">Think beyond what you see.</h1>
          <p className="text-muted mt-2">
            {analyses.length === 0
              ? 'Start your first analysis to see insights here.'
              : `You have analyzed ${analyses.length} decision${analyses.length !== 1 ? 's' : ''}.`}
          </p>
        </div>
        <button
          id="overview-new-analysis"
          onClick={() => navigate('/app/new')}
          className="btn-primary"
        >
          ✦ New Analysis
        </button>
      </div>

      {mode === 'demo' && <DemoModeBanner />}

      {/* Quick analysis box */}
      <div className="p-5 rounded-xl border border-accent/20 bg-accent/05">
        <p className="font-heading text-sm text-accent mb-3">Quick analysis</p>
        <p className="text-sm text-muted mb-4">Have a decision in mind? Start analyzing right now.</p>
        <button
          id="overview-quick-analyze"
          onClick={() => navigate('/app/new')}
          className="btn-primary text-sm py-2.5"
        >
          Analyze My Decision →
        </button>
      </div>

      {/* Daily Critical Question */}
      <div className="p-5 rounded-xl border border-sage/20 bg-sage/05">
        <div className="label-xs text-sage mb-2">Daily Critical Question</div>
        <p className="text-ivory text-base leading-relaxed italic">"{dailyQuestion}"</p>
      </div>

      {/* Stats — only real data */}
      {analyses.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Analyses', value: analyses.length.toString() },
            { label: 'Avg Blind Spots', value: avgBlindSpots },
            { label: 'High Severity', value: highSeverityCount.toString() },
            { label: 'Journal Entries', value: journalCount.toString() },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl border border-white/06 bg-card/50 text-center">
              <p className="font-heading text-2xl font-bold text-accent">{stat.value}</p>
              <p className="label-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Decision Activity Timeline */}
      {analyses.length > 0 && (
        <section aria-label="Decision activity timeline">
          <div className="label-xs mb-4">Decision Activity Timeline</div>
          <div className="space-y-2">
            {analyses.slice(0, 10).map((a) => {
              const date = new Date(a.createdAt);
              const highCount = a.result.blindSpots.filter(b => b.severity === 'High').length;
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-white/05 bg-card/30 hover:bg-card/50 transition-colors"
                >
                  <div className="w-16 shrink-0 text-center">
                    <p className="text-xs text-accent font-medium">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ivory truncate">{a.title}</p>
                    <p className="text-xs text-muted">{a.result.blindSpots.length} blind spots • {highCount} high severity</p>
                  </div>
                  <button
                    onClick={() => navigate(`/app/analysis/${a.id}`)}
                    className="btn-ghost text-xs shrink-0"
                  >
                    View →
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent decisions */}
      {recentAnalyses.length > 0 ? (
        <section aria-label="Recent decisions">
          <div className="flex items-center justify-between mb-4">
            <div className="label-xs">Recent Decisions</div>
            <button onClick={() => navigate('/app/decisions')} className="btn-ghost text-xs">
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {recentAnalyses.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/06 bg-card/50 hover:border-accent/20 transition-colors cursor-pointer"
                onClick={() => navigate(`/app/analysis/${a.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/app/analysis/${a.id}`)}
              >
                <div className="eclipse-sm shrink-0" style={{ width: '20px', height: '20px' }} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ivory truncate">{a.title}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(a.createdAt).toLocaleDateString()} • {a.result.blindSpots.length} blind spots
                  </p>
                </div>
                <span className={`chip-${a.result.blindSpots[0]?.severity.toLowerCase() ?? 'low'}`}>
                  {a.result.blindSpots.filter(b => b.severity === 'High').length > 0 ? 'High risk' : 'Analyzed'}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          title="No analyses yet"
          description="Start by analyzing a decision you're working through. The AI will surface what you may have missed."
          action={
            <button onClick={() => navigate('/app/new')} className="btn-primary">
              ✦ Analyze My First Decision
            </button>
          }
        />
      )}

      {/* Thinking insights — only when enough data */}
      {analyses.length >= 3 && (
        <section className="p-5 rounded-xl border border-white/06 bg-card/40">
          <div className="label-xs mb-3">Thinking Insights</div>
          <p className="text-sm text-ivory mb-2">Patterns from your {analyses.length} analyses:</p>
          <ul className="space-y-2">
            {(() => {
              const categories = analyses.flatMap(a => a.result.blindSpots.map(b => b.category));
              const categoryCounts = categories.reduce((acc, c) => ({ ...acc, [c]: (acc[c] ?? 0) + 1 }), {} as Record<string, number>);
              const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
              return [
                topCategory && (
                  <li key="top" className="text-sm text-muted">
                    Your most frequent blind spot category is{' '}
                    <span className="text-accent font-medium">{topCategory[0]}</span> ({topCategory[1]} occurrences).
                  </li>
                ),
                <li key="avg" className="text-sm text-muted">
                  On average, you have <span className="text-ivory font-medium">{avgBlindSpots} blind spots</span> per analysis.
                </li>,
              ];
            })()}
          </ul>
        </section>
      )}
    </div>
  );
}
