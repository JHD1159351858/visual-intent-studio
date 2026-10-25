import type { ExportRequest, Message, RequirementDraft, Selection, Stage, VisualLayer } from '../shared/types';
import { selectionKey, selectionLayer, selectionTarget, visualLayers } from '../shared/selection';
import { isRequirementDraft, requirementsContextMessages } from './requirements';

export const STORAGE_KEY = 'jianyi.draft.v1';
export interface PageRequirements { audience: string; features: string[]; visualStyle: string; motion: 'still' | 'balanced' | 'expressive'; constraints: string }
export interface Session { brief: string; messages: Message[]; stage: Stage; selections: Selection[]; pageRequirements?: PageRequirements; promptFingerprint?: string; requirementDraft?: RequirementDraft; promptReferenceEntryIds?: string[] }
export const createSession = (): Session => ({ brief: '', messages: [], stage: 'structure', selections: [] });
const isStage = (value: unknown): value is Stage => ['structure', 'style', 'effect'].includes(String(value));
const isPageRequirements = (value: unknown): value is PageRequirements => {
  const item = value as PageRequirements;
  return !!item && typeof item.audience === 'string' && Array.isArray(item.features) && item.features.every(feature => typeof feature === 'string') && typeof item.visualStyle === 'string' && ['still', 'balanced', 'expressive'].includes(item.motion) && typeof item.constraints === 'string';
};

export function restoreSession(value: string | null): Session {
  try {
    const parsed = JSON.parse(value ?? 'null');
    if (!parsed || typeof parsed.brief !== 'string' || !isStage(parsed.stage) || !Array.isArray(parsed.messages) || !Array.isArray(parsed.selections)) return createSession();
    if (!parsed.messages.every((item: Message) => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string')) return createSession();
    if (!parsed.selections.every((item: Selection) => item && typeof item.entryId === 'string' && isStage(item.stage) && typeof item.placement === 'string' && typeof item.adjustments === 'string' && (item.target === undefined || typeof item.target === 'string') && (item.layer === undefined || visualLayers.includes(item.layer)) && (item.operation === undefined || ['add', 'replace'].includes(item.operation)) && (item.preserve === undefined || (Array.isArray(item.preserve) && item.preserve.every(value => typeof value === 'string'))))) return createSession();
    return { brief: parsed.brief, messages: parsed.messages, stage: parsed.stage, selections: parsed.selections, ...(isPageRequirements(parsed.pageRequirements) ? { pageRequirements: parsed.pageRequirements } : {}), ...(typeof parsed.promptFingerprint === 'string' ? { promptFingerprint: parsed.promptFingerprint } : {}), ...(isRequirementDraft(parsed.requirementDraft) ? { requirementDraft: parsed.requirementDraft } : {}), ...(Array.isArray(parsed.promptReferenceEntryIds) && parsed.promptReferenceEntryIds.every((id: unknown) => typeof id === 'string') ? { promptReferenceEntryIds: parsed.promptReferenceEntryIds } : {}) };
  } catch { return createSession(); }
}

export function saveSession(storage: Pick<Storage, 'setItem'>, session: Session): boolean {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(session)); return true; } catch { return false; }
}

export function confirmSelection(items: Selection[], selection: Selection): Selection[] {
  const key = selectionKey(selection);
  const replacing = (selection.operation || (selection.stage === 'structure' ? 'replace' : 'add')) === 'replace';
  if (!replacing && items.some(item => selectionKey(item) === key)) return items.map(item => selectionKey(item) === key ? selection : item);
  const remaining = items.filter(item => selectionKey(item) !== key && (!replacing || selectionTarget(item) !== selectionTarget(selection) || selectionLayer(item) !== selectionLayer(selection)));
  return [...remaining, selection];
}

export const removeSelection = (items: Selection[], entryId: string, target?: string, layer?: VisualLayer) => items.filter(item => item.entryId !== entryId || (target !== undefined && selectionTarget(item) !== target) || (layer !== undefined && selectionLayer(item) !== layer));
export const exportPayload = (session: Session): ExportRequest => ({ brief: session.brief, selections: session.selections, ...(session.messages.length ? { messages: requirementsContextMessages(session.messages) } : {}) });
