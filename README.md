# 见意 · 视觉需求工作台

把日常语言中的页面想法，通过真实设计案例和视频参考，生成可交互 HTML Demo 与对应的专业开发提示词。

## 在 Windows 上启动

需要 Node.js 22.12 或更高版本。双击项目根目录的 `启动.cmd`，或在 PowerShell 中运行：

```powershell
npm.cmd install
npm.cmd run dev
```

打开 http://127.0.0.1:5173 。前端使用 5173 端口，接口使用 3001 端口，均仅绑定本机。

也可以运行构建后的页面：

```powershell
npm.cmd run build
npm.cmd start
```

打开 http://127.0.0.1:3001 。

## 使用流程

1. 在工作台输入页面用途、功能和想法，点击输入框旁“生成提示词”得到完整专业开发提示词，可复制或下载后交给其他模型实现。“找参考”只查询视频案例；“生成页面”单独生成可操作 Demo 与对应提示词。
2. 播放候选视频，点击“采用这个”，填写使用位置和需要调整的内容。
3. “换一组”直接轮换当前阶段的本地可用案例，不调用AI、不写入聊天；想按描述匹配时使用“找参考”。选择时指定对象、部位和叠加/替换方式；玻璃表面与渐变边框可以共存，替换仅影响同一对象的对应部位。
4. 右侧支持修改、移除和“重置”。重置清空当前整页需求、待确认草稿和已确认选择，保留聊天、输入及其他对话；刷新后仍为空。生成进行中不能重置。
5. 点击工作台下方“生成页面”，查看页面预览、页面方案和专业提示词。可以下载独立 HTML，或复制、下载对应的提示词；没有选择参考时也能根据用途与功能直接生成。
6. 在“修改这个页面”中输入局部修改要求。生成接口会带上当前页面与方案，返回完整的新页面和同步更新的提示词；失败或停止时保留此前成功版本。明确删除的效果会同步从已确认选择中移除。刷新后恢复当前 Demo；需求或参考选择后来变化时，旧页面会标记“需求已变化，当前显示上一版”。
7. 右侧“导出开发需求”仍可下载已确认参考的 Markdown，包含作用范围、保留要求和后续用户补充。

未配置模型时，应用明确显示手动选型：可以浏览、观看、选择、保存与导出，展示的参考不是 AI 匹配结果。

专业提示词通过 `/api/design-prompt/stream` 独立流式输出，携带匹配规范、组件参数、真实来源和已确认部位；效果实现以机制说明和参数提供，不附带整页或组件源码；多轮修改仅携带最近一份完整提示词，用户需求与已确认选择保留。输出仍只允许提示词正文。网页显示解码后的正文，可复制、下载和刷新恢复，不将JSON包装或HTML代码当聊天答复。Coze默认连续5分钟无有效正文或思考进展才超时，有效进展续期，另设10分钟总上限；兼容接口仍为90秒；正式答案继续流式显示，超时与连接中断分别提示，失败保留需求与选择。新的[Coze提示词模式说明](docs/Coze-提示词模式说明.md)将该智能体限定为只写页面开发提示词，并提供[完整输出样例](docs/coze-knowledge/07-页面开发提示词输出样例.txt)；它不兼容旧Demo代码生成/修改入口。替换本地文件不等于云端已保存或发布。

### 整页范例与原生组件

参考库的“整页与组件”入口提供 7 套可操作页面：聊天助手、知识问答、写作工具、数据分析、报告生成、智能体门户，以及知页强动效知识空间。每套保存用途、功能、区域结构、配色、字体、间距、交互与搭配规则，可预览、下载独立 HTML 和对应开发提示词。“参考这套页面”会将用途放入需求输入框，可以补充后生成。

强动效知识空间使用六项真实来源作原生适配：极光、响应点阵、立体倾斜、移动边缘、磁吸按钮和轮换标题；配合持续浮动的课程书册，支持暂停、减少动态偏好与课程资料查询。独立文件为 `design-library/pages/knowledge-motion.html`，配套提示词和浏览器验收记录位于 `artifacts/strong-motion-20261015/`。当前本地预览可用 `npx tsx artifacts/strong-motion-20261015/preview-server.ts`，将同源工作台和样例服务在 5173 端口。

同时提供 20 个高频组件的原生 HTML/CSS/JavaScript 适配实现，每项关联已有可播放参考的真实 ID 和来源地址，记录作用部位、参数、兼容搭配、冲突、移动端与减少动画的行为。点击“采用这个实现”后仍需确认具体对象与作用部位；玻璃内部与渐变边缘分别使用 surface 和 border。

