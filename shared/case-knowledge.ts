import type { VisualLayer } from './types';

export type CaseKnowledgeBasis = 'source-code' | 'observed-behavior';
export type CaseEvidenceKind = 'registry' | 'source-code' | 'official-description' | 'video-page';
export type CaseEvidenceHashScope = 'registry-response' | 'source-files-joined' | 'page-response';

export interface CaseKnowledge {
  entryId: string;
  sourceUrl: string;
  basis: CaseKnowledgeBasis;
  implementation: {
    summary: string;
    steps: string[];
    dependencies: string[];
    parameters: Record<string, string>;
  };
  suitableFor: string[];
  avoidFor: string[];
  layers: VisualLayer[];
  limitations: string[];
  mobile: string;
  reducedMotion: string;
  performance: string;
  evidence: { url: string; kind: CaseEvidenceKind; checkedAt: string; sha256?: string; hashScope?: CaseEvidenceHashScope; paths?: string[] }[];
  notes: string;
}

export interface CompactCaseKnowledge {
  basis: CaseKnowledgeBasis;
  method: string;
  steps: string[];
  scenes: string[];
  avoid: string[];
  layers: VisualLayer[];
  limits: string[];
  dependencies: string[];
  mobile: string;
  reducedMotion: string;
  performance: string;
  parameters: Record<string, string>;
  evidence: { url: string; kind: CaseEvidenceKind; sha256?: string; hashScope?: CaseEvidenceHashScope }[];
}
