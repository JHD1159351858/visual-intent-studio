import type { DemoResult, Selection } from '../shared/types';
import { selectionKey, selectionLayer, selectionTarget } from '../shared/selection';

export const DEMO_STORAGE_KEY = 'jianyi.demo.v1';
type DraftSource = { brief: string; messages: { role: string; content: string }[]; selections?: Selection[] };
export interface SavedDemo { source: string; version: number; generatedAt: string; result: DemoResult; generationFingerprint?: string }
const layers = ['layout', 'surface', 'border', 'outer-glow', 'page-background', 'text', 'content'];
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(item => typeof item === 'string');
const sourceKey = (source: DraftSource) => JSON.stringify([source.brief, source.messages.find(message => message.role === 'user')?.content || '']);
const generationFingerprint = (source: DraftSource) => JSON.stringify({ userMessages: source.messages.filter(message => message.role === 'user').map(message => message.content), selections: [...(source.selections || [])].sort((a, b) => selectionKey(a).localeCompare(selectionKey(b))).map(selection => ({ entryId: selection.entryId, stage: selection.stage, placement: selection.placement, adjustments: selection.adjustments, target: selectionTarget(selection), layer: selectionLayer(selection), operation: selection.operation || (selection.stage === 'structure' ? 'replace' : 'add'), preserve: selection.preserve || [] })) });

export function demoNeedsRefresh(saved: SavedDemo | null, source: DraftSource): boolean { return !!saved && (!saved.generationFingerprint || saved.generationFingerprint !== generationFingerprint(source)); }

export function reconcileDemoSelections(items: Selection[], result: DemoResult): Selection[] {
  if (result.status !== 'ready' || !result.pagePlan) return items;
  return items.filter(selection => result.pagePlan!.effects.some(effect => effect.referenceEntryId === selection.entryId && effect.layer === selectionLayer(selection) && (effect.selectionTarget || effect.target).trim() === selectionTarget(selection)));
}

export function isDemoResult(value: unknown): value is DemoResult {
  if (!value || typeof value !== 'object') return false;
  const result = value as DemoResult;
  if (!['ready', 'needs_clarification'].includes(result.status) || typeof result.message !== 'string' || typeof result.html !== 'string' || typeof result.developerPrompt !== 'string') return false;
  if (result.status === 'needs_clarification') return !result.html && !result.developerPrompt;
  const plan = result.pagePlan;
  return !!result.html.trim() && !!result.developerPrompt.trim() && !!plan && typeof plan.summary === 'string' && typeof plan.layout === 'string' && typeof plan.visualStyle === 'string' && strings(plan.features) && strings(plan.assumptions) && Array.isArray(plan.effects) && plan.effects.every(effect => !!effect && typeof effect.target === 'string' && (effect.selectionTarget === undefined || typeof effect.selectionTarget === 'string') && layers.includes(effect.layer) && typeof effect.behavior === 'string' && (effect.referenceEntryId === null || typeof effect.referenceEntryId === 'string') && typeof effect.adaptation === 'string' && strings(effect.preserve));
}

export function restoreDemo(value: string | null, source: DraftSource): SavedDemo | null {
  try {
    const parsed = JSON.parse(value || 'null') as SavedDemo | null;
    return parsed && parsed.source === sourceKey(source) && Number.isInteger(parsed.version) && parsed.version > 0 && typeof parsed.generatedAt === 'string' && (parsed.generationFingerprint === undefined || typeof parsed.generationFingerprint === 'string') && isDemoResult(parsed.result) && parsed.result.status === 'ready' ? parsed : null;
  } catch { return null; }
}

export function acceptDemo(previous: SavedDemo | null, result: DemoResult, source: DraftSource): SavedDemo | null {
  if (result.status !== 'ready' || !isDemoResult(result)) return previous;
  return { source: sourceKey(source), version: previous?.source === sourceKey(source) ? previous.version + 1 : 1, generatedAt: new Date().toISOString(), result, generationFingerprint: generationFingerprint(source) };
}

export function saveDemo(storage: Pick<Storage, 'setItem' | 'removeItem'>, value: SavedDemo | null): boolean {
  try { if (value) storage.setItem(DEMO_STORAGE_KEY, JSON.stringify(value)); else storage.removeItem(DEMO_STORAGE_KEY); return true; } catch { return false; }
}
