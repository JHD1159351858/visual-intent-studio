import { createHash } from 'node:crypto';
import type { CatalogEntry, DesignPromptRequest, DesignPromptResult } from '../shared/types';
import { motionIntensity } from '../shared/motion';
import type { SelectionHistoryRecord, SelectionMainVisual } from './selection-history';

export const visualFamilyNames = ['fluid-flow', 'silk-ribbons', 'gradient-blobs', 'grid-scan', 'line-field', 'starfield', 'image-orbit', 'image-wall', 'card-stack', 'scroll-depth', 'text-particles', 'text-reveal', 'text-scramble', 'text-swap', 'pointer-tilt', 'spotlight', 'border-beam', 'sphere-orb', 'image-distortion', 'parallax-layers', 'magnetic-attraction', 'ripple-burst', 'shape-morph', 'texture-flow', 'light-tunnel', 'other'];
const familyPatterns: [string, RegExp][] = [
  ['fluid-flow', /fluid|liquid(?!\s*glass)|流体|液体|液态(?!玻璃)/i],
  ['silk-ribbons', /silk|ribbon|丝绸|丝带/i],
  ['gradient-blobs', /gradient.?blobs?|gradient.?background|渐变(?:色团|背景)|色团|模糊渐变/i],
  ['grid-scan', /grid.?scan|扫描|三维网格|网格背景/i],
  ['line-field', /line.?field|流线|磁流线|等高线/i],
  ['starfield', /starfield|galaxy|星河|星空|星场/i],
  ['image-orbit', /orbit|轨道|环绕图片/i],
  ['image-wall', /image.?wall|图片墙|图像墙|跑马墙/i],
  ['card-stack', /card.?stack|叠放卡片|层叠卡片|堆叠卡片/i],
  ['scroll-depth', /scroll.{0,12}(?:depth|3d|transform)|滚动.{0,12}(?:纵深|立体|屏幕|视差)|container.?scroll|macbook/i],
  ['text-particles', /particle.{0,12}text|text.{0,12}particle|粒子.{0,8}(?:文字|聚字)|聚散文字/i],
  ['text-reveal', /split.?text|blur.?text|text.?reveal|逐字|逐词|文字.{0,8}(?:入场|显现|揭示|模糊)/i],
  ['text-scramble', /scramble|decrypt|解密|乱码/i],
  ['text-swap', /rotat.{0,8}text|text.{0,8}rotat|文字.{0,8}(?:轮换|切换|翻转)|翻词|换词|关键词/i],
  ['pointer-tilt', /tilt|倾斜/i],
  ['spotlight', /spotlight|聚光/i],
  ['border-beam', /border.?beam|moving.?border|流(?:动|光).{0,8}(?:边|框)|边(?:缘|框).{0,8}(?:流|追光)|绕.{0,8}亮边/i],
  ['sphere-orb', /sphere|\borb\b|metaball|球|元球/i],
  ['image-distortion', /distort|image.{0,12}(?:ripple|displace)|(?:图片|图像).{0,8}(?:扭曲|变形|波纹)|虹彩/i],
  ['parallax-layers', /parallax|多层视差|鼠标驱动的多层/i],
  ['magnetic-attraction', /magnet(?:ic|ism)?|磁吸|吸引/i],
  ['ripple-burst', /ripple|波纹|涟漪|迸出|火花/i],
  ['shape-morph', /morph|形变|变形|融合分离/i],
  ['texture-flow', /texture|noise|grain|颗粒|噪声/i],
  ['light-tunnel', /light.{0,8}tunnel|光纤|隧道/i],
];

export function visualFamiliesFor(entry: CatalogEntry): string[] {
  const text = [entry.name, entry.title, entry.trigger, entry.description].join(' ');
  return familyPatterns.filter(([, pattern]) => pattern.test(text)).map(([family]) => family);
}

