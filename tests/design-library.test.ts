import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { ComponentImplementation, PageRecipe } from '../shared/design-library';
import type { CatalogEntry, DemoRequest, DemoResult } from '../shared/types';
import { loadDesignLibrary, readDesignExample, selectDesignBasis } from '../server/design-library';
import { buildDesignKnowledgeDocuments, exportDesignKnowledge } from '../scripts/export-design-knowledge';

const roots: string[] = [];
const html = '<!doctype html><html lang="zh-CN"><head><style>.panel{background:#fff4}</style></head><body><main id="chat">知识问答演示</main><script>document.title="演示";</script></body></html>';
const entry = (id: string): CatalogEntry => ({ id, title: id, name: id, stage: 'style', description: '参考样式', aliases: [], trigger: '持续', placements: ['卡片'], tags: [], sourceId: 'reactbits', sourceUrl: `https://reactbits.dev/components/${id}`, status: 'ready', updatedAt: '', preview: { type: 'video', url: `/media/${id}.webm`, verified: true, provenance: 'reference-recording' } });
const component = (id: string, layer: ComponentImplementation['layer'] = 'surface'): ComponentImplementation => ({ id, title: `${id}组件`, entryId: id, sourceUrl: entry(id).sourceUrl, description: '原生适配示例', layer, parameters: { radius: '16px' }, compatibleWith: [], conflicts: ['不要覆盖其他层'], mobileBehavior: '触屏使用点击', reducedMotion: '关闭动画', limitations: ['原生适配，非原组件源码'], code: { html: `<article id="${id}">演示</article>`, css: `#${id}{border-radius:16px}`, js: `document.getElementById('${id}').dataset.demo='true';` }, htmlPath: `design-library/components/${id}.html`, posterPath: `design-library/previews/${id}.png` });
const recipe = (id = 'knowledge-chat'): PageRecipe => ({ id, title: id === 'knowledge-chat' ? '知识问答工作台' : '智能体工具首页', description: '完整页面演示', aliases: id === 'knowledge-chat' ? ['问答助手', '知识问答'] : ['工具集合', '工具首页'], purpose: id === 'knowledge-chat' ? '知识问答与文档检索' : '智能体工具导航与任务入口', features: id === 'knowledge-chat' ? ['对话', '引用来源'] : ['工具筛选'], sections: [{ id: 'chat', title: '主区域', purpose: '完成任务' }], tokens: { colors: { surface: '#ffffff20', border: '#55aaff' }, fonts: { body: 'system-ui' }, spacing: [8, 16, 24], radius: 16 }, interactions: [{ name: '发送', trigger: '点击按钮', result: '显示演示回复' }], componentIds: ['glass', 'gradient'], referenceEntryIds: ['glass', 'gradient'], pairingRules: ['玻璃 surface 保留；渐变只在 border 叠加'], htmlPath: `design-library/pages/${id}.html`, posterPath: `design-library/previews/${id}.png` });
const request = (brief = '做一个知识问答助手'): DemoRequest => ({ task: 'generate_demo', brief, selections: [] });
const previous = (): DemoResult => ({ status: 'ready', message: '完成', pagePlan: { summary: '知识问答工作台', layout: '左侧历史，右侧对话', visualStyle: '玻璃卡片', features: ['引用来源'], effects: [{ target: 'chat', layer: 'surface', behavior: '玻璃', referenceEntryId: 'glass', adaptation: '原生适配', preserve: ['内容'] }], assumptions: [] }, html, developerPrompt: '知识问答工作台' });
async function fixture(pages = [recipe(), recipe('agent-tools')], components = [component('glass'), component('gradient', 'border')]) {
  const root = await mkdtemp(path.join(tmpdir(), 'design-library-')); roots.push(root);
  await mkdir(path.join(root, 'data'));
  for (const item of [...pages, ...components]) { await mkdir(path.dirname(path.join(root, item.htmlPath)), { recursive: true }); await writeFile(path.join(root, item.htmlPath), html); }
  await writeFile(path.join(root, 'data/design-pages.json'), JSON.stringify(pages));
  await writeFile(path.join(root, 'data/design-components.json'), JSON.stringify(components));
  return root;
}
afterEach(async () => { for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }); });

