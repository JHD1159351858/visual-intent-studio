# 原站演示录制

`node scripts/capture-sources.mjs` 会访问知识库中尚无已验证视频的公开组件页面，将页面实际运行的演示录制为本地 WebM；60fps 案例则保存其公开视频并转码。它不会重绘组件，也不会用通用效果替代某条案例。

前提：已安装依赖、Playwright Chromium，以及在 PATH 中可用的 `ffmpeg` / `ffprobe`。

```powershell
node scripts/capture-sources.mjs --concurrency=1
node scripts/capture-sources.mjs --source=reactbits --limit=10
node scripts/capture-sources.mjs --ids=某条案例ID --retry --concurrency=1
node scripts/capture-sources.mjs --ids=某条已录制案例ID --force --retry --concurrency=1
```

默认同时录制 1 个案例，可显式选择最多 3 个，每条采集后短暂等待；已成功采集的条目会跳过，失败记录默认跳过，指定 `--retry` 才重试。用 `--force --ids=...` 可以重新采集指定的原站实录或原视频，已有十三个简化参考演示不被覆盖。真实页面 403、404、访问验证、付费占位、素材未加载均进入失败清单。

采集使用 regular Chromium 的新无头模式与 `--enable-gpu`，让可用显卡参与渲染。当前 Windows 设备对照确认默认 headless shell 使用 SwiftShader，而新模式使用 RTX 4060 Ti；不能将编码容器的 25fps 当成源画面实际刷新率。模式选择见 [Playwright 浏览器说明](https://playwright.dev/docs/browsers) 和 [Chromium 无头 GPU 说明](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/gpu/using-gpu-hardware-in-headless-chrome.md)。

React Bits 使用官方 DOM 的 `.preview-panel .demo-container` 区域，Aceternity 使用 `.preview` 区域；录制前关闭首访的更新弹窗。鼠标移动、悬停、原站重播按钮、演示按钮及滚动用于触发真实互动。对演示内按钮、输入、链接或图片按实际元素边界悬停；文本输入使用测试文字，不提交表单。上传演示使用脚本内生成的 `visual-intent-demo.txt`，摄像头演示只使用 Chromium 的合成测试图案，两者均在证据中注明，不读取用户文件或摄像头。FFmpeg 只去掉加载过程、裁切演示区域并调整录像画幅，不生成新效果。

微交互按实际控件分别触发：按住 Hold Button、拖动滑块和 Swipe Row、逐格输入 Code Slots、下拉菜单展开、票根撕开、碎纸拖入槽、通知出现和滑走、加载状态切换等。Voice Pill 使用原站模拟电平，Slide Commit 与 Sling Button 只操作原站示例。自动状态动画从重播开始录到完成。证据记录每条实际操作。

React Bits 始终裁切整个真实演示区域，避免把右上角重播按钮误当成内容。按钮动作只在演示画幅内执行，并核对操作后的区域位置；页面因焦点或组件重播而滚动时恢复演示位置。

需要文档滚动的案例有单独的实际触发流程：Floating Navbar 验证上滚后导航显现且位于画幅内；Tracing Beam 验证文章阅读推动 SVG 渐变；Google Gemini 验证曲线路径绘制进度；Resizable Navbar 验证跨越阈值后的宽度变化。Sticky Banner 当前官方示例未开启滚动隐藏，录制内层阅读时保持粘性与点击关闭，资料说明与该演示保持一致。这些分支不再执行通用的悬停或滚动猜测，状态和封面时刻记录在采集证据中。

Card Stack 固定文档位置，录到至少两次原生自动置顶，避免把 `stack` 名称误判为需要滚轮。Container Scroll Animation 与 Macbook Scroll 按浏览器动画帧连续阅读滚动，不再逐 100px 停留；保留完整屏幕区域并验证原组件旋转变化。真实原站回归命令为 `node --test tests/source-motion.test.mjs`。

Aceternity 部分旧组件地址已迁移。清单保留知识库原始 `sourceUrl`，另记 `resolvedSourceUrl` 为公开官方替代页面。`parallax-scroll-2` 的当前来源为 `parallax-scroll` 同页，但现有页面只有首个演示，因此旧第二变体进入未验证失败清单；不能把首个演示冒充第二变体。

输出：

- `media/sources/<entryId>.webm` 与同名 `.png`：视频和封面。
- `data/preview-captures.json`：`captures` / `failures` 清单，按 `entryId` 和来源地址关联。
- `artifacts/source-captures/<entryId>.json`：HTTP 状态、标题、演示 DOM、裁切范围、操作、素材加载与浏览器错误、视频 SHA-256、实际解码结果。
- `artifacts/source-captures/*-failed.json` 与截图：未通过检查的原因。

封面在浏览器录制关闭后从最终 WebM 离线取帧。录制中不能使用裁切截图：它会临时改变 screencast 帧尺寸，造成缩小、灰色填充和跳闪。片段保留完整操作过程，最少约 7.5 秒；不再固定截取最后 7.5 秒而漏掉较早的触发操作。

视频只有在 Chromium 实际加载、解码和播放成功，分辨率 960×600、播放时间增长、画面非空，且逐帧灰色填充检查通过后才写入 `verified: true`。原站实录标为 `source-recording`；60fps 原视频保留完整原始时长和画面比例，标为 `original`，并核对案例标题、主 `VideoObject` 及素材地址。已有十三个简化参考演示保持 `reference-recording`。灰色填充检查只识别已复现的录制污染，不能代替每个效果的语义验收。

可单独检查录像稳定性与运行真实录屏回归：

```powershell
node scripts/check-video-stability.mjs
node --test tests/video-stability.test.mjs
```

此脚本只生成采集清单，不直接修改目录资料。合并时应保留用户补充内容，成功视频可以变为可选；失败项应保留明确原因，不伪造预览或将其加入视频推荐。
