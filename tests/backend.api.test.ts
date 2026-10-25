import { afterEach, describe, it, expect, vi } from 'vitest';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { Server } from 'node:http';
import { createApp } from '../server/app';
import * as sourceModule from '../server/sources';
import type { CatalogEntry } from '../shared/types';
const cleanup: { server: Server; dir: string }[] = [];
afterEach(async () => { for (const item of cleanup.splice(0)) { await new Promise<void>(resolve => item.server.close(() => resolve())); await rm(item.dir, { recursive: true, force: true }); } });
async function start() {
  const dir = await mkdtemp(path.join(tmpdir(), 'visual-intent-test-'));
  await mkdir(path.join(dir, 'data'));
  await mkdir(path.join(dir, 'media'));
  const entry: CatalogEntry = { id: 'one', name: 'Card', title: '卡片', stage: 'effect', description: 'Hover card', aliases: [], trigger: 'hover', placements: [], tags: [], sourceId: 'aceternity', sourceUrl: 'https://ui.aceternity.com/components/3d-card', preview: { type: 'video', url: '/media/one.webm', verified: true, provenance: 'reference-recording' }, status: 'ready', updatedAt: '2026-10-12' };
  await writeFile(path.join(dir, 'data/catalog.seed.json'), JSON.stringify([entry, { ...entry, id: 'draft', sourceUrl: 'https://ui.aceternity.com/components/draft', status: 'draft', preview: { ...entry.preview, verified: false } }, { ...entry, id: 'link', sourceUrl: 'https://ui.aceternity.com/components/link', status: 'draft', preview: { type: 'link', url: 'https://ui.aceternity.com/components/link', verified: false, provenance: 'original' } }]));
  const app = createApp({ rootDir: dir, model: null });
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  cleanup.push({ server, dir });
  const address = server.address();
  if (!address || typeof address === 'string') throw Error('No address');
  const base = `http://127.0.0.1:${address.port}`;
  const call = async (url: string, body?: unknown, method = 'POST') => fetch(base + url, body === undefined ? {} : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { dir, call, server };
}
describe('HTTP API and persistent edits', () => {
  it('persists successful source sync timestamps after restarting the server', async () => {
    const { call, dir, server } = await start();
    const source = vi.spyOn(sourceModule, 'syncSource').mockResolvedValue([]);
    try {
      const response = await call('/api/sources/sync', { sourceId: 'aceternity' });
      expect(response.status).toBe(200);
      const synced = await response.json();
      expect(synced.source.lastSyncedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      await new Promise<void>(resolve => server.close(() => resolve()));
      const restarted = createApp({ rootDir: dir, model: null }).listen(0, '127.0.0.1');
      await new Promise<void>(resolve => restarted.once('listening', resolve));
      cleanup.push({ server: restarted, dir });
      const address = restarted.address();
      if (!address || typeof address === 'string') throw Error('No address');
      const body = await (await fetch(`http://127.0.0.1:${address.port}/api/sources`)).json();
      expect(body.sources.find((item: { id: string }) => item.id === 'aceternity').lastSyncedAt).toBe(synced.source.lastSyncedAt);
      const persisted = JSON.parse(await readFile(path.join(dir, 'data/sources-state.json'), 'utf8'));
      expect(persisted.aceternity).toBe(synced.source.lastSyncedAt);
    } finally { source.mockRestore(); }
  });
  it('reports manual mode and browse suggestions only from ready verified current-stage entries', async () => {
    const { call } = await start();
    expect(await (await call('/api/status')).json()).toMatchObject({ model: { configured: false }, readyCount: 1, draftCount: 2 });
    const response = await call('/api/recommend', { stage: 'effect', description: '安静的页面', selections: [], excludedIds: [] });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.mode).toBe('manual');
    expect(data.message).toMatch(/人工|手动/);
    expect(data.candidates.map((item: { entryId: string }) => item.entryId)).toEqual(['one']);
    expect(JSON.stringify(data)).not.toMatch(/语义匹配|根据你的描述推荐/);
  });
  it('serializes concurrent alias and note edits without losing updates', async () => {
    const { call, dir } = await start();
    const responses = await Promise.all([call('/api/catalog/one', { aliases: ['柔和倾斜'] }, 'PATCH'), call('/api/catalog/one', { userNotes: '用于封面' }, 'PATCH')]);
    expect(responses.map(response => response.status)).toEqual([200, 200]);
    const saved = JSON.parse(await readFile(path.join(dir, 'data/catalog.json'), 'utf8'));
    expect(saved.find((item: CatalogEntry) => item.id === 'one')).toMatchObject({ aliases: ['柔和倾斜'], userNotes: '用于封面' });
  });
  it('refuses to mark link previews and missing local videos verified', async () => {
    const { call } = await start();
    expect((await call('/api/catalog/link/verify-preview', {})).status).toBe(400);
    expect((await call('/api/catalog/draft/verify-preview', {})).status).toBe(400);
    const catalog = await (await call('/api/catalog')).json();
    expect(catalog.entries.find((item: CatalogEntry) => item.id === 'draft').preview.verified).toBe(false);
  });
  it('verifies a local WebM signature before marking it ready', async () => {
    const { call, dir } = await start();
    await writeFile(path.join(dir, 'media/one.webm'), Buffer.from([0x1a, 0x45, 0xdf, 0xa3, ...Array(120).fill(0)]));
    const response = await call('/api/catalog/draft/verify-preview', {});
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ entry: { id: 'draft', status: 'ready', preview: { verified: true } } });
  });
  it('returns useful client errors for malformed requests, blocked sources and unknown IDs', async () => {
    const { call } = await start();
    expect((await call('/api/recommend', { stage: 'garbage' })).status).toBe(400);
    expect((await call('/api/sources/import', { url: 'https://localhost/private' })).status).toBe(400);
    expect((await call('/api/catalog/nope', { aliases: [] }, 'PATCH')).status).toBe(404);
    expect((await call('/api/catalog/one', { preview: { verified: true } }, 'PATCH')).status).toBe(400);
  });
  it('exports only confirmed available entries', async () => {
    const { call } = await start();
    expect((await call('/api/export', { brief: '页面', selections: [{ entryId: 'draft', stage: 'effect', placement: 'hero', adjustments: '' }] })).status).toBe(400);
    const response = await call('/api/export', { brief: '页面', selections: [{ entryId: 'one', stage: 'effect', placement: 'hero', adjustments: 'slow' }] });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.markdown).toContain('slow');
    expect(body.markdown).not.toContain('/components/draft');
  });
});