describe('local design library', () => {
  it('loads metadata and tolerates a temporary app root without design files', async () => {
    const root = await fixture(); expect((await loadDesignLibrary(root)).pages).toHaveLength(2);
    await rm(path.join(root, 'data'), { recursive: true });
    expect(await loadDesignLibrary(root)).toEqual({ pages: [], components: [] });
  });
  it('rejects broken JSON, invalid schema and duplicate IDs instead of silently dropping them', async () => {
    const root = await fixture();
    for (const value of ['{broken', JSON.stringify([{ ...recipe(), sections: 'not an array' }]), JSON.stringify([recipe(), recipe()])]) {
      await writeFile(path.join(root, 'data/design-pages.json'), value);
      await expect(loadDesignLibrary(root)).rejects.toMatchObject({ code: 'DESIGN_LIBRARY_INVALID' });
    }
  });
  it.each(['../private.html', 'design-library/pages/../../private.html', 'C:\\private.html', 'https://example.com/page.html', 'design-library/components/glass.html'])('rejects a page path outside its allowed asset directory: %s', async htmlPath => {
    const root = await fixture();
    await writeFile(path.join(root, 'data/design-pages.json'), JSON.stringify([{ ...recipe(), htmlPath }]));
    await expect(loadDesignLibrary(root)).rejects.toMatchObject({ code: 'DESIGN_LIBRARY_INVALID' });
  });
  it('rejects symlink escapes before reading outside the workspace', async () => {
    const root = await fixture(); const outside = await mkdtemp(path.join(tmpdir(), 'design-private-')); roots.push(outside);
    await writeFile(path.join(outside, 'knowledge-chat.html'), 'private');
    const directory = path.join(root, 'design-library/pages'); await rm(directory, { recursive: true }); await symlink(outside, directory, 'junction');
    await expect(readDesignExample(root, 'page', recipe().id)).rejects.toMatchObject({ code: 'DESIGN_LIBRARY_INVALID' });
  });
  it('keeps asset reads within the declared asset directory even when a junction points elsewhere inside the workspace', async () => {
    const root = await fixture(); const privateDirectory = path.join(root, 'private'); await mkdir(privateDirectory);
    await writeFile(path.join(privateDirectory, 'knowledge-chat.html'), 'private');
    const directory = path.join(root, 'design-library/pages'); await rm(directory, { recursive: true }); await symlink(privateDirectory, directory, 'junction');
    await expect(readDesignExample(root, 'page', recipe().id)).rejects.toMatchObject({ code: 'DESIGN_LIBRARY_INVALID' });
  });
  it('reads only IDs from metadata and supplies a prompt tied to actual tokens and adaptation rules', async () => {
    const root = await fixture();
    const page = await readDesignExample(root, 'page', recipe().id);
    expect(page.html).toBe(html); expect(page.developerPrompt).toContain('#ffffff20'); expect(page.developerPrompt).toContain('显示演示回复');
    expect(page.developerPrompt).toContain('surface'); expect(page.developerPrompt).toContain('border');
    const native = await readDesignExample(root, 'component', 'gradient');
    expect(native.developerPrompt).toContain(entry('gradient').sourceUrl); expect(native.developerPrompt).toContain('非原组件源码');
    await expect(readDesignExample(root, 'page', '../../private')).rejects.toMatchObject({ status: 404 });
  });
});

