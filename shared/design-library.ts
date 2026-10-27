import type { VisualLayer } from './types';

export interface PageRecipe {
  id: string;
  designMethod?: 'frontend-design';
  title: string;
  description: string;
  aliases: string[];
  purpose: string;
  features: string[];
  sections: { id: string; title: string; purpose: string }[];
  tokens: { colors: Record<string, string>; fonts: Record<string, string>; spacing: number[]; radius: number };
  interactions: { name: string; trigger: string; result: string }[];
  componentIds: string[];
  referenceEntryIds: string[];
  pairingRules: string[];
  htmlPath: string;
  posterPath: string;
}

export interface ComponentImplementation {
  id: string;
  title: string;
  entryId: string;
  sourceUrl: string;
  description: string;
  layer: VisualLayer;
  parameters: Record<string, string>;
  compatibleWith: string[];
  conflicts: string[];
  mobileBehavior: string;
  reducedMotion: string;
  limitations: string[];
  code: { html: string; css: string; js: string };
  htmlPath: string;
  posterPath: string;
}

export interface DesignLibrary {
  pages: PageRecipe[];
  components: ComponentImplementation[];
}

export interface DesignBasis {
  selectedRecipe: (Omit<PageRecipe, 'htmlPath' | 'posterPath'> & { html: string }) | null;
  nativeImplementations: Omit<ComponentImplementation, 'htmlPath' | 'posterPath'>[];
  referenceEntryIds: string[];
}
