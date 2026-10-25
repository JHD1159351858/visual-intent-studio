import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { DesignLibrary } from '../shared/design-library';
import type { CatalogEntry } from '../shared/types';
import { isReady, normalizeUrl } from '../server/core';
import { designDeveloperPrompt, loadDesignLibrary, readDesignExample } from '../server/design-library';
import { CatalogStore } from '../server/store';

const separator = '\n\n---CASE---\n\n';
const boundary = '资料由本地导出，未自动上传或绑定到 Coze。完整代码在项目资产文件中；本地路径云端不能直接访问。原生适配示例非原作者组件源码，预览、浏览器验收与真实服务调用须分别核验。';
export function buildDesignKnowledgeDocuments(library: DesignLibrary, entries: CatalogEntry[]): { name: string; content: string }[] {
  const ready = new Map(entries.filter(isReady).map(entry => [entry.id, entry]));
  return [
    { name: '05-整页设计范例.txt', content: library.pages.map(page => [
      `整页范例 ID：${page.id}\n名称：${page.title}\n口语别名：${page.aliases.join('、')}`,
      designDeveloperPrompt(page, library.components),
      `真实参考条目：${page.referenceEntryIds.map(id => { const entry = ready.get(id); return entry ? `${id} ${entry.sourceUrl}` : `${id}（当前目录未满足 ready 条件，不可作为可推荐候选）`; }).join('；')}`,
      `原生组件适配：${page.componentIds.join('、')}\n完整页面代码：${page.htmlPath}\n本地预览：${page.posterPath}`,
      boundary,
    ].join('\n')).join(separator) + '\n' },
    { name: '06-高频组件实现.txt', content: library.components.map(component => [
      `组件适配 ID：${component.id}\n名称：${component.title}`,
      designDeveloperPrompt(component),
      `来源资格：${ready.has(component.entryId) && normalizeUrl(ready.get(component.entryId)!.sourceUrl) === normalizeUrl(component.sourceUrl) ? '真实目录 ready；当前原生实现仍属于适配' : '来源未满足当前目录 ready 或 URL 不一致，禁止强推代码'}`,
      `完整组件代码：${component.htmlPath}\n结构代码字符：${component.code.html.length}；样式：${component.code.css.length}；交互：${component.code.js.length}`,
      `本地预览：${component.posterPath}`, boundary,
    ].join('\n')).join(separator) + '\n' },
  ];
}
export async function exportDesignKnowledge(rootDir: string, entries: CatalogEntry[]): Promise<void> {
  const library = await loadDesignLibrary(rootDir);
  for (const page of library.pages) await readDesignExample(rootDir, 'page', page.id);
  for (const component of library.components) await readDesignExample(rootDir, 'component', component.id);
  const files = buildDesignKnowledgeDocuments(library, entries);
  const directory = path.join(rootDir, 'docs/coze-knowledge'); await mkdir(directory, { recursive: true });
  for (const file of files) await writeFile(path.join(directory, file.name), file.content, 'utf8');
  await writeFile(path.join(directory, 'design-library-manifest.json'), JSON.stringify({ exportedAt: new Date().toISOString(), sources: ['data/design-pages.json', 'data/design-components.json'], pageCount: library.pages.length, componentCount: library.components.length, separator: '---CASE---', cloudUploaded: false, files: files.map(file => ({ name: file.name, bytes: Buffer.byteLength(file.content, 'utf8') })), pageIds: library.pages.map(page => page.id), componentIds: library.components.map(component => component.id) }, null, 2) + '\n');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const rootDir = process.cwd(); await exportDesignKnowledge(rootDir, await new CatalogStore(rootDir).list());
  console.log('已导出 05/06 与独立 design-library-manifest.json；Coze 云端未上传或绑定。');
}
