import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../server/core';
import { deepseekAnswer } from '../server/deepseek';
import { planDesign, reviewDesignPrompt } from '../server/design-planning';
import type { DeepSeekConfig } from '../server/deepseek';
import type { DesignPromptRequest, DesignPromptResult } from '../shared/types';

vi.mock('../server/deepseek', () => ({ deepseekAnswer: vi.fn() }));
const answer = vi.mocked(deepseekAnswer);
const config: DeepSeekConfig = { provider: 'deepseek', baseUrl: 'https://api.deepseek.com', name: 'deepseek-flash', apiKey: 'server-only-test-key' };
const request: DesignPromptRequest = { brief: '为学生设计声学实验，保留稳定的问题输入和答案阅读区', selections: [] };
const draft: DesignPromptResult = { message: '草稿', developerPrompt: '页面以声波传播模型为首屏主体，问题输入和实验答案保持稳定。背景声波沿水平方向持续扩散；保留静态降级、暂停入口和减少动态模式。学生可调整频率并比较实验现象，长篇答案区域不随背景移动。', referenceEntryIds: [], assumptions: [] };
const plan = (subject = '声学', userTask = '比较不同频率的声波传播现象') => ({
  subject, userTask, concept: '以可比较的实验现象组织学习路径', composition: '主体位于首屏右侧，左侧保留任务与操作入口，答案另设稳定区域',
  primaryVisual: { subject: `${subject}实验对象`, visibleScale: '占首屏约一半，避免遮挡控件', material: '需获取有清晰结构与透明背景的主题图形', motion: '只让示意背景缓慢推进，输入与正文稳定，支持暂停及减少动态' },
  navigation: '按学习任务切换实验视图', readingArea: '问题、输入、答案在固定版面中清晰可读',
  style: { palette: ['由实验对象材质决定的主题色', '高对比正文色'], typography: '标题具有层级，正文使用易读字体' },
  assets: [{ name: '实验主体图形', acquisition: '下游按实验原理生成或获取图形，当前待获取', quality: '结构准确、主体清晰，先核对缩小尺寸下的辨识度', fallback: '资源不可用时使用静态原理图并标明待替换' }],
  searches: [{ query: 'wave propagation layered motion', purpose: '检索独立背景层的传播机制', layer: 'page-background' as const }],
  acceptance: ['问题输入和长篇答案稳定', '真实页面中核对主题主体是否清楚，并检查暂停与减少动态行为'],
});
const passed = () => ({ verdict: 'pass' as const, summary: '文字审查未发现与需求、方案和已读来源相冲突的表述；实际视觉效果仍待页面验收。', issues: [] });
const revise = () => ({ verdict: 'revise' as const, summary: '需明确背景运动的执行边界，当前仅完成文字审查。', issues: [{ category: 'motion' as const, problem: '背景传播方向尚未关联到方案中的实验对比要求', evidence: '背景声波沿水平方向持续扩散', fix: '补充背景与实验参数之间的关系，并保持输入与答案稳定' }] });
const planning = async () => ({ planDesign, reviewDesignPrompt });
const reviewContext = () => ({ plan: plan(), request, draft, referenceDetails: [{ id: 'read-wave', implementation: { summary: '以独立层表现传播' } }] });

beforeEach(() => { answer.mockReset(); });
afterEach(() => vi.restoreAllMocks());

