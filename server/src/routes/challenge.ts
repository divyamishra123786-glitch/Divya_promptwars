import { Router, Request, Response } from 'express';
import { ChallengeNextRequestSchema, ChallengeNextResultSchema, CHALLENGE_NEXT_GEMINI_SCHEMA } from '../schemas/challenge';
import { callGemini, isLiveMode } from '../services/gemini';
import { buildChallengePrompt } from '../prompts/challenge';

export const challengeRouter = Router();

challengeRouter.post('/next', async (req: Request, res: Response) => {
  const parseResult = ChallengeNextRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: parseResult.error.errors.map((e) => e.message).join('; '),
      },
    });
    return;
  }

  const { decisionContext, history, currentAnswer } = parseResult.data;

  if (!isLiveMode()) {
    const questionIndex = history.length;
    const demoQuestions = [
      'What would you say is the single most important thing this internship needs to give you — and why that specifically?',
      'If the stipend were suddenly removed, how would your thinking about this opportunity change?',
      'What does a good outcome look like for you six months from now — and how would you know if you had achieved it?',
      'Who in your life would be most affected by this decision besides yourself, and have you considered their perspective?',
      'What information would you need to feel genuinely confident — not just comfortable — about this choice?',
      'Looking back at your reasoning so far, what assumption have you been most reluctant to question?',
    ];
    res.json({
      nextQuestion: demoQuestions[Math.min(questionIndex, demoQuestions.length - 1)],
      newlyRecognisedFactors: currentAnswer ? ['Financial independence considerations', 'Personal values alignment'] : [],
      clarifiedAssumptions: currentAnswer ? ['Proximity to home reduces stress'] : [],
      remainingUncertainties: ['Quality of mentorship', 'Academic impact', 'Long-term career fit'],
      followUpQuestions: ['Why does this feel like the right moment?', 'What are you trading away?'],
      sessionComplete: questionIndex >= 5,
    });
    return;
  }

  try {
    const prompt = buildChallengePrompt(decisionContext, history, currentAnswer);
    const raw = await callGemini<Record<string, unknown>>({
      prompt,
      schema: CHALLENGE_NEXT_GEMINI_SCHEMA,
    });

    const validated = ChallengeNextResultSchema.safeParse(raw);
    if (!validated.success) {
      res.json(raw);
      return;
    }

    res.json(validated.data);
  } catch (err) {
    res.status(503).json({
      error: {
        code: 'AI_ERROR',
        message: 'Unable to generate next question. Please try again.',
      },
    });
  }
});
