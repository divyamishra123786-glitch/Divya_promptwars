import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Download,
  Eye,
  Layers,
  ShieldAlert,
  Users,
  GitBranch,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { LocalStorageProvider } from '../services/storage';
import type { SavedAnalysis, RiskItem, Likelihood, Impact, BlindSpot } from '../types';
import { DEMO_SAVED_ANALYSIS } from '../services/demoData';
import { SeverityChip, DemoModeBanner, ErrorBanner, EmptyState } from '../components/ui';
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
    if (score >= 3) return 'bg-critical/15 border-critical/30';
    if (score >= 2) return 'bg-warning/15 border-warning/30';
    return 'bg-sage/10 border-sage/20';
  };

  return (
    <div role="img" aria-label="Risk matrix showing likelihood vs impact" className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="label-xs text-muted">Qualitative 3x3 Grid (Impact x Likelihood)</p>
        <span className="text-[11px] px-2 py-0.5 rounded bg-white/05 text-muted border border-white/10">
          AI-estimated, not statistical
        </span>
      </div>

      <div className="mt-2">
        <div className="flex gap-2">
          <div className="flex flex-col justify-around text-center w-16 shrink-0 text-xs font-mono text-muted">
            {['High', 'Medium', 'Low'].map((l) => (
              <div key={l} className="py-3 font-semibold">{l}</div>
            ))}
          </div>
          <div className="flex-1">
            {(['High', 'Medium', 'Low'] as Likelihood[]).map((likelihood) => (
              <div key={likelihood} className="flex gap-2 mb-2">
                {levels.map((impact) => {
                  const dots = getDotsAt(likelihood, impact);
                  return (
                    <div
                      key={impact}
                      className={`flex-1 min-h-16 rounded-xl border p-2 ${cellColor(
                        likelihood,
                        impact
                      )} flex flex-wrap gap-1.5 items-start content-start transition-colors`}
                    >
                      {dots.map((r) => (
                        <span
                          key={r.id}
                          className="w-3 h-3 rounded-full bg-accent shadow-glow"
                          title={`${r.risk} (${r.category})`}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="flex gap-2 mt-1">
              {levels.map((l) => (
                <div key={l} className="flex-1 text-center label-xs font-mono text-muted font-semibold">{l}</div>
              ))}
            </div>
            <p className="text-center label-xs text-muted mt-2 font-mono uppercase tracking-wider">← Impact →</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {risks.map((r) => (
          <div key={r.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg border border-white/06 bg-white/02">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
              <span className="text-ivory font-medium">{r.risk}</span>
            </div>
            <span className="text-muted font-mono">
              {r.likelihood} Likelihood / {r.impact} Impact
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalysisResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<SavedAnalysis | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }

    if (id === 'demo-internship-6mo') {
      setAnalysis(DEMO_SAVED_ANALYSIS);
      return;
    }

    const a = analysisStore.get(id);
    if (!a) {
      // Fallback to DEMO if requested demo id
      if (id.includes('demo')) {
        setAnalysis(DEMO_SAVED_ANALYSIS);
      } else {
        setNotFound(true);
      }
      return;
    }
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
      <div className="p-6 max-w-4xl mx-auto">
        <EmptyState
          title="Analysis Not Found"
          description="This decision analysis may have been deleted or the link is invalid."
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
    return <div className="p-6 text-muted">Loading analysis...</div>;
  }

  const { result, title, createdAt, input } = analysis;
  const isDemo = result.mode === 'demo' || analysis.id === DEMO_SAVED_ANALYSIS.id;

  return (
    <div className="min-h-screen space-y-8 pb-12">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 border-b border-white/06 bg-bg/90 backdrop-blur-md px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/app/decisions')} className="btn-ghost text-xs flex items-center gap-1">
              ← My Decisions
            </button>
            <span className="text-white/20">|</span>
            <span className="font-heading text-sm text-ivory font-bold truncate max-w-xs">{title}</span>
            {isDemo && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">DEMO SAMPLE</span>}
          </div>

          <div id="tour-export" className="flex items-center gap-2">
            <button
              onClick={() => navigate('/app/perspective-lab', { state: { analysisId: analysis.id } })}
              className="btn-ghost text-xs flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-accent" /> Perspectives
            </button>
            <button
              onClick={() => navigate('/app/what-if', { state: { analysisId: analysis.id } })}
              className="btn-ghost text-xs flex items-center gap-1.5"
            >
              <GitBranch className="w-3.5 h-3.5 text-accent" /> What-If
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5 shadow-md shadow-accent/20"
            >
              <Download className="w-3.5 h-3.5" /> {exporting ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-8">
        {isDemo && <DemoModeBanner />}
        {exportError && <ErrorBanner message={exportError} />}

        {/* Executive Summary Card */}
        <div className="card space-y-4 border-accent/30 bg-accent/05 p-6">
          <div className="flex items-center justify-between">
            <div className="label-xs text-accent font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Executive Summary
            </div>
            <span className="text-xs text-muted font-mono">{new Date(createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-sm sm:text-base text-ivory/90 leading-relaxed font-serif italic">
            "{result.executiveSummary}"
          </p>

          <div className="p-3 rounded-lg bg-black/30 border border-white/06 text-xs text-muted flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-warning shrink-0" />
            <span>Non-prescriptive analysis: BlindSpot AI illuminates hidden risk factors without telling you what to choose.</span>
          </div>
        </div>

        {/* 4 Signposts Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4 space-y-1 bg-white/02">
            <span className="label-xs text-muted">What You See</span>
            <p className="text-xs text-ivory font-medium truncate">{input.leaningToward || input.title}</p>
          </div>
          <div className="card p-4 space-y-1 bg-white/02">
            <span className="label-xs text-muted">Stated Priorities</span>
            <p className="text-xs text-ivory font-medium truncate">{input.priorities}</p>
          </div>
          <div className="card p-4 space-y-1 border-amber-500/30 bg-amber-500/05">
            <span className="label-xs text-warning">What You Miss</span>
            <p className="text-xs text-amber-200 font-medium">{result.blindSpots.length} Blind Spots Found</p>
          </div>
          <div className="card p-4 space-y-1 border-accent/30 bg-accent/05">
            <span className="label-xs text-accent">What Could Change</span>
            <p className="text-xs text-accent font-medium">{result.riskRadar.length} Risk Factors Mapped</p>
          </div>
        </div>

        {/* Decision DNA Section */}
        <div className="card space-y-4">
          <h2 className="font-heading text-lg font-bold text-ivory flex items-center gap-2">
            <span className="text-accent">🧬</span> Decision DNA Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-white/03 border border-white/06 space-y-1">
              <span className="label-xs text-muted">Core Goal</span>
              <p className="text-ivory font-medium">{result.decisionDna.coreGoal}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/03 border border-white/06 space-y-1">
              <span className="label-xs text-muted">Reasoning Pattern Detected</span>
              <p className="text-ivory font-medium">{result.decisionDna.reasoningPattern}</p>
            </div>
          </div>
        </div>

        {/* Blind Spots Section */}
        <div id="tour-blind-spots" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-ivory flex items-center gap-2">
              <Eye className="w-5 h-5 text-accent" /> Blind Spots ({result.blindSpots.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.blindSpots.map((bs: BlindSpot) => (
              <div key={bs.id} className="card p-5 space-y-3 border-white/10 hover:border-accent/40 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-base font-bold text-ivory">{bs.title}</h3>
                  <SeverityChip severity={bs.severity} />
                </div>
                <div className="space-y-2 text-xs">
                  <p className="text-ivory/90"><strong>What was noticed:</strong> {bs.whatWasNoticed}</p>
                  <p className="text-muted"><strong>Why it matters:</strong> {bs.whyItMatters}</p>
                  <p className="text-amber-200/90"><strong>What is uncertain:</strong> {bs.whatIsUncertain}</p>
                  <div className="p-2.5 rounded bg-white/03 border border-white/06 text-accent">
                    <strong>To investigate:</strong> {bs.whatToInvestigate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unstated Assumptions Section */}
        <div id="tour-assumptions" className="card space-y-4 border-amber-500/30">
          <h2 className="font-heading text-lg font-bold text-warning flex items-center gap-2">
            <Layers className="w-5 h-5" /> Unstated Assumptions Scanner
          </h2>
          <div className="space-y-3">
            {result.assumptions.map((as) => (
              <div key={as.id} className="p-3.5 rounded-xl border border-white/06 bg-white/02 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm text-ivory font-bold">{as.assumption}</span>
                  <SeverityChip severity={as.severity} />
                </div>
                <p className="text-muted"><strong>Risk if invalidated:</strong> {as.risk}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Radar Matrix Section */}
        <div id="tour-risk-radar" className="card space-y-4">
          <h2 className="font-heading text-lg font-bold text-ivory flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-accent" /> Qualitative Risk Radar Matrix
          </h2>
          <RiskMatrix risks={result.riskRadar} />
        </div>

        {/* Critical Questions Section */}
        <div className="card space-y-4 border-accent/30 bg-accent/05">
          <h2 className="font-heading text-lg font-bold text-accent flex items-center gap-2">
            <HelpCircle className="w-5 h-5" /> 5 Critical Questions to Ask Before Deciding
          </h2>
          <ol className="space-y-2 text-xs text-ivory/90 list-decimal list-inside">
            {result.criticalQuestions.slice(0, 5).map((q, idx) => (
              <li key={idx} className="p-2 rounded bg-black/30 border border-white/06 font-medium">{q}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
