import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEEPSEEK_IDLE_TIMEOUT_MS, DEEPSEEK_MAX_DURATION_MS, deepseekAnswer } from '../server/deepseek';
import type { DeepSeekConfig } from '../server/deepseek';

const config: DeepSeekConfig = { provider: 'deepseek', baseUrl: 'https://api.deepseek.com', name: 'deepseek-flash', apiKey: 'server-only-secret' };
const frame = (value: unknown) => `data: ${JSON.stringify(value)}\r\n\r\n`;
const delta = (content: string | null, reasoning_content?: string) => frame({ choices: [{ index: 0, delta: { content, reasoning_content }, finish_reason: null }] });
const finish = (reason = 'stop') => frame({ choices: [{ index: 0, delta: {}, finish_reason: reason }] });
const done = 'data: [DONE]\r\n\r\n';
const complete = (content = '{"developerPrompt":"完整提示词"}') => delta(content) + finish() + done;
const stream = (value: string) => new Response(value, { headers: { 'Content-Type': 'text/event-stream' } });
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function controlledStream(options: Parameters<typeof deepseekAnswer>[3] = {}) {
  vi.useFakeTimers();
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const cancel = vi.fn();
  const body = new ReadableStream<Uint8Array>({ start(value) { controller = value; }, cancel });
  vi.stubGlobal('fetch', vi.fn(async () => new Response(body, { headers: { 'Content-Type': 'text/event-stream' } })));
  const onText = vi.fn();
  const outcome = deepseekAnswer(config, '只返回JSON', '本地目录', { ...options, onText }).then(value => ({ value }), error => ({ error }));
  return { body, cancel, onText, outcome, emit: (value: string) => controller.enqueue(new TextEncoder().encode(value)) };
}

