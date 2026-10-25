import { expect, it, vi } from 'vitest';
import { readFile } from 'node:fs/promises';
import type { CatalogEntry } from '../shared/types';
import type { CaseKnowledge } from '../shared/case-knowledge';
import { createReferenceLibrary } from '../server/reference-search';
import { loadCaseKnowledge } from '../server/case-knowledge';

const entry = (id: string, name: string, overrides: Partial<CatalogEntry> = {}): CatalogEntry => ({ id, name, title: name, sourceId: 'reactbits', stage: 'effect', status: 'ready', description: '清楚可辨的视觉行为', aliases: [], tags: [], placements: ['首屏'], trigger: '进入视野', sourceUrl: `https://reactbits.dev/components/${id}`, implementationUrl: `https://github.com/source/${id}`, preview: { type: 'video', url: `/media/${id}.webm`, verified: true, provenance: 'source-recording' }, updatedAt: '', ...overrides });
const knowledge = (source: CatalogEntry, overrides: Partial<CaseKnowledge> = {}): CaseKnowledge => ({ entryId: source.id, sourceUrl: source.sourceUrl, basis: 'source-code', implementation: { summary: '独立DOM装饰层通过局部坐标驱动，保留正文与真实操作。', steps: ['建立独立装饰层。', '将局部坐标映射为可见反馈。', '结束时恢复稳定状态。'], dependencies: ['motion'], parameters: { duration: '源码默认6秒' } }, suitableFor: ['功能卡片', '作品封面'], avoidFor: ['长篇正文'], layers: ['surface'], limitations: ['只作用局部表面。', '减少动态需接入方明确处理。'], mobile: '触屏提供点击和焦点替代。', reducedMotion: '停止持续移动。', performance: '缓存测量与纹理。', evidence: [{ url: source.sourceUrl, kind: 'source-code', checkedAt: '2026-10-25T00:00:00.000Z', sha256: 'a'.repeat(64) }], notes: '这是已整理源码的参考，不代表目标工程已集成。', ...overrides });

const catalog = [
  entry('beam', 'Border Beam', { title: '沿边框移动的光束', aliases: ['边框流光'], description: '光束沿轮廓自动循环', trigger: '自动循环', tags: ['border'] }),
  entry('glass', 'Glass Surface', { title: '折射玻璃表面', stage: 'style', aliases: ['玻璃卡片'], trigger: '持续显示' }),
  entry('scroll', 'Scroll Stack', { title: '滚动层叠卡片', trigger: '用户滚动页面', description: '卡片随滚动逐张层叠', tags: ['滚动'] }),
  entry('swap', 'Card Swap', { title: '自动轮流换位卡片', trigger: '自动定时循环', description: '卡片自动轮流交换前后位置', tags: ['自动'] }),
  entry('draft', 'Draft Example', { status: 'draft' }),
  entry('unverified', 'Unverified Example', { preview: { type: 'video', url: '/media/unverified.webm', verified: false, provenance: 'source-recording' } }),
];
const records = new Map(catalog.map(source => [source.id, knowledge(source, source.id === 'beam' ? { layers: ['border'], implementation: { summary: '在边框路径中按弧长推进亮点，独立掏空遮罩保留玻璃内部，光束自动循环。', steps: ['建立边框路径。', '按弧长推进光束。', '掏空中心并保留内容。'], dependencies: [], parameters: { duration: '源码默认6秒' } }, limitations: ['不能把玻璃内部变成彩色背景。', '只清理本实例trigger，避免getAll清理影响其他动效。'] } : source.id === 'scroll' ? { layers: ['layout'], suitableFor: ['滚动故事页面', '分步骤介绍'], implementation: { summary: '滚动位置映射为DOM卡片停靠与缩放，只有用户滚动才推进层叠。', steps: ['测量滚动轨道。', '依滚动位置停靠。', '滚动结束保持卡片。'], dependencies: [], parameters: {} } } : source.id === 'swap' ? { layers: ['layout'], implementation: { summary: '自动计时推进卡片交换层级，以时间线将前卡送到底部后继续循环。', steps: ['建立卡片槽位。', '定时推进换位。', '结束后继续自动循环。'], dependencies: [], parameters: {} } } : {})]));
const refKeys = (entries = catalog) => new Map(entries.map((item, index) => [item.id, `ref_${String(index + 1).padStart(3, '0')}`]));
function setup(overrides: Parameters<typeof createReferenceLibrary>[2] = { referenceKeys: refKeys() }) {
  const library = createReferenceLibrary(catalog, records, overrides);
  return { ...library, search: library.tools.find(tool => tool.name === 'search_reference_library')!, details: library.tools.find(tool => tool.name === 'get_reference_details')! };
}

