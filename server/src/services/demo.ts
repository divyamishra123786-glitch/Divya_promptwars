/**
 * Demo mode data — used when no Gemini API key is configured.
 * Based on the golden test case: student deciding on a 6-month internship.
 * This data is clearly labelled as demo output throughout the UI.
 */

import { AnalysisResult } from '../schemas/analysis';

export const DEMO_ANALYSIS: AnalysisResult = {
  mode: 'demo',
  executiveSummary:
    'You are weighing a 6-month internship that offers financial compensation and proximity to home. While these visible benefits are real, several important factors sit just outside your current frame — particularly the academic impact, the quality of mentorship, and what this role signals for your long-term trajectory.',
  decisionDna: {
    coreGoal: 'Gain industry experience while managing practical constraints (location, income)',
    priorities: ['Financial compensation', 'Geographic convenience', 'Industry exposure'],
    reasoningPattern: 'Availability bias — weighting factors that are most immediately measurable (stipend, distance) over factors that are harder to quantify (learning quality, opportunity cost)',
    statedPriorities: ['Good stipend', 'Close to home', 'Industry experience'],
    impliedPriorities: ['Financial security', 'Minimising disruption', 'Resume building'],
  },
  blindSpots: [
    {
      id: 'bs-1',
      title: 'Academic Impact',
      category: 'Academic',
      whatWasNoticed: 'The overlap between the 6-month internship period and your academic calendar has not been examined.',
      whyItMatters: 'Missing or delaying coursework could affect your GPA, graduation timeline, or eligibility for future opportunities.',
      whatIsUncertain: 'Whether your institution allows leaves of absence or part-time enrollment, and what the exact semester overlap looks like.',
      whatToInvestigate: 'Speak with your academic advisor about credit load impact, deferral policies, and whether any courses cannot be repeated.',
      severity: 'High',
    },
    {
      id: 'bs-2',
      title: 'Mentorship Quality',
      category: 'Learning',
      whatWasNoticed: 'You mentioned "learning opportunities" but have not assessed who you would actually learn from or how structured the mentorship is.',
      whyItMatters: 'An internship without meaningful mentorship may feel productive but leave you with only task-completion experience rather than transferable skills.',
      whatIsUncertain: 'Whether the organisation has a formal internship program, who your day-to-day supervisor would be, and their experience level.',
      whatToInvestigate: 'Ask the recruiter: What does a typical intern day look like? Who is my direct supervisor? Have past interns been hired full-time?',
      severity: 'High',
    },
    {
      id: 'bs-3',
      title: 'Long-Term Career Signal',
      category: 'Career',
      whatWasNoticed: 'The role is evaluated on immediate benefits rather than how it positions you for opportunities 2–3 years from now.',
      whyItMatters: 'Not all internships carry equal weight. The industry, company reputation, and role type affect how future employers read your resume.',
      whatIsUncertain: 'How this specific role is perceived in your target industry, and whether it opens or narrows future paths.',
      whatToInvestigate: 'Research where alumni from this company have landed. Talk to seniors who have done similar internships.',
      severity: 'Medium',
    },
    {
      id: 'bs-4',
      title: 'Opportunity Cost',
      category: 'Strategic',
      whatWasNoticed: 'Accepting this internship implicitly forecloses other options — summer research, other internships, personal projects — that have not been weighed.',
      whyItMatters: 'Six months is a significant portion of your student life. The alternatives you are not taking are part of this decision.',
      whatIsUncertain: 'What other internship cycles, research opportunities, or skill-building paths would be available to you in the same window.',
      whatToInvestigate: 'List the top 3 alternatives you would pursue if this offer were not available. Then compare them honestly.',
      severity: 'Medium',
    },
  ],
  assumptions: [
    {
      id: 'as-1',
      assumption: 'The stipend makes this financially worthwhile',
      risk: 'Commuting costs, professional clothing, meals, and reduced part-time work income may significantly offset the stipend.',
      severity: 'Medium',
    },
    {
      id: 'as-2',
      assumption: '"Close to home" means low disruption',
      risk: 'Daily commute time can be a hidden drain on study time, sleep, and social life — even for nearby locations.',
      severity: 'Low',
    },
    {
      id: 'as-3',
      assumption: 'Industry experience from any internship is equivalent',
      risk: 'The type of work, the company culture, and the quality of exposure vary enormously. Not all experience translates equally.',
      severity: 'High',
    },
  ],
  riskRadar: [
    { id: 'r-1', risk: 'Academic disruption', likelihood: 'High', impact: 'High', category: 'Academic' },
    { id: 'r-2', risk: 'Poor mentorship', likelihood: 'Medium', impact: 'High', category: 'Learning' },
    { id: 'r-3', risk: 'Net financial loss after costs', likelihood: 'Medium', impact: 'Medium', category: 'Financial' },
    { id: 'r-4', risk: 'Missed higher-value opportunities', likelihood: 'Low', impact: 'High', category: 'Strategic' },
    { id: 'r-5', risk: 'Role misalignment with career goals', likelihood: 'Medium', impact: 'Medium', category: 'Career' },
  ],
  conflictingPriorities: [
    {
      id: 'cp-1',
      factor1: 'Financial gain from stipend',
      factor2: 'Academic performance and continuity',
      tension: 'Pursuing the stipend may require sacrificing academic focus during a critical semester.',
    },
    {
      id: 'cp-2',
      factor1: 'Geographic convenience',
      factor2: 'Access to stronger opportunities elsewhere',
      tension: 'Prioritising proximity may mean forgoing internships at companies with stronger learning environments or career trajectories.',
    },
  ],
  missingInformation: [
    'Exact academic calendar overlap with the internship period',
    'Structured details about the mentorship and supervision model',
    'Net financial picture (stipend minus commute, food, clothing costs)',
    'Alumni outcomes from this company\'s internship program',
    'What alternative internships or opportunities are available in the same window',
  ],
  criticalQuestions: [
    'If the stipend were removed entirely, would you still want this internship? Why or why not?',
    'What specific skills do you expect to have at the end of six months that you do not have today?',
    'How will this internship affect your academic standing, and have you spoken with your academic advisor?',
    'Three years from now, how will this experience read on your resume in the field you want to enter?',
    'What is the best alternative use of these six months, and how does it compare honestly to this offer?',
  ],
};

export function getDemoAnalysis(): AnalysisResult {
  return { ...DEMO_ANALYSIS };
}