describe('design planning', () => {
  it.each([
    ['声学', '比较不同频率的传播现象'], ['化学', '观察反应条件与实验现象的关系'], ['音乐', '比较旋律节奏并完成听辨'], ['历史', '对照史料解释事件变化'],
  ])('accepts a complete %s plan without a prescribed subject template', async (subject, userTask) => {
    const value = plan(subject, userTask); answer.mockResolvedValue(JSON.stringify(value));
    const { planDesign } = await planning();
    await expect(planDesign(config, { brief: request.brief })).resolves.toEqual(value);
  });

  it('allows empty assets and searches when a copy-only change needs no new references', async () => {
    const value = { ...plan(), assets: [], searches: [] }; answer.mockResolvedValue(JSON.stringify(value));
    await expect((await planning()).planDesign(config, { brief: '只改文案，不新增参考' })).resolves.toEqual(value);
  });

  it('accepts the explicit boundary that an interactive demo must not pose as real experiments or verified data', async () => {
    const value = { ...plan(), acceptance: ['页面明确标注‘交互演示’，不把演示内容冒充真实实验结果或已验证数据；示例资料来源有标注位置。'] };
    answer.mockResolvedValue(JSON.stringify(value));
    await expect(planDesign(config, { brief: '化学交互演示，明确示例与真实实验的边界' })).resolves.toEqual(value);
    expect(answer).toHaveBeenCalledOnce();
  });

  it('accepts a future fallback requirement that prohibits generated-asset claims', async () => {
    const value = { ...plan(), acceptance: ['素材缺失时降级为静态分子示意图，不出现空白、错误结构或素材已生成声明。'] };
    answer.mockResolvedValue(JSON.stringify(value));
    await expect(planDesign(config, { brief: '化学交互演示，素材不可用时保留静态示意图' })).resolves.toEqual(value);
    expect(answer).toHaveBeenCalledOnce();
  });

  it('sends a fixed task and bounded planning contract through the existing adapter without text callbacks', async () => {
    answer.mockResolvedValue(JSON.stringify(plan())); const controller = new AbortController();
    await (await planning()).planDesign(config, { task: 'overridden', brief: request.brief, confirmedSelections: [] }, { signal: controller.signal });
    const [usedConfig, instruction, json, options] = answer.mock.calls[0];
    expect(usedConfig).toBe(config);
    expect(JSON.parse(json)).toEqual({ task: 'plan_design', brief: request.brief, confirmedSelections: [] });
    expect(options).toEqual({ signal: controller.signal });
    expect(instruction).toContain('12000'); expect(instruction).toContain('searches');
    expect(instruction).toContain('待获取'); expect(instruction).toContain('已确认');
    expect(instruction).toContain('正文'); expect(instruction).toContain('具体学习任务');
  });

  it.each([
    ['incomplete object', { subject: '声学' }],
    ['unexpected key', { ...plan(), score: 98 }],
    ['empty required text', { ...plan(), concept: '  ' }],
    ['invalid layer', { ...plan(), searches: [{ query: '传播', purpose: '机制', layer: 'whole-page' }] }],
    ['too many searches', { ...plan(), searches: Array.from({ length: 7 }, () => ({ query: '传播', purpose: '机制' })) }],
    ['oversized individual text', { ...plan(), composition: '长'.repeat(2001) }],
    ['oversized total result', { ...plan(), assets: Array.from({ length: 10 }, (_, index) => ({ name: `素材${index}`, acquisition: '取'.repeat(500), quality: '质'.repeat(450), fallback: '备'.repeat(450) })) }],
  ])('rejects %s', async (_label, value) => {
    answer.mockResolvedValue(JSON.stringify(value));
    await expect((await planning()).planDesign(config, {})).rejects.toMatchObject({ code: 'MODEL_DESIGN_PLAN_INVALID', status: 502 });
  });

  it.each([
    ['concept', '<script>alert(1)</script>'], ['concept', 'const x = window.location'], ['concept', '```js\nalert(1)\n```'],
    ['concept', 'document.body.innerHTML = input'], ['concept', 'fetch("https://example.com")'],
    ['concept', '已通过浏览器视觉验收，页面效果已验证'], ['concept', '主题素材已生成并保存在本地文件中'],
    ['concept', '素材已下载到本地'], ['concept', '素材已生成'],
    ['concept', '页面视觉验收合格，整体效果美观'],
  ])('rejects executable code or invented verification in %s: %s', async (field, value) => {
    answer.mockResolvedValue(JSON.stringify({ ...plan(), [field]: value }));
    await expect((await planning()).planDesign(config, {})).rejects.toMatchObject({ code: 'MODEL_DESIGN_PLAN_INVALID' });
  });

  it('checks nested asset, search, palette and acceptance text', async () => {
    const values = [
      { ...plan(), assets: [{ ...plan().assets[0], quality: '<img src=x onerror=alert(1)>' }] },
      { ...plan(), searches: [{ query: 'document.write(input)', purpose: '机制' }] },
      { ...plan(), style: { ...plan().style, palette: ['.background { color: red; }'] } },
      { ...plan(), acceptance: ['已完成真实页面测试'] },
    ];
    for (const value of values) {
      answer.mockResolvedValue(JSON.stringify(value));
      await expect((await planning()).planDesign(config, {})).rejects.toMatchObject({ code: 'MODEL_DESIGN_PLAN_INVALID' });
    }
  });

  it('returns a safe stage error for malformed JSON and incomplete adapter output', async () => {
    answer.mockResolvedValue('{"secret":"RAW_PRIVATE_CONTENT"');
    await expect((await planning()).planDesign(config, {})).rejects.toMatchObject({ code: 'MODEL_DESIGN_PLAN_INVALID', message: expect.not.stringContaining('RAW_PRIVATE_CONTENT') });
    answer.mockRejectedValue(new ApiError('RAW_PRIVATE_CONTENT', 502, 'MODEL_INVALID_RESPONSE'));
    await expect((await planning()).planDesign(config, {})).rejects.toMatchObject({ code: 'MODEL_DESIGN_PLAN_INVALID', message: expect.not.stringContaining('RAW_PRIVATE_CONTENT') });
  });
});

