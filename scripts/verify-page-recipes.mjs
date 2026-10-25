import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const artifactDir = path.join(root, 'artifacts/page-recipes');
const pages = JSON.parse(await readFile(path.join(root, 'data/design-pages.json'), 'utf8'));
const catalog = JSON.parse(await readFile(path.join(root, 'data/catalog.json'), 'utf8'));
const readyIds = new Set(catalog.filter(item => item.status === 'ready').map(item => item.id));
const componentIds = new Set(['bento-grid', 'sidebar', 'tabs', 'accordion', 'modal', 'tooltip', 'card-stack', 'carousel', 'floating-navbar', 'step-loader', 'file-picker', 'scroll-reveal', 'text-reveal', 'count-up', 'spotlight-card', 'glass-surface', 'gradient-border', 'moving-border', 'expandable-card', 'timeline']);
const report = { checkedAt: new Date().toISOString(), passed: false, viewport: { desktop: [1440, 1000], mobile: [390, 844] }, pages: [] };
await mkdir(artifactDir, { recursive: true });
await mkdir(path.join(root, 'design-library/previews'), { recursive: true });
assert.equal(pages.length, 6);
assert.equal(new Set(pages.map(item => item.id)).size, 6);

const waitState = async (page, state) => page.waitForFunction(expected => document.querySelector('main').dataset.state === expected, state);
const state = async (page, expected) => assert.equal(await page.locator('main').getAttribute('data-state'), expected);
const click = (page, id) => page.locator(`#${id}`).click();
const fill = (page, id, value) => page.locator(`#${id}`).fill(value);
async function download(page, id, extension, contains) {
  const event = page.waitForEvent('download');
  await click(page, id);
  const file = await event;
  assert.equal(await file.failure(), null);
  assert.ok(file.suggestedFilename().endsWith(extension));
  const filePath = path.join(artifactDir, file.suggestedFilename());
  await file.saveAs(filePath);
  assert.ok((await readFile(filePath, 'utf8')).includes(contains));
}