页面代码生成接口会根据用途、最新动效强度与明确指定的范例选择整页资料，并优先带入已确认组件的完整代码；每次最多 1 套整页与 3 项基础组件，普通模式资料总量不超过 30,000 字符，强动效模式上限 45,000 字符。专业提示词接口在DeepSeek模式下由模型自主搜索全库、读取候选的完整实现知识后组合，不把350条详情全部放入首次请求，也不限制在20项本地适配内；Coze与其他兼容服务仍使用目录及逐项摘要上下文。不发送完整整页HTML或组件源码；明确点名的整页范例只补充其构图与行为。最新明确的强动效、降低动态或纯静态要求优先于旧描述。页面用途不匹配时不会强加范例，未确认的搭配会列为假设。局部页面修改保留当前 HTML，整页范例只提供规则，不重新载入整套布局。这里的组件为本项目的原生适配，完整来源组件集成需另行核对。

数据分别位于 `data/design-pages.json` 和 `data/design-components.json`，演示与海报位于 `design-library`。这 26 项设计实现补充现有 350 条视频参考，不改变视频发布名单。

```powershell
# 导出供 Coze 导入的整页与组件资料，不覆盖原有案例文档：
npm.cmd run export:design-knowledge
# 保持本地服务运行，验证 API、隔离预览、确认与下载流程：
npm.cmd run verify:design-library
# 验证整页和组件各自的演示交互：
node scripts/verify-page-recipes.mjs
node scripts/verify-native-components.mjs
```

本地模型请求会自动携带匹配资料；以上导出命令只创建文件，不上传或修改 Coze 云端知识库。补充导入文件为 `docs/coze-knowledge/05-整页设计范例.txt` 与 `06-高频组件实现.txt`，细节见 [设计资料说明](docs/design-library.md)。

## 接入模型

复制 `.env.example` 为 `.env`。默认直接接入 DeepSeek，由本地项目读取参考库、匹配案例、携带设计规范并生成专业页面提示词，不调用 Coze：

```dotenv
MODEL_PROVIDER=deepseek
MODEL_BASE_URL=https://api.deepseek.com
MODEL_NAME=deepseek-flash
MODEL_API_KEY=你的DeepSeek密钥
PORT=3001
```

重启服务后可使用智能推荐和流式提示词生成。也支持已有的 `DEEPSEEK_API_KEY` 环境变量；`MODEL_API_KEY` 优先。显式选择 DeepSeek 后，即使保留 Coze 密钥也不会调用 Coze；没有 DeepSeek 密钥时显示手动模式，不静默回退其他服务。密钥由后端读取，不写入页面和浏览器存储，`.env` 已从 Git 中排除。

