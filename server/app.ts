import express from 'express';
import type { ErrorRequestHandler } from 'express';
import { z } from 'zod';
import { open, realpath, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { ApiError, buildExport, eligibleEntries, exportSchema, isReady, mergeEntries, recommendationSchema, stageSchema } from './core';
import { CatalogStore } from './store';
import { fetchMedia, importSource, sourceDefinitions, syncSource } from './sources';
import { modelFromEnvironment, recommendWithModel } from './model';
import type { ModelConfig } from './model';
import type { CatalogEntry } from '../shared/types';
import { demoRequestSchema, generateDemo, secureHtml, validateDemoInput } from './demo';
import { loadDesignLibrary, readDesignExample } from './design-library';
import { designPromptRequestSchema, generateDesignPrompt, validateDesignPromptInput } from './design-prompt';

export function createApp(options: { rootDir?: string; model?: ModelConfig | null } = {}) {
  const rootDir = options.rootDir || process.cwd();
  const store = new CatalogStore(rootDir);
  const model = options.model === undefined ? modelFromEnvironment() : options.model;
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));
  app.use('/media', express.static(path.join(rootDir, 'media'), { fallthrough: false }));
  app.use('/demos', express.static(path.join(rootDir, 'demos')));
  app.use('/design-library/previews', express.static(path.join(rootDir, 'design-library/previews'), { fallthrough: false }));
  app.get('/api/design-library', async (_req, res) => res.json(await loadDesignLibrary(rootDir)));
  app.get('/api/design-library/:kind/:id', async (req, res) => {
    const { kind, id } = z.object({ kind: z.enum(['page', 'component']), id: z.string().min(1).max(120) }).parse(req.params);
    const example = await readDesignExample(rootDir, kind, id);
    res.json({ ...example, html: secureHtml(example.html) });
  });
  app.get('/api/status', async (_req, res) => {
    const entries = await store.list();
    res.json({ model: { configured: !!model, ...(model ? { name: model.name } : {}) }, readyCount: entries.filter(isReady).length, draftCount: entries.filter(entry => !isReady(entry)).length });
  });
  app.get('/api/catalog', async (_req, res) => res.json({ entries: await store.list() }));
  const sources = async () => {
    const entries = await store.list();
    const synced = await store.sourceState();
    return sourceDefinitions.map(source => ({ ...source, count: entries.filter(entry => entry.sourceId === source.id).length, lastSyncedAt: synced[source.id] }));
  };
  app.get('/api/sources', async (_req, res) => res.json({ sources: await sources() }));
  app.post('/api/sources/sync', async (req, res) => {
    const { sourceId } = z.object({ sourceId: z.enum(['designeer', 'reactbits', 'aceternity', 'codrops', '60fps']) }).parse(req.body);
    const incoming = await syncSource(sourceId);
    const entries = await store.update(previous => mergeEntries(previous, incoming));
    await store.markSourceSynced(sourceId, new Date().toISOString());
    res.json({ source: (await sources()).find(source => source.id === sourceId), importedCount: incoming.length, entries });
  });
  app.post('/api/sources/import', async (req, res) => {
    const { url, stage } = z.object({ url: z.string().url().max(3000), stage: stageSchema.optional() }).parse(req.body);
    const incoming = await importSource(url, stage);
    const entries = await store.update(previous => mergeEntries(previous, [incoming]));
    res.json({ entry: entries.find(entry => entry.sourceUrl === incoming.sourceUrl) });
  });
  app.patch('/api/catalog/:id', async (req, res) => {
    const patch = z.object({ aliases: z.array(z.string().trim().min(1).max(120)).max(50).optional(), userNotes: z.string().max(5000).optional() }).strict().refine(value => value.aliases !== undefined || value.userNotes !== undefined, '缺少修改内容').parse(req.body);
    const entries = await store.update(previous => {
      const found = previous.find(entry => entry.id === req.params.id);
      if (!found) throw new ApiError('条目不存在。', 404, 'ENTRY_NOT_FOUND');
      return previous.map(entry => entry.id === found.id ? { ...entry, ...patch, ...(patch.aliases ? { aliases: [...new Set(patch.aliases)] } : {}), updatedAt: new Date().toISOString() } : entry);
    });
    res.json({ entry: entries.find(entry => entry.id === req.params.id) });
  });
  app.post('/api/catalog/:id/verify-preview', async (req, res) => {
    const entry = (await store.list()).find(entry => entry.id === req.params.id);
    if (!entry) throw new ApiError('条目不存在。', 404, 'ENTRY_NOT_FOUND');
    await verifyVideo(entry, rootDir);
    const entries = await store.update(previous => previous.map(item => item.id === entry.id ? { ...item, status: 'ready', preview: { ...item.preview, verified: true, note: item.preview.note || '服务端已确认视频资源可访问。' }, updatedAt: new Date().toISOString() } : item));
    res.json({ entry: entries.find(item => item.id === entry.id) });
  });
  app.post('/api/recommend', async (req, res) => {
    const request = recommendationSchema.parse(req.body);
    const entries = await store.list();
    for (const selection of request.selections) {
      const entry = entries.find(entry => entry.id === selection.entryId);
      if (!entry || !isReady(entry) || entry.stage !== selection.stage) throw new ApiError('已确认条目不可用或阶段不一致，请重新确认。');
    }
    if (model) return res.json(await recommendWithModel(model, request, entries));
    const candidates = eligibleEntries(entries, request).slice(0, 3).map(entry => ({ entryId: entry.id, reason: '人工浏览参考；请播放视频后自行判断是否符合需求。' }));
    res.json({ mode: 'manual', message: candidates.length ? '尚未配置模型。当前为手动浏览模式，以下仅按目录顺序展示可播放参考，请自行比较并确认。' : '当前为手动浏览模式，此阶段没有未排除的可播放参考。可以在目录中补充并验证视频。', candidates });
  });
  app.post('/api/recommend/stream', async (req, res) => {
    const request = recommendationSchema.parse(req.body);
    const entries = await store.list();
    for (const selection of request.selections) {
      const entry = entries.find(entry => entry.id === selection.entryId);
      if (!entry || !isReady(entry) || entry.stage !== selection.stage) throw new ApiError('已确认条目不可用或阶段不一致，请重新确认。');
    }
    res.set({ 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no' });
    res.flushHeaders();
    const controller = new AbortController();
    const disconnected = () => { if (!res.writableEnded) controller.abort(); };
    res.on('close', disconnected);
    const send = (event: unknown) => { if (!res.destroyed && !controller.signal.aborted) res.write(`data: ${JSON.stringify(event)}\n\n`); };
    try {
      if (model) {
        const result = await recommendWithModel(model, request, entries, { signal: controller.signal, onMessage: content => send({ type: 'message', content }) });
        send({ type: 'result', result });
      } else {
        const candidates = eligibleEntries(entries, request).slice(0, 3).map(entry => ({ entryId: entry.id, reason: '人工浏览参考；请播放视频后自行判断是否符合需求。' }));
        send({ type: 'result', result: { mode: 'manual', message: candidates.length ? '尚未配置模型。当前为手动浏览模式，以下仅按目录顺序展示可播放参考，请自行比较并确认。' : '当前为手动浏览模式，此阶段没有未排除的可播放参考。可以在目录中补充并验证视频。', candidates } });
      }
    } catch (error) {
      send({ type: 'error', error: error instanceof ApiError ? error.message : '本地服务发生错误，请重试。', code: error instanceof ApiError ? error.code : 'INTERNAL_ERROR' });
    } finally {
      res.off('close', disconnected);
      if (!res.destroyed) res.end();
    }
  });
  app.post('/api/design-prompt/stream', async (req, res) => {
    const request = designPromptRequestSchema.parse(req.body);
    const entries = await store.list();
    validateDesignPromptInput(request, entries);
    if (!model) throw new ApiError('尚未配置模型；请配置服务端模型后生成提示词。', 503, 'MODEL_NOT_CONFIGURED');
    res.set({ 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no' }); res.flushHeaders();
    const controller = new AbortController(); const disconnected = () => { if (!res.writableEnded) controller.abort(); }; res.on('close', disconnected);
    const send = (event: unknown) => { if (!res.destroyed && !controller.signal.aborted) res.write(`data: ${JSON.stringify(event)}\n\n`); };
    try {
      const result = await generateDesignPrompt(model, request, entries, rootDir, { signal: controller.signal, onMessage: content => send({ type: 'message', content }) }); send({ type: 'result', result });
    } catch (error) { send({ type: 'error', error: error instanceof ApiError ? error.message : '提示词生成失败；输入和选择已保留，请重试。', code: error instanceof ApiError ? error.code : 'INTERNAL_ERROR' }); }
    finally { res.off('close', disconnected); if (!res.destroyed) res.end(); }
  });
  app.post('/api/demo/stream', async (req, res) => {
    const request = demoRequestSchema.parse(req.body);
    const entries = await store.list();
    validateDemoInput(request, entries);
    if (!model) throw new ApiError('尚未配置模型；请配置服务端模型后生成页面。', 503, 'MODEL_NOT_CONFIGURED');
    res.set({ 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no' });
    res.flushHeaders();
    const controller = new AbortController();
    const disconnected = () => { if (!res.writableEnded) controller.abort(); };
    res.on('close', disconnected);
    const send = (event: unknown) => { if (!res.destroyed && !controller.signal.aborted) res.write(`data: ${JSON.stringify(event)}\n\n`); };
    try {
      const result = await generateDemo(model, request, entries, rootDir, { signal: controller.signal, onMessage: content => send({ type: 'message', content }) });
      send({ type: 'result', result });
    } catch (error) {
      send({ type: 'error', error: error instanceof ApiError ? error.message : '页面生成失败；已有页面已保留，请重试。', code: error instanceof ApiError ? error.code : 'INTERNAL_ERROR' });
    } finally { res.off('close', disconnected); if (!res.destroyed) res.end(); }
  });
  app.post('/api/export', async (req, res) => res.json({ markdown: buildExport(exportSchema.parse(req.body), await store.list()) }));
  app.use('/api', (_req, res) => res.status(404).json({ error: '接口不存在。', code: 'NOT_FOUND' }));
  const dist = path.join(rootDir, 'dist');
  if (existsSync(dist)) {
    app.use(express.static(dist));
    app.get('/{*path}', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }
  const handler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof z.ZodError) { res.status(400).json({ error: '请求参数不正确，请检查当前输入。', code: 'INVALID_REQUEST' }); return; }
    if (error instanceof ApiError) { res.status(error.status).json({ error: error.message, code: error.code }); return; }
    if (error?.type === 'entity.parse.failed') { res.status(400).json({ error: '请求内容不是有效 JSON。', code: 'INVALID_JSON' }); return; }
    if (error?.status === 404) { res.status(404).json({ error: '文件不存在。', code: 'FILE_NOT_FOUND' }); return; }
    console.error('API request failed:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ error: '本地服务发生错误，请重试。', code: 'INTERNAL_ERROR' });
  };
  app.use(handler);
  return app;
}
async function verifyVideo(entry: CatalogEntry, rootDir: string): Promise<void> {
  if (entry.preview.type !== 'video') throw new ApiError('链接不能作为视频验证；请先添加直接视频或本地录像。', 400, 'PREVIEW_NOT_VIDEO');
  const url = entry.preview.url;
  if (url.startsWith('/media/')) {
    const media = await realpath(path.resolve(rootDir, 'media')).catch(() => { throw new ApiError('本地视频目录不存在。', 400, 'PREVIEW_MISSING'); });
    let file: string;
    try { file = await realpath(path.resolve(rootDir, '.' + decodeURIComponent(url))); }
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

