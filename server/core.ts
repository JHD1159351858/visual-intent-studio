import { createHash } from 'node:crypto';
import { z } from 'zod';
import type { CatalogEntry, RecommendationRequest, RecommendationResponse, ExportRequest } from '../shared/types';
import { selectionKey, selectionLayer, selectionTarget } from '../shared/selection';

export class ApiError extends Error {
  constructor(message: string, public status = 400, public code = 'INVALID_REQUEST') { super(message); }
}
export const stageSchema = z.enum(['structure', 'style', 'effect']);
export const selectionSchema = z.object({ entryId: z.string().min(1), stage: stageSchema, placement: z.string().max(3000), adjustments: z.string().max(5000), target: z.string().trim().min(1).max(3000).optional(), layer: z.enum(['layout', 'surface', 'border', 'outer-glow', 'page-background', 'text', 'content']).optional(), operation: z.enum(['add', 'replace']).optional(), preserve: z.array(z.string().max(500)).max(50).optional() });
export const recommendationSchema = z.object({ description: z.string().min(1).max(12000), stage: stageSchema, selections: z.array(selectionSchema).max(100), excludedIds: z.array(z.string()).max(1000), messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(12000) })).max(40).optional() });
export const exportSchema = z.object({ brief: z.string().max(12000), selections: z.array(selectionSchema).max(100), messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(12000) })).max(40).optional() }).refine(value => !!value.brief.trim() || value.selections.length > 0);
export function normalizeUrl(value: string): string {
  const url = new URL(value);
  url.hash = '';
  url.hostname = url.hostname.replace(/^www\./, '');
  url.pathname = url.pathname.replace(/\/+$/, '') || '/';
  for (const key of [...url.searchParams.keys()]) if (/^utm_/i.test(key) || ['fbclid', 'gclid'].includes(key)) url.searchParams.delete(key);
  url.searchParams.sort();
  return url.toString().replace(/\/$/, '');
}
export function stableId(sourceUrl: string): string { return createHash('sha256').update(normalizeUrl(sourceUrl)).digest('hex').slice(0, 16); }
export function mergeEntries(previous: CatalogEntry[], incoming: CatalogEntry[]): CatalogEntry[] {
  const entries = new Map(previous.map(entry => [normalizeUrl(entry.sourceUrl), entry]));
  for (const fresh of incoming) {
    const key = normalizeUrl(fresh.sourceUrl);
    const old = entries.get(key);
    const keepPreview = old?.preview.type === 'video' && old.preview.verified && (old.preview.url.startsWith('/media/') || (fresh.preview.type === 'video' && fresh.preview.url === old.preview.url));
    const curated = old?.curation || (keepPreview && old.status === 'ready' && old.preview.provenance === 'reference-recording');
    entries.set(key, { ...fresh, sourceUrl: key, id: old?.id ?? fresh.id, aliases: old?.aliases ?? fresh.aliases, userNotes: old?.userNotes ?? fresh.userNotes, ...(keepPreview ? { preview: old.preview, stage: old.stage, status: 'ready' as const } : {}), ...(curated ? { title: old.title, description: old.description, trigger: old.trigger, placements: old.placements, tags: old.tags, stage: old.stage, ...(old.curation ? { curation: old.curation } : {}) } : {}) });
  }
  return [...entries.values()];
}
export function isReady(entry: CatalogEntry): boolean { return entry.status === 'ready' && entry.preview.type === 'video' && entry.preview.verified; }
export function eligibleEntries(entries: CatalogEntry[], request: RecommendationRequest): CatalogEntry[] {
  const excluded = new Set([...request.excludedIds, ...request.selections.map(selection => selection.entryId)]);
  return entries.filter(entry => isReady(entry) && entry.stage === request.stage && !excluded.has(entry.id));
}
export function validateRecommendation(value: unknown, entries: CatalogEntry[]): RecommendationResponse {
  const parsed = z.object({ message: z.string().min(1).max(10000), candidates: z.array(z.object({ entryId: z.string().min(1), reason: z.string().min(1).max(2000) })).max(100) }).safeParse(value);
  if (!parsed.success) throw new ApiError('模型返回格式不正确，请重试。', 502, 'MODEL_INVALID_RESPONSE');
  const valid = new Set(entries.filter(isReady).map(entry => entry.id));
  const seen = new Set<string>();
  const candidates = parsed.data.candidates.filter(candidate => {
    if (!valid.has(candidate.entryId)) throw new ApiError('模型返回了不可用的目录 ID，请重试。', 502, 'MODEL_INVALID_ID');
    if (seen.has(candidate.entryId)) return false;
    seen.add(candidate.entryId);
    return true;
  }).slice(0, 3);
  return { mode: 'model', message: parsed.data.message, candidates };
}
const labels = { structure: '页面结构', style: '视觉风格', effect: '交互特效' };
export function buildExport(request: ExportRequest, entries: CatalogEntry[]): string {
  const parsed = exportSchema.safeParse(request);
  if (!parsed.success) throw new ApiError('请先填写页面目标或确认一个参考，并填写有效的导出内容。');
  const seen = new Set<string>();
  const blocks = parsed.data.selections.flatMap(selection => {
    const entry = entries.find(item => item.id === selection.entryId);
    if (!entry || !isReady(entry) || entry.stage !== selection.stage) throw new ApiError('已确认的条目不存在、阶段不一致或预览不可用，请重新确认。');
    const key = selectionKey(selection);
    if (seen.has(key)) return [];
    seen.add(key);
    return [`### ${labels[entry.stage]}：${entry.title}（${entry.name}）\n\n- 可见行为：${entry.description}\n- 触发方式：${entry.trigger}\n- 来源：${entry.sourceUrl}\n- 实现参考：${entry.implementationUrl || '未提供源码；以来源页面的视觉行为为参考'}\n- 视频参考：${entry.preview.url}\n- 视频说明：${entry.preview.provenance === 'reference-recording' ? '本地参考复现录像，非原站原版' : entry.preview.provenance === 'source-recording' ? '原站演示的浏览器实录' : '原站视频'}\n- 使用位置：${selection.placement.trim() || '未填写'}\n- 调整要求：${selection.adjustments.trim() || '未填写'}`];
  });
  const scopeLabels = { layout: '布局', surface: '内部表面', border: '边框', 'outer-glow': '外侧光晕', 'page-background': '页面背景', text: '文字', content: '内容区域' };
  const scopes = parsed.data.selections.map(selection => `- ${selectionTarget(selection)}：${scopeLabels[selectionLayer(selection)]}；${selection.operation === 'replace' || (!selection.operation && selection.stage === 'structure') ? '替换' : '叠加'}${selection.preserve?.length ? `；保留 ${selection.preserve.join('、')}` : ''}`).join('\n');
  const later = parsed.data.messages?.filter(message => message.role === 'user' && message.content.trim() !== parsed.data.brief.trim()).map(message => `- ${message.content}`).join('\n');
  return `# 已确认的页面设计需求\n\n按以下已确认需求实现页面；未确认内容不要自行加入。\n\n## 原始需求\n\n${parsed.data.brief.trim() || '未填写'}\n\n${later ? `## 后续用户补充（原文，需结合已确认选择判断）\n\n${later}\n\n` : ''}## 作用范围与组合\n\n${scopes || '尚未确认具体案例，不预设组件或额外效果。'}\n\n## 已确认内容\n\n${blocks.join('\n\n') || '以上方用户填写的页面需求为准，具体视觉案例待选择。'}\n`;
}

