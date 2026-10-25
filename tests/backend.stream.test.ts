import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { Server } from 'node:http';
import { createApp } from '../server/app';
import { recommendWithModel } from '../server/model';
import { cozeAnswer } from '../server/coze';
import type { CozeConfig } from '../server/coze';
import type { CatalogEntry, RecommendationRequest } from '../shared/types';

const config: CozeConfig = { provider: 'coze', baseUrl: 'https://api.coze.cn', name: 'Coze', apiKey: 'test-server-secret', botId: '123' };
const entry: CatalogEntry = { id: 'one', name: 'Card', title: '柔光卡片', stage: 'effect', description: 'hover light', aliases: [], trigger: 'hover', placements: ['card'], tags: [], sourceId: 'aceternity', sourceUrl: 'https://ui.aceternity.com/components/card', preview: { type: 'video', url: '/media/one.webm', verified: true, provenance: 'reference-recording' }, status: 'ready', updatedAt: '' };
const request: RecommendationRequest = { stage: 'effect', description: '卡片边缘发光', selections: [], excludedIds: [] };
const frame = (event: string, data: unknown) => `event: ${event}\r\ndata: ${JSON.stringify(data)}\r\n\r\n`;
const message = (content: string, type = 'answer') => ({ id: 'answer-1', role: 'assistant', type, content_type: 'text', content });
const finalContent = (id = 'one') => JSON.stringify({ message: '保留玻璃，只让边缘发光', candidates: [{ entryId: id, reason: '用于卡片边框' }] });
const end = (content = finalContent()) => frame('conversation.message.completed', message(content)) + frame('conversation.chat.completed', { status: 'completed' });
const streamResponse = (content: string) => new Response(content, { headers: { 'content-type': 'text/event-stream' } });
const nativeFetch = globalThis.fetch;
const cleanup: { server: Server; dir: string }[] = [];
afterEach(async () => {
  vi.restoreAllMocks(); vi.unstubAllGlobals();
  for (const item of cleanup.splice(0)) { item.server.closeAllConnections(); await new Promise<void>(resolve => item.server.close(() => resolve())); await rm(item.dir, { recursive: true, force: true }); }
});
async function start(model: CozeConfig | null = config) {
  const dir = await mkdtemp(path.join(tmpdir(), 'visual-stream-'));
  await mkdir(path.join(dir, 'data'));
  await writeFile(path.join(dir, 'data/catalog.seed.json'), JSON.stringify([entry]));
  const server = createApp({ rootDir: dir, model }).listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  cleanup.push({ server, dir });
  const address = server.address();
  if (!address || typeof address === 'string') throw Error('No server address');
  return (signal?: AbortSignal) => nativeFetch(`http://127.0.0.1:${address.port}/api/recommend/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request), signal });
}
const frames = (value: string) => value.trim().split(/\r?\n\r?\n/).map(part => JSON.parse(part.replace(/^data:\s*/, '')));

describe('streaming recommendations', () => {
  it('delivers readable message text before the upstream final answer exists', async () => {
    let upstream!: ReadableStreamDefaultController<Uint8Array>;
    const encoder = new TextEncoder();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(new ReadableStream({ start(controller) { upstream = controller; controller.enqueue(encoder.encode(frame('conversation.message.delta', message('{"message":"保留玻璃')))); } }), { headers: { 'content-type': 'text/event-stream' } })));
    const call = await start();
    const response = await call();
    expect(response.headers.get('content-type')).toContain('text/event-stream');
    const reader = response.body!.getReader();
    const early = await reader.read();
    expect(frames(new TextDecoder().decode(early.value))).toContainEqual({ type: 'message', content: '保留玻璃' });
    upstream.enqueue(encoder.encode(end())); upstream.close();
    let rest = '';
    for (;;) { const chunk = await reader.read(); if (chunk.done) break; rest += new TextDecoder().decode(chunk.value); }
    expect(frames(rest).at(-1)).toMatchObject({ type: 'result', result: { message: '保留玻璃，只让边缘发光', candidates: [{ entryId: 'one' }] } });
  });
  it('decodes partial escaped JSON and split UTF-8 without exposing IDs, nested fields or tools', async () => {
    const text = '{"candidates":[{"entryId":"one","reason":"候选","message":"嵌套不可见"}],"message":"边缘\\n\\u53d1\\u5149 \\"柔和\\" \\ud83d\\ude80","extra":"不可见"}';
    const bytes = new TextEncoder().encode(frame('conversation.message.delta', message('工具内容', 'knowledge')) + [...text].map(character => frame('conversation.message.delta', message(character))).join('') + end(text));
    vi.stubGlobal('fetch', vi.fn(async () => new Response(new ReadableStream({ start(controller) { for (let i = 0; i < bytes.length; i += 2) controller.enqueue(bytes.slice(i, i + 2)); controller.close(); } }), { headers: { 'content-type': 'text/event-stream' } })));
    const updates: string[] = [];
    const result = await recommendWithModel(config, request, [entry], { onMessage: content => updates.push(content) });
    expect(result.message).toBe('边缘\n发光 "柔和" 🚀');
    expect(updates).toContain('边');
    expect(updates.at(-1)).toBe(result.message);
    expect(updates.join('')).not.toMatch(/entryId|嵌套不可见|工具内容|candidates|不可见/);
    expect(updates.some(update => /[\uD800-\uDBFF]$/.test(update))).toBe(false);
  });
  it.each(['unknown-id', 'malformed-json', 'upstream-error'])('never sends result after %s and returns safe errors', async failure => {
    const suffix = failure === 'unknown-id' ? end(finalContent('invented')) : failure === 'malformed-json' ? end('not-json') : frame('error', { msg: 'test-server-secret raw-upstream-error' });
    vi.stubGlobal('fetch', vi.fn(async () => streamResponse(frame('conversation.message.delta', message('{"message":"正在理解')) + suffix)));
    const response = await (await start())();
    const output = await response.text();
    const values = frames(output);
    expect(values.some(value => value.type === 'result')).toBe(false);
    expect(values.at(-1)).toMatchObject({ type: 'error', code: failure === 'unknown-id' ? 'MODEL_INVALID_ID' : failure === 'malformed-json' ? 'MODEL_INVALID_RESPONSE' : 'MODEL_COZE_ERROR' });
    expect(output).not.toMatch(/test-server-secret|raw-upstream-error/);
  });
  it('streams the manual-mode final result when no model is configured', async () => {
    const output = frames(await (await (await start(null))()).text());
    expect(output.at(-1)).toMatchObject({ type: 'result', result: { mode: 'manual', candidates: [{ entryId: 'one' }] } });
  });
  it('aborts the Coze request and cancels its reader when the client disconnects', async () => {
    let upstreamSignal!: AbortSignal;
    const cancelled = vi.fn();
    vi.stubGlobal('fetch', vi.fn(async (_url, init: RequestInit) => {
      upstreamSignal = init.signal!;
      return new Response(new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode(frame('conversation.message.delta', message('{"message":"边缘')))); }, cancel: cancelled }), { headers: { 'content-type': 'text/event-stream' } });
    }));
    const response = await (await start())();
    const reader = response.body!.getReader();
    await reader.read();
    await reader.cancel();
    await vi.waitFor(() => { expect(upstreamSignal.aborted).toBe(true); expect(cancelled).toHaveBeenCalled(); });
  });
  it('supports explicit abort even while waiting for an upstream chunk', async () => {
    const controller = new AbortController();
    const cancelled = vi.fn();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(new ReadableStream({ cancel: cancelled }), { headers: { 'content-type': 'text/event-stream' } })));
    const promise = cozeAnswer(config, '测试', { signal: controller.signal });
    await Promise.resolve(); controller.abort();
    await expect(promise).rejects.toMatchObject({ code: 'MODEL_UNAVAILABLE' });
    expect(cancelled).toHaveBeenCalled();
  });
});