export function sanitizeMainVisuals(value: unknown, referenceIDs: string[], entries: CatalogEntry[]): SelectionMainVisual[] {
  if (!Array.isArray(value)) return [];
  const references = new Set(referenceIDs);
  const available = new Map(entries.filter(entry => entry.status === 'ready' && entry.preview.type === 'video' && entry.preview.verified).map(entry => [entry.id, entry]));
  const visuals: SelectionMainVisual[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (!item || typeof item !== 'object' || !['background', 'hero', 'title'].includes(item.role) || !visualFamilyNames.includes(item.family) || typeof item.description !== 'string' || !item.description.trim() || !Array.isArray(item.entryIds) || item.entryIds.length > 10 || item.entryIds.some((id: unknown) => typeof id !== 'string' || !references.has(id) || !available.has(id))) continue;
    const entryIds = [...new Set<string>(item.entryIds)];
    if (entryIds.some(id => { const families = visualFamiliesFor(available.get(id)!); return families.length > 0 && !families.includes(item.family); })) continue;
    const key = `${item.role}:${item.family}:${[...entryIds].sort().join(',')}`;
    if (seen.has(key)) continue;
    seen.add(key); visuals.push({ role: item.role, family: item.family, entryIds, description: item.description.trim().slice(0, 1000) });
    if (visuals.length === 6) break;
  }
  return visuals;
}

export function pageKeyFor(request: DesignPromptRequest): string {
  const conversationId = (request as DesignPromptRequest & { conversationId?: string }).conversationId;
  const identity = conversationId ? 'conversation:' + conversationId : 'brief:' + request.brief.trim().toLowerCase().replace(/\s+/g, ' ');
  return createHash('sha256').update(identity).digest('hex').slice(0, 24);
}

function protectedEntries(request: DesignPromptRequest, entries: CatalogEntry[]): Set<string> {
  const protectedIds = new Set(request.selections.map(selection => selection.entryId));
  const messages = [request.brief, ...(request.messages || []).filter(message => message.role === 'user').map(message => message.content)];
  for (const entry of entries) {
    if (protectedIds.has(entry.id)) continue;
    let named = false;
    for (const message of messages) for (const clause of message.toLowerCase().split(/[，,。；;！!？?\n]/)) {
      const names = [entry.id, entry.name, entry.title].map(name => name.toLowerCase()).filter(name => name.length >= 3);
      const mention = names.map(name => ({ name, index: clause.indexOf(name) })).filter(item => item.index >= 0).sort((left, right) => left.index - right.index || right.name.length - left.name.length)[0];
      if (!mention) continue;
      const positive = /采用|使用|保留|指定|就用|沿用|应用|加上|添加|搭配|参考|需要|想要|换成|用|\buse\b|\bkeep\b|\bretain\b|\bapply\b|\badd\b/.test(clause) || clause.trim() === entry.id.toLowerCase();
      const beforeName = clause.slice(0, mention.index);
      const afterName = clause.slice(mention.index + mention.name.length).trim();
      const negative = /不要|不用|别用|不使用|去掉|移除|删除|排除|避免|取消|\bavoid\b|\bremove\b|\bwithout\b|\bnot\b/.test(beforeName) || /^(?:不要用|不用|别用|不使用|去掉|移除|删除|排除|取消)(?:了|掉)?$/.test(afterName);
      if (positive || negative) named = positive && !negative;
    }
    if (named) protectedIds.add(entry.id);
  }
  return protectedIds;
}

const ignoredTerms = new Set(['页面', '动效', '动画', '效果', '用户', '支持', '功能', '使用', '这个', '一个', '需要', '希望', '特别', '明显', '我的', '强动', 'html', 'with', 'page', 'motion']);
function relevanceTerms(request: DesignPromptRequest): string[] {
  const value = [request.brief, ...(request.messages || []).filter(message => message.role === 'user').map(message => message.content)].join(' ').toLowerCase();
  const english = value.match(/[a-z][a-z0-9-]{2,}/g) || [];
  const chinese = [...value.matchAll(/[\u4e00-\u9fff]+/g)].flatMap(match => Array.from({ length: Math.max(0, match[0].length - 1) }, (_, index) => match[0].slice(index, index + 2)));
  return [...new Set([...english, ...chinese])].filter(term => !ignoredTerms.has(term));
}

