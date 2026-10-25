import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import type { ComponentImplementation, DesignBasis, DesignLibrary, PageRecipe } from '../shared/design-library';
import type { CatalogEntry, DemoRequest } from '../shared/types';
import { selectionLayer } from '../shared/selection';
import { motionIntensity } from '../shared/motion';
import { ApiError, isReady, normalizeUrl } from './core';

const text = z.string().trim().min(1);
const texts = z.array(text);
const id = text.regex(/^[a-z0-9][a-z0-9-]*$/);
const strings = z.record(z.string(), z.string());
const assetPath = (directory: string, extension: RegExp) => text.refine(value => value.startsWith(`design-library/${directory}/`) && !value.includes('\\') && !value.split('/').some(part => !part || part === '.' || part === '..') && extension.test(value), '非法资产路径');
const pageSchema = z.object({
  id, title: text, description: text, aliases: texts, purpose: text, features: texts,
  sections: z.array(z.object({ id, title: text, purpose: text })),
  tokens: z.object({ colors: strings, fonts: strings, spacing: z.array(z.number().nonnegative()), radius: z.number().nonnegative() }),
  interactions: z.array(z.object({ name: text, trigger: text, result: text })),
  componentIds: texts, referenceEntryIds: texts, pairingRules: texts,
  htmlPath: assetPath('pages', /\.html$/), posterPath: assetPath('previews', /\.(?:png|jpe?g|webp|svg)$/),
});
const componentSchema = z.object({
  id, title: text, entryId: text, sourceUrl: z.string().url().refine(value => /^https?:\/\//.test(value)), description: text,
  layer: z.enum(['layout', 'surface', 'border', 'outer-glow', 'page-background', 'text', 'content']),
  parameters: strings, compatibleWith: texts, conflicts: texts, mobileBehavior: text, reducedMotion: text, limitations: texts,
  code: z.object({ html: text, css: z.string(), js: z.string() }),
  htmlPath: assetPath('components', /\.html$/), posterPath: assetPath('previews', /\.(?:png|jpe?g|webp|svg)$/),
});
const invalid = () => new ApiError('本地设计库资料或资产路径无效。', 500, 'DESIGN_LIBRARY_INVALID');
function inside(root: string, file: string): boolean { const relative = path.relative(root, file); return relative !== '' && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative); }
async function readLocal(rootDir: string, relative: string): Promise<string> {
  // Runtime assets are copied explicitly; tracing this trusted root would include unrelated files.
  const root = await realpath(/* turbopackIgnore: true */ rootDir);
  const file = await realpath(/* turbopackIgnore: true */ path.resolve(rootDir, relative));
  const directory = relative.startsWith('data/') ? 'data' : relative.split('/').slice(0, 2).join('/');
  if (!inside(root, file) || !inside(path.join(root, directory), file)) throw invalid();
  return readFile(file, 'utf8');
}
async function readMetadata<T extends { id: string }>(rootDir: string, name: string, schema: z.ZodType<T>): Promise<T[]> {
  let content: string;
  try { content = await readLocal(rootDir, `data/${name}`); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []; throw error; }
  try {
    const values = z.array(schema).parse(JSON.parse(content));
    if (new Set(values.map(item => item.id)).size !== values.length) throw invalid();
    return values;
  } catch { throw invalid(); }
}
export async function loadDesignLibrary(rootDir: string): Promise<DesignLibrary> {
  const [pages, components] = await Promise.all([readMetadata(rootDir, 'design-pages.json', pageSchema), readMetadata(rootDir, 'design-components.json', componentSchema)]);
  return { pages, components };
}

