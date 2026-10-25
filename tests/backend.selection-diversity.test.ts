import { afterEach, expect, it, vi } from 'vitest';
import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import type { CatalogEntry, DesignPromptRequest, DesignPromptResult, MainVisual } from '../shared/types';
import { generateDesignPrompt } from '../server/design-prompt';
import { SelectionHistoryStore } from '../server/selection-history';

const roots: string[] = [];
afterEach(async () => { vi.unstubAllGlobals(); for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }); });
const model = { baseUrl: 'https://model.example/v1', name: 'test-model', apiKey: 'server-only-key' };
const entry = (id: string, name: string): CatalogEntry => ({ id, name, title: name, stage: 'style', description: name + '持续运动', aliases: [], tags: [], placements: ['主视觉'], trigger: '持续运动', sourceId: 'reactbits', sourceUrl: `https://reactbits.dev/components/${id}`, preview: { type: 'video', url: '/media/' + id + '.webm', verified: true, provenance: 'source-recording' }, status: 'ready', updatedAt: '' });
const entries = [entry('fluid', 'Liquid Fluid'), entry('orbit', 'Orbit Images'), entry('grid', 'Grid Scan'), entry('orb', 'Sphere Orb')];
const visuals: MainVisual[] = [{ role: 'background', family: 'fluid-flow', entryIds: ['fluid'], description: '背景液体缓慢流动' }, { role: 'hero', family: 'image-orbit', entryIds: ['orbit'], description: '主题图片围绕中心运动' }];
const alternative: MainVisual[] = [{ role: 'background', family: 'grid-scan', entryIds: ['grid'], description: '网格中的扫描光带' }, { role: 'hero', family: 'sphere-orb', entryIds: ['orb'], description: '球体表面产生持续形态变化' }];
const request: DesignPromptRequest = { brief: '制作课程助手，强动效，支持资料查询与历史记录', conversationId: 'current-page', messages: [], selections: [] };
const result = (mainVisuals = visuals): DesignPromptResult => ({ developerPrompt: '请在目标工程实现课程助手页面，支持课程资料查询与历史记录。首屏的背景和主体具有有分工的持续动态表现；输入和正文保持稳定。保留全部明确功能与已确认作用范围，手机可使用，并提供暂停与减少动态支持。', message: '已完成', referenceEntryIds: mainVisuals.flatMap(item => item.entryIds), assumptions: [], requirementDraft: { goal: '课程助手', audience: '学生', features: ['资料查询', '历史记录'], visualStyle: '', motion: 'expressive', constraints: '' }, mainVisuals });
async function rootDir() { const root = await mkdtemp(path.join(tmpdir(), 'selection-diversity-')); roots.push(root); return root; }
function mockResults(values: (DesignPromptResult | Error)[]) {
  const calls: any[] = [];
  const mock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
    const sent = JSON.parse(String(init?.body));
    calls.push({ instruction: sent.messages[0].content, context: JSON.parse(sent.messages[1].content) });
    const value = values.shift(); if (value instanceof Error) throw value; if (!value) throw Error('Unexpected extra generation');
    return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(value) } }] }), { headers: { 'Content-Type': 'application/json' } });
  });
  vi.stubGlobal('fetch', mock); return { mock, calls };
}
async function seed(root: string) { await generateDesignPrompt(model, { ...request, brief: '音乐推荐，强动效', conversationId: 'previous-page' }, entries, root); }

it('records only a successful final design and sends recent usage to the next page', async () => {
  const root = await rootDir(); const { calls } = mockResults([result(), result(alternative)]);
  await seed(root); const output = await generateDesignPrompt(model, request, entries, root);
  expect(calls[1].context.selectionDiversity.recentDesigns).toHaveLength(1);
  expect(calls[1].instruction).toContain('mainVisuals');
  expect(calls[1].instruction).toContain('这些都优先于新颖性');
  expect(calls[1].context.availableCatalog.map((item: any) => item.id).sort()).toEqual(entries.map(item => item.id).sort());
  expect(output.selectionDiversity).toMatchObject({ recentPageCount: 1, reselected: false, historySaved: true });
  expect(await new SelectionHistoryStore(root).list()).toHaveLength(2);
});

