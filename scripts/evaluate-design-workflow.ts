import 'dotenv/config';
import { AsyncLocalStorage } from 'node:async_hooks';
import { copyFile, cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { generateDesignPrompt } from '../server/design-prompt';
import { modelFromEnvironment } from '../server/model';
import type { CatalogEntry } from '../shared/types';

// Isolated history: running this evaluation never changes the user's recent selections.
const scenarios = [
  { id: 'chemistry', brief: '我想做大学有机化学学习助手，帮助学生看懂分子结构与反应条件，能提问、查反应资料、做小练习和复习错题。打开要有明显而精致的动态主视觉，像在探索化学现象，别做成普通后台，也别只有漂浮卡片。请根据这个任务自己决定构图和风格，从参考库选择合适效果。题目、公式和输入稳定清晰，手机能用，带暂停入口，先做明确标注的交互演示。' },
  { id: 'physics', brief: '我想做大学物理波动与光学学习助手，让学生调整条件观察波的叠加、干涉和变化，也能提问、阅读讲解和做练习。页面要有很强但精致的动态效果，主视觉能表达这个学习任务。布局、配色和材质由你设计，充分利用参考库，避免泛用科技背景堆卡片。阅读和操作保持稳定，手机能用，能暂停，资料与实验先标明示意演示。' },
  { id: 'history', brief: '我想做丝绸之路历史学习助手，帮助学生按时代探索地点、人物与贸易文化的联系，可以查看史料卡、提问和做小练习。希望页面有鲜明历史气质和很强的动态表现，打开就吸引人，具体构图和风格由你决定，效果从参考库按需挑选。不要让所有内容堆在一个长页面，也不要普通后台。史料、题目和输入要稳，手机可用，提供暂停，先用明确标注的演示资料。' },
  { id: 'poetry', brief: '我想做古诗词阅读学习助手，学生可以选诗、读原文、查看意象和注释，也能提问、做赏析练习。希望很有诗意又有明显的高级动效，主视觉与诗歌阅读本身有关，具体页面结构与美术方向由你决定，从参考库里找真正适合的效果。诗句和注释必须清楚稳定，手机可用，有暂停，内容先用明确标注的演示数据，不接真实模型。' },
  { id: 'ecology', brief: '我想做大学生态学学习助手，帮助学生理解食物网、种群变化以及生态系统中的相互影响，能探索关系、查看说明、提问和做小练习。希望主视觉生动、有很强且精致的动态效果，一眼能看出是生态主题；请自己设计合适的构图和材质，按需使用参考库。不要照搬其他学科的球体加卡片，文字与操作稳定，手机可用，有暂停，数据明确标注为示意。' },
];
const requested = new Set(process.argv.slice(2));
const cases = scenarios.filter(test => !requested.size || requested.has(test.id));
if (!cases.length) throw Error('请选择 chemistry、physics、history、poetry 或 ecology。');

const model = modelFromEnvironment();
if (model?.provider !== 'deepseek') throw Error('请先在服务端配置 DeepSeek；本脚本不读取或输出凭据。');
const output = path.resolve('artifacts/design-workflow-evaluation', 'run-' + Date.now().toString(36));
await mkdir(output, { recursive: true });
console.log(JSON.stringify({ output, cases: cases.map(test => test.id) }));
const root = await mkdtemp(path.join(tmpdir(), 'design-workflow-evaluation-'));
const entries: CatalogEntry[] = JSON.parse(await readFile('data/catalog.json', 'utf8'));
await mkdir(path.join(root, 'data/case-knowledge'), { recursive: true });
for (const source of ['reactbits', 'aceternity', '60fps']) await copyFile(`data/case-knowledge/${source}.json`, path.join(root, `data/case-knowledge/${source}.json`));
for (const name of ['design-pages.json', 'design-components.json']) await copyFile(`data/${name}`, path.join(root, 'data', name));
await cp('design-library/pages', path.join(root, 'design-library/pages'), { recursive: true });

type Trace = { id: string; requests: { task: string; requestCharacters: number; fixedCharacters: number; preloadedCount: number; readIds: string[]; toolCalls: { name: string; args: unknown }[] }[]; plan?: unknown; issues?: unknown };
const active = new AsyncLocalStorage<Trace>();
const nativeFetch = globalThis.fetch;
const captures: Promise<unknown>[] = [];
globalThis.fetch = async (input, init) => {
  const trace = active.getStore();
  let task = '';
  if (trace && typeof init?.body === 'string') {
    const body = JSON.parse(init.body);
    const context = JSON.parse(body.messages.find((message: any) => message.role === 'user').content);
    task = context.task;
    if (context.designPlan) trace.plan = context.designPlan;
    if (context.designReview) trace.issues = context.designReview.issues;
    const tools = body.messages.filter((message: any) => message.role === 'tool').map((message: any) => JSON.parse(message.content));
    trace.requests.push({ task: context.task, requestCharacters: init.body.length, fixedCharacters: body.messages[0].content.length + JSON.stringify(body.tools || []).length, preloadedCount: context.availableCatalog?.length || 0,
      readIds: [...new Set<string>([...(context.availableCatalog || []).map((entry: any) => entry.id), ...tools.flatMap((tool: any) => (tool.availableCatalog || []).map((entry: any) => entry.id))])],
      toolCalls: body.messages.filter((message: any) => message.role === 'assistant').flatMap((message: any) => (message.tool_calls || []).map((call: any) => ({ name: call.function.name, args: JSON.parse(call.function.arguments) }))),
    });
    // Only record safe request metrics and tool arguments, never authorization or reasoning.
    await writeFile(path.join(output, trace.id + '-trace.json'), JSON.stringify(trace, null, 2));
    console.log(JSON.stringify({ case: trace.id, task: context.task, request: trace.requests.length }));
  }
  const response = await nativeFetch(input, init);
  if (trace && task) {
    const requestNumber = trace.requests.length;
    const capture = response.clone().text().then(async raw => {
      // Persist formal JSON only; discard reasoning even when diagnosing a rejected plan.
      const content = response.headers.get('content-type')?.includes('text/event-stream')
        ? raw.split(/\r?\n\r?\n/).flatMap(frame => frame.split(/\r?\n/).filter(line => line.startsWith('data:')).map(line => line.slice(5).trim())).filter(data => data && data !== '[DONE]').map(data => JSON.parse(data).choices?.[0]?.delta?.content || '').join('')
        : JSON.parse(raw).choices?.[0]?.message?.content;
      if (typeof content === 'string' && content.trim()) await writeFile(path.join(output, trace.id + '-' + task + '-' + requestNumber + '-response.json'), content);
    }).catch(() => undefined);
    captures.push(capture);
  }
  return response;
};

const results: Record<string, unknown>[] = [];
try {
  // Two independent requests at a time, sharing only the isolated atomic history.
  for (let start = 0; start < cases.length; start += 2) await Promise.all(cases.slice(start, start + 2).map(test => active.run({ id: test.id, requests: [] }, async () => {
    const trace = active.getStore()!;
    const started = Date.now();
    try {
      const result = await generateDesignPrompt(model, { brief: test.brief, selections: [], conversationId: 'evaluation-' + test.id }, entries, root);
      const writerRounds = trace.requests.filter(request => request.task === 'generate_prompt');
      const readIds = new Set(writerRounds.flatMap(round => round.readIds));
      const checks = { id: test.id, passed: !!result.designProcess?.reviewed && result.referenceEntryIds.every(id => readIds.has(id)), durationMs: Date.now() - started, providerRequests: trace.requests.length, chosenReferences: result.referenceEntryIds, allChosenRead: result.referenceEntryIds.every(id => readIds.has(id)), firstRequestCharacters: trace.requests[0]?.requestCharacters, writerFixedCharacters: writerRounds[0]?.fixedCharacters, promptCharacters: result.developerPrompt.length, ...result.designProcess };
      await writeFile(path.join(output, test.id + '-result.json'), JSON.stringify({ request: test.brief, checks, result }, null, 2));
      await writeFile(path.join(output, test.id + '-prompt.md'), result.developerPrompt);
      results.push(checks);
      console.log(JSON.stringify(checks));
    } catch (error) {
      const failure = { id: test.id, passed: false, durationMs: Date.now() - started, providerRequests: trace.requests.length, code: (error as { code?: string }).code || 'EVALUATION_FAILED' };
      results.push(failure);
      await writeFile(path.join(output, test.id + '-failure.json'), JSON.stringify(failure, null, 2));
      console.log(JSON.stringify(failure));
    }
    await writeFile(path.join(output, 'report.json'), JSON.stringify({ model: model.name, passed: results.filter(result => result.passed).length, total: cases.length, renderedPageVerified: false, results }, null, 2));
  })));
} finally {
  globalThis.fetch = nativeFetch;
  await Promise.all(captures);
  await rm(root, { recursive: true, force: true });
}
if (results.some(result => !result.passed)) process.exitCode = 1;
