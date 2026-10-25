import { describe, expect, it } from 'vitest';
import type { CatalogEntry, DesignPromptResult } from '../shared/types';
import { createSession, exportPayload, restoreSession } from '../src/session';
import { applyPageRequirements, capturePromptResult, promptNeedsRefresh, promptReferenceCandidates } from '../src/requirements';

const entry = (id: string, stage: CatalogEntry['stage'] = 'effect', ready = true): CatalogEntry => ({ id, name: id, title: id, stage, description: '真实视觉效果', aliases: [], trigger: '持续', placements: ['卡片'], tags: [], sourceId: 'reactbits', sourceUrl: `https://reactbits.dev/components/${id}`, preview: { type: 'video', url: `/media/${id}.webm`, verified: ready, provenance: 'source-recording' }, status: ready ? 'ready' : 'draft', updatedAt: '' });
const requirementDraft = { goal: '学生课程资料查询', audience: '大学生', features: ['搜索课程', '查看来源'], visualStyle: '蓝色圆润卡片', motion: 'expressive' as const, constraints: '玻璃表面保持原样，仅边缘流动' };
const result: DesignPromptResult = { message: '已整理', developerPrompt: '请实现课程查询页面。', referenceEntryIds: ['beam', 'glass', 'beam', 'unavailable', 'unknown'], assumptions: [], requirementDraft };

describe('linked chat, references, requirements and prompt', () => {
  it('keeps generated references and a reviewable draft without overwriting saved requirements or confirming effects', () => {
    const saved = applyPageRequirements(createSession(), '已有课程页', { ...requirementDraft, visualStyle: '保留白色背景' });
    const linked = capturePromptResult(saved, result, [entry('beam'), entry('glass', 'style'), entry('unavailable', 'effect', false)]);
    expect(linked.brief).toBe(saved.brief);
    expect(linked.pageRequirements).toEqual(saved.pageRequirements);
    expect(linked.requirementDraft).toEqual(requirementDraft);
    expect(linked.selections).toEqual([]);
    expect(linked.promptReferenceEntryIds).toEqual(['beam', 'glass']);
    expect(linked.messages.at(-1)?.content).toContain(result.developerPrompt);
    expect(promptNeedsRefresh(linked)).toBe(false);
    expect(exportPayload(linked).messages?.some(message => message.role === 'user' && message.content.includes(requirementDraft.visualStyle))).toBe(false);
  });

  it('shows up to three playable prompt references for the active stage and honors exclusions', () => {
    const entries = [entry('a'), entry('b'), entry('c'), entry('d'), entry('style', 'style'), entry('bad', 'effect', false)];
    const session = { ...createSession(), stage: 'effect' as const, promptReferenceEntryIds: ['a', 'b', 'c', 'd', 'style', 'bad', 'missing'] };
    expect(promptReferenceCandidates(session, entries).map(value => value.entryId)).toEqual(['a', 'b', 'c']);
    expect(promptReferenceCandidates(session, entries, ['a', 'b', 'c']).map(value => value.entryId)).toEqual(['d']);
    expect(promptReferenceCandidates({ ...session, stage: 'style' }, entries).map(value => value.entryId)).toEqual(['style']);
  });

  it('adopts a reviewed requirement draft into the next request and makes the old prompt stale', () => {
    const linked = capturePromptResult({ ...createSession(), brief: '课程页' }, result, [entry('beam')]);
    const adopted = applyPageRequirements(linked, requirementDraft.goal, requirementDraft);
    expect(adopted.requirementDraft).toBeUndefined();
    expect(adopted.selections).toEqual([]);
    expect(adopted.promptReferenceEntryIds).toEqual(['beam']);
    expect(exportPayload(adopted).messages?.at(-1)?.content).toContain('仅边缘流动');
    expect(promptNeedsRefresh(adopted)).toBe(true);
  });

  it('restores linked metadata and ignores malformed optional values without losing the conversation', () => {
    const linked = capturePromptResult({ ...createSession(), brief: '课程页' }, result, [entry('beam')]);
    expect(restoreSession(JSON.stringify(linked))).toEqual(linked);
    const restored = restoreSession(JSON.stringify({ ...linked, requirementDraft: { ...requirementDraft, motion: 'unknown' }, promptReferenceEntryIds: [null] }));
    expect(restored.brief).toBe('课程页');
    expect(restored.messages).toEqual(linked.messages);
    expect(restored.requirementDraft).toBeUndefined();
    expect(restored.promptReferenceEntryIds).toBeUndefined();
  });

  it('keeps legacy result support and clears an older proposal on a new response', () => {
    const linked = capturePromptResult(createSession(), result, [entry('beam')]);
    const legacy = { ...result }; delete legacy.requirementDraft;
    const updated = capturePromptResult(linked, legacy, [entry('beam')]);
    expect(updated.requirementDraft).toBeUndefined();
    expect(updated.selections).toEqual([]);
  });

  it('dismisses a reviewed proposal even when it repeats the already saved requirements', () => {
    const saved = applyPageRequirements(createSession(), requirementDraft.goal, requirementDraft);
    const linked = capturePromptResult(saved, result, [entry('beam')]);
    const adopted = applyPageRequirements(linked, requirementDraft.goal, requirementDraft);
    expect(adopted.requirementDraft).toBeUndefined();
    expect(adopted.messages).toEqual(linked.messages);
    expect(promptNeedsRefresh(adopted)).toBe(false);
  });
});
