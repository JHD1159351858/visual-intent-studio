import { afterEach, expect, it, vi } from 'vitest';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { generateDesignPrompt } from '../server/design-prompt';
import type { CatalogEntry, DesignPromptRequest } from '../shared/types';
import type { CaseKnowledge } from '../shared/case-knowledge';
import { SelectionHistoryStore } from '../server/selection-history';
import { createApp } from '../server/app';

const roots: string[] = [];
afterEach(async () => { vi.unstubAllGlobals(); for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }); });
const config = { provider: 'deepseek' as const, baseUrl: 'https://api.deepseek.com', name: 'deepseek-flash', apiKey: 'private-test-key' };
const entry = (id: string, name: string, description: string): CatalogEntry => ({ id, name, title: name, description, stage: 'style', sourceId: 'reactbits', sourceUrl: `https://reactbits.dev/backgrounds/${id}`, aliases: [name], tags: [], trigger: '持续与指针', placements: ['首屏'], preview: { type: 'video', url: `/media/${id}.webm`, verified: true, provenance: 'source-recording' }, status: 'ready', updatedAt: '' });
const entries = [entry('fluid', '流体背景', '液体流动形成主视觉'), entry('grid', '扫描网格', '几何网格扫描，不使用流体'), entry('tilt', '立体卡片', '鼠标改变卡面倾斜')];
const row = (item: CatalogEntry): CaseKnowledge => ({ entryId: item.id, sourceUrl: item.sourceUrl, basis: 'source-code', implementation: { summary: item.name + '的真实实现方法，配合独立绘制层保留内容。', steps: ['初始化独立容器和局部状态。', '根据输入更新本条视觉对象。', '卸载时清理本实例动画与监听。'], dependencies: [], parameters: { marker: 'DETAIL_ONLY_' + item.id } }, suitableFor: ['主题首屏', '装饰展示'], avoidFor: ['稳定正文'], layers: ['page-background'], limitations: ['保持输入内容独立。', '按容器能力降级。'], mobile: '项目建议：减少装饰元素并保留入口。', reducedMotion: '项目建议：暂停持续动画，显示静态特色。', performance: '项目建议：离屏停止更新并清理实例。', evidence: [{ url: item.sourceUrl, kind: 'registry', checkedAt: '2026-10-25T00:00:00.000Z', sha256: 'a'.repeat(64) }], notes: '仅静态源码整理，未执行组件。' });
const request: DesignPromptRequest = { brief: '做一个数字实验室页面，强动效，支持问题输入和资料查看', selections: [], conversationId: 'reference-agent-test' };
const answer = (ids: string[]) => ({ developerPrompt: '请在目标工程实际实现数字实验室页面，保留问题输入、资料查看和结果阅读流程。首屏用贴合主题的动态主视觉建立空间层次，正文与公式保持稳定；适配手机操作、加载与错误状态，提供暂停入口和减少动态处理，并逐项核对视觉行为与功能入口。', message: '完成', referenceEntryIds: ids, assumptions: [] });
async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), 'reference-agent-')); roots.push(root);
  await mkdir(path.join(root, 'data/case-knowledge'), { recursive: true });
  await writeFile(path.join(root, 'data/case-knowledge/reactbits.json'), JSON.stringify(entries.map(row)));
  return root;
}
const completion = (content: string | null, tool_calls?: unknown[]) => new Response(JSON.stringify({ choices: [{ message: { role: 'assistant', content, reasoning_content: 'DO_NOT_SHOW_THINKING', ...(tool_calls ? { tool_calls } : {}) }, finish_reason: tool_calls ? 'tool_calls' : 'stop' }] }), { headers: { 'Content-Type': 'application/json' } });
const call = (id: string, name: string, args: unknown) => ({ id, type: 'function', function: { name, arguments: JSON.stringify(args) } });
const lastResult = (body: any) => JSON.parse([...body.messages].reverse().find((item: any) => item.role === 'tool').content);