describe('design basis selection', () => {
  it('uses the expressive knowledge variant for the latest strong motion preference and keeps plain pages available', async () => {
    const motion = { ...recipe(), id: 'knowledge-motion', title: '知页动效探索台', aliases: ['强动效知识问答'], htmlPath: 'design-library/pages/knowledge-motion.html', posterPath: 'design-library/previews/page-knowledge-motion.png' };
    const root = await fixture([recipe(), motion]);
    const strong = await selectDesignBasis(root, { ...request('清爽的知识问答'), messages: [{ role: 'user', content: '动态效果不够，我要动效特别强' }] }, [entry('glass'), entry('gradient')]);
    expect(strong.selectedRecipe?.id).toBe('knowledge-motion');
    expect((await selectDesignBasis(root, request(), [])).selectedRecipe?.id).toBe('knowledge-chat');
    expect((await selectDesignBasis(root, { ...request('强动效知识问答'), messages: [{ role: 'user', content: '关闭所有动画，做知识问答页面' }] }, [])).selectedRecipe?.id).toBe('knowledge-chat');
  });
  it('selects a relevant whole page with complete HTML and resolves only real ready catalog references', async () => {
    const root = await fixture();
    const basis = await selectDesignBasis(root, request(), [entry('glass'), { ...entry('gradient'), status: 'draft' }]);
    expect(basis.selectedRecipe?.id).toBe('knowledge-chat'); expect(basis.selectedRecipe?.html).toBe(html);
    expect(basis.nativeImplementations.map(item => item.id)).toEqual(['glass']); expect(basis.referenceEntryIds).toEqual(['glass']);
  });
  it('uses the latest explicit title or ID rather than an earlier different use case', async () => {
    const root = await fixture();
    const basis = await selectDesignBasis(root, { ...request('智能体工具首页'), messages: [{ role: 'user', content: '先用 agent-tools' }, { role: 'assistant', content: '保持工具页' }, { role: 'user', content: '改为知识问答工作台，用于知识问答' }] }, [entry('glass'), entry('gradient')]);
    expect(basis.selectedRecipe?.id).toBe('knowledge-chat');
    const quoted = await selectDesignBasis(root, { ...request(), messages: [{ role: 'user', content: '引用《智能体工具首页》' }] }, [entry('glass'), entry('gradient')]);
    expect(quoted.selectedRecipe?.id).toBe('agent-tools');
  });
  it('does not force a named recipe when its purpose conflicts with the requested page', async () => {
    const root = await fixture();
    const basis = await selectDesignBasis(root, request('做一个知识问答助手，参考智能体工具首页的卡片'), [entry('glass'), entry('gradient')]);
    expect(basis.selectedRecipe?.id).toBe('knowledge-chat');
    expect((await selectDesignBasis(root, request('制作餐厅订餐结算页面'), [])).selectedRecipe).toBeNull();
  });
  it('distinguishes a general chat use case from knowledge retrieval without choosing by catalog order', async () => {
    const chat = { ...recipe('chat-assistant'), title: '枝语聊天助手', aliases: ['聊天', 'AI助手'], purpose: '聊天助手与连续会话' };
    const root = await fixture([recipe(), chat]);
    expect((await selectDesignBasis(root, request('Create a chat console'), [])).selectedRecipe?.id).toBe('chat-assistant');
  });
  it.each(['学生问课程资料的页面', '帮学生查资料，能看到答案来自哪里', '把资料出处放在回答旁边'])('matches colloquial retrieval needs: %s', async brief => {
    const root = await fixture();
    expect((await selectDesignBasis(root, request(brief), [entry('glass')])).selectedRecipe?.id).toBe('knowledge-chat');
  });
  it('keeps the previous page rules and does not resend a whole new layout during a local revision', async () => {
    const root = await fixture();
    const basis = await selectDesignBasis(root, { ...request('智能体工具首页'), task: 'revise_demo', previous: previous(), changeRequest: '只把渐变边框慢一点' }, [entry('glass'), entry('gradient')]);
    expect(basis.selectedRecipe?.id).toBe('knowledge-chat'); expect(basis.selectedRecipe?.html).toBe('');
    expect(basis.nativeImplementations[0].id).toBe('glass');
  });
  it('prioritizes explicit components while keeping surface and border variants scoped independently', async () => {
    const root = await fixture();
    const selections = [{ entryId: 'gradient', stage: 'style' as const, placement: '卡片', adjustments: '', layer: 'border' as const }, { entryId: 'glass', stage: 'style' as const, placement: '卡片', adjustments: '', layer: 'surface' as const }];
    const basis = await selectDesignBasis(root, { ...request(), selections }, [entry('glass'), entry('gradient')]);
    expect(basis.nativeImplementations.map(item => item.id)).toEqual(['gradient', 'glass']);
    expect(basis.nativeImplementations[0].conflicts).toEqual(['不要覆盖其他层']);
    const wrongScope = await selectDesignBasis(root, { ...request(), selections: [{ ...selections[0], layer: 'surface' }] }, [entry('glass'), entry('gradient')]);
    expect(wrongScope.nativeImplementations.map(item => item.id)).not.toContain('gradient');
  });
  it('rejects native implementations whose source URL does not match their real catalog entry', async () => {
    const root = await fixture();
    const basis = await selectDesignBasis(root, request(), [{ ...entry('glass'), sourceUrl: 'https://example.com/other' }, entry('gradient')]);
    expect(basis.nativeImplementations.map(item => item.id)).toEqual(['gradient']);
  });
  it('selects no more than three whole component blocks within the combined 30000 character code budget', async () => {
    const components = ['glass', 'gradient', 'tabs', 'modal', 'tooltip'].map(id => component(id));
    components[0].code.css = 'x'.repeat(28000); components[1].code.js = 'y'.repeat(28000);
    const page = { ...recipe(), componentIds: components.map(item => item.id), referenceEntryIds: components.map(item => item.entryId) };
    const root = await fixture([page], components);
    const basis = await selectDesignBasis(root, request(), components.map(item => entry(item.entryId)));
    expect(basis.nativeImplementations).toHaveLength(2);
    expect(basis.nativeImplementations.map(item => item.id)).toEqual(['glass', 'tabs']);
    expect(basis.nativeImplementations[0].code.css).toHaveLength(28000);
    expect((basis.selectedRecipe?.html.length || 0) + basis.nativeImplementations.reduce((sum, item) => sum + item.code.html.length + item.code.css.length + item.code.js.length, 0)).toBeLessThanOrEqual(30000);
    expect(JSON.stringify(basis).length).toBeLessThanOrEqual(30000);
  });
  it('omits an oversized whole page instead of handing the model truncated HTML', async () => {
    const root = await fixture(); await writeFile(path.join(root, recipe().htmlPath), html + ' '.repeat(30000));
    const basis = await selectDesignBasis(root, request(), [entry('glass'), entry('gradient')]);
    expect(basis.selectedRecipe).toBeNull(); expect(basis.nativeImplementations[0].code).toEqual(component('glass').code);
  });
  it('keeps a complete expressive page with a larger bounded budget instead of silently losing the multi-effect reference', async () => {
    const motion = { ...recipe(), id: 'knowledge-motion', title: '强动效课程问答', htmlPath: 'design-library/pages/knowledge-motion.html', posterPath: 'design-library/previews/page-knowledge-motion.png' };
    const root = await fixture([recipe(), motion]);
    const fullPage = html + ' '.repeat(32000); await writeFile(path.join(root, motion.htmlPath), fullPage);
    const basis = await selectDesignBasis(root, request('课程资料查询，动效特别强'), [entry('glass'), entry('gradient')]);
    expect(basis.selectedRecipe?.html).toBe(fullPage); expect(JSON.stringify(basis).length).toBeLessThanOrEqual(45000);
  });
  it('keeps confirmed component code ahead of a whole page when both cannot fit in the full JSON budget', async () => {
    const native = component('glass'); native.code.css = 'x'.repeat(28000);
    const root = await fixture([recipe()], [native]); await writeFile(path.join(root, recipe().htmlPath), html + ' '.repeat(2500));
    const basis = await selectDesignBasis(root, { ...request(), selections: [{ entryId: 'glass', stage: 'style', placement: '卡片', layer: 'surface', adjustments: '' }] }, [entry('glass')]);
    expect(basis.selectedRecipe).toBeNull(); expect(basis.nativeImplementations[0].code.css).toBe(native.code.css);
    expect(JSON.stringify(basis).length).toBeLessThanOrEqual(30000);
  });
});

