import { z } from 'zod';
import { open, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { ApiError, buildExport, eligibleEntries, exportSchema, isReady, mergeEntries, recommendationSchema, stageSchema } from './core';
import { CatalogStore } from './store';
import { fetchMedia, importSource, sourceDefinitions, syncSource } from './sources';
import { modelFromEnvironment, recommendWithModel } from './model';
import type { ModelConfig } from './model';
import type { CatalogEntry, RecommendationRequest } from '../shared/types';
import { demoRequestSchema, generateDemo, secureHtml, validateDemoInput } from './demo';
import { loadDesignLibrary, readDesignExample } from './design-library';
import { designPromptRequestSchema, generateDesignPrompt, validateDesignPromptInput } from './design-prompt';

export type ApiOptions = { rootDir?: string; model?: ModelConfig | null };
const json = (value: unknown, status = 200) => Response.json(value, { status });

async function readJson(request: Request): Promise<unknown> {
  if (!request.headers.get('content-type')?.split(';')[0].trim().toLowerCase().endsWith('/json')) return undefined;
  const limit = 1024 * 1024;
  if (Number(request.headers.get('content-length')) > limit) throw new ApiError('请求内容过大，请减少输入后重试。', 413, 'PAYLOAD_TOO_LARGE');
  const reader = request.body?.getReader(); if (!reader) return {};
  const decoder = new TextDecoder(); let text = ''; let bytes = 0;
  try {
    for (;;) {
      const chunk = await reader.read(); if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > limit) throw new ApiError('请求内容过大，请减少输入后重试。', 413, 'PAYLOAD_TOO_LARGE');
      text += decoder.decode(chunk.value, { stream: true });
    }
    text += decoder.decode();
  } finally { reader.releaseLock(); }
  if (!text.trim()) return {};
  try { return JSON.parse(text); }
  catch { throw new ApiError('请求内容不是有效 JSON。', 400, 'INVALID_JSON'); }
}

function errorResponse(error: unknown): Response {
  if (error instanceof z.ZodError || error instanceof URIError) return json({ error: '请求参数不正确，请检查当前输入。', code: 'INVALID_REQUEST' }, 400);
  if (error instanceof ApiError) return json({ error: error.message, code: error.code }, error.status);
  console.error('API request failed:', error instanceof Error ? error.message : 'Unknown error');
  return json({ error: '本地服务发生错误，请重试。', code: 'INTERNAL_ERROR' }, 500);
}

