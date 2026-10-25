import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const standalone = path.join(root, '.next/standalone');
const output = path.join(root, 'artifacts/next-migration-20261025');
const base = 'http://127.0.0.1:5185';
const reasoning = 'PRIVATE_REASONING_FIXTURE_DO_NOT_EXPOSE';
const steps = []; const modelCalls = []; let child; let browser; let fake;
let ready = []; let cancelledUpstream = false; let finalSent = false; let failure;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const record = (name, details = {}) => { steps.push({ name, ...details }); console.log('PASS ' + name); };
const frame = (delta, finish = null) => `data: ${JSON.stringify({ choices: [{ index: 0, delta, finish_reason: finish }] })}\n\n`;
function complete(response, content, tool) {
  response.writeHead(200, { 'Content-Type': 'text/event-stream' });
  response.write(frame({ role: 'assistant', reasoning_content: reasoning, ...(tool ? { tool_calls: [{ index: 0, id: 'call_' + modelCalls.length, type: 'function', function: { name: tool.name, arguments: JSON.stringify(tool.args) } }] } : {}) }));
  if (tool) { response.end(frame({}, 'tool_calls') + 'data: [DONE]\n\n'); return; }
  response.write(frame({ content: content.slice(0, 100) }));
  setTimeout(() => { finalSent = true; response.end(frame({ content: content.slice(100) }) + frame({}, 'stop') + 'data: [DONE]\n\n'); }, 200);
}
async function fakeModel(request, response) {
  try {
    assert.equal(request.url, '/v1/chat/completions');
    let text = ''; for await (const chunk of request) text += chunk;
    const sent = JSON.parse(text); const context = JSON.parse(sent.messages[1].content);
    if (context.brief.includes('__CANCEL_FIXTURE__')) {
      response.writeHead(200, { 'Content-Type': 'text/event-stream' });
      response.write(frame({ role: 'assistant', reasoning_content: reasoning, content: '{"developerPrompt":"正在验证取消请求' }));
      response.once('close', () => { if (!response.writableEnded) cancelledUpstream = true; });
      return;
    }
    for (const message of sent.messages.filter(item => item.role === 'assistant')) assert.equal(message.reasoning_content, reasoning);
    const results = sent.messages.filter(item => item.role === 'tool').map(item => JSON.parse(item.content));
    modelCalls.push({ round: modelCalls.length + 1, toolResults: results.length, catalogCount: context.referenceLibrary.catalogCount, preloadedCount: context.availableCatalog.length });
    if (!results.length) return complete(response, null, { name: 'search_reference_library', args: { query: ready.find(entry => entry.stage === 'effect').name, limit: 1 } });
    const last = results.at(-1);
    if (last.candidates) return complete(response, null, { name: 'get_reference_details', args: { refKeys: [last.candidates[0].refKey] } });
    const entry = last.availableCatalog[0];
    assert.ok(entry.implementationKnowledge.implementation.steps.length);
    const developerPrompt = `请在目标工程实际实现资料学习工作台，交付源代码与可运行页面。首屏展示清晰的用途标题、问题输入和资料入口，答案包含来源，具备加载、空状态和错误反馈。参考${entry.title}的真实行为，将视觉效果限制在独立装饰层，正文和输入保持稳定；手机可操作，提供暂停与减少动态处理。演示资料明确标注，实施后核对桌面、触屏和错误恢复，报告真实改动与未验证项目。`;
    complete(response, JSON.stringify({ developerPrompt, requirementDraft: { goal: '资料学习工作台', audience: '学生', features: ['问题输入', '查看资料来源'], visualStyle: '清晰布局', motion: context.visualIntent.intensity, constraints: '' }, mainVisuals: [], message: '已生成测试提示词', referenceEntryIds: [entry.refKey], assumptions: ['本次为本地模拟模型验收。'] }));
  } catch {
    response.writeHead(500, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ error: 'Fixture protocol failure' }));
  }
}
async function jsonRequest(url, body, method = 'POST') {
  return fetch(base + url, body === undefined ? {} : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}
async function waitFor(predicate, milliseconds = 15000) {
  const until = Date.now() + milliseconds;
  while (Date.now() < until) { if (await predicate()) return; await delay(100); }
  throw Error('等待验收条件超时');
}

try {
  await access(path.join(standalone, 'server.js')); await mkdir(output, { recursive: true });
  fake = createServer((request, response) => { void fakeModel(request, response); }).listen(0, '127.0.0.1');
  await once(fake, 'listening');
  const fakePort = fake.address().port;
  child = spawn(process.execPath, [path.join(standalone, 'start.mjs')], {
    cwd: standalone, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, DEPLOY_RUN_PORT: '5185', PORT: '0', HOSTNAME: '127.0.0.1', MODEL_PROVIDER: 'deepseek', MODEL_BASE_URL: `http://127.0.0.1:${fakePort}/v1`, MODEL_NAME: 'fixture', MODEL_API_KEY: 'fixture', NEXT_TELEMETRY_DISABLED: '1' },
  });
  let startup = '';
  child.stdout.on('data', chunk => { startup += chunk; }); child.stderr.on('data', chunk => { startup += chunk; });
  child.on('error', error => { failure = error; });
  await waitFor(async () => { if (failure) throw failure; if (child.exitCode !== null) throw Error('Standalone进程提前结束'); try { return (await fetch(base + '/api/status')).ok; } catch { return false; } }, 30000);
  record('独立standalone进程启动，未使用Vite或Express');

  const htmlResponse = await fetch(base); const html = await htmlResponse.text(); assert.equal(htmlResponse.status, 200);
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => match[1]).filter(url => url.startsWith('/_next/'));
  assert.ok(scripts.length); for (const url of scripts) { const response = await fetch(base + url); assert.equal(response.status, 200); await response.arrayBuffer(); }
  record('根HTML和Next前端JS可访问', { scripts: scripts.length });
  const status = await (await jsonRequest('/api/status')).json(); assert.equal(status.model.name, 'fixture'); assert.equal(status.readyCount, 350);
  const catalog = await (await jsonRequest('/api/catalog')).json();
  ready = catalog.entries.filter(entry => entry.status === 'ready' && entry.preview.type === 'video' && entry.preview.verified); assert.equal(ready.length, 350);
  const sources = await (await jsonRequest('/api/sources')).json(); assert.equal(sources.sources.length, 5);
  const library = await (await jsonRequest('/api/design-library')).json(); assert.ok(library.pages.length && library.components.length);
  const example = await (await jsonRequest('/api/design-library/page/' + library.pages[0].id)).json(); assert.ok(example.html.includes('Content-Security-Policy'));
  const first = ready[0];
  const exported = await (await jsonRequest('/api/export', { brief: 'Next迁移验收', selections: [{ entryId: first.id, stage: first.stage, placement: '主题区域', adjustments: '' }] })).json(); assert.ok(exported.markdown.includes(first.sourceUrl));
  record('状态、350条目录、五个来源、设计范例和导出接口保持可用');
  const invalidJson = await fetch(base + '/api/recommend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' }); assert.equal(invalidJson.status, 400); assert.equal((await invalidJson.json()).code, 'INVALID_JSON');
  const invalidInput = await jsonRequest('/api/recommend', { stage: 'invalid' }); assert.equal(invalidInput.status, 400);
  const unknown = await jsonRequest('/api/not-an-endpoint'); assert.equal(unknown.status, 404); assert.equal((await unknown.json()).code, 'NOT_FOUND');
  record('错误JSON、参数和未知API保留预期状态与错误格式');

  let index = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (index < ready.length) {
      const entry = ready[index++]; assert.ok(entry.preview.url.startsWith('/media/'));
      const response = await fetch(base + entry.preview.url, { headers: { Range: 'bytes=0-31' } });
      assert.equal(response.status, 206, entry.id); assert.match(response.headers.get('content-type'), /^video\//); assert.match(response.headers.get('content-range'), /^bytes 0-31\/\d+$/); assert.equal((await response.arrayBuffer()).byteLength, 32);
    }
  }));
  const head = await fetch(base + first.preview.url, { method: 'HEAD' }); assert.equal(head.status, 200); assert.ok(Number(head.headers.get('content-length')) > 32); assert.equal((await head.arrayBuffer()).byteLength, 0);
  const invalidRange = await fetch(base + first.preview.url, { headers: { Range: 'bytes=999999999999-' } }); assert.equal(invalidRange.status, 416); await invalidRange.arrayBuffer();
  record('全部350条视频Range读取206，HEAD与416正确', { videos: ready.length, concurrency: 6 });

  const response = await jsonRequest('/api/design-prompt/stream', { brief: '制作资料学习工作台，输入问题并查看资料，动效适量', selections: [], conversationId: 'next-standalone-fixture' });
  assert.equal(response.status, 200); assert.match(response.headers.get('content-type'), /text\/event-stream/);
  const reader = response.body.getReader(); const firstChunk = await reader.read(); assert.equal(firstChunk.done, false); assert.equal(finalSent, false, '须在假模型最终完成前收到正文帧');
  let streamed = new TextDecoder().decode(firstChunk.value); for (;;) { const chunk = await reader.read(); if (chunk.done) break; streamed += new TextDecoder().decode(chunk.value); }
  const events = streamed.trim().split(/\r?\n\r?\n/).map(value => JSON.parse(value.replace(/^data:\s*/, '')));
  assert.ok(events.some(event => event.type === 'message'));
  assert.equal(events.at(-1).type, 'result'); assert.equal(events.at(-1).result.referenceEntryIds.length, 1); assert.ok(!streamed.includes(reasoning));
  assert.equal(modelCalls.length, 3); assert.equal(modelCalls[0].preloadedCount, 0);
  record('真实Next SSE经本地假模型搜索→读详情→合成，思考字段未进入UI', { providerRequests: modelCalls.length, model: '本地模拟DeepSeek协议，无付费外调' });
  const cancelResponse = await jsonRequest('/api/design-prompt/stream', { brief: '__CANCEL_FIXTURE__ 验证停止流式生成', selections: [], conversationId: 'next-standalone-cancel' });
  const cancelReader = cancelResponse.body.getReader(); const early = await cancelReader.read(); assert.equal(early.done, false);
  await cancelReader.cancel(); await waitFor(() => cancelledUpstream, 10000);
  record('客户端取消后，Next关闭假模型上游连接');

  browser = await chromium.launch({ headless: true });
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport }); const page = await context.newPage(); const errors = [];
    try {
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', route => route.request().url().startsWith(base + '/') ? route.continue() : route.abort());
      await page.goto(base, { waitUntil: 'networkidle' }); await page.getByRole('button', { name: '工作台', exact: true }).waitFor();
      assert.ok(await page.locator('.candidate-card').count());
      if (viewport.width > 400) for (const provenance of ['source-recording', 'reference-recording', 'original']) {
        const entry = ready.find(item => item.preview.provenance === provenance); assert.ok(entry);
        const video = await page.evaluate(async url => {
          const video = document.createElement('video'); video.muted = true; video.src = url; video.preload = 'auto';
          try { return await new Promise((resolve, reject) => { const timer = setTimeout(() => reject(Error('视频解码超时')), 15000); video.onloadeddata = () => { clearTimeout(timer); resolve({ width: video.videoWidth, duration: video.duration }); }; video.onerror = () => { clearTimeout(timer); reject(Error('视频解码失败')); }; video.load(); }); }
          finally { video.removeAttribute('src'); video.load(); }
        }, entry.preview.url);
        assert.ok(video.width > 0 && video.duration > 0);
      }
      await page.locator('.video-expand').first().click(); await page.getByRole('dialog').waitFor(); assert.equal(await page.getByRole('dialog').locator('video').count(), 1);
      await page.screenshot({ path: path.join(output, `standalone-${viewport.width}.png`), fullPage: false });
      await page.getByRole('button', { name: '关闭', exact: true }).click();
      assert.deepEqual(errors, []);
      record(`${viewport.width}px页面无运行错误、视频放大弹窗可用`, { isolatedBrowserStorage: true, ...(viewport.width > 400 ? { decodedProvenances: 3 } : {}) });
    } finally { await context.close(); }
  }
} catch (error) {
  failure = error; console.error('FAIL ' + (error instanceof Error ? error.message : String(error))); process.exitCode = 1;
} finally {
  await browser?.close();
  if (child && child.exitCode === null) { const exited = once(child, 'exit'); child.kill(); await Promise.race([exited, delay(5000)]); if (child.exitCode === null) child.kill('SIGKILL'); }
  if (fake) { fake.closeAllConnections(); await new Promise(resolve => fake.close(resolve)); }
  await mkdir(output, { recursive: true });
  await writeFile(path.join(output, 'standalone-check.json'), JSON.stringify({ verifiedAt: new Date().toISOString(), success: !failure, boundary: '独立Next生产包+本地假模型协议验收，未验证付费模型或外部部署平台；浏览器存储隔离，fixture选材历史只写standalone目录。', steps, modelCalls, ...(failure ? { error: failure instanceof Error ? failure.message : String(failure) } : {}) }, null, 2));
}
