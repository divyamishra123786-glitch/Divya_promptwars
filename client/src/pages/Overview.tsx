import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Users,
  GitBranch,
  ShieldAlert,
  BookOpen,
  FolderKanban,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { LocalStorageProvider } from '../services/storage';
import type { SavedAnalysis } from '../types';
import { api } from '../services/api';

const analysisStore = new LocalStorageProvider<SavedAnalysis>('analyses');

export default function OverviewPage() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [mode, setMode] = useState<'live' | 'demo'>('demo');
  const [quickInput, setQuickInput] = useState('');

  useEffect(() => {
    setAnalyses(analysisStore.list());
    api.health().then((h) => setMode(h.mode as 'live' | 'demo')).catch(() => setMode('demo'));
  }, []);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    navigate('/app/new-analysis', { state: { initialInput: quickInput.trim() } });
  };

  const handleOpenDemo = () => {
    navigate('/app/analysis/demo-internship-6mo', { state: { demo: true } });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="label-xs mb-2">Dashboard Overview</div>
        <h1 className="font-heading text-3xl font-bold text-ivory">Think beyond what you see.</h1>
        <p className="text-muted mt-1 text-sm">
          Better questions. Broader perspectives. Smarter decisions.
        </p>
      </div>

      {/* Single Demo Status Badge */}
      {mode === 'demo' && (
        <div className="px-4 py-3 rounded-xl border border-amber-500/25 bg-amber-500/08 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            <strong>Demo mode:</strong> No Gemini API key found. Analyses use clearly labelled sample output. Add{' '}
            <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-300">GEMINI_API_KEY</code> in Settings for live AI.
          </p>
        </div>
      )}

      {/* Featured Card — See BlindSpot AI in Action */}
      <div className="card border-accent/30 bg-accent/05 p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent border border-accent/30">
              <Sparkles className="w-3.5 h-3.5" /> 60-Second Interactive Demo
            </div>
            <h2 className="font-heading text-2xl text-ivory font-bold">
              See BlindSpot AI in Action
            </h2>
            <p className="text-sm text-ivory/80 leading-relaxed">
              <strong>"Should I accept a 6-month internship offer?"</strong> Explore how AI illuminates academic impact, hidden travel expenses, mentorship quality, and long-term career positioning without ever deciding for you.
            </p>
          </div>

          <button
            onClick={handleOpenDemo}
            className="btn-primary flex items-center justify-center gap-2 px-6 py-3 shrink-0 shadow-lg shadow-accent/20"
          >
            Explore Interactive Demo <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Analysis Real Textarea */}
      <div className="card space-y-4">
        <h3 className="font-heading text-lg font-semibold text-ivory flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" /> Quick Analysis
        </h3>
        <form onSubmit={handleQuickSubmit} className="space-y-3">
          <textarea
            rows={3}
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="What decision is on your mind? (e.g. Deciding whether to accept a 6-month internship offer...)"
            className="input-field w-full text-sm leading-relaxed"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!quickInput.trim()}
              className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5"
            >
              Reveal My Blind Spots <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Shortcut Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/app/new-analysis')}
          className="card hover:border-accent/40 p-4 text-left space-y-2 group transition-all"
        >
          <PlusCircle className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
          <div className="font-heading text-sm font-semibold text-ivory">New Analysis</div>
          <div className="text-xs text-muted">Scan a decision for hidden blind spots</div>
        </button>

        <button
          onClick={() => navigate('/app/perspective-lab')}
          className="card hover:border-accent/40 p-4 text-left space-y-2 group transition-all"
        >
          <Users className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
          <div className="font-heading text-sm font-semibold text-ivory">Perspective Lab</div>
          <div className="text-xs text-muted">Simulate 5 stakeholder viewpoints</div>
        </button>

        <button
          onClick={() => navigate('/app/what-if')}
          className="card hover:border-accent/40 p-4 text-left space-y-2 group transition-all"
        >
          <GitBranch className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
          <div className="font-heading text-sm font-semibold text-ivory">What-If Simulator</div>
          <div className="text-xs text-muted">Stress-test under changing conditions</div>
        </button>

        <button
          onClick={() => navigate('/app/challenge')}
          className="card hover:border-accent/40 p-4 text-left space-y-2 group transition-all"
        >
          <ShieldAlert className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
          <div className="font-heading text-sm font-semibold text-ivory">Challenge Thinking</div>
          <div className="text-xs text-muted">Socratic sparring for your logic</div>
        </button>

        <button
          onClick={() => navigate('/app/journal')}
          className="card hover:border-accent/40 p-4 text-left space-y-2 group transition-all"
        >
          <BookOpen className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
          <div className="font-heading text-sm font-semibold text-ivory">Decision Journal</div>
          <div className="text-xs text-muted">Track decision reflections & outcomes</div>
        </button>

        <button
          onClick={() => navigate('/app/decisions')}
          className="card hover:border-accent/40 p-4 text-left space-y-2 group transition-all"
        >
          <FolderKanban className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
          <div className="font-heading text-sm font-semibold text-ivory">My Decisions</div>
          <div className="text-xs text-muted">Browse saved decisions & compare</div>
        </button>
      </div>

      {/* Real Activity & History */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold text-ivory">Recent Decisions</h3>
        {analyses.length === 0 ? (
          <div className="card p-6 text-center space-y-3">
            <p className="text-sm text-ivory font-medium">No real decisions saved yet</p>
            <p className="text-xs text-muted max-w-md mx-auto">
              Start your first decision analysis above or try the interactive 60-second demo to explore full AI insights.
            </p>
            <div className="pt-2 flex justify-center gap-3 flex-wrap">
              <button onClick={() => navigate('/app/new-analysis')} className="btn-primary text-xs">
                Start My First Analysis
              </button>
              <button onClick={handleOpenDemo} className="btn-ghost text-xs">
                Explore Demo Analysis
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.slice(0, 5).map((a) => (
              <div
                key={a.id}
                onClick={() => navigate(`/app/analysis/${a.id}`)}
                className="card p-4 hover:border-accent/40 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div>
                  <h4 className="font-heading text-sm font-semibold text-ivory">{a.title}</h4>
                  <p className="text-xs text-muted mt-0.5">
                    Analyzed on {new Date(a.createdAt).toLocaleDateString()} · {a.result.blindSpots.length} Blind Spots Found
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