function eventStream(request: Request, generate: (signal: AbortSignal, send: (event: unknown) => void) => Promise<unknown>, failureMessage: string): Response {
  const abort = new AbortController(); const encoder = new TextEncoder();
  let closed = false; let output: ReadableStreamDefaultController<Uint8Array>;
  const close = () => {
    request.signal.removeEventListener('abort', disconnect);
    if (!closed) { closed = true; output.close(); }
  };
  const disconnect = () => { abort.abort(request.signal.reason); close(); };
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      output = controller;
      request.signal.addEventListener('abort', disconnect, { once: true });
      if (request.signal.aborted) { disconnect(); return; }
      const send = (event: unknown) => { if (!closed && !abort.signal.aborted) controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`)); };
      void (async () => {
        try { const result = await generate(abort.signal, send); send({ type: 'result', result }); }
        catch (error) { send({ type: 'error', error: error instanceof ApiError ? error.message : failureMessage, code: error instanceof ApiError ? error.code : 'INTERNAL_ERROR' }); }
        finally { close(); }
      })();
    },
    cancel(reason) { closed = true; request.signal.removeEventListener('abort', disconnect); abort.abort(reason); },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no' } });
}

function validateRecommendationInput(request: RecommendationRequest, entries: CatalogEntry[]) {
  for (const selection of request.selections) {
    const entry = entries.find(entry => entry.id === selection.entryId);
    if (!entry || !isReady(entry) || entry.stage !== selection.stage) throw new ApiError('已确认条目不可用或阶段不一致，请重新确认。');
  }
}
function manualRecommendation(request: RecommendationRequest, entries: CatalogEntry[]) {
  const candidates = eligibleEntries(entries, request).slice(0, 3).map(entry => ({ entryId: entry.id, reason: '人工浏览参考；请播放视频后自行判断是否符合需求。' }));
  return { mode: 'manual', message: candidates.length ? '尚未配置模型。当前为手动浏览模式，以下仅按目录顺序展示可播放参考，请自行比较并确认。' : '当前为手动浏览模式，此阶段没有未排除的可播放参考。可以在目录中补充并验证视频。', candidates };
}

export function createRequestHandler(options: ApiOptions = {}): (request: Request) => Promise<Response> {
  const rootDir = options.rootDir || process.cwd();
  const store = new CatalogStore(rootDir);
  const model = options.model === undefined ? modelFromEnvironment() : options.model;
  const sources = async () => {
    const entries = await store.list(); const synced = await store.sourceState();
    return sourceDefinitions.map(source => ({ ...source, count: entries.filter(entry => entry.sourceId === source.id).length, lastSyncedAt: synced[source.id] }));
  };
  const dispatch = async (request: Request): Promise<Response> => {
    const method = request.method === 'HEAD' ? 'GET' : request.method;
    const pathname = new URL(request.url).pathname.replace(/\/+$/, '');
    const parts = pathname.split('/').slice(2).map(decodeURIComponent);
    if (!pathname.startsWith('/api/')) return json({ error: '接口不存在。', code: 'NOT_FOUND' }, 404);
    if (method === 'GET') {
      if (pathname === '/api/status') { const entries = await store.list(); return json({ model: { configured: !!model, ...(model ? { name: model.name } : {}) }, readyCount: entries.filter(isReady).length, draftCount: entries.filter(entry => !isReady(entry)).length }); }
      if (pathname === '/api/catalog') return json({ entries: await store.list() });
      if (pathname === '/api/sources') return json({ sources: await sources() });
      if (pathname === '/api/design-library') return json(await loadDesignLibrary(rootDir));
      if (parts.length === 3 && parts[0] === 'design-library') {
        const { kind, id } = z.object({ kind: z.enum(['page', 'component']), id: z.string().min(1).max(120) }).parse({ kind: parts[1], id: parts[2] });
        const example = await readDesignExample(rootDir, kind, id);
        return json({ ...example, html: secureHtml(example.html) });
      }
    }
    if (method === 'PATCH' && parts.length === 2 && parts[0] === 'catalog') {
      const patch = z.object({ aliases: z.array(z.string().trim().min(1).max(120)).max(50).optional(), userNotes: z.string().max(5000).optional() }).strict().refine(value => value.aliases !== undefined || value.userNotes !== undefined, '缺少修改内容').parse(await readJson(request));
      const entries = await store.update(previous => {
        if (!previous.some(entry => entry.id === parts[1])) throw new ApiError('条目不存在。', 404, 'ENTRY_NOT_FOUND');
        return previous.map(entry => entry.id === parts[1] ? { ...entry, ...patch, ...(patch.aliases ? { aliases: [...new Set(patch.aliases)] } : {}), updatedAt: new Date().toISOString() } : entry);
      });
      return json({ entry: entries.find(entry => entry.id === parts[1]) });
    }
    if (method === 'POST') {
      if (pathname === '/api/sources/sync') {
        const { sourceId } = z.object({ sourceId: z.enum(['designeer', 'reactbits', 'aceternity', 'codrops', '60fps']) }).parse(await readJson(request));
        const incoming = await syncSource(sourceId);
        const entries = await store.update(previous => mergeEntries(previous, incoming));
        await store.markSourceSynced(sourceId, new Date().toISOString());
        return json({ source: (await sources()).find(source => source.id === sourceId), importedCount: incoming.length, entries });
      }
      if (pathname === '/api/sources/import') {
        const { url, stage } = z.object({ url: z.string().url().max(3000), stage: stageSchema.optional() }).parse(await readJson(request));
        const incoming = await importSource(url, stage); const entries = await store.update(previous => mergeEntries(previous, [incoming]));
        return json({ entry: entries.find(entry => entry.sourceUrl === incoming.sourceUrl) });
      }
      if (parts.length === 3 && parts[0] === 'catalog' && parts[2] === 'verify-preview') {
        const entry = (await store.list()).find(entry => entry.id === parts[1]);
        if (!entry) throw new ApiError('条目不存在。', 404, 'ENTRY_NOT_FOUND');
        await verifyVideo(entry, rootDir);
        const entries = await store.update(previous => previous.map(item => item.id === entry.id ? { ...item, status: 'ready', preview: { ...item.preview, verified: true, note: item.preview.note || '服务端已确认视频资源可访问。' }, updatedAt: new Date().toISOString() } : item));
        return json({ entry: entries.find(item => item.id === entry.id) });
      }
      if (pathname === '/api/recommend' || pathname === '/api/recommend/stream') {
        const input = recommendationSchema.parse(await readJson(request)); const entries = await store.list(); validateRecommendationInput(input, entries);
        if (pathname === '/api/recommend') return json(model ? await recommendWithModel(model, input, entries, { signal: request.signal }) : manualRecommendation(input, entries));
        return eventStream(request, (signal, send) => model ? recommendWithModel(model, input, entries, { signal, onMessage: content => send({ type: 'message', content }) }) : Promise.resolve(manualRecommendation(input, entries)), '本地服务发生错误，请重试。');
      }
      if (pathname === '/api/design-prompt/stream') {
        const input = designPromptRequestSchema.parse(await readJson(request)); const entries = await store.list(); validateDesignPromptInput(input, entries);
        if (!model) throw new ApiError('尚未配置模型；请配置服务端模型后生成提示词。', 503, 'MODEL_NOT_CONFIGURED');
        return eventStream(request, (signal, send) => generateDesignPrompt(model, input, entries, rootDir, { signal, onMessage: content => send({ type: 'message', content }) }), '提示词生成失败；输入和选择已保留，请重试。');
      }
      if (pathname === '/api/demo/stream') {
        const input = demoRequestSchema.parse(await readJson(request)); const entries = await store.list(); validateDemoInput(input, entries);
        if (!model) throw new ApiError('尚未配置模型；请配置服务端模型后生成页面。', 503, 'MODEL_NOT_CONFIGURED');
        return eventStream(request, (signal, send) => generateDemo(model, input, entries, rootDir, { signal, onMessage: content => send({ type: 'message', content }) }), '页面生成失败；已有页面已保留，请重试。');
      }
      if (pathname === '/api/export') return json({ markdown: buildExport(exportSchema.parse(await readJson(request)), await store.list()) });
    }
    return json({ error: '接口不存在。', code: 'NOT_FOUND' }, 404);
  };
  return async request => {
    try { const response = await dispatch(request); return request.method === 'HEAD' ? new Response(null, { status: response.status, headers: response.headers }) : response; }
    catch (error) { return errorResponse(error); }
  };
}

async function verifyVideo(entry: CatalogEntry, rootDir: string): Promise<void> {
  if (entry.preview.type !== 'video') throw new ApiError('链接不能作为视频验证；请先添加直接视频或本地录像。', 400, 'PREVIEW_NOT_VIDEO');
  const url = entry.preview.url;
  if (url.startsWith('/media/')) {
    const media = await realpath(path.resolve(rootDir, 'media')).catch(() => { throw new ApiError('本地视频目录不存在。', 400, 'PREVIEW_MISSING'); });
    let file: string;
    try { file = await realpath(path.resolve(rootDir, 'media', decodeURIComponent(url.slice('/media/'.length)))); }
    catch { throw new ApiError('本地视频不存在。', 400, 'PREVIEW_MISSING'); }
    if (path.relative(media, file).startsWith('..') || path.isAbsolute(path.relative(media, file))) throw new ApiError('视频必须位于本地 media 目录内。');
    const metadata = await stat(file);
    if (!metadata.isFile() || metadata.size < 32) throw new ApiError('本地视频文件无效或为空。');
    const handle = await open(file, 'r');
    const bytes = Buffer.alloc(32);
    try { await handle.read(bytes, 0, 32, 0); } finally { await handle.close(); }
    const ext = path.extname(file).toLowerCase();
    const valid = (ext === '.webm' && bytes.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) || ((ext === '.mp4' || ext === '.mov') && bytes.subarray(4, 8).toString() === 'ftyp');
    if (!valid) throw new ApiError('本地文件没有有效的视频容器签名。', 400, 'PREVIEW_INVALID_VIDEO');
    return;
  }
  let response: Response;
  try { response = await fetchMedia(url, 'HEAD'); }
  catch (error) {
    if (!(error instanceof ApiError) || !/HTTP (405|501)/.test(error.message)) throw error;
    response = await fetchMedia(url, 'GET');
  }
  const type = (response.headers.get('content-type') || '').toLowerCase();
  await response.body?.cancel();
  if (!type.startsWith('video/')) throw new ApiError('远程资源未返回 video/* 类型，不能作为视频预览。', 400, 'PREVIEW_INVALID_VIDEO');
}
