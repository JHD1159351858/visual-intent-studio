import { afterEach, expect, it, vi } from 'vitest';
import type { DemoRequest, DemoResult, Selection } from '../shared/types';
import { api } from '../src/api';
import { acceptDemo, demoNeedsRefresh, reconcileDemoSelections, restoreDemo, saveDemo } from '../src/demo-session';

afterEach(() => vi.unstubAllGlobals());

const source = { brief: '做一个智能体首页', messages: [{ role: 'user' as const, content: '做一个智能体首页' }] };
const result: DemoResult = { status: 'ready', message: '页面已生成', pagePlan: { summary: '智能体首页', features: ['工具入口'], layout: '便当网格', visualStyle: '磨砂玻璃', effects: [{ target: '功能卡片', layer: 'border', behavior: '缓慢流动渐变边缘', referenceEntryId: 'gradient', adaptation: '遮罩只显示边缘', preserve: ['玻璃表面'] }], assumptions: [] }, html: '<!doctype html><html><body><button>开始</button></body></html>', developerPrompt: '保留玻璃表面，只叠加卡片渐变边缘。' };
const request: DemoRequest = { task: 'revise_demo', ...source, selections: [], previous: result, changeRequest: '只修改边缘' };
const frame = (event: unknown) => `data: ${JSON.stringify(event)}\n\n`;

it('streams readable generation progress before a complete result and sends the original page for revisions', async () => {
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const stream = new ReadableStream<Uint8Array>({ start(value) { controller = value; } });
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(stream));
  vi.stubGlobal('fetch', fetchMock);
  let notify!: () => void;
  const received = new Promise<void>(resolve => { notify = resolve; });
  const messages: string[] = [];
  let complete = false;
  const promise = api.demoStream(request, content => { messages.push(content); notify(); }).then(value => { complete = true; return value; });
  const bytes = new TextEncoder().encode(frame({ type: 'message', content: '正在保留玻璃表面' }));
  for (const byte of bytes) controller.enqueue(Uint8Array.of(byte));
  await received;
  expect(messages).toEqual(['正在保留玻璃表面']);
  expect(complete).toBe(false);
  controller.enqueue(new TextEncoder().encode(frame({ type: 'result', result })));
  controller.close();
  expect(await promise).toEqual(result);
  expect(fetchMock.mock.calls[0][0]).toBe('/api/demo/stream');
  expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual(request);
});

it('rejects incomplete generation, errors, and malformed ready pages without accepting partial HTML', async () => {
  for (const content of [frame({ type: 'message', content: '生成中' }), frame({ type: 'error', error: '模型连接中断' }), frame({ type: 'result', result: { ...result, html: '', developerPrompt: '' } }), frame({ type: 'result', result: { ...result, pagePlan: { summary: '缺少页面方案' } } })]) {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response(content)));
    await expect(api.demoStream(request, () => {})).rejects.toThrow();
  }
});

it('returns clarification without treating it as a ready page', async () => {
  const clarification: DemoResult = { status: 'needs_clarification', message: '卡片放在哪里？', pagePlan: null, html: '', developerPrompt: '' };
  vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response(frame({ type: 'result', result: clarification }))));
  expect(await api.demoStream(request, () => {})).toEqual(clarification);
  const saved = acceptDemo(null, result, source);
  expect(acceptDemo(saved, clarification, source)).toBe(saved);
});

it('restores only successful pages belonging to the current draft and increments the revision version', () => {
  const saved = acceptDemo(null, result, source)!;
  expect(saved.version).toBe(1);
  expect(restoreDemo(JSON.stringify(saved), source)).toEqual(saved);
  expect(restoreDemo(JSON.stringify(saved), { ...source, brief: '另一个项目' })).toBeNull();
  expect(restoreDemo(JSON.stringify(saved), { ...source, messages: [{ role: 'user', content: '另一份草稿' }] })).toBeNull();
  expect(restoreDemo('broken', source)).toBeNull();
  expect(acceptDemo(saved, { ...result, html: result.html.replace('开始', '打开工具') }, source)?.version).toBe(2);
});

it('reports browser storage failure without claiming the generated page was persisted', () => {
  const saved = acceptDemo(null, result, source)!;
  const storage = { setItem: vi.fn(() => { throw new Error('quota'); }), removeItem: vi.fn() };
  expect(saveDemo(storage, saved)).toBe(false);
  expect(saveDemo(storage, null)).toBe(true);
  expect(storage.removeItem).toHaveBeenCalledOnce();
});

it('removes retired confirmed effects by exact reference, object, and layer without confirming new model references', () => {
  const glass: Selection = { entryId: 'glass', stage: 'style', placement: '首页', target: '功能卡片', layer: 'surface', adjustments: '' };
  const border: Selection = { entryId: 'gradient', stage: 'style', placement: '首页', target: '功能卡片', layer: 'border', adjustments: '' };
  const buttonBorder: Selection = { ...border, target: '开始按钮' };
  const output: DemoResult = { ...result, pagePlan: { ...result.pagePlan!, effects: [{ ...result.pagePlan!.effects[0], target: 'card-tools', selectionTarget: '功能卡片', layer: 'surface', referenceEntryId: 'glass' }, { ...result.pagePlan!.effects[0], target: 'start-button', selectionTarget: '开始按钮' }, { ...result.pagePlan!.effects[0], referenceEntryId: 'new-unconfirmed' }] } };
  expect(reconcileDemoSelections([glass, border, buttonBorder], output)).toEqual([glass, buttonBorder]);
  expect(reconcileDemoSelections([border], result)).toEqual([border]);
  expect(reconcileDemoSelections([glass], { ...result, status: 'needs_clarification', pagePlan: null })).toEqual([glass]);
});

it('keeps an old page after draft edits and detects changes in full user history and scoped selections after refresh', () => {
  const selected: Selection = { entryId: 'glass', stage: 'style', placement: '首页', target: '功能卡片', layer: 'surface', adjustments: '', preserve: ['现有布局'] };
  const draft = { ...source, messages: [...source.messages, { role: 'user', content: '保留原布局' }], selections: [selected] };
  const saved = acceptDemo(null, result, draft)!;
  expect(demoNeedsRefresh(saved, draft)).toBe(false);
  expect(demoNeedsRefresh(saved, { ...draft, messages: [...draft.messages, { role: 'assistant', content: '已生成' }] })).toBe(false);
  const updated = { ...draft, messages: [...draft.messages, { role: 'user', content: '去掉光晕' }] };
  const restored = restoreDemo(JSON.stringify(saved), updated);
  expect(restored?.result).toEqual(result);
  expect(demoNeedsRefresh(restored, updated)).toBe(true);
  for (const changed of [{ ...selected, target: '开始按钮' }, { ...selected, layer: 'border' as const }, { ...selected, adjustments: '变暗一点' }, { ...selected, preserve: ['现有布局', '原有功能'] }]) expect(demoNeedsRefresh(saved, { ...draft, selections: [changed] })).toBe(true);
  const legacy = { ...saved }; delete legacy.generationFingerprint;
  expect(restoreDemo(JSON.stringify(legacy), draft)?.result).toEqual(result);
  expect(demoNeedsRefresh(legacy, draft)).toBe(true);
  expect(demoNeedsRefresh(null, draft)).toBe(false);
});