it('exposes only read-only search and detail tools with explicit argument schemas', () => {
  const { tools } = setup();
  expect(tools.map(tool => tool.name)).toEqual(['search_reference_library', 'get_reference_details']);
  expect(tools.every(tool => tool.parameters.type === 'object' && tool.parameters.additionalProperties === false)).toBe(true);
});

it('searches all eligible entries by exact English, Chinese name or colloquial alias and does not mark them as read', async () => {
  const library = setup();
  for (const query of ['BorderBeam', '沿边框移动的光束', '边框流光']) {
    const result: any = await library.search.execute({ query });
    expect(result.catalogCount).toBe(4);
    expect(result.candidates[0].refKey).toBe('ref_001');
    expect(result.candidates[0].visualFamilies).toContain('border-beam');
    expect(result.candidates[0].matchReasons.join(' ')).toMatch(/名称|别名/);
  }
  expect(library.searchedEntryIds.has('beam')).toBe(true);
  expect(library.readEntryIds.size).toBe(0);
});

it('finds implementation mechanisms, usage scenarios, constraints and placements beyond names', async () => {
  const { search } = setup();
  for (const query of ['弧长推进亮点', 'getAll清理', '玻璃内部彩色背景']) {
    const result: any = await search.execute({ query });
    expect(result.candidates[0].refKey).toBe('ref_001');
  }
  const scenes: any = await search.execute({ query: '分步骤介绍' });
  expect(scenes.candidates[0].refKey).toBe('ref_003');
});

it('filters exact stage and intended layer, distinguishing a border from an internal surface', async () => {
  const { search } = setup();
  const border: any = await search.execute({ query: '卡片', layer: 'border' });
  expect(border.candidates.map((item: any) => item.refKey)).toEqual(['ref_001']);
  const surface: any = await search.execute({ query: '玻璃', layer: 'surface', stage: 'style' });
  expect(surface.candidates.map((item: any) => item.refKey)).toEqual(['ref_002']);
  const none: any = await search.execute({ query: '玻璃', layer: 'border', stage: 'structure' });
  expect(none.candidates).toEqual([]);
});

it('puts scroll-driven stacking and automatic swapping first for their respective requests', async () => {
  const { search } = setup();
  const scroll: any = await search.execute({ query: '滚动层叠卡片' });
  const automatic: any = await search.execute({ query: '自动轮流换位卡片' });
  expect(scroll.candidates[0].refKey).toBe('ref_003');
  expect(automatic.candidates[0].refKey).toBe('ref_004');
});

it('uses trigger and method matches to distinguish scroll from automatic motion without an exact case name', async () => {
  const { search } = setup();
  const scroll: any = await search.execute({ query: '随滚动推进的卡片', layer: 'layout' });
  const automatic: any = await search.execute({ query: '自动定时循环的卡片', layer: 'layout' });
  expect(scroll.candidates[0].refKey).toBe('ref_003');
  expect(automatic.candidates[0].refKey).toBe('ref_004');
});

it('allows follow-up exclusions and changed queries to reveal different real candidates', async () => {
  const { search } = setup();
  const first: any = await search.execute({ query: '卡片', limit: 1 });
  const next: any = await search.execute({ query: '卡片', limit: 1, excludeRefKeys: [first.candidates[0].refKey] });
  expect(next.candidates).toHaveLength(1);
  expect(next.candidates[0].refKey).not.toBe(first.candidates[0].refKey);
  const different: any = await search.execute({ query: '玻璃折射' });
  expect(different.candidates[0].refKey).toBe('ref_002');
});