describe('DeepSeek direct streaming', () => {
  it('uses the official API with server-side credentials, JSON output and explicit thinking settings', async () => {
    const fetch = vi.fn(async () => stream(complete())); vi.stubGlobal('fetch', fetch);
    await expect(deepseekAnswer(config, '只输出JSON', '{"availableCatalog":[{"id":"real"}]}')).resolves.toContain('developerPrompt');
    expect(fetch).toHaveBeenCalledOnce();
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.deepseek.com/chat/completions');
    expect(init.redirect).toBe('error'); expect(init.headers).toMatchObject({ Authorization: 'Bearer server-only-secret' });
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({ model: 'deepseek-flash', stream: true, response_format: { type: 'json_object' }, thinking: { type: 'enabled' }, reasoning_effort: 'high', max_tokens: 32768, messages: [{ role: 'system', content: '只输出JSON' }, { role: 'user', content: '{"availableCatalog":[{"id":"real"}]}' }] });
    expect(body).not.toHaveProperty('temperature'); expect(String(init.body)).not.toContain(config.apiKey);
  });
  it('supports an explicitly configured chat-completions endpoint without duplicating the path', async () => {
    const fetch = vi.fn(async (_url: string) => stream(complete())); vi.stubGlobal('fetch', fetch);
    await deepseekAnswer({ ...config, baseUrl: 'https://api.deepseek.com/v1/chat/completions/' }, 'JSON', '资料');
    expect(fetch.mock.calls[0]?.[0]).toBe('https://api.deepseek.com/v1/chat/completions');
  });
  it('streams cumulative answer content while never displaying reasoning', async () => {
    const onText = vi.fn();
    vi.stubGlobal('fetch', vi.fn(async () => stream(delta(null, 'private-thought') + delta('{"message":', 'private-thought') + delta('"完成"}') + finish() + done)));
    await expect(deepseekAnswer(config, 'JSON', '资料', { onText })).resolves.toBe('{"message":"完成"}');
    expect(onText.mock.calls).toEqual([['{"message":'], ['{"message":"完成"}']]);
  });
  it('decodes split UTF-8 bytes and event boundaries, ignoring heartbeat comments', async () => {
    const content = '{"message":"课程资料查询"}';
    const bytes = new TextEncoder().encode(': keepalive\r\n\r\n' + complete(content));
    vi.stubGlobal('fetch', vi.fn(async () => new Response(new ReadableStream({ start(controller) { for (let i = 0; i < bytes.length; i += 3) controller.enqueue(bytes.slice(i, i + 3)); controller.close(); } }), { headers: { 'Content-Type': 'text/event-stream' } })));
    await expect(deepseekAnswer(config, 'JSON', '资料')).resolves.toBe(content);
  });
  it('supports a complete non-stream response without returning reasoning metadata', async () => {
    const onText = vi.fn();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ choices: [{ message: { content: '{"message":"完成"}', reasoning_content: 'private-thought' }, finish_reason: 'stop' }] }), { headers: { 'Content-Type': 'application/json' } })));
    await expect(deepseekAnswer(config, 'JSON', '资料', { onText })).resolves.toBe('{"message":"完成"}');
    expect(onText.mock.calls).toEqual([['{"message":"完成"}']]);
  });
  it.each(['length', 'content_filter', 'tool_calls'])('rejects a %s finish even when partial text is valid JSON', async reason => {
    vi.stubGlobal('fetch', vi.fn(async () => stream(delta('{"message":"部分内容"}') + finish(reason) + done)));
    await expect(deepseekAnswer(config, 'JSON', '资料')).rejects.toMatchObject({ code: 'MODEL_INVALID_RESPONSE' });
  });
  it.each([delta('部分内容') + finish(), delta(null, 'private-thought') + finish() + done, delta('部分内容') + done, 'data: invalid-json\n\n', frame({ error: { message: 'raw-private-secret' } })])('rejects a malformed or unfinished stream safely', async value => {
    vi.stubGlobal('fetch', vi.fn(async () => stream(value)));
    await expect(deepseekAnswer(config, 'JSON', '资料')).rejects.toMatchObject({ code: 'MODEL_INVALID_RESPONSE', message: expect.not.stringContaining('raw-private-secret') });
  });
  it('rejects incomplete non-stream responses and upstream errors without leaking raw details', async () => {
    for (const value of [{ choices: [{ message: { content: '{"message":"未完成"}' }, finish_reason: 'length' }] }, { error: { message: 'raw-private-secret' } }]) {
      vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } })));
      await expect(deepseekAnswer(config, 'JSON', '资料')).rejects.toMatchObject({ code: 'MODEL_INVALID_RESPONSE', message: expect.not.stringContaining('raw-private-secret') });
    }
  });
  it('classifies authentication and network errors safely', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('raw-private-secret', { status: 401 })));
    await expect(deepseekAnswer(config, 'JSON', '资料')).rejects.toMatchObject({ status: 503, code: 'MODEL_HTTP_ERROR', message: expect.not.stringContaining('raw-private-secret') });
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('raw-private-secret'); }));
    await expect(deepseekAnswer(config, 'JSON', '资料')).rejects.toMatchObject({ code: 'MODEL_UNAVAILABLE', message: expect.not.stringContaining('raw-private-secret') });
  });
  it('allows substantive thinking to extend the idle deadline without displaying it', async () => {
    const fixture = controlledStream();
    await vi.advanceTimersByTimeAsync(240000); fixture.emit(delta(null, 'private-thought'));
    await vi.advanceTimersByTimeAsync(120000); expect(fixture.body.locked).toBe(true); expect(fixture.onText).not.toHaveBeenCalled();
    fixture.emit(complete()); await expect(fixture.outcome).resolves.toMatchObject({ value: expect.stringContaining('developerPrompt') });
    expect(vi.getTimerCount()).toBe(0); expect(fixture.body.locked).toBe(false);
  });
  it('times out after five minutes without progress and ignores heartbeat-only activity', async () => {
    const fixture = controlledStream();
    await vi.advanceTimersByTimeAsync(240000); fixture.emit(': heartbeat\n\n' + delta(' ', ' '));
    await vi.advanceTimersByTimeAsync(60000);
    await expect(fixture.outcome).resolves.toMatchObject({ error: { code: 'MODEL_TIMEOUT', status: 504 } });
    expect(DEEPSEEK_IDLE_TIMEOUT_MS).toBe(300000); expect(fixture.cancel).toHaveBeenCalledOnce(); expect(fixture.body.locked).toBe(false); expect(vi.getTimerCount()).toBe(0);
  });
  it('limits an active unfinished response to ten minutes', async () => {
    const fixture = controlledStream();
    for (let i = 0; i < 2; i++) { await vi.advanceTimersByTimeAsync(240000); fixture.emit(delta(null, 'private-thought')); }
    await vi.advanceTimersByTimeAsync(120000);
    await expect(fixture.outcome).resolves.toMatchObject({ error: { code: 'MODEL_TIMEOUT' } });
    expect(DEEPSEEK_MAX_DURATION_MS).toBe(600000); expect(vi.getTimerCount()).toBe(0); expect(fixture.body.locked).toBe(false);
  });
  it('releases the reader and clears timers after manual cancellation', async () => {
    const controller = new AbortController(); const fixture = controlledStream({ signal: controller.signal });
    await vi.advanceTimersByTimeAsync(1); controller.abort();
    await expect(fixture.outcome).resolves.toMatchObject({ error: { code: 'MODEL_UNAVAILABLE' } });
    expect(fixture.cancel).toHaveBeenCalledOnce(); expect(fixture.body.locked).toBe(false); expect(vi.getTimerCount()).toBe(0);
  });
});
