import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SIGNPOSTS = [
  {
    label: 'What you see',
    color: 'text-ivory',
    border: 'border-white/10',
    bg: 'bg-card/40',
    example: 'The stipend is good. The company is close to home.',
  },
  {
    label: 'What you know',
    color: 'text-sage',
    border: 'border-sage/20',
    bg: 'bg-sage/05',
    example: 'You know your college schedule and financial needs.',
  },
  {
    label: 'What you miss',
    color: 'text-accent',
    border: 'border-accent/40',
    bg: 'bg-accent/08',
    example: 'Academic impact, mentorship quality, long-term career signal.',
    highlighted: true,
  },
  {
    label: 'What could change everything',
    color: 'text-critical',
    border: 'border-critical/30',
    bg: 'bg-critical/06',
    example: 'One honest conversation with a mentor or alumni.',
  },
];

const FEATURES = [
  {
    icon: '◑',
    title: 'Blind Spot Detection',
    desc: 'AI surfaces what you may have overlooked — without telling you what to decide.',
  },
  {
    icon: '◈',
    title: 'Perspective Lab',
    desc: 'See your decision through the eyes of a recruiter, mentor, financial advisor, or your future self.',
  },
  {
    icon: '⟳',
    title: 'What-If Simulator',
    desc: 'Toggle hypothetical changes and see how they could shift your risks and assumptions.',
  },
  {
    icon: '◇',
    title: 'Socratic Challenge',
    desc: 'AI asks one question at a time, helping you discover what you actually think.',
  },
  {
    icon: '◻',
    title: 'Decision Journal',
    desc: 'Reflect on what you initially thought, what you overlooked, and what you learned.',
  },
  {
    icon: '✦',
    title: 'Risk Radar',
    desc: 'A qualitative 3×3 matrix mapping likelihood vs impact — always labelled AI-estimated.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg text-text-primary overflow-x-hidden">
      {/* Skip link */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/05 bg-bg/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="eclipse-sm" aria-hidden="true" />
          <span className="font-heading text-sm font-bold tracking-widest text-ivory uppercase">BlindSpot AI</span>
        </div>
        <button
          id="nav-cta"
          onClick={() => navigate('/app')}
          className="btn-primary py-2 px-5 text-sm"
        >
          Open App
        </button>
      </header>

      <main id="main-content">
        {/* Hero */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center overflow-hidden">
          {/* Background gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(242,163,109,0.08) 0%, transparent 70%)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="eclipse-lg mx-auto" aria-label="BlindSpot AI eclipse logo" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-3xl space-y-6"
          >
            <div className="label-xs mb-4">The Blind Spot — Same decisions. A wider view.</div>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-ivory leading-tight">
              You're seeing the decision.{' '}
              <span
                className="relative"
                style={{
                  background: 'linear-gradient(135deg, #F2A36D, #E6B86C)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                But are you seeing everything?
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
              An intelligent thinking companion that reveals hidden assumptions, overlooked risks,
              and perspectives you might have missed. Every decision has a side you haven't seen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                id="hero-cta-analyze"
                onClick={() => navigate('/app/new')}
                className="btn-primary text-base px-8 py-4"
              >
                ✦ Analyze My Decision
              </button>
              <a
                href="#how-it-works"
                id="hero-cta-how"
                className="btn-secondary text-base px-8 py-4"
              >
                Explore How It Works
              </a>
            </div>
          </motion.div>
        </section>

        {/* Signpost section */}
        <section className="px-6 py-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="label-xs mb-3">The four lenses</div>
            <h2 className="font-heading text-3xl text-ivory">
              Same decision. A wider view.
            </h2>
            <p className="text-muted mt-3 max-w-xl mx-auto">
              Hover each signpost to see what BlindSpot AI reveals in the internship example.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SIGNPOSTS.map((sp, i) => (
              <motion.div
                key={sp.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`group relative p-5 rounded-xl border cursor-default transition-all duration-300 ${sp.bg} ${sp.border} ${sp.highlighted ? 'ring-1 ring-accent/30' : ''}`}
              >
                <div className="label-xs mb-3">{String(i + 1).padStart(2, '0')}</div>
                <p className={`font-heading text-base font-semibold mb-3 ${sp.color}`}>
                  {sp.label}
                </p>
                <p className="text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed">
                  {sp.example}
                </p>
                {sp.highlighted && (
                  <div className="absolute top-3 right-3 eclipse-sm" aria-hidden="true" style={{ width: '14px', height: '14px' }} />
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="px-6 py-20 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="label-xs mb-3">How it works</div>
            <h2 className="font-heading text-3xl text-ivory">Three steps to a wider view</h2>
          </div>
          <div className="space-y-6">
            {[
              {
                n: '01',
                title: 'Describe your decision',
                desc: 'Share the context: what you\'re weighing, what you care about, and why you\'re leaning a certain way. No form is too short or too long.',
              },
              {
                n: '02',
                title: 'AI maps your blind spots',
                desc: 'Gemini analyzes your reasoning and surfaces what you may have overlooked — assumptions, risks, missing information, and conflicting priorities.',
              },
              {
                n: '03',
                title: 'Explore, challenge, reflect',
                desc: 'Switch perspectives, run what-if scenarios, answer Socratic questions, and journal your reflections. The AI never decides — it helps you think.',
              },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="flex gap-6 p-6 rounded-xl border border-white/06 bg-card/50 hover:border-accent/20 transition-colors"
              >
                <div className="font-heading text-3xl font-bold text-accent/40 shrink-0 w-12">{step.n}</div>
                <div>
                  <h3 className="font-heading text-lg text-ivory mb-2">{step.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features grid */}
        <section className="px-6 py-20 bg-secondary/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="label-xs mb-3">Features</div>
              <h2 className="font-heading text-3xl text-ivory">Everything you need to think clearly</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-5 rounded-xl border border-white/06 bg-card/40 hover:border-accent/20 hover:bg-card/70 transition-all duration-300"
                >
                  <span className="text-2xl mb-3 block text-accent">{f.icon}</span>
                  <h3 className="font-heading text-base font-semibold text-ivory mb-2">{f.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Example preview */}
        <section className="px-6 py-20 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="label-xs mb-3">Example analysis (clearly labelled)</div>
            <h2 className="font-heading text-2xl text-ivory">What a real analysis looks like</h2>
          </div>
          <div className="p-6 rounded-xl border border-accent/20 bg-card/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="eclipse-sm" aria-hidden="true" />
              <div>
                <p className="font-heading text-lg text-ivory">Should I accept the 6-month internship?</p>
                <p className="text-xs text-muted">Example from the internship golden test case</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-critical/08 border border-critical/20">
                <p className="label-xs text-critical mb-1">High severity blind spot</p>
                <p className="text-sm text-ivory font-medium">Academic Impact</p>
                <p className="text-xs text-muted mt-1">The overlap between the 6-month period and your academic calendar has not been examined.</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/08 border border-warning/20">
                <p className="label-xs text-warning mb-1">Medium severity blind spot</p>
                <p className="text-sm text-ivory font-medium">Opportunity Cost</p>
                <p className="text-xs text-muted mt-1">Accepting this forecloses other options — research, other internships — that haven't been weighed.</p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/05">
              <p className="text-xs text-muted italic">
                ✦ This is a sample analysis. The AI does not tell you whether to accept or reject — it surfaces what you may have missed.
              </p>
            </div>
          </div>
        </section>

        {/* Why BlindSpot AI */}
        <section className="px-6 py-20 bg-secondary/50">
          <div className="max-w-3xl mx-auto text-center">
            <div className="label-xs mb-3">Why BlindSpot AI</div>
            <h2 className="font-heading text-3xl text-ivory mb-6">
              "See Beyond What You See."
            </h2>
            <p className="text-muted leading-relaxed text-lg">
              People make decisions based on what's most visible to them. The AI doesn't judge your choice —
              it helps you discover what you might be missing: unstated assumptions, invisible trade-offs,
              and perspectives that could reshape how you think.
            </p>
            <div className="mt-10">
              <button
                id="why-cta"
                onClick={() => navigate('/app/new')}
                className="btn-primary text-base px-10 py-4"
              >
                Analyze My Decision
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/06 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="eclipse-sm" aria-hidden="true" style={{ width: '18px', height: '18px' }} />
            <span className="font-heading text-sm text-muted">BlindSpot AI</span>
          </div>
          <p className="text-xs text-muted text-center">
            "See Beyond What You See." — AI-estimated insights, not professional advice.
            Decision text is processed by Google Gemini.
          </p>
          <div className="flex gap-4 text-xs text-muted">
            <button onClick={() => navigate('/app/about')} className="hover:text-ivory transition-colors">
              How It Works
            </button>
            <button onClick={() => navigate('/app/settings')} className="hover:text-ivory transition-colors">
              Settings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
