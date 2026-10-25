# 视觉需求智能体实施记录

目标：本地单人网页应用，按结构、样式、效果分步看视频选型，输出确认过的开发需求。

## 任务与责任

- [x] 页面：三栏工作台、参考库、来源管理、浏览器保存、Markdown 导出。
- [x] 服务：本地目录、来源采集与合并、模型推荐、验证后的条目筛选、固定模板导出。
- [x] 资料：公开组件资料、完整中文检索元数据、原站浏览器实录和来源证据；保留初始参考演示及其简化边界。
- [x] 集成：Windows 启动说明、类型检查、功能测试、浏览器验证、模型评测入口。
- [x] 首版资源验收：353 条完整资料，其中 350 条通过播放验证，另外 3 条待整理资料保留但不计入首版可播放名单。

## 约束

- API 未配置时明确显示手动选型；不能伪装成已接入智能推荐。
- 模型输出只能引用存在、视频预览已经验证的条目。
- 保留原站来源；原站浏览器实录标为 source-recording，本地机制演示标为 reference-recording，来源直接素材标为 original。
- 导出仅包含用户已经确认的选择，调整意见保留为待实现需求。
- 本地 JSON 目录更新保留用户口语别名、备注与已验证预览，中文整理信息独立存于 data/enrichment。
- 模型 API 的真实二十条评测需用户配置接口后才能执行，不伪造结果。

## 资源填充与核验记录（2026-10-12）

- React Bits 从固定上游提交的公开资料扩充目录；Aceternity 核对结构化目录、现行组件页与源码，修正更名页面、同页条目和分类。
- 60fps 在原有 Opal 之外补充 27 个不同案例，从公开站点地图和具体页面核验主视频、海报与行为说明；[中文资料](../data/enrichment/60fps.zh.json) 和 [来源证据](../data/enrichment/60fps.evidence.json) 可通过 `node scripts/collect-60fps-metadata.mjs` 重新采集。产品源码未公开，不能把案例页当成实现源码。
- 每条整理名称、中文口语别名、具体效果说明、分类、触发、位置、标签、来源及实现参考，保留核验时间和证据地址。
- `capture:previews` 录制来源真实组件演示，60fps 则保存公开原视频并按原始帧比例转码；检查解码、时长、尺寸、实际播放和非空画面。证据与失败原因见 [采集报告](../artifacts/source-captures/report.json) 和 [采集清单](../data/preview-captures.json)。
- 首版已交付 309 段原站实录（source-recording）、28 段 60fps 原视频（original）和 13 段本地参考演示（reference-recording），合计 350 条可播放案例。初始十二段及 Moving Line 属于参考演示，三类预览分别标记，区别见 [sources.md](sources.md)。
- `fill:catalog` 合并资料与验证过的预览，按规范化来源地址去重，更新本地目录、种子和 [目录填充报告](../data/catalog-fill-report.json)。可播放目录达到 350 条时写入 [catalog.release.v1.json](../data/catalog.release.v1.json)，固定首版案例 ID 与来源、阶段统计；首版验收据此核对，353 条资料中的 3 条待整理项不计入名单。实际数量和待整理原因以最终报告为准。
- Codrops 直采返回 HTTP 403 时接口报错，保留已有数据；未成功核验的页面不伪造可播放状态。
- 功能验收覆盖三阶段选择、刷新恢复、确认内容导出、失败重试、换组、口语搜索与来源更新。真实模型二十条匹配评测仍需配置完整的接口；不把手动选型或仅有 Coze 令牌视为已通过模型匹配评测。
- 首版播放验证：65 项测试通过，TypeScript 检查及 Vite 构建通过；350 条视频均在 Chromium 中成功解码，完整选型、原站实录与原视频导出、分批加载及来源重复同步通过。仅有解码检查不足以证明动画连贯或触发正确，后续修复记录如下。

## 录屏闪烁修复（2026-10-12）

- 真实原站 A/B 录制复现了根因：录制中调用裁切截图取封面，会使 screencast 瞬间缩小、错位并填灰；旧批次 309 条原站实录中，192 条命中该强异常特征，未命中条目抽查也发现了缩放污染。因此重新录制全部 309 条；28 条原站素材视频与 13 条本地参考演示保持原流程。
- 封面改为录制关闭后从最终 WebM 离线取帧，保留完整实际操作片段。新版视频先写临时文件，画幅检查和原生播放通过后再替换并恢复可选状态。旧视频保留在 artifacts/video-diagnosis/original 中供对照。
- Floating Navbar、Tracing Beam、Google Gemini Effect、Resizable Navbar 补充实际滚动和状态断言；Sticky Banner 按当前官方演示录制内层阅读时保持粘性与点击关闭，并修正此前不准确的滚动隐藏说明。用户指出的波带、悬浮导航和文章光束已人工核对关键帧，并在真实应用弹窗内确认播放新版文件。
- 修复后：350 条可播放、3 条待整理；309 条新实录的逐帧灰色填充检查全部通过，文件摘要均与采集证据相符，309 个文件均已更新。证据见 [修复清单](../artifacts/video-diagnosis/repair-completion.json)、[全量画幅检查](../artifacts/video-diagnosis/stability-repaired-all.json) 和 [三条专项验收](../artifacts/video-diagnosis/repaired-three-acceptance.md)。画幅检查识别已复现的录屏污染，五个滚动案例另有真实触发验收，不将它表述为全部案例的语义自动验证。
- 最终验证：65 项应用测试、3 项离线真实录屏回归通过，构建通过；应用回归覆盖全部 350 条视频解码、选型、刷新恢复、换组和确认内容导出。一次视频加载报错未再次复现，独立 HTTP/Range/摘要与原生播放检查正常，完整应用回归随后通过。结果见 [smoke-report.json](../artifacts/smoke-report.json) 与 [实际弹窗回归](../artifacts/video-diagnosis/repaired-ui-report.json)。

## 三条录制动作卡顿修复（2026-10-12）

- 用户反馈 Card Stack、Container Scroll Animation、Macbook Scroll 卡顿。逐帧对照确认 Card Stack 的自动动画原本连续，但通用 `stack` 滚轮操作把整页和文档移入画面；后两条原录像每滚 100px 后停约 350ms，造成明显分段跳动。
- Card Stack 改为固定文档位置，录到至少两次原生自动置顶；屏幕与笔记本改为 4.2 秒按浏览器动画帧连续阅读滚动，再用 1.8 秒回看，保留真实组件与其旋转变换。三条已重录并更新封面、采集证据和目录，未改变组件源码或使用补帧生成。
- 采集浏览器改为 regular Chromium 新无头模式与 `--enable-gpu`，默认单案例录制。本机对照观察到旧模式使用 SwiftShader，新模式使用 RTX 4060 Ti；这能避免较重案例的软件渲染争用，但不能把浏览器动画帧率当成视频帧率。编码保持 25fps，现有其他视频未据此批量改写。
- 三条真实原站动作回归通过。新版 Container/Macbook 的连续运动段各检查 105 帧，帧变化占比 100%、完全重复帧 0；Card Stack 录到两次自动置顶且背景固定，无安装文档进入。实际应用大弹窗各播放约 5 秒，掉帧 0、无缓冲等待，服务文件摘要与新采集证据一致。参考库保持 350 条可选、3 条待整理。
- 证据：[录制动作与逐帧验收](../artifacts/stutter-diagnosis/final-acceptance.md)、[实际播放验收](../artifacts/stutter-playback/repaired-summary.json)；回归命令 `node --test tests/source-motion.test.mjs`。
