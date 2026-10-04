import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldAlert, Send } from 'lucide-react';
import { LocalStorageProvider } from '../services/storage';
import type { SavedAnalysis, ChallengeExchange } from '../types';
import { DEMO_SAVED_ANALYSIS, DEMO_CHALLENGE_STEPS } from '../services/demoData';
import { ErrorBanner, EclipseLoader } from '../components/ui';
import { api } from '../services/api';
import { motion } from 'framer-motion';

const analysisStore = new LocalStorageProvider<SavedAnalysis>('analyses');

export default function ChallengePage() {
  const location = useLocation();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>('');
  const [messages, setMessages] = useState<ChallengeExchange[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let list = analysisStore.list();
    if (list.length === 0) {
      list = [DEMO_SAVED_ANALYSIS];
    }
    setAnalyses(list);

    const fromState = (location.state as { analysisId?: string } | null)?.analysisId;
    if (fromState && list.some((a) => a.id === fromState)) {
      setSelectedAnalysisId(fromState);
    } else {
      setSelectedAnalysisId(list[0].id);
    }
  }, [location.state]);

  const selectedAnalysis = analyses.find((a) => a.id === selectedAnalysisId) || DEMO_SAVED_ANALYSIS;

  useEffect(() => {
    if (selectedAnalysis) {
      setMessages([
        {
          question: `In analyzing "${selectedAnalysis.title}", you noted leaning toward: "${selectedAnalysis.input.leaningToward || 'acting on this'}". What if your primary assumption here is actually your biggest vulnerability? What evidence would it take for you to change your mind?`,
          answer: '',
        },
      ]);
    }
  }, [selectedAnalysisId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnalysis || !userInput.trim() || loading) return;

    const currentAnswer = userInput.trim();
    setUserInput('');
    setError('');

    const updatedMessages = [...messages];
    const lastIndex = updatedMessages.length - 1;
    updatedMessages[lastIndex].answer = currentAnswer;
    setMessages(updatedMessages);
    setLoading(true);

    if (selectedAnalysis.id === DEMO_SAVED_ANALYSIS.id) {
      setTimeout(() => {
        const nextStep = DEMO_CHALLENGE_STEPS[0];
        setMessages((prev) => [...prev, { question: nextStep.nextQuestion, answer: '' }]);
        setLoading(false);
      }, 600);
      return;
    }

    try {
      const nextResult = await api.challengeNext({
        sessionId: selectedAnalysis.id,
        decisionContext: {
          title: selectedAnalysis.input.title,
          decision: selectedAnalysis.input.decision,
          situation: selectedAnalysis.input.situation,
          priorities: selectedAnalysis.input.priorities,
          leaningToward: selectedAnalysis.input.leaningToward,
        },
        history: updatedMessages,
        currentAnswer,
      });

      setMessages((prev) => [...prev, { question: nextResult.nextQuestion, answer: '' }]);
    } catch (err: any) {
      const nextStep = DEMO_CHALLENGE_STEPS[0];
      setMessages((prev) => [...prev, { question: nextStep.nextQuestion, answer: '' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <div className="label-xs mb-2">Socratic AI Challenge</div>
        <h1 className="font-heading text-3xl font-bold text-ivory flex items-center gap-3">
          <ShieldAlert className="w-7 h-7 text-accent" /> A relentless Sparring Partner for your logic
        </h1>
        <p className="text-muted mt-1 text-sm">
          The AI will respectfully probe your hidden assumptions, blind spots, and rationalizations.
        </p>
      </div>

      {/* Decision Selector */}
      <div className="card">
        <label className="label-xs block mb-2 text-muted" htmlFor="challenge-analysis-select">
          Select Decision to Challenge
        </label>
        <select
          id="challenge-analysis-select"
          value={selectedAnalysisId}
          onChange={(e) => setSelectedAnalysisId(e.target.value)}
          className="input-field w-full text-sm font-medium"
        >
          {analyses.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title} {a.id === DEMO_SAVED_ANALYSIS.id ? '(DEMO Example)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Chat Sparring Container */}
      <div className="card space-y-4 min-h-[420px] flex flex-col justify-between p-5">
        <div className="space-y-4 overflow-y-auto max-h-[480px] pr-2">
          {messages.map((ex, idx) => (
            <div key={idx} className="space-y-3">
              {/* AI Socratic Question */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 bg-card/70 p-4 rounded-xl border border-white/06 shadow-sm"
              >
                <ShieldAlert className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="label-xs text-accent font-bold">BlindSpot AI (Sparring Partner)</div>
                  <p className="text-sm text-ivory leading-relaxed">{ex.question}</p>
                </div>
              </motion.div>

              {/* User Answer */}
              {ex.answer && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start justify-end gap-3"
                >
                  <div className="bg-accent/15 border border-accent/25 p-4 rounded-xl max-w-[85%]">
                    <div className="label-xs text-right mb-1 text-ivory/70 font-semibold">Your Defense / Response</div>
                    <p className="text-sm text-ivory leading-relaxed">{ex.answer}</p>
                  </div>
                </motion.div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 bg-card/40 p-4 rounded-xl border border-white/06">
              <EclipseLoader size="sm" />
              <span className="text-xs text-muted">Analyzing your response and formulating next Socratic challenge...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {error && <ErrorBanner message={error} />}

        {/* Reply Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-white/06">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Defend your reasoning or re-examine your assumption..."
            disabled={loading}
            className="input-field flex-1 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !userInput.trim()}
            className="btn-primary shrink-0 flex items-center gap-1.5 px-4"
          >
            <span>Send</span> <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
