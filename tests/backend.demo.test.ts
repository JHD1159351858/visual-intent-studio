import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { Server } from 'node:http';
import { createApp } from '../server/app';
import type { CozeConfig } from '../server/coze';
import type { ModelConfig } from '../server/model';
import type { CatalogEntry, DemoRequest, DemoResult } from '../shared/types';
import type { ComponentImplementation, PageRecipe } from '../shared/design-library';

const config: CozeConfig = { provider: 'coze', baseUrl: 'https://api.coze.cn', name: 'Coze', apiKey: 'server-only-secret', botId: '123' };
const entries: CatalogEntry[] = [
  { id: 'glass', name: 'GlassSurface', title: '玻璃卡片', stage: 'style', description: '保留内部的磨砂透明玻璃', aliases: ['玻璃'], trigger: '持续', placements: ['卡片'], tags: ['透明'], sourceId: 'reactbits', sourceUrl: 'https://reactbits.dev/components/glass-surface', preview: { type: 'video', url: '/media/glass.webm', verified: true, provenance: 'source-recording' }, status: 'ready', updatedAt: '' },
  { id: 'gradient', name: 'BackgroundGradient', title: '流动渐变光晕', stage: 'style', description: '缓慢流动的彩色边缘与背景光晕', aliases: ['边缘光'], trigger: '持续', placements: ['卡片'], tags: ['渐变'], sourceId: 'aceternity', sourceUrl: 'https://ui.aceternity.com/components/background-gradient', implementationUrl: 'https://ui.aceternity.com/registry/background-gradient.json', preview: { type: 'video', url: '/media/gradient.webm', verified: true, provenance: 'reference-recording' }, status: 'ready', updatedAt: '' },
];
const request: DemoRequest = { task: 'generate_demo', brief: '一个智能体工具首页，功能卡片是玻璃，边缘有渐变流光', selections: [
  { entryId: 'glass', stage: 'style', placement: '功能卡片', adjustments: '', target: 'agent-card', layer: 'surface', preserve: ['卡片内容'] },
  { entryId: 'gradient', stage: 'style', placement: '功能卡片', adjustments: '只添加边缘', target: 'agent-card', layer: 'border', operation: 'add', preserve: ['玻璃内部'] },
], messages: [{ role: 'user', content: '三个工具分别用于写作、总结和翻译' }] };
const ready = (): DemoResult => ({ status: 'ready', message: '已保留玻璃内部，叠加渐变边框。', pagePlan: { summary: '智能体工具首页', features: ['三个工具入口'], layout: '三张功能卡片', visualStyle: '磨砂玻璃', effects: entries.map((entry, index) => ({ target: 'agent-card', layer: index ? 'border' : 'surface', behavior: index ? '缓慢流动渐变边缘' : '透明玻璃表面', referenceEntryId: entry.id, adaptation: '原生 HTML/CSS 适配，未集成来源组件', preserve: ['玻璃内部', '卡片内容'] })), assumptions: [] }, html: '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>智能体工具</title><style>.card{background:#fff4}button{cursor:pointer}</style></head><body><main id="agent-card" class="card"><h1>写作助手</h1><button id="open">开始使用</button></main><script>document.getElementById("open").onclick=()=>{document.querySelector("h1").textContent="已开始"}</script></body></html>', developerPrompt: '实现三张智能体工具卡片，保留玻璃表面，仅边框叠加缓慢流动的彩色渐变。原生 HTML/CSS 适配参考效果。' });
const frame = (event: string, data: unknown) => `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
const answer = (content: string) => ({ id: 'answer', role: 'assistant', type: 'answer', content_type: 'text', content });
const end = (value: unknown) => frame('conversation.message.completed', answer(typeof value === 'string' ? value : JSON.stringify(value))) + frame('conversation.chat.completed', { status: 'completed' });
const stream = (value: string) => new Response(value, { headers: { 'Content-Type': 'text/event-stream' } });
const frames = (value: string): any[] => value.trim().split(/\r?\n\r?\n/).map(part => JSON.parse(part.replace(/^data:\s*/, '')));
const nativeFetch = globalThis.fetch;
const cleanup: { server: Server; dir: string }[] = [];
afterEach(async () => {
  vi.restoreAllMocks(); vi.unstubAllGlobals();
  for (const item of cleanup.splice(0)) { item.server.closeAllConnections(); await new Promise<void>(resolve => item.server.close(() => resolve())); await rm(item.dir, { recursive: true, force: true }); }
});
async function start(model: ModelConfig | null = config, catalog: CatalogEntry[] = entries) {
  const dir = await mkdtemp(path.join(tmpdir(), 'visual-demo-'));
  await mkdir(path.join(dir, 'data'));
  await writeFile(path.join(dir, 'data/catalog.seed.json'), JSON.stringify(catalog));
  const server = createApp({ rootDir: dir, model }).listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  cleanup.push({ server, dir });
  const address = server.address(); if (!address || typeof address === 'string') throw Error('No server address');
  return (body: unknown = request) => nativeFetch(`http://127.0.0.1:${address.port}/api/demo/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}

