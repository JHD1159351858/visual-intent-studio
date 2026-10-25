import { afterEach, expect, it, vi } from 'vitest';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { generateDesignPrompt } from '../server/design-prompt';
import type { CatalogEntry, DesignPromptRequest } from '../shared/types';
import type { CaseKnowledge } from '../shared/case-knowledge';
import type { ComponentImplementation } from '../shared/design-library';

const roots: string[] = [];
afterEach(async () => { vi.unstubAllGlobals(); for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }); });
const model = { baseUrl: 'https://model.example/v1', name: 'test-model', apiKey: 'server-only-test' };
const entry = (id: string): CatalogEntry => ({ id, name: id, title: id, stage: 'style', description: id + '的真实行为', aliases: [], tags: [], placements: ['首屏'], trigger: '鼠标与持续运动', sourceId: 'reactbits', sourceUrl: `https://reactbits.dev/components/${id}`, preview: { type: 'video', url: '/media/' + id + '.webm', verified: true, provenance: 'source-recording' }, status: 'ready', updatedAt: '' });
const entries = [entry('native-border'), entry('outside-local-demos')];
const knowledge = (item: CatalogEntry): CaseKnowledge => ({ entryId: item.id, sourceUrl: item.sourceUrl, basis: 'source-code', implementation: { summary: item.id + '使用独立SVG路径与局部坐标控制装饰层。', steps: ['按容器尺寸建立独立SVG路径。', '将局部指针位置映射至渐变中心。', '更新装饰层并在卸载时清理监听。'], dependencies: [], parameters: { duration: '接入建议6秒' } }, suitableFor: ['互动封面', '品牌展示'], avoidFor: ['长篇阅读正文'], layers: ['border'], limitations: ['只作用于路径描边，内部内容保持稳定。', '额外滚动联动须作为本页改造说明。'], mobile: '接入建议：触屏采用可点击入口。', reducedMotion: '接入建议：停止动态保留静态描边。', performance: '接入建议：离屏停止更新。', evidence: [{ url: item.sourceUrl, kind: 'source-code', checkedAt: '2026-10-25T00:00:00.000Z', sha256: 'a'.repeat(64) }], notes: '仅源码机制整理，未在目标工程运行。' });
const request: DesignPromptRequest = { brief: '做一个漂亮的知识页，动效特别强', selections: [], conversationId: 'knowledge-integration-test' };
async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), 'case-knowledge-integration-')); roots.push(root);
  await mkdir(path.join(root, 'data/case-knowledge'), { recursive: true });
  await writeFile(path.join(root, 'data/case-knowledge/reactbits.json'), JSON.stringify(entries.map(knowledge)));
  const native: ComponentImplementation = { id: 'moving-border', entryId: entries[0].id, sourceUrl: entries[0].sourceUrl, title: '本地边框适配', description: '本地适配补充', layer: 'border', parameters: { duration: '6s' }, compatibleWith: [], conflicts: ['保留内部表面'], mobileBehavior: '触屏可用', reducedMotion: '静态边框', limitations: ['本地适配'], code: { html: '<canvas></canvas>', css: '', js: 'privateNativeSourceMarker()' }, htmlPath: 'design-library/components/moving-border.html', posterPath: 'design-library/previews/moving-border.png' };
  await writeFile(path.join(root, 'data/design-components.json'), JSON.stringify([native]));
  return root;
}
function capture() {
  let context: any; let instruction = '';
  const fetch = vi.fn(async (_url, init: RequestInit) => {
    const sent = JSON.parse(String(init.body)); instruction = sent.messages[0].content; context = JSON.parse(sent.messages[1].content);
    const value = { developerPrompt: '请在目标工程实际实现知识查询页面，保留输入、答案与来源展示。按用户的强动效要求组织背景与主体，阅读内容保持稳定；用独立绘制层隔离视觉效果，并明确手机操作、暂停和减少动态处理，采用真实案例提供实现说明与验收。', message: '已完成', referenceEntryIds: entries.map(item => item.id), assumptions: [] };
    return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(value) } }] }), { headers: { 'Content-Type': 'application/json' } });
  });
  vi.stubGlobal('fetch', fetch);
  return { fetch, get context() { return context; }, get instruction() { return instruction; } };
}