it('reselects a similar main-visual combination once and saves only the improved result', async () => {
  const root = await rootDir(); const { mock, calls } = mockResults([result(), result(), result(alternative)]);
  await seed(root); const output = await generateDesignPrompt(model, request, entries, root);
  expect(mock).toHaveBeenCalledTimes(3);
  expect(calls[2].context.reselection).toMatchObject({ previousResult: { referenceEntryIds: ['fluid', 'orbit'] } });
  expect(calls[2].instruction).toContain('requirementDraft逐字保留初稿');
  expect(output.referenceEntryIds).toEqual(['grid', 'orb']);
  expect(output.selectionDiversity).toMatchObject({ reselected: true, keptOriginal: false });
  const saved = await new SelectionHistoryStore(root).list();
  expect(saved).toHaveLength(2); expect(saved[0].referenceEntryIds).toEqual(['grid', 'orb']);
});

it('updates the same conversation without treating its own last design as a duplicate', async () => {
  const root = await rootDir(); const { mock } = mockResults([result(), result()]);
  await generateDesignPrompt(model, request, entries, root);
  const output = await generateDesignPrompt(model, request, entries, root);
  expect(mock).toHaveBeenCalledTimes(2); expect(output.selectionDiversity?.reselected).toBe(false);
  expect(await new SelectionHistoryStore(root).list()).toHaveLength(1);
});

it('keeps confirmed references and their scopes instead of forcing a new combination', async () => {
  const root = await rootDir(); const { mock, calls } = mockResults([result(), result()]); await seed(root);
  const selections = visuals.map(item => ({ entryId: item.entryIds[0], stage: 'style' as const, target: '首屏', layer: 'surface' as const, placement: '首屏', adjustments: '必须保留', preserve: ['输入与正文'] }));
  const output = await generateDesignPrompt(model, { ...request, selections }, entries, root);
  expect(mock).toHaveBeenCalledTimes(2); expect(output.selectionDiversity?.reselected).toBe(false);
  expect(calls[1].context.selectionDiversity.protectedEntryIds.sort()).toEqual(['fluid','orbit']);
  expect(output.developerPrompt).toContain('输入与正文');
});

it.each(['failed', 'not-improved', 'changed-requirements', 'metadata-only', 'missing-primary'])('keeps the valid first design when reselection is %s', async mode => {
  const root = await rootDir(); const replacement = mode === 'failed' ? Error('Model unavailable') : mode === 'not-improved' ? result() : mode === 'metadata-only' ? { ...result(), mainVisuals: [visuals[0]] } : mode === 'missing-primary' ? { ...result(), developerPrompt: result().developerPrompt + '本轮重新整理了主视觉说明。', mainVisuals: [visuals[0]] } : { ...result(alternative), requirementDraft: { ...result().requirementDraft!, features: ['资料查询'] } };
  const { mock } = mockResults([result(), result(), replacement]); await seed(root);
  const output = await generateDesignPrompt(model, request, entries, root);
  expect(mock).toHaveBeenCalledTimes(3); expect(output.referenceEntryIds).toEqual(['fluid','orbit']);
  expect(output.selectionDiversity).toMatchObject({ reselected: true, keptOriginal: true, historySaved: true });
  expect((await new SelectionHistoryStore(root).list())[0].referenceEntryIds).toEqual(['fluid','orbit']);
});