describe('bounded planning protocol correction', () => {
  it('recovers once from an incomplete object with the original context and safe schema feedback', async () => {
    const context = { brief: request.brief, confirmedSelections: [{ target: '输入框', preserve: ['正文稳定'] }], messages: [{ role: 'user', content: '只增强主题背景' }] };
    const original = structuredClone(context); const controller = new AbortController();
    answer.mockResolvedValueOnce(JSON.stringify({ subject: 'MODEL_ONLY_PRIVATE_OUTPUT' })).mockResolvedValueOnce(JSON.stringify(plan()));
    await expect(planDesign(config, context, { signal: controller.signal })).resolves.toEqual(plan());
    expect(answer).toHaveBeenCalledTimes(2);
    const [first, second] = answer.mock.calls.map(call => JSON.parse(call[2]));
    expect(first).toEqual({ ...context, task: 'plan_design' });
    expect(second).toEqual({ ...first, formatFeedback: expect.any(Object) });
    expect(second.formatFeedback.issues).toContainEqual({ path: ['userTask'], code: 'invalid_type' });
    expect(JSON.stringify(second.formatFeedback)).toContain('12000');
    expect(JSON.stringify(second.formatFeedback)).toContain('可执行代码');
    expect(JSON.stringify(second.formatFeedback)).toContain('验收');
    expect(JSON.stringify(second.formatFeedback)).not.toContain('MODEL_ONLY_PRIVATE_OUTPUT');
    expect(answer.mock.calls.every(call => call[3]?.signal === controller.signal)).toBe(true);
    expect(context).toEqual(original);
  });

  it('recovers once from malformed JSON without echoing private output in correction feedback', async () => {
    answer.mockResolvedValueOnce('{"PRIVATE_MODEL_OUTPUT":"secret"').mockResolvedValueOnce(JSON.stringify(plan()));
    await expect(planDesign(config, { brief: request.brief })).resolves.toEqual(plan());
    expect(answer).toHaveBeenCalledTimes(2);
    const feedback = JSON.parse(answer.mock.calls[1][2]).formatFeedback;
    expect(feedback).toMatchObject({ issues: [{ path: [], code: expect.any(String) }] });
    expect(JSON.stringify(feedback)).not.toMatch(/PRIVATE_MODEL_OUTPUT|secret/);
  });

  it('recovers once when the existing adapter rejects incomplete model output', async () => {
    answer.mockRejectedValueOnce(new ApiError('PRIVATE_ADAPTER_OUTPUT', 502, 'MODEL_INVALID_RESPONSE')).mockResolvedValueOnce(JSON.stringify(plan()));
    await expect(planDesign(config, {})).resolves.toEqual(plan());
    expect(answer).toHaveBeenCalledTimes(2);
    expect(answer.mock.calls[1][2]).not.toContain('PRIVATE_ADAPTER_OUTPUT');
    expect(JSON.parse(answer.mock.calls[1][2]).formatFeedback).toMatchObject({ issues: [{ path: [], code: expect.any(String) }] });
  });

  it('fails safely after two invalid results without further model calls', async () => {
    answer.mockResolvedValue(JSON.stringify({ subject: 'PRIVATE_INVALID_OUTPUT' }));
    await expect(planDesign(config, {})).rejects.toMatchObject({ code: 'MODEL_DESIGN_PLAN_INVALID', message: expect.not.stringContaining('PRIVATE_INVALID_OUTPUT') });
    expect(answer).toHaveBeenCalledTimes(2);
    expect(answer.mock.calls[1][2]).not.toContain('PRIVATE_INVALID_OUTPUT');
  });

  it.each(['MODEL_UNAVAILABLE', 'MODEL_HTTP_ERROR', 'MODEL_TIMEOUT'])('does not retry a %s service error', async code => {
    const error = new ApiError('服务暂时不可用', 502, code); answer.mockRejectedValue(error);
    await expect(planDesign(config, {})).rejects.toBe(error);
    expect(answer).toHaveBeenCalledOnce();
  });

  it('does not start a correction after cancellation even when the returned JSON is invalid', async () => {
    const controller = new AbortController();
    answer.mockImplementation(async () => { controller.abort(new DOMException('已取消', 'AbortError')); return '{}'; });
    await expect(planDesign(config, {}, { signal: controller.signal })).rejects.toBe(controller.signal.reason);
    expect(answer).toHaveBeenCalledOnce();
  });
});

