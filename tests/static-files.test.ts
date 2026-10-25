import { afterEach, expect, it } from 'vitest';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { serveStaticFile } from '../server/static-files';

const roots: string[] = [];
afterEach(async () => {
  for (const root of roots.splice(0)) {
    if (!root.startsWith(path.resolve(tmpdir()) + path.sep) || !path.basename(root).startsWith('static-files-')) throw Error('Unsafe fixture cleanup');
    await rm(root, { recursive: true, force: true });
  }
});
async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), 'static-files-')); roots.push(root);
  for (const directory of ['media', 'demos/example', 'design-library/previews', 'data']) await mkdir(path.join(root, directory), { recursive: true });
  await writeFile(path.join(root, 'media/sample.webm'), '0123456789');
  await writeFile(path.join(root, 'media/empty.webm'), '');
  await writeFile(path.join(root, 'demos/example/index.html'), '<html>Demo</html>');
  await writeFile(path.join(root, 'design-library/previews/example.png'), 'preview');
  await writeFile(path.join(root, 'data/secret.webm'), 'private');
  return root;
}
const request = (url: string, range?: string, method = 'GET') => new Request('http://localhost' + url, { method, ...(range ? { headers: { Range: range } } : {}) });

it('serves all three public locations with their MIME types and demo directory indexes', async () => {
  const root = await fixture();
  for (const [url, type, content] of [['/media/sample.webm', 'video/webm', '0123456789'], ['/demos/example/', 'text/html; charset=utf-8', '<html>Demo</html>'], ['/design-library/previews/example.png', 'image/png', 'preview']]) {
    const response = await serveStaticFile(request(url), root);
    expect(response.status).toBe(200); expect(response.headers.get('Content-Type')).toBe(type);
    expect(response.headers.get('Content-Length')).toBe(String(Buffer.byteLength(content)));
    expect(response.headers.get('Accept-Ranges')).toBe('bytes'); expect(await response.text()).toBe(content);
  }
});

it('streams fixed, open-ended, suffix and clamped single byte ranges', async () => {
  const root = await fixture();
  for (const [range, content, header] of [['bytes=2-5', '2345', 'bytes 2-5/10'], ['bytes=7-', '789', 'bytes 7-9/10'], ['bytes=-3', '789', 'bytes 7-9/10'], ['bytes=8-100', '89', 'bytes 8-9/10'], ['bytes=-100', '0123456789', 'bytes 0-9/10']]) {
    const response = await serveStaticFile(request('/media/sample.webm', range), root);
    expect(response.status).toBe(206); expect(response.headers.get('Content-Range')).toBe(header);
    expect(response.headers.get('Content-Length')).toBe(String(content.length)); expect(await response.text()).toBe(content);
  }
});

it('returns 416 with the complete size for invalid, unsatisfiable and multiple ranges', async () => {
  const root = await fixture();
  for (const range of ['bytes=10-', 'bytes=7-2', 'bytes=-0', 'bytes=-', 'bytes=0-1,4-5', 'items=1-2', 'bytes=99999999999999999999-', 'bytes=a-2']) {
    const response = await serveStaticFile(request('/media/sample.webm', range), root);
    expect(response.status).toBe(416); expect(response.headers.get('Content-Range')).toBe('bytes */10');
  }
  const empty = await serveStaticFile(request('/media/empty.webm', 'bytes=0-'), root);
  expect(empty.status).toBe(416); expect(empty.headers.get('Content-Range')).toBe('bytes */0');
});

it('returns header-only HEAD responses and safely serves an empty file', async () => {
  const root = await fixture();
  const head = await serveStaticFile(request('/media/sample.webm', undefined, 'HEAD'), root);
  expect(head.status).toBe(200); expect(head.headers.get('Content-Length')).toBe('10'); expect(head.body).toBeNull();
  const range = await serveStaticFile(request('/media/sample.webm', 'bytes=2-4', 'HEAD'), root);
  expect(range.status).toBe(206); expect(range.headers.get('Content-Length')).toBe('3'); expect(range.body).toBeNull();
  const empty = await serveStaticFile(request('/media/empty.webm'), root);
  expect(empty.status).toBe(200); expect(empty.headers.get('Content-Length')).toBe('0'); expect(await empty.text()).toBe('');
});

it('does not expose private roots, traversal, hidden paths, node_modules or source files', async () => {
  const root = await fixture();
  for (const name of ['.hidden', 'node_modules']) { await mkdir(path.join(root, 'media', name)); await writeFile(path.join(root, 'media', name, 'sample.webm'), 'private'); }
  await writeFile(path.join(root, 'demos/private.ts'), 'server source');
  await writeFile(path.join(root, 'demos/client.js.map'), 'source map');
  await writeFile(path.join(root, '.env'), 'private');
  for (const url of ['/data/secret.webm', '/.env', '/media/%2e%2e%2fdata%2fsecret.webm', '/media/..%5cdata%5csecret.webm', '/media/.hidden/sample.webm', '/media/node_modules/sample.webm', '/demos/private.ts', '/demos/client.js.map', '/media/%00sample.webm', '/media/%E0%A4%A']) {
    const response = await serveStaticFile(request(url), root);
    expect(response.status, url).toBe(404); expect(await response.json()).toMatchObject({ code: 'FILE_NOT_FOUND' });
  }
});

it('blocks junction escapes and aliases into hidden directories after resolving real paths', async () => {
  const root = await fixture();
  await symlink(path.join(root, 'data'), path.join(root, 'media/outside'), 'junction');
  await mkdir(path.join(root, 'media/.private'));
  await writeFile(path.join(root, 'media/.private/secret.webm'), 'private');
  await symlink(path.join(root, 'media/.private'), path.join(root, 'media/alias'), 'junction');
  for (const url of ['/media/outside/secret.webm', '/media/alias/secret.webm']) {
    const response = await serveStaticFile(request(url), root);
    expect(response.status).toBe(404); expect(await response.json()).toMatchObject({ code: 'FILE_NOT_FOUND' });
  }
});

it('returns JSON 404 for missing files and header-only 404 for HEAD', async () => {
  const root = await fixture();
  const missing = await serveStaticFile(request('/media/missing.webm'), root);
  expect(missing.status).toBe(404); expect(missing.headers.get('Content-Type')).toContain('application/json');
  expect(await missing.json()).toMatchObject({ code: 'FILE_NOT_FOUND' });
  const head = await serveStaticFile(request('/media/missing.webm', undefined, 'HEAD'), root);
  expect(head.status).toBe(404); expect(head.body).toBeNull();
});