const desktopFlows = {
  async 'chat-assistant'(page) {
    await state(page, 'empty');
    await click(page, 'send');
    await state(page, 'error');
    await page.locator('[data-prompt]').first().click();
    await state(page, 'loading');
    await waitState(page, 'result');
    assert.equal(await page.locator('.message').count(), 2);
    await fill(page, 'prompt', '帮我整理一个项目想法');
    await click(page, 'send');
    await click(page, 'cancel');
    await state(page, 'result');
    assert.ok((await page.locator('#messages').innerText()).includes('已停止'));
    await click(page, 'fail');
    await waitState(page, 'error');
    await page.getByRole('button', { name: '重试回复', exact: true }).click();
    await waitState(page, 'result');
    await click(page, 'new-chat');
    await state(page, 'empty');
    await page.locator('#mode').selectOption('行动计划');
    await page.locator('[data-prompt]').first().click();
    await waitState(page, 'result');
    assert.ok((await page.locator('#messages').innerText()).includes('30 分钟'));
  },
  async 'knowledge-qa'(page) {
    await state(page, 'empty');
    await click(page, 'ask');
    await state(page, 'error');
    await fill(page, 'question', '不存在的资料主题');
    await click(page, 'ask');
    await state(page, 'loading');
    await waitState(page, 'empty');
    await click(page, 'reset-question');
    await waitState(page, 'result');
    await page.getByRole('button', { name: '查看引用 1', exact: true }).click();
    assert.equal(await page.locator('#source-dialog').isVisible(), true);
    assert.ok((await page.locator('#source-text').innerText()).includes('可观察的目标'));
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#source-dialog').isVisible(), false);
    await click(page, 'knowledge-fail');
    await waitState(page, 'error');
    await click(page, 'retry');
    await waitState(page, 'result');
    assert.equal(await page.locator('.source-button').count(), 1);
  },
  async 'writing-tools'(page) {
    await state(page, 'empty');
    await click(page, 'rewrite');
    await state(page, 'error');
    await click(page, 'load-sample');
    const original = await page.locator('#original').inputValue();
    await page.locator('[data-tool="shorten"]').click();
    await click(page, 'rewrite');
    await state(page, 'loading');
    await waitState(page, 'result');
    const short = await page.locator('.output-text').innerText();
    assert.ok(short.length < original.length);
    await click(page, 'adopt');
    assert.equal(await page.locator('#original').inputValue(), short);
    await click(page, 'load-sample');
    await page.locator('[data-tool="outline"]').click();
    await click(page, 'rewrite');
    await waitState(page, 'result');
    assert.ok((await page.locator('.output-text').innerText()).includes('下一步'));
    await page.locator('[data-tool="polish"]').click();
    await click(page, 'rewrite');
    await waitState(page, 'result');
    await download(page, 'download', '.txt', '学习计划');
    await click(page, 'writing-fail');
    await waitState(page, 'error');
    assert.equal(await page.locator('#original').inputValue(), original);
    await click(page, 'writing-retry');
    await waitState(page, 'result');
  },
  async 'data-analysis'(page) {
    await state(page, 'empty');
    await click(page, 'load-all');
    await state(page, 'loading');
    await waitState(page, 'result');
    assert.equal(await page.locator('#rows tr').count(), 6);
    assert.ok((await page.locator('#metric-students').innerText()).includes('638'));
    assert.ok((await page.locator('#metric-completion').innerText()).includes('81'));
    await page.locator('#category').selectOption('技术');
    await click(page, 'apply');
    await waitState(page, 'result');
    assert.equal(await page.locator('#rows tr').count(), 2);
    assert.ok((await page.locator('#metric-students').innerText()).includes('232'));
    await fill(page, 'minimum', '100');
    await click(page, 'apply');
    await waitState(page, 'empty');
    await click(page, 'empty-reset');
    await waitState(page, 'result');
    await page.locator('.bar').first().click();
    assert.equal(await page.locator('#record-dialog').isVisible(), true);
    assert.equal(await page.locator('#record-title').innerText(), '编程基础');
    await click(page, 'close-record');
    await download(page, 'export', '.csv', '编程基础,技术,128,82%');
    await click(page, 'analysis-fail');
    await waitState(page, 'error');
    await click(page, 'analysis-retry');
    await waitState(page, 'result');
  },
  async 'report-builder'(page) {
    await state(page, 'empty');
    await click(page, 'next');
    assert.equal(await page.locator('#input-error').isVisible(), true);
    await click(page, 'report-sample');
    await click(page, 'next');
    assert.equal(await page.locator('#step-two').isVisible(), true);
    await page.locator('#include-risk').check();
    await click(page, 'next');
    await click(page, 'generate');
    await state(page, 'loading');
    await waitState(page, 'result');
    assert.ok((await page.locator('#paper').innerText()).includes('尚未开展真实班级使用测试'));
    assert.ok((await page.locator('#paper').innerText()).includes('待确认事项'));
    await download(page, 'report-download', '.md', '课程学习工具阶段汇报');
    await click(page, 'back');
    await click(page, 'back');
    await fill(page, 'report-title', '课程学习工具复核报告');
    await click(page, 'next');
    await click(page, 'next');
    await click(page, 'report-fail');
    await waitState(page, 'error');
    await click(page, 'report-retry');
    await waitState(page, 'result');
    assert.ok((await page.locator('#paper').innerText()).includes('课程学习工具复核报告'));
  },
  async 'agent-portal'(page) {
    await state(page, 'result');
    assert.equal(await page.locator('.card').count(), 6);
    await page.locator('[data-category="创作"]').click();
    await state(page, 'loading');
    await waitState(page, 'result');
    assert.equal(await page.locator('.card').count(), 1);
    await fill(page, 'agent-query', '不存在的工具');
    await click(page, 'search');
    await waitState(page, 'empty');
    await click(page, 'portal-reset');
    await waitState(page, 'result');
    await fill(page, 'agent-query', '写作');
    await click(page, 'search');
    await waitState(page, 'result');
    await page.getByRole('button', { name: '打开 文字精简助手', exact: true }).click();
    await click(page, 'run-task');
    assert.ok((await page.locator('#task-result').innerText()).includes('先写下一项任务'));
    await click(page, 'task-example');
    const before = await page.locator('#agent-task').inputValue();
    await click(page, 'run-task');
    await page.locator('#task-result.result').waitFor();
    assert.ok((await page.locator('#task-result').innerText()).length < before.length);
    await click(page, 'close-agent');
    await click(page, 'portal-fail');
    await waitState(page, 'error');
    await click(page, 'portal-retry');
    await waitState(page, 'result');
    await fill(page, 'agent-query', '');
    await click(page, 'search');
    await waitState(page, 'result');
    assert.equal(await page.locator('.card').count(), 6);
  }
};

async function mobileFlow(page, id) {
  if (id === 'chat-assistant') {
    await fill(page, 'prompt', '触屏学习计划'); await click(page, 'send'); await waitState(page, 'result');
  } else if (id === 'knowledge-qa') {
    await page.locator('[data-question]').first().click(); await waitState(page, 'result');
    await page.locator('.reference').first().click(); assert.equal(await page.locator('#source-dialog').isVisible(), true); await click(page, 'close-source');
  } else if (id === 'writing-tools') {
    await click(page, 'load-sample'); await click(page, 'rewrite'); await waitState(page, 'result');
  } else if (id === 'data-analysis') {
    await click(page, 'load-all'); await waitState(page, 'result');
    await page.locator('.bar').first().click(); assert.equal(await page.locator('#record-dialog').isVisible(), true); await click(page, 'close-record');
  } else if (id === 'report-builder') {
    await click(page, 'report-sample'); await click(page, 'next'); await click(page, 'next'); await click(page, 'generate'); await waitState(page, 'result');
  } else {
    await page.locator('[data-category="学习"]').click(); await waitState(page, 'result');
    await page.getByRole('button', { name: '打开 学习路线助手', exact: true }).click(); await click(page, 'task-example'); await click(page, 'run-task');
    await page.locator('#task-result.result').waitFor(); await click(page, 'close-agent');
    await page.locator('[data-category="全部"]').click(); await waitState(page, 'result');
  }
}

