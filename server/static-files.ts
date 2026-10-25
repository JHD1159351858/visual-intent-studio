import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';

const locations = [
  { prefix: '/media/', directory: 'media', index: false },
  { prefix: '/demos/', directory: 'demos', index: true },
  { prefix: '/design-library/previews/', directory: 'design-library/previews', index: false },
];
const contentTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.webm': 'video/webm', '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.ogv': 'video/ogg', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
};
const visible = (parts: string[]) => parts.every(part => !part.startsWith('.') && part.toLowerCase() !== 'node_modules');
function inside(directory: string, file: string): boolean {
  const relative = path.relative(directory, file);
  return !!relative && !path.isAbsolute(relative) && visible(relative.split(path.sep));
}
function errorResponse(status: number, code: string, error: string, head: boolean, headers: Record<string, string> = {}): Response {
  const body = JSON.stringify({ error, code });
  return new Response(head ? null : body, { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': String(Buffer.byteLength(body)), ...headers } });
}
function byteRange(value: string, size: number): { start: number; end: number } | null {
  const match = /^bytes=(\d*)-(\d*)$/i.exec(value.trim());
  if (!match || (!match[1] && !match[2]) || !size) return null;
  const first = match[1] ? Number(match[1]) : null;
  const last = match[2] ? Number(match[2]) : null;
  if ((first !== null && !Number.isSafeInteger(first)) || (last !== null && !Number.isSafeInteger(last))) return null;
  if (first === null) return last && last > 0 ? { start: Math.max(0, size - last), end: size - 1 } : null;
  if (first >= size || (last !== null && last < first)) return null;
  return { start: first, end: Math.min(last ?? size - 1, size - 1) };
}

export async function serveStaticFile(request: Request, rootDir = process.cwd()): Promise<Response> {
  const head = request.method === 'HEAD';
  const notFound = () => errorResponse(404, 'FILE_NOT_FOUND', '文件不存在。', head);
  if (request.method !== 'GET' && !head) return errorResponse(405, 'METHOD_NOT_ALLOWED', '不支持此请求方法。', false, { Allow: 'GET, HEAD' });
  request.signal.throwIfAborted();
  try {
    const pathname = new URL(request.url).pathname;
    const location = locations.find(item => pathname.startsWith(item.prefix));
    if (!location) return notFound();
    const relative = decodeURIComponent(pathname.slice(location.prefix.length));
    if (/[\0\\:]/.test(relative) || !visible(relative.split('/'))) return notFound();
    // Assets are copied explicitly by package-standalone; do not trace the entire workspace.
    const directory = path.resolve(await realpath(/* turbopackIgnore: true */ rootDir), location.directory);
    let filename = await realpath(path.join(directory, relative));
    if (!inside(directory, filename) && !(location.index && filename === directory)) return notFound();
    let file = await stat(filename);
    if (file.isDirectory() && location.index) {
      filename = await realpath(path.join(filename, 'index.html'));
      if (!inside(directory, filename)) return notFound();
      file = await stat(filename);
    }
    const contentType = contentTypes[path.extname(filename).toLowerCase()];
    if (!file.isFile() || !contentType) return notFound();
    const headers: Record<string, string> = { 'Content-Type': contentType, 'Content-Length': String(file.size), 'Accept-Ranges': 'bytes' };
    const requested = request.headers.get('range');
    const range = requested === null ? null : byteRange(requested, file.size);
    if (requested !== null && !range) return errorResponse(416, 'INVALID_RANGE', '请求的文件范围无效。', head, { 'Content-Range': `bytes */${file.size}`, 'Accept-Ranges': 'bytes' });
    if (range) {
      headers['Content-Range'] = `bytes ${range.start}-${range.end}/${file.size}`;
      headers['Content-Length'] = String(range.end - range.start + 1);
    }
    if (head || !file.size) return new Response(null, { status: range ? 206 : 200, headers });
    const stream = createReadStream(filename, { ...(range || {}), signal: request.signal });
    return new Response(Readable.toWeb(stream) as ReadableStream<Uint8Array>, { status: range ? 206 : 200, headers });
  } catch (error) {
    if (request.signal.aborted) throw request.signal.reason;
    if (error instanceof URIError || ['ENOENT', 'ENOTDIR', 'EACCES', 'EPERM', 'EINVAL'].includes((error as NodeJS.ErrnoException).code || '')) return notFound();
    throw error;
  }
}
