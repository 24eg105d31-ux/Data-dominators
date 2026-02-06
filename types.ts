
export interface SuggestedRewrite {
  original: string;
  improved: string;
}

export interface ResumeFeedback {
  overallAssessment: string;
  strengths: string[];
  weaknesses: string[];
  missingElements: string[];
  suggestedRewrites: SuggestedRewrite[];
  atsTips: string[];
  score: number;
  scoreJustification: string;
}

export enum NavigationTab {
  DASHBOARD = 'dashboard',
  RESUME = 'resume',
  VOICE = 'voice',
  STRATEGIST = 'strategist'
}

/**
 * Represents a single step in a career development plan.
 */
export interface Milestone {
  title: string;
  duration: string;
  description: string;
  skills: string[];
}

/**
 * Represents a full career progression plan.
 */
export interface CareerRoadmap {
  title: string;
  summary: string;
  milestones: Milestone[];
}

export interface CareerStrategy {
  currentAssessment: string;
  trajectory: string;
  shortTermPlan: string; // 6-12 months
  longTermRoadmap: string; // 1-3 years
  skillsToDevelop: {
    technical: string[];
    soft: string[];
  };
  experienceMilestones: string[];
  learningResources: string[];
  risks: string[];
  nextActions: string[];
}

export interface StrategyClarification {
  questions: string[];
  context: string;
}

export type StrategyResponse = {
  type: 'strategy' | 'clarification';
  data: CareerStrategy | StrategyClarification;
};
