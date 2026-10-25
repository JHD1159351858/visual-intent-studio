import { afterEach, expect, it } from 'vitest';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import type { CatalogEntry } from '../shared/types';
import type { CaseKnowledge } from '../shared/case-knowledge';
import { compactCaseKnowledge, loadCaseKnowledge } from '../server/case-knowledge';

const roots: string[] = [];
afterEach(async () => { for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }); });
const entry = (id: string, sourceId: CatalogEntry['sourceId'] = 'reactbits'): CatalogEntry => ({ id, sourceId, name: id, title: '案例', description: '清晰的视觉行为', aliases: [], trigger: '指针', placements: ['首屏'], tags: [], stage: 'effect', status: 'ready', sourceUrl: `https://${sourceId === '60fps' ? '60fps.design/shots' : sourceId === 'aceternity' ? 'ui.aceternity.com/components' : 'reactbits.dev/components'}/${id}`, preview: { type: 'video', url: '/media/' + id + '.webm', verified: true, provenance: 'source-recording' }, updatedAt: '' });
const catalog = [entry('flow'), entry('beam', 'aceternity'), entry('tabs', '60fps')];
const knowledge = (source: CatalogEntry = catalog[0]): CaseKnowledge => ({
  entryId: source.id, sourceUrl: source.sourceUrl, basis: 'observed-behavior',
  implementation: { summary: '在独立边缘层绘制移动亮带，保留内部阅读面。', steps: ['先建立不接收点击的边缘装饰层。', '根据动画时间沿轮廓移动亮带。', '停止动态后保留静态描边。'], dependencies: [], parameters: { duration: '建议本页使用6秒循环，并非来源默认值' } },
  suitableFor: ['突出主要操作的按钮边缘', '产品介绍的重点卡片'], avoidFor: ['密集正文区域'], layers: ['border'], limitations: ['这里描述行为适配，不声称原站源码。', '仅作用边缘，不能铺满内部表面。'], mobile: '触屏使用自动运动并保留点击。', reducedMotion: '停止移动并显示静态描边。', performance: '同时只为少量重点对象绘制。',
  evidence: [{ url: source.sourceUrl, kind: 'official-description', checkedAt: '2026-10-25T00:00:00.000Z' }], notes: '未进行本次页面集成与手机性能验收。',
});
async function fixture(values?: unknown, source = 'reactbits') {
  const root = await mkdtemp(path.join(tmpdir(), 'case-knowledge-')); roots.push(root);
  await mkdir(path.join(root, 'data/case-knowledge'), { recursive: true });
  if (values !== undefined) await writeFile(path.join(root, `data/case-knowledge/${source}.json`), JSON.stringify(values));
  return root;
}

it('allows missing files without inventing implementation knowledge', async () => {
  expect(await loadCaseKnowledge(await fixture(), catalog)).toEqual(new Map());
});

it('joins each actual ready entry by ID and normalized source URL across all source files', async () => {
  const first = { ...knowledge(), sourceUrl: 'https://www.reactbits.dev/components/flow/?utm_source=test#demo' };
  const root = await fixture([first]);
  for (const source of catalog.slice(1)) await writeFile(path.join(root, `data/case-knowledge/${source.sourceId}.json`), JSON.stringify([knowledge(source)]));
  const result = await loadCaseKnowledge(root, catalog);
  expect([...result.keys()]).toEqual(['flow', 'beam', 'tabs']);
  expect(result.get('flow')?.implementation.steps).toEqual(first.implementation.steps);
});

it('does not expose a known but currently unready or unverified case', async () => {
  const second = entry('pending'); const third = entry('unverified');
  const root = await fixture([knowledge(), knowledge(second), knowledge(third)]);
  const result = await loadCaseKnowledge(root, [...catalog, { ...second, status: 'draft' }, { ...third, preview: { ...third.preview, verified: false } }]);
  expect([...result.keys()]).toEqual(['flow']);
});

