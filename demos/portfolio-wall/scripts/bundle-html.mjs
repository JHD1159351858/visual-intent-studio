import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const directory = path.resolve('dist');
let html = await readFile(path.join(directory, 'index.html'), 'utf8');
for (const match of html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g)) {
  const code = await readFile(path.join(directory, match[1]), 'utf8');
  html = html.replace(match[0], `<script type="module">${code.replace(/<\/script/gi, '<\\/script')}</script>`);
}
for (const match of html.matchAll(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/g)) {
  html = html.replace(match[0], `<style>${await readFile(path.join(directory, match[1]), 'utf8')}</style>`);
}
await writeFile('portfolio-wall-demo.html', html);
console.log('已生成可直接双击打开的 portfolio-wall-demo.html');
