import { z } from 'zod';
import type { CatalogEntry } from '../shared/types';
import type { CaseKnowledge } from '../shared/case-knowledge';
import type { AgentTool } from './agent-tools';
import { ApiError, isReady, normalizeUrl, stageSchema } from './core';
import { visualFamiliesFor } from './selection-diversity';

const layerNames = ['layout', 'surface', 'border', 'outer-glow', 'page-background', 'text', 'content'] as const;
const refKey = z.string().trim().min(1).max(120);
const searchSchema = z.object({ query: z.string().trim().min(1).max(1200), stage: stageSchema.optional(), layer: z.enum(layerNames).optional(), limit: z.number().int().min(1).max(12).default(8), excludeRefKeys: z.array(refKey).max(1000).default([]) }).strict();
const detailsSchema = z.object({ refKeys: z.array(refKey).min(1).max(8) }).strict();
const normalize = (text: string) => text.normalize('NFKC').toLowerCase();
const canonical = (text: string) => normalize(text).replace(/[\p{P}\p{Z}\s]/gu, '');
const ignored = new Set(['页面', '效果', '动效', '一个', '希望', '帮我', '做个', '想要', '需要', '可以', '我要', '一下', '现在', '这样', '这种', '那种', '具有', '能够', '用在', '添加', '实现', '一些', '几个']);
function queryTerms(query: string): string[] {
  const text = normalize(query);
  const english = text.match(/[a-z][a-z0-9_-]*/g) || [];
  const chinese = [...text.matchAll(/[\u3400-\u9fff]+/g)].flatMap(match => match[0].length < 2 ? [match[0]] : [match[0], ...Array.from({ length: match[0].length - 1 }, (_, index) => match[0].slice(index, index + 2))]);
  return [...new Set([...english, ...chinese])].filter(term => !ignored.has(term));
}
function argumentsFor<T>(schema: z.ZodType<T>, value: unknown): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) throw new ApiError('参考库工具参数无效；请按工具定义提供查询、筛选条件或本轮参考编号。', 400, 'REFERENCE_TOOL_INVALID_ARGUMENT');
  return parsed.data;
}

