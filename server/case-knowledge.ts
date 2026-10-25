import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import type { CatalogEntry } from '../shared/types';
import type { CaseKnowledge, CompactCaseKnowledge } from '../shared/case-knowledge';
import { ApiError, isReady, normalizeUrl } from './core';

const text = z.string().trim().min(1);
const https = z.string().url().refine(value => { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; });
const schema = z.object({
  entryId: text,
  sourceUrl: https,
  basis: z.enum(['source-code', 'observed-behavior']),
  implementation: z.object({ summary: text.max(700), steps: z.array(text).min(3).max(6), dependencies: z.array(text), parameters: z.record(z.string(), text) }).strict(),
  suitableFor: z.array(text).min(2), avoidFor: z.array(text).min(1),
  layers: z.array(z.enum(['layout', 'surface', 'border', 'outer-glow', 'page-background', 'text', 'content'])).min(1),
  limitations: z.array(text).min(2), mobile: text, reducedMotion: text, performance: text,
  evidence: z.array(z.object({ url: https, kind: z.enum(['registry', 'source-code', 'official-description', 'video-page']), checkedAt: z.string().datetime({ offset: true }), sha256: z.string().regex(/^[a-f0-9]{64}$/i).optional(), hashScope: z.enum(['registry-response', 'source-files-joined', 'page-response']).optional(), paths: z.array(text).optional() }).strict()).min(1),
  notes: z.string(),
}).strict();
const sourceIds = ['reactbits', 'aceternity', '60fps'] as const;
const invalid = (source: string) => new ApiError(`案例实现知识无效，请检查 ${source}.json 的结构、案例ID与来源对应关系；原文件已保留。`, 503, 'CASE_KNOWLEDGE_INVALID');

export async function loadCaseKnowledge(rootDir: string, entries: CatalogEntry[]): Promise<Map<string, CaseKnowledge>> {
  const bundles = await Promise.all(sourceIds.map(async source => {
    let content: string;
    try { content = await readFile(path.join(rootDir, 'data/case-knowledge', source + '.json'), 'utf8'); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { source, rows: [] }; throw invalid(source); }
    try { return { source, rows: z.array(schema).parse(JSON.parse(content)) }; }
    catch { throw invalid(source); }
  }));
  const catalog = new Map(entries.map(entry => [entry.id, entry]));
  const seen = new Set<string>(); const result = new Map<string, CaseKnowledge>();
  for (const { source, rows } of bundles) for (const row of rows) {
    const entry = catalog.get(row.entryId);
    if (!entry || seen.has(row.entryId) || entry.sourceId !== source || normalizeUrl(entry.sourceUrl) !== normalizeUrl(row.sourceUrl)) throw invalid(source);
    seen.add(row.entryId);
    if (row.basis === 'source-code' && (source === '60fps' || !row.evidence.some(item => item.kind === 'source-code' || item.kind === 'registry'))) throw invalid(source);
    if (isReady(entry)) result.set(row.entryId, row);
  }
  return result;
}

export function compactCaseKnowledge(knowledge: CaseKnowledge): CompactCaseKnowledge {
  let remaining = 700 - knowledge.implementation.summary.length; const steps: string[] = [];
  for (const step of knowledge.implementation.steps) {
    if (step.length > remaining) break;
    steps.push(step); remaining -= step.length;
  }
  const priority = { 'source-code': 0, registry: 1, 'official-description': 2, 'video-page': 3 };
  const evidence = [...knowledge.evidence].sort((left, right) => priority[left.kind] - priority[right.kind]).slice(0, 1).map(({ url, kind, sha256, hashScope }) => ({ url, kind, ...(sha256 ? { sha256 } : {}), ...(hashScope ? { hashScope } : {}) }));
  return {
    basis: knowledge.basis, method: knowledge.implementation.summary, steps,
    scenes: knowledge.suitableFor.slice(0, 3), avoid: knowledge.avoidFor.slice(0, 2), layers: knowledge.layers,
    limits: knowledge.limitations.slice(0, 3), dependencies: knowledge.implementation.dependencies.slice(0, 6),
    mobile: knowledge.mobile, reducedMotion: knowledge.reducedMotion, performance: knowledge.performance,
    parameters: Object.fromEntries(Object.entries(knowledge.implementation.parameters).slice(0, 3)), evidence,
  };
}