it('does not record a cancelled generation, including cancellation during reselection', async () => {
  const root = await rootDir(); mockResults([result()]); await seed(root);
  const controller = new AbortController(); let calls = 0;
  vi.stubGlobal('fetch', vi.fn(async () => {
    if (++calls === 2) { controller.abort(); throw new DOMException('Aborted', 'AbortError'); }
    return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(result()) } }] }));
  }));
  await expect(generateDesignPrompt(model, request, entries, root, { signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' });
  expect(await new SelectionHistoryStore(root).list()).toHaveLength(1);
});

it('preserves valid prompt output when history is corrupt, without overwriting the file', async () => {
  const root = await rootDir(); await mkdir(path.join(root, 'data')); const file = path.join(root, 'data/selection-history.json'); await writeFile(file, '{broken');
  mockResults([result()]); const output = await generateDesignPrompt(model, request, entries, root);
  expect(output.selectionDiversity?.historySaved).toBe(false); expect(await readFile(file, 'utf8')).toBe('{broken');
});

it('supports legacy responses and ignores invalid optional main-visual metadata', async () => {
  const root = await rootDir(); const legacy = result(); delete legacy.mainVisuals;
  mockResults([legacy, { ...result(), mainVisuals: [{ ...visuals[0], family: 'invented-family' }] }]);
  const first = await generateDesignPrompt(model, request, entries, root); expect(first.mainVisuals || []).toEqual([]);
  const second = await generateDesignPrompt(model, { ...request, conversationId: 'next-page' }, entries, root); expect(second.mainVisuals || []).toEqual([]);
  expect(second.selectionDiversity?.reselected).toBe(false);
});

it('does not save a failed or invalid first generation', async () => {
  const root = await rootDir(); mockResults([Error('Model unavailable'), { ...result(), referenceEntryIds: ['invented-id'] }]);
  await expect(generateDesignPrompt(model, request, entries, root)).rejects.toThrow();
  await expect(generateDesignPrompt(model, request, entries, root)).rejects.toThrow();
  expect(await new SelectionHistoryStore(root).list()).toEqual([]);
});

it('keeps the first design when a new combination drops a confirmed reference', async () => {
  const root = await rootDir();
  const selected = entry('tilt', 'Pointer Tilt'); const catalog = [...entries, selected];
  const withSelection = (value: DesignPromptResult) => ({ ...value, referenceEntryIds: [...value.referenceEntryIds, 'tilt'] });
  const { mock } = mockResults([result(), withSelection(result()), result(alternative)]);
  await seed(root);
  const output = await generateDesignPrompt(model, { ...request, selections: [{ entryId: 'tilt', stage: 'style', placement: '课程封面', target: '课程封面', layer: 'surface', adjustments: '', preserve: ['功能与正文'] }] }, catalog, root);
  expect(mock).toHaveBeenCalledTimes(3);
  expect(output.referenceEntryIds).toEqual(['fluid', 'orbit', 'tilt']);
  expect(output.selectionDiversity).toMatchObject({ reselected: true, keptOriginal: true });
});

it('also preserves explicitly named references during reselection without requiring a sidebar confirmation', async () => {
  const root = await rootDir(); const store = new SelectionHistoryStore(root);
  for (const pageKey of ['old-one', 'old-two']) await store.record({ pageKey, purpose: '旧页面', referenceEntryIds: ['fluid', 'orbit'], mainVisuals: visuals });
  const { mock } = mockResults([result(), result(alternative)]);
  const output = await generateDesignPrompt(model, { ...request, brief: '制作课程助手，使用 Liquid Fluid，强动效' }, entries, root);
  expect(mock).toHaveBeenCalledTimes(2);
  expect(output.referenceEntryIds).toEqual(['fluid', 'orbit']);
  expect(output.selectionDiversity).toMatchObject({ reselected: true, keptOriginal: true });
});

it('does not call a model or save history for an already stopped request', async () => {
  const root = await rootDir(); const { mock } = mockResults([]);
  const controller = new AbortController(); controller.abort();
  await expect(generateDesignPrompt(model, request, entries, root, { signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' });
  expect(mock).not.toHaveBeenCalled();
  expect(await new SelectionHistoryStore(root).list()).toEqual([]);
});