let browser;
try {
  browser = await chromium.launch({ headless: true });
  for (const recipe of pages) {
    const item = { id: recipe.id, passed: false, checks: [], runtimeErrors: [], networkRequests: [] };
    report.pages.push(item);
    const html = await readFile(path.join(root, recipe.htmlPath), 'utf8');
    assert.match(html, /^<!doctype html>/i);
    assert.ok(!/@import|<iframe|<script[^>]+src=|<link[^>]+href=|(?:src|href)\s*=\s*["']https?:|url\(\s*["']?https?:/i.test(html), '页面必须独立运行且不依赖外部资源');
    assert.match(html, /prefers-reduced-motion\s*:\s*reduce/);
    for (const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) new Function(script[1]);
    assert.ok(recipe.referenceEntryIds.every(id => readyIds.has(id)));
    assert.ok(recipe.componentIds.every(id => componentIds.has(id)));
    assert.ok(recipe.referenceEntryIds.length >= 3 && recipe.referenceEntryIds.length <= 6);
    assert.ok(Object.keys(recipe.tokens.colors).length >= 4 && Object.keys(recipe.tokens.colors).length <= 6);
    item.checks.push('独立doctype、内嵌经典JS/CSS、真实ready来源、6色tokens、无远程依赖');
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
    const page = await context.newPage();
    const observe = p => {
      p.on('pageerror', error => item.runtimeErrors.push(error.message));
      p.on('console', message => { if (message.type() === 'error') item.runtimeErrors.push(message.text()); });
      p.on('request', request => { if (/^https?:/.test(request.url())) item.networkRequests.push(request.url()); });
    };
    observe(page);
    await page.goto(pathToFileURL(path.join(root, recipe.htmlPath)).href, { waitUntil: 'networkidle' });
    const ids = await page.locator('[id]').evaluateAll(nodes => nodes.map(node => node.id));
    assert.equal(new Set(ids).size, ids.length, `${recipe.id} DOM id不得重复`);
    for (const section of recipe.sections) assert.ok(ids.includes(section.id), `${recipe.id} section ${section.id} 必须对应真实DOM`);
    item.checks.push('所有sections对应唯一真实DOM id');
    await desktopFlows[recipe.id](page);
    item.checks.push('桌面核心流程、空/加载/结果/可恢复错误、保留输入与导出通过');
    await page.evaluate(() => document.activeElement?.blur());
    await page.screenshot({ path: path.join(root, recipe.posterPath), fullPage: true });
    item.posterPath = recipe.posterPath;
    item.desktopState = await page.locator('main').getAttribute('data-state');
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
    const mobile = await mobileContext.newPage();
    observe(mobile);
    await mobile.goto(pathToFileURL(path.join(root, recipe.htmlPath)).href, { waitUntil: 'networkidle' });
    await mobileFlow(mobile, recipe.id);
    const width = await mobile.evaluate(() => ({ viewport: innerWidth, body: document.body.scrollWidth, document: document.documentElement.scrollWidth }));
    assert.ok(width.document <= 390 && width.body <= 390, `${recipe.id} 手机横向溢出: ${JSON.stringify(width)}`);
    const animated = await mobile.locator('*').evaluateAll(nodes => nodes.filter(node => { const style = getComputedStyle(node); return style.animationName !== 'none' || parseFloat(style.transitionDuration) > 0; }).map(node => node.id || node.className));
    assert.deepEqual(animated, [], `${recipe.id} 减少动态效果后仍有动画`);
    item.mobileWidth = width;
    item.checks.push('390px真实触屏操作、无页面横溢、prefers-reduced-motion有效');
    await mobile.evaluate(() => document.activeElement?.blur());
    await mobile.screenshot({ path: path.join(artifactDir, `mobile-${recipe.id}.png`), fullPage: true });
    assert.deepEqual(item.runtimeErrors, [], `${recipe.id} 浏览器运行错误`);
    assert.deepEqual(item.networkRequests, [], `${recipe.id} 发生网络请求`);
    item.checks.push('浏览器无脚本/控制台错误、无HTTP请求');
    item.htmlChars = html.length;
    item.htmlBytes = Buffer.byteLength(html);
    item.passed = true;
    await mobileContext.close();
    await context.close();
    console.log(`PASS ${recipe.id}: desktop flow + 390px touch + reduced-motion + poster (${html.length} chars)`);
  }
  report.passed = true;
} catch (error) {
  report.failure = error.stack || String(error);
  console.error(report.failure);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  await writeFile(path.join(artifactDir, 'report.json'), JSON.stringify(report, null, 2));
}
if (report.passed) console.log('PASS 6/6 page recipes; report: artifacts/page-recipes/report.json');
