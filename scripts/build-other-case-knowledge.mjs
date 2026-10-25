import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import ts from 'typescript';

// These descriptions are individually curated against the cached official registry files.
// Fields: slug | mechanism | three or more implementation steps | layers | specific limitation | unsuitable context.
const aceternityRows = `
bento-grid|CSS Grid把不同跨度的信息卡组合为便当布局，悬停只轻移卡内说明。|用响应式Grid设置列数与间距~让重点卡跨列、次要卡保持单格~分别放置header、title、description与icon插槽，给局部hover位移保留空间|layout,content|布局本身不是持续动画，不能用跨列卡片数量冒充强主视觉。|需要按行连续阅读的长篇正文
layout-grid|共享layoutId把被点击的网格卡平滑扩展为聚焦详情层。|将图片与文字渲染为带稳定ID的网格卡~点击后记录selected并显示覆盖层~用共享布局标识过渡卡片几何与圆角~关闭时恢复原格位及触发按钮焦点|layout,content|详情覆盖层的焦点锁定、Escape和返回焦点需在接入时核对补齐。|无法提供关闭或返回入口的展开详情
sidebar|侧栏宽度状态与链接标签显隐联动，桌面hover展开并另设移动菜单。|建立open状态并提供Sidebar上下文~桌面指针进入时扩展宽度和标签~移动端由按钮切换独立遮罩菜单~链接点击执行实际导航而非仅播放动画|layout|原演示的链接和头像属于示例数据，路由与权限需另接业务。|要求永远完整显示全部标签的密集管理页
timeline|粘性阶段标题与纵向时间线配对，滚动进度驱动亮色路径高度。|测量时间线内容区域高度~逐段排列标题与描述并让阶段标签sticky~读取该容器scrollYProgress映射线条高度与透明度~内容变化后重新测量而非写死初始高度|layout,content|动态加载内容、嵌套滚动容器和顶部固定栏会影响进度测量，需项目侧重新校准。|没有纵向阅读顺序的即时聊天流
background-gradient|两层径向渐变位于内容下方，清晰渐变与模糊外晕同步改变背景位置。|相对定位外壳保留描边间距~叠放清晰渐变层和blur外晕层~animate启用时循环改变400%背景的position~用独立较高层级的子内容覆盖中央阅读面|surface,outer-glow|原组件绘制背景和外晕，不是掏空的纯边框；只需玻璃边缘时必须另加遮罩改造，不能给内部surface铺满渐变。|要求仅有窄描边却允许整面彩色覆盖的表单
background-boxes|大量错列网格单元在hover时切换底色，透视变换形成背景平面。|生成行列方格并稳定分配色彩~对网格外层设置倾斜透视~每格whileHover改变backgroundColor~把文字与操作放到网格之外的独立前景层|page-background|方格数量随行列相乘增长，逐格DOM事件和透视背景不宜覆盖整个长页面。|正文密集或大量可编辑单元格的区域
glowing-effect|根据指针与卡片中心夹角转动conic-gradient，通过遮罩只显示边缘光。|监听指针并用局部矩形计算距离与角度~在inactiveZone内关闭高光、proximity范围内激活~平滑更新CSS角度变量驱动锥形渐变~用边缘遮罩与borderWidth隔离内容面|border,outer-glow|源码disabled默认true，需明确启用；它是指针追踪边缘，不是自动沿轮廓跑动的MovingBorder。|要求无人操作也持续绕边运行的焦点动画
text-reveal-card|两层文字叠放，用卡片内指针横向比例裁开上层文字，并配合分界高光。|建立同尺寸的底层与上层文字~把clientX减容器left映射为0到100的裁切比例~在指针进入时显示高光与揭示层~离开恢复覆盖状态，并提供触屏可见的说明替代|text,content|这是整块裁切揭示，不是逐词模糊入场；主要信息不能仅藏在hover后的第二层。|必须一次完整可读的题目和答案
grid|重复网格或圆点背景结合径向遮罩形成静态底纹。|用背景图案平铺细线方格或圆点~按主题设置低对比图案色~叠加径向淡出遮罩并把内容置于其上|page-background|旧grid文档已迁移；缓存registry依赖示例中的grid工具类，项目需补齐对应背景样式，不是CSS Grid内容布局。|被误当作自动扫描动画的强动效首屏
moving-line|滚动区域旁的SVG竖向路径随阅读进度伸缩，底部细线始终保留。|给内容区域设置ref并读取局部滚动进度~按源码固定路径渲染SVG，若按内容高度伸缩则另做测量与路径改造~将进度映射到亮线pathLength~将提示线放在正文侧边并预留内边距|content|源码路径和高度固定为1567，动态内容测量属于项目改造；触发源是滚动而非自动闪烁，当前来源使用registry，不拼接失效演示地址。|无需滚动就必须出现持续变化的背景
sparkles|tsParticles粒子引擎在透明画布上生成大小与透明度不同的闪烁星点。|初始化并加载粒子精简引擎~根据区域面积设置粒子密度与颜色~使粒子透明度和尺寸在各自节奏中变化~在前景遮罩中保留文字对比与点击通路|page-background,outer-glow|引擎初始化、粒子密度与多实例画布都有成本；闪烁装饰不应影响阅读或被声称为业务状态。|对光敏变化敏感的长时阅读背景
spotlight|静态SVG柔光束通过CSS入场动画从斜上方照亮标题。|创建含模糊滤镜的SVG光束~绝对定位并旋转到标题后方~加载时从透明位移状态显现~完成后保留柔光与稳定前景内容|page-background|原版主要是入场聚光，未提供指针追踪；需补齐文档中的spotlight关键帧样式。|明确要求鼠标移动时实时追踪的交互光斑
glowing-stars|星点矩阵在空闲时随机闪亮，hover时改为整片星阵依次亮起。|用行列索引生成小星点~为空闲状态周期选择少量活动索引~hover时切换为有stagger的全阵列亮起~离开恢复随机序列并清理计时器|surface,outer-glow|星阵是卡片局部装饰，不能替代独立可见的整页主视觉；星点过多会增加动画元素数。|必须保持安静且无亮度变化的正文背景
animated-tooltip|头像上方的提示层以弹性入场，并根据头像内横向指针位置偏移与旋转。|记录当前hover的头像ID~读取头像中心与指针偏移~用弹簧运动值映射提示层x与rotate~退出时通过AnimatePresence收起并保留头像可访问名称|content|依赖hover的身份说明应有键盘focus与触屏点击替代，不能遮挡相邻头像入口。|必须在触屏上直接阅读全部说明的列表
following-pointer|在局部卡片内把系统指针替换为跟随位置的姓名箭头浮层。|监听容器进入与离开并切换可见状态~把局部指针坐标写入浮层位置~用不拦截事件的箭头和标签替代原指针~离开区域恢复系统光标|content|光标装饰只用于精确指针设备；不能宣称多人实时协作，姓名数据与同步需要真实接入。|触屏主导或需要系统精确文本选择的编辑区
background-beams|多条SVG弯曲路径共享低透明底线，各自渐变端点循环移动形成穿梭光束。|在固定viewBox内定义曲线路径~给每条路径分配独立渐变标识~用Motion循环改变渐变x1/y1/x2/y2~把SVG作为不拦截点击的底层并保持内容静止|page-background|是路径上的渐变运动而非整条曲线位移；多实例gradient ID需项目侧隔离。|需要显示精确数据含义的真实连线图
svg-mask-effect|上下两层内容叠放，圆形mask随局部指针移动揭示另一层。|创建同范围的普通内容与masked内容~监听指针换算相对坐标~改变mask-position与mask-size~重点区域hover时扩大遮罩并在移出后复位|content,surface|被遮罩层只作补充揭示，不应承载唯一的关键说明；需核对CSS mask兼容与触屏替代。|法规说明或必须立即完整呈现的教学答案
infinite-moving-cards|复制卡片序列并用CSS横向动画把整条轨道连续移动实现无缝循环。|复制首轮卡片节点形成至少两轮序列~按方向和速度设置轨道CSS变量~线性移动恰好一轮内容宽度~hover或focus时暂停以便阅读与点击|layout,content|原方法克隆节点，接入时处理重复ID、重复可聚焦元素与屏幕阅读器重复内容。|长篇重要评价或需要逐项精读的材料
3d-pin|悬停时内容平面倾斜，发光连线和圆环把链接标签抬成空间图钉。|用透视容器包住链接卡~hover时改变卡面旋转与缩放~显示沿Z方向分离的标签、光柱和圆环~离开恢复卡面并保留链接可点击区域|surface,content,outer-glow|图钉视觉不是地理定位服务；透视与外溢装饰需要足够边距。|高密度表格中相互覆盖的链接入口
evervault-card|随机字符组成加密纹理，指针附近的径向遮罩显露彩色字符层。|生成受控长度的随机字符背景~将指针位置写入MotionValue~用radial-gradient遮罩限定可见字符范围~定时或移动时更新纹理且不触碰前景正文|surface|随机字符仅为视觉装饰，不代表真实加密、隐私保护或安全状态。|需要可复制真实内容的代码或密钥展示
parallax-scroll|同页第二变体让三列图像的外侧两列在滚动时向上、向外平移并旋转，中间列保持稳定。|把图片按三段分列~明确监听画廊容器的滚动进度~两侧y均向上移动，x与rotateZ分别向左右反向展开~保持中列静止并预留外移裁切范围|layout,content|此条中文行为对应官方ParallaxScrollSecond变体；基础ParallaxScroll是上下反向列位移，不能混为同一算法。|没有足够外移空间的窄栏与密集图片表格
parallax-hero-images|首屏多张图片错相入场，不同深度图层以不同倍数跟随指针平移。|把图片以绝对位置分散在标题周围~用模糊和位移形成首次入场~将指针归一化后按各图层深度映射偏移~外层负责整体布局、内层负责视差以隔离transform|content,layout|图片只负责装饰或展示，不能在漂移中遮住主要输入；触屏没有hover位置需要固定构图。|要求每张图片始终精确对齐的资料表
tracing-beam|内容区滚动进度映射SVG渐变的y1/y2，使蓝紫光束沿侧边弯折路径推进。|测量内容高度创建对应SVG弯折路径~useScroll以内容区域为target读取进度~useTransform与useSpring把进度映射为渐变上下端点~保留静态底线与正文间距|content|缓存源码首次挂载测高度；异步内容需项目侧补测，多个实例需独立gradient ID；它不是自动循环光束。|需要作为开页自动主视觉的短内容区
container-scroll-animation|滚动让展示容器从后仰透视状态转正并同步缩放和平移。|在展示段落读取scrollYProgress~把进度分别映射到rotateX、scale与标题位移~把屏幕内容装入独立的透视卡面~选择正确滚动容器并为大幅变化预留段落高度|layout,surface|它是一个容器扶正，不是笔记本开合；内部业务控件不要再叠同一transform。|必须始终固定尺寸的表单或操作主界面
text-generate-effect|文本按空格切词后逐项从模糊与低透明度显现。|把短文本拆为保留语义的词序列~为每个词输出独立span~使用stagger顺序改变opacity与filter~结束后保留完整静态文本，不持续重播答案|text|源码按空格分词，中文无空格整句可能只成一项；需要项目侧中文分词或按字改造并说明。|长答案、公式推导与频繁变化的聊天正文
meteors|多个短亮条配合渐隐尾迹以错开的CSS动画延迟斜向滑过容器。|在限定容器内生成有限数量流星元素~为位置和animationDelay分配错相值~用伪元素渐变延长尾迹~通过meteors关键帧平移并在边界裁切|page-background|关键帧样式需随组件一起接入；这不是有真实物理速度的天文模拟。|不能容忍持续斜向穿行装饰的阅读区域
card-stack|定时轮换数组次序，以卡片索引驱动top、scale和zIndex形成层叠翻换。|用稳定id初始化卡片序列~定时把末卡移到队首~根据新索引过渡top与scale并同步层级~卸载清理计时器，项目接入增加暂停与手动切换|layout,content|源码使用模块级interval并每5秒轮换，多实例需改实例ref避免串扰；不同于本地手动CardStack适配。|需要同时完整可见全部项目的清单
moving-border|逐帧沿SVG圆角矩形路径取点，将径向光斑移动到该点，内层独立遮住中部。|创建尺寸匹配按钮的SVG rect路径~用getTotalLength获得周长并把时间映射为路径进度~getPointAtLength驱动光斑x/y~保持内部surface、内容与按钮语义独立于边缘层|border,outer-glow|原生是沿路径移动光斑而非整面渐变旋转；duration单位毫秒，不要把3000误当秒。|整页背景或要求所有表格单元都持续追光的区域
lamp|两侧conic-gradient光锥与横向亮带在入场时扩宽，标题随之向上显现。|创建左右相反方向的锥形渐变~用遮挡层裁出水平灯带轮廓~进入视口时过渡灯带宽度和亮度~让标题单独完成y/opacity入场|page-background,outer-glow,text|原版主要是入场扩展灯带，不能声称已经持续鼠标追踪；需要深色前后景对比。|浅色高密度正文或无顶部留白的工具栏
sticky-scroll-reveal|滚动段落改变activeCard，粘性视觉栏与背景色跟随当前段落切换。|把文本和视觉项按同一数据索引组织~读取局部滚动进度并匹配段落断点~当前文本提高不透明度~sticky视觉区替换对应图像并同步背景|layout,content|嵌套滚动与固定高度决定断点；小屏粘性布局需改成顺序图文避免遮挡。|只有一段说明或必须同时比较所有图文的页面
floating-navbar|比较相邻滚动进度判断方向，离开页顶后向下隐藏、向上显示顶部紧凑导航。|监听scrollYProgress当前值与前值~源码在进度小于0.05的页顶区隐藏，离开后向上显示、向下隐藏~AnimatePresence过渡导航y与opacity~给内容预留安全区并保留小屏菜单入口|layout|页顶显示导航属于另行适配，原源码页顶隐藏；它由滚动方向控制而非计时闪烁，关键返回/退出不应只靠上滑出现。|必须始终可见核心操作的考试或编辑页
navbar-menu|记录悬停菜单项，用共享布局在下方切换不同尺寸的内容面板。|记录active菜单标识~在触发项下建立绝对面板~用layout过渡面板的尺寸与位置~离开导航区域关闭，键盘与点击另设同等入口|layout,content|原生hover菜单需项目侧补键盘、focus和触屏点击行为；不能仅靠鼠标访问分类。|只有触屏操作且无展开按钮的导航
tailwindcss-buttons|按钮合集按选定示例分别使用渐变、位移、阴影或按压样式，缓存registry只包含其中一个按钮实现。|先从官方演示选择具体按钮形态~使用语义button或链接承载动作~在内层文字和装饰层分别定义hover/active状态~复核缓存示例覆盖范围，其他变体须再取对应代码|surface,border,text|这是合集而非单一算法；不能把一份registry样例当成页面里所有按钮的完整实现。|同一界面混用大量不同按钮语言造成层级混乱
card-hover-effect|卡片组共享一个layoutId高亮底板，指针切换时底板移动到当前卡片。|记录hoveredIndex~在活动卡片内渲染共享布局的背景板~利用layoutId完成跨卡片位置过渡~移出列表淡出高亮，卡片文字保持原位|surface,layout|多个卡片组的共享布局标识需隔离；高亮不是卡片本身被替换或重排。|每张卡片必须同时保持相同强调等级的比较表
google-gemini-effect|多条彩色SVG路径的pathLength受滚动进度驱动，粘性标题位于汇聚区域。|在较高滚动段内布置固定SVG路径~把滚动MotionValue分别映射到各线路径长度~为彩线叠加克制的模糊底光~保持sticky标题与按钮稳定且不被SVG拦截|page-background,content|原生需要外部提供路径进度值；不能把自动时间循环冒充滚动绘线。|缺少足够滚动距离的短弹窗
gooey-input|通过SVG黏合滤镜把紧凑入口和展开输入框连成液滴形变。|建立打开和输入值状态~点击入口扩展输入框并聚焦~用blur与colorMatrix滤镜融合背景形状~空值失焦时收拢，文字层独立不被滤镜模糊|surface,layout|滤镜只应作用背景形状，输入文字和焦点轮廓保持清晰；搜索结果与提交逻辑需另接。|需要常驻完整可见输入框的长表单
typewriter-effect|逐字出现的标题与独立闪烁光标组成打字效果，另有平滑整句展开变体。|把短文本拆成字符并保留单词分组~进入视口后按顺序改变字符可见性~独立设置光标循环与文本出现节奏~确定使用逐字版或整句平滑版，不混写触发与参数|text|无空格中文需明确拆分规则；不要把整个答案延迟到动画结束才能读。|必须立即阅读的错误提示和推导正文
3d-card|局部指针位置驱动卡面rotateX/Y，内部CardItem以独立translateZ形成多层透视。|用perspective容器与CardContainer记录指针位置~将相对中心的x/y映射为旋转角~通过上下文把hover状态传给CardItem~让各Item按深度移出、离开时归零|surface,content|源码用DOM transform并不依赖Motion；嵌套内容需preserve-3d，不能再由其他动画覆盖同层transform。|主要依赖文本选区和精确拖动的编辑器
images-slider|全幅图片以选中索引切换，使用裁切、透明度和缩放形成背景幻灯片。|预加载当前与相邻图片并处理失败~按索引叠放前后两张图~切换时过渡clipPath、scale与opacity~将自动轮换、键盘导航和前景按钮分别管理|layout,surface|外部图片地址与加载状态是实际依赖；自动切换需可暂停，不能造成正文主题突然变化。|每张图片都需逐字阅读或精确对照的资料
direction-aware-hover|将指针相对图片中心的位置归一化，判断最近边后从该边滑入遮罩文案。|读取卡片矩形与进入坐标~通过方向计算得到上右下左索引~从对应偏移位置动画遮罩进入~离开时按离开方向退出并保留原图|surface,content|方向感知基于指针事件，触屏需固定可见标题或点击展开，不能隐藏唯一操作入口。|没有替代操作方式的移动端商品卡
tabs|活动标签共享高亮背景，内容卡按索引变换缩放、位置和层级形成叠放切换。|维护active标签和重排后的卡片序列~共享layoutId滑动标签底板~将活动卡置前并过渡其余卡的缩放与位移~为标签补齐键盘切换与aria关联|layout,content|叠放卡片需要足够舞台高度，源码演示不等于完整Tabs无障碍行为已验证。|必须同时显示全部内容的对照工作台
hero-parallax|多排作品截图受相反方向横移和整体透视扶正共同驱动，形成滚动首屏。|把产品图按多排拆分~scrollYProgress映射各排反向x位移~独立外壳过渡rotateX/rotateZ与y~在滚动后提高整体opacity并保留标题入口|layout,content|画廊运动幅度大，需要足够滚动舞台和图片资源；不应用在实时操作面板上。|要求首屏所有功能控件始终原位的管理页面
wavy-background|Canvas2D逐帧采样三维噪声绘制多条彩色曲线，再模糊叠加形成流动波带。|初始化画布尺寸与simplex三维噪声~按x坐标采样噪声并画粗波线~每帧推进噪声时间并半透明覆盖前帧~前景内容独立于Canvas并在卸载时停止帧循环|page-background|原生不是CSS渐变换色；源码尺寸按window并改写onresize，项目接入应改为容器观察和独立监听，避免重置画布引起闪烁。|低性能设备上多处同时运行的全屏模糊背景
background-gradient-animation|多个径向色团靠独立CSS关键帧与混合滤镜交融，可增加跟随指针的色团。|设置渐变与色团颜色变量~各色团分别沿既定transform轨迹循环~用模糊与SVG黏合滤镜融合边缘~interactive时让额外色团追踪局部指针|page-background|源码变量写入document.body，项目侧需按实例局部化避免串色；关键帧和Tailwind配置需一并接入。|只允许改变某张卡边框的局部修改
macbook-scroll|滚动进度同时控制笔记本屏幕rotateX、scaleX/Y与纵向位移，键盘底座独立保持设备造型。|建立长滚动舞台并读取目标进度~用透视与铰链原点组织屏幕和底座~分段映射屏幕旋转、横纵缩放与位移~将产品截图放入屏幕面且不再叠相冲突动画|layout,surface,content|源码含大量键帽DOM且屏幕最终位移可达1500px；不能照搬到短容器，小屏需校准高度与截图比例。|短弹窗或首屏必须直接操作真实表单的区域
input|输入框边缘的局部径向渐变随指针移动，输入内容保持普通表单语义。|外壳监听局部pointer坐标~hover时改变渐变半径并在离开时归零~将原生input放在独立内层并转发ref与属性~用真实label、校验和提交状态完成表单接入|border,surface|源码仅提供视觉输入组件；注册、身份认证和数据提交需业务实现，不能从预览推断已接入。|用装饰状态冒充已登录或已提交成功的业务
multi-step-loader|加载覆盖层按活动索引依次高亮步骤并把已完成项转为勾选。|传入有明确顺序的步骤数组~loading时显示遮罩与步骤视口~按真实进度或明确标记的演示计时更新currentState~结束时收起并恢复原页面焦点|content,layout|源码按定时器推进并非真实后台进度；接入真实任务时须由任务状态驱动，不能伪装为已完成。|无法预测进度却显示虚假逐项完成的任务
globe|ThreeGlobe在三维球面绘制地点弧线、点和扩散环，并由OrbitControls管理视角。|初始化Three/Fiber场景与球体参数~把地点经纬度映射为弧线、点和环数据~按分组周期触发扩散环并调整相机~在容器卸载时释放场景与监听|content,page-background|Three生态版本需兼容，数据经纬度与透明度影响结果；动画连接不代表真实网络或航班数据。|低端手机上多个地球同时运行的仪表盘
aurora-background|大尺寸重复渐变经模糊、反色和径向遮罩叠加，通过CSS动画缓慢漂移形成极光。|独立背景伪元素组合多层渐变~设大于容器的背景尺寸与模糊~按aurora关键帧改变background-position~用遮罩弱化边缘并让内容置于上层|page-background|需携带关键帧和样式变量；它是背景材质，不应直接覆盖正文或当作边框流光。|只能修改按钮边缘而不允许影响背景的需求
canvas-reveal-effect|WebGL点阵着色器以距离中心和时间的阈值扩散显现颜色与透明度。|建立Fiber Canvas及ShaderMaterial~用网格坐标计算每点颜色与opacity~根据距中心距离设置显现时差~由外部卡片hover控制Canvas挂载或可见状态|surface,page-background|组件自身负责点阵shader，hover开关来自外层演示；WebGL失败须有静态替代。|所有卡片都持续挂载高分辨率点阵的长列表
hover-border-gradient|四个方向的径向亮区按间隔切换，hover时暂停方位循环并扩展为完整高光。|为TOP/LEFT/BOTTOM/RIGHT配置不同渐变中心~非hover时由计时器轮换方向~hover切换到宽范围highlight渐变~用内层实色内容遮住中心并保留边缘|border,outer-glow|这不是MovingBorder的沿路径逐帧光斑；它在方向渐变间过渡，duration以秒控制轮换间隔。|要求精确一颗光点连续绕轮廓运动的需求
hero-highlight|两层不同颜色的点阵背景以指针遮罩切换，Highlight词组另用渐变背景扩展。|给容器设置普通点阵底纹~记录局部指针位置生成径向mask~hover时显示强调色点阵层~重点词使用独立渐变条而非改变全部文字背景|page-background,text|点阵追踪与荧光重点句是两个组件机制；不能把局部高亮扩展到整篇正文。|密集公式或严肃长文的每个句子都带高亮动画
vortex|Canvas噪声粒子按角度和寿命推进，离屏画布叠加发光后绘制旋涡流场。|初始化粒子位置、速度、色相和寿命数组~每帧按噪声场更新角度与位移~在缓冲画布画粒子轨迹后叠加模糊辉光~粒子寿命结束后重生并管理帧循环|page-background|粒子与多次模糊合成开销较高，数量与分辨率需实测；只是装饰流场，不是物理模拟。|长时阅读和低性能设备的多重全屏画布
wobble-card|卡面向指针方向轻移并放大，内部内容作反向位移产生柔软视差。|计算指针相对卡片中心的偏移~外层Motion容器应用缩放与偏移~内层按较小反向幅度移动~移出时两层分别弹性归位|surface,content|只能在同一层使用一套transform来源，不能与另一个倾斜组件共同覆盖它。|需要固定坐标进行拖拽或标注的画布
placeholders-and-vanish-input|提交时把输入文字绘到Canvas采样为像素点，再逐步扰动淡出，提示语单独定时轮换。|独立管理输入值与轮换placeholder~提交前把当前文字按字体绘到画布~采样非透明像素形成粒子数组~粒子消散完成后恢复输入并交给真实提交逻辑|text,content|视觉消失不是数据已提交；长文本采样成本高，不能清掉失败后需要恢复的用户输入。|需要保留可编辑原文或敏感信息回查的表单
flip-words|定时切换词索引，旧词退出、新词的字符按stagger进入，其余句子不重排重播。|为轮换词建立稳定索引和切换计时器~旧词通过AnimatePresence退出~新词拆为字符并错相显现~保留周围句子与容器占位避免明显跳动|text|切换关键词不等于全文打字；长短差异大的词要测试换行与可访问的稳定文本。|承载唯一价格、状态或法律含义的动态词语
link-preview|HoverCard展示目标链接的缩略图，并根据指针位置轻微偏移预览浮层。|建立链接触发和悬停浮层~使用自定义图片或明确的截图服务构造缩略图~指针偏移经弹簧映射为浮层x~链接点击仍打开真实目标并处理图片失败|content|默认截图服务可能有外部网络、隐私和额度限制；不能保证任意站点可截图，优先本地自定义封面。|不能向外部截图服务暴露目标网址的私有链接
glare-card|指针位置同时驱动卡面透视、径向反光和全息纹理的背景坐标。|归一化局部指针并计算倾角~把倾角与反光位置写入CSS变量~叠加全息纹理和混合渐变层~离开后降低反射强度并归位卡面|surface,outer-glow|需要复杂混合与mask样式；反光不代表真实材质物理渲染，内容与装饰需分层。|需要精确颜色或图像真实性判断的内容
animated-modal|状态控制遮罩和弹窗的AnimatePresence入退场，弹窗以缩放、位移与模糊进入。|由触发器设置modal open状态~独立绘制背景遮罩与内容层~为初始、进入和退出配置几何与透明度~关闭时清理滚动锁并恢复触发焦点|layout,content|焦点锁定、Escape关闭和滚动恢复需项目接入核对；动画不能阻止立即退出。|缺少关闭入口或无法键盘操作的强制弹窗
apple-cards-carousel|横向卡片轨道配合共享布局详情层，卡片展开后沿用封面与标题的空间位置。|用可横向滚动的轨道与前后箭头浏览~点击卡片记录活动项并打开详情~共享layoutId过渡封面与标题~关闭后回到原卡片和对应滚动位置|layout,content|大图需要预加载与尺寸占位；详情焦点管理和键盘关闭不能因动画省略。|要求同时比较所有详情的密集数据页
shooting-stars|官方组合演示包含Canvas闪烁星点底层与独立ShootingStars流星；本条安静星空行为主要对应StarsBackground。|根据区域面积与starDensity生成星点~为星点分配透明度和twinkleSpeed~逐帧更新Canvas星点明暗~如另需流星再挂独立随机边缘轨迹层，不强制添加|page-background|缓存同时包含StarsBackground与ShootingStars源码；星点闪烁和流星轨迹是不同机制，避免因合并文档名称混用。|要求完全静态、无任何亮度变化的背景
compare|前后图片叠放，用分界位置控制上图裁切宽度并联动分隔线。|让两张图以相同尺寸和object-fit对齐~读取拖动或hover产生的横向比例~clip-path裁出上图对应区域~把手柄位置与比例同步并提供键盘调整|content,surface|两图裁切和对齐不一致会产生虚假差异；对比图需有同一视角和明确标签。|没有相同画面基准的图片优劣判断
card-spotlight|局部径向mask跟随指针，只有圆形光照范围内的点阵与颜色增强。|记录卡片内的mouseX/Y~构造有限半径的radial-gradient mask~让点阵或颜色层受mask约束~前景文字在独立层保持完整可读|surface,outer-glow|它是局部surface聚光，不是边框追踪；光照层不能覆盖或阻断正文按钮。|必须无人操作也出现持续主动画的首屏
cover|文字框内星点与横向光束按不同速度流动，hover时进入更快的穿越状态。|在重点文字外建立裁切框~生成点与光束装饰层~hover状态改变光束的运动速度或持续时间~离开恢复普通速度，重点词本身保持可读|surface,text|速度变化是局部强调，不应包裹长段正文；不得因高速装饰制造闪烁阅读障碍。|长篇说明或公式段落的整块文字背景
file-upload|文件输入与拖放区域共享选中文件状态，图标与文件卡用共享布局轻微抬起展开。|点击区域触发原生file input~用dropzone处理拖入与文件列表~选中后按文件名、类型、大小渲染卡片~把真实上传、进度、失败和取消交给业务服务|content,layout|示例只选文件并不自动上传服务器，必须校验类型/大小；不能把本地预览说成已上传。|未校验就接收任意文件或要求真实云存储已接入的场景
floating-dock|图标尺寸由指针与各图标中心的距离映射，经弹簧形成连续放大波。|记录Dock整体指针x位置~每个图标测中心并计算距离~用距离映射宽高再经spring平滑~hover显示标签，移动端改为按钮展开列表|layout,content|连续放大会改变占用空间，需要预留高度；图标名称和导航语义不能只依赖hover。|靠近屏幕底部且不能留放大空间的紧凑工具栏
focus-cards|hover索引决定当前图片保持清晰，其他图片模糊并缩小，当前标题浮出。|记录当前悬停卡片索引~按active与other两种状态设置blur/scale~当前卡片标题过渡opacity/y~离开组恢复全清晰并保留触屏直接标题|surface,content|不能模糊唯一可读信息或让非活动卡失去可操作性；滤镜只用于展示图层。|需要同时比较细节的多图诊断或选型页面
background-beams-with-collision|下落光条与底部容器发生几何碰撞后，生成一次性粒子爆散。|用重复Motion位移驱动各条下落光束~通过边界矩形比较检测底部接触~碰撞时暂隐原光束并生成短命粒子~爆散结束清理粒子并重启光束周期|page-background,content|源码碰撞检测与计时器需按实例清理；视觉碰撞不是物理引擎，不用于真实轨迹计算。|低性能设备上大量碰撞粒子并行的背景
text-hover-effect|SVG文字轮廓先被描出，再由指针径向mask局部显露彩色渐变描边。|用SVG text定义稳定的空心文字轮廓~strokeDasharray/offset完成首次描绘~记录指针位置并更新径向mask中心~仅在mask范围内显示强调色描边|text|适用于大字号短标题，SVG文本需另有可读文本替代；不能用于长篇正文。|小字号、长段落或核心可复制答案
lens|复制同一内容到一个局部裁切圆窗，按指针坐标定位并放大副本。|渲染正常内容作为稳定底层~hover时创建同内容的裁切镜面~把指针映射到放大层的反向位移与缩放~离开隐藏镜面，触屏提供独立放大操作|content,surface|重复内容可能产生重复ID或交互，放大副本应不接收业务点击并处理可访问性。|不能被重复渲染的实时表单或播放器控件
background-lines|预定义SVG彩色弧线通过pathLength与opacity时间序列从中间伸展并循环。|为多条曲线建立稳定路径和渐变色~逐条错开pathLength绘制时序~用opacity收尾后开始下一轮~将线条限制在标题后方的独立背景|page-background|是固定曲线的描绘循环，不是实时音频波形；路径数量与光晕避免压过正文。|必须反映真实信号或数据的波形图
animated-testimonials|活动索引同时驱动叠放人物照片层级、旋转，以及姓名和评价逐词显现。|将图片、姓名与引言保存在同一条数据~切换索引时把当前照片移到前层~为非活动照片分配固定旋转与缩放~同步更换姓名和引言并提供上一项下一项入口|layout,content|autoplay属于可选演示行为，真实评价需要来源；不要用未标注的虚构用户背书。|必须同时完整比较所有评价的列表
world-map|点阵SVG地图上按经纬度投影绘制弧线，端点环以SVG动画扩散。|通过dotted-map生成点阵轮廓~将经纬度投影成SVG坐标~计算两端之间的弯曲路径并逐段描绘~在端点叠加扩散环，内容标签另放可读层|content,page-background|示意投影不是专业GIS，地点连线只反映传入数据；不能凭动画宣称全球业务覆盖。|要求精确地理测量、导航或实时运输追踪的系统
code-block|语法高亮渲染器输出代码文本，行号与指定行高亮配合复制状态反馈。|根据language与filename建立代码面板~用语法高亮器渲染文本并设置换行/滚动~对指定行设置背景强调~复制原始代码并反馈成功或失败|content|展示并不执行代码；复制需处理剪贴板权限，不能把外部代码内容当项目指令执行。|需要真实运行、调试或安全沙箱能力的代码执行器
carousel|活动幻灯片按索引居中，非活动卡倾斜变暗，活动图片受局部指针轻微平移。|按索引计算每张卡的位置与倾角~箭头或邻卡点击更新活动索引~活动卡内部图片依据指针中心偏移~切换后恢复图片位移并保留图片说明|layout,content|展示数量与卡片宽度需在手机重算；不能让指针动画抢夺水平滑动手势。|要求全量项目同时可见的比较任务
colourful-text|短标题拆成字符，各字按计时序列切换色彩、模糊和小幅位移。|把文本拆成稳定字符span~为每个字符分配调色板索引~按周期更新序列并错开opacity/blur变化~保留可访问的稳定完整标题文本|text|属于持续文字装饰，不能承载关键实时状态；对中文与emoji需按字素拆分。|长篇课文、公式、错误消息等必须稳定阅读的内容
squiggly-text|多个SVG噪声位移滤镜按时间离散切换，使字形轮廓产生手绘抖动。|为实例生成唯一滤镜ID~建立不同seed的feTurbulence与feDisplacementMap~按stepDuration离散切换滤镜引用~把滤镜仅作用短标题轮廓|text|源码默认短间隔切换会较活跃，减少动态时需项目侧去滤镜；复杂字形和多滤镜有渲染开销。|精确识别字形、化学式或数学式的正文
magnetic-button|指针接近时按钮或内部文字按局部偏移追随，离开由spring归位。|定义可吸引的外容器与静止布局占位~读取指针相对中心的位置~按受限强度映射按钮/文字的x/y~离开时将目标归零并保留点击命中区|surface,content|不能让按钮移出原命中区或挤开布局；与拖拽控件要分开，触屏保持静止按钮。|需要严格稳定位置的确认、支付或危险操作
notch|固定在边缘的胶囊导航岛以共享布局展开选项面板，选项逐项入场。|用items建立组和选项的稳定ID~点击组切换openItemId~用共享shell布局过渡面板尺寸与位置~选择后更新value并按closeOnSelect收拢|layout,content|这是网页内导航岛，不是系统级灵动岛；fixed定位需要safe-area与底部内容避让。|不能覆盖任何正文且无安全边距的页面
spotlight-new|左右成组长径向渐变光束以相反水平轨迹持续缓慢扫动。|左右各叠放三层不同亮度的长渐变~固定倾角形成对称光锥~Motion循环映射左右x为相反方向~控制遮罩和层级使光束只承担背景气氛|page-background,outer-glow|新版本是持续双侧扫光，不同于旧Spotlight的一次入场；大尺寸模糊需限制可见范围。|只有局部卡片装饰需求的高密度工具页
3d-marquee|图片分列后整体透视倾斜，各列以相反方向连续竖向移动。|将图片复制分配到多列轨道~对画廊外壳施加rotateX/Y/Z透视~各列沿y以错相时间循环~在视口边缘裁切并保持前景标题稳定|page-background,layout|图片数量乘复制轮数会增加解码和DOM成本；需暂停或减少动态替代，不能遮挡点击。|必须读取每张图片细节的教材图片目录
container-text-flip|轮换词框通过测量当前词宽平滑改变容器宽度，旧词退出新词进入。|维护轮换索引并测量目标词尺寸~为词框width配置布局过渡~AnimatePresence完成上下或模糊切换~清理计时器并避免首次测量造成整行跳动|text,layout|词框宽度变化会影响临近句子换行；不能将未确认词语轮换成业务承诺。|需要恒定版面和精确断行的表单标签
resizable-navbar|滚动到阈值后宽导航缩成居中浮条，并另设移动端展开菜单。|监听页面滚动位置生成visible/compact状态~对导航width、y和背景材质作过渡~桌面链接保持可达~小屏由菜单按钮管理展开、关闭与焦点|layout|缩窄导航不是隐藏全部菜单；固定栏与页面锚点需处理顶部偏移和safe-area。|无法保留内容避让空间的全屏编辑工作区
draggable-card|卡片拖动时按位移产生倾角、缩放与阴影，边界约束让松手后的卡片保持可达。|为卡片建立motion drag与约束ref~把drag x/y映射到rotateX/Y~抓取时提高层级、缩放和阴影~松手后限幅回弹并保持关闭/操作入口可达|surface,content|拖拽只是本地交互，位置持久化需业务另做；内部按钮与拖拽手势要分派。|依赖精准拖拽排序却未实现排序算法的清单
sticky-banner|公告条在指定滚动区域顶部sticky显示，关闭状态控制收起。|把公告放入真正的滚动容器~使用sticky top定位而非全页无条件fixed~用状态管理关闭与退出过渡~保留消息链接和内容上方的占位|layout,content|当前示例未启用滚动方向隐藏，不应擅自说成FloatingNavbar行为；永久关闭是否保存由项目决定。|必须持续显示不能被用户关闭的关键告警
pointer-highlight|进入视口后边框或底色沿文字展开，同时小指针移动到强调位置。|用观察器确认重点文字进入视口~在文本外独立绘制高亮矩形~按顺序扩展边框并定位装饰指针~一次结束后保留高亮与完整文字|text,border|指针只是装饰，不是可点击按钮或实际协作者；高亮不应循环闪动影响阅读。|每一行都被反复框选的长段正文
stateful-button|点击触发异步操作，按钮内容由普通态切换到加载态，再显示成功勾选。|维护idle/loading/success状态~点击后禁用重复提交并调用任务函数~等待真实Promise完成再显示成功~失败时保留输入并返回可重试状态|content,surface|成功必须由真实任务结果驱动，不能用固定计时器假装提交完成；错误处理需业务接入。|需要允许同时重复提交的实时多任务入口
loader|若干不同小型等待指示器用旋转、路径或圆点透明度循环表达处理中。|先选官方合集内的具体Loader变体~把图形限制在小尺寸等待区域~在任务处理中播放该变体的关键帧~任务结束停止并显示真实结果文本|content|等待动画只表达未结束状态，不包含百分比或后台进度；合集不同变体不能混写为同一机制。|用循环指示器宣称准确完成比例的任务
image-generation-loader|扫描线与像素网格、文字遮罩叠层在图像区域运动，表现生成中的视觉过程。|用固定尺寸画面承载源图或占位~创建扫描带并让遮罩随其推进~错相显示像素网格与进度文字~真实任务完成时切换最终图片并停止扫描|surface,content|视觉扫描不是模型推理进度；无真实生成服务时需标演示，失败不能继续循环冒充处理中。|以假进度掩盖生成失败或无服务接入的页面
comet-card|局部指针驱动厚度透视卡片的倾角与柔光高亮，hover时卡面放大。|记录指针在卡片中的归一化位置~用运动值平滑映射rotateX/Y~让高光位置与倾角联动~离开后归位并复原缩放与反射|surface,outer-glow|同一transform不可与Tilt组件再叠写；高光与缩放应只影响展示层，不能扰动表单。|需要稳定文本选区或图像标注坐标的区域
background-ripple-effect|点击网格单元后按与点击中心的距离为各单元安排延迟亮度波。|生成带行列坐标的规则单元格~记录被点击的行与列~计算各格距离并映射为亮度/缩放时序~波纹结束恢复默认状态，连续点击管理新的波纹实例|page-background,surface|这是网格上的波纹传播，不是流体模拟；单元数量大时应减少DOM和同时动画数。|高密度数据表格上与单元操作混淆的背景
pixelated-canvas|把图片采样成规则像素块，指针附近的块受扰动后回到原始栅格位置。|加载图片并建立像素粒子基准网格~按局部指针距离与方向更新目标偏移~每帧让块位置阻尼回到基准~重绘画布且保留图片加载失败替代|surface,content|外部图片需支持画布采样的跨域规则；像素尺寸越小粒子越多，不应用于精确原图阅读。|需要确认原始细节和真实色彩的图像检查
canvas-text|Canvas彩色曲线持续运动，并以文字轮廓作为合成遮罩只在字形内部显示。|按字体和文本建立字形遮罩画布~在另一画布计算流动彩色曲线~用合成模式裁出字内图案~将字外背景保持透明并提供可访问文本|text|Canvas文字不等同可选择正文，字体加载与resize需重建遮罩；公式不应用这种装饰。|化学式、长篇阅读或需要直接复制的答案
layout-text-flip|轮换词使用共享布局，使词宽变化时整句其他文字也平滑重排。|把固定句段和轮换词放在同一布局组~定时切换关键词并处理旧词退出~对句段使用layout让位置同步过渡~在窄屏测试不同词长下的换行|text,layout|与ContainerTextFlip仅改变词框宽度不同，本组件有整句重排；需要稳定尺寸时应停用。|精确逐行对齐的导航和表格标题
dotted-glow-background|规则点阵由各点的独立延迟控制透明度和光晕，边缘用遮罩淡出。|依据gap和radius生成受限数量的点~为每点分配独立动画时长与延迟~opacity与glow周期变化形成呼吸~在内容下方叠加渐隐mask而不改变正文|page-background,outer-glow|网格点数量受容器面积影响，需限制密度；不是点击后扩散的BackgroundRipple。|持续亮度变化会分散注意力的阅读面
tooltip-card|富内容提示卡在hover时弹出，跟随触发区域内指针作小幅弹性偏移。|为触发区记录hover状态与局部坐标~渲染图片和说明组成的浮层~把偏移经spring映射到浮层位置~退出时收起并为触屏与键盘提供固定可访问入口|content|提示层不能承载唯一关键内容，弹层应处理视口边缘、防遮挡与触控替代。|依赖hover才能读取完整任务信息的移动端界面
encrypted-text|随机符号占位逐步固定为目标字符，未解码部分在计时循环中继续变化。|按字素保存真实目标文本~先以随机字符填充未揭示位置~根据reveal进度逐个固定原字符~结束清理计时器并呈现完整稳定文本|text|它只是视觉解密而非加密算法；真实机密不要先塞入可见DOM又声称被安全隐藏。|密码、敏感数据和必须立即可读的错误提示
noise-background|缓慢移动的渐变色团上叠加独立噪声纹理，噪点强度与色团速度分开控制。|建立渐变背景与运动色团层~通过transform轨迹改变各色团位置~另用噪点纹理混合覆盖形成颗粒~把阅读内容放在不受滤镜影响的前景|page-background,surface|颗粒与混合是装饰材质，非图像去噪或真实胶片处理；多层滤镜要限制面积。|需要无纹理纯净背景的密集图表或表格
dither-shader|以规则阈值矩阵或抖色算法把图片亮度映射成有限色阶和点阵。|加载可采样的源图并调整处理分辨率~按ditherMode计算每格阈值与目标色~应用亮度、对比度和调色板映射~把结果绘到画布并在参数变化时重算|surface,content|改色和低色阶会改变原图信息，不能作精确颜色判断；跨域图片采样失败要回退原图。|医学影像、色彩校验或需要忠实原图的任务
cloud-shader|全屏片元shader用多层噪声构造非对称云团包络并随时间横向漂移。|初始化WebGL程序与分辨率uniform~用噪声计算云团密度和边缘~按时间推进云的位置并估算自阴影~背景与前景分层，失败时显示静态天空|page-background|是二维实时shader而非体积天气模拟；不能假称真实天气，GPU与精度兼容需实测。|依赖真实气象数据或低功耗长时后台显示
chromatic-image|WebGL采样同一图片的RGB通道偏移，指针同时驱动局部UV扭曲与倾斜。|加载图片纹理并按容器比例做cover映射~把指针和hover强度写入uniform~分别采样偏移后的红绿蓝通道并合成~移出时阻尼回到清晰图像，释放纹理和程序|surface,content|分色会改变原图细节与颜色，不用于真实性判断；跨域纹理、WebGL失败需普通img替代。|需准确识别实验图像颜色或图表细节的页面
webcam-pixel-grid|读取经用户授权的摄像头视频并逐帧采样为规则色块网格。|由明确用户操作申请摄像头权限~将MediaStream连接到隐藏或可控video~按采样单元读取视频颜色并绘制色块~停止或卸载时关闭所有媒体轨道|content,surface|需安全上下文与用户权限，拒绝/设备缺失/占用应可恢复；不做身份识别或静默录像。|未经同意自动启动摄像头或宣称人脸识别
images-badge|文件夹形状的徽章内图片在hover时抬起扇形散开，前盖同时旋转。|把图片层叠到文件夹背板~为各图片分配不同旋转与位移目标~hover时图片向上展开且前盖绕底边倾斜~离开回到紧凑叠放，标题仍直接可见|surface,content|文件夹是视觉隐喻，不代表已接文件系统；触屏需点击入口而不能仅hover展开。|必须同时辨认所有图片内容的相册目录
keyboard|键盘分区按键以按压位移和高亮反馈输入，可选音频在用户操作后播放。|按键数据生成语义可聚焦的键帽~指针或键盘事件设置pressed状态~按下时降低键帽高度并改变阴影~若配置声音则在交互后播放并清理音频资源|surface,content|模拟键盘不会自动替代系统输入法；声音需授权与静音控制，不能擅自记录用户真实输入。|需要完整输入法、辅助技术或系统快捷键模拟的任务
terminal|终端外壳逐字/逐行显示预设命令与结果，Bash语法高亮和可选音效加强反馈。|将演示命令与输出组织为带延迟的序列~逐字更新当前行并保留完整历史行~对Bash文本做语法高亮~完成或卸载时停计时和声音，标明只是演示输出|content,text|不执行Shell命令，不代表已运行安装或部署；真实控制台需安全后端和权限边界。|把预设逐字文本冒充实际执行日志的运维界面
3d-globe|Fiber球体表面经纬度转换为三维标记，贴图、大气与OrbitControls提供可旋转地点展示。|创建球体材质并加载地球与凹凸纹理~把markers经纬度转换为球面坐标~用Html或贴图渲染头像与说明~以OrbitControls约束旋转缩放并调用真实marker回调|content,page-background|纹理可能来自外部地址需许可与失败替代；不同于ThreeGlobe弧线组件，不应自动加上航线。|要求真实地图测距或地理精度分析的系统
ascii-art|按源图亮度把采样像素映射为密度不同的字符，组成可辨识的字符画。|加载图片并按字符格尺寸采样亮度~把亮度映射到自定义字符集索引~在等宽布局中输出颜色与字符~可选渐显只影响显示，不重复采样静态图像|content,surface|字符画会丢失细节，字符字体和行高影响比例；跨域采样与字体加载需失败处理。|要求精确识别原图细节或图中文字的任务
scales|repeating-linear-gradient按方向和周期生成细斜线或横竖刻度静态底纹。|选择orientation映射渐变角度~用size控制重复背景单元~把低对比纹理放在绝对定位背景层~前景内容另设相对定位层保证可读|page-background|原组件是静态纹理没有持续运动；size不是数据尺度，不能当真实测量刻度。|被要求作为持续强动效主视觉的页面
text-flipping-board|固定字符格的上下半片绕水平轴翻转，按行列错相逐步切到目标字符。|把文字铺到固定行列格并规范字符集~为每格保存当前字符与目标字符~逐步变换字符并动画上下半片的rotateX~按列行延迟形成传播顺序，目标一致时停止计时|text,layout|源码字符集以拉丁字母和数字为主，中文会变空格；需明确改造字符集和格宽，不能直接用于中文答案。|大量中文正文或需要立即完整显示的关键信息
`;

