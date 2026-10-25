import { load } from 'cheerio';
import type { CatalogEntry, SourceId, SourceInfo, Stage } from '../shared/types';
import { ApiError, normalizeUrl, stableId } from './core';
import { enrichCatalog, loadCurations } from './enrichment';

export const sourceDefinitions: Omit<SourceInfo, 'count' | 'lastSyncedAt'>[] = [
  { id: 'designeer', name: 'Designeer', url: 'https://www.designeer.xyz/', kind: 'directory' },
  { id: 'reactbits', name: 'React Bits', url: 'https://www.reactbits.dev/get-started/index', kind: 'components' },
  { id: 'aceternity', name: 'Aceternity UI', url: 'https://ui.aceternity.com/ai-recommendations', kind: 'components' },
  { id: 'codrops', name: 'Codrops', url: 'https://tympanus.net/codrops/', kind: 'cases' },
  { id: '60fps', name: '60fps', url: 'https://60fps.design/', kind: 'cases' },
];
const hosts: Record<string, SourceId> = {
  'designeer.xyz': 'designeer', 'www.designeer.xyz': 'designeer',
  'reactbits.dev': 'reactbits', 'www.reactbits.dev': 'reactbits',
  'ui.aceternity.com': 'aceternity', 'assets.aceternity.com': 'aceternity',
  'tympanus.net': 'codrops', 'www.tympanus.net': 'codrops',
  '60fps.design': '60fps', 'www.60fps.design': '60fps',
};
export function assertSourceUrl(value: string): SourceId {
  let url: URL;
  try { url = new URL(value); } catch { throw new ApiError('请输入有效的来源网址。'); }
  const source = hosts[url.hostname];
  if (url.protocol !== 'https:' || !source || url.username || url.password || url.port) throw new ApiError('仅支持预设的五个来源的 HTTPS 网址，不接受其他主机、端口或登录信息。', 400, 'SOURCE_URL_BLOCKED');
  return source;
}
export function fetchSource(value: string, method: 'GET' | 'HEAD' = 'GET'): Promise<Response> {
  return fetchAllowed(value, method, assertSourceUrl);
}
function assertMediaUrl(value: string): SourceId {
  const url = new URL(value);
  if (url.hostname === 'video.gumlet.io' && url.protocol === 'https:' && !url.username && !url.password && !url.port) return '60fps';
  return assertSourceUrl(value);
}
export function fetchMedia(value: string, method: 'GET' | 'HEAD' = 'HEAD'): Promise<Response> {
  return fetchAllowed(value, method, assertMediaUrl, true);
}
async function fetchAllowed(value: string, method: 'GET' | 'HEAD', validate: (url: string) => SourceId, media = false): Promise<Response> {
  let url = value;
  const source = validate(url);
  for (let hop = 0; hop < 6; hop++) {
    if (validate(url) !== source) throw new ApiError('来源重定向到了不同的网站，已停止请求。', 502, 'SOURCE_REDIRECT_BLOCKED');
    let response: Response;
    try { response = await fetch(url, { method, redirect: 'manual', signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'VisualIntentStudio/0.1 (local catalog import)', Accept: media ? 'video/*' : method === 'HEAD' ? '*/*' : 'text/html,application/json', ...(media && method === 'GET' ? { Range: 'bytes=0-31' } : {}) } }); }
    catch { throw new ApiError('来源网站暂时无法访问，请稍后重试。', 502, 'SOURCE_UNAVAILABLE'); }
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      await response.body?.cancel();
      if (!location) throw new ApiError('来源重定向缺少目标。', 502);
      url = new URL(location, url).toString();
      continue;
    }
    if (!response.ok) { await response.body?.cancel(); throw new ApiError(`来源返回 HTTP ${response.status}，请稍后重试。`, 502, 'SOURCE_HTTP_ERROR'); }
    return response;
  }
  throw new ApiError('来源重定向次数过多。', 502, 'SOURCE_REDIRECT_LIMIT');
}
export async function readSourceHtml(url: string): Promise<string> {
  const response = await fetchSource(url);
  const type = response.headers.get('content-type') || '';
  if (!/text\/html|application\/xhtml\+xml/.test(type)) { await response.body?.cancel(); throw new ApiError('来源未返回可解析的 HTML 页面。', 502); }
  return readResponseText(response);
}
async function readResponseText(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) throw new ApiError('来源返回空页面。', 502);
  const chunks: Uint8Array[] = []; let size = 0;
  for (;;) { const chunk = await reader.read(); if (chunk.done) break; size += chunk.value.length; if (size > 8 * 1024 * 1024) { await reader.cancel(); throw new ApiError('来源页面超过 8MB，已停止读取。', 502); } chunks.push(chunk.value); }
  return Buffer.concat(chunks).toString('utf8');
}
function safeLink(href: string | undefined, base: string): string | undefined {
  if (!href) return undefined;
  try { const url = new URL(href, base); return url.protocol === 'https:' && !url.username && !url.password ? url.toString() : undefined; } catch { return undefined; }
}
function inferStage(name: string, categories: string[] = []): Stage {
  if (/bento|layout|navbar|navigation|sidebar|timeline|accordion|grid|footer|pricing/i.test(name)) return 'structure';
  if (/gradient|background|glass|noise|texture/i.test(name) && !/animation|beam|moving|aurora|ripple/i.test(name)) return 'style';
  if (categories.includes('layout') || categories.includes('navigation')) return 'structure';
  return 'effect';
}
function draft(sourceId: SourceId, name: string, url: string, description: string, stage = inferStage(name)): CatalogEntry {
  const sourceUrl = normalizeUrl(url);
  return { id: stableId(sourceUrl), name, title: name, stage, description, aliases: [], trigger: '以原站说明为准', placements: [], tags: [], sourceId, sourceUrl, implementationUrl: sourceUrl, preview: { type: 'link', url: sourceUrl, verified: false, provenance: 'original', note: '已导入元数据；尚未验证可播放视频。' }, status: 'draft', updatedAt: new Date().toISOString() };
}
export function parseAceternity(html: string): CatalogEntry[] {
  const $ = load(html); const entries: CatalogEntry[] = [];
  for (const node of $('pre').toArray()) {
    let data: unknown;
    try { data = JSON.parse($(node).text().trim()); } catch { continue; }
    const rows = Array.isArray(data) ? data : data && typeof data === 'object' && 'components' in data ? (data as { components: unknown[] }).components : [];
    if (!Array.isArray(rows)) continue;
    for (const row of rows) {
      if (!row || typeof row !== 'object' || row.isPro === true || row.isTemplate === true) continue;
      const url = safeLink(row.documentationUrl ?? row.url, 'https://ui.aceternity.com');
      if (!url || new URL(url).hostname !== 'ui.aceternity.com' || !new URL(url).pathname.startsWith('/components/')) continue;
      const name = String(row.title || row.name || row.slug || '').trim();
      if (!name) continue;
      const categories = Array.isArray(row.categories) ? row.categories.filter((tag: unknown) => typeof tag === 'string') : [];
      const entry = draft('aceternity', name, url, String(row.description || ''), inferStage(name, categories));
      entry.tags = categories; entry.placements = categories.filter((tag: string) => ['hero', 'card', 'footer', 'section', 'navigation'].includes(tag));
      if (typeof row.image === 'string') entry.preview.poster = safeLink(row.image, url);
      entries.push(entry);
    }
  }
  return unique(entries);
}
export function parseReactBits(html: string): CatalogEntry[] {
  const $ = load(html); const entries: CatalogEntry[] = [];
  for (const node of $('a[href]').toArray()) {
    const url = safeLink($(node).attr('href'), 'https://www.reactbits.dev');
    if (!url || !['www.reactbits.dev', 'reactbits.dev'].includes(new URL(url).hostname) || !/^\/(text-animations|animations|components|backgrounds|micro)\/[^/]+\/?$/.test(new URL(url).pathname)) continue;
    const name = $(node).text().trim(); if (!name) continue;
    const entry = draft('reactbits', name, url, 'React Bits 官方目录条目；具体行为与参数请查看原站。');
    entry.tags = [new URL(url).pathname.split('/')[1]];
    entries.push(entry);
  }
  return unique(entries);
}
export function parseCasePage(html: string, originalUrl: string, stage?: Stage): CatalogEntry {
  const sourceId = assertSourceUrl(originalUrl);
  const $ = load(html);
  const canonical = safeLink($('link[rel="canonical"]').attr('href'), originalUrl);
  let sourceUrl = originalUrl;
  if (canonical) { try { if (assertSourceUrl(canonical) === sourceId) sourceUrl = canonical; } catch { /* Ignore an external canonical URL. */ } }
  const name = $('h1').first().text().trim() || $('meta[property="og:title"]').attr('content') || $('title').text().trim();
  if (!name) throw new ApiError('此页面没有可提取的标题。', 502, 'SOURCE_PARSE_ERROR');
  const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || $('main p, article p').first().text().trim();
  const entry = draft(sourceId, name, sourceUrl, description, stage);
  const structuredVideos: { name?: string; contentUrl: string; thumbnailUrl?: string | string[] }[] = [];
  for (const node of $('script[type="application/ld+json"]').toArray()) {
    try {
      const data = JSON.parse($(node).text());
      const records = Array.isArray(data) ? data : Array.isArray(data?.['@graph']) ? data['@graph'] : [data];
      for (const record of records) {
        if (record && (record['@type'] === 'VideoObject' || (Array.isArray(record['@type']) && record['@type'].includes('VideoObject'))) && typeof record.contentUrl === 'string') structuredVideos.push(record);
      }
    } catch { /* Ignore malformed structured metadata and use visible media. */ }
  }
  const primaryVideo = structuredVideos.find(video => video.name === name) || structuredVideos[0];
  const video = safeLink(primaryVideo?.contentUrl, originalUrl) || $('video[src], video source[src]').toArray().map(node => safeLink($(node).attr('src'), originalUrl)).find(Boolean)
    || safeLink($('meta[property="og:video"], meta[property="og:video:url"]').attr('content'), originalUrl);
  const thumbnail = Array.isArray(primaryVideo?.thumbnailUrl) ? primaryVideo.thumbnailUrl[0] : primaryVideo?.thumbnailUrl;
  if (video) entry.preview = { type: 'video', url: video, poster: safeLink(thumbnail, originalUrl), verified: false, provenance: 'original', note: '页面列出的视频地址，尚未验证响应与播放。' };
  const links = $('a[href]').toArray().map(node => ({ text: $(node).text().replace(/\s+/g, ' ').trim(), url: safeLink($(node).attr('href'), originalUrl) }));
  entry.implementationUrl = links.find(link => link.url && (/^(code|source code|view code|github|源码)$/i.test(link.text) || /^https:\/\/github\.com\/(?!orgs\/|topics\/|sponsors\/|settings\/|search\/)[^/?#]+\/[^/?#]+/i.test(link.url)))?.url || links.find(link => /^(demo|live demo|view demo|live|演示|查看演示)$/i.test(link.text) && link.url)?.url;
  return entry;
}
function parseDesigneer(html: string): CatalogEntry[] {
  const $ = load(html);
  const directory = draft('designeer', 'Designeer 设计资源目录', 'https://www.designeer.xyz/', '设计资源、组件库与灵感站点导航；目录链接仅用于发现资料，不能作为特效视频。', 'structure');
  const entries = [directory];
  for (const node of $('a[href]').toArray()) {
    const href = $(node).attr('href') || '';
    if (!/^\/(components|build|visuals|utilities|designers)\/?$/.test(href)) continue;
    const name = $(node).text().trim();
    entries.push(draft('designeer', name, new URL(href, directory.sourceUrl).toString(), 'Designeer 目录分区；用于人工发现参考，不代表某个可播放特效。', 'structure'));
  }
  return unique(entries);
}
function unique(entries: CatalogEntry[]): CatalogEntry[] { return [...new Map(entries.map(entry => [entry.sourceUrl, entry])).values()]; }
export async function syncSource(sourceId: SourceId): Promise<CatalogEntry[]> {
  const source = sourceDefinitions.find(item => item.id === sourceId);
  if (!source) throw new ApiError('未知来源。', 404);
  if (source.kind === 'cases') throw new ApiError('此来源按具体案例网址导入，请粘贴一个案例页面链接。', 400, 'CASE_URL_REQUIRED');
  const html = await readSourceHtml(source.url);
  const entries = sourceId === 'aceternity' ? parseAceternity(html) : sourceId === 'reactbits' ? parseReactBits(html) : parseDesigneer(html);
  if (!entries.length) throw new ApiError('来源页面结构已改变，未找到目录条目。', 502, 'SOURCE_PARSE_ERROR');
  return unique(await enrichCatalog(entries));
}
export async function importSource(url: string, stage?: Stage): Promise<CatalogEntry> {
  const sourceId = assertSourceUrl(url);
  const curation = (await loadCurations()).get(normalizeUrl(url));
  const resolvedUrl = curation?.resolvedSourceUrl || url;
  if (assertSourceUrl(resolvedUrl) !== sourceId) throw new ApiError('已核验地址指向了不同的来源，已停止请求。', 502, 'SOURCE_REDIRECT_BLOCKED');
  let entry: CatalogEntry;
  if (curation?.resolvedSourceUrl && sourceId === 'aceternity' && /^\/registry\/[^/]+\.json$/.test(new URL(resolvedUrl).pathname)) {
    const response = await fetchSource(resolvedUrl);
    if (!/application\/(?:[\w.+-]*\+)?json/i.test(response.headers.get('content-type') || '')) { await response.body?.cancel(); throw new ApiError('来源未返回可解析的组件注册表。', 502, 'SOURCE_PARSE_ERROR'); }
    let registry: { name?: string; title?: string; files?: unknown[] };
    try { registry = JSON.parse(await readResponseText(response)); }
    catch (error) { if (error instanceof ApiError) throw error; throw new ApiError('组件注册表内容无法解析。', 502, 'SOURCE_PARSE_ERROR'); }
    if (!registry || typeof registry !== 'object' || !Array.isArray(registry.files) || !registry.files.length || !(typeof registry.title === 'string' || typeof registry.name === 'string')) throw new ApiError('组件注册表缺少名称或实现文件。', 502, 'SOURCE_PARSE_ERROR');
    entry = draft(sourceId, registry.title || registry.name!, resolvedUrl, curation.description, stage);
  } else entry = parseCasePage(await readSourceHtml(resolvedUrl), resolvedUrl, stage);
  return (await enrichCatalog([entry]))[0];
}
