import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export interface TourStep {
  title: string;
  description: string;
  targetId: string;
  badge: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: '1. Blind Spot Detection',
    description: 'BlindSpot AI categorizes non-obvious risks (Academic, Financial, Career, Mentorship) that sit just outside your immediate frame.',
    targetId: 'tour-blind-spots',
    badge: 'Step 1 of 6',
  },
  {
    title: '2. Unstated Assumption Scanner',
    description: 'Uncovers hidden premises in your reasoning that could compromise your decision if proven false.',
    targetId: 'tour-assumptions',
    badge: 'Step 2 of 6',
  },
  {
    title: '3. Qualitative Risk Radar Matrix',
    description: 'Maps likelihood vs impact on a 3x3 qualitative grid without misleading numeric probabilities.',
    targetId: 'tour-risk-radar',
    badge: 'Step 3 of 6',
  },
  {
    title: '4. Perspective Lab (5 Stakeholder Lenses)',
    description: 'Simulates feedback from Recruiter, Mentor, Financial Advisor, Family, and Future Self viewpoints.',
    targetId: 'tour-perspectives',
    badge: 'Step 4 of 6',
  },
  {
    title: '5. What-If Scenario Stress-Testing',
    description: 'Tests how your decision holds up under unexpected plot twists like stipend reductions or hours increases.',
    targetId: 'tour-what-if',
    badge: 'Step 5 of 6',
  },
  {
    title: '6. Critical Questions & PDF Export',
    description: 'Gives you 5 exact questions to ask stakeholders before committing, plus downloadable branded PDF export.',
    targetId: 'tour-export',
    badge: 'Step 6 of 6',
  },
];

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuidedTour({ isOpen, onClose }: GuidedTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      localStorage.setItem('guided_tour_completed', 'true');
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="card max-w-lg w-full p-6 space-y-5 border-accent/40 bg-[#191D20] shadow-2xl relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/06 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="font-heading text-xs font-bold text-accent uppercase tracking-wider">
                {step.badge}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-muted hover:text-ivory transition-colors p-1 rounded"
              aria-label="Close Tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-2">
            <h3 className="font-heading text-xl font-bold text-ivory">{step.title}</h3>
            <p className="text-sm text-ivory/90 leading-relaxed">{step.description}</p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {TOUR_STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'w-6 bg-accent'
                    : idx < currentStepIndex
                    ? 'w-2 bg-accent/40'
                    : 'w-2 bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-white/06">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="btn-ghost text-xs flex items-center gap-1 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <button
              onClick={onClose}
              className="text-xs text-muted hover:underline"
            >
              Skip Tour
            </button>

            <button
              onClick={handleNext}
              className="btn-primary text-xs flex items-center gap-1 px-4 py-2"
            >
              {currentStepIndex === TOUR_STEPS.length - 1 ? (
                <>Finish Tour <CheckCircle2 className="w-4 h-4" /></>
              ) : (
                <>Next Step <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
