import { afterEach, describe, expect, it, vi } from 'vitest';
import { modelFromEnvironment, recommendWithModel } from '../server/model';
import { COZE_MAX_DURATION_MS, COZE_TIMEOUT_MS, cozeAnswer } from '../server/coze';
import type { CozeConfig } from '../server/coze';
import type { CatalogEntry, RecommendationRequest } from '../shared/types';

const config = { provider: 'coze', baseUrl: 'https://api.coze.cn', name: 'Coze · 123', apiKey: 'test-server-secret', botId: '123' } as CozeConfig;
const entry: CatalogEntry = { id: 'one', name: 'One', title: '柔光卡片', stage: 'effect', description: 'pointer effect', aliases: ['跟随鼠标'], trigger: 'hover', tags: [], placements: ['card'], sourceId: 'reactbits', sourceUrl: 'https://reactbits.dev/components/one', status: 'ready', updatedAt: '', preview: { type: 'video', url: '/media/one.webm', verified: true, provenance: 'reference-recording' } };
const request: RecommendationRequest = { stage: 'effect', description: '鼠标上去有光', selections: [], excludedIds: ['discarded'], messages: [{ role: 'user', content: '不要太花' }] };
const event = (name: string, data: unknown) => `event: ${name}\r\ndata: ${JSON.stringify(data)}\r\n\r\n`;
const answer = (id = 'one') => ({ role: 'assistant', type: 'answer', content_type: 'text', content: JSON.stringify({ message: '柔光跟随鼠标', candidates: [{ entryId: id, reason: '符合描述' }] }) });
const completed = (message = answer()) => event('conversation.message.completed', message) + event('conversation.chat.completed', { status: 'completed' });
const stream = (text: string) => new Response(text, { headers: { 'content-type': 'text/event-stream' } });
const response = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json' } });
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

function controlledStream(options: Parameters<typeof cozeAnswer>[2] = {}) {
  vi.useFakeTimers();
  vi.spyOn(AbortSignal, 'timeout').mockImplementation(ms => {
    const abort = new AbortController();
    setTimeout(() => abort.abort(new DOMException('Request timed out', 'TimeoutError')), ms);
    return abort.signal;
  });
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const cancel = vi.fn();
  const body = new ReadableStream<Uint8Array>({ start(value) { controller = value; }, cancel });
  vi.stubGlobal('fetch', vi.fn(async () => new Response(body, { headers: { 'content-type': 'text/event-stream' } })));
  const onText = vi.fn();
  const outcome = cozeAnswer(config, '生成提示词', { ...options, onText }).then(value => ({ value }), error => ({ error }));
  return { body, cancel, onText, outcome, emit: (text: string) => controller.enqueue(new TextEncoder().encode(text)) };
}

