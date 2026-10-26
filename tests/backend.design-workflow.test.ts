import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { generateDesignPrompt } from '../server/design-prompt';
import { SelectionHistoryStore } from '../server/selection-history';
import type { CatalogEntry, DesignPromptRequest, DesignPromptResult, MainVisual } from '../shared/types';
import type { ModelConfig } from '../server/model';

const roots: string[] = [];
afterEach(async () => {
  vi.restoreAllMocks(); vi.unstubAllGlobals();
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true });
});

const model: ModelConfig = { provider: 'deepseek', baseUrl: 'https://model.example/v1', name: 'deepseek-test', apiKey: 'server-only-key' };
const entry = (id: string, name: string): CatalogEntry => ({ id, name, title: name, stage: 'style', description: name + '独立装饰层的持续运动', aliases: [], tags: [], placements: ['主视觉'], trigger: '持续', sourceId: 'reactbits', sourceUrl: `https://reactbits.dev/components/${id}`, preview: { type: 'video', url: `/media/${id}.webm`, verified: true, provenance: 'source-recording' }, status: 'ready', updatedAt: '' });
const entries = [entry('orbit', 'Prism Orbit'), entry('glass', 'Clear Glass'), entry('grid', 'Grid Scan')];
const request: DesignPromptRequest = { brief: '制作天文观测助手，整理观测步骤和记录，界面清晰', messages: [{ role: 'user', content: '先展示观测任务，保留记录入口' }], selections: [], conversationId: 'workflow-page' };
const requirementDraft = () => ({ goal: '天文观测助手', audience: '观测者', features: ['整理观测步骤', '观测记录'], visualStyle: '清晰', motion: 'balanced' as const, constraints: '先展示观测任务，保留记录入口' });
const prompt = '请在目标工程实际实现天文观测助手，先检查现有工程再决定技术组织。页面中心保留完整可读的任务区，任务步骤与记录入口始终可用。主视觉仅占首屏宽度的10%，采用独立装饰层；正文和输入保持稳定。演示数据标注演示；手机恢复单列，支持暂停与减少动态，并交付源代码、可运行页面和真实检查结果。';
const ready = (changes: Partial<DesignPromptResult> = {}): DesignPromptResult => ({ message: '提示词已整理', developerPrompt: prompt, referenceEntryIds: [], assumptions: [], requirementDraft: requirementDraft(), mainVisuals: [], ...changes });
const plan = (subject = '天文观测') => ({ subject, userTask: `${subject}任务与记录`, concept: `${subject}主题的空间秩序，规划私有标记`, composition: '主要任务居中，记录入口常驻，装饰主体与阅读面分层', primaryVisual: { subject: `${subject}主题主体`, visibleScale: '投影主体占首屏宽度约45%', material: '细致半透明材质', motion: '装饰层缓慢环绕，正文静止' }, navigation: '任务和记录用明确入口切换', readingArea: '正文使用稳定的高对比阅读面', style: { palette: ['#101820', '#d7e5e8'], typography: '主题标题搭配清晰的无衬线正文' }, assets: [{ name: `${subject}主体轮廓`, acquisition: '使用真实可授权轮廓或精细绘制', quality: '轮廓完整，放大无明显锯齿', fallback: '可信静态轮廓' }], searches: [{ query: 'Prism Orbit', purpose: '寻找独立的环绕装饰机制', layer: 'page-background' }], acceptance: ['首屏任务和记录入口清楚', '装饰层不遮挡正文', '手机和减少动态可用'] });
const pass = () => ({ verdict: 'pass', summary: '检查通过，审查私有标记', issues: [] });
const revise = () => ({ verdict: 'revise', summary: '主视觉可见占比不足', issues: [{ category: 'composition', problem: '主体太小，不能形成规划要求的焦点', evidence: '主视觉仅占首屏宽度的10%', fix: '将投影后主体提高到首屏宽度约45%，阅读面保持稳定' }] });