export function designDeveloperPrompt(item: PageRecipe | ComponentImplementation, components: ComponentImplementation[] = []): string {
  const boundary = '这是本项目整理的原生 HTML/CSS/经典 JavaScript 适配示例，非原组件源码；无外部依赖。结果须标为演示，不声称已调用真实智能体或已完成浏览器验收。';
  if ('purpose' in item) return [
    `实现「${item.title}」，用途：${item.purpose}。${item.description}`,
    `功能：${item.features.join('、')}。分区：${item.sections.map(section => `${section.id}：${section.title}，${section.purpose}`).join('；')}。`,
    `设计参数：颜色 ${JSON.stringify(item.tokens.colors)}；字体 ${JSON.stringify(item.tokens.fonts)}；间距 ${item.tokens.spacing.join('/')}px；圆角 ${item.tokens.radius}px。`,
    `实际交互：${item.interactions.map(interaction => `${interaction.name}：${interaction.trigger} → ${interaction.result}`).join('；')}。`,
    `组合与保留：${item.pairingRules.join('；')}。保持 surface、border、outer-glow 各层范围；只修改明确指定对象，保留其余功能与材质。`,
    `参考来源：${components.filter(component => item.componentIds.includes(component.id)).map(component => `${component.entryId} ${component.sourceUrl}（${component.limitations.join('；')}）`).join('；') || '本地整页设计范例；来源定位见 referenceEntryIds，不假称原站整页复刻。'}`,
    boundary,
  ].join('\n');
  return [
    `实现「${item.title}」：${item.description}。真实来源：${item.sourceUrl}；案例 ID：${item.entryId}。`,
    `仅作用于 ${item.layer}；参数 ${JSON.stringify(item.parameters)}。兼容 ${item.compatibleWith.join('、') || '按明确对象与层判断'}；冲突 ${item.conflicts.join('；') || '无额外声明'}。`,
    `移动端：${item.mobileBehavior}。减少动态：${item.reducedMotion}。限制：${item.limitations.join('；')}。`, boundary,
  ].join('\n');
}
export async function readDesignExample(rootDir: string, kind: 'page' | 'component', exampleId: string): Promise<{ item: PageRecipe | ComponentImplementation; html: string; developerPrompt: string }> {
  const library = await loadDesignLibrary(rootDir);
  const item = (kind === 'page' ? library.pages : library.components).find(value => value.id === exampleId);
  if (!item) throw new ApiError('设计范例不存在。', 404, 'DESIGN_EXAMPLE_NOT_FOUND');
  return { item, html: await readLocal(rootDir, item.htmlPath), developerPrompt: designDeveloperPrompt(item, library.components) };
}

const purposes = [
  /知识|问答|检索|文档|课程资料|查资料|资料出处|资料来源|答案来源|答案来自|knowledge|\bsearch\b/i,
  /工具|导航|多智能体|门户|智能体广场|分类|tool|launcher/i,
  /写作|创作|编辑|文案|润色|改写|writing|editor/i,
  /仪表盘|数据|分析|监控|dashboard|analytics/i,
  /流程|步骤|工作流|报告|汇报|分步|workflow|step|report/i,
  /品牌|产品介绍|落地页|宣传|landing|marketing/i,
  /聊天|对话|会话|\bchat\b|conversation/i,
];
function purposeGroups(value: string): number[] { return purposes.flatMap((pattern, index) => pattern.test(value) ? [index] : []); }
function nameScore(page: PageRecipe, value: string): number {
  const lower = value.toLowerCase();
  return Math.max(0, ...[page.id, page.title, ...page.aliases].map((name, index) => lower.includes(name.toLowerCase()) ? (index < 2 ? 100 : 30) + name.length : 0));
}
function pickPage(pages: PageRecipe[], request: DemoRequest): PageRecipe | undefined {
  if (request.task === 'revise_demo') {
    const plan = request.previous?.pagePlan;
    if (!plan) return undefined;
    const previousText = [plan.summary, plan.layout, plan.visualStyle, ...plan.features].join(' ');
    const named = pages.map(page => ({ page, score: nameScore(page, previousText) })).sort((a, b) => b.score - a.score)[0];
    if (named?.score) return named.page;
    const groups = purposeGroups(previousText);
    return pages.find(page => purposeGroups(page.purpose).some(group => groups.includes(group)));
  }
  const messages = [...(request.messages || [])].reverse().filter(message => message.role === 'user').map(message => message.content);
  const intensity = motionIntensity(request);
  for (const value of [request.changeRequest || '', ...messages, request.brief]) {
    if (!value.trim()) continue;
    const purposeText = value.split(/[，,。；;\n]/).filter(clause => !/^\s*(?:参考|借鉴|模仿|搭配)/.test(clause)).join(' ');
    const groups = purposeGroups(purposeText);
    const eligible = pages.filter(page => (!groups.length || purposeGroups(page.purpose).some(group => groups.includes(group))) && (intensity === 'expressive' || page.id !== 'knowledge-motion'));
    const named = eligible.map(page => ({ page, score: nameScore(page, value) })).sort((a, b) => b.score - a.score)[0];
    const expressivePage = intensity === 'expressive' && groups.includes(0) ? eligible.find(page => page.id === 'knowledge-motion') : undefined;
    if (expressivePage && (!named?.score || named.score < 100)) return expressivePage;
    if (named?.score) return named.page;
    if (groups.length) return (intensity === 'expressive' ? eligible.find(page => page.id === 'knowledge-motion') : undefined) || eligible[0];
  }
  return undefined;
}

