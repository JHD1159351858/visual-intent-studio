# 案例来源与录像说明

核验日期：2026-10-12。资源来自 React Bits、Aceternity UI 的公开组件资料，以及指定的 60fps 案例。Designeer 用于发现来源；Codrops 按具体案例页导入。完整数量、已验证数量与待整理原因以 [目录填充报告](../data/catalog-fill-report.json) 为准。

首版已收录 353 条完整资料，其中 350 条视频通过浏览器解码检查，3 条待整理资料不计入可播放名单。350 条预览包括 309 段 `source-recording` 原站实录、28 段 `original` 原视频与 13 段 `reference-recording` 参考演示。[catalog.release.v1.json](../data/catalog.release.v1.json) 已固定首版案例 ID 名单和来源、阶段统计：React Bits 213 条、Aceternity UI 109 条、60fps 28 条；结构 66 条、样式 90 条、效果 194 条。

每条中文资料包括名称、具体可见行为、至少两条口语别名、触发方式、适用位置、标签、选型阶段、来源页、实现参考和核验依据。网格底纹属于样式，画廊与导航属于结构，鼠标、滚动或点击反馈按实际行为分类。用户补充的别名和备注在更新时保留。

## 扩充来源与证据

- React Bits：从固定上游提交的公开 `llms.txt` 和组件仓库整理资料；[reactbits.zh.json](../data/enrichment/reactbits.zh.json) 保存逐条说明、源码地址、来源行号与哈希。
- Aceternity UI：核对 [公开结构化目录](https://ui.aceternity.com/ai-recommendations)、具体组件页及 registry 源码；中文资料见 [aceternity.zh.json](../data/enrichment/aceternity.zh.json)，HTTP 状态、当前页面、源码哈希等见 [aceternity.evidence.json](../data/enrichment/aceternity.evidence.json)。旧地址更名或合并时采用已核验的现行页面。
- Input、Label 在同一个 [Signup Form](https://ui.aceternity.com/components/signup-form) 中有真实演示，作为完整表单参考合并，保留各组件实现资料。星空与流星等同页条目按规范化来源地址去重；不能把不存在的旧变体当作当前演示。
- 60fps：保留 [Opal 发光边框案例](https://60fps.design/shots/opal-border-glow-feature-highlight-interaction)，并从 [公开站点地图](https://60fps.design/sitemap.xml) 补充 27 个不同案例，覆盖分类切换、弹层变形、拖动排序、圆环选择、歌词聚焦等行为。中文资料见 [60fps.zh.json](../data/enrichment/60fps.zh.json)，页面 HTTP、标题对应的 `VideoObject`、原视频/海报地址与摘要见 [60fps.evidence.json](../data/enrichment/60fps.evidence.json)。运行 `node scripts/collect-60fps-metadata.mjs` 可重新核验新增资料。案例提供产品视频与行为说明，未提供产品实现源码，`implementationUrl` 保留为空。

## 预览类型与采集

**source-recording** 为浏览器打开原站后，在其实际组件演示区域进行鼠标、点击、输入或滚动录制。保留原站 DOM、样式与素材，再裁切演示区域并保存为本地 WebM。不是按组件名字生成的通用动画，也不是静态海报序列。文件上传使用合成测试文本，摄像头演示使用 Chromium 合成图案；操作记录会注明测试素材。

**original** 为来源直接提供的公开视频素材。60fps 预览通过页面中的真实视频元素取得素材地址，保存原视频后转码为本地 WebM，保留完整原始时长与帧比例，以留边适配 960×600 预览。采集证据保存原素材地址、原尺寸和时长、HTTP、字节数及 SHA-256，便于追溯。

运行 `node scripts/capture-sources.mjs --concurrency=3`；需要 Playwright Chromium、`ffmpeg` 和 `ffprobe`。原站录像、原视频转码与海报均位于 `media/sources`；[preview-captures.json](../data/preview-captures.json) 保存预览类型、播放检查与证据路径，[采集报告](../artifacts/source-captures/report.json) 汇总失败原因。组件证据还包括实际来源地址、HTTP 结果、演示选择器、裁切位置、交互操作、视频哈希及播放结果。

采集通过时长、尺寸、实际播放和非空画面检查后，运行 `npx tsx scripts/populate-catalog.ts` 合并中文资料与预览。加载失败、空白画布、失效页面或无法对应的旧演示不会标为可推荐条目。

**reference-recording** 为独立编写的简化机制演示，共十三段：初始十二段与 Moving Line 的额外机制演示。它们不能代表原组件的完整渲染、全部参数或移动适配。Moving Line 的独立文档已失效，依据其 [官方 registry 源码](https://ui.aceternity.com/registry/moving-line.json) 制作 [本地演示](../demos/dc50ae9866b7171d.html)，展示上下滚动时竖向亮线伸缩，明确标为本地参考演示。可用 `npm run record:demos -- --ids=dc50ae9866b7171d` 定向重录。

无论归属哪种，未经播放验证的条目都保留待整理状态；原站录屏与产品视频都是视觉参考，有源码的案例还需查看对应实现资料。

## 初始十二段参考演示的核验与复现

以下十二段录像是在本地 HTML/CSS/JavaScript 页面上执行真实操作后录得，均标有“参考演示 · 非原站录像”。它们的来源事实与简化边界逐条列在后文。

- 已直接阅读全部 12 个官方说明页，并成功获取对应的公开组件源码（HTTP 200），用于核对布局或交互机制。抓取端点、实际抓取时间、字节数、SHA-256 在 [source-evidence.json](../demos/source-evidence.json) 中。
- 本地演示实现为独立编写的简化参考示例；没有把上游 React 组件源码、远程图片、视频、音频、字体或付费模板复制到本项目。原站的组件依赖、移动适配、完整参数与渲染细节不能从本片推断。
- 执行 `npm run record:demos`。脚本使用本地 3101 端口，960×600 Chromium 视口，每个案例录制约 8 秒。录制成功后才把目录项标为 ready / verified。
- 录像逐一由 Chromium 原生 video 加载元数据并实际播放，要求 duration > 0、尺寸为 960×600、currentTime 前进。结果记录于 [verification.json](../media/verification.json)。脚本 finally 中关闭浏览器与临时 HTTP 服务。
- [catalog.test.ts](../tests/catalog.test.ts) 先于种子编写，初次执行因缺少种子而失败；最终验证覆盖阶段数量、唯一 ID、官方来源、显式录像归属、视频存在及 ready 状态。

## 权属边界

实现与素材的使用条件请核对源项目的授权说明：[React Bits 仓库许可](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md)、[Aceternity 官方许可页](https://ui.aceternity.com/licence)，以及每条案例对应的来源说明。案例目录、独立参考实现和录屏不代表对上游品牌、素材或组件的额外授权。

## 错落便当卡片网格 / Bento Grid

- 目录 ID：`aceternity-bento-grid`；阶段：`structure`。
- [官方说明页](https://ui.aceternity.com/components/bento-grid)；[公开实现](https://ui.aceternity.com/registry/bento-grid.json)。
- 来源事实：官方说明为大小错落的卡片网格，含标题、说明和顶部区域。
- 本片展示与简化边界：保留三列网格、跨列大卡片和悬停轻移。以抽象几何代替原站内容，未复制原站示例文案或素材。
- 触发：页面展示；悬停卡片时内容轻移。
- 本地演示：[aceternity-bento-grid.html](../demos/aceternity-bento-grid.html)；[WebM 录像](../media/aceternity-bento-grid.webm)；[PNG 海报](../media/aceternity-bento-grid.png)。

## 点击展开的作品网格 / Layout Grid

- 目录 ID：`aceternity-layout-grid`；阶段：`structure`。
- [官方说明页](https://ui.aceternity.com/components/layout-grid)；[公开实现](https://ui.aceternity.com/registry/layout-grid.json)。
- 来源事实：官方说明为点击后通过布局动画放大网格项。
- 本片展示与简化边界：保留点击网格→放大详情→关闭回到网格的流程。用 CSS 进入动画代替 Motion 的共享布局过渡，几何背景代替原站照片。
- 触发：点击卡片展开；点击关闭返回网格。
- 本地演示：[aceternity-layout-grid.html](../demos/aceternity-layout-grid.html)；[WebM 录像](../media/aceternity-layout-grid.webm)；[PNG 海报](../media/aceternity-layout-grid.png)。

## 悬停展开的侧边导航 / Sidebar

- 目录 ID：`aceternity-sidebar`；阶段：`structure`。
- [官方说明页](https://ui.aceternity.com/components/sidebar)；[公开实现](https://ui.aceternity.com/registry/sidebar.json)。
- 来源事实：官方说明为悬停展开、支持移动端及暗色主题的侧栏。
- 本片展示与简化边界：录像只展示桌面侧栏移入展开、移出收起与主区并排结构；不展示也不宣称实现上游移动端切换。
- 触发：鼠标移入侧栏展开，移出收起。
- 本地演示：[aceternity-sidebar.html](../demos/aceternity-sidebar.html)；[WebM 录像](../media/aceternity-sidebar.webm)；[PNG 海报](../media/aceternity-sidebar.png)。

## 滚动跟随的时间线 / Timeline

- 目录 ID：`aceternity-timeline`；阶段：`structure`。
- [官方说明页](https://ui.aceternity.com/components/timeline)；[公开实现](https://ui.aceternity.com/registry/timeline.json)。
- 来源事实：官方说明为具有粘性标题和滚动跟随光束的时间线。
- 本片展示与简化边界：保留阶段标题、时间节点、滚动进度光束和粘性标题。内容为通用里程碑，滚动映射为简化线性计算。
- 触发：页面向下滚动，进度线延伸，阶段标题粘性定位。
- 本地演示：[aceternity-timeline.html](../demos/aceternity-timeline.html)；[WebM 录像](../media/aceternity-timeline.webm)；[PNG 海报](../media/aceternity-timeline.png)。

## 半透明玻璃表面 / Glass Surface

- 目录 ID：`reactbits-glass-surface`；阶段：`style`。
- [官方说明页](https://reactbits.dev/components/glass-surface)；[公开实现](https://github.com/DavidHDev/react-bits/blob/main/src/content/Components/GlassSurface/GlassSurface.jsx)。
- 来源事实：官方组件为可折射背景的液态玻璃面板，也支持自定义 logo 形状。
- 本片展示与简化边界：本参考片保留半透明、背景模糊、圆角及玻璃边缘高光；没有实现上游 SVG/WebGL 折射、色散与任意 logo 形状。因此不得将本片用作原组件折射质量的证据。
- 触发：持续显示；背景图形运动使透视与模糊更明显。
- 本地演示：[reactbits-glass-surface.html](../demos/reactbits-glass-surface.html)；[WebM 录像](../media/reactbits-glass-surface.webm)；[PNG 海报](../media/reactbits-glass-surface.png)。

## 鼠标响应的点阵背景 / Dot Grid

- 目录 ID：`reactbits-dot-grid`；阶段：`style`。
- [官方说明页](https://reactbits.dev/backgrounds/dot-grid)；[公开实现](https://github.com/DavidHDev/react-bits/blob/main/src/content/Backgrounds/DotGrid/DotGrid.jsx)。
- 来源事实：官方点阵会被鼠标推动、拖动，点击产生冲击波。
- 本片展示与简化边界：用 Canvas 2D 实现点位响应、回弹及点击波纹；原组件使用更完整的物理反馈及 WebGL。录像包含鼠标移动和一次真实点击。
- 触发：鼠标在背景移动；附近圆点变亮、移动并回弹。
- 本地演示：[reactbits-dot-grid.html](../demos/reactbits-dot-grid.html)；[WebM 录像](../media/reactbits-dot-grid.webm)；[PNG 海报](../media/reactbits-dot-grid.png)。

## 流动渐变光晕 / Background Gradient

- 目录 ID：`aceternity-background-gradient`；阶段：`style`。
- [官方说明页](https://ui.aceternity.com/components/background-gradient)；[公开实现](https://ui.aceternity.com/registry/background-gradient.json)。
- 来源事实：官方组件为卡片、按钮等容器提供可动画的渐变背景。
- 本片展示与简化边界：保留持续流动的多色渐变边缘和柔和光晕；采用独立 CSS animation，而非原组件的 Motion 实现。
- 触发：自动循环流动；无需点击。
- 本地演示：[aceternity-background-gradient.html](../demos/aceternity-background-gradient.html)；[WebM 录像](../media/aceternity-background-gradient.webm)；[PNG 海报](../media/aceternity-background-gradient.png)。

## 悬停着色的网格背景 / Background Boxes

- 目录 ID：`aceternity-background-boxes`；阶段：`style`。
- [官方说明页](https://ui.aceternity.com/components/background-boxes)；[公开实现](https://ui.aceternity.com/registry/background-boxes.json)。
- 来源事实：官方说明为覆盖背景、悬停高亮的方格容器。
- 本片展示与简化边界：保留斜向方格和鼠标经过着色、渐退；格子数量和颜色固定以便重录，原组件还包含随机颜色和额外装饰。
- 触发：鼠标经过背景方格后高亮并逐渐消退。
- 本地演示：[aceternity-background-boxes.html](../demos/aceternity-background-boxes.html)；[WebM 录像](../media/aceternity-background-boxes.webm)；[PNG 海报](../media/aceternity-background-boxes.png)。

## 跟随鼠标的卡片聚光 / Spotlight Card

- 目录 ID：`reactbits-spotlight-card`；阶段：`effect`。
- [官方说明页](https://reactbits.dev/components/spotlight-card)；[公开实现](https://github.com/DavidHDev/react-bits/blob/main/src/content/Components/SpotlightCard/SpotlightCard.jsx)。
- 来源事实：官方组件的柔和聚光随鼠标移动，也能照亮边缘及附近卡片。
- 本片展示与简化边界：本片展示单卡片内跟随鼠标的柔和聚光及移出淡出；没有复刻上游跨卡片光照、主题系统或全部光形。
- 触发：鼠标进入卡片，聚光跟随；移出后淡出。
- 本地演示：[reactbits-spotlight-card.html](../demos/reactbits-spotlight-card.html)；[WebM 录像](../media/reactbits-spotlight-card.webm)；[PNG 海报](../media/reactbits-spotlight-card.png)。

## 跟随鼠标的立体倾斜 / Tilted Card

- 目录 ID：`reactbits-tilted-card`；阶段：`effect`。
- [官方说明页](https://reactbits.dev/components/tilted-card)；[公开实现](https://github.com/DavidHDev/react-bits/blob/main/src/content/Components/TiltedCard/TiltedCard.jsx)。
- 来源事实：官方组件为响应鼠标的三维透视倾斜卡片。
- 本片展示与简化边界：保留根据位置倾斜、悬停放大及移出复位；使用 CSS 过渡代替弹簧，并使用本地绘制的几何图像，不使用上游图片或字体资源。
- 触发：鼠标在卡片内移动，卡片倾斜；移出复位。
- 本地演示：[reactbits-tilted-card.html](../demos/reactbits-tilted-card.html)；[WebM 录像](../media/reactbits-tilted-card.webm)；[PNG 海报](../media/reactbits-tilted-card.png)。

## 沿边框追踪的发光 / Glowing Effect

- 目录 ID：`aceternity-glowing-effect`；阶段：`effect`。
- [官方说明页](https://ui.aceternity.com/components/glowing-effect)；[公开实现](https://ui.aceternity.com/registry/glowing-effect.json)。
- 来源事实：官方组件为容器提供根据鼠标方向响应的边缘发光。
- 本片展示与简化边界：保留鼠标方向驱动的局部彩色边缘和中心静区；使用 CSS conic-gradient 近似，不声称与上游渐变遮罩、参数范围及平滑算法一致。
- 触发：鼠标靠近或经过卡片边缘，光晕随角度移动。
- 本地演示：[aceternity-glowing-effect.html](../demos/aceternity-glowing-effect.html)；[WebM 录像](../media/aceternity-glowing-effect.webm)；[PNG 海报](../media/aceternity-glowing-effect.png)。

## 鼠标滑动揭示文字 / Text Reveal Card

- 目录 ID：`aceternity-text-reveal-card`；阶段：`effect`。
- [官方说明页](https://ui.aceternity.com/components/text-reveal-card)；[公开实现](https://ui.aceternity.com/registry/text-reveal-card.json)。
- 来源事实：官方说明为鼠标移动时揭示另一层文字内容。
- 本片展示与简化边界：保留横向鼠标位置驱动文字遮罩与移出复位；省略上游星点装饰和旋转光束，使用通用自写文案。
- 触发：鼠标横向滑过文字，遮罩随位置展开；移出复位。
- 本地演示：[aceternity-text-reveal-card.html](../demos/aceternity-text-reveal-card.html)；[WebM 录像](../media/aceternity-text-reveal-card.webm)；[PNG 海报](../media/aceternity-text-reveal-card.png)。
