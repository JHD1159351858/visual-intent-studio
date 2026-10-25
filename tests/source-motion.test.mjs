import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chromium } from 'playwright';
import { sourceScrollActions } from '../scripts/source-scroll-actions.mjs';

for(const slug of ['card-stack','container-scroll-animation','macbook-scroll']) {
 test(`official ${slug} keeps the demo fixed or scrolls continuously`,{timeout:45000},async()=>{
  const browser=await chromium.launch({headless:true,channel:'chromium',args:['--enable-gpu']});
  try {
   const page=await browser.newPage({viewport:{width:1440,height:1000},colorScheme:'dark'});
   const sourceUrl=`https://ui.aceternity.com/components/${slug}`;
   await page.goto(sourceUrl,{waitUntil:'domcontentloaded'});await page.waitForTimeout(2200);
   const demo=page.locator('.preview').first();await demo.scrollIntoViewIfNeeded();await demo.evaluate(el=>scrollBy(0,el.getBoundingClientRect().top-100));await page.waitForTimeout(500);
   const rect=await demo.boundingBox();const origin=await page.evaluate(()=>scrollY);
   await page.evaluate(()=>{window.__motionPoints=[];window.__motionTimer=setInterval(()=>window.__motionPoints.push({time:performance.now(),y:scrollY,card:document.querySelector('.preview div.absolute.rounded-3xl')?.textContent}),40);});
   const evidence={actions:[],recordingStartedAt:Date.now(),clip:{x:Math.floor(rect.x),y:100,width:Math.floor(rect.width),height:700}};
   await sourceScrollActions(page,demo,{sourceId:'aceternity',sourceUrl},evidence);
   const points=await page.evaluate(()=>{clearInterval(window.__motionTimer);return window.__motionPoints;});
   if(slug==='card-stack') {
    assert.ok(points.length>=220,'record enough time for at least two automatic card transitions');
    assert.ok(points.every(point=>point.y===origin),'automatic cards must keep the document stationary');
    assert.ok(new Set(points.map(point=>point.card)).size>=3,'native card order must actually change twice');
   } else {
    assert.ok(new Set(points.map(point=>Math.round(point.y))).size>=60,'continuous scroll must show many positions rather than three 100px jumps');
    const first=points.findIndex((point,index)=>index>0 && Math.abs(point.y-points[index-1].y)>.5),last=points.findLastIndex((point,index)=>index>0 && Math.abs(point.y-points[index-1].y)>.5);
    const moving=points.slice(first,last+1);let pause=0,maxPause=0;
    for(let i=1;i<moving.length;i++){pause=Math.abs(moving[i].y-moving[i-1].y)<.5?pause+40:0;maxPause=Math.max(maxPause,pause);}
    assert.ok(maxPause<240,'scroll must not pause after every 100px');
   }
  } finally{await browser.close();}
 });
}
