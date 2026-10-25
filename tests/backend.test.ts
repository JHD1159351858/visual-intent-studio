import { describe, it, expect } from 'vitest';
import { normalizeUrl, mergeEntries, eligibleEntries, validateRecommendation, buildExport } from '../server/core';
import type { CatalogEntry, RecommendationRequest } from '../shared/types';
export function entry(id = 'one', overrides: Partial<CatalogEntry> = {}): CatalogEntry {
  return { id, name: id, title: id, stage: 'effect', description: 'hover effect', aliases: [], trigger: 'hover', placements: ['card'], tags: [], sourceId: 'aceternity', sourceUrl: `https://ui.aceternity.com/components/${id}`, preview: { type: 'video', url: '/media/one.webm', verified: true, provenance: 'reference-recording' }, status: 'ready', updatedAt: '2026-01-01', ...overrides };
}
const request: RecommendationRequest = { stage: 'effect', description: 'hover', selections: [], excludedIds: [] };
describe('catalog identity and preserved edits', () => {
  it('normalizes tracking parameters, www, fragments, and trailing slash without deleting meaningful query', () => {
    expect(normalizeUrl('https://www.reactbits.dev/text-animations/blur-text/?utm_source=x&variant=1#demo')).toBe('https://reactbits.dev/text-animations/blur-text?variant=1');
  });
  it('merges equivalent source URLs and retains ID, aliases, notes, and verified local recording', () => {
    const old = entry('old', { aliases: ['柔和光晕'], userNotes: '待放在封面', preview: { type: 'video', url: '/media/one.webm', verified: true, provenance: 'original' } });
    const fresh = entry('new', { sourceUrl: old.sourceUrl + '/?utm_source=feed#demo', aliases: ['New'], preview: { type: 'link', url: old.sourceUrl, verified: false, provenance: 'original' }, status: 'draft', title: 'Updated title' });
    const merged = mergeEntries([old], [fresh]);
    expect(merged).toHaveLength(1);
    expect(merged[0]).toMatchObject({ id: 'old', aliases: ['柔和光晕'], userNotes: '待放在封面', title: 'Updated title', status: 'ready', preview: old.preview });
  });
});
describe('recommendation contract', () => {
  it('excludes drafts, links, unverified, other stages, selected and rejected entries', () => {
    const entries = [entry(), entry('draft', { status: 'draft' }), entry('link', { preview: { type: 'link', url: 'https://ui.aceternity.com', verified: true, provenance: 'original' } }), entry('unverified', { preview: { type: 'video', url: '/media/a.webm', verified: false, provenance: 'original' } }), entry('other', { stage: 'structure' }), entry('selected'), entry('rejected')];
    expect(eligibleEntries(entries, { ...request, selections: [{ entryId: 'selected', stage: 'effect', placement: '', adjustments: '' }], excludedIds: ['rejected'] }).map(e => e.id)).toEqual(['one']);
  });
  it('rejects invented or unavailable model IDs and invalid response schema', () => {
    expect(() => validateRecommendation({ message: 'ok', candidates: [{ entryId: 'invented', reason: 'x' }] }, [entry()])).toThrow(/不可用|unknown/);
    expect(() => validateRecommendation({ message: 'ok', candidates: [{ entryId: 'one' }] }, [entry()])).toThrow();
  });
  it('deduplicates and limits model candidates to three', () => {
    const entries = ['one', 'two', 'three', 'four'].map(id => entry(id));
    const result = validateRecommendation({ message: 'ok', candidates: ['one', 'one', 'two', 'three', 'four'].map(entryId => ({ entryId, reason: 'why' })) }, entries);
    expect(result.candidates.map(e => e.entryId)).toEqual(['one', 'two', 'three']);
  });
});

