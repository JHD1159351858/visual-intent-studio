import { afterEach, expect, it } from 'vitest';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { Server } from 'node:http';
import { createApp } from '../server/app';

const cleanup: { dir: string; server: Server }[] = [];
afterEach(async () => {
  for (const { dir, server } of cleanup.splice(0)) {
    server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve()));
    await rm(dir, { recursive: true, force: true });
  }
});
const code = { html: '<article id="glass-card">玻璃卡片</article>', css: '#glass-card{background:#ffffff44;backdrop-filter:blur(12px)}', js: '' };
const component = { id: 'glass-surface', title: '玻璃表面', entryId: 'glass', sourceUrl: 'https://reactbits.dev/components/glass-surface', description: '透明玻璃内部', layer: 'surface', parameters: { blur: '8–16px' }, compatibleWith: ['gradient-border'], conflicts: ['不在内部铺满渐变'], mobileBehavior: '触屏可用', reducedMotion: '静态效果', limitations: ['原生适配'], code, htmlPath: 'design-library/components/glass-surface.html', posterPath: 'design-library/previews/component-glass-surface.png' };
const recipe = { id: 'chat-assistant', title: '聊天助手', description: '聊天工作区', aliases: ['聊天', '问答助手'], purpose: '输入问题并得到演示回复', features: ['消息与输入'], sections: [{ id: 'chat', title: '聊天区域', purpose: '对话' }], tokens: { colors: { ink: '#183a32' }, fonts: { body: 'system-ui' }, spacing: [8, 16, 24], radius: 12 }, interactions: [{ name: '发送问题', trigger: '点击发送', result: '演示回答' }], componentIds: ['glass-surface'], referenceEntryIds: ['glass'], pairingRules: ['玻璃内部与边框分层'], htmlPath: 'design-library/pages/chat-assistant.html', posterPath: 'design-library/previews/page-chat-assistant.png' };
async function start() {
  const dir = await mkdtemp(path.join(tmpdir(), 'design-api-'));
  for (const folder of ['data', 'design-library/pages', 'design-library/components']) await mkdir(path.join(dir, folder), { recursive: true });
  await writeFile(path.join(dir, 'data/design-pages.json'), JSON.stringify([recipe]));
  await writeFile(path.join(dir, 'data/design-components.json'), JSON.stringify([component]));
  await writeFile(path.join(dir, recipe.htmlPath), '<!doctype html><html><head><meta charset="utf-8"></head><body><main id="chat"><button>发送</button></main></body></html>');
  await writeFile(path.join(dir, component.htmlPath), `<!doctype html><html><head><meta charset="utf-8"><style>${code.css}</style></head><body>${code.html}</body></html>`);
  await writeFile(path.join(dir, '.env'), 'server-only-secret');
  const server = createApp({ rootDir: dir, model: null }).listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  cleanup.push({ dir, server }); const address = server.address();
  if (!address || typeof address === 'string') throw Error('No address');
  return { dir, base: `http://127.0.0.1:${address.port}` };
}

it('lists full page recipes and reusable components separately from video references', async () => {
  const { base } = await start(); const response = await fetch(base + '/api/design-library');
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ pages: [{ id: 'chat-assistant' }], components: [{ id: 'glass-surface', entryId: 'glass', code }] });
});
it('returns playable standalone HTML with CSP and a matching source-aware professional prompt', async () => {
  const { base } = await start();
  for (const [kind, id] of [['page', 'chat-assistant'], ['component', 'glass-surface']]) {
    const response = await fetch(`${base}/api/design-library/${kind}/${id}`);
    expect(response.status).toBe(200); const value = await response.json();
    expect(value.item.id).toBe(id); expect(value.html).toContain('Content-Security-Policy');
    expect(value.html).toContain("connect-src 'none'"); expect(value.developerPrompt).toContain('原生');
    if (kind === 'component') expect(value.developerPrompt).toContain(component.sourceUrl);
  }
});
it('rejects unknown entries and path traversal without exposing local configuration', async () => {
  const { base } = await start();
  for (const pathname of ['/api/design-library/page/missing', '/api/design-library/component/..%2F.env']) {
    const response = await fetch(base + pathname); expect(response.status).toBe(404);
    expect(await response.text()).not.toContain('server-only-secret');
  }
  const invalidKind = await fetch(base + '/api/design-library/unknown/chat-assistant');
  expect(invalidKind.status).toBe(400);
});
it('does not serve a library example containing external dependencies as a verified preview', async () => {
  const { base, dir } = await start();
  await writeFile(path.join(dir, recipe.htmlPath), '<!doctype html><html><head><script src="https://external.example/run.js"></script></head><body></body></html>');
  const response = await fetch(base + '/api/design-library/page/chat-assistant');
  expect(response.status).toBe(502); expect(await response.json()).toMatchObject({ code: 'DEMO_UNSAFE_HTML' });
});