describe('Coze configuration', () => {
  it('requires both the key and Bot ID, and defaults to the China API', () => {
    for (const key of ['MODEL_PROVIDER', 'MODEL_BASE_URL', 'MODEL_NAME', 'MODEL_API_KEY', 'COZE_BASE_URL', 'COZE_BOT_ID']) vi.stubEnv(key, '');
    vi.stubEnv('COZE_API_KEY', 'test-server-secret');
    expect(modelFromEnvironment()).toBeNull();
    vi.stubEnv('COZE_BOT_ID', '123');
    expect(modelFromEnvironment()).toMatchObject({ provider: 'coze', baseUrl: 'https://api.coze.cn', name: 'Coze · 123', botId: '123' });
  });
  it('keeps the compatible API available when Coze is incomplete', () => {
    vi.stubEnv('MODEL_PROVIDER', '');
    vi.stubEnv('COZE_API_KEY', 'key'); vi.stubEnv('COZE_BOT_ID', '');
    vi.stubEnv('MODEL_BASE_URL', 'https://compatible.test/v1'); vi.stubEnv('MODEL_NAME', 'model'); vi.stubEnv('MODEL_API_KEY', 'compatible-key');
    expect(modelFromEnvironment()).toEqual({ baseUrl: 'https://compatible.test/v1', name: 'model', apiKey: 'compatible-key' });
  });
});
describe('Coze recommendations', () => {
  it('gets the final answer through chat alone when message-list access is unavailable', async () => {
    const calls: { url: string; init?: RequestInit }[] = [];
    vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => { calls.push({ url, init }); return url.endsWith('/v3/chat') ? stream(completed()) : response({ code: 4100, msg: 'authentication is invalid' }); }));
    expect(await recommendWithModel(config, request, [entry, { ...entry, id: 'draft', status: 'draft' }])).toMatchObject({ mode: 'model', candidates: [{ entryId: 'one' }] });
    expect(calls.map(call => call.url)).toEqual(['https://api.coze.cn/v3/chat']);
    const body = JSON.parse(String(calls[0].init?.body));
    expect(body).toMatchObject({ bot_id: '123', stream: true, auto_save_history: true });
    expect(body.additional_messages[0].content).toContain('不要太花');
    expect(body.additional_messages[0].content).toContain('discarded');
    expect(body.additional_messages[0].content).toContain('柔光卡片');
    expect(body.additional_messages[0].content).not.toContain('"id":"draft"');
    expect(body.additional_messages[0].content).not.toContain(config.apiKey);
    expect(calls[0].init?.headers).toMatchObject({ Authorization: 'Bearer test-server-secret' });
  });
  it('rejects invented IDs from a successful bot answer', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => stream(completed(answer('invented')))));
    await expect(recommendWithModel(config, request, [entry])).rejects.toThrow(/不可用/);
  });
  it('reports authentication failure without exposing the upstream body', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => response({ msg: 'raw-secret-error' }, 401)));
    await expect(recommendWithModel(config, request, [entry])).rejects.toMatchObject({ status: 503, code: 'MODEL_HTTP_ERROR' });
    try { await recommendWithModel(config, request, [entry]); } catch (error) { expect(String(error)).not.toContain('raw-secret-error'); }
  });
  it.each(['failed', 'canceled', 'requires_action'])('stops at %s without reading partial messages', async status => {
    const fetch = vi.fn(async () => stream(event(`conversation.chat.${status}`, { last_error: { msg: 'raw-secret-error' } })));
    vi.stubGlobal('fetch', fetch);
    await expect(recommendWithModel(config, request, [entry])).rejects.toThrow(status === 'requires_action' ? /端插件|额外操作/ : /失败|取消/);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('rejects nonzero API codes without returning raw messages', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => response({ code: 4101, msg: 'raw-secret-error' })));
    await expect(recommendWithModel(config, request, [entry])).rejects.toMatchObject({ code: 'MODEL_COZE_ERROR' });
  });
  it('allows five minutes without progress before reporting a safe timeout', async () => {
    const fixture = controlledStream();
    await vi.advanceTimersByTimeAsync(300000);
    await expect(fixture.outcome).resolves.toMatchObject({ error: { code: 'MODEL_TIMEOUT', status: 504 } });
    expect(COZE_TIMEOUT_MS).toBe(300000);
    expect(COZE_MAX_DURATION_MS).toBe(600000);
    expect(fixture.body.locked).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('keeps the three-candidate limit and excludes unfinished previews', async () => {
    const ids = ['one', 'two', 'three', 'four'];
    vi.stubGlobal('fetch', vi.fn(async () => stream(completed({ ...answer(), content: JSON.stringify({ message: '候选', candidates: ids.map(entryId => ({ entryId, reason: '理由' })) }) }))));
    const result = await recommendWithModel(config, request, ids.map(id => ({ ...entry, id })));
    expect(result.candidates.map(candidate => candidate.entryId)).toEqual(['one', 'two', 'three']);
  });
  it('rejects missing or malformed final JSON', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => stream(completed({ ...answer(), content: 'not-json' }))));
    await expect(recommendWithModel(config, request, [entry])).rejects.toMatchObject({ code: 'MODEL_INVALID_RESPONSE' });
  });
  it('handles split UTF-8 bytes and event boundaries while ignoring deltas and tool messages', async () => {
    const bytes = new TextEncoder().encode(event('conversation.message.delta', { ...answer(), content: '未完成' }) + event('conversation.message.completed', { ...answer(), type: 'knowledge', content: '资料' }) + completed() + event('done', '[DONE]'));
    vi.stubGlobal('fetch', vi.fn(async () => new Response(new ReadableStream({ start(controller) { for (let i = 0; i < bytes.length; i += 3) controller.enqueue(bytes.slice(i, i + 3)); controller.close(); } }), { headers: { 'content-type': 'text/event-stream' } })));
    expect(await recommendWithModel(config, request, [entry])).toMatchObject({ message: '柔光跟随鼠标', candidates: [{ entryId: 'one' }] });
  });
  it('rejects a truncated stream even when the answer message was received', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => stream(event('conversation.message.completed', answer()))));
    await expect(recommendWithModel(config, request, [entry])).rejects.toMatchObject({ code: 'MODEL_INVALID_RESPONSE' });
  });
  it('does not expose a streaming error or accept an answer followed by failure', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => stream(event('conversation.message.completed', answer()) + event('error', { code: 4100, msg: 'raw-secret-error' }))));
    await expect(recommendWithModel(config, request, [entry])).rejects.toMatchObject({ code: 'MODEL_COZE_ERROR' });
    try { await recommendWithModel(config, request, [entry]); } catch (error) { expect(String(error)).not.toContain('raw-secret-error'); }
  });
});

