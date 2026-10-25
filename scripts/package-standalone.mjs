import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd(); const destination = path.join(root, '.next/standalone');
await stat(path.join(destination, 'server.js'));
const privateData = new Set(['catalog.json', 'selection-history.json', 'sources-state.json']);
const filter = source => {
  const parts = path.relative(root, source).split(path.sep);
  return !parts.some(part => part.startsWith('.') || part === 'node_modules') && !(parts[0] === 'data' && privateData.has(parts.at(-1)));
};
for (const directory of ['data', 'media', 'demos', 'design-library']) {
  await cp(path.join(root, directory), path.join(destination, directory), { recursive: true, filter });
}
await mkdir(path.join(destination, '.next'), { recursive: true });
await cp(path.join(root, '.next/static'), path.join(destination, '.next/static'), { recursive: true });
// Next also copies loaded env files outside file tracing; deployment injects secrets at runtime.
for (const name of await readdir(destination)) if (name.startsWith('.env')) await rm(path.join(destination, name), { force: true });
for (const name of privateData) await rm(path.join(destination, 'data', name), { force: true });
const manifestPath = path.join(destination, 'package.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
manifest.scripts = { start: 'node start.mjs' };
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
await writeFile(path.join(destination, 'start.mjs'), "process.env.PORT = process.env.DEPLOY_RUN_PORT || process.env.PORT || '5174';\nprocess.env.HOSTNAME ||= '0.0.0.0';\nawait import('./server.js');\n");
console.log('Standalone 已包含运行数据、视频、演示与前端静态资源；未复制密钥或个人选材历史。');