it('retains completed Chinese metadata and source recordings during repeated directory sync', () => {
  const old = entry('complete', { title: '跟随鼠标的亮光', description: '鼠标移过时光点沿着卡片移动。', tags: ['指针', '柔光'], curation: { reviewedAt: '2026-10-12', evidenceUrl: 'https://reactbits.dev/llms.txt' }, preview: { type: 'video', url: '/media/sources/complete.webm', verified: true, provenance: 'source-recording' } });
  const fresh = entry('fresh', { sourceUrl: old.sourceUrl, title: 'Official title', description: 'Upstream description', tags: [], status: 'draft', preview: { type: 'link', url: old.sourceUrl, verified: false, provenance: 'original' } });
  const merged = mergeEntries(mergeEntries([old], [fresh]), [fresh])[0];
  expect(merged).toMatchObject({ title: old.title, description: old.description, tags: old.tags, curation: old.curation, preview: old.preview, status: 'ready' });
  const pending = { ...old, status: 'draft' as const, preview: { type: 'link' as const, url: old.sourceUrl, verified: false, provenance: 'original' as const } };
  expect(mergeEntries([pending], [fresh])[0]).toMatchObject({ title: old.title, description: old.description, curation: old.curation, status: 'draft' });
});

it('exports source browser recordings with their actual provenance', () => {
  const source = entry('source', { preview: { type: 'video', url: '/media/sources/source.webm', verified: true, provenance: 'source-recording' } });
  expect(buildExport({ brief: '页面', selections: [{ entryId: 'source', stage: 'effect', placement: '卡片', adjustments: '' }] }, [source])).toContain('原站演示的浏览器实录');
});
describe('confirmed-only export', () => {
  it('exports a saved page brief and functions before any visual reference is selected', () => {
    const markdown = buildExport({ brief: '课程资料查询页', selections: [], messages: [{ role: 'user', content: '整页需求更新，以这一版为准：\n核心功能：资料查询、原文出处、历史记录。\n视觉风格：柔和纸张。' }] }, [entry('unselected')]);
    expect(markdown).toContain('课程资料查询页');
    expect(markdown).toContain('资料查询、原文出处、历史记录');
    expect(markdown).toContain('尚未确认具体案例');
    expect(markdown).not.toContain('unselected');
  });
  it('contains only confirmed entries with their brief, source, placement and adjustments', () => {
    const markdown = buildExport({ brief: '做一个安静的作品集', selections: [{ entryId: 'one', stage: 'effect', placement: '首屏卡片', adjustments: '降低速度' }] }, [entry(), entry('unselected')]);
    expect(markdown).toContain('做一个安静的作品集');
    expect(markdown).toContain('首屏卡片');
    expect(markdown).toContain('降低速度');
    expect(markdown).toContain('https://ui.aceternity.com/components/one');
    expect(markdown).not.toContain('unselected');
  });
  it('rejects unknown, unavailable, mismatched stages and no selections', () => {
    expect(() => buildExport({ brief: '', selections: [] }, [entry()])).toThrow();
    expect(() => buildExport({ brief: '', selections: [{ entryId: 'unknown', stage: 'effect', placement: '', adjustments: '' }] }, [entry()])).toThrow();
    expect(() => buildExport({ brief: '', selections: [{ entryId: 'one', stage: 'style', placement: '', adjustments: '' }] }, [entry()])).toThrow();
    expect(() => buildExport({ brief: '', selections: [{ entryId: 'one', stage: 'effect', placement: '', adjustments: '' }] }, [entry('one', { status: 'draft' })])).toThrow();
  });
});

it('preserves the curated stage when a verified local recording is retained on source sync', () => {
  const old = entry('dot-grid', { stage: 'style' });
  const refreshed = entry('new', { sourceUrl: old.sourceUrl, stage: 'structure', status: 'draft', preview: { type: 'link', url: old.sourceUrl, verified: false, provenance: 'original' } });
  expect(mergeEntries([old], [refreshed])[0].stage).toBe('style');
});
it('rejects an unverified model candidate even when its ID exists in the provided catalogue', () => {
  expect(() => validateRecommendation({ message: '候选', candidates: [{ entryId: 'one', reason: '理由' }] }, [entry('one', { status: 'draft' })])).toThrow(/不可用/);
});

it('keeps Chinese behavior descriptions and placements attached to ready reference recordings across repeated sync', () => {
  const old = entry('curated', { title: '跟着指针移动的柔光', description: '鼠标移入后光点跟随，移出后消失。', trigger: '鼠标移入', placements: ['功能卡片'], stage: 'style' });
  const fresh = entry('fresh', { sourceUrl: old.sourceUrl, title: 'Updated upstream', description: 'New component', trigger: 'see website', placements: [], stage: 'effect', status: 'draft', preview: { type: 'link', url: old.sourceUrl, verified: false, provenance: 'original' } });
  const twice = mergeEntries(mergeEntries([old], [fresh]), [fresh]);
  expect(twice).toHaveLength(1);
  expect(twice[0]).toMatchObject({ title: old.title, description: old.description, trigger: old.trigger, placements: old.placements, stage: 'style', preview: old.preview });
});

