import { afterEach, describe, expect, it, vi } from 'vitest';
import { deepseekToolAnswer } from '../server/deepseek-tools';
import { DEEPSEEK_IDLE_TIMEOUT_MS, DEEPSEEK_MAX_DURATION_MS, type DeepSeekConfig } from '../server/deepseek';
import { ApiError } from '../server/core';
import type { AgentTool } from '../server/agent-tools';

const config: DeepSeekConfig = { provider: 'deepseek', baseUrl: 'https://api.deepseek.com', name: 'deepseek-flash', apiKey: 'server-only-secret' };
const frame = (value: unknown) => `data: ${JSON.stringify(value)}\r\n\r\n`;
const chunk = (delta: unknown, finish_reason: string | null = null) => frame({ choices: [{ index: 0, delta, finish_reason }] });
const done = 'data: [DONE]\r\n\r\n';
const toolCall = (id = 'call-search', name = 'search_library', args = '{"query":"化学"}') => ({ id, type: 'function', function: { name, arguments: args } });
const stream = (content: string) => new Response(content, { headers: { 'Content-Type': 'text/event-stream' } });
const final = (text = '{"developerPrompt":"最终提示词"}') => stream(chunk({ content: text, reasoning_content: 'final-private-thought' }) + chunk({}, 'stop') + done);
const json = (message: unknown, finish_reason: string) => new Response(JSON.stringify({ choices: [{ index: 0, message, finish_reason }] }), { headers: { 'Content-Type': 'application/json' } });
const definition = (execute: AgentTool['execute'] = vi.fn(async (args: unknown) => ({ entryIds: ['real'], args }))): AgentTool => ({ name: 'search_library', description: '检索真实案例', parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }, execute });
const nonStreamTools = (calls = [toolCall()], reasoning_content = 'private-thought') => json({ role: 'assistant', content: null, reasoning_content, tool_calls: calls }, 'tool_calls');

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('DeepSeek tool-calling loop', () => {
  it('executes a real declared tool, sends its result and the complete reasoning back, then returns only the final answer', async () => {
    const execute = vi.fn(async (args: unknown) => ({ entryIds: ['real-case'], received: args }));
    const fetch = vi.fn().mockResolvedValueOnce(nonStreamTools()).mockResolvedValueOnce(final()); vi.stubGlobal('fetch', fetch);
    const onText = vi.fn(); const onTool = vi.fn();
    await expect(deepseekToolAnswer(config, '生成JSON提示词', '用户需求', [definition(execute)], { onText, onTool })).resolves.toBe('{"developerPrompt":"最终提示词"}');
    expect(execute).toHaveBeenCalledWith({ query: '化学' }, expect.any(AbortSignal));
    expect(onTool).toHaveBeenCalledWith('search_library'); expect(onText.mock.calls.flat().join('')).not.toContain('private-thought');
    const first = JSON.parse(fetch.mock.calls[0][1].body); const second = JSON.parse(fetch.mock.calls[1][1].body);
    expect(first).toMatchObject({ stream: true, thinking: { type: 'enabled' }, reasoning_effort: 'high', max_tokens: 32768, messages: [{ role: 'system', content: '生成JSON提示词' }, { role: 'user', content: '用户需求' }], tools: [{ type: 'function', function: { name: 'search_library', description: '检索真实案例', parameters: definition().parameters } }] });
    expect(first).not.toHaveProperty('response_format'); expect(first).not.toHaveProperty('temperature');
    expect(second.messages[2]).toEqual({ role: 'assistant', content: null, reasoning_content: 'private-thought', tool_calls: [toolCall()] });
    expect(second.messages[3]).toMatchObject({ role: 'tool', tool_call_id: 'call-search' });
    expect(JSON.parse(second.messages[3].content)).toEqual({ entryIds: ['real-case'], received: { query: '化学' } });
    expect(String(fetch.mock.calls[0][1].body)).not.toContain(config.apiKey);
    expect(fetch.mock.calls[0][0]).toBe('https://api.deepseek.com/chat/completions');
  });

  it('assembles indexed, interleaved tool-call fragments across UTF-8 and SSE byte boundaries', async () => {
    const first = chunk({ role: 'assistant', reasoning_content: '私密思考一' })
      + chunk({ tool_calls: [{ index: 1, id: 'call-', type: 'function', function: { name: 'search_', arguments: '{"query":' } }, { index: 0, id: 'call-', type: 'function', function: { name: 'search_', arguments: '{"query":"大' } }] })
      + chunk({ reasoning_content: '私密思考二', tool_calls: [{ index: 0, id: 'first', function: { name: 'library', arguments: '学"}' } }, { index: 1, id: 'second', function: { name: 'library', arguments: '"化学"}' } }] })
      + chunk({}, 'tool_calls') + done;
    const bytes = new TextEncoder().encode(': heartbeat\r\n\r\n' + first);
    const response = new Response(new ReadableStream({ start(controller) { for (let index = 0; index < bytes.length; index += 3) controller.enqueue(bytes.slice(index, index + 3)); controller.close(); } }), { headers: { 'Content-Type': 'text/event-stream' } });
    const fetch = vi.fn().mockResolvedValueOnce(response).mockResolvedValueOnce(final()); vi.stubGlobal('fetch', fetch);
    const tool = definition(); const onText = vi.fn();
    await deepseekToolAnswer(config, 'JSON', '大学化学', [tool], { onText });
    expect(tool.execute).toHaveBeenNthCalledWith(1, { query: '大学' }, expect.any(AbortSignal));
    expect(tool.execute).toHaveBeenNthCalledWith(2, { query: '化学' }, expect.any(AbortSignal));
    const sent = JSON.parse(fetch.mock.calls[1][1].body);
    expect(sent.messages[2].reasoning_content).toBe('私密思考一私密思考二');
    expect(sent.messages.slice(3).map((message: any) => message.tool_call_id)).toEqual(['call-first', 'call-second']);
    expect(onText.mock.calls.flat().join('')).not.toMatch(/私密|query|call-first/);
  });

  it('preserves reasoning from all previous tool rounds, including assistant text, without returning it as the final answer', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(json({ role: 'assistant', content: '先检索', reasoning_content: 'thought-one', tool_calls: [toolCall('one')] }, 'tool_calls')).mockResolvedValueOnce(nonStreamTools([toolCall('two')], 'thought-two')).mockResolvedValueOnce(json({ role: 'assistant', content: '最终正文', reasoning_content: 'thought-three' }, 'stop'));
    vi.stubGlobal('fetch', fetch); const onText = vi.fn();
    await expect(deepseekToolAnswer(config, 'JSON', '需求', [definition()], { onText })).resolves.toBe('最终正文');
    const third = JSON.parse(fetch.mock.calls[2][1].body);
    expect(third.messages.filter((message: any) => message.role === 'assistant').map((message: any) => message.reasoning_content)).toEqual(['thought-one', 'thought-two']);
    expect(third.messages[2].content).toBe('先检索');
    expect(onText.mock.calls.flat().join('')).not.toMatch(/thought-one|thought-two|thought-three/);
  });

  it('treats null optional fragment fields as absent while accumulating argument text', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(stream(chunk({ tool_calls: [{ index: 0, ...toolCall('null-fragments', 'search_library', '{"query":') }] }) + chunk({ tool_calls: [{ index: 0, id: null, type: null, function: { name: null, arguments: '"化学"}' } }] }) + chunk({}, 'tool_calls') + done)).mockResolvedValueOnce(final());
    vi.stubGlobal('fetch', fetch); const tool = definition();
    await deepseekToolAnswer(config, 'JSON', '需求', [tool]);
    expect(tool.execute).toHaveBeenCalledWith({ query: '化学' }, expect.any(AbortSignal));
  });

  it('returns unknown-tool and invalid-JSON errors to the model without executing undeclared functions', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(nonStreamTools([toolCall('unknown', 'read_any_file'), toolCall('bad-json', 'search_library', '{broken')])).mockResolvedValueOnce(final());
    vi.stubGlobal('fetch', fetch); const tool = definition(); const onTool = vi.fn();
    await deepseekToolAnswer(config, 'JSON', '需求', [tool], { onTool });
    expect(tool.execute).not.toHaveBeenCalled(); expect(onTool).not.toHaveBeenCalled();
    const results = JSON.parse(fetch.mock.calls[1][1].body).messages.filter((message: any) => message.role === 'tool').map((message: any) => JSON.parse(message.content));
    expect(results.map((result: any) => result.error.code)).toEqual(['UNKNOWN_TOOL', 'INVALID_TOOL_ARGUMENTS']);
  });

  it('uses controlled tool errors for model correction and hides unexpected exception details', async () => {
    const execute = vi.fn().mockRejectedValueOnce(new ApiError('案例ID不可用', 400, 'ENTRY_NOT_FOUND')).mockRejectedValueOnce(Error('private-file-path-and-key'));
    const fetch = vi.fn().mockResolvedValueOnce(nonStreamTools([toolCall('one'), toolCall('two')])).mockResolvedValueOnce(final()); vi.stubGlobal('fetch', fetch);
    await deepseekToolAnswer(config, 'JSON', '需求', [definition(execute)]);
    const results = JSON.parse(fetch.mock.calls[1][1].body).messages.filter((message: any) => message.role === 'tool').map((message: any) => JSON.parse(message.content));
    expect(results[0].error).toEqual({ code: 'ENTRY_NOT_FOUND', message: '案例ID不可用' });
    expect(results[1].error.code).toBe('TOOL_EXECUTION_FAILED'); expect(JSON.stringify(results)).not.toContain('private-file-path-and-key');
  });

  it('accepts a final streaming answer directly and keeps only formal cumulative content in onText', async () => {
    const onText = vi.fn(); vi.stubGlobal('fetch', vi.fn(async () => stream(chunk({ reasoning_content: 'hidden' }) + chunk({ content: '{"answer":' }) + chunk({ content: '"完成"}' }) + chunk({}, 'stop') + done)));
    await expect(deepseekToolAnswer(config, 'JSON', '需求', [definition()], { onText })).resolves.toBe('{"answer":"完成"}');
    expect(onText.mock.calls).toEqual([['{"answer":'], ['{"answer":"完成"}']]);
  });

  it.each(['length', 'content_filter', 'unknown'])('rejects the incomplete %s finish without executing partial calls', async reason => {
    const tool = definition(); vi.stubGlobal('fetch', vi.fn(async () => stream(chunk({ tool_calls: [{ index: 0, ...toolCall() }] }) + chunk({}, reason) + done)));
    await expect(deepseekToolAnswer(config, 'JSON', '需求', [tool])).rejects.toMatchObject({ code: 'MODEL_INVALID_RESPONSE' });
    expect(tool.execute).not.toHaveBeenCalled();
  });

  it.each([
    chunk({ content: '部分内容' }) + chunk({}, 'stop'),
    chunk({ reasoning_content: 'hidden' }) + chunk({}, 'stop') + done,
    chunk({}, 'tool_calls') + done,
    chunk({ tool_calls: [{ index: 0, type: 'function', function: { name: 'search_library', arguments: '{}' } }] }) + chunk({}, 'tool_calls') + done,
    frame({ error: { message: 'raw-private-error' } }),
    'data: broken-json\n\n',
  ])('rejects malformed or unfinished provider frames without leaking raw details', async value => {
    vi.stubGlobal('fetch', vi.fn(async () => stream(value)));
    await expect(deepseekToolAnswer(config, 'JSON', '需求', [definition()])).rejects.toMatchObject({ code: 'MODEL_INVALID_RESPONSE', message: expect.not.stringContaining('raw-private-error') });
  });

  it('limits the loop to eight model requests and never silently falls back to a full catalog request', async () => {
    let count = 0; const fetch = vi.fn(async () => nonStreamTools([toolCall('call-' + ++count)])); vi.stubGlobal('fetch', fetch);
    await expect(deepseekToolAnswer(config, 'JSON', '小型目录入口', [definition()])).rejects.toMatchObject({ code: 'MODEL_TOOL_LIMIT' });
    expect(fetch).toHaveBeenCalledTimes(8);
    for (const [, options] of fetch.mock.calls as unknown as [string, RequestInit][]) { const body = JSON.parse(String(options.body)); expect(body.tools).toHaveLength(1); expect(body.messages[1].content).toBe('小型目录入口'); }
  });

  it('refuses a batch exceeding the remaining twenty-four-call budget before executing any excess calls', async () => {
    const calls = Array.from({ length: 25 }, (_, index) => toolCall('call-' + index)); const tool = definition();
    const fetch = vi.fn(async () => nonStreamTools(calls)); vi.stubGlobal('fetch', fetch);
    await expect(deepseekToolAnswer(config, 'JSON', '需求', [tool])).rejects.toMatchObject({ code: 'MODEL_TOOL_LIMIT' });
    expect(tool.execute).not.toHaveBeenCalled(); expect(fetch).toHaveBeenCalledOnce();
  });

  it('allows exactly twenty-four calls across rounds but refuses any extra round of tool work', async () => {
    const first = Array.from({ length: 12 }, (_, index) => toolCall('first-' + index));
    const second = Array.from({ length: 12 }, (_, index) => toolCall('second-' + index));
    const tool = definition(); const fetch = vi.fn().mockResolvedValueOnce(nonStreamTools(first)).mockResolvedValueOnce(nonStreamTools(second)).mockResolvedValueOnce(final()); vi.stubGlobal('fetch', fetch);
    await expect(deepseekToolAnswer(config, 'JSON', '需求', [tool])).resolves.toContain('最终提示词'); expect(tool.execute).toHaveBeenCalledTimes(24);
    const other = definition(); vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(nonStreamTools(first)).mockResolvedValueOnce(nonStreamTools(second)).mockResolvedValueOnce(nonStreamTools([toolCall('extra')])));
    await expect(deepseekToolAnswer(config, 'JSON', '需求', [other])).rejects.toMatchObject({ code: 'MODEL_TOOL_LIMIT' }); expect(other.execute).toHaveBeenCalledTimes(24);
  });

  it('propagates cancellation during a tool execution without requesting another model round', async () => {
    const controller = new AbortController(); let entered!: () => void; const started = new Promise<void>(resolve => { entered = resolve; });
    const execute = vi.fn((_args: unknown, signal?: AbortSignal) => { expect(signal).toBeInstanceOf(AbortSignal); entered(); return new Promise(() => {}); });
    const fetch = vi.fn(async () => nonStreamTools()); vi.stubGlobal('fetch', fetch);
    const result = deepseekToolAnswer(config, 'JSON', '需求', [definition(execute)], { signal: controller.signal });
    const outcome = result.then(value => ({ value }), error => ({ error })); await started; controller.abort();
    await expect(outcome).resolves.toMatchObject({ error: { name: 'AbortError' } }); expect(fetch).toHaveBeenCalledOnce();
  });

  it('does not execute the next call after a user stops from the tool-status callback', async () => {
    const controller = new AbortController(); const tool = definition(); vi.stubGlobal('fetch', vi.fn(async () => nonStreamTools()));
    await expect(deepseekToolAnswer(config, 'JSON', '需求', [tool], { signal: controller.signal, onTool: () => controller.abort() })).rejects.toMatchObject({ name: 'AbortError' });
    expect(tool.execute).not.toHaveBeenCalled();
  });

  it('safely reports HTTP authentication and network errors without leaking provider payloads', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('raw-secret', { status: 401 })));
    await expect(deepseekToolAnswer(config, 'JSON', '需求', [definition()])).rejects.toMatchObject({ status: 503, code: 'MODEL_HTTP_ERROR', message: expect.not.stringContaining('raw-secret') });
    vi.stubGlobal('fetch', vi.fn(async () => { throw Error('raw-secret'); }));
    await expect(deepseekToolAnswer(config, 'JSON', '需求', [definition()])).rejects.toMatchObject({ code: 'MODEL_UNAVAILABLE', message: expect.not.stringContaining('raw-secret') });
  });

  it('cancels and releases an active SSE reader on manual stop', async () => {
    const controller = new AbortController(); const cancel = vi.fn(); let emit!: ReadableStreamDefaultController<Uint8Array>;
    const body = new ReadableStream<Uint8Array>({ start(value) { emit = value; }, cancel });
    vi.stubGlobal('fetch', vi.fn(async () => new Response(body, { headers: { 'Content-Type': 'text/event-stream' } })));
    let shown!: () => void; const visible = new Promise<void>(resolve => { shown = resolve; });
    const outcome = deepseekToolAnswer(config, 'JSON', '需求', [definition()], { signal: controller.signal, onText: shown }).then(value => ({ value }), error => ({ error }));
    emit.enqueue(new TextEncoder().encode(chunk({ content: '部分正文' }))); await visible; controller.abort();
    await expect(outcome).resolves.toMatchObject({ error: { name: 'AbortError' } }); expect(cancel).toHaveBeenCalledOnce(); expect(body.locked).toBe(false);
  });

  it('renews idle time on substantive tool-call progress but ignores heartbeats and enforces the overall deadline', async () => {
    vi.useFakeTimers(); let controller!: ReadableStreamDefaultController<Uint8Array>; const cancel = vi.fn();
    const body = new ReadableStream<Uint8Array>({ start(value) { controller = value; }, cancel });
    vi.stubGlobal('fetch', vi.fn(async () => new Response(body, { headers: { 'Content-Type': 'text/event-stream' } })));
    const outcome = deepseekToolAnswer(config, 'JSON', '需求', [definition()]).then(value => ({ value }), error => ({ error }));
    await vi.advanceTimersByTimeAsync(240000); controller.enqueue(new TextEncoder().encode(chunk({ tool_calls: [{ index: 0, id: 'call-progress', type: 'function', function: { name: 'search_library', arguments: '{"query":' } }] })));
    await vi.advanceTimersByTimeAsync(120000); expect(body.locked).toBe(true);
    controller.enqueue(new TextEncoder().encode(': heartbeat\n\n' + chunk({ reasoning_content: '继续思考' })));
    await vi.advanceTimersByTimeAsync(DEEPSEEK_MAX_DURATION_MS - 360000);
    await expect(outcome).resolves.toMatchObject({ error: { code: 'MODEL_TIMEOUT' } });
    expect(cancel).toHaveBeenCalledOnce(); expect(body.locked).toBe(false); expect(vi.getTimerCount()).toBe(0);
  });

  it('times out an unresponsive tool execution within the idle deadline', async () => {
    vi.useFakeTimers(); const execute = vi.fn(async () => new Promise(() => {}));
    vi.stubGlobal('fetch', vi.fn(async () => nonStreamTools()));
    const outcome = deepseekToolAnswer(config, 'JSON', '需求', [definition(execute)]).then(value => ({ value }), error => ({ error }));
    await vi.advanceTimersByTimeAsync(DEEPSEEK_IDLE_TIMEOUT_MS);
    await expect(outcome).resolves.toMatchObject({ error: { code: 'MODEL_TIMEOUT', status: 504 } }); expect(vi.getTimerCount()).toBe(0);
  });
});
