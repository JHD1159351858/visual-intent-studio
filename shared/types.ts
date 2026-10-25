export type Stage = 'structure' | 'style' | 'effect';
export type SourceId = 'designeer' | 'reactbits' | 'aceternity' | 'codrops' | '60fps';

export interface CatalogEntry {
  id: string;
  name: string;
  title: string;
  stage: Stage;
  description: string;
  aliases: string[];
  trigger: string;
  placements: string[];
  tags: string[];
  sourceId: SourceId;
  sourceUrl: string;
  implementationUrl?: string;
  preview: {
    type: 'video' | 'link';
    url: string;
    poster?: string;
    verified: boolean;
    provenance: 'original' | 'reference-recording' | 'source-recording';
    note?: string;
  };
  status: 'ready' | 'draft';
  updatedAt: string;
  userNotes?: string;
  curation?: { reviewedAt: string; evidenceUrl: string };
}

export interface Selection {
  entryId: string;
  stage: Stage;
  placement: string;
  adjustments: string;
  target?: string;
  layer?: VisualLayer;
  operation?: 'add' | 'replace';
  preserve?: string[];
}

export type VisualLayer = 'layout' | 'surface' | 'border' | 'outer-glow' | 'page-background' | 'text' | 'content';

export interface PagePlan {
  summary: string;
  features: string[];
  layout: string;
  visualStyle: string;
  effects: {
    target: string;
    selectionTarget?: string;
    layer: VisualLayer;
    behavior: string;
    referenceEntryId: string | null;
    adaptation: string;
    preserve: string[];
  }[];
  assumptions: string[];
}

export interface DemoResult {
  status: 'ready' | 'needs_clarification';
  message: string;
  pagePlan: PagePlan | null;
  html: string;
  developerPrompt: string;
}

export interface DemoRequest {
  task: 'generate_demo' | 'revise_demo';
  brief: string;
  messages?: Message[];
  selections: Selection[];
  previous?: DemoResult;
  changeRequest?: string;
}

export interface DesignPromptRequest {
  brief: string;
  messages?: Message[];
  selections: Selection[];
  conversationId?: string;
}

export interface RequirementDraft {
  goal: string;
  audience: string;
  features: string[];
  visualStyle: string;
  motion: 'still' | 'balanced' | 'expressive';
  constraints: string;
}

export interface DesignPromptResult {
  message: string;
  developerPrompt: string;
  referenceEntryIds: string[];
  assumptions: string[];
  requirementDraft?: RequirementDraft;
  mainVisuals?: MainVisual[];
  selectionDiversity?: { recentPageCount: number; reselected: boolean; keptOriginal: boolean; historySaved: boolean };
}

export interface MainVisual {
  role: 'background' | 'hero' | 'title';
  family: string;
  entryIds: string[];
  description: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface RecommendationRequest {
  description: string;
  stage: Stage;
  selections: Selection[];
  excludedIds: string[];
  messages?: Message[];
}

export interface RecommendationResponse {
  mode: 'model' | 'manual';
  message: string;
  candidates: { entryId: string; reason: string }[];
}

export interface ExportRequest {
  brief: string;
  selections: Selection[];
  messages?: Message[];
}

export interface SourceInfo {
  id: SourceId;
  name: string;
  url: string;
  kind: 'directory' | 'components' | 'cases';
  count: number;
  lastSyncedAt?: string;
}

export interface AppStatus {
  model: { configured: boolean; name?: string };
  readyCount: number;
  draftCount: number;
}