describe('generated HTML demo stream', () => {
  it('streams a readable message before final HTML and keeps the scoped selected references and latest dialog in context', async () => {
    let upstream!: ReadableStreamDefaultController<Uint8Array>; let sent = '';
    const encoder = new TextEncoder();
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => {
      sent = String(init.body);
      return new Response(new ReadableStream({ start(controller) { upstream = controller; controller.enqueue(encoder.encode(frame('conversation.message.delta', answer('{"message":"保留玻璃')))); } }), { headers: { 'Content-Type': 'text/event-stream' } });
    }));
    const response = await (await start())();
    expect(response.headers.get('content-type')).toContain('text/event-stream');
    const reader = response.body!.getReader();
    expect(frames(new TextDecoder().decode((await reader.read()).value))).toContainEqual({ type: 'message', content: '保留玻璃' });
    upstream.enqueue(encoder.encode(end(ready()))); upstream.close();
    let output = ''; for (;;) { const chunk = await reader.read(); if (chunk.done) break; output += new TextDecoder().decode(chunk.value); }
    const result = frames(output).at(-1);
    expect(result).toMatchObject({ type: 'result', result: { status: 'ready', pagePlan: { effects: [{ referenceEntryId: 'glass', layer: 'surface' }, { referenceEntryId: 'gradient', layer: 'border' }] } } });
    expect(result.result.html).toContain('Content-Security-Policy');
    expect(result.result.html).toContain("connect-src 'none'");
    expect(result.result.html).toContain('id="agent-card"');
    expect(sent).toContain('三个工具分别用于写作、总结和翻译');
    expect(sent).toContain('玻璃内部'); expect(sent).toContain('surface'); expect(sent).toContain('border');
    expect(sent).not.toContain('server-only-secret');
  });
  it('uses ready local reference metadata when generating directly from a fuzzy brief without selections', async () => {
    let sent = '';
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { sent = String(init.body); return stream(end(ready())); }));
    const output = frames(await (await (await start())({ ...request, selections: [] })).text());
    expect(output.at(-1)).toMatchObject({ type: 'result', result: { status: 'ready' } });
    expect(sent).toContain('GlassSurface'); expect(sent).toContain('BackgroundGradient'); expect(sent).toContain('assumptions');
    expect(output.at(-1).result.pagePlan.assumptions.join(' ')).toContain('未确认');
  });
  it('injects a complete relevant page and scoped native code into the real model request contract', async () => {
    const call = await start(); const root = cleanup.at(-1)!.dir;
    const components: ComponentImplementation[] = entries.map((entry, index) => ({ id: `native-${entry.id}`, title: entry.title, entryId: entry.id, sourceUrl: entry.sourceUrl, description: entry.description, layer: index ? 'border' : 'surface', parameters: { radius: '18px', duration: '15s' }, compatibleWith: [], conflicts: ['边缘不得覆盖内部表面'], mobileBehavior: '触屏保持可用', reducedMotion: '停止动画', limitations: ['原生适配'], code: { html: `<div class="native-${entry.id}">卡片</div>`, css: `.native-${entry.id}{border-radius:18px}`, js: '' }, htmlPath: `design-library/components/${entry.id}.html`, posterPath: `design-library/previews/${entry.id}.png` }));
    const page: PageRecipe = { id: 'agent-portal', title: '工具门户范例', description: '完整工具首页', aliases: ['工具首页'], purpose: '智能体工具导航与任务入口', features: ['筛选工具'], sections: [{ id: 'agent-card', title: '工具区域', purpose: '操作入口' }], tokens: { colors: { background: '#f4f7f8' }, fonts: { body: 'system-ui' }, spacing: [8, 16, 24], radius: 18 }, interactions: [{ name: '筛选', trigger: '输入关键词', result: '更新工具列表' }], componentIds: components.map(item => item.id), referenceEntryIds: entries.map(item => item.id), pairingRules: ['surface 保留玻璃，border 只添加边缘'], htmlPath: 'design-library/pages/agent-portal.html', posterPath: 'design-library/previews/agent-portal.png' };
    await mkdir(path.dirname(path.join(root, page.htmlPath)), { recursive: true });
    await writeFile(path.join(root, page.htmlPath), ready().html);
    await writeFile(path.join(root, 'data/design-pages.json'), JSON.stringify([page]));
    await writeFile(path.join(root, 'data/design-components.json'), JSON.stringify(components));
    let context: any;
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { context = JSON.parse(JSON.parse(String(init.body)).additional_messages[0].content.split('待分析资料：\n')[1]); return stream(end(ready())); }));
    const output = frames(await (await call(request)).text());
    expect(output.at(-1).type).toBe('result');
    expect(context.designBasis.selectedRecipe).toMatchObject({ id: page.id, html: ready().html, tokens: page.tokens });
    expect(context.designBasis.nativeImplementations.map((item: any) => [item.entryId, item.layer, item.code.css])).toEqual(components.map(item => [item.entryId, item.layer, item.code.css]));
    expect(context.designBasis.referenceEntryIds).toEqual(['glass', 'gradient']);
    expect(context.confirmedSelections.map((item: any) => item.layer)).toEqual(['surface', 'border']);
    expect(JSON.stringify(context)).not.toContain('server-only-secret');
  });
  it('maps human-readable selection targets to stable DOM ids without losing the selected scope', async () => {
    const value = ready(); value.pagePlan!.effects.forEach(effect => { effect.selectionTarget = '功能卡片'; });
    let context: any;
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { context = JSON.parse(JSON.parse(String(init.body)).additional_messages[0].content.split('待分析资料：\n')[1]); return stream(end(value)); }));
    const response = await (await start())({ ...request, selections: request.selections.map(selection => ({ ...selection, target: undefined, placement: '功能卡片' })) });
    expect(frames(await response.text()).at(-1)).toMatchObject({ type: 'result', result: { pagePlan: { effects: [{ target: 'agent-card', selectionTarget: '功能卡片' }, { target: 'agent-card', selectionTarget: '功能卡片' }] } } });
    expect(context.confirmedSelections.map((selection: any) => [selection.target, selection.layer])).toEqual([['功能卡片', 'surface'], ['功能卡片', 'border']]);
  });
  it('does not satisfy the same reference on two different targets with a single effect', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(ready()))));
    const response = await (await start())({ ...request, selections: [request.selections[0], { ...request.selections[0], target: '按钮' }] });
    expect(frames(await response.text()).at(-1)).toMatchObject({ type: 'error', code: 'DEMO_SELECTION_MISSING' });
  });
  it('sends previous HTML, plan and the precise change request when revising', async () => {
    let sent = '';
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { sent = String(init.body); return stream(end(ready())); }));
    const response = await (await start())({ ...request, task: 'revise_demo', previous: ready(), changeRequest: '只把边缘流光慢一点，保留卡片内部和文案' });
    expect(frames(await response.text()).at(-1).type).toBe('result');
    expect(sent).toContain('previousHtml'); expect(sent).toContain('previousPagePlan');
    const content = JSON.parse(sent).additional_messages[0].content;
    const context = JSON.parse(content.split('待分析资料：\n')[1]);
    expect(context.previousHtml).toBe(ready().html); expect(context.changeRequest).toBe('只把边缘流光慢一点，保留卡片内部和文案');
  });
  it('rejects a revision without a complete previous page before calling a model', async () => {
    const upstream = vi.fn(); vi.stubGlobal('fetch', upstream);
    const response = await (await start())({ ...request, task: 'revise_demo', changeRequest: '改慢一点' });
    expect(response.status).toBe(400); expect(await response.json()).toMatchObject({ code: 'DEMO_PREVIOUS_REQUIRED' });
    expect(upstream).not.toHaveBeenCalled();
  });
  it('reports missing model configuration without fabricating a fallback page', async () => {
    const response = await (await start(null))();
    expect(response.status).toBe(503); expect(await response.json()).toMatchObject({ code: 'MODEL_NOT_CONFIGURED' });
  });
  it.each(['unknown-id', 'missing-dom', 'not-complete-html', 'external-script', 'external-image', 'meta-refresh', 'external-css', 'malformed-json', 'upstream-error'])('never sends an HTML result after %s', async failure => {
    const value = ready();
    if (failure === 'unknown-id') value.pagePlan!.effects[0].referenceEntryId = 'invented';
    if (failure === 'missing-dom') value.pagePlan!.effects[0].target = 'missing-target';
    if (failure === 'not-complete-html') value.html = '<div id="agent-card">片段</div>';
    if (failure === 'external-script') value.html = value.html.replace('</head>', '<script src="https://evil.example/run.js"></script></head>');
    if (failure === 'external-image') value.html = value.html.replace('</body>', '<img src="https://evil.example/pixel"></body>');
    if (failure === 'meta-refresh') value.html = value.html.replace('</head>', '<meta http-equiv="refresh" content="0;url=https://evil.example"></head>');
    if (failure === 'external-css') value.html = value.html.replace('</head>', '<style>@import "https://evil.example/font.css";</style></head>');
    vi.stubGlobal('fetch', vi.fn(async () => stream(failure === 'upstream-error' ? frame('error', { message: 'server-only-secret unsafe raw error' }) : end(failure === 'malformed-json' ? 'invalid json' : value))));
    const response = await (await start())();
    const output = await response.text();
    expect(frames(output).some(value => value.type === 'result')).toBe(false);
    expect(frames(output).at(-1)).toMatchObject({ type: 'error' });
    expect(output).not.toMatch(/server-only-secret|unsafe raw error|evil.example/);
  });
  it('accepts a single clarification without a contradictory page or prompt', async () => {
    const value: DemoResult = { status: 'needs_clarification', message: '三个工具希望面向哪类用户？', pagePlan: null, html: '', developerPrompt: '' };
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(value))));
    expect(frames(await (await (await start())()).text()).at(-1)).toEqual({ type: 'result', result: value });
  });
  it.each(['}', '\n}', '\r\n}'])('accepts a complete result with exactly one extra trailing closing object brace %j', async suffix => {
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(JSON.stringify(ready()) + suffix))));
    expect(frames(await (await (await start())()).text()).at(-1)).toMatchObject({ type: 'result', result: { status: 'ready' } });
  });
  it.each(['truncated', 'multiple-extra-braces', 'trailing-prose'])('does not salvage %s model JSON', async failure => {
    const content = JSON.stringify(ready());
    const invalid = failure === 'truncated' ? content.slice(0, -1) : failure === 'multiple-extra-braces' ? content + '}}' : content + ' 页面已生成';
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(invalid))));
    expect(frames(await (await (await start())()).text()).at(-1)).toMatchObject({ type: 'error', code: 'MODEL_INVALID_RESPONSE' });
  });
  it('permits an explicit removal during revision without requiring the removed confirmed effect', async () => {
    const value = ready(); value.pagePlan!.effects = value.pagePlan!.effects.slice(0, 1);
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(value))));
    const output = frames(await (await (await start())({ ...request, task: 'revise_demo', previous: ready(), changeRequest: '移除渐变边框，其他保留' })).text());
    expect(output.at(-1)).toMatchObject({ type: 'result', result: { status: 'ready', pagePlan: { effects: [{ referenceEntryId: 'glass' }] } } });
  });
  it('rejects accidental loss of glass when the only requested revision slows the border', async () => {
    const value = ready(); value.pagePlan!.effects = value.pagePlan!.effects.slice(1);
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(value))));
    const output = frames(await (await (await start())({ ...request, task: 'revise_demo', previous: ready(), changeRequest: '只把边框流光速度减半，保留玻璃内部' })).text());
    expect(output.at(-1)).toMatchObject({ type: 'error', code: 'DEMO_SELECTION_MISSING' });
  });
  it('allows removing only the named border while retaining unrelated glass scope', async () => {
    const value = ready(); value.pagePlan!.effects = value.pagePlan!.effects.slice(0, 1);
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(value))));
    const call = await start();
    const body = { ...request, task: 'revise_demo', previous: ready(), changeRequest: '去掉渐变边框，保留玻璃' };
    expect(frames(await (await call(body)).text()).at(-1)).toMatchObject({ type: 'result', result: { status: 'ready' } });
    value.pagePlan!.effects = [];
    expect(frames(await (await call(body)).text()).at(-1)).toMatchObject({ type: 'error', code: 'DEMO_SELECTION_MISSING' });
  });
  it('removes only the gradient reference when a different border effect shares the same target and layer', async () => {
    const beam: CatalogEntry = { ...entries[1], id: 'beam', name: 'BorderBeam', title: '边框光束', description: '短光束沿边框路径移动', aliases: ['短光束'], sourceUrl: 'https://reference.example/border-beam' };
    const previous = ready(); previous.pagePlan!.effects.push({ target: 'agent-card', layer: 'border', behavior: '短光束沿边框路径移动', referenceEntryId: 'beam', adaptation: '原生 HTML 适配', preserve: ['玻璃内部'] });
    const value = ready(); value.pagePlan!.effects = value.pagePlan!.effects.slice(0, 1);
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(value))));
    const call = await start(config, [...entries, beam]);
    const body = { ...request, task: 'revise_demo', previous, changeRequest: '移除渐变边框，保留玻璃和短光束' };
    expect(frames(await (await call(body)).text()).at(-1)).toMatchObject({ type: 'error', code: 'DEMO_SELECTION_MISSING' });
    value.pagePlan!.effects.push(previous.pagePlan!.effects[2]);
    expect(frames(await (await call(body)).text()).at(-1)).toMatchObject({ type: 'result', result: { status: 'ready' } });
  });
  it('does not interpret a warning against deletion as authorization to remove glass', async () => {
    const value = ready(); value.pagePlan!.effects = value.pagePlan!.effects.slice(1);
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(value))));
    const output = frames(await (await (await start())({ ...request, task: 'revise_demo', previous: ready(), changeRequest: '不要删除玻璃，只把边框流光速度减半' })).text());
    expect(output.at(-1)).toMatchObject({ type: 'error', code: 'DEMO_SELECTION_MISSING' });
  });
  it('keeps pre-existing scopes even if a frontend omits them from current selections', async () => {
    const value = ready(); value.pagePlan!.effects = value.pagePlan!.effects.slice(1);
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(value))));
    const output = frames(await (await (await start())({ ...request, selections: [], task: 'revise_demo', previous: ready(), changeRequest: '慢一点' })).text());
    expect(output.at(-1)).toMatchObject({ type: 'error', code: 'DEMO_SELECTION_MISSING' });
  });
  it('rejects an unavailable selected reference before a revision is sent upstream', async () => {
    const upstream = vi.fn(); vi.stubGlobal('fetch', upstream);
    const response = await (await start())({ ...request, selections: [{ ...request.selections[0], entryId: 'invented' }], task: 'revise_demo', previous: ready(), changeRequest: '慢一点' });
    expect(response.status).toBe(400); expect(upstream).not.toHaveBeenCalled();
  });
  it('rejects a plan whose target has ambiguous duplicate DOM ids', async () => {
    const value = ready(); value.html = value.html.replace('</body>', '<div id="agent-card">重复对象</div></body>');
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(value))));
    expect(frames(await (await (await start())()).text()).at(-1)).toMatchObject({ type: 'error', code: 'DEMO_INVALID_TARGET' });
  });
  it('allows self-contained CSS data images and fragments without rejecting them as external dependencies', async () => {
    const value = ready(); value.html = value.html.replace('.card{background:#fff4}', '.card{background:url("data:image/png;base64,AA==");filter:url(#glass)}');
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(value))));
    expect(frames(await (await (await start())()).text()).at(-1)).toMatchObject({ type: 'result', result: { status: 'ready' } });
  });
  it('rejects a contradictory clarification that includes an HTML page', async () => {
    const value = ready(); value.status = 'needs_clarification';
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(value))));
    expect(frames(await (await (await start())()).text()).at(-1)).toMatchObject({ type: 'error', code: 'MODEL_INVALID_RESPONSE' });
  });
  it('repairs an invalid classic script once and validates the repaired result without executing it', async () => {
    const broken = ready(); broken.html = broken.html.replace('<script>', "<script>const result='line one\nline two';");
    const valid = ready(); valid.html = valid.html.replace('<script>', '<script>throw new Error("Syntax validation must not execute generated JS");');
    let calls = 0; let correction = '';
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { calls++; if (calls === 2) correction = JSON.parse(String(init.body)).additional_messages[0].content; return stream(end(calls === 1 ? broken : valid)); }));
    const output = frames(await (await (await start())()).text());
    expect(calls).toBe(2); expect(output).toContainEqual({ type: 'message', content: '正在校验并修正页面…' });
    expect(output.at(-1)).toMatchObject({ type: 'result', result: { status: 'ready' } });
    expect(correction).toContain('DEMO_INVALID_SCRIPT'); expect(correction).toContain('previousAttempt');
    expect(correction).toContain('玻璃内部'); expect(correction).toContain('三个工具分别用于写作、总结和翻译');
  });
  it('ends with a safe error and no page when both script validation attempts fail', async () => {
    const broken = ready(); broken.html = broken.html.replace('<script>', "<script>const result='line one\nline two';");
    const upstream = vi.fn(async () => stream(end(broken))); vi.stubGlobal('fetch', upstream);
    const output = frames(await (await (await start())()).text());
    expect(upstream).toHaveBeenCalledTimes(2); expect(output.at(-1)).toMatchObject({ type: 'error', code: 'DEMO_INVALID_SCRIPT' });
    expect(output.some(event => event.type === 'result')).toBe(false); expect(JSON.stringify(output)).not.toContain('line one');
  });
  it('rejects a previous page with invalid script before contacting the model', async () => {
    const broken = ready(); broken.html = broken.html.replace('<script>', '<script>const = ;');
    const upstream = vi.fn(); vi.stubGlobal('fetch', upstream);
    const response = await (await start())({ ...request, task: 'revise_demo', previous: broken, changeRequest: '改慢一点' });
    expect(response.status).toBe(502); expect(await response.json()).toMatchObject({ code: 'DEMO_INVALID_SCRIPT' }); expect(upstream).not.toHaveBeenCalled();
  });
  it.each(['http403', 'network', 'aborted'])('does not repair upstream %s failures', async failure => {
    const upstream = vi.fn(async (_url, init: RequestInit) => {
      if (failure === 'http403') return new Response('private failure', { status: 403 });
      if (failure === 'aborted') { init.signal!.throwIfAborted(); throw new DOMException('Aborted', 'AbortError'); }
      throw new Error('private network failure');
    });
    vi.stubGlobal('fetch', upstream);
    const output = frames(await (await (await start())()).text());
    expect(upstream).toHaveBeenCalledTimes(1); expect(output.at(-1)).toMatchObject({ type: 'error' });
    expect(output.some(event => event.type === 'result')).toBe(false); expect(JSON.stringify(output)).not.toContain('private');
  });
  it('gives page generation 180 seconds while producing the compatible model stream contract', async () => {
    const timeout = vi.spyOn(AbortSignal, 'timeout'); let sent = '';
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => {
      sent = String(init.body);
      return stream(`data: ${JSON.stringify({ choices: [{ delta: { content: JSON.stringify(ready()) } }] })}\n\ndata: [DONE]\n\n`);
    }));
    const output = frames(await (await (await start({ baseUrl: 'https://compatible.example/v1', name: 'model', apiKey: 'server-only-secret' }))()).text());
    expect(output.at(-1)).toMatchObject({ type: 'result', result: { status: 'ready' } });
    expect(JSON.parse(sent).stream).toBe(true); expect(timeout).toHaveBeenCalledWith(180000); expect(sent).not.toContain('server-only-secret');
  });
  it('uses an overall 300-second deadline while each Coze attempt retains its 180-second timeout', async () => {
    const timeout = vi.spyOn(AbortSignal, 'timeout'); const timers = vi.spyOn(globalThis, 'setTimeout'); let calls = 0;
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(++calls === 1 ? 'invalid json' : ready()))));
    expect(frames(await (await (await start())()).text()).at(-1)).toMatchObject({ type: 'result', result: { status: 'ready' } });
    expect(timeout.mock.calls.map(call => call[0])).toEqual([300000]);
    expect(timers.mock.calls.filter(call => call[1] === 180000)).toHaveLength(2);
  });
  it('cancels the upstream reader when the preview request disconnects', async () => {
    let signal!: AbortSignal; const cancelled = vi.fn();
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => {
      signal = init.signal!;
      return new Response(new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode(frame('conversation.message.delta', answer('{"message":"生成中')))); }, cancel: cancelled }), { headers: { 'Content-Type': 'text/event-stream' } });
    }));
    const response = await (await start())(); const reader = response.body!.getReader(); await reader.read(); await reader.cancel();
    await vi.waitFor(() => { expect(signal.aborted).toBe(true); expect(cancelled).toHaveBeenCalled(); });
  });
});