export function createDiversityContext(request: DesignPromptRequest, entries: CatalogEntry[], history: SelectionHistoryRecord[]): { recentDesigns: SelectionHistoryRecord[]; frequentEntries: { entryId: string; uses: number; penalty: number }[]; rankedEntries: CatalogEntry[]; protectedEntryIds: string[] } {
  const pageKey = pageKeyFor(request);
  const still = motionIntensity(request) === 'still';
  const seenPages = new Set<string>();
  const recentDesigns = history.filter(record => { if (record.pageKey === pageKey || seenPages.has(record.pageKey)) return false; seenPages.add(record.pageKey); return true; }).slice(0, 30);
  const protectedIds = protectedEntries(request, entries);
  const counts = new Map<string, number>();
  for (const record of recentDesigns) for (const id of new Set(record.referenceEntryIds)) counts.set(id, (counts.get(id) || 0) + 1);
  const frequentEntries = entries.flatMap(entry => {
    const uses = counts.get(entry.id) || 0;
    return uses < 2 ? [] : [{ entryId: entry.id, uses, penalty: still || protectedIds.has(entry.id) || !visualFamiliesFor(entry).length ? 0 : Math.min(0.25, (uses - 1) * 0.05) }];
  });
  const penalties = new Map(frequentEntries.map(entry => [entry.entryId, entry.penalty]));
  const terms = relevanceTerms(request);
  const rankedEntries = still || !recentDesigns.length ? [...entries] : entries.map((entry, index) => {
    const text = [entry.name, entry.title, entry.description, ...entry.aliases, ...entry.tags, ...entry.placements].join(' ').toLowerCase();
    const score = terms.filter(term => text.includes(term)).length;
    return { entry, index, score: score - (penalties.get(entry.id) || 0) };
  }).sort((left, right) => right.score - left.score || left.index - right.index).map(item => item.entry);
  return { recentDesigns, frequentEntries, rankedEntries, protectedEntryIds: [...protectedIds] };
}

function overlap(left: Set<string>, right: Set<string>): { common: number; similarity: number } {
  const common = [...left].filter(key => right.has(key)).length;
  return { common, similarity: common / (new Set([...left, ...right]).size || 1) };
}

export function findSimilarDesign(result: DesignPromptResult, request: DesignPromptRequest, entries: CatalogEntry[], history: SelectionHistoryRecord[]): { record: SelectionHistoryRecord; reason: string } | null {
  if (motionIntensity(request) === 'still') return null;
  const userInstructions = [request.brief, ...(request.messages || []).filter(message => message.role === 'user').map(message => message.content)];
  const keepVisuals = /沿用(?:上一版|原有|现有|当前|之前)?(?:的)?主视觉|保持(?:原有|现有|当前|之前)?(?:的)?主视觉不变|保持品牌视觉一致/;
  const changeVisuals = /(?:重新设计|更换|替换|重做|换一套)(?:本页|整页|当前|页面)?(?:的)?主视觉|主视觉(?:要|请|给我)?(?:重新设计|更换|替换|重做|换一套)/;
  for (const text of [...userInstructions].reverse()) {
    const latest = [...text.matchAll(new RegExp(`${keepVisuals.source}|${changeVisuals.source}`, 'g'))].at(-1)?.[0];
    if (!latest) continue;
    if (keepVisuals.test(latest)) return null;
    break;
  }
  const context = createDiversityContext(request, entries, history);
  const protectedIds = new Set(context.protectedEntryIds);
  const mutable = (items: SelectionMainVisual[]) => items.filter(item => !item.entryIds.some(id => protectedIds.has(id)) && item.family !== 'other');
  const current = mutable(sanitizeMainVisuals((result as DesignPromptResult & { mainVisuals?: SelectionMainVisual[] }).mainVisuals, result.referenceEntryIds, entries));
  if (!current.length) return null;
  const candidates = context.recentDesigns.map(record => ({ record, visuals: mutable(sanitizeMainVisuals(record.mainVisuals, record.referenceEntryIds, entries)) }));
  const families = (items: SelectionMainVisual[]) => new Set(items.map(item => `${item.role}:${item.family}`));
  if (current.length === 1) {
    const key = `${current[0].role}:${current[0].family}`;
    const repeated = candidates.filter(item => families(item.visuals).has(key));
    return repeated.length >= 2 ? { record: repeated[0].record, reason: `相同的${current[0].role}/${current[0].family}主视觉机制已出现在近期${repeated.length}个页面；可在用途与美观相当时更换未确认主视觉。` } : null;
  }
  const ids = (items: SelectionMainVisual[]) => new Set(items.flatMap(item => item.entryIds.map(id => `${item.role}:${id}`)));
  for (const candidate of candidates) {
    const familyMatch = overlap(families(current), families(candidate.visuals));
    const idMatch = overlap(ids(current), ids(candidate.visuals));
    if ((familyMatch.common >= 2 && familyMatch.similarity >= 0.8) || (idMatch.common >= 2 && idMatch.similarity >= 0.75)) return { record: candidate.record, reason: '未确认主视觉的角色与运动机制组合和近期页面高度相似；仅在保持用途适配与美观的前提下重新选材。' };
  }
  return null;
}