it('returns at most twelve compact candidates and accurately reports uncapped match counts', async () => {
  const entries = Array.from({ length: 20 }, (_, index) => entry(`flow-${index}`, `流动色带${index}`));
  const sourceKnowledge = new Map(entries.map(source => [source.id, knowledge(source)]));
  const library = createReferenceLibrary(entries, sourceKnowledge, { referenceKeys: refKeys(entries) });
  const result: any = await library.tools[0].execute({ query: '流动色带', limit: 12 });
  expect(result.catalogCount).toBe(20); expect(result.totalMatches).toBe(20); expect(result.candidates).toHaveLength(12);
  expect(result.candidates.every((item: any) => !item.steps && !item.parameters && !item.evidence && !item.implementationKnowledge)).toBe(true);
  expect(library.searchedEntryIds.size).toBe(12); expect(library.readEntryIds.size).toBe(0);
});

it('keeps relevance above bounded frequency penalties and never bans a frequent component', async () => {
  const entries = [entry('relevant', '液体速度压力求解'), entry('other', '普通色块')];
  const library = createReferenceLibrary(entries, new Map(entries.map(source => [source.id, knowledge(source)])), { referenceKeys: refKeys(entries), penalties: new Map([['relevant', 100]]) });
  const result: any = await library.tools[0].execute({ query: '液体速度压力求解' });
  expect(result.candidates[0].refKey).toBe('ref_001');
  const ties = [entry('a', 'A Flow', { description: '相同流动色带' }), entry('b', 'B Flow', { description: '相同流动色带' })];
  const weighted = createReferenceLibrary(ties, new Map(ties.map(source => [source.id, knowledge(source)])), { referenceKeys: refKeys(ties), penalties: new Map([['a', 0.25]]) });
  const reordered: any = await weighted.tools[0].execute({ query: '流动色带' });
  expect(reordered.candidates.map((item: any) => item.refKey)).toEqual(['ref_002', 'ref_001']);
});

it('returns exact sources and complete knowledge only after detail reads, without changing stored records', async () => {
  const { details, readEntryIds } = setup();
  const result: any = await details.execute({ refKeys: ['ref_001', 'ref_002'] });
  expect(result.availableCatalog.map((item: any) => item.id)).toEqual(['beam', 'glass']);
  expect(result.availableCatalog[0]).toMatchObject({ sourceUrl: catalog[0].sourceUrl, implementationUrl: catalog[0].implementationUrl, refKey: 'ref_001' });
  expect(result.availableCatalog[0].visualFamilies).toContain('border-beam');
  expect(result.availableCatalog[1].visualFamilies).toEqual([]);
  expect(result.availableCatalog[0].implementationKnowledge).toEqual(records.get('beam'));
  expect(readEntryIds).toEqual(new Set(['beam', 'glass']));
  result.availableCatalog[0].implementationKnowledge.notes = 'modified';
  expect(records.get('beam')?.notes).not.toBe('modified');
});

it('treats valid protected selections as already read and never exposes a draft or unverified selection', () => {
  const { readEntryIds } = setup({ referenceKeys: refKeys(), protectedEntryIds: ['beam', 'draft', 'unverified', 'unknown'] });
  expect(readEntryIds).toEqual(new Set(['beam']));
});

it.each([{ refKeys: ['unknown'] }, { refKeys: ['beam'] }, { refKeys: ['ref_005'] }, { refKeys: ['ref_006'] }, { refKeys: ['ref_001', 'unknown'] }])('rejects unavailable details without marking partial reads: %j', async args => {
  const { details, readEntryIds } = setup();
  await expect(details.execute(args)).rejects.toMatchObject({ code: 'REFERENCE_TOOL_UNKNOWN_REFERENCE' });
  expect(readEntryIds.size).toBe(0);
});

it.each([{ query: '' }, { query: '卡片', limit: 13 }, { query: '卡片', limit: '2' }, { query: '卡片', stage: 'animation' }, { query: '卡片', layer: 'all' }, { query: '卡片', extra: true }])('strictly rejects invalid search arguments: %j', async args => {
  const { search } = setup();
  await expect(search.execute(args)).rejects.toMatchObject({ code: 'REFERENCE_TOOL_INVALID_ARGUMENT' });
});