it('exports an actionable implementation brief with confirmed Chinese title, visible behavior and trigger', () => {
  const chosen = entry('one', { title: '跟随指针的柔光卡片', description: '光点在卡片范围内跟随鼠标。', trigger: '鼠标悬停' });
  const unselected = entry('two', { description: 'UNSELECTED_BEHAVIOR' });
  const markdown = buildExport({ brief: '作品集', selections: [{ entryId: 'one', stage: 'effect', placement: '封面', adjustments: '减慢' }] }, [chosen, unselected]);
  expect(markdown).toContain('按以下已确认需求实现页面；未确认内容不要自行加入');
  expect(markdown).toContain(chosen.title);
  expect(markdown).toContain(chosen.description);
  expect(markdown).toContain(chosen.trigger);
  expect(markdown).not.toContain('UNSELECTED_BEHAVIOR');
});

it('describes missing implementation code clearly for confirmed visual-only references', () => {
  const visual = entry('visual', { implementationUrl: undefined });
  const markdown = buildExport({ brief: '页面', selections: [{ entryId: 'visual', stage: 'effect', placement: '首页', adjustments: '' }] }, [visual]);
  expect(markdown).toContain('未提供源码；以来源页面的视觉行为为参考');
  expect(markdown).not.toContain(`实现参考：${visual.sourceUrl}`);
});

it('exports separate applications with their scope and later user adjustments', () => {
  const reference = entry('gradient', { stage: 'style' });
  const selection = { entryId: reference.id, stage: reference.stage, placement: '功能卡片', adjustments: '保留玻璃', layer: 'border' as const, operation: 'add' as const, preserve: ['玻璃表面'] };
  const markdown = buildExport({ brief: '工具页', selections: [{ ...selection, target: '卡片' }, { ...selection, target: '按钮' }], messages: [{ role: 'user', content: '边缘动得慢一点' }, { role: 'assistant', content: 'UNCONFIRMED_SUGGESTION' }] }, [reference]);
  expect(markdown.match(/### 视觉风格/g)).toHaveLength(2);
  expect(markdown).toContain('卡片：边框；叠加；保留 玻璃表面');
  expect(markdown).toContain('按钮：边框；叠加；保留 玻璃表面');
  expect(markdown).toContain('边缘动得慢一点');
  expect(markdown).not.toContain('UNCONFIRMED_SUGGESTION');
});

it('preserves verification and confirmed export when a remote original video URL is unchanged on reimport', () => {
  const video = { type: 'video' as const, url: 'https://video.gumlet.io/shot/main.mp4?token=current', verified: true, provenance: 'original' as const };
  const old = entry('remote', { sourceId: '60fps', sourceUrl: 'https://60fps.design/shots/hover', stage: 'effect', preview: video });
  const incoming = { ...old, id: 'imported', preview: { ...video, verified: false }, stage: 'style' as const, status: 'draft' as const };
  const merged = mergeEntries([old], [incoming]);
  expect(merged[0]).toMatchObject({ id: 'remote', status: 'ready', stage: 'effect', preview: video });
  expect(buildExport({ brief: '页面', selections: [{ entryId: 'remote', stage: 'effect', placement: '搜索框', adjustments: '' }] }, merged)).toContain(video.url);
});
it('requires revalidation when a remote direct video URL changes, including its signed query', () => {
  const old = entry('remote', { sourceId: '60fps', sourceUrl: 'https://60fps.design/shots/hover', preview: { type: 'video', url: 'https://video.gumlet.io/shot/main.mp4?token=old', verified: true, provenance: 'original' } });
  const incoming = { ...old, preview: { ...old.preview, url: 'https://video.gumlet.io/shot/main.mp4?token=new', verified: false }, status: 'draft' as const };
  const merged = mergeEntries([old], [incoming]);
  expect(merged[0]).toMatchObject({ status: 'draft', preview: { verified: false, url: incoming.preview.url } });
  expect(() => buildExport({ brief: '页面', selections: [{ entryId: 'remote', stage: 'effect', placement: '', adjustments: '' }] }, merged)).toThrow();
});

