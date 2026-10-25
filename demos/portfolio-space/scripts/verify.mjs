import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [], checks = [];
function watch(page) {
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
}
const record = name => { checks.push(name); console.log(`PASS ${name}`); };
const ready = async page => { await page.goto('http://127.0.0.1:5181/', { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); };
const noOverflow = async page => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '出现横向溢出');

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage(); watch(page);
  await ready(page);
  await page.waitForTimeout(1200);
  assert.equal(await page.locator('[data-project]').count(), 6);
  assert.equal(await page.locator('.work-feature').count(), 2);
  assert.ok(await page.locator('.hero-work-image img').evaluate(image => image.complete && image.naturalWidth > 1000));
  await noOverflow(page);
  const heroBox = await page.locator('.hero-work').boundingBox(), captionBox = await page.locator('.hero-work-caption').boundingBox();
  assert.ok(heroBox.width >= 650);
  assert.ok(captionBox.y > heroBox.y + heroBox.height - 2, '主作品名称与图片重叠');
  await page.screenshot({ path: 'artifacts/desktop.png' });
  record('1440px首屏主作品图加载、六件作品、两张大卡、标题无重叠');

  const stage = await page.locator('.hero-stage').boundingBox();
  await page.mouse.move(stage.x + stage.width * .9, stage.y + stage.height * .3);
  assert.ok(Math.abs(parseFloat(await page.locator('.hero-stage').evaluate(element => element.style.getPropertyValue('--mx')))) <= 12);
  assert.equal(await page.locator('.hero-copy').evaluate(element => getComputedStyle(element).transform), 'none');
  const floatTransform = () => page.locator('.hero-float').evaluate(element => getComputedStyle(element).transform);
  const initial = await floatTransform(); await page.waitForTimeout(220); assert.notEqual(await floatTransform(), initial);
  await page.getByRole('button', { name: '暂停动效', exact: true }).click();
  const frozen = await floatTransform(); await page.waitForTimeout(220); assert.equal(await floatTransform(), frozen);
  await page.getByRole('button', { name: '继续动效', exact: true }).click();
  record('首屏图层视差≤12px、文字固定、持续悬浮可暂停恢复');

  const card = page.locator('[data-project="qingkang"]');
  await card.scrollIntoViewIfNeeded(); await page.waitForTimeout(700);
  const box = await card.boundingBox(); await page.mouse.move(box.x + box.width * .85, box.y + box.height * .25); await page.waitForTimeout(350);
  assert.ok(Math.abs(parseFloat(await card.evaluate(element => element.style.getPropertyValue('--ry')))) <= 2);
  assert.equal(await card.locator('.work-caption').evaluate(element => getComputedStyle(element).filter), 'none');
  for (const id of ['qingkang', 'form', 'shore', 'still', 'frame', 'mountain']) {
    await page.locator(`[data-project="${id}"]`).click();
    const dialog = page.locator('dialog[open]'); await dialog.waitFor();
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
    await dialog.getByRole('heading', { name: '设计过程', exact: true }).waitFor();
    if (id === 'qingkang') {
      await page.waitForTimeout(500); await page.screenshot({ path: 'artifacts/project-detail.png' });
      await dialog.getByRole('button', { name: '查看项目链接' }).click();
      await dialog.getByRole('status').filter({ hasText: '暂无公开链接' }).waitFor();
    }
    await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'detached' });
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-project')), id);
  }
  const heroButton = page.getByRole('button', { name: '查看主作品：轻康' });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  const movingHero = await heroButton.boundingBox();
  await page.mouse.click(movingHero.x + movingHero.width / 2, movingHero.y + movingHero.height / 2);
  await page.locator('dialog[open]').waitFor();
  await page.waitForTimeout(500); await page.mouse.click(5, 5); await page.locator('dialog').waitFor({ state: 'detached' });
  record('六个作品详情、倾斜≤2度、未公开链接、Esc/遮罩关闭、滚动和焦点恢复');

  await page.getByRole('button', { name: '聊天了解经历', exact: true }).click();
  const chat = page.locator('.s-chat-panel'); await chat.waitFor();
  assert.equal(await chat.locator('.s-chat-questions button').count(), 3);
  for (const question of ['你的工作经历是？', '你擅长什么技能？', '最近有什么项目？']) await chat.getByRole('button', { name: question, exact: true }).click();
  assert.equal(await chat.locator('.s-chat-message--visitor').count(), 3);
  await chat.getByRole('textbox', { name: '输入想了解的问题' }).fill('没有预设的提问'); await chat.getByRole('button', { name: '发送问题' }).click();
  await chat.getByText('当前为演示模式，可通过下方邮箱联系我', { exact: true }).waitFor();
  await page.waitForTimeout(250); await page.screenshot({ path: 'artifacts/chat.png' });
  await chat.getByRole('button', { name: '查看演示联系方式' }).click();
  const contact = page.locator('dialog[open]'); await contact.waitFor();
  await contact.getByRole('button', { name: '复制演示邮箱' }).click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'hello@linzhi.example.com');
  await page.keyboard.press('Escape'); await contact.waitFor({ state: 'detached' });
  await page.getByRole('button', { name: '开启聊天', exact: true }).click();
  assert.equal(await page.locator('.s-chat-message--visitor').count(), 4);
  await page.locator('.s-chat-panel').getByRole('button', { name: '关闭聊天', exact: true }).click();
  record('三个预设问答、输入兜底、聊天联系入口、真实剪贴板复制、会话保留');

  await page.setViewportSize({ width: 900, height: 1000 }); await ready(page); await noOverflow(page);
  const tabletStage = await page.locator('.hero-stage').boundingBox(), tabletCopy = await page.locator('.hero-copy').boundingBox();
  assert.ok(tabletStage.y < tabletCopy.y);
  record('900px平板图文上下布局、无横向溢出');

  const phoneContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const phone = await phoneContext.newPage(); watch(phone); await ready(phone); await phone.waitForTimeout(1200); await noOverflow(phone);
  await phone.screenshot({ path: 'artifacts/mobile.png' });
  await phone.getByRole('button', { name: '打开导航' }).tap();
  await phone.locator('.site-header nav').getByRole('link', { name: /作品/ }).tap();
  assert.equal(await phone.locator('.nav-open').count(), 0);
  const phoneCard = phone.locator('[data-project="qingkang"]'); await phoneCard.scrollIntoViewIfNeeded(); await phone.waitForTimeout(650);
  await phoneCard.dispatchEvent('pointerdown', { pointerType: 'touch', pointerId: 1 }); await phone.waitForTimeout(450);
  assert.equal(await phoneCard.getAttribute('data-held'), 'true');
  await phoneCard.dispatchEvent('pointerup', { pointerType: 'touch', pointerId: 1 }); await phone.waitForTimeout(200);
  await phoneCard.tap(); await phone.locator('dialog[open]').waitFor();
  assert.equal(Math.round((await phone.locator('dialog[open]').boundingBox()).width), 390);
  await phone.getByRole('button', { name: '关闭弹窗' }).tap(); await phone.locator('dialog').waitFor({ state: 'detached' });
  await phone.getByRole('button', { name: '开启聊天', exact: true }).tap(); await phone.waitForTimeout(250);
  const chatBox = await phone.locator('.s-chat-panel').boundingBox(); assert.ok(chatBox.width <= 390 && chatBox.width >= 340);
  await phone.screenshot({ path: 'artifacts/mobile-chat.png' });
  await phone.locator('.s-chat-panel').getByRole('button', { name: '关闭聊天', exact: true }).tap();
  record('390px导航、作品长按反馈与点击详情、90%宽聊天、无溢出');

  await phone.emulateMedia({ reducedMotion: 'reduce' }); await ready(phone);
  assert.equal(await phone.locator('.hero-float').evaluate(element => getComputedStyle(element).animationName), 'none');
  assert.equal(await phone.locator('.space-app').getAttribute('data-motion'), 'paused');
  await phone.getByRole('button', { name: '开启聊天', exact: true }).tap();
  await phone.getByRole('button', { name: '你擅长什么技能？', exact: true }).tap();
  assert.equal(await phone.locator('.s-chat-message--visitor').count(), 1);
  record('减少动态停止悬浮，作品可读，预设聊天仍可用');

  assert.deepEqual(errors, []);
  record('桌面、平板、手机浏览器无运行错误');
  await writeFile('artifacts/verification.json', JSON.stringify({ checkedAt: new Date().toISOString(), checks, errors }, null, 2));
  console.log(`Verified ${checks.length} groups.`);
} finally { await browser.close(); }