it('gives every candidate equally structured implementation knowledge, including those outside local demos', async () => {
  const root = await fixture(); const captured = capture();
  await generateDesignPrompt(model, request, entries, root);
  expect(captured.context.availableCatalog).toHaveLength(2);
  for (const item of captured.context.availableCatalog) {
    expect(item.implementationKnowledge).toMatchObject({ basis: 'source-code', layers: ['border'], scenes: ['互动封面', '品牌展示'] });
    expect(item.implementationKnowledge.method).toContain(item.id);
    expect(item.implementationKnowledge.steps.length).toBeGreaterThan(0);
    expect(item.implementationKnowledge.limits.length).toBeGreaterThan(0);
  }
  expect(captured.context.visualEffectOptions).toEqual([]);
  expect(JSON.stringify(captured.context)).not.toContain('privateNativeSourceMarker');
});

it('keeps a confirmed local adaptation as a scoped supplement without promoting it as the whole library', async () => {
  const root = await fixture(); const captured = capture();
  await generateDesignPrompt(model, { ...request, selections: [{ entryId: entries[0].id, stage: 'style', placement: '提问卡片', target: '提问卡片', layer: 'border', adjustments: '只改边缘', preserve: ['玻璃内部'] }] }, entries, root);
  expect(captured.context.visualEffectOptions).toHaveLength(1);
  expect(captured.context.visualEffectOptions[0]).toMatchObject({ entryId: entries[0].id, layer: 'border' });
  expect(captured.context.availableCatalog[1].implementationKnowledge.method).toContain(entries[1].id);
});

it('stops before contacting the model when knowledge points to another source', async () => {
  const root = await fixture(); const captured = capture();
  await writeFile(path.join(root, 'data/case-knowledge/reactbits.json'), JSON.stringify([{ ...knowledge(entries[0]), sourceUrl: entries[1].sourceUrl }]));
  await expect(generateDesignPrompt(model, request, entries, root)).rejects.toMatchObject({ code: 'CASE_KNOWLEDGE_INVALID' });
  expect(captured.fetch).not.toHaveBeenCalled();
});

it('keeps still-mode constraints when complete implementation knowledge is available', async () => {
  const root = await fixture(); const captured = capture();
  await generateDesignPrompt(model, { ...request, brief: '知识查询页，纯静态，不要动画' }, entries, root);
  expect(captured.context.visualIntent.intensity).toBe('still');
  expect(captured.context.visualEffectOptions).toEqual([]);
  expect(captured.instruction).toContain('纯静态');
  expect(captured.context.availableCatalog.every((item: any) => item.implementationKnowledge)).toBe(true);
});

it('includes knowledge for all 350 release cases in the production request without executing an external model', async () => {
  const root = process.cwd(); const catalog: CatalogEntry[] = JSON.parse(await readFile(path.join(root, 'data/catalog.json'), 'utf8'));
  let context: any;
  const fetch = vi.fn(async (_url, init: RequestInit) => { context = JSON.parse(JSON.parse(String(init.body)).messages[1].content); throw Error('INSPECT_ONLY_NO_EXTERNAL_CALL'); });
  vi.stubGlobal('fetch', fetch);
  await expect(generateDesignPrompt(model, { ...request, conversationId: 'inspect-case-knowledge-only' }, catalog, root)).rejects.toThrow();
  expect(fetch).toHaveBeenCalledOnce();
  expect(context.availableCatalog).toHaveLength(350);
  expect(context.availableCatalog.every((item: any) => item.implementationKnowledge?.method && item.implementationKnowledge?.scenes.length && item.implementationKnowledge?.limits.length)).toBe(true);
  expect(context.visualEffectOptions).toEqual([]);
  expect(JSON.stringify(context).length).toBeLessThan(800000);
});