export function createReferenceLibrary(entries: CatalogEntry[], knowledge: Map<string, CaseKnowledge>, options: { referenceKeys: Map<string, string>; protectedEntryIds?: string[]; penalties?: Map<string, number>; onActivity?: (message: string) => void }): { tools: AgentTool[]; readEntryIds: Set<string>; searchedEntryIds: Set<string> } {
  const available = entries.filter(isReady);
  const byRefKey = new Map<string, CatalogEntry>();
  for (const entry of available) {
    const key = options.referenceKeys.get(entry.id);
    if (!key || byRefKey.has(key)) throw new ApiError('本轮参考编号缺失或重复，无法建立只读参考库。', 500, 'REFERENCE_LIBRARY_INVALID');
    byRefKey.set(key, entry);
  }
  const knowledgeFor = (entry: CatalogEntry): CaseKnowledge | undefined => {
    const source = knowledge.get(entry.id);
    return source && source.entryId === entry.id && normalizeUrl(source.sourceUrl) === normalizeUrl(entry.sourceUrl) ? source : undefined;
  };
  const readEntryIds = new Set((options.protectedEntryIds || []).filter(id => available.some(entry => entry.id === id && knowledgeFor(entry))));
  const searchedEntryIds = new Set<string>();
  const indexed = available.map((entry, index) => {
    const source = knowledgeFor(entry);
    const names = [entry.name, entry.title].map(canonical);
    const aliases = entry.aliases.map(canonical);
    const fields = [
      { label: '名称/别名', text: [entry.name, entry.title, ...entry.aliases].join(' '), weight: 16 },
      { label: '实现机制', text: [source?.implementation.summary, ...(source?.implementation.steps || [])].join(' '), weight: 8 },
      { label: '可见行为', text: entry.description, weight: 6 },
      { label: '触发方式', text: entry.trigger, weight: 8 },
      { label: '适用场景', text: [...(source?.suitableFor || []), ...entry.placements].join(' '), weight: 7 },
      { label: '作用部位', text: (source?.layers || []).join(' '), weight: 7 },
      { label: '限制/不适用场景', text: [...(source?.limitations || []), ...(source?.avoidFor || [])].join(' '), weight: 3 },
      { label: '标签', text: entry.tags.join(' '), weight: 4 },
    ].map(field => ({ ...field, text: normalize(field.text) }));
    return { entry, source, index, names, aliases, fields };
  });
  const requireReference = (key: string): CatalogEntry => {
    const entry = byRefKey.get(key);
    if (!entry) throw new ApiError(`本轮参考编号不可用：${key}；请先搜索可用参考，不要猜测编号。`, 400, 'REFERENCE_TOOL_UNKNOWN_REFERENCE');
    return entry;
  };

  const search: AgentTool = {
    name: 'search_reference_library',
    description: '只读搜索本轮全部可播放参考库。可用中英文名称、口语别名、运动机制、触发方式、场景与限制查询，并按阶段或作用部位筛选。搜索只返回精简候选；采用前必须用get_reference_details读取完整实现知识。换query或excludeRefKeys可继续查找，不限固定组件。',
    parameters: { type: 'object', properties: { query: { type: 'string', minLength: 1, maxLength: 1200, description: '具体名称、机制、用途或触发方式，可含中英文' }, stage: { type: 'string', enum: ['structure', 'style', 'effect'] }, layer: { type: 'string', enum: [...layerNames] }, limit: { type: 'integer', minimum: 1, maximum: 12, default: 8 }, excludeRefKeys: { type: 'array', items: { type: 'string' }, maxItems: 1000 } }, required: ['query'], additionalProperties: false },
    async execute(value, signal) {
      signal?.throwIfAborted();
      const args = argumentsFor(searchSchema, value);
      const excluded = new Set(args.excludeRefKeys.map(key => requireReference(key).id));
      const query = canonical(args.query); const terms = queryTerms(args.query);
      const matches = indexed.flatMap(item => {
        if (excluded.has(item.entry.id) || (args.stage && item.entry.stage !== args.stage) || (args.layer && !item.source?.layers.includes(args.layer))) return [];
        const exactRank = [...item.names, ...item.aliases].includes(query) ? 3 : item.names.some(name => name.length >= 3 && query.includes(name)) ? 2 : item.aliases.some(name => name.length >= 3 && query.includes(name)) ? 1 : 0;
        let score = 0; const reasons: string[] = [];
        if (exactRank) reasons.push(exactRank === 3 ? '名称或口语别名精确匹配' : '查询包含案例名称或别名');
        for (const field of item.fields) {
          const hits = terms.filter(term => field.text.includes(term));
          score += hits.length * field.weight;
          if (hits.length) reasons.push(`${field.label}命中：${hits.slice(0, 3).join('、')}`);
        }
        if (!exactRank && !score) return [];
        const configuredPenalty = options.penalties?.get(item.entry.id) || 0;
        const penalty = Number.isFinite(configuredPenalty) ? Math.min(0.25, Math.max(0, configuredPenalty)) : 0;
        return [{ ...item, exactRank, score: score - penalty, reasons }];
      }).sort((left, right) => right.exactRank - left.exactRank || right.score - left.score || left.index - right.index);
      const shown = matches.slice(0, args.limit);
      const candidates = shown.map(item => ({ refKey: options.referenceKeys.get(item.entry.id)!, title: item.entry.title, name: item.entry.name, stage: item.entry.stage, summary: item.source?.implementation.summary || item.entry.description, trigger: item.entry.trigger, layers: item.source?.layers || [], visualFamilies: visualFamiliesFor(item.entry), scenes: (item.source?.suitableFor || item.entry.placements).slice(0, 3), limits: (item.source?.limitations || ['尚无完整实现知识，不能把此条描述成已读取实现方法。']).slice(0, 2), matchReasons: item.reasons.slice(0, 4) }));
      options.onActivity?.(`正在搜索全部${available.length}条参考：${args.query.slice(0, 100)}；找到${matches.length}条匹配，返回${candidates.length}条候选。`);
      signal?.throwIfAborted();
      for (const item of shown) searchedEntryIds.add(item.entry.id);
      return { catalogCount: available.length, totalMatches: matches.length, query: args.query, candidates };
    },
  };
  const details: AgentTool = {
    name: 'get_reference_details',
    description: '只读取得1至8个本轮已知refKey的完整案例资料、真实来源和实现知识。implementationKnowledge保留完整implementation.summary/steps/dependencies/parameters、suitableFor、avoidFor、layers、limitations、mobile、reducedMotion、performance、evidence与notes。只有成功读取的案例才可在最终方案中采用；未知编号不可猜测。',
    parameters: { type: 'object', properties: { refKeys: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 8 } }, required: ['refKeys'], additionalProperties: false },
    async execute(value, signal) {
      signal?.throwIfAborted();
      const args = argumentsFor(detailsSchema, value);
      const selected = [...new Set(args.refKeys)].map(requireReference);
      const availableCatalog = selected.map(entry => {
        const source = knowledgeFor(entry);
        if (!source) throw new ApiError(`该案例暂无对应的完整实现知识：${entry.title}；请读取其他可用案例。`, 400, 'REFERENCE_KNOWLEDGE_MISSING');
        return structuredClone({ id: entry.id, refKey: options.referenceKeys.get(entry.id)!, name: entry.name, title: entry.title, stage: entry.stage, description: entry.description, aliases: entry.aliases, trigger: entry.trigger, placements: entry.placements, tags: entry.tags, visualFamilies: visualFamiliesFor(entry), sourceUrl: entry.sourceUrl, implementationUrl: entry.implementationUrl || null, adaptation: '本地整理的参考，未声称来源组件已集成。', implementationKnowledge: source });
      });
      options.onActivity?.(`正在读取${selected.length}条参考详情：${selected.map(entry => entry.title).join('、')}。`);
      signal?.throwIfAborted();
      for (const entry of selected) readEntryIds.add(entry.id);
      return { catalogCount: available.length, availableCatalog };
    },
  };
  return { tools: [search, details], readEntryIds, searchedEntryIds };
}