describe('design prompt text review', () => {
  it('accepts pass with no issues and supplies only the actual review context', async () => {
    answer.mockResolvedValue(JSON.stringify(passed())); const context = reviewContext();
    await expect((await planning()).reviewDesignPrompt(config, context)).resolves.toEqual(passed());
    const [, instruction, json, options] = answer.mock.calls[0];
    expect(JSON.parse(json)).toEqual({ ...context, request: { ...request, messages: [] }, task: 'review_design_prompt' });
    expect(options).toEqual({ signal: undefined });
    expect(instruction).toContain('文字审查'); expect(instruction).toContain('实际页面');
    expect(instruction).toContain('摘录'); expect(instruction).toContain('referenceDetails');
    expect(instruction).toContain('已确认'); expect(instruction).toContain('审美分数');
  });

  it('accepts revise only with issues quoting actual draft text', async () => {
    answer.mockResolvedValue(JSON.stringify(revise()));
    await expect((await planning()).reviewDesignPrompt(config, reviewContext())).resolves.toEqual(revise());
  });

  it('sends all user constraints while excluding old assistant drafts and unrelated request metadata', async () => {
    const context = reviewContext();
    const userMessages = [
      { role: 'user' as const, content: '最早明确约束：' + '输入和正文必须稳定。'.repeat(1000) },
      { role: 'user' as const, content: '最新明确要求：保留确认的背景对象、作用层与暂停行为。' },
    ];
    context.request = { ...request, conversationId: 'not-needed-for-review', messages: [
      userMessages[0], { role: 'assistant', content: 'OLD_ASSISTANT_DRAFT_1'.repeat(500) },
      userMessages[1], { role: 'assistant', content: 'OLD_ASSISTANT_DRAFT_2'.repeat(500) },
    ] };
    answer.mockResolvedValue(JSON.stringify(passed()));
    await reviewDesignPrompt(config, context);
    const sent = JSON.parse(answer.mock.calls[0][2]);
    expect(sent.request).toEqual({ brief: request.brief, selections: request.selections, messages: userMessages });
    expect(sent.draft).toEqual(draft);
    expect(answer.mock.calls[0][2]).not.toContain('OLD_ASSISTANT_DRAFT');
    expect(context.request.messages).toHaveLength(4);
  });

  it('limits text review to material blockers and permits equivalent plan adaptation', async () => {
    answer.mockResolvedValue(JSON.stringify(passed()));
    await reviewDesignPrompt(config, reviewContext());
    const instruction = answer.mock.calls[0][1];
    expect(instruction).toContain('阻断');
    expect(instruction).toContain('等价适配');
    expect(instruction).toContain('附加功能');
    expect(instruction).toContain('弱网');
    expect(instruction).toContain('微参数');
  });

  it('supplies original issues for re-review without sending old assistant drafts', async () => {
    const previousIssues = revise().issues;
    const context = { ...reviewContext(), previousIssues, request: { ...request, messages: [
      { role: 'user' as const, content: '保留输入稳定，只修改首屏背景' },
      { role: 'assistant' as const, content: 'OLD_ASSISTANT_PROMPT_SHOULD_NOT_BE_REPEATED' },
    ] } };
    answer.mockResolvedValue(JSON.stringify(passed()));
    await reviewDesignPrompt(config, context);
    const [, instruction, json] = answer.mock.calls[0]; const sent = JSON.parse(json);
    expect(sent.previousIssues).toEqual(previousIssues);
    expect(sent.request.messages).toEqual([context.request.messages[0]]);
    expect(sent.draft).toEqual(draft);
    expect(json).not.toContain('OLD_ASSISTANT_PROMPT_SHOULD_NOT_BE_REPEATED');
    expect(instruction).toContain('previousIssues');
    expect(instruction).toContain('实质回归');
  });

  it.each([
    '页面视觉验收合格，整体效果美观',
    '实际页面验证成功。',
    '浏览器视觉检查通过。',
    '渲染视觉验收成功。',
    '通过了实际页面的视觉验收。',
    '化学反应页面视觉验收合格。',
  ])('rejects unsupported successful visual verification without an already marker: %s', async summary => {
    answer.mockResolvedValue(JSON.stringify({ ...passed(), summary }));
    await expect(reviewDesignPrompt(config, reviewContext())).rejects.toMatchObject({ code: 'MODEL_DESIGN_REVIEW_INVALID' });
  });

  it.each([
    '仅文字审查，尚未渲染实际页面。',
    '请在实现后于真实浏览器中检查并确保页面视觉验收合格。',
    '下游必须通过浏览器视觉验收后才可交付。',
    '实际页面视觉验收通过后才可交付。',
    '待渲染完成后确认页面视觉检查是否合格。',
    '下游需通过浏览器视觉验收。',
  ])('allows honest boundaries and future visual acceptance requirements: %s', async summary => {
    answer.mockResolvedValue(JSON.stringify({ ...passed(), summary }));
    await expect(reviewDesignPrompt(config, reviewContext())).resolves.toMatchObject({ summary });
  });

  it.each([
    ['pass with issues', { ...revise(), verdict: 'pass' }],
    ['revise without issues', { ...passed(), verdict: 'revise' }],
    ['fabricated evidence', { ...revise(), issues: [{ ...revise().issues[0], evidence: '输入框持续翻转' }] }],
    ['empty evidence', { ...revise(), issues: [{ ...revise().issues[0], evidence: '  ' }] }],
    ['oversized evidence', { ...revise(), issues: [{ ...revise().issues[0], evidence: '波'.repeat(401) }] }],
    ['unexpected score', { ...passed(), aestheticScore: 98 }],
    ['fake visual verification', { ...passed(), summary: '已通过浏览器验收，实际页面美观。' }],
  ])('rejects %s', async (_label, value) => {
    answer.mockResolvedValue(JSON.stringify(value));
    await expect((await planning()).reviewDesignPrompt(config, reviewContext())).rejects.toMatchObject({ code: 'MODEL_DESIGN_REVIEW_INVALID', status: 502 });
  });

  it('allows an issue to quote and flag an unsupported draft verification claim', async () => {
    const context = reviewContext(); context.draft = { ...draft, developerPrompt: `${draft.developerPrompt}已通过浏览器验收。` };
    const value = { ...revise(), issues: [{ category: 'delivery', problem: '草稿宣称的浏览器验收没有来源支持', evidence: '已通过浏览器验收。', fix: '改为要求实现后在真实页面核对，不宣称当前已完成' }] };
    answer.mockResolvedValue(JSON.stringify(value));
    await expect((await planning()).reviewDesignPrompt(config, context)).resolves.toEqual(value);
  });

  it('returns a safe review error for invalid JSON', async () => {
    answer.mockResolvedValue('RAW_PRIVATE_CONTENT');
    await expect((await planning()).reviewDesignPrompt(config, reviewContext())).rejects.toMatchObject({ code: 'MODEL_DESIGN_REVIEW_INVALID', message: expect.not.stringContaining('RAW_PRIVATE_CONTENT') });
    expect(answer).toHaveBeenCalledOnce();
  });
});