export async function selectDesignBasis(rootDir: string, request: DemoRequest, entries: CatalogEntry[]): Promise<DesignBasis> {
  const library = await loadDesignLibrary(rootDir);
  const ready = new Map(entries.filter(isReady).map(entry => [entry.id, entry]));
  const recipe = pickPage(library.pages, request);
  const explicit = request.selections;
  const previousEffects = request.previous?.pagePlan?.effects || [];
  const allowed = library.components.filter(component => {
    const source = ready.get(component.entryId);
    if (!source || normalizeUrl(source.sourceUrl) !== normalizeUrl(component.sourceUrl)) return false;
    const selections = explicit.filter(selection => selection.entryId === component.entryId);
    return !selections.length || selections.some(selection => selectionLayer(selection) === component.layer);
  });
  const confirmed = [
    ...explicit.flatMap(selection => allowed.filter(component => component.entryId === selection.entryId && component.layer === selectionLayer(selection))),
    ...previousEffects.flatMap(effect => allowed.filter(component => component.entryId === effect.referenceEntryId && component.layer === effect.layer)),
  ];
  let selectedRecipe: DesignBasis['selectedRecipe'] = null;
  const codeBudget = motionIntensity(request) === 'expressive' ? 45000 : 30000;
  const nativeImplementations: DesignBasis['nativeImplementations'] = [];
  const basis = (page = selectedRecipe, native = nativeImplementations): DesignBasis => ({ selectedRecipe: page, nativeImplementations: native, referenceEntryIds: [...new Set([...(page?.referenceEntryIds || []), ...native.map(component => component.entryId)])] });
  const appendNative = (component: ComponentImplementation) => {
    if (nativeImplementations.length >= 3 || nativeImplementations.some(item => item.id === component.id)) return;
    const { htmlPath: _htmlPath, posterPath: _posterPath, ...metadata } = component;
    if (JSON.stringify(basis(selectedRecipe, [...nativeImplementations, metadata])).length <= codeBudget) nativeImplementations.push(metadata);
  };
  for (const component of confirmed) appendNative(component);
  if (recipe) {
    const html = request.task === 'revise_demo' ? '' : await readLocal(rootDir, recipe.htmlPath);
    const { htmlPath: _htmlPath, posterPath: _posterPath, ...metadata } = recipe;
    const page = { ...metadata, referenceEntryIds: metadata.referenceEntryIds.filter(id => ready.has(id)), html };
    if (JSON.stringify(basis(page)).length <= codeBudget) selectedRecipe = page;
  }
  if (request.task === 'generate_demo' && recipe) {
    for (const componentId of recipe.componentIds) for (const component of allowed.filter(component => component.id === componentId)) appendNative(component);
  }
  return basis();
}