describe('design knowledge export', () => {
  it('uses separate documents and manifest with real sources and boundaries, without changing the original knowledge files', async () => {
    const root = await fixture();
    const library = await loadDesignLibrary(root); const files = buildDesignKnowledgeDocuments(library, [entry('glass'), entry('gradient')]);
    expect(files.map(file => file.name)).toEqual(['05-整页设计范例.txt', '06-高频组件实现.txt']);
    expect(files[0].content).toContain('---CASE---'); expect(files[0].content).toContain(recipe().htmlPath);
    expect(files[1].content).toContain(entry('gradient').sourceUrl); expect(files[1].content).toContain('原生适配');
    expect(files[1].content).toContain('云端不能直接访问'); expect(files[1].content).toContain('未自动上传或绑定');
    const directory = path.join(root, 'docs/coze-knowledge'); await mkdir(directory, { recursive: true }); await writeFile(path.join(directory, 'manifest.json'), 'old manifest'); await writeFile(path.join(directory, '01-设计与使用规则.txt'), 'old rules');
    await exportDesignKnowledge(root, [entry('glass'), entry('gradient')]);
    expect(await readFile(path.join(directory, 'manifest.json'), 'utf8')).toBe('old manifest');
    expect(await readFile(path.join(directory, '01-设计与使用规则.txt'), 'utf8')).toBe('old rules');
    const manifest = JSON.parse(await readFile(path.join(directory, 'design-library-manifest.json'), 'utf8'));
    expect(manifest.pageCount).toBe(2); expect(manifest.componentCount).toBe(2); expect(manifest.cloudUploaded).toBe(false);
  });
});
