import { afterEach, expect, it, vi } from 'vitest';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequestHandler } from '../server/http-api';
import type { CatalogEntry } from '../shared/types';

const roots: string[] = [];
afterEach(async () => { vi.unstubAllGlobals(); for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }); });
const entry: CatalogEntry = { id: 'one', name: 'Card', title: '卡片', stage: 'effect', description: '悬停反馈', aliases: [], trigger: 'hover', placements: ['卡片'], tags: [], sourceId: 'reactbits', sourceUrl: 'https://reactbits.dev/components/one', preview: { type: 'video', url: '/media/one.webm', verified: true, provenance: 'source-recording' }, status: 'ready', updatedAt: '' };
async function fixture() {
  const rootDir = await mkdtemp(path.join(tmpdir(), 'http-api-')); roots.push(rootDir);
  await mkdir(path.join(rootDir, 'data'));
  await writeFile(path.join(rootDir, 'data/catalog.seed.json'), JSON.stringify([entry]));
  return rootDir;
}
const request = (pathname: string, body?: unknown, method = 'POST') => new Request('http://localhost' + pathname, body === undefined ? undefined : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const brief = { stage: 'effect', description: '卡片有反馈', selections: [], excludedIds: [] };

it('serves the existing status, catalog and manual stream contracts directly as Web Responses', async () => {
  const handler = createRequestHandler({ rootDir: await fixture(), model: null });
  expect(await (await handler(request('/api/status'))).json()).toMatchObject({ model: { configured: false }, readyCount: 1, draftCount: 0 });
  expect(await (await handler(request('/api/catalog'))).json()).toMatchObject({ entries: [{ id: 'one' }] });
  const response = await handler(request('/api/recommend/stream', brief));
  expect(response.headers.get('content-type')).toContain('text/event-stream');
  expect(await response.text()).toContain('"type":"result"');
});

it('keeps JSON errors, size validation, missing IDs and decoded path parameters deterministic', async () => {
  const handler = createRequestHandler({ rootDir: await fixture(), model: null });
  const malformed = await handler(new Request('http://localhost/api/recommend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' }));
  expect(malformed.status).toBe(400); expect(await malformed.json()).toMatchObject({ code: 'INVALID_JSON' });
  const oversized = await handler(new Request('http://localhost/api/recommend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: ' '.repeat(1024 * 1024 + 1) }));
  expect(oversized.status).toBe(413); expect(await oversized.json()).toMatchObject({ code: 'PAYLOAD_TOO_LARGE' });
  const unknown = await handler(request('/api/no-such-endpoint'));
  expect(unknown.status).toBe(404); expect(await unknown.json()).toMatchObject({ code: 'NOT_FOUND' });
  const edited = await handler(request('/api/catalog/%6Fne', { aliases: ['柔和反馈'] }, 'PATCH'));
  expect(edited.status).toBe(200); expect(await edited.json()).toMatchObject({ entry: { id: 'one', aliases: ['柔和反馈'] } });
});

it('aborts upstream generation when the Web response reader is cancelled', async () => {
  const cancelled = vi.fn(); let upstreamSignal!: AbortSignal;
  vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => {
    upstreamSignal = init.signal!;
    return new Response(new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('event: conversation.message.delta\ndata: ' + JSON.stringify({ id: 'answer', role: 'assistant', type: 'answer', content_type: 'text', content: '{"message":"正在理解' }) + '\n\n')); }, cancel: cancelled }), { headers: { 'Content-Type': 'text/event-stream' } });
  }));
  const handler = createRequestHandler({ rootDir: await fixture(), model: { provider: 'coze', baseUrl: 'https://api.coze.cn', name: 'Coze', apiKey: 'private-test-key', botId: '123' } });
  const response = await handler(request('/api/recommend/stream', brief));
  const reader = response.body!.getReader();
  await reader.read(); await reader.cancel();
  await vi.waitFor(() => { expect(upstreamSignal.aborted).toBe(true); expect(cancelled).toHaveBeenCalled(); });
});

it('ends a waiting Web stream and aborts its upstream when Request.signal aborts', async () => {
  const cancelled = vi.fn(); let upstreamSignal!: AbortSignal;
  vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => {
    upstreamSignal = init.signal!;
    return new Response(new ReadableStream({ cancel: cancelled }), { headers: { 'Content-Type': 'text/event-stream' } });
  }));
  const handler = createRequestHandler({ rootDir: await fixture(), model: { provider: 'coze', baseUrl: 'https://api.coze.cn', name: 'Coze', apiKey: 'private-test-key', botId: '123' } });
  const controller = new AbortController();
  const response = await handler(new Request('http://localhost/api/recommend/stream', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(brief), signal: controller.signal }));
  const pending = response.body!.getReader().read();
  controller.abort();
  expect(await pending).toMatchObject({ done: true });
  await vi.waitFor(() => { expect(upstreamSignal.aborted).toBe(true); expect(cancelled).toHaveBeenCalled(); });
});
