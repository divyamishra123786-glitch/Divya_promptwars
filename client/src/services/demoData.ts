import type { SavedAnalysis, SimulateResult, ChallengeNextResult } from '../types';

export const DEMO_SAVED_ANALYSIS: SavedAnalysis = {
  id: 'demo-internship-6mo',
  title: 'Should I accept the 6-month internship offer?',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  category: 'Career',
  input: {
    title: 'Should I accept the 6-month internship offer?',
    decision: 'I am a student deciding whether to accept a 6-month internship offer at a local firm.',
    situation: 'I am in my 3rd year of undergraduate studies. The office is 20 minutes from home. The monthly stipend is good, and it provides industry experience.',
    priorities: 'Stipend, proximity to home, gaining industry exposure, keeping options open',
    leaningToward: 'Accepting the offer because of the financial compensation and convenience.',
    concerns: 'Potential impact on semester grades and coursework load.',
    options: 'Accept internship, Decline and focus on coursework, Negotiate part-time hours',
  },
  result: {
    mode: 'demo',
    executiveSummary:
      'You are weighing a 6-month internship that offers financial compensation and proximity to home. While these visible benefits are real, several important factors sit just outside your current frame — particularly academic continuity, mentorship quality, and long-term career signalling.',
    decisionDna: {
      coreGoal: 'Gain industry experience while managing practical constraints (location, income)',
      priorities: ['Financial compensation', 'Geographic convenience', 'Industry exposure'],
      reasoningPattern: 'Availability bias — weighting immediately measurable factors (stipend, distance) over harder-to-quantify factors (learning depth, opportunity cost).',
      statedPriorities: ['Good stipend', 'Close to home', 'Industry experience'],
      impliedPriorities: ['Financial security', 'Minimising disruption', 'Resume building'],
    },
    blindSpots: [
      {
        id: 'bs-1',
        title: 'Academic Impact & Graduation Timeline',
        category: 'Academic',
        whatWasNoticed: 'The overlap between the 6-month internship period and your academic calendar has not been fully mapped out.',
        whyItMatters: 'Missing mandatory lectures or lab work could delay graduation or impact your GPA.',
        whatIsUncertain: 'Whether your university permits leave of absence or full credit transfer for off-campus internships.',
        whatToInvestigate: 'Consult your academic advisor immediately regarding credit policies and mandatory course attendance.',
        severity: 'High',
      },
      {
        id: 'bs-2',
        title: 'Mentorship & Supervised Learning Quality',
        category: 'Learning',
        whatWasNoticed: 'You cited "industry experience", but have not assessed who will mentor you or how structured the role is.',
        whyItMatters: 'An internship without structured mentorship often degrades into unsupervised task execution with minimal skill acquisition.',
        whatIsUncertain: 'Whether the firm has a dedicated supervisor assigned and a clear 6-month intern learning roadmap.',
        whatToInvestigate: 'Ask the hiring manager: Who is my direct mentor? What specific projects will I own during months 1–6?',
        severity: 'High',
      },
      {
        id: 'bs-3',
        title: 'Long-Term Trajectory vs. Immediate Convenience',
        category: 'Career',
        whatWasNoticed: 'The decision prioritises short-term convenience ("close to home") over how this brand name ranks in your target industry.',
        whyItMatters: 'Not all internship signals are weighted equally by future tier-1 recruiters.',
        whatIsUncertain: 'Where previous interns at this firm landed 2 years post-graduation.',
        whatToInvestigate: 'Lookup alumni from this company on LinkedIn to track their career outcomes.',
        severity: 'Medium',
      },
      {
        id: 'bs-4',
        title: 'Net Income After Commute & Incidentals',
        category: 'Financial',
        whatWasNoticed: 'The stipend is evaluated as a gross number without deducting commuting, meals, clothing, and lost study time.',
        whyItMatters: 'Hidden costs may erode up to 35% of the gross stipend value.',
        whatIsUncertain: 'Exact monthly expenditure on daily travel, lunches, and incidental costs.',
        whatToInvestigate: 'Calculate a line-item budget of net monthly earnings after all work-related costs.',
        severity: 'Medium',
      },
    ],
    assumptions: [
      {
        id: 'as-1',
        assumption: 'The stipend makes this financially net positive',
        risk: 'Hidden commuting and daily expense costs will reduce actual net savings significantly.',
        severity: 'Medium',
      },
      {
        id: 'as-2',
        assumption: '"Close to home" guarantees low daily disruption',
        risk: 'Commuting daily during peak hours eats into study time, causing unexpected fatigue.',
        severity: 'Low',
      },
      {
        id: 'as-3',
        assumption: 'Any industry internship improves your resume equally',
        risk: 'If the role lacks technical depth or brand prestige, recruiters may view it as generic administrative work.',
        severity: 'High',
      },
    ],
    riskRadar: [
      { id: 'r-1', risk: 'Academic performance degradation', likelihood: 'High', impact: 'High', category: 'Academic' },
      { id: 'r-2', risk: 'Superficial learning without real mentorship', likelihood: 'Medium', impact: 'High', category: 'Learning' },
      { id: 'r-3', risk: 'Net earnings lower than anticipated', likelihood: 'Medium', impact: 'Medium', category: 'Financial' },
      { id: 'r-4', risk: 'Opportunity cost of missing summer research', likelihood: 'Low', impact: 'High', category: 'Strategic' },
    ],
    conflictingPriorities: [
      {
        id: 'cp-1',
        factor1: 'Earning immediate stipend income',
        factor2: 'Maintaining high academic GPA for honors',
        tension: 'Full-time work hours directly compete for study time during midterms.',
      },
      {
        id: 'cp-2',
        factor1: 'Geographic convenience (20 mins home)',
        factor2: 'Maximal career signaling prestige',
        tension: 'Prioritizing low commute may mean settling for a lower-prestige firm.',
      },
    ],
    missingInformation: [
      'Exact university credit transfer approval for 6-month off-campus work',
      'Direct supervisor name and structured mentorship cadence',
      'Net financial breakdown after daily travel & food expenses',
      'LinkedIn outcomes for previous interns at this specific firm',
    ],
    criticalQuestions: [
      'If the stipend were removed entirely, would you still choose this internship over coursework? Why?',
      'What concrete, measurable skills do you expect to possess in 6 months that you lack today?',
      'Have you met your direct daily supervisor, and what is their background in your field?',
      'How does this role position you for your ideal job 3 years post-graduation?',
      'What alternative skill-building or research paths are you giving up by locking in 6 months here?',
    ],
  },
  perspectives: {
    'Recruiter': {
      perspective: 'Recruiter',
      lensSummary: 'Evaluates resume signaling, skill credibility, and alignment with post-grad hiring standards.',
      considerations: [
        'A 6-month commitment shows reliability, but only if project outputs are clearly quantifiable on your resume.',
        'Recruiters look for specific technical contributions, not just general participation.',
      ],
      overlookedFactors: [
        'How well-known this company is among top employers in your target sub-discipline.',
      ],
      concerns: [
        'If the internship tasks turn out to be basic clerical work, it won\'t boost your candidate ranking for competitive roles.',
      ],
      criticalQuestions: [
        'Will you be able to write 3 bullet points with hard metrics on your resume after 6 months here?',
      ],
    },
    'Career Mentor': {
      perspective: 'Career Mentor',
      lensSummary: 'Focuses on long-term professional growth, mentorship access, and strategic networking.',
      considerations: [
        'Early career choices should maximize the rate of learning and high-caliber peer relationships.',
        'Proximity is convenient today, but high-growth mentors accelerate decades of your career.',
      ],
      overlookedFactors: [
        'Whether senior engineers/leaders at the firm have dedicated time to coach you.',
      ],
      concerns: [
        'Becoming comfortable in a convenient local role rather than stretching into ambitious environments.',
      ],
      criticalQuestions: [
        'Is there someone at this company whose career you would actively want to emulate in 5 years?',
      ],
    },
    'Financial Advisor': {
      perspective: 'Financial Advisor',
      lensSummary: 'Analyzes net earnings, hidden cost deductions, and cash flow vs opportunity cost.',
      considerations: [
        'Evaluate stipend on a net hourly basis after accounting for travel, meals, taxes, and prep time.',
        'Consider whether working part-time or tutoring might yield a higher hourly rate with lower academic conflict.',
      ],
      overlookedFactors: [
        'Commute fuel, public transit, meal surcharges, and academic tuition lost per credit hour.',
      ],
      concerns: [
        'Trading long-term earning potential (via a higher GPA/better first job) for minor short-term stipend cash.',
      ],
      criticalQuestions: [
        'What is your actual net earnings per hour worked when accounting for all hidden costs?',
      ],
    },
    'Family Member': {
      perspective: 'Family Member',
      lensSummary: 'Values safety, routine stability, physical well-being, and staying close to home.',
      considerations: [
        'Being 20 minutes from home reduces living stress, housing costs, and relocation hassle.',
        'Having family support nearby makes balancing work and studies easier.',
      ],
      overlookedFactors: [
        'Workplace stress levels and how long work hours might impact family time and health.',
      ],
      concerns: [
        'Burnout from trying to balance full-time internship duties with night study for college exams.',
      ],
      criticalQuestions: [
        'Will this schedule leave you enough rest and family time without constant exhaustion?',
      ],
    },
    'Future Self': {
      perspective: 'Future Self',
      lensSummary: 'Reflects 5 years ahead on whether this step opened doors or created unnecessary regrets.',
      considerations: [
        'In 5 years, the monthly stipend amount will be insignificant compared to the trajectory set.',
        'What matters is whether this experience built genuine confidence and valuable competence.',
      ],
      overlookedFactors: [
        'Whether you accepted this role out of active ambition or out of passive fear of having no offer.',
      ],
      concerns: [
        'Regretting taking the safest, closest option instead of applying for ambitious national opportunities.',
      ],
      criticalQuestions: [
        'Looking back from 5 years in the future, was this decision driven by growth or convenience?',
      ],
    },
  },
};

