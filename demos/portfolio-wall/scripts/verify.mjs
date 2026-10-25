import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
const errors = [];
const checks = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const record = name => { checks.push(name); console.log(`PASS ${name}`); };
const noOverflow = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '页面横向溢出');

try {
  await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: /独立产品设计师/, level: 1 }).waitFor();
  assert.equal(await page.locator('[data-project]').count(), 6);
  await noOverflow();
  const firstWidth = (await page.locator('[data-project="walk"]').boundingBox()).width;
  const otherWidth = (await page.locator('[data-project="home"]').boundingBox()).width;
  assert.ok(Math.abs(firstWidth / otherWidth - 1.2) < 0.02);
  await page.screenshot({ path: 'artifacts/desktop.png' });
  record('桌面首屏、六张卡片、重点作品宽20%、无横向溢出');

  const floatTransform = () => page.locator('.hanging-one .mini-float').evaluate(element => getComputedStyle(element).transform);
  const before = await floatTransform();
  await page.waitForTimeout(250);
  assert.notEqual(await floatTransform(), before);
  await page.getByRole('button', { name: '暂停动效', exact: true }).click();
  const stopped = await floatTransform();
  await page.waitForTimeout(250);
  assert.equal(await floatTransform(), stopped);
  await page.getByRole('button', { name: '继续动效', exact: true }).click();
  record('首屏持续浮动可观察，暂停后位置稳定，可继续');

  const firstCard = page.locator('[data-project="walk"]');
  await firstCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const box = await firstCard.boundingBox();
  await page.mouse.move(box.x + box.width * .8, box.y + box.height * .25);
  await page.waitForTimeout(350);
  assert.notEqual(await firstCard.locator('.project-art-plane').evaluate(element => getComputedStyle(element).transform), 'none');
  assert.equal(await firstCard.locator('.project-copy').evaluate(element => getComputedStyle(element).transform), 'none');
  record('封面倾斜与分层响应，正文不继承倾斜');

  for (const id of ['walk', 'home', 'pets', 'data', 'identity', 'earth']) {
    const card = page.locator(`[data-project="${id}"]`);
    await card.click();
    const dialog = page.locator('dialog[open]');
    await dialog.waitFor();
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
    await dialog.getByRole('heading', { name: '设计的回应', exact: true }).waitFor();
    if (id === 'walk') {
      await dialog.getByRole('button', { name: '访问项目' }).click();
      await dialog.getByRole('status').filter({ hasText: '该项目暂未公开' }).waitFor();
      await page.screenshot({ path: 'artifacts/project-detail.png' });
    }
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-project')), id);
  }
  await firstCard.click();
  await page.waitForTimeout(450);
  await page.mouse.click(5, 5);
  await page.locator('dialog').waitFor({ state: 'detached' });
  record('六个项目详情、未公开链接提示、Esc/遮罩关闭、滚动和焦点恢复');

  await page.getByRole('button', { name: '联系我', exact: true }).click();
  const contact = page.locator('dialog[open]');
  await contact.getByRole('button', { name: '复制演示邮箱' }).click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'hello@zhixia.example.com');
  await contact.getByRole('status').filter({ hasText: '已复制演示邮箱' }).waitFor();
  await contact.getByRole('button', { name: '关闭弹窗' }).click();
  await contact.waitFor({ state: 'detached' });
  record('联系方式与真实剪贴板复制');

  await page.getByRole('button', { name: '和我聊聊', exact: true }).click();
  const chat = page.locator('.chat-window');
  const faqs = chat.locator('.chat-faq-list button');
  assert.equal(await faqs.count(), 10);
  for (let index = 0; index < 10; index++) await faqs.nth(index).click();
  assert.equal(await chat.locator('.chat-message-user').count(), 10);
  assert.equal(await chat.locator('.chat-message-assistant').count(), 11);
  await chat.getByRole('textbox', { name: '输入你的问题' }).fill('这是一个没有预设答案的问题');
  await chat.getByRole('button', { name: '发送消息' }).click();
  await chat.getByText('抱歉，我现在只能回答预设的问题，你可以直接通过邮箱联系我哦', { exact: true }).waitFor();
  await page.screenshot({ path: 'artifacts/chat.png' });
  await chat.getByRole('button', { name: '最小化聊天窗口', exact: true }).click();
  await page.getByRole('button', { name: '和我聊聊', exact: true }).click();
  assert.equal(await page.locator('.chat-message-user').count(), 11);
  await page.locator('.chat-contact').last().click();
  await page.locator('dialog[open]').waitFor();
  await page.keyboard.press('Escape');
  await page.locator('dialog').waitFor({ state: 'detached' });
  await chat.getByRole('button', { name: '关闭聊天窗口' }).click();
  record('10条快捷问答、输入兜底、最小化保留消息、聊天联系入口');

  await page.setViewportSize({ width: 900, height: 1000 });
  await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle' });
  await noOverflow();
  assert.ok(Math.abs((await page.locator('[data-project="home"]').boundingBox()).width - 600) < 2);
  record('平板单列600px，无横向溢出');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle' });
  await noOverflow();
  await page.screenshot({ path: 'artifacts/mobile.png', fullPage: true });
  await page.getByRole('button', { name: '和我聊聊', exact: true }).click();
  const mobileChat = await page.locator('.chat-window').boundingBox();
  assert.equal(Math.round(mobileChat.width), 390);
  assert.equal(Math.round(mobileChat.height), 844);
  await page.screenshot({ path: 'artifacts/mobile-chat.png' });
  await page.locator('.chat-window').getByRole('button', { name: '关闭聊天窗口' }).click();
  await page.getByRole('button', { name: '查看项目：步程', exact: true }).click();
  assert.equal(Math.round((await page.locator('dialog[open]').boundingBox()).width), 390);
  await page.getByRole('button', { name: '关闭弹窗' }).click();
  await page.locator('dialog').waitFor({ state: 'detached' });
  record('390px手机无横向溢出，聊天和详情全屏，触屏入口可用');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.mini-float').first().evaluate(element => getComputedStyle(element).animationName), 'none');
  assert.equal(await page.locator('.portfolio-app').getAttribute('data-motion'), 'paused');
  assert.equal(await page.locator('.project-art-plane').first().evaluate(element => getComputedStyle(element).transform), 'none');
  await page.getByRole('button', { name: '和我聊聊', exact: true }).click();
  await page.locator('.chat-faq-list button').first().click();
  assert.equal(await page.locator('.chat-message-user').count(), 1);
  await page.locator('.chat-window').getByRole('button', { name: '关闭聊天窗口' }).click();
  record('减少动态停止浮动、倾斜，功能仍可用');

  await page.goto(pathToFileURL(path.resolve('portfolio-wall-demo.html')).href, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: /独立产品设计师/, level: 1 }).waitFor();
  assert.equal(await page.locator('[data-project]').count(), 6);
  await page.getByRole('button', { name: '和我聊聊', exact: true }).click();
  await page.locator('.chat-faq-list button').first().click();
  assert.equal(await page.locator('.chat-message-user').count(), 1);
  assert.deepEqual(errors, []);
  record('单文件file协议直接打开，聊天可用，浏览器无运行错误');
  await writeFile('artifacts/verification.json', JSON.stringify({ checkedAt: new Date().toISOString(), checks, errors }, null, 2));
  console.log(`Verified ${checks.length} groups.`);
} finally {
  await browser.close();
}