DeepSeek 使用官方 Chat Completions和SSE，开启思考模式，网页展示实际搜索/读取进度与正式正文。专业提示词使用真实工具调用，最终输出仍须符合本地JSON协议；案例推荐接口仍使用JSON模式。连续5分钟没有正文、思考或工具进展时超时，每次生成或相似组合重选各有10分钟上限；有效进展续期，普通心跳不续期，用户停止会关闭本地请求。来源ID与地址、已确认对象和部位仍由本地校验。传入的是案例记录和效果机制，不代表模型已观看本地视频；只存在 Coze 云端的独有资料不会自动迁移。官方协议见[思考模式](https://api-docs.deepseek.com/zh-cn/guides/thinking_mode/)与[工具调用](https://api-docs.deepseek.com/guides/tool_calls/)。

专业提示词首次只携带需求、设计规则、库规模和用户已确认或明确点名案例的详情。模型可调用 `search_reference_library` 按名称、口语描述、实现机制、场景、阶段及作用部位检索全部可播放案例，每次最多12个摘要；用 `get_reference_details` 每次读取1–8项完整知识，可读完再改查询继续找。搜索命中本身不代表已读取；最终采用的案例及主视觉引用必须来自本次成功读取或预读资料，否则显示错误并保留输入，不保存失败选材记录。工具每次生成最多8轮模型请求、累计24次调用，不会在失败时自动灌入全库。近期高频降权只在相关度接近时影响顺序，已确认的作用层和保留规则优先，相似组合重选仍能搜索全库。工具只能读取本地案例数据，不能执行来源代码或访问任意文件。

本地生成请求每轮自动携带执行规则与检索到的参考资料。提示词先明确实施范围、首屏构图和视觉必做清单，再展开具体效果、功能与验收；视觉重建会区分保留的业务和要替换的旧视觉，局部修改保持范围。规则随页面用途和动效偏好选材，不固定课程书册或深蓝风格。无需手动重复粘贴执行前言；生成器仍只输出开发提示词，页面由下游开发模型实施并报告实际验证结果。

运行时的执行与设计规范统一维护在 `server/design-prompt-instructions.ts`，按动效强度、是否启用工具和是否重选附带本轮规则；不再通过上下文重复发送整份 `01-设计与使用规则.txt`。该TXT保留用于Coze云端知识库导出；修改本地运行时规范应修改前述紧凑指令，不等于云端已更新。同一需求的离线请求对比见 `artifacts/prompt-compression-20261025/`，其中字符数是请求大小指标，不是计费Token数。

提示词生成会提供全部已验证可播放案例的文字元数据和精确来源地址，供模型按用途、材质与运动方式比较选材；不再使用固定组件白名单与关键词前六项截断。原生适配说明仅辅助理解机制，整页范例仅在用户点名时注入，不默认采用同一套构图。输入比少量候选更长；不会上传视频或声称模型已观看。用户要求换风格时替换未确认的主视觉与搭配，已确认效果和局部修改范围仍优先保留。

逐项实现知识独立保存于 `data/case-knowledge/reactbits.json`、`aceternity.json`、`60fps.json`，按真实案例ID与来源地址绑定，不改写案例目录或用户备注。每条包含具体方法步骤、适用与避免场景、作用层、依赖/参数、限制、手机/减少动态/性能建议及证据。DeepSeek通过工具按需读取完整资料；其他兼容模式携带全库同规格摘要。已有完整知识的案例不再默认额外突出20项本地演示；用户明确指定的本地适配仍可作为有作用范围的补充。源码整理与公开视频行为适配分开标记，不代表350个来源组件均已安装或运行。

模型以本轮分配的 `refKey` 短编号引用案例，服务端严格映射回真实ID，并为最终提示词补上准确来源。这样减少长ID和来源路径的抄写错误；未知编号仍拒绝，不根据名称或相似字符串猜测案例身份。界面、导出和近期选材记录继续使用原有真实ID。

运行 `npm.cmd run export:case-knowledge` 可校验全部可用案例的覆盖并导出 [完整实现知识](docs/reference-implementation-knowledge.md) 和 `data/case-knowledge/manifest.json`。该命令不调用模型、不上传Coze，也不执行外部源码。React Bits证据使用案例原有锁定版本，重新采集可运行 `node scripts/build-reactbits-knowledge.mjs`；其余来源可从已有证据重建 `node scripts/build-other-case-knowledge.mjs`。

生成成功后，近期选材摘要保存在本机 `data/selection-history.json`，最多保留30个页面；同一对话修订会替换旧记录，不累计频次。只保存页面用途摘要、真实案例ID与主视觉机制，不保存聊天、完整提示词或密钥；此前的评测结果不会自动导入。频繁采用的动态效果仅在用途适配接近时温和降权，全部案例仍可选；用户已确认或明确点名的效果优先保留。主要视觉组合高度相似时，最多尝试一次重新选材；保持功能、风格、强度与已确认作用范围，失败、仍然相似或丢失需求时保留初稿，允许合适的重复。按钮与加载等辅助交互不触发整页主视觉重选。新历史会逐步积累，不承诺每页都完全不重复，也不把不同来源数量当作审美评分。

其他兼容服务可设 `MODEL_PROVIDER=compatible`，再填写对应的 `MODEL_BASE_URL`、`MODEL_NAME` 和 `MODEL_API_KEY`。

推荐会携带当前阶段、已确认选择、对话与调整意见。模型只能返回知识库中存在、视频预览已经验证的条目；调用失败后可以重试，已确认需求保留。

### 接入 Coze（扣子）智能体

在本地 `.env` 中填写：

```dotenv
MODEL_PROVIDER=coze
COZE_BASE_URL=https://api.coze.cn
COZE_API_KEY=你的访问令牌
COZE_BOT_ID=你的智能体ID
```

仅在需要调用 Coze 时设 `MODEL_PROVIDER=coze`。`COZE_API_KEY` 和 `COZE_BOT_ID` 必须同时存在；仅有密钥不能调用智能体。未设置 `MODEL_PROVIDER` 的旧配置仍沿用两项齐全时优先 Coze 的行为；显式 `deepseek` 或 `compatible` 会跳过 Coze。Bot ID 是智能体开发页地址中 `/bot/` 后的数字；智能体需发布到 API 渠道，令牌需具备该智能体的 `chat` 权限。后端读取 Coze 的增量回复，并通过 `/api/recommend/stream` 转发可读中文，网页即时显示；完整 JSON 与真实案例 ID 校验通过后才更新候选与保存最终回复。无需轮询状态或读取消息列表。配置后重启服务，密钥仅由后端读取。

Coze 智能体需要按以下格式返回一条纯文本 JSON（`entryId` 必须从请求提供的 `availableCatalog` 中选择）：

```json
{"message":"解释推荐理由或提出澄清问题","candidates":[{"entryId":"目录中的真实ID","reason":"与需求的匹配理由"}]}
```

每次请求发送当前可播放目录、对话和已确认选择，由服务端再次检查候选是否真实可用并限制最多三个。Coze 流式对话连续5分钟无有效进展超时、总上限10分钟；只向网页展示 `message` 文本，不透传 JSON、工具输出或思考内容。页面关闭会取消上游请求；失败时清除未完成的临时回复，保留已确认选择并允许重试。兼容 Chat Completions 配置仍在完整结果返回后展示消息。本版本不支持需要端插件或额外操作的对话。

接口依据扣子官方的[发起对话与流式响应](https://docs.coze.cn/developer_guides_chat_v3)文档。

### 填充 Coze 云端知识库

本地参考库随推荐请求传入模型，与 Coze 后台的持久知识库是两项不同配置。可用以下命令将当前已验证案例导出成 Coze 支持的 TXT 文档：

```powershell
npx.cmd tsx scripts/export-coze-knowledge.ts
```

导入文件与步骤见 [Coze 知识库导入说明](docs/coze-knowledge/README.md)。首版包括 350 张案例卡片及设计组合、作用层与证据边界规则；保留用户备注和真实 ID，待整理案例不导出。导出不等于已经上传或绑定，云端需完成文本知识库导入、智能体绑定和 API 重新发布。每次本地案例发生变化后，应重新导出并替换云端对应文档。

## 知识库来源

- Designeer：设计来源目录，方便发现网站。
- React Bits、Aceternity UI：公开组件目录，支持从“来源管理”同步。
- Codrops、60fps：支持导入具体案例页，提取描述、演示或实现参考。

首版已提供 353 条完整资料，其中 350 条通过浏览器播放验证并可用于选型，另外 3 条待整理资料保留来源、实现参考和失败原因，不计入 350 条。可播放案例来自 React Bits 213 条、Aceternity UI 109 条、60fps 28 条，覆盖结构 66 条、样式 90 条和效果 194 条。预览包括 309 段原站实录、28 段原视频和 13 段本地参考演示，详见 [目录填充报告](data/catalog-fill-report.json)。

首版固定名单已写入 [catalog.release.v1.json](data/catalog.release.v1.json)，保存 350 个案例 ID、来源及阶段统计。350 条视频解码、65 项测试、构建、来源更新与完整选型导出流程均通过；浏览器验收记录见 [smoke-report.json](artifacts/smoke-report.json)。

每条资料包含原名、中文名称、具体可见行为、口语别名、结构/样式/效果分类、触发方式、适用位置、标签、来源地址和实现参考；另保存视频、海报、验证状态、录屏归属及中文整理的核验时间和证据地址。没有公开源码的案例会明确说明。

预览按实际来源标记：`source-recording` 是在原站真实演示区域录制的浏览器视频；`original` 是保存来源公开提供的视频后转码的素材，60fps 的产品视频采用此标记并保留原始画面比例；`reference-recording` 是根据来源制作的本地机制演示，共十三段，包括初始十二段和 Moving Line 的补充演示，与原组件的完整渲染有差异。尚未通过视频验证的条目保留为“待整理”，不参与视频推荐。

数据保存于 `data/catalog.json`，首次启动从 `data/catalog.seed.json` 建立。更新以规范化来源地址去重，保留用户补充的口语别名、备注及已验证预览。中文资料位于 `data/enrichment`，总量与待整理原因见 [目录填充报告](data/catalog-fill-report.json)；来源证据和预览说明见 [sources.md](docs/sources.md)。

部分网站会拒绝自动访问。当前环境的 Codrops 直采返回 HTTP 403，页面会显示导入失败并保留已有目录；这不影响组件目录同步及本地案例选型。失效页面、空白演示、加载失败或无法核验的旧变体会保留明确原因，不用无关动画补位。

## 采集原站预览并填充目录

需要联网、Playwright Chromium，以及 PATH 中可调用的 `ffmpeg`、`ffprobe`：

```powershell
npx.cmd playwright install chromium
node scripts/collect-60fps-metadata.mjs
npx.cmd tsx scripts/populate-catalog.ts
node scripts/capture-sources.mjs --concurrency=3
npx.cmd tsx scripts/populate-catalog.ts
```

60fps 整理脚本从公开站点地图核对新增的 27 个具体案例页，提取与案例标题对应的 `VideoObject`、视频地址和海报，保存中文资料 [60fps.zh.json](data/enrichment/60fps.zh.json) 与来源证据 [60fps.evidence.json](data/enrichment/60fps.evidence.json)。第一次填充把这些资料加入目录，第二次填充合入播放验证结果。

也可运行 `npm.cmd run capture:previews` 和 `npm.cmd run fill:catalog` 完成预览采集与合并。组件采集打开真实来源页，定位演示并执行鼠标、点击、输入或滚动，再裁切录屏；60fps 则保存页面公开的视频素材并转码为本地 WebM，保留完整原始帧比例，短素材循环播放。视频与海报保存到 `media/sources`；只有解码、播放与非空画面检查通过后才写入验证记录。文件上传与摄像头示例使用合成测试素材，证据注明操作，不读取用户文件或摄像头。

已完成录像及已记录的失败默认跳过；需要重试时加 `--retry`，也可用 `--source=reactbits` 或 `--ids=案例ID` 指定范围。采集清单见 [preview-captures.json](data/preview-captures.json)，逐条过程与失败报告在 `artifacts/source-captures`。`fill:catalog` 将中文资料和验证过的录像合入本地目录及种子，按规范化来源地址去重，并更新目录填充报告。

## 重新录制本地参考演示

```powershell
npx.cmd playwright install chromium
npm.cmd run record:demos
```

这个脚本重录标记为 `reference-recording` 的本地 HTML 机制演示，包括初始十二段和 Moving Line 补充示例。它操作鼠标、滚动和点击生成 WebM 视频，视频位于 `media`，演示位于 `demos`；扩充目录的原站预览使用上一节的采集命令。

只重录 Moving Line 时运行 `npm.cmd run record:demos -- --ids=dc50ae9866b7171d`，保留其他录像的验证记录。该示例演示随滚动伸缩的竖向光线，来源与简化边界见 [sources.md](docs/sources.md)。

## 验证

```powershell
npm.cmd test
npm.cmd run build
# 保持 npm.cmd run dev 运行，再执行：
npm.cmd run test:e2e
# 原站录屏逐帧稳定性检查与离线回归（需要 FFmpeg）：
node scripts/check-video-stability.mjs
node --test tests/video-stability.test.mjs
# 实际官网滚动效果回归（需要网络与 Playwright Chromium）：
node --test tests/source-scroll-actions.test.mjs
node --test tests/source-motion.test.mjs
# 可选：实际同步来源并检查去重与保留行为，需要网络：
node scripts/check-sources.mjs
```

配置实际模型 API 后可运行：

```powershell
npm.cmd run evaluate:model
```

评测使用二十条固定口语描述，检查目标是否出现在前三个候选，要求至少十六条命中。结果写入 `artifacts/model-evaluation.json`。没有 API 配置时脚本退出并说明未执行，不生成匹配成绩。

生成通过服务端配置的 Coze 智能体或兼容模型接口完成，`/api/demo/stream` 使用流式协议。Demo 在隔离 iframe 中运行，HTML 不依赖外部脚本、字体或图片；真实后端功能未配置时使用明确标注的演示交互。服务端检查真实引用、作用范围、HTML 和脚本语法，校验失败最多请求模型修正一次；鉴权、网络或取消不重试。模型生成的页面仍需在预览中核对，语法检查不等于功能验收，参考视频可播放不代表来源组件已经集成。Coze选型请求采用上述空闲与总等待时限，页面生成单次模型调用最多180秒，生成或修改及其修正共享300秒。

本项目是本地单人应用；没有在线账号或公开部署能力。
