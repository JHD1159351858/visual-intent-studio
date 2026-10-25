import { describe, expect, it } from 'vitest';
import type { CatalogEntry, DesignPromptRequest, DesignPromptResult } from '../shared/types';
import type { SelectionHistoryRecord, SelectionMainVisual } from '../server/selection-history';
import { createDiversityContext, findSimilarDesign, pageKeyFor, sanitizeMainVisuals, visualFamiliesFor } from '../server/selection-diversity';

function entry(id: string, title: string, description = title): CatalogEntry {
  return { id, name: id, title, description, aliases: [], tags: [], placements: ['首屏'], trigger: '持续', stage: 'effect', sourceId: 'reactbits', sourceUrl: `https://example.com/${id}`, status: 'ready', updatedAt: '', preview: { type: 'video', url: `/media/${id}.webm`, verified: true, provenance: 'reference-recording' } };
}
const entries = [entry('liquid', '流体背景'), entry('ribbons', '丝绸背景'), entry('particles', '粒子聚散文字'), entry('scramble', '乱码解密文字'), entry('spotlight', '鼠标卡片聚光'), entry('travel', '旅行地图轨道', '旅行规划地图与沿轨道旋转图片')];
const visual = (family: string, entryIds: string[], role: SelectionMainVisual['role'] = 'background'): SelectionMainVisual => ({ family, entryIds, role, description: '首屏主要视觉运动' });
const request = (overrides: Partial<DesignPromptRequest> & { conversationId?: string } = {}): DesignPromptRequest & { conversationId?: string } => ({ brief: '做一个强动效页面', selections: [], ...overrides });
const result = (mainVisuals: SelectionMainVisual[] = [], ids = mainVisuals.flatMap(item => item.entryIds)): DesignPromptResult & { mainVisuals: SelectionMainVisual[] } => ({ message: '完成', developerPrompt: '页面提示词', referenceEntryIds: ids, assumptions: [], mainVisuals });
function history(pageKey: string, ids: string[], mainVisuals: SelectionMainVisual[] = []): SelectionHistoryRecord {
  return { id: pageKey, pageKey, purpose: '不同页面用途', createdAt: '2026-10-24T00:00:00.000Z', referenceEntryIds: ids, mainVisuals };
}

