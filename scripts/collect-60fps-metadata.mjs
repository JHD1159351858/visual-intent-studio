import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { load } from 'cheerio';

const root = 'https://60fps.design';
const slugs = [
  'airbnb-tactile-tab-button-interaction',
  'apple-music-player-controls-collapse-interaction',
  'airbnb-photo-pop-and-slide-animation',
  'airbnb-add-guests-in-sheet-interaction',
  'linear-issue-actions-popup-interaction',
  'revolut-revpoints-circular-slider-interaction',
  'perplexity-model-selection-sheet-morph-interaction',
  'google-todo-check-interaction',
  'google-ai-mode-search-morph-interaction',
  'google-photos-logo-spin-to-backup-loader-animation',
  'notion-ai-sheet-intro-action-trail-transition',
  'airbnb-identity-verification-card-flip-scan-interaction',
  'github-badges-showcase-interaction',
  'revolut-graph-glow-drag-interaction',
  'revolut-3d-card-rotate-interaction',
  'apple-music-emoji-reaction-interaction',
  'google-chrome-drag-tab-to-pin-interaction',
  'google-chrome-drag-tabs-to-arrange-interaction',
  'google-chrome-tabs-switch-scale-interaction',
  'google-docs-value-prop-full-screen-color-transition',
  'spotify-podcast-card-preview-sound-wave-animation',
  'airbnb-price-toggle-interaction',
  'spotify-speed-slider-interaction',
  'netflix-rate-interaction',
  'apple-music-play-pause-interaction',
  'apple-music-lyrics-interaction',
  'vercel-preview-feature-interaction',
];
// Chinese retrieval metadata is based on each case's visible explanation.
const curatedRows = `
airbnb-tactile-tab-button-interaction|按下有弹性的分类胶囊|structure|横向分类胶囊在点击时轻微压缩，选中底色平滑移到新项目；下方先显示内容骨架，再交叉淡入对应列表，分类与内容切换形成一个连续动作。|分类按钮像真的按下去;点标签下面的内容跟着换;软软的胶囊菜单|点击分类标签，先显示按压反馈，再切换选中状态和下方内容|移动端分类导航;信息流顶部|分类标签;弹性按压;内容切换;骨架屏;Airbnb
apple-music-player-controls-collapse-interaction|下拉收起的全屏播放器|effect|向下拖动播放器面板时，它紧跟手势下移，背后的页面逐渐放大并解除遮罩；拖过阈值松手后，面板带弹性减速退出，回到主页面。|全屏面板可以往下拉走;拖一下播放器就收起来;弹窗跟着手势滑下去|向下拖拽全屏面板；松手超过阈值后关闭|移动端播放器;可下拉关闭的详情面板|下拉关闭;面板;手势跟随;背景缩放;Apple Music
airbnb-photo-pop-and-slide-animation|弹起后退到队尾的照片堆|structure|操作照片堆时，最上面的照片先放大、旋转并向上滑出，再退到叠层后方；余下照片向前补位，形成可以循环浏览的有厚度相册。|照片像抽牌一样翻到后面;一叠照片轮流出来;会弹起来的照片堆|操作照片堆触发顶部卡片换位，其余卡片同步前移|照片画廊;目的地介绍;作品卡片堆|照片堆;叠层;旋转;循环浏览;Airbnb
airbnb-add-guests-in-sheet-interaction|人数增加时弹出的小人物|effect|底部人数面板点击加号时，数字更新并有新人物从底部弹入横向队列，原人物向左让位保持居中；原案例增加到16人以上会出现羊驼彩蛋。|人数加一个就多一个小人;加号旁边有可爱人物;数字和插画一起变化|点击人数加号逐个新增人物；原案例16+触发彩蛋|预约人数选择;多人活动表单|计数器;人物插画;弹性;彩蛋;Airbnb
linear-issue-actions-popup-interaction|键盘与选项面板顺滑接替|effect|创建任务时点击优先级、团队或标签，系统键盘向下退出，选项面板从底部接替上来；选择或关闭后，选项面板退下，键盘回到原处。|选选项时键盘变成菜单;底部面板接替键盘;表单操作不突然跳一下|点击元数据按钮切换键盘与选项面板；选择或关闭后返回输入|移动端任务创建;带辅助选项的输入表单|键盘;底部面板;连续过渡;选项;Linear
revolut-revpoints-circular-slider-interaction|沿圆环拖动的数值选择器|effect|拖动圆环上的滑块时，弧形进度跟着绘出，中央倍数在吸附到整数时弹跳；原案例达到最大值后，圆心由蓝色扩散填满并出现徽章，下方数值同步更新。|绕一圈选数字;圆形滑杆中间数字会弹;选到最大圆圈就填满|沿圆形轨道拖动滑块；整数吸附和最大值触发对应反馈|数值调节;额度或倍率选择|圆环滑块;数值;吸附;填充;Revolut
perplexity-model-selection-sheet-morph-interaction|展开后变高的嵌套选项面板|effect|先从底部打开模式选择面板并模糊背景，再点击模型入口时，同一面板伸高显示逐项淡入的模型列表；选好后面板缩回原高度并更新结果。|菜单里点一下又展开一层;底部弹窗会自己变高;在同一块面板里选模型|点击模式入口打开；点击模型入口扩展；选择后缩回|模型选择;移动端设置;多级选项|面板形变;嵌套选择;高度动画;背景模糊;Perplexity
google-todo-check-interaction|完成后统一庆祝的任务清单|structure|任务清单中的未完成项显示转圈，完成时圆形等待图标弹性变为勾选；所有项结束后，顶部插画活动起来，标题更新，主要行动按钮从底部滑入。|清单一项项打勾;全部做好后出现继续按钮;完成后标题也跟着变|任务状态从处理中变为完成；全部完成触发整体收尾反馈|新手引导;设置检查清单;准备任务页|任务清单;状态切换;勾选;完成反馈;Google
google-ai-mode-search-morph-interaction|从搜索条铺开的全屏界面|effect|点击搜索条里的AI入口后，紧凑输入条形变扩展为全屏搜索界面，背景转暗，建议胶囊和键盘滑入；退出时界面缩回原搜索条。|小搜索框点开变成整个页面;搜索条展开成全屏;打开搜索还能缩回原位|点击搜索条中的入口展开；返回操作逆向收回|移动端搜索;AI工具入口|搜索;容器形变;全屏;建议项;Google
google-photos-logo-spin-to-backup-loader-animation|展开进度卡并推开内容的状态栏|effect|顶部备份状态行点击后向下展开成详细卡片，露出圆形进度、剩余时间和说明；下面的内容随面板扩展平滑下移，而不是被突然遮住。|点一下状态栏展开进度;小提示变成一张卡;展开时下面内容一起往下走|点击顶部备份状态入口展开进度卡|上传状态;同步进度;顶部任务状态|状态栏;进度卡;布局推移;展开;Google Photos
notion-ai-sheet-intro-action-trail-transition|竖向流动的能力介绍清单|structure|引导底部面板中多条能力胶囊持续向上滚动，左侧角色插画保持固定，底部行动按钮始终可见；用流动清单展示工具能完成的不同任务。|功能一条条往上走;滚动展示它能做什么;小胶囊列表像字幕一样动|打开引导面板后能力胶囊自动持续向上移动|工具能力引导;移动端入门面板|能力列表;竖向跑马灯;引导;固定行动按钮;Notion
airbnb-identity-verification-card-flip-scan-interaction|随设备倾斜反光的身份卡|effect|点击人物页的认证徽章后进入立体身份卡，卡片随手机倾斜旋转，表面全息光泽显露安全水印；返回时卡片顺滑收回个人页里的原位置。|手机晃一下卡片就反光;像真的防伪证件;身份卡能立体转动|点击徽章展开；设备陀螺仪倾斜控制卡片角度；返回收起|移动端认证展示;数字会员卡|身份卡;陀螺仪;全息反光;展开;Airbnb
github-badges-showcase-interaction|背景跟随徽章换色的展示轮播|structure|徽章在弹层中横向轮播，滑动时立体图形轻微绕竖轴旋转并吸附到中央；背景颜色跟随当前徽章交融变化，文字淡入更新，关闭时弹层缩小退出。|徽章左右滑还能换背景;成就像立体卡片一样展示;每张卡配自己的底色|横向滑动切换徽章；点击关闭缩小退出|成就展示;个人档案徽章;收藏轮播|徽章;轮播;背景变色;三维;GitHub
revolut-graph-glow-drag-interaction|拖动图表时跟随发光的数据点|effect|拖动折线图时，竖向指示线与发光点沿曲线跟随，价格和时间实时更新；选到上涨或下跌位置时颜色分别转绿或转红，切换时间范围时曲线平滑变形。|手指划到哪里就显示那里的值;图表上有一个会亮的点;曲线数字跟着拖动变化|在折线图上横向拖动查看数据；点击时间范围切换曲线|趋势图表;数据探索;分析面板|图表拖动;发光点;数值更新;曲线形变;Revolut
revolut-3d-card-rotate-interaction|可翻面换色的立体产品卡|effect|横向滑动切换不同卡片，卡片带透视深度过渡；点击后完整翻到背面，点下方色点可平滑更换卡面颜色，金属反射随角度变化。|卡片能翻到背面;可以选颜色的立体卡;像真产品一样有金属反光|横向滑动切换卡片；点击翻面；点色点更换外观|产品款式展示;数字卡片选择|卡片翻面;换色;金属反光;三维;Revolut
apple-music-emoji-reaction-interaction|选择后向上飘散的表情回应|effect|点回应入口后，一排表情弹性放大出现；选择某个表情，菜单收起，同时多枚同类表情向上漂浮、缩小并淡出，形成轻量的回应庆祝。|点喜欢会飘出表情;选个表情后它往上飞;表情菜单弹出来|点击回应入口打开；选择表情触发上浮粒子并关闭菜单|内容回应;评论互动;播放器回应|表情;回应;粒子;弹性菜单;Apple Music
google-chrome-drag-tab-to-pin-interaction|拖进目标区后自动置顶的卡片|effect|拖动普通标签卡到下方指定区域时，卡片缩小，目标区变蓝并显示预览；松手后卡片飞到顶部固定行，原网格中的其他项平滑补齐空位。|把卡片拖进去就置顶;拖到亮起来的框里固定;置顶后其他卡片自动让位|拖拽卡片进入置顶目标区域；松手完成固定|卡片收藏;固定快捷入口;标签管理|拖放;目标高亮;置顶;网格补位;Google Chrome
google-chrome-drag-tabs-to-arrange-interaction|拖动时实时让位的卡片网格|effect|长按卡片后它略微抬起并出现阴影，拖过其他卡片时，周围项目即时滑动预览新位置；松手后被拖卡片带轻微弹性吸附到目标格。|拖卡片时其他卡片自己让开;能重新排照片顺序;卡片松手吸到格子里|长按并拖拽卡片；松手完成排序|卡片排序;相册管理;可定制网格|拖拽排序;让位;阴影;弹性吸附;Google Chrome
google-chrome-tabs-switch-scale-interaction|整页缩回标签卡的空间过渡|effect|打开标签切换时，当前整个页面平滑缩小并收进底部对应的标签胶囊，背景转暗，其他标签进入队列，清楚展示原页面在列表中的位置。|整个页面缩成一张小卡;切换页签还能看见原页面去哪了;页面收进底部标签|点击标签切换入口，当前页缩入对应卡片|多页工作台;标签切换;移动端页面管理|空间缩放;标签页;上下文;页面过渡;Google Chrome
google-docs-value-prop-full-screen-color-transition|每一步都会交融换底色的引导页|style|分步介绍切换时，整屏背景平滑从一种鲜明色彩交融到另一种，插画和文案横向滑动并带轻微视差，使不同步骤形成一致的视觉节奏。|下一页整个背景换颜色;介绍页一屏一个颜色;插画跟着换页滑动|切换新手引导步骤时同步改变背景色、插画和文案|新手引导;产品价值介绍;移动端入门|全屏色彩;背景过渡;横向滑动;视差;Google Docs
spotify-podcast-card-preview-sound-wave-animation|展开后出现声波与字幕的预览卡|effect|点击播客预览后，卡片向下扩展，封面成为背景，圆形声波随播放脉冲变化；底部字幕与音频同步上移淡入，让音频预览同时可看和可读。|音频卡点开有声波和字幕;播客预览会变高;封面上有跟着声音动的圆环|点击预览按钮展开；播放中声波与字幕联动|音频内容预览;播客列表;媒体卡片|音频预览;圆形声波;字幕;卡片展开;Spotify
airbnb-price-toggle-interaction|滑到位后出现勾选的开关|effect|点击开关时，背景由浅灰变成深色，白色滑块滑到右侧；滑块落定时内部勾选轻微放大淡入，反向点击会同时收起勾选并滑回。|开关打开后里面出现一个勾;有点弹性的开关;按钮滑过去颜色也变|点击开关切换状态；勾选在开启位置落定后出现|设置选项;价格筛选;偏好表单|开关;勾选;背景变色;弹性;Airbnb
spotify-speed-slider-interaction|滑动标尺来选数值的底部面板|effect|速度面板从底部展开，水平拖动时标尺刻度滑过固定位置，中央读数实时更新并转为强调色；点快捷数值时，标尺快速滑到对应刻度。|像尺子一样滑着选速度;滑动刻度中间数字会变;能点快捷值的滑杆|点击速度入口打开；水平拖动标尺或点击快捷数值|播放速度设置;精细数值调节;移动端设置|标尺;数值滑动;快捷选择;底部面板;Spotify
netflix-rate-interaction|按顺序弹出的三档评价菜单|effect|点击推荐按钮后，深色评价菜单在按钮上方放大淡入，三档拇指选项错开时间弹性出现；周围背景略暗，让注意力集中到评价选择。|评价按钮上面弹出几个手势;不喜欢喜欢很喜欢三个选项;一个个弹出的评分菜单|点击评价入口打开菜单，选项依次入场|内容评价;推荐反馈;视频详情|评价;浮层;逐项入场;弹性;Netflix
apple-music-play-pause-interaction|播放状态改变时升降的封面|effect|点击播放后封面放大、阴影扩散，像从背景中浮起；暂停后封面缩小、阴影收紧，播放与暂停图标也同步产生有弹性的变化。|播放时封面浮起来;暂停时图片缩一下;播放图标软软地切换|点击播放或暂停按钮，封面、阴影与图标一起切换|播放器;音频卡片;媒体控制区|播放暂停;封面缩放;阴影;图标切换;Apple Music
apple-music-lyrics-interaction|中心歌词清晰其余淡出的阅读视图|effect|点击歌词入口，封面缩小移到左上，歌词向上淡入；滚动歌词时，中间当前行放大变亮，其他行变暗、变小并模糊，封面色彩构成流动背景。|读到哪行哪行最清楚;歌词其他行模糊一点;封面缩到角落展开文字|点击歌词入口切换视图；滚动改变当前聚焦行|歌词阅读;逐行稿件;引导式文字阅读|歌词;文字聚焦;滚动;模糊背景;Apple Music
vercel-preview-feature-interaction|自动轮流聚焦的功能徽章|effect|多个彩色功能徽章围绕中央工具条，动画依次让一个徽章保持清晰与完整亮度，其余徽章模糊变暗，用焦点轮换逐个介绍复杂界面的能力。|功能图标轮流亮起来;一次只突出一个卖点;其他小卡片模糊下去|展示区自动循环切换聚焦徽章；不是鼠标悬停触发|产品功能展示;工具能力介绍;首屏演示|功能徽章;自动聚焦;模糊;循环;Vercel
`;
const curated = new Map(curatedRows.trim().split('\n').map(line => {
  const [slug, title, stage, description, aliases, trigger, placements, tags] = line.split('|');
  return [slug, { title, stage, description, aliases: aliases.split(';'), trigger, placements: placements.split(';'), tags: tags.split(';') }];
}));
const sitemapUrl = `${root}/sitemap.xml`;
const sitemapResponse = await fetch(sitemapUrl, { signal: AbortSignal.timeout(30000) });
if (!sitemapResponse.ok) throw new Error(`Sitemap HTTP ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const knownUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]));
const results = new Array(slugs.length);
let next = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (next < slugs.length) {
    const index = next++;
    const url = `${root}/shots/${slugs[index]}`;
    if (!knownUrls.has(url)) throw new Error(`Selected case not found in public sitemap: ${url}`);
    let response;
    let html;
    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { Accept: 'text/html', 'User-Agent': 'VisualIntentStudio/0.1 (public catalog metadata)' } });
      html = await response.text();
      const check = load(html);
      if (response.status !== 200 || (check('h1').first().text().trim() && check('script[type="application/ld+json"]').text().includes('VideoObject'))) break;
      await new Promise(resolve => setTimeout(resolve, 700));
    }
    if (response.status !== 200) throw new Error(`Case HTTP ${response.status}: ${url}`);
    const page = load(html);
    const name = page('h1').first().text().trim();
    const videos = [];
    for (const node of page('script[type="application/ld+json"]').toArray()) {
      let data;
      try { data = JSON.parse(page(node).text()); } catch { continue; }
      const records = Array.isArray(data) ? data : Array.isArray(data?.['@graph']) ? data['@graph'] : [data];
      for (const record of records) if (record && record['@type'] === 'VideoObject' && typeof record.contentUrl === 'string') videos.push(record);
    }
    const primary = videos.find(video => video.name === name);
    const videoUrl = primary?.contentUrl || page('video[src],video source[src]').first().attr('src');
    if (!name || !videoUrl || !videoUrl.startsWith('https://')) throw new Error(`Missing public title/video: ${url}; ${JSON.stringify({ name, videoUrl, videoObjects: videos.length, pageTitle: page('title').text(), htmlLength: html.length })}`);
    const thumbnail = primary?.thumbnailUrl;
    const poster = Array.isArray(thumbnail) ? thumbnail[0] : thumbnail || page('meta[property="og:image"]').attr('content');
    page('script,style').remove();
    const heading = page('h1').first();
    const parentText = heading.parent().parent().text().replace(/\s+/g, ' ').trim();
    const description = page('meta[name="description"]').attr('content') || page('meta[property="og:description"]').attr('content') || '';
    const paragraphs = page('p').toArray().map(node => page(node).text().replace(/\s+/g, ' ').trim()).filter(text => text.length > 50 && !/settings|cookie|privacy|subscribe/i.test(text)).slice(0, 10);
    const summary = parentText.startsWith(name) ? parentText.slice(name.length).replace(name, '').trim().slice(0, 1400) : '';
    const videoResponse = await fetch(videoUrl, { method: 'HEAD', signal: AbortSignal.timeout(30000) });
    if (!videoResponse.ok || !/^video\//.test(videoResponse.headers.get('content-type') || '')) throw new Error(`Public video response is invalid: ${url}; ${videoResponse.status}`);
    results[index] = { slug: slugs[index], name, sourceUrl: url, status: response.status, finalUrl: response.url, verifiedAt: new Date().toISOString(), description, visibleSummary: summary, paragraphs, videoUrl, poster, videoObject: primary, videoResponse: { status: videoResponse.status, contentType: videoResponse.headers.get('content-type'), contentLength: videoResponse.headers.get('content-length') }, htmlSha256: crypto.createHash('sha256').update(html).digest('hex') };
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}));
if (new Set(results.map(row => row.videoUrl)).size !== results.length) throw new Error('Duplicate source video URLs among selected cases');
await fs.mkdir('data/enrichment', { recursive: true });
await fs.writeFile('data/enrichment/60fps.evidence.json', `${JSON.stringify({ collectedFrom: sitemapUrl, verifiedAt: new Date().toISOString(), discoveredShots: [...knownUrls].filter(url => /^https:\/\/60fps\.design\/shots\/[^/]+$/.test(url)).length, sitemapSha256: crypto.createHash('sha256').update(sitemap).digest('hex'), entries: results }, null, 2)}\n`);
const entries = {};
for (const result of results) {
  const metadata = curated.get(result.slug);
  if (!metadata || !metadata.title || !metadata.description || metadata.aliases.length < 2 || metadata.placements.length < 1 || metadata.tags.length < 1 || !metadata.trigger) throw new Error(`Incomplete Chinese metadata: ${result.slug}`);
  entries[result.sourceUrl] = { name: result.name, ...metadata, sourceUrl: result.sourceUrl, implementationUrl: null, videoUrl: result.videoUrl, poster: result.poster, evidenceUrl: result.sourceUrl, verifiedAt: result.verifiedAt, evidence: { url: result.sourceUrl, sitemapUrl, pageStatus: result.status, pageSha256: result.htmlSha256, primaryVideoName: result.videoObject?.name, originalDescription: result.paragraphs[0] || result.description, videoResponse: result.videoResponse }, issue: '来源为真实产品视频与行为说明，未提供产品实现源码；视频地址已核查响应，仍需播放验证后加入推荐。' };
}
await fs.writeFile('data/enrichment/60fps.zh.json', `${JSON.stringify({ sourceId: '60fps', collectedFrom: sitemapUrl, verifiedAt: new Date().toISOString(), method: '发现公开站点地图中的具体案例，读取与标题一致的 VideoObject、可见行为说明并核查视频 HEAD 响应；中文逐条整理。', entries, issues: [] }, null, 2)}\n`);
console.log(JSON.stringify({ checked: results.length, uniqueVideos: new Set(results.map(row => row.videoUrl)).size, publicVideoResponses: results.filter(row => row.videoResponse.status === 200).length, completeChineseMetadata: Object.keys(entries).length, stages: Object.values(entries).reduce((counts, entry) => ({ ...counts, [entry.stage]: (counts[entry.stage] || 0) + 1 }), {}) }, null, 2));
