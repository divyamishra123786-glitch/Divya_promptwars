import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { LocalStorageProvider } from '../services/storage';
import type { SavedAnalysis, AnalyzeRequest } from '../types';
import { ErrorBanner, EclipseLoader } from '../components/ui';

const analysisStore = new LocalStorageProvider<SavedAnalysis>('analyses');

const TEMPLATES: { label: string; data: Partial<AnalyzeRequest> }[] = [
  {
    label: 'Accepting an internship',
    data: {
      title: 'Should I accept the 6-month internship?',
      decision: 'I am a third-year student deciding whether to accept a 6-month internship at a local tech company. The role is a software engineering intern position.',
      situation: 'I am currently in my third year of a computer science degree. The company is about 20 minutes from home. The internship is full-time for 6 months starting next semester.',
      options: 'Accept the internship, Decline and focus on studies, Look for other internship opportunities',
      priorities: 'Financial support from the stipend, gaining industry experience, staying close to home for family reasons',
      leaningToward: 'Accepting the internship — the stipend is good, it is close to home, and it will give me industry experience',
      concerns: 'Impact on my academic performance, whether I will learn anything meaningful, what happens to my GPA',
      constraints: 'Need to maintain at least a 3.0 GPA, cannot move to another city this semester',
    },
  },
  {
    label: 'Choosing a career path',
    data: {
      title: 'Should I switch to product management?',
      decision: 'I am a software engineer with 3 years of experience deciding whether to transition to product management.',
      situation: 'I have been working as a software engineer and recently discovered I enjoy the strategic and user-facing aspects more than pure coding. I have been offered an internal transfer to a PM role.',
      priorities: 'Career growth, meaningful work, compensation, work-life balance',
      leaningToward: 'Making the switch — I feel more energized by product problems than engineering tasks',
    },
  },
  {
    label: 'Starting a business',
    data: {
      title: 'Should I leave my job to start a business?',
      decision: 'I am considering leaving my stable job to launch a SaaS startup I have been building on the side for 6 months.',
      situation: 'I have a working MVP with 3 paying customers. My current salary is my household\'s primary income. I have 6 months of savings.',
      priorities: 'Financial stability, entrepreneurial freedom, building something meaningful',
      leaningToward: 'Leaving my job — the product is gaining traction and I want to go all-in',
    },
  },
  {
    label: 'Moving to another city',
    data: {
      title: 'Should I relocate to a new city for a job offer?',
      decision: 'I have received a very attractive job offer in a city 800km away from where I currently live, near my family and friends.',
      situation: 'The new role is a 40% salary increase and significant career advancement. My current city has family support and a social network I have built over 5 years.',
      priorities: 'Career advancement, family proximity, social connections, financial improvement',
      leaningToward: 'Taking the offer — the career jump feels too good to pass up',
    },
  },
  {
    label: 'Choosing a technology stack',
    data: {
      title: 'Should we switch our backend from Rails to Node.js?',
      decision: 'Our engineering team is debating whether to migrate our production Rails application to a Node.js/TypeScript stack.',
      situation: 'We have a 5-year-old Rails monolith with 50k lines of code. The team has 3 Rails developers and 1 junior who prefers Node.js. We are growing the team.',
      priorities: 'Long-term maintainability, hiring pipeline, performance, team velocity',
      leaningToward: 'Migrating — Node.js would help with hiring and future React/Next.js integration',
    },
  },
  {
    label: 'Pursuing higher education',
    data: {
      title: 'Should I pursue an MBA?',
      decision: 'I am considering applying for a full-time MBA at a top business school, which would require leaving my current job for 2 years.',
      situation: 'I have 4 years of work experience in consulting. The MBA would cost approximately $120,000 in tuition plus 2 years of foregone salary.',
      priorities: 'Career pivot opportunities, network building, personal growth, financial return on investment',
      leaningToward: 'Applying — for the network and the ability to switch industries',
    },
  },
];

const LOADING_STAGES = [
  'Reading your decision context…',
  'Mapping your reasoning patterns…',
  'Surfacing hidden assumptions…',
  'Identifying blind spots…',
  'Calibrating risk radar…',
  'Formulating critical questions…',
];