describe('selection diversity policy', () => {
  it('keeps an empty-history catalog unchanged and never deletes candidates', () => {
    expect(createDiversityContext(request(), entries, []).rankedEntries).toEqual(entries);
    const context = createDiversityContext(request(), entries, [history('one', ['liquid']), history('two', ['liquid'])]);
    expect(context.rankedEntries.map(item => item.id).sort()).toEqual(entries.map(item => item.id).sort());
    expect(context.rankedEntries.findIndex(item => item.id === 'liquid')).toBeGreaterThan(context.rankedEntries.findIndex(item => item.id === 'ribbons'));
    expect(context.frequentEntries.find(item => item.entryId === 'liquid')).toMatchObject({ uses: 2 });
  });
  it('keeps more relevant high-frequency material ahead of unrelated unused material', () => {
    const records = Array.from({ length: 30 }, (_, index) => history(`page-${index}`, ['travel']));
    const context = createDiversityContext(request({ brief: '旅行规划地图页面，动效特别强' }), entries, records);
    expect(context.rankedEntries[0].id).toBe('travel');
    expect(context.frequentEntries.find(item => item.entryId === 'travel')!.penalty).toBeLessThanOrEqual(0.25);
  });
  it('shows static and pure-layout usage without penalizing their reuse', () => {
    const staticEntries = [entry('glass', '半透明玻璃表面', '静态磨砂材质'), entry('layout', '错落功能网格', 'CSS Grid组织卡片布局')];
    const records = [history('one', ['glass', 'layout']), history('two', ['glass', 'layout'])];
    expect(createDiversityContext(request(), staticEntries, records).frequentEntries).toEqual([
      { entryId: 'glass', uses: 2, penalty: 0 }, { entryId: 'layout', uses: 2, penalty: 0 },
    ]);
  });
  it('keeps catalog order and disables all frequency penalties for an explicit still request', () => {
    const context = createDiversityContext(request({ brief: '旅行规划地图页面，不要动画，保持静态' }), entries, [history('one', ['liquid', 'travel']), history('two', ['liquid', 'travel'])]);
    expect(context.rankedEntries).toEqual(entries);
    expect(context.frequentEntries.every(item => item.penalty === 0)).toBe(true);
  });
  it('exempts confirmed and explicitly positively named entries, but not rejected names', () => {
    const context = createDiversityContext(request({ brief: '使用丝绸背景，保留 particles。不要鼠标卡片聚光。', selections: [{ entryId: 'liquid', stage: 'effect', placement: '首屏', adjustments: '' }] }), entries, [history('one', ['liquid', 'ribbons', 'particles', 'spotlight']), history('two', ['liquid', 'ribbons', 'particles', 'spotlight'])]);
    expect(context.protectedEntryIds).toEqual(expect.arrayContaining(['liquid', 'ribbons', 'particles']));
    expect(context.protectedEntryIds).not.toContain('spotlight');
    expect(context.frequentEntries.filter(item => context.protectedEntryIds.includes(item.entryId)).every(item => item.penalty === 0)).toBe(true);
  });
  it('keeps a positively named visual protected when a later constraint forbids flickering', () => {
    const liquid = { ...entry('liquid-ether', '流体背景'), name: 'Liquid Ether' };
    const context = createDiversityContext(request({ brief: '请使用流体背景但不要闪烁' }), [liquid], []);
    expect(context.protectedEntryIds).toContain('liquid-ether');
    expect(createDiversityContext(request({ brief: '使用 Liquid Ether，不要闪烁' }), [liquid], []).protectedEntryIds).toContain('liquid-ether');
  });
  it('removes name-based protection when the latest instruction really rejects that visual', () => {
    const liquid = { ...entry('liquid-ether', '流体背景'), name: 'Liquid Ether' };
    const context = createDiversityContext(request({ brief: '使用 Liquid Ether', messages: [{ role: 'user', content: '不要使用Liquid Ether' }] }), [liquid], []);
    expect(context.protectedEntryIds).not.toContain('liquid-ether');
  });
  it('uses stable private page keys and excludes the current page from history and frequency', () => {
    const first = request({ conversationId: 'same-conversation', brief: '课程资料' });
    const next = request({ conversationId: 'same-conversation', brief: '现在换个配色' });
    expect(pageKeyFor(first)).toBe(pageKeyFor(next));
    expect(pageKeyFor(first)).not.toContain('same-conversation');
    expect(pageKeyFor(request({ brief: '  Course  Desk ' }))).toBe(pageKeyFor(request({ brief: 'course desk' })));
    const context = createDiversityContext(next, entries, [history(pageKeyFor(first), ['liquid']), history('other', ['liquid'])]);
    expect(context.recentDesigns).toHaveLength(1);
    expect(context.frequentEntries.find(item => item.entryId === 'liquid')?.uses || 1).toBe(1);
  });
  it('sanitizes metadata against referenced real entries and known behavior families', () => {
    expect(visualFamiliesFor(entry('glass', '半透明玻璃表面', '静态半透明磨砂玻璃材质'))).toEqual([]);
    expect(visualFamiliesFor(entries[0])).toContain('fluid-flow');
    expect(sanitizeMainVisuals([
      visual('fluid-flow', ['liquid']), visual('fluid-flow', ['ribbons']),
      visual('made-up-family', ['liquid']), visual('fluid-flow', ['missing']),
      visual('silk-ribbons', ['ribbons']), visual('image-orbit', []),
    ], ['liquid', 'ribbons'], entries)).toEqual([visual('fluid-flow', ['liquid']), visual('silk-ribbons', ['ribbons']), visual('image-orbit', [])]);
  });
  it('detects an overlapping main visual mechanism combination across pages', () => {
    const visuals = [visual('fluid-flow', ['liquid']), visual('text-particles', ['particles'], 'title')];
    expect(findSimilarDesign(result(visuals), request(), entries, [history('other', ['liquid', 'particles'], visuals)])?.record.pageKey).toBe('other');
  });
  it('does not treat auxiliary repeats, absent metadata, or one occasional main visual reuse as a repeated page', () => {
    const main = [visual('fluid-flow', ['liquid'])];
    const records = [history('other', ['liquid', 'spotlight'], main)];
    expect(findSimilarDesign(result([], ['spotlight']), request(), entries, records)).toBeNull();
    expect(findSimilarDesign(result(main, ['liquid', 'spotlight']), request(), entries, records)).toBeNull();
  });
  it('detects one main mechanism only after use by at least two different previous pages', () => {
    const main = [visual('fluid-flow', ['liquid'])];
    const records = [history('one', ['liquid'], main), history('two', ['liquid'], main)];
    expect(findSimilarDesign(result(main), request(), entries, records)).not.toBeNull();
    expect(findSimilarDesign(result(main), request(), entries, [records[0], records[0]])).toBeNull();
  });
  it('never requests reselection for current-page revisions, protected main visuals, or still pages', () => {
    const visuals = [visual('fluid-flow', ['liquid']), visual('text-particles', ['particles'], 'title')];
    const output = result(visuals); const same = request({ conversationId: 'same' });
    expect(findSimilarDesign(output, same, entries, [history(pageKeyFor(same), output.referenceEntryIds, visuals)])).toBeNull();
    expect(findSimilarDesign(output, request({ brief: '使用流体背景和粒子聚散文字' }), entries, [history('one', output.referenceEntryIds, visuals), history('two', output.referenceEntryIds, visuals)])).toBeNull();
    expect(findSimilarDesign(output, request({ brief: '纯静态页面，不要动画' }), entries, [history('one', output.referenceEntryIds, visuals)])).toBeNull();
  });
  it.each(['沿用上一版主视觉', '保持主视觉不变', '保持品牌视觉一致'])('honors an explicit visual consistency request: %s', instruction => {
    const visuals = [visual('fluid-flow', ['liquid']), visual('text-particles', ['particles'], 'title')];
    const output = result(visuals);
    expect(findSimilarDesign(output, request({ messages: [{ role: 'user', content: instruction }] }), entries, [history('one', output.referenceEntryIds, visuals)])).toBeNull();
  });
  it.each(['这次重新设计主视觉', '主视觉换一套', '更换主视觉'])('lets the latest explicit main-visual change override an older keep instruction: %s', instruction => {
    const visuals = [visual('fluid-flow', ['liquid']), visual('text-particles', ['particles'], 'title')];
    const output = result(visuals);
    const input = request({ messages: [{ role: 'user', content: '保持主视觉不变' }, { role: 'user', content: instruction }] });
    expect(findSimilarDesign(output, input, entries, [history('one', output.referenceEntryIds, visuals)])).not.toBeNull();
  });
  it('keeps visual consistency through ordinary color changes and honors a later keep instruction', () => {
    const visuals = [visual('fluid-flow', ['liquid']), visual('text-particles', ['particles'], 'title')];
    const output = result(visuals); const records = [history('one', output.referenceEntryIds, visuals)];
    expect(findSimilarDesign(output, request({ messages: [{ role: 'user', content: '保持主视觉不变' }, { role: 'user', content: '把配色改为蓝色' }] }), entries, records)).toBeNull();
    expect(findSimilarDesign(output, request({ messages: [{ role: 'user', content: '重新设计主视觉' }, { role: 'user', content: '沿用上一版主视觉' }] }), entries, records)).toBeNull();
  });
});