type Call = { body: any; context: any; instruction: string };
type Handler = (call: Call, index: number) => Response | Promise<Response>;
function response(value: unknown, reasoning = '模型私有思考') {
  return new Response(JSON.stringify({ choices: [{ index: 0, finish_reason: 'stop', message: { role: 'assistant', content: JSON.stringify(value), reasoning_content: reasoning } }] }), { headers: { 'Content-Type': 'application/json' } });
}
function tool(name: string, args: unknown) {
  return new Response(JSON.stringify({ choices: [{ index: 0, finish_reason: 'tool_calls', message: { role: 'assistant', content: null, reasoning_content: '工具私有思考', tool_calls: [{ id: `call-${name}`, type: 'function', function: { name, arguments: JSON.stringify(args) } }] } }] }), { headers: { 'Content-Type': 'application/json' } });
}
function streamed(value: unknown, reasoning: string) {
  const data = (part: unknown) => `data: ${JSON.stringify(part)}\n\n`;
  const content = JSON.stringify(value);
  return new Response(data({ choices: [{ index: 0, delta: { role: 'assistant', reasoning_content: reasoning } }] }) + data({ choices: [{ index: 0, delta: { content: content.slice(0, 32) } }] }) + data({ choices: [{ index: 0, delta: { content: content.slice(32) }, finish_reason: 'stop' }] }) + 'data: [DONE]\n\n', { headers: { 'Content-Type': 'text/event-stream' } });
}
function rawResponse(content: string) {
  return new Response(JSON.stringify({ choices: [{ finish_reason: 'stop', message: { role: 'assistant', content } }] }), { headers: { 'Content-Type': 'application/json' } });
}
function useModel(handlers: { plan?: Handler; write?: Handler; review?: Handler; format?: Handler } = {}) {
  const calls: Call[] = []; const counts: Record<string, number> = {};
  const mock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body));
    const call = { body, context: JSON.parse(body.messages[1].content), instruction: body.messages[0].content };
    calls.push(call);
    const task = call.context.task; const index = counts[task] || 0; counts[task] = index + 1;
    if (task === 'plan_design') return handlers.plan ? handlers.plan(call, index) : response(plan());
    if (task === 'review_design_prompt') return handlers.review ? handlers.review(call, index) : response(pass());
    if (task === 'generate_prompt') return handlers.write ? handlers.write(call, index) : response(ready());
    if (task === 'repair_design_prompt_json') return handlers.format ? handlers.format(call, index) : response(ready());
    throw new Error(`Unexpected workflow task: ${task}`);
  });
  vi.stubGlobal('fetch', mock);
  return { calls, mock, stages: () => calls.filter(call => call.body.messages.length === 2).map(call => call.context.task) };
}
async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), 'design-workflow-')); roots.push(root);
  await mkdir(path.join(root, 'data/case-knowledge'), { recursive: true });
  await writeFile(path.join(root, 'data/catalog.seed.json'), JSON.stringify(entries));
  await writeFile(path.join(root, 'data/case-knowledge/reactbits.json'), JSON.stringify(entries.map(item => ({ entryId: item.id, sourceUrl: item.sourceUrl, basis: 'source-code', implementation: { summary: `${item.name}独立实现知识`, steps: ['创建独立装饰层', '根据时间更新局部绘制', '暂停并清理实例'], dependencies: [], parameters: { duration: '8s' } }, suitableFor: ['主视觉', '背景'], avoidFor: ['正文阅读面'], layers: ['page-background', 'surface'], limitations: ['不遮挡文字', '不阻塞输入'], mobile: '减少绘制数量', reducedMotion: '静态构图', performance: '离屏暂停并清理', evidence: [{ url: item.sourceUrl, kind: 'registry', checkedAt: '2026-10-25T00:00:00.000Z' }], notes: '临时集成测试知识' }))));
  return { root, history: new SelectionHistoryStore(root) };
}
function writeWithReference(call: Call, value: DesignPromptResult, query = 'Prism Orbit', readDetails = true) {
  const results = call.body.messages.filter((message: any) => message.role === 'tool');
  if (!results.length) return tool('search_reference_library', { query });
  const last = JSON.parse(results.at(-1).content);
  if (last.candidates && readDetails) return tool('get_reference_details', { refKeys: last.candidates.map((item: any) => item.refKey) });
  return response(value);
}
function textLeaves(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap(textLeaves);
}

