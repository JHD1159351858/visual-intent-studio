import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.APP_URL || 'http://127.0.0.1:5173';
const report = [];
const record = message => { report.push(message); console.log(`PASS ${message}`); };
const response = await fetch(`${base}/api/catalog`);
assert.equal(response.status, 200, '请先启动 npm.cmd run dev');
const { entries } = await response.json();
const ready = entries.filter(entry => entry.status === 'ready' && entry.preview.verified && entry.preview.type === 'video');
assert.equal(ready.length, 350, '第一版应提供350个经过验证的视频案例');
for (const stage of ['structure', 'style', 'effect']) assert.ok(ready.some(entry => entry.stage === stage));
record(`${ready.length} 个可选案例，覆盖三个阶段`);
await mkdir('artifacts', { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
const page = await context.newPage();
const runtimeErrors = [];
page.on('pageerror', error => runtimeErrors.push(error.message));
try {
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '工作台', exact: true }).waitFor();
  for (const entry of ready) {
    const video = await page.evaluate(async url => {
      const element = document.createElement('video');
      element.preload = 'auto';
      element.muted = true;
      element.src = url;
      try {
        return await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error(`视频加载超时: ${url}`)), 15000);
          element.onerror = () => { clearTimeout(timer); reject(new Error(`视频无法解码: ${url}`)); };
          element.onloadeddata = () => { clearTimeout(timer); resolve({ duration: element.duration, width: element.videoWidth, height: element.videoHeight }); };
          element.load();
        });
      } finally { element.removeAttribute('src'); element.load(); }
    }, entry.preview.url);
    assert.ok(video.duration > 0 && video.width > 0 && video.height > 0, `${entry.id} 视频元数据`);
  }
  record('全部已验证视频可加载并解码');

  await page.getByRole('textbox', { name: '输入需求或调整意见' }).fill('做一个智能体页面，功能清楚，鼠标经过卡片时有柔和的光。');
  await page.getByRole('button', { name: '找参考', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.pending-message'));

  async function selectFirst(placement, adjustments = '') {
    await page.getByRole('button', { name: '选择这个', exact: true }).first().click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('用在什么位置').fill(placement);
    await dialog.getByLabel('需要怎样调整').fill(adjustments);
    await dialog.getByRole('button', { name: '确认选择', exact: true }).click();
  }
  await selectFirst('智能体功能入口');
  await page.locator('.stage-stepper').getByRole('button', { name: /样式/ }).click();
  await selectFirst('整体页面');
  await page.locator('.stage-stepper').getByRole('button', { name: /效果/ }).click();
  await selectFirst('功能卡片', '光斑更柔和，移动慢一点');
  let draft = await page.evaluate(() => JSON.parse(localStorage.getItem('jianyi.draft.v1')));
  assert.equal(draft.selections.length, 3);
  record('完成结构、样式、效果选型与使用位置、调整意见确认');

  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('.saved-choice').count(), 3);
  await page.getByRole('button', { name: '导出开发需求', exact: true }).click();
  const output = page.getByRole('textbox', { name: '开发需求Markdown' });
  await output.waitFor();
  const markdown = await output.inputValue();
  assert.ok(markdown.includes('光斑更柔和，移动慢一点'));
  for (const selection of draft.selections) {
    const entry = entries.find(entry => entry.id === selection.entryId);
    assert.ok(markdown.includes(entry.sourceUrl), '导出保留已选择的来源');
  }
  const unused = ready.find(entry => !draft.selections.some(selection => selection.entryId === entry.id));
  assert.ok(!markdown.includes(unused.sourceUrl), '导出不能加入未确认参考');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载 Markdown', exact: true }).click();
  const download = await downloadPromise;
  await download.saveAs('artifacts/verified-export.md');
  await page.getByRole('button', { name: '关闭', exact: true }).click();
  record('刷新恢复选择，Markdown 只含确认内容，可下载');

  await page.route('**/api/recommend', route => route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ error: '验证用：模型调用失败，请重试' }) }));
  await page.getByRole('textbox', { name: '输入需求或调整意见' }).fill('再柔和一点');
  await page.getByRole('button', { name: '找参考', exact: true }).click();
  await page.getByRole('button', { name: '重试这次请求', exact: true }).waitFor();
  assert.equal(await page.locator('.saved-choice').count(), 3);
  await page.unroute('**/api/recommend');
  await page.getByRole('button', { name: '重试这次请求', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.request-error'));
  record('调用失败保留选择，重试恢复流程');

  const beforeIds = await page.locator('.candidate-card').evaluateAll(cards => cards.map(card => card.textContent));
  await page.getByRole('button', { name: '换一组', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.pending-message'));
  const afterIds = await page.locator('.candidate-card').evaluateAll(cards => cards.map(card => card.textContent));
  assert.notDeepEqual(afterIds, beforeIds);
  record('换一组展示不同参考');

  await page.getByRole('button', { name: '参考库', exact: true }).click();
  assert.equal(await page.locator('.library-card').count(), Math.min(24, entries.length));
  assert.ok(await page.locator('.library-card video').evaluateAll(videos => videos.every(video => video.preload === 'none')));
  await page.screenshot({ path: 'artifacts/library-v1.png' });
  if (entries.length > 24) {
    await page.getByRole('button', { name: '加载更多案例', exact: true }).click();
    assert.equal(await page.locator('.library-card').count(), Math.min(48, entries.length));
  }
  for (const provenance of ['source-recording', 'original']) {
    const sourceExample = ready.find(entry => entry.preview.provenance === provenance && entry.stage === 'effect' && !draft.selections.some(selection => selection.entryId === entry.id));
    assert.ok(sourceExample, `${provenance} 应包含可播放的效果案例`);
    await page.getByRole('textbox', { name: '搜索参考资料' }).fill(sourceExample.title);
    const card = page.locator('.library-card').filter({ has: page.getByRole('heading', { name: sourceExample.title, exact: true }) });
    await card.locator('summary').click();
    assert.ok((await card.locator('details').innerText()).includes(sourceExample.trigger));
    if (sourceExample.implementationUrl) assert.equal(await card.getByRole('link', { name: /实现参考/ }).getAttribute('href'), sourceExample.implementationUrl);
    else assert.ok((await card.locator('details').innerText()).includes('未提供'));
    await card.locator('video').evaluate(video => { video.muted = true; return video.play(); });
    await card.getByRole('button', { name: '选择', exact: true }).click();
    await page.getByRole('dialog').getByLabel('用在什么位置').fill(`${provenance} 验证卡片`);
    await page.getByRole('dialog').getByRole('button', { name: '确认选择', exact: true }).click();
    await page.getByRole('button', { name: '工作台', exact: true }).click();
    await page.getByRole('button', { name: '导出开发需求', exact: true }).click();
    const updatedMarkdown = await page.getByRole('textbox', { name: '开发需求Markdown' }).inputValue();
    assert.ok(updatedMarkdown.includes(sourceExample.sourceUrl));
    assert.ok(updatedMarkdown.includes(provenance === 'source-recording' ? '原站演示的浏览器实录' : '视频说明：原站视频'));
    await page.getByRole('button', { name: '关闭', exact: true }).click();
    await page.getByRole('button', { name: '参考库', exact: true }).click();
  }
  record('参考库分批加载、完整资料展开、原站实录与原视频选型导出可用');
  await page.getByRole('textbox', { name: '搜索参考资料' }).fill('鼠标');
  assert.ok(await page.locator('.library-card').count() > 0);
  await page.getByRole('button', { name: '来源管理', exact: true }).click();
  assert.equal(await page.locator('.source-row').count(), 5);
  record('参考库口语搜索与五个来源入口可用');

  await page.getByRole('button', { name: '工作台', exact: true }).click();
  await page.screenshot({ path: 'artifacts/workbench-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), '窄屏不能横向溢出');
  await page.screenshot({ path: 'artifacts/workbench-mobile.png', fullPage: true });
  assert.deepEqual(runtimeErrors, []);
  record('桌面与窄屏布局无横向溢出，无前端运行异常');
  await writeFile('artifacts/smoke-report.json', JSON.stringify({ verifiedAt: new Date().toISOString(), passed: true, checks: report }, null, 2));
} finally {
  await context.close();
  await browser.close();
}
