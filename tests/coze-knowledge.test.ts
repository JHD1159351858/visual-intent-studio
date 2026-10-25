import { expect, it } from 'vitest';
import type { CatalogEntry } from '../shared/types';
import { buildKnowledgeDocuments } from '../scripts/export-coze-knowledge';

const entry: CatalogEntry = { id: 'glass', name: 'Glass', title: '玻璃卡片', stage: 'style', description: '半透明表面', aliases: ['磨砂玻璃'], trigger: '静态显示', placements: ['卡片'], tags: ['glass'], sourceId: 'reactbits', sourceUrl: 'https://reactbits.dev/components/glass', preview: { type: 'video', url: '/media/glass.webm', verified: true, provenance: 'reference-recording', note: '参考重现' }, status: 'ready', updatedAt: '2026-10-13', userNotes: '只改边框' };

it('exports eligible cases with real IDs, source facts, user additions and preview limitations', () => {
  const files = buildKnowledgeDocuments([entry, { ...entry, id: 'pending', status: 'draft' }, { ...entry, id: 'unverified', preview: { ...entry.preview, verified: false } }, { ...entry, id: 'link', preview: { ...entry.preview, type: 'link' } }]);
  const cards = files.slice(1).map(file => file.content).join('\n');
  expect(cards).toContain('案例 ID：glass');
  expect(cards).toContain(entry.sourceUrl);
  expect(cards).toContain('磨砂玻璃');
  expect(cards).toContain('只改边框');
  expect(cards).toContain('未提供实现源码地址');
  expect(cards).toContain('云端不能直接访问');
  expect(cards).not.toMatch(/案例 ID：(pending|unverified|link)/);
});

it('keeps layer rules distinct from case facts and preserves glass material when only its edge changes', () => {
  const rules = buildKnowledgeDocuments([entry])[0].content;
  expect(rules).toContain('设计建议');
  expect(rules).toContain('border');
  expect(rules).toContain('surface');
  expect(rules).toContain('不能将整块渐变铺到玻璃内部');
  expect(rules).toContain('availableCatalog');
  expect(rules).toContain('未集成原组件源码');
});
