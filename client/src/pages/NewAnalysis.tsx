import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ChevronDown, ChevronUp, Layers, Check } from 'lucide-react';
import { api } from '../services/api';
import { LocalStorageProvider } from '../services/storage';
import type { SavedAnalysis, AnalyzeRequest } from '../types';
import { ErrorBanner, EclipseLoader } from '../components/ui';

const analysisStore = new LocalStorageProvider<SavedAnalysis>('analyses');

const PRIORITY_SUGGESTIONS = [
  'Learning Depth',
  'Career Growth',
  'Financial Stability',
  'Academic Balance',
  'Personal Growth',
  'Time Flexibility',
];

const TEMPLATES = [
  {
    label: '🎓 6-Month Internship (Golden Case)',
    title: 'Should I accept the 6-month internship offer?',
    decision: 'Deciding whether to accept a 6-month internship offer at a local firm.',
    situation: 'I am in my 3rd year of undergraduate studies. The office is 20 minutes from home. The monthly stipend is good, and it provides industry experience.',
    priorities: 'Stipend, proximity to home, gaining industry exposure, keeping options open',
    leaningToward: 'Accepting the offer because of financial gain and convenience.',
    concerns: 'Impact on academic course schedule and semester exams.',
  },
  {
    label: '💼 Big Tech vs. Early Startup',
    title: 'Choose between Big Tech offer and early-stage startup',
    decision: 'Deciding between a structured corporate software role and an early-stage AI startup role.',
    situation: 'Big Tech offers higher base pay and structured career ladder. Startup offers equity, high ownership, and fast execution.',
    priorities: 'Learning velocity, equity upside, brand prestige, stability',
    leaningToward: 'Startup for fast growth.',
    concerns: 'Startup runway and work-life balance.',
  },
  {
    label: '🏡 Remote Work vs. Relocation',
    title: 'Should I relocate to tech hub or stay remote?',
    decision: 'Deciding whether to move across the country for an in-person engineering job.',
    situation: 'Current setup is remote from home town. New job requires moving to San Francisco.',
    priorities: 'Network quality, cost of living, lifestyle, career mobility',
    leaningToward: 'Staying remote due to rent costs.',
    concerns: 'Missing in-person mentorship and serendipitous networking.',
  },
];

const STAGED_LOADING_STEPS = [
  'Reading your decision framing & reasoning...',
  'Scanning for hidden assumptions & blind spots...',
  'Evaluating risk matrix & conflicting priorities...',
  'Formulating qualitative questions & Decision DNA...',
];

