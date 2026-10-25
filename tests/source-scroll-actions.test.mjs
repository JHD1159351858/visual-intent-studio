import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chromium } from 'playwright';
import { sourceScrollActions } from '../scripts/source-scroll-actions.mjs';

for(const slug of ['floating-navbar','tracing-beam','google-gemini-effect','resizable-navbar','sticky-banner']) {
 test(`real official ${slug} recording triggers the documented scroll effect`,{timeout:45000},async()=>{
  const browser=await chromium.launch({headless:true});
  try {
   const page=await browser.newPage({viewport:{width:1440,height:1000},colorScheme:'dark'});
   const sourceUrl=`https://ui.aceternity.com/components/${slug}`;
   const response=await page.goto(sourceUrl,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);
   const demo=page.locator('.preview').first();await demo.waitFor({state:'visible'});await page.waitForTimeout(2200);
   await demo.scrollIntoViewIfNeeded();await demo.evaluate(el=>window.scrollBy(0,el.getBoundingClientRect().top-100));await page.waitForTimeout(700);
   const rect=await demo.boundingBox();const evidence={actions:[],recordingStartedAt:Date.now(),clip:{x:Math.floor(rect.x),y:100,width:Math.floor(rect.width),height:700}};
   if(slug==='resizable-navbar') {await page.evaluate(()=>window.scrollTo(0,80));await page.waitForTimeout(1600);await demo.locator('[style*="min-width"]').first().evaluate(el=>{window.__recordedNavWidths=[];window.__navWidthTimer=setInterval(()=>window.__recordedNavWidths.push(el.getBoundingClientRect().width),40);});}
   const initial=slug==='floating-navbar'?await demo.locator('.fixed').evaluate(el=>Number(getComputedStyle(el).opacity)):slug==='tracing-beam'?Number(await demo.locator('linearGradient').getAttribute('y1')):0;
   if(['floating-navbar','tracing-beam'].includes(slug)) assert.equal(initial,slug==='floating-navbar'?0:50,'source starts in the untriggered state seen in the defective recording');
   await sourceScrollActions(page,demo,{sourceUrl,sourceId:'aceternity'},evidence);
   if(slug==='floating-navbar') {
    const nav=demo.locator('.fixed');assert.ok(await nav.evaluate(el=>Number(getComputedStyle(el).opacity))>.95,'upward scroll must visibly reveal the actual navbar');
    const box=await nav.boundingBox();assert.ok(box.y>=evidence.clip.y && box.y+box.height<=evidence.clip.y+evidence.clip.height,'revealed navigation must be fully inside the video crop');
   } else if(slug==='tracing-beam') {
    const endpoint=Number(await demo.locator('linearGradient').getAttribute('y1'));assert.ok(endpoint>initial+40,'reading scroll must advance the actual SVG beam');
    const box=await demo.boundingBox();assert.ok(box.y+box.height>=evidence.clip.y+evidence.clip.height,'reading crop must remain within the actual article demo');
   } else if(slug==='google-gemini-effect') {
    const painted=await demo.locator('path[stroke-dasharray]').first().getAttribute('stroke-dasharray');assert.ok(Number(painted.split(' ')[0])>.05,'actual coloured SVG stroke must advance while its visible area stays in the crop');
    const box=await demo.locator('svg').first().boundingBox();assert.ok(box.y+box.height>evidence.clip.y+100,'the coloured drawing must remain on screen');
   } else if(slug==='resizable-navbar') {
    const widths=await page.evaluate(()=>{clearInterval(window.__navWidthTimer);return window.__recordedNavWidths;});assert.ok(Math.max(...widths)-Math.min(...widths)>80,'actual navigation must visibly narrow and expand across the threshold');
   } else {
    assert.ok(await demo.locator('.sticky').first().evaluate(el=>Number(getComputedStyle(el).opacity))<.05,'the real sticky announcement close button must close the banner');
   }
   assert.ok(evidence.actions.some(action=>action.includes('滚动')));assert.ok(evidence.posterElapsedMs>0);
   assert.ok(evidence.clip.x>=0 && evidence.clip.y>=0 && evidence.clip.x+evidence.clip.width<=1440 && evidence.clip.y+evidence.clip.height<=1000);
  } finally {await browser.close();}
 });
}
