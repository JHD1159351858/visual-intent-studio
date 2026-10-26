import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { Server } from 'node:http';
import { createApp } from '../server/app';
import { recommendationText } from '../server/recommendation-text';
import type { CozeConfig } from '../server/coze';
import type { ModelConfig } from '../server/model';
import type { CatalogEntry } from '../shared/types';
import type { ComponentImplementation, PageRecipe } from '../shared/design-library';
import { withPassingDesignWorkflow } from './fixtures/design-workflow';

const config: CozeConfig = { provider: 'coze', baseUrl: 'https://api.coze.cn', name: 'Coze', apiKey: 'server-only-secret', botId: '123' };
const entries: CatalogEntry[] = [
  { id: 'glass', name: 'GlassSurface', title: '玻璃卡片', stage: 'style', description: '内部磨砂透明玻璃', aliases: ['玻璃'], trigger: '持续', placements: ['卡片'], tags: ['透明'], sourceId: 'reactbits', sourceUrl: 'https://reactbits.dev/components/glass-surface', preview: { type: 'video', url: '/media/glass.webm', verified: true, provenance: 'source-recording' }, status: 'ready', updatedAt: '' },
  { id: 'gradient', name: 'BackgroundGradient', title: '流动渐变光晕', stage: 'style', description: '缓慢彩色边缘', aliases: ['边缘光'], trigger: '持续', placements: ['卡片'], tags: ['渐变'], sourceId: 'aceternity', sourceUrl: 'https://ui.aceternity.com/components/background-gradient', preview: { type: 'video', url: '/media/gradient.webm', verified: true, provenance: 'reference-recording' }, status: 'ready', updatedAt: '' },
];
const request = { brief: '做一个学生问课程资料的页面，清爽一点', messages: [{ role: 'user', content: '手机也能看到答案来自哪里' }], selections: [
  { entryId: 'glass', stage: 'style', placement: '答案卡片', adjustments: '', target: '答案卡片', layer: 'surface', preserve: ['答案内容'] },
  { entryId: 'gradient', stage: 'style', placement: '答案卡片', adjustments: '只添加边缘', target: '答案卡片', layer: 'border', operation: 'add', preserve: ['玻璃内部'] },
] };
const ready = () => ({ message: '已整理可交给其他模型的页面开发提示词。', developerPrompt: '请实现学生课程问答工作台。主区域包含问题输入、回答与资料出处，侧边栏展示历史记录。使用 CSS Grid 响应式布局，手机收起侧栏。答案卡片内部保留磨砂玻璃，渐变仅覆盖边缘，保持正文清晰可读。演示数据必须标注演示，错误时保留输入并允许重试。', referenceEntryIds: ['glass', 'gradient'], assumptions: ['问答与资料使用演示数据，等待接入真实接口。'] });
const requirementDraft = () => ({ goal: '学生课程资料查询页', audience: '学生', features: ['查询课程资料', '查看答案出处'], visualStyle: '清爽', motion: 'balanced' as const, constraints: '手机也能看到答案出处；保留玻璃内部，仅调整边缘' });
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
  const dir = await mkdtemp(path.join(tmpdir(), 'visual-prompt-'));
  await mkdir(path.join(dir, 'data'));
  await writeFile(path.join(dir, 'data/catalog.seed.json'), JSON.stringify(catalog));
  if (model?.provider === 'deepseek') {
    await mkdir(path.join(dir, 'data/case-knowledge'));
    for (const source of ['reactbits', 'aceternity']) await writeFile(path.join(dir, 'data/case-knowledge', source + '.json'), JSON.stringify(catalog.filter(entry => entry.sourceId === source).map(entry => ({
      entryId: entry.id, sourceUrl: entry.sourceUrl, basis: 'source-code',
      implementation: { summary: entry.description, steps: ['准备独立作用层', '更新局部视觉状态', '卸载并清理实例'], dependencies: [], parameters: {} },
      suitableFor: ['重点卡片', '首屏'], avoidFor: ['覆盖正文'], layers: ['surface', 'border'], limitations: ['不遮挡文字', '不阻塞输入'],
      mobile: '触屏保持可用', reducedMotion: '减少动态时保留静态特色', performance: '离屏暂停并清理实例',
      evidence: [{ url: entry.sourceUrl, kind: 'registry', checkedAt: '2026-10-25T00:00:00.000Z' }], notes: '测试夹具',
    }))));
  }
  const server = createApp({ rootDir: dir, model }).listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve)); cleanup.push({ server, dir });
  const address = server.address(); if (!address || typeof address === 'string') throw Error('No server address');
  return (body: unknown = request, signal?: AbortSignal) => nativeFetch(`http://127.0.0.1:${address.port}/api/design-prompt/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal });
}

async function motionLibrary(root: string, sources: CatalogEntry[], oversized = false) {
  const ids = ['moving-border', 'spotlight-card', 'card-stack', 'text-reveal', 'scroll-reveal', 'glass-surface'];
  const components: ComponentImplementation[] = sources.map((source, index) => ({ id: ids[index], title: source.title, entryId: source.id, sourceUrl: source.sourceUrl, description: '可见的原生视觉适配', layer: index === 5 ? 'surface' : 'content', parameters: { duration: '8s', amplitude: '24px' }, compatibleWith: [], conflicts: ['正文和输入表面保持独立'], mobileBehavior: '触屏保持操作可见', reducedMotion: '停止动画', limitations: ['原生适配而非来源源码'], code: { html: `<article data-effect="${ids[index]}">资料</article>`, css: '.effect{animation:travel 8s linear infinite}' + (oversized ? ' '.repeat(8000) : ''), js: '' }, htmlPath: `design-library/components/${ids[index]}.html`, posterPath: `design-library/previews/${ids[index]}.png` }));
  const page: PageRecipe = { id: 'knowledge-motion', title: '强动效知识星图', description: '极光与悬浮资料卡组成的空间首屏', aliases: ['知识星图'], purpose: '知识问答与课程资料检索', features: ['提问与来源查看'], sections: [{ id: 'hero', title: '动态空间主视觉', purpose: '知识检索入口' }], tokens: { colors: { background: '#071622' }, fonts: { body: 'system-ui' }, spacing: [8, 16, 32], radius: 24 }, interactions: [{ name: '极光与资料卡', trigger: '持续与鼠标', result: '背景流动且资料卡有空间运动' }], componentIds: ids, referenceEntryIds: sources.map(source => source.id), pairingRules: ['输入与答案阅读面不承载持续位移'], htmlPath: 'design-library/pages/knowledge-motion.html', posterPath: 'design-library/previews/knowledge-motion.png' };
  const html = '<!doctype html><html><head><style>@keyframes aurora{to{transform:translateX(20px)}}</style></head><body><main data-motion="continuous">真实空间主视觉</main></body></html>';
  await mkdir(path.dirname(path.join(root, page.htmlPath)), { recursive: true });
  await writeFile(path.join(root, page.htmlPath), html);
  await writeFile(path.join(root, 'data/design-pages.json'), JSON.stringify([page]));
  await writeFile(path.join(root, 'data/design-components.json'), JSON.stringify(components));
  return { page, components, html };
}

describe('professional design prompt stream', () => {
  it('returns a validated requirement draft without changing confirmed references or their scope', async () => {
    const draft = requirementDraft(); let instruction = '';
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => {
      [instruction] = JSON.parse(String(init.body)).additional_messages[0].content.split('待分析资料：\n');
      return stream(end({ ...ready(), requirementDraft: draft }));
    }));
    const output = frames(await (await (await start())()).text());
    expect(output.at(-1)).toMatchObject({ type: 'result', result: { requirementDraft: draft, referenceEntryIds: ['glass', 'gradient'] } });
    expect(output.at(-1).result.developerPrompt).toContain('仅作用于 border');
    expect(output.at(-1).result.developerPrompt).toContain('保留：玻璃内部');
    expect(instruction).toContain('先输出 developerPrompt，再 requirementDraft');
    expect(instruction).toContain('仅整理用户明确提出的需求');
    expect(instruction).toContain('未明确的文本字段留空');
    expect(instruction).toContain('不能把草稿当作用户已确认');
    expect(instruction).not.toContain('新增未确认参考最多3个');
  });
  it('keeps old four-field results compatible and permits unknown requirement fields to remain empty', async () => {
    const call = await start();
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(ready()))));
    const oldResult = frames(await (await call()).text()).at(-1);
    expect(oldResult.type).toBe('result'); expect(oldResult.result).not.toHaveProperty('requirementDraft');
    const draft = { goal: '课程查询页面', audience: '', features: [], visualStyle: '', motion: 'balanced', constraints: '' };
    vi.stubGlobal('fetch', vi.fn(async () => stream(end({ ...ready(), requirementDraft: draft }))));
    expect(frames(await (await call()).text()).at(-1)).toMatchObject({ type: 'result', result: { requirementDraft: draft } });
  });
  it('keeps draft motion consistent with the latest explicit motion requirement', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => stream(end({ ...ready(), requirementDraft: { ...requirementDraft(), motion: 'expressive' } }))));
    const output = frames(await (await (await start())({ ...request, messages: [...request.messages, { role: 'user', content: '不要动画，页面保持静态' }] })).text());
    expect(output.at(-1)).toMatchObject({ type: 'result', result: { requirementDraft: { motion: 'still' } } });
  });
  it.each(['empty-goal', 'long-goal', 'long-feature', 'many-features', 'invalid-motion', 'extra-scope', 'html-code', 'feature-code', 'invented-source'])('refuses an invalid requirement draft: %s', async failure => {
    const draft: any = requirementDraft();
    if (failure === 'empty-goal') draft.goal = '   ';
    if (failure === 'long-goal') draft.goal = '页'.repeat(2001);
    if (failure === 'long-feature') draft.features = ['功'.repeat(501)];
    if (failure === 'many-features') draft.features = Array(61).fill('查询');
    if (failure === 'invalid-motion') draft.motion = 'automatic';
    if (failure === 'extra-scope') draft.selections = [];
    if (failure === 'html-code') draft.visualStyle = '<div>代码</div>';
    if (failure === 'feature-code') draft.features = ['```js\nwindow.run()\n```'];
    if (failure === 'invented-source') draft.constraints = '采用 https://reactbits.dev/animations/progress-bar';
    vi.stubGlobal('fetch', vi.fn(async () => stream(end({ ...ready(), requirementDraft: draft }))));
    const output = frames(await (await (await start())()).text());
    expect(output.some(event => event.type === 'result')).toBe(false);
    expect(output.at(-1)).toMatchObject({ type: 'error', code: failure === 'invented-source' ? 'MODEL_INVALID_SOURCE' : 'MODEL_INVALID_RESPONSE' });
  });
  it('streams the developer prompt itself, rather than a short message or raw JSON', async () => {
    let upstream!: ReadableStreamDefaultController<Uint8Array>;
    vi.stubGlobal('fetch', vi.fn(async () => new Response(new ReadableStream({ start(controller) { upstream = controller; controller.enqueue(new TextEncoder().encode(frame('conversation.message.delta', answer('{"message":"仅有开场白","nested":{"developerPrompt":"不应显示"},"developerPrompt":"请实现学生')))); } }), { headers: { 'Content-Type': 'text/event-stream' } })));
    const response = await (await start())();
    expect(response.status).toBe(200); expect(response.headers.get('content-type')).toContain('text/event-stream');
    const reader = response.body!.getReader();
    expect(frames(new TextDecoder().decode((await reader.read()).value))).toEqual([{ type: 'message', content: '请实现学生' }]);
    upstream.enqueue(new TextEncoder().encode(end(ready()))); upstream.close();
    let output = ''; for (;;) { const chunk = await reader.read(); if (chunk.done) break; output += new TextDecoder().decode(chunk.value); }
    const result = frames(output).at(-1);
    expect(result).toMatchObject({ type: 'result', result: { referenceEntryIds: ['glass', 'gradient'] } });
    expect(result.result.developerPrompt).toContain('CSS Grid'); expect(result.result).not.toHaveProperty('html'); expect(result.result).not.toHaveProperty('pagePlan');
  });
  it('passes real source data, scoped layers, full conversation and relevant page design knowledge to Coze', async () => {
    const call = await start(); const root = cleanup.at(-1)!.dir;
    const components: ComponentImplementation[] = entries.map((entry, index) => ({ id: `native-${entry.id}`, title: entry.title, entryId: entry.id, sourceUrl: entry.sourceUrl, description: entry.description, layer: index ? 'border' : 'surface', parameters: { radius: '18px', duration: '15s' }, compatibleWith: [], conflicts: ['边缘不得覆盖内部表面'], mobileBehavior: '触屏可用', reducedMotion: '停止动画', limitations: ['原生适配'], code: { html: '<div>适配示例</div>', css: '.native{border-radius:18px}', js: '' }, htmlPath: `design-library/components/${entry.id}.html`, posterPath: `design-library/previews/${entry.id}.png` }));
    const page: PageRecipe = { id: 'knowledge-qa', title: '课程知识工作台', description: '完整问答工作台', aliases: ['学生课程'], purpose: '知识问答与资料检索', features: ['查看资料出处'], sections: [{ id: 'answer', title: '回答区域', purpose: '问答' }], tokens: { colors: { background: '#f4f7f8' }, fonts: { body: 'system-ui' }, spacing: [8, 16, 24], radius: 18 }, interactions: [{ name: '资料查看', trigger: '点击出处', result: '显示资料片段' }], componentIds: components.map(item => item.id), referenceEntryIds: entries.map(item => item.id), pairingRules: ['玻璃内部与渐变边缘分层'], htmlPath: 'design-library/pages/knowledge-qa.html', posterPath: 'design-library/previews/knowledge-qa.png' };
    await mkdir(path.dirname(path.join(root, page.htmlPath)), { recursive: true }); await writeFile(path.join(root, page.htmlPath), '<!doctype html><html><head></head><body>示例</body></html>');
    await mkdir(path.join(root, 'docs/coze-knowledge'), { recursive: true }); await writeFile(path.join(root, 'docs/coze-knowledge/01-设计与使用规则.txt'), '保持正文可读性');
    await writeFile(path.join(root, 'data/design-pages.json'), JSON.stringify([page])); await writeFile(path.join(root, 'data/design-components.json'), JSON.stringify(components));
    let context: any; let sent = '';
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { sent = String(init.body); context = JSON.parse(JSON.parse(sent).additional_messages[0].content.split('待分析资料：\n')[1]); return stream(end(ready())); }));
    const output = frames(await (await call({ ...request, brief: request.brief + '，采用课程知识工作台作为构图参考。' })).text());
    expect(output.at(-1).type).toBe('result'); expect(context.task).toBe('generate_prompt'); expect(context.conversation[0].content).toContain('手机');
    expect(context.confirmedSelections.map((item: any) => [item.target, item.layer])).toEqual([['答案卡片', 'surface'], ['答案卡片', 'border']]);
    expect(context.designBasis.selectedRecipe).toMatchObject({ id: 'knowledge-qa', tokens: page.tokens }); expect(context.designBasis.selectedRecipe).not.toHaveProperty('html');
    expect(context.designBasis.nativeImplementations.map((item: any) => item.parameters)).toEqual(components.map(item => item.parameters)); expect(context.designBasis.nativeImplementations[0]).not.toHaveProperty('code');
    expect(context).not.toHaveProperty('designRules'); expect(sent).toContain('正文、公式、答案及输入稳定可读'); expect(context.availableCatalog[0].sourceUrl).toBe(entries[0].sourceUrl); expect(sent).not.toContain('server-only-secret');
    expect(output.at(-1).result.developerPrompt).toContain(entries[0].sourceUrl); expect(output.at(-1).result.developerPrompt).toContain('border'); expect(output.at(-1).result.developerPrompt).toContain('玻璃内部');
  });
  it('reports missing configuration without fabricating a prompt', async () => {
    const response = await (await start(null))(); expect(response.status).toBe(503); expect(await response.json()).toMatchObject({ code: 'MODEL_NOT_CONFIGURED' });
  });
  it('lets the model choose any verified catalog entry beyond native examples and keyword cutoffs', async () => {
    const sources = Array.from({ length: 16 }, (_, index) => ({ ...entries[0], id: `catalog-${index}`, title: `独立视觉参考${index}`, name: `Visual${index}`, description: '有机轮廓沿空间轨迹变化', aliases: ['有机轮廓'], tags: ['空间'], placements: ['主视觉'], sourceUrl: `https://example.com/visual-${index}` }));
    const excluded = [
      { ...sources[0], id: 'draft-only', status: 'draft' as const },
      { ...sources[0], id: 'unverified-only', preview: { ...sources[0].preview, verified: false } },
    ];
    let context: any; let instruction = '';
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => {
      const sent = JSON.parse(String(init.body)).additional_messages[0].content;
      [instruction] = sent.split('待分析资料：\n'); context = JSON.parse(sent.split('待分析资料：\n')[1]);
      return stream(end({ ...ready(), referenceEntryIds: [...ready().referenceEntryIds, sources.at(-1)!.id] }));
    }));
    const output = frames(await (await (await start(config, [...entries, ...sources, ...excluded]))()).text());
    expect(context.availableCatalog).toHaveLength(18);
    expect(context.availableCatalog.find((entry: any) => entry.id === sources.at(-1)!.id)).toMatchObject({ sourceUrl: sources.at(-1)!.sourceUrl, trigger: sources.at(-1)!.trigger, description: sources.at(-1)!.description });
    expect(context.availableCatalog.map((entry: any) => entry.id)).not.toContain('draft-only');
    expect(context.availableCatalog.map((entry: any) => entry.id)).not.toContain('unverified-only');
    expect(instruction).toContain('全库选材');
    expect(instruction).toContain('不是优先名单');
    expect(instruction).toContain('用户要求换一种风格');
    expect(output.at(-1)).toMatchObject({ type: 'result', result: { referenceEntryIds: [...ready().referenceEntryIds, sources.at(-1)!.id] } });
    expect(output.at(-1).result.developerPrompt).toContain(sources.at(-1)!.sourceUrl);
  });
  it('exposes source-verified native mechanisms without a hardcoded component ID whitelist', async () => {
    const source = { ...entries[0], id: 'vortex-source', title: '粒子旋涡', sourceUrl: 'https://example.com/vortex' };
    const call = await start(config, [...entries, source]); const root = cleanup.at(-1)!.dir;
    const component: ComponentImplementation = { id: 'particle-vortex', entryId: source.id, sourceUrl: source.sourceUrl, title: source.title, description: '粒子沿螺旋轨迹构成主视觉', layer: 'page-background', parameters: { duration: '6s' }, compatibleWith: [], conflicts: ['保持阅读面独立'], mobileBehavior: '减少粒子数量', reducedMotion: '静态轨迹', limitations: ['本地原生适配'], code: { html: '<canvas></canvas>', css: '', js: 'drawParticles()' }, htmlPath: 'design-library/components/particle-vortex.html', posterPath: 'design-library/previews/particle-vortex.png' };
    await writeFile(path.join(root, 'data/design-components.json'), JSON.stringify([component]));
    let context: any;
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { context = JSON.parse(JSON.parse(String(init.body)).additional_messages[0].content.split('待分析资料：\n')[1]); return stream(end(ready())); }));
    const output = frames(await (await call({ ...request, brief: '太空主题页面，动效特别强' })).text());
    expect(output.at(-1).type).toBe('result');
    expect(context.visualEffectOptions).toEqual([expect.objectContaining({ id: component.id, entryId: source.id, layer: 'page-background', parameters: component.parameters })]);
    expect(context.visualEffectOptions[0]).not.toHaveProperty('code');
    expect(JSON.stringify(context)).not.toContain('drawParticles()');
  });
  it('makes verified visual implementations available beyond the functional page recipe and exports adopted effect parameters', async () => {
    const source = { ...entries[1], id: 'visual-border', title: '边缘移动高光', sourceUrl: 'https://example.com/moving-border' };
    const mismatched = { ...entries[0], id: 'wrong-source', sourceUrl: 'https://example.com/actual-spotlight' };
    const draft = { ...source, id: 'draft-reveal', status: 'draft' as const };
    const call = await start(config, [...entries, source, mismatched, draft]); const root = cleanup.at(-1)!.dir;
    const native = (id: string, entryId: string, sourceUrl: string): ComponentImplementation => ({ id, entryId, sourceUrl, title: '边缘移动高光', description: '沿边缘平移渐变，内容表面独立', layer: 'border', parameters: { speed: '6s', width: '2px' }, compatibleWith: ['glass-surface'], conflicts: ['不能覆盖内部表面'], mobileBehavior: '无需悬停', reducedMotion: '保留静态描边', limitations: ['原生适配而非来源源码'], code: { html: '<article class="effect"></article>', css: '.effect::before{animation:travel 6s linear infinite}', js: '' }, htmlPath: `design-library/components/${id}.html`, posterPath: `design-library/previews/${id}.png` });
    await writeFile(path.join(root, 'data/design-components.json'), JSON.stringify([
      native('moving-border', source.id, source.sourceUrl),
      native('spotlight-card', mismatched.id, 'https://example.com/unrelated'),
      native('scroll-reveal', draft.id, draft.sourceUrl),
    ]));
    let context: any;
    const value = { ...ready(), developerPrompt: ready().developerPrompt + '\n采用来源组件的SVG路径沿周边移动高光，周期6s、边缘2px；减少动态时使用静态描边。内部玻璃不变。', referenceEntryIds: [...ready().referenceEntryIds, source.id] };
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { context = JSON.parse(JSON.parse(String(init.body)).additional_messages[0].content.split('待分析资料：\n')[1]); return stream(end(value)); }));
    const output = frames(await (await call({ ...request, brief: '课程页面太素了，请实际采用参考库的效果，保留玻璃内部。' })).text());
    expect(context.visualEffectOptions.map((item: any) => item.entryId)).toEqual([source.id]);
    expect(context.visualEffectOptions[0]).not.toHaveProperty('code');
    expect(context.visualEffectOptions[0].implementationMethod).toContain('mask-composite');
    expect(context.availableCatalog.map((item: any) => item.id)).toContain(source.id);
    const result = output.at(-1).result;
    expect(result.developerPrompt).toContain('6s'); expect(result.developerPrompt).toContain('2px'); expect(result.developerPrompt).toContain('静态描边');
    expect(result.developerPrompt).toContain('SVG路径沿周边');
    expect(result.developerPrompt).not.toContain('background-position');
    expect(result.developerPrompt).not.toContain('已采用视觉效果的实现约束');
    expect(result.developerPrompt).toContain(source.sourceUrl); expect(result.developerPrompt).not.toContain('.effect::before');
  });
  it('uses the latest strong-motion request to supply a real whole-page composition and six verified visual references', async () => {
    const sources = Array.from({ length: 6 }, (_, index) => ({ ...entries[0], id: `motion-${index}`, title: `动态参考${index}`, sourceUrl: `https://example.com/motion-${index}` }));
    const call = await start(config, [...entries, ...sources]); const library = await motionLibrary(cleanup.at(-1)!.dir, sources);
    let context: any; let instruction = '';
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { const sent = JSON.parse(String(init.body)).additional_messages[0].content; [instruction] = sent.split('待分析资料：\n'); context = JSON.parse(sent.split('待分析资料：\n')[1]); return stream(end({ ...ready(), referenceEntryIds: sources.map(source => source.id) })); }));
    const output = frames(await (await call({ brief: '学生课程资料页面，采用强动效知识星图作为构图参考', messages: [{ role: 'user', content: '动态效果不够，我想要动效特别强的，充分使用资源库。' }], selections: [] })).text());
    expect(output.at(-1).type).toBe('result');
    expect(context.visualIntent.intensity).toBe('expressive');
    expect(context.visualPageReference).toMatchObject({ recipeId: 'knowledge-motion', referenceEntryIds: sources.map(source => source.id), composition: library.page.description, interactions: library.page.interactions });
    expect(context.visualPageReference).not.toHaveProperty('implementationHtml');
    expect(context.visualEffectOptions).toHaveLength(6);
    expect(new Set(context.visualEffectOptions.map((item: any) => item.entryId)).size).toBe(6);
    expect(context.availableCatalog.map((item: any) => item.id)).toEqual(expect.arrayContaining(sources.map(source => source.id)));
    expect(instruction).not.toContain('本版新增未确认参考最多3个');
    expect(instruction).not.toContain('4–6');
    expect(instruction).not.toContain('占首屏约三分之一');
    expect(instruction).toContain('应用结构与导航');
    expect(instruction.indexOf('应用结构与导航')).toBeLessThan(instruction.indexOf('视觉主张与首屏构图'));
    expect(instruction).toContain('不能用锚点滚动冒充功能切换');
    expect(instruction).toContain('独立路由');
    expect(instruction).toContain('共享状态');
    expect(instruction).toContain('多功能不等于多路由');
    expect(instruction).toContain('允许丰富多层动效');
    expect(instruction).toContain('关键素材');
    expect(context.visualIntent.objective).not.toContain('配合动态标题/入场及明显交互');
    expect(instruction).toContain('不得把低对比柔焦背景12秒移动20px');
    expect(instruction).toContain('功能控件不计入主视觉效果');
    expect(instruction).toContain('手机保持主视觉');
    expect(instruction).toContain('同一效果只写一套最终实施要求');
    expect(output.at(-1).result.developerPrompt).not.toContain('undefined');
    expect(output.at(-1).result.developerPrompt).not.toContain('<main');
  });
  it('does not force the same whole-page recipe on every strong-motion knowledge page', async () => {
    const sources = Array.from({ length: 6 }, (_, index) => ({ ...entries[0], id: `motion-${index}`, sourceUrl: `https://example.com/motion-${index}` }));
    const call = await start(config, sources); await motionLibrary(cleanup.at(-1)!.dir, sources);
    let context: any;
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { context = JSON.parse(JSON.parse(String(init.body)).additional_messages[0].content.split('待分析资料：\n')[1]); return stream(end({ ...ready(), referenceEntryIds: [] })); }));
    const output = frames(await (await call({ brief: '学生课程资料查询页面，动效特别强', selections: [] })).text());
    expect(output.at(-1).type).toBe('result');
    expect(context.visualPageReference).toBeNull();
    expect(context.designBasis.selectedRecipe).toBeNull();
    expect(context.designBasis.referenceEntryIds).toEqual([]);
    expect(context.visualEffectOptions).toHaveLength(6);
  });
  it('honors a later static requirement without transmitting dynamic page code or animation parameters', async () => {
    const sources = Array.from({ length: 6 }, (_, index) => ({ ...entries[0], id: `motion-${index}`, sourceUrl: `https://example.com/motion-${index}` }));
    const call = await start(config, sources); await motionLibrary(cleanup.at(-1)!.dir, sources);
    let context: any;
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { context = JSON.parse(JSON.parse(String(init.body)).additional_messages[0].content.split('待分析资料：\n')[1]); return stream(end({ ...ready(), referenceEntryIds: [] })); }));
    const output = frames(await (await call({ brief: '我要课程资料页面，动效特别强', messages: [{ role: 'user', content: '现在改成纯静态，不要动画。' }], selections: [] })).text());
    expect(output.at(-1).type).toBe('result');
    expect(context.visualIntent.intensity).toBe('still'); expect(context.visualPageReference).toBeNull();
    expect(context.visualEffectOptions.some((item: any) => item.code || item.parameters?.duration || item.parameters?.amplitude)).toBe(false);
    expect(JSON.stringify(context.designBasis)).not.toContain('animation:travel');
  });
  it('sends concise effect mechanisms and parameters instead of oversized implementation code', async () => {
    const sources = Array.from({ length: 6 }, (_, index) => ({ ...entries[0], id: `motion-${index}`, sourceUrl: `https://example.com/motion-${index}` }));
    const call = await start(config, sources); const library = await motionLibrary(cleanup.at(-1)!.dir, sources, true);
    let context: any;
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { context = JSON.parse(JSON.parse(String(init.body)).additional_messages[0].content.split('待分析资料：\n')[1]); return stream(end({ ...ready(), referenceEntryIds: [] })); }));
    const output = frames(await (await call({ brief: '学生知识问答，动效特别强', selections: [] })).text());
    expect(output.at(-1).type).toBe('result');
    expect(context.visualEffectOptions).toHaveLength(6);
    for (const item of context.visualEffectOptions) {
      expect(item).not.toHaveProperty('code');
      expect(item.implementationMethod.length).toBeGreaterThan(40);
      expect(item.parameters).toEqual(library.components.find(component => component.id === item.id)!.parameters);
    }
    expect(JSON.stringify(context)).not.toContain('animation:travel');
    expect(JSON.stringify(context)).not.toContain('<!doctype');
    expect(JSON.stringify(context.visualEffectOptions).length).toBeLessThan(6000);
  });
  it('keeps the latest complete prompt and every user correction without resending all earlier generated prompts', async () => {
    const messages = [
      { role: 'user', content: '保留资料来源查看和历史记录。' },
      { role: 'assistant', content: '专业开发提示词\n旧版全文'.repeat(500) },
      { role: 'user', content: '标题改成课程资料助手。' },
      { role: 'assistant', content: '参考已确认，玻璃只作用于内部。' },
      { role: 'assistant', content: '专业开发提示词\n最新完整版本，标题为课程资料助手。' },
      { role: 'user', content: '沿用上一版，只调整按钮边缘。' },
    ];
    const saved = JSON.stringify(messages); let context: any;
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { context = JSON.parse(JSON.parse(String(init.body)).additional_messages[0].content.split('待分析资料：\n')[1]); return stream(end(ready())); }));
    const output = frames(await (await (await start())({ ...request, messages })).text());
    expect(output.at(-1).type).toBe('result');
    expect(context.conversation).toEqual(messages.filter((_, index) => index !== 1));
    expect(JSON.stringify(context.conversation)).not.toContain('旧版全文');
    expect(JSON.stringify(messages)).toBe(saved);
  });
  it('rejects an unavailable selection before calling the model', async () => {
    const upstream = vi.fn(); vi.stubGlobal('fetch', upstream);
    const response = await (await start())({ ...request, selections: [{ ...request.selections[0], entryId: 'invented' }] });
    expect(response.status).toBe(400); expect(upstream).not.toHaveBeenCalled();
  });
  it.each(['developerPrompt', 'assumptions', 'message'])('rejects an invented source URL in %s even when the ID list is valid', async field => {
    const value = ready();
    const invented = '案例 ID animated-progress-bar，https://reactbits.dev/animations/progress-bar';
    if (field === 'assumptions') value.assumptions.push(invented);
    else value[field as 'developerPrompt' | 'message'] += '\n' + invented;
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(value))));
    const output = frames(await (await (await start())()).text());
    expect(output.some(event => event.type === 'result')).toBe(false);
    expect(output.at(-1)).toMatchObject({ type: 'error', code: 'MODEL_INVALID_SOURCE' });
  });
  it('accepts an exact catalog source in Markdown with a normalized host, hash and trailing punctuation', async () => {
    const value = ready();
    value.developerPrompt += '\n玻璃参考：[Glass](https://www.reactbits.dev/components/glass-surface/#props)。渐变来源：https://ui.aceternity.com/components/background-gradient。';
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(value))));
    const output = frames(await (await (await start())()).text());
    expect(output.at(-1).type).toBe('result');
  });
  it.each(['invented-id', 'missing-confirmation', 'html-field', 'html-code', 'css-code', 'js-code', 'assumption-code', 'opening-only', 'only-message', 'broken-json', 'upstream-error'])('refuses %s and never emits a successful or raw-code result', async failure => {
    const value: any = ready();
    if (failure === 'invented-id') value.referenceEntryIds.push('invented');
    if (failure === 'missing-confirmation') value.referenceEntryIds = ['glass'];
    if (failure === 'html-field') value.html = '<html>代码</html>';
    if (failure === 'html-code') value.developerPrompt = '<!doctype html><html>代码</html>';
    if (failure === 'css-code') value.developerPrompt = '```css\n.card{background:red}\n```';
    if (failure === 'js-code') value.developerPrompt = 'const button = document.querySelector("button");';
    if (failure === 'assumption-code') value.assumptions = ['```css\n.card{background:red}\n```'];
    if (failure === 'opening-only') value.developerPrompt = '为您推荐3款适配学生课程资料查询页面的清爽风格效果。';
    if (failure === 'only-message') delete value.developerPrompt;
    vi.stubGlobal('fetch', vi.fn(async () => stream(failure === 'upstream-error' ? frame('error', { message: 'server-only-secret private upstream details' }) : end(failure === 'broken-json' ? '{"message":"只有开场"}' : value))));
    const output = await (await (await start())()).text();
    expect(frames(output).some(event => event.type === 'result')).toBe(false); expect(frames(output).at(-1).type).toBe('error'); expect(output).not.toMatch(/server-only-secret|private upstream details|<!doctype|\.card\{|document\.querySelector/);
  });
  it('lets the Coze connector manage active-stream timeouts without an outer absolute cutoff', async () => {
    const timeout = vi.spyOn(AbortSignal, 'timeout');
    vi.stubGlobal('fetch', vi.fn(async () => stream(end(ready()))));
    const output = frames(await (await (await start())()).text());
    expect(output.at(-1).type).toBe('result');
    expect(timeout).not.toHaveBeenCalled();
  });
  it('uses the same cumulative prompt protocol for a compatible model and correctly decodes JSON escapes', async () => {
    const value = { ...ready(), developerPrompt: ready().developerPrompt + '\n字体用系统字体，标题保持清楚，手机自动收起历史记录。' };
    let sent = ''; const timeout = vi.spyOn(AbortSignal, 'timeout');
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => { sent = String(init.body); const json = JSON.stringify(value); return stream([...json].map(char => `data: ${JSON.stringify({ choices: [{ delta: { content: char } }] })}\n\n`).join('') + 'data: [DONE]\n\n'); }));
    const output = frames(await (await (await start({ baseUrl: 'https://model.example/v1', name: 'future-model', apiKey: 'server-only-secret' }))()).text());
    expect(output.at(-1).type).toBe('result'); expect(output.filter(event => event.type === 'message').some(event => event.content.includes('\n字体用'))).toBe(true);
    expect(JSON.parse(sent).stream).toBe(true); expect(sent).not.toContain('server-only-secret'); expect(timeout).toHaveBeenCalledWith(90000);
  });
  it('sends local knowledge directly to DeepSeek and streams the prompt while hiding reasoning', async () => {
    const value = ready(); let sent: any;
    vi.stubGlobal('fetch', vi.fn(withPassingDesignWorkflow(async (url: string, init: RequestInit) => {
      expect(url).toBe('https://api.deepseek.com/chat/completions');
      sent = JSON.parse(String(init.body));
      const json = JSON.stringify(value);
      return stream(`data: ${JSON.stringify({ choices: [{ delta: { reasoning_content: 'private-thought' } }] })}\n\n` + [...json].map(char => `data: ${JSON.stringify({ choices: [{ delta: { content: char } }] })}\n\n`).join('') + `data: ${JSON.stringify({ choices: [{ delta: {}, finish_reason: 'stop' }] })}\n\ndata: [DONE]\n\n`);
    })));
    const output = frames(await (await (await start({ provider: 'deepseek', baseUrl: 'https://api.deepseek.com', name: 'deepseek-flash', apiKey: 'server-only-secret' }))()).text());
    expect(output.at(-1)).toMatchObject({ type: 'result', result: { referenceEntryIds: ['glass', 'gradient'] } });
    expect(sent).toMatchObject({ model: 'deepseek-flash', stream: true, thinking: { type: 'enabled' }, reasoning_effort: 'high' });
    expect(sent.tools.map((tool: any) => tool.function.name)).toEqual(['search_reference_library', 'get_reference_details']);
    const instruction = sent.messages.find((message: any) => message.role === 'system').content;
    expect(instruction).toContain('执行任务与范围');
    expect(instruction).toContain('视觉必做清单');
    expect(instruction).toContain('沿用技术栈不等于保留旧界面');
    expect(instruction).toContain('不编造工程路径');
    expect(instruction).toContain('首次变化时间');
    expect(instruction).toContain('完成与验收');
    expect(instruction).toContain('不得把课程书册、深蓝配色或任何范例构图固化为所有页面的模板');
    expect(instruction).toContain('生成器本身只输出提示词');
    expect(instruction).toContain('下游必须编写或修改页面代码并交付源代码与可运行页面');
    expect(instruction).toContain('不得把生成器的禁写代码规则写进developerPrompt');
    const context = JSON.parse(sent.messages.find((message: any) => message.role === 'user').content);
    expect(context.availableCatalog.map((entry: any) => entry.id)).toEqual(expect.arrayContaining(['glass', 'gradient']));
    expect(context.confirmedSelections.map((selection: any) => selection.layer)).toEqual(['surface', 'border']);
    expect(output.filter(event => event.type === 'message').length).toBeGreaterThan(1);
    expect(JSON.stringify(output)).not.toMatch(/private-thought|DO_NOT_SHOW_THINKING|server-only-secret/);
    expect(sent).not.toHaveProperty('bot_id');
  });
  it('cancels the upstream reader after the prompt request disconnects', async () => {
    const cancelled = vi.fn();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode(frame('conversation.message.delta', answer('{"developerPrompt":"整理中')))); }, cancel: cancelled }), { headers: { 'Content-Type': 'text/event-stream' } })));
    const controller = new AbortController(); const response = await (await start())(request, controller.signal); const reader = response.body!.getReader(); await reader.read(); controller.abort();
    await vi.waitFor(() => expect(cancelled).toHaveBeenCalled(), { timeout: 2000 });
  });
});

describe('named top-level model string decoder', () => {
  it('keeps message as the default and reads only a top-level developerPrompt when requested', () => {
    const content = '{"message":"开场","nested":{"developerPrompt":"忽略"},"developerPrompt":"第一行\\n第二行\\u4f60\\u597d';
    expect(recommendationText(content)).toBe('开场'); expect(recommendationText(content, 'developerPrompt')).toBe('第一行\n第二行你好');
  });
});
