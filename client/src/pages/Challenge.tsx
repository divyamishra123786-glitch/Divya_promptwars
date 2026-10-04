import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { LocalStorageProvider } from '../services/storage';
import type { SavedAnalysis, ChallengeExchange } from '../types';
import { EmptyState, ErrorBanner, EclipseLoader } from '../components/ui';
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
    const list = analysisStore.list();
    setAnalyses(list);
    const fromState = (location.state as { analysisId?: string } | null)?.analysisId;
    if (fromState) {
      setSelectedAnalysisId(fromState);
    } else if (list.length > 0) {
      setSelectedAnalysisId(list[0].id);
    }
  }, [location.state]);

  const selectedAnalysis = analyses.find((a) => a.id === selectedAnalysisId);

  useEffect(() => {
    if (selectedAnalysis && messages.length === 0) {
      setMessages([
        {
          question: `In analyzing "${selectedAnalysis.input.title}", you noted leaning toward: "${selectedAnalysis.input.leaningToward || 'acting on this'}". What if your primary assumption here is actually your biggest vulnerability? What evidence would it take for you to change your mind?`,
          answer: '',
        },
      ]);
    }
  }, [selectedAnalysisId, selectedAnalysis]);

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

      setMessages((prev) => [
        ...prev,
        { question: nextResult.nextQuestion, answer: '' },
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate Socratic follow-up');
    } finally {
      setLoading(false);
    }
  };

  if (analyses.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="label-xs">Socratic AI Challenge</div>
        <h1 className="font-heading text-3xl text-ivory">Challenge Your Thinking</h1>
        <EmptyState
          title="No Decisions Analyzed Yet"
          description="Create your first decision analysis to start a Socratic pushback session."
          action={
            <a href="/app/new" className="btn-primary">
              Analyze a Decision
            </a>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <div className="label-xs mb-2">Socratic AI Challenge</div>
        <h1 className="font-heading text-3xl text-ivory">A relentless Sparring Partner for your logic.</h1>
        <p className="text-muted mt-2">
          The AI will respectfully probe your hidden assumptions, blind spots, and rationalizations.
        </p>
      </div>

      {/* Selector */}
      <div className="card">
        <label className="label-xs block mb-2" htmlFor="challenge-analysis-select">
          Select Decision
        </label>
        <select
          id="challenge-analysis-select"
          value={selectedAnalysisId}
          onChange={(e) => {
            setSelectedAnalysisId(e.target.value);
            setMessages([]);
          }}
          className="input-field w-full"
        >
          {analyses.map((a) => (
            <option key={a.id} value={a.id}>
              {a.input.title} ({new Date(a.createdAt).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      {/* Chat Container */}
      <div className="card space-y-4 min-h-[400px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          {messages.map((ex, idx) => (
            <div key={idx} className="space-y-3">
              {/* AI Question */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 bg-card/60 p-4 rounded-xl border border-white/06"
              >
                <span className="text-accent text-lg shrink-0 mt-0.5">◇</span>
                <div className="space-y-1">
                  <div className="label-xs text-accent">BlindSpot AI (Sparring Partner)</div>
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
                    <div className="label-xs text-right mb-1 text-ivory/70">Your Response</div>
                    <p className="text-sm text-ivory leading-relaxed">{ex.answer}</p>
                  </div>
                </motion.div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 bg-card/40 p-4 rounded-xl border border-white/06">
              <EclipseLoader size="sm" />
              <span className="text-xs text-muted">Formulating next Socratic challenge...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {error && <ErrorBanner message={error} />}

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-white/06">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Defend your reasoning or re-examine your assumption..."
            disabled={loading}
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={loading || !userInput.trim()}
            className="btn-primary shrink-0"
          >
            Send Response
          </button>
        </form>
      </div>
    </div>
  );
}
