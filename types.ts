
export interface RoadmapMilestone {
  title: string;
  description: string;
  skills: string[];
  duration: string;
}

export interface CareerRoadmap {
  title: string;
  summary: string;
  milestones: RoadmapMilestone[];
}

export interface ResumeFeedback {
  score: number;
  pros: string[];
  cons: string[];
  recommendations: string[];
  suggestedRewrite?: string;
}

export enum NavigationTab {
  DASHBOARD = 'dashboard',
  RESUME = 'resume',
  PLANNER = 'planner',
  INTERVIEW = 'interview'
}