describe('planning and review cancellation', () => {
  it.each(['plan', 'review'] as const)('does not invoke the model when %s is already aborted', async kind => {
    const controller = new AbortController(); controller.abort(new DOMException('已取消', 'AbortError')); const module = await planning();
    const promise = kind === 'plan' ? module.planDesign(config, {}, { signal: controller.signal }) : module.reviewDesignPrompt(config, reviewContext(), { signal: controller.signal });
    await expect(promise).rejects.toBe(controller.signal.reason); expect(answer).not.toHaveBeenCalled();
  });

  it.each(['plan', 'review'] as const)('honors cancellation after %s returns before accepting any output', async kind => {
    const controller = new AbortController(); answer.mockImplementation(async () => { controller.abort(new DOMException('已取消', 'AbortError')); return 'invalid JSON'; });
    const module = await planning(); const promise = kind === 'plan' ? module.planDesign(config, {}, { signal: controller.signal }) : module.reviewDesignPrompt(config, reviewContext(), { signal: controller.signal });
    await expect(promise).rejects.toBe(controller.signal.reason);
  });

  it.each(['plan', 'review'] as const)('preserves cancellation if the adapter wraps an aborted %s request', async kind => {
    const controller = new AbortController(); answer.mockImplementation(async () => { controller.abort(new DOMException('已取消', 'AbortError')); throw new ApiError('连接中断', 502, 'MODEL_UNAVAILABLE'); });
    const module = await planning(); const promise = kind === 'plan' ? module.planDesign(config, {}, { signal: controller.signal }) : module.reviewDesignPrompt(config, reviewContext(), { signal: controller.signal });
    await expect(promise).rejects.toBe(controller.signal.reason);
  });
});