it('lets DeepSeek actually search, read, change its query, read again and synthesize without bulk injection', async () => {
  const root = await fixture(); const requests: any[] = []; let round = 0; const refs: string[] = []; const onMessage = vi.fn();
  vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => {
    const body = JSON.parse(String(init.body)); requests.push(body); round++;
    if (round === 1) return completion(null, [call('s1', 'search_reference_library', { query: '流体背景', limit: 1 })]);
    if (round === 2) { refs.push(lastResult(body).candidates[0].refKey); return completion(null, [call('d1', 'get_reference_details', { refKeys: [refs[0]] })]); }
    if (round === 3) { expect(lastResult(body).availableCatalog[0].implementationKnowledge.implementation.parameters.marker).toBe('DETAIL_ONLY_fluid'); return completion(null, [call('s2', 'search_reference_library', { query: '扫描网格', limit: 1, excludeRefKeys: refs })]); }
    if (round === 4) { refs.push(lastResult(body).candidates[0].refKey); return completion(null, [call('d2', 'get_reference_details', { refKeys: [refs[1]] })]); }
    return completion(JSON.stringify(answer(refs)));
  }));
  const result = await generateDesignPrompt(config, request, entries, root, { onMessage });
  const initial = JSON.parse(requests[0].messages[1].content);
  expect(initial.availableCatalog).toEqual([]);
  expect(initial.referenceLibrary.catalogCount).toBe(3);
  expect(requests[0].tools.map((item: any) => item.function.name).sort()).toEqual(['get_reference_details', 'search_reference_library']);
  expect(JSON.stringify(requests[0])).not.toContain('DETAIL_ONLY_');
  expect(result.referenceEntryIds).toEqual(['fluid', 'grid']);
  expect(requests).toHaveLength(5);
  expect(JSON.stringify(onMessage.mock.calls)).not.toContain('DO_NOT_SHOW_THINKING');
  expect(await new SelectionHistoryStore(root).list()).toHaveLength(1);
});

