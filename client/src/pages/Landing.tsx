import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  CheckCircle2,
  Users,
  GitBranch,
  BookOpen,
  Eye,
  Layers,
  Play,
} from 'lucide-react';
import { Eclipse } from '../components/Eclipse';
import { GuidedTour } from '../components/GuidedTour';

const PROOF_CHIPS = [
  { label: 'Real Gemini AI', icon: Zap, tooltip: 'Powered by Google Gemini 1.5 Pro & Flash models' },
  { label: 'Never Decides For You', icon: ShieldCheck, tooltip: 'Server-enforced policy against telling users what to choose' },
  { label: 'Saved Privately in Browser', icon: Lock, tooltip: 'Your decisions stay local in your client browser storage' },
  { label: 'Verified & Tested', icon: CheckCircle2, tooltip: 'Full unit & integration test coverage' },
];

const CAPABILITIES = [
  {
    title: 'Blind Spot Detection',
    purpose: 'Categorizes non-obvious risks sitting outside your immediate decision frame.',
    tag: 'Powered by Gemini',
    link: '/app/analysis/demo-internship-6mo',
    icon: Eye,
  },
  {
    title: 'Assumption Scanner',
    purpose: 'Exposes unstated premises in your reasoning that could fail under stress.',
    tag: 'Powered by Gemini',
    link: '/app/analysis/demo-internship-6mo',
    icon: Layers,
  },
  {
    title: 'Qualitative Risk Radar',
    purpose: 'Maps likelihood vs impact on a 3x3 grid without misleading numeric probabilities.',
    tag: 'Stored locally',
    link: '/app/analysis/demo-internship-6mo',
    icon: Zap,
  },
  {
    title: 'Perspective Lab',
    purpose: 'Simulates 5 stakeholder viewpoints: Recruiter, Mentor, Financial, Family, Future Self.',
    tag: 'Powered by Gemini',
    link: '/app/perspective-lab',
    icon: Users,
  },
  {
    title: 'What-If Simulator',
    purpose: 'Stress-tests your decision under plot twists like stipend reductions or extra hours.',
    tag: 'Powered by Gemini',
    link: '/app/what-if',
    icon: GitBranch,
  },
  {
    title: 'Decision Journal',
    purpose: 'Tracks reflection history and lessons learned over time for long-term growth.',
    tag: 'Stored locally',
    link: '/app/journal',
    icon: BookOpen,
  },
];