describe('DeepSeek independent design planning and review workflow', () => {
  it('corrects malformed writer JSON once and still validates the original read-reference ledger', async () => {
    const { root } = await fixture();
    const resultDraft = ready({ referenceEntryIds: ['orbit'] });
    const network = useModel({ write: call => call.body.messages.filter((message: any) => message.role === 'tool').length >= 2 ? rawResponse('{"developerPrompt":"语法缺少闭合') : writeWithReference(call, resultDraft), format: () => response(resultDraft) });
    const result = await generateDesignPrompt(model, request, entries, root);
    expect(network.stages()).toEqual(['plan_design', 'generate_prompt', 'repair_design_prompt_json', 'review_design_prompt']);
    expect(result.referenceEntryIds).toEqual(['orbit']);
    expect(result.designProcess?.reviewed).toBe(true);
  });

  it.each(['malformed-again', 'unread-reference'])('does not loosen source or syntax validation after format correction: %s', async failure => {
    const { root, history } = await fixture();
    const network = useModel({ write: () => rawResponse('{"developerPrompt":"未闭合'), format: () => failure === 'malformed-again' ? rawResponse('{"developerPrompt":"仍未闭合') : response(ready({ referenceEntryIds: ['grid'] })) });
    await expect(generateDesignPrompt(model, request, entries, root)).rejects.toMatchObject({ code: failure === 'malformed-again' ? 'MODEL_INVALID_RESPONSE' : 'MODEL_REFERENCE_NOT_READ' });
    expect(network.calls.filter(call => call.context.task === 'repair_design_prompt_json')).toHaveLength(1);
    expect(await history.list()).toEqual([]);
  });

  it('corrects an unsupported result field without bypassing the strict result schema', async () => {
    const { root } = await fixture();
    const network = useModel({ write: () => response({ ...ready(), assumptionsNote: '只能整理到协议允许的假设字段' }), format: () => response(ready()) });
    const result = await generateDesignPrompt(model, request, entries, root);
    expect(network.stages()).toEqual(['plan_design', 'generate_prompt', 'repair_design_prompt_json', 'review_design_prompt']);
    expect(result).not.toHaveProperty('assumptionsNote');
    expect(result.designProcess?.reviewed).toBe(true);
  });

  it('plans, searches and reads references, then reviews before recording a successful result', async () => {
    const { root, history } = await fixture(); const historyAtReview: unknown[][] = [];
    const network = useModel({ write: call => writeWithReference(call, ready({ referenceEntryIds: ['orbit'] })), review: async () => { historyAtReview.push(await history.list()); return response(pass()); } });
    const result = await generateDesignPrompt(model, request, entries, root);
    expect(network.stages()).toEqual(['plan_design', 'generate_prompt', 'review_design_prompt']);
    const [planner, writer, reviewer] = network.calls.filter(call => call.body.messages.length === 2);
    expect(planner.body).not.toHaveProperty('tools'); expect(reviewer.body).not.toHaveProperty('tools');
    expect(writer.body.tools.map((item: any) => item.function.name)).toEqual(['search_reference_library', 'get_reference_details']);
    expect(writer.context.designPlan).toEqual(plan());
    expect(writer.context.availableCatalog).toEqual([]);
    expect(writer.context.referenceLibrary).toMatchObject({ catalogCount: entries.length, mode: 'search-and-read' });
    for (const call of [planner, writer]) {
      expect(JSON.stringify(call.context)).not.toContain('Clear Glass独立实现知识');
      expect(JSON.stringify(call.context)).not.toContain(entries[1].sourceUrl);
    }
    const toolMessages = network.calls.flatMap(call => call.body.messages.filter((message: any) => message.role === 'tool').map((message: any) => JSON.parse(message.content)));
    expect(toolMessages.some((item: any) => item.candidates?.some((candidate: any) => candidate.name === 'Prism Orbit'))).toBe(true);
    expect(toolMessages.some((item: any) => item.availableCatalog?.some((candidate: any) => candidate.implementationKnowledge?.implementation.summary === 'Prism Orbit独立实现知识'))).toBe(true);
    expect(textLeaves(reviewer.context)).toContain(result.developerPrompt);
    expect(historyAtReview).toEqual([[]]);
    expect(result).toMatchObject({ designProcess: { planned: true, reviewed: true, repaired: false, renderedPageVerified: false }, selectionDiversity: { historySaved: true } });
    expect((await history.list()).map(item => item.referenceEntryIds)).toEqual([['orbit']]);
  });

  it.each(['有机化学实验', '古诗词阅读'])('passes a task-specific %s plan to the writer without fixing one discipline', async subject => {
    const { root } = await fixture(); const selectedPlan = plan(subject);
    const network = useModel({ plan: () => response(selectedPlan) });
    const result = await generateDesignPrompt(model, { ...request, brief: `制作${subject}助手，只生成所需提示词` }, entries, root);
    const planner = network.calls.find(call => call.context.task === 'plan_design');
    expect(planner).toBeDefined();
    expect(planner?.context.brief).toContain(subject);
    expect(network.calls.find(call => call.context.task === 'generate_prompt')?.context.designPlan).toEqual(selectedPlan);
    expect(result).toMatchObject({ designProcess: { planned: true, reviewed: true, renderedPageVerified: false } });
  });

  it('still refuses a searched reference when the writer never reads its full details', async () => {
    const { root, history } = await fixture();
    const network = useModel({ write: call => writeWithReference(call, ready({ referenceEntryIds: ['orbit'] }), 'Prism Orbit', false) });
    await expect(generateDesignPrompt(model, request, entries, root)).rejects.toMatchObject({ code: 'MODEL_REFERENCE_NOT_READ' });
    expect(network.stages()).toEqual(['plan_design', 'generate_prompt']);
    expect(await history.list()).toEqual([]);
  });

  it('repairs once with the review issues, preserves confirmed scope and requirement draft, and reviews the replacement', async () => {
    const { root, history } = await fixture();
    const selectedRequest: DesignPromptRequest = { ...request, selections: [{ entryId: 'glass', stage: 'style', target: '记录卡片', placement: '记录卡片', layer: 'surface', adjustments: '保留透明内部', preserve: ['记录内容', '导航入口'] }] };
    const first = ready({ referenceEntryIds: ['glass'] });
    const replacement = ready({ developerPrompt: prompt.replace('主视觉仅占首屏宽度的10%', '主视觉占首屏宽度约45%'), referenceEntryIds: ['glass'] });
    const historyAtReview: unknown[][] = [];
    const network = useModel({ write: (_call, index) => response(index ? replacement : first), review: async (_call, index) => { historyAtReview.push(await history.list()); return response(index ? pass() : revise()); } });
    const result = await generateDesignPrompt(model, selectedRequest, entries, root);
    expect(network.stages()).toEqual(['plan_design', 'generate_prompt', 'review_design_prompt', 'generate_prompt', 'review_design_prompt']);
    const writers = network.calls.filter(call => call.context.task === 'generate_prompt');
    expect(writers[1].context.designPlan).toEqual(plan());
    expect(writers[1].context.designReview).toMatchObject({ previousResult: { requirementDraft: first.requirementDraft, referenceEntryIds: ['glass'] }, issues: revise().issues });
    expect(writers[1].context.confirmedSelections[0]).toMatchObject(selectedRequest.selections[0]);
    const reviews = network.calls.filter(call => call.context.task === 'review_design_prompt');
    expect(JSON.stringify(reviews[0].context)).toContain('主视觉仅占首屏宽度的10%');
    expect(JSON.stringify(reviews[1].context)).toContain('主视觉占首屏宽度约45%');
    expect(historyAtReview).toEqual([[], []]);
    expect(result.requirementDraft).toEqual(first.requirementDraft);
    expect(result.developerPrompt).toContain('主视觉占首屏宽度约45%'); expect(result.developerPrompt).toContain('保留：记录内容、导航入口');
    expect(result).toMatchObject({ designProcess: { planned: true, reviewed: true, repaired: true, renderedPageVerified: false } });
    expect(await history.list()).toHaveLength(1);
  });

  it('returns a safe failure after the second failed review and never records either draft', async () => {
    const { root, history } = await fixture();
    const network = useModel({ review: () => response(revise()) });
    await expect(generateDesignPrompt(model, request, entries, root)).rejects.toMatchObject({ code: 'MODEL_DESIGN_REVIEW_FAILED' });
    expect(network.stages()).toEqual(['plan_design', 'generate_prompt', 'review_design_prompt', 'generate_prompt', 'review_design_prompt']);
    expect(await history.list()).toEqual([]);
  });

  it('reuses this request\'s already-read references during repair without preloading unrelated cases', async () => {
    const { root } = await fixture();
    const first = ready({ referenceEntryIds: ['orbit'] });
    const replacement = ready({ referenceEntryIds: ['orbit'], developerPrompt: prompt.replace('主视觉仅占首屏宽度的10%', '主视觉占首屏宽度约45%') });
    const network = useModel({ write: call => call.context.designReview ? response(replacement) : writeWithReference(call, first), review: (_call, index) => response(index ? pass() : revise()) });
    const result = await generateDesignPrompt(model, request, entries, root);
    const repair = network.calls.filter(call => call.context.task === 'generate_prompt').find(call => call.context.designReview)!;
    expect(repair.context.availableCatalog.map((item: any) => item.id)).toEqual(['orbit']);
    expect(repair.context.availableCatalog[0].implementationKnowledge.implementation.summary).toBe('Prism Orbit独立实现知识');
    expect(result.referenceEntryIds).toEqual(['orbit']);
  });

  it('keeps the server-owned requirement snapshot when a repair rephrases it and focuses the second review on prior issues', async () => {
    const { root } = await fixture();
    const first = ready();
    const changed = ready({ developerPrompt: prompt.replace('主视觉仅占首屏宽度的10%', '主视觉占首屏宽度约45%'), requirementDraft: { ...requirementDraft(), goal: '天文观测与记录助手' } });
    const network = useModel({ write: (_call, index) => response(index ? changed : first), review: (_call, index) => response(index ? pass() : revise()) });
    const result = await generateDesignPrompt(model, request, entries, root);
    expect(result.requirementDraft).toEqual(first.requirementDraft);
    const reviews = network.calls.filter(call => call.context.task === 'review_design_prompt');
    expect(reviews[1].context.previousIssues).toEqual(revise().issues);
    expect(reviews[1].context.draft.requirementDraft).toEqual(first.requirementDraft);
    expect(result.designProcess?.repaired).toBe(true);
  });

  it.each(['requirement-draft', 'confirmed-reference'])('does not accept a repair that drops the existing %s', async dropped => {
    const { root, history } = await fixture();
    const selectedRequest: DesignPromptRequest = { ...request, selections: [{ entryId: 'glass', stage: 'style', placement: '记录卡片', target: '记录卡片', layer: 'surface', adjustments: '保持内部', preserve: ['记录内容'] }] };
    const first = ready({ referenceEntryIds: ['glass'] }); const broken = ready({ referenceEntryIds: ['glass'] });
    if (dropped === 'requirement-draft') delete broken.requirementDraft; else broken.referenceEntryIds = [];
    const network = useModel({ write: (_call, index) => response(index ? broken : first), review: (_call, index) => response(index ? pass() : revise()) });
    const outcome = await generateDesignPrompt(model, selectedRequest, entries, root).then(result => ({ result }), error => ({ error }));
    expect(network.calls.filter(call => call.context.task === 'generate_prompt')).toHaveLength(2);
    if ('result' in outcome) {
      expect(outcome.result.requirementDraft).toEqual(first.requirementDraft);
      expect(outcome.result.referenceEntryIds).toContain('glass');
      expect(outcome.result.developerPrompt).toContain('保留：记录内容');
    } else expect(await history.list()).toEqual([]);
  });

  it('plans once and reviews only the final selection after the existing diversity reselection', async () => {
    const { root, history } = await fixture();
    const initialVisual: MainVisual[] = [{ role: 'hero', family: 'image-orbit', entryIds: ['orbit'], description: '图像围绕观测主体运动' }];
    for (const pageKey of ['old-one', 'old-two']) await history.record({ pageKey, purpose: '其他页面', referenceEntryIds: ['orbit'], mainVisuals: initialVisual });
    const replacementVisual: MainVisual[] = [{ role: 'hero', family: 'grid-scan', entryIds: ['grid'], description: '网格扫描构成观测主题' }];
    const network = useModel({ write: call => {
      const reselection = !!call.context.reselection;
      return writeWithReference(call, ready({ developerPrompt: prompt + (reselection ? '本轮改为网格扫描主视觉。' : ''), referenceEntryIds: [reselection ? 'grid' : 'orbit'], mainVisuals: reselection ? replacementVisual : initialVisual }), reselection ? 'Grid Scan' : 'Prism Orbit');
    } });
    const result = await generateDesignPrompt(model, request, entries, root);
    expect(network.stages()).toEqual(['plan_design', 'generate_prompt', 'generate_prompt', 'review_design_prompt']);
    expect(result.referenceEntryIds).toEqual(['grid']); expect(result.selectionDiversity).toMatchObject({ reselected: true, keptOriginal: false });
    const reviewer = network.calls.find(call => call.context.task === 'review_design_prompt')!;
    expect(JSON.stringify(reviewer.context)).toContain('本轮改为网格扫描主视觉');
    expect((await history.list())[0].referenceEntryIds).toEqual(['grid']);
  });

  it.each(['plan_design', 'review_design_prompt'])('never writes success history when cancelled during %s', async stage => {
    const { root, history } = await fixture(); const controller = new AbortController();
    const abort: Handler = () => { controller.abort(new DOMException('Stopped by user', 'AbortError')); throw controller.signal.reason; };
    const network = useModel(stage === 'plan_design' ? { plan: abort } : { review: abort });
    await expect(generateDesignPrompt(model, request, entries, root, { signal: controller.signal })).rejects.toThrow();
    expect(controller.signal.aborted).toBe(true);
    expect(network.calls.some(call => call.context.task === stage)).toBe(true);
    expect(await history.list()).toEqual([]);
  });

  it.each(['plan_design', 'review_design_prompt'])('propagates invalid %s output instead of returning a successful draft', async stage => {
    const { root, history } = await fixture();
    const malformed: Handler = () => response({ message: '不能冒充有效阶段结果' });
    const network = useModel(stage === 'plan_design' ? { plan: malformed } : { review: malformed });
    await expect(generateDesignPrompt(model, request, entries, root)).rejects.toThrow();
    expect(network.calls.some(call => call.context.task === stage)).toBe(true);
    if (stage === 'plan_design') expect(network.calls.some(call => call.context.task === 'generate_prompt')).toBe(false);
    expect(await history.list()).toEqual([]);
  });

  it('shows stage progress and labels the writer draft while hiding planner/reviewer JSON and private reasoning', async () => {
    const { root } = await fixture(); const messages: string[] = [];
    useModel({ plan: () => streamed(plan(), 'planner-reasoning-private'), write: () => streamed(ready(), 'writer-reasoning-private'), review: () => streamed(pass(), 'reviewer-reasoning-private') });
    const result = await generateDesignPrompt(model, request, entries, root, { onMessage: content => messages.push(content) });
    expect(result.designProcess).toEqual({ planned: true, reviewed: true, repaired: false, renderedPageVerified: false });
    expect(JSON.stringify(result)).not.toMatch(/规划私有标记|审查私有标记|primaryVisual|verdict/);
    expect(messages.some(content => /规划|构思/.test(content))).toBe(true);
    expect(messages.some(content => /审查|审核/.test(content))).toBe(true);
    expect(messages.some(content => /待审查|待审核/.test(content))).toBe(true);
    expect(messages.some(content => content.includes('页面中心保留完整可读的任务区'))).toBe(true);
    const visible = messages.join('\n');
    for (const hidden of ['规划私有标记', '审查私有标记', 'planner-reasoning-private', 'writer-reasoning-private', 'reviewer-reasoning-private', '"primaryVisual"', '"verdict"']) expect(visible).not.toContain(hidden);
  });

  it('keeps the compatible provider on its existing single writer request', async () => {
    const { root } = await fixture(); const compatible: ModelConfig = { provider: 'compatible', baseUrl: 'https://model.example/v1', name: 'compatible-test', apiKey: 'server-only-key' };
    const network = useModel();
    const result = await generateDesignPrompt(compatible, request, entries, root);
    expect(network.stages()).toEqual(['generate_prompt']); expect(network.mock).toHaveBeenCalledTimes(1);
    expect(result.developerPrompt).toContain('页面中心保留完整可读的任务区'); expect(result).not.toHaveProperty('designProcess');
  });

  it('keeps Coze on its existing single writer request', async () => {
    const { root } = await fixture(); const contexts: any[] = [];
    const coze: ModelConfig = { provider: 'coze', baseUrl: 'https://coze.example', name: 'Coze', apiKey: 'server-only-key', botId: '123' };
    const mock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const sent = JSON.parse(String(init?.body)).additional_messages[0].content;
      contexts.push(JSON.parse(sent.split('待分析资料：\n')[1]));
      return new Response(`event: conversation.message.completed\ndata: ${JSON.stringify({ id: 'answer', role: 'assistant', type: 'answer', content_type: 'text', content: JSON.stringify(ready()) })}\n\nevent: conversation.chat.completed\ndata: {"status":"completed"}\n\n`, { headers: { 'Content-Type': 'text/event-stream' } });
    });
    vi.stubGlobal('fetch', mock);
    const result = await generateDesignPrompt(coze, request, entries, root);
    expect(contexts.map(context => context.task)).toEqual(['generate_prompt']); expect(mock).toHaveBeenCalledTimes(1);
    expect(result.developerPrompt).toContain('页面中心保留完整可读的任务区'); expect(result).not.toHaveProperty('designProcess');
  });
});
