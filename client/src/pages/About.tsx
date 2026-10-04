import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <div className="label-xs mb-2">About & Methodology</div>
        <h1 className="font-heading text-4xl text-ivory">Every decision has a side you haven't seen.</h1>
        <p className="text-xl text-accent font-serif italic mt-2">"See Beyond What You See."</p>
      </div>

      {/* Theme Card */}
      <div className="card space-y-4 border-accent/30 bg-accent/05 p-6">
        <div className="label-xs text-accent">Hackathon Theme</div>
        <h2 className="font-heading text-2xl text-ivory">The Blind Spot — Same decisions. A wider view.</h2>
        <p className="text-sm text-ivory/90 leading-relaxed">
          When humans make important career, financial, or personal decisions, we naturally suffer from cognitive biases — availability bias, confirmation bias, and framing effects. We weigh immediately visible factors while completely ignoring non-obvious risks sitting just outside our frame.
        </p>
        <p className="text-sm text-ivory/90 leading-relaxed">
          <strong>BlindSpot AI</strong> doesn't make decisions for you. Instead, it illuminates what sits outside your current frame — revealing hidden assumptions, missing information, conflicting priorities, and multi-perspective insights.
        </p>
      </div>

      {/* Core Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card space-y-2">
          <div className="text-accent text-xl">🧬</div>
          <h3 className="font-heading text-base text-ivory">Decision DNA Profiling</h3>
          <p className="text-xs text-muted">
            Extracts stated vs. implied priorities, core goals, and underlying reasoning patterns.
          </p>
        </div>

        <div className="card space-y-2">
          <div className="text-accent text-xl">👁</div>
          <h3 className="font-heading text-base text-ivory">Blind Spot Detection</h3>
          <p className="text-xs text-muted">
            Categorized risk matrix mapping likelihood vs impact with exact questions to investigate.
          </p>
        </div>

        <div className="card space-y-2">
          <div className="text-accent text-xl">◑</div>
          <h3 className="font-heading text-base text-ivory">Perspective Lab</h3>
          <p className="text-xs text-muted">
            Simulate feedback from 5 distinct personas: Recruiter, Mentor, Financial Advisor, Family, and Future Self.
          </p>
        </div>

        <div className="card space-y-2">
          <div className="text-accent text-xl">⟳</div>
          <h3 className="font-heading text-base text-ivory">What-If Stress Testing</h3>
          <p className="text-xs text-muted">
            Test plot twists and unexpected changes to observe how your risk radar adapts dynamically.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="card text-center py-8 space-y-4">
        <h3 className="font-heading text-xl text-ivory">Ready to widen your view on a real decision?</h3>
        <button
          onClick={() => navigate('/app/new')}
          className="btn-primary"
        >
          Analyze a Decision Now
        </button>
      </div>
    </div>
  );
}