const SIGNPOSTS = [
  { label: 'What You See', content: '6-month internship, good stipend, 20 mins from home.', color: 'border-white/10 bg-white/03' },
  { label: 'What You Know', content: 'Provides industry experience and immediate cash flow.', color: 'border-white/10 bg-white/03' },
  { label: 'What You Miss', content: 'Overlap with university exams, zero structured mentorship, daily commute fatigue.', color: 'border-amber-500/30 bg-amber-500/05 text-amber-200' },
  { label: 'What Could Change Everything', content: 'What if stipend drops by 30% or exam dates conflict directly?', color: 'border-accent/30 bg-accent/05 text-accent' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'see' | 'miss'>('see');

  return (
    <div className="min-h-screen bg-bg text-ivory flex flex-col font-sans selection:bg-accent selection:text-bg">
      <GuidedTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/06 bg-bg/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <Eclipse size="logo" />
            <span className="font-heading text-base font-bold tracking-wider text-ivory">
              BLINDSPOT AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
            <a href="#how-it-works" className="hover:text-ivory transition-colors">How It Works</a>
            <a href="#whats-inside" className="hover:text-ivory transition-colors">What's Inside</a>
            <a href="#interactive-preview" className="hover:text-ivory transition-colors">Example</a>
            <button onClick={() => navigate('/app/about')} className="hover:text-ivory transition-colors">About</button>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setIsTourOpen(true)} className="btn-ghost text-xs hidden sm:flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-accent" /> 60-Sec Tour
            </button>
            <button onClick={() => navigate('/app')} className="btn-primary text-xs px-4 py-2">
              Open App
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-10 pb-14 md:pt-14 md:pb-20">
        {/* Ambient background nebula */}
        <div
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{
            right: '-5%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 'min(520px, 55vw)',
            height: 'min(520px, 55vw)',
            background:
              'radial-gradient(ellipse at center, rgba(242,163,109,0.07) 0%, rgba(242,163,109,0.03) 45%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          {/*
           * Two-column CSS Grid — text always lives in its own column
           * and can never bleed into the eclipse column.
           * On mobile (<md): single column, eclipse above text.
           */}
          <div
            className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-10 md:gap-14 lg:gap-20"
          >

            {/* Left: copy block — fills available grid column */}
            <motion.div
              className="flex flex-col items-start text-left space-y-6 min-w-0"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Eye-brow label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Decision Intelligence
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-[2.75rem] lg:text-[3.25rem] font-bold tracking-tight text-ivory leading-[1.12]">
                You're seeing the decision.{' '}
                <span className="text-accent italic font-serif">
                  But are you seeing everything?
                </span>
              </h1>

              <p className="text-muted text-base sm:text-lg leading-relaxed max-w-xl">
                An intelligent thinking companion that reveals hidden assumptions, overlooked risks and perspectives you might have missed — without ever deciding for you.
              </p>

              {/* CTA row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1">
                <button
                  onClick={() => navigate('/app/new-analysis')}
                  className="btn-primary text-sm sm:text-base px-7 py-3 shadow-xl shadow-accent/20 flex items-center gap-2"
                >
                  Analyze My Decision <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/app/analysis/demo-internship-6mo')}
                  className="btn-ghost text-sm sm:text-base px-5 py-3 flex items-center gap-2 border border-white/10"
                >
                  <Sparkles className="w-4 h-4 text-accent" /> Explore Demo
                </button>
              </div>

              {/* Proof chips */}
              <div className="flex flex-wrap gap-2">
                {PROOF_CHIPS.map((chip, idx) => {
                  const Icon = chip.icon;
                  return (
                    <div
                      key={idx}
                      title={chip.tooltip}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/04 border border-white/08 text-ivory/80 hover:border-accent/40 transition-colors cursor-default"
                    >
                      <Icon className="w-3.5 h-3.5 text-accent" />
                      <span>{chip.label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/*
             * Right: Eclipse column — auto-sized by the grid.
             * The motion.div is explicitly square so the Eclipse
             * component always renders in a 1:1 container.
             */}
            <motion.div
              className="flex items-center justify-center order-first md:order-last"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{ flexShrink: 0 }}
            >
              <Eclipse size="hero" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-6 border-t border-white/06 bg-secondary/30">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="label-xs text-accent">Decision Framework</div>
            <h2 className="font-heading text-3xl font-bold text-ivory">How BlindSpot AI Works</h2>
            <p className="text-muted text-sm max-w-xl mx-auto">
              Same decisions. A wider view. Move from immediate reaction to multi-perspective clarity in 3 steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card space-y-3 p-6">
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent text-accent font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="font-heading text-lg font-bold text-ivory">1. Share Your Context</h3>
              <p className="text-xs text-muted leading-relaxed">
                Provide your decision situation in one sentence. Optional fields allow extra details like stipend, duration, or concerns.
              </p>
            </div>

            <div className="card space-y-3 p-6">
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent text-accent font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="font-heading text-lg font-bold text-ivory">2. Discover What You Missed</h3>
              <p className="text-xs text-muted leading-relaxed">
                Gemini AI parses your input to extract unstated assumptions, categorized blind spots, and a qualitative 3x3 risk matrix.
              </p>
            </div>

            <div className="card space-y-3 p-6">
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent text-accent font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="font-heading text-lg font-bold text-ivory">3. Explore Perspectives</h3>
              <p className="text-xs text-muted leading-relaxed">
                Simulate 5 distinct stakeholder lenses (Recruiter, Mentor, Financial, Family, Future Self) and stress-test what-if scenarios.
              </p>
            </div>
          </div>

          {/* 4 Signposts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {SIGNPOSTS.map((sp, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${sp.color} space-y-2`}>
                <div className="label-xs font-bold">{sp.label}</div>
                <p className="text-xs leading-relaxed">{sp.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section id="whats-inside" className="py-16 px-6 border-t border-white/06">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="label-xs text-accent">Feature Map</div>
            <h2 className="font-heading text-3xl font-bold text-ivory">What's Inside BlindSpot AI</h2>
            <p className="text-muted text-sm max-w-xl mx-auto">
              A comprehensive toolkit for decision-intelligence and critical thinking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div key={idx} className="card space-y-4 p-6 hover:border-accent/40 transition-colors flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Icon className="w-6 h-6 text-accent" />
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/05 text-muted border border-white/10 font-mono">
                        {cap.tag}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-ivory">{cap.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{cap.purpose}</p>
                  </div>

                  <button
                    onClick={() => navigate(cap.link)}
                    className="text-xs text-accent font-semibold flex items-center gap-1 hover:underline self-start pt-2"
                  >
                    See it in Demo <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Product Preview Section */}
      <section id="interactive-preview" className="py-16 px-6 border-t border-white/06 bg-secondary/30">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <div className="space-y-2">
            <div className="label-xs text-accent">Live Preview</div>
            <h2 className="font-heading text-3xl font-bold text-ivory">Compare: What You See vs. Blind Spots</h2>
          </div>

          <div className="card p-6 space-y-6 text-left border-accent/30">
            <div className="flex items-center justify-between border-b border-white/06 pb-4">
              <div>
                <span className="label-xs text-muted">Sample Case Study</span>
                <h3 className="font-heading text-lg font-bold text-ivory">6-Month Student Internship Decision</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('see')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeTab === 'see' ? 'bg-white/10 text-ivory font-bold' : 'text-muted hover:text-ivory'
                  }`}
                >
                  What You See
                </button>
                <button
                  onClick={() => setActiveTab('miss')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeTab === 'miss' ? 'bg-accent text-bg font-bold' : 'text-muted hover:text-ivory'
                  }`}
                >
                  What BlindSpot AI Sees
                </button>
              </div>
            </div>

            {activeTab === 'see' ? (
              <div className="space-y-3">
                <p className="text-sm text-ivory font-medium">Visible Stated Priorities:</p>
                <ul className="space-y-2 text-xs text-muted list-disc list-inside">
                  <li>Deciding on 6-month internship at local firm</li>
                  <li>Office is 20 minutes from home (geographic convenience)</li>
                  <li>Reasonable monthly stipend to support personal expenses</li>
                  <li>Adds industry work experience to resume</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-accent font-bold">Uncovered Blind Spots & Missing Info:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200">
                    <strong>Academic Overlap:</strong> Potential missing classes or delayed graduation timeline.
                  </div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200">
                    <strong>Mentorship Depth:</strong> No dedicated supervisor or structured learning path assigned.
                  </div>
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200">
                    <strong>Net Pay Erosion:</strong> Daily travel & lunch expenses consume up to 35% of stipend.
                  </div>
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                    <strong>Career Signal:</strong> Local office brand vs competitive tier-1 recruiter weight.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/06 bg-secondary/80 text-center space-y-4 mt-auto">
        <div className="flex items-center justify-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Eclipse size="logo" />
          <span className="font-heading text-sm font-bold tracking-wider text-ivory">
            BLINDSPOT AI
          </span>
        </div>
        <p className="text-xs text-accent font-serif italic font-medium">"See Beyond What You See."</p>
        <p className="text-xs text-muted max-w-md mx-auto">
          Every decision has a side you haven't seen. Built with React, TypeScript, Express and Google Gemini.
        </p>
      </footer>
    </div>
  );
}
