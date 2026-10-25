import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createRequestHandler, type ApiOptions } from './http-api';

// Node listener for existing HTTP integration tests and local API diagnostics.
// Next.js routes call the same Web handler directly, without a second server.
export function createApp(options: ApiOptions = {}) {
  const handle = createRequestHandler(options);
  return createServer(async (incoming, outgoing) => {
    const controller = new AbortController();
    const disconnected = () => { if (!outgoing.writableEnded) controller.abort(); };
    incoming.once('aborted', disconnected); outgoing.once('close', disconnected);
    try {
      const method = incoming.method || 'GET';
      const headers = new Headers();
      for (let i = 0; i < incoming.rawHeaders.length; i += 2) headers.append(incoming.rawHeaders[i], incoming.rawHeaders[i + 1]);
      const init: RequestInit & { duplex?: 'half' } = { method, headers, signal: controller.signal };
      if (method !== 'GET' && method !== 'HEAD') { init.body = Readable.toWeb(incoming) as ReadableStream<Uint8Array>; init.duplex = 'half'; }
      const request = new Request(new URL(incoming.url || '/', 'http://localhost'), init);
      const pathname = new URL(request.url).pathname;
      const response = ['/media/', '/demos/', '/design-library/previews/'].some(prefix => pathname.startsWith(prefix))
        ? await (await import('./static-files')).serveStaticFile(request, options.rootDir)
        : await handle(request);
      if (outgoing.destroyed) { await response.body?.cancel(); return; }
      outgoing.writeHead(response.status, Object.fromEntries(response.headers)); outgoing.flushHeaders();
      if (response.body) await pipeline(Readable.fromWeb(response.body as never), outgoing);
      else outgoing.end();
    } catch {
      if (!outgoing.headersSent && !outgoing.destroyed) { outgoing.writeHead(500, { 'Content-Type': 'application/json' }); outgoing.end(JSON.stringify({ error: '本地服务发生错误，请重试。', code: 'INTERNAL_ERROR' })); }
      else if (!outgoing.destroyed) outgoing.destroy();
    } finally {
      incoming.off('aborted', disconnected); outgoing.off('close', disconnected);
    }
  });
}
