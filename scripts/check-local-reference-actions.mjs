import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.APP_URL || 'http://127.0.0.1:5174';
const { entries } = await (await fetch(`${base}/api/catalog`)).json();
const ready = entries.filter(entry => entry.status === 'ready' && entry.preview.type === 'video' && entry.preview.verified);
const selection = { entryId: ready[0].id, stage: ready[0].stage, placement: '首页', target: 'page', layer: 'layout', adjustments: '保留' };
const draft = { brief: '课程资料助手', stage: 'structure', selections: [selection], messages: [{ role: 'user', content: '课程资料助手，手机能用' }, { role: 'assistant', content: '专业开发提示词\n已生成的旧提示词' }], pageRequirements: { audience: '学生', features: ['查资料'], visualStyle: '浅色', motion: 'balanced', constraints: '保留输入' }, requirementDraft: { goal: '待确认目标', audience: '学生', features: ['查看来源'], visualStyle: '蓝色', motion: 'balanced', constraints: '' }, promptFingerprint: 'old-fingerprint', promptReferenceEntryIds: ready.slice(0, 3).map(entry => entry.id) };
const other = { id: 'other-conversation', title: '其他对话', updatedAt: new Date().toISOString(), draft: { brief: '其他页面', messages: [{ role: 'user', content: '不能清空其他对话' }], stage: 'effect', selections: [selection] }, input: '其他输入', demo: null };
const store = { activeId: 'local-action-test', items: [{ id: 'local-action-test', title: '课程资料助手', updatedAt: new Date().toISOString(), draft, input: '尚未发送的内容', demo: null }, other] };
const browser = await chromium.launch({ headless: true });
let failed = false;
async function check(name, action) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
  try {
    await context.addInitScript(({ draft, store }) => { if (!sessionStorage.getItem('local-action-seeded')) { localStorage.setItem('jianyi.draft.v1', JSON.stringify(draft)); localStorage.setItem('jianyi.conversations.v1', JSON.stringify(store)); sessionStorage.setItem('local-action-seeded', 'true'); } }, { draft, store });
    const page = await context.newPage(); let modelRequests = 0;
    await page.route('**/api/status', route => route.fulfill({ json: { model: { configured: true, name: 'local-test' }, readyCount: ready.length, draftCount: 0 } }));
    await page.route('**/api/recommend/stream', route => { modelRequests++; return route.fulfill({ contentType: 'text/event-stream', body: `data: ${JSON.stringify({ type: 'result', result: { mode: 'model', message: '不应触发模型', candidates: [] } })}\n\n` }); });
    await page.goto(base, { waitUntil: 'networkidle' });
    await action(page, () => modelRequests);
    console.log('PASS ' + name);
  } catch (error) { failed = true; console.error('FAIL ' + name + ': ' + error.message); }
  finally { await context.close(); }
}
try {
  await check('结构、样式、效果换组只轮换本地候选，不改聊天或确认项', async (page, requests) => {
    for (const label of ['结构', '样式', '效果']) {
      await page.locator('.stage-stepper').getByRole('button', { name: new RegExp(label) }).click();
      const before = await page.locator('.candidate-card h3').allTextContents();
      assert.ok(before.length > 0);
      await page.getByRole('button', { name: '换一组', exact: true }).click();
      await page.waitForLoadState('networkidle');
      assert.equal(requests(), 0, label + '换组不应调用模型');
      assert.notDeepEqual(await page.locator('.candidate-card h3').allTextContents(), before);
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('jianyi.draft.v1')));
      assert.deepEqual(saved.messages, draft.messages); assert.deepEqual(saved.selections, draft.selections);
      assert.equal(await page.locator('.pending-message').count(), 0);
    }
  });
  await check('重置仅清当前需求与确认项，刷新仍空，聊天/输入/其他对话保留', async (page, requests) => {
    const otherBefore = await page.evaluate(() => JSON.parse(localStorage.getItem('jianyi.conversations.v1')).items.find(item => item.id === 'other-conversation'));
    await page.getByRole('button', { name: '重置整页需求', exact: true }).click({ timeout: 3000 });
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('jianyi.draft.v1')).brief === '');
    await page.reload({ waitUntil: 'networkidle' });
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('jianyi.draft.v1')));
    assert.equal(saved.brief, ''); assert.deepEqual(saved.selections, []);
    for (const field of ['pageRequirements', 'requirementDraft', 'promptFingerprint', 'promptReferenceEntryIds']) assert.equal(saved[field], undefined);
    assert.deepEqual(saved.messages, draft.messages);
    assert.equal(await page.getByRole('textbox', { name: '输入需求或调整意见' }).inputValue(), '尚未发送的内容');
    assert.equal(await page.locator('.saved-choice').count(), 0);
    assert.equal(await page.getByRole('button', { name: '重置整页需求', exact: true }).isDisabled(), true);
    const otherAfter = await page.evaluate(() => JSON.parse(localStorage.getItem('jianyi.conversations.v1')).items.find(item => item.id === 'other-conversation'));
    assert.deepEqual(otherAfter, otherBefore); assert.equal(requests(), 0);
  });
} finally { await browser.close(); }
if (failed) process.exitCode = 1;