it.each([{ refKeys: [] }, { refKeys: Array(9).fill('ref_001') }, { refKeys: [123] }, { refKeys: ['ref_001'], query: 'extra' }])('strictly rejects invalid detail arguments: %j', async args => {
  const { details } = setup();
  await expect(details.execute(args)).rejects.toMatchObject({ code: 'REFERENCE_TOOL_INVALID_ARGUMENT' });
});

it('does not fabricate missing implementation knowledge or add such a case to read IDs', async () => {
  const library = createReferenceLibrary([catalog[0]], new Map(), { referenceKeys: new Map([['beam', 'ref_001']]) });
  await expect(library.tools[1].execute({ refKeys: ['ref_001'] })).rejects.toMatchObject({ code: 'REFERENCE_KNOWLEDGE_MISSING' });
  expect(library.readEntryIds.size).toBe(0);
});

it.each(['missing', 'wrong-id', 'wrong-source'])('does not pre-read a protected case with %s knowledge', async mode => {
  const row = { ...records.get('beam')! };
  if (mode === 'wrong-id') row.entryId = 'another-case';
  if (mode === 'wrong-source') row.sourceUrl = 'https://reactbits.dev/components/another-case';
  const sourceKnowledge = mode === 'missing' ? new Map<string, CaseKnowledge>() : new Map([['beam', row]]);
  const library = createReferenceLibrary([catalog[0]], sourceKnowledge, { referenceKeys: new Map([['beam', 'ref_001']]), protectedEntryIds: ['beam'] });
  expect(library.readEntryIds.size).toBe(0);
  const search: any = await library.tools[0].execute({ query: 'Border Beam' });
  expect(search.candidates[0].summary).toBe(catalog[0].description);
  await expect(library.tools[1].execute({ refKeys: ['ref_001'] })).rejects.toMatchObject({ code: 'REFERENCE_KNOWLEDGE_MISSING' });
  expect(library.readEntryIds.size).toBe(0);
});

it('accepts the same normalized source relationship as the strict knowledge loader', async () => {
  const row = { ...records.get('beam')!, sourceUrl: 'https://www.reactbits.dev/components/beam/?utm_source=fixture#demo' };
  const library = createReferenceLibrary([catalog[0]], new Map([['beam', row]]), { referenceKeys: new Map([['beam', 'ref_001']]) });
  const result: any = await library.tools[1].execute({ refKeys: ['ref_001'] });
  expect(result.availableCatalog[0].sourceUrl).toBe(catalog[0].sourceUrl);
  expect(result.availableCatalog[0].implementationKnowledge).toEqual(row);
  expect(library.readEntryIds.has('beam')).toBe(true);
});

it('supports cancellation before work or during progress callbacks without changing access tracking', async () => {
  const stopped = new AbortController(); stopped.abort();
  const first = setup();
  await expect(first.search.execute({ query: '卡片' }, stopped.signal)).rejects.toMatchObject({ name: 'AbortError' });
  await expect(first.details.execute({ refKeys: ['ref_001'] }, stopped.signal)).rejects.toMatchObject({ name: 'AbortError' });
  const active = new AbortController(); const onActivity = vi.fn(() => active.abort());
  const second = setup({ referenceKeys: refKeys(), onActivity });
  await expect(second.details.execute({ refKeys: ['ref_001'] }, active.signal)).rejects.toMatchObject({ name: 'AbortError' });
  expect(second.readEntryIds.size).toBe(0); expect(second.searchedEntryIds.size).toBe(0);
});

it('finds every one of the real 350 ready cases by exact English and Chinese name across the entire library', async () => {
  const entries = JSON.parse(await readFile('data/catalog.json', 'utf8')) as CatalogEntry[];
  const ready = entries.filter(source => source.status === 'ready' && source.preview.type === 'video' && source.preview.verified);
  expect(ready).toHaveLength(350);
  const keys = refKeys(ready); const sourceKnowledge = await loadCaseKnowledge(process.cwd(), entries);
  const library = createReferenceLibrary(ready, sourceKnowledge, { referenceKeys: keys });
  for (const source of ready) for (const query of [source.name, source.title]) {
    const result: any = await library.tools[0].execute({ query, limit: 12 });
    expect(result.candidates.map((item: any) => item.refKey), query).toContain(keys.get(source.id));
  }
}, 15000);
