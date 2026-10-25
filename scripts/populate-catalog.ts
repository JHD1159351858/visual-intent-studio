import { readFile, writeFile, mkdir, rename, stat, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CatalogEntry } from '../shared/types';
import { applyCuration, loadCurations } from '../server/enrichment';
import { isReady, normalizeUrl, stableId } from '../server/core';

const root = fileURLToPath(new URL('../', import.meta.url));
const readJson = async (file: string) => JSON.parse(await readFile(path.join(root, file), 'utf8'));
let catalog: CatalogEntry[];
try { catalog = await readJson('data/catalog.json'); }
catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; catalog = await readJson('data/catalog.seed.json'); }
await mkdir(path.join(root, 'artifacts'), { recursive: true });
try { await access(path.join(root, 'artifacts/catalog.before-fill.json')); }
catch { await writeFile(path.join(root, 'artifacts/catalog.before-fill.json'), JSON.stringify(catalog, null, 2)); }

const rows = await loadCurations(root);
const manifest = await readJson('data/preview-captures.json');
const captures = new Map<string, typeof manifest.captures[number]>(manifest.captures.map((capture: { entryId: string }) => [capture.entryId, capture]));
const failures = new Map<string, { reason: string }>(manifest.failures.map((failure: { entryId: string }) => [failure.entryId, failure]));
const known = new Set(catalog.map(entry => normalizeUrl(entry.sourceUrl)));
for (const [url, row] of rows) {
  if (known.has(url) || !row.name || row.resolvedSourceUrl === url) continue;
  const sourceId = new URL(url).hostname === 'reactbits.dev' ? 'reactbits' : new URL(url).hostname === '60fps.design' ? '60fps' : 'aceternity';
  catalog.push({ id: stableId(url), name: row.name, title: row.title, description: row.description, stage: row.stage, aliases: [], trigger: row.trigger, placements: row.placements, tags: row.tags, sourceId, sourceUrl: url, implementationUrl: row.implementationUrl || url, preview: { type: 'link', url, verified: false, provenance: 'original' }, status: 'draft', updatedAt: row.reviewedAt });
  known.add(url);
}
const updated = new Map<string, CatalogEntry>();
const duplicates: { removedId: string; keptId: string; sourceUrl: string }[] = [];
for (const original of catalog) {
  const row = rows.get(normalizeUrl(original.sourceUrl));
  let entry = row ? applyCuration(original, row) : original;
  const capture = captures.get(original.id);
  if (entry.preview.url.startsWith('/media/sources/') && !capture?.verified) {
    entry = { ...entry, preview: { type: 'link', url: entry.sourceUrl, verified: false, provenance: 'original', note: '先前录像已撤销验证，正在重新录制实际演示；暂不参与推荐。' }, status: 'draft' };
  }
  if (capture?.verified) {
    if (!capture.url.startsWith('/media/sources/')) throw Error(`Invalid capture path: ${original.id}`);
    const video = await stat(path.join(root, '.' + capture.url));
    await access(path.join(root, '.' + capture.poster));
    if (video.size < 5000 || capture.playback.duration <= 0 || capture.playback.currentTime <= 0) throw Error(`Unverified capture: ${original.id}`);
    entry = { ...entry, sourceUrl: normalizeUrl(capture.resolvedSourceUrl || entry.sourceUrl), preview: { type: 'video', url: capture.url, poster: capture.poster, verified: true, provenance: capture.provenance === 'original' ? 'original' : 'source-recording', note: capture.note }, status: 'ready', updatedAt: capture.capturedAt };
  } else if (!isReady(entry)) {
    entry = { ...entry, preview: { ...entry.preview, note: row?.issue || (failures.has(entry.id) ? '原站演示尚未录制成功，保留完整资料与实现参考；暂不参与视频推荐。' : entry.preview.note || '资料已整理，正在补充原站演示录像；验证通过后才能参与视频推荐。') } };
  }
  const key = normalizeUrl(entry.sourceUrl);
  const existing = updated.get(key);
  if (existing) {
    const preferred = isReady(existing) || !isReady(entry) ? existing : entry;
    const other = preferred === existing ? entry : existing;
    updated.set(key, { ...preferred, aliases: [...new Set([...preferred.aliases, ...other.aliases])], userNotes: preferred.userNotes || other.userNotes });
    duplicates.push({ removedId: other.id, keptId: preferred.id, sourceUrl: key });
  } else updated.set(key, entry);
}
const entries = [...updated.values()];
const originalEntries = await readJson('artifacts/catalog.before-fill.json') as CatalogEntry[];
for (const original of originalEntries) {
  const row = rows.get(normalizeUrl(original.sourceUrl));
  const kept = updated.get(normalizeUrl(row?.resolvedSourceUrl || original.sourceUrl));
  if (kept && kept.id !== original.id && !duplicates.some(item => item.removedId === original.id)) {
    duplicates.push({ removedId: original.id, keptId: kept.id, sourceUrl: kept.sourceUrl });
  }
}
async function save(file: string, value: unknown) {
  const destination = path.join(root, file);
  await writeFile(destination + '.populate.tmp', JSON.stringify(value, null, 2) + '\n');
  await rename(destination + '.populate.tmp', destination);
}
await save('data/catalog.json', entries);
await save('data/catalog.seed.json', entries.map(({ userNotes: _notes, ...entry }) => entry));
const report = { updatedAt: new Date().toISOString(), total: entries.length, ready: entries.filter(isReady).length, pending: entries.filter(entry => !isReady(entry)).length, completeMetadata: entries.filter(entry => entry.curation).length, duplicates, pendingEntries: entries.filter(entry => !isReady(entry)).map(entry => ({ id: entry.id, title: entry.title, sourceUrl: entry.sourceUrl, reason: entry.preview.note })) };
await save('data/catalog-fill-report.json', report);
const playable = entries.filter(isReady);
if (playable.length === 350) {
  await save('data/catalog.release.v1.json', { version: 'v1', publishedAt: report.updatedAt, playableCount: 350, entryIds: playable.map(entry => entry.id), sources: Object.fromEntries(['reactbits', 'aceternity', '60fps'].map(sourceId => [sourceId, playable.filter(entry => entry.sourceId === sourceId).length])), stages: Object.fromEntries(['structure', 'style', 'effect'].map(stage => [stage, playable.filter(entry => entry.stage === stage).length])), pendingCount: report.pending });
}
console.log(JSON.stringify({ total: report.total, ready: report.ready, pending: report.pending, completeMetadata: report.completeMetadata, mergedDuplicates: duplicates.length }));
