import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import ts from 'typescript';

const root = process.cwd();
const evidenceDir = path.join(root, 'data/case-knowledge/evidence/reactbits');
const reportDir = path.join(root, 'artifacts/case-knowledge-20261025');
const hash = value => createHash('sha256').update(value).digest('hex');
const catalog = JSON.parse(await readFile(path.join(root, 'data/catalog.json'), 'utf8')).filter(entry => entry.sourceId === 'reactbits' && entry.status === 'ready' && entry.preview.type === 'video' && entry.preview.verified);
const cliOf = entry => new URL(entry.implementationUrl).pathname.split('/').at(-1).replace(/\.jsx$/, '');

async function fetchRegistry(entry) {
  const match = entry.implementationUrl.match(/^https:\/\/github\.com\/DavidHDev\/react-bits\/blob\/([a-f0-9]{40})\/(.+)$/);
  if (!match) throw Error(`Unpinned official source: ${entry.id}`);
  const cli = cliOf(entry);
  const url = `https://raw.githubusercontent.com/DavidHDev/react-bits/${match[1]}/public/r/${cli}-JS-CSS.json`;
  const directory = path.join(evidenceDir, cli);
  const cached = await Promise.all([readFile(path.join(directory, 'registry.json'), 'utf8'), readFile(path.join(directory, 'meta.json'), 'utf8')]).catch(() => null);
  if (cached) {
    const meta = JSON.parse(cached[1]);
    if (meta.url === url && meta.sha256 === hash(cached[0])) return { entry, registry: JSON.parse(cached[0]), meta };
  }
  let content; let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'visual-intent-case-knowledge' } });
      if (!response.ok) throw Error(`HTTP ${response.status}`);
      content = await response.text(); break;
    } catch (error) { lastError = error; if (attempt < 2) await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 600)); }
  }
  if (!content) throw Error(`${entry.id} ${url}: ${lastError?.message}`);
  const registry = JSON.parse(content);
  if (registry.name !== `${cli}-JS-CSS` || !Array.isArray(registry.files) || !registry.files.some(file => /\.jsx$/.test(file.path) && typeof file.content === 'string')) throw Error(`Invalid source registry: ${entry.id}`);
  await mkdir(directory, { recursive: true });
  const files = [];
  for (const file of registry.files) {
    if (typeof file.content !== 'string' || file.path.includes('\\') || file.path.split('/').some(part => part === '.' || part === '..' || !part)) throw Error(`Invalid registry file path: ${entry.id}`);
    const local = path.resolve(directory, 'source', file.path);
    if (!local.startsWith(path.resolve(directory, 'source') + path.sep)) throw Error(`Source path escapes evidence folder: ${entry.id}`);
    await mkdir(path.dirname(local), { recursive: true });
    await writeFile(local, file.content, 'utf8');
    files.push({ path: file.path, sha256: hash(file.content), bytes: Buffer.byteLength(file.content) });
  }
  const meta = { entryId: entry.id, sourceUrl: entry.sourceUrl, url, commit: match[1], implementationUrl: entry.implementationUrl, checkedAt: new Date().toISOString(), sha256: hash(content), files };
  await writeFile(path.join(directory, 'registry.json'), content, 'utf8');
  await writeFile(path.join(directory, 'meta.json'), JSON.stringify(meta, null, 2) + '\n', 'utf8');
  return { entry, registry, meta };
}

