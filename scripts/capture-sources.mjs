// Record each official component demo; never substitutes a generic animation.
// Requires Playwright Chromium and ffmpeg on PATH. Source failures stay unverified.
import http from 'node:http';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, stat, unlink, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { sourceScrollActions } from './source-scroll-actions.mjs';
import { auditVideo } from './check-video-stability.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const option = name => process.argv.find(arg => arg.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const source = option('source');
const requested = option('ids')?.split(',');
const concurrency = Math.max(1, Math.min(3, Number(option('concurrency') || 1)));
const limit = Number(option('limit') || Infinity);
const retry = process.argv.includes('--retry');
const force = process.argv.includes('--force');
const sourceReplacements = { grid:'grid-and-dot-backgrounds', 'glowing-stars':'glowing-stars-effect', lamp:'lamp-effect', '3d-card':'3d-card-effect', globe:'github-globe', 'shooting-stars':'shooting-stars-and-stars-background', 'stars-background':'shooting-stars-and-stars-background', cover:'container-cover', 'parallax-scroll-2':'parallax-scroll', input:'signup-form' };
const manifestPath = path.join(root, 'data/preview-captures.json');
const output = path.join(root, 'media/sources');
const evidenceDir = path.join(root, 'artifacts/source-captures');
const temporaryDir = path.join(evidenceDir, '.recording');
await Promise.all([output, evidenceDir, temporaryDir].map(dir => mkdir(dir, { recursive: true })));
const entries = JSON.parse(await readFile(path.join(root, 'data/catalog.json'), 'utf8'));
let fpsEntries={};
try{fpsEntries=JSON.parse(await readFile(path.join(root,'data/enrichment/60fps.zh.json'),'utf8')).entries || {};}catch{}
let manifest;
try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); }
catch { manifest = { version: 1, captures: [], failures: [] }; }
const captures = new Map(manifest.captures.map(item => [item.entryId, item]));
const failures = new Map(manifest.failures.map(item => [item.entryId, item]));
// A former second variant is not the same case as today's first demo.
for (const [id, item] of captures) if (item.sourceUrl.endsWith('/parallax-scroll-2') && item.demoSelector === '.preview') {
 captures.delete(id); failures.set(id, {entryId:id,sourceUrl:item.sourceUrl,failedAt:new Date().toISOString(),reason:'当前官方页只有首个 Parallax Scroll 演示，无法验证旧第二变体'});
}
let saveQueue = Promise.resolve();
function save() {
 saveQueue = saveQueue.then(async () => {
  const state = { version: 1, updatedAt: new Date().toISOString(), captures: [...captures.values()], failures: [...failures.values()] };
  const temporary = `${manifestPath}.tmp`;
  await writeFile(temporary, JSON.stringify(state, null, 2) + '\n');
  await rename(temporary, manifestPath);
  await writeFile(path.join(evidenceDir, 'report.json'), JSON.stringify({ updatedAt: state.updatedAt, verified: state.captures.filter(capture=>capture.verified).length, failed: state.failures.length, failures: state.failures }, null, 2) + '\n');
 });
 return saveQueue;
}
function exec(program, args, binary = false) {
 return new Promise((resolve, reject) => {
  const child = spawn(program, args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  const out = [], errors = []; child.stdout.on('data', value => out.push(value)); child.stderr.on('data', value => errors.push(value));
  child.on('error', reject); child.on('close', code => code === 0 ? resolve(binary ? Buffer.concat(out) : Buffer.concat(out).toString()) : reject(new Error(`${program}: ${Buffer.concat(errors).toString().slice(-1400)}`)));
 });
}
await exec('ffmpeg', ['-version']);
const queue = entries.filter(entry => (!entry.preview?.verified || (force && entry.preview?.provenance !== 'reference-recording')) && ['reactbits', 'aceternity', '60fps'].includes(entry.sourceId)
 && (!source || entry.sourceId === source) && (!requested || requested.includes(entry.id))
 && (!captures.has(entry.id) || force) && (retry || !failures.has(entry.id))).slice(0, limit);
const server = http.createServer(async (req, res) => {
 const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
 if (pathname === '/') { res.writeHead(200, {'Content-Type':'text/html'}); res.end('<!doctype html><title>Local video decode check</title>'); return; }
 const file = path.resolve(root, `.${pathname}`);
 if (!file.startsWith(output + path.sep)) { res.writeHead(403); res.end(); return; }
 try { const data = await readFile(file); res.writeHead(200, { 'Content-Type': file.endsWith('.webm') ? 'video/webm' : 'image/png', 'Content-Length': data.length }); res.end(data); }
 catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, channel: 'chromium', args: ['--enable-gpu','--autoplay-policy=no-user-gesture-required','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'] });

async function locateDemo(page, entry) {
 if (entry.sourceId === 'reactbits') {
  // The current official page presents a first-visit update modal.
  await page.keyboard.press('Escape');
  const close = page.locator('button[aria-label*="Close" i], button[aria-label*="Dismiss" i]');
  for (const button of await close.all()) if (await button.isVisible()) await button.click({ timeout: 2000 }).catch(() => {});
  return { locator: page.locator('.preview-panel .demo-container').first(), selector: '.preview-panel .demo-container' };
 }
 if (entry.sourceId === 'aceternity') {
  if (entry.sourceUrl.endsWith('/parallax-scroll-2')) {
   if (await page.locator('.preview').count() < 2) throw new Error('当前官方页只有首个 Parallax Scroll 演示，无法验证旧第二变体');
   return {locator:page.locator('.preview').nth(1),selector:'.preview:nth-match(2)'};
  }
  return { locator: page.locator('.preview').first(), selector: '.preview' };
 }
 return { locator: page.locator('video').first(), selector: 'video' };
}
async function microActions(page, demo, entry, evidence) {
 if (!entry.sourceUrl.includes('/micro/')) return;
 const slug=new URL(entry.sourceUrl).pathname.split('/').pop();
 const control=async selector=>{
  const el=demo.locator(selector).first();if(!await el.count() || !await el.isVisible()) throw new Error(`微交互实际控件未找到: ${slug} ${selector}`);
  return el;
 };
 const point=async selector=>{const el=await control(selector);const box=await el.boundingBox();return {...box,el};};
 const drag=async(selector,xFraction,yFraction,endX,endY,hold=0)=>{
  const b=await point(selector);await page.mouse.move(b.x+b.width*xFraction,b.y+b.height*yFraction);await page.mouse.down();
  if(hold) await page.waitForTimeout(hold);
  await page.mouse.move(typeof endX==='function'?endX(b):b.x+b.width*xFraction+endX,typeof endY==='function'?endY(b):b.y+b.height*yFraction+endY,{steps:28});await page.mouse.up();await page.waitForTimeout(650);
 };
 switch(slug) {
  case 'hold-button': case 'voice-pill': {
   const b=await point(slug==='hold-button'?'.hold-button':'[aria-label="Dictate"]');
   await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.waitForTimeout(slug==='hold-button'?2300:1800);await page.mouse.up();await page.waitForTimeout(550);
   evidence.actions.push(slug==='hold-button'?'在真实 Hold Button 按住2.3秒，等待完成后松开':'按住原站 Dictate 1.8秒查看模拟音量和计时，再松开；没有读取用户麦克风');break;
  }
  case 'slide-commit':
   await drag('.slide-commit__capsule',0.075,0.5,b=>b.x+b.width-10,0);await page.waitForTimeout(900);evidence.actions.push('从真实 Slide Commit 左端拖到右端，显示原站示例 Paid 完成状态；没有实际支付');break;
  case 'swipe-row':
   await drag('.swipe-row__surface',0.55,0.5,-135,0);evidence.actions.push('将原站示例行向左拖135px，展开操作区域；没有点击删除');break;
  case 'swipe-toast': {
   const show=await demo.getByRole('button',{name:'Show toast',exact:true}).boundingBox();await page.mouse.click(show.x+show.width/2,show.y+show.height/2);await page.waitForTimeout(450);
   const toast=demo.locator('.swipe-toast__card').last();const hovered=await toast.boundingBox();await page.mouse.move(hovered.x+hovered.width/2,hovered.y+hovered.height/2);await page.waitForTimeout(600);
   evidence.posterElapsedMs=Date.now()-evidence.recordingStartedAt;
   evidence.posterMoment='通知出现并悬停暂停时的真实原站画面';
   const b=await toast.locator('.swipe-toast__body').boundingBox();const x=b.x+20,y=b.y+12;
   await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x,y+5);await page.waitForTimeout(50);
   for(let i=1;i<=10;i++){await page.mouse.move(x,y+5+i*10);await page.waitForTimeout(20);}await page.mouse.up();await page.waitForTimeout(700);
   const remaining=demo.locator('.swipe-toast');evidence.swipeToastResult={remaining:await remaining.count(),phase:await remaining.count()?await remaining.last().getAttribute('data-phase'):'removed'};
   if(evidence.swipeToastResult.remaining && evidence.swipeToastResult.phase!=='gone') throw new Error('原站 Swipe Toast 下拖后未进入关闭状态');
   evidence.actions.push('点击 Show toast，悬停暂停倒计时，从正文先下移5px建立抓取，再分步下拖100px；验证通知飞出淡出关闭');break;
  }
  case 'wake-slider':
   await drag('.wake-slider__track',0.1,0.5,b=>b.x+b.width*0.88,0);evidence.actions.push('将真实 Wake Slider 从左拖到右，松开看尾波平复');break;
  case 'scrub-field':
   await drag('.scrub-field__handle',0.5,0.5,120,0);evidence.actions.push('横向拖动真实数值芯片120px并松开，观察数值变化');break;
  case 'rubber-segment': {
   const items=demo.locator('button.rubber-segment__item');await items.nth(1).click();await page.waitForTimeout(400);await items.last().click();await page.waitForTimeout(500);
   const last=await items.last().boundingBox();await drag('.rubber-segment__thumb',0.5,0.5,()=>last.x+last.width/2,()=>last.y+last.height/2);evidence.actions.push('切换两个真实分段，再拖动伸缩选中条');break;
  }
  case 'glide-select': {
   const combo=demo.getByRole('combobox',{name:'Export format'});if(await combo.getAttribute('aria-expanded')!=='true') await combo.click();
   const options=page.locator('.glide-select__option');for(const el of await options.all()){await el.hover();await page.waitForTimeout(220);}await options.last().click();await page.waitForTimeout(500);
   evidence.actions.push('展开真实 Export format 下拉框，悬停多项并选择一项');break;
  }
  case 'code-slots': {
   const input=await control('input[aria-label="One-time code"]');await input.fill('');
   for(const digit of '123456'){await input.focus();await page.keyboard.press(digit);await page.waitForTimeout(220);}await page.waitForTimeout(700);
   evidence.actions.push('在真实验证码输入逐格键入合成演示码123456并等待完成动画；没有提交表单');break;
  }
  case 'paper-crumple':
   await drag('.paper-crumple-hit',0.5,0.5,150,20,1000);await page.waitForTimeout(1000);evidence.actions.push('按住真实纸张1秒并拖动150px，松开查看揉皱纸团');break;
  case 'shredder': {
   const slot=await point('.shredder__slit');await drag('.shredder__item',0.5,0.5,()=>slot.x+slot.width/2,()=>slot.y+slot.height/2);await page.waitForTimeout(1800);evidence.actions.push('将原站示例纸条拖入底部碎纸槽，等待碎纸落下');break;
  }
  case 'sling-button':
   await drag('.sling-button__pad',0.5,0.5,-105,-20);await page.waitForTimeout(600);evidence.actions.push('将原站示例弹弓按钮拉105px再松开，显示本地示例动画；没有真实发送');break;
  case 'tear-ticket': {
   const b=await point('.tear-ticket__stub');const x=b.x+b.width/2,y=b.y+b.height/2;
   await page.mouse.move(x,y);await page.mouse.down();await page.waitForTimeout(80);await page.mouse.move(x+250,y,{steps:16});await page.waitForTimeout(150);await page.mouse.up();await page.waitForTimeout(1000);
   evidence.tearTicketResult=await demo.locator('.tear-ticket__piece--stub').evaluate(el=>({visibility:getComputedStyle(el).visibility,opacity:Number(getComputedStyle(el).opacity),transform:el.style.transform}));
   if(evidence.tearTicketResult.visibility!=='hidden' && evidence.tearTicketResult.opacity>0.1) throw new Error('原站 Tear Ticket 票根未撕下淡出');
   evidence.actions.push('从真实票根视觉中心向右拖250px，松开后验证票根飞出、淡出隐藏');break;
  }
  case 'slosh-gauge':
   await demo.getByRole('button',{name:'Empty',exact:true}).click();await page.waitForTimeout(700);await demo.getByRole('button',{name:'Full',exact:true}).click();await page.waitForTimeout(1300);evidence.actions.push('依次点击示例 Empty 和 Full，查看液体波动与液位变化');break;
  case 'call-chip': case 'refine-frame': case 'thought-line': {
   const replay=demo.locator('button[aria-label*="refresh" i],button[aria-label*="replay" i]');if(await replay.count()) await replay.first().click();
   await page.waitForTimeout(slug==='thought-line'?5500:4500);evidence.actions.push('重播原站示例的多阶段生命周期，录到完成状态');break;
  }
  case 'comet-dial': {
   const b=await point('[role="slider"]');const cx=b.x+b.width/2,cy=b.y+b.height/2,r=Math.min(b.width,b.height)*0.4;
   await page.mouse.move(cx+r,cy);await page.mouse.down();for(let i=1;i<=20;i++){const a=i*Math.PI/20;await page.mouse.move(cx+r*Math.cos(a),cy+r*Math.sin(a));await page.waitForTimeout(35);}await page.mouse.up();await page.waitForTimeout(800);evidence.actions.push('按住真实旋钮外圈沿圆弧拖动，松开查看彗星尾迹');break;
  }
  case 'fuse-button': {
   const undo=demo.locator('.fuse-button__undo');
   if(await undo.getAttribute('inert')===null){await undo.click();await page.waitForTimeout(300);}
   await (await control('.fuse-button__idle')).click();await page.waitForTimeout(1100);await undo.click();await page.waitForTimeout(400);
   await (await control('.fuse-button__idle')).click();await page.waitForTimeout(4200);
   evidence.actions.push('点示例 Archive，等待燃线后 Undo，再重做并录到 Archived；只操作原站本地演示');break;
  }
  case 'warm-tooltip': {
   const targets=demo.locator('.warm-tooltip__trigger button');
   for(let i=0;i<3;i++){await targets.nth(i).hover();await page.waitForTimeout(i===0?1100:400);}
   evidence.actions.push('先悬停等待第一个提示，再连续悬停相邻两个目标查看热启动提示');break;
  }
  case 'peek-rating': {
   const stars=demo.locator('.peek-rating__star');for(const star of await stars.all()){await star.hover();await page.waitForTimeout(280);}await stars.nth(3).click();await page.waitForTimeout(500);
   evidence.actions.push('横向悬停真实五颗星并选择第四颗，展示提示与选中状态');break;
  }
  case 'branched-menu': {
   const head=demo.locator('.branched-menu__head').first();if(await head.getAttribute('aria-expanded')==='true'){await head.click();await page.waitForTimeout(350);}await head.click();await page.waitForTimeout(450);
   await demo.locator('.branched-menu__item').nth(2).click();await page.waitForTimeout(700);evidence.actions.push('折叠并展开真实分组，选择另一个子项查看树枝路径高亮');break;
  }
  case 'prompt-bar': {
   const input=await control('textarea[aria-label="Prompt"]');await input.fill('Show visual ideas');await page.waitForTimeout(400);await input.fill('@');await page.waitForTimeout(700);
   await input.fill('/');await page.waitForTimeout(900);evidence.actions.push('输入合成文字显示发送按钮状态，再输入 @ 和 / 展开来源及命令菜单；没有发送');break;
  }
  case 'lattice-loader': {
   const status=page.locator('button[aria-label="Status"]');const b=await status.boundingBox();await page.mouse.click(b.x+b.width/2,b.y+b.height/2);await page.waitForTimeout(300);
   const done=page.getByRole('button',{name:'Done',exact:true});const d=await done.boundingBox();await page.mouse.click(d.x+d.width/2,d.y+d.height/2);await page.waitForTimeout(1200);
   if(await demo.locator('.lattice-loader').getAttribute('data-status')!=='done') throw new Error('原站 Lattice Loader 状态未切换到 Done');
   evidence.actions.push('在原站 Customizer 将 Status 从 Working 切为 Done，展示方格加载器转为勾号');break;
  }
 }
}
async function scrollActions(page,demo,entry,evidence) {
 if(!/\/(scroll-float|scroll-stack)$/.test(entry.sourceUrl)) return false;
 const scroller=await demo.evaluateHandle(el=>[el,...el.querySelectorAll('*')].find(node=>node.scrollHeight>node.clientHeight+100 && /auto|scroll/.test(getComputedStyle(node).overflowY)));
 const before=await scroller.evaluate(el=>({height:el.clientHeight,scrollHeight:el.scrollHeight}));
 const points=entry.sourceUrl.endsWith('/scroll-float')?[340,440,520,570]:[250,500,800,1100,1400];
 for(const top of points){await scroller.evaluate((el,top)=>el.scrollTo({top,behavior:'smooth'}),top);await page.waitForTimeout(500);}
 await page.waitForTimeout(700);
 evidence.scroll={...before,top:await scroller.evaluate(el=>el.scrollTop)};
 evidence.actions.push('定位原站内部滚动区域，分步滚动至效果完成位置；不滚动外层文档页');
 await scroller.dispose();return true;
}
async function capture(entry, workerId) {
 const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, recordVideo: { dir: temporaryDir, size: { width: 1440, height: 1000 } }, colorScheme: 'dark' });
 const page = await context.newPage();
 const pageErrors = [], requestFailures = [], consoleErrors=[];
 page.on('pageerror', error => pageErrors.push(error.message));
 page.on('console',message=>{if(message.type()==='error' && consoleErrors.length<20) consoleErrors.push(message.text());});
 page.on('requestfailed', request => { if (requestFailures.length < 20) requestFailures.push({ url: request.url(), error: request.failure()?.errorText }); });
 const replacement = entry.sourceId === 'aceternity' && sourceReplacements[new URL(entry.sourceUrl).pathname.split('/').pop()];
 const resolvedSourceUrl = replacement ? `https://ui.aceternity.com/components/${replacement}` : entry.sourceUrl;
 const evidence = { entryId: entry.id, sourceUrl: entry.sourceUrl, resolvedSourceUrl, capturedAt: new Date().toISOString(), actions: [], pageErrors, requestFailures, consoleErrors };
 let originalMediaPath;
 try {
  const response = await page.goto(resolvedSourceUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  evidence.http = { status: response?.status(), finalUrl: page.url(), contentType: response?.headers()['content-type'] };
  if (!response?.ok()) throw new Error(`来源页面 HTTP ${response?.status()}`);
  await page.waitForTimeout(2200);
  evidence.title = await page.title();
  evidence.heading = await page.locator('h1').first().textContent().catch(() => '');
  if (/404|not found|access denied|verify you are human/i.test(`${evidence.title} ${evidence.heading}`)) throw new Error('来源页面不可用或要求访问验证');
  const { locator, selector } = await locateDemo(page, entry); evidence.demoSelector = selector;
  await locator.waitFor({ state: 'visible', timeout: 15000 });
  if(/\/(shape-waves|aero-shards)$/.test(entry.sourceUrl)) {
   evidence.webgpu=await page.evaluate(async()=>({supported:!!navigator.gpu,adapterAvailable:!!await navigator.gpu?.requestAdapter()}));
   if(!evidence.webgpu.adapterAvailable) throw new Error('原站需要 WebGPU，但当前 Chromium requestAdapter() 返回 null；核心 canvas 未绘制');
   await locator.locator('[data-ready="true"]').waitFor({state:'visible',timeout:15000});await page.waitForTimeout(700);
   evidence.actions.push('验证原站 WebGPU adapter 可用并等待 data-ready=true 后录制');
  }
  await locator.scrollIntoViewIfNeeded();
  await locator.evaluate(el => { window.scrollBy(0, el.getBoundingClientRect().top - 100); });
  await page.waitForTimeout(800);
  const details = await locator.evaluate((el, sourceId) => {
   const box = el.getBoundingClientRect();
   const child=el.firstElementChild, childBox=child?.getBoundingClientRect();
   const tightContent=sourceId==='aceternity' && child?.tagName==='DIV' && getComputedStyle(child).position!=='absolute'
    && !child.className.includes('refresh') && childBox && childBox.x>=box.x && childBox.y>=box.y && childBox.right<=box.right && childBox.bottom<=box.bottom;
   return { text: el.textContent?.trim().slice(0,1200), htmlLength: el.innerHTML.length, children: el.childElementCount, canvases: el.querySelectorAll('canvas').length,
    images: [...el.querySelectorAll('img')].map(img => ({ src: img.currentSrc, loaded: img.complete && img.naturalWidth > 0 })), rect: { x: box.x, y: box.y, width: box.width, height: box.height },
    permissionMedia: !!el.querySelector('input[type=file]') || /webcam|camera access/i.test(el.textContent || ''),
    contentRect: tightContent && childBox.width>20 && childBox.height>20 && childBox.width<box.width*0.6 && childBox.height<box.height*0.7 ? {x:childBox.x,y:childBox.y,width:childBox.width,height:childBox.height} : null };
  },entry.sourceId); evidence.demo = details;
  if (details.htmlLength < 50 || details.rect.width < 100 || details.rect.height < 100) throw new Error('真实演示区域为空或尺寸不足');
  if (/failed to load|something went wrong|buy to access|coming soon/i.test(details.text || '') || (/upgrade to pro/i.test(details.text || '') && !details.canvases)) throw new Error('来源 demo 为错误或付费占位提示');
  if (details.images.length && details.images.every(img => !img.loaded)) throw new Error('演示的图片素材未加载');
  const upload = locator.locator('input[type=file]');
  const syntheticCamera = /webcam|camera/i.test(`${entry.name} ${details.text || ''}`);
  if (details.permissionMedia && !await upload.count() && !syntheticCamera) throw new Error('演示需要用户素材或权限，不能自动证明效果');
  if (syntheticCamera) evidence.actions.push('摄像头使用 Chromium 合成测试图案；没有读取用户摄像头');
  if (details.canvases && pageErrors.some(error=>/webgl.*(fail|error|not supported)|error creating.*renderer|shader.*(fail|error)/i.test(error))) throw new Error('原站 WebGL 演示渲染失败');
  const rect = details.rect;
  const clip = { x: Math.max(0,Math.floor(rect.x)), y: Math.max(0,Math.floor(rect.y)), width: Math.min(Math.floor(rect.width),1440-Math.max(0,Math.floor(rect.x))), height: Math.min(Math.floor(rect.height),1000-Math.max(0,Math.floor(rect.y))) };
  if (clip.height > 700) clip.height = 700;
  if (details.contentRect) {
   const content=details.contentRect;
   clip.x=Math.max(Math.floor(rect.x),Math.floor(content.x-80));clip.y=Math.max(Math.floor(rect.y),Math.floor(content.y-80));
   clip.width=Math.min(Math.max(320,Math.floor(content.width+160)),Math.floor(rect.x+rect.width)-clip.x,1440-clip.x);clip.height=Math.min(Math.max(220,Math.floor(content.height+160)),Math.floor(rect.y+rect.height)-clip.y,1000-clip.y);
   evidence.actions.push('裁切到实际小型组件及周围留白，保持来源 DOM 与样式');
  }
  clip.width -= clip.width % 2; clip.height -= clip.height % 2;
  evidence.clip = clip;
  if (entry.sourceId === '60fps') {
   await locator.evaluate(async video => { video.muted = true; video.currentTime = 0; await video.play(); }); evidence.actions.push('原站视频静音播放');
   const media=await locator.evaluate(video=>({url:video.currentSrc,width:video.videoWidth,height:video.videoHeight,duration:video.duration,readyState:video.readyState}));
   if(!/^https:\/\//.test(media.url) || media.readyState<2 || !media.width || !media.height) throw new Error('原站公开视频素材尚未加载或没有公开HTTPS素材地址');
   const expected=fpsEntries[entry.sourceUrl];
   const videoObjects=await page.locator('script[type="application/ld+json"]').evaluateAll(scripts=>{
    const found=[];const visit=value=>{if(!value || typeof value!=='object')return;if(value['@type']==='VideoObject' || value['@type']?.includes?.('VideoObject'))found.push({name:value.name,url:value.contentUrl});for(const child of Object.values(value))if(child && typeof child==='object')Array.isArray(child)?child.forEach(visit):visit(child);};
    for(const script of scripts){try{visit(JSON.parse(script.textContent));}catch{}}return found;
   });
   const primaryName=expected?.evidence?.primaryVideoName || entry.name;
   const primary=videoObjects.find(video=>video.name===primaryName);
   const sameAsset=(a,b)=>{if(!a || !b)return false;const x=new URL(a),y=new URL(b);return x.origin===y.origin && x.pathname===y.pathname;};
   if(evidence.heading?.trim()!==primaryName || !primary || !sameAsset(media.url,primary.url) || (expected && !sameAsset(media.url,expected.videoUrl))) throw new Error('原站视频与当前案例标题、主 VideoObject 或资料素材地址不一致');
   evidence.mediaBinding={primaryVideoName:primaryName,pageVideoObject:primary,enrichmentVideoUrl:expected?.videoUrl || null,matched:true};
   const asset=await context.request.get(media.url,{timeout:45000});
   if(!asset.ok()) throw new Error(`原站视频素材 HTTP ${asset.status()}`);
   const buffer=await asset.body();if(buffer.length<5000) throw new Error('原站视频素材文件异常小');
   originalMediaPath=path.join(temporaryDir,`${entry.id}-original.mp4`);await writeFile(originalMediaPath,buffer);
   evidence.originalMedia={...media,httpStatus:asset.status(),contentType:asset.headers()['content-type'],bytes:buffer.length,sha256:createHash('sha256').update(buffer).digest('hex')};
   evidence.actions.push('保存原站完整公开视频素材，保留完整时长和原始帧比例并本地转码');
  }
  const started = Date.now();
  evidence.recordingStartedAt=started;
  const refresh = locator.locator('button[aria-label*="refresh" i], button[aria-label*="replay" i]');
  if (await refresh.count()) { await refresh.first().click(); evidence.actions.push('点击原站重播动画'); }
  const documentScroll=await sourceScrollActions(page,locator,entry,evidence);
  if (!documentScroll) {
  if (await upload.count()) {
   await upload.first().setInputFiles({name:'visual-intent-demo.txt',mimeType:'text/plain',buffer:Buffer.from('Visual Intent Studio demo file. Synthetic content for preview capture only.\n')});
   evidence.actions.push('演示上传合成测试文本文件 visual-intent-demo.txt；没有读取用户文件');
  }
  const px = [0.23,0.75,0.78,0.25,0.5], py = [0.35,0.37,0.73,0.7,0.5];
  for (let i = 0; i < px.length; i++) {
   await page.mouse.move(clip.x + clip.width*px[i], clip.y + clip.height*py[i], {steps:20});
   await page.waitForTimeout(330);
  }
  evidence.actions.push('鼠标在演示区域横向、纵向悬停');
  if (/click spark|ripple|click effect/i.test(entry.name)) {
   for (const [x,y] of [[0.3,0.4],[0.65,0.55],[0.45,0.65]]) {
    await page.mouse.click(clip.x+clip.width*x,clip.y+clip.height*y);await page.waitForTimeout(350);
   }
   evidence.actions.push('点击真实演示面板三个位置，触发点击火花或波纹');
  }
  const interactive = locator.locator('button:not([aria-label*="refresh" i]), input:not([type=file]):not([type=hidden]), a, img, svg');
  let hovered=0;
  for (const control of await interactive.all()) {
   if (hovered>=4) break;
   if (await control.isVisible()) {
    const bounds=await control.boundingBox();
    if(bounds && bounds.x>=clip.x && bounds.y>=clip.y && bounds.x+bounds.width<=clip.x+clip.width && bounds.y+bounds.height<=clip.y+clip.height) {
     await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2,{steps:14});await page.waitForTimeout(350);hovered++;
    }
   }
  }
  if (hovered) evidence.actions.push(`按真实元素边界悬停 ${hovered} 个按钮、输入、链接或图片`);
  if(entry.sourceUrl.endsWith('/gooey-input')) {
   const b=await locator.locator('button').first().boundingBox();await page.mouse.click(b.x+b.width/2,b.y+b.height/2);await page.waitForTimeout(750);
   evidence.actions.push('点击真实 Gooey Input 搜索胶囊，展开并启用输入框');
  }
  const textInput=locator.locator('input[type=text],input[type=search],input[type=email],input[type=tel],input[type=number],input:not([type])');
  if (!entry.sourceUrl.includes('/micro/') && await textInput.count() && await textInput.first().isVisible() && await textInput.first().isEnabled()) {
   const input=textInput.first(), type=await input.getAttribute('type'), max=await input.getAttribute('maxlength');
   const value=max==='1'?'1':type==='email'?'demo@example.test':type==='tel'?'123456':type==='number'?'42':'Visual ideas';
   await input.fill(value);evidence.actions.push(`在原站演示输入框填入测试文字 ${value}；没有提交`);await page.waitForTimeout(500);
  }
  const safeButtons = locator.locator('button');
  const names = [];
  const scriptedMicro=entry.sourceUrl.includes('/micro/') && !/\/(bell-toggle|dodge-field|flip-card|folder-float|jelly-radio|pulse-heart|spring-check|squish-switch|status-mark)$/.test(entry.sourceUrl);
  for (const button of await safeButtons.all()) {
   const label = ((await button.textContent()) || '').trim() || ((await button.getAttribute('aria-label')) || '').trim();
   const b=await button.boundingBox();
   const inside=b && b.x>=clip.x && b.y>=clip.y && b.x+b.width<=clip.x+clip.width && b.y+b.height<=clip.y+clip.height;
   if (!scriptedMicro && inside && label && !/copy|source|install|download|upload|refresh|replay|checkout|buy|sign|subscribe|delete|submit|contact|get started|learn more|github|share|send|pay/i.test(label) && await button.isVisible()) {
    await page.mouse.click(b.x+b.width/2,b.y+b.height/2); names.push(label.slice(0,60)); break;
   }
  }
  if (names.length) { evidence.actions.push(`点击演示控件: ${names.join(', ')}`); await page.waitForTimeout(500); }
  if(entry.sourceUrl.endsWith('/card-nav')) {
   const menu=locator.locator('.hamburger-menu[role="button"]');const b=await menu.boundingBox();await page.mouse.click(b.x+b.width/2,b.y+b.height/2);await page.waitForTimeout(1000);
   if(await menu.getAttribute('aria-expanded')!=='true') throw new Error('Card Nav 真实菜单未展开');
   evidence.actions.push('点击真实 hamburger-menu 展开三组卡片导航，验证 aria-expanded=true');
  }
  await microActions(page,locator,entry,evidence);
  const internalScroll=await scrollActions(page,locator,entry,evidence);
  const afterActions=await locator.boundingBox();
  if(afterActions && (Math.abs(afterActions.y-rect.y)>2 || Math.abs(afterActions.x-rect.x)>2)) {
   await locator.evaluate((el,initialY)=>window.scrollBy(0,el.getBoundingClientRect().top-initialY),rect.y);await page.waitForTimeout(250);
   evidence.actions.push('操作后核对演示边界，恢复页面滚动以保持录像画幅位于真实demo');
  }
  if (/gooey nav|pill nav|staggered menu|chroma grid/i.test(entry.name)) {
   const links=locator.locator('a');
   if (await links.count()>1 && await links.nth(1).isVisible()) {
    await links.nth(1).evaluate(el=>el.addEventListener('click',event=>event.preventDefault(),{once:true}));
    await links.nth(1).click();evidence.actions.push('点击原站演示导航项目；取消默认页面跳转以保留组件演示');await page.waitForTimeout(500);
   }
  }
  if (/click spark|ripple|click effect/i.test(entry.name)) {
   await page.mouse.click(clip.x+clip.width*0.5,clip.y+clip.height*0.5);await page.waitForTimeout(120);
  }
  if (!internalScroll && /scroll|parallax|stack|timeline/i.test(`${entry.name} ${entry.sourceUrl}`)) {
   await page.mouse.move(clip.x+clip.width/2,clip.y+clip.height/2);
   for (let i=0;i<3;i++) { await page.mouse.wheel(0,100); await page.waitForTimeout(350); }
   await page.mouse.wheel(0,-150); evidence.actions.push('在原站演示区域滚动');
  }
  }
  await page.mouse.move(clip.x+clip.width*0.3,clip.y+clip.height*0.4,{steps:20});
  await page.waitForTimeout(Math.max(1000,7500-(Date.now()-started)));
  const recordedSeconds=(Date.now()-started)/1000;
  const initialUrl=new URL(evidence.http.finalUrl),finalUrl=new URL(page.url());
  if (finalUrl.origin!==initialUrl.origin || finalUrl.pathname!==initialUrl.pathname) throw new Error('点击导致离开当前组件演示页');
  if(page.url()!==evidence.http.finalUrl){evidence.interactionUrl=page.url();evidence.actions.push('原站演示参数写入 URL 查询串，保留同一组件页面');}
  const video = page.video(); await context.close();
  let raw = await video.path();
  if(originalMediaPath){await unlink(raw);raw=originalMediaPath;}
  const duration = Number((await exec('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',raw])).trim());
  const destination = path.join(output,`${entry.id}.new.webm`);
  const poster = path.join(output,`${entry.id}.new.png`);
  const resize='scale=960:600:force_original_aspect_ratio=decrease,pad=960:600:(ow-iw)/2:(oh-ih)/2:color=0x0b0d12,setsar=1';
  if(originalMediaPath){
   await exec('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss',String(Math.min(1,duration*0.5)),'-i',raw,'-frames:v','1','-vf',resize,poster]);
   await exec('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',raw,'-vf',resize,'-an','-c:v','libvpx','-deadline','realtime','-cpu-used','8','-b:v','700k',destination]);
  }else {
   evidence.segment={start:Math.max(0,duration-recordedSeconds),duration:recordedSeconds,posterTime:Math.min(recordedSeconds-0.2,(evidence.posterElapsedMs ?? (recordedSeconds-1)*1000)/1000)};
   await exec('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss',String(evidence.segment.start),'-i',raw,'-t',String(recordedSeconds),'-vf',`crop=${clip.width}:${clip.height}:${clip.x}:${clip.y},${resize}`,'-an','-c:v','libvpx','-deadline','realtime','-cpu-used','8','-b:v','700k',destination]);
   // Browser screenshots during recording resize the screencast. Extract only after it closes.
   await exec('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss',String(evidence.segment.posterTime),'-i',destination,'-frames:v','1',poster]);
   evidence.stability=await auditVideo(destination);
   if (!evidence.stability.passed) throw new Error('录像包含异常灰色填充或画幅缩放: '+JSON.stringify(evidence.stability));
  }
  await unlink(raw);
  const check = await browser.newPage(); await check.goto(base);
  const playback = await check.evaluate(async ({url,clip}) => {
   const video = document.createElement('video'); video.src=url;document.body.append(video);
   video.muted=true; await new Promise((resolve,reject)=> { if (video.readyState>=2) resolve(); else { video.onloadeddata=resolve;video.onerror=()=>reject(new Error('Video decode failed'));setTimeout(()=>reject(new Error('Decode timeout')),15000); } });
   await video.play(); await new Promise(resolve=>setTimeout(resolve,1000));
   const canvas=document.createElement('canvas');canvas.width=960;canvas.height=600;const ctx=canvas.getContext('2d');
   const scale=Math.min(960/clip.width,600/clip.height),w=clip.width*scale,h=clip.height*scale;
   ctx.drawImage(video,(960-w)/2,(600-h)/2,w,h,0,0,960,600);
   const data=ctx.getImageData(0,0,960,600).data;let sum=0,sum2=0;
   for(let i=0;i<data.length;i+=4){const light=(data[i]+data[i+1]+data[i+2])/3;sum+=light;sum2+=light*light;}
   const count=data.length/4, mean=sum/count;
   return {duration:video.duration,width:video.videoWidth,height:video.videoHeight,currentTime:video.currentTime,readyState:video.readyState,frameDeviation:Math.sqrt(sum2/count-mean*mean)};
  },{url:base+'/media/sources/'+entry.id+'.new.webm',clip:originalMediaPath?evidence.originalMedia:clip}); await check.close();
  evidence.playback=playback;
  const durationValid=originalMediaPath?playback.duration>0 && Math.abs(playback.duration-duration)<0.2:playback.duration>=6 && Math.abs(playback.duration-recordedSeconds)<0.25;
  if (!(durationValid && playback.width===960 && playback.height===600 && playback.currentTime>0.25 && playback.frameDeviation>1)) throw new Error('录屏时长、画面或原生视频解码检查未通过: '+JSON.stringify(playback));
  const bytes=(await stat(destination)).size;
  if (bytes<5000) throw new Error('录屏文件异常小');
  evidence.playback=playback;evidence.bytes=bytes;evidence.verified=true;
  evidence.videoSha256=createHash('sha256').update(await readFile(destination)).digest('hex');
  await rename(destination,path.join(output,`${entry.id}.webm`));
  await rename(poster,path.join(output,`${entry.id}.png`));
  await writeFile(path.join(evidenceDir,`${entry.id}.json`),JSON.stringify(evidence,null,2)+'\n');
  captures.set(entry.id,{entryId:entry.id,sourceUrl:entry.sourceUrl,resolvedSourceUrl,type:'video',url:`/media/sources/${entry.id}.webm`,poster:`/media/sources/${entry.id}.png`,verified:true,provenance:originalMediaPath?'original':'source-recording',note:(originalMediaPath?'保存原站公开视频素材并本地转码，保留完整原始帧比例；素材地址、HTTP和摘要见采集证据。':/\/(input|label)$/.test(entry.sourceUrl)?'在原站 SignupForm 中录制 Input/Label 表单组件；原独立文档页已失效。':'在来源网站真实组件演示区域录制；画面裁切和交互操作见采集证据。')+(syntheticCamera?' 摄像头演示使用 Chromium 合成测试图案，未读取用户摄像头。':''),capturedAt:evidence.capturedAt,demoSelector:evidence.demoSelector,actions:evidence.actions,evidence:`artifacts/source-captures/${entry.id}.json`,playback,bytes});
  failures.delete(entry.id);await save();
  console.log(`[${workerId}] OK ${entry.sourceId} ${entry.name} ${playback.duration.toFixed(2)}s ${bytes}`);
 } catch(error) {
  if (!page.isClosed()) await page.screenshot({path:path.join(evidenceDir,`${entry.id}-failed.png`)}).catch(()=>{});
  await context.close().catch(()=>{});
  const failed={entryId:entry.id,sourceUrl:entry.sourceUrl,failedAt:new Date().toISOString(),reason:error.message,http:evidence.http};
  if(force) captures.delete(entry.id);
  failures.set(entry.id,failed);await writeFile(path.join(evidenceDir,`${entry.id}-failed.json`),JSON.stringify({...evidence,...failed},null,2)+'\n');await save();
  console.log(`[${workerId}] FAIL ${entry.sourceId} ${entry.name}: ${error.message}`);
 }
}
try {
 console.log(`Capturing ${queue.length} entries with ${concurrency} workers; completed recordings and previous failures are skipped.`);
 let next=0;
 await Promise.all(Array.from({length:concurrency},(_,index)=>(async()=>{while(next<queue.length){const entry=queue[next++];await capture(entry,index+1);await new Promise(resolve=>setTimeout(resolve,700));}})()));
 await saveQueue;console.log(`Total verified ${[...captures.values()].filter(capture=>capture.verified).length}; unresolved ${failures.size}.`);
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