it.each(['unknown-id', 'wrong-url', 'duplicate', 'wrong-source-file', 'missing-fields', 'invalid-hash', 'embedded-code'])('rejects %s instead of silently passing it to the model', async mode => {
  const value: any = knowledge(); let values: unknown = [value];
  if (mode === 'unknown-id') value.entryId = 'not-in-catalog';
  if (mode === 'wrong-url') value.sourceUrl = catalog[1].sourceUrl;
  if (mode === 'duplicate') values = [value, value];
  if (mode === 'wrong-source-file') values = [knowledge(catalog[1])];
  if (mode === 'missing-fields') value.implementation.steps = [];
  if (mode === 'invalid-hash') value.evidence[0].sha256 = 'not-a-sha256';
  if (mode === 'embedded-code') value.implementation.code = 'document.body.innerHTML = "unsafe"';
  await expect(loadCaseKnowledge(await fixture(values), catalog)).rejects.toMatchObject({ code: 'CASE_KNOWLEDGE_INVALID' });
});

it('preserves malformed source data rather than replacing it with empty or fabricated records', async () => {
  const root = await fixture(); const file = path.join(root, 'data/case-knowledge/reactbits.json');
  await writeFile(file, '{broken');
  await expect(loadCaseKnowledge(root, catalog)).rejects.toMatchObject({ code: 'CASE_KNOWLEDGE_INVALID' });
  expect(await readFile(file, 'utf8')).toBe('{broken');
});

it('requires actual code or code registry evidence before labelling a method source-code', async () => {
  const value = { ...knowledge(), basis: 'source-code' as const }; const root = await fixture([value]);
  await expect(loadCaseKnowledge(root, catalog)).rejects.toMatchObject({ code: 'CASE_KNOWLEDGE_INVALID' });
  value.evidence[0].kind = 'registry'; value.evidence[0].sha256 = 'a'.repeat(64);
  await writeFile(path.join(root, 'data/case-knowledge/reactbits.json'), JSON.stringify([value]));
  expect((await loadCaseKnowledge(root, catalog)).get('flow')?.basis).toBe('source-code');
});

it('keeps video-only product examples marked as observed behavior', async () => {
  const value = knowledge(catalog[2]); value.basis = 'source-code'; value.evidence[0].kind = 'source-code';
  await expect(loadCaseKnowledge(await fixture([value], '60fps'), catalog)).rejects.toMatchObject({ code: 'CASE_KNOWLEDGE_INVALID' });
});

it.each(['registry-response', 'source-files-joined', 'page-response'] as const)('preserves the explicit digest object %s in full and compact evidence', async hashScope => {
  const value = { ...knowledge(), evidence: knowledge().evidence.map(item => ({ ...item, sha256: 'c'.repeat(64), hashScope })) };
  const saved = (await loadCaseKnowledge(await fixture([value]), catalog)).get('flow')!;
  expect(saved.evidence[0]).toMatchObject({ hashScope, sha256: 'c'.repeat(64) });
  expect(compactCaseKnowledge(saved).evidence[0]).toMatchObject({ hashScope, sha256: 'c'.repeat(64) });
});

it('compacts prose by keeping complete steps while retaining scope, limits and provenance', () => {
  const value = knowledge(); value.implementation.summary = '方法概述。'.repeat(10);
  value.implementation.steps = ['甲'.repeat(300) + '。', '乙'.repeat(300) + '。', '丙'.repeat(300) + '。'];
  value.evidence[0].paths = ['components/private-source.tsx']; value.evidence[0].sha256 = 'b'.repeat(64);
  const result = compactCaseKnowledge(value);
  expect(result.method.length + result.steps.reduce((sum, step) => sum + step.length, 0)).toBeLessThanOrEqual(700);
  expect(result.steps).toEqual(value.implementation.steps.slice(0, 2));
  expect(result).toMatchObject({ basis: 'observed-behavior', scenes: value.suitableFor, avoid: value.avoidFor, layers: ['border'], limits: value.limitations, mobile: value.mobile, reducedMotion: value.reducedMotion, performance: value.performance });
  expect(result.evidence[0]).toEqual({ url: value.sourceUrl, kind: 'official-description', sha256: 'b'.repeat(64) });
  expect(JSON.stringify(result)).not.toContain('private-source.tsx');
  expect(result).not.toHaveProperty('notes');
  expect(result).not.toHaveProperty('code');
});