describe('Coze deep-thinking streams', () => {
  it('keeps an explicit request deadline and releases the reader after timing out', async () => {
    const fixture = controlledStream({ timeoutMs: 180000 });
    await vi.advanceTimersByTimeAsync(120000);
    fixture.emit(event('conversation.message.delta', { ...answer(), content: '', reasoning_content: 'private-thought' }));
    await vi.advanceTimersByTimeAsync(60000);
    await expect(fixture.outcome).resolves.toMatchObject({ error: { status: 504, code: 'MODEL_TIMEOUT', message: expect.stringMatching(/超时.*保留/) } });
    expect(fixture.cancel).toHaveBeenCalledOnce();
    expect(fixture.body.locked).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
  it.each([
    { type: 'reasoning', content: 'private-thought' },
    { type: 'reasoning_content', content: 'private-thought' },
    { type: 'answer', content: '', reasoning_content: 'private-thought' },
    { type: 'answer', content: '页面' },
  ])('keeps an active $type stream alive beyond the old five-minute deadline', async progress => {
    const fixture = controlledStream();
    await vi.advanceTimersByTimeAsync(240000);
    fixture.emit(event('conversation.message.delta', { ...answer(), ...progress }));
    await vi.advanceTimersByTimeAsync(120000);
    expect(fixture.body.locked).toBe(true);
    expect(fixture.onText.mock.calls).toEqual(progress.content === '页面' ? [['页面']] : []);
    fixture.emit(completed({ ...answer(), content: '页面提示词' }));
    await expect(fixture.outcome).resolves.toEqual({ value: '页面提示词' });
    expect(fixture.body.locked).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('does not renew the deadline for heartbeats, status, whitespace, or tool content', async () => {
    const fixture = controlledStream();
    await vi.advanceTimersByTimeAsync(240000);
    fixture.emit(': heartbeat\r\n\r\n' + event('conversation.chat.in_progress', {}) + event('conversation.message.delta', { ...answer(), content: ' ', reasoning_content: ' ' }) + event('conversation.message.delta', { ...answer(), type: 'knowledge', content: 'retrieved knowledge' }));
    await vi.advanceTimersByTimeAsync(60000);
    await expect(fixture.outcome).resolves.toMatchObject({ error: { code: 'MODEL_TIMEOUT' } });
    expect(vi.getTimerCount()).toBe(0);
  });
  it('times out after a stream stops making progress even before the total limit', async () => {
    const fixture = controlledStream();
    await vi.advanceTimersByTimeAsync(240000);
    fixture.emit(event('conversation.message.delta', { ...answer(), type: 'reasoning', content: 'private-thought' }));
    await vi.advanceTimersByTimeAsync(299999);
    expect(fixture.body.locked).toBe(true);
    await vi.advanceTimersByTimeAsync(1);
    await expect(fixture.outcome).resolves.toMatchObject({ error: { code: 'MODEL_TIMEOUT' } });
    expect(vi.getTimerCount()).toBe(0);
  });
  it('caps an active but unfinished stream at ten minutes', async () => {
    const fixture = controlledStream();
    for (let i = 0; i < 2; i++) {
      await vi.advanceTimersByTimeAsync(240000);
      fixture.emit(event('conversation.message.delta', { ...answer(), type: 'reasoning', content: 'private-thought' }));
    }
    await vi.advanceTimersByTimeAsync(120000);
    await expect(fixture.outcome).resolves.toMatchObject({ error: { code: 'MODEL_TIMEOUT' } });
    expect(fixture.onText).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
  it.each(['success', 'cancel'])('clears pending timers after %s', async mode => {
    const abort = new AbortController();
    const fixture = controlledStream({ signal: abort.signal });
    await vi.advanceTimersByTimeAsync(1000);
    if (mode === 'success') {
      fixture.emit(completed());
      await expect(fixture.outcome).resolves.toEqual({ value: answer().content });
    } else {
      abort.abort();
      await expect(fixture.outcome).resolves.toMatchObject({ error: { code: 'MODEL_UNAVAILABLE' } });
    }
    expect(fixture.cancel).toHaveBeenCalledOnce();
    expect(fixture.body.locked).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('waits through reasoning and streams only answer content before the final completion', async () => {
    let controller!: ReadableStreamDefaultController<Uint8Array>;
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({ start(value) { controller = value; } });
    vi.stubGlobal('fetch', vi.fn(async () => new Response(body, { headers: { 'content-type': 'text/event-stream' } })));
    const onText = vi.fn();
    const result = cozeAnswer(config, '生成提示词', { onText });
    const thinking = { ...answer(), id: 'thought', type: 'reasoning', content: 'private-thought' };
    controller.enqueue(encoder.encode(event('conversation.message.delta', thinking) + event('conversation.message.completed', thinking) + event('conversation.message.delta', { ...answer(), id: 'final', content: '', reasoning_content: 'private-thought' })));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(onText).not.toHaveBeenCalled();
    controller.enqueue(encoder.encode(event('conversation.message.delta', { ...answer(), id: 'final', content: '页面', reasoning_content: 'private-thought' })));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(onText.mock.calls).toEqual([['页面']]);
    controller.enqueue(encoder.encode(event('conversation.message.delta', { ...answer(), id: 'final', content: '提示词' }) + event('conversation.message.completed', { ...answer(), id: 'final', content: '页面提示词' }) + event('conversation.chat.completed', { status: 'completed' })));
    await expect(result).resolves.toBe('页面提示词');
    expect(onText.mock.calls.map(([text]) => text)).toEqual(['页面', '页面提示词', '页面提示词']);
    expect(body.locked).toBe(false);
  });
  it('does not accept reasoning alone as a completed answer', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => stream(completed({ ...answer(), type: 'reasoning', content: 'private-thought' }))));
    await expect(cozeAnswer(config, '生成提示词')).rejects.toMatchObject({ code: 'MODEL_INVALID_RESPONSE' });
  });
  it('keeps connection errors distinct from timeouts without exposing the raw cause', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('raw-secret-error'); }));
    await expect(cozeAnswer(config, '生成提示词')).rejects.toMatchObject({ code: 'MODEL_UNAVAILABLE', message: expect.not.stringMatching(/raw-secret-error|超时/) });
  });
  it('preserves user cancellation and releases the stream without calling it a timeout', async () => {
    const abort = new AbortController();
    const cancel = vi.fn();
    const body = new ReadableStream({ cancel });
    vi.stubGlobal('fetch', vi.fn(async () => new Response(body, { headers: { 'content-type': 'text/event-stream' } })));
    const result = cozeAnswer(config, '生成提示词', { signal: abort.signal });
    await new Promise(resolve => setTimeout(resolve, 0));
    abort.abort();
    await expect(result).rejects.toMatchObject({ code: 'MODEL_UNAVAILABLE' });
    expect(cancel).toHaveBeenCalledOnce();
    expect(body.locked).toBe(false);
  });
});