// Read prop defaults through the JavaScript AST, never execute the collected components.
function sourceFacts(registry) {
  const componentName = registry.name.replace(/-JS-CSS$/, '');
  const jsx = registry.files.filter(file => /\.jsx$/.test(file.path));
  const source = registry.files.map(file => file.content).join('\n');
  const defaults = {};
  const signatures = [];
  for (const file of jsx) {
    const ast = ts.createSourceFile(file.path, file.content, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
    const inspect = node => {
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'DEFAULT_CONFIG' && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
        signatures.push({ length: node.initializer.properties.length, props: node.initializer.properties.filter(ts.isPropertyAssignment).map(item => ({ name: item.name.getText(ast), value: item.initializer.getText(ast) })) });
      }
      if ((ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)) && node.parameters?.[0] && ts.isObjectBindingPattern(node.parameters[0].name)) {
        const parameter = node.parameters[0];
        const props = parameter.name.elements.map(item => ({ name: item.propertyName?.getText(ast) || item.name.getText(ast), value: item.initializer?.getText(ast) })).filter(item => !item.name.startsWith('...'));
        let primary = node.name?.getText(ast) === componentName;
        for (let parent = node.parent; parent && !ts.isBlock(parent) && !ts.isSourceFile(parent); parent = parent.parent) if (ts.isVariableDeclaration(parent) && parent.name.getText(ast) === componentName) primary = true;
        if (props.length >= 2) signatures.push({ props, length: props.length + (primary ? 10000 : 0) });
      }
      if (ts.isVariableDeclaration(node) && ts.isObjectBindingPattern(node.name) && node.initializer?.getText(ast) === 'props') {
        const props = node.name.elements.map(item => ({ name: item.propertyName?.getText(ast) || item.name.getText(ast), value: item.initializer?.getText(ast) })).filter(item => !item.name.startsWith('...'));
        signatures.push({ props, length: props.length + 10000 });
      }
      ts.forEachChild(node, inspect);
    };
    inspect(ast);
  }
  const props = signatures.sort((a, b) => b.length - a.length)[0]?.props || [];
  for (const prop of props) if (prop.value && prop.value.length <= 120 && !/=>|function|\bwindow\b|\bdocument\b/.test(prop.value)) defaults[prop.name] = `锁定源码默认：${prop.value}`;
  const imports = jsx.flatMap(file => [...file.content.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(match => match[1])).filter(value => !value.startsWith('.') && value !== 'react');
  return { source, defaults, propNames: props.map(prop => prop.name), imports: [...new Set(imports)], usesCanvas: /<canvas|createElement\(['"]canvas|CanvasRenderingContext2D|getContext\(['"]2d/.test(source), usesWebGL: /WebGL|webgl|ShaderMaterial|new Renderer|fragmentShader|fragmentShader|gl_FragColor/.test(source), usesRAF: /requestAnimationFrame|useFrame\(/.test(source), usesSVG: /<svg|createElementNS\(.+svg|<textPath|<path\s/.test(source), usesScroll: /ScrollTrigger|useScroll\(|addEventListener\(['"]scroll|scrollTop/.test(source), usesPointer: /pointermove|mousemove|onMouseMove|onPointerMove|useDrag|onDrag/.test(source), usesCamera: /getUserMedia/.test(source) };
}

const profiles = {
  LiquidEther: {
    summary: '锁定版以Three.js的WebGLRenderer和多渲染目标实现二维速度场：平流、可选BFECC、粘性与压力Poisson迭代形成持续液体流动，鼠标/触摸注入力并用调色板着色；不是单纯移动CSS渐变。',
    steps: ['在有明确宽高的容器初始化WebGLRenderer、速度/散度/压力纹理与调色板，resolution决定模拟尺寸。', '按dt执行速度平流、可选BFECC修正及粘性迭代，再用Poisson压力迭代和压力梯度修正速度，最后输出颜色场。', '将指针/触摸位置换算到局部场坐标，以mouseForce与cursorSize注入力；autoDemo在无人操作时提供自动驱动轨迹。', '使用源码的ResizeObserver、IntersectionObserver与动画清理；接入建议将canvas置于独立背景层，表单与正文保持稳定。'],
    suitableFor: ['互动品牌首屏的颜料或流体氛围', '创意展览、音乐或科学主题的装饰背景'],
    avoidFor: ['需要真实流体测量、化学反应或CFD计算结果的科学可视化'], layers: ['page-background'],
    limitations: ['该锁定版本依赖Three.js和可用WebGL，不能按当前官网同名新版的无依赖实现说明。', '多次粘性和压力迭代增加GPU负担；流体色场是装饰模拟，不代表真实实验数据或化学过程。'],
    mobile: '项目接入建议：降低resolution、iterationsPoisson和iterationsViscous后实机观察，保留低成本自动流动，触屏拖动不要阻断页面滚动。',
    reducedMotion: '项目接入建议：用户暂停或系统减少动态时停止推进模拟并显示静态取色画面，核心操作仍可用。',
    performance: '项目接入建议：优先减少模拟分辨率和压力迭代，离屏暂停、卸载释放WebGL资源；不要同时叠加第二个全屏流体模拟。'
  },
  GlassSurface: {
    summary: '独立内容容器叠加玻璃装饰层：SVG模式以位移贴图分别偏移RGB通道再混合；renderer自动选择SVG/WebGL折射分支或普通backdrop-filter回退，边缘高光和内部内容分层。',
    steps: ['使用独立容器承载children并明确宽高和圆角，为每实例创建唯一滤镜ID与位移贴图。', 'SVG分支通过feImage、三组feDisplacementMap与feColorMatrix分别位移RGB，再以screen混合并模糊；WebGL分支使用独立canvas处理折射。', '按源码的能力检测选择SVG/WebGL或fallback磨砂表面，设置backgroundOpacity、saturation和distortionScale等已存在属性。', '接入建议：新增流动边框时另建掏空中心的border层，保留内部透明度、文字、玻璃背景与点击区域，不把整面surface替换成彩色渐变。'],
    suitableFor: ['有可见背景层的浮动导航或信息卡', '可控制背景、需要折射材质的品牌面板'],
    avoidFor: ['背景本身是单一实色、且要求各浏览器折射完全一致的精确界面'], layers: ['surface'],
    limitations: ['SVG backdrop滤镜与WebGL分支存在浏览器能力差异，源码包含回退，普通模糊回退不等于完整折射。', '必须有背后可见内容才能感知玻璃；大范围折射可能扭曲文字，不能让重要正文参与背景采样。'],
    mobile: '项目接入建议：优先测试fallback和小面积面板，降低折射强度，确保文字对比度和触控区，避免多个全屏backdrop层。',
    reducedMotion: '项目接入建议：保留静态玻璃材质，停止动态背景或采样变化；玻璃本身不强制添加持续动画。',
    performance: '项目接入建议：限制滤镜区域、重复实例与高强度模糊，随容器尺寸刷新位移图而非每次交互重建DOM，卸载清理绘制资源。'
  },
  OrbitImages: {
    summary: '以SVG路径数据生成圆、椭圆等轨道，Motion驱动共享progress；每张DOM图片按索引错开offsetDistance，并以CSS offset-path沿轨道循环，非Three.js三维球面画廊。',
    steps: ['由shape或customPath生成路径字符串，以baseWidth和半径建立设计坐标系；images提供真实图片与替代说明。', '使用Motion motionValue推进0至100的轨道进度，fill为每项加入索引相位，再把结果写入offsetDistance。', '图片DOM设置offsetPath、offsetRotate和offsetAnchor，容器旋转时内部反向旋转保持图片朝向；paused、direction与duration控制播放。', '接入建议：按可用容器缩放并检查responsive配置，中心内容与轨道图片区分层，替代按钮等业务交互需另外实现。'],
    suitableFor: ['合作品牌或项目封面沿轨道展示', '围绕产品主体的装饰性图片首屏'],
    avoidFor: ['需要全部项目同时稳定可读的表格、主导航或重要操作入口'], layers: ['content'],
    limitations: ['依赖CSS motion-path支持和图片加载；轨道尺寸、itemSize和容器裁切不匹配会遮挡内容。', '该来源是路径图片运动，不原生承诺三维球面、透视卡片排序或拖拽选中功能；此类改变须标明适配。'],
    mobile: '项目接入建议：减少图片数量与轨道半径，显式设置响应式尺寸，触屏查看详情用独立点击入口，不依赖悬停。',
    reducedMotion: '项目接入建议：设置paused并固定progress，保留静态图片或改为有序图片带，中心主按钮保持可见。',
    performance: '项目接入建议：使用适当尺寸缩略图、控制并发图片数，复用共享progress与路径，避免为每帧运动触发React重新渲染。'
  }
};

// Each row records a component-specific mechanism read alongside the pinned source.
// Shared renderer/accessibility advice is added separately and is explicitly editorial.
const mechanismRows = `
DotGrid|以实例化圆点绘制规则网格，按指针距离计算影响权重，邻近圆点位移、变色并以回弹函数恢复。|由dotSize和gap建立点阵；缓存各点原位，将proximity内的距离衰减映射到strength，再更新绘制属性。|网格是装饰场，不能冒充真实数据分布；点间距过小会明显增加绘制数量。|科技工具入口,数据产品功能区|精确统计散点图
SpotlightCard|通过局部指针坐标移动独立径向光斑层，使用边缘距离权重调整描边光，正文位于光层之上。|测量卡片边界，将指针映射为渐变中心；按intensity、spotlightSize与softness更新独立光层和可选边缘层。|光斑照亮内部surface，边缘光是另一层；它不是沿轮廓自动行走的光束。|功能与服务卡片,作品或商品摘要|依靠悬停才能阅读正文的内容
TiltedCard|Motion弹簧值将指针相对中心的偏移映射为rotateX和rotateY，悬停放大，离开时回到零角度。|保持外部命中容器稳定，只旋转内部图像平面；图注跟随局部指针位置，分别维护缩放和旋转弹簧。|旋转仅改变展示平面，不能让表单和主要按钮一起漂移；外层与内层transform要分开。|作品封面,商品图展示|需要精确点选的小型表格
TechText|Canvas测量字形并绘制带科技标记的轮廓，指针作用于局部字母，拖动位移由弹簧和阻尼回收。|建立字体度量和字母局部坐标，按reach与softness计算局部影响，抓取字母时更新偏移并绘制虚线及测量标记。|依赖字体加载和Canvas尺寸，不能把装饰字形当成唯一可复制的长正文。|开发者字标,互动品牌签名|长段落或公式正文
TextLoop|SVG路径承载textPath，GSAP不断推进起始偏移，复制文本单元形成连续的曲线路径循环。|按shape和curviness生成路径，测量文本与分隔符长度，拼接足够单元后线性更新startOffset。|路径长度与文本单元不匹配会露出断口；可见文字仍应提供可读的语义副本。|品牌口号分隔带,活动文字徽记|需要逐行阅读的文章
MaskedHeading|字形作为SVG裁切区域，图像或颜色填充在字形下方漂移；GSAP按单词推进揭示遮罩。|等待字体和媒体尺寸后测量单词，生成字形裁切，分别驱动reveal、媒体drift和可选parallax。|只影响标题字形内部，不能将媒体背景铺到整张卡片或遮住标题以外内容。|展览大标题,图像品牌开场|信息密集的说明段落
ParticleText|Canvas将文字栅格采样为目标点，粒子从散开位置插值聚合，按指针距离附加排斥并可再次散开。|等待字体后采样字形像素，按density建立粒子目标与起点，用gatherDuration及stagger安排聚合次序。|粒子密度与字体尺寸决定计算量；文字形状粒子不是三维真实分子或科学数据。|科学主题标题,品牌揭示开场|需要始终清晰的题目答案
SplitFlapText|字符槽拆成上下翻片，生成目标字符之间的翻页序列，逐槽错峰旋转并在中点替换字符。|将输入短句补齐到最长槽位，用charset与flipsPerChar生成中间字符，再按flipDuration和stagger更新前后翻片。|需要限定字符集和最大长度；频繁翻页不适合重要实时读数。|交通主题展示牌,短状态口号|连续阅读文本
WarpText|先把文字栅格化为纹理，再由OGL片元着色器按噪声和指针场扭曲纹理坐标并模拟折射。|测量字体和多行文本生成纹理，将warpStrength、warpScale与pointerInfluence写入uniform，逐帧更新局部扰动。|WebGL字形是图像输出，应保留语义文字；折射过强会降低标题辨识度。|实验字体展示,互动艺术标题|正文、试题和复杂公式
StrokeText|SVG文字层通过描边虚线偏移绘制轮廓，后续填充由独立字形层或擦除遮罩揭示。|测量字形宽度后设置描边长度，GSAP按drawDuration与stagger播放笔画，再以fillDelay进入填充阶段。|这是字体轮廓绘制，不是实际手写笔顺；字体加载前的测量可能不准确。|品牌签名,章节开场|声称模拟真实书写教学
DepthText|多层DOM文字在Z轴错开形成挤出厚度，前景文字和深度副本通过CSS三维变换跟随指针视差。|按layers与depth生成深度层，层色按进度插值，使用perspective及平滑指针偏移旋转整个字形舞台。|层数与depth过大会遮挡相邻内容；多层副本须避免被辅助技术重复朗读。|产品数字海报,游戏活动主标题|长正文与精密公式
FoldText|将文字按行或词分组，各段围绕配置铰链以CSS三维旋转展开，GSAP时间线控制错峰与折痕阴影。|按splitBy建立折叠单元，以hinge设置transform-origin和perspective，滚动到达或配置触发时播放duration与stagger。|折叠是入场运动，不应无限循环折起正在阅读的文字。|编辑栏目标题,故事章节过渡|需持续可见的操作说明
EchoText|重复字形副本分层绘制，位置以不同滞后量追随目标或入场位移，副本最终回收到清晰文字。|根据echoes、offset与direction生成影子层，每层使用不同lag和fade，按mode区分入场或指针响应。|残影复制会增加视觉噪声；副本仅作装饰，文字语义保留一次。|音乐活动标题,速度感品牌文案|阅读和辅助工具正文
SplitText|GSAP SplitText将真实文字拆为字符或单词，ScrollTrigger在阈值进入时错峰执行from到to的动画。|等待字体加载并创建拆字实例，把splitType对应目标交给GSAP；delay是错峰间隔，duration为单次过渡时长。|该锁定版依赖GSAP和@gsap/react；不要把delay默认50与duration默认1.25误当同一单位。|短标题入场,课程章节标题|每次输入都重新拆分的编辑器
BlurText|Motion为拆分后的词或字建立多段关键帧，IntersectionObserver达到阈值后由模糊与偏移过渡到清晰。|按animateBy分词，记录一次可见状态，将from与to快照构成关键帧并按delay错峰播放。|这是视口触发的模糊揭示，不是滚动进度连续控制的ScrollReveal。|介绍标题,产品短说明|加载失败时仍应出现的主要答案
CircularText|将字符依索引旋转排列成圆环，Motion控制容器旋转，悬停行为可减速、加速或暂停。|计算每字角度并保持相同圆心，以spinDuration启动循环，onHover切换旋转过渡且保留当前角度。|文字长度、字号和圆半径必须匹配；圆周排列不适合长句阅读。|品牌印章,滚动提示徽章|主要导航或长段落
TextType|计时器逐字符推进当前短句，停顿后逐步删除并进入下一句，GSAP处理光标闪烁。|用typingSpeed、pauseDuration和deletingSpeed维护打字、等待和删除状态，循环依据loop与文本数组推进。|动态显示不等于真实模型流式响应；快速循环会让读屏反复播报。|智能体欢迎语,产品能力副标题|伪装真实AI生成过程
Shuffle|GSAP拆字后创建滚动字轮包装，每字经历随机延迟与方向位移，再停在目标字符上。|测量字符尺寸生成滚轮副本，用shuffleDirection和maxDelay编排字轮时间线，结束时恢复目标字形。|随机洗牌只作标题装饰，不能改变真实数据值或表单文本。|活动标题,创意品牌短句|可信实时数值
ShinyText|文字裁切渐变高光带并按时间或交互推进亮带位置，色彩和柔和度决定金属扫光质感。|以文字作为可读前景，使用shineColor、angle、shineWidth与bands构造亮带，按触发方式更新高光进度。|只作用于字面而非卡片边框；高亮不能使文字与背景短时失去对比。|重点标签,品牌短标题|整篇文章持续扫光
TextPressure|按指针到各字符中心的距离映射可变字体粗细、宽度、斜度或透明度，逐帧平滑逼近。|加载支持相应轴的fontUrl并测量字符位置，根据width、weight和italic开关更新font-variation-settings。|依赖真实可变字体轴，普通字体不一定产生同等变形；需避免挤压相邻布局。|字体体验区,艺术作品集标题|数学公式或密排正文
CurvedLoop|SVG textPath沿弯曲路径连续移动，指针拖动改变文字偏移和方向，松开后继续循环。|测量重复文字长度并建立路径，以speed更新startOffset；拖动时累计局部横向差值并环绕偏移范围。|拖动文字是装饰交互，不自动具备可选项目或链接导航。|可拖动品牌分隔带,活动口号|重要操作入口
FuzzyText|离屏Canvas生成清晰字形，再逐扫描行以随机横向偏移重绘到主Canvas形成毛糙抖动。|先测量字体与文字边界，按fps节流重绘；指针进入时在baseIntensity与hoverIntensity之间切换扰动。|噪声抖动可能明显降低可读性，不能用于必须持续读懂的正文。|实验海报标题,创意错误页|题目、答案和关键通知
GradientText|DOM文字通过背景裁切显示渐变，脚本按variant推进线性、网格色团或扇形旋转的背景参数。|选择实际variant与colors，使用animationSpeed更新渐变相位，字形保持DOM语义且边框需独立配置。|效果在字形内部，不代表整个页面渐变；showBorder是额外外层视觉。|品牌标题,重点数字或口号|所有正文都采用流动渐变
FallingText|Matter.js将字或词对应为刚体，设置重力与碰撞边界，允许指针拖动后回到文字布局。|先测量文字片段生成碰撞体，按trigger启用物理世界，以gravity、bounciness和scatter控制掉落与重排。|物理文字不能作为唯一阅读版本；容器高度不足会让内容掉出视野。|互动语言实验,创意活动标题|重要操作说明
TextCursor|指针轨迹按间距采样并从DOM字符池分配印章、链条或丝带文字，副本按寿命收缩淡出。|按spacing限制轨迹点数量，用maxPoints、exitDuration及removalInterval回收文字副本，角度可跟随移动方向。|尾迹是装饰输出，不应遮盖原生光标或拦截页面点击。|创意作品区,品牌互动幕布|密集表单和办公工具
DecryptedText|保存已揭示字符集合，定时将未揭示位置替换为随机符号，再按顺序或随机位置还原原文。|按characters与speed安排混排，sequential和revealDirection决定逐字揭示次序，触发后清理旧interval。|仅适合短标签，不能对真实密码或安全状态声称实施了解密。|科技活动标题,探索式标签|安全凭据或加密功能展示
TrueFocus|在DOM单词间切换活动索引，非活动词应用模糊，Motion将边角聚焦框移到活动词边界。|按sentence分组，测量词矩形并转换到容器坐标；自动计时或manualMode的鼠标进入更新焦点。|焦点动画不是浏览器键盘焦点；不可用模糊隐藏理解所需的重要词。|品牌关键词,核心能力轮播|长篇阅读和键盘操作指引
ScrollFloat|GSAP把文字拆分为字符并将滚动区间映射到缩放、位置等显现进度，各字符按stagger错峰恢复字形。|建立ScrollTrigger的scrollStart与scrollEnd，让各字符依stagger在滚动过程中恢复正常姿态。|运动由滚动进度驱动，不能当成自动循环动画或一次淡入的同义词。|故事章节标题,长页过渡|没有滚动空间的固定面板
ScrollReveal|GSAP拆词后将滚动位置映射到逐词透明度、模糊和容器旋转，文字随滚动逐步可读。|先保留语义段落，配置baseOpacity、enableBlur与blurStrength，再以ScrollTrigger驱动词级清晰度。|滚动未达终点时部分文字会较淡，重要正文应提供立即可读的降级。|叙事品牌介绍,简短章节引文|考试题目和答案主体
ASCIIText|以Canvas栅格化文字和字符图集，WebGL着色器将字形覆盖转换为ASCII字符密度并加入指针扰动。|生成文字纹理和字符图集，按asciiFontSize与charset离散采样，在GPU合成字块、倾斜及点击涟漪。|ASCII输出是装饰像素图，不是实际终端日志；字号过小影响辨识。|开发者主页,数字艺术字标|终端操作界面本体
ScrambledText|GSAP SplitText取得各字符节点，指针进入影响半径时用ScrambleText扰乱附近字符并恢复。|测量字符相对指针距离，在radius内以scrambleChars、duration和speed播放局部混排。|局部乱码仅作装饰，不应该改变用户正在输入或复制的内容。|互动科技短文,展览说明标题|代码编辑器和公式正文
RotatingText|Motion的进入退出状态按活动索引切换短句，按字或词错峰呈现翻转、位移与淡出。|维护currentText与next、previous等控制，逐段拆分并用AnimatePresence处理旧段退出和新段进入。|必须为不同文本长度预留空间，轮换不能让主按钮和布局持续跳动。|产品能力词轮换,短副标题|必须同时看到的多项条件
GlitchText|CSS伪元素复制文字，使用裁切片段和红蓝等色彩阴影错位产生电子故障效果，保留真实字形作为基底。|用data-text或副本层保持原字形，按speed驱动剪裁关键帧，enableOnHover限定是否仅悬停出现。|故障闪变不能用于长正文或重要状态；副本应为装饰而非重复语义。|游戏活动字标,复古电子海报|无障碍阅读主体
ScrollVelocity|Motion读取滚动速度并经弹簧平滑，将速度映射为重复文字带的横向位移与方向变化。|测量文字单元宽度，生成numCopies副本，按velocityMapping把滚动速度乘入baseX并循环包裹位移。|复制数不足会露白；它展示滚动动势，不是新闻自动更新或真实速度仪表。|品牌跑马分隔带,作品集过渡|长文逐句阅读
VariableProximity|逐字符测量指针到字形中心的距离，将距离衰减映射为from到to的可变字体轴设置，并逐帧更新字形属性。|解析字体轴配置，按radius与falloff逐字符插值font-variation-settings，触摸坐标与鼠标坐标使用同一局部参考。|需要字体本身支持相应轴；屏幕阅读应保留原始文字，不依赖视觉变粗表达唯一状态。|字体演示,交互标题|复杂公式或小字号标签
CountUp|Motion spring驱动一个数值，进入视野后由from变化到to，再按小数位与分隔符格式化。|通过可见状态启动motionValue，以duration和delay配置时序，将订阅值格式化后写入显示节点。|必须使用真实数值或标注的演示数据，动画本身不产生统计结果。|已核验的运营统计,学习进度概览|虚构产品成绩或实时指标
CrystalizedBall|OGL在片元着色器中合成玻璃球、发光尘埃和电弧状态，指针扰动与点击反馈改变局部场。|建立球面材质与粒子状态纹理，按preset、speed及hoverStrength更新uniform，点击时施加短暂扰动。|这是着色器装饰球，不是可探索的真实三维模型或分子结构。|神秘主题入口,科技互动封面|声称真实物体建模的教学
ElectricLogo|先把图片或SVG栅格化为覆盖与距离场，再由OGL着色器沿轮廓生成发光电弧与脉冲。|等待src加载生成边缘场，依据thickness、strands与bend采样电弧，并把指针电荷输入局部uniform。|透明轮廓和清晰图源决定电弧形状；并非给任意DOM容器添加边框流光。|品牌标志展示,电竞活动开场|正文卡片的普通描边
DitherVeil|图片纹理经抖色核映射到有限色阶，指针写入恢复遮罩，离开后遮罩衰减重新显示抖色。|加载src并按fit计算采样矩形，使用pattern、pixelSize和levels生成点阵，局部遮罩在指针移动后逐步回补。|图片需要可用的纹理访问与可见尺寸；恢复颜色是视觉揭示，不是图像修复。|摄影作品封面,复古编辑专题|真实图像增强工具
GlowCursor|WebGL流体缓冲在指针处注入光与速度，进行平流和压力修正，并用多层辉光合成冷却拖尾。|在独立透明Canvas维护流体纹理，以trailWidth与followSpeed记录指针轨迹，随linger衰减光亮并合成glow。|全局光流与原生光标功能分开，避免遮挡输入、点击目标或叠加其他全屏流体。|音乐视觉幕布,创意作品首页|数据录入主界面
ScrollExpand|DOM媒体框的宽高、圆角和位置随滚动进度插值，从小框扩展到接近全屏，媒体在固定舞台内保持裁切。|测量滚动轨道与舞台尺寸，按startWidth、startHeight和startRadius计算起点，再按scroll进度更新媒体框。|属于滚动媒体展示，需为滚动区预留高度；不自动播放未获允许的视频声音。|产品视频介绍,作品详情开场|无滚动空间的小弹窗
RippleDistortion|OGL把内容采样为纹理，指针位置写入波纹位移场，随后按spread与fade传播衰减并重采样内容。|将源图或可支持内容变成纹理，记录局部波纹中心，按brushSize、strength和swirl更新位移纹理及合成uniform。|扭曲的是被采样的视觉层，不应扭曲真正可操作表单或可复制正文。|摄影互动封面,艺术品牌图像|需要精确阅读的图文表单
ElasticMesh|从文字或标志生成距离场与弹性网格，指针按压驱动节点，WebGL表面着色呈现鼓起材质。|栅格化文字或图源并建立节点连接，按inflate、stiffness与阻尼更新受力，再以material着色表面与阴影。|软体形变是近似交互视觉，不等于有单位、可验证的材料力学模拟。|可玩品牌字标,互动创意展品|工程力学计算界面
SwarmCursor|OGL粒子场按聚合、避让和噪声运动更新，指针吸引或推动群体并以发光合成呈现。|初始化count个粒子的状态与颜色，按separation、spread与指针局部坐标更新运动，再合成粒子光晕。|群体运动是装饰，不代表真实群体行为或数据轨迹；粒子数量需受控。|自然主题互动背景,创意探索封面|精确轨迹分析
HalftoneReveal|图片通过网点单元离散化，WebGL按亮度设置点形和大小，指针遮罩在局部揭示原图。|加载源图并按cellSize、angle和shape生成网点，局部mask放大或消融网点以显示原色，再恢复纹理。|网点是图像表现方式，不能用于需要清晰识别的证件、文字截图和图表。|摄影作品,印刷风格专题封面|文档阅读器正文
PixelSwap|两层内容以像素单元构成的覆盖遮罩切换，在遮罩封闭时替换可见内容，再按相位移除像素。|依据pixelSize、gap与pattern建立网格，以duration和pixelDuration安排覆盖及解除，避免未遮住时直接露出替换。|这是内容替换过渡，业务数据和交互状态需外部管理；像素数过大增加DOM或绘制量。|图片或短内容切换,创意双面介绍|需要持续编辑的输入面板
CursorGrid|Canvas只绘制局部受指针和点击脉冲激励的网格单元，亮度按距离和时间衰减。|按cellSize建立网格，以radius、falloff、holdTime和fadeDuration保存局部能量，点击时叠加扩散脉冲。|是背景交互网格，不是可编辑电子表格，也不自动显示真实数据。|工具产品空白区,交互装饰画布|数据表格内容区
AnimatedContent|GSAP包装容器在ScrollTrigger进入阈值时，从偏移、透明度或缩放状态过渡到正常布局。|以direction和reverse确定轴向偏移，distance、initialOpacity和scale构造初始状态，进入threshold后播放过渡。|主要是容器入场，不提供持续空间主视觉；默认可读与减少动态状态需保留。|内容区块入场,功能卡列表|仅靠入场来代替强动效主视觉
FadeContent|GSAP时间线根据可见阈值改变整个容器的透明度与可选模糊，可配置延时和后续淡出。|设置initialOpacity与blur初态，在threshold满足后按duration和delay过渡；disappear相关选项决定是否后续离场。|整个容器的淡入不同于逐词揭示；核心输入与答案不能因离场设置永久不可见。|图片说明,次要内容组块|主要功能的唯一呈现方式
ElectricBorder|Canvas沿圆角矩形轮廓采样位置，用多层噪声扰动法线并加亮合成，形成持续电弧描边。|根据容器宽高和borderRadius生成圆角边界，以speed推进时间，chaos控制边缘噪声，独立Canvas覆盖轮廓。|电弧抖动与匀速边框光束不同；应只作用边缘，不把卡片内部铺成闪电。|游戏重点卡片,能量主题行动按钮|长时间阅读面板
PixelTransition|两层DOM内容与Canvas像素遮罩配合，鼠标或点击触发时先盖住旧内容再揭开新内容。|按gridSize与pattern排列覆盖次序，animationStepDuration控制时间窗，完整封闭遮罩时切换内容层。|触屏要保留可点击触发；不是业务路由切换器，原内容状态由接入方保存。|双面作品封面,互动产品卡|大段正文或填写中的表单
GlareHover|独立渐变反光带根据指针方向或进入位置扫过元素表面，叠加局部高光与可选边缘层。|测量局部坐标，以glareAngle、glareSize和glareOpacity更新反光渐变，移出后恢复基态。|反光作用surface而非沿路径绕边；背景图、文本和命中区域必须分层。|商品光泽封面,行动按钮表面|所有卡片同时高强度扫光
Antigravity|React Three Fiber的instancedMesh批量绘制三维粒子，每个实例根据虚拟指针距离和波形计算目标位置并平滑追随。|初始化每粒子的随机相位与空间偏移，按magnetRadius和waveAmplitude更新实例矩阵，指针靠近时改变局部目标。|需要WebGL与Three/R3F依赖；粒子场是装饰视觉，不是科学粒子模拟。|空间科学首屏,沉浸式创意背景|真实分子轨迹分析
LogoLoop|重复品牌图标序列铺成滚动轨道，requestAnimationFrame平移并在单元边界取模，悬停调整速度。|先等待图标尺寸测量，复制足够单元以覆盖容器，按speed与direction推进轨道，resize后重新计算循环长度。|需保留品牌图标授权与替代文字，复制轨道不要重复进入键盘焦点。|合作伙伴展示,技术栈列表|承载唯一关键入口的导航
TargetCursor|DOM四角框与中心标记跟随指针，目标命中时测量元素边界并将四角吸附到对应角点。|通过targetSelector筛选目标，用getBoundingClientRect计算四角坐标，hoverDuration与spring调节跟随，离开后恢复游标。|自定义光标不替代键盘焦点；触屏和粗指针应保留原生操作方式。|游戏化导航,创意交互作品|高精度办公与辅助技术主界面
MagicRings|Three.js全屏着色器按同心圆距离场、时间和颜色渐变组合发光环，并接受指针平滑位置与点击扰动。|创建正交摄像机和ShaderMaterial平面，用ringCount、baseRadius与radiusStep组织环带，再每帧更新时间及鼠标uniform。|绘制的是着色器环形视觉，不是可点击的真实三维环模型；同屏光环数量影响片元成本。|活动能量背景,几何品牌首屏|真实几何教学模型
LaserFlow|原生WebGL片元着色器把垂直光束、表面接触扩散和雾光分开计算，形成光落到内容上再溢出的场。|建立独立Canvas并设置beamPosition与surfaceLevel，在片元场中合成beamWidth、flare、spill和fog，按时间及指针更新。|surfaceLevel是视觉接触位置，不会自动识别任意DOM真实几何；需手动对齐内容。|重点内容舞台,发布会品牌首屏|需要光线物理测量的工具
MagnetLines|DOM短线网格缓存各线中心，计算指针与中心的atan2角度并写入CSS旋转变量。|按rows、columns和line尺寸建立网格，在pointermove中测量或复用中心坐标，逐条更新角度，未交互时保留baseAngle。|是二维短线朝向反馈，不是磁场求解；大量DOM线条需要控制网格尺寸。|交互功能区背景,科学主题装饰|真实磁感应强度显示
GhostCursor|Three.js绘制保存指针历史的拖尾场，再以辉光和胶片颗粒后处理形成滞后的半透明光影。|维护trailLength环形缓冲与inertia平滑位置，把历史轨迹传入材质，再经bloom和grain合成，静止后按状态淡出。|可视光影不应取代原生鼠标命中；后处理开销高于普通CSS阴影。|数字艺术封面,创意品牌舞台|密集输入和精确点选
GradualBlur|多个绝对定位DOM层分别使用backdrop-filter与渐变mask，按位置逐层增加模糊强度形成容器边缘渐进模糊。|合并DEFAULT_CONFIG、preset和props，依据position与divCount生成分段遮罩，以curve和strength计算每层模糊。|它持续覆盖内容边缘，不是一次文字模糊入场，也不是卡片边框发光。|滚动容器边缘,固定页头或页脚衔接|需要完整读清的内容主体
ClickSpark|Canvas在点击位置生成一组按角度分布的短线，随时间向外移动并缩短，生命周期结束即移除。|将点击坐标换算到Canvas，按sparkCount与sparkRadius建立火花，再用duration和easing更新每条线的半径与长度。|只提供点击装饰反馈，不应作为操作成功的唯一提示。|活动按钮,轻量趣味点击区|关键提交结果的唯一状态
Magnet|包装容器测量鼠标距中心的偏移，进入padding范围时将内部元素平移，离开时CSS过渡复位。|外层保持布局与命中稳定，以magnetStrength缩放局部偏移，分别设置activeTransition与inactiveTransition。|只吸引视觉内层，不要移动整个布局命中区或核心表单文字。|品牌行动按钮,作品集社交图标|高精度小按钮密集工具栏
Strands|OGL片元着色器按多组曲线距离合成发光丝带，可用透明渲染目标与玻璃合成生成叠层线束。|由count、spread与waviness建立丝带场，使用thickness、taper和glow控制横截面及边缘，每帧按speed推进曲线。|发光线束是程序纹理，不是实际绳索或可选择的独立路径。|科技品牌氛围,音乐活动背景|需要逐条编辑的流程连线
StickerPeel|细分贴纸网格按剥离方向和卷曲半径弯折，WebGL结合正反面材质、阴影与后处理呈现卷角。|用width和轮廓生成网格与纹理，hover或active状态改变剥离百分比，再用curlRadius计算弯曲顶点。|需要可用图像纹理和WebGL；贴纸剥离只是视觉交互，不能自动代替真实领取流程。|活动贴纸,创意商品标签|关键确认或法律条款
PixelTrail|WebGL纹理网格保存指针经过单元的时间和强度，按maxAge衰减并以形状或粘液滤镜合成。|把指针坐标映射到gridSize网格，依据trailSize和interpolate写入单元，逐帧老化并绘制颜色与gap。|像素尾迹为装饰，不能遮挡原生焦点或截获页面点击。|复古数字作品,游戏主题互动背景|复杂办公表单
Cubes|WebGL批量立方体几何根据局部指针方向旋转，悬停扫过和点击可附加波形扰动。|由gridSize与gap生成立方体阵列，将指针距离映射成maxAngle内的旋转，以投影矩阵绘制面色和边线。|立方体阵列不是可编辑三维场景；面数、边线和阴影会增加GPU负担。|几何品牌首屏,互动展示墙|真实工程模型编辑
MetallicPaint|将标志或文字栅格生成覆盖与边缘场，WebGL片元着色器结合形变与色散形成液态金属反射。|读取图源或字体生成纹理，使用density、distortion、edgeBend和dispersion计算表面高光，再输出透明背景合成。|材质来自程序高光而非真实场景反射；图源轮廓和透明边缘影响效果。|品牌标志动效,金属主题标题|要求物理准确的材质预览
Noise|Canvas生成可重复颗粒纹理瓦片，按fps更新噪声，可叠加尘点、划痕与扫描线。|设置opacity、size与blendMode生成噪声tile，在受控频率下重绘并平铺到独立装饰层。|噪声会降低对比和细节辨识；不要覆盖重要文字、图表与输入内容。|胶片摄影封面,复古纸张氛围|数据图表和正文表面
ShapeBlur|先生成图形距离场，指针附近改变局部模糊半径，再通过WebGL多阶段模糊与合成产生失焦边缘。|依据shape或src栅格化形状，构造距离纹理，局部指针控制模糊场并合成色边或回声。|失焦只适合装饰图形；不能把模糊图像当成清晰可读的信息。|实验品牌图形,创意作品封面|正文或关键标识
Crosshair|Canvas绘制水平垂直测量线、坐标和目标框，依据局部指针或目标边界改变线段长度与吸附。|选择containerRef限定坐标系，缓存目标矩形，按gap、thickness和smoothing绘制十字线及标签。|展示的屏幕坐标不是物理测量结果；自定义光标不应隐藏键盘焦点。|设计展示工具,游戏化交互区域|真实仪器测量界面
ImageTrail|图片DOM池按指针移动距离依次取出，GSAP为每张设置位置、旋转、缩放和退出时间线。|缓存图片尺寸和最近指针位置，越过移动阈值后复用下一张图片，按variant计算散射方向并让旧图片退场。|需要准备多张合适尺寸图片；不可在每次mousemove中无限新增DOM。|摄影作品集,创意艺术首屏|密集文本内容区
Ribbons|WebGL细分带状网格保存一串跟随节点，弹簧、阻尼和波形共同更新轨迹，再绘制柔和带面。|按length与thickness分配轨迹，指针推动头部、后续节点逐段追随，以stiffness和bounce控制延迟回弹。|尾迹带是装饰，不能视为真实绳索动力学或可交互路径导航。|时尚作品集,绘画互动区域|真实运动轨迹分析
SplashCursor|WebGL双缓冲流体模拟在指针处注入染料与速度，经过平流、旋度和压力迭代呈现彩色飞溅。|建立速度和染料渲染目标，以SPLAT_RADIUS及SPLAT_FORCE注入力，再按耗散和压力迭代推进模拟。|全屏流体需要GPU资源；DYE_RESOLUTION与SIM_RESOLUTION过高会影响手机流畅度。|互动艺术画布,音乐氛围幕布|精确科学流体测量
MetaBalls|WebGL片元场将多个圆球的平滑距离或能量叠加，以阈值着色产生靠近融合和分离的轮廓。|为ballCount个球生成位置相位，用clumpFactor及速度控制运动，鼠标球参与同一融合场。|只呈现二维场的融合外观，不是物理液体体积或真实三维碰撞。|生物主题主视觉,抽象品牌背景|真实分子键结构教学
BlobCursor|Three.js片元距离场组合光标主体、延迟拖尾与短寿命液滴，材质模式决定金属或果冻高光。|维护指针惯性位置、尾迹与液滴生命周期，按morph和lag更新场，再以material和depth形成体积高光。|软团块是光标装饰，不应截获点击或伪装系统光标状态。|创意品牌互动,游戏活动页面|高精度表单输入
StarBorder|Canvas沿元素真实圆角轮廓累计弧长，让亮点按进度移动并在其后绘制光带与星尘。|测量容器宽高和radius，依据duration计算轮廓进度，按trailLength、stars与sparkle绘制边缘尾迹。|只围绕边框，不把星光铺满surface；该实现不是简单移动一张整面渐变。|活动行动按钮,重要展示卡片边缘|长篇阅读内容表面
HoloCard|WebGL片元层合成全息箔纹理与闪粉，DOM卡片随局部指针三维倾斜，反射方向与高光同步更新。|由preset建立箔纹配色，把指针位置写入材质与旋转目标，以intensity、glare和edgeSparkle控制表面及边缘光。|全息是程序反射而非真实环境采样；卡片内容与装饰材质要分别控制。|收藏品展示,艺术商品卡|长时间阅读的正文卡
CircularCarousel|DOM图片卡以三维旋转矩阵排成圆环，拖动惯性改变角度，接近正面的卡片吸附并可进入聚焦态。|按cardWidth与gap计算环半径，维护拖动速度和目标角度，逐卡投影位置并按深度排序，点击时切换焦点布局。|需要控制同时可见卡数与图片体积；环形视觉不适合替代完整可扫描的项目目录。|摄影作品浏览,精选产品展示|密集资料检索结果
FlexCarousel|OGL将无限横排图片绘制为纹理平面，边缘镜片着色器对经过两端的图像做弯曲与折射。|维护循环滚动偏移，cardVertex计算图片位置，lensFragment在边缘区域重采样，squeeze与fit调整形变和裁切。|两端的液态玻璃是视觉采样区域，不改变原图；跨域图片需满足纹理读取条件。|时尚作品图片带,品牌商品画廊|文档与文字截图列表
InfiniteSpiral|DOM图片卡沿三维螺旋公式定位，持续或滚动驱动相位，超出纵向区间的卡片循环回到另一端。|使用radius、verticalSpacing和perspective建立螺旋，以speed及animationMode更新进度，按深度调整层级与可见性。|无限循环需要准备合适图片数量与清晰点击区；文字说明应在稳定独立区域呈现。|沉浸式摄影首屏,艺术展品集合|重要目录导航
DepthCarousel|GSAP驱动卡片在纵深轨道中的位置、缩放、倾斜和明暗，拖动、滚轮或按钮更新浮点索引。|把当前位置pos映射到各卡相对槽位，用radius、depth、spread和tilt计算姿态，再以时间线趋近新索引。|属于模拟空间卡片排列，不是WebGL三维场景；必须保留明确前后切换入口。|案例精选浏览,产品功能介绍|需要同时比较大量数据的界面
MorphSlider|OGL使用前后两张纹理和位移函数，GSAP推进transition进度，使图像弯曲、熔化或色散后交接。|预加载相邻图像纹理，切换时设置两张图及方向，按duration和intensity插值纹理坐标与混合权重。|图片需满足跨域纹理条件；过渡不会自动保存业务表单状态，也不应扭曲文字。|摄影主视觉切图,品牌宣传图轮播|正文阅读和数据表格
DriftWall|DOM图片按列复制成循环轨道，整个墙面施加透视与倾斜，各列以不同速度漂移并支持悬停抬升。|根据columns和tile尺寸分列，记录每列循环长度与偏移，逐帧取模滚动并在悬停时降低相应列速度。|复制图片需要控制焦点与替代文字重复；自动墙不是完整的可筛选图片管理器。|作品集背景墙,摄影展览入口|主要业务列表
AccordionGallery|GSAP动态分配横向或纵向面板比例，活动面板展开并同步图像视差、文字及进度装饰。|以defaultIndex指定活动项，测量容器可用尺寸，按expandRatio重分配面板大小并过渡媒体和文本姿态。|窄屏同时展开全部面板会挤压内容；所有面板仍应有触屏和键盘可到达的触发。|旅行目的地介绍,产品系列展廊|每项信息同等重要的比较表
SpecularButton|真实button承载交互，独立WebGL画布沿圆角轮廓计算指针最近高光，并合成玻璃折射与描边反射。|测量按钮轮廓，把指针投影到边缘，使用radius、blur和tint设置材质，按位置移动反光而保留按钮文本。|高光是按钮装饰，不能改变点击命中区域；玻璃背景仍需保证文字对比。|品牌主操作按钮,精致工具操作|全部密集表格按钮
OptionWheel|DOM选项沿弯曲坐标排列，通过滚轮或拖动改变连续索引，弹簧收敛到最近选项并淡化两侧。|以spacing和curve计算各行相对位置，维护target与selected索引，选中变化后触发回调并更新可见状态。|不能只依靠鼠标滚轮，需验证方向键与触屏；弧形显示不应隐藏当前选中值。|偏好参数选择,日期或分类选择|大量多选条件筛选
CurvedInput|SVG弧线路径与真实输入元素配合，将文字光标和视觉按钮映射到同一弧形几何中。|用width、bend和cornerRadius计算弧形边界与textPath，保留真实input处理编辑，再同步显示文字和提交状态。|弯曲视觉不等于原生输入能力，中文输入法、选择文本和无障碍需在目标浏览器验证。|创意搜索入口,活动问答表单|长文编辑器
LineSidebar|DOM链接列表根据指针纵向距离计算衰减偏移，邻近项目突出并以平滑追随形成波形侧栏。|缓存每项中心位置，以proximityRadius与falloff计算目标横向位移，再按smoothing逐帧趋近。|主要链接与焦点必须始终可见，不能让平移破坏键盘导航或点击区域。|作品集章节导航,创意栏目侧栏|密集管理后台主导航
AnimatedList|DOM列表支持按可见状态错峰进入，同时维护活动项、键盘导航、高亮指示器与边缘渐隐。|以items建立稳定键值，按animation与stagger安排入场，更新selected索引后平滑移动高亮并确保活动行可见。|选中与悬停状态应分开，列表数据很长时仍需要分页或虚拟化策略。|搜索结果选择,智能体任务列表|无边界的超长日志
ScrollStack|DOM卡片随容器或window滚动计算固定堆叠位置，缩放、遮罩与明暗表现层叠，平滑滚动和吸附可配置。|测量每卡起点与高度，以stackPosition、itemDistance和itemStackDistance计算停靠点，再按滚动进度写入位移、缩放与dimAmount。|它由用户滚动驱动，不是自动定时置顶的CardSwap；内部滚动与页面滚动需要正确分工。|分步骤故事展示,连续方案介绍|要求所有卡同时完整可读的比较表
BubbleMenu|浮动菜单按钮控制覆盖层，GSAP为气泡容器和标签建立错峰弹出及收回时间线。|维护open状态并计算移动端或桌面布局，按animationDuration与staggerDelay依次显示菜单项。|菜单不是装饰粒子，需保证关闭、Escape、焦点与每项链接可操作。|创意站点主菜单,活动导航|高频多级管理菜单
MagicBento|CSS Grid组织大小不同卡片，指针光斑、边缘发光、倾斜和粒子各自作为独立可配置效果层。|按columns与rowHeight排版，按enableSpotlight和enableBorderGlow初始化局部反馈，避免粒子Canvas覆盖文字与链接。|网格构图和可选局部交互不等于持续空间主视觉，不应为了效果开启全部选项。|智能工具能力总览,功能导航首页|主视觉必须持续运动的唯一实现
CircularGallery|WebGL图片平面随循环滚动沿弧线弯曲，文字标签单独生成纹理，按位置更新平面姿态和尺寸。|预加载图片和字体，按bend与gap建立循环轨道，滚轮或拖动改变scroll值并对越界媒体循环定位。|图片标签在GPU中绘制时需额外保留语义说明；跨域图片和字体加载决定最终结果。|摄影展览浏览,创意项目画廊|主要文本资料列表
ReflectiveCard|摄像头或指定反射源经过Canvas/WebGL采样与模糊合成，卡片倾斜和眩光随局部指针变化。|配置webcam或替代源后初始化纹理，以卡片比例裁切反射图，再合成玻璃表面、信息层和边缘光。|真实摄像头需单独授权且不可在示例中暗中开启；视频反射并非真实物理镜面。|可控权限的互动名片,展览体验装置|默认需要隐私友好的普通资料卡
CardNav|GSAP在紧凑导航条与多张导航卡之间改变容器高度，并让分组卡片错峰显现。|测量折叠顶栏与展开内容高度，建立高度和卡片动画时间线，窗口变化时重新计算并保持当前展开状态。|导航展开不能只改变视觉而遗漏焦点与可交互状态；移动端需检查内容高度。|产品分类导航,创意品牌菜单|极深层级的后台导航
Stack|Motion管理叠放卡片的位置和三维姿态，拖动或甩动达到阈值后将前卡移出并重排到底层。|维护卡片顺序与可见槽位，按spread、depth和tilt布置；由释放速度和距离决定切换或弹回。|手势卡堆不是滚动层叠，也不是自动换位；必须保留点击或按钮替代操作。|精选图片浏览,短信息卡片|大量资料的唯一目录
FluidGlass|React Three Fiber场景将背后内容渲染到离屏缓冲，再用Drei透射材质的镜片、立方体或玻璃条折射采样。|建立离屏场景缓冲与玻璃网格，按modeProps调整透射材质，followPointer决定镜片是否跟随指针。|这是真实WebGL场景采样，不可用普通backdrop-filter声称完整复刻；需要其Three/R3F/Drei依赖。|产品空间展示,艺术作品折射舞台|大面积正文与表单背景
PillNav|DOM胶囊导航配合GSAP圆形填充与文字翻动，活动项保持独立高亮，移动端另有展开菜单。|测量胶囊尺寸计算悬停圆半径，用时间线推动背景和两层标签，路由活动态与悬停态分别维护。|需要与实际路由体系匹配，悬停反馈不能代替当前页面标识或键盘焦点。|品牌站主导航,轻量产品导航|复杂树形管理菜单
Masonry|依据响应式列数把图片分配给当前最短列，得到绝对定位矩形，再由GSAP动画布局重排和入场。|等待图像尺寸和容器宽度，计算每列累计高度，生成各项x、y与高宽并在resize后重新布局。|图片尺寸未准备好会导致布局跳动；大量图片需要懒加载或分页，不能无限堆DOM。|摄影作品集,图片素材浏览|按行严格对齐的比较表
DomeGallery|DOM图片瓦片按球面角坐标分布到穹顶，拖动更新视角旋转并可选中图片展开查看。|根据半径和行列坐标构造CSS三维位置，限制纵向旋转范围，拖动惯性更新旋转并区分点击与拖拽。|穹顶是视觉浏览结构，不是自动可搜索的图库；减少动态时需提供平面列表。|沉浸式摄影展,艺术作品入口|高效检索大量课程资料
ChromaGrid|CSS网格图片保持灰度，独立径向mask根据指针位置揭示局部原色，并平滑衰减与淡出。|测量局部坐标，按radius、softness和damping移动显色窗口，在原图上方叠加灰度遮罩而非修改原图。|色彩不能作为唯一信息区分；触屏不能依赖悬停来识别内容。|作品封面网格,摄影或团队介绍|按颜色编码的重要状态表
Folder|CSS三维层与可选材质Canvas表现文件夹盖板、纸张和书页，不同mode/variant决定展开、散列或取出行为。|按items生成内部纸张和盖板层，依据openOn或受控状态改变折叠角度、纸张位移及阴影，点击项另行接业务。|视觉文件夹并非真实文件系统，不自动提供上传、权限或文件读写。|资料分类入口,创意项目卡|声称已连接本机文件系统
StaggeredMenu|GSAP依次滑入多层背景面板与菜单文字，开关图标、标签和颜色共享展开时间线。|用position确定面板方向，打开时先移动背景再错峰显现项目，关闭时回收并禁用不可见项命中。|覆盖式菜单需处理焦点返回和滚动锁定；不能让关闭后的链接仍可聚焦。|创意全屏导航,品牌站菜单|需保持大量工具始终可见的界面
ModelViewer|React Three Fiber按模型扩展名选择GLTF、FBX或OBJ加载器，居中归一化模型并配置环境、曝光与环绕控制。|加载实际模型资源并计算包围盒，按尺寸缩放到可见范围，使用environment和exposure照明，拖动改变查看角度。|示例模型不等于用户业务资产；模型文件、纹理、授权与跨域路径需由接入方提供。|产品模型展示,可交互教学模型|没有真实模型的准确科学结构展示
Lanyard|Three.js自建吊带节点约束和卡牌几何，拖拽向节点施力，迭代约束后以带状网格和卡面材质绘制。|建立吊带节点与长度约束，按anchor、strapLength和节点迭代计算摆动；拖拽卡体并更新材质、光照和朝向。|该锁定版使用Three.js自有约束模拟，不能凭旧教程宣称依赖Rapier；不提供真实身份认证。|个人数字名牌,活动品牌吊牌|真实证件核验功能
ProfileCard|DOM卡片与独立箔纹、高光层通过局部指针坐标驱动三维倾斜，文字和联系按钮在稳定内容层。|按头像和用户信息建立卡片，把指针归一化后更新tilt和光照CSS变量，离开后平滑回正。|个人信息是展示数据，联系按钮需真实业务链接；卡片高光不等于用户认证。|个人介绍,团队成员展示|长篇个人档案正文
Dock|DOM图标栏按鼠标距离计算每项放大曲线，保留布局插槽并支持启动弹跳、角标及可选菜单。|缓存各图标中心，以distance与magnification计算缩放和占位，指针离开后恢复，触发onClick另行接业务。|放大图标不能遮挡相邻命中区；触屏和键盘应能稳定访问每个项目。|轻量应用启动栏,作品集底部导航|数十项以上的复杂主导航
GooeyNav|真实导航按钮上叠加WebGL液态高亮场，活动项变化时圆角指示体拉伸、融合并生成小液滴。|测量旧新按钮矩形，按animationTime插值位置与形状，把particleCount等参数写入独立高亮渲染层。|液态效果只承担活动指示，真实链接和键盘状态仍由DOM按钮负责。|品牌页栏目切换,轻量标签导航|高密度数据表导航
PixelCard|Canvas在卡片内部按网格生成像素单元，悬停、焦点或配置触发改变像素的显现、颜色与退场。|依据pixelSize与shape建立像素场，按origin和revealDuration安排扩散顺序，把spotlight和glow作为局部可选层。|像素应在内容下方，不可用细小闪变覆盖正文；不能自动提供卡片业务点击。|复古项目封面,创意功能卡|长时间阅读区域
Carousel|DOM轨道用弹簧位置管理当前卡片，按effect计算相邻卡的位移、缩放或旋转，并维护指示器和可选自动播放。|依据baseWidth、gap和peek建立槽位，手势或前后按钮更新目标索引，自动播放需在交互时暂停。|不是所有过渡都适合正文卡；核心功能不可只存在自动滚过的隐藏项。|产品功能精选,短内容卡片展示|必须同时比较的关键选项
BorderGlow|边缘距离和指针方向驱动CSS渐变描边及外侧光晕，背景和内容作为独立层保留。|用edgeSensitivity测量接近程度，将方向映射到渐变位置，以glowRadius与glowIntensity调节边缘光。|边缘追光不等于整面渐变，也不是自动沿路径旋转的BorderBeam；静态或自动模式须按实际参数说明。|重点信息卡边缘,商品展示容器|替换玻璃卡内部材质
FlyingPosters|WebGL将海报铺成可循环纵向平面，滚动速度影响网格顶点扭曲与翻转，摄像机投影提供纵深。|依据planeWidth、planeHeight和columns生成海报几何，维护连续滚动与scrollEase，distortion驱动顶点位移。|需要图像纹理和WebGL，海报文字在扭曲时不可作为唯一阅读版本。|艺术海报展,电影作品展示|密集资料检索正文
CardSwap|DOM卡片按槽位保持三维倾斜与层级，通过有阶段的位移轨迹将前卡送到底部并提升后卡。|由cardDistance、verticalDistance和depth计算堆叠，autoplay与delay决定换位时机，悬停或手动操作可中断。|这是自动或手动的卡片换位，不是ScrollStack的滚动停靠；主要按钮不要放在持续移动的槽位。|精选案例轮播,短产品介绍|需要稳定阅读的长卡片
GlassIcons|DOM图标外观以玻璃板、SVG轮廓和WebGL折射合成，指针倾斜改变高光、色散与边缘明暗。|为每个图标建立独立圆角板或轮廓材质，按refraction、bevel与dispersion配置折射，再叠加稳定图标语义。|图标材质不是功能本身；小尺寸和强折射可能使图形难以识别。|精致分类入口,品牌能力图标|无文字说明的关键操作
DecayCard|WebGL将图像纹理坐标按指针速度与局部噪声位移，形成撕扯和融化，再以恢复系数回到原位。|读取image并建立材质，记录指针位置差，依据intensity、sensitivity和hoverDecay写入扭曲场，离开时衰减。|仅扭曲展示图，不真实修改图片文件；文字覆盖层应保持稳定。|创意摄影封面,艺术品牌卡|文档截图或证件展示
FlowingMenu|菜单行悬停时按最近的上/下边缘滑入图片文字marquee，GSAP让重复内容水平循环，移出时收回。|计算指针进入边缘并重建足够的marquee副本，先揭示整条预览带，再线性移动内部轨道。|这是悬停图文预览，不是活动菜单指示器；触屏必须保留可点击链接和静态摘要。|作品集项目目录,视觉品牌菜单|依靠悬停才暴露的核心导航
ElasticSlider|真实滑动条值由指针位置计算，Motion对超出轨道的位移做非线性衰减，松手后弹回有效范围。|将clientX映射到startingValue与maxValue，按isStepped和stepSize吸附数值，overflow只用于弹性外观。|显示值与装饰溢出要分开，不能让超界视觉变成非法业务数值。|音量或偏好参数,创意属性面板|要求极高精度的数值编辑
Counter|每个数位用Motion spring驱动纵向数字卷轴，根据位权和新旧值选择最近滚动方向并显示格式符。|按places或数值位权拆解数字，分别计算各位轮转，保留小数点和分隔符，数值来源由业务传入。|滚动数字是显示过渡，不产生真实统计；快速频繁更新会影响辨读。|价格或积分变化,统计卡片|高频实时告警读数
InfiniteMenu|WebGL将图片瓦片分布到球面，用四元数拖动旋转与惯性更新视角，并把最近正面的项目吸附为活动项。|将图片加载到纹理并按球面采样排布，拖动更新旋转四元数，活动项单独显示名称、说明和链接。|球面展示不等于内容搜索；项目过多时应提供独立平面目录或筛选。|品牌项目探索,艺术作品导航|高效率课程资料查找
Stepper|DOM步骤指示器、连接轨道和当前内容用状态机组织，切换时动画移动指示并过渡步骤面板高度。|以initialStep或受控current值维护步骤，linear决定是否允许跳转，前后按钮更新状态并由业务校验数据。|动画流程组件不自带后台提交、校验或真实进度，需要接入业务回调。|注册或配置流程,分步报告表单|伪造真实任务处理进度
BounceCards|多张DOM图片按扇形初始位置用弹簧进入，悬停时邻卡散开、当前卡扶正并提升层级。|根据spread、rotation和arc生成基础姿态，按animationDelay错峰入场，指针激活时重算邻卡偏移。|仅适合少量精选图片；持续移动的卡片不应承载核心表单控件。|旅行照片精选,个人项目封面|长篇资料列表
FluxLines|原生WebGL2片元着色器以多尺度噪声与场函数生成发光流线，局部指针力和点击旋涡改变线纹方向。|创建全屏三角形与GLSL300程序，flowDirection推进时间流，mouseStrength与mouseRadius扭曲局部场，clickSwirl叠加短时旋转。|锁定源码无Three依赖，要求WebGL2；是程序流线纹理，不是已求解的真实磁场或化学流动。|科学主题氛围,定向品牌主视觉|真实磁力或流速测量
`.trim();

const backgroundRows = `
PatternWaves|OGL片元着色器将点、线或字形图集映射到起伏表面，按波场和指针涟漪改变图案位置及亮度。|由preset、characters和图案类型构建采样图集，以波形和时间更新表面，再把局部指针扰动写入涟漪状态。|图案波场是装饰渲染，字形图集需等待字体，不能当作真实水面或科学波数据。|文化活动舞台,科学探索页面氛围|测量型波形图表
MicroSlats|OGL流体多pass模拟产生高度和速度场，透视条片着色器用该场计算波峰反光与条片海面。|初始化流体速度、旋度与压力缓冲，指针注入力，压力迭代后以slatWidth、slatHeight和gap渲染密集条片。|条片海面包含流体迭代与高密度片元计算，不能把其当作轻量CSS条纹。|材料品牌视觉,海洋主题互动背景|低性能设备的整页多层背景
GhostFibers|WebGL片元着色器递归叠加纤维层和波纹扭曲，按径向位置与时间合成深蓝光丝及辉光。|创建独立Canvas，用layers、waves、twist和threads配置场密度，rotation与rotationSpeed决定整体朝向和相位。|纤维层数和发光强度需受控，明暗纹理不代表真实纤维结构数据。|深色科技氛围,沉浸式展览入口|真实显微图像分析
CRTWarp|Three.js全屏ShaderMaterial把动态色场进行曲面畸变，叠加扫描线、波动和辉光形成CRT屏幕外观。|把curvature、scanlineStrength和waveAmplitude写入uniform，逐帧推进颜色与扭曲，并由指针平滑位置影响画面。|CRT闪动和扫描线降低细小文字可读性；背景模拟不等于真实终端或显示器校准。|复古游戏主题,电子艺术海报|正文与代码阅读
MoltenMetal|OGL片元着色器把旋涡形场与细节噪声映射为高亮焦散光丝，亮核与周边色调产生熔融金属感。|依据color1至color3设置材质色，speed推进纹理，scale、detail、coreSize与swirl控制光丝尺度和卷曲。|视觉是程序着色，不是真实金属温度、流速或材料仿真。|金属产品宣传,工业艺术首屏|工程材料测量
GradientWaves|OGL着色器使用多层波场生成远近变化的波面，以渐变、波峰颜色和雾化地平线形成纵深。|以waveScale和amplitude建立波高，speed推进相位，waveRatio、swell与turbulence调节波形混合和远处消隐。|波浪外观不能代替真实海况或地形数据；地平线需要与正文位置隔离。|海洋旅行品牌,自然主题首屏|气象海况仪表
WebThreads|OGL着色器将正弦光丝朝汇聚点编织，曲线距离与渐变着色形成有方向的细线束。|由threadCount、frequency、spread和taper建立扇形线场，position控制汇聚点，时间与指针改变局部方向。|多条线是一个着色器图案，不原生支持逐条选择或业务连线。|通信主题品牌,研究团队首屏|可编辑流程关系图
Topography|OGL片元着色器对动态高度场按band取等值线，以高度分段配色并给线条叠加辉光。|以scale与morphAmount生成起伏场，通过bands和thickness提取轮廓，morphSpeed推进形态并混合低中高色。|这是程序等高线纹理，不包含真实地理坐标或可量测海拔。|花园地形氛围,户外品牌背景|真实地图或GIS分析
LightTunnel|WebGL在透视隧道坐标中绘制径向光缆，沿线传播的周期脉冲形成向纵深穿梭感。|配置cableColor和隧道底色，以flowDirection与speed推进场景，pulseSpeed、pulseLength和pulseBlend控制光脉冲。|纵深是着色器视觉而非真实道路或可导航三维空间；运动强度需可暂停。|科幻电影入口,网络通信主视觉|长时间阅读背景
SlicedWaves|WebGL把正弦波面裁成有间距的发光条片，投影深度与指针焦点改变彩带起伏的空间感。|按ribbons、spacing和barWidth分片，使用ribbonHeight、amplitude与spread计算波面，颜色分层合成。|条片是程序视觉，不能把每条当作对应真实数据序列的图线。|音乐活动舞台,创意科技品牌|统计图表
AcidSquares|WebGL按层叠方形或配置轮廓构成透视走廊，沿纵深推进发光脉冲并叠加闪点。|由shape与层间几何建立距离场，以pulseSpeed、pulseSpacing和pulseWidth推进光圈，speed控制整体运动。|高亮走廊和闪点可能形成强刺激，不能放在需要长时间聚焦的阅读区域。|游戏活动入口,数字艺术背景|阅读和考试界面
Scanner|OGL着色器叠加周期干涉条纹与横扫扫描带，扫描中心按时间移动并通过衰减控制亮度。|用frequency与scale配置条带密度，以sweepSpeed、sweepWidth和sweepFalloff驱动扫描窗。|扫描效果仅是装饰，不代表真实设备正在识别、诊断或扫描用户资料。|实验室主题首屏,电子产品演示|伪装真实扫描结果
Ferrofluid|WebGL用流动噪声、尖峰与等值轮廓构造磁性液面，指针力改变局部高度与方向。|依据scale和spikeHeight生成表面，sharpness调节峰形，magnetism与指针局部位置更新扰动，再提取彩色轮廓。|不是基于磁场单位或材料参数的求解器，不能用于定量教学验证。|磁性材料品牌,科学探索氛围|真实磁性流体计算
Lightfall|WebGL在纵深隧道中生成按时间下落的光条，长度、密度与辉光决定光雨层次。|以streakCount和density分配光条相位，speed推进下落位置，streakLength、glow和局部指针光增强形成层次。|大量明亮光条与高glow会降低文字对比，不应作为长篇资料阅读底图。|音乐活动入场,科幻内容封面|正文资料区
Prism|OGL着色器以棱镜几何场和光照计算形成发光棱镜，时间或交互驱动角度与色相变化。|配置height、baseWidth和scale确定几何比例，animationType控制运动，glow、hueShift和noise处理光感。|棱镜是程序渲染视觉，不自动支持真实折射率或光谱实验参数。|光学主题展示,科技品牌主图|定量光谱教学模型
DarkVeil|原生WebGL色场经多层流动扭曲与明暗高光合成，形成深色缎幕和低对比光褶。|以scale、rotation和flow组织纹理方向，warp与variation调节形变，speed推进时间并用brightness控制亮度。|背景过暗或高光过强都可能影响对比；它不是内容面板的真实布料材质。|高端产品首屏,深色创意作品|低对比文字背景
LightPillar|WebGL着色器按垂直方向合成光柱、体积感纹理与上下渐变，时间旋转和点击脉冲改变能量。|设置topColor、bottomColor与intensity，用rotationSpeed和flow驱动场，interactive与clickPulse控制局部响应。|光柱是氛围视觉，不等于实际灯光投射或场景几何照明。|发布会首屏,空间科技入口|要求物理准确的照明工具
Silk|WebGL将动态波纹与光照梯度混合为丝绸褶皱，独立噪声和高光色决定柔和材质层次。|通过speed、scale与rotation控制褶皱运动，以sheen、sheenColor、depth和noiseIntensity调节表面明暗。|程序丝绸不是真实布料模拟；过高细节与辉光不应压过正文。|服装品牌,温暖自然主题背景|材质力学教学
FloatingLines|WebGL多组线带按波函数和相位形成有纵深的曲线层，指针平滑偏移扭曲不同波层。|用enabledWaves选择实际波组，lineCount和lineDistance确定数量间距，animationSpeed与amplitude决定连续运动。|线带是装饰场，不是数据曲线；多层数量过多会使片元处理显著增加。|创意工具品牌,音乐或科技舞台|真实时序分析图
SideRays|OGL片元着色器从配置侧向origin发射彩色射线，时间调制强度、扩散与噪声造成穿透感。|以origin、tilt和spread确定方向场，rayColor1和rayColor2混合颜色，speed与intensity更新光束明暗。|不自动识别页面物体投影和遮挡；接入方需给正文留独立可读表面。|活动舞台侧光,品牌背景|真实场景灯光模拟
LightRays|OGL着色器从可选起点计算径向光束与衰减，脉动和指针影响改变射线方向及亮度。|配置raysOrigin、lightSpread与rayLength，再用fadeDistance和pulsating控制能量，followMouse写入指针uniform。|光束不会自动与DOM几何做体积遮挡，不能声称已实现物理体积光。|剧场或展览入口,重点内容照明氛围|工程照明设计
PixelBlast|Three.js点状图案着色与后处理组合，指针脉冲改变像素场，可额外启用液体位移后处理。|由variant、pixelSize和patternDensity建立像素图案，交互写入液体或波动状态，antialias控制边缘处理。|启用liquid会叠加后处理成本；离散像素视觉不代表真实粒子或事件数据。|数字创意品牌,游戏互动背景|低性能设备的多层全屏叠加
ColorBends|Three.js全屏片元着色器将多色带映射到随噪声弯曲的坐标场，时间与指针共同改变扭曲。|把colors传为调色参数，rotation、scale与frequency决定空间结构，warpStrength和mouseInfluence改变曲率。|它是抽象背景，不应当作某一科学流场的准确图像，也不能铺进所有输入表面。|艺术品牌首屏,色彩主题活动|正文和公式表面
LineWaves|OGL将内外多组线条叠加成波场，旋转和扭曲坐标让不同颜色的线面连续起伏。|用innerLineCount、outerLineCount和warpIntensity确定细节，colorCycleSpeed推进色彩，edgeFadeWidth处理边缘。|线条数量增加GPU计算，图案不包含真实数据单位或采样时间。|音乐视觉,流线主题创意背景|真实波形仪表
Radar|WebGL在圆面或透视平面中绘制刻度、扫描线与衰减余辉，目标点随时间或交互显现。|以ringCount、spokeCount和ticks建立刻度，speed推进扫线，trail控制余辉衰减，mode确定投影。|目标和扫描仅是演示装饰，不代表雷达设备或真实对象位置。|探测主题品牌,模拟控制台背景|实际定位监控
SoftAurora|OGL以三维噪声和带状渐变合成柔和极光，分层高度和时间相位形成连续色幕。|用noiseFrequency、noiseAmplitude和bandHeight生成极光形态，bandSpread控制展开，speed更新噪声相位。|极光是程序图案而非真实天文观测；颜色和亮度不能妨碍重要文字。|自然疗愈主题,天文活动氛围|真实天文数据呈现
Aurora|WebGL片元场使用噪声位移形成极光幕边界，在多色调色板之间混合并叠加光辉。|依据colorStops构造渐变，以amplitude、height和scale控制幕形，speed推进相位，blend和glow控制融合。|抽象极光不等于真实极地天空；多个类似渐变背景不宜为凑数量重复叠加。|创意产品首屏,天文主题背景|精确图像或数据分析
Plasma|WebGL片元着色器将扭转波面与亮带合成为暗处缎面光褶，指针和时间改变局部方向。|用direction、scale和twist决定光褶结构，wave与softness控制曲面，高光由shine和brightness调节。|这是光褶纹理，不是高温等离子物理仿真；亮部要与正文区域分离。|高端品牌,抽象光影首屏|等离子实验测量
PlasmaWave|WebGL中两组独立速度、方向和弯曲的发光带缠绕，亮核与柔光共同构成交织光波。|分别设置speed1、speed2和dir2，bend1、bend2控制两带形变，thickness与focalLength调整空间和边缘。|两个发光带是装饰场，不应描述为真实粒子束轨迹。|音乐科技活动,能量主题封面|真实粒子束分析
Particles|WebGL批量绘制空间粒子，以随机种子与时间计算位置，指针可给粒子群增加视差或局部运动。|按particleCount与particleSpread初始化点，设置particleBaseSize和随机尺寸，speed推进位移，hover开关控制指针影响。|粒子不对应真实数据或分子；数量、透明叠加和尺寸会增加填充成本。|空间品牌首屏,探索型背景|真实分子结构教学
GradientBlinds|OGL把渐变切成百叶条带，噪声形变与鼠标聚光共同控制条带明暗及表面折弯。|依据blindCount、blindMinWidth和angle分割条带，mirrorGradient处理颜色镜像，spotlightRadius与mouseDampening驱动局部光。|百叶是背景材质，不能把聚光误当成沿按钮边缘移动的光束。|设计工具首屏,光影主题品牌|正文卡片的唯一阅读表面
Grainient|OGL着色器在流动渐变色团中加入坐标扭曲、旋转和细颗粒，形成有印刷质感的动态色面。|以timeSpeed更新相位，warpStrength与warpFrequency决定弯曲，blendAngle和blendSoftness调整颜色过渡。|颗粒会损失细字和图表对比，渐变色面应放在内容背景而非文字层。|创意编辑品牌,文化活动视觉|数据图表和长文背景
GridScan|Three.js透视网格和扫描后处理构成空间房间，可选摄像头人脸定位分支用于视角响应。|先以linesColor、gridScale与lineThickness建立网格，scanColor和scanOpacity控制扫描；只有明确启用enableWebcam才进入摄像头模型流程。|摄像头与face-api模型需额外权限、资源和隐私说明；默认装饰扫描不代表真实识别结果。|科幻控制台氛围,空间科技入口|暗中启动摄像头的普通页面
Beams|WebGL按空间方向绘制交错条带，通过波形、材质明暗和深度渐变形成有厚度的发光梁。|用beamWidth与rotation建立条带方向，waveLength和twist改变波形，depth、sharpness与fillLight控制立体感。|条带并非真实场景光源，不会自动照亮其他DOM元素。|发布会品牌首屏,音乐舞台背景|工程照明计算
PixelSnow|WebGL以不同深度和相位生成像素雪粒，风与摇摆改变下落路径，指针扰动附近粒子。|按density、flakeSize和pixelSize建立雪层，speed、wind与sway推进运动，depth控制远近尺寸。|装饰降雪不是天气数据，密度与光晕过高会影响阅读和GPU填充。|冬季活动页面,节庆展示|真实气象监测
Lightning|WebGL程序噪声与分支路径生成短时闪电，亮核和辉光按时间闪现并可响应指针。|以bolts、branches和spread分配分叉结构，用thickness、glow和色彩设置发光，时间函数控制出现。|闪电含强明暗变化，不适合长时间阅读背景，也不是电力分析结果。|游戏宣传,能量主题短时开场|学习正文背景
PrismaticBurst|WebGL在中心径向坐标中合成多条棱彩射线，扭曲、缩放和时间流动形成向外爆发。|设置rayCount与rayWidth生成光线，distort、twist和zoom调整径向坐标，animationType决定时间运动。|爆发视觉不代表真实光谱或辐射数据；避免持续高强度覆盖正文。|活动发布瞬间,数字艺术主图|定量光谱分析
Galaxy|WebGL将星点分布到多层深度场，时间旋转和指针视差改变星群位置及亮度。|用density与glowIntensity控制星点，focal和rotation定义视角，starSpeed与speed推进运动，mouseInteraction决定视差。|星空为程序装饰，不包含真实星表坐标；闪烁和快速旋转需可停。|天文兴趣入口,科幻内容首屏|真实星图导航
Dither|WebGL把连续波动噪声场按有限色数和像素格离散化，输出复古抖色或点阵纹理。|用waveFrequency、waveAmplitude和waveSpeed生成场，以colorNum和pixelSize量化颜色与空间，按鼠标开关调整扰动。|低色数是视觉风格，不用于要求保真颜色的图像或数据内容。|复古数码品牌,像素艺术背景|保真图像查看
FaultyTerminal|OGL片元场组合格纹、数字噪声、扫描线和故障闪变，指针可扰动局部终端图案。|配置gridMul和digitSize确定纹理密度，scanlineIntensity、glitchAmount、flickerAmount与noiseAmp调整故障层。|图案不是真实终端输出或任务日志；高闪烁不应覆盖学习和办公内容。|复古科技封面,游戏活动背景|真实操作日志界面
RippleGrid|WebGL规则网格以径向波纹场改变位置或亮度，自动脉冲和点击扰动可独立配置。|按cellSize与lineWidth建立格子，以rippleStrength、rippleSpeed和rippleSize推进波纹，autoRipple控制无人操作时的变化。|网格波纹是装饰，不提供真实数据坐标和交互单元选择。|科学主题氛围,工具首页背景|数据表格
DotField|Canvas点阵用指针径向力、凸起场和波形更新每个点的位置与亮度，局部高光表现空间感。|以dotRadius与dotSpacing生成点，cursorRadius和cursorForce控制影响，bulgeStrength与waveAmplitude叠加凸起波动。|点阵是装饰网面，不能用点位变化暗示真实统计数据。|互动工具入口,立体设计背景|精确统计散点图
Threads|WebGL曲线距离场绘制多组流动细线，指针位置使局部线束偏移或让出空间，形成连续的波形轮廓。|由lineCount、thickness与distance确定线密度，amplitude和waves定义波形，enableMouseInteraction决定局部扰动。|不是逐根DOM线或真实流程连接，不能将装饰线束当作可编辑关系图。|研究品牌首屏,轻量创意背景|业务流程编辑器
Hyperspeed|Three.js道路几何、车灯实例与光轨着色共同构成高速穿梭场景，按住交互改变速度与视场。|按lanes、roadWidth和curve构建道路与车灯流，speed推进轨迹，boost与boostFov在交互时改变运动和摄像机。|高速透视运动可能引起不适，必须能暂停；道路不是真实地图或交通模拟。|赛车活动,速度主题发布页|长时间学习阅读
Iridescence|WebGL片元场按动态波纹法线和颜色相位合成虹彩褶皱，指针扰动改变局部流动。|设置scale、detail与amplitude构造起伏场，speed和rotation推进相位，mouseReact决定交互混入。|虹彩是程序着色，不代表真实薄膜干涉参数；避免影响内容色彩判断。|美妆或材料品牌,艺术作品首屏|颜色校准工具
Waves|WebGL以多层线条和波函数构建曲面网格，指针施加局部扰动，背景颜色与线条可独立设置。|使用spacing、lineWidth与rotation组织线场，amplitude、scale和twist控制波形，指针位置进入局部uniform。|线波是装饰，不应给每条线赋予未经提供的数据含义。|自然主题品牌,创意工具首页|真实测量波形图
GridDistortion|WebGL通过位移网格纹理扭曲源图，指针激励附近网格单元，松开后按relaxation衰减恢复。|加载图片并按grid初始化位移场，以radius和strength写入力，mode、softness与chroma调节重采样合成。|图像只在显示上扭曲，不修改原文件；文字截图与图表不适合强位移。|摄影互动封面,艺术项目卡|文档与证件阅读
Ballpit|Three.js批量球体按简化物理碰撞与边界约束更新位置，鼠标跟随体参与碰撞形成互动球池。|初始化球体尺寸和位置，按每帧步长求解碰撞与回弹，followCursor决定指针是否推动球群，再更新实例矩阵。|球池是轻量装饰模拟，不是精确物理实验；数量和接触计算需受控。|趣味活动首页,创意玩具品牌|真实力学测量
Orb|WebGL片元着色器围绕中心能量球绘制波动轮廓、高光与泄光，悬停可改变旋转或强度。|用size、wobble和glow配置球体距离场，colors与hue设置颜色，时间和交互驱动表面纹理。|是二维着色器球体外观，不是可旋转的真实三维球模型或原子结构。|智能体视觉入口,能量主题首屏|准确分子教学模型
LetterGlitch|WebGL字符图集覆盖网格，单元按随机相位换字和换色，并用平滑混合或扫描区域形成故障矩阵。|以characters、fontSize和spacing生成字形图集，按glitchAmount、speed和smooth更新单元状态。|随机字符不是真实代码、日志或加密结果，应与实际信息显示区域分开。|电子艺术背景,复古科技封面|真实任务日志
GridMotion|DOM图片或文字块铺成倾斜网格，分行循环位移并接受指针速度或位置影响，悬停项可突出。|按rows、aspectRatio和gap分布内容，angle与tilt设置墙面姿态，speed和direction驱动行间移动。|连续流动的内容不适合作为唯一可访问目录，复制项需处理焦点与替代文字。|作品集内容墙,品牌图片背景|主要资料列表
ShapeGrid|Canvas按正方、六边形、圆或三角铺网格，整体坐标随时间移动，鼠标单元可变色或填充。|用shape、cellSize和lineWidth生成几何单元，以direction和speed推进循环偏移，hoverColor处理指针命中。|移动网格只是背景，不具备表格数据或游戏棋盘规则。|几何品牌首屏,工具页面空白背景|可操作数据表
LiquidChrome|OGL片元着色器用周期噪声扭曲表面采样，并以高对比反射带和基色形成液态铬质感。|baseColor决定底色，frequencyX与frequencyY控制纹理尺度，amplitude、speed和interactive改变流动。|金属反光是程序近似，不采样真实环境或材料物理参数。|金属或潮流品牌,数字艺术背景|真实材质标定
Balatro|OGL按旋转坐标与噪声场混合三色漩涡，再用像素化和对比处理形成扑克游戏风格背景。|设置spinRotation、spinSpeed和offset控制旋转中心，color1至color3构建色带，lighting和contrast调节层次。|这是风格化漩涡，不代表游戏规则、概率或动态数据。|复古游戏活动,像素艺术封面|真实游戏状态分析
`.trim();

const microRows = `
BellToggle|按钮以选中状态控制铃铛SVG图标摇动、标签模糊交叉过渡和容器宽度弹簧变化，关闭与开启标签分层交接。|维护on/off状态，依据offLabel与onLabel测量标签宽度，以ringAmplitude摇动图标并切换内容。|只是本地切换反馈，不自动订阅通知或获取系统通知权限。|通知偏好,关注状态切换|声称已启用系统推送
BranchedMenu|DOM分组菜单配合SVG树干枝线，展开时逐项显现，活动项目改变强调线的路径长度和位置。|以items建立层级，测量行高与缩进，defaultOpen和defaultActive初始化状态，选中后更新分支高亮。|仅负责菜单结构和视觉，不替业务决定权限、路由或数据树查询。|知识分类入口,轻量工具菜单|大规模复杂权限树
CallChip|工具状态胶囊根据外部status在等待、执行、成功或失败之间转换，以填色扫动和耗时显示表现运行。|根据name、argument和status渲染标签，执行时计时并推进填充，错误时显示失败与重试回调入口。|视觉胶囊不执行真实工具，也不能把expectedMs估算进度冒充服务端真实进度。|智能体工具调用展示,工作流步骤状态|伪造后台任务成功
CodeSlots|多格验证码输入维护单一值，Motion为各格数字和底色安排进入、错误清除及成功合并状态。|以length拆分值并处理输入或粘贴，mask决定视觉隐藏，status更新错误序列或成功色，保持焦点位置。|不自带验证码校验、发送短信或安全认证，需接入真实后端与适当输入语义。|登录验证码输入,短码确认|声称已完成身份认证
CometDial|旋钮将指针角度映射到数值，弹簧平滑读数，SVG刻度高亮按角速度拖出彗星尾迹。|按min、max和step确定取值，拖动时计算相对圆心角度并钳制，尾迹根据旋转速度衰减。|需提供键盘或数值输入替代，装饰彗星不能影响实际选中值和单位。|音频参数,创意属性旋钮|极高精度测量调节
DodgeField|Motion驱动容器内目标躲开指针，局部距离场决定逃离方向，并在限定尝试后回归可点击位置。|用reach与radius计算接近程度，在fieldHeight限定区域内生成逃离目标，再按fleeDuration回位并更新提示。|不能用于必须可靠点击的提交、关闭或同意按钮；趣味躲避不应阻碍任务完成。|游戏化趣味展示,可选互动彩蛋|关键提交和关闭按钮
FlipCard|Motion以绕X或Y轴的三维旋转切换前后两面，拖动距离和释放速度决定翻转或弹回。|保留front、back两层并设置背面不可见，axis控制翻转轴，点击或dragDistance阈值更新翻面状态。|背面隐藏内容不可作为唯一重要信息，触屏和键盘应有明确翻面入口。|学习记忆卡,产品双面介绍|主要表单填写面
FolderFloat|文件夹盖板旋转后，笔记项以弹簧或Matter.js物理云浮出，选择或关闭时回收到文件夹内。|按items构造笔记卡，trigger控制开合，physics与drift决定浮动方式，closeOnSelect控制选择后的回收。|是视觉分类选择，不是真实文件夹；动态笔记应保留稳定可点击命中与文字。|创意资料入口,笔记选择器|真实文件系统操作
FuseButton|完成操作后按钮暂时切换到撤销标签，计时线表示undoWindow剩余时间，点击或Escape可回退状态。|先由业务确认动作已执行再显示撤销窗，维护倒计时和undo回调，到期切换doneLabel并清理定时器。|按钮只提供撤销交互外观，真正的数据回滚必须由业务实现，不能假装删除已撤销。|可撤回的列表操作,轻量收藏变更|不可逆操作的假撤销
GlideSelect|下拉菜单以芯片角部为展开原点，统一高亮层在各行之间滑动，重新进入时可从上次位置继续。|用options建立可选择项，按hover与selected分别维护高亮位置，菜单开合时同步焦点和选中标签。|高亮视觉不等于选择提交；需验证Escape、方向键、外部点击和移动端可达性。|模型或分类选择,短偏好菜单|大量复杂筛选项
HoldButton|按住按钮时内部填色随时间上升，提前释放会回退，蓄满后切换为完成状态并触发回调。|记录按下时间并逐帧计算保持进度，把fillColor限制到按钮内部；释放、取消或触摸移出都应结束当前蓄力。|只是长按确认手势，不代表真实后台动作完成；必须考虑键盘与辅助操作替代。|趣味确认,低风险启动操作|高风险或不可逆动作的唯一确认方式
JellyRadio|Motion使选中芯片先沿横向膨胀再纵向回弹，相邻项目通过布局动画顺势让位。|根据items维护单选值，按swell和尺寸更新选中胶囊与文字颜色，状态变化后触发业务回调。|视觉果冻不能改变实际单选规则，选中态需通过颜色以外的方式可识别。|少量风格选择,偏好标签|密集复杂多选表单
LatticeLoader|DOM小格子按时间相位和pattern形成亮度波，外部status完成后改为勾或叉与状态文字。|根据grid与shape建立有限格子，运行时推进格子相位和计时，收到完成或错误状态后停止循环。|不能用固定时间假装真实任务完成，任务状态必须由业务传入。|智能体任务等待,后台步骤反馈|未经真实接口的完成证明
PaperCrumple|Three.js细分纸面网格根据抓取点和折皱场变形，保持正反面纹理并在释放时收拢或展开。|加载图片并建立网格，指针拖动改变局部折皱与抓取位置，以crumpleAmount和releaseBehavior控制释放目标。|纸张效果是视觉近似，不是真实材料仿真；图片资源和WebGL需可用。|艺术作品互动,创意商品说明|重要文档原文展示
PeekRating|星级项根据指针悬停索引依次抬起，提示标签跟随预览，点击后保存评分并播放确认弹跳。|维护preview与value两个状态，按count和labels渲染选项，移出恢复已选值，点击才触发评分回调。|预览不等于提交，真实评分存储与防重复提交需业务实现。|内容评分,轻量满意度反馈|必须精确量化的专业评估
PromptBar|输入栏把真实文本编辑与来源、命令、模型等选择菜单组合，外部busy状态将发送入口切换为停止。|管理输入、附件与菜单选择，用sources、commands、models构造选项；发送和停止只调用接入方提供的回调。|不自带大模型、语音识别或文件解析；附件预览和模拟状态不能冒称已上传或分析。|智能体聊天输入,创作工具提问栏|声称已接通模型或识别服务
PulseHeart|爱心图形先缩小到接近一点，在最小尺度切换颜色与选中态，再回弹并替换计数字符。|区分liked状态和count显示，点击时串联收缩、换色和弹回时间线，业务回调负责保存真实点赞。|动画与计数是UI状态，不自带用户身份、防重点赞或后端统计。|作品收藏,内容点赞|真实点赞数未经验证的营销展示
RefineFrame|固定比例媒体框把排队、生成、优化、完成和错误映射到不同的模糊、饱和度、缩放及状态覆盖层。|由外部status驱动阶段，媒体加载后保持aspectRatio，stageDuration只控制视觉过渡，错误显示重试入口。|不生成真实图片，也不凭计时自行宣称生成完成；图像结果与状态应由服务端提供。|AI媒体任务预览,渲染结果面板|伪造图片生成结果
RubberSegment|Motion共享滑块在分段选项间移动，跨间距时拉长并在目标处压缩，拖动释放速度影响切换。|测量各slot边界，按equalSlots和inset计算滑块目标，拖动时插值形状并在释放后吸附到有效索引。|只改变选择反馈，受控值与键盘切换需要正确接入，不能依赖拖拽才能选择。|视图切换,少量模式选择|大量选项导航
ScrubField|数值芯片把横向拖动差映射到值，超出范围时视觉橡皮衰减，点击切换为真实数值输入。|依据sensitivity和step累计拖动量并钳制min/max，拖动结束提交值，单击编辑时使用输入框与suffix单位。|装饰溢出不能写入非法值；精确输入和键盘调整必须保留。|设计属性面板,尺寸与强度调节|只有拖动的精密数值输入
Shredder|DOM列表行拖入缝隙后由Canvas或分片层切成纸条，纸条卷曲下落，剩余列表弹性补位。|测量拖动行与slit位置，进入投喂区后按feedSpeed推进分片，完成视觉后通过回调移除对应业务项。|碎纸视觉不代表安全删除文件，重要数据删除应有业务确认或撤销能力。|创意待办删除,低风险列表整理|真实文件安全销毁
SlideCommit|可拖动把手沿轨道推进，达到末端才进入执行状态，成功展开完成标签，失败回弹并显示错误。|把拖动位置规范化为进度，阈值满足后调用业务动作，外部结果驱动done/error而非用滑到底直接判成功。|手势只是确认方式，不自带真实提交；键盘和辅助输入应有等价确认入口。|低风险确认操作,趣味任务启动|不可访问的唯一提交入口
SlingButton|Motion与SVG把拖动发送键表现为弹弓，拉力弧线和弹簧回弹对应拖动距离与释放状态。|记录按钮相对原点的拉伸，按armAt和maxPull计算有效蓄力，满足阈值释放后调用动作并回收绳线。|不负责真实消息发送；应提供普通点击或键盘替代，避免拖动与页面滚动冲突。|创意聊天彩蛋,游戏化发送|效率优先的正式输入界面
SloshGauge|CSS或DOM液面随数值改变目标高度，速度与惯性驱动倾斜及波浪，支持可选竖向拖动。|将值映射到容器液面高度，维护高度变化速度与衰减，满液位时处理顶部冲击，interactive才绑定拖动。|液体仪表是数值外观，不是真实液体体积、温度或压力模拟。|进度展示,趣味参数仪表|精确科学液位测量
SpringCheck|勾选状态同步驱动方框填色、SVG勾线绘制、标签划线与透明度，Motion弹簧统一安排反馈。|先维护checked业务值，再以同一状态更新box、check与label，disabled时禁止交互且保留语义选中态。|动画不代表待办任务已经由后端完成，实际完成状态需调用方确认。|待办清单,步骤检查项|未经确认的业务完成证明
SquishSwitch|Motion把开关滑块的拖动速度映射为横向拉长与末端压缩，跨过阈值后切换checked。|测量轨道有效行程，点击或拖动更新目标，释放时依据位置和速度决定吸附，再用弹簧恢复形状。|仅是开关交互，实际设置修改、权限和失败回滚需要业务接入。|偏好开关,轻量设置|没有语义状态的纯装饰开关
StatusMark|SVG状态标记从虚线环、旋转或进度弧过渡到原位勾叉，形变与路径长度对应外部状态。|用status选择idle、running、done或error，按进度值绘制弧长，完成后交接到勾叉而保持标记占位。|不可通过本地计时假装任务成功；颜色和图形需同时表达状态。|工作流步骤,智能体任务行|真实状态不可知的成功展示
SwipeRow|Motion让列表行横向位移以露出操作抽屉，释放速度决定吸附，完整滑动可触发动作并移除行。|按actions与actionWidth布置抽屉，追踪拖动距离和速度，满足full-swipe阈值后才调用指定业务回调。|滑动不能成为删除等操作的唯一入口；误触与真正数据撤销需业务处理。|消息或任务列表,移动端轻量操作|不可逆的隐藏删除入口
SwipeToast|提示条从边缘进入并显示剩余时间，悬停暂停倒计时，拖动下滑或动作回调关闭。|由open控制生命周期，以duration或计时状态计算细线，暂停与恢复累计剩余时间，关闭后清理定时器。|短时提示不能承载唯一关键错误信息，应有可再次访问的状态或记录。|操作反馈,轻量任务通知|不可恢复的重要故障说明
TearTicket|DOM票根与SVG纤维连线随拖动逐段断开，票根旋转下落，主体在撕开后显示已使用视觉状态。|按orientation布置主体与stub，记录拖动位移和纤维阈值，撕开完成后调用回调并安排票根退场。|视觉撕开不等于真实核销、支付或优惠券生效，需服务端确认业务状态。|活动票券演示,趣味领取卡|真实票券核销的唯一依据
ThoughtLine|状态标题按思考开始、步骤更新和结束维护计时及折叠，图标呼吸与文案变化对应外部进程。|以steps建立可展开过程，运行时计时并更新图标，结束后替换为耗时，collapseOnSettle决定是否收拢。|组件只展示提供的过程，不能编造模型内部推理、步骤或真实执行进度。|智能体任务摘要,多步骤工具反馈|伪造模型思考内容
VoicePill|麦克风按钮根据按住或切换状态伸展为胶囊，绘制音量条与计时，结束或取消后缩回。|维护录音交互状态与取消手势，默认模拟波形；实际麦克风分支须明确启用并把真实电平传入显示。|默认演示不是语音识别；真实麦克风需要用户授权、停止清理与单独的识别服务。|智能体语音输入演示,聊天录音控制|暗中开启麦克风或声称已转写
WakeSlider|Motion驱动一排竖条围绕滑块当前位置形成速度相关尾波，静止后条高恢复，值保持规范化。|将指针横坐标映射到min/max与step，按拖动速度计算邻条延迟抬升，松手后以弹簧收回波形。|尾波表示交互速度，不是真实音频电平；需额外显示精确当前值与键盘调整。|音量或强度调节,创意参数面板|真实音频测量仪表
WarmTooltip|Portal与Motion把同组提示的延迟共享，首次悬停等待、连续项快速切换，指针速度可带动轻微倾斜。|在分组状态中维护warm窗口，进入目标时决定延迟并定位浮层，移出或Escape关闭，目标切换时复用过渡。|提示只能补充说明，核心操作文案不可仅在悬停显示；需同时支持键盘焦点。|图标工具栏说明,辅助标签|触屏唯一的功能说明
`.trim();

const editorial = new Map([mechanismRows, backgroundRows, microRows].flatMap(rows => rows.split('\n').map(row => {
  const parts = row.split('|');
  if (parts.length !== 6) throw Error(`Invalid editorial row: ${parts[0]}`);
  return [parts[0], { summary: parts[1], algorithm: parts[2], limitation: parts[3], scenes: parts[4].split(','), avoid: parts[5] }];
})));

function sourceSpecificProfile(item, facts) {
  const cli = cliOf(item.entry); const row = editorial.get(cli);
  if (!row) throw Error(`Missing source-specific editorial profile: ${cli}`);
  const category = new URL(item.entry.sourceUrl).pathname.split('/')[1];
  const border = ['ElectricBorder', 'StarBorder', 'BorderGlow'].includes(cli);
  const surface = ['SpotlightCard', 'GlareHover', 'HoloCard', 'ProfileCard', 'GlassIcons', 'ReflectiveCard', 'FluidGlass', 'DecayCard', 'PixelCard', 'SpecularButton', 'ShapeBlur', 'DitherVeil', 'HalftoneReveal', 'GridDistortion', 'RippleDistortion', 'PixelTransition', 'PixelSwap', 'MetallicPaint', 'StickerPeel'].includes(cli);
  const structural = /Nav$|Menu$|Sidebar$|Gallery$|Carousel$|^Masonry$|^Stack$|^ScrollStack$|^CardSwap$|^Dock$|^Stepper$|^MagicBento$|^AnimatedList$|^GridMotion$|^Folder$/.test(cli);
  const layers = category === 'text-animations' ? ['text'] : category === 'backgrounds' ? ['page-background'] : border ? ['border', 'outer-glow'] : surface || cli === 'GradualBlur' ? ['surface'] : structural ? ['layout', 'content'] : ['content'];
  const files = item.registry.files.map(file => file.path).join('、');
  const controls = Object.keys(facts.defaults).filter(key => !['className', 'style', 'children'].includes(key)).slice(0, 6);
  const budget = Object.keys(facts.defaults).filter(key => /(?:count|density|resolution|pixelRatio|segments|quality|dpr)/i.test(key)).slice(0, 3);
  const limitations = [row.limitation, facts.usesWebGL ? '接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。' : facts.usesScroll ? '接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。' : category === 'micro' ? '接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。' : '接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。'];
  if (/ScrollTrigger\.getAll\(\)\.forEach\([\s\S]{0,120}?kill\(/.test(facts.source)) limitations.push('源码接入注意：清理阶段使用ScrollTrigger.getAll().forEach(...kill...)会影响整页其他实例；集成时应改为只清理本实例创建的trigger，避免破坏其他滚动动效。');
  if (facts.usesCamera) limitations.push('真实摄像头或麦克风分支必须单独授权并清理媒体轨道；默认演示不代表已获取用户媒体或已接入识别服务。');
  const stopProp = ['paused', 'pause', 'disableAnimation', 'autoplay', 'autoAnimate'].find(key => key in facts.defaults);
  const stopAdvice = stopProp ? `使用实际提供的${stopProp}控制或宿主开关停止持续运动，` : '由宿主提供暂停或静态状态并停止持续时间线，';
  const mobile = category === 'text-animations' ? '项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。' : facts.usesWebGL ? `项目接入建议：降低${budget.length ? budget.join('、') : '绘制分辨率和同时可见元素数量'}并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。` : facts.usesScroll ? '项目接入建议：检查短屏滚动行程、内部滚动与外部页面的分工，适度减少可见层数，保留全部内容和可直接操作入口。' : /拖动|拖拽|滑动|甩动/.test(item.entry.trigger) ? '项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。' : '项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。';
  const cleanup = facts.usesWebGL ? '销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。' : facts.usesRAF ? '卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。' : facts.usesScroll ? '卸载时只清理本实例观察器或滚动触发，避免全局销毁其他动效。' : '卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。';
  return {
    summary: row.summary,
    steps: [`在React客户端引入锁定registry的${files}，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。`, row.algorithm, `${controls.length ? `使用源码已提供的${controls.join('、')}等属性配置；` : '以源码实际接口和受控状态配置；'}触发依据：${item.entry.trigger}。业务数据、额外按钮或新触发方式均须标为接入适配。`, `项目接入建议：限制在${layers.join('、')}层，保留原有正文、输入与布局；${cleanup}`],
    suitableFor: row.scenes, avoidFor: [row.avoid], layers, limitations, mobile,
    reducedMotion: `项目接入建议：遵循用户暂停和prefers-reduced-motion；${stopAdvice}以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。`,
    performance: facts.usesWebGL ? `项目接入建议：控制GPU绘制面积${budget.length ? '及'+budget.join('、') : '与资源分辨率'}，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。` : facts.usesCanvas ? '项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。' : '项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。'
  };
}

function knowledge(item) {
  const cli = cliOf(item.entry); const facts = sourceFacts(item.registry); const profile = profiles[cli] || sourceSpecificProfile(item, facts);
  return { entryId: item.entry.id, sourceUrl: item.entry.sourceUrl, basis: 'source-code', implementation: { summary: profile.summary, steps: profile.steps, dependencies: item.registry.dependencies || [], parameters: Object.fromEntries(Object.entries(facts.defaults).filter(([key]) => !['className', 'style'].includes(key))) }, suitableFor: profile.suitableFor, avoidFor: profile.avoidFor, layers: profile.layers, limitations: profile.limitations, mobile: profile.mobile, reducedMotion: profile.reducedMotion, performance: profile.performance, evidence: [{ url: item.meta.url, kind: 'registry', checkedAt: item.meta.checkedAt, sha256: item.meta.sha256, hashScope: 'registry-response', paths: item.meta.files.map(file => file.path) }], notes: `依据catalog锁定commit ${item.meta.commit}的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。` };
}

const results = []; const failures = []; let next = 0;
await Promise.all(Array.from({ length: 5 }, async () => {
  for (;;) {
    const index = next++; if (index >= catalog.length) return;
    try { results.push(await fetchRegistry(catalog[index])); }
    catch (error) { failures.push({ entryId: catalog[index].id, name: catalog[index].name, error: error.message }); }
    if ((index + 1) % 25 === 0) console.log(`React Bits official registry: ${results.length} fetched / ${index + 1} attempted`);
  }
}));
results.sort((a, b) => catalog.indexOf(a.entry) - catalog.indexOf(b.entry));
await mkdir(reportDir, { recursive: true });
const report = { generatedAt: new Date().toISOString(), source: 'reactbits', readyCount: catalog.length, fetchedCount: results.length, failures, method: 'Each record uses its catalog-pinned official GitHub registry; sources are cached as text and never executed.' };
await writeFile(path.join(reportDir, 'reactbits-report.json'), JSON.stringify(report, null, 2) + '\n');
if (failures.length) { console.log(JSON.stringify(report)); process.exitCode = 1; }
if (process.argv.includes('--fetch-only')) {
  console.log(JSON.stringify({ ...report, facts: results.map(item => { const facts = sourceFacts(item.registry); return { name: item.entry.name, cli: cliOf(item.entry), dependencies: item.registry.dependencies, props: facts.defaults, features: Object.fromEntries(Object.entries(facts).filter(([key]) => key.startsWith('uses'))) }; }) }, null, 2));
}
if (process.argv.includes('--sample')) {
  const samples = ['LiquidEther', 'GlassSurface', 'OrbitImages'].map(cli => knowledge(results.find(item => cliOf(item.entry) === cli)));
  await writeFile(path.join(reportDir, 'reactbits-report.json'), JSON.stringify({ ...report, status: 'samples-for-review', samples }, null, 2) + '\n');
  console.log(JSON.stringify(samples, null, 2));
}
if (!process.argv.includes('--fetch-only') && !process.argv.includes('--sample')) {
  if (failures.length || results.length !== catalog.length) throw Error('Official source coverage is incomplete; original knowledge file was not replaced.');
  const records = results.map(knowledge);
  for (const record of records) {
    if (record.implementation.summary.length < 35 || record.implementation.summary.length > 700 || record.implementation.steps.length < 3 || record.suitableFor.length < 2 || record.limitations.length < 2 || !record.evidence[0].sha256) throw Error(`Knowledge validation failed: ${record.entryId}`);
  }
  const destination = path.join(root, 'data/case-knowledge/reactbits.json'); const temporary = destination + '.tmp';
  await writeFile(temporary, JSON.stringify(records, null, 2) + '\n'); await rename(temporary, destination);
  const completeReport = { ...report, knowledgeCount: records.length, dedicatedProfiles: Object.keys(profiles), sourceSpecificMechanismRows: [...editorial.keys()], sharedAdvice: '210项有各自独立的机制/算法步骤/限制/场景，React接入、资源清理、移动端与减少动态建议按源码检测的渲染族复用；其余3项为完整专门profile。', globalTriggerCleanupWarnings: records.filter(row => row.limitations.some(text => text.includes('ScrollTrigger.getAll'))).map(row => row.entryId) };
  await writeFile(path.join(reportDir, 'reactbits-report.json'), JSON.stringify(completeReport, null, 2) + '\n');
  console.log(JSON.stringify({ readyCount: catalog.length, fetchedCount: results.length, knowledgeCount: records.length, failures, globalTriggerCleanupWarnings: completeReport.globalTriggerCleanupWarnings }));
}
