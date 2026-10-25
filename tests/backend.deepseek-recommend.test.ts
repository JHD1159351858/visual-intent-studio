import { afterEach, expect, it, vi } from 'vitest';
import { recommendWithModel } from '../server/model';
import type { CatalogEntry } from '../shared/types';

const config = { provider: 'deepseek' as const, baseUrl: 'https://api.deepseek.com', name: 'deepseek-flash', apiKey: 'backend-only-secret' };
const entry: CatalogEntry = { id: 'one', name: 'One', title: '跟随光斑', stage: 'effect', description: '局部鼠标跟随', aliases: ['鼠标上去发光'], trigger: 'pointer', placements: ['卡片'], tags: [], sourceId: 'reactbits', sourceUrl: 'https://reactbits.dev/components/spotlight-card', status: 'ready', updatedAt: '', preview: { type: 'video', url: '/media/one.webm', verified: true, provenance: 'reference-recording' } };
const request = { stage: 'effect' as const, description: '卡片跟着鼠标发光', selections: [], excludedIds: ['excluded'], messages: [{ role: 'user' as const, content: '只改变卡片内部光斑' }] };
const mockStream = (entryId: string) => {
  const value = JSON.stringify({ message: '为卡片选择局部鼠标跟随光斑。', candidates: [{ entryId, reason: '局部坐标驱动光斑，符合卡片范围' }] });
  return new Response([...value].map(content => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`).join('') + `data: ${JSON.stringify({ choices: [{ delta: {}, finish_reason: 'stop' }] })}\n\ndata: [DONE]\n\n`, { headers: { 'Content-Type': 'text/event-stream' } });
};
afterEach(() => { vi.unstubAllGlobals(); });

it('selects directly from the local catalog via a streamed DeepSeek request, without Coze', async () => {
  let sent: any; const onMessage = vi.fn();
  const fetch = vi.fn(async (url: string, init: RequestInit) => { expect(url).toBe('https://api.deepseek.com/chat/completions'); sent = JSON.parse(String(init.body)); return mockStream('one'); });
  vi.stubGlobal('fetch', fetch);
  const result = await recommendWithModel(config, request, [entry, { ...entry, id: 'unfinished', status: 'draft' }], { onMessage });
  expect(result.candidates.map(candidate => candidate.entryId)).toEqual(['one']);
  expect(sent.stream).toBe(true); expect(sent).not.toHaveProperty('bot_id');
  const context = JSON.parse(sent.messages.find((message: any) => message.role === 'user').content);
  expect(context.availableCatalog.map((item: any) => item.id)).toEqual(['one']);
  expect(context.excludedIds).toEqual(['excluded']); expect(context.conversation[0].content).toContain('内部光斑');
  expect(onMessage.mock.calls.length).toBeGreaterThan(1); expect(fetch).toHaveBeenCalledOnce();
  expect(JSON.stringify(sent)).not.toContain(config.apiKey);
});

it('rejects an invented DeepSeek candidate instead of adding it to the local library', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => mockStream('invented')));
  await expect(recommendWithModel(config, request, [entry])).rejects.toMatchObject({ code: 'MODEL_INVALID_ID' });
});
