import { it, expect } from 'vitest';
import { createServer } from 'node:http';
import { recommendWithModel } from '../server/model';
import type { CatalogEntry, RecommendationRequest } from '../shared/types';
it('calls a real compatible endpoint with conversation and selection context, rejecting unknown returned IDs', async () => {
  let received = ''; let auth = '';
  const server = createServer(async (req, res) => {
    for await (const chunk of req) received += chunk.toString();
    auth = req.headers.authorization || '';
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ choices: [{ message: { content: JSON.stringify({ message: '候选', candidates: [{ entryId: 'invented', reason: 'match' }] }) } }] }));
  });
  server.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const address = server.address(); if (!address || typeof address === 'string') throw Error('No address');
  const config = { baseUrl: `http://127.0.0.1:${address.port}/v1`, name: 'test', apiKey: 'secret-test-key' };
  const entries: CatalogEntry[] = [{ id: 'one', name: 'One', title: '卡片', stage: 'effect', sourceId: 'reactbits', sourceUrl: 'https://reactbits.dev/components/one', description: 'pointer effect', aliases: ['柔光'], trigger: 'hover', tags: [], placements: [], status: 'ready', updatedAt: '', preview: { type: 'video', url: '/media/one.webm', verified: true, provenance: 'reference-recording' } }];
  const request: RecommendationRequest = { stage: 'effect', description: 'follow my pointer', selections: [], excludedIds: ['discarded'], messages: [{ role: 'user', content: 'previous preference' }] };
  try {
    await expect(recommendWithModel(config, request, entries)).rejects.toThrow(/不可用/);
    expect(auth).toBe('Bearer secret-test-key');
    expect(received).toContain('previous preference');
    expect(received).toContain('follow my pointer');
    expect(received).toContain('discarded');
    expect(received).toContain('柔光');
    expect(received).not.toContain('secret-test-key');
  } finally { await new Promise<void>(resolve => server.close(() => resolve())); }
});
