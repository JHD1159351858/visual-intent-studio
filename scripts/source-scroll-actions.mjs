// Drive the official demos through their actual document scroll events.
export async function sourceScrollActions(page, demo, entry, evidence) {
 const slug=new URL(entry.sourceUrl).pathname.split('/').pop();
 if(entry.sourceId!=='aceternity' || !['floating-navbar','tracing-beam','google-gemini-effect','resizable-navbar','sticky-banner','card-stack','container-scroll-animation','macbook-scroll'].includes(slug)) return false;
 const rect=await demo.boundingBox();
 const origin=await page.evaluate(()=>window.scrollY);
 const viewport=page.viewportSize();
 const clip=evidence.clip;
 Object.assign(clip,{x:Math.max(0,Math.floor(rect.x)),y:100,width:Math.min(Math.floor(rect.width),viewport.width-Math.max(0,Math.floor(rect.x))),height:Math.min(slug==='floating-navbar'?500:700,viewport.height-100)});
 clip.width-=clip.width%2;clip.height-=clip.height%2;
 await page.mouse.move(clip.x+clip.width*0.55,clip.y+clip.height*0.5);
 const wheel=async delta=>{for(let i=0;i<6;i++){await page.mouse.wheel(0,delta/6);await page.waitForTimeout(90);}await page.waitForTimeout(400);};
 const continuous=async(delta,duration)=>page.evaluate(async({delta,duration})=>{
  const origin=scrollY,start=performance.now();let samples=0;
  await new Promise(resolve=>{function step(now){const progress=Math.min(1,(now-start)/duration);scrollTo({top:origin+delta*progress,behavior:'instant'});samples++;if(progress<1)requestAnimationFrame(step);else resolve();}requestAnimationFrame(step);});
  return {origin,final:scrollY,duration,samples};
 },{delta,duration});
 const poster=()=>{evidence.posterElapsedMs=Date.now()-(evidence.recordingStartedAt || Date.now());};
 if(slug==='card-stack') {
  const cards=demo.locator('div.absolute.rounded-3xl');const names=new Set([await cards.first().textContent()]);
  const start=Date.now();
  while(Date.now()-start<11000){await page.waitForTimeout(250);names.add(await cards.first().textContent());}
  if(names.size<3 || await page.evaluate(()=>scrollY)!==origin) throw new Error('Card Stack 未展示至少两次实际自动置顶，或页面被额外滚动');
  evidence.scroll={scope:'none',origin,transitions:names.size-1};
  poster();evidence.actions.push('保持真实叠放卡片与文档位置固定，录制至少两次自动置顶，不执行额外滚轮');
 } else if(slug==='container-scroll-animation' || slug==='macbook-scroll') {
  Object.assign(clip,{height:viewport.height-clip.y});clip.height-=clip.height%2;
  const target=await demo.locator(slug==='container-scroll-animation'?'[style*="rotateX"]':'[style*="scaleX"][style*="rotateX"]').first().elementHandle();
  const initial=await target.getAttribute('style');
  await page.waitForTimeout(500);
  const down=await continuous(slug==='container-scroll-animation'?450:650,4200);
  await page.waitForTimeout(160);poster();
  const changed=await target.getAttribute('style');
  if(initial===changed || down.samples<70) throw new Error('真实屏幕旋转未推进或连续滚动帧不足');
  const up=await continuous(-160,1800);
  const finalBox=await demo.boundingBox();
  if(finalBox.y+finalBox.height<clip.y+clip.height) throw new Error('连续滚动离开真实屏幕演示');
  evidence.scroll={scope:'window',origin,down,up,initial,changed};
  evidence.actions.push('在真实屏幕演示内按浏览器动画帧连续滚动4.2秒，再回看1.8秒；验证原组件旋转变化，没有逐100px停顿');
  await page.waitForTimeout(500);
 } else if(slug==='floating-navbar') {
  const nav=demo.locator('.fixed').first();
  const initial=await nav.evaluate(el=>Number(getComputedStyle(el).opacity));
  await page.waitForTimeout(600);await wheel(180);
  const hidden=await nav.evaluate(el=>Number(getComputedStyle(el).opacity));
  await wheel(-180);
  await page.waitForFunction(el=>Number(getComputedStyle(el).opacity)>.95,await nav.elementHandle(),{timeout:3000});
  const visible=await nav.evaluate(el=>Number(getComputedStyle(el).opacity));const box=await nav.boundingBox();
  if(hidden>.1 || box.y<clip.y || box.y+box.height>clip.y+clip.height) throw new Error('Floating Navbar 隐藏/上滚显现状态或录像边界未验证');
  evidence.scroll={scope:'window',initial,hidden,visible,origin,final:await page.evaluate(()=>window.scrollY)};
  poster();evidence.actions.push('在原站文档向下滚动180px隐藏导航，再向上滚动180px，验证真实导航 opacity>0.95 且完整位于录像画幅');
  await page.waitForTimeout(900);
 } else if(slug==='tracing-beam') {
  const gradient=demo.locator('linearGradient').first();
  const initial=Number(await gradient.getAttribute('y1'));let current=0;const samples=[];
  await page.waitForTimeout(600);
  for(const target of [180,360,540,720,900,720,540]) {
   await wheel(target-current);current=target;
   const box=await demo.boundingBox();
   if(box.y+box.height<clip.y+clip.height) throw new Error('Tracing Beam 阅读滚动离开真实文章演示区域');
   samples.push({scrollY:await page.evaluate(()=>window.scrollY),y1:Number(await gradient.getAttribute('y1')),y2:Number(await gradient.getAttribute('y2'))});
  }
  const final=Number(await gradient.getAttribute('y1'));
  if(final<=initial+40) throw new Error('Tracing Beam 原站 SVG 渐变端点没有随阅读滚动推进');
  evidence.scroll={scope:'window',origin,initial,final,samples};
  poster();evidence.actions.push('在真实文章演示内分步向下阅读900px，再向上回看360px，验证 SVG 光束渐变端点随滚动推进；没有改写组件');
  await page.waitForTimeout(500);
 } else if(slug==='google-gemini-effect') {
  const path=demo.locator('path[stroke-dasharray]').first();
  const initial=Number((await path.getAttribute('stroke-dasharray')).split(' ')[0]);const samples=[];
  await page.waitForTimeout(600);
  for(const delta of [100,100,150]) {
   await wheel(delta);
   const box=await demo.locator('svg').first().boundingBox();
   if(box.y+box.height<clip.y+100) throw new Error('Google Gemini 的真实彩色 SVG 已离开录像画幅');
   samples.push({scrollY:await page.evaluate(()=>window.scrollY),painted:Number((await path.getAttribute('stroke-dasharray')).split(' ')[0])});
  }
  if(samples.at(-1).painted<=initial+.02) throw new Error('Google Gemini 原站路径绘制进度未随滚动变化');
  poster();await page.waitForTimeout(800);await wheel(-200);
  evidence.scroll={scope:'window',origin,initial,samples};
  evidence.actions.push('在原站长演示向下滚动350px再上滚200px，验证真实 SVG stroke-dasharray 随进度变化，并保持曲线可见');
 } else if(slug==='resizable-navbar') {
  Object.assign(clip,{y:300,height:Math.min(600,viewport.height-300)});clip.height-=clip.height%2;
  const nav=demo.locator('[style*="min-width"]').first();
  await wheel(80-origin);await page.waitForTimeout(1000);
  const wide=await nav.boundingBox();
  await wheel(80);await page.waitForTimeout(700);
  const narrow=await nav.boundingBox();
  if(wide.width-narrow.width<40 || narrow.y<clip.y || narrow.y+narrow.height>clip.y+clip.height) throw new Error('Resizable Navbar 真实导航未收窄或离开录像画幅');
  poster();await page.waitForTimeout(700);await wheel(-80);await page.waitForTimeout(800);
  const restored=await nav.boundingBox();
  if(restored.width<narrow.width+40) throw new Error('Resizable Navbar 上滚后真实导航未恢复宽度');
  evidence.scroll={scope:'window',origin,wide:wide.width,narrow:narrow.width,restored:restored.width};
  evidence.actions.push('在原站窗口80px与160px之间滚动，跨越100px阈值，验证真实导航收窄再展开；没有修改组件宽度');
 } else {
  Object.assign(clip,{height:Math.min(Math.floor(rect.height),viewport.height-100)});clip.height-=clip.height%2;
  const scroller=demo.locator('.overflow-y-auto').first();const banner=scroller.locator('.sticky').first();
  const startTop=await scroller.evaluate(el=>el.scrollTop);const start=await banner.boundingBox();const samples=[];
  await page.waitForTimeout(600);
  for(const delta of [200,200,-200]) {
   await wheel(delta);
   const box=await banner.boundingBox();const top=await scroller.evaluate(el=>el.scrollTop);
   if(Math.abs(box.y-start.y)>2 || await banner.evaluate(el=>Number(getComputedStyle(el).opacity))<.95) throw new Error('Sticky Banner 内层阅读未保持真实公告粘性可见');
   samples.push({top,bannerY:box.y});
  }
  if(Math.max(...samples.map(sample=>sample.top))<=startTop+100) throw new Error('Sticky Banner 真实内部容器没有滚动');
  poster();await page.waitForTimeout(800);
  const close=await banner.locator('button').first().boundingBox();await page.mouse.click(close.x+close.width/2,close.y+close.height/2);
  await page.waitForFunction(el=>Number(getComputedStyle(el).opacity)<.05,await banner.elementHandle(),{timeout:3000});
  evidence.scroll={scope:'container',initial:startTop,samples,closed:true};
  evidence.actions.push('在原站真实内部区域下滚400px、上滚200px，验证公告保持顶部粘性可见；再点击原站关闭按钮验证淡出，不声称默认演示按滚动方向隐藏');
  await page.waitForTimeout(800);
 }
 return true;
}
