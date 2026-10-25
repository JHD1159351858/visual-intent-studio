import { expect, it } from 'vitest';
import { buildCaseKnowledgeMarkdown } from '../scripts/export-case-knowledge';
import type { CatalogEntry } from '../shared/types';
import type { CaseKnowledge } from '../shared/case-knowledge';

const entry: CatalogEntry = { id: 'demo', name: 'Demo', title: '手势面板', stage: 'effect', description: '下拉面板后关闭或回弹', aliases: [], trigger: '向下拖拽', placements: ['播放器'], tags: [], sourceId: '60fps', sourceUrl: 'https://60fps.design/shots/demo', preview: { type: 'video', url: '/media/demo.webm', verified: true, provenance: 'original' }, status: 'ready', updatedAt: '' };
const knowledge: CaseKnowledge = { entryId: entry.id, sourceUrl: entry.sourceUrl, basis: 'observed-behavior', implementation: { summary: '跟随指针位移，根据释放状态收起或回弹。', steps: ['建立开闭状态。', '拖拽时捕获指针。', '释放时关闭或复位。'], dependencies: [], parameters: { threshold: '项目建议：面板高度的三分之一' } }, suitableFor: ['音频播放器', '详情面板'], avoidFor: ['不可撤销的表单'], layers: ['content'], limitations: ['原产品源码未提供。', '网页不能控制系统键盘动画。'], mobile: '建议区分内容滚动与面板拖拽。', reducedMotion: '建议直接切换开闭状态。', performance: '建议只更新transform与遮罩透明度。', evidence: [{ url: entry.sourceUrl, kind: 'video-page', checkedAt: '2026-10-25T00:00:00.000Z' }], notes: '网页行为适配建议，未运行原生App源码。' };

it('exports complete per-case implementation, use/avoid scenarios and evidence with an honest adaptation boundary', () => {
  const document = buildCaseKnowledgeMarkdown([entry], new Map([[entry.id, knowledge]]));
  for (const text of ['demo', entry.title, entry.sourceUrl, knowledge.implementation.summary, ...knowledge.implementation.steps, ...knowledge.suitableFor, ...knowledge.avoidFor, ...knowledge.limitations, knowledge.mobile, knowledge.reducedMotion, knowledge.performance, knowledge.notes, knowledge.implementation.parameters.threshold]) expect(document).toContain(text);
  expect(document).toContain('行为适配');
  expect(document).not.toContain('已集成原组件');
});

it('labels the hashed object so a source-files hash is not mistaken for a registry response hash', () => {
  const item: CaseKnowledge = { ...knowledge, evidence: [{ ...knowledge.evidence[0], sha256: 'a'.repeat(64), hashScope: 'source-files-joined' }] };
  const document = buildCaseKnowledgeMarkdown([entry], new Map([[entry.id, item]]));
  expect(document).toContain('source-files-joined');
  expect(document).toContain('a'.repeat(64));
});

it('refuses to present an incomplete ready catalog as fully documented', () => {
  expect(() => buildCaseKnowledgeMarkdown([entry], new Map())).toThrow('实现知识');
});
