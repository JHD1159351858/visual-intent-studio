import { selectionLayer, selectionTarget } from '../shared/selection';
import type { CatalogEntry, DesignPromptResult, Message, RequirementDraft } from '../shared/types';
import type { PageRequirements, Session } from './session';

export const PROMPT_PREFIX = '专业开发提示词\n';
const PAGE_REQUIREMENTS_PREFIX = '整页需求更新，以这一版为准：\n';
const clean = (value: string) => value.trim().replace(/\s+/g, ' ');
const motionText: Record<PageRequirements['motion'], string> = { still: '不要动画，页面保持静态', balanced: '动效克制，只保留必要的反馈与过渡', expressive: '动效特别强，突出明显的视觉变化与交互反馈' };

export function isRequirementDraft(value: unknown): value is RequirementDraft {
  const item = value as RequirementDraft;
  return !!item && typeof item.goal === 'string' && !!item.goal.trim() && item.goal.length <= 2000 && typeof item.audience === 'string' && item.audience.length <= 500 && Array.isArray(item.features) && item.features.length <= 60 && item.features.every(feature => typeof feature === 'string' && feature.length <= 500) && typeof item.visualStyle === 'string' && item.visualStyle.length <= 3000 && ['still', 'balanced', 'expressive'].includes(item.motion) && typeof item.constraints === 'string' && item.constraints.length <= 4000;
}

export function applyPageRequirements(session: Session, brief: string, requirements: PageRequirements): Session {
  const nextBrief = clean(brief);
  const pageRequirements: PageRequirements = { audience: clean(requirements.audience), features: [...new Set(requirements.features.map(clean).filter(Boolean))], visualStyle: clean(requirements.visualStyle), motion: requirements.motion, constraints: clean(requirements.constraints) };
  const content = `${PAGE_REQUIREMENTS_PREFIX}页面目标：${nextBrief || '未填写'}\n目标用户：${pageRequirements.audience || '未填写'}\n主要功能：${pageRequirements.features.join('、') || '未填写'}\n视觉风格：${pageRequirements.visualStyle || '未填写'}\n动效要求：${motionText[pageRequirements.motion]}\n限制条件：${pageRequirements.constraints || '未填写'}`;
  if (session.brief === nextBrief && JSON.stringify(session.pageRequirements) === JSON.stringify(pageRequirements) && session.messages.filter(message => message.role === 'user').at(-1)?.content === content) return session.requirementDraft ? { ...session, requirementDraft: undefined } : session;
  const messages = session.messages.filter(message => message.role === 'user').at(-1)?.content === content ? session.messages : [...session.messages, { role: 'user' as const, content }];
  return { ...session, brief: nextBrief, pageRequirements, messages, ...(session.requirementDraft ? { requirementDraft: undefined } : {}) };
}

export function capturePromptResult(session: Session, result: DesignPromptResult, entries: CatalogEntry[], fingerprint = requirementsFingerprint(session)): Session {
  const available = new Set(entries.filter(entry => entry.status === 'ready' && entry.preview.type === 'video' && entry.preview.verified).map(entry => entry.id));
  return { ...session, messages: [...session.messages, { role: 'assistant', content: PROMPT_PREFIX + result.developerPrompt }], promptFingerprint: fingerprint, promptReferenceEntryIds: [...new Set(result.referenceEntryIds)].filter(id => available.has(id)), requirementDraft: isRequirementDraft(result.requirementDraft) ? result.requirementDraft : undefined };
}

export function promptReferenceCandidates(session: Session, entries: CatalogEntry[], excluded: string[] = []) {
  return (session.promptReferenceEntryIds || []).flatMap(id => {
    const entry = entries.find(item => item.id === id && item.stage === session.stage && item.status === 'ready' && item.preview.type === 'video' && item.preview.verified);
    return entry && !excluded.includes(id) ? [{ entryId: id, reason: `当前提示词采用的参考：${entry.description} 观看后可确认使用位置与作用部位。` }] : [];
  }).slice(0, 3);
}

export function requirementsContextMessages(messages: Message[]): Message[] {
  const recent = messages.slice(-40);
  const latest = messages.filter(message => message.role === 'user' && message.content.startsWith(PAGE_REQUIREMENTS_PREFIX)).at(-1);
  return latest && !recent.includes(latest) ? [latest, ...messages.slice(-39)] : recent;
}

export function requirementsFingerprint(source: Pick<Session, 'brief' | 'messages' | 'selections'>): string {
  const selections = source.selections.map(selection => ({ entryId: selection.entryId, placement: selection.placement, adjustments: selection.adjustments, target: selectionTarget(selection), layer: selectionLayer(selection), operation: selection.operation || (selection.stage === 'structure' ? 'replace' : 'add'), preserve: [...(selection.preserve || [])].sort() })).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  return JSON.stringify({ brief: source.brief, userMessages: source.messages.filter(message => message.role === 'user').map(message => message.content), selections });
}

export function promptNeedsRefresh(session: Session): boolean {
  return session.messages.some(message => message.role === 'assistant' && message.content.startsWith(PROMPT_PREFIX)) && (!session.promptFingerprint || session.promptFingerprint !== requirementsFingerprint(session));
}
