import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async file => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const catalog = await readJson('data/catalog.json');
let components = [];
try { components = await readJson('data/design-components.json'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
assert.equal(components.length, 20, '应交付恰好20个原生组件');
assert.equal(new Set(components.map(item => item.id)).size, 20, '组件ID必须唯一');
const ids = new Set(components.map(item => item.id));
for (const item of components) {
  const entry = catalog.find(entry => entry.id === item.entryId);
  assert.equal(entry?.status, 'ready', `${item.id} 应关联ready来源`);
  assert.equal(item.sourceUrl, entry.sourceUrl, `${item.id} 来源URL必须匹配目录`);
  assert.ok(item.limitations.length && item.mobileBehavior && item.reducedMotion);
  assert.ok(item.compatibleWith.every(id => ids.has(id)), `${item.id} 兼容列表应使用本地ID`);
  assert.equal(item.htmlPath, `design-library/components/${item.id}.html`);
  assert.equal(item.posterPath, `design-library/previews/component-${item.id}.png`);
  assert.ok(item.code.html.includes(`vi-${item.id}`), `${item.id} 应使用独立命名空间`);
  assert.match(item.code.css, /prefers-reduced-motion/, `${item.id} 应支持减少动态效果`);
  assert.ok(!/(https?:\/\/|@import|url\(|fetch\(|XMLHttpRequest|WebSocket)/.test(Object.values(item.code).join('\n')), `${item.id} 代码不能依赖网络`);
  const html = await readFile(path.join(root, item.htmlPath), 'utf8');
  assert.match(html, /^<!doctype html>/i);
  for (const snippet of Object.values(item.code)) if (snippet) assert.ok(html.includes(snippet), `${item.id} 预览应使用同一代码片段`);
}
const htmlFiles = (await readdir(path.join(root, 'design-library/components'))).filter(file => file.endsWith('.html'));
assert.equal(htmlFiles.length, 20, '物理组件HTML数量应为20');
await mkdir(path.join(root, 'design-library/previews'), { recursive: true });
await mkdir(path.join(root, 'artifacts/native-components'), { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = { checkedAt: new Date().toISOString(), componentCount: 20, desktopViewport: { width: 1200, height: 760 }, mobileViewport: { width: 390, height: 780 }, results: [], composition: null };

async function assertInteraction(page, id, touch = false) {
  const scope = page.locator(`.vi-${id}`).first();
  const activate = locator => touch ? locator.tap() : locator.click();
  switch (id) {
    case 'bento-grid': assert.equal(await scope.locator('article').count(), 4); break;
    case 'sidebar': {
      await activate(scope.getByRole('button', { name: '切换导航' }));
      assert.equal(await scope.getAttribute('data-collapsed'), 'true');
      await activate(scope.getByRole('button', { name: '切换导航' }));
      await activate(scope.getByRole('button', { name: '资料库', exact: true }));
      assert.equal(await scope.getByRole('button', { name: '资料库', exact: true }).getAttribute('aria-current'), 'page');
      break;
    }
    case 'tabs': {
      const tabs = scope.getByRole('tab');
      await activate(tabs.nth(1));
      assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true');
      assert.match(await scope.getByRole('tabpanel').filter({ visible: true }).innerText(), /素材/);
      await tabs.nth(1).press('ArrowRight');
      assert.equal(await tabs.nth(2).getAttribute('aria-selected'), 'true');
      break;
    }
    case 'accordion': {
      await activate(scope.locator('summary').nth(1));
      assert.equal(await scope.locator('details').nth(1).evaluate(node => node.open), true);
      break;
    }
    case 'modal': {
      const trigger = scope.getByRole('button', { name: '查看项目说明' });
      await activate(trigger);
      assert.equal(await scope.locator('dialog').evaluate(node => node.open), true);
      await page.keyboard.press('Escape');
      assert.equal(await scope.locator('dialog').evaluate(node => node.open), false);
      assert.equal(await trigger.evaluate(node => node === document.activeElement), true);
      break;
    }
    case 'tooltip': {
      const trigger = scope.getByRole('button', { name: '查看保存说明' });
      await activate(trigger);
      assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
      assert.equal(await scope.getByRole('tooltip').isVisible(), true);
      await trigger.press('Escape');
      assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
      break;
    }
    case 'card-stack': await activate(scope.getByRole('button', { name: '下一张' })); assert.equal(await scope.getAttribute('data-index'), '1'); break;
    case 'carousel': await activate(scope.getByRole('button', { name: '下一项' })); await page.waitForFunction(() => document.querySelector('.vi-carousel-track').scrollLeft > 0); break;
    case 'floating-navbar': await activate(scope.getByRole('button', { name: '课程', exact: true })); assert.match(await scope.locator('[aria-live]').innerText(), /课程/); break;
    case 'step-loader': await activate(scope.getByRole('button', { name: '运行演示' })); await page.waitForFunction(() => document.querySelector('.vi-step-loader progress').value === 100); assert.match(await scope.locator('[aria-live]').innerText(), /演示完成/); break;
    case 'file-picker': await scope.locator('input[type=file]').setInputFiles({ name: '组件说明.txt', mimeType: 'text/plain', buffer: Buffer.from('原生组件本地验证') }); assert.match(await scope.locator('[aria-live]').innerText(), /组件说明.txt/); break;
    case 'scroll-reveal': await scope.scrollIntoViewIfNeeded(); await page.waitForFunction(() => document.querySelector('.vi-scroll-reveal').dataset.visible === 'true'); break;
    case 'text-reveal': await activate(scope.getByRole('button', { name: '显现文字' })); assert.equal(await scope.getAttribute('data-revealed'), 'true'); break;
    case 'count-up': await activate(scope.getByRole('button', { name: '重播计数' })); await page.waitForFunction(() => document.querySelector('.vi-count-up-value').textContent === '128'); break;
    case 'spotlight-card': {
      await activate(scope.getByRole('button', { name: '切换光斑' }));
      assert.equal(await scope.getAttribute('data-spotlight'), 'true');
      break;
    }
    case 'glass-surface': assert.ok(await scope.evaluate(node => getComputedStyle(node).backdropFilter.includes('blur'))); break;
    case 'gradient-border': assert.ok(await scope.evaluate(node => getComputedStyle(node, '::before').maskImage !== 'none')); break;
    case 'moving-border': assert.ok(await scope.evaluate(node => getComputedStyle(node, '::before').animationName !== 'none')); break;
    case 'expandable-card': await activate(scope.getByRole('button', { name: '展开项目' })); assert.equal(await scope.getByRole('button').getAttribute('aria-expanded'), 'true'); assert.equal(await scope.locator('[data-details]').isVisible(), true); break;
    case 'timeline': assert.equal(await scope.locator('li').count(), 3); break;
    default: assert.fail(`未定义交互验收: ${id}`);
  }
}

try {
  for (const component of components) {
    const result = { id: component.id, entryId: component.entryId, desktop: false, mobile: false, touch: false, reducedMotion: false, networkRequests: [], runtimeErrors: [], posterPath: component.posterPath };
    const context = await browser.newContext({ viewport: report.desktopViewport });
    let page = await context.newPage();
    page.on('pageerror', error => result.runtimeErrors.push(error.message));
    page.on('request', request => { if (/^https?:/.test(request.url())) result.networkRequests.push(request.url()); });
    await page.goto(pathToFileURL(path.join(root, component.htmlPath)).href);
    await assertInteraction(page, component.id);
    await page.reload();
    await page.locator(`.vi-${component.id}`).first().waitFor();
    await page.screenshot({ path: path.join(root, component.posterPath) });
    result.desktop = true;
    await context.close();
    const mobileContext = await browser.newContext({ viewport: report.mobileViewport, isMobile: true, hasTouch: true });
    page = await mobileContext.newPage();
    page.on('pageerror', error => result.runtimeErrors.push(error.message));
    page.on('request', request => { if (/^https?:/.test(request.url())) result.networkRequests.push(request.url()); });
    await page.goto(pathToFileURL(path.join(root, component.htmlPath)).href);
    await assertInteraction(page, component.id, true);
    const width = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
    assert.ok(width.content <= width.viewport + 1, `${component.id} 390px横向溢出: ${width.content}`);
    result.mobile = true;
    result.touch = true;
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    const motion = await page.locator(`.vi-${component.id}`).first().evaluate(node => [...node.querySelectorAll('*'), node].flatMap(element => ['', '::before', '::after'].map(pseudo => { const style = getComputedStyle(element, pseudo || null); return { animation: style.animationDuration, transition: style.transitionDuration }; })));
    assert.ok(motion.every(style => style.animation.split(',').every(value => parseFloat(value) <= 0.001) && style.transition.split(',').every(value => parseFloat(value) <= 0.001)), `${component.id} 减少动态模式仍有长动画`);
    if (component.id === 'count-up') { await page.getByRole('button', { name: '重播计数' }).click(); assert.equal(await page.locator('.vi-count-up-value').innerText(), '128'); }
    if (component.id === 'scroll-reveal') assert.equal(await page.locator('.vi-scroll-reveal').getAttribute('data-visible'), 'true');
    result.reducedMotion = true;
    assert.deepEqual(result.runtimeErrors, [], `${component.id} 不应产生运行错误`);
    assert.deepEqual(result.networkRequests, [], `${component.id} 不应发起网络请求`);
    report.results.push(result);
    await mobileContext.close();
    console.log(`PASS ${component.id}: desktop + 390px touch + reduced-motion`);
  }
  const glass = components.find(item => item.id === 'glass-surface');
  const border = components.find(item => item.id === 'gradient-border');
  const page = await browser.newPage({ viewport: report.mobileViewport });
  await page.setContent(`<style>body{margin:0;padding:24px;background:#123248}${glass.code.css}${border.code.css}</style><article class="vi-glass-surface vi-gradient-border"><h2>玻璃与边框组合</h2><p>内层保持半透明。</p></article>`);
  const composition = await page.locator('article').evaluate(node => { const surface = getComputedStyle(node); const border = getComputedStyle(node, '::before'); return { surfaceBackground: surface.backgroundColor, surfaceImage: surface.backgroundImage, backdrop: surface.backdropFilter, borderMask: border.maskImage, borderImage: border.backgroundImage, width: node.getBoundingClientRect().width }; });
  assert.equal(composition.surfaceImage, 'none', '组合不能在surface铺满渐变');
  assert.ok(composition.backdrop.includes('blur') && composition.borderMask !== 'none' && composition.borderImage.includes('gradient'));
  assert.ok(composition.width <= report.mobileViewport.width - 48);
  report.composition = composition;
  await page.close();
  const posters = (await readdir(path.join(root, 'design-library/previews'))).filter(file => file.startsWith('component-') && file.endsWith('.png'));
  assert.equal(posters.length, 20, '组件PNG海报数量应为20');
  report.posterCount = posters.length;
  report.passed = true;
} catch (error) {
  report.passed = false;
  report.failure = error.stack;
  throw error;
} finally {
  await writeFile(path.join(root, 'artifacts/native-components/report.json'), JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
console.log(`Verified ${report.results.length}/20 native components; report: artifacts/native-components/report.json`);
