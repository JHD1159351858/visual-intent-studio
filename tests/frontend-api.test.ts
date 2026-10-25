import { afterEach, expect, it, vi } from 'vitest';
import { api } from '../src/api';
import type { Message, RecommendationRequest, RecommendationResponse } from '../shared/types';

afterEach(() => vi.unstubAllGlobals());

it('sends only the latest forty messages without changing the saved conversation', async () => {
  const messages: Message[] = Array.from({ length: 45 }, (_, index) => ({ role: index % 2 ? 'assistant' : 'user', content: `消息 ${index}` }));
  const body: RecommendationRequest = { description: '继续调整', stage: 'style', selections: [{ entryId: 'chosen', stage: 'structure', placement: '首页', adjustments: '留白多一点' }], excludedIds: ['previous'], messages };
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ mode: 'manual', message: '选择参考', candidates: [] }), { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);

  await api.recommend(body);

  const [url, options] = fetchMock.mock.calls[0];
  expect(url).toBe('/api/recommend');
  const payload = JSON.parse(String(options?.body));
  expect(payload.messages).toHaveLength(40);
  expect(payload).toEqual({ ...body, messages: messages.slice(-40) });
  expect(body.messages).toBe(messages);
  expect(body.messages).toHaveLength(45);
  expect(body.messages?.[0].content).toBe('消息 0');
});

const streamRequest: RecommendationRequest = { description: '玻璃边缘慢慢流动', stage: 'style', selections: [], excludedIds: [] };
const streamResult: RecommendationResponse = { mode: 'model', message: '只调整玻璃卡片的边缘。', candidates: [{ entryId: 'gradient', reason: '保留玻璃表面' }] };
const eventFrame = (event: unknown) => `data: ${JSON.stringify(event)}\n\n`;

it('delivers cumulative readable text before the final result across Chinese UTF-8 and SSE chunk boundaries', async () => {
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const body = new ReadableStream<Uint8Array>({ start(value) { controller = value; } });
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(body, { headers: { 'Content-Type': 'text/event-stream' } }));
  vi.stubGlobal('fetch', fetchMock);
  const messages: string[] = [];
  let firstMessage!: () => void;
  const received = new Promise<void>(resolve => { firstMessage = resolve; });
  let settled = false;
  const signal = new AbortController().signal;
  const resultPromise = api.recommendStream(streamRequest, content => { messages.push(content); firstMessage(); }, signal).then(result => { settled = true; return result; });
  const encoder = new TextEncoder();
  const first = encoder.encode(': heartbeat\r\n\r\ndata: {"type":"message","content":"只调整"}\r\n\r\n');
  // One byte at a time also splits each Chinese character into incomplete UTF-8 chunks.
  for (const byte of first) controller.enqueue(Uint8Array.of(byte));
  await received;
  expect(messages).toEqual(['只调整']);
  expect(settled).toBe(false);
  const rest = encoder.encode(eventFrame({ type: 'message', content: '只调整玻璃卡片的边缘。' }) + eventFrame({ type: 'result', result: streamResult }));
  for (let index = 0; index < rest.length; index += 7) controller.enqueue(rest.slice(index, index + 7));
  controller.close();
  expect(await resultPromise).toEqual(streamResult);
  expect(messages).toEqual(['只调整', '只调整玻璃卡片的边缘。']);
  expect(fetchMock.mock.calls[0][0]).toBe('/api/recommend/stream');
  expect(fetchMock.mock.calls[0][1]?.signal).toBe(signal);
});

it('limits stream context to forty messages without mutating the saved conversation', async () => {
  const messages: Message[] = Array.from({ length: 45 }, (_, index) => ({ role: 'user', content: `消息 ${index}` }));
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(eventFrame({ type: 'result', result: streamResult })));
  vi.stubGlobal('fetch', fetchMock);
  await api.recommendStream({ ...streamRequest, messages }, () => {});
  expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body)).messages).toEqual(messages.slice(-40));
  expect(messages).toHaveLength(45);
});

it('rejects a server error after partial output instead of treating it as a completed reply', async () => {
  vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response(eventFrame({ type: 'message', content: '保留玻璃' }) + eventFrame({ type: 'error', error: '模型连接中断', code: 'MODEL_FAILED' }))));
  const onMessage = vi.fn();
  await expect(api.recommendStream(streamRequest, onMessage)).rejects.toThrow('模型连接中断');
  expect(onMessage).toHaveBeenCalledExactlyOnceWith('保留玻璃');
});

it('rejects closed and incomplete streams unless a complete final result frame was received', async () => {
  for (const content of [eventFrame({ type: 'message', content: '未完成' }), eventFrame({ type: 'result', result: streamResult }).slice(0, -2), 'data: {invalid}\n\n']) {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response(content)));
    await expect(api.recommendStream(streamRequest, () => {})).rejects.toThrow();
  }
});

it('preserves a readable HTTP failure before opening the stream', async () => {
  vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ error: '请先配置智能体' }), { status: 503 })));
  await expect(api.recommendStream(streamRequest, () => {})).rejects.toThrow('请先配置智能体');
});

it('aborts an unfinished stream without accepting its partial output as a final result', async () => {
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const body = new ReadableStream<Uint8Array>({ start(value) { controller = value; } });
  vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response(body)));
  const abort = new AbortController();
  let notifyMessage!: () => void;
  const received = new Promise<void>(resolve => { notifyMessage = resolve; });
  const result = api.recommendStream(streamRequest, () => notifyMessage(), abort.signal);
  controller.enqueue(new TextEncoder().encode(eventFrame({ type: 'message', content: '尚未完成' })));
  await received;
  abort.abort();
  await expect(result).rejects.toMatchObject({ name: 'AbortError' });
});

it('accepts prompt results with an optional reviewable requirement draft and keeps legacy responses working', async () => {
  const result = { message: '完成', developerPrompt: '请实现课程资料查询页面。', referenceEntryIds: ['gradient'], assumptions: [] };
  const requirementDraft = { goal: '课程资料查询', audience: '学生', features: ['资料搜索'], visualStyle: '圆润', motion: 'expressive', constraints: '保持玻璃表面' };
  for (const response of [result, { ...result, requirementDraft }]) {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response(eventFrame({ type: 'result', result: response }))));
    expect(await api.promptStream({ brief: '课程资料页', selections: [] }, () => {})).toEqual(response);
  }
  vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response(eventFrame({ type: 'result', result: { ...result, requirementDraft: { ...requirementDraft, features: 'malformed' } } }))));
  await expect(api.promptStream({ brief: '课程资料页', selections: [] }, () => {})).rejects.toThrow('没有返回完整');
});