it('delivers real tool progress and the validated final result through the local streaming API', async () => {
  const root = await fixture(); const clientFetch = globalThis.fetch; let round = 0;
  await writeFile(path.join(root, 'data/catalog.seed.json'), JSON.stringify(entries));
  vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => {
    const body = JSON.parse(String(init.body)); round++;
    if (round === 1) return completion(null, [call('s', 'search_reference_library', { query: '流体背景', limit: 1 })]);
    if (round === 2) return completion(null, [call('d', 'get_reference_details', { refKeys: [lastResult(body).candidates[0].refKey] })]);
    return completion(JSON.stringify(answer([lastResult(body).availableCatalog[0].refKey])));
  }));
  const server = createApp({ rootDir: root, model: config }).listen(0, '127.0.0.1');
  try {
    await new Promise<void>(resolve => server.once('listening', resolve));
    const port = (server.address() as { port: number }).port;
    const response = await clientFetch(`http://127.0.0.1:${port}/api/design-prompt/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) });
    const text = await response.text();
    const events = text.trim().split(/\r?\n\r?\n/).map(frame => JSON.parse(frame.replace(/^data:\s*/, '')));
    expect(response.status).toBe(200);
    expect(events.some(event => event.type === 'message' && event.content.includes('正在搜索全部3条参考'))).toBe(true);
    expect(events.some(event => event.type === 'message' && event.content.includes('正在读取1条参考详情'))).toBe(true);
    expect(events.at(-1)).toMatchObject({ type: 'result', result: { referenceEntryIds: ['fluid'] } });
    expect(text).not.toMatch(/DO_NOT_SHOW_THINKING|private-test-key/);
  } finally {
    server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve()));
  }
});

it('rejects a real but unread case instead of accepting a guessed case ID', async () => {
  const root = await fixture();
  vi.stubGlobal('fetch', vi.fn(async () => completion(JSON.stringify(answer(['fluid'])))));
  await expect(generateDesignPrompt(config, request, entries, root)).rejects.toMatchObject({ code: 'MODEL_REFERENCE_NOT_READ' });
  expect(await new SelectionHistoryStore(root).list()).toEqual([]);
});

it('keeps confirmed references and their scopes available even when only already-confirmed material is needed', async () => {
  const root = await fixture(); let initial: any;
  vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { initial = JSON.parse(JSON.parse(String(init.body)).messages[1].content); return completion(JSON.stringify(answer(['fluid']))); }));
  const selections = [{ entryId: 'fluid', stage: 'style' as const, placement: '首屏背景', target: '首屏背景', layer: 'page-background' as const, adjustments: '保持用途', preserve: ['输入和正文'] }];
  const result = await generateDesignPrompt(config, { ...request, selections }, entries, root);
  expect(initial.availableCatalog.map((item: any) => item.id)).toEqual(['fluid']);
  expect(initial.availableCatalog[0].implementationKnowledge.implementation.parameters.marker).toBe('DETAIL_ONLY_fluid');
  expect(result.referenceEntryIds).toEqual(['fluid']);
  expect(result.developerPrompt).toContain('输入和正文');
});

it('does not consider search hits read until the model asks for their details', async () => {
  const root = await fixture(); let round = 0;
  vi.stubGlobal('fetch', vi.fn(async () => ++round === 1 ? completion(null, [call('s', 'search_reference_library', { query: '流体背景', limit: 1 })]) : completion(JSON.stringify(answer(['fluid'])))));
  await expect(generateDesignPrompt(config, request, entries, root)).rejects.toMatchObject({ code: 'MODEL_REFERENCE_NOT_READ' });
});

it('preloads positive user names but not rejected names or old assistant suggestions', async () => {
  const root = await fixture(); let initial: any;
  vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { initial = JSON.parse(JSON.parse(String(init.body)).messages[1].content); return completion(JSON.stringify(answer(['fluid']))); }));
  await generateDesignPrompt(config, { ...request, brief: '使用流体背景，不要用扫描网格', messages: [{ role: 'assistant', content: '建议使用立体卡片' }] }, entries, root);
  expect(initial.availableCatalog.map((item: any) => item.id)).toEqual(['fluid']);
  expect(initial.referenceLibrary.catalogCount).toBe(3);
});

it('rejects unread main-visual references even if the adopted reference list is valid', async () => {
  const root = await fixture();
  vi.stubGlobal('fetch', vi.fn(async () => completion(JSON.stringify({ ...answer(['fluid']), mainVisuals: [{ role: 'hero', family: 'pointer-tilt', entryIds: ['tilt'], description: '指针改变卡片倾斜' }] }))));
  await expect(generateDesignPrompt(config, { ...request, brief: '使用流体背景' }, entries, root)).rejects.toMatchObject({ code: 'MODEL_REFERENCE_NOT_READ' });
  expect(await new SelectionHistoryStore(root).list()).toEqual([]);
});

it('allows a deliberate independent design without forcing unsuitable references', async () => {
  const root = await fixture();
  vi.stubGlobal('fetch', vi.fn(async () => completion(JSON.stringify(answer([])))));
  const result = await generateDesignPrompt(config, { ...request, brief: '本次只改文案，不新增参考效果，采用自主设计' }, entries, root);
  expect(result.referenceEntryIds).toEqual([]);
  expect(result.developerPrompt).not.toContain('参考来源：');
});

it('rejects read real-ID main visuals omitted from the final adopted references', async () => {
  const root = await fixture();
  vi.stubGlobal('fetch', vi.fn(async () => completion(JSON.stringify({ ...answer(['fluid']), mainVisuals: [{ role: 'background', family: 'grid-scan', entryIds: ['grid'], description: '扫描网格持续运动' }] }))));
  await expect(generateDesignPrompt(config, { ...request, brief: '使用流体背景和扫描网格' }, entries, root)).rejects.toMatchObject({ code: 'MODEL_INVALID_ID' });
  expect(await new SelectionHistoryStore(root).list()).toEqual([]);
});

it('allows a similar combination to search the entire catalog again without losing confirmed scope', async () => {
  const root = await fixture(); const primary = [
    { role: 'background' as const, family: 'fluid-flow', entryIds: ['fluid'], description: '液体背景持续流动' },
    { role: 'hero' as const, family: 'pointer-tilt', entryIds: ['tilt'], description: '首屏主题卡片随指针倾斜' },
  ];
  await new SelectionHistoryStore(root).record({ pageKey: 'previous', purpose: '音乐页面', referenceEntryIds: ['fluid', 'tilt'], mainVisuals: primary });
  await new SelectionHistoryStore(root).record({ pageKey: 'another', purpose: '运动页面', referenceEntryIds: ['fluid', 'tilt'], mainVisuals: primary });
  const contexts: any[] = []; let round = 0;
  vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => {
    const body = JSON.parse(String(init.body)); const context = JSON.parse(body.messages[1].content); contexts.push(context); round++;
    if (round === 1) return completion(null, [call('s1', 'search_reference_library', { query: '流体背景', limit: 1 })]);
    if (round === 2) return completion(null, [call('d1', 'get_reference_details', { refKeys: [lastResult(body).candidates[0].refKey] })]);
    if (round === 3) return completion(JSON.stringify({ ...answer(['fluid', 'tilt']), mainVisuals: primary }));
    if (round === 4) {
      expect(context.reselection.previousResult.referenceEntryIds).toEqual(['fluid', 'tilt']);
      expect(context.availableCatalog.map((entry: any) => entry.id)).toEqual(['tilt']);
      return completion(null, [call('s2', 'search_reference_library', { query: '扫描网格', limit: 1 })]);
    }
    if (round === 5) return completion(null, [call('d2', 'get_reference_details', { refKeys: [lastResult(body).candidates[0].refKey] })]);
    return completion(JSON.stringify({ ...answer(['grid', 'tilt']), mainVisuals: [{ ...primary[0], family: 'grid-scan', entryIds: ['grid'], description: '背景扫描线持续推进' }, primary[1]] }));
  }));
  const result = await generateDesignPrompt(config, { ...request, selections: [{ entryId: 'tilt', stage: 'style', placement: '主题卡片', target: '主题卡片', layer: 'surface', adjustments: '', preserve: ['正文'] }] }, entries, root);
  expect(contexts.every(context => context.referenceLibrary.catalogCount === 3)).toBe(true);
  expect(result.referenceEntryIds).toEqual(['grid', 'tilt']);
  expect(result.developerPrompt).toContain('正文');
  expect(result.selectionDiversity).toMatchObject({ reselected: true, keptOriginal: false, historySaved: true });
  expect((await new SelectionHistoryStore(root).list())[0].referenceEntryIds).toEqual(['grid', 'tilt']);
});

it('cancels the whole tool workflow without saving a partial design', async () => {
  const root = await fixture(); const controller = new AbortController(); let round = 0;
  vi.stubGlobal('fetch', vi.fn(async () => {
    if (++round === 1) return completion(null, [call('s', 'search_reference_library', { query: '流体背景', limit: 1 })]);
    controller.abort(); throw new DOMException('Aborted', 'AbortError');
  }));
  await expect(generateDesignPrompt(config, request, entries, root, { signal: controller.signal })).rejects.toThrow();
  expect(await new SelectionHistoryStore(root).list()).toEqual([]);
});

it('keeps the initial production request small while the complete catalog remains searchable', async () => {
  const entries: CatalogEntry[] = JSON.parse(await readFile(path.join(process.cwd(), 'data/catalog.json'), 'utf8'));
  let initial: any; let body: any;
  vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { body = JSON.parse(String(init.body)); initial = JSON.parse(body.messages[1].content); throw Error('INSPECT_ONLY'); }));
  await expect(generateDesignPrompt(config, request, entries, process.cwd())).rejects.toThrow();
  expect(initial.referenceLibrary.catalogCount).toBe(350);
  expect(initial.availableCatalog).toEqual([]);
  expect(body.messages[0].content.length + JSON.stringify(body.tools).length).toBeLessThan(5000);
  expect(initial).not.toHaveProperty('designRules');
  expect(JSON.stringify(body)).not.toContain('registry-response');
});