function generateId(): string {
  return `analysis-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface FormErrors {
  title?: string;
  decision?: string;
  situation?: string;
  priorities?: string;
  general?: string;
}

export default function NewAnalysisPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<AnalyzeRequest>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  // Rotate loading stage
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStage((s) => (s + 1) % LOADING_STAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [loading]);

  const applyTemplate = (data: Partial<AnalyzeRequest>) => {
    setForm(data);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.title || form.title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (!form.decision || form.decision.trim().length < 20) newErrors.decision = 'Please describe your decision in at least 20 characters';
    if (!form.situation || form.situation.trim().length < 10) newErrors.situation = 'Situation must be at least 10 characters';
    if (!form.priorities || form.priorities.trim().length < 5) newErrors.priorities = 'Please list at least one priority';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setLoadingStage(0);

    try {
      const result = await api.analyze(form as AnalyzeRequest);

      const id = generateId();
      const saved: SavedAnalysis = {
        id,
        title: form.title!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        input: form as AnalyzeRequest,
        result,
      };

      analysisStore.save(saved);
      navigate(`/app/analysis/${id}`);
    } catch (err) {
      setErrors({ general: (err as Error).message ?? 'Analysis failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const update = (key: keyof AnalyzeRequest, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((e) => ({ ...e, [key]: undefined }));
    }
  };

  // Decision DNA preview
  const hasDna = form.title || form.decision || form.priorities;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="label-xs mb-2">New Analysis</div>
          <h1 className="font-heading text-3xl text-ivory">Reveal Your Blind Spots</h1>
          <p className="text-muted mt-2">Describe your decision and the AI will surface what you may have overlooked.</p>
        </div>

        {/* Templates */}
        <div className="mb-6">
          <p className="label-xs mb-3">Start from a template</p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.label}
                id={`template-${t.label.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => applyTemplate(t.data)}
                className="px-3 py-1.5 rounded-full text-xs border border-white/10 text-muted hover:border-accent/40 hover:text-accent transition-all duration-200"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-5">
            {errors.general && (
              <ErrorBanner
                message={errors.general}
                onRetry={() => {
                  setErrors({});
                  handleSubmit();
                }}
              />
            )}

            <div>
              <label htmlFor="title" className="label-xs block mb-2">
                Decision Title <span className="text-critical">*</span>
              </label>
              <input
                id="title"
                type="text"
                className={`input-field ${errors.title ? 'border-critical/50' : ''}`}
                placeholder="e.g. Should I accept the internship?"
                value={form.title ?? ''}
                onChange={(e) => update('title', e.target.value)}
                disabled={loading}
              />
              {errors.title && <p className="text-xs text-critical mt-1">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="decision" className="label-xs block mb-2">
                Your Decision <span className="text-critical">*</span>
              </label>
              <textarea
                id="decision"
                className={`input-field min-h-24 resize-y ${errors.decision ? 'border-critical/50' : ''}`}
                placeholder="Describe what you are deciding. Be as specific as you can."
                value={form.decision ?? ''}
                onChange={(e) => update('decision', e.target.value)}
                disabled={loading}
              />
              {errors.decision && <p className="text-xs text-critical mt-1">{errors.decision}</p>}
            </div>

            <div>
              <label htmlFor="situation" className="label-xs block mb-2">
                Your Situation <span className="text-critical">*</span>
              </label>
              <textarea
                id="situation"
                className={`input-field min-h-24 resize-y ${errors.situation ? 'border-critical/50' : ''}`}
                placeholder="Describe the context — your role, constraints, what's happening around this decision."
                value={form.situation ?? ''}
                onChange={(e) => update('situation', e.target.value)}
                disabled={loading}
              />
              {errors.situation && <p className="text-xs text-critical mt-1">{errors.situation}</p>}
            </div>

            <div>
              <label htmlFor="options" className="label-xs block mb-2">Options You're Considering</label>
              <input
                id="options"
                type="text"
                className="input-field"
                placeholder="e.g. Accept the offer, Decline, Negotiate for later start"
                value={form.options ?? ''}
                onChange={(e) => update('options', e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="priorities" className="label-xs block mb-2">
                Your Main Priorities <span className="text-critical">*</span>
              </label>
              <input
                id="priorities"
                type="text"
                className={`input-field ${errors.priorities ? 'border-critical/50' : ''}`}
                placeholder="e.g. Financial stability, career growth, staying near family"
                value={form.priorities ?? ''}
                onChange={(e) => update('priorities', e.target.value)}
                disabled={loading}
              />
              {errors.priorities && <p className="text-xs text-critical mt-1">{errors.priorities}</p>}
            </div>

            <div>
              <label htmlFor="leaningToward" className="label-xs block mb-2">Why You're Leaning a Certain Way</label>
              <textarea
                id="leaningToward"
                className="input-field min-h-20 resize-y"
                placeholder="If you're leaning toward an option, what's driving that? (optional)"
                value={form.leaningToward ?? ''}
                onChange={(e) => update('leaningToward', e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="concerns" className="label-xs block mb-2">Your Concerns</label>
              <input
                id="concerns"
                type="text"
                className="input-field"
                placeholder="What worries you about this decision? (optional)"
                value={form.concerns ?? ''}
                onChange={(e) => update('concerns', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="budget" className="label-xs block mb-2">Budget (optional)</label>
                <input
                  id="budget"
                  type="text"
                  className="input-field"
                  placeholder="e.g. $5,000 savings"
                  value={form.budget ?? ''}
                  onChange={(e) => update('budget', e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="timeline" className="label-xs block mb-2">Timeline (optional)</label>
                <input
                  id="timeline"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Decision needed by Friday"
                  value={form.timeline ?? ''}
                  onChange={(e) => update('timeline', e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              id="reveal-blind-spots"
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full py-4 text-base justify-center"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <span className="eclipse-sm" style={{ width: '18px', height: '18px' }} aria-hidden="true" />
                  <span aria-live="polite">{LOADING_STAGES[loadingStage]}</span>
                </span>
              ) : (
                '◎ Reveal My Blind Spots'
              )}
            </button>

            <p className="text-xs text-muted text-center">
              Your decision text is sent to Google Gemini for analysis. It is not stored on our servers.
            </p>
          </div>

          {/* Decision DNA Preview */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <AnimatePresence mode="wait">
              {!hasDna ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-80 rounded-xl border border-white/06 bg-card/30"
                >
                  <div className="eclipse-lg" aria-hidden="true" style={{ width: '80px', height: '80px' }} />
                  <p className="text-muted text-sm mt-6 text-center px-6">
                    Your Decision DNA will appear here as you type.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="dna"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-xl border border-white/08 bg-card/60 space-y-4"
                >
                  <div className="label-xs">Decision DNA Preview</div>

                  {form.title && (
                    <div>
                      <p className="text-xs text-muted mb-1">Decision</p>
                      <p className="font-heading text-base text-ivory">{form.title}</p>
                    </div>
                  )}

                  {form.priorities && (
                    <div>
                      <p className="text-xs text-muted mb-1">Stated priorities</p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.priorities.split(',').map((p) => (
                          <span key={p} className="px-2 py-0.5 rounded text-xs bg-accent/10 text-accent border border-accent/20">
                            {p.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {form.leaningToward && (
                    <div>
                      <p className="text-xs text-muted mb-1">Leaning toward</p>
                      <p className="text-sm text-ivory">{form.leaningToward}</p>
                    </div>
                  )}

                  {form.concerns && (
                    <div>
                      <p className="text-xs text-muted mb-1">Known concerns</p>
                      <p className="text-sm text-warning">{form.concerns}</p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-white/05">
                    <div className="signpost-cell highlighted">
                      <p className="label-xs text-accent mb-1">What could be missing</p>
                      <p className="text-xs text-muted">
                        Fill in more details to help the AI surface what sits just outside your current frame.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Full-screen loading overlay */}
      {loading && (
        <div
          className="fixed inset-0 bg-bg/90 backdrop-blur-sm z-50 flex items-center justify-center"
          role="status"
          aria-live="polite"
          aria-label="Analyzing your decision"
        >
          <div className="text-center space-y-6">
            <EclipseLoader size="lg" />
            <div className="space-y-2">
              <p className="font-heading text-xl text-ivory">Analyzing your decision…</p>
              <p className="text-muted text-sm animate-pulse">{LOADING_STAGES[loadingStage]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
