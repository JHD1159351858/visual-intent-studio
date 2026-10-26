import type { VisualLayer } from './types';

export interface DesignPlan {
  subject: string;
  userTask: string;
  concept: string;
  composition: string;
  primaryVisual: { subject: string; visibleScale: string; material: string; motion: string };
  navigation: string;
  readingArea: string;
  style: { palette: string[]; typography: string };
  assets: { name: string; acquisition: string; quality: string; fallback: string }[];
  searches: { query: string; purpose: string; layer?: VisualLayer }[];
  acceptance: string[];
}

export interface DesignReview {
  verdict: 'pass' | 'revise';
  summary: string;
  issues: {
    category: 'requirements' | 'composition' | 'assets' | 'references' | 'motion' | 'implementation' | 'readability' | 'delivery';
    problem: string;
    evidence: string;
    fix: string;
  }[];
}
