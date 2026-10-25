import http from 'node:http';
import { readFile, writeFile, mkdir, copyFile, unlink, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const seedPath = path.join(root, 'data/catalog.seed.json');
const entries = JSON.parse(await readFile(seedPath, 'utf8'));
const requestedIds = process.argv.find(arg => arg.startsWith('--ids='))?.slice(6).split(',');
const mediaDir = path.join(root, 'media');
await mkdir(mediaDir, { recursive: true });
await mkdir(path.join(mediaDir, '.recording'), { recursive: true });
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webm': 'video/webm', '.png': 'image/png' };
const server = http.createServer(async (req, res) => {
  const route = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, `.${route}`);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Content-Length': body.length }); res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(3101, '127.0.0.1', resolve); });
const base = 'http://127.0.0.1:3101';
let browser;
const results = [];
try {
  browser = await chromium.launch({ headless: true });
  for (const entry of entries.filter(entry => entry.preview.provenance === 'reference-recording' && (!requestedIds || requestedIds.includes(entry.id)))) {
    const context = await browser.newContext({ viewport: { width: 960, height: 600 }, deviceScaleFactor: 1, recordVideo: { dir: path.join(mediaDir, '.recording'), size: { width: 960, height: 600 } } });
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/demos/${entry.id}.html`, { waitUntil: 'networkidle' });
    const started = Date.now();
    await page.mouse.move(850, 555); await page.waitForTimeout(500);
    if (entry.id === 'aceternity-layout-grid') {
      await page.mouse.move(270, 240, { steps: 25 }); await page.mouse.click(270, 240); await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(mediaDir, `${entry.id}.png`) });
      await page.mouse.move(872, 167, { steps: 22 }); await page.mouse.click(872, 167); await page.waitForTimeout(700);
      await page.mouse.move(700, 210, { steps: 25 }); await page.mouse.click(700, 210); await page.waitForTimeout(1100);
    } else if (entry.id === 'aceternity-sidebar') {
      await page.mouse.move(81, 214, { steps: 25 }); await page.waitForTimeout(1300);
      await page.screenshot({ path: path.join(mediaDir, `${entry.id}.png`) });
      await page.mouse.move(430, 300, { steps: 25 }); await page.waitForTimeout(900);
      await page.mouse.move(83, 300, { steps: 25 }); await page.waitForTimeout(1000);
    } else if (entry.id === 'aceternity-timeline' || entry.id === 'dc50ae9866b7171d') {
      await page.screenshot({ path: path.join(mediaDir, `${entry.id}.png`) });
      for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 160); await page.waitForTimeout(700); }
      await page.mouse.wheel(0, -320); await page.waitForTimeout(700);
    } else {
      // Natural pointer traversals visibly trigger hover, spotlight, tilt, mask and dot motion.
      await page.mouse.move(320, 240, { steps: 30 }); await page.waitForTimeout(500);
      await page.mouse.move(650, 270, { steps: 45 }); await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(mediaDir, `${entry.id}.png`) });
      if (entry.id === 'reactbits-dot-grid') await page.mouse.click(650, 270);
      await page.mouse.move(660, 440, { steps: 40 }); await page.waitForTimeout(500);
      await page.mouse.move(290, 420, { steps: 40 }); await page.waitForTimeout(500);
      await page.mouse.move(330, 200, { steps: 40 }); await page.waitForTimeout(500);
      await page.mouse.move(710, 310, { steps: 45 }); await page.waitForTimeout(500);
      await page.mouse.move(850, 555, { steps: 30 });
    }
    await page.waitForTimeout(Math.max(500, 8000 - (Date.now() - started)));
    if (errors.length) throw new Error(`${entry.id}: ${errors.join('; ')}`);
    const video = page.video();
    await context.close();
    const temporary = await video.path(), destination = path.join(mediaDir, `${entry.id}.webm`);
    await copyFile(temporary, destination); await unlink(temporary);

    const check = await browser.newPage({ viewport: { width: 960, height: 600 } });
    await check.goto(`${base}/demos/${entry.id}.html`);
    const playback = await check.evaluate(async url => {
      const el = document.createElement('video'); el.muted = true; el.src = url; document.body.append(el);
      await new Promise((resolve, reject) => { el.onloadedmetadata = resolve; el.onerror = () => reject(new Error('Video metadata failed')); });
      await el.play(); await new Promise(resolve => setTimeout(resolve, 450));
      return { duration: el.duration, width: el.videoWidth, height: el.videoHeight, currentTime: el.currentTime, readyState: el.readyState };
    }, `${base}/media/${entry.id}.webm`);
    await check.close();
    if (!(playback.duration > 0 && playback.width === 960 && playback.height === 600 && playback.currentTime > 0)) throw new Error(`Unplayable recording: ${entry.id}`);
    const bytes = (await stat(destination)).size;
    results.push({ id: entry.id, ...playback, bytes, recordedAt: new Date().toISOString(), provenance: 'reference-recording', interaction: entry.trigger });
    entry.preview.verified = true; entry.status = 'ready';
    console.log(`${entry.id}: ${playback.duration.toFixed(2)}s, ${playback.width}x${playback.height}, ${bytes} bytes, native playback confirmed`);
  }
  await writeFile(seedPath, JSON.stringify(entries, null, 2) + '\n');
  const verificationPath = path.join(mediaDir, 'verification.json');
  let previous = [];
  try { previous = JSON.parse(await readFile(verificationPath, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await writeFile(verificationPath, JSON.stringify([...previous.filter(item => !results.some(result => result.id === item.id)), ...results], null, 2) + '\n');
  const catalogPath = path.join(root, 'data/catalog.json');
  try {
    const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
    for (const entry of catalog) {
      const recorded = entries.find(item => item.id === entry.id && results.some(result => result.id === item.id));
      if (recorded) { entry.preview = recorded.preview; entry.status = recorded.status; }
    }
    await writeFile(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  console.log(`Verified ${results.length} reference recordings.`);
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