export default function NewAnalysisPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [decision, setDecision] = useState('');
  const [title, setTitle] = useState('');
  const [priorities, setPriorities] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [leaningToward, setLeaningToward] = useState('');
  const [showAdditional, setShowAdditional] = useState(false);

  // Additional optional fields
  const [situation, setSituation] = useState('');
  const [options, setOptions] = useState('');
  const [concerns, setConcerns] = useState('');
  const [constraints, setConstraints] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState('');

  // Handle location state initialInput from Quick Analysis
  useEffect(() => {
    const initial = (location.state as { initialInput?: string } | null)?.initialInput;
    if (initial) {
      setDecision(initial);
      if (!title) {
        setTitle(initial.length > 50 ? initial.slice(0, 47) + '...' : initial);
      }
    }
  }, [location.state]);

  // Auto-generate title from decision text if title is untouched
  const handleDecisionChange = (val: string) => {
    setDecision(val);
    if (!title || title === decision || title.startsWith(decision.slice(0, 20))) {
      setTitle(val.length > 50 ? val.slice(0, 47) + '...' : val);
    }
  };

  const toggleChip = (chip: string) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter((c) => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
    }
  };

  const applyTemplate = (t: (typeof TEMPLATES)[0], autoAnalyze = false) => {
    setTitle(t.title);
    setDecision(t.decision);
    setSituation(t.situation);
    setPriorities(t.priorities);
    setLeaningToward(t.leaningToward);
    setConcerns(t.concerns);

    if (autoAnalyze) {
      setTimeout(() => {
        handleSubmitInternal({
          title: t.title,
          decision: t.decision,
          situation: t.situation,
          priorities: t.priorities,
          leaningToward: t.leaningToward,
          concerns: t.concerns,
        });
      }, 50);
    }
  };

  const handleSubmitInternal = async (reqData: AnalyzeRequest) => {
    setLoading(true);
    setLoadingStepIndex(0);
    setError('');

    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev < STAGED_LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 900);

    try {
      const result = await api.analyze(reqData);
      clearInterval(interval);

      const saved: SavedAnalysis = {
        id: 'ana-' + Date.now(),
        title: reqData.title || 'Untitled Decision',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        input: reqData,
        result,
      };

      analysisStore.save(saved);
      navigate(`/app/analysis/${saved.id}`);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || 'Failed to analyze decision');
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim()) return;

    const combinedPriorities = [priorities, ...selectedChips].filter(Boolean).join(', ');

    const reqData: AnalyzeRequest = {
      title: title.trim() || decision.trim().slice(0, 50),
      decision: decision.trim(),
      situation: situation.trim() || decision.trim(),
      priorities: combinedPriorities || 'Not explicitly stated',
      leaningToward: leaningToward.trim() || undefined,
      options: options.trim() || undefined,
      concerns: concerns.trim() || undefined,
      constraints: constraints.trim() || undefined,
      budget: budget.trim() || undefined,
      timeline: timeline.trim() || undefined,
    };

    handleSubmitInternal(reqData);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <div className="label-xs mb-2">New Analysis</div>
        <h1 className="font-heading text-3xl font-bold text-ivory">Reveal your decision blind spots.</h1>
        <p className="text-muted mt-1 text-sm">
          Enter your decision context below. Only one field is required.
        </p>
      </div>

      {/* Templates Bar */}
      <div className="card p-4 space-y-3 bg-secondary/60">
        <div className="label-xs text-accent font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Fast-Start Example Templates
        </div>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-white/04 border border-white/10 rounded-lg p-1">
              <button
                type="button"
                onClick={() => applyTemplate(t, false)}
                className="text-xs px-2.5 py-1 text-ivory hover:text-accent transition-colors font-medium"
              >
                {t.label}
              </button>
              <button
                type="button"
                onClick={() => applyTemplate(t, true)}
                className="text-[11px] px-2 py-0.5 rounded bg-accent/20 text-accent font-semibold hover:bg-accent/30 transition-colors flex items-center gap-1"
                title="Fill and run immediate analysis"
              >
                Fill & Analyze <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-5">
          {/* Required Single Field */}
          <div>
            <label className="label-xs block mb-2 text-ivory font-bold" htmlFor="decision-text">
              What decision are you considering? <span className="text-accent">* (Required)</span>
            </label>
            <textarea
              id="decision-text"
              rows={4}
              required
              value={decision}
              onChange={(e) => handleDecisionChange(e.target.value)}
              placeholder="e.g. Deciding whether to accept a 6-month internship offer at a local company with a good stipend, but close to college exams..."
              className="input-field w-full text-sm leading-relaxed"
            />
          </div>

          {/* Editable Title */}
          <div>
            <label className="label-xs block mb-1 text-muted" htmlFor="decision-title">
              Decision Title
            </label>
            <input
              id="decision-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Auto-generated title"
              className="input-field w-full text-sm"
            />
          </div>

          {/* Optional Priorities & Chips */}
          <div className="space-y-3 pt-2">
            <label className="label-xs block text-muted">
              What are you leaning toward or prioritizing? (Optional)
            </label>
            <input
              type="text"
              value={leaningToward}
              onChange={(e) => setLeaningToward(e.target.value)}
              placeholder="e.g. Leaning toward accepting because of stipend and proximity..."
              className="input-field w-full text-sm"
            />

            <div className="space-y-1.5">
              <span className="text-xs text-muted">Quick priority chips:</span>
              <div className="flex flex-wrap gap-2">
                {PRIORITY_SUGGESTIONS.map((chip) => {
                  const isSelected = selectedChips.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleChip(chip)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-accent/20 border-accent text-accent font-semibold'
                          : 'bg-white/03 border-white/10 text-muted hover:text-ivory'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Collapsible Additional Details */}
          <div className="pt-2 border-t border-white/06">
            <button
              type="button"
              onClick={() => setShowAdditional(!showAdditional)}
              className="flex items-center gap-2 text-xs font-semibold text-accent hover:underline focus:outline-none"
            >
              <Layers className="w-4 h-4" />
              {showAdditional ? 'Hide Additional Details (Optional)' : 'Add Additional Details (Optional)'}
              {showAdditional ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdditional && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-xs block mb-1 text-muted">Options Available</label>
                    <input
                      type="text"
                      value={options}
                      onChange={(e) => setOptions(e.target.value)}
                      placeholder="e.g. Option A: Full-time, Option B: Decline"
                      className="input-field w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="label-xs block mb-1 text-muted">Main Concerns</label>
                    <input
                      type="text"
                      value={concerns}
                      onChange={(e) => setConcerns(e.target.value)}
                      placeholder="e.g. Academic load, missing lab sessions"
                      className="input-field w-full text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label-xs block mb-1 text-muted">Budget / Stipend</label>
                    <input
                      type="text"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. $1,500/month stipend"
                      className="input-field w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="label-xs block mb-1 text-muted">Timeline / Duration</label>
                    <input
                      type="text"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      placeholder="e.g. Starts June, 6 months"
                      className="input-field w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="label-xs block mb-1 text-muted">Hard Constraints</label>
                    <input
                      type="text"
                      value={constraints}
                      onChange={(e) => setConstraints(e.target.value)}
                      placeholder="e.g. Must attend Friday college labs"
                      className="input-field w-full text-xs"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={loading || !decision.trim()}
          className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
        >
          {loading ? (
            <EclipseLoader size="sm" message={STAGED_LOADING_STEPS[loadingStepIndex]} />
          ) : (
            <>
              Reveal My Blind Spots <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