export const DEMO_PRESET_SIMULATIONS: Record<string, SimulateResult> = {
  default: {
    summary: 'Under this scenario, the primary risk shifts from financial convenience to acute academic strain and potential delay in graduation.',
    shiftedRisks: [
      {
        risk: 'Academic probation / Course delay',
        change: 'increased',
        explanation: 'Increased time commitment directly threatens study hours required for core university modules.',
      },
      {
        risk: 'Net financial gain',
        change: 'decreased',
        explanation: 'Reduced stipend or increased travel costs lower the net monetary benefit of the offer.',
      },
      {
        risk: 'Mentorship scarcity',
        change: 'new',
        explanation: 'Remote or altered working conditions reduce spontaneous learning from senior staff.',
      },
    ],
    brokenAssumptions: [
      'Assuming the internship can be smoothly completed alongside a full academic course load.',
      'Assuming the gross stipend figure translates to significant personal savings.',
    ],
    newQuestions: [
      'Can you negotiate part-time hours (20h/week) during heavy exam periods?',
      'Does the employer offer tuition reimbursement or academic credit sponsorship?',
    ],
    overallImpact: 'High',
  },
};

export const DEMO_CHALLENGE_STEPS: ChallengeNextResult[] = [
  {
    nextQuestion: 'You mentioned that "stipend and location" are your main drivers. If a remote research project paid 20% less but offered double the mentorship, why would you choose or reject it?',
    newlyRecognisedFactors: ['Value of structured mentorship vs raw cash stipend', 'Long-term network leverage'],
    clarifiedAssumptions: ['Recognised that immediate income was masking long-term learning goals'],
    remainingUncertainties: ['Exact hourly rate comparison across alternatives'],
    followUpQuestions: ['What is the minimum stipend required to cover your essential baseline expenses?'],
    sessionComplete: false,
  },
];
