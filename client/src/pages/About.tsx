import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Server,
  Database,
  Code2,
} from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10 text-ivory">
      {/* Header & Product Story */}
      <div className="space-y-4">
        <div className="label-xs text-accent">About & Methodology</div>
        <h1 className="font-heading text-4xl font-bold text-ivory leading-tight">
          Every decision has a side you haven't seen.
        </h1>
        <p className="text-xl text-accent font-serif italic font-medium">
          "See Beyond What You See."
        </p>

        <div className="card border-accent/30 bg-accent/05 p-6 space-y-3">
          <h2 className="font-heading text-xl font-bold text-ivory">Product Story in 3 Lines</h2>
          <p className="text-sm text-ivory/90 leading-relaxed">
            1. Human decision-making naturally suffers from availability bias and framing effects — we weigh immediately visible perks while ignoring non-obvious long-term risks.
          </p>
          <p className="text-sm text-ivory/90 leading-relaxed">
            2. Traditional AI advisors often err by giving blunt advice or deciding for the user, eroding user autonomy and critical thinking.
          </p>
          <p className="text-sm text-ivory/90 leading-relaxed">
            3. <strong>BlindSpot AI</strong> acts as a non-prescriptive thinking companion: it illuminates hidden assumptions, qualitative risk matrices, and 5 stakeholder lenses while <strong>never telling you what to choose</strong>.
          </p>
        </div>
      </div>

      {/* Under the Hood — Architecture Diagram Component */}
      <div className="space-y-4">
        <div className="label-xs text-accent">Engineering Architecture</div>
        <h2 className="font-heading text-2xl font-bold text-ivory">Under the Hood</h2>
        <p className="text-sm text-muted">
          Clean decoupled architecture connecting React frontend, Express API gateway, Google Gemini 1.5, Zod validation, and private LocalStorage.
        </p>

        {/* Clean SVG/React Architecture Diagram */}
        <div className="card p-6 bg-secondary/80 space-y-6 overflow-x-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 min-w-[600px] text-center">
            {/* Step 1: React Client */}
            <div className="flex-1 p-4 rounded-xl border border-white/10 bg-white/03 space-y-2">
              <Code2 className="w-6 h-6 text-accent mx-auto" />
              <h3 className="font-heading text-sm font-bold text-ivory">1. React Client</h3>
              <p className="text-[11px] text-muted">Vite + TypeScript + Tailwind. Handles user input, state & UI views.</p>
            </div>

            <ArrowRight className="w-5 h-5 text-accent shrink-0 hidden md:block" />

            {/* Step 2: Express API Gateway */}
            <div className="flex-1 p-4 rounded-xl border border-white/10 bg-white/03 space-y-2">
              <Server className="w-6 h-6 text-accent mx-auto" />
              <h3 className="font-heading text-sm font-bold text-ivory">2. Express Gateway</h3>
              <p className="text-[11px] text-muted">Helmet, CORS, Rate Limiting & server-side post-verdict safety check.</p>
            </div>

            <ArrowRight className="w-5 h-5 text-accent shrink-0 hidden md:block" />

            {/* Step 3: Google Gemini */}
            <div className="flex-1 p-4 rounded-xl border border-white/10 bg-white/03 space-y-2">
              <Cpu className="w-6 h-6 text-accent mx-auto" />
              <h3 className="font-heading text-sm font-bold text-ivory">3. Google Gemini 1.5</h3>
              <p className="text-[11px] text-muted">Structured JSON output mode using qualitative Low/Med/High schemas.</p>
            </div>

            <ArrowRight className="w-5 h-5 text-accent shrink-0 hidden md:block" />

            {/* Step 4: Zod & LocalStorage */}
            <div className="flex-1 p-4 rounded-xl border border-white/10 bg-white/03 space-y-2">
              <Database className="w-6 h-6 text-accent mx-auto" />
              <h3 className="font-heading text-sm font-bold text-ivory">4. Zod & LocalStorage</h3>
              <p className="text-[11px] text-muted">Strict runtime JSON validation + private browser persistence.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How Gemini Is Used Table */}
      <div className="space-y-4">
        <div className="label-xs text-accent">AI Integration</div>
        <h2 className="font-heading text-2xl font-bold text-ivory">How Gemini Is Prompted & Validated</h2>

        <div className="card overflow-x-auto p-0 border-white/10">
          <table className="w-full text-left text-xs text-ivory border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/04 text-accent font-heading font-semibold">
                <th className="p-3">Capability</th>
                <th className="p-3">API Endpoint</th>
                <th className="p-3">Gemini Prompting & Output Goal</th>
                <th className="p-3">Zod Validation Schema</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/06">
              <tr>
                <td className="p-3 font-semibold text-ivory">Blind Spot Analysis</td>
                <td className="p-3 font-mono text-muted">POST /api/analyze</td>
                <td className="p-3 text-muted">Extracts Decision DNA, top 4 blind spots, unstated assumptions, 3x3 risk matrix.</td>
                <td className="p-3 font-mono text-accent">AnalysisResultSchema</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-ivory">Perspective Lab</td>
                <td className="p-3 font-mono text-muted">POST /api/perspective</td>
                <td className="p-3 text-muted">Evaluates decision through Recruiter, Mentor, Financial, Family, or Future Self lens.</td>
                <td className="p-3 font-mono text-accent">PerspectiveResultSchema</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-ivory">What-If Simulator</td>
                <td className="p-3 font-mono text-muted">POST /api/simulate</td>
                <td className="p-3 text-muted">Stress-tests decision under changed conditions (hours, pay, remote work).</td>
                <td className="p-3 font-mono text-accent">SimulateResultSchema</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-ivory">Socratic Sparring</td>
                <td className="p-3 font-mono text-muted">POST /api/challenge/next</td>
                <td className="p-3 text-muted">Formulates respectful Socratic pushback question based on previous answers.</td>
                <td className="p-3 font-mono text-accent">ChallengeNextResultSchema</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety By Design Guardrails */}
      <div className="space-y-4">
        <div className="label-xs text-accent">Safety & Ethics</div>
        <h2 className="font-heading text-2xl font-bold text-ivory">Safety by Design Guardrails</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card space-y-2 p-5 border-amber-500/30">
            <div className="flex items-center gap-2 text-warning font-heading font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" /> 1. The AI Never Decides For You
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Enforced via system prompts and a server-side post-check that strips any verdict language ("you should accept", "the best choice is").
            </p>
          </div>

          <div className="card space-y-2 p-5 border-amber-500/30">
            <div className="flex items-center gap-2 text-warning font-heading font-semibold text-sm">
              <Zap className="w-4 h-4" /> 2. Qualitative Low / Med / High Ratings
            </div>
            <p className="text-xs text-muted leading-relaxed">
              No fabricated numeric probability scores or fake precision. Risk radar uses qualitative qualitative levels labeled "AI-estimated, not statistical".
            </p>
          </div>

          <div className="card space-y-2 p-5 border-amber-500/30">
            <div className="flex items-center gap-2 text-warning font-heading font-semibold text-sm">
              <Lock className="w-4 h-4" /> 3. Prompt Injection Defense
            </div>
            <p className="text-xs text-muted leading-relaxed">
              User text is treated as untrusted data inside delimiter boundaries. API keys are kept strictly on the Express server side.
            </p>
          </div>

          <div className="card space-y-2 p-5 border-amber-500/30">
            <div className="flex items-center gap-2 text-warning font-heading font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" /> 4. Transparent Execution Mode
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Live Gemini execution and Demo sample data are always explicitly distinguished. Demo data is never disguised as live output.
            </p>
          </div>
        </div>
      </div>

      {/* Engineering Badges & Links */}
      <div className="card p-6 space-y-4 border-white/10">
        <h3 className="font-heading text-lg font-bold text-ivory">Tech Stack & Testing Summary</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-white/05 border border-white/10 text-ivory">React 18</span>
          <span className="px-3 py-1 rounded-full bg-white/05 border border-white/10 text-ivory">TypeScript 5</span>
          <span className="px-3 py-1 rounded-full bg-white/05 border border-white/10 text-ivory">Vite 5</span>
          <span className="px-3 py-1 rounded-full bg-white/05 border border-white/10 text-ivory">Tailwind CSS 3</span>
          <span className="px-3 py-1 rounded-full bg-white/05 border border-white/10 text-ivory">Express JS</span>
          <span className="px-3 py-1 rounded-full bg-white/05 border border-white/10 text-ivory">Google Gemini 1.5</span>
          <span className="px-3 py-1 rounded-full bg-white/05 border border-white/10 text-ivory">Zod Schemas</span>
          <span className="px-3 py-1 rounded-full bg-white/05 border border-white/10 text-ivory">Vitest Unit & Integration Tests</span>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-white/06 flex-wrap gap-4">
          <p className="text-xs text-muted">Full unit and backend integration test suite verified with Vitest.</p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/app/analysis/demo-internship-6mo')} className="btn-primary text-xs flex items-center gap-1">
              Explore Demo <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