const specific = new Map(aceternityRows.trim().split('\n').map(line => {
  const [slug, summary, steps, layers, limitation, avoid] = line.split('|');
  return [slug, { summary, steps: steps.split('~'), layers: layers.split(','), limitation, avoid }];
}));

function sourceFacts(files) {
  const defaults = {}; const imports = new Set(); const localImports = new Set();
  for (const file of files) {
    const source = ts.createSourceFile(file.path, file.content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        const name = node.moduleSpecifier.text;
        if (name.startsWith('.') || name.startsWith('@/')) localImports.add(name);
        else imports.add(name.startsWith('@') ? name.split('/').slice(0, 2).join('/') : name.split('/')[0]);
      }
      const isExport = node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
      const functions = [];
      if (isExport && ts.isFunctionDeclaration(node)) functions.push({ name: node.name?.text, parameters: node.parameters });
      if (isExport && ts.isVariableStatement(node)) for (const declaration of node.declarationList.declarations) {
        const value = declaration.initializer;
        if (value && (ts.isArrowFunction(value) || ts.isFunctionExpression(value))) functions.push({ name: declaration.name.getText(source), parameters: value.parameters });
      }
      for (const fn of functions) for (const parameter of fn.parameters) if (ts.isObjectBindingPattern(parameter.name)) {
        for (const item of parameter.name.elements) {
          if (!item.initializer) continue;
          const value = item.initializer.getText(source).replace(/\s+/g, ' ');
          if (value.length <= 65 && !/\(\)|=>|<|[{}]/.test(value) && Object.keys(defaults).length < 8) defaults[`源码默认 ${fn.name}.${item.name.getText(source)}`] = value;
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  return { dependencies: [...new Set(['react', ...imports])].sort(), parameters: defaults, localImports: [...localImports].sort() };
}

function guidance(code, slug, entry) {
  const pointer = /onMouseMove|onPointerMove/.test(code);
  const webgl = /WebGL|ShaderMaterial|from ["'](?:three|@react-three)/.test(code);
  const canvas = /getContext\(["']2d/.test(code);
  const scrolling = /useScroll|scrollYProgress/.test(code);
  const text = ['text'].some(layer => specific.get(slug).layers.includes(layer));
  const staticVisual = ['grid', 'scales', 'bento-grid', 'code-block'].includes(slug);
  let mobile = pointer ? '项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。' : scrolling ? '项目建议：根据触屏视口重算滚动段高度与位移边界；窄屏保持内容顺序，避免粘性视觉遮住阅读与操作。' : '项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。';
  let reducedMotion = staticVisual ? '项目建议：保持静态布局与材质，若项目另加hover位移则关闭位移，仅保留清晰焦点与选中状态。' : text ? '项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。' : '项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。';
  let performance = webgl ? '项目建议：限制Canvas数量和设备像素比，离屏或后台暂停帧循环，卸载释放几何、材质、纹理与监听；WebGL失败回退静态画面。' : canvas ? '项目建议：限制采样/粒子数量与绘制分辨率；用单个帧循环更新绘制，离屏暂停，避免每帧重设画布尺寸。' : scrolling ? '项目建议：以运动值联动滚动而非每帧触发整页React重渲染；在内容尺寸变化时测量，避免滚动过程中反复强制布局。' : pointer ? '项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。' : staticVisual ? '项目建议：保持静态CSS绘制，控制图像资源和DOM数量；无需为了装饰启动持续帧循环。' : '项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。';
  if (slug === 'tracing-beam') reducedMotion = '源码动态path带motion-reduce:hidden；项目接入还应核对保留静态底线与正文，停止额外滚动位移。';
  if (slug === 'webcam-pixel-grid') { mobile = '项目建议：用户点击后才申请前/后摄像头，处理拒绝与切换设备；离开页面主动关闭媒体轨道。'; reducedMotion = '项目建议：允许暂停采样并保留一帧像素图，提供可见停止摄像头入口，不因减少动态阻断权限退出。'; }
  return { mobile, reducedMotion, performance };
}

const sixtyRows = `
opal-border-glow-feature-highlight-interaction|圆角卡片边缘的霓虹高光循环扫过，内面和邻近列表保持安静。|建立独立的卡面、边框装饰和外晕层~用圆角路径光点或掏空渐变描边模拟周边扫光~让外晕随描边同步但不覆盖文字~暂停时保留静态强调边界|border,outer-glow|仅改变边缘，不能把彩色渐变铺满内部；轨迹与周期是网页适配选择而非Opal原代码。|没有强调层级而所有卡片同时持续发光的列表
airbnb-tactile-tab-button-interaction|分类胶囊按下压缩，活动底板迁移，下方骨架与内容完成连续交接。|为分类和内容建立稳定选中索引~pointerdown立即缩小目标胶囊，松手恢复~共享布局过渡活动背景到新标签~真实加载时显示骨架，内容就绪后交叉淡入|layout,surface,content|骨架必须关联真实加载或明确演示，不应每次点击固定假装等待；活动项与焦点语义保持同步。|分类变化不能触发任何内容切换的装饰菜单
apple-music-player-controls-collapse-interaction|全屏面板下拉时随手势移动，背景恢复缩放与亮度，超阈值松手收起。|建立open、dragging与closing状态并保存拖动起点~pointer capture跟随向下位移，内部滚动到顶后才接管~位移比例联动背景缩放和遮罩透明度~松手按位置与速度选择关闭或回弹，关闭后恢复触发焦点|layout,content|网页不能直接复刻iOS系统级手势；阈值和弹簧参数须按目标设备实测，内部滚动与面板拖动要分派。|没有关闭替代按钮或内部滚动会误触退出的详情
airbnb-photo-pop-and-slide-animation|照片堆顶卡先弹起转动，再退出到队尾，其余照片同步补位。|为照片顺序、当前顶卡和切换阶段建状态~顶卡先放大并向上旋出~退出结束后把顶卡移到队尾~其余卡按新索引过渡位置、缩放与层级|content,surface|换序必须发生在适当动画阶段避免瞬间跳层；照片说明和手动前后切换需直接可用。|所有照片都必须同时完整可见的对照页面
airbnb-add-guests-in-sheet-interaction|人数面板的数值增加与人物队列弹入、横向让位形成因果反馈。|建立人数数值和可见人物队列~点击加号先更新合法人数并生成入场人物~队列整体横移保持焦点居中~减少人数时移除末项并反向补位|content,layout|16+羊驼只是原产品彩蛋，不是业务必需；不能让人物队列成为唯一人数读数。|人数大范围输入却用无限人物堆叠造成混乱的表单
linear-issue-actions-popup-interaction|输入时选项面板接替键盘占据底部空间，选完后回到原输入上下文。|记录当前输入焦点和选择字段~点击元数据入口时blur输入并打开网页底部选项层~选择后保存值并收起面板~在用户操作允许时恢复输入焦点并保持草稿|layout,content|网页无法精确控制系统键盘动画或高度；需用VisualViewport与实际设备校验，不能承诺无缝接管iOS键盘。|必须程序化控制系统键盘每帧运动的网页
revolut-revpoints-circular-slider-interaction|圆环拖动映射数值与弧长，整数吸附给读数反馈，最大值触发中心庆祝。|用圆心和pointer坐标计算归一化角度~把角度映射到受限数值并绘制SVG弧长~靠近整数时吸附并短暂强调中央读数~达到最大值时播放一次中心扩散并保持最终值|content,surface|角度跨0度边界和拖动方向需处理；颜色/庆祝不应替代实际数值，也不包含真实积分业务。|要求非常精确连续小数输入却没有数字输入替代的控件
perplexity-model-selection-sheet-morph-interaction|同一底部面板从模式选择伸高为模型列表，选择后收回并更新原字段。|建立closed、mode与model三级视图状态~打开时锁定背景滚动并显示遮罩~切到model时在同一容器过渡高度并错相显示列表~选中后更新实际选项并回到mode，保留关闭入口|layout,content|面板内焦点与返回层级要明确；模型列表是传入数据，不代表已经接入这些模型。|把展示型号清单冒充已获得模型调用权限的产品
google-todo-check-interaction|单项处理图标转为勾选，全部完成后出现统一插画、标题与行动按钮。|以真实任务状态保存pending、running、done或error~每项完成后过渡等待圆环为勾选~仅全部任务满足成功条件时进入overall-done~整体收尾插画与行动入口一次入场，失败项允许重试|content,layout|不能按计时器把真实失败任务自动标为完成；庆祝后仍要显示清单结果与错误。|用完成动画替代真实任务状态的进度流程
google-ai-mode-search-morph-interaction|紧凑搜索入口扩展为全屏搜索视图，背景变暗，建议和输入区域接续出现。|保存入口元素的起始矩形和返回焦点~展开为独立全屏层并共享几何过渡~显示建议胶囊并聚焦实际输入~退出时逆向缩回入口并恢复页面滚动位置|layout,content|键盘出现受浏览器用户手势限制，不能保证程序化自动弹出；搜索能力需业务接入。|缺少可返回入口或把原始草稿覆盖掉的全屏搜索
google-photos-logo-spin-to-backup-loader-animation|顶部状态行展开为带进度与说明的卡片，下方内容随着高度变化平滑下移。|将简略状态行与详情卡放在正常文档流中~点击切换expanded并过渡容器高度~同步显示任务进度、剩余时间与说明~完成或收起后恢复简略行，保留当前滚动锚点|layout,content|记录对应展开状态而非根据slug推断Logo旋转；进度与剩余时间须真实或标注模拟。|必须悬浮覆盖而不推动下方内容的通知提示
notion-ai-sheet-intro-action-trail-transition|固定角色旁的能力胶囊持续竖向流动，底部主行动入口保持静止。|在底部介绍面板中分开固定角色和滚动能力列~复制胶囊序列形成可循环轨道~线性向上移动并在遮罩边缘淡出~主行动按钮独立固定，暂停后仍能读到能力说明|layout,content|能力文案只描述实际支持功能；自动流动需可暂停，重复节点不应被读屏重复朗读。|每项文案都需完整精读的合同或教程步骤
airbnb-identity-verification-card-flip-scan-interaction|认证入口展开为立体卡片，设备倾斜改变卡面角度与全息反光，返回收回原位。|保存徽章与展开卡的共享位置关系~点击后显示独立卡片层~经用户授权的设备方向或指针输入映射受限倾角和反光~关闭时复位并缩回徽章，提供无传感器替代|surface,content,outer-glow|设备方向权限仅部分浏览器支持且需用户授权；动画不证明身份已认证，真实身份状态由后端给出。|把装饰卡片等同真实身份证明或安全认证的业务
github-badges-showcase-interaction|徽章横向吸附切换，立体轻旋转与背景换色、说明更新同步发生。|给徽章、背景主题和说明建立同一索引~横向拖动后计算最近目标并吸附居中~拖动进度映射当前与相邻徽章旋转~索引落定后交融背景并更新稳定文本，关闭时退出弹层|content,surface,layout|徽章成果需真实数据或标注示例；背景变化不能降低说明对比，不应仅用颜色表示选中。|依赖大量徽章同时比较细节的管理表
revolut-graph-glow-drag-interaction|横向拖动沿折线定位指示线和光点，读数与时间更新，换范围时曲线形变。|用同一数据数组生成曲线与坐标映射~pointer横坐标定位最近数据点~同步移动竖线、高亮点和可读数值标签~切换时间范围时对兼容路径插值并说明数据来源|content,outer-glow|曲线插值不代表插入真实数据；金融数值必须真实或标注模拟，正负不只靠红绿表示。|需要真实投资行情却只提供演示曲线的页面
revolut-3d-card-rotate-interaction|产品卡横向切换保留透视深度，点击翻面，色点控制卡面材质颜色。|维护卡片索引、正反面和色款状态~横向切换以深度与旋转区分前后层~点击时围绕纵轴翻面并设置背面可见性~色点更新材质颜色与稳定名称，保留返回正面入口|surface,content|卡面金属光泽是网页近似材质；真实卡号或支付操作不应放在仅靠动画隐藏的背面。|以翻面视觉冒充支付、开卡或实体材质验证
apple-music-emoji-reaction-interaction|回应菜单弹出，选择表情后菜单收起并生成一组上浮淡出的同类表情。|建立回应菜单的开闭与活动选择~弹性入场显示有限表情选项~选择后先更新回应状态并关闭菜单~创建短命表情粒子上浮、缩小、淡出后清理|content,outer-glow|庆祝粒子不能拦截页面点击；实际点赞计数和多人同步需真实服务，不能由动画推断。|高频点击造成无限粒子累积或遮挡聊天内容
google-chrome-drag-tab-to-pin-interaction|拖入目标区时卡片缩小并高亮接收区域，松手后卡片移到置顶行，原网格补位。|为普通列表和置顶列表分别保存稳定ID~拖动时计算与接收区的命中并显示预览~有效松手后从原集合移除并加入置顶集合~用FLIP或共享布局让卡片飞入置顶行并补齐原位|layout,content|状态变更和视觉过渡需一致；必须提供键盘置顶/取消置顶入口，防止只能拖拽操作。|没有可撤销操作或持久化策略的关键任务排序
google-chrome-drag-tabs-to-arrange-interaction|长按抬起卡片，拖过网格时其他卡实时让位，松手后吸附到新格位。|长按达到阈值后进入拖动而非立即拦截滚动~根据指针落点计算目标索引~拖动中暂排其他卡片并播放布局过渡~松手提交顺序并把拖动卡吸附到目标格|layout,content|长按/拖动要与页面滚动分派；需要键盘移动和取消，重排顺序是否持久化由业务决定。|不允许改变顺序或需要精确位置存档却无保存逻辑的清单
google-chrome-tabs-switch-scale-interaction|整页缩回对应标签胶囊，让用户看到当前页面在多页队列中的位置。|保存当前页面与目标标签卡的边界矩形~把页面快照或展示层提升为过渡层~缩放移动到对应卡片同时加深背景~交接到标签选择视图，返回时逆向恢复原页面状态|layout,content|不能把真实表单/iframe随意复制为交互快照；过渡层不接收业务输入，需保持原页面状态和焦点。|跨域页面无法获得真实快照却承诺完整页面复刻
google-docs-value-prop-full-screen-color-transition|引导步骤切换时整屏底色交融，插画和文案横向滑动并有轻微视差。|以当前步骤关联背景色、插画和文案~前后两套背景交叉淡化避免突然换色~插画与文字用不同偏移系数滑入~步骤落定后聚焦标题并保持下一步/返回入口稳定|page-background,content,layout|换色应保持文字对比与减少动态替代；不能用与实际产品不符的价值文案。|需要固定底色准确比较图像颜色的流程
spotify-podcast-card-preview-sound-wave-animation|预览卡向下展开，封面成为背景，圆环声波和字幕与播放时序联动。|点击预览后扩展卡片并保留其他列表上下文~由真实播放状态控制封面与圆环可见性~有音频权限和数据时以分析值驱动声波，否则明确演示~按字幕时间轴更新当前行，暂停时同时冻结声波与字幕|layout,surface,content|真实音频需用户手势与可播放资源；无分析数据的脉冲只能叫演示声波，不代表音频识别或实时转录。|没有音频或字幕数据却声称真实播放和转录
airbnb-price-toggle-interaction|开关滑块移动并换底色，落到开启位置后勾选才出现。|使用受控布尔值和switch语义~点击或键盘切换后滑动拇指并过渡背景~在开启过渡接近完成时显现内部勾选~反向切换先撤销勾选并回到关闭位置|surface,content|勾选只是开关状态，不代表后端保存成功；需禁用、加载和保存失败回退。|有真实保存延迟却让动画立即冒充成功的设置
spotify-speed-slider-interaction|底部面板中的标尺横移经过固定中心线，中央读数实时更新并支持快捷值。|打开面板并建立当前数值、范围和步长~水平拖动标尺反向映射中心刻度数值~在有效步长吸附时同步读数与强调色~点击快捷值平滑移到对应刻度，并提供数字/键盘替代|content,layout|标尺单位和范围需由业务定义，拖动不能超限；改变显示速度不等于已经控制实际媒体播放。|需要超高精度输入却没有直接数值输入的参数面板
netflix-rate-interaction|评价入口上方放大淡入浮层，三档图标按顺序弹出，背景弱化。|点击入口建立菜单并定位到触发按钮~独立遮罩弱化背景且保留关闭行为~三档选项按短stagger入场~选择后保存明确评价值并关闭，必要时处理提交失败|content,layout|三档评价需要可访问文本而不是只有图标；选项显现不等于后端已保存偏好。|没有业务定义三档语义却直接复制产品手势图标
apple-music-play-pause-interaction|播放时封面放大与阴影扩散，暂停时收回，控制图标同步变换。|维护实际媒体play/pause/error状态~用户播放成功后扩大封面和阴影~同步切换按钮图标和可访问名称~暂停或播放失败时恢复封面并显示真实状态|surface,content|浏览器可能拒绝自动播放，必须等play成功再显示播放态；演示时需明确没有真实音频。|播放未成功却让动画显示正在播放的播放器
apple-music-lyrics-interaction|歌词视图展开时封面缩到角落，当前行放大清晰，其他行弱化并随阅读移动。|建立封面模式与歌词模式并共享封面位置~打开歌词后在独立滚动区渲染完整歌词~依据时间轴或明确的手动阅读位置确定当前行~当前行清晰，周边行适度弱化并允许暂停自动跟随|layout,text,content|歌词需合法数据与可访问全文；模糊不能让用户无法阅读其余内容，自动时间同步必须有真实时间轴。|学术正文或公式推导必须全段同等清晰的阅读区
vercel-preview-feature-interaction|多个功能徽章围绕工具条自动轮流聚焦，非活动徽章弱化，当前说明同步更新。|把功能徽章与说明组织为固定序列~按周期切换活动索引并控制opacity/blur~活动徽章提高可读性，中心工具条保持静止~提供暂停和手动选择，离屏停止循环|content,surface|它是自动功能演示，不是hover触发；文案应只列实际能力，模糊不应藏住唯一操作。|所有徽章都必须同时可读的任务操作面板
`;

const sixtySpecific = new Map(sixtyRows.trim().split('\n').map(line => {
  const [slug, summary, steps, layers, limitation, avoid] = line.split('|');
  return [slug, { summary, steps: steps.split('~'), layers: layers.split(','), limitation, avoid }];
}));

async function build() {
  const root = process.cwd();
  const catalog = JSON.parse(await fs.readFile(path.join(root, 'data/catalog.json'), 'utf8')).filter(entry => entry.status === 'ready' && entry.preview.type === 'video' && entry.preview.verified);
  const a = JSON.parse(await fs.readFile(path.join(root, 'data/enrichment/aceternity.evidence.json'), 'utf8'));
  const f = JSON.parse(await fs.readFile(path.join(root, 'data/enrichment/60fps.evidence.json'), 'utf8'));
  const outputs = { aceternity: [], '60fps': [] };
  const gaps = []; const used = new Map(); const localUtilityReferences = {};
  for (const entry of catalog.filter(entry => entry.sourceId in outputs)) {
    const isCode = entry.sourceId === 'aceternity';
    let evidence = isCode ? a.entries.find(item => [item.sourceUrl, item.resolvedUrl, item.replacement?.sourceUrl, item.registry?.url].includes(entry.sourceUrl)) : f.entries.find(item => item.sourceUrl === entry.sourceUrl) || a.entries.find(item => item.sourceUrl === entry.sourceUrl);
    if (!evidence) { gaps.push({ entryId: entry.id, problem: 'missing evidence' }); continue; }
    let slug = isCode ? evidence.directory?.name : entry.sourceUrl.split('/').at(-1);
    let variantNote = '';
    // The catalog merged two retired URLs into the canonical page; select the matching variant's code, not the first URL match.
    if (slug === 'parallax-scroll') { evidence = a.entries.find(item => item.directory?.name === 'parallax-scroll-2'); variantNote = '目录来源是官方合并文档，具体行为采用同页ParallaxScrollSecond变体；基础版列反向上下移动，不能混淆。'; }
    if (slug === 'shooting-stars') { evidence = a.entries.find(item => item.directory?.name === 'stars-background'); variantNote = '目录来源为星空与流星的合并文档，此条按StarsBackground星点行为整理，流星是另一独立组件。'; }
    const item = (isCode ? specific : sixtySpecific).get(slug);
    if (!item) { gaps.push({ entryId: entry.id, problem: 'missing individually curated mechanism', slug }); continue; }
    let record;
    if (isCode) {
      const files = evidence.registry?.files || [];
      if (!files.length || files.some(file => !file.content)) { gaps.push({ entryId: entry.id, problem: 'missing source content', slug }); continue; }
      const code = files.map(file => file.content).join('\n');
      const facts = sourceFacts(files); const advice = guidance(code, slug, entry);
      const parameters = { ...facts.parameters };
      if (!Object.keys(parameters).length) parameters['项目配置'] = '沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。';
      const evidenceItems = [{ url: evidence.registry.url, kind: 'registry', checkedAt: evidence.verifiedAt || a.collectedAt, sha256: createHash('sha256').update(code).digest('hex'), hashScope: 'source-files-joined', paths: files.map(file => file.path) }];
      const doc = evidence.replacement?.sourceUrl || (evidence.status === 200 ? evidence.sourceUrl : null);
      if (doc) evidenceItems.push({ url: doc, kind: 'official-description', checkedAt: evidence.verifiedAt || a.collectedAt, ...(evidence.replacement?.htmlSha256 || evidence.htmlSha256 ? { sha256: evidence.replacement?.htmlSha256 || evidence.htmlSha256, hashScope: 'page-response' } : {}) });
      localUtilityReferences[entry.id] = facts.localImports;
      record = { entryId: entry.id, sourceUrl: entry.sourceUrl, basis: 'source-code', implementation: { summary: item.summary, steps: item.steps, dependencies: facts.dependencies, parameters }, suitableFor: entry.placements.map(value => `项目适配场景：${value}`), avoidFor: [item.avoid], layers: item.layers, limitations: [item.limitation, '沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。'], ...advice, evidence: evidenceItems, notes: `${variantNote}依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。${facts.localImports.length ? `源码本地导入：${facts.localImports.join('、')}，需按目标工程解决，不能当npm包安装。` : ''}` };
    } else {
      record = { entryId: entry.id, sourceUrl: entry.sourceUrl, basis: 'observed-behavior', implementation: { summary: item.summary, steps: item.steps, dependencies: [], parameters: { '项目建议（非原产品参数）': '先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。' } }, suitableFor: entry.placements.map(value => `项目适配场景：${value}`), avoidFor: [item.avoid], layers: item.layers, limitations: [item.limitation, '公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。'], mobile: /拖|滑|倾斜|键盘|面板/.test(item.summary) ? '项目建议：使用Pointer Events区分点击、拖动与内部滚动；处理pointercancel、安全区和软键盘变化；始终提供可点击/键盘操作的同等替代。' : '项目建议：触屏无需hover即可看到主要信息与操作；按容器重排并提供足够命中区，状态变化保持可理解。', reducedMotion: '项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。', performance: /声波|粒子|星|纹理/.test(item.summary) ? '项目建议：限制装饰粒子或音频绘制数，离屏暂停，卸载清理帧循环和媒体资源；演示动画不冒充真实音频分析或产品服务。' : '项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。', evidence: [{ url: entry.sourceUrl, kind: 'video-page', checkedAt: evidence.verifiedAt || f.verifiedAt || a.collectedAt, ...(evidence.htmlSha256 ? { sha256: evidence.htmlSha256, hashScope: 'page-response' } : {}) }], notes: '根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。' };
    }
    for (const [key, value] of Object.entries({ summary: record.implementation.summary, mobile: record.mobile, reducedMotion: record.reducedMotion, performance: record.performance, notes: record.notes })) if (typeof value !== 'string' || !value.trim()) throw Error(`${entry.id} empty ${key}`);
    if (record.implementation.steps.length < 3 || record.implementation.steps.length > 6 || record.suitableFor.length < 2 || record.limitations.length < 2) throw Error(`${entry.id} incomplete required fields`);
    outputs[entry.sourceId].push(record); used.set(slug, (used.get(slug) || 0) + 1);
  }
  if (gaps.length || outputs.aceternity.length !== 109 || outputs['60fps'].length !== 28) throw Error(JSON.stringify({ gaps, counts: Object.fromEntries(Object.entries(outputs).map(([source, list]) => [source, list.length])) }));
  const report = { generatedAt: new Date().toISOString(), mode: 'cached official source + per-case curation; no paid model calls', counts: Object.fromEntries(Object.entries(outputs).map(([source, list]) => [source, list.length])), sourceCodeCases: outputs.aceternity.length, observedBehaviorCases: outputs['60fps'].length, uniqueImplementationSummaries: new Set(Object.values(outputs).flat().map(item => item.implementation.summary)).size, uniqueStepSequences: new Set(Object.values(outputs).flat().map(item => item.implementation.steps.join('\n'))).size, originalEvidenceDates: [...new Set(Object.values(outputs).flat().flatMap(item => item.evidence.map(evidence => evidence.checkedAt.slice(0, 10))))], hashScopes: { 'source-files-joined': 'Find the matching cached registry record. In evidence.paths order, read each file.content, join with one LF (\\n), then SHA256 the UTF-8 joined text. This is NOT the registry JSON response hash.', 'page-response': 'Preserved htmlSha256 from the original collected page response text; source collection time is retained.' }, localUtilityReferences, gaps, boundary: '源码机制与依赖来自缓存官方registry；场景、限制、移动/减少动态/性能为项目接入建议。未声称137个目标页面已渲染验收或第三方服务已接入。' };
  await fs.mkdir(path.join(root, 'data/case-knowledge'), { recursive: true });
  await fs.mkdir(path.join(root, 'artifacts/case-knowledge-20261025'), { recursive: true });
  for (const [source, records] of Object.entries(outputs)) await fs.writeFile(path.join(root, `data/case-knowledge/${source}.json`), JSON.stringify(records, null, 2) + '\n');
  await fs.writeFile(path.join(root, 'artifacts/case-knowledge-20261025/other-source-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ counts: report.counts, uniqueImplementationSummaries: report.uniqueImplementationSummaries, uniqueStepSequences: report.uniqueStepSequences, gaps: report.gaps }));
}

await build();
