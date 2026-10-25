# 全参考库实现知识

共350条可用案例。完整逐项说明保存在本地JSON；DeepSeek请求取得每条同规格摘要，并非350个原组件均已安装或运行。场景、手机、减少动态和性能处理属于项目接入建议；源码事实与视频行为适配分别标注。

## 错落便当卡片网格 · Bento Grid

案例ID：aceternity-bento-grid

来源：https://ui.aceternity.com/components/bento-grid

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

大小错落的网格卡片，用标题、说明和顶部视觉呈现功能。

触发：页面展示；悬停卡片时内容轻移

作用层：layout、content

### 实现方法

CSS Grid把不同跨度的信息卡组合为便当布局，悬停只轻移卡内说明。

1. 用响应式Grid设置列数与间距
2. 让重点卡跨列、次要卡保持单格
3. 分别放置header、title、description与icon插槽，给局部hover位移保留空间

依赖：react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：首页功能区
- 项目适配场景：项目作品列表

避免用于：

- 需要按行连续阅读的长篇正文

### 限制与接入建议

- 布局本身不是持续动画，不能用跨列卡片数量冒充强主视觉。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：保持静态布局与材质，若项目另加hover位移则关闭位移，仅保留清晰焦点与选中状态。

性能：项目建议：保持静态CSS绘制，控制图像资源和DOM数量；无需为了装饰启动持续帧循环。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/bento-grid.json；资料核对时间：2026-10-12T07:14:24.912Z；SHA256：a3cdb12c2f3183385859da768cd5a66a4024dd017230fb278b8f2d2acf85c730；哈希对象：source-files-joined；文件：components/ui/bento-grid.tsx
- official-description：https://ui.aceternity.com/components/bento-grid；资料核对时间：2026-10-12T07:14:24.912Z；SHA256：b042907cf303a9e37956edd2abaa3b8824584d0b47bad77899493a4a04f80893；哈希对象：page-response

---

## 点击展开的作品网格 · Layout Grid

案例ID：aceternity-layout-grid

来源：https://ui.aceternity.com/components/layout-grid

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

点击网格项目后放大展示详情，形成从浏览到聚焦的作品列表。

触发：点击卡片展开；点击关闭返回网格

作用层：layout、content

### 实现方法

共享layoutId把被点击的网格卡平滑扩展为聚焦详情层。

1. 将图片与文字渲染为带稳定ID的网格卡
2. 点击后记录selected并显示覆盖层
3. 用共享布局标识过渡卡片几何与圆角
4. 关闭时恢复原格位及触发按钮焦点

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：作品集
- 项目适配场景：案例展示

避免用于：

- 无法提供关闭或返回入口的展开详情

### 限制与接入建议

- 详情覆盖层的焦点锁定、Escape和返回焦点需在接入时核对补齐。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/layout-grid.json；资料核对时间：2026-10-12T07:14:26.331Z；SHA256：e354ed1870c324a9a665db35809b92cf3306f744c507722f5e67d8ab330448c2；哈希对象：source-files-joined；文件：components/ui/layout-grid.tsx
- official-description：https://ui.aceternity.com/components/layout-grid；资料核对时间：2026-10-12T07:14:26.331Z；SHA256：11a420cdf339c1fcfd3d77746fb5620bef3ce7b7a617a39ec6375923c1c559ff；哈希对象：page-response

---

## 悬停展开的侧边导航 · Sidebar

案例ID：aceternity-sidebar

来源：https://ui.aceternity.com/components/sidebar

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

侧栏默认保持紧凑，鼠标移入后展开导航标签，适合多页面工作台。

触发：鼠标移入侧栏展开，移出收起

作用层：layout

### 实现方法

侧栏宽度状态与链接标签显隐联动，桌面hover展开并另设移动菜单。

1. 建立open状态并提供Sidebar上下文
2. 桌面指针进入时扩展宽度和标签
3. 移动端由按钮切换独立遮罩菜单
4. 链接点击执行实际导航而非仅播放动画

依赖：@tabler/icons-react、motion、react

参数：

- 源码默认 SidebarProvider.animate：true

### 适用场景

- 项目适配场景：仪表盘导航
- 项目适配场景：管理后台

避免用于：

- 要求永远完整显示全部标签的密集管理页

### 限制与接入建议

- 原演示的链接和头像属于示例数据，路由与权限需另接业务。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/sidebar.json；资料核对时间：2026-10-12T07:14:28.122Z；SHA256：0ff0812bd2e8ee8fb98d516004c46dfecd7d5bd2cf03b191c1a8d983d815d0ef；哈希对象：source-files-joined；文件：components/ui/sidebar.tsx
- official-description：https://ui.aceternity.com/components/sidebar；资料核对时间：2026-10-12T07:14:28.122Z；SHA256：90ca6f076259318317007fc7381183e3516d8bc2547a0e66845453349b73779d；哈希对象：page-response

---

## 滚动跟随的时间线 · Timeline

案例ID：aceternity-timeline

来源：https://ui.aceternity.com/components/timeline

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

按时间组织内容，带粘性阶段标题和随滚动延伸的进度光束。

触发：页面向下滚动，进度线延伸，阶段标题粘性定位

作用层：layout、content

### 实现方法

粘性阶段标题与纵向时间线配对，滚动进度驱动亮色路径高度。

1. 测量时间线内容区域高度
2. 逐段排列标题与描述并让阶段标签sticky
3. 读取该容器scrollYProgress映射线条高度与透明度
4. 内容变化后重新测量而非写死初始高度

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：关于页面
- 项目适配场景：项目历程

避免用于：

- 没有纵向阅读顺序的即时聊天流

### 限制与接入建议

- 动态加载内容、嵌套滚动容器和顶部固定栏会影响进度测量，需项目侧重新校准。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：根据触屏视口重算滚动段高度与位移边界；窄屏保持内容顺序，避免粘性视觉遮住阅读与操作。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：以运动值联动滚动而非每帧触发整页React重渲染；在内容尺寸变化时测量，避免滚动过程中反复强制布局。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/timeline.json；资料核对时间：2026-10-12T07:14:29.533Z；SHA256：1b003835c83d3a0480f958ba5634aaee9009a83d7227be549b5f5c79d05543af；哈希对象：source-files-joined；文件：components/ui/timeline.tsx
- official-description：https://ui.aceternity.com/components/timeline；资料核对时间：2026-10-12T07:14:29.533Z；SHA256：8ca175ba295268037ae084ed79279d87d45b0ca1588a2fded644ae20932d19c9；哈希对象：page-response

---

## 半透明玻璃表面 · Glass Surface

案例ID：reactbits-glass-surface

来源：https://reactbits.dev/components/glass-surface

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

以透明度、背景模糊和玻璃边缘形成浮在彩色背景之上的玻璃表面。

触发：持续显示；背景图形运动使透视与模糊更明显

作用层：surface

### 实现方法

独立内容容器叠加玻璃装饰层：SVG模式以位移贴图分别偏移RGB通道再混合；renderer自动选择SVG/WebGL折射分支或普通backdrop-filter回退，边缘高光和内部内容分层。

1. 使用独立容器承载children并明确宽高和圆角，为每实例创建唯一滤镜ID与位移贴图。
2. SVG分支通过feImage、三组feDisplacementMap与feColorMatrix分别位移RGB，再以screen混合并模糊；WebGL分支使用独立canvas处理折射。
3. 按源码的能力检测选择SVG/WebGL或fallback磨砂表面，设置backgroundOpacity、saturation和distortionScale等已存在属性。
4. 接入建议：新增流动边框时另建掏空中心的border层，保留内部透明度、文字、玻璃背景与点击区域，不把整面surface替换成彩色渐变。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- width：锁定源码默认：200
- height：锁定源码默认：80
- borderRadius：锁定源码默认：20
- borderWidth：锁定源码默认：0.07
- brightness：锁定源码默认：50
- opacity：锁定源码默认：0.93
- blur：锁定源码默认：11
- displace：锁定源码默认：0
- backgroundOpacity：锁定源码默认：0
- saturation：锁定源码默认：1
- distortionScale：锁定源码默认：-180
- redOffset：锁定源码默认：0
- greenOffset：锁定源码默认：10
- blueOffset：锁定源码默认：20
- xChannel：锁定源码默认：'R'
- yChannel：锁定源码默认：'G'
- mixBlendMode：锁定源码默认：'difference'
- refraction：锁定源码默认：true
- renderer：锁定源码默认：'auto'

### 适用场景

- 有可见背景层的浮动导航或信息卡
- 可控制背景、需要折射材质的品牌面板

避免用于：

- 背景本身是单一实色、且要求各浏览器折射完全一致的精确界面

### 限制与接入建议

- SVG backdrop滤镜与WebGL分支存在浏览器能力差异，源码包含回退，普通模糊回退不等于完整折射。
- 必须有背后可见内容才能感知玻璃；大范围折射可能扭曲文字，不能让重要正文参与背景采样。

手机：项目接入建议：优先测试fallback和小面积面板，降低折射强度，确保文字对比度和触控区，避免多个全屏backdrop层。

减少动态：项目接入建议：保留静态玻璃材质，停止动态背景或采样变化；玻璃本身不强制添加持续动画。

性能：项目接入建议：限制滤镜区域、重复实例与高强度模糊，随容器尺寸刷新位移图而非每次交互重建DOM，卸载清理绘制资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/GlassSurface-JS-CSS.json；资料核对时间：2026-10-25T07:52:53.547Z；SHA256：dd4768a34758469aa4d4d3c46f69ce03693de6822541f6d6b38c52a2c634dce3；哈希对象：registry-response；文件：GlassSurface.css、GlassSurface.jsx

---

## 鼠标响应的点阵背景 · Dot Grid

案例ID：reactbits-dot-grid

来源：https://reactbits.dev/backgrounds/dot-grid

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

规则点阵铺满背景，鼠标经过时附近点亮起并产生位移反馈。

触发：鼠标在背景移动；附近圆点变亮、移动并回弹

作用层：page-background

### 实现方法

以实例化圆点绘制规则网格，按指针距离计算影响权重，邻近圆点位移、变色并以回弹函数恢复。

1. 在React客户端引入锁定registry的DotGrid.css、DotGrid.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 由dotSize和gap建立点阵；缓存各点原位，将proximity内的距离衰减映射到strength，再更新绘制属性。
3. 使用源码已提供的dotSize、gap、baseColor、activeColor、proximity、strength等属性配置；触发依据：鼠标在背景移动；附近圆点变亮、移动并回弹。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- dotSize：锁定源码默认：5
- gap：锁定源码默认：18
- baseColor：锁定源码默认：'#3a3446'
- activeColor：锁定源码默认：'#ffffff'
- proximity：锁定源码默认：140
- strength：锁定源码默认：1
- bounce：锁定源码默认：0.6
- tension：锁定源码默认：0.4
- returnDuration：锁定源码默认：0.8
- shockRadius：锁定源码默认：320
- shockStrength：锁定源码默认：5
- swell：锁定源码默认：0.8
- stretch：锁定源码默认：0.5
- glow：锁定源码默认：0.5
- shape：锁定源码默认：'circle'
- fade：锁定源码默认：0
- opacity：锁定源码默认：1
- intro：锁定源码默认：true
- mouseInteraction：锁定源码默认：true
- clickShock：锁定源码默认：true
- paused：锁定源码默认：false

### 适用场景

- 科技工具入口
- 数据产品功能区

避免用于：

- 精确统计散点图

### 限制与接入建议

- 网格是装饰场，不能冒充真实数据分布；点间距过小会明显增加绘制数量。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/DotGrid-JS-CSS.json；资料核对时间：2026-10-25T07:52:53.599Z；SHA256：c246dcd52a779f03ec95bdb4c1e0ee21f5776dc4dfe64f9bb85fa83459db9d7b；哈希对象：registry-response；文件：DotGrid.css、DotGrid.jsx

---

## 流动渐变光晕 · Background Gradient

案例ID：aceternity-background-gradient

来源：https://ui.aceternity.com/components/background-gradient

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

为卡片或按钮添加缓慢流动的彩色渐变边缘及背景光晕。

触发：自动循环流动；无需点击

作用层：surface、outer-glow

### 实现方法

两层径向渐变位于内容下方，清晰渐变与模糊外晕同步改变背景位置。

1. 相对定位外壳保留描边间距
2. 叠放清晰渐变层和blur外晕层
3. animate启用时循环改变400%背景的position
4. 用独立较高层级的子内容覆盖中央阅读面

依赖：motion、react

参数：

- 源码默认 BackgroundGradient.animate：true

### 适用场景

- 项目适配场景：产品卡片
- 项目适配场景：行动按钮

避免用于：

- 要求仅有窄描边却允许整面彩色覆盖的表单

### 限制与接入建议

- 原组件绘制背景和外晕，不是掏空的纯边框；只需玻璃边缘时必须另加遮罩改造，不能给内部surface铺满渐变。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/background-gradient.json；资料核对时间：2026-10-12T07:14:26.145Z；SHA256：b00bbd960069dac2740889af5bdffcc4eaa245b465de7433a145742e628799f4；哈希对象：source-files-joined；文件：components/ui/background-gradient.tsx
- official-description：https://ui.aceternity.com/components/background-gradient；资料核对时间：2026-10-12T07:14:26.145Z；SHA256：64616987b91d7e529e0c51cd0203bc3f6674b5153739cc3c13f33630e6c3524e；哈希对象：page-response

---

## 悬停着色的网格背景 · Background Boxes

案例ID：aceternity-background-boxes

来源：https://ui.aceternity.com/components/background-boxes

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

全宽方格背景在鼠标经过时高亮，保留网格的空间秩序和轻量互动。

触发：鼠标经过背景方格后高亮并逐渐消退

作用层：page-background

### 实现方法

大量错列网格单元在hover时切换底色，透视变换形成背景平面。

1. 生成行列方格并稳定分配色彩
2. 对网格外层设置倾斜透视
3. 每格whileHover改变backgroundColor
4. 把文字与操作放到网格之外的独立前景层

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：首屏背景
- 项目适配场景：专题页面

避免用于：

- 正文密集或大量可编辑单元格的区域

### 限制与接入建议

- 方格数量随行列相乘增长，逐格DOM事件和透视背景不宜覆盖整个长页面。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/background-boxes.json；资料核对时间：2026-10-12T07:14:25.508Z；SHA256：d56f958318c245afa245ee8c0449d647cd824bbb2ccbbad93d9a44f7edfcda18；哈希对象：source-files-joined；文件：components/ui/background-boxes.tsx
- official-description：https://ui.aceternity.com/components/background-boxes；资料核对时间：2026-10-12T07:14:25.508Z；SHA256：2db6e8dee021020ca5a64b39b1d645b98552b810d42f95faaa994103ea76ee42；哈希对象：page-response

---

## 跟随鼠标的卡片聚光 · Spotlight Card

案例ID：reactbits-spotlight-card

来源：https://reactbits.dev/components/spotlight-card

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

卡片内的柔和聚光随鼠标移动，强化悬停反馈与内容焦点。

触发：鼠标进入卡片，聚光跟随；移出后淡出

作用层：surface

### 实现方法

通过局部指针坐标移动独立径向光斑层，使用边缘距离权重调整描边光，正文位于光层之上。

1. 在React客户端引入锁定registry的SpotlightCard.css、SpotlightCard.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量卡片边界，将指针映射为渐变中心；按intensity、spotlightSize与softness更新独立光层和可选边缘层。
3. 使用源码已提供的intensity、spotlightSize、softness、shape、borderGlow、proximity等属性配置；触发依据：鼠标进入卡片，聚光跟随；移出后淡出。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- intensity：锁定源码默认：0.15
- spotlightSize：锁定源码默认：240
- softness：锁定源码默认：0.7
- shape：锁定源码默认：'circle'
- borderGlow：锁定源码默认：0.6
- proximity：锁定源码默认：80
- smoothing：锁定源码默认：0.3
- ambient：锁定源码默认：false
- flare：锁定源码默认：true
- grain：锁定源码默认：0
- theme：锁定源码默认：'dark'

### 适用场景

- 功能与服务卡片
- 作品或商品摘要

避免用于：

- 依靠悬停才能阅读正文的内容

### 限制与接入建议

- 光斑照亮内部surface，边缘光是另一层；它不是沿轮廓自动行走的光束。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：检查短屏滚动行程、内部滚动与外部页面的分工，适度减少可见层数，保留全部内容和可直接操作入口。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/SpotlightCard-JS-CSS.json；资料核对时间：2026-10-25T07:52:53.577Z；SHA256：c20166b02fa49e563b2b3d78abcb5e22d07c496fa31cf846697c8fedac1ba3f3；哈希对象：registry-response；文件：SpotlightCard.css、SpotlightCard.jsx

---

## 跟随鼠标的立体倾斜 · Tilted Card

案例ID：reactbits-tilted-card

来源：https://reactbits.dev/components/tilted-card

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

卡片根据鼠标位置产生三维倾斜和轻微放大，移出后回到原位。

触发：鼠标在卡片内移动，卡片倾斜；移出复位

作用层：content

### 实现方法

Motion弹簧值将指针相对中心的偏移映射为rotateX和rotateY，悬停放大，离开时回到零角度。

1. 在React客户端引入锁定registry的TiltedCard.css、TiltedCard.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 保持外部命中容器稳定，只旋转内部图像平面；图注跟随局部指针位置，分别维护缩放和旋转弹簧。
3. 使用源码已提供的altText、captionText、containerHeight、containerWidth、imageHeight、imageWidth等属性配置；触发依据：鼠标在卡片内移动，卡片倾斜；移出复位。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12

参数：

- altText：锁定源码默认：'Tilted card image'
- captionText：锁定源码默认：''
- containerHeight：锁定源码默认：'300px'
- containerWidth：锁定源码默认：'100%'
- imageHeight：锁定源码默认：'300px'
- imageWidth：锁定源码默认：'300px'
- scaleOnHover：锁定源码默认：1.1
- rotateAmplitude：锁定源码默认：14
- showMobileWarning：锁定源码默认：true
- showTooltip：锁定源码默认：true
- overlayContent：锁定源码默认：null
- displayOverlayContent：锁定源码默认：false

### 适用场景

- 作品封面
- 商品图展示

避免用于：

- 需要精确点选的小型表格

### 限制与接入建议

- 旋转仅改变展示平面，不能让表单和主要按钮一起漂移；外层与内层transform要分开。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/TiltedCard-JS-CSS.json；资料核对时间：2026-10-25T07:52:53.645Z；SHA256：d0cf72edd1672d77356b77822071137a80f213e559860afe06994ba5e7dd664e；哈希对象：registry-response；文件：TiltedCard.css、TiltedCard.jsx

---

## 沿边框追踪的发光 · Glowing Effect

案例ID：aceternity-glowing-effect

来源：https://ui.aceternity.com/components/glowing-effect

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

彩色边缘光根据鼠标相对卡片的位置改变方向，强调容器边界。

触发：鼠标靠近或经过卡片边缘，光晕随角度移动

作用层：border、outer-glow

### 实现方法

根据指针与卡片中心夹角转动conic-gradient，通过遮罩只显示边缘光。

1. 监听指针并用局部矩形计算距离与角度
2. 在inactiveZone内关闭高光、proximity范围内激活
3. 平滑更新CSS角度变量驱动锥形渐变
4. 用边缘遮罩与borderWidth隔离内容面

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：功能卡片
- 项目适配场景：卡片网格

避免用于：

- 要求无人操作也持续绕边运行的焦点动画

### 限制与接入建议

- 源码disabled默认true，需明确启用；它是指针追踪边缘，不是自动沿轮廓跑动的MovingBorder。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/glowing-effect.json；资料核对时间：2026-10-12T07:14:31.260Z；SHA256：9d987ef5daada143f84daa1b51261934e4462c14ffb77303b3063575864ba0af；哈希对象：source-files-joined；文件：components/ui/glowing-effect.tsx
- official-description：https://ui.aceternity.com/components/glowing-effect；资料核对时间：2026-10-12T07:14:31.260Z；SHA256：c055c0855378e26d22d503f54b44c881fdcc5a695f6383d83d19bdf601f42bd2；哈希对象：page-response

---

## 鼠标滑动揭示文字 · Text Reveal Card

案例ID：aceternity-text-reveal-card

来源：https://ui.aceternity.com/components/text-reveal-card

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

鼠标在卡片内横向移动，逐步揭示另一层文字内容。

触发：鼠标横向滑过文字，遮罩随位置展开；移出复位

作用层：text、content

### 实现方法

两层文字叠放，用卡片内指针横向比例裁开上层文字，并配合分界高光。

1. 建立同尺寸的底层与上层文字
2. 把clientX减容器left映射为0到100的裁切比例
3. 在指针进入时显示高光与揭示层
4. 离开恢复覆盖状态，并提供触屏可见的说明替代

依赖：motion、react、tailwind-merge

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：首屏标题
- 项目适配场景：品牌说明

避免用于：

- 必须一次完整可读的题目和答案

### 限制与接入建议

- 这是整块裁切揭示，不是逐词模糊入场；主要信息不能仅藏在hover后的第二层。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/text-reveal-card.json；资料核对时间：2026-10-12T07:14:22.968Z；SHA256：70db36b2988130c58486954b533147055cd6a6d2c022d0d341c2fb5a8f9266e2；哈希对象：source-files-joined；文件：components/ui/text-reveal-card.tsx
- official-description：https://ui.aceternity.com/components/text-reveal-card；资料核对时间：2026-10-12T07:14:22.968Z；SHA256：cb03e4a915908a0f365955e3b567a8b47308539abdc9cf9caa83f876f20f3884；哈希对象：page-response

---

## 网格与圆点底纹 · Grid

案例ID：eb2b7ba632afff5e

来源：https://ui.aceternity.com/components/grid-and-dot-backgrounds

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

用细线方格或均匀圆点铺成背景，可叠加从中心向外淡出的遮罩；它是背景纹理，不是内容卡片的排版结构。

触发：持续显示；原站示例没有点击或鼠标跟随动画

作用层：page-background

### 实现方法

重复网格或圆点背景结合径向遮罩形成静态底纹。

1. 用背景图案平铺细线方格或圆点
2. 按主题设置低对比图案色
3. 叠加径向淡出遮罩并把内容置于其上

依赖：react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：首屏背景
- 项目适配场景：内容区底纹

避免用于：

- 被误当作自动扫描动画的强动效首屏

### 限制与接入建议

- 旧grid文档已迁移；缓存registry依赖示例中的grid工具类，项目需补齐对应背景样式，不是CSS Grid内容布局。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：保持静态布局与材质，若项目另加hover位移则关闭位移，仅保留清晰焦点与选中状态。

性能：项目建议：保持静态CSS绘制，控制图像资源和DOM数量；无需为了装饰启动持续帧循环。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/grid.json；资料核对时间：2026-10-12T07:14:22.874Z；SHA256：bebff9cd82d0d330a18f6e9fddbd570cd09006b5246823a375663b34cbd3d8c8；哈希对象：source-files-joined；文件：components/ui/grid.tsx
- official-description：https://ui.aceternity.com/components/grid-and-dot-backgrounds；资料核对时间：2026-10-12T07:14:22.874Z；SHA256：69f06c94d172d66f6e9339166e5a71b563769ab703de0105334323eb6a5140e8；哈希对象：page-response

---

## 随滚动伸缩的竖向光线 · Moving Line

案例ID：dc50ae9866b7171d

来源：https://ui.aceternity.com/registry/moving-line.json

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

长内容左侧放一根蓝色竖线，上下滚动该区域时，亮色路径随阅读位置延长或缩短，细渐变底线保持可见。官方提供源码，独立演示页目前不可用。

触发：区域滚动进度驱动 SVG 路径长度；不是自动循环

作用层：content

### 实现方法

滚动区域旁的SVG竖向路径随阅读进度伸缩，底部细线始终保留。

1. 给内容区域设置ref并读取局部滚动进度
2. 按源码固定路径渲染SVG，若按内容高度伸缩则另做测量与路径改造
3. 将进度映射到亮线pathLength
4. 将提示线放在正文侧边并预留内边距

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：长文侧边
- 项目适配场景：介绍流程旁

避免用于：

- 无需滚动就必须出现持续变化的背景

### 限制与接入建议

- 源码路径和高度固定为1567，动态内容测量属于项目改造；触发源是滚动而非自动闪烁，当前来源使用registry，不拼接失效演示地址。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：根据触屏视口重算滚动段高度与位移边界；窄屏保持内容顺序，避免粘性视觉遮住阅读与操作。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：以运动值联动滚动而非每帧触发整页React重渲染；在内容尺寸变化时测量，避免滚动过程中反复强制布局。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/moving-line.json；资料核对时间：2026-10-12T07:14:22.562Z；SHA256：f5126c9d36a4a9350903f32339cac8f70a19dbd6d652f35edaf012203cc8640c；哈希对象：source-files-joined；文件：components/ui/moving-line.tsx

---

## 缓慢闪烁的星点 · Sparkles

案例ID：9690b06b16d43357

来源：https://ui.aceternity.com/components/sparkles

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

在标题下方或整个区块铺上细小亮点，不同位置的点以不同速度明暗闪烁，形成轻盈的星尘背景。

触发：组件显示后自动闪烁；无需点击

作用层：page-background、outer-glow

### 实现方法

tsParticles粒子引擎在透明画布上生成大小与透明度不同的闪烁星点。

1. 初始化并加载粒子精简引擎
2. 根据区域面积设置粒子密度与颜色
3. 使粒子透明度和尺寸在各自节奏中变化
4. 在前景遮罩中保留文字对比与点击通路

依赖：@tsparticles/engine、@tsparticles/react、@tsparticles/slim、motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：首屏标题附近
- 项目适配场景：行动区背景

避免用于：

- 对光敏变化敏感的长时阅读背景

### 限制与接入建议

- 引擎初始化、粒子密度与多实例画布都有成本；闪烁装饰不应影响阅读或被声称为业务状态。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/sparkles.json；资料核对时间：2026-10-12T07:14:22.730Z；SHA256：4b37534984e393929bc7af6ef292affc9a5b416fd3549fc4c4941ca568a7e03e；哈希对象：source-files-joined；文件：components/ui/sparkles.tsx
- official-description：https://ui.aceternity.com/components/sparkles；资料核对时间：2026-10-12T07:14:22.730Z；SHA256：30327f2f849e29d574c30398280b3a35d8747119e4514de6d9530337b313ac52；哈希对象：page-response

---

## 斜照标题的柔和聚光 · Spotlight

案例ID：4c7e1b83582015b4

来源：https://ui.aceternity.com/components/spotlight

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

深色背景上出现一束斜向柔光，亮区集中照向标题和正文；进入时光束逐渐显现，随后作为背景保留。

触发：组件加载时淡入；原版不是鼠标追踪灯

作用层：page-background

### 实现方法

静态SVG柔光束通过CSS入场动画从斜上方照亮标题。

1. 创建含模糊滤镜的SVG光束
2. 绝对定位并旋转到标题后方
3. 加载时从透明位移状态显现
4. 完成后保留柔光与稳定前景内容

依赖：react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：首页首屏
- 项目适配场景：宣传标题区

避免用于：

- 明确要求鼠标移动时实时追踪的交互光斑

### 限制与接入建议

- 原版主要是入场聚光，未提供指针追踪；需补齐文档中的spotlight关键帧样式。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/spotlight.json；资料核对时间：2026-10-12T07:14:22.670Z；SHA256：5bf5e3c43a1dab43e6e0ac56c4783132608b91a2fabdc4a61b2b961ef519093d；哈希对象：source-files-joined；文件：components/ui/spotlight.tsx
- official-description：https://ui.aceternity.com/components/spotlight；资料核对时间：2026-10-12T07:14:22.670Z；SHA256：f04f11fdfbbf1c4a9e47e683dd15d9c745ca460c372c243649769b7d1d54b059；哈希对象：page-response

---

## 悬停点亮的星阵卡片 · Glowing Stars

案例ID：75930d2c4a72f4fe

来源：https://ui.aceternity.com/components/glowing-stars-effect

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

卡片顶部是规则排列的小星点，平时随机几颗亮起放大；鼠标移入时整片星阵按顺序发出蓝色光晕，移出恢复随机闪烁。

触发：自动随机闪烁；鼠标移入、移出切换整片星阵状态

作用层：surface、outer-glow

### 实现方法

星点矩阵在空闲时随机闪亮，hover时改为整片星阵依次亮起。

1. 用行列索引生成小星点
2. 为空闲状态周期选择少量活动索引
3. hover时切换为有stagger的全阵列亮起
4. 离开恢复随机序列并清理计时器

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：功能卡片
- 项目适配场景：产品亮点

避免用于：

- 必须保持安静且无亮度变化的正文背景

### 限制与接入建议

- 星阵是卡片局部装饰，不能替代独立可见的整页主视觉；星点过多会增加动画元素数。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/glowing-stars.json；资料核对时间：2026-10-12T07:14:22.963Z；SHA256：e69fe3e5d991a7ba96544db11afd92b8363526f4fa4f9b73f21c5fb527a938c5；哈希对象：source-files-joined；文件：components/ui/glowing-stars.tsx
- official-description：https://ui.aceternity.com/components/glowing-stars-effect；资料核对时间：2026-10-12T07:14:22.963Z；SHA256：c0572ac8b8317f282263f26c20c843da9e5f9dbf0d5879c53cb85e7645dea7c9；哈希对象：page-response

---

## 跟随头像的弹性提示 · Animated Tooltip

案例ID：aca0c12575e64a6a

来源：https://ui.aceternity.com/components/animated-tooltip

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

头像上方在悬停时弹出姓名与说明，提示浮层随鼠标在头像上的位置轻微横移和倾斜，移出后收起。

触发：鼠标悬停头像；横向移动驱动提示位置与旋转

作用层：content

### 实现方法

头像上方的提示层以弹性入场，并根据头像内横向指针位置偏移与旋转。

1. 记录当前hover的头像ID
2. 读取头像中心与指针偏移
3. 用弹簧运动值映射提示层x与rotate
4. 退出时通过AnimatePresence收起并保留头像可访问名称

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：团队成员
- 项目适配场景：协作者头像

避免用于：

- 必须在触屏上直接阅读全部说明的列表

### 限制与接入建议

- 依赖hover的身份说明应有键盘focus与触屏点击替代，不能遮挡相邻头像入口。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/animated-tooltip.json；资料核对时间：2026-10-12T07:14:23.222Z；SHA256：5ac351d14d3890b4af055f2a0588c1499d905d144abe4f47aa2fbd887c44a3ea；哈希对象：source-files-joined；文件：components/ui/animated-tooltip.tsx
- official-description：https://ui.aceternity.com/components/animated-tooltip；资料核对时间：2026-10-12T07:14:23.222Z；SHA256：7cb9edf077366db374e65ef740e0c57bd9ab9d3197f1c914d10c6087fd2bbe4b；哈希对象：page-response

---

## 跟随鼠标的姓名指针 · Following Pointer

案例ID：210cfee7c088fdd1

来源：https://ui.aceternity.com/components/following-pointer

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

在指定卡片内隐藏系统指针，换成带箭头和文字标签的自定义指针；它随鼠标移动，进入和离开区域时淡入淡出。

触发：鼠标进入指定区域显示；移动跟随；移出隐藏

作用层：content

### 实现方法

在局部卡片内把系统指针替换为跟随位置的姓名箭头浮层。

1. 监听容器进入与离开并切换可见状态
2. 把局部指针坐标写入浮层位置
3. 用不拦截事件的箭头和标签替代原指针
4. 离开区域恢复系统光标

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：文章卡片
- 项目适配场景：互动展示区

避免用于：

- 触屏主导或需要系统精确文本选择的编辑区

### 限制与接入建议

- 光标装饰只用于精确指针设备；不能宣称多人实时协作，姓名数据与同步需要真实接入。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/following-pointer.json；资料核对时间：2026-10-12T07:14:23.293Z；SHA256：ea4c418b3f3dbfc85be0f4ae6d0624b36a3c46aba1207515a8f7287198727dac；哈希对象：source-files-joined；文件：components/ui/following-pointer.tsx
- official-description：https://ui.aceternity.com/components/following-pointer；资料核对时间：2026-10-12T07:14:23.293Z；SHA256：4faa291be706bc6843e75754bc48980d85eda5895946d5448edb2b7b5839747d；哈希对象：page-response

---

## 沿曲线路径穿梭的光束 · Background Beams

案例ID：55988ec0ea1c44b9

来源：https://ui.aceternity.com/components/background-beams

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多条弯曲细线组成大面积背景，亮色线段沿各自路径不断穿过，中央内容保持清晰，不会改变页面排版。

触发：显示后各路径自动循环流动

作用层：page-background

### 实现方法

多条SVG弯曲路径共享低透明底线，各自渐变端点循环移动形成穿梭光束。

1. 在固定viewBox内定义曲线路径
2. 给每条路径分配独立渐变标识
3. 用Motion循环改变渐变x1/y1/x2/y2
4. 把SVG作为不拦截点击的底层并保持内容静止

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：首屏背景
- 项目适配场景：订阅行动区

避免用于：

- 需要显示精确数据含义的真实连线图

### 限制与接入建议

- 是路径上的渐变运动而非整条曲线位移；多实例gradient ID需项目侧隔离。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/background-beams.json；资料核对时间：2026-10-12T07:14:23.300Z；SHA256：a6cb4847ec4af2602d523b34eb1d3fd991f1b47b803635b114fc8313199f3682；哈希对象：source-files-joined；文件：components/ui/background-beams.tsx
- official-description：https://ui.aceternity.com/components/background-beams；资料核对时间：2026-10-12T07:14:23.300Z；SHA256：29846797fd5c4016dbdb5b5d6aa0e1ed812a3d32b2398f988721169f4c60cc10；哈希对象：page-response

---

## 鼠标擦开另一层内容 · SVG Mask Effect

案例ID：793c0b94129c0d0f

来源：https://ui.aceternity.com/components/svg-mask-effect

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

默认显示一层文字或背景，鼠标附近的圆形遮罩揭开下方另一层内容；悬停重点内容时遮罩可以扩大，形成局部探照式揭示。

触发：鼠标在区域内移动；悬停目标时扩大遮罩

作用层：content、surface

### 实现方法

上下两层内容叠放，圆形mask随局部指针移动揭示另一层。

1. 创建同范围的普通内容与masked内容
2. 监听指针换算相对坐标
3. 改变mask-position与mask-size
4. 重点区域hover时扩大遮罩并在移出后复位

依赖：motion、react

参数：

- 源码默认 MaskContainer.size：10
- 源码默认 MaskContainer.revealSize：600

### 适用场景

- 项目适配场景：品牌宣言
- 项目适配场景：首屏文案

避免用于：

- 法规说明或必须立即完整呈现的教学答案

### 限制与接入建议

- 被遮罩层只作补充揭示，不应承载唯一的关键说明；需核对CSS mask兼容与触屏替代。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/svg-mask-effect.json；资料核对时间：2026-10-12T07:14:23.385Z；SHA256：8ce6017e2f55eeb266ba459f7c5bb73f54678f9693a026fe2ec55bddbe902506；哈希对象：source-files-joined；文件：components/ui/svg-mask-effect.tsx
- official-description：https://ui.aceternity.com/components/svg-mask-effect；资料核对时间：2026-10-12T07:14:23.385Z；SHA256：6103fa8b73d1b6ed4380b10664695d3e870a49d579ed1be4628ea9effe331403；哈希对象：page-response

---

## 循环横移的评价卡片 · Infinite Moving Cards

案例ID：708de7a2bf373eac

来源：https://ui.aceternity.com/components/infinite-moving-cards

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多张评价卡片排成一行并连续横向移动，末尾无缝接回开头；可以改变移动方向和速度，悬停时暂停便于阅读。

触发：显示后自动循环；默认鼠标悬停暂停

作用层：layout、content

### 实现方法

复制卡片序列并用CSS横向动画把整条轨道连续移动实现无缝循环。

1. 复制首轮卡片节点形成至少两轮序列
2. 按方向和速度设置轨道CSS变量
3. 线性移动恰好一轮内容宽度
4. hover或focus时暂停以便阅读与点击

依赖：react

参数：

- 源码默认 InfiniteMovingCards.direction："left"
- 源码默认 InfiniteMovingCards.speed："fast"
- 源码默认 InfiniteMovingCards.pauseOnHover：true

### 适用场景

- 项目适配场景：用户评价区
- 项目适配场景：合作案例带

避免用于：

- 长篇重要评价或需要逐项精读的材料

### 限制与接入建议

- 原方法克隆节点，接入时处理重复ID、重复可聚焦元素与屏幕阅读器重复内容。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/infinite-moving-cards.json；资料核对时间：2026-10-12T07:14:23.454Z；SHA256：428312dab8233d627625e1b27d34709ac603a5d13fa12bcb0928a801d11031fc；哈希对象：source-files-joined；文件：components/ui/infinite-moving-cards.tsx
- official-description：https://ui.aceternity.com/components/infinite-moving-cards；资料核对时间：2026-10-12T07:14:23.454Z；SHA256：37e11f0ce24b95586d0971c17c5225fc6e4eccd73f40644c63f9b9cc47a89424；哈希对象：page-response

---

## 悬停立起的立体链接卡片 · 3D Animated Pin

案例ID：b92ac47d891f9b28

来源：https://ui.aceternity.com/components/3d-pin

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

链接卡片在悬停时转成倾斜透视平面，中央出现向上延伸的发光连线、圆环与链接标签，像一枚立在地图上的图钉。

触发：鼠标悬停卡片展开立体图钉；移出复位

作用层：surface、content、outer-glow

### 实现方法

悬停时内容平面倾斜，发光连线和圆环把链接标签抬成空间图钉。

1. 用透视容器包住链接卡
2. hover时改变卡面旋转与缩放
3. 显示沿Z方向分离的标签、光柱和圆环
4. 离开恢复卡面并保留链接可点击区域

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：项目入口
- 项目适配场景：产品链接

避免用于：

- 高密度表格中相互覆盖的链接入口

### 限制与接入建议

- 图钉视觉不是地理定位服务；透视与外溢装饰需要足够边距。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/3d-pin.json；资料核对时间：2026-10-12T07:14:23.597Z；SHA256：3eab7bf90257ddf144e33021f759656aab51bf218ef7c1e486b0438763156dc7；哈希对象：source-files-joined；文件：components/ui/3d-pin.tsx
- official-description：https://ui.aceternity.com/components/3d-pin；资料核对时间：2026-10-12T07:14:23.597Z；SHA256：5712f7905e05742c1570d1d4c111b749f59f005d6186c329b719d8282333295f；哈希对象：page-response

---

## 鼠标附近显露的随机字符 · Evervault Card

案例ID：1b348af29973d9b4

来源：https://ui.aceternity.com/components/evervault-card

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

深色卡片布满随机字母与数字，鼠标附近的圆形范围显露彩色渐变和更清晰的字符，形成像加密矩阵一样的局部高光。

触发：鼠标在卡片内移动，局部遮罩与渐变跟随

作用层：surface

### 实现方法

随机字符组成加密纹理，指针附近的径向遮罩显露彩色字符层。

1. 生成受控长度的随机字符背景
2. 将指针位置写入MotionValue
3. 用radial-gradient遮罩限定可见字符范围
4. 定时或移动时更新纹理且不触碰前景正文

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：安全产品卡片
- 项目适配场景：技术介绍

避免用于：

- 需要可复制真实内容的代码或密钥展示

### 限制与接入建议

- 随机字符仅为视觉装饰，不代表真实加密、隐私保护或安全状态。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/evervault-card.json；资料核对时间：2026-10-12T07:14:23.676Z；SHA256：03478ab4a980e8dd6a998311a0f703037ea17d5023aaa74eb8394c10c6723489；哈希对象：source-files-joined；文件：components/ui/evervault-card.tsx
- official-description：https://ui.aceternity.com/components/evervault-card；资料核对时间：2026-10-12T07:14:23.676Z；SHA256：6e11a00a9ac594857d813972e4390559236d790926ba6388a4102e793101a511；哈希对象：page-response

---

## 滚动向两侧散开的图片墙 · Parallax Scroll 2

案例ID：e9a78de82ee90a6c

来源：https://ui.aceternity.com/components/parallax-scroll

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

三列图片中，中间列保持稳定，左右列在滚动时向上和向外偏移并轻微转动，像图片墙从中心向两边散开。

触发：滚动容器，左右列平移和旋转随进度变化

作用层：layout、content

### 实现方法

同页第二变体让三列图像的外侧两列在滚动时向上、向外平移并旋转，中间列保持稳定。

1. 把图片按三段分列
2. 明确监听画廊容器的滚动进度
3. 两侧y均向上移动，x与rotateZ分别向左右反向展开
4. 保持中列静止并预留外移裁切范围

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：创意画廊
- 项目适配场景：作品集图片区

避免用于：

- 没有足够外移空间的窄栏与密集图片表格

### 限制与接入建议

- 此条中文行为对应官方ParallaxScrollSecond变体；基础ParallaxScroll是上下反向列位移，不能混为同一算法。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：根据触屏视口重算滚动段高度与位移边界；窄屏保持内容顺序，避免粘性视觉遮住阅读与操作。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：以运动值联动滚动而非每帧触发整页React重渲染；在内容尺寸变化时测量，避免滚动过程中反复强制布局。

目录来源是官方合并文档，具体行为采用同页ParallaxScrollSecond变体；基础版列反向上下移动，不能混淆。依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/parallax-scroll-2.json；资料核对时间：2026-10-12T07:14:24.002Z；SHA256：508bacdeddb914de181fd5b7d91add8408ff8742ba062cfd9ddff9d7ac820bb1；哈希对象：source-files-joined；文件：components/ui/parallax-scroll-2.tsx
- official-description：https://ui.aceternity.com/components/parallax-scroll；资料核对时间：2026-10-12T07:14:24.002Z；SHA256：78d334c302891ec6f7ca0b6f9fa1af0ee6b6a13f744daa515ae1536130730c7d；哈希对象：page-response

---

## 鼠标驱动的多层首屏图片 · Parallax Hero Images

案例ID：3949bfe57700b184

来源：https://ui.aceternity.com/components/parallax-hero-images

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多张图片以不同大小散布在标题周围，先从模糊中显现，再按各自深度响应鼠标偏移，营造悬浮的远近层次。

触发：图片入场显现；鼠标在首屏内移动驱动不同幅度的位移

作用层：content、layout

### 实现方法

首屏多张图片错相入场，不同深度图层以不同倍数跟随指针平移。

1. 把图片以绝对位置分散在标题周围
2. 用模糊和位移形成首次入场
3. 将指针归一化后按各图层深度映射偏移
4. 外层负责整体布局、内层负责视差以隔离transform

依赖：motion、react

参数：

- 源码默认 ParallaxHeroImages.variant："default"

### 适用场景

- 项目适配场景：作品集首屏
- 项目适配场景：品牌展示首屏

避免用于：

- 要求每张图片始终精确对齐的资料表

### 限制与接入建议

- 图片只负责装饰或展示，不能在漂移中遮住主要输入；触屏没有hover位置需要固定构图。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/parallax-hero-images.json；资料核对时间：2026-10-12T07:14:23.817Z；SHA256：b93bea939241620dbec43ad61d78e3928c309e1934c500e3689c67a19287ce11；哈希对象：source-files-joined；文件：components/ui/parallax-hero-images.tsx
- official-description：https://ui.aceternity.com/components/parallax-hero-images；资料核对时间：2026-10-12T07:14:23.817Z；SHA256：e8e45594b80cfb218472edb15bc7687fa6dc921c44af807eedcb45b65b9efb42；哈希对象：page-response

---

## 沿文章边缘跟随的光束 · Tracing Beam

案例ID：d8edfdc391f7a8aa

来源：https://ui.aceternity.com/components/tracing-beam

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

长内容旁有一条弯折的细线路径，蓝紫色光束沿路径随阅读滚动推进，顶部圆点也随滚动状态变化。

触发：页面滚动驱动路径中的渐变光束位置与长度

作用层：content

### 实现方法

内容区滚动进度映射SVG渐变的y1/y2，使蓝紫光束沿侧边弯折路径推进。

1. 测量内容高度创建对应SVG弯折路径
2. useScroll以内容区域为target读取进度
3. useTransform与useSpring把进度映射为渐变上下端点
4. 保留静态底线与正文间距

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：文章页
- 项目适配场景：长篇介绍旁

避免用于：

- 需要作为开页自动主视觉的短内容区

### 限制与接入建议

- 缓存源码首次挂载测高度；异步内容需项目侧补测，多个实例需独立gradient ID；它不是自动循环光束。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：根据触屏视口重算滚动段高度与位移边界；窄屏保持内容顺序，避免粘性视觉遮住阅读与操作。

减少动态：源码动态path带motion-reduce:hidden；项目接入还应核对保留静态底线与正文，停止额外滚动位移。

性能：项目建议：以运动值联动滚动而非每帧触发整页React重渲染；在内容尺寸变化时测量，避免滚动过程中反复强制布局。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/tracing-beam.json；资料核对时间：2026-10-12T07:14:23.965Z；SHA256：99378566d3354d734f4d7da530875e6e1746ce28a6bf819df971632990d4254f；哈希对象：source-files-joined；文件：components/ui/tracing-beam.tsx
- official-description：https://ui.aceternity.com/components/tracing-beam；资料核对时间：2026-10-12T07:14:23.965Z；SHA256：60d50d8d813041ac9fb46674749b03d3765a376987385035f0be5312a90251fe；哈希对象：page-response

---

## 滚动扶正的屏幕展示框 · Container Scroll Animation

案例ID：4bd636826aaccb23

来源：https://ui.aceternity.com/components/container-scroll-animation

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

截图或内容容器从向后倾斜的三维角度开始，向下滚动时逐渐扶正并调整大小，像产品屏幕从远处转到面前。

触发：页面滚动驱动容器旋转与缩放

作用层：layout、surface

### 实现方法

滚动让展示容器从后仰透视状态转正并同步缩放和平移。

1. 在展示段落读取scrollYProgress
2. 把进度分别映射到rotateX、scale与标题位移
3. 把屏幕内容装入独立的透视卡面
4. 选择正确滚动容器并为大幅变化预留段落高度

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：产品首屏
- 项目适配场景：界面展示区

避免用于：

- 必须始终固定尺寸的表单或操作主界面

### 限制与接入建议

- 它是一个容器扶正，不是笔记本开合；内部业务控件不要再叠同一transform。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：根据触屏视口重算滚动段高度与位移边界；窄屏保持内容顺序，避免粘性视觉遮住阅读与操作。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：以运动值联动滚动而非每帧触发整页React重渲染；在内容尺寸变化时测量，避免滚动过程中反复强制布局。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/container-scroll-animation.json；资料核对时间：2026-10-12T07:14:24.067Z；SHA256：dfcc37dc475073f28ed42cf5292622af47071a7bc32f7970073ef82594db4165；哈希对象：source-files-joined；文件：components/ui/container-scroll-animation.tsx
- official-description：https://ui.aceternity.com/components/container-scroll-animation；资料核对时间：2026-10-12T07:14:24.067Z；SHA256：1ff39790ccf933178fa540b9bf8aaf76bf2600ff04ba69d2df6bdb9e5608e506；哈希对象：page-response

---

## 逐词淡入的文案 · Text Generate Effect

案例ID：d79091b2c51c9011

来源：https://ui.aceternity.com/components/text-generate-effect

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

一段文字按词依次从模糊、半透明状态显现，整个句子逐渐清晰，适合强调短文案的阅读节奏。

触发：组件挂载时依次显现；文本或参数变化可重新触发

作用层：text

### 实现方法

文本按空格切词后逐项从模糊与低透明度显现。

1. 把短文本拆为保留语义的词序列
2. 为每个词输出独立span
3. 使用stagger顺序改变opacity与filter
4. 结束后保留完整静态文本，不持续重播答案

依赖：motion、react

参数：

- 源码默认 TextGenerateEffect.filter：true
- 源码默认 TextGenerateEffect.duration：0.5

### 适用场景

- 项目适配场景：首屏说明
- 项目适配场景：品牌短文案

避免用于：

- 长答案、公式推导与频繁变化的聊天正文

### 限制与接入建议

- 源码按空格分词，中文无空格整句可能只成一项；需要项目侧中文分词或按字改造并说明。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/text-generate-effect.json；资料核对时间：2026-10-12T07:14:24.106Z；SHA256：f2a73f7adcb16395da2323b2485b2eed0c59caddcdb3b6ac2c0fadae81d1c22f；哈希对象：source-files-joined；文件：components/ui/text-generate-effect.tsx
- official-description：https://ui.aceternity.com/components/text-generate-effect；资料核对时间：2026-10-12T07:14:24.106Z；SHA256：07244c260fbacbab1205a738ef94806d8e3b189eeb9015097d7365385a6f855d；哈希对象：page-response

---

## 斜向划过的流星光条 · Meteor Effect

案例ID：6bf9770e8a58b9c1

来源：https://ui.aceternity.com/components/meteors

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

容器背景中多根短亮线带着渐隐尾迹斜向划过，位置与时长错开，形成流星雨般的持续运动。

触发：显示后自动错时循环

作用层：page-background

### 实现方法

多个短亮条配合渐隐尾迹以错开的CSS动画延迟斜向滑过容器。

1. 在限定容器内生成有限数量流星元素
2. 为位置和animationDelay分配错相值
3. 用伪元素渐变延长尾迹
4. 通过meteors关键帧平移并在边界裁切

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：宣传卡片背景
- 项目适配场景：评价区背景

避免用于：

- 不能容忍持续斜向穿行装饰的阅读区域

### 限制与接入建议

- 关键帧样式需随组件一起接入；这不是有真实物理速度的天文模拟。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/meteors.json；资料核对时间：2026-10-12T07:14:24.242Z；SHA256：f5bacbd0e30396d56d0f14b08b48b33490095221f322a00ea68a6643c468eb92；哈希对象：source-files-joined；文件：components/ui/meteors.tsx
- official-description：https://ui.aceternity.com/components/meteors；资料核对时间：2026-10-12T07:14:24.242Z；SHA256：b70983a6146fdf5f716d4f5c77816753627a102df0f80d80ec9a24ac0ed35027；哈希对象：page-response

---

## 轮流置顶的叠放卡片 · Card Stack

案例ID：68d69ca0726b91bd

来源：https://ui.aceternity.com/components/card-stack

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

几张内容卡片错位叠放，前面的卡片按时间间隔换到后面，下一张上移成为焦点，适合展示多条评价或短句。

触发：显示后按固定间隔自动轮换

作用层：layout、content

### 实现方法

定时轮换数组次序，以卡片索引驱动top、scale和zIndex形成层叠翻换。

1. 用稳定id初始化卡片序列
2. 定时把末卡移到队首
3. 根据新索引过渡top与scale并同步层级
4. 卸载清理计时器，项目接入增加暂停与手动切换

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：用户评价区
- 项目适配场景：精选引言

避免用于：

- 需要同时完整可见全部项目的清单

### 限制与接入建议

- 源码使用模块级interval并每5秒轮换，多实例需改实例ref避免串扰；不同于本地手动CardStack适配。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/card-stack.json；资料核对时间：2026-10-12T07:14:24.386Z；SHA256：7d38e4667f81ccef7e641d0ebf492f7ec5b4f3d9d154e04c9bf00a413320df9e；哈希对象：source-files-joined；文件：components/ui/card-stack.tsx
- official-description：https://ui.aceternity.com/components/card-stack；资料核对时间：2026-10-12T07:14:24.386Z；SHA256：92c6fc158916da22bc078f2ec52e524b7d28989ea9a977fd3d13d1176c03d67f；哈希对象：page-response

---

## 绕按钮一圈的流动亮边 · Moving Border

案例ID：4cd98644135d8a31

来源：https://ui.aceternity.com/components/moving-border

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

亮色光斑沿圆角按钮或容器的周边循环移动，内部文字保持稳定，利用移动边缘突出可操作目标。

触发：显示后沿边界自动循环；无需悬停

作用层：border、outer-glow

### 实现方法

逐帧沿SVG圆角矩形路径取点，将径向光斑移动到该点，内层独立遮住中部。

1. 创建尺寸匹配按钮的SVG rect路径
2. 用getTotalLength获得周长并把时间映射为路径进度
3. getPointAtLength驱动光斑x/y
4. 保持内部surface、内容与按钮语义独立于边缘层

依赖：motion、react

参数：

- 源码默认 Button.borderRadius："1.75rem"
- 源码默认 Button.Component："button"
- 源码默认 MovingBorder.duration：3000

### 适用场景

- 项目适配场景：主要行动按钮
- 项目适配场景：重点信息卡片

避免用于：

- 整页背景或要求所有表格单元都持续追光的区域

### 限制与接入建议

- 原生是沿路径移动光斑而非整面渐变旋转；duration单位毫秒，不要把3000误当秒。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/moving-border.json；资料核对时间：2026-10-12T07:14:24.414Z；SHA256：b1cf4ffc66cc3c220383fb0904d7505265bf65ebfbec2e714763114599ea8b25；哈希对象：source-files-joined；文件：components/ui/moving-border.tsx
- official-description：https://ui.aceternity.com/components/moving-border；资料核对时间：2026-10-12T07:14:24.414Z；SHA256：a8d5fd8b2abd9e6a92926b0322b2bbb13b5ce46ba1823d5a1b524ed9aa523b42；哈希对象：page-response

---

## 照亮标题的横向灯带 · Lamp

案例ID：0057fc9efa7bc781

来源：https://ui.aceternity.com/components/lamp-effect

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

深色背景中一条横向青色灯带向下投射柔光，进入视野时灯带变宽、亮度提高，标题随之向上淡入。

触发：组件进入视口时扩展灯带与标题入场

作用层：page-background、outer-glow、text

### 实现方法

两侧conic-gradient光锥与横向亮带在入场时扩宽，标题随之向上显现。

1. 创建左右相反方向的锥形渐变
2. 用遮挡层裁出水平灯带轮廓
3. 进入视口时过渡灯带宽度和亮度
4. 让标题单独完成y/opacity入场

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：章节标题
- 项目适配场景：产品首屏

避免用于：

- 浅色高密度正文或无顶部留白的工具栏

### 限制与接入建议

- 原版主要是入场扩展灯带，不能声称已经持续鼠标追踪；需要深色前后景对比。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/lamp.json；资料核对时间：2026-10-12T07:14:24.694Z；SHA256：dfbfe0609b4a9e48912ce44601e77a478b7b7b145de34a0163e124de4e86862f；哈希对象：source-files-joined；文件：components/ui/lamp.tsx
- official-description：https://ui.aceternity.com/components/lamp-effect；资料核对时间：2026-10-12T07:14:24.694Z；SHA256：8618cd660fd135bc681a9fe3f42392b44d2e7bef3575635cd2b7c9ec6c6c2de9；哈希对象：page-response

---

## 滚动联动的粘性图文讲解 · Sticky Scroll Reveal

案例ID：8cabc3e367eada43

来源：https://ui.aceternity.com/components/sticky-scroll-reveal

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

一侧排列分段说明，另一侧视觉区域固定在可见位置；滚动到不同说明时，展示图和背景色同步切换，突出当前章节。

触发：滚动容器，根据当前段落切换粘性区域内容

作用层：layout、content

### 实现方法

滚动段落改变activeCard，粘性视觉栏与背景色跟随当前段落切换。

1. 把文本和视觉项按同一数据索引组织
2. 读取局部滚动进度并匹配段落断点
3. 当前文本提高不透明度
4. sticky视觉区替换对应图像并同步背景

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：产品功能介绍
- 项目适配场景：步骤讲解

避免用于：

- 只有一段说明或必须同时比较所有图文的页面

### 限制与接入建议

- 嵌套滚动与固定高度决定断点；小屏粘性布局需改成顺序图文避免遮挡。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：根据触屏视口重算滚动段高度与位移边界；窄屏保持内容顺序，避免粘性视觉遮住阅读与操作。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：以运动值联动滚动而非每帧触发整页React重渲染；在内容尺寸变化时测量，避免滚动过程中反复强制布局。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/sticky-scroll-reveal.json；资料核对时间：2026-10-12T07:14:24.465Z；SHA256：93dc4f8da9225f1df23bcf7e2567c1267062340ea00f91e0d8ed3573f711bce5；哈希对象：source-files-joined；文件：components/ui/sticky-scroll-reveal.tsx
- official-description：https://ui.aceternity.com/components/sticky-scroll-reveal；资料核对时间：2026-10-12T07:14:24.465Z；SHA256：be506a602096aff037ab7e7776065dfe32ea8f429ef9709a0bd928d705e78343；哈希对象：page-response

---

## 上滑出现的悬浮导航 · Floating Navbar

案例ID：e1e4b5ef827d0ebd

来源：https://ui.aceternity.com/components/floating-navbar

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

紧凑的圆角导航浮在页面顶部附近；向下阅读时隐藏，向上滚动时重新出现，减少导航对内容的遮挡。

触发：页面滚动方向变化；向下隐藏，向上显示

作用层：layout

### 实现方法

比较相邻滚动进度判断方向，离开页顶后向下隐藏、向上显示顶部紧凑导航。

1. 监听scrollYProgress当前值与前值
2. 源码在进度小于0.05的页顶区隐藏，离开后向上显示、向下隐藏
3. AnimatePresence过渡导航y与opacity
4. 给内容预留安全区并保留小屏菜单入口

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：长页顶部导航
- 项目适配场景：营销页面

避免用于：

- 必须始终可见核心操作的考试或编辑页

### 限制与接入建议

- 页顶显示导航属于另行适配，原源码页顶隐藏；它由滚动方向控制而非计时闪烁，关键返回/退出不应只靠上滑出现。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：根据触屏视口重算滚动段高度与位移边界；窄屏保持内容顺序，避免粘性视觉遮住阅读与操作。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：以运动值联动滚动而非每帧触发整页React重渲染；在内容尺寸变化时测量，避免滚动过程中反复强制布局。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/floating-navbar.json；资料核对时间：2026-10-12T07:14:24.658Z；SHA256：9ab6f04dcc3bbf02d37db3478034af412e6166a3fb76f4889ca36e29cf4e558b；哈希对象：source-files-joined；文件：components/ui/floating-navbar.tsx
- official-description：https://ui.aceternity.com/components/floating-navbar；资料核对时间：2026-10-12T07:14:24.658Z；SHA256：96182725228c62053c8b3e4e04a44c8551ae25aa2ea9d5f938164bf4a70cbede；哈希对象：page-response

---

## 悬停展开的大导航菜单 · Navbar Menu

案例ID：cb2a7a424fbbca60

来源：https://ui.aceternity.com/components/navbar-menu

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

移到导航项时，下方展开较宽的内容面板，可容纳多列链接和带缩略图的项目；切换导航项时面板尺寸平滑过渡。

触发：鼠标悬停导航项展开；移出导航区域关闭

作用层：layout、content

### 实现方法

记录悬停菜单项，用共享布局在下方切换不同尺寸的内容面板。

1. 记录active菜单标识
2. 在触发项下建立绝对面板
3. 用layout过渡面板的尺寸与位置
4. 离开导航区域关闭，键盘与点击另设同等入口

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：网站主导航
- 项目适配场景：产品分类入口

避免用于：

- 只有触屏操作且无展开按钮的导航

### 限制与接入建议

- 原生hover菜单需项目侧补键盘、focus和触屏点击行为；不能仅靠鼠标访问分类。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/navbar-menu.json；资料核对时间：2026-10-12T07:14:24.793Z；SHA256：6c9650ea81a0c364eb9cd06230ced52170de240518fb9426d5e495b9b5afb2cc；哈希对象：source-files-joined；文件：components/ui/navbar-menu.tsx
- official-description：https://ui.aceternity.com/components/navbar-menu；资料核对时间：2026-10-12T07:14:24.793Z；SHA256：21843006cb71a29ec778ab8494f4fd4646493ff385ad63e98b15609a273658df；哈希对象：page-response

---

## 多种微动效按钮合集 · Tailwind CSS buttons

案例ID：051f7a3ee32ea7e5

来源：https://ui.aceternity.com/components/tailwindcss-buttons

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

同一页面展示多种按钮反馈：渐变底色、滑动文字、发光边缘、立体按压等，每个示例可以单独作为按钮样式与互动参考。

触发：不同示例分别响应悬停或按压；应按选定按钮说明实现

作用层：surface、border、text

### 实现方法

按钮合集按选定示例分别使用渐变、位移、阴影或按压样式，缓存registry只包含其中一个按钮实现。

1. 先从官方演示选择具体按钮形态
2. 使用语义button或链接承载动作
3. 在内层文字和装饰层分别定义hover/active状态
4. 复核缓存示例覆盖范围，其他变体须再取对应代码

依赖：@tabler/icons-react、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：主要按钮
- 项目适配场景：表单操作
- 项目适配场景：行动入口

避免用于：

- 同一界面混用大量不同按钮语言造成层级混乱

### 限制与接入建议

- 这是合集而非单一算法；不能把一份registry样例当成页面里所有按钮的完整实现。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/tailwindcss-buttons.json；资料核对时间：2026-10-12T07:14:24.822Z；SHA256：804df05a95ee6ff55dbbdfe7442fb39998ffa981437a23a2aebbfb913bd2fd27；哈希对象：source-files-joined；文件：components/ui/tailwindcss-buttons.tsx
- official-description：https://ui.aceternity.com/components/tailwindcss-buttons；资料核对时间：2026-10-12T07:14:24.822Z；SHA256：a5cbb5c9cfc98c3c474e5b91b1843f6623704f168371776e88efb95d4176c0be；哈希对象：page-response

---

## 在卡片之间滑动的高亮底板 · Hover Effect

案例ID：c74e90d236824b91

来源：https://ui.aceternity.com/components/card-hover-effect

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多张信息卡片共享一个高亮背景，鼠标从一张移到另一张时，高亮底板平滑滑到当前卡片，内容本身不跳动。

触发：鼠标移入各卡片；移出列表淡出高亮

作用层：surface、layout

### 实现方法

卡片组共享一个layoutId高亮底板，指针切换时底板移动到当前卡片。

1. 记录hoveredIndex
2. 在活动卡片内渲染共享布局的背景板
3. 利用layoutId完成跨卡片位置过渡
4. 移出列表淡出高亮，卡片文字保持原位

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：功能卡片组
- 项目适配场景：服务列表

避免用于：

- 每张卡片必须同时保持相同强调等级的比较表

### 限制与接入建议

- 多个卡片组的共享布局标识需隔离；高亮不是卡片本身被替换或重排。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/card-hover-effect.json；资料核对时间：2026-10-12T07:14:25.025Z；SHA256：af736705935d3cda78f5ec03d23c808ed52e881902f0d03180b194a9cf67c309；哈希对象：source-files-joined；文件：components/ui/card-hover-effect.tsx
- official-description：https://ui.aceternity.com/components/card-hover-effect；资料核对时间：2026-10-12T07:14:25.025Z；SHA256：a7e5fd367e2e77f2c5ee9b76b48739b9c42574c2efebf7a583f91ab04bef1fc5；哈希对象：page-response

---

## 滚动绘出的汇聚彩色曲线 · Google Gemini Effect

案例ID：fd9f9afee12833b6

来源：https://ui.aceternity.com/components/google-gemini-effect

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多条彩色弯曲路径从画面两侧朝中央汇聚，页面滚动时线路逐步被绘出，中央标题与按钮保持粘性定位。

触发：页面滚动驱动每条 SVG 路径的显现长度

作用层：page-background、content

### 实现方法

多条彩色SVG路径的pathLength受滚动进度驱动，粘性标题位于汇聚区域。

1. 在较高滚动段内布置固定SVG路径
2. 把滚动MotionValue分别映射到各线路径长度
3. 为彩线叠加克制的模糊底光
4. 保持sticky标题与按钮稳定且不被SVG拦截

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：产品故事区
- 项目适配场景：章节过渡

避免用于：

- 缺少足够滚动距离的短弹窗

### 限制与接入建议

- 原生需要外部提供路径进度值；不能把自动时间循环冒充滚动绘线。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/google-gemini-effect.json；资料核对时间：2026-10-12T07:14:25.057Z；SHA256：168631363d80f7c7654391273753594bcf1eb735cc9ea37909a394f3193eafe4；哈希对象：source-files-joined；文件：components/ui/google-gemini-effect.tsx
- official-description：https://ui.aceternity.com/components/google-gemini-effect；资料核对时间：2026-10-12T07:14:25.057Z；SHA256：c044234d0274eb7d0a127e5d7d6060aaca595ea7fe4878958693f3ebb24c1c8e；哈希对象：page-response

---

## 像液滴融合的展开搜索框 · Gooey Input

案例ID：7d061e0d3c0f51a1

来源：https://ui.aceternity.com/components/gooey-input

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

紧凑搜索入口展开成输入框时，图标与输入区域通过黏稠的轮廓连接，搜索图标移到分离的圆形气泡内，像一滴液体分成两部分。

触发：点击搜索入口展开并聚焦；空输入失去焦点时收回

作用层：surface、layout

### 实现方法

通过SVG黏合滤镜把紧凑入口和展开输入框连成液滴形变。

1. 建立打开和输入值状态
2. 点击入口扩展输入框并聚焦
3. 用blur与colorMatrix滤镜融合背景形状
4. 空值失焦时收拢，文字层独立不被滤镜模糊

依赖：motion、react

参数：

- 源码默认 GooeyInput.placeholder："Type to search..."
- 源码默认 GooeyInput.collapsedWidth：115
- 源码默认 GooeyInput.expandedWidth：200
- 源码默认 GooeyInput.expandedOffset：50
- 源码默认 GooeyInput.gooeyBlur：5
- 源码默认 GooeyInput.defaultValue：""
- 源码默认 GooeyInput.disabled：false

### 适用场景

- 项目适配场景：顶部搜索
- 项目适配场景：工具栏搜索

避免用于：

- 需要常驻完整可见输入框的长表单

### 限制与接入建议

- 滤镜只应作用背景形状，输入文字和焦点轮廓保持清晰；搜索结果与提交逻辑需另接。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/gooey-input.json；资料核对时间：2026-10-12T07:14:25.375Z；SHA256：4e1a126cb6b621e911c99f0fafac2efc213d16802d145ed5f71cfa84131409e2；哈希对象：source-files-joined；文件：components/ui/gooey-input.tsx
- official-description：https://ui.aceternity.com/components/gooey-input；资料核对时间：2026-10-12T07:14:25.375Z；SHA256：ff7c5c837f822f8c1402c971e448c6b02437489c367e37ccdc4fbb8835d0c37e；哈希对象：page-response

---

## 带闪烁光标的打字文字 · Typewriter Effect

案例ID：f4eb279324cbb41d

来源：https://ui.aceternity.com/components/typewriter-effect

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

文字按字符顺序逐个出现，末尾带一根闪烁光标；原站另提供平滑展开整句的变体。

触发：进入视口后开始逐字显现；光标自动闪烁

作用层：text

### 实现方法

逐字出现的标题与独立闪烁光标组成打字效果，另有平滑整句展开变体。

1. 把短文本拆成字符并保留单词分组
2. 进入视口后按顺序改变字符可见性
3. 独立设置光标循环与文本出现节奏
4. 确定使用逐字版或整句平滑版，不混写触发与参数

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：首屏标题
- 项目适配场景：欢迎文案

避免用于：

- 必须立即阅读的错误提示和推导正文

### 限制与接入建议

- 无空格中文需明确拆分规则；不要把整个答案延迟到动画结束才能读。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/typewriter-effect.json；资料核对时间：2026-10-12T07:14:25.378Z；SHA256：9954fcc8d561014f650aeee24b1dc712bcd8da4292480e2c013dc47ebdb8d112；哈希对象：source-files-joined；文件：components/ui/typewriter-effect.tsx
- official-description：https://ui.aceternity.com/components/typewriter-effect；资料核对时间：2026-10-12T07:14:25.378Z；SHA256：c7acb2fbe9ec01072e58a8125aec2b83f953d4d26623fe18aee6fb4077bbe073；哈希对象：page-response

---

## 悬停浮起各层内容的立体卡片 · 3d Card

案例ID：22fa77bef9456d26

来源：https://ui.aceternity.com/components/3d-card-effect

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

整张卡片随鼠标角度倾斜，标题、图片和按钮按不同深度向外浮起，形成各层内容分离的三维透视。

触发：鼠标进入与移动驱动倾斜和内容层升起；移出复位

作用层：surface、content

### 实现方法

局部指针位置驱动卡面rotateX/Y，内部CardItem以独立translateZ形成多层透视。

1. 用perspective容器与CardContainer记录指针位置
2. 将相对中心的x/y映射为旋转角
3. 通过上下文把hover状态传给CardItem
4. 让各Item按深度移出、离开时归零

依赖：react

参数：

- 源码默认 CardItem.Tag："div"
- 源码默认 CardItem.translateX：0
- 源码默认 CardItem.translateY：0
- 源码默认 CardItem.translateZ：0
- 源码默认 CardItem.rotateX：0
- 源码默认 CardItem.rotateY：0
- 源码默认 CardItem.rotateZ：0

### 适用场景

- 项目适配场景：作品卡片
- 项目适配场景：商品卡片

避免用于：

- 主要依赖文本选区和精确拖动的编辑器

### 限制与接入建议

- 源码用DOM transform并不依赖Motion；嵌套内容需preserve-3d，不能再由其他动画覆盖同层transform。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/3d-card.json；资料核对时间：2026-10-12T07:14:25.826Z；SHA256：ec2f994a294aa81bb10d8a4a8512e1d9d90acdccf2fb1c8eadf83874c5be34e8；哈希对象：source-files-joined；文件：components/ui/3d-card.tsx
- official-description：https://ui.aceternity.com/components/3d-card-effect；资料核对时间：2026-10-12T07:14:25.826Z；SHA256：52726d371621589c4d8b4c7e98fbf0b651c08a71f5e2a17053897d25cba43e28；哈希对象：page-response

---

## 铺满区域的图片幻灯片 · Images Slider

案例ID：f84784007ac83abf

来源：https://ui.aceternity.com/components/images-slider

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

一张图片填满展示区域，前后图片通过遮罩、透明度和缩放过渡切换；可以自动轮换，也能用键盘方向键导航。

触发：定时自动轮播；键盘左右键或外部控制切换

作用层：layout、surface

### 实现方法

全幅图片以选中索引切换，使用裁切、透明度和缩放形成背景幻灯片。

1. 预加载当前与相邻图片并处理失败
2. 按索引叠放前后两张图
3. 切换时过渡clipPath、scale与opacity
4. 将自动轮换、键盘导航和前景按钮分别管理

依赖：motion、react

参数：

- 源码默认 ImagesSlider.overlay：true
- 源码默认 ImagesSlider.autoplay：true
- 源码默认 ImagesSlider.direction："up"

### 适用场景

- 项目适配场景：首屏大图
- 项目适配场景：活动视觉区

避免用于：

- 每张图片都需逐字阅读或精确对照的资料

### 限制与接入建议

- 外部图片地址与加载状态是实际依赖；自动切换需可暂停，不能造成正文主题突然变化。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/images-slider.json；资料核对时间：2026-10-12T07:14:25.663Z；SHA256：dbc41d3dee94c121daaf44c2c58e4578d125c95f040e4fd7a8f6518b9ca64a9a；哈希对象：source-files-joined；文件：components/ui/images-slider.tsx
- official-description：https://ui.aceternity.com/components/images-slider；资料核对时间：2026-10-12T07:14:25.663Z；SHA256：43f0b56b8cbe095a9d8af942a7a984e7dd8db0a636770fec8d46a946d1208bbd；哈希对象：page-response

---

## 从鼠标进入方向滑来的遮罩 · Direction Aware Hover

案例ID：fcc264ca7f9cd840

来源：https://ui.aceternity.com/components/direction-aware-hover

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

图片卡片上的暗色遮罩和文案从鼠标进入的那一边滑进，并沿离开的方向退出，像能够感知手势方向。

触发：鼠标进入或离开卡片，检测边缘方向

作用层：surface、content

### 实现方法

将指针相对图片中心的位置归一化，判断最近边后从该边滑入遮罩文案。

1. 读取卡片矩形与进入坐标
2. 通过方向计算得到上右下左索引
3. 从对应偏移位置动画遮罩进入
4. 离开时按离开方向退出并保留原图

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：项目缩略图
- 项目适配场景：图片卡片

避免用于：

- 没有替代操作方式的移动端商品卡

### 限制与接入建议

- 方向感知基于指针事件，触屏需固定可见标题或点击展开，不能隐藏唯一操作入口。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/direction-aware-hover.json；资料核对时间：2026-10-12T07:14:25.845Z；SHA256：8667bdfa7fe1e7ae0683cea7c09ee695de84fe9632ed25ccfa85ca8801736d70；哈希对象：source-files-joined；文件：components/ui/direction-aware-hover.tsx
- official-description：https://ui.aceternity.com/components/direction-aware-hover；资料核对时间：2026-10-12T07:14:25.845Z；SHA256：405f20bf705f80ace38990c05d1e0f61ba0c6f9b34ed75f1011ee97117b1b145；哈希对象：page-response

---

## 切换时叠放展开的标签页 · Animated Tabs

案例ID：375fac205c71b6c9

来源：https://ui.aceternity.com/components/tabs

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

点击顶部标签切换内容，当前标签获得活动背景；对应内容卡片从后方叠层中升到前面，未选卡片保留层次。

触发：点击标签，活动状态与内容堆叠动画同步变化

作用层：layout、content

### 实现方法

活动标签共享高亮背景，内容卡按索引变换缩放、位置和层级形成叠放切换。

1. 维护active标签和重排后的卡片序列
2. 共享layoutId滑动标签底板
3. 将活动卡置前并过渡其余卡的缩放与位移
4. 为标签补齐键盘切换与aria关联

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：功能介绍
- 项目适配场景：产品演示区

避免用于：

- 必须同时显示全部内容的对照工作台

### 限制与接入建议

- 叠放卡片需要足够舞台高度，源码演示不等于完整Tabs无障碍行为已验证。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/tabs.json；资料核对时间：2026-10-12T07:14:25.761Z；SHA256：0d34660aeb2d49d912b1216343bf7a86edf6dc2e0eb097ad53c30068e6950a71；哈希对象：source-files-joined；文件：components/ui/tabs.tsx
- official-description：https://ui.aceternity.com/components/tabs；资料核对时间：2026-10-12T07:14:25.761Z；SHA256：b803a49cb196431a9ae44dba7c5ad0ecaf136bedb32bd26d9456ea7dbad2825a；哈希对象：page-response

---

## 滚动倾斜横移的作品首屏 · Hero Parallax

案例ID：f09fe0a41ac38e93

来源：https://ui.aceternity.com/components/hero-parallax

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多排产品截图铺成宽画廊，首屏起初带倾斜透视；向下滚动时整体扶正，不同排向相反水平方向移动并淡入。

触发：页面滚动驱动画廊旋转、平移与透明度

作用层：layout、content

### 实现方法

多排作品截图受相反方向横移和整体透视扶正共同驱动，形成滚动首屏。

1. 把产品图按多排拆分
2. scrollYProgress映射各排反向x位移
3. 独立外壳过渡rotateX/rotateZ与y
4. 在滚动后提高整体opacity并保留标题入口

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：作品展示首屏
- 项目适配场景：产品案例页

避免用于：

- 要求首屏所有功能控件始终原位的管理页面

### 限制与接入建议

- 画廊运动幅度大，需要足够滚动舞台和图片资源；不应用在实时操作面板上。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：根据触屏视口重算滚动段高度与位移边界；窄屏保持内容顺序，避免粘性视觉遮住阅读与操作。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：以运动值联动滚动而非每帧触发整页React重渲染；在内容尺寸变化时测量，避免滚动过程中反复强制布局。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/hero-parallax.json；资料核对时间：2026-10-12T07:14:25.874Z；SHA256：3e700ea48e38831f35fa7b3c7e61cc438af3ae8a6de585314a12291b4312e142；哈希对象：source-files-joined；文件：components/ui/hero-parallax.tsx
- official-description：https://ui.aceternity.com/components/hero-parallax；资料核对时间：2026-10-12T07:14:25.874Z；SHA256：ae2699874d57261f1ce35a3f581ee86203ed8bec7a5cd63ec1faf9a3b31ad33f；哈希对象：page-response

---

## 缓慢流动的彩色波带 · Wavy Background

案例ID：0dd31983b51355e4

来源：https://ui.aceternity.com/components/wavy-background

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多条半透明彩色波带在背景中弯曲流动，叠加模糊后像柔和的极光或液体，前景文字保持独立。

触发：显示后自动循环绘制波形

作用层：page-background

### 实现方法

Canvas2D逐帧采样三维噪声绘制多条彩色曲线，再模糊叠加形成流动波带。

1. 初始化画布尺寸与simplex三维噪声
2. 按x坐标采样噪声并画粗波线
3. 每帧推进噪声时间并半透明覆盖前帧
4. 前景内容独立于Canvas并在卸载时停止帧循环

依赖：react、simplex-noise

参数：

- 源码默认 WavyBackground.blur：10
- 源码默认 WavyBackground.speed："fast"
- 源码默认 WavyBackground.waveOpacity：0.5

### 适用场景

- 项目适配场景：首页首屏背景
- 项目适配场景：品牌页面

避免用于：

- 低性能设备上多处同时运行的全屏模糊背景

### 限制与接入建议

- 原生不是CSS渐变换色；源码尺寸按window并改写onresize，项目接入应改为容器观察和独立监听，避免重置画布引起闪烁。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：限制采样/粒子数量与绘制分辨率；用单个帧循环更新绘制，离屏暂停，避免每帧重设画布尺寸。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/wavy-background.json；资料核对时间：2026-10-12T07:14:26.143Z；SHA256：76b9dcfa2143c9d80c3e0c9d7f09c1dd5e3319be9e941d9192b28e0b78b2ea26；哈希对象：source-files-joined；文件：components/ui/wavy-background.tsx
- official-description：https://ui.aceternity.com/components/wavy-background；资料核对时间：2026-10-12T07:14:26.143Z；SHA256：2a8964db537b228553df3fe3b5b4050353c6684f3a00bc1e488ecede410565e8；哈希对象：page-response

---

## 移动交融的渐变色团 · Background Gradient Animation

案例ID：e23dab4240ad9cd1

来源：https://ui.aceternity.com/components/background-gradient-animation

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多团大面积模糊渐变在背景中缓慢移动和交融，形成连续变化的色彩空间；可加入响应鼠标位置的互动色团。

触发：渐变团自动运动；启用互动层时跟随鼠标

作用层：page-background

### 实现方法

多个径向色团靠独立CSS关键帧与混合滤镜交融，可增加跟随指针的色团。

1. 设置渐变与色团颜色变量
2. 各色团分别沿既定transform轨迹循环
3. 用模糊与SVG黏合滤镜融合边缘
4. interactive时让额外色团追踪局部指针

依赖：react

参数：

- 源码默认 BackgroundGradientAnimation.gradientBackgroundStart："rgb(108, 0, 162)"
- 源码默认 BackgroundGradientAnimation.gradientBackgroundEnd："rgb(0, 17, 82)"
- 源码默认 BackgroundGradientAnimation.firstColor："18, 113, 255"
- 源码默认 BackgroundGradientAnimation.secondColor："221, 74, 255"
- 源码默认 BackgroundGradientAnimation.thirdColor："100, 220, 255"
- 源码默认 BackgroundGradientAnimation.fourthColor："200, 50, 50"
- 源码默认 BackgroundGradientAnimation.fifthColor："180, 180, 50"
- 源码默认 BackgroundGradientAnimation.pointerColor："140, 100, 255"

### 适用场景

- 项目适配场景：首屏背景
- 项目适配场景：登录页背景

避免用于：

- 只允许改变某张卡边框的局部修改

### 限制与接入建议

- 源码变量写入document.body，项目侧需按实例局部化避免串色；关键帧和Tailwind配置需一并接入。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/background-gradient-animation.json；资料核对时间：2026-10-12T07:14:26.336Z；SHA256：162bb2955384e56b221a375c42f8980569888e7d0bcdac5ebbc94450ce09004e；哈希对象：source-files-joined；文件：components/ui/background-gradient-animation.tsx
- official-description：https://ui.aceternity.com/components/background-gradient-animation；资料核对时间：2026-10-12T07:14:26.336Z；SHA256：831b212eab3a4da1c50a04901392ffc09d5cd542bba8cdf04703085cfd61dca8；哈希对象：page-response

---

## 滚动打开的笔记本屏幕 · Fey.com Macbook Scroll

案例ID：534b411342eec2c2

来源：https://ui.aceternity.com/components/macbook-scroll

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

笔记本外框与屏幕从折起的透视状态逐渐展开，屏幕截图在滚动时放大并转正，形成由设备展示进入界面内容的过渡。

触发：页面滚动驱动屏幕旋转、缩放与位移

作用层：layout、surface、content

### 实现方法

滚动进度同时控制笔记本屏幕rotateX、scaleX/Y与纵向位移，键盘底座独立保持设备造型。

1. 建立长滚动舞台并读取目标进度
2. 用透视与铰链原点组织屏幕和底座
3. 分段映射屏幕旋转、横纵缩放与位移
4. 将产品截图放入屏幕面且不再叠相冲突动画

依赖：@tabler/icons-react、motion、react

参数：

- 源码默认 KBtn.backlit：true

### 适用场景

- 项目适配场景：软件产品首屏
- 项目适配场景：界面演示

避免用于：

- 短弹窗或首屏必须直接操作真实表单的区域

### 限制与接入建议

- 源码含大量键帽DOM且屏幕最终位移可达1500px；不能照搬到短容器，小屏需校准高度与截图比例。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：根据触屏视口重算滚动段高度与位移边界；窄屏保持内容顺序，避免粘性视觉遮住阅读与操作。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：以运动值联动滚动而非每帧触发整页React重渲染；在内容尺寸变化时测量，避免滚动过程中反复强制布局。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/macbook-scroll.json；资料核对时间：2026-10-12T07:14:26.488Z；SHA256：49a5f5deef177892ca107052b8a3c07ed13731335c8a527cceaef5d976e08b99；哈希对象：source-files-joined；文件：components/ui/macbook-scroll.tsx
- official-description：https://ui.aceternity.com/components/macbook-scroll；资料核对时间：2026-10-12T07:14:26.488Z；SHA256：a112269797daaef8224d947548a2dd57f71a2b5d14492e933048b6e75047b429；哈希对象：page-response

---

## 输入边缘追光的注册表单 · Label

案例ID：2e6c910c299ad581

来源：https://ui.aceternity.com/components/signup-form

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

圆角注册面板把姓名、邮箱、密码等带标签的字段纵向组织起来，输入框边缘的蓝色局部高光随鼠标移动，底部提供主要提交入口和其他登录方式示例；原站仅展示表单，没有真实登录流程。

触发：鼠标移入、移动与移出驱动输入高光；键盘聚焦显示焦点环；标签关联对应输入控件

作用层：border、surface

### 实现方法

输入框边缘的局部径向渐变随指针移动，输入内容保持普通表单语义。

1. 外壳监听局部pointer坐标
2. hover时改变渐变半径并在离开时归零
3. 将原生input放在独立内层并转发ref与属性
4. 用真实label、校验和提交状态完成表单接入

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：注册页面
- 项目适配场景：联系表单
- 项目适配场景：账号入口

避免用于：

- 用装饰状态冒充已登录或已提交成功的业务

### 限制与接入建议

- 源码仅提供视觉输入组件；注册、身份认证和数据提交需业务实现，不能从预览推断已接入。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/input.json；资料核对时间：2026-10-12T07:14:26.795Z；SHA256：07d015c40c7ea00c108df95dc80d50c52c74aafe900ec48f7ed33058ade5fe6e；哈希对象：source-files-joined；文件：components/ui/input.tsx
- official-description：https://ui.aceternity.com/components/signup-form；资料核对时间：2026-10-12T07:14:26.795Z；SHA256：1aa0a9ac1d5eb2a230f2bbf57c98ba2af02f03551385a17c4a23b61f6f82f27d；哈希对象：page-response

---

## 逐项完成的步骤加载面板 · Multi Step Loader

案例ID：3eb6952087f35f75

来源：https://ui.aceternity.com/components/multi-step-loader

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

任务处理中显示多行步骤，当前步骤与已完成步骤使用不同透明度和勾选状态，进度按时间推进，形成明确的处理过程。

触发：开启加载状态后按设定时间推进；关闭时收起

作用层：content、layout

### 实现方法

加载覆盖层按活动索引依次高亮步骤并把已完成项转为勾选。

1. 传入有明确顺序的步骤数组
2. loading时显示遮罩与步骤视口
3. 按真实进度或明确标记的演示计时更新currentState
4. 结束时收起并恢复原页面焦点

依赖：motion、react

参数：

- 源码默认 MultiStepLoader.duration：2000
- 源码默认 MultiStepLoader.loop：true

### 适用场景

- 项目适配场景：长任务等待页
- 项目适配场景：内容生成流程

避免用于：

- 无法预测进度却显示虚假逐项完成的任务

### 限制与接入建议

- 源码按定时器推进并非真实后台进度；接入真实任务时须由任务状态驱动，不能伪装为已完成。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/multi-step-loader.json；资料核对时间：2026-10-12T07:14:26.758Z；SHA256：12abf9ff2c8b8893c57e85e9bee90b8eb2850b512aa1a150cdf38b00149a3d27；哈希对象：source-files-joined；文件：components/ui/multi-step-loader.tsx
- official-description：https://ui.aceternity.com/components/multi-step-loader；资料核对时间：2026-10-12T07:14:26.758Z；SHA256：f7a1f9bcf0a787f44c24600b252c484d69921c45ca0434ae7d6aa60ed0d2326c；哈希对象：page-response

---

## 带飞行弧线的旋转地球 · Globe

案例ID：80314cdc202c35c9

来源：https://ui.aceternity.com/components/github-globe

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

立体地球表面叠加从地点间升起的弧线、点和扩散圆环，缓慢旋转展示全球连接；用户可拖动查看角度。

触发：显示后自动旋转与弧线动画；可通过指针拖动旋转

作用层：content、page-background

### 实现方法

ThreeGlobe在三维球面绘制地点弧线、点和扩散环，并由OrbitControls管理视角。

1. 初始化Three/Fiber场景与球体参数
2. 把地点经纬度映射为弧线、点和环数据
3. 按分组周期触发扩散环并调整相机
4. 在容器卸载时释放场景与监听

依赖：@react-three/drei、@react-three/fiber、react、three、three-globe

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：全球业务介绍
- 项目适配场景：分布网络展示

避免用于：

- 低端手机上多个地球同时运行的仪表盘

### 限制与接入建议

- Three生态版本需兼容，数据经纬度与透明度影响结果；动画连接不代表真实网络或航班数据。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：限制Canvas数量和设备像素比，离屏或后台暂停帧循环，卸载释放几何、材质、纹理与监听；WebGL失败回退静态画面。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/data/globe.json，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/globe.json；资料核对时间：2026-10-12T07:14:27.064Z；SHA256：f1c4370796ff294abd9be6169a5642ed710347e5ecba121da498459ce4db7e2b；哈希对象：source-files-joined；文件：components/ui/globe.tsx
- official-description：https://ui.aceternity.com/components/github-globe；资料核对时间：2026-10-12T07:14:27.064Z；SHA256：780ab1cd78a3f0d681e365a782a5de32981cd6193f57dc2f1c195d43a6c9269f；哈希对象：page-response

---

## 柔和漂移的极光底色 · Aurora Background

案例ID：1a605e0e28035a21

来源：https://ui.aceternity.com/components/aurora-background

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

大面积半透明渐变亮带缓慢漂移，通过模糊和遮罩形成类似北极光的柔和背景，适合让浅色或深色内容区具有空气感。

触发：显示后背景位置自动循环移动

作用层：page-background

### 实现方法

大尺寸重复渐变经模糊、反色和径向遮罩叠加，通过CSS动画缓慢漂移形成极光。

1. 独立背景伪元素组合多层渐变
2. 设大于容器的背景尺寸与模糊
3. 按aurora关键帧改变background-position
4. 用遮罩弱化边缘并让内容置于上层

依赖：react

参数：

- 源码默认 AuroraBackground.showRadialGradient：true

### 适用场景

- 项目适配场景：首屏底色
- 项目适配场景：品牌内容区

避免用于：

- 只能修改按钮边缘而不允许影响背景的需求

### 限制与接入建议

- 需携带关键帧和样式变量；它是背景材质，不应直接覆盖正文或当作边框流光。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/aurora-background.json；资料核对时间：2026-10-12T07:14:26.942Z；SHA256：6b40cb23961819bb3619e61cbf971990c797133a29e767814fb5d578d1d83f3c；哈希对象：source-files-joined；文件：components/ui/aurora-background.tsx
- official-description：https://ui.aceternity.com/components/aurora-background；资料核对时间：2026-10-12T07:14:26.942Z；SHA256：68146caf97e7396d1d7aa0ff9fc7f1a28cbf0d316ff53910a61031844e8c79a6；哈希对象：page-response

---

## 悬停从中心扩散的点阵 · Canvas Reveal Effect

案例ID：403a69cb5c5c1591

来源：https://ui.aceternity.com/components/canvas-reveal-effect

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

深色卡片平时简洁，悬停后彩色点阵从中心向四周扩散显现，标题与图标同步变化，移出后恢复原始状态。

触发：鼠标悬停卡片开启点阵揭示；移出收起

作用层：surface、page-background

### 实现方法

WebGL点阵着色器以距离中心和时间的阈值扩散显现颜色与透明度。

1. 建立Fiber Canvas及ShaderMaterial
2. 用网格坐标计算每点颜色与opacity
3. 根据距中心距离设置显现时差
4. 由外部卡片hover控制Canvas挂载或可见状态

依赖：@react-three/fiber、react、three

参数：

- 源码默认 CanvasRevealEffect.animationSpeed：0.4
- 源码默认 CanvasRevealEffect.opacities：[0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
- 源码默认 CanvasRevealEffect.colors：[[0, 255, 255]]
- 源码默认 CanvasRevealEffect.showGradient：true

### 适用场景

- 项目适配场景：功能卡片
- 项目适配场景：团队卡片

避免用于：

- 所有卡片都持续挂载高分辨率点阵的长列表

### 限制与接入建议

- 组件自身负责点阵shader，hover开关来自外层演示；WebGL失败须有静态替代。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：限制Canvas数量和设备像素比，离屏或后台暂停帧循环，卸载释放几何、材质、纹理与监听；WebGL失败回退静态画面。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/canvas-reveal-effect.json；资料核对时间：2026-10-12T07:14:27.355Z；SHA256：7d49ce5826dc2b9a20439778c62bb6cf15547fd7472baa4d57de25eea2d40692；哈希对象：source-files-joined；文件：components/ui/canvas-reveal-effect.tsx
- official-description：https://ui.aceternity.com/components/canvas-reveal-effect；资料核对时间：2026-10-12T07:14:27.355Z；SHA256：d6316b42bdc984278737f5886848f9f28895fd81427f02d6319854cdee11e4cd；哈希对象：page-response

---

## 悬停扩展的渐变亮边 · Hover Border Gradient

案例ID：1308b95cc6b190d9

来源：https://ui.aceternity.com/components/hover-border-gradient

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

按钮边缘的局部渐变亮区沿边界缓慢转动，悬停时亮区扩大为覆盖整个边缘的光晕，强调按钮可操作性。

触发：自动边缘渐变变化；鼠标悬停扩大高光

作用层：border、outer-glow

### 实现方法

四个方向的径向亮区按间隔切换，hover时暂停方位循环并扩展为完整高光。

1. 为TOP/LEFT/BOTTOM/RIGHT配置不同渐变中心
2. 非hover时由计时器轮换方向
3. hover切换到宽范围highlight渐变
4. 用内层实色内容遮住中心并保留边缘

依赖：motion、react

参数：

- 源码默认 HoverBorderGradient.Tag："button"
- 源码默认 HoverBorderGradient.duration：1
- 源码默认 HoverBorderGradient.clockwise：true

### 适用场景

- 项目适配场景：行动按钮
- 项目适配场景：胶囊标签

避免用于：

- 要求精确一颗光点连续绕轮廓运动的需求

### 限制与接入建议

- 这不是MovingBorder的沿路径逐帧光斑；它在方向渐变间过渡，duration以秒控制轮换间隔。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/hover-border-gradient.json；资料核对时间：2026-10-12T07:14:27.315Z；SHA256：587453eb0ab551fe3ac444ea017d4e9620a212ef5dde20dd943619db5850d0a7；哈希对象：source-files-joined；文件：components/ui/hover-border-gradient.tsx
- official-description：https://ui.aceternity.com/components/hover-border-gradient；资料核对时间：2026-10-12T07:14:27.315Z；SHA256：ceecfac42932a0875fab65e662f6e974d8ad6f70d607e7eed74e54cedc8e9c22；哈希对象：page-response

---

## 带荧光笔重点句的点阵首屏 · Hero Highlight

案例ID：2211687be0aa3815

来源：https://ui.aceternity.com/components/hero-highlight

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

标题放在浅点阵背景前，悬停时背景点阵改变密度或颜色；重点词句下方铺开彩色渐变高亮，像荧光笔划过。

触发：悬停切换背景点阵；高亮组件显示时横向展开

作用层：page-background、text

### 实现方法

两层不同颜色的点阵背景以指针遮罩切换，Highlight词组另用渐变背景扩展。

1. 给容器设置普通点阵底纹
2. 记录局部指针位置生成径向mask
3. hover时显示强调色点阵层
4. 重点词使用独立渐变条而非改变全部文字背景

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：首页首屏标题
- 项目适配场景：重点文案

避免用于：

- 密集公式或严肃长文的每个句子都带高亮动画

### 限制与接入建议

- 点阵追踪与荧光重点句是两个组件机制；不能把局部高亮扩展到整篇正文。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/hero-highlight.json；资料核对时间：2026-10-12T07:14:27.404Z；SHA256：22ba0ea6a206dfef79d266c296eac3d542df6cbfa1378a977d4986b00f575616；哈希对象：source-files-joined；文件：components/ui/hero-highlight.tsx
- official-description：https://ui.aceternity.com/components/hero-highlight；资料核对时间：2026-10-12T07:14:27.404Z；SHA256：ff0601f0e423a2c30cfa5c412aeb5af6d4f847b6811fa87eadc66cfc00ed8852；哈希对象：page-response

---

## 汇成旋涡的发光粒子 · Vortex Background

案例ID：8a6b4d63d9ac322e

来源：https://ui.aceternity.com/components/vortex

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

大量发光粒子沿弯曲轨迹流动，叠成有深度的彩色旋涡，背景持续运动，前景内容不跟着旋转。

触发：显示后自动绘制粒子轨迹

作用层：page-background

### 实现方法

Canvas噪声粒子按角度和寿命推进，离屏画布叠加发光后绘制旋涡流场。

1. 初始化粒子位置、速度、色相和寿命数组
2. 每帧按噪声场更新角度与位移
3. 在缓冲画布画粒子轨迹后叠加模糊辉光
4. 粒子寿命结束后重生并管理帧循环

依赖：motion、react、simplex-noise

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：行动区背景
- 项目适配场景：创意首屏

避免用于：

- 长时阅读和低性能设备的多重全屏画布

### 限制与接入建议

- 粒子与多次模糊合成开销较高，数量与分辨率需实测；只是装饰流场，不是物理模拟。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：限制采样/粒子数量与绘制分辨率；用单个帧循环更新绘制，离屏暂停，避免每帧重设画布尺寸。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/vortex.json；资料核对时间：2026-10-12T07:14:27.475Z；SHA256：bcd5dbeee17f5124b3a07aa3de29c44e96188778c5a53d82e3523eb0495e38bf；哈希对象：source-files-joined；文件：components/ui/vortex.tsx
- official-description：https://ui.aceternity.com/components/vortex；资料核对时间：2026-10-12T07:14:27.475Z；SHA256：dac105f5669d33e6667a34b42d5cd93787fa181e9f3a7b31f8f38f393f8f075a；哈希对象：page-response

---

## 跟着鼠标轻晃的内容卡片 · Wobble Card

案例ID：b7207ef1c3bd5309

来源：https://ui.aceternity.com/components/wobble-card

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

鼠标进入后整张卡片轻微向指针方向平移和缩放，内部内容产生反向位移，形成柔软的晃动与深度感。

触发：鼠标在卡片内移动；移出平滑复位

作用层：surface、content

### 实现方法

卡面向指针方向轻移并放大，内部内容作反向位移产生柔软视差。

1. 计算指针相对卡片中心的偏移
2. 外层Motion容器应用缩放与偏移
3. 内层按较小反向幅度移动
4. 移出时两层分别弹性归位

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：功能卡片
- 项目适配场景：产品展示卡片

避免用于：

- 需要固定坐标进行拖拽或标注的画布

### 限制与接入建议

- 只能在同一层使用一套transform来源，不能与另一个倾斜组件共同覆盖它。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/wobble-card.json；资料核对时间：2026-10-12T07:14:27.526Z；SHA256：e044c7bc932752221b9e6c724cf304495a26376da27316c1a53fc0d207133516；哈希对象：source-files-joined；文件：components/ui/wobble-card.tsx
- official-description：https://ui.aceternity.com/components/wobble-card；资料核对时间：2026-10-12T07:14:27.526Z；SHA256：06e138a8cda8e9a40c82420763d47dc62c40be8b4a86f65d90f39ea6a4d64c6f；哈希对象：page-response

---

## 提交时碎成粒子的输入文字 · Placeholders And Vanish Input

案例ID：4dde8b706a477af2

来源：https://ui.aceternity.com/components/placeholders-and-vanish-input

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

输入框的提示语自动轮换；输入并提交后，当前文字被采样成小点，逐渐向外散开消失，再恢复可输入状态。

触发：提示语定时轮换；按回车或点击提交触发消散

作用层：text、content

### 实现方法

提交时把输入文字绘到Canvas采样为像素点，再逐步扰动淡出，提示语单独定时轮换。

1. 独立管理输入值与轮换placeholder
2. 提交前把当前文字按字体绘到画布
3. 采样非透明像素形成粒子数组
4. 粒子消散完成后恢复输入并交给真实提交逻辑

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：搜索输入
- 项目适配场景：问题提交
- 项目适配场景：创意工具入口

避免用于：

- 需要保留可编辑原文或敏感信息回查的表单

### 限制与接入建议

- 视觉消失不是数据已提交；长文本采样成本高，不能清掉失败后需要恢复的用户输入。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：限制采样/粒子数量与绘制分辨率；用单个帧循环更新绘制，离屏暂停，避免每帧重设画布尺寸。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/placeholders-and-vanish-input.json；资料核对时间：2026-10-12T07:14:27.715Z；SHA256：0decb6b2f53e2896b784c0e3fedeaf8fdec60aa5cd3d4bcdea72a6d6d6d27e3d；哈希对象：source-files-joined；文件：components/ui/placeholders-and-vanish-input.tsx
- official-description：https://ui.aceternity.com/components/placeholders-and-vanish-input；资料核对时间：2026-10-12T07:14:27.715Z；SHA256：ab8500b9fe1a8bf99c406f38b12c997d3aaa7811130bf26f5d539cc453357efe；哈希对象：page-response

---

## 在句子里轮换的关键词 · Flip Words

案例ID：7a032d2b3d2a1208

来源：https://ui.aceternity.com/components/flip-words

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

句子中的一个词按时间间隔替换，旧词分散淡出，新词逐字浮入，其余句子保持稳定。

触发：显示后按间隔自动轮换关键词

作用层：text

### 实现方法

定时切换词索引，旧词退出、新词的字符按stagger进入，其余句子不重排重播。

1. 为轮换词建立稳定索引和切换计时器
2. 旧词通过AnimatePresence退出
3. 新词拆为字符并错相显现
4. 保留周围句子与容器占位避免明显跳动

依赖：motion、react

参数：

- 源码默认 FlipWords.duration：3000

### 适用场景

- 项目适配场景：首屏标题
- 项目适配场景：卖点短句

避免用于：

- 承载唯一价格、状态或法律含义的动态词语

### 限制与接入建议

- 切换关键词不等于全文打字；长短差异大的词要测试换行与可访问的稳定文本。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/flip-words.json；资料核对时间：2026-10-12T07:14:27.792Z；SHA256：5fccf682bd6e999104a2d52fcec126c5f1acc8097b4eab4e874d01ff93bfa635；哈希对象：source-files-joined；文件：components/ui/flip-words.tsx
- official-description：https://ui.aceternity.com/components/flip-words；资料核对时间：2026-10-12T07:14:27.792Z；SHA256：a445b6c37adbac7744dd8af70d3a646afaf4a470330b10173bff9f65ae0b4f42；哈希对象：page-response

---

## 悬停网页链接的小预览 · Link Preview

案例ID：e5286e718e574d50

来源：https://ui.aceternity.com/components/link-preview

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

普通文字链接在悬停或聚焦时弹出目标网页的缩略图浮层，浮层有入场缩放并轻微跟随鼠标；可使用自定义预览图。

触发：悬停或键盘聚焦链接显示；移开关闭

作用层：content

### 实现方法

HoverCard展示目标链接的缩略图，并根据指针位置轻微偏移预览浮层。

1. 建立链接触发和悬停浮层
2. 使用自定义图片或明确的截图服务构造缩略图
3. 指针偏移经弹簧映射为浮层x
4. 链接点击仍打开真实目标并处理图片失败

依赖：@radix-ui/react-hover-card、motion、qss、react

参数：

- 源码默认 LinkPreview.width：200
- 源码默认 LinkPreview.height：125
- 源码默认 LinkPreview.quality：50
- 源码默认 LinkPreview.layout："fixed"
- 源码默认 LinkPreview.isStatic：false
- 源码默认 LinkPreview.imageSrc：""

### 适用场景

- 项目适配场景：文章正文链接
- 项目适配场景：资源推荐

避免用于：

- 不能向外部截图服务暴露目标网址的私有链接

### 限制与接入建议

- 默认截图服务可能有外部网络、隐私和额度限制；不能保证任意站点可截图，优先本地自定义封面。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/link-preview.json；资料核对时间：2026-10-12T07:14:27.794Z；SHA256：c140609b59685342ed3b62bf7d5d90ac5ca099ed90fbb7cda1fe6c2dedd46475；哈希对象：source-files-joined；文件：components/ui/link-preview.tsx
- official-description：https://ui.aceternity.com/components/link-preview；资料核对时间：2026-10-12T07:14:27.794Z；SHA256：8f07f1293419587a57239af40f85a5600c9e261e46c2b76c8b2208d70b0a0caf；哈希对象：page-response

---

## 随角度移动的全息反光卡片 · Glare Card

案例ID：58e3f39b1432f6f2

来源：https://ui.aceternity.com/components/glare-card

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

卡片随鼠标位置倾斜，表面叠加彩色条纹与亮面反射，反光位置一起移动，类似覆有全息膜的收藏卡。

触发：鼠标在卡片上移动改变透视与反光；移出复位

作用层：surface、outer-glow

### 实现方法

指针位置同时驱动卡面透视、径向反光和全息纹理的背景坐标。

1. 归一化局部指针并计算倾角
2. 把倾角与反光位置写入CSS变量
3. 叠加全息纹理和混合渐变层
4. 离开后降低反射强度并归位卡面

依赖：react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：创意卡片
- 项目适配场景：会员展示
- 项目适配场景：作品封面

避免用于：

- 需要精确颜色或图像真实性判断的内容

### 限制与接入建议

- 需要复杂混合与mask样式；反光不代表真实材质物理渲染，内容与装饰需分层。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/glare-card.json；资料核对时间：2026-10-12T07:14:27.853Z；SHA256：264882cf22d8033675100a332faab0d7e71b318ee9fb9276112ca4df02bcfe19；哈希对象：source-files-joined；文件：components/ui/glare-card.tsx
- official-description：https://ui.aceternity.com/components/glare-card；资料核对时间：2026-10-12T07:14:27.853Z；SHA256：b7dd4f26f990ae15773fdcb5a4a173c77ae05dd98d590a6a59e4586e9867ef02；哈希对象：page-response

---

## 带景深过渡的弹窗 · Animated Modal

案例ID：f6b5fb5e2cf9261b

来源：https://ui.aceternity.com/components/animated-modal

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

点击入口后，背景被半透明遮罩覆盖，内容弹窗以缩放、位移和模糊过渡进入；点击关闭按钮或外部区域可退出。

触发：点击入口打开；点击关闭或外部区域关闭

作用层：layout、content

### 实现方法

状态控制遮罩和弹窗的AnimatePresence入退场，弹窗以缩放、位移与模糊进入。

1. 由触发器设置modal open状态
2. 独立绘制背景遮罩与内容层
3. 为初始、进入和退出配置几何与透明度
4. 关闭时清理滚动锁并恢复触发焦点

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：详情弹窗
- 项目适配场景：确认操作
- 项目适配场景：预约表单

避免用于：

- 缺少关闭入口或无法键盘操作的强制弹窗

### 限制与接入建议

- 焦点锁定、Escape关闭和滚动恢复需项目接入核对；动画不能阻止立即退出。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/animated-modal.json；资料核对时间：2026-10-12T07:14:27.973Z；SHA256：9d4166aa1229b45725c62bbde513a7198639df9365253c9e7be604b00bf1ea20；哈希对象：source-files-joined；文件：components/ui/animated-modal.tsx
- official-description：https://ui.aceternity.com/components/animated-modal；资料核对时间：2026-10-12T07:14:27.973Z；SHA256：eec0b91ad65878ce681e79859c1742e078a9f0295ba66b8e1b797bd28530daa0；哈希对象：page-response

---

## 点击展开详情的大卡片轮播 · Apple Cards Carousel

案例ID：541e51945da2a57f

来源：https://ui.aceternity.com/components/apple-cards-carousel

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

横向排列大尺寸图片卡片，用箭头浏览更多项目；点击某张卡片后展开为覆盖页面的详情层，保留封面与标题。

触发：点击箭头或横向滚动浏览；点击卡片展开；关闭回列表

作用层：layout、content

### 实现方法

横向卡片轨道配合共享布局详情层，卡片展开后沿用封面与标题的空间位置。

1. 用可横向滚动的轨道与前后箭头浏览
2. 点击卡片记录活动项并打开详情
3. 共享layoutId过渡封面与标题
4. 关闭后回到原卡片和对应滚动位置

依赖：@tabler/icons-react、motion、next、react

参数：

- 源码默认 Carousel.initialScroll：0
- 源码默认 Card.layout：false

### 适用场景

- 项目适配场景：产品功能区
- 项目适配场景：故事与案例

避免用于：

- 要求同时比较所有详情的密集数据页

### 限制与接入建议

- 大图需要预加载与尺寸占位；详情焦点管理和键盘关闭不能因动画省略。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/hooks/use-outside-click、@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/apple-cards-carousel.json；资料核对时间：2026-10-12T07:14:28.261Z；SHA256：a9a498aa5832eb71b53f09fc65c16c4758503e38bf0d3f0bf97a6ccdfda5ecfe；哈希对象：source-files-joined；文件：components/ui/apple-cards-carousel.tsx、hooks/use-outside-click.tsx
- official-description：https://ui.aceternity.com/components/apple-cards-carousel；资料核对时间：2026-10-12T07:14:28.261Z；SHA256：1b09d7614d96cf55cd808ecc34b36bbb5045b8a1389ae1d3215939293dffb8c9；哈希对象：page-response

---

## 疏密可调的闪烁星空 · Stars Background

案例ID：04caedaf6df871a4

来源：https://ui.aceternity.com/components/shooting-stars-and-stars-background

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

深色区域内散布不同大小与亮度的星点，部分星点轻微明暗变化，形成安静的夜空；可和独立流星层组合。

触发：显示后自动绘制星点；启用闪烁时亮度循环变化

作用层：page-background

### 实现方法

官方组合演示包含Canvas闪烁星点底层与独立ShootingStars流星；本条安静星空行为主要对应StarsBackground。

1. 根据区域面积与starDensity生成星点
2. 为星点分配透明度和twinkleSpeed
3. 逐帧更新Canvas星点明暗
4. 如另需流星再挂独立随机边缘轨迹层，不强制添加

依赖：react

参数：

- 源码默认 StarsBackground.starDensity：0.00015
- 源码默认 StarsBackground.allStarsTwinkle：true
- 源码默认 StarsBackground.twinkleProbability：0.7
- 源码默认 StarsBackground.minTwinkleSpeed：0.5
- 源码默认 StarsBackground.maxTwinkleSpeed：1

### 适用场景

- 项目适配场景：首屏背景
- 项目适配场景：夜空主题页

避免用于：

- 要求完全静态、无任何亮度变化的背景

### 限制与接入建议

- 缓存同时包含StarsBackground与ShootingStars源码；星点闪烁和流星轨迹是不同机制，避免因合并文档名称混用。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：限制采样/粒子数量与绘制分辨率；用单个帧循环更新绘制，离屏暂停，避免每帧重设画布尺寸。

目录来源为星空与流星的合并文档，此条按StarsBackground星点行为整理，流星是另一独立组件。依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/stars-background.json；资料核对时间：2026-10-12T07:14:28.644Z；SHA256：82801c3eb4f966e6e31a6c24ab629137e7e6db14dfcc142553ccc33821fde3c6；哈希对象：source-files-joined；文件：components/ui/stars-background.tsx
- official-description：https://ui.aceternity.com/components/shooting-stars-and-stars-background；资料核对时间：2026-10-12T07:14:28.644Z；SHA256：e41af7c1e536205523e0f72a43da5c56c030048704d638d271e72c2deb8123f0；哈希对象：page-response

---

## 可拖动的前后图片对比 · Compare

案例ID：54adf8a98e125842

来源：https://ui.aceternity.com/components/compare

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

两张图片叠在同一框内，一条分界线控制各自可见区域；拖动或移动指针可以擦开另一张图，比较前后差异。

触发：根据配置拖动分界或悬停移动；支持自动来回展示

作用层：content、surface

### 实现方法

前后图片叠放，用分界位置控制上图裁切宽度并联动分隔线。

1. 让两张图以相同尺寸和object-fit对齐
2. 读取拖动或hover产生的横向比例
3. clip-path裁出上图对应区域
4. 把手柄位置与比例同步并提供键盘调整

依赖：@tabler/icons-react、motion、react

参数：

- 源码默认 Compare.firstImage：""
- 源码默认 Compare.secondImage：""
- 源码默认 Compare.initialSliderPercentage：50
- 源码默认 Compare.slideMode："hover"
- 源码默认 Compare.showHandlebar：true
- 源码默认 Compare.autoplay：false
- 源码默认 Compare.autoplayDuration：5000

### 适用场景

- 项目适配场景：前后效果对比
- 项目适配场景：修图展示
- 项目适配场景：产品演示

避免用于：

- 没有相同画面基准的图片优劣判断

### 限制与接入建议

- 两图裁切和对齐不一致会产生虚假差异；对比图需有同一视角和明确标签。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/components/ui/sparkles、@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/compare.json；资料核对时间：2026-10-12T07:14:28.441Z；SHA256：fd0801ffcb425cf02693aa7c9db752050d3e2aac2766a2bd8a0f4cb64fc16c08；哈希对象：source-files-joined；文件：components/ui/compare.tsx
- official-description：https://ui.aceternity.com/components/compare；资料核对时间：2026-10-12T07:14:28.441Z；SHA256：3ac58348de8d7fefac8a5b4f09311df137ec63c12507ab31f3dbddd5b585783c；哈希对象：page-response

---

## 鼠标位置决定的卡片聚光 · Card Spotlight

案例ID：d555c8fc1f5972ba

来源：https://ui.aceternity.com/components/card-spotlight

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

卡片内出现圆形柔光，高光位置跟随指针；星点或颜色只在光照范围内清晰显现，其他区域保持较暗。

触发：鼠标移入并在卡片中移动；移出淡出

作用层：surface、outer-glow

### 实现方法

局部径向mask跟随指针，只有圆形光照范围内的点阵与颜色增强。

1. 记录卡片内的mouseX/Y
2. 构造有限半径的radial-gradient mask
3. 让点阵或颜色层受mask约束
4. 前景文字在独立层保持完整可读

依赖：@react-three/fiber、motion、react、three

参数：

- 源码默认 CardSpotlight.radius：350
- 源码默认 CardSpotlight.color："#262626"
- 源码默认 CanvasRevealEffect.animationSpeed：0.4
- 源码默认 CanvasRevealEffect.opacities：[0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
- 源码默认 CanvasRevealEffect.colors：[[0, 255, 255]]
- 源码默认 CanvasRevealEffect.showGradient：true

### 适用场景

- 项目适配场景：服务卡片
- 项目适配场景：重点功能卡片

避免用于：

- 必须无人操作也出现持续主动画的首屏

### 限制与接入建议

- 它是局部surface聚光，不是边框追踪；光照层不能覆盖或阻断正文按钮。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：限制Canvas数量和设备像素比，离屏或后台暂停帧循环，卸载释放几何、材质、纹理与监听；WebGL失败回退静态画面。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/components/ui/canvas-reveal-effect、@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/card-spotlight.json；资料核对时间：2026-10-12T07:14:28.649Z；SHA256：acf15b7de638d214c30dd112475a90c8801ea821b97803e4f2e9cebab3b5ad4c；哈希对象：source-files-joined；文件：components/ui/card-spotlight.tsx、components/ui/canvas-reveal-effect.tsx
- official-description：https://ui.aceternity.com/components/card-spotlight；资料核对时间：2026-10-12T07:14:28.649Z；SHA256：1f0c3f98846617fa5738927b1bd7344f96d9ccf44c06d07a0177d08123693f5d；哈希对象：page-response

---

## 悬停加速的光速文字框 · Cover

案例ID：d2ddfc7d07175a9a

来源：https://ui.aceternity.com/components/container-cover

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

重点词句被框在深色容器里，星点与光束在周围流动；悬停后光束加快，形成像穿越星空的速度感。

触发：平时光束自动运动；鼠标悬停切换到快速状态

作用层：surface、text

### 实现方法

文字框内星点与横向光束按不同速度流动，hover时进入更快的穿越状态。

1. 在重点文字外建立裁切框
2. 生成点与光束装饰层
3. hover状态改变光束的运动速度或持续时间
4. 离开恢复普通速度，重点词本身保持可读

依赖：@tsparticles/engine、@tsparticles/react、@tsparticles/slim、motion、react

参数：

- 源码默认 Beam.width：600

### 适用场景

- 项目适配场景：首屏关键词
- 项目适配场景：速度或性能卖点

避免用于：

- 长篇说明或公式段落的整块文字背景

### 限制与接入建议

- 速度变化是局部强调，不应包裹长段正文；不得因高速装饰制造闪烁阅读障碍。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/components/ui/sparkles、@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/cover.json；资料核对时间：2026-10-12T07:14:29.111Z；SHA256：37f34a450b2f0a394cb2ccc91947e615b4920463f33540bbd58c000b95e488f5；哈希对象：source-files-joined；文件：components/ui/cover.tsx、components/ui/sparkles.tsx
- official-description：https://ui.aceternity.com/components/container-cover；资料核对时间：2026-10-12T07:14:29.111Z；SHA256：bd5399fbb43a4828baacba449e92da1f4cf352a1ebd0688150d4edb0f1c29a47；哈希对象：page-response

---

## 带轻微立体反馈的上传区 · File Upload

案例ID：5c2c6c0babb93485

来源：https://ui.aceternity.com/components/file-upload

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

虚线或点阵上传区域支持点击选文件和拖入文件；悬停时中央文件图标抬起，选中文件后出现文件名、类型与大小卡片。

触发：点击选择或拖放文件；悬停展示图标反馈

作用层：content、layout

### 实现方法

文件输入与拖放区域共享选中文件状态，图标与文件卡用共享布局轻微抬起展开。

1. 点击区域触发原生file input
2. 用dropzone处理拖入与文件列表
3. 选中后按文件名、类型、大小渲染卡片
4. 把真实上传、进度、失败和取消交给业务服务

依赖：@tabler/icons-react、motion、react、react-dropzone

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：文件提交表单
- 项目适配场景：素材导入

避免用于：

- 未校验就接收任意文件或要求真实云存储已接入的场景

### 限制与接入建议

- 示例只选文件并不自动上传服务器，必须校验类型/大小；不能把本地预览说成已上传。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/file-upload.json；资料核对时间：2026-10-12T07:14:28.932Z；SHA256：04c24106950be495496e801ef5093529c935c5fa12d03d30f9a009f0d8adc622；哈希对象：source-files-joined；文件：components/ui/file-upload.tsx
- official-description：https://ui.aceternity.com/components/file-upload；资料核对时间：2026-10-12T07:14:28.932Z；SHA256：13707b708aac67a781f84cccc2ae714eb1243e984e0f5ca36b38ddac6cd08415；哈希对象：page-response

---

## 鼠标经过时放大的图标导航 · Floating Dock

案例ID：2aefe0b037d88f85

来源：https://ui.aceternity.com/components/floating-dock

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

一排图标置于圆角底座中，鼠标靠近时当前位置和邻近图标逐渐放大，并显示对应名称，类似桌面系统的 Dock。

触发：鼠标在图标栏上移动驱动邻近图标大小；悬停提示名称

作用层：layout、content

### 实现方法

图标尺寸由指针与各图标中心的距离映射，经弹簧形成连续放大波。

1. 记录Dock整体指针x位置
2. 每个图标测中心并计算距离
3. 用距离映射宽高再经spring平滑
4. hover显示标签，移动端改为按钮展开列表

依赖：@tabler/icons-react、motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：工具导航
- 项目适配场景：作品集快捷入口

避免用于：

- 靠近屏幕底部且不能留放大空间的紧凑工具栏

### 限制与接入建议

- 连续放大会改变占用空间，需要预留高度；图标名称和导航语义不能只依赖hover。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/floating-dock.json；资料核对时间：2026-10-12T07:14:29.117Z；SHA256：e6e4d163f11dd13135cf7ce08f3801ee91a81dbb75ccc9e0df51154cdd602919；哈希对象：source-files-joined；文件：components/ui/floating-dock.tsx
- official-description：https://ui.aceternity.com/components/floating-dock；资料核对时间：2026-10-12T07:14:29.117Z；SHA256：2367072774c3ff19d3ad96984592f95312932db75e67d424e9c850897eb3cfac；哈希对象：page-response

---

## 悬停聚焦其余模糊的图片组 · Focus Cards

案例ID：be7c56d8a58d84cd

来源：https://ui.aceternity.com/components/focus-cards

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多张图片卡片并排展示，鼠标停在一张上时它保持清晰，其余卡片变模糊并稍微缩小，当前卡片标题浮现。

触发：悬停某卡片开启聚焦；移出卡片组恢复

作用层：surface、content

### 实现方法

hover索引决定当前图片保持清晰，其他图片模糊并缩小，当前标题浮出。

1. 记录当前悬停卡片索引
2. 按active与other两种状态设置blur/scale
3. 当前卡片标题过渡opacity/y
4. 离开组恢复全清晰并保留触屏直接标题

依赖：react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：作品图片墙
- 项目适配场景：目的地展示

避免用于：

- 需要同时比较细节的多图诊断或选型页面

### 限制与接入建议

- 不能模糊唯一可读信息或让非活动卡失去可操作性；滤镜只用于展示图层。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/focus-cards.json；资料核对时间：2026-10-12T07:14:29.122Z；SHA256：545e481dfd448b33508770ab661878382f45636cb1e0fe77e623d408bc35ebec；哈希对象：source-files-joined；文件：components/ui/focus-cards.tsx
- official-description：https://ui.aceternity.com/components/focus-cards；资料核对时间：2026-10-12T07:14:29.122Z；SHA256：e5f7491c9a82eab40faf6d04a61c20a5726484370a359163622b258ff7e079ca；哈希对象：page-response

---

## 落到边缘后散开的光束 · Background Beams With Collision

案例ID：43049e4f874df1ab

来源：https://ui.aceternity.com/components/background-beams-with-collision

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多根竖向亮条从上方落下，碰到容器底部时短暂炸开成小粒子，再继续出现新的光束。

触发：显示后自动下落循环；撞到预设底部区域产生粒子

作用层：page-background、content

### 实现方法

下落光条与底部容器发生几何碰撞后，生成一次性粒子爆散。

1. 用重复Motion位移驱动各条下落光束
2. 通过边界矩形比较检测底部接触
3. 碰撞时暂隐原光束并生成短命粒子
4. 爆散结束清理粒子并重启光束周期

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：首屏背景
- 项目适配场景：动态展示区

避免用于：

- 低性能设备上大量碰撞粒子并行的背景

### 限制与接入建议

- 源码碰撞检测与计时器需按实例清理；视觉碰撞不是物理引擎，不用于真实轨迹计算。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/background-beams-with-collision.json；资料核对时间：2026-10-12T07:14:29.120Z；SHA256：ef1b5d0b32cae6f127773efd227938673d7df5dd10fb61381494b1bb5de0aa54；哈希对象：source-files-joined；文件：components/ui/background-beams-with-collision.tsx
- official-description：https://ui.aceternity.com/components/background-beams-with-collision；资料核对时间：2026-10-12T07:14:29.120Z；SHA256：8ee1282717272b00ded47d754548b178a9b7c642c7fcdb29513192e6645e040a；哈希对象：page-response

---

## 鼠标扫过的渐变空心大字 · Text Hover Effect

案例ID：95c8781ac1d8208a

来源：https://ui.aceternity.com/components/text-hover-effect

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

大字以细线轮廓显示，鼠标附近的圆形范围揭露彩色渐变线条，文字轮廓也有描绘入场，形成局部亮起的空心字。

触发：鼠标在文字区移动改变渐变遮罩位置

作用层：text

### 实现方法

SVG文字轮廓先被描出，再由指针径向mask局部显露彩色渐变描边。

1. 用SVG text定义稳定的空心文字轮廓
2. strokeDasharray/offset完成首次描绘
3. 记录指针位置并更新径向mask中心
4. 仅在mask范围内显示强调色描边

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：页脚品牌字
- 项目适配场景：大标题

避免用于：

- 小字号、长段落或核心可复制答案

### 限制与接入建议

- 适用于大字号短标题，SVG文本需另有可读文本替代；不能用于长篇正文。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/text-hover-effect.json；资料核对时间：2026-10-12T07:14:29.978Z；SHA256：6921dc858bc64ac90e791720660ceac965df94986867e82d28a6eb2d8fe53518；哈希对象：source-files-joined；文件：components/ui/text-hover-effect.tsx
- official-description：https://ui.aceternity.com/components/text-hover-effect；资料核对时间：2026-10-12T07:14:29.978Z；SHA256：abd1f160f92daf051bdfcec64e73fa4be01bcf58c7d243bfe58d9fe3d5c93c04；哈希对象：page-response

---

## 跟随鼠标的局部放大镜 · Lens

案例ID：3dc3b5173ae88403

来源：https://ui.aceternity.com/components/lens

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

在图片或其他内容上移动时出现一个放大区域，区域内显示更大尺度的同一内容，帮助查看局部细节；移出后恢复正常画面。

触发：悬停并移动指针控制镜头位置；移出关闭

作用层：content、surface

### 实现方法

复制同一内容到一个局部裁切圆窗，按指针坐标定位并放大副本。

1. 渲染正常内容作为稳定底层
2. hover时创建同内容的裁切镜面
3. 把指针映射到放大层的反向位移与缩放
4. 离开隐藏镜面，触屏提供独立放大操作

依赖：motion、react

参数：

- 源码默认 Lens.zoomFactor：1.5
- 源码默认 Lens.lensSize：170
- 源码默认 Lens.isStatic：false

### 适用场景

- 项目适配场景：商品图片
- 项目适配场景：设计细节
- 项目适配场景：截图展示

避免用于：

- 不能被重复渲染的实时表单或播放器控件

### 限制与接入建议

- 重复内容可能产生重复ID或交互，放大副本应不接收业务点击并处理可访问性。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/lens.json；资料核对时间：2026-10-12T07:14:29.843Z；SHA256：873148d3feed8f2241ab707d2a5a37d1f5ee1113f81b08919f1ff0e5dbf8e662；哈希对象：source-files-joined；文件：components/ui/lens.tsx
- official-description：https://ui.aceternity.com/components/lens；资料核对时间：2026-10-12T07:14:29.843Z；SHA256：d8e283e5d544a670978b6067e6fb3225934d5616b873afb6618042fefe9fd0e4；哈希对象：page-response

---

## 从中间伸展的彩色波形线 · Background Lines

案例ID：7688c8803696003c

来源：https://ui.aceternity.com/components/background-lines

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多条不同颜色的弧线以中部为中心向两侧展开，细线逐段被绘制并循环变化，给标题后方增加有节奏的波形背景。

触发：显示后路径长度按错开的时间自动变化

作用层：page-background

### 实现方法

预定义SVG彩色弧线通过pathLength与opacity时间序列从中间伸展并循环。

1. 为多条曲线建立稳定路径和渐变色
2. 逐条错开pathLength绘制时序
3. 用opacity收尾后开始下一轮
4. 将线条限制在标题后方的独立背景

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：首屏背景
- 项目适配场景：标题区

避免用于：

- 必须反映真实信号或数据的波形图

### 限制与接入建议

- 是固定曲线的描绘循环，不是实时音频波形；路径数量与光晕避免压过正文。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/background-lines.json；资料核对时间：2026-10-12T07:14:29.543Z；SHA256：72c900efcb60886d5824649bc129106d9bc36e645ca418aca771a7d9fe4d3a96；哈希对象：source-files-joined；文件：components/ui/background-lines.tsx
- official-description：https://ui.aceternity.com/components/background-lines；资料核对时间：2026-10-12T07:14:29.543Z；SHA256：6225bf4fddc57af90e00a6666522002c6e09fa91b00677b94d3c1d3a728b7a8f；哈希对象：page-response

---

## 图片与评价联动的轮播 · Animated Testimonials

案例ID：31fd229e3d116626

来源：https://ui.aceternity.com/components/animated-testimonials

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

评价文字与人物图片并列，图片像一叠略微旋转的照片；切换时新照片升到前方，姓名、职位与引言一起更新。

触发：点击前后按钮切换；启用自动播放后定时轮换

作用层：layout、content

### 实现方法

活动索引同时驱动叠放人物照片层级、旋转，以及姓名和评价逐词显现。

1. 将图片、姓名与引言保存在同一条数据
2. 切换索引时把当前照片移到前层
3. 为非活动照片分配固定旋转与缩放
4. 同步更换姓名和引言并提供上一项下一项入口

依赖：@tabler/icons-react、motion、react

参数：

- 源码默认 AnimatedTestimonials.autoplay：false

### 适用场景

- 项目适配场景：用户评价区
- 项目适配场景：团队故事

避免用于：

- 必须同时完整比较所有评价的列表

### 限制与接入建议

- autoplay属于可选演示行为，真实评价需要来源；不要用未标注的虚构用户背书。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/animated-testimonials.json；资料核对时间：2026-10-12T07:14:29.980Z；SHA256：0ebd8145a884493cc52f27b9fc73aaa35102fc4d12fb31b4e33d55818e330627；哈希对象：source-files-joined；文件：components/ui/animated-testimonials.tsx
- official-description：https://ui.aceternity.com/components/animated-testimonials；资料核对时间：2026-10-12T07:14:29.980Z；SHA256：cac488e9d33ed89c2cb11875e1192afc1ea802a0b7bc76ae9fec8bc4756541f7；哈希对象：page-response

---

## 点阵地图上的连线动画 · World Map

案例ID：8e9f8ae3a7a3017a

来源：https://ui.aceternity.com/components/world-map

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

世界地图以细小点阵呈现，不同地点之间用弧形线路连接，线路逐段被绘制，端点带轻微扩散圆环。

触发：组件显示时自动绘制线路与端点波纹

作用层：content、page-background

### 实现方法

点阵SVG地图上按经纬度投影绘制弧线，端点环以SVG动画扩散。

1. 通过dotted-map生成点阵轮廓
2. 将经纬度投影成SVG坐标
3. 计算两端之间的弯曲路径并逐段描绘
4. 在端点叠加扩散环，内容标签另放可读层

依赖：dotted-map、motion、next-themes、react

参数：

- 源码默认 WorldMap.dots：[]
- 源码默认 WorldMap.lineColor："#0ea5e9"

### 适用场景

- 项目适配场景：全球业务区
- 项目适配场景：分布团队说明

避免用于：

- 要求精确地理测量、导航或实时运输追踪的系统

### 限制与接入建议

- 示意投影不是专业GIS，地点连线只反映传入数据；不能凭动画宣称全球业务覆盖。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/world-map.json；资料核对时间：2026-10-12T07:14:30.298Z；SHA256：a8cace90aee8b4fd3d2b14b74d4fca0583b10ac1b7112df9e5b9b6782948ef00；哈希对象：source-files-joined；文件：components/ui/world-map.tsx
- official-description：https://ui.aceternity.com/components/world-map；资料核对时间：2026-10-12T07:14:30.298Z；SHA256：e3d714a928a2b071e388f2d3c71f1c2abdff99e9ec0df366ffa43f9f44bf6f23；哈希对象：page-response

---

## 带行号与复制按钮的代码展示 · Code Block

案例ID：d389ee16f7d41192

来源：https://ui.aceternity.com/components/code-block

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

代码按语法高亮，并可显示行号、文件名与语言标签；长代码在容器中滚动，指定行可以高亮，按钮用于复制内容。

触发：持续展示；点击复制按钮；长内容滚动查看

作用层：content

### 实现方法

语法高亮渲染器输出代码文本，行号与指定行高亮配合复制状态反馈。

1. 根据language与filename建立代码面板
2. 用语法高亮器渲染文本并设置换行/滚动
3. 对指定行设置背景强调
4. 复制原始代码并反馈成功或失败

依赖：@tabler/icons-react、react、react-syntax-highlighter

参数：

- 源码默认 CodeBlock.highlightLines：[]
- 源码默认 CodeBlock.tabs：[]

### 适用场景

- 项目适配场景：技术文档
- 项目适配场景：开发工具介绍

避免用于：

- 需要真实运行、调试或安全沙箱能力的代码执行器

### 限制与接入建议

- 展示并不执行代码；复制需处理剪贴板权限，不能把外部代码内容当项目指令执行。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：保持静态布局与材质，若项目另加hover位移则关闭位移，仅保留清晰焦点与选中状态。

性能：项目建议：保持静态CSS绘制，控制图像资源和DOM数量；无需为了装饰启动持续帧循环。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/code-block.json；资料核对时间：2026-10-12T07:14:30.376Z；SHA256：3715eb017b80e5c019db8d60a22c1d0e72390cc6c17ec958bd9358548a19b076；哈希对象：source-files-joined；文件：components/ui/code-block.tsx
- official-description：https://ui.aceternity.com/components/code-block；资料核对时间：2026-10-12T07:14:30.376Z；SHA256：22bfb17ef4e93be03047cb450d3fb90b3d284f403670648f8071bde5bda02380；哈希对象：page-response

---

## 带箭头与指针微动效的轮播 · Carousel

案例ID：d6aab57f1b6232f6

来源：https://ui.aceternity.com/components/carousel

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多个大图卡片横向排列，通过左右箭头或点击邻近卡片切换；活动卡片的图片随鼠标轻微位移，非活动卡片变暗并倾斜。

触发：点击前后箭头或卡片切换；鼠标在活动项内移动驱动图片位移

作用层：layout、content

### 实现方法

活动幻灯片按索引居中，非活动卡倾斜变暗，活动图片受局部指针轻微平移。

1. 按索引计算每张卡的位置与倾角
2. 箭头或邻卡点击更新活动索引
3. 活动卡内部图片依据指针中心偏移
4. 切换后恢复图片位移并保留图片说明

依赖：@tabler/icons-react、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：作品展示
- 项目适配场景：功能截图

避免用于：

- 要求全量项目同时可见的比较任务

### 限制与接入建议

- 展示数量与卡片宽度需在手机重算；不能让指针动画抢夺水平滑动手势。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/carousel.json；资料核对时间：2026-10-12T07:14:31.103Z；SHA256：04759858e8dc938b453c77e152658fc6cb07d7f04eaabf7a49673d9f9a434c4e；哈希对象：source-files-joined；文件：components/ui/carousel.tsx
- official-description：https://ui.aceternity.com/components/carousel；资料核对时间：2026-10-12T07:14:31.103Z；SHA256：05a0d37292138bf31c7bf93ab7709a794f4cba1a91ddad6e76f9e42a74123554；哈希对象：page-response

---

## 每个字轮流变色的标题 · Colourful Text

案例ID：7a1472e70150756d

来源：https://ui.aceternity.com/components/colourful-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

同一行文字中的各字符使用不同颜色，按时间间隔改变配色、透明度、模糊和轻微位移，让标题带有活泼的闪动节奏。

触发：显示后按间隔自动改变字符样式

作用层：text

### 实现方法

短标题拆成字符，各字按计时序列切换色彩、模糊和小幅位移。

1. 把文本拆成稳定字符span
2. 为每个字符分配调色板索引
3. 按周期更新序列并错开opacity/blur变化
4. 保留可访问的稳定完整标题文本

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：活动标题
- 项目适配场景：创意首屏

避免用于：

- 长篇课文、公式、错误消息等必须稳定阅读的内容

### 限制与接入建议

- 属于持续文字装饰，不能承载关键实时状态；对中文与emoji需按字素拆分。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/colourful-text.json；资料核对时间：2026-10-12T07:14:30.630Z；SHA256：c3cdf9b013cc75b02855ef469b4a96da395e2c36396f6f7acd95b553c2e08ea5；哈希对象：source-files-joined；文件：components/ui/colourful-text.tsx
- official-description：https://ui.aceternity.com/components/colourful-text；资料核对时间：2026-10-12T07:14:30.630Z；SHA256：9d52f9a609b3dadf96175b04166a75c4ac1ababdd92d017a393c840d53da7bb9；哈希对象：page-response

---

## 轮廓像水波般抖动的文字 · Squiggly Text

案例ID：4e3a46aa4bd05bc5

来源：https://ui.aceternity.com/components/squiggly-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

文字通过噪声位移滤镜轻微扭曲，笔画边缘不断起伏，形成像手绘波浪或胶状文字一样的抖动轮廓。

触发：显示后滤镜参数自动变化

作用层：text

### 实现方法

多个SVG噪声位移滤镜按时间离散切换，使字形轮廓产生手绘抖动。

1. 为实例生成唯一滤镜ID
2. 建立不同seed的feTurbulence与feDisplacementMap
3. 按stepDuration离散切换滤镜引用
4. 把滤镜仅作用短标题轮廓

依赖：motion、react

参数：

- 源码默认 SquigglyText.steps：5
- 源码默认 SquigglyText.stepDuration：80
- 源码默认 SquigglyText.scale：[6, 8]
- 源码默认 SquigglyText.baseFrequency：0.02
- 源码默认 SquigglyText.numOctaves：3
- 源码默认 SquigglyText.as："span"

### 适用场景

- 项目适配场景：创意标题
- 项目适配场景：活动海报式页面

避免用于：

- 精确识别字形、化学式或数学式的正文

### 限制与接入建议

- 源码默认短间隔切换会较活跃，减少动态时需项目侧去滤镜；复杂字形和多滤镜有渲染开销。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/squiggly-text.json；资料核对时间：2026-10-12T07:14:30.945Z；SHA256：7e99133897d9970938a95d3b27966dd1c4dc714519e118c878895de8ed40f783；哈希对象：source-files-joined；文件：components/ui/squiggly-text.tsx
- official-description：https://ui.aceternity.com/components/squiggly-text；资料核对时间：2026-10-12T07:14:30.945Z；SHA256：9b8381870e8130204822dfde55d54026bf8bf7afb578936aacab09876aa0a292；哈希对象：page-response

---

## 被鼠标轻轻吸引的按钮 · Magnetic Button

案例ID：ed13ced54c6531b5

来源：https://ui.aceternity.com/components/magnetic-button

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

指针进入按钮附近时，按钮向鼠标方向小幅漂移，文字可以产生次级移动；离开后用弹性动画回到中心。

触发：鼠标在按钮区域内移动；移出弹性复位

作用层：surface、content

### 实现方法

指针接近时按钮或内部文字按局部偏移追随，离开由spring归位。

1. 定义可吸引的外容器与静止布局占位
2. 读取指针相对中心的位置
3. 按受限强度映射按钮/文字的x/y
4. 离开时将目标归零并保留点击命中区

依赖：motion、react

参数：

- 源码默认 MagneticButton.strength：0.8
- 源码默认 MagneticButton.maxDistance：100

### 适用场景

- 项目适配场景：主要行动按钮
- 项目适配场景：作品集入口

避免用于：

- 需要严格稳定位置的确认、支付或危险操作

### 限制与接入建议

- 不能让按钮移出原命中区或挤开布局；与拖拽控件要分开，触屏保持静止按钮。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/magnetic-button.json；资料核对时间：2026-10-12T07:14:30.850Z；SHA256：92960c6a3390d4a74da91de2eeb506da2930a532783aa4c99c78fcee01758181；哈希对象：source-files-joined；文件：components/ui/magnetic-button.tsx
- official-description：https://ui.aceternity.com/components/magnetic-button；资料核对时间：2026-10-12T07:14:30.850Z；SHA256：34bfcbf6c06c1e3a30f127fa7571a03771d9060819011a891d1a0b7ac1464d85；哈希对象：page-response

---

## 顶端或底端的胶囊导航岛 · Notch

案例ID：4f49fe7f98c4e782

来源：https://ui.aceternity.com/components/notch

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

紧凑圆角导航岛固定在屏幕顶部或底部，多个入口共用同一容器；点击入口展开选项面板并切换活动状态。

触发：点击项目打开选项；选择后切换活动项；外部点击或 Escape 收起

作用层：layout、content

### 实现方法

固定在边缘的胶囊导航岛以共享布局展开选项面板，选项逐项入场。

1. 用items建立组和选项的稳定ID
2. 点击组切换openItemId
3. 用共享shell布局过渡面板尺寸与位置
4. 选择后更新value并按closeOnSelect收拢

依赖：motion、react

参数：

- 源码默认 Notch.position："bottom"
- 源码默认 Notch.align："center"
- 源码默认 Notch.closeOnSelect：true
- 源码默认 Notch.showSelectedValue：true
- 源码默认 Notch.showDividers：true
- 源码默认 Notch.accentColor："var(--color-blue-500, #3b82f6)"
- 源码默认 Notch.offset：16
- 源码默认 Notch.reveal：true

### 适用场景

- 项目适配场景：快捷导航
- 项目适配场景：页面工具入口

避免用于：

- 不能覆盖任何正文且无安全边距的页面

### 限制与接入建议

- 这是网页内导航岛，不是系统级灵动岛；fixed定位需要safe-area与底部内容避让。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/notch.json；资料核对时间：2026-10-12T07:14:30.879Z；SHA256：c61d87255e4e1658ab8f19a47524283e3428974e1f58aa20980de71bdd3af26c；哈希对象：source-files-joined；文件：components/ui/notch.tsx
- official-description：https://ui.aceternity.com/components/notch；资料核对时间：2026-10-12T07:14:30.879Z；SHA256：c14418d5cc39979b5e2b47ca84d95dd398627e7f4fbd4e45e22890e5214bb1a8；哈希对象：page-response

---

## 左右缓慢扫动的双侧聚光 · Spotlight New

案例ID：bb04b57807656cf3

来源：https://ui.aceternity.com/components/spotlight-new

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

左右两组柔和长光束照向首屏中央，光束以不同位置和角度缓慢移动，形成左右呼应的舞台光照。

触发：显示后按设定时长自动往复移动

作用层：page-background、outer-glow

### 实现方法

左右成组长径向渐变光束以相反水平轨迹持续缓慢扫动。

1. 左右各叠放三层不同亮度的长渐变
2. 固定倾角形成对称光锥
3. Motion循环映射左右x为相反方向
4. 控制遮罩和层级使光束只承担背景气氛

依赖：motion、react

参数：

- 源码默认 Spotlight.translateY：-350
- 源码默认 Spotlight.width：560
- 源码默认 Spotlight.height：1380
- 源码默认 Spotlight.smallWidth：240
- 源码默认 Spotlight.duration：7
- 源码默认 Spotlight.xOffset：100

### 适用场景

- 项目适配场景：首页首屏
- 项目适配场景：营销标题

避免用于：

- 只有局部卡片装饰需求的高密度工具页

### 限制与接入建议

- 新版本是持续双侧扫光，不同于旧Spotlight的一次入场；大尺寸模糊需限制可见范围。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/spotlight-new.json；资料核对时间：2026-10-12T07:14:31.012Z；SHA256：7231f31ab0df6269dfcfce011af4a4b03860b7e157c1cda8c3d329e9a8f12b44；哈希对象：source-files-joined；文件：components/ui/spotlight-new.tsx
- official-description：https://ui.aceternity.com/components/spotlight-new；资料核对时间：2026-10-12T07:14:31.012Z；SHA256：43f07b5f8cd92f5b6ab43820e61dda7f130e9764d5f832a742f0ffeab1f2627a；哈希对象：page-response

---

## 立体倾斜的图片跑马墙 · 3D Marquee

案例ID：0863c4270156f37c

来源：https://ui.aceternity.com/components/3d-marquee

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多列图片组成倾斜的三维平面，图片列持续上下移动，并有悬停边界反馈，适合作为有层次的大面积视觉背景。

触发：显示后各列自动往复移动；悬停单图可增强边界反馈

作用层：page-background、layout

### 实现方法

图片分列后整体透视倾斜，各列以相反方向连续竖向移动。

1. 将图片复制分配到多列轨道
2. 对画廊外壳施加rotateX/Y/Z透视
3. 各列沿y以错相时间循环
4. 在视口边缘裁切并保持前景标题稳定

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：首屏视觉背景
- 项目适配场景：品牌图片墙

避免用于：

- 必须读取每张图片细节的教材图片目录

### 限制与接入建议

- 图片数量乘复制轮数会增加解码和DOM成本；需暂停或减少动态替代，不能遮挡点击。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/3d-marquee.json；资料核对时间：2026-10-12T07:14:31.327Z；SHA256：49265fb39272e876a3ff8ce5a1b4b8b5921ad5b266ad74bf270a74c6b8332886；哈希对象：source-files-joined；文件：components/ui/3d-marquee.tsx
- official-description：https://ui.aceternity.com/components/3d-marquee；资料核对时间：2026-10-12T07:14:31.327Z；SHA256：a19164937407044cea1721cae9d8c921c852cd5290c8fdcf358a0d170d4ce89a；哈希对象：page-response

---

## 宽度随词语变化的翻词框 · Container Text Flip

案例ID：c0bc7a10ce7ed450

来源：https://ui.aceternity.com/components/container-text-flip

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

一个带边框的词语容器按间隔翻换内容，旧词退出、新词进入，容器宽度同步适应新词长度，旁边句子保持衔接。

触发：显示后按设定间隔轮换词语

作用层：text、layout

### 实现方法

轮换词框通过测量当前词宽平滑改变容器宽度，旧词退出新词进入。

1. 维护轮换索引并测量目标词尺寸
2. 为词框width配置布局过渡
3. AnimatePresence完成上下或模糊切换
4. 清理计时器并避免首次测量造成整行跳动

依赖：motion、react

参数：

- 源码默认 ContainerTextFlip.words：["better", "modern", "beautiful", "awesome"]
- 源码默认 ContainerTextFlip.interval：3000
- 源码默认 ContainerTextFlip.animationDuration：700

### 适用场景

- 项目适配场景：首屏标题
- 项目适配场景：卖点短句

避免用于：

- 需要恒定版面和精确断行的表单标签

### 限制与接入建议

- 词框宽度变化会影响临近句子换行；不能将未确认词语轮换成业务承诺。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/utils/cn，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/container-text-flip.json；资料核对时间：2026-10-12T07:14:31.350Z；SHA256：593026cdbc3ae45b0ac3e7a31525b33311e5bb10057538e24209f7cd1e460bad；哈希对象：source-files-joined；文件：components/ui/container-text-flip.tsx
- official-description：https://ui.aceternity.com/components/container-text-flip；资料核对时间：2026-10-12T07:14:31.350Z；SHA256：cbe62f54472ca359c02d55a72583945a85c45ff0a95f0462ce84df5e742a8899；哈希对象：page-response

---

## 滚动收窄的响应式导航 · Resizable Navbar

案例ID：57f8444f15a08b99

来源：https://ui.aceternity.com/components/resizable-navbar

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

导航开始时横跨较宽区域，页面向下滚动后缩成居中的圆角浮条并增加背景；小屏时替换成可展开的移动菜单。

触发：页面滚动超过阈值改变宽度；点击小屏菜单开关

作用层：layout

### 实现方法

滚动到阈值后宽导航缩成居中浮条，并另设移动端展开菜单。

1. 监听页面滚动位置生成visible/compact状态
2. 对导航width、y和背景材质作过渡
3. 桌面链接保持可达
4. 小屏由菜单按钮管理展开、关闭与焦点

依赖：@tabler/icons-react、motion、react

参数：

- 源码默认 NavbarButton.Tag："a"
- 源码默认 NavbarButton.variant："primary"

### 适用场景

- 项目适配场景：营销页面主导航
- 项目适配场景：长页导航

避免用于：

- 无法保留内容避让空间的全屏编辑工作区

### 限制与接入建议

- 缩窄导航不是隐藏全部菜单；固定栏与页面锚点需处理顶部偏移和safe-area。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：根据触屏视口重算滚动段高度与位移边界；窄屏保持内容顺序，避免粘性视觉遮住阅读与操作。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：以运动值联动滚动而非每帧触发整页React重渲染；在内容尺寸变化时测量，避免滚动过程中反复强制布局。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/resizable-navbar.json；资料核对时间：2026-10-12T07:14:31.421Z；SHA256：d4188bfc54caef986fe5a91ffd3ede454a2ce8773d5dffba01fa6615d5d8a5af；哈希对象：source-files-joined；文件：components/ui/resizable-navbar.tsx
- official-description：https://ui.aceternity.com/components/resizable-navbar；资料核对时间：2026-10-12T07:14:31.421Z；SHA256：26ca64402518ce0b80fc3d1da0858fdeb0d3532eeeef5dbb3eb4416af4c9d89d；哈希对象：page-response

---

## 可拖拽抛放的倾斜卡片 · Draggable Card

案例ID：01d0a95f96ec23a3

来源：https://ui.aceternity.com/components/draggable-card

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

卡片可以按住拖动，移动时结合倾斜、阴影和缩放形成抓取感；拖到边界外时通过弹性约束拉回可用区域。

触发：按住拖拽卡片；移动产生倾斜；松手执行约束与复位

作用层：surface、content

### 实现方法

卡片拖动时按位移产生倾角、缩放与阴影，边界约束让松手后的卡片保持可达。

1. 为卡片建立motion drag与约束ref
2. 把drag x/y映射到rotateX/Y
3. 抓取时提高层级、缩放和阴影
4. 松手后限幅回弹并保持关闭/操作入口可达

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：创意照片区
- 项目适配场景：交互作品展示

避免用于：

- 依赖精准拖拽排序却未实现排序算法的清单

### 限制与接入建议

- 拖拽只是本地交互，位置持久化需业务另做；内部按钮与拖拽手势要分派。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/draggable-card.json；资料核对时间：2026-10-12T07:14:31.491Z；SHA256：a248f4cc3f94a08accb0a57117ad4748308867c19b01aade8331bc2eafb7a81a；哈希对象：source-files-joined；文件：components/ui/draggable-card.tsx
- official-description：https://ui.aceternity.com/components/draggable-card；资料核对时间：2026-10-12T07:14:31.491Z；SHA256：de0d27610ff27dcda316a00c2f52b7d7904d009a724ba7217113acc59df69700；哈希对象：page-response

---

## 滚动区域顶部的粘性公告条 · Sticky Banner

案例ID：3b15693a4e31fc75

来源：https://ui.aceternity.com/components/sticky-banner

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

带消息和链接的公告条粘在演示滚动区域顶部，阅读内容时保持可见，点击关闭按钮后收起。原站当前示例未开启滚动隐藏。

触发：演示区域内滚动时保持粘性定位；点击关闭按钮收起

作用层：layout、content

### 实现方法

公告条在指定滚动区域顶部sticky显示，关闭状态控制收起。

1. 把公告放入真正的滚动容器
2. 使用sticky top定位而非全页无条件fixed
3. 用状态管理关闭与退出过渡
4. 保留消息链接和内容上方的占位

依赖：motion、react

参数：

- 源码默认 StickyBanner.hideOnScroll：false

### 适用场景

- 项目适配场景：活动公告
- 项目适配场景：更新通知

避免用于：

- 必须持续显示不能被用户关闭的关键告警

### 限制与接入建议

- 当前示例未启用滚动方向隐藏，不应擅自说成FloatingNavbar行为；永久关闭是否保存由项目决定。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：根据触屏视口重算滚动段高度与位移边界；窄屏保持内容顺序，避免粘性视觉遮住阅读与操作。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：以运动值联动滚动而非每帧触发整页React重渲染；在内容尺寸变化时测量，避免滚动过程中反复强制布局。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/sticky-banner.json；资料核对时间：2026-10-12T07:14:31.756Z；SHA256：9708595c9af677b09f9260d0b0be5d1a11a5a6108269ceecdfa5d07e5348bb70；哈希对象：source-files-joined；文件：components/ui/sticky-banner.tsx
- official-description：https://ui.aceternity.com/components/sticky-banner；资料核对时间：2026-10-12T07:14:31.756Z；SHA256：3ff7ef4c1b43038b0fd450228da0a83de9ece3272c067ccf2c1e5908a3bd0b14；哈希对象：page-response

---

## 进入视野后框出的重点词 · Pointer Highlight

案例ID：0acd88c4e4fe0792

来源：https://ui.aceternity.com/components/pointer-highlight

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

重点文字在进入视口时被彩色矩形边框或背景标出，一个小箭头指针移到边缘，像有人刚用鼠标圈出关键内容。

触发：组件进入视口时播放边框与指针入场

作用层：text、border

### 实现方法

进入视口后边框或底色沿文字展开，同时小指针移动到强调位置。

1. 用观察器确认重点文字进入视口
2. 在文本外独立绘制高亮矩形
3. 按顺序扩展边框并定位装饰指针
4. 一次结束后保留高亮与完整文字

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：首屏重点词
- 项目适配场景：说明文案

避免用于：

- 每一行都被反复框选的长段正文

### 限制与接入建议

- 指针只是装饰，不是可点击按钮或实际协作者；高亮不应循环闪动影响阅读。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/pointer-highlight.json；资料核对时间：2026-10-12T07:14:31.754Z；SHA256：e32a56b7eeb6dc4bfe8c05bc7c025310f26ab3d43aba6bbb22813b1a47960dc0；哈希对象：source-files-joined；文件：components/ui/pointer-highlight.tsx
- official-description：https://ui.aceternity.com/components/pointer-highlight；资料核对时间：2026-10-12T07:14:31.754Z；SHA256：efc3cf84509fb1824fc270291b3fe268940b5c9c78f3c332206b4d2f12ee97a8；哈希对象：page-response

---

## 显示处理中与成功的按钮 · Stateful Button

案例ID：f7150ae29f460757

来源：https://ui.aceternity.com/components/stateful-button

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

点击后按钮从普通文字变为加载旋转图标，异步操作成功后显示勾选状态并短暂强调，再恢复原始内容。

触发：点击开始；等待传入操作完成后切换成功状态

作用层：content、surface

### 实现方法

点击触发异步操作，按钮内容由普通态切换到加载态，再显示成功勾选。

1. 维护idle/loading/success状态
2. 点击后禁用重复提交并调用任务函数
3. 等待真实Promise完成再显示成功
4. 失败时保留输入并返回可重试状态

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：提交表单
- 项目适配场景：保存操作
- 项目适配场景：付款行动

避免用于：

- 需要允许同时重复提交的实时多任务入口

### 限制与接入建议

- 成功必须由真实任务结果驱动，不能用固定计时器假装提交完成；错误处理需业务接入。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/stateful-button.json；资料核对时间：2026-10-12T07:14:31.758Z；SHA256：b19e3cee5986e376b9bffb740b77747ffd3c149d150c9e36b73c395ba7cb2ef9；哈希对象：source-files-joined；文件：components/ui/stateful-button.tsx
- official-description：https://ui.aceternity.com/components/stateful-button；资料核对时间：2026-10-12T07:14:31.758Z；SHA256：0b8550191b636cc2bee2bed4530a0ee605ac88222ff23447f594876a9f998681；哈希对象：page-response

---

## 轻量循环加载动画合集 · Loaders

案例ID：7166ef60bacae08a

来源：https://ui.aceternity.com/components/loader

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多种小尺寸等待指示器以圆点、线条或图形旋转和明暗变化表示正在处理，可用于按钮内或整页等待区域。

触发：显示加载组件后自动循环；任务结束时由应用移除

作用层：content

### 实现方法

若干不同小型等待指示器用旋转、路径或圆点透明度循环表达处理中。

1. 先选官方合集内的具体Loader变体
2. 把图形限制在小尺寸等待区域
3. 在任务处理中播放该变体的关键帧
4. 任务结束停止并显示真实结果文本

依赖：motion、react

参数：

- 源码默认 LoaderFour.text："Loading..."

### 适用场景

- 项目适配场景：按钮等待状态
- 项目适配场景：页面加载
- 项目适配场景：内容占位

避免用于：

- 用循环指示器宣称准确完成比例的任务

### 限制与接入建议

- 等待动画只表达未结束状态，不包含百分比或后台进度；合集不同变体不能混写为同一机制。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/loader.json；资料核对时间：2026-10-12T07:14:31.816Z；SHA256：571e40326045bd67d54a4aede52ca6a2db4bfd5685eca0d2ec9e193b2a0243bb；哈希对象：source-files-joined；文件：components/ui/loader.tsx
- official-description：https://ui.aceternity.com/components/loader；资料核对时间：2026-10-12T07:14:31.816Z；SHA256：19565c58cb23bae23b9eb33368810cf00d9822330cc796f7e72afac71c741920；哈希对象：page-response

---

## 扫描画面的生成进度动画 · Image Generation Loader

案例ID：a70e30c2d01eaadf

来源：https://ui.aceternity.com/components/image-generation-loader

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

图片生成区域中一条扫描带扫过画面，局部像素网格、文字遮罩和进度叠层随扫描显现，表现图像正在被构建。

触发：组件显示后按设定时长自动扫描；它是视觉加载演示，不代表真实生成进度

作用层：surface、content

### 实现方法

扫描线与像素网格、文字遮罩叠层在图像区域运动，表现生成中的视觉过程。

1. 用固定尺寸画面承载源图或占位
2. 创建扫描带并让遮罩随其推进
3. 错相显示像素网格与进度文字
4. 真实任务完成时切换最终图片并停止扫描

依赖：react

参数：

- 源码默认 ImageGenerationLoader.cellSize：5
- 源码默认 ImageGenerationLoader.gap：2
- 源码默认 ImageGenerationLoader.bandHeight：48
- 源码默认 ImageGenerationLoader.duration：4000
- 源码默认 ImageGenerationLoader.effect："shimmer"
- 源码默认 ImageGenerationLoader.waveAmplitude：12
- 源码默认 ImageGenerationLoader.scaleAmplitude：0.75
- 源码默认 ImageGenerationLoader.colors：DEFAULT_COLORS

### 适用场景

- 项目适配场景：图片生成工具
- 项目适配场景：视觉内容等待区

避免用于：

- 以假进度掩盖生成失败或无服务接入的页面

### 限制与接入建议

- 视觉扫描不是模型推理进度；无真实生成服务时需标演示，失败不能继续循环冒充处理中。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：限制采样/粒子数量与绘制分辨率；用单个帧循环更新绘制，离屏暂停，避免每帧重设画布尺寸。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/image-generation-loader.json；资料核对时间：2026-10-12T07:14:31.883Z；SHA256：4b22af88a23992c561cb6bce732b7fd9be46e021c9be29d2185c64a7adc0f715；哈希对象：source-files-joined；文件：components/ui/image-generation-loader.tsx
- official-description：https://ui.aceternity.com/components/image-generation-loader；资料核对时间：2026-10-12T07:14:31.883Z；SHA256：8945d56bcad2132ce55cbd8b207317b70456e06ee834992085ba9324a54a9768；哈希对象：page-response

---

## 随鼠标倾斜的厚度透视卡片 · Comet Card

案例ID：6dc417244de003d0

来源：https://ui.aceternity.com/components/comet-card

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

卡片在悬停时放大并按指针位置产生透视旋转，叠加随角度移动的柔和高光，使平面内容像一块有深度的实体。

触发：鼠标移入与移动驱动旋转和高光；移出复位

作用层：surface、outer-glow

### 实现方法

局部指针驱动厚度透视卡片的倾角与柔光高亮，hover时卡面放大。

1. 记录指针在卡片中的归一化位置
2. 用运动值平滑映射rotateX/Y
3. 让高光位置与倾角联动
4. 离开后归位并复原缩放与反射

依赖：motion、react

参数：

- 源码默认 CometCard.rotateDepth：17.5
- 源码默认 CometCard.translateDepth：20

### 适用场景

- 项目适配场景：产品卡片
- 项目适配场景：人物与作品卡

避免用于：

- 需要稳定文本选区或图像标注坐标的区域

### 限制与接入建议

- 同一transform不可与Tilt组件再叠写；高光与缩放应只影响展示层，不能扰动表单。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/comet-card.json；资料核对时间：2026-10-12T07:14:32.333Z；SHA256：43c862495a8c1c0a4f78d121d66b5837ca27afa5db6328895911497e7ed9b578；哈希对象：source-files-joined；文件：components/ui/comet-card.tsx
- official-description：https://ui.aceternity.com/components/comet-card；资料核对时间：2026-10-12T07:14:32.333Z；SHA256：5706829650a5e0bbf852296ce57d902907c5d0057c06a27547fd9a66ecdaba33；哈希对象：page-response

---

## 点击后扩散的方格波纹 · Background Ripple Effect

案例ID：75d3740bf66f4da9

来源：https://ui.aceternity.com/components/background-ripple-effect

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

大面积方格背景默认较暗，点击某格后，亮度波从点击位置向周围格子逐层传递，形成规则网格上的涟漪。

触发：点击背景单元格产生一轮扩散

作用层：page-background、surface

### 实现方法

点击网格单元后按与点击中心的距离为各单元安排延迟亮度波。

1. 生成带行列坐标的规则单元格
2. 记录被点击的行与列
3. 计算各格距离并映射为亮度/缩放时序
4. 波纹结束恢复默认状态，连续点击管理新的波纹实例

依赖：react

参数：

- 源码默认 BackgroundRippleEffect.rows：8
- 源码默认 BackgroundRippleEffect.cols：27
- 源码默认 BackgroundRippleEffect.cellSize：56

### 适用场景

- 项目适配场景：首屏背景
- 项目适配场景：互动活动页

避免用于：

- 高密度数据表格上与单元操作混淆的背景

### 限制与接入建议

- 这是网格上的波纹传播，不是流体模拟；单元数量大时应减少DOM和同时动画数。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/background-ripple-effect.json；资料核对时间：2026-10-12T07:14:32.207Z；SHA256：bdb7622e70515843fcb52ec0574fccc19c513c35d60f730968ba8361b2a6d9b2；哈希对象：source-files-joined；文件：components/ui/background-ripple-effect.tsx
- official-description：https://ui.aceternity.com/components/background-ripple-effect；资料核对时间：2026-10-12T07:14:32.207Z；SHA256：1a2be026d9bf85514150cb990cc355430d145734cc3baf7e8617755338554675；哈希对象：page-response

---

## 鼠标拨动的像素化图片 · Pixelated Canvas

案例ID：19872db15cb8a6f0

来源：https://ui.aceternity.com/components/pixelated-canvas

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

图片被分解为规则像素小块，指针经过时附近像素按方向产生错位和扰动，移开后逐步恢复原图结构。

触发：鼠标在画布内移动，局部像素受扰动并回弹

作用层：surface、content

### 实现方法

把图片采样成规则像素块，指针附近的块受扰动后回到原始栅格位置。

1. 加载图片并建立像素粒子基准网格
2. 按局部指针距离与方向更新目标偏移
3. 每帧让块位置阻尼回到基准
4. 重绘画布且保留图片加载失败替代

依赖：react

参数：

- 源码默认 PixelatedCanvas.width：400
- 源码默认 PixelatedCanvas.height：500
- 源码默认 PixelatedCanvas.cellSize：3
- 源码默认 PixelatedCanvas.dotScale：0.9
- 源码默认 PixelatedCanvas.shape："square"
- 源码默认 PixelatedCanvas.backgroundColor："#000000"
- 源码默认 PixelatedCanvas.grayscale：false
- 源码默认 PixelatedCanvas.responsive：false

### 适用场景

- 项目适配场景：创意封面
- 项目适配场景：作品图片

避免用于：

- 需要确认原始细节和真实色彩的图像检查

### 限制与接入建议

- 外部图片需支持画布采样的跨域规则；像素尺寸越小粒子越多，不应用于精确原图阅读。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：限制采样/粒子数量与绘制分辨率；用单个帧循环更新绘制，离屏暂停，避免每帧重设画布尺寸。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/pixelated-canvas.json；资料核对时间：2026-10-12T07:14:32.183Z；SHA256：3fb1d9ae52acfc02a126ec78e05d3aab75bf9d738287a6b634e657eebf5551d1；哈希对象：source-files-joined；文件：components/ui/pixelated-canvas.tsx
- official-description：https://ui.aceternity.com/components/pixelated-canvas；资料核对时间：2026-10-12T07:14:32.183Z；SHA256：d057c560de36a39ff1c37a9833f711eb47db9a79fb411033289847b25f81caba；哈希对象：page-response

---

## 文字内部流动的彩色曲线 · Canvas Text

案例ID：bbaac79ce6eba228

来源：https://ui.aceternity.com/components/canvas-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

彩色弯曲线条在画布中持续运动，但只显示在文字轮廓内部，形成以字形为窗口的动态多彩填充。

触发：显示后自动绘制曲线；字形作为固定裁切区域

作用层：text

### 实现方法

Canvas彩色曲线持续运动，并以文字轮廓作为合成遮罩只在字形内部显示。

1. 按字体和文本建立字形遮罩画布
2. 在另一画布计算流动彩色曲线
3. 用合成模式裁出字内图案
4. 将字外背景保持透明并提供可访问文本

依赖：react

参数：

- 源码默认 CanvasText.className：""
- 源码默认 CanvasText.backgroundClassName："bg-white dark:bg-neutral-950"
- 源码默认 CanvasText.animationDuration：5
- 源码默认 CanvasText.lineWidth：1.5
- 源码默认 CanvasText.lineGap：10
- 源码默认 CanvasText.curveIntensity：60
- 源码默认 CanvasText.overlay：false

### 适用场景

- 项目适配场景：大标题
- 项目适配场景：创意品牌字

避免用于：

- 化学式、长篇阅读或需要直接复制的答案

### 限制与接入建议

- Canvas文字不等同可选择正文，字体加载与resize需重建遮罩；公式不应用这种装饰。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：限制采样/粒子数量与绘制分辨率；用单个帧循环更新绘制，离屏暂停，避免每帧重设画布尺寸。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/canvas-text.json；资料核对时间：2026-10-12T07:14:32.280Z；SHA256：cd60ebbddf3b08596c692f34eb5a7db35f65dd84bb1e7cdceebe1a40e693f6f1；哈希对象：source-files-joined；文件：components/ui/canvas-text.tsx
- official-description：https://ui.aceternity.com/components/canvas-text；资料核对时间：2026-10-12T07:14:32.280Z；SHA256：04162a7d0ab2ee91a9495622ba1eebaa19c02807b45af520f602fc80d201cfcd；哈希对象：page-response

---

## 换词时带动整句重排 · Layout Text Flip

案例ID：3197134a784f56f1

来源：https://ui.aceternity.com/components/layout-text-flip

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

句子中的轮换词按时间间隔翻换，词宽变化时周围文字位置一起平滑移动，让整句话顺畅适应新的内容长度。

触发：显示后定时更新轮换词；布局同步过渡

作用层：text、layout

### 实现方法

轮换词使用共享布局，使词宽变化时整句其他文字也平滑重排。

1. 把固定句段和轮换词放在同一布局组
2. 定时切换关键词并处理旧词退出
3. 对句段使用layout让位置同步过渡
4. 在窄屏测试不同词长下的换行

依赖：motion、react

参数：

- 源码默认 LayoutTextFlip.text："Build Amazing"
- 源码默认 LayoutTextFlip.duration：3000

### 适用场景

- 项目适配场景：首页标题
- 项目适配场景：产品价值短句

避免用于：

- 精确逐行对齐的导航和表格标题

### 限制与接入建议

- 与ContainerTextFlip仅改变词框宽度不同，本组件有整句重排；需要稳定尺寸时应停用。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/layout-text-flip.json；资料核对时间：2026-10-12T07:14:32.305Z；SHA256：7eb45448a2815b4f86492cf6192ff5a9ae4c15cd995b9a70199b7f40ba5393d4；哈希对象：source-files-joined；文件：components/ui/layout-text-flip.tsx
- official-description：https://ui.aceternity.com/components/layout-text-flip；资料核对时间：2026-10-12T07:14:32.305Z；SHA256：f8f85f5d752322eafcb144e74f4c1522837e7da79f6435c5684447c1b4de1a50；哈希对象：page-response

---

## 明暗呼吸的发光点阵 · Dotted Glow Background

案例ID：2e0db61cd5df7595

来源：https://ui.aceternity.com/components/dotted-glow-background

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

等距小点铺满区域，不同位置的点独立改变亮度和光晕，边缘可通过渐变遮罩淡出，像安静呼吸的电子点阵。

触发：显示后按不同延迟自动改变透明度与发光

作用层：page-background、outer-glow

### 实现方法

规则点阵由各点的独立延迟控制透明度和光晕，边缘用遮罩淡出。

1. 依据gap和radius生成受限数量的点
2. 为每点分配独立动画时长与延迟
3. opacity与glow周期变化形成呼吸
4. 在内容下方叠加渐隐mask而不改变正文

依赖：react

参数：

- 源码默认 DottedGlowBackground.gap：12
- 源码默认 DottedGlowBackground.radius：2
- 源码默认 DottedGlowBackground.color："rgba(0,0,0,0.7)"
- 源码默认 DottedGlowBackground.glowColor："rgba(0, 170, 255, 0.85)"
- 源码默认 DottedGlowBackground.opacity：0.6
- 源码默认 DottedGlowBackground.backgroundOpacity：0
- 源码默认 DottedGlowBackground.speedMin：0.4
- 源码默认 DottedGlowBackground.speedMax：1.3

### 适用场景

- 项目适配场景：首屏背景
- 项目适配场景：信息卡片底纹

避免用于：

- 持续亮度变化会分散注意力的阅读面

### 限制与接入建议

- 网格点数量受容器面积影响，需限制密度；不是点击后扩散的BackgroundRipple。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：限制采样/粒子数量与绘制分辨率；用单个帧循环更新绘制，离屏暂停，避免每帧重设画布尺寸。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。

### 依据

- registry：https://ui.aceternity.com/registry/dotted-glow-background.json；资料核对时间：2026-10-12T07:14:32.592Z；SHA256：12820db19fead2d91f374165389258f28ff45633cc893974e80eb65036e649f1；哈希对象：source-files-joined；文件：components/ui/dotted-glow-background.tsx
- official-description：https://ui.aceternity.com/components/dotted-glow-background；资料核对时间：2026-10-12T07:14:32.592Z；SHA256：ae81fa527f8f87e0cb3ba64b6db79ab2b46662715617a7e85674c772b9fe646b；哈希对象：page-response

---

## 跟随指针的内容提示卡 · Tooltip Card

案例ID：f8728846c8d69b1e

来源：https://ui.aceternity.com/components/tooltip-card

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

在指定文字或区域上悬停后，弹出可容纳图片和多行说明的提示卡；浮层随指针轻微移动，离开后收起。

触发：鼠标悬停触发区打开；移动更新浮层位置；离开关闭

作用层：content

### 实现方法

富内容提示卡在hover时弹出，跟随触发区域内指针作小幅弹性偏移。

1. 为触发区记录hover状态与局部坐标
2. 渲染图片和说明组成的浮层
3. 把偏移经spring映射到浮层位置
4. 退出时收起并为触屏与键盘提供固定可访问入口

依赖：motion、react

参数：

- 项目配置：沿用该组件公开属性与本页容器数据；未从缓存源码确认的数值不宣称原站默认值。

### 适用场景

- 项目适配场景：术语解释
- 项目适配场景：链接预览
- 项目适配场景：人物说明

避免用于：

- 依赖hover才能读取完整任务信息的移动端界面

### 限制与接入建议

- 提示层不能承载唯一关键内容，弹层应处理视口边缘、防遮挡与触控替代。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：无精确指针时取消跟随位移，保留静态构图；原先hover才显示的信息改为直接显示或点击展开。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：将高频指针更新写入ref、运动值或CSS变量并合并到动画帧，不让整组卡片随每次移动重渲染。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/tooltip-card.json；资料核对时间：2026-10-12T07:14:32.689Z；SHA256：aa43fee7024ea59de28e9a4ae5bf704e99b39109e478426f7fa116f6748334db；哈希对象：source-files-joined；文件：components/ui/tooltip-card.tsx
- official-description：https://ui.aceternity.com/components/tooltip-card；资料核对时间：2026-10-12T07:14:32.689Z；SHA256：809a9cf85d7710376d38e4d8ed036188baffd9948b1270094292f1c5ee15e24f；哈希对象：page-response

---

## 从随机符号解码成真实文字 · Encrypted Text

案例ID：c2c892ed4cecd54d

来源：https://ui.aceternity.com/components/encrypted-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

文字最初由不断变化的随机字母和符号占位，进入视野后从左到右逐字固定为真实内容，未揭示部分继续闪动。

触发：首次进入视口开始解码；文本变化可重新生成

作用层：text

### 实现方法

随机符号占位逐步固定为目标字符，未解码部分在计时循环中继续变化。

1. 按字素保存真实目标文本
2. 先以随机字符填充未揭示位置
3. 根据reveal进度逐个固定原字符
4. 结束清理计时器并呈现完整稳定文本

依赖：motion、react

参数：

- 源码默认 EncryptedText.revealDelayMs：50
- 源码默认 EncryptedText.charset：DEFAULT_CHARSET
- 源码默认 EncryptedText.flipDelayMs：50

### 适用场景

- 项目适配场景：技术产品标题
- 项目适配场景：安全品牌文案

避免用于：

- 密码、敏感数据和必须立即可读的错误提示

### 限制与接入建议

- 它只是视觉解密而非加密算法；真实机密不要先塞入可见DOM又声称被安全隐藏。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/encrypted-text.json；资料核对时间：2026-10-12T07:14:32.683Z；SHA256：90c8efe74118294f8ddf39ced79178182946e469eec88fd4d531efc5d8e0d76b；哈希对象：source-files-joined；文件：components/ui/encrypted-text.tsx
- official-description：https://ui.aceternity.com/components/encrypted-text；资料核对时间：2026-10-12T07:14:32.683Z；SHA256：1b5dc3387caccb9802c0aeb590d53bf4c81b51e547b6320da7f15452f6f88ca9；哈希对象：page-response

---

## 带细颗粒的流动渐变 · Noise Background

案例ID：3666ebc825b07f02

来源：https://ui.aceternity.com/components/noise-background

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多团渐变缓慢漂移，表面覆盖细小噪点纹理，让大面积颜色具有胶片般的颗粒感；可调色彩、速度与噪点强度。

触发：显示后渐变自动运动，噪点层持续覆盖

作用层：page-background、surface

### 实现方法

缓慢移动的渐变色团上叠加独立噪声纹理，噪点强度与色团速度分开控制。

1. 建立渐变背景与运动色团层
2. 通过transform轨迹改变各色团位置
3. 另用噪点纹理混合覆盖形成颗粒
4. 把阅读内容放在不受滤镜影响的前景

依赖：motion、react

参数：

- 源码默认 NoiseBackground.noiseIntensity：0.2
- 源码默认 NoiseBackground.speed：0.1
- 源码默认 NoiseBackground.backdropBlur：false
- 源码默认 NoiseBackground.animating：true

### 适用场景

- 项目适配场景：首屏背景
- 项目适配场景：品牌视觉区

避免用于：

- 需要无纹理纯净背景的密集图表或表格

### 限制与接入建议

- 颗粒与混合是装饰材质，非图像去噪或真实胶片处理；多层滤镜要限制面积。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/noise-background.json；资料核对时间：2026-10-12T07:14:32.708Z；SHA256：fbedccf1bfdeaca7ddaa024948a791fcd7ff41364b11b6d854c10acdb28a54c8；哈希对象：source-files-joined；文件：components/ui/noise-background.tsx
- official-description：https://ui.aceternity.com/components/noise-background；资料核对时间：2026-10-12T07:14:32.708Z；SHA256：04c7b3936524a57350fa7de1e01eefabe68406016a0ec8c860ba9909b6669a9e；哈希对象：page-response

---

## 复古点阵抖色图片 · Dither Shader

案例ID：b0151ee3e1ddd81f

来源：https://ui.aceternity.com/components/dither-shader

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

图片的明暗和色彩被转换为规则点阵或颗粒块，保留整体轮廓但呈现复古低色阶视觉；可实时调整像素尺度和色彩参数。

触发：图像加载后着色器持续渲染；参数变化实时更新

作用层：surface、content

### 实现方法

以规则阈值矩阵或抖色算法把图片亮度映射成有限色阶和点阵。

1. 加载可采样的源图并调整处理分辨率
2. 按ditherMode计算每格阈值与目标色
3. 应用亮度、对比度和调色板映射
4. 把结果绘到画布并在参数变化时重算

依赖：react

参数：

- 源码默认 DitherShader.gridSize：4
- 源码默认 DitherShader.ditherMode："bayer"
- 源码默认 DitherShader.colorMode："original"
- 源码默认 DitherShader.invert：false
- 源码默认 DitherShader.pixelRatio：1
- 源码默认 DitherShader.primaryColor："#000000"
- 源码默认 DitherShader.secondaryColor："#ffffff"
- 源码默认 DitherShader.customPalette：["#000000", "#ffffff"]

### 适用场景

- 项目适配场景：复古作品封面
- 项目适配场景：品牌视觉图

避免用于：

- 医学影像、色彩校验或需要忠实原图的任务

### 限制与接入建议

- 改色和低色阶会改变原图信息，不能作精确颜色判断；跨域图片采样失败要回退原图。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：限制采样/粒子数量与绘制分辨率；用单个帧循环更新绘制，离屏暂停，避免每帧重设画布尺寸。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/dither-shader.json；资料核对时间：2026-10-12T07:14:32.923Z；SHA256：b3c1064c304d4c6648335febbb12a541f7c81905f1998e72202adb661ffc7503；哈希对象：source-files-joined；文件：components/ui/dither-shader.tsx
- official-description：https://ui.aceternity.com/components/dither-shader；资料核对时间：2026-10-12T07:14:32.923Z；SHA256：c95597a84154194c90b00de2c2fa26728b7517bcb5b202ea61d050a04782213a；哈希对象：page-response

---

## 缓慢漂移的柔软云层 · Cloud Shader

案例ID：dced90c1417e5265

来源：https://ui.aceternity.com/components/cloud-shader

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

背景实时生成多层柔软云团，随时间横向漂移，云的大小、密度、速度和天空颜色可调整，营造安静的天空空间。

触发：显示后按时间持续渲染漂移云层

作用层：page-background

### 实现方法

全屏片元shader用多层噪声构造非对称云团包络并随时间横向漂移。

1. 初始化WebGL程序与分辨率uniform
2. 用噪声计算云团密度和边缘
3. 按时间推进云的位置并估算自阴影
4. 背景与前景分层，失败时显示静态天空

依赖：react

参数：

- 源码默认 CloudShader.speed：1
- 源码默认 CloudShader.count：6
- 源码默认 CloudShader.cloudColor："#fbf8f2"
- 源码默认 CloudShader.skyTopColor："#3876ba"
- 源码默认 CloudShader.skyBottomColor："#8cbfe8"

### 适用场景

- 项目适配场景：首屏背景
- 项目适配场景：旅行主题页

避免用于：

- 依赖真实气象数据或低功耗长时后台显示

### 限制与接入建议

- 是二维实时shader而非体积天气模拟；不能假称真实天气，GPU与精度兼容需实测。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：限制Canvas数量和设备像素比，离屏或后台暂停帧循环，卸载释放几何、材质、纹理与监听；WebGL失败回退静态画面。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/cloud-shader.json；资料核对时间：2026-10-12T07:14:33.129Z；SHA256：4a0fd073ef2939b05b7a1d796b43574c94acc17a6bf65f35f7933ab8156cd60e；哈希对象：source-files-joined；文件：components/ui/cloud-shader.tsx
- official-description：https://ui.aceternity.com/components/cloud-shader；资料核对时间：2026-10-12T07:14:33.129Z；SHA256：7365d2391876ce215248dbb5ee2f9904be02fea0f8071c4091b276c7b0402e57；哈希对象：page-response

---

## 随鼠标分色扭动的图片 · Chromatic Image

案例ID：6f5210d22e041737

来源：https://ui.aceternity.com/components/chromatic-image

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

图片响应指针时产生红绿蓝颜色分离、局部位移和轻微倾斜，边缘像出现彩色重影，移开后恢复清晰。

触发：指针在图片内移动驱动颜色分离与位移；离开回归

作用层：surface、content

### 实现方法

WebGL采样同一图片的RGB通道偏移，指针同时驱动局部UV扭曲与倾斜。

1. 加载图片纹理并按容器比例做cover映射
2. 把指针和hover强度写入uniform
3. 分别采样偏移后的红绿蓝通道并合成
4. 移出时阻尼回到清晰图像，释放纹理和程序

依赖：react

参数：

- 源码默认 ChromaticImage.backgroundColor："#111111"
- 源码默认 ChromaticImage.zoom：0.2
- 源码默认 ChromaticImage.displacement：0.05
- 源码默认 ChromaticImage.chromaticShift：0.01
- 源码默认 ChromaticImage.tilt：0.3

### 适用场景

- 项目适配场景：作品图片
- 项目适配场景：创意封面

避免用于：

- 需准确识别实验图像颜色或图表细节的页面

### 限制与接入建议

- 分色会改变原图细节与颜色，不用于真实性判断；跨域纹理、WebGL失败需普通img替代。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：限制Canvas数量和设备像素比，离屏或后台暂停帧循环，卸载释放几何、材质、纹理与监听；WebGL失败回退静态画面。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/chromatic-image.json；资料核对时间：2026-10-12T07:14:33.278Z；SHA256：2e111364d8fa42b9e510a26a2822eb828d6cc614d87023cf8bc85571730244e8；哈希对象：source-files-joined；文件：components/ui/chromatic-image.tsx
- official-description：https://ui.aceternity.com/components/chromatic-image；资料核对时间：2026-10-12T07:14:33.278Z；SHA256：a2cff5e2de656d3d67d70fc92532ccffa7ff85f39fba30c5c74ec0ab817e5511；哈希对象：page-response

---

## 把摄像头画面变成像素格 · Webcam Pixel Grid

案例ID：5cb6d04a83fea066

来源：https://ui.aceternity.com/components/webcam-pixel-grid

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

在用户允许摄像头后，把实时视频采样成规则的小色块，保留人物或环境的动态轮廓；拒绝权限时显示提示状态。

触发：用户授予摄像头权限后持续采样；权限失败展示提示

作用层：content、surface

### 实现方法

读取经用户授权的摄像头视频并逐帧采样为规则色块网格。

1. 由明确用户操作申请摄像头权限
2. 将MediaStream连接到隐藏或可控video
3. 按采样单元读取视频颜色并绘制色块
4. 停止或卸载时关闭所有媒体轨道

依赖：react

参数：

- 源码默认 WebcamPixelGrid.gridCols：64
- 源码默认 WebcamPixelGrid.gridRows：48
- 源码默认 WebcamPixelGrid.maxElevation：15
- 源码默认 WebcamPixelGrid.motionSensitivity：0.4
- 源码默认 WebcamPixelGrid.elevationSmoothing：0.1
- 源码默认 WebcamPixelGrid.colorMode："webcam"
- 源码默认 WebcamPixelGrid.monochromeColor："#00ff88"
- 源码默认 WebcamPixelGrid.backgroundColor："#0a0a0a"

### 适用场景

- 项目适配场景：互动体验页
- 项目适配场景：像素艺术展示

避免用于：

- 未经同意自动启动摄像头或宣称人脸识别

### 限制与接入建议

- 需安全上下文与用户权限，拒绝/设备缺失/占用应可恢复；不做身份识别或静默录像。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：用户点击后才申请前/后摄像头，处理拒绝与切换设备；离开页面主动关闭媒体轨道。

减少动态：项目建议：允许暂停采样并保留一帧像素图，提供可见停止摄像头入口，不因减少动态阻断权限退出。

性能：项目建议：限制采样/粒子数量与绘制分辨率；用单个帧循环更新绘制，离屏暂停，避免每帧重设画布尺寸。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/webcam-pixel-grid.json；资料核对时间：2026-10-12T07:14:33.294Z；SHA256：a1702ec46e566f8c32cbbf030a3df2599411e08a7fd251668668f2a2a777e5f1；哈希对象：source-files-joined；文件：components/ui/webcam-pixel-grid.tsx
- official-description：https://ui.aceternity.com/components/webcam-pixel-grid；资料核对时间：2026-10-12T07:14:33.294Z；SHA256：c8bc24dd1d55ad212389b31af258f9d91d6a0b682f2a70a4d750c54272202662；哈希对象：page-response

---

## 悬停展开照片的文件夹徽章 · Images Badge

案例ID：b2189353529bd8e1

来源：https://ui.aceternity.com/components/images-badge

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

紧凑徽章上露出少量图片边缘，悬停时照片向上抬起并以不同角度扇形散开，文件夹前盖同时向下倾斜。

触发：鼠标进入徽章展开图片扇面；离开回收

作用层：surface、content

### 实现方法

文件夹形状的徽章内图片在hover时抬起扇形散开，前盖同时旋转。

1. 把图片层叠到文件夹背板
2. 为各图片分配不同旋转与位移目标
3. hover时图片向上展开且前盖绕底边倾斜
4. 离开回到紧凑叠放，标题仍直接可见

依赖：motion、react

参数：

- 源码默认 ImagesBadge.hoverTranslateY：-35
- 源码默认 ImagesBadge.hoverSpread：20
- 源码默认 ImagesBadge.hoverRotation：15

### 适用场景

- 项目适配场景：作品入口
- 项目适配场景：相册标签
- 项目适配场景：素材集合

避免用于：

- 必须同时辨认所有图片内容的相册目录

### 限制与接入建议

- 文件夹是视觉隐喻，不代表已接文件系统；触屏需点击入口而不能仅hover展开。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/images-badge.json；资料核对时间：2026-10-12T07:14:33.133Z；SHA256：fff13566e4ab29c761de8fb4cee8dba311ce7a3a28ddfb80b217d84f7a3d4973；哈希对象：source-files-joined；文件：components/ui/images-badge.tsx
- official-description：https://ui.aceternity.com/components/images-badge；资料核对时间：2026-10-12T07:14:33.133Z；SHA256：286f3a2d505b4aaf6657e288d4c9882289285648cfe9d2cb33d41196e34b83bd；哈希对象：page-response

---

## 能按出声音的机械键盘 · Keyboard

案例ID：2f1a3e56d193ca79

来源：https://ui.aceternity.com/components/keyboard

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

模拟桌面键盘的圆角按键、分区和金属底座，按下时键帽压低并高亮；配置音频后可播放机械键敲击声。

触发：指针点击按键或键盘输入触发按压；音频依配置播放

作用层：surface、content

### 实现方法

键盘分区按键以按压位移和高亮反馈输入，可选音频在用户操作后播放。

1. 按键数据生成语义可聚焦的键帽
2. 指针或键盘事件设置pressed状态
3. 按下时降低键帽高度并改变阴影
4. 若配置声音则在交互后播放并清理音频资源

依赖：@tabler/icons-react、motion、react

参数：

- 源码默认 Keyboard.enableSound：false
- 源码默认 Keyboard.showPreview：false

### 适用场景

- 项目适配场景：开发者首页
- 项目适配场景：键盘产品演示

避免用于：

- 需要完整输入法、辅助技术或系统快捷键模拟的任务

### 限制与接入建议

- 模拟键盘不会自动替代系统输入法；声音需授权与静音控制，不能擅自记录用户真实输入。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/keyboard.json；资料核对时间：2026-10-12T07:14:33.529Z；SHA256：a0ba174c681f87f53f96536ad1b584768f5a3aa89bf39ff145d4003174b08f60；哈希对象：source-files-joined；文件：components/ui/keyboard.tsx
- official-description：https://ui.aceternity.com/components/keyboard；资料核对时间：2026-10-12T07:14:33.529Z；SHA256：6a505ac4f8b4799a040bb57e898d0c39d3b4479089878f045924f479bb3ab1fb；哈希对象：page-response

---

## 逐字输出的终端窗口 · Terminal

案例ID：4157ca4cbe9c7625

来源：https://ui.aceternity.com/components/terminal

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

圆角终端窗口带标题栏和控制圆点，命令与结果按打字节奏逐行显现，支持 Bash 语法高亮及可选音效。

触发：进入视口后播放逐字与逐行输出序列；光标持续闪烁

作用层：content、text

### 实现方法

终端外壳逐字/逐行显示预设命令与结果，Bash语法高亮和可选音效加强反馈。

1. 将演示命令与输出组织为带延迟的序列
2. 逐字更新当前行并保留完整历史行
3. 对Bash文本做语法高亮
4. 完成或卸载时停计时和声音，标明只是演示输出

依赖：react

参数：

- 源码默认 Terminal.commands：["npx shadcn@latest init"]
- 源码默认 Terminal.username："Manus-Macbook"
- 源码默认 Terminal.typingSpeed：50
- 源码默认 Terminal.delayBetweenCommands：800
- 源码默认 Terminal.initialDelay：500
- 源码默认 Terminal.enableSound：true

### 适用场景

- 项目适配场景：开发工具首屏
- 项目适配场景：安装演示

避免用于：

- 把预设逐字文本冒充实际执行日志的运维界面

### 限制与接入建议

- 不执行Shell命令，不代表已运行安装或部署；真实控制台需安全后端和权限边界。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/terminal.json；资料核对时间：2026-10-12T07:14:33.784Z；SHA256：a82abc1d669625f53e7465cc658276681ab0edf2b1005ace4b6d96599eb3fbbc；哈希对象：source-files-joined；文件：components/ui/terminal.tsx
- official-description：https://ui.aceternity.com/components/terminal；资料核对时间：2026-10-12T07:14:33.784Z；SHA256：ef5574ade95eeb34fe0324c47500386f16c5c61b64c3f1e44352196b60cc0631；哈希对象：page-response

---

## 带人物地点标记的三维地球 · 3D Globe

案例ID：4a53487d450d2436

来源：https://ui.aceternity.com/components/3d-globe

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

立体地球表面添加地点标记、头像和连接提示，用户可以旋转查看不同区域；悬停标记显示对应信息，点击可执行外部动作。

触发：地球自动或拖动旋转；悬停与点击地点标记触发反馈

作用层：content、page-background

### 实现方法

Fiber球体表面经纬度转换为三维标记，贴图、大气与OrbitControls提供可旋转地点展示。

1. 创建球体材质并加载地球与凹凸纹理
2. 把markers经纬度转换为球面坐标
3. 用Html或贴图渲染头像与说明
4. 以OrbitControls约束旋转缩放并调用真实marker回调

依赖：@react-three/drei、@react-three/fiber、react、three

参数：

- 源码默认 Globe3D.markers：[]

### 适用场景

- 项目适配场景：全球团队介绍
- 项目适配场景：地点分布

避免用于：

- 要求真实地图测距或地理精度分析的系统

### 限制与接入建议

- 纹理可能来自外部地址需许可与失败替代；不同于ThreeGlobe弧线组件，不应自动加上航线。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：限制Canvas数量和设备像素比，离屏或后台暂停帧循环，卸载释放几何、材质、纹理与监听；WebGL失败回退静态画面。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/3d-globe.json；资料核对时间：2026-10-12T07:14:33.625Z；SHA256：b017111cda6b02bc1c3996912150648b93d0d908da304698b0e2cac16e5b22e5；哈希对象：source-files-joined；文件：components/ui/3d-globe.tsx
- official-description：https://ui.aceternity.com/components/3d-globe；资料核对时间：2026-10-12T07:14:33.625Z；SHA256：ad1b46c66c750a7304d68fc9d16a0fc8d463c9d32dd1f96d194981a6a4a32c36；哈希对象：page-response

---

## 用字符拼出的图片 · ASCII Art

案例ID：960190b724344298

来源：https://ui.aceternity.com/components/ascii-art

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

根据图片明暗把像素替换为不同密度的字母或符号，形成可辨识的字符画；可选逐步显现动画并调节字符集与颜色。

触发：图像加载后转换；启用动画时进入视口可逐步显现

作用层：content、surface

### 实现方法

按源图亮度把采样像素映射为密度不同的字符，组成可辨识的字符画。

1. 加载图片并按字符格尺寸采样亮度
2. 把亮度映射到自定义字符集索引
3. 在等宽布局中输出颜色与字符
4. 可选渐显只影响显示，不重复采样静态图像

依赖：motion、react

参数：

- 源码默认 AsciiArt.resolution：80
- 源码默认 AsciiArt.charset："standard"
- 源码默认 AsciiArt.color："#ffffff"
- 源码默认 AsciiArt.backgroundColor："transparent"
- 源码默认 AsciiArt.inverted：false
- 源码默认 AsciiArt.colored：false
- 源码默认 AsciiArt.animated：true
- 源码默认 AsciiArt.animationStyle："fade"

### 适用场景

- 项目适配场景：创意头像
- 项目适配场景：技术品牌视觉

避免用于：

- 要求精确识别原图细节或图中文字的任务

### 限制与接入建议

- 字符画会丢失细节，字符字体和行高影响比例；跨域采样与字体加载需失败处理。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：停止自动循环和非必要位移，保留静态最终画面；交互切换仍可立即完成，不隐藏功能。

性能：项目建议：限制采样/粒子数量与绘制分辨率；用单个帧循环更新绘制，离屏暂停，避免每帧重设画布尺寸。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/ascii-art.json；资料核对时间：2026-10-12T07:14:33.952Z；SHA256：6d5c526aafc3b87ce0447b91a7c73cd7bca0b4d3f5c652ab481c412653827baa；哈希对象：source-files-joined；文件：components/ui/ascii-art.tsx
- official-description：https://ui.aceternity.com/components/ascii-art；资料核对时间：2026-10-12T07:14:33.952Z；SHA256：1c90183d7366879ea5e4fe604327ba75d76ea71d2a90d70d33126a323071f0d3；哈希对象：page-response

---

## 重复斜线与条纹底纹 · Scales

案例ID：93784e76dbd65e27

来源：https://ui.aceternity.com/components/scales

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

细小斜线、横线或竖线按规则重复排列，可放在内容下方并用遮罩淡出，形成轻量的机械刻度或网纹感。

触发：持续显示；参数控制方向、间距与颜色

作用层：page-background

### 实现方法

repeating-linear-gradient按方向和周期生成细斜线或横竖刻度静态底纹。

1. 选择orientation映射渐变角度
2. 用size控制重复背景单元
3. 把低对比纹理放在绝对定位背景层
4. 前景内容另设相对定位层保证可读

依赖：react

参数：

- 源码默认 Scales.orientation："diagonal"
- 源码默认 Scales.size：10
- 源码默认 ScalesContainer.orientation："diagonal"
- 源码默认 ScalesContainer.size：10

### 适用场景

- 项目适配场景：内容底纹
- 项目适配场景：图片背景
- 项目适配场景：卡片背景

避免用于：

- 被要求作为持续强动效主视觉的页面

### 限制与接入建议

- 原组件是静态纹理没有持续运动；size不是数据尺度，不能当真实测量刻度。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：保持静态布局与材质，若项目另加hover位移则关闭位移，仅保留清晰焦点与选中状态。

性能：项目建议：保持静态CSS绘制，控制图像资源和DOM数量；无需为了装饰启动持续帧循环。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/scales.json；资料核对时间：2026-10-12T07:14:33.782Z；SHA256：0bc985c6bb477a5fda766bbe8747bbe6149aeb0409e7d507ac7bbe95c24ea691；哈希对象：source-files-joined；文件：components/ui/scales.tsx
- official-description：https://ui.aceternity.com/components/scales；资料核对时间：2026-10-12T07:14:33.782Z；SHA256：2b375b8bf001c346363de269c2e453141380af742f603372aed9f1d89029394d；哈希对象：page-response

---

## 逐格翻页的机械文字板 · Text Flipping Board

案例ID：859634fae76088d9

来源：https://ui.aceternity.com/components/text-flipping-board

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

文字分成整齐字符格，每格上下半片依次翻转到目标字符，像车站时刻表或机械公告板，文本变化时重新逐格翻动。

触发：初始文字和后续文本更新触发字符格逐步翻转

作用层：text、layout

### 实现方法

固定字符格的上下半片绕水平轴翻转，按行列错相逐步切到目标字符。

1. 把文字铺到固定行列格并规范字符集
2. 为每格保存当前字符与目标字符
3. 逐步变换字符并动画上下半片的rotateX
4. 按列行延迟形成传播顺序，目标一致时停止计时

依赖：motion、react

参数：

- 源码默认 TextFlippingBoard.duration：BASE_TOTAL_S

### 适用场景

- 项目适配场景：公告展示
- 项目适配场景：产品标题
- 项目适配场景：信息屏

避免用于：

- 大量中文正文或需要立即完整显示的关键信息

### 限制与接入建议

- 源码字符集以拉丁字母和数字为主，中文会变空格；需明确改造字符集和格宽，不能直接用于中文答案。
- 沿用官方React/TSX与Tailwind样式时，需核对版本、样式配置和本地工具路径；缓存源码机制整理不代表已在目标工程集成或通过浏览器验收。

手机：项目建议：按容器宽度重排并保留可触达操作，不直接沿用演示固定宽高。

减少动态：项目建议：立即显示完整最终文字，停止字符轮换、滤镜和逐字延迟；保留同等语义的可访问文本。

性能：项目建议：控制同时动画的元素数，动画优先使用transform/opacity；清理计时器、监听与未完成动画，后台或离屏暂停。

依据2026-10-12官方资料缓存整理，未将缓存时间冒充本次实时访问；适用场景、避免场景、性能和移动处理是项目接入建议。registry证据的SHA256按paths数组顺序读取各文件content，以单个换行符连接后计算UTF-8摘要，不是registry响应JSON原文摘要。源码本地导入：@/lib/utils，需按目标工程解决，不能当npm包安装。

### 依据

- registry：https://ui.aceternity.com/registry/text-flipping-board.json；资料核对时间：2026-10-12T07:14:34.062Z；SHA256：f33799e3ab6e0a407d26330853131d3332cf2c882e8bd406a8c60e0c3574830f；哈希对象：source-files-joined；文件：components/ui/text-flipping-board.tsx
- official-description：https://ui.aceternity.com/components/text-flipping-board；资料核对时间：2026-10-12T07:14:34.062Z；SHA256：51abd25bd000d7819093fa309059eaf75e446727287823fbcb5498c0534b91c1；哈希对象：page-response

---

## 鼠标拆解的科技字标 · Tech Text

案例ID：e1bb796507083e78

来源：https://reactbits.dev/text-animations/tech-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

字母在鼠标下变成虚线矢量轮廓，可以拖离文字基线，松开后弹回。

触发：鼠标经过字母；拖动并松开字母

作用层：text

### 实现方法

Canvas测量字形并绘制带科技标记的轮廓，指针作用于局部字母，拖动位移由弹簧和阻尼回收。

1. 在React客户端引入锁定registry的TechText.css、TechText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 建立字体度量和字母局部坐标，按reach与softness计算局部影响，抓取字母时更新偏移并绘制虚线及测量标记。
3. 使用源码已提供的text、fontFamily、fontWeight、fontSize、letterSpacing、color等属性配置；触发依据：鼠标经过字母；拖动并松开字母。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- text：锁定源码默认：'React Bits'
- fontFamily：锁定源码默认：''
- fontWeight：锁定源码默认：600
- fontSize：锁定源码默认：150
- letterSpacing：锁定源码默认：-0.05
- color：锁定源码默认：'#ffffff'
- accentColor：锁定源码默认：'#ffffff'
- reach：锁定源码默认：200
- softness：锁定源码默认：0.7
- dashLength：锁定源码默认：4
- dashGap：锁定源码默认：2
- strokeWidth：锁定源码默认：1.5
- lineStyle：锁定源码默认：'dashed'
- reveal：锁定源码默认：'letter'
- specks：锁定源码默认：15
- selection：锁定源码默认：true
- labels：锁定源码默认：true
- draggable：锁定源码默认：true
- sweep：锁定源码默认：true
- speed：锁定源码默认：1

### 适用场景

- 开发者字标
- 互动品牌签名

避免用于：

- 长段落或公式正文

### 限制与接入建议

- 依赖字体加载和Canvas尺寸，不能把装饰字形当成唯一可复制的长正文。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/TechText-JS-CSS.json；资料核对时间：2026-10-25T07:52:53.593Z；SHA256：9aa210e563ebedf5bead3500a4a1595eb763a603d8b7695d526248512ac0b055；哈希对象：registry-response；文件：TechText.css、TechText.jsx

---

## 沿曲线循环的文字带 · Text Loop

案例ID：ea7c1c83303f07dc

来源：https://reactbits.dev/text-animations/text-loop

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

文字沿弯曲的 SVG 路径连续移动，形成首尾相接的文字跑马灯。

触发：页面展示后持续循环

作用层：text

### 实现方法

SVG路径承载textPath，GSAP不断推进起始偏移，复制文本单元形成连续的曲线路径循环。

1. 在React客户端引入锁定registry的TextLoop.css、TextLoop.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按shape和curviness生成路径，测量文本与分隔符长度，拼接足够单元后线性更新startOffset。
3. 使用源码已提供的text、shape、speed、direction、separator、curviness等属性配置；触发依据：页面展示后持续循环。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：gsap@^3.13.0

参数：

- text：锁定源码默认：'React ✦ Bits'
- shape：锁定源码默认：'wave'
- speed：锁定源码默认：90
- direction：锁定源码默认：'forward'
- separator：锁定源码默认：'✦'
- curviness：锁定源码默认：90
- fontSize：锁定源码默认：46
- fontWeight：锁定源码默认：800
- letterSpacing：锁定源码默认：2
- uppercase：锁定源码默认：true
- color：锁定源码默认：'#ffffff'
- ribbon：锁定源码默认：true
- ribbonColor：锁定源码默认：'#5227FF'
- ribbonWidth：锁定源码默认：86
- pauseOnHover：锁定源码默认：true

### 适用场景

- 品牌口号分隔带
- 活动文字徽记

避免用于：

- 需要逐行阅读的文章

### 限制与接入建议

- 路径长度与文本单元不匹配会露出断口；可见文字仍应提供可读的语义副本。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/TextLoop-JS-CSS.json；资料核对时间：2026-10-25T07:52:54.005Z；SHA256：12bcaf88f611fc077de4edd84a443bc2cac09cd940f07c0ede0873a5107089c4；哈希对象：registry-response；文件：TextLoop.css、TextLoop.jsx

---

## 图像填充的大标题 · Masked Heading

案例ID：f3faa4dafc6c6148

来源：https://reactbits.dev/text-animations/masked-heading

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

颜色流动或图片通过字形显露，标题按单词依次揭示。

触发：标题出现时逐词揭示；字形内部持续流动

作用层：text

### 实现方法

字形作为SVG裁切区域，图像或颜色填充在字形下方漂移；GSAP按单词推进揭示遮罩。

1. 在React客户端引入锁定registry的MaskedHeading.css、MaskedHeading.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 等待字体和媒体尺寸后测量单词，生成字形裁切，分别驱动reveal、媒体drift和可选parallax。
3. 使用源码已提供的text、tag、mediaType、src、poster、fillScale等属性配置；触发依据：标题出现时逐词揭示；字形内部持续流动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：gsap@^3.13.0

参数：

- text：锁定源码默认：'Designed in the details'
- tag：锁定源码默认：'h2'
- mediaType：锁定源码默认：'image'
- src：锁定源码默认：''
- poster：锁定源码默认：''
- fillScale：锁定源码默认：1.25
- parallax：锁定源码默认：26
- drift：锁定源码默认：18
- brightness：锁定源码默认：1
- saturation：锁定源码默认：1
- grayscale：锁定源码默认：false
- reveal：锁定源码默认：'rise'
- duration：锁定源码默认：1.1
- stagger：锁定源码默认：0.09
- trigger：锁定源码默认：'view'
- align：锁定源码默认：'center'
- weight：锁定源码默认：700
- tracking：锁定源码默认：-0.03
- lineHeight：锁定源码默认：1.06
- textScale：锁定源码默认：0.115

### 适用场景

- 展览大标题
- 图像品牌开场

避免用于：

- 信息密集的说明段落

### 限制与接入建议

- 只影响标题字形内部，不能将媒体背景铺到整张卡片或遮住标题以外内容。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/MaskedHeading-JS-CSS.json；资料核对时间：2026-10-25T07:52:54.035Z；SHA256：d0c070e901612a6a430ae62e4f43263297779004860116a5473df7e0aa366999；哈希对象：registry-response；文件：MaskedHeading.css、MaskedHeading.jsx

---

## 粒子聚散文字 · Particle Text

案例ID：138aae8f8c558f6e

来源：https://reactbits.dev/text-animations/particle-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

漂浮的粒子汇聚成文字，并可散开后重新组成字形。

触发：文字入场；按配置触发散开与重组

作用层：text

### 实现方法

Canvas将文字栅格采样为目标点，粒子从散开位置插值聚合，按指针距离附加排斥并可再次散开。

1. 在React客户端引入锁定registry的ParticleText.css、ParticleText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 等待字体后采样字形像素，按density建立粒子目标与起点，用gatherDuration及stagger安排聚合次序。
3. 使用源码已提供的text、particleSize、density、color、highlightColor、scatter等属性配置；触发依据：文字入场；按配置触发散开与重组。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- text：锁定源码默认：'React Bits'
- particleSize：锁定源码默认：2
- density：锁定源码默认：4
- color：锁定源码默认：'#ffffff'
- highlightColor：锁定源码默认：'#8b5cf6'
- scatter：锁定源码默认：180
- gatherDuration：锁定源码默认：1600
- stagger：锁定源码默认：420
- pointerRepel：锁定源码默认：40
- repelRadius：锁定源码默认：120
- idleDrift：锁定源码默认：0.7
- trigger：锁定源码默认：'mount'
- fontSize：锁定源码默认：'clamp(3rem, 12vw, 8rem)'
- fontWeight：锁定源码默认：800
- fontFamily：锁定源码默认：'inherit'
- glow：锁定源码默认：true

### 适用场景

- 科学主题标题
- 品牌揭示开场

避免用于：

- 需要始终清晰的题目答案

### 限制与接入建议

- 粒子密度与字体尺寸决定计算量；文字形状粒子不是三维真实分子或科学数据。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ParticleText-JS-CSS.json；资料核对时间：2026-10-25T07:52:54.059Z；SHA256：429402ea8d4ef632eac9dcb1a17fb101b96a6bd33b2e1f2295970dc867db80aa；哈希对象：registry-response；文件：ParticleText.css、ParticleText.jsx

---

## 机械翻页文字牌 · Split Flap Text

案例ID：8c4890b14e0585fd

来源：https://reactbits.dev/text-animations/split-flap-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

字符像车站机械翻页牌一样逐格翻动，切换到下一段文字。

触发：文字内容切换时翻动

作用层：text

### 实现方法

字符槽拆成上下翻片，生成目标字符之间的翻页序列，逐槽错峰旋转并在中点替换字符。

1. 在React客户端引入锁定registry的SplitFlapText.css、SplitFlapText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 将输入短句补齐到最长槽位，用charset与flipsPerChar生成中间字符，再按flipDuration和stagger更新前后翻片。
3. 使用源码已提供的words、flipDuration、stagger、cycleDelay、charset、flipsPerChar等属性配置；触发依据：文字内容切换时翻动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- words：锁定源码默认：['LAUNCH READY', 'SYNC ONLINE', 'SIGNAL LIVE']
- flipDuration：锁定源码默认：0.12
- stagger：锁定源码默认：0.06
- cycleDelay：锁定源码默认：2400
- charset：锁定源码默认：'alphanumeric'
- flipsPerChar：锁定源码默认：8
- tileColor：锁定源码默认：'#111827'
- textColor：锁定源码默认：'#f8fafc'
- tileRadius：锁定源码默认：8
- gap：锁定源码默认：6
- fontSize：锁定源码默认：52
- loop：锁定源码默认：true
- padTo：锁定源码默认：12

### 适用场景

- 交通主题展示牌
- 短状态口号

避免用于：

- 连续阅读文本

### 限制与接入建议

- 需要限定字符集和最大长度；频繁翻页不适合重要实时读数。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/SplitFlapText-JS-CSS.json；资料核对时间：2026-10-25T07:52:54.128Z；SHA256：ae1056238a77f1461ca96daae7e60e68cead176ccfc3acea5f25cf63a73026e4；哈希对象：registry-response；文件：SplitFlapText.css、SplitFlapText.jsx

---

## 鼠标扭曲文字 · Warp Text

案例ID：877f8a5c20eb8af1

来源：https://reactbits.dev/text-animations/warp-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

文字在鼠标附近弯曲、折射，形成类似透过变形玻璃的字形。

触发：鼠标在文字区域移动

作用层：text

### 实现方法

先把文字栅格化为纹理，再由OGL片元着色器按噪声和指针场扭曲纹理坐标并模拟折射。

1. 在React客户端引入锁定registry的WarpText.css、WarpText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量字体和多行文本生成纹理，将warpStrength、warpScale与pointerInfluence写入uniform，逐帧更新局部扰动。
3. 使用源码已提供的text、color、warpStrength、warpScale、speed、pointerInfluence等属性配置；触发依据：鼠标在文字区域移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- text：锁定源码默认：'Bend the moment'
- color：锁定源码默认：'#f8f5ff'
- warpStrength：锁定源码默认：0.08
- warpScale：锁定源码默认：1.7
- speed：锁定源码默认：0.55
- pointerInfluence：锁定源码默认：0.42
- pointerStrength：锁定源码默认：0.38
- refraction：锁定源码默认：0.018
- ripple：锁定源码默认：true
- fontSize：锁定源码默认：'clamp(3rem, 10vw, 9rem)'
- fontWeight：锁定源码默认：800
- fontFamily：锁定源码默认：'inherit'
- letterSpacing：锁定源码默认：'-0.06em'
- lineHeight：锁定源码默认：0.9

### 适用场景

- 实验字体展示
- 互动艺术标题

避免用于：

- 正文、试题和复杂公式

### 限制与接入建议

- WebGL字形是图像输出，应保留语义文字；折射过强会降低标题辨识度。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/WarpText-JS-CSS.json；资料核对时间：2026-10-25T07:52:54.103Z；SHA256：93b2a1a5bc8b9909dfd1021a7d0541a0956afa42b6dcc1602eca777e7d60d6d8；哈希对象：registry-response；文件：WarpText.css、WarpText.jsx

---

## 描边绘制文字 · Stroke Text

案例ID：3e443b2f630cfc00

来源：https://reactbits.dev/text-animations/stroke-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

字母轮廓逐步画出，随后填充字形内部颜色。

触发：标题进入视野或组件入场

作用层：text

### 实现方法

SVG文字层通过描边虚线偏移绘制轮廓，后续填充由独立字形层或擦除遮罩揭示。

1. 在React客户端引入锁定registry的StrokeText.css、StrokeText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量字形宽度后设置描边长度，GSAP按drawDuration与stagger播放笔画，再以fillDelay进入填充阶段。
3. 使用源码已提供的text、strokeColor、fillColor、strokeWidth、drawDuration、fillDelay等属性配置；触发依据：标题进入视野或组件入场。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时只清理本实例观察器或滚动触发，避免全局销毁其他动效。

依赖：gsap@^3.13.0

参数：

- text：锁定源码默认：DEFAULT_TEXT
- strokeColor：锁定源码默认：'#A78BFA'
- fillColor：锁定源码默认：'#F8FAFC'
- strokeWidth：锁定源码默认：1.4
- drawDuration：锁定源码默认：1.6
- fillDelay：锁定源码默认：0.2
- stagger：锁定源码默认：0.05
- ease：锁定源码默认：'power2.out'
- trigger：锁定源码默认：'mount'
- fillMode：锁定源码默认：'wipe'
- fontSize：锁定源码默认：128
- fontWeight：锁定源码默认：800
- letterSpacing：锁定源码默认：-4
- reverse：锁定源码默认：false

### 适用场景

- 品牌签名
- 章节开场

避免用于：

- 声称模拟真实书写教学

### 限制与接入建议

- 这是字体轮廓绘制，不是实际手写笔顺；字体加载前的测量可能不准确。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/StrokeText-JS-CSS.json；资料核对时间：2026-10-25T07:52:54.549Z；SHA256：d1deab7d0739bc4df48a2ff8c472f873f67073109a0f20b080bf443cc192198a；哈希对象：registry-response；文件：StrokeText.css、StrokeText.jsx

---

## 有厚度的视差文字 · Depth Text

案例ID：79251d5621b2156c

来源：https://reactbits.dev/text-animations/depth-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多层字形叠成立体挤出的厚度，随鼠标位置产生视差偏移。

触发：鼠标在文字周围移动

作用层：text

### 实现方法

多层DOM文字在Z轴错开形成挤出厚度，前景文字和深度副本通过CSS三维变换跟随指针视差。

1. 在React客户端引入锁定registry的DepthText.css、DepthText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按layers与depth生成深度层，层色按进度插值，使用perspective及平滑指针偏移旋转整个字形舞台。
3. 使用源码已提供的text、layers、depth、faceColor、depthColor、tilt等属性配置；触发依据：鼠标在文字周围移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- text：锁定源码默认：'Elevate'
- layers：锁定源码默认：34
- depth：锁定源码默认：2.4
- faceColor：锁定源码默认：'#f8fafc'
- depthColor：锁定源码默认：'#7c3aed'
- tilt：锁定源码默认：7.5
- pointerTracking：锁定源码默认：true
- smoothing：锁定源码默认：0.14
- perspective：锁定源码默认：900
- autoOrbit：锁定源码默认：true
- orbitSpeed：锁定源码默认：0.35
- fontSize：锁定源码默认：'clamp(3rem, 12vw, 7rem)'
- fontWeight：锁定源码默认：900
- shadow：锁定源码默认：true

### 适用场景

- 产品数字海报
- 游戏活动主标题

避免用于：

- 长正文与精密公式

### 限制与接入建议

- 层数与depth过大会遮挡相邻内容；多层副本须避免被辅助技术重复朗读。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/DepthText-JS-CSS.json；资料核对时间：2026-10-25T07:52:54.484Z；SHA256：9e8b33f2e2064b8a2640dbd23ac117090bfb55e076a2761579b8390aed72b462；哈希对象：registry-response；文件：DepthText.css、DepthText.jsx

---

## 纸张折叠展开文字 · Fold Text

案例ID：b8047600d889bd4c

来源：https://reactbits.dev/text-animations/fold-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

文字行像折起来的纸张一样展开，逐步摊平到阅读位置。

触发：文字入场时展开

作用层：text

### 实现方法

将文字按行或词分组，各段围绕配置铰链以CSS三维旋转展开，GSAP时间线控制错峰与折痕阴影。

1. 在React客户端引入锁定registry的FoldText.css、FoldText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按splitBy建立折叠单元，以hinge设置transform-origin和perspective，滚动到达或配置触发时播放duration与stagger。
3. 使用源码已提供的text、splitBy、hinge、duration、stagger、ease等属性配置；触发依据：文字入场时展开。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时只清理本实例观察器或滚动触发，避免全局销毁其他动效。

依赖：gsap@^3.13.0

参数：

- text：锁定源码默认：'Design unfolds'
- splitBy：锁定源码默认：'char'
- hinge：锁定源码默认：'top'
- duration：锁定源码默认：0.65
- stagger：锁定源码默认：0.045
- ease：锁定源码默认：'power3.out'
- perspective：锁定源码默认：700
- creaseShading：锁定源码默认：0.55
- trigger：锁定源码默认：'mount'
- fontSize：锁定源码默认：80
- fontWeight：锁定源码默认：800
- color：锁定源码默认：'#f7f2e8'

### 适用场景

- 编辑栏目标题
- 故事章节过渡

避免用于：

- 需持续可见的操作说明

### 限制与接入建议

- 折叠是入场运动，不应无限循环折起正在阅读的文字。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/FoldText-JS-CSS.json；资料核对时间：2026-10-25T07:52:54.528Z；SHA256：5dda3dfa192336f384a2297c5677deea3cf07d9df961998ad8489eb94e7b3e63；哈希对象：registry-response；文件：FoldText.css、FoldText.jsx

---

## 重影回收文字 · Echo Text

案例ID：ded9624fa8a051df

来源：https://reactbits.dev/text-animations/echo-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

文字后方的多层残影跟随运动，随后收拢成清晰的单一文字。

触发：文字入场或切换时

作用层：text

### 实现方法

重复字形副本分层绘制，位置以不同滞后量追随目标或入场位移，副本最终回收到清晰文字。

1. 在React客户端引入锁定registry的EchoText.css、EchoText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 根据echoes、offset与direction生成影子层，每层使用不同lag和fade，按mode区分入场或指针响应。
3. 使用源码已提供的text、echoes、lag、offset、direction、fade等属性配置；触发依据：文字入场或切换时。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- text：锁定源码默认：'Motion Echo'
- echoes：锁定源码默认：12
- lag：锁定源码默认：0.24
- offset：锁定源码默认：36
- direction：锁定源码默认：'right'
- fade：锁定源码默认：0.72
- blur：锁定源码默认：3
- tint：锁定源码默认：'#7dd3fc'
- mode：锁定源码默认：'both'
- cursorRadius：锁定源码默认：320
- duration：锁定源码默认：900
- ease：锁定源码默认：'ease-out'
- fontSize：锁定源码默认：'clamp(3rem, 9vw, 7rem)'
- fontWeight：锁定源码默认：800
- color：锁定源码默认：'#f8fafc'

### 适用场景

- 音乐活动标题
- 速度感品牌文案

避免用于：

- 阅读和辅助工具正文

### 限制与接入建议

- 残影复制会增加视觉噪声；副本仅作装饰，文字语义保留一次。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/EchoText-JS-CSS.json；资料核对时间：2026-10-25T07:52:54.564Z；SHA256：4bbbf1d56fe121a5e04b2abe03a759886d363b6d54852ca0098b9bc95ceafbef；哈希对象：registry-response；文件：EchoText.css、EchoText.jsx

---

## 逐字错峰入场 · Split Text

案例ID：1dd72ecf061a5ad2

来源：https://reactbits.dev/text-animations/split-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

文字拆成单字或单词，以时间差依次进入画面。

触发：文字进入视野

作用层：text

### 实现方法

GSAP SplitText将真实文字拆为字符或单词，ScrollTrigger在阈值进入时错峰执行from到to的动画。

1. 在React客户端引入锁定registry的SplitText/SplitText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 等待字体加载并创建拆字实例，把splitType对应目标交给GSAP；delay是错峰间隔，duration为单次过渡时长。
3. 使用源码已提供的delay、duration、ease、splitType、from、to等属性配置；触发依据：文字进入视野。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时只清理本实例观察器或滚动触发，避免全局销毁其他动效。

依赖：gsap@^3.13.0、@gsap/react@^2.1.2

参数：

- delay：锁定源码默认：50
- duration：锁定源码默认：1.25
- ease：锁定源码默认：'power3.out'
- splitType：锁定源码默认：'chars'
- from：锁定源码默认：{ opacity: 0, y: 40 }
- to：锁定源码默认：{ opacity: 1, y: 0 }
- threshold：锁定源码默认：0.1
- rootMargin：锁定源码默认：'-100px'
- textAlign：锁定源码默认：'center'
- tag：锁定源码默认：'p'

### 适用场景

- 短标题入场
- 课程章节标题

避免用于：

- 每次输入都重新拆分的编辑器

### 限制与接入建议

- 该锁定版依赖GSAP和@gsap/react；不要把delay默认50与duration默认1.25误当同一单位。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。
- 源码接入注意：清理阶段使用ScrollTrigger.getAll().forEach(...kill...)会影响整页其他实例；集成时应改为只清理本实例创建的trigger，避免破坏其他滚动动效。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/SplitText-JS-CSS.json；资料核对时间：2026-10-25T07:52:54.582Z；SHA256：6225f5e7a1c7ccefb2b1f1c4e773a2fd2a2c1687c88f42be95101a5540fabfea；哈希对象：registry-response；文件：SplitText/SplitText.jsx

---

## 由模糊变清晰的文字 · Blur Text

案例ID：9b7cf84ef53c3790

来源：https://reactbits.dev/text-animations/blur-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

文字先呈模糊状态，再分批变为清晰的字形，形成柔和揭示。

触发：文字进入视野

作用层：text

### 实现方法

Motion为拆分后的词或字建立多段关键帧，IntersectionObserver达到阈值后由模糊与偏移过渡到清晰。

1. 在React客户端引入锁定registry的BlurText/BlurText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按animateBy分词，记录一次可见状态，将from与to快照构成关键帧并按delay错峰播放。
3. 使用源码已提供的text、delay、animateBy、direction、threshold、rootMargin等属性配置；触发依据：文字进入视野。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12

参数：

- text：锁定源码默认：''
- delay：锁定源码默认：200
- animateBy：锁定源码默认：'words'
- direction：锁定源码默认：'top'
- threshold：锁定源码默认：0.1
- rootMargin：锁定源码默认：'0px'
- stepDuration：锁定源码默认：0.35

### 适用场景

- 介绍标题
- 产品短说明

避免用于：

- 加载失败时仍应出现的主要答案

### 限制与接入建议

- 这是视口触发的模糊揭示，不是滚动进度连续控制的ScrollReveal。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/BlurText-JS-CSS.json；资料核对时间：2026-10-25T07:52:55.017Z；SHA256：80ae33b9511d52afb229b9b5d70043f9843934fb60cb359abde9a8773a14fc8c；哈希对象：registry-response；文件：BlurText/BlurText.jsx

---

## 圆环旋转文字 · Circular Text

案例ID：c89f5b0c87516639

来源：https://reactbits.dev/text-animations/circular-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

字符围绕圆周排列，可持续旋转形成文字圆环。

触发：页面展示后旋转；可配置悬停速度

作用层：text

### 实现方法

将字符依索引旋转排列成圆环，Motion控制容器旋转，悬停行为可减速、加速或暂停。

1. 在React客户端引入锁定registry的CircularText.css、CircularText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 计算每字角度并保持相同圆心，以spinDuration启动循环，onHover切换旋转过渡且保留当前角度。
3. 使用源码已提供的spinDuration、onHover等属性配置；触发依据：页面展示后旋转；可配置悬停速度。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12

参数：

- spinDuration：锁定源码默认：20
- onHover：锁定源码默认：'speedUp'

### 适用场景

- 品牌印章
- 滚动提示徽章

避免用于：

- 主要导航或长段落

### 限制与接入建议

- 文字长度、字号和圆半径必须匹配；圆周排列不适合长句阅读。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/CircularText-JS-CSS.json；资料核对时间：2026-10-25T07:52:54.986Z；SHA256：ac2255d97c2a2c2b799494504089af7b84e26c7d319a679436f9df564b097d40；哈希对象：registry-response；文件：CircularText.css、CircularText.jsx

---

## 打字机文字 · Text Type

案例ID：c7e4ca3afbfbb4d3

来源：https://reactbits.dev/text-animations/text-type

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

文字按打字节奏逐字出现，配合闪烁光标，可循环多段内容。

触发：组件入场后自动打字；按配置循环

作用层：text

### 实现方法

计时器逐字符推进当前短句，停顿后逐步删除并进入下一句，GSAP处理光标闪烁。

1. 在React客户端引入锁定registry的TextType.css、TextType.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用typingSpeed、pauseDuration和deletingSpeed维护打字、等待和删除状态，循环依据loop与文本数组推进。
3. 使用源码已提供的as、typingSpeed、initialDelay、pauseDuration、deletingSpeed、loop等属性配置；触发依据：组件入场后自动打字；按配置循环。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：gsap@^3.13.0

参数：

- as：锁定源码默认：'div'
- typingSpeed：锁定源码默认：50
- initialDelay：锁定源码默认：0
- pauseDuration：锁定源码默认：2000
- deletingSpeed：锁定源码默认：30
- loop：锁定源码默认：true
- showCursor：锁定源码默认：true
- hideCursorWhileTyping：锁定源码默认：false
- cursorCharacter：锁定源码默认：'|'
- cursorClassName：锁定源码默认：''
- cursorBlinkDuration：锁定源码默认：0.5
- textColors：锁定源码默认：[]
- startOnVisible：锁定源码默认：false
- reverseMode：锁定源码默认：false

### 适用场景

- 智能体欢迎语
- 产品能力副标题

避免用于：

- 伪装真实AI生成过程

### 限制与接入建议

- 动态显示不等于真实模型流式响应；快速循环会让读屏反复播报。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/TextType-JS-CSS.json；资料核对时间：2026-10-25T07:52:54.996Z；SHA256：8a845eb399ddb0639b000e3152e9a91067e5b2f4b453612ea6609b8741d5c276；哈希对象：registry-response；文件：TextType.css、TextType.jsx

---

## 洗牌揭示文字 · Shuffle

案例ID：cf838cdb74b5a398

来源：https://reactbits.dev/text-animations/shuffle

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

字母先以快速变化和错位洗牌的方式运动，再停在目标文字上。

触发：文字入场或配置的交互触发

作用层：text

### 实现方法

GSAP拆字后创建滚动字轮包装，每字经历随机延迟与方向位移，再停在目标字符上。

1. 在React客户端引入锁定registry的Shuffle.css、Shuffle.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量字符尺寸生成滚轮副本，用shuffleDirection和maxDelay编排字轮时间线，结束时恢复目标字形。
3. 使用源码已提供的shuffleDirection、duration、maxDelay、ease、threshold、rootMargin等属性配置；触发依据：文字入场或配置的交互触发。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时只清理本实例观察器或滚动触发，避免全局销毁其他动效。

依赖：gsap@^3.13.0、@gsap/react@^2.1.2

参数：

- shuffleDirection：锁定源码默认：'right'
- duration：锁定源码默认：0.35
- maxDelay：锁定源码默认：0
- ease：锁定源码默认：'power3.out'
- threshold：锁定源码默认：0.1
- rootMargin：锁定源码默认：'-100px'
- tag：锁定源码默认：'p'
- textAlign：锁定源码默认：'center'
- shuffleTimes：锁定源码默认：1
- animationMode：锁定源码默认：'evenodd'
- loop：锁定源码默认：false
- loopDelay：锁定源码默认：0
- stagger：锁定源码默认：0.03
- scrambleCharset：锁定源码默认：''
- triggerOnce：锁定源码默认：true
- respectReducedMotion：锁定源码默认：true
- triggerOnHover：锁定源码默认：true

### 适用场景

- 活动标题
- 创意品牌短句

避免用于：

- 可信实时数值

### 限制与接入建议

- 随机洗牌只作标题装饰，不能改变真实数据值或表单文本。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Shuffle-JS-CSS.json；资料核对时间：2026-10-25T07:52:55.023Z；SHA256：babab6e023efb370aa8edc7f085eff321fc4d285557a8882e48dbbe4e1bcb36b；哈希对象：registry-response；文件：Shuffle.css、Shuffle.jsx

---

## 光泽扫过文字 · Shiny Text

案例ID：e4c2a95b44f285ff

来源：https://reactbits.dev/text-animations/shiny-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

亮带扫过文字，产生金属反光或发光的字面，可按配置响应悬停与滚动。

触发：持续扫光；可配置悬停或滚动触发

作用层：text

### 实现方法

文字裁切渐变高光带并按时间或交互推进亮带位置，色彩和柔和度决定金属扫光质感。

1. 在React客户端引入锁定registry的ShinyText.css、ShinyText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以文字作为可读前景，使用shineColor、angle、shineWidth与bands构造亮带，按触发方式更新高光进度。
3. 使用源码已提供的color、shineColor、speed、delay、angle、shineWidth等属性配置；触发依据：持续扫光；可配置悬停或滚动触发。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- color：锁定源码默认：'#b5b5b5'
- shineColor：锁定源码默认：'#ffffff'
- speed：锁定源码默认：2
- delay：锁定源码默认：0
- angle：锁定源码默认：120
- shineWidth：锁定源码默认：40
- softness：锁定源码默认：0.8
- bands：锁定源码默认：1
- glow：锁定源码默认：0
- direction：锁定源码默认：'left'
- easing：锁定源码默认：'smooth'
- trigger：锁定源码默认：'loop'
- yoyo：锁定源码默认：false
- followPointer：锁定源码默认：false
- pauseOnHover：锁定源码默认：false
- disabled：锁定源码默认：false

### 适用场景

- 重点标签
- 品牌短标题

避免用于：

- 整篇文章持续扫光

### 限制与接入建议

- 只作用于字面而非卡片边框；高亮不能使文字与背景短时失去对比。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ShinyText-JS-CSS.json；资料核对时间：2026-10-25T07:52:55.121Z；SHA256：bbfad744e11b2201a725f7c064b91324aa56c46f00045fb128cd99f0c0077d85；哈希对象：registry-response；文件：ShinyText.css、ShinyText.jsx

---

## 鼠标挤压字形 · Text Pressure

案例ID：b1968995127d84dc

来源：https://reactbits.dev/text-animations/text-pressure

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

鼠标接近不同字母时，字母大小或可变字形宽度等属性连续改变。

触发：鼠标在文字区域移动

作用层：text

### 实现方法

按指针到各字符中心的距离映射可变字体粗细、宽度、斜度或透明度，逐帧平滑逼近。

1. 在React客户端引入锁定registry的TextPressure/TextPressure.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 加载支持相应轴的fontUrl并测量字符位置，根据width、weight和italic开关更新font-variation-settings。
3. 使用源码已提供的text、fontFamily、fontUrl、width、weight、italic等属性配置；触发依据：鼠标在文字区域移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- text：锁定源码默认：'Compressa'
- fontFamily：锁定源码默认：'Roboto Flex'
- fontUrl：锁定源码默认：'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap'
- width：锁定源码默认：true
- weight：锁定源码默认：true
- italic：锁定源码默认：true
- alpha：锁定源码默认：false
- flex：锁定源码默认：true
- stroke：锁定源码默认：false
- scale：锁定源码默认：false
- textColor：锁定源码默认：'#FFFFFF'
- strokeColor：锁定源码默认：'#FF0000'
- minFontSize：锁定源码默认：24

### 适用场景

- 字体体验区
- 艺术作品集标题

避免用于：

- 数学公式或密排正文

### 限制与接入建议

- 依赖真实可变字体轴，普通字体不一定产生同等变形；需避免挤压相邻布局。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/TextPressure-JS-CSS.json；资料核对时间：2026-10-25T07:52:55.451Z；SHA256：ad23efbbece84bb9af013e157c2218a49badc3a7f95916b3c1d49ccd36b57983；哈希对象：registry-response；文件：TextPressure/TextPressure.jsx

---

## 可拖动的弯曲文字循环 · Curved Loop

案例ID：991f76c3cda44465

来源：https://reactbits.dev/text-animations/curved-loop

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

一串文字沿可调弯曲路径循环移动，可以拖动改变运动。

触发：持续循环；拖动文字带

作用层：text

### 实现方法

SVG textPath沿弯曲路径连续移动，指针拖动改变文字偏移和方向，松开后继续循环。

1. 在React客户端引入锁定registry的CurvedLoop.css、CurvedLoop.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量重复文字长度并建立路径，以speed更新startOffset；拖动时累计局部横向差值并环绕偏移范围。
3. 使用源码已提供的marqueeText、speed、curveAmount、direction、interactive等属性配置；触发依据：持续循环；拖动文字带。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- marqueeText：锁定源码默认：''
- speed：锁定源码默认：2
- curveAmount：锁定源码默认：400
- direction：锁定源码默认：'left'
- interactive：锁定源码默认：true

### 适用场景

- 可拖动品牌分隔带
- 活动口号

避免用于：

- 重要操作入口

### 限制与接入建议

- 拖动文字是装饰交互，不自动具备可选项目或链接导航。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/CurvedLoop-JS-CSS.json；资料核对时间：2026-10-25T07:52:55.455Z；SHA256：a6e7d64af777c2ebf5a2116a71d2fc51b3d8fcab9470f900acc660ed99ce637a；哈希对象：registry-response；文件：CurvedLoop.css、CurvedLoop.jsx

---

## 抖动噪声文字 · Fuzzy Text

案例ID：8877752f1de65291

来源：https://reactbits.dev/text-animations/fuzzy-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

字形边缘持续产生毛糙抖动，悬停时可增强失焦和噪声幅度。

触发：持续抖动；鼠标悬停改变强度

作用层：text

### 实现方法

离屏Canvas生成清晰字形，再逐扫描行以随机横向偏移重绘到主Canvas形成毛糙抖动。

1. 在React客户端引入锁定registry的FuzzyText/FuzzyText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 先测量字体与文字边界，按fps节流重绘；指针进入时在baseIntensity与hoverIntensity之间切换扰动。
3. 使用源码已提供的fontSize、fontWeight、fontFamily、color、enableHover、baseIntensity等属性配置；触发依据：持续抖动；鼠标悬停改变强度。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- fontSize：锁定源码默认：'clamp(2rem, 8vw, 8rem)'
- fontWeight：锁定源码默认：900
- fontFamily：锁定源码默认：'inherit'
- color：锁定源码默认：'#fff'
- enableHover：锁定源码默认：true
- baseIntensity：锁定源码默认：0.18
- hoverIntensity：锁定源码默认：0.5
- fuzzRange：锁定源码默认：30
- fps：锁定源码默认：60
- direction：锁定源码默认：'horizontal'
- transitionDuration：锁定源码默认：0
- clickEffect：锁定源码默认：false
- glitchMode：锁定源码默认：false
- glitchInterval：锁定源码默认：2000
- glitchDuration：锁定源码默认：200
- gradient：锁定源码默认：null
- letterSpacing：锁定源码默认：0

### 适用场景

- 实验海报标题
- 创意错误页

避免用于：

- 题目、答案和关键通知

### 限制与接入建议

- 噪声抖动可能明显降低可读性，不能用于必须持续读懂的正文。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/FuzzyText-JS-CSS.json；资料核对时间：2026-10-25T07:52:55.472Z；SHA256：2133e682f3539c628b461d17f8aaef2c613c59c49e927f587a7e252044a0ab25；哈希对象：registry-response；文件：FuzzyText/FuzzyText.jsx

---

## 流动渐变文字 · Gradient Text

案例ID：e70bb8efb1b8783a

来源：https://reactbits.dev/text-animations/gradient-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

渐变颜色在字形内部流动，可选线性扫动、网格流动或扇形旋转。

触发：持续渐变动画；可配置鼠标响应

作用层：text

### 实现方法

DOM文字通过背景裁切显示渐变，脚本按variant推进线性、网格色团或扇形旋转的背景参数。

1. 在React客户端引入锁定registry的GradientText.css、GradientText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 选择实际variant与colors，使用animationSpeed更新渐变相位，字形保持DOM语义且边框需独立配置。
3. 使用源码已提供的colors、animationSpeed、variant、angle、scale、yoyo等属性配置；触发依据：持续渐变动画；可配置鼠标响应。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- colors：锁定源码默认：['#5227FF', '#FF9FFC', '#B497CF']
- animationSpeed：锁定源码默认：8
- variant：锁定源码默认：'linear'
- angle：锁定源码默认：90
- scale：锁定源码默认：3
- yoyo：锁定源码默认：true
- glow：锁定源码默认：0
- showBorder：锁定源码默认：false
- borderWidth：锁定源码默认：1.5
- pauseOnHover：锁定源码默认：false
- followPointer：锁定源码默认：false

### 适用场景

- 品牌标题
- 重点数字或口号

避免用于：

- 所有正文都采用流动渐变

### 限制与接入建议

- 效果在字形内部，不代表整个页面渐变；showBorder是额外外层视觉。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/GradientText-JS-CSS.json；资料核对时间：2026-10-25T07:52:55.495Z；SHA256：e8b62fe80b4a2f964b9875cdaa65d3f4caf37583cd8aac53600a172d6e9d1be2；哈希对象：registry-response；文件：GradientText.css、GradientText.jsx

---

## 重力掉落文字 · Falling Text

案例ID：7b222e5c19abc17d

来源：https://reactbits.dev/text-animations/falling-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

文字碎片受重力下落并弹跳，形成可玩的掉字效果。

触发：按配置在入场、悬停、点击或滚动时触发

作用层：text

### 实现方法

Matter.js将字或词对应为刚体，设置重力与碰撞边界，允许指针拖动后回到文字布局。

1. 在React客户端引入锁定registry的FallingText.css、FallingText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 先测量文字片段生成碰撞体，按trigger启用物理世界，以gravity、bounciness和scatter控制掉落与重排。
3. 使用源码已提供的text、highlightWords、highlightClass、trigger、variant、split等属性配置；触发依据：按配置在入场、悬停、点击或滚动时触发。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：matter-js@^0.20.0

参数：

- text：锁定源码默认：''
- highlightWords：锁定源码默认：[]
- highlightClass：锁定源码默认：'highlighted'
- trigger：锁定源码默认：'auto'
- variant：锁定源码默认：'text'
- split：锁定源码默认：'words'
- gravity：锁定源码默认：1
- bounciness：锁定源码默认：0.2
- scatter：锁定源码默认：0.5
- stagger：锁定源码默认：0.03
- order：锁定源码默认：'random'
- draggable：锁定源码默认：true
- mouseConstraintStiffness：锁定源码默认：0.2
- cursorPush：锁定源码默认：0.5
- restoreDelay：锁定源码默认：0
- fontSize：锁定源码默认：'1rem'
- accentColor：锁定源码默认：'#5b8cff'
- theme：锁定源码默认：'dark'
- backgroundColor：锁定源码默认：'transparent'
- wireframes：锁定源码默认：false

### 适用场景

- 互动语言实验
- 创意活动标题

避免用于：

- 重要操作说明

### 限制与接入建议

- 物理文字不能作为唯一阅读版本；容器高度不足会让内容掉出视野。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/FallingText-JS-CSS.json；资料核对时间：2026-10-25T07:52:55.695Z；SHA256：cf02f05db0446f88426ff137af48dd5e2a31a8868f31f3c85684961e70692e2e；哈希对象：registry-response；文件：FallingText.css、FallingText.jsx

---

## 跟随鼠标的文字尾迹 · Text Cursor

案例ID：26dc1f839d2d599d

来源：https://reactbits.dev/text-animations/text-cursor

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

指定文字跟随鼠标移动，并留下逐渐消失的文字副本。

触发：鼠标移动

作用层：text

### 实现方法

指针轨迹按间距采样并从DOM字符池分配印章、链条或丝带文字，副本按寿命收缩淡出。

1. 在React客户端引入锁定registry的TextCursor.css、TextCursor.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按spacing限制轨迹点数量，用maxPoints、exitDuration及removalInterval回收文字副本，角度可跟随移动方向。
3. 使用源码已提供的text、mode、spacing、maxPoints、followMouseDirection、randomFloat等属性配置；触发依据：鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- text：锁定源码默认：'Hello'
- mode：锁定源码默认：'stamp'
- spacing：锁定源码默认：88
- maxPoints：锁定源码默认：7
- followMouseDirection：锁定源码默认：true
- randomFloat：锁定源码默认：true
- exitDuration：锁定源码默认：0.5
- removalInterval：锁定源码默认：30
- shrink：锁定源码默认：0.5
- fade：锁定源码默认：0.6
- smoothing：锁定源码默认：0.3
- popIn：锁定源码默认：true
- keepUpright：锁定源码默认：true
- hideCursor：锁定源码默认：false
- color：锁定源码默认：'currentColor'
- fontSize：锁定源码默认：28
- fontWeight：锁定源码默认：600
- fontFamily：锁定源码默认：'inherit'

### 适用场景

- 创意作品区
- 品牌互动幕布

避免用于：

- 密集表单和办公工具

### 限制与接入建议

- 尾迹是装饰输出，不应遮盖原生光标或拦截页面点击。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/TextCursor-JS-CSS.json；资料核对时间：2026-10-25T07:52:55.920Z；SHA256：5f730bcba332c6caaa2d8f00e1ffcf073970e2fc929ccee06246a3427e5f1eb1；哈希对象：registry-response；文件：TextCursor.css、TextCursor.jsx

---

## 乱码解密文字 · Decrypted Text

案例ID：645105a8d911227c

来源：https://reactbits.dev/text-animations/decrypted-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

字符先轮换为随机符号，再逐个恢复为真实文字，像正在解码。

触发：按配置在入场或悬停时解密

作用层：text

### 实现方法

保存已揭示字符集合，定时将未揭示位置替换为随机符号，再按顺序或随机位置还原原文。

1. 在React客户端引入锁定registry的DecryptedText/DecryptedText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按characters与speed安排混排，sequential和revealDirection决定逐字揭示次序，触发后清理旧interval。
3. 使用源码已提供的speed、maxIterations、sequential、revealDirection、useOriginalCharsOnly、characters等属性配置；触发依据：按配置在入场或悬停时解密。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12

参数：

- speed：锁定源码默认：50
- maxIterations：锁定源码默认：10
- sequential：锁定源码默认：false
- revealDirection：锁定源码默认：'start'
- useOriginalCharsOnly：锁定源码默认：false
- characters：锁定源码默认：'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+'
- parentClassName：锁定源码默认：''
- encryptedClassName：锁定源码默认：''
- animateOn：锁定源码默认：'hover'
- clickMode：锁定源码默认：'once'

### 适用场景

- 科技活动标题
- 探索式标签

避免用于：

- 安全凭据或加密功能展示

### 限制与接入建议

- 仅适合短标签，不能对真实密码或安全状态声称实施了解密。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/DecryptedText-JS-CSS.json；资料核对时间：2026-10-25T07:52:55.913Z；SHA256：2047008b8e4ee9a033d5cdd07c47c95df01a6dd9d8f3f78c65b423c1ae24c314；哈希对象：registry-response；文件：DecryptedText/DecryptedText.jsx

---

## 单词轮流聚焦 · True Focus

案例ID：5c78f7cb4f8acf22

来源：https://reactbits.dev/text-animations/true-focus

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

一组词轮流变清晰，其他词保持模糊，突出当前聚焦的词。

触发：自动轮换或按配置悬停聚焦

作用层：text

### 实现方法

在DOM单词间切换活动索引，非活动词应用模糊，Motion将边角聚焦框移到活动词边界。

1. 在React客户端引入锁定registry的TrueFocus.css、TrueFocus.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按sentence分组，测量词矩形并转换到容器坐标；自动计时或manualMode的鼠标进入更新焦点。
3. 使用源码已提供的sentence、separator、manualMode、blurAmount、borderColor、glowColor等属性配置；触发依据：自动轮换或按配置悬停聚焦。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12

参数：

- sentence：锁定源码默认：'True Focus'
- separator：锁定源码默认：' '
- manualMode：锁定源码默认：false
- blurAmount：锁定源码默认：5
- borderColor：锁定源码默认：'green'
- glowColor：锁定源码默认：'rgba(0, 255, 0, 0.6)'
- animationDuration：锁定源码默认：0.5
- pauseBetweenAnimations：锁定源码默认：1

### 适用场景

- 品牌关键词
- 核心能力轮播

避免用于：

- 长篇阅读和键盘操作指引

### 限制与接入建议

- 焦点动画不是浏览器键盘焦点；不可用模糊隐藏理解所需的重要词。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/TrueFocus-JS-CSS.json；资料核对时间：2026-10-25T07:52:55.931Z；SHA256：e1c283bd26d6a2f49f411cbfec6c4f90fdee107d6b0c10a4d1fbbd37ba7dd382；哈希对象：registry-response；文件：TrueFocus.css、TrueFocus.jsx

---

## 滚动浮现文字 · Scroll Float

案例ID：a5ff7281c987363e

来源：https://reactbits.dev/text-animations/scroll-float

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

滚动页面时，文字随进度浮起并从压缩状态恢复到完整字形。

触发：页面滚动经过文字

作用层：text

### 实现方法

GSAP把文字拆分为字符并将滚动区间映射到缩放、位置等显现进度，各字符按stagger错峰恢复字形。

1. 在React客户端引入锁定registry的ScrollFloat.css、ScrollFloat.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 建立ScrollTrigger的scrollStart与scrollEnd，让各字符依stagger在滚动过程中恢复正常姿态。
3. 使用源码已提供的containerClassName、textClassName、animationDuration、ease、scrollStart、scrollEnd等属性配置；触发依据：页面滚动经过文字。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时只清理本实例观察器或滚动触发，避免全局销毁其他动效。

依赖：gsap@^3.13.0

参数：

- containerClassName：锁定源码默认：''
- textClassName：锁定源码默认：''
- animationDuration：锁定源码默认：1
- ease：锁定源码默认：'back.inOut(2)'
- scrollStart：锁定源码默认：'center bottom+=50%'
- scrollEnd：锁定源码默认：'bottom bottom-=40%'
- stagger：锁定源码默认：0.03

### 适用场景

- 故事章节标题
- 长页过渡

避免用于：

- 没有滚动空间的固定面板

### 限制与接入建议

- 运动由滚动进度驱动，不能当成自动循环动画或一次淡入的同义词。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ScrollFloat-JS-CSS.json；资料核对时间：2026-10-25T07:52:55.950Z；SHA256：efe8970bcb0282b91ecb2312af6c3f9233b4ef12820d52b5ab9bf399c1076494；哈希对象：registry-response；文件：ScrollFloat.css、ScrollFloat.jsx

---

## 滚动揭示段落 · Scroll Reveal

案例ID：59b6d2fad7438493

来源：https://reactbits.dev/text-animations/scroll-reveal

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

文字随着滚动从模糊、低透明度状态逐步变清晰。

触发：页面滚动经过段落

作用层：text

### 实现方法

GSAP拆词后将滚动位置映射到逐词透明度、模糊和容器旋转，文字随滚动逐步可读。

1. 在React客户端引入锁定registry的ScrollReveal.css、ScrollReveal.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 先保留语义段落，配置baseOpacity、enableBlur与blurStrength，再以ScrollTrigger驱动词级清晰度。
3. 使用源码已提供的enableBlur、baseOpacity、baseRotation、blurStrength、containerClassName、textClassName等属性配置；触发依据：页面滚动经过段落。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时只清理本实例观察器或滚动触发，避免全局销毁其他动效。

依赖：gsap@^3.13.0

参数：

- enableBlur：锁定源码默认：true
- baseOpacity：锁定源码默认：0.1
- baseRotation：锁定源码默认：3
- blurStrength：锁定源码默认：4
- containerClassName：锁定源码默认：''
- textClassName：锁定源码默认：''
- rotationEnd：锁定源码默认：'bottom bottom'
- wordAnimationEnd：锁定源码默认：'bottom bottom'

### 适用场景

- 叙事品牌介绍
- 简短章节引文

避免用于：

- 考试题目和答案主体

### 限制与接入建议

- 滚动未达终点时部分文字会较淡，重要正文应提供立即可读的降级。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。
- 源码接入注意：清理阶段使用ScrollTrigger.getAll().forEach(...kill...)会影响整页其他实例；集成时应改为只清理本实例创建的trigger，避免破坏其他滚动动效。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ScrollReveal-JS-CSS.json；资料核对时间：2026-10-25T07:52:56.241Z；SHA256：e57355a122e5c2a810959458090b13d93102a663d8f40aa68787a9d6dd6fe54d；哈希对象：registry-response；文件：ScrollReveal.css、ScrollReveal.jsx

---

## 字符拼成的立体文字 · ASCII Text

案例ID：8b719de8172ed16c

来源：https://reactbits.dev/text-animations/ascii-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

大字由密集的 ASCII 字符组成，随指针倾斜，悬停扰乱字符，点击产生波纹。

触发：鼠标移动、悬停和点击

作用层：text

### 实现方法

以Canvas栅格化文字和字符图集，WebGL着色器将字形覆盖转换为ASCII字符密度并加入指针扰动。

1. 在React客户端引入锁定registry的ASCIIText/ASCIIText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 生成文字纹理和字符图集，按asciiFontSize与charset离散采样，在GPU合成字块、倾斜及点击涟漪。
3. 使用源码已提供的text、asciiFontSize、charset、fontFamily、fontWeight、textColor等属性配置；触发依据：鼠标移动、悬停和点击。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- text：锁定源码默认：'Hey!'
- asciiFontSize：锁定源码默认：8
- charset：锁定源码默认：CHARSET
- fontFamily：锁定源码默认：FONT
- fontWeight：锁定源码默认：600
- textColor：锁定源码默认：'#fdf9f3'
- colors：锁定源码默认：['#ff6188', '#fc9867', '#ffd866']
- textScale：锁定源码默认：1
- blocks：锁定源码默认：0.9
- waves：锁定源码默认：1
- waveSpeed：锁定源码默认：1
- chroma：锁定源码默认：1
- tilt：锁定源码默认：1
- hueShift：锁定源码默认：1
- scramble：锁定源码默认：0.6
- clickRipple：锁定源码默认：true
- intro：锁定源码默认：true
- idle：锁定源码默认：true
- interactive：锁定源码默认：true
- theme：锁定源码默认：'dark'

### 适用场景

- 开发者主页
- 数字艺术字标

避免用于：

- 终端操作界面本体

### 限制与接入建议

- ASCII输出是装饰像素图，不是实际终端日志；字号过小影响辨识。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ASCIIText-JS-CSS.json；资料核对时间：2026-10-25T07:52:56.367Z；SHA256：7a60555bf2894ebc465b9f9bb86f1e4af74076d21ca8e38e945b45cb3e0a5056；哈希对象：registry-response；文件：ASCIIText/ASCIIText.jsx

---

## 鼠标扫过乱码文字 · Scrambled Text

案例ID：6aea3542080203f6

来源：https://reactbits.dev/text-animations/scrambled-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

鼠标经过段落时，附近字符短暂变成乱码并恢复。

触发：鼠标在文字上移动

作用层：text

### 实现方法

GSAP SplitText取得各字符节点，指针进入影响半径时用ScrambleText扰乱附近字符并恢复。

1. 在React客户端引入锁定registry的ScrambledText.css、ScrambledText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量字符相对指针距离，在radius内以scrambleChars、duration和speed播放局部混排。
3. 使用源码已提供的radius、duration、speed、scrambleChars等属性配置；触发依据：鼠标在文字上移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：gsap@^3.13.0

参数：

- radius：锁定源码默认：100
- duration：锁定源码默认：1.2
- speed：锁定源码默认：0.5
- scrambleChars：锁定源码默认：'.:'

### 适用场景

- 互动科技短文
- 展览说明标题

避免用于：

- 代码编辑器和公式正文

### 限制与接入建议

- 局部乱码仅作装饰，不应该改变用户正在输入或复制的内容。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ScrambledText-JS-CSS.json；资料核对时间：2026-10-25T07:52:56.379Z；SHA256：02348c3b02d72bd248908b5b3997694502295b689ae4542f0cb1ecf88fc43bfe；哈希对象：registry-response；文件：ScrambledText.css、ScrambledText.jsx

---

## 翻转轮换文字 · Rotating Text

案例ID：3d3570a2bfd1cf99

来源：https://reactbits.dev/text-animations/rotating-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多段词语或短句轮流以三维旋转、翻页方式切换。

触发：自动轮换或外部控制切换

作用层：text

### 实现方法

Motion的进入退出状态按活动索引切换短句，按字或词错峰呈现翻转、位移与淡出。

1. 在React客户端引入锁定registry的RotatingText.css、RotatingText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 维护currentText与next、previous等控制，逐段拆分并用AnimatePresence处理旧段退出和新段进入。
3. 以源码实际接口和受控状态配置；触发依据：自动轮换或外部控制切换。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12

参数：

未提取原始默认值，不自行补造。

### 适用场景

- 产品能力词轮换
- 短副标题

避免用于：

- 必须同时看到的多项条件

### 限制与接入建议

- 必须为不同文本长度预留空间，轮换不能让主按钮和布局持续跳动。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/RotatingText-JS-CSS.json；资料核对时间：2026-10-25T07:52:56.385Z；SHA256：637b1126c1e85c8ff5f09d192e90d423a379f6196a2811918445fb1684f2f5d0；哈希对象：registry-response；文件：RotatingText.css、RotatingText.jsx

---

## 故障错色文字 · Glitch Text

案例ID：b4e24f9dbf6d967a

来源：https://reactbits.dev/text-animations/glitch-text

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

文字出现红绿蓝错位、跳动和扭曲，形成电子故障风格。

触发：持续故障动画；可配置悬停触发

作用层：text

### 实现方法

CSS伪元素复制文字，使用裁切片段和红蓝等色彩阴影错位产生电子故障效果，保留真实字形作为基底。

1. 在React客户端引入锁定registry的GlitchText.css、GlitchText.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用data-text或副本层保持原字形，按speed驱动剪裁关键帧，enableOnHover限定是否仅悬停出现。
3. 使用源码已提供的speed、enableShadows、enableOnHover等属性配置；触发依据：持续故障动画；可配置悬停触发。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- speed：锁定源码默认：0.5
- enableShadows：锁定源码默认：true
- enableOnHover：锁定源码默认：false

### 适用场景

- 游戏活动字标
- 复古电子海报

避免用于：

- 无障碍阅读主体

### 限制与接入建议

- 故障闪变不能用于长正文或重要状态；副本应为装饰而非重复语义。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/GlitchText-JS-CSS.json；资料核对时间：2026-10-25T07:52:56.404Z；SHA256：58b77f1c472bd6eabf3f60ebb8c65c5dab6eb76c9a881e7fbefb89b30293f75d；哈希对象：registry-response；文件：GlitchText.css、GlitchText.jsx

---

## 随滚动加速的文字带 · Scroll Velocity

案例ID：4fb20de0a363d312

来源：https://reactbits.dev/text-animations/scroll-velocity

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

横向循环文字的速度与形变随用户滚动速度变化。

触发：页面滚动速度变化

作用层：text

### 实现方法

Motion读取滚动速度并经弹簧平滑，将速度映射为重复文字带的横向位移与方向变化。

1. 在React客户端引入锁定registry的ScrollVelocity.css、ScrollVelocity.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量文字单元宽度，生成numCopies副本，按velocityMapping把滚动速度乘入baseX并循环包裹位移。
3. 使用源码已提供的texts、velocity、damping、stiffness、numCopies、velocityMapping等属性配置；触发依据：页面滚动速度变化。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时只清理本实例观察器或滚动触发，避免全局销毁其他动效。

依赖：motion@^12.23.12

参数：

- texts：锁定源码默认：[]
- velocity：锁定源码默认：100
- damping：锁定源码默认：50
- stiffness：锁定源码默认：400
- numCopies：锁定源码默认：6
- velocityMapping：锁定源码默认：{ input: [0, 1000], output: [0, 5] }
- parallaxClassName：锁定源码默认：'parallax'
- scrollerClassName：锁定源码默认：'scroller'

### 适用场景

- 品牌跑马分隔带
- 作品集过渡

避免用于：

- 长文逐句阅读

### 限制与接入建议

- 复制数不足会露白；它展示滚动动势，不是新闻自动更新或真实速度仪表。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ScrollVelocity-JS-CSS.json；资料核对时间：2026-10-25T07:52:56.764Z；SHA256：0afd3c8902d3e2bb1ccb47e43976b611be250ce01885057b328a2087189d4fca；哈希对象：registry-response；文件：ScrollVelocity.css、ScrollVelocity.jsx

---

## 鼠标距离控制的字形 · Variable Proximity

案例ID：a545bd8c5654e0a5

来源：https://reactbits.dev/text-animations/variable-proximity

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

可变字体的粗细、宽度等属性按鼠标与字符的距离连续变化。

触发：鼠标接近文字

作用层：text

### 实现方法

逐字符测量指针到字形中心的距离，将距离衰减映射为from到to的可变字体轴设置，并逐帧更新字形属性。

1. 在React客户端引入锁定registry的VariableProximity.css、VariableProximity.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 解析字体轴配置，按radius与falloff逐字符插值font-variation-settings，触摸坐标与鼠标坐标使用同一局部参考。
3. 以源码实际接口和受控状态配置；触发依据：鼠标接近文字。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：motion@^12.23.12

参数：

未提取原始默认值，不自行补造。

### 适用场景

- 字体演示
- 交互标题

避免用于：

- 复杂公式或小字号标签

### 限制与接入建议

- 需要字体本身支持相应轴；屏幕阅读应保留原始文字，不依赖视觉变粗表达唯一状态。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/VariableProximity-JS-CSS.json；资料核对时间：2026-10-25T07:52:56.809Z；SHA256：1c79ae5a7da143ba8ca9537d86c656602da60e0aed75ba7d622cca10d46b70a2；哈希对象：registry-response；文件：VariableProximity.css、VariableProximity.jsx

---

## 数字递增计数 · Count Up

案例ID：c4f971c297eee7bd

来源：https://reactbits.dev/text-animations/count-up

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

数字从起始值平滑增长至目标值，支持小数和格式化展示。

触发：计数区域进入视野或数值变化

作用层：text

### 实现方法

Motion spring驱动一个数值，进入视野后由from变化到to，再按小数位与分隔符格式化。

1. 在React客户端引入锁定registry的CountUp/CountUp.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 通过可见状态启动motionValue，以duration和delay配置时序，将订阅值格式化后写入显示节点。
3. 使用源码已提供的from、direction、delay、duration、startWhen、separator等属性配置；触发依据：计数区域进入视野或数值变化。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在text层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12

参数：

- from：锁定源码默认：0
- direction：锁定源码默认：'up'
- delay：锁定源码默认：0
- duration：锁定源码默认：2
- startWhen：锁定源码默认：true
- separator：锁定源码默认：''

### 适用场景

- 已核验的运营统计
- 学习进度概览

避免用于：

- 虚构产品成绩或实时指标

### 限制与接入建议

- 必须使用真实数值或标注的演示数据，动画本身不产生统计结果。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：减小标题字号和拆字/复制层数量，重新测量换行；保留语义文字，触屏不依赖悬停，正文与公式不做此类变形。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/CountUp-JS-CSS.json；资料核对时间：2026-10-25T07:52:57.420Z；SHA256：b8e4bae40090bc34f1a22db1af7fe9d55d87263859469093212ee61e7c263691；哈希对象：registry-response；文件：CountUp/CountUp.jsx

---

## 电光玻璃球 · Crystalized Ball

案例ID：af3338036daf3477

来源：https://reactbits.dev/animations/crystalized-ball

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

玻璃球边缘闪烁电光，内部发光尘埃随指针旋转，点击时球体震动。

触发：入场发亮；鼠标移动搅动；点击震动

作用层：content

### 实现方法

OGL在片元着色器中合成玻璃球、发光尘埃和电弧状态，指针扰动与点击反馈改变局部场。

1. 在React客户端引入锁定registry的CrystalizedBall.css、CrystalizedBall.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 建立球面材质与粒子状态纹理，按preset、speed及hoverStrength更新uniform，点击时施加短暂扰动。
3. 使用源码已提供的preset、theme、size、speed、interactive、hoverStrength等属性配置；触发依据：入场发亮；鼠标移动搅动；点击震动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- preset：锁定源码默认：'plasma'
- theme：锁定源码默认：'dark'
- size：锁定源码默认：0.7
- speed：锁定源码默认：1
- interactive：锁定源码默认：true
- hoverStrength：锁定源码默认：0.7
- intro：锁定源码默认：true
- paused：锁定源码默认：false

### 适用场景

- 神秘主题入口
- 科技互动封面

避免用于：

- 声称真实物体建模的教学

### 限制与接入建议

- 这是着色器装饰球，不是可探索的真实三维模型或分子结构。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/CrystalizedBall-JS-CSS.json；资料核对时间：2026-10-25T07:52:57.734Z；SHA256：0c5c414cbb7b30b2ba35d1b6f39bf5b58f8117e880ae5276d825870688f1368f；哈希对象：registry-response；文件：CrystalizedBall.css、CrystalizedBall.jsx

---

## 闪电轮廓标志 · Electric Logo

案例ID：2214e73dc6d3c3cc

来源：https://reactbits.dev/animations/electric-logo

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

图片或 SVG 的轮廓变成流动电光，边缘迸出弧线，电荷随指针移动。

触发：持续电光动画；鼠标移动

作用层：content

### 实现方法

先把图片或SVG栅格化为覆盖与距离场，再由OGL着色器沿轮廓生成发光电弧与脉冲。

1. 在React客户端引入锁定registry的ElectricLogo.css、ElectricLogo.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 等待src加载生成边缘场，依据thickness、strands与bend采样电弧，并把指针电荷输入局部uniform。
3. 使用源码已提供的src、color、glowColor、scale、intensity、glow等属性配置；触发依据：持续电光动画；鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- src：锁定源码默认：BOLT
- color：锁定源码默认：'#ecc7ff'
- glowColor：锁定源码默认：'#ad6dff'
- scale：锁定源码默认：0.7
- intensity：锁定源码默认：1
- glow：锁定源码默认：1
- thickness：锁定源码默认：1.5
- strands：锁定源码默认：4
- bend：锁定源码默认：0.6
- crackle：锁定源码默认：1.5
- arcs：锁定源码默认：1
- flicker：锁定源码默认：0.6
- fill：锁定源码默认：0
- speed：锁定源码默认：2.5
- interactive：锁定源码默认：true
- cursorIntensity：锁定源码默认：0.75
- cursorRadius：锁定源码默认：100
- theme：锁定源码默认：'dark'

### 适用场景

- 品牌标志展示
- 电竞活动开场

避免用于：

- 正文卡片的普通描边

### 限制与接入建议

- 透明轮廓和清晰图源决定电弧形状；并非给任意DOM容器添加边框流光。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ElectricLogo-JS-CSS.json；资料核对时间：2026-10-25T07:52:56.913Z；SHA256：58b122b7dadefb8e54662950c67645fa665d27a4905a97ceb4220a6e7178570e；哈希对象：registry-response；文件：ElectricLogo.css、ElectricLogo.jsx

---

## 鼠标擦开双色照片 · Dither Veil

案例ID：af4c65556874cdf9

来源：https://reactbits.dev/animations/dither-veil

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

照片先呈双色抖色印刷状态，鼠标经过处恢复全彩，尾迹逐格回补。

触发：鼠标在图片上移动

作用层：surface

### 实现方法

图片纹理经抖色核映射到有限色阶，指针写入恢复遮罩，离开后遮罩衰减重新显示抖色。

1. 在React客户端引入锁定registry的DitherVeil.css、DitherVeil.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 加载src并按fit计算采样矩形，使用pattern、pixelSize和levels生成点阵，局部遮罩在指针移动后逐步回补。
3. 使用源码已提供的src、fit、pattern、pixelSize、levels、palette等属性配置；触发依据：鼠标在图片上移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- src：锁定源码默认：DEFAULT_SRC
- fit：锁定源码默认：'contain'
- pattern：锁定源码默认：'floyd'
- pixelSize：锁定源码默认：2
- levels：锁定源码默认：2
- palette：锁定源码默认：'duotone'
- inkColor：锁定源码默认：'#120f17'
- paperColor：锁定源码默认：'#f4f1ea'
- contrast：锁定源码默认：1.15
- brightness：锁定源码默认：0
- revealRadius：锁定源码默认：200
- softness：锁定源码默认：0.6
- linger：锁定源码默认：1
- rimColor：锁定源码默认：'#a78bfa'
- rim：锁定源码默认：0
- reverse：锁定源码默认：false
- wander：锁定源码默认：false
- clickBurst：锁定源码默认：true

### 适用场景

- 摄影作品封面
- 复古编辑专题

避免用于：

- 真实图像增强工具

### 限制与接入建议

- 图片需要可用的纹理访问与可见尺寸；恢复颜色是视觉揭示，不是图像修复。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/DitherVeil-JS-CSS.json；资料核对时间：2026-10-25T07:52:57.222Z；SHA256：a14f4540ca6ceb42c8ff290db06e7a2e74e2fe85cf78eb45655f0b427fef5b21；哈希对象：registry-response；文件：DitherVeil.css、DitherVeil.jsx

---

## 柔和发光鼠标尾迹 · Glow Cursor

案例ID：384faf733c55151d

来源：https://reactbits.dev/animations/glow-cursor

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

鼠标位置散出柔和光流，光在移动后缓慢漂移、冷却并淡去。

触发：鼠标移动

作用层：content

### 实现方法

WebGL流体缓冲在指针处注入光与速度，进行平流和压力修正，并用多层辉光合成冷却拖尾。

1. 在React客户端引入锁定registry的GlowCursor.css、GlowCursor.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 在独立透明Canvas维护流体纹理，以trailWidth与followSpeed记录指针轨迹，随linger衰减光亮并合成glow。
3. 使用源码已提供的color、intensity、trailWidth、linger、glow、hotspot等属性配置；触发依据：鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- color：锁定源码默认：'#5f8bff'
- intensity：锁定源码默认：1.3
- trailWidth：锁定源码默认：3
- linger：锁定源码默认：1.4
- glow：锁定源码默认：1.2
- hotspot：锁定源码默认：0.8
- followSpeed：锁定源码默认：0.6
- grain：锁定源码默认：0
- clickBurst：锁定源码默认：true
- quality：锁定源码默认：'high'
- theme：锁定源码默认：'dark'
- maxDevicePixelRatio：锁定源码默认：2
- enabled：锁定源码默认：true

### 适用场景

- 音乐视觉幕布
- 创意作品首页

避免用于：

- 数据录入主界面

### 限制与接入建议

- 全局光流与原生光标功能分开，避免遮挡输入、点击目标或叠加其他全屏流体。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低quality、maxDevicePixelRatio并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及quality、maxDevicePixelRatio，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/GlowCursor-JS-CSS.json；资料核对时间：2026-10-25T07:52:58.076Z；SHA256：f8f19bea58491305a4d88782d7085bea05df41f0e2ddd7da132fbaad5e827c8a；哈希对象：registry-response；文件：GlowCursor.css、GlowCursor.jsx

---

## 滚动放大的媒体框 · Scroll Expand

案例ID：27e5a543159f3bd3

来源：https://reactbits.dev/animations/scroll-expand

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

圆角图片或视频框随滚动变大，最终铺满可视区域。

触发：页面滚动经过媒体

作用层：content

### 实现方法

DOM媒体框的宽高、圆角和位置随滚动进度插值，从小框扩展到接近全屏，媒体在固定舞台内保持裁切。

1. 在React客户端引入锁定registry的ScrollExpand.css、ScrollExpand.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量滚动轨道与舞台尺寸，按startWidth、startHeight和startRadius计算起点，再按scroll进度更新媒体框。
3. 使用源码已提供的src、mediaType、poster、alt、title、scrollHint等属性配置；触发依据：页面滚动经过媒体。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- src：锁定源码默认：''
- mediaType：锁定源码默认：'image'
- poster：锁定源码默认：''
- alt：锁定源码默认：''
- title：锁定源码默认：''
- scrollHint：锁定源码默认：''
- startWidth：锁定源码默认：42
- startHeight：锁定源码默认：58
- startRadius：锁定源码默认：24
- endRadius：锁定源码默认：0
- mediaZoom：锁定源码默认：1.35
- scrollDistance：锁定源码默认：1.2
- holdDistance：锁定源码默认：0.35
- smoothing：锁定源码默认：0.1
- overlayScrim：锁定源码默认：0.45
- useWindowScroll：锁定源码默认：false
- enabled：锁定源码默认：true

### 适用场景

- 产品视频介绍
- 作品详情开场

避免用于：

- 无滚动空间的小弹窗

### 限制与接入建议

- 属于滚动媒体展示，需为滚动区预留高度；不自动播放未获允许的视频声音。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：检查短屏滚动行程、内部滚动与外部页面的分工，适度减少可见层数，保留全部内容和可直接操作入口。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ScrollExpand-JS-CSS.json；资料核对时间：2026-10-25T07:52:57.993Z；SHA256：c35b0ffdc0c49d6961cd114a37e362458bdf754582ac0c8fef6897affda7e797；哈希对象：registry-response；文件：ScrollExpand.css、ScrollExpand.jsx

---

## 鼠标水波扭曲内容 · Ripple Distortion

案例ID：de3ea3e464ac7f24

来源：https://reactbits.dev/animations/ripple-distortion

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

鼠标扰动产生水波位移，内容被波纹扭曲，尾迹逐步衰减。

触发：鼠标在内容区域移动

作用层：surface

### 实现方法

OGL把内容采样为纹理，指针位置写入波纹位移场，随后按spread与fade传播衰减并重采样内容。

1. 在React客户端引入锁定registry的RippleDistortion.css、RippleDistortion.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 将源图或可支持内容变成纹理，记录局部波纹中心，按brushSize、strength和swirl更新位移纹理及合成uniform。
3. 使用源码已提供的brushSize、strength、swirl、rings、spread、fade等属性配置；触发依据：鼠标在内容区域移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- brushSize：锁定源码默认：150
- strength：锁定源码默认：0.2
- swirl：锁定源码默认：1
- rings：锁定源码默认：4
- spread：锁定源码默认：5
- fade：锁定源码默认：3
- spacing：锁定源码默认：15
- dispersion：锁定源码默认：0
- glint：锁定源码默认：0
- tint：锁定源码默认：'#a855f7'
- tintAmount：锁定源码默认：0.1
- grayscale：锁定源码默认：true
- highlightColor：锁定源码默认：'#ffffff'
- trigger：锁定源码默认：'hover'
- clickStrength：锁定源码默认：2
- quality：锁定源码默认：'low'
- enabled：锁定源码默认：true

### 适用场景

- 摄影互动封面
- 艺术品牌图像

避免用于：

- 需要精确阅读的图文表单

### 限制与接入建议

- 扭曲的是被采样的视觉层，不应扭曲真正可操作表单或可复制正文。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低quality并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及quality，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/RippleDistortion-JS-CSS.json；资料核对时间：2026-10-25T07:52:57.684Z；SHA256：4bcb89c411a9a83748e8a2f91e61ce7419fdee434adb8a87f0da8636b127a98c；哈希对象：registry-response；文件：RippleDistortion.css、RippleDistortion.jsx

---

## 果冻弹性文字与标志 · Elastic Mesh

案例ID：fc6be5850cc64cae

来源：https://reactbits.dev/animations/elastic-mesh

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

文字或标志变成鼓起的弹性形状，可按压、戳动和拉伸。

触发：按压、拖动和松开

作用层：content

### 实现方法

从文字或标志生成距离场与弹性网格，指针按压驱动节点，WebGL表面着色呈现鼓起材质。

1. 在React客户端引入锁定registry的ElasticMesh.css、ElasticMesh.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 栅格化文字或图源并建立节点连接，按inflate、stiffness与阻尼更新受力，再以material着色表面与阴影。
3. 使用源码已提供的text、src、fontFamily、fontWeight、color、imageColors等属性配置；触发依据：按压、拖动和松开。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- text：锁定源码默认：'Squish'
- src：锁定源码默认：''
- fontFamily：锁定源码默认：'system-ui, sans-serif'
- fontWeight：锁定源码默认：900
- color：锁定源码默认：'#3b5bff'
- imageColors：锁定源码默认：true
- material：锁定源码默认：'balloon'
- inflate：锁定源码默认：1
- stiffness：锁定源码默认：0.5
- wobble：锁定源码默认：0.6
- grabRadius：锁定源码默认：70
- stretch：锁定源码默认：0.5
- press：锁定源码默认：0.5
- shadow：锁定源码默认：0.5
- intro：锁定源码默认：true
- theme：锁定源码默认：'dark'

### 适用场景

- 可玩品牌字标
- 互动创意展品

避免用于：

- 工程力学计算界面

### 限制与接入建议

- 软体形变是近似交互视觉，不等于有单位、可验证的材料力学模拟。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ElasticMesh-JS-CSS.json；资料核对时间：2026-10-25T07:52:58.750Z；SHA256：fa38cd7e9e6d0b4e0717fdb8b9899a237a1be75a604331a9c8d4d6f13a323c08；哈希对象：registry-response；文件：ElasticMesh.css、ElasticMesh.jsx

---

## 跟随鼠标的粒子群 · Swarm Cursor

案例ID：cb85d1a2c7c7e027

来源：https://reactbits.dev/animations/swarm-cursor

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

一群粒子追逐鼠标并相互避让，停下后逐渐散开。

触发：鼠标移动；停下时粒子散开

作用层：content

### 实现方法

OGL粒子场按聚合、避让和噪声运动更新，指针吸引或推动群体并以发光合成呈现。

1. 在React客户端引入锁定registry的SwarmCursor.css、SwarmCursor.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 初始化count个粒子的状态与颜色，按separation、spread与指针局部坐标更新运动，再合成粒子光晕。
3. 使用源码已提供的color、accentColor、count、size、merge、glow等属性配置；触发依据：鼠标移动；停下时粒子散开。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- color：锁定源码默认：'#ffffff'
- accentColor：锁定源码默认：'#ffffff'
- count：锁定源码默认：10
- size：锁定源码默认：10
- merge：锁定源码默认：0.77
- glow：锁定源码默认：0.75
- opacity：锁定源码默认：1
- spread：锁定源码默认：100
- separation：锁定源码默认：0.15
- speed：锁定源码默认：2.5
- wander：锁定源码默认：0.25
- trail：锁定源码默认：0.75
- scatterOnClick：锁定源码默认：true
- enabled：锁定源码默认：true

### 适用场景

- 自然主题互动背景
- 创意探索封面

避免用于：

- 精确轨迹分析

### 限制与接入建议

- 群体运动是装饰，不代表真实群体行为或数据轨迹；粒子数量需受控。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低count并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及count，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/SwarmCursor-JS-CSS.json；资料核对时间：2026-10-25T07:52:58.147Z；SHA256：9b2ee32de24f9d4e1836ea8597e334a1991fd963b8a5e47d0688817a7ffd0d87；哈希对象：registry-response；文件：SwarmCursor.css、SwarmCursor.jsx

---

## 网点照片局部揭示 · Halftone Reveal

案例ID：f54bdec4f9ca1a8a

来源：https://reactbits.dev/animations/halftone-reveal

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

照片以印刷网点呈现，鼠标附近网点变大并恢复真实照片。

触发：鼠标在图片上移动

作用层：surface

### 实现方法

图片通过网点单元离散化，WebGL按亮度设置点形和大小，指针遮罩在局部揭示原图。

1. 在React客户端引入锁定registry的HalftoneReveal.css、HalftoneReveal.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 加载源图并按cellSize、angle和shape生成网点，局部mask放大或消融网点以显示原色，再恢复纹理。
3. 使用源码已提供的src、fit、mode、shape、cellSize、angle等属性配置；触发依据：鼠标在图片上移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- src：锁定源码默认：DEFAULT_SRC
- fit：锁定源码默认：'cover'
- mode：锁定源码默认：'mono'
- shape：锁定源码默认：'dot'
- cellSize：锁定源码默认：6
- angle：锁定源码默认：45
- dotScale：锁定源码默认：1
- inkColor：锁定源码默认：'#120f17'
- accentColor：锁定源码默认：'#ff4f2a'
- paperColor：锁定源码默认：'#ffffff'
- contrast：锁定源码默认：1.1
- brightness：锁定源码默认：0
- invert：锁定源码默认：false
- roughness：锁定源码默认：0
- misregistration：锁定源码默认：0
- revealRadius：锁定源码默认：160
- softness：锁定源码默认：0.6
- linger：锁定源码默认：1.2
- reverse：锁定源码默认：false
- wander：锁定源码默认：false
- clickBurst：锁定源码默认：true
- intro：锁定源码默认：true

### 适用场景

- 摄影作品
- 印刷风格专题封面

避免用于：

- 文档阅读器正文

### 限制与接入建议

- 网点是图像表现方式，不能用于需要清晰识别的证件、文字截图和图表。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/HalftoneReveal-JS-CSS.json；资料核对时间：2026-10-25T07:52:58.428Z；SHA256：6e898f900d1b4e71d153507118a629971c60d1c85d937f3a9762506c5148df9b；哈希对象：registry-response；文件：HalftoneReveal.css、HalftoneReveal.jsx

---

## 像素遮罩切换内容 · Pixel Swap

案例ID：39c910c7a3134b14

来源：https://reactbits.dev/animations/pixel-swap

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

像素碎片组成完整遮罩，替换其下方的内容，再消散露出新内容。

触发：按配置的点击、悬停或状态切换

作用层：surface

### 实现方法

两层内容以像素单元构成的覆盖遮罩切换，在遮罩封闭时替换可见内容，再按相位移除像素。

1. 在React客户端引入锁定registry的PixelSwap.css、PixelSwap.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 依据pixelSize、gap与pattern建立网格，以duration和pixelDuration安排覆盖及解除，避免未遮住时直接露出替换。
3. 使用源码已提供的pixelSize、gap、pixelRadius、pixelSpin、pixelScale、fade等属性配置；触发依据：按配置的点击、悬停或状态切换。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- pixelSize：锁定源码默认：64
- gap：锁定源码默认：0
- pixelRadius：锁定源码默认：0
- pixelSpin：锁定源码默认：0
- pixelScale：锁定源码默认：0.35
- fade：锁定源码默认：true
- duration：锁定源码默认：1400
- pixelDuration：锁定源码默认：450
- pattern：锁定源码默认：'random'
- randomness：锁定源码默认：0
- easing：锁定源码默认：'cubic-bezier(0.22, 1, 0.36, 1)'
- trigger：锁定源码默认：'hover'
- initialActive：锁定源码默认：false
- aspectRatio：锁定源码默认：'16 / 10'

### 适用场景

- 图片或短内容切换
- 创意双面介绍

避免用于：

- 需要持续编辑的输入面板

### 限制与接入建议

- 这是内容替换过渡，业务数据和交互状态需外部管理；像素数过大增加DOM或绘制量。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/PixelSwap-JS-CSS.json；资料核对时间：2026-10-25T07:52:58.442Z；SHA256：53074245d9dc189f7bf0a9ea37b1f9f2bea326ee105d114724a9dc7c49afc143；哈希对象：registry-response；文件：PixelSwap.css、PixelSwap.jsx

---

## 鼠标点亮网格 · Cursor Grid

案例ID：539f2788df728536

来源：https://reactbits.dev/animations/cursor-grid

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

画布网格在鼠标周围亮起，亮度随距离衰减，点击可产生扩散脉冲。

触发：鼠标移动；点击脉冲

作用层：content

### 实现方法

Canvas只绘制局部受指针和点击脉冲激励的网格单元，亮度按距离和时间衰减。

1. 在React客户端引入锁定registry的CursorGrid.css、CursorGrid.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按cellSize建立网格，以radius、falloff、holdTime和fadeDuration保存局部能量，点击时叠加扩散脉冲。
3. 使用源码已提供的cellSize、color、radius、falloff、holdTime、fadeDuration等属性配置；触发依据：鼠标移动；点击脉冲。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- cellSize：锁定源码默认：70
- color：锁定源码默认：'#D946EF'
- radius：锁定源码默认：140
- falloff：锁定源码默认：'smooth'
- holdTime：锁定源码默认：400
- fadeDuration：锁定源码默认：800
- lineWidth：锁定源码默认：1.2
- maxOpacity：锁定源码默认：1
- fillOpacity：锁定源码默认：0
- gridOpacity：锁定源码默认：0
- cellRadius：锁定源码默认：0
- clickPulse：锁定源码默认：true
- pulseSpeed：锁定源码默认：600

### 适用场景

- 工具产品空白区
- 交互装饰画布

避免用于：

- 数据表格内容区

### 限制与接入建议

- 是背景交互网格，不是可编辑电子表格，也不自动显示真实数据。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/CursorGrid-JS-CSS.json；资料核对时间：2026-10-25T07:52:58.595Z；SHA256：4a587ff4a2107bd874af14b15f8dbe31962d5fc5de4f701fc7a3ac24b2f19578；哈希对象：registry-response；文件：CursorGrid.css、CursorGrid.jsx

---

## 滚动位移入场 · Animated Content

案例ID：201094c234630df1

来源：https://reactbits.dev/animations/animated-content

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

容器中的内容在入场或滚动到达时，按指定方向与距离移动到位。

触发：进入视野或组件挂载

作用层：content

### 实现方法

GSAP包装容器在ScrollTrigger进入阈值时，从偏移、透明度或缩放状态过渡到正常布局。

1. 在React客户端引入锁定registry的AnimatedContent/AnimatedContent.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以direction和reverse确定轴向偏移，distance、initialOpacity和scale构造初始状态，进入threshold后播放过渡。
3. 使用源码已提供的distance、direction、reverse、duration、ease、initialOpacity等属性配置；触发依据：进入视野或组件挂载。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时只清理本实例观察器或滚动触发，避免全局销毁其他动效。

依赖：gsap@^3.13.0

参数：

- distance：锁定源码默认：100
- direction：锁定源码默认：'vertical'
- reverse：锁定源码默认：false
- duration：锁定源码默认：0.8
- ease：锁定源码默认：'power3.out'
- initialOpacity：锁定源码默认：0
- animateOpacity：锁定源码默认：true
- scale：锁定源码默认：1
- threshold：锁定源码默认：0.1
- delay：锁定源码默认：0
- disappearAfter：锁定源码默认：0
- disappearDuration：锁定源码默认：0.5
- disappearEase：锁定源码默认：'power3.in'

### 适用场景

- 内容区块入场
- 功能卡列表

避免用于：

- 仅靠入场来代替强动效主视觉

### 限制与接入建议

- 主要是容器入场，不提供持续空间主视觉；默认可读与减少动态状态需保留。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：检查短屏滚动行程、内部滚动与外部页面的分工，适度减少可见层数，保留全部内容和可直接操作入口。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/AnimatedContent-JS-CSS.json；资料核对时间：2026-10-25T07:52:58.597Z；SHA256：0eeadf9fa40f582a7c1b3d4982e7313243dceb8f44809b249ec7f6f4f84aee16；哈希对象：registry-response；文件：AnimatedContent/AnimatedContent.jsx

---

## 渐入渐出内容 · Fade Content

案例ID：8f4f2945729d17d0

来源：https://reactbits.dev/animations/fade-content

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

内容到达可视阈值时以透明度变化进入，可结合模糊形成柔和过渡。

触发：内容进入可视区域

作用层：content

### 实现方法

GSAP时间线根据可见阈值改变整个容器的透明度与可选模糊，可配置延时和后续淡出。

1. 在React客户端引入锁定registry的FadeContent/FadeContent.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 设置initialOpacity与blur初态，在threshold满足后按duration和delay过渡；disappear相关选项决定是否后续离场。
3. 使用源码已提供的blur、duration、ease、delay、threshold、initialOpacity等属性配置；触发依据：内容进入可视区域。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时只清理本实例观察器或滚动触发，避免全局销毁其他动效。

依赖：gsap@^3.13.0

参数：

- blur：锁定源码默认：false
- duration：锁定源码默认：1000
- ease：锁定源码默认：'power2.out'
- delay：锁定源码默认：0
- threshold：锁定源码默认：0.1
- initialOpacity：锁定源码默认：0
- disappearAfter：锁定源码默认：0
- disappearDuration：锁定源码默认：0.5
- disappearEase：锁定源码默认：'power2.in'

### 适用场景

- 图片说明
- 次要内容组块

避免用于：

- 主要功能的唯一呈现方式

### 限制与接入建议

- 整个容器的淡入不同于逐词揭示；核心输入与答案不能因离场设置永久不可见。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：检查短屏滚动行程、内部滚动与外部页面的分工，适度减少可见层数，保留全部内容和可直接操作入口。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/FadeContent-JS-CSS.json；资料核对时间：2026-10-25T07:52:58.872Z；SHA256：d557650bc7a8526ce4d4c7037a5728add864936b634d3504dff89defaa4b969a；哈希对象：registry-response；文件：FadeContent/FadeContent.jsx

---

## 电弧跳动边框 · Electric Border

案例ID：b13e872a0d30fae7

来源：https://reactbits.dev/animations/electric-border

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

边框呈持续抖动的电弧与发光能量，强度可调。

触发：页面展示后持续电弧动画

作用层：border、outer-glow

### 实现方法

Canvas沿圆角矩形轮廓采样位置，用多层噪声扰动法线并加亮合成，形成持续电弧描边。

1. 在React客户端引入锁定registry的ElectricBorder.css、ElectricBorder.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 根据容器宽高和borderRadius生成圆角边界，以speed推进时间，chaos控制边缘噪声，独立Canvas覆盖轮廓。
3. 使用源码已提供的color、speed、chaos、borderRadius等属性配置；触发依据：页面展示后持续电弧动画。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在border、outer-glow层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- color：锁定源码默认：'#5227FF'
- speed：锁定源码默认：1
- chaos：锁定源码默认：0.12
- borderRadius：锁定源码默认：24

### 适用场景

- 游戏重点卡片
- 能量主题行动按钮

避免用于：

- 长时间阅读面板

### 限制与接入建议

- 电弧抖动与匀速边框光束不同；应只作用边缘，不把卡片内部铺成闪电。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ElectricBorder-JS-CSS.json；资料核对时间：2026-10-25T07:52:59.002Z；SHA256：0f11a09711e0721c2c4b720568342e3e685b6776cb8e110567f4c25c26568cfe；哈希对象：registry-response；文件：ElectricBorder.css、ElectricBorder.jsx

---

## 沿轨道旋转图片 · Orbit Images

案例ID：39080d64a7b14c32

来源：https://reactbits.dev/animations/orbit-images

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多张图片沿可定制的 SVG 路径绕行，形成轨道式图片动画。

触发：页面展示后沿轨道运动

作用层：content

### 实现方法

以SVG路径数据生成圆、椭圆等轨道，Motion驱动共享progress；每张DOM图片按索引错开offsetDistance，并以CSS offset-path沿轨道循环，非Three.js三维球面画廊。

1. 由shape或customPath生成路径字符串，以baseWidth和半径建立设计坐标系；images提供真实图片与替代说明。
2. 使用Motion motionValue推进0至100的轨道进度，fill为每项加入索引相位，再把结果写入offsetDistance。
3. 图片DOM设置offsetPath、offsetRotate和offsetAnchor，容器旋转时内部反向旋转保持图片朝向；paused、direction与duration控制播放。
4. 接入建议：按可用容器缩放并检查responsive配置，中心内容与轨道图片区分层，替代按钮等业务交互需另外实现。

依赖：motion@^12.23.12

参数：

- images：锁定源码默认：[]
- altPrefix：锁定源码默认：'Orbiting image'
- shape：锁定源码默认：'ellipse'
- baseWidth：锁定源码默认：1400
- radiusX：锁定源码默认：700
- radiusY：锁定源码默认：170
- radius：锁定源码默认：300
- starPoints：锁定源码默认：5
- starInnerRatio：锁定源码默认：0.5
- rotation：锁定源码默认：-8
- duration：锁定源码默认：40
- itemSize：锁定源码默认：64
- direction：锁定源码默认：'normal'
- fill：锁定源码默认：true
- width：锁定源码默认：100
- height：锁定源码默认：100
- showPath：锁定源码默认：false
- pathColor：锁定源码默认：'rgba(0,0,0,0.1)'
- pathWidth：锁定源码默认：2
- easing：锁定源码默认：'linear'
- paused：锁定源码默认：false
- responsive：锁定源码默认：false

### 适用场景

- 合作品牌或项目封面沿轨道展示
- 围绕产品主体的装饰性图片首屏

避免用于：

- 需要全部项目同时稳定可读的表格、主导航或重要操作入口

### 限制与接入建议

- 依赖CSS motion-path支持和图片加载；轨道尺寸、itemSize和容器裁切不匹配会遮挡内容。
- 该来源是路径图片运动，不原生承诺三维球面、透视卡片排序或拖拽选中功能；此类改变须标明适配。

手机：项目接入建议：减少图片数量与轨道半径，显式设置响应式尺寸，触屏查看详情用独立点击入口，不依赖悬停。

减少动态：项目接入建议：设置paused并固定progress，保留静态图片或改为有序图片带，中心主按钮保持可见。

性能：项目接入建议：使用适当尺寸缩略图、控制并发图片数，复用共享progress与路径，避免为每帧运动触发React重新渲染。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/OrbitImages-JS-CSS.json；资料核对时间：2026-10-25T07:52:59.050Z；SHA256：fb85cf1f127ac871ba44a611a0f605045a25984288fcc42c762742bc604f1314；哈希对象：registry-response；文件：OrbitImages.css、OrbitImages.jsx

---

## 像素溶解卡片切换 · Pixel Transition

案例ID：73876a3b0aee0449

来源：https://reactbits.dev/animations/pixel-transition

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

像素块先覆盖卡片，内容在遮罩下替换，再清除像素显示另一面。

触发：鼠标悬停或触摸点击

作用层：surface

### 实现方法

两层DOM内容与Canvas像素遮罩配合，鼠标或点击触发时先盖住旧内容再揭开新内容。

1. 在React客户端引入锁定registry的PixelTransition.css、PixelTransition.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按gridSize与pattern排列覆盖次序，animationStepDuration控制时间窗，完整封闭遮罩时切换内容层。
3. 使用源码已提供的gridSize、pixelColor、mosaic、animationStepDuration、pattern、randomness等属性配置；触发依据：鼠标悬停或触摸点击。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- gridSize：锁定源码默认：10
- pixelColor：锁定源码默认：'#ffffff'
- mosaic：锁定源码默认：0
- animationStepDuration：锁定源码默认：0.4
- pattern：锁定源码默认：'random'
- randomness：锁定源码默认：0.3
- pixelAnimation：锁定源码默认：'pop'
- pixelShape：锁定源码默认：'square'
- gap：锁定源码默认：0
- fps：锁定源码默认：0
- trigger：锁定源码默认：'hover'
- once：锁定源码默认：false
- aspectRatio：锁定源码默认：'100%'

### 适用场景

- 双面作品封面
- 互动产品卡

避免用于：

- 大段正文或填写中的表单

### 限制与接入建议

- 触屏要保留可点击触发；不是业务路由切换器，原内容状态由接入方保存。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/PixelTransition-JS-CSS.json；资料核对时间：2026-10-25T07:52:59.050Z；SHA256：b66d1464a734e5d857a75b26859073784ef82dc91068e988f5fd596470b95fe8；哈希对象：registry-response；文件：PixelTransition.css、PixelTransition.jsx

---

## 悬停扫光表面 · Glare Hover

案例ID：4db1c0eedc341022

来源：https://reactbits.dev/animations/glare-hover

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

鼠标悬停时，一道高光从元素表面扫过，模拟亮面反射。

触发：鼠标进入与离开元素

作用层：surface

### 实现方法

独立渐变反光带根据指针方向或进入位置扫过元素表面，叠加局部高光与可选边缘层。

1. 在React客户端引入锁定registry的GlareHover.css、GlareHover.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量局部坐标，以glareAngle、glareSize和glareOpacity更新反光渐变，移出后恢复基态。
3. 使用源码已提供的width、height、background、borderRadius、borderColor、glareColor等属性配置；触发依据：鼠标进入与离开元素。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- width：锁定源码默认：'auto'
- height：锁定源码默认：'auto'
- background：锁定源码默认：'transparent'
- borderRadius：锁定源码默认：'10px'
- borderColor：锁定源码默认：'transparent'
- glareColor：锁定源码默认：'#ffffff'
- glareOpacity：锁定源码默认：0.5
- glareAngle：锁定源码默认：-45
- glareSize：锁定源码默认：30
- softness：锁定源码默认：0.6
- variant：锁定源码默认：'streak'
- blendMode：锁定源码默认：'screen'
- rimGlint：锁定源码默认：true
- mode：锁定源码默认：'hover'
- transitionDuration：锁定源码默认：650
- interval：锁定源码默认：3
- playOnce：锁定源码默认：false
- intro：锁定源码默认：false

### 适用场景

- 商品光泽封面
- 行动按钮表面

避免用于：

- 所有卡片同时高强度扫光

### 限制与接入建议

- 反光作用surface而非沿路径绕边；背景图、文本和命中区域必须分层。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/GlareHover-JS-CSS.json；资料核对时间：2026-10-25T07:52:59.212Z；SHA256：8bb09c07743680d4da8d22c2b7ed3218421d75a5e4da2f3617efe78102252f04；哈希对象：registry-response；文件：GlareHover.css、GlareHover.jsx

---

## 避让鼠标的三维粒子 · Antigravity

案例ID：d93c32ef8d8c64d7

来源：https://reactbits.dev/backgrounds/antigravity

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

三维粒子场平滑运动，靠近指针的粒子被排斥，形成避让空间。

触发：持续粒子运动；鼠标移动排斥

作用层：page-background

### 实现方法

React Three Fiber的instancedMesh批量绘制三维粒子，每个实例根据虚拟指针距离和波形计算目标位置并平滑追随。

1. 在React客户端引入锁定registry的Antigravity/Antigravity.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 初始化每粒子的随机相位与空间偏移，按magnetRadius和waveAmplitude更新实例矩阵，指针靠近时改变局部目标。
3. 使用源码已提供的count、magnetRadius、ringRadius、waveSpeed、waveAmplitude、particleSize等属性配置；触发依据：持续粒子运动；鼠标移动排斥。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：@react-three/fiber@^9.3.0、three@^0.180.0

参数：

- count：锁定源码默认：300
- magnetRadius：锁定源码默认：10
- ringRadius：锁定源码默认：10
- waveSpeed：锁定源码默认：0.4
- waveAmplitude：锁定源码默认：1
- particleSize：锁定源码默认：2
- lerpSpeed：锁定源码默认：0.1
- color：锁定源码默认：'#FF9FFC'
- autoAnimate：锁定源码默认：false
- particleVariance：锁定源码默认：1
- rotationSpeed：锁定源码默认：0
- depthFactor：锁定源码默认：1
- pulseSpeed：锁定源码默认：3
- particleShape：锁定源码默认：'capsule'
- fieldStrength：锁定源码默认：10

### 适用场景

- 空间科学首屏
- 沉浸式创意背景

避免用于：

- 真实分子轨迹分析

### 限制与接入建议

- 需要WebGL与Three/R3F依赖；粒子场是装饰视觉，不是科学粒子模拟。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的autoAnimate控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Antigravity-JS-CSS.json；资料核对时间：2026-10-25T07:52:59.292Z；SHA256：d419244922aba03d950f57be24ad86cec8c86dbd6734bb6f318587b049179bbe；哈希对象：registry-response；文件：Antigravity/Antigravity.jsx

---

## 循环品牌图标带 · Logo Loop

案例ID：8a276d77a70bc6b8

来源：https://reactbits.dev/animations/logo-loop

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

品牌或技术图标首尾相接连续滚动，悬停可暂停。

触发：持续循环；悬停暂停

作用层：content

### 实现方法

重复品牌图标序列铺成滚动轨道，requestAnimationFrame平移并在单元边界取模，悬停调整速度。

1. 在React客户端引入锁定registry的LogoLoop.css、LogoLoop.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 先等待图标尺寸测量，复制足够单元以覆盖容器，按speed与direction推进轨道，resize后重新计算循环长度。
3. 使用源码已提供的speed、direction、width、logoHeight、gap、fadeOut等属性配置；触发依据：持续循环；悬停暂停。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- speed：锁定源码默认：120
- direction：锁定源码默认：'left'
- width：锁定源码默认：'100%'
- logoHeight：锁定源码默认：28
- gap：锁定源码默认：32
- fadeOut：锁定源码默认：false
- scaleOnHover：锁定源码默认：false
- ariaLabel：锁定源码默认：'Partner logos'

### 适用场景

- 合作伙伴展示
- 技术栈列表

避免用于：

- 承载唯一关键入口的导航

### 限制与接入建议

- 需保留品牌图标授权与替代文字，复制轨道不要重复进入键盘焦点。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/LogoLoop-JS-CSS.json；资料核对时间：2026-10-25T07:52:59.723Z；SHA256：3a2b576d3acb03db913df94ea73a63651e22d767eb52b7bed31df829b814d2d6；哈希对象：registry-response；文件：LogoLoop.css、LogoLoop.jsx

---

## 四角锁定鼠标 · Target Cursor

案例ID：4bac07ae183e6450

来源：https://reactbits.dev/animations/target-cursor

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

四角框跟随指针，进入指定目标后贴合其四角，形成锁定反馈。

触发：鼠标移动；进入可交互目标

作用层：content

### 实现方法

DOM四角框与中心标记跟随指针，目标命中时测量元素边界并将四角吸附到对应角点。

1. 在React客户端引入锁定registry的TargetCursor.css、TargetCursor.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 通过targetSelector筛选目标，用getBoundingClientRect计算四角坐标，hoverDuration与spring调节跟随，离开后恢复游标。
3. 使用源码已提供的targetSelector、cursorColor、spinDuration、hoverDuration、parallaxOn、hideDefaultCursor等属性配置；触发依据：鼠标移动；进入可交互目标。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：react-dom@^19.0.0

参数：

- targetSelector：锁定源码默认：'.cursor-target'
- cursorColor：锁定源码默认：'#ffffff'
- spinDuration：锁定源码默认：2
- hoverDuration：锁定源码默认：0.2
- parallaxOn：锁定源码默认：true
- hideDefaultCursor：锁定源码默认：true
- size：锁定源码默认：36
- cornerSize：锁定源码默认：12
- thickness：锁定源码默认：3
- padding：锁定源码默认：6
- matchRadius：锁定源码默认：true
- dotSize：锁定源码默认：4
- blendMode：锁定源码默认：'difference'
- showLabel：锁定源码默认：true
- clickEffect：锁定源码默认：true

### 适用场景

- 游戏化导航
- 创意交互作品

避免用于：

- 高精度办公与辅助技术主界面

### 限制与接入建议

- 自定义光标不替代键盘焦点；触屏和粗指针应保留原生操作方式。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：检查短屏滚动行程、内部滚动与外部页面的分工，适度减少可见层数，保留全部内容和可直接操作入口。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/TargetCursor-JS-CSS.json；资料核对时间：2026-10-25T07:52:59.504Z；SHA256：973d76664e5624b3d94fc1d17a80fefcdb55ba3541987d2c1eb195b4db7e0b0a；哈希对象：registry-response；文件：TargetCursor.css、TargetCursor.jsx

---

## 发光魔法圆环 · Magic Rings

案例ID：b6fc084545ec1f00

来源：https://reactbits.dev/backgrounds/magic-rings

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

发光圆环交叠运动，颜色、尺寸与交互响应可调整。

触发：持续圆环动画；按配置响应鼠标

作用层：page-background

### 实现方法

Three.js全屏着色器按同心圆距离场、时间和颜色渐变组合发光环，并接受指针平滑位置与点击扰动。

1. 在React客户端引入锁定registry的MagicRings.css、MagicRings.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 创建正交摄像机和ShaderMaterial平面，用ringCount、baseRadius与radiusStep组织环带，再每帧更新时间及鼠标uniform。
3. 使用源码已提供的color、colorTwo、speed、ringCount、attenuation、lineThickness等属性配置；触发依据：持续圆环动画；按配置响应鼠标。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：three@^0.180.0

参数：

- color：锁定源码默认：'#fc42ff'
- colorTwo：锁定源码默认：'#42fcff'
- speed：锁定源码默认：1
- ringCount：锁定源码默认：6
- attenuation：锁定源码默认：10
- lineThickness：锁定源码默认：2
- baseRadius：锁定源码默认：0.35
- radiusStep：锁定源码默认：0.1
- scaleRate：锁定源码默认：0.1
- opacity：锁定源码默认：1
- blur：锁定源码默认：0
- noiseAmount：锁定源码默认：0.1
- rotation：锁定源码默认：0
- ringGap：锁定源码默认：1.5
- fadeIn：锁定源码默认：0.7
- fadeOut：锁定源码默认：0.5
- followMouse：锁定源码默认：false
- mouseInfluence：锁定源码默认：0.2
- hoverScale：锁定源码默认：1.2
- parallax：锁定源码默认：0.05
- clickBurst：锁定源码默认：false
- alphaMode：锁定源码默认：'luminance'

### 适用场景

- 活动能量背景
- 几何品牌首屏

避免用于：

- 真实几何教学模型

### 限制与接入建议

- 绘制的是着色器环形视觉，不是可点击的真实三维环模型；同屏光环数量影响片元成本。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低ringCount并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及ringCount，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/MagicRings-JS-CSS.json；资料核对时间：2026-10-25T07:52:59.487Z；SHA256：39bb07000e80b00781f8b05a82e359a75ba59a97e4c16257b20dd62d714551e4；哈希对象：registry-response；文件：MagicRings.css、MagicRings.jsx

---

## 倾泻激光光流 · Laser Flow

案例ID：2c9fbcb73a94e2e1

来源：https://reactbits.dev/animations/laser-flow

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

光束落在内容上并沿边角流动，周围伴随漂浮烟雾和尘埃。

触发：持续光流动画

作用层：content

### 实现方法

原生WebGL片元着色器把垂直光束、表面接触扩散和雾光分开计算，形成光落到内容上再溢出的场。

1. 在React客户端引入锁定registry的LaserFlow.css、LaserFlow.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 建立独立Canvas并设置beamPosition与surfaceLevel，在片元场中合成beamWidth、flare、spill和fog，按时间及指针更新。
3. 使用源码已提供的beamPosition、surfaceLevel、color、intensity、beamWidth、flare等属性配置；触发依据：持续光流动画。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- beamPosition：锁定源码默认：0.6
- surfaceLevel：锁定源码默认：1
- color：锁定源码默认：'#3847ff'
- intensity：锁定源码默认：1.8
- beamWidth：锁定源码默认：1.5
- flare：锁定源码默认：1.5
- spread：锁定源码默认：1.5
- spill：锁定源码默认：1
- fog：锁定源码默认：0.2
- dust：锁定源码默认：1.6
- streaks：锁定源码默认：1.5
- dots：锁定源码默认：1
- pulse：锁定源码默认：1.5
- speed：锁定源码默认：1.5
- seed：锁定源码默认：3
- mouseInteraction：锁定源码默认：true
- revealRadius：锁定源码默认：220
- revealOpacity：锁定源码默认：0.6
- intro：锁定源码默认：true
- theme：锁定源码默认：'dark'
- paused：锁定源码默认：false

### 适用场景

- 重点内容舞台
- 发布会品牌首屏

避免用于：

- 需要光线物理测量的工具

### 限制与接入建议

- surfaceLevel是视觉接触位置，不会自动识别任意DOM真实几何；需手动对齐内容。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/LaserFlow-JS-CSS.json；资料核对时间：2026-10-25T07:52:59.708Z；SHA256：f628c8472ba95633980db1b55c54a6106525477040e7b8e81473763d7414c2bf；哈希对象：registry-response；文件：LaserFlow.css、LaserFlow.jsx

---

## 朝鼠标偏转的短线场 · Magnet Lines

案例ID：089dd08cbfc6a845

来源：https://reactbits.dev/backgrounds/magnet-lines

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

整齐排列的短线随鼠标位置转向，呈现磁场般的方向变化。

触发：鼠标移动

作用层：page-background

### 实现方法

DOM短线网格缓存各线中心，计算指针与中心的atan2角度并写入CSS旋转变量。

1. 在React客户端引入锁定registry的MagnetLines.css、MagnetLines.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按rows、columns和line尺寸建立网格，在pointermove中测量或复用中心坐标，逐条更新角度，未交互时保留baseAngle。
3. 使用源码已提供的rows、columns、containerSize、lineColor、lineWidth、lineHeight等属性配置；触发依据：鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- rows：锁定源码默认：9
- columns：锁定源码默认：9
- containerSize：锁定源码默认：'80vmin'
- lineColor：锁定源码默认：'#efefef'
- lineWidth：锁定源码默认：'1vmin'
- lineHeight：锁定源码默认：'6vmin'
- baseAngle：锁定源码默认：-10

### 适用场景

- 交互功能区背景
- 科学主题装饰

避免用于：

- 真实磁感应强度显示

### 限制与接入建议

- 是二维短线朝向反馈，不是磁场求解；大量DOM线条需要控制网格尺寸。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/MagnetLines-JS-CSS.json；资料核对时间：2026-10-25T07:52:59.723Z；SHA256：ca13620565cfb3a3b27310e5bdaeea6b1f5b8d6b2853ce3725ff838c80f0f798；哈希对象：registry-response；文件：MagnetLines.css、MagnetLines.jsx

---

## 幽灵鼠标拖影 · Ghost Cursor

案例ID：4d654be6bb24c189

来源：https://reactbits.dev/animations/ghost-cursor

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

半透明光影滞后跟随真实鼠标，移动时产生柔和拖尾。

触发：鼠标移动

作用层：content

### 实现方法

Three.js绘制保存指针历史的拖尾场，再以辉光和胶片颗粒后处理形成滞后的半透明光影。

1. 在React客户端引入锁定registry的GhostCursor.css、GhostCursor.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 维护trailLength环形缓冲与inertia平滑位置，把历史轨迹传入材质，再经bloom和grain合成，静止后按状态淡出。
3. 使用源码已提供的trailLength、inertia、grainIntensity、bloomStrength、bloomRadius、bloomThreshold等属性配置；触发依据：鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：three@^0.180.0

参数：

- trailLength：锁定源码默认：50
- inertia：锁定源码默认：0.5
- grainIntensity：锁定源码默认：0.05
- bloomStrength：锁定源码默认：0.1
- bloomRadius：锁定源码默认：1.0
- bloomThreshold：锁定源码默认：0.025
- brightness：锁定源码默认：1
- color：锁定源码默认：'#B497CF'
- mixBlendMode：锁定源码默认：'screen'
- edgeIntensity：锁定源码默认：0
- maxDevicePixelRatio：锁定源码默认：0.5
- zIndex：锁定源码默认：10

### 适用场景

- 数字艺术封面
- 创意品牌舞台

避免用于：

- 密集输入和精确点选

### 限制与接入建议

- 可视光影不应取代原生鼠标命中；后处理开销高于普通CSS阴影。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低maxDevicePixelRatio并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及maxDevicePixelRatio，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/GhostCursor-JS-CSS.json；资料核对时间：2026-10-25T07:52:59.951Z；SHA256：5f28094b006bcbe614690ac6f5689984e284eb83f53472c43e878bb3ee9e0555；哈希对象：registry-response；文件：GhostCursor.css、GhostCursor.jsx

---

## 渐进模糊遮罩 · Gradual Blur

案例ID：77ff66fee5359db4

来源：https://reactbits.dev/animations/gradual-blur

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

在内容边缘叠加逐级增强的模糊，形成从清晰到模糊的柔和过渡。

触发：持续覆盖指定边缘；滚动内容穿过遮罩

作用层：surface

### 实现方法

多个绝对定位DOM层分别使用backdrop-filter与渐变mask，按位置逐层增加模糊强度形成容器边缘渐进模糊。

1. 在React客户端引入锁定registry的GradualBlur.css、GradualBlur.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 合并DEFAULT_CONFIG、preset和props，依据position与divCount生成分段遮罩，以curve和strength计算每层模糊。
3. 使用源码已提供的position、strength、height、divCount、exponential、zIndex等属性配置；触发依据：持续覆盖指定边缘；滚动内容穿过遮罩。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- position：锁定源码默认：'bottom'
- strength：锁定源码默认：2
- height：锁定源码默认：'6rem'
- divCount：锁定源码默认：5
- exponential：锁定源码默认：false
- zIndex：锁定源码默认：1000
- animated：锁定源码默认：false
- duration：锁定源码默认：'0.3s'
- easing：锁定源码默认：'ease-out'
- opacity：锁定源码默认：1
- curve：锁定源码默认：'linear'
- responsive：锁定源码默认：false
- target：锁定源码默认：'parent'

### 适用场景

- 滚动容器边缘
- 固定页头或页脚衔接

避免用于：

- 需要完整读清的内容主体

### 限制与接入建议

- 它持续覆盖内容边缘，不是一次文字模糊入场，也不是卡片边框发光。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/GradualBlur-JS-CSS.json；资料核对时间：2026-10-25T07:53:00.049Z；SHA256：027dcec920b9871fb5c73efdf0ef9f886925feec4a6f780d20f71d50c3310b1f；哈希对象：registry-response；文件：GradualBlur.css、GradualBlur.jsx

---

## 点击迸出火花 · Click Spark

案例ID：018e0a861f761b4b

来源：https://reactbits.dev/animations/click-spark

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

在点击位置向四周发射短暂的线状火花粒子。

触发：鼠标点击

作用层：content

### 实现方法

Canvas在点击位置生成一组按角度分布的短线，随时间向外移动并缩短，生命周期结束即移除。

1. 在React客户端引入锁定registry的ClickSpark/ClickSpark.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 将点击坐标换算到Canvas，按sparkCount与sparkRadius建立火花，再用duration和easing更新每条线的半径与长度。
3. 使用源码已提供的sparkColor、sparkSize、sparkRadius、sparkCount、duration、easing等属性配置；触发依据：鼠标点击。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- sparkColor：锁定源码默认：'#fff'
- sparkSize：锁定源码默认：10
- sparkRadius：锁定源码默认：15
- sparkCount：锁定源码默认：8
- duration：锁定源码默认：400
- easing：锁定源码默认：'ease-out'
- extraScale：锁定源码默认：1.0

### 适用场景

- 活动按钮
- 轻量趣味点击区

避免用于：

- 关键提交结果的唯一状态

### 限制与接入建议

- 只提供点击装饰反馈，不应作为操作成功的唯一提示。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ClickSpark-JS-CSS.json；资料核对时间：2026-10-25T07:53:00.217Z；SHA256：c0381de329a477d97b98c42468739e649de91ac07aecc0be30bb890b5ef42707；哈希对象：registry-response；文件：ClickSpark/ClickSpark.jsx

---

## 磁吸鼠标元素 · Magnet

案例ID：477fe70784cb9178

来源：https://reactbits.dev/animations/magnet

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

元素在鼠标接近时平滑向指针偏移，离开后弹回原位。

触发：鼠标接近与离开元素

作用层：content

### 实现方法

包装容器测量鼠标距中心的偏移，进入padding范围时将内部元素平移，离开时CSS过渡复位。

1. 在React客户端引入锁定registry的Magnet/Magnet.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 外层保持布局与命中稳定，以magnetStrength缩放局部偏移，分别设置activeTransition与inactiveTransition。
3. 使用源码已提供的padding、disabled、magnetStrength、activeTransition、inactiveTransition、wrapperClassName等属性配置；触发依据：鼠标接近与离开元素。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- padding：锁定源码默认：100
- disabled：锁定源码默认：false
- magnetStrength：锁定源码默认：2
- activeTransition：锁定源码默认：'transform 0.3s ease-out'
- inactiveTransition：锁定源码默认：'transform 0.5s ease-in-out'
- wrapperClassName：锁定源码默认：''
- innerClassName：锁定源码默认：''

### 适用场景

- 品牌行动按钮
- 作品集社交图标

避免用于：

- 高精度小按钮密集工具栏

### 限制与接入建议

- 只吸引视觉内层，不要移动整个布局命中区或核心表单文字。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Magnet-JS-CSS.json；资料核对时间：2026-10-25T07:53:00.217Z；SHA256：d605e9f2b50c05a02116ed407da580253c4b1b9bfd89f2722509df23215dd46a；哈希对象：registry-response；文件：Magnet/Magnet.jsx

---

## 发光编织丝带 · Strands

案例ID：bdcfb580266f47aa

来源：https://reactbits.dev/animations/strands

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多条发光丝带在透明画布上起伏、交织，形成流动线束。

触发：页面展示后持续流动

作用层：content

### 实现方法

OGL片元着色器按多组曲线距离合成发光丝带，可用透明渲染目标与玻璃合成生成叠层线束。

1. 在React客户端引入锁定registry的Strands.css、Strands.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 由count、spread与waviness建立丝带场，使用thickness、taper和glow控制横截面及边缘，每帧按speed推进曲线。
3. 使用源码已提供的colors、count、speed、amplitude、waviness、thickness等属性配置；触发依据：页面展示后持续流动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- colors：锁定源码默认：['#FF4242', '#7C3AED', '#06B6D4', '#EAB308']
- count：锁定源码默认：3
- speed：锁定源码默认：0.5
- amplitude：锁定源码默认：1
- waviness：锁定源码默认：1
- thickness：锁定源码默认：0.7
- glow：锁定源码默认：2.6
- taper：锁定源码默认：3
- spread：锁定源码默认：1
- hueShift：锁定源码默认：0
- intensity：锁定源码默认：0.6
- saturation：锁定源码默认：1.5
- opacity：锁定源码默认：1
- scale：锁定源码默认：1.5
- glass：锁定源码默认：false
- refraction：锁定源码默认：1
- dispersion：锁定源码默认：1
- glassSize：锁定源码默认：1

### 适用场景

- 科技品牌氛围
- 音乐活动背景

避免用于：

- 需要逐条编辑的流程连线

### 限制与接入建议

- 发光线束是程序纹理，不是实际绳索或可选择的独立路径。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低count并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及count，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Strands-JS-CSS.json；资料核对时间：2026-10-25T07:53:00.177Z；SHA256：c666760cb047e4952b9eec564a8b9953ed7d26ad520c7afec14b125066afb2f3；哈希对象：registry-response；文件：Strands.css、Strands.jsx

---

## 贴纸卷角揭起 · Sticker Peel

案例ID：b04188ba3f32dd46

来源：https://reactbits.dev/animations/sticker-peel

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

贴纸边角悬起并可被揭开，阴影和三维变换呈现纸张厚度。

触发：鼠标悬停与拖动揭起

作用层：surface

### 实现方法

细分贴纸网格按剥离方向和卷曲半径弯折，WebGL结合正反面材质、阴影与后处理呈现卷角。

1. 在React客户端引入锁定registry的StickerPeel.css、StickerPeel.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用width和轮廓生成网格与纹理，hover或active状态改变剥离百分比，再用curlRadius计算弯曲顶点。
3. 使用源码已提供的width、rotate、peelDirection、peelBackHoverPct、peelBackActivePct、curlRadius等属性配置；触发依据：鼠标悬停与拖动揭起。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- width：锁定源码默认：200
- rotate：锁定源码默认：0
- peelDirection：锁定源码默认：0
- peelBackHoverPct：锁定源码默认：25
- peelBackActivePct：锁定源码默认：40
- curlRadius：锁定源码默认：12
- finish：锁定源码默认：'gloss'
- backColor：锁定源码默认：'#d4d4d8'
- lightingIntensity：锁定源码默认：0.5
- shadowIntensity：锁定源码默认：0.6
- followPointer：锁定源码默认：true
- draggable：锁定源码默认：true
- swing：锁定源码默认：1
- friction：锁定源码默认：0.5
- bounce：锁定源码默认：0.35
- intro：锁定源码默认：true
- initialPosition：锁定源码默认：'center'

### 适用场景

- 活动贴纸
- 创意商品标签

避免用于：

- 关键确认或法律条款

### 限制与接入建议

- 需要可用图像纹理和WebGL；贴纸剥离只是视觉交互，不能自动代替真实领取流程。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/StickerPeel-JS-CSS.json；资料核对时间：2026-10-25T07:53:00.428Z；SHA256：8e183944b47dc558db1dcc8b365afeadffd94aa6375bc83cbb406cd999c7c5f8；哈希对象：registry-response；文件：StickerPeel.css、StickerPeel.jsx

---

## 方块像素鼠标尾迹 · Pixel Trail

案例ID：503c799a9ff6298c

来源：https://reactbits.dev/animations/pixel-trail

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

鼠标移动时留下逐渐淡出的像素方块，形成复古数字尾迹。

触发：鼠标移动

作用层：content

### 实现方法

WebGL纹理网格保存指针经过单元的时间和强度，按maxAge衰减并以形状或粘液滤镜合成。

1. 在React客户端引入锁定registry的PixelTrail.css、PixelTrail.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 把指针坐标映射到gridSize网格，依据trailSize和interpolate写入单元，逐帧老化并绘制颜色与gap。
3. 使用源码已提供的gridSize、trailSize、maxAge、interpolate、easingFunction、gooeyFilter等属性配置；触发依据：鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- gridSize：锁定源码默认：40
- trailSize：锁定源码默认：0.1
- maxAge：锁定源码默认：250
- interpolate：锁定源码默认：5
- easingFunction：锁定源码默认：identityEase
- gooeyFilter：锁定源码默认：{ strength: 2 }
- color：锁定源码默认：'#ffffff'
- shape：锁定源码默认：'square'
- gap：锁定源码默认：0.08
- decay：锁定源码默认：'fade'
- flow：锁定源码默认：0
- gravity：锁定源码默认：0
- sparkle：锁定源码默认：0
- clickBurst：锁定源码默认：false
- shine：锁定源码默认：0.6
- glow：锁定源码默认：0.4

### 适用场景

- 复古数字作品
- 游戏主题互动背景

避免用于：

- 复杂办公表单

### 限制与接入建议

- 像素尾迹为装饰，不能遮挡原生焦点或截获页面点击。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/PixelTrail-JS-CSS.json；资料核对时间：2026-10-25T07:53:00.586Z；SHA256：dd761dcc37854392bfe722fcb2a60b8c3bb217b01fc8337e523af2a20541d934；哈希对象：registry-response；文件：PixelTrail.css、PixelTrail.jsx

---

## 交互立方体阵列 · Cubes

案例ID：7f70b599aa27a7c6

来源：https://reactbits.dev/animations/cubes

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多枚三维立方体组成阵列，支持自动旋转或悬停响应。

触发：持续旋转或鼠标悬停

作用层：content

### 实现方法

WebGL批量立方体几何根据局部指针方向旋转，悬停扫过和点击可附加波形扰动。

1. 在React客户端引入锁定registry的Cubes.css、Cubes.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 由gridSize与gap生成立方体阵列，将指针距离映射成maxAngle内的旋转，以投影矩阵绘制面色和边线。
3. 使用源码已提供的gridSize、gap、faceColor、edgeColor、edgeWidth、edgeStyle等属性配置；触发依据：持续旋转或鼠标悬停。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- gridSize：锁定源码默认：10
- gap：锁定源码默认：0.18
- faceColor：锁定源码默认：'#120F17'
- edgeColor：锁定源码默认：'#ffffff'
- edgeWidth：锁定源码默认：1
- edgeStyle：锁定源码默认：'solid'
- faceOpacity：锁定源码默认：1
- shading：锁定源码默认：0.6
- maxAngle：锁定源码默认：45
- radius：锁定源码默认：3
- speed：锁定源码默认：1
- bounce：锁定源码默认：0.4
- brush：锁定源码默认：1
- perspective：锁定源码默认：0
- autoAnimate：锁定源码默认：true
- rippleOnClick：锁定源码默认：true
- rippleColor：锁定源码默认：'#ffffff'
- rippleSpeed：锁定源码默认：1
- intro：锁定源码默认：true
- paused：锁定源码默认：false

### 适用场景

- 几何品牌首屏
- 互动展示墙

避免用于：

- 真实工程模型编辑

### 限制与接入建议

- 立方体阵列不是可编辑三维场景；面数、边线和阴影会增加GPU负担。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Cubes-JS-CSS.json；资料核对时间：2026-10-25T07:53:00.714Z；SHA256：41554daeac0885131b329c71246d4dc1f582a841222c902de1b208e5de78eca3；哈希对象：registry-response；文件：Cubes.css、Cubes.jsx

---

## 液态金属标志 · Metallic Paint

案例ID：46a94d1d040cd951

来源：https://reactbits.dev/animations/metallic-paint

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

为 SVG 或图形施加流动金属反光，使表面像液态金属油漆。

触发：页面展示后持续流动反光

作用层：surface

### 实现方法

将标志或文字栅格生成覆盖与边缘场，WebGL片元着色器结合形变与色散形成液态金属反射。

1. 在React客户端引入锁定registry的MetallicPaint.css、MetallicPaint.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 读取图源或字体生成纹理，使用density、distortion、edgeBend和dispersion计算表面高光，再输出透明背景合成。
3. 使用源码已提供的fontFamily、fontWeight、color、backgroundColor、density、softness等属性配置；触发依据：页面展示后持续流动反光。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- fontFamily：锁定源码默认：'system-ui, sans-serif'
- fontWeight：锁定源码默认：800
- color：锁定源码默认：'#ffffff'
- backgroundColor：锁定源码默认：'transparent'
- density：锁定源码默认：2
- softness：锁定源码默认：0.1
- dispersion：锁定源码默认：0.3
- distortion：锁定源码默认：0.07
- edgeBend：锁定源码默认：0.6
- angle：锁定源码默认：70
- speed：锁定源码默认：1
- scale：锁定源码默认：0.6
- rotation：锁定源码默认：0
- mouseTilt：锁定源码默认：0.5
- lightMode：锁定源码默认：false
- intro：锁定源码默认：true
- paused：锁定源码默认：false

### 适用场景

- 品牌标志动效
- 金属主题标题

避免用于：

- 要求物理准确的材质预览

### 限制与接入建议

- 材质来自程序高光而非真实场景反射；图源轮廓和透明边缘影响效果。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低density并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及density，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/MetallicPaint-JS-CSS.json；资料核对时间：2026-10-25T07:53:00.752Z；SHA256：a64a0f9c15623a8fb58ca7eb2251480346f0d2cfb969b01446cde0c89f436044；哈希对象：registry-response；文件：MetallicPaint.css、MetallicPaint.jsx

---

## 动态胶片颗粒 · Noise

案例ID：6de83703db63aa5c

来源：https://reactbits.dev/animations/noise

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

在图片、渐变或页面上覆盖动态颗粒，可呈现胶片、纸张或电视杂讯。

触发：页面展示后持续纹理变化

作用层：content

### 实现方法

Canvas生成可重复颗粒纹理瓦片，按fps更新噪声，可叠加尘点、划痕与扫描线。

1. 在React客户端引入锁定registry的Noise.css、Noise.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 设置opacity、size与blendMode生成噪声tile，在受控频率下重绘并平铺到独立装饰层。
3. 使用源码已提供的opacity、size、fps、blendMode、contrast、colored等属性配置；触发依据：页面展示后持续纹理变化。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- opacity：锁定源码默认：0.2
- size：锁定源码默认：1
- fps：锁定源码默认：24
- blendMode：锁定源码默认：'overlay'
- contrast：锁定源码默认：0.6
- colored：锁定源码默认：false
- dust：锁定源码默认：0
- scratches：锁定源码默认：0
- scanlines：锁定源码默认：0
- flicker：锁定源码默认：0
- fixed：锁定源码默认：false

### 适用场景

- 胶片摄影封面
- 复古纸张氛围

避免用于：

- 数据图表和正文表面

### 限制与接入建议

- 噪声会降低对比和细节辨识；不要覆盖重要文字、图表与输入内容。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Noise-JS-CSS.json；资料核对时间：2026-10-25T07:53:00.677Z；SHA256：58f835c77b1a60b524448afe76205424426589a356729514afe2f5c27314d936；哈希对象：registry-response；文件：Noise.css、Noise.jsx

---

## 鼠标失焦图形 · Shape Blur

案例ID：f071eb932ef995f6

来源：https://reactbits.dev/animations/shape-blur

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

原本清晰的图形在指针附近模糊并带有色边，模拟镜头失焦。

触发：鼠标在图形区域移动

作用层：surface

### 实现方法

先生成图形距离场，指针附近改变局部模糊半径，再通过WebGL多阶段模糊与合成产生失焦边缘。

1. 在React客户端引入锁定registry的ShapeBlur.css、ShapeBlur.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 依据shape或src栅格化形状，构造距离纹理，局部指针控制模糊场并合成色边或回声。
3. 使用源码已提供的shape、sides、size、roundness、thickness、fill等属性配置；触发依据：鼠标在图形区域移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- shape：锁定源码默认：'rect'
- sides：锁定源码默认：6
- size：锁定源码默认：0.8
- roundness：锁定源码默认：0.2
- thickness：锁定源码默认：2
- fill：锁定源码默认：false
- echoes：锁定源码默认：1
- spacing：锁定源码默认：12
- color：锁定源码默认：'#ffffff'
- blur：锁定源码默认：16
- lensSize：锁定源码默认：0.3
- lensSoftness：锁定源码默认：0.7
- focus：锁定源码默认：false
- chroma：锁定源码默认：0.3
- rotation：锁定源码默认：0
- spin：锁定源码默认：0
- idle：锁定源码默认：true

### 适用场景

- 实验品牌图形
- 创意作品封面

避免用于：

- 正文或关键标识

### 限制与接入建议

- 失焦只适合装饰图形；不能把模糊图像当成清晰可读的信息。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ShapeBlur-JS-CSS.json；资料核对时间：2026-10-25T07:53:01.118Z；SHA256：8949c30d35b01f05843dcd8be797f94e346b420d9f32448d201a935a7704f506；哈希对象：registry-response；文件：ShapeBlur.css、ShapeBlur.jsx

---

## 坐标测量十字光标 · Crosshair

案例ID：5a03391fe96ea170

来源：https://reactbits.dev/animations/crosshair

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

十字线显示实时坐标，靠近链接或按钮时锁定并测量目标边界。

触发：鼠标移动；进入链接或按钮

作用层：content

### 实现方法

Canvas绘制水平垂直测量线、坐标和目标框，依据局部指针或目标边界改变线段长度与吸附。

1. 在React客户端引入锁定registry的Crosshair/Crosshair.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 选择containerRef限定坐标系，缓存目标矩形，按gap、thickness和smoothing绘制十字线及标签。
3. 使用源码已提供的color、containerRef、thickness、opacity、lineStyle、gap等属性配置；触发依据：鼠标移动；进入链接或按钮。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- color：锁定源码默认：'#ffffff'
- containerRef：锁定源码默认：null
- thickness：锁定源码默认：1
- opacity：锁定源码默认：0.85
- lineStyle：锁定源码默认：'solid'
- gap：锁定源码默认：0
- fade：锁定源码默认：0
- smoothing：锁定源码默认：0.35
- showCoordinates：锁定源码默认：true
- targetEffect：锁定源码默认：'lock'
- targetSelector：锁定源码默认：'a, button, [data-crosshair-target]'
- clickPulse：锁定源码默认：true
- hideCursor：锁定源码默认：false
- blendMode：锁定源码默认：'normal'

### 适用场景

- 设计展示工具
- 游戏化交互区域

避免用于：

- 真实仪器测量界面

### 限制与接入建议

- 展示的屏幕坐标不是物理测量结果；自定义光标不应隐藏键盘焦点。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：检查短屏滚动行程、内部滚动与外部页面的分工，适度减少可见层数，保留全部内容和可直接操作入口。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Crosshair-JS-CSS.json；资料核对时间：2026-10-25T07:53:01.128Z；SHA256：bd817f8916a20f595bf77d746e1329dd0a636df5370755376c242b01c6b990d8；哈希对象：registry-response；文件：Crosshair/Crosshair.jsx

---

## 鼠标拖出图片尾迹 · Image Trail

案例ID：4a95192b93c40245

来源：https://reactbits.dev/animations/image-trail

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

鼠标移动时不断出现图片，图片形成跟随方向的尾迹并退场。

触发：鼠标移动

作用层：content

### 实现方法

图片DOM池按指针移动距离依次取出，GSAP为每张设置位置、旋转、缩放和退出时间线。

1. 在React客户端引入锁定registry的ImageTrail.css、ImageTrail.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 缓存图片尺寸和最近指针位置，越过移动阈值后复用下一张图片，按variant计算散射方向并让旧图片退场。
3. 使用源码已提供的items、variant等属性配置；触发依据：鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：gsap@^3.13.0

参数：

- items：锁定源码默认：[]
- variant：锁定源码默认：1

### 适用场景

- 摄影作品集
- 创意艺术首屏

避免用于：

- 密集文本内容区

### 限制与接入建议

- 需要准备多张合适尺寸图片；不可在每次mousemove中无限新增DOM。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ImageTrail-JS-CSS.json；资料核对时间：2026-10-25T07:53:01.132Z；SHA256：e23a308c2d904772c0036b66bf044b4e6adc53682a607448159265823e5da3f9；哈希对象：registry-response；文件：ImageTrail.css、ImageTrail.jsx

---

## 丝带鼠标尾迹 · Ribbons

案例ID：b6609641f2f0fff1

来源：https://reactbits.dev/animations/ribbons

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

柔软丝带随鼠标流动，受运动和回弹影响形成弯曲轨迹。

触发：鼠标移动

作用层：content

### 实现方法

WebGL细分带状网格保存一串跟随节点，弹簧、阻尼和波形共同更新轨迹，再绘制柔和带面。

1. 在React客户端引入锁定registry的Ribbons.css、Ribbons.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按length与thickness分配轨迹，指针推动头部、后续节点逐段追随，以stiffness和bounce控制延迟回弹。
3. 使用源码已提供的colors、thickness、length、spread、stiffness、bounce等属性配置；触发依据：鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- colors：锁定源码默认：DEFAULT_COLORS
- thickness：锁定源码默认：30
- length：锁定源码默认：1.4
- spread：锁定源码默认：18
- stiffness：锁定源码默认：0.5
- bounce：锁定源码默认：0.5
- shape：锁定源码默认：'lens'
- wave：锁定源码默认：0
- softness：锁定源码默认：0
- fade：锁定源码默认：false
- opacity：锁定源码默认：1
- backgroundColor：锁定源码默认：'transparent'

### 适用场景

- 时尚作品集
- 绘画互动区域

避免用于：

- 真实运动轨迹分析

### 限制与接入建议

- 尾迹带是装饰，不能视为真实绳索动力学或可交互路径导航。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Ribbons-JS-CSS.json；资料核对时间：2026-10-25T07:53:01.230Z；SHA256：e7deb9b31a9f724ad9cf6ff842e2d04603a0ef83a9d71c019ebc192002290d9e；哈希对象：registry-response；文件：Ribbons.css、Ribbons.jsx

---

## 彩色液体鼠标 · Splash Cursor

案例ID：6a871dcba551b630

来源：https://reactbits.dev/animations/splash-cursor

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

鼠标移动激起彩色液体飞溅和卷曲波纹，颜色随流体扩散。

触发：鼠标移动或触摸滑动

作用层：content

### 实现方法

WebGL双缓冲流体模拟在指针处注入染料与速度，经过平流、旋度和压力迭代呈现彩色飞溅。

1. 在React客户端引入锁定registry的SplashCursor/SplashCursor.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 建立速度和染料渲染目标，以SPLAT_RADIUS及SPLAT_FORCE注入力，再按耗散和压力迭代推进模拟。
3. 使用源码已提供的SIM_RESOLUTION、DYE_RESOLUTION、CAPTURE_RESOLUTION、DENSITY_DISSIPATION、VELOCITY_DISSIPATION、PRESSURE等属性配置；触发依据：鼠标移动或触摸滑动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- SIM_RESOLUTION：锁定源码默认：128
- DYE_RESOLUTION：锁定源码默认：1440
- CAPTURE_RESOLUTION：锁定源码默认：512
- DENSITY_DISSIPATION：锁定源码默认：3.5
- VELOCITY_DISSIPATION：锁定源码默认：2
- PRESSURE：锁定源码默认：0.1
- PRESSURE_ITERATIONS：锁定源码默认：20
- CURL：锁定源码默认：3
- SPLAT_RADIUS：锁定源码默认：0.2
- SPLAT_FORCE：锁定源码默认：6000
- SHADING：锁定源码默认：true
- COLOR_UPDATE_SPEED：锁定源码默认：10
- BACK_COLOR：锁定源码默认：{ r: 0.5, g: 0, b: 0 }
- TRANSPARENT：锁定源码默认：true
- RAINBOW_MODE：锁定源码默认：true
- COLOR：锁定源码默认：'#ff0000'

### 适用场景

- 互动艺术画布
- 音乐氛围幕布

避免用于：

- 精确科学流体测量

### 限制与接入建议

- 全屏流体需要GPU资源；DYE_RESOLUTION与SIM_RESOLUTION过高会影响手机流畅度。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低SIM_RESOLUTION、DYE_RESOLUTION、CAPTURE_RESOLUTION并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及SIM_RESOLUTION、DYE_RESOLUTION、CAPTURE_RESOLUTION，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/SplashCursor-JS-CSS.json；资料核对时间：2026-10-25T07:53:01.229Z；SHA256：137601db1407a1a6ac4d2be5696b0e44d45334d6669b79e0f3a69c636eb91493；哈希对象：registry-response；文件：SplashCursor/SplashCursor.jsx

---

## 融合分离的液态球 · Meta Balls

案例ID：eceb0c12a98cf64b

来源：https://reactbits.dev/animations/meta-balls

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

液态圆球靠近时轮廓融合，分离时又恢复为独立圆球。

触发：持续运动；按配置跟随鼠标

作用层：content

### 实现方法

WebGL片元场将多个圆球的平滑距离或能量叠加，以阈值着色产生靠近融合和分离的轮廓。

1. 在React客户端引入锁定registry的MetaBalls.css、MetaBalls.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 为ballCount个球生成位置相位，用clumpFactor及速度控制运动，鼠标球参与同一融合场。
3. 使用源码已提供的color、cursorBallColor、speed、enableMouseInteraction、hoverSmoothness、animationSize等属性配置；触发依据：持续运动；按配置跟随鼠标。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- color：锁定源码默认：'#ffffff'
- cursorBallColor：锁定源码默认：'#ffffff'
- speed：锁定源码默认：0.3
- enableMouseInteraction：锁定源码默认：true
- hoverSmoothness：锁定源码默认：0.1
- animationSize：锁定源码默认：30
- ballCount：锁定源码默认：15
- clumpFactor：锁定源码默认：1
- cursorBallSize：锁定源码默认：3
- enableTransparency：锁定源码默认：false
- variant：锁定源码默认：'solid'
- motion：锁定源码默认：'orbit'
- gooeyness：锁定源码默认：0.5
- stickiness：锁定源码默认：0.5
- stretch：锁定源码默认：0.5
- wobble：锁定源码默认：0.5
- lineWidth：锁定源码默认：1.5
- rings：锁定源码默认：4
- clickBurst：锁定源码默认：true
- intro：锁定源码默认：true
- paused：锁定源码默认：false

### 适用场景

- 生物主题主视觉
- 抽象品牌背景

避免用于：

- 真实分子键结构教学

### 限制与接入建议

- 只呈现二维场的融合外观，不是物理液体体积或真实三维碰撞。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低ballCount并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及ballCount，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/MetaBalls-JS-CSS.json；资料核对时间：2026-10-25T07:53:01.831Z；SHA256：40f74b8d98472120b89cb90081556745c035c3a69e0ba03e805421e0b18f3be1；哈希对象：registry-response；文件：MetaBalls.css、MetaBalls.jsx

---

## 液态团块鼠标 · Blob Cursor

案例ID：6541ae8dc1d23634

来源：https://reactbits.dev/animations/blob-cursor

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

液体团块跟随指针拉伸、晃动并分出小液滴，可呈金属或果冻质感。

触发：鼠标移动

作用层：content

### 实现方法

Three.js片元距离场组合光标主体、延迟拖尾与短寿命液滴，材质模式决定金属或果冻高光。

1. 在React客户端引入锁定registry的BlobCursor.css、BlobCursor.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 维护指针惯性位置、尾迹与液滴生命周期，按morph和lag更新场，再以material和depth形成体积高光。
3. 使用源码已提供的material、color、size、morph、morphSpeed、depth等属性配置；触发依据：鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：three@^0.180.0

参数：

- material：锁定源码默认：'chrome'
- color：锁定源码默认：'#3B82F6'
- size：锁定源码默认：140
- morph：锁定源码默认：0
- morphSpeed：锁定源码默认：0.4
- depth：锁定源码默认：1
- trail：锁定源码默认：16
- lag：锁定源码默认：0.55
- goo：锁定源码默认：1
- stretch：锁定源码默认：0.6
- wobble：锁定源码默认：1
- drip：锁定源码默认：0
- splash：锁定源码默认：true
- splashCount：锁定源码默认：6
- splashSpeed：锁定源码默认：0.5
- splashSize：锁定源码默认：0.5
- splashGravity：锁定源码默认：0
- regrow：锁定源码默认：0.5
- shine：锁定源码默认：1
- shadow：锁定源码默认：false
- blend：锁定源码默认：'normal'
- hideCursor：锁定源码默认：true

### 适用场景

- 创意品牌互动
- 游戏活动页面

避免用于：

- 高精度表单输入

### 限制与接入建议

- 软团块是光标装饰，不应截获点击或伪装系统光标状态。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低splashCount并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及splashCount，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/BlobCursor-JS-CSS.json；资料核对时间：2026-10-25T07:53:01.591Z；SHA256：513ab48b99e107b822cc3b42090a72b2d8725f50914d476df136ea928c021ab3；哈希对象：registry-response；文件：BlobCursor.css、BlobCursor.jsx

---

## 星光绕行边框 · Star Border

案例ID：ad9c933f8a0f544e

来源：https://reactbits.dev/animations/star-border

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

星光沿按钮、卡片等元素的外轮廓移动，拖出光带和星尘。

触发：页面展示后沿边框循环

作用层：border、outer-glow

### 实现方法

Canvas沿元素真实圆角轮廓累计弧长，让亮点按进度移动并在其后绘制光带与星尘。

1. 在React客户端引入锁定registry的StarBorder.css、StarBorder.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量容器宽高和radius，依据duration计算轮廓进度，按trailLength、stars与sparkle绘制边缘尾迹。
3. 使用源码已提供的as、duration、thickness、radius、trailLength、stars等属性配置；触发依据：页面展示后沿边框循环。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在border、outer-glow层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- as：锁定源码默认：'button'
- duration：锁定源码默认：4
- thickness：锁定源码默认：1
- radius：锁定源码默认：12
- trailLength：锁定源码默认：0.3
- stars：锁定源码默认：1
- glow：锁定源码默认：0.6
- sparkle：锁定源码默认：false
- direction：锁定源码默认：'clockwise'
- hover：锁定源码默认：'lap'
- clickPulse：锁定源码默认：true
- theme：锁定源码默认：'dark'

### 适用场景

- 活动行动按钮
- 重要展示卡片边缘

避免用于：

- 长篇阅读内容表面

### 限制与接入建议

- 只围绕边框，不把星光铺满surface；该实现不是简单移动一张整面渐变。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/StarBorder-JS-CSS.json；资料核对时间：2026-10-25T07:53:01.593Z；SHA256：f42c627fcd08026817cb97b0499b27f1ce622439c716e5b5a1e1a169fae0964d；哈希对象：registry-response；文件：StarBorder.css、StarBorder.jsx

---

## 全息闪粉卡片 · Holo Card

案例ID：2b63dcb0d718c3b9

来源：https://reactbits.dev/components/holo-card

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

卡片表面呈可变全息箔纹理，倾斜时色彩与反射改变，边框出现闪粉。

触发：鼠标移动使卡片倾斜

作用层：surface

### 实现方法

WebGL片元层合成全息箔纹理与闪粉，DOM卡片随局部指针三维倾斜，反射方向与高光同步更新。

1. 在React客户端引入锁定registry的HoloCard.css、HoloCard.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 由preset建立箔纹配色，把指针位置写入材质与旋转目标，以intensity、glare和edgeSparkle控制表面及边缘光。
3. 使用源码已提供的alt、preset、intensity、scale、edgeSparkle、frame等属性配置；触发依据：鼠标移动使卡片倾斜。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- alt：锁定源码默认：''
- preset：锁定源码默认：'bursts'
- intensity：锁定源码默认：0.85
- scale：锁定源码默认：1
- edgeSparkle：锁定源码默认：0.8
- frame：锁定源码默认：4
- glare：锁定源码默认：0.5
- foilColor：锁定源码默认：'#e2e6ec'
- width：锁定源码默认：320
- radius：锁定源码默认：14
- tiltMax：锁定源码默认：14
- hoverScale：锁定源码默认：1.04
- idle：锁定源码默认：true
- shadow：锁定源码默认：true

### 适用场景

- 收藏品展示
- 艺术商品卡

避免用于：

- 长时间阅读的正文卡

### 限制与接入建议

- 全息是程序反射而非真实环境采样；卡片内容与装饰材质要分别控制。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/HoloCard-JS-CSS.json；资料核对时间：2026-10-25T07:53:01.712Z；SHA256：53615b6f7a462539ab4f98c4f67e1fadb4c622b3cd45f4b7892720b0f10e6ef4；哈希对象：registry-response；文件：HoloCard.css、HoloCard.jsx

---

## 三维圆环图片轮播 · Circular Carousel

案例ID：b3cbe1df967269b6

来源：https://reactbits.dev/components/circular-carousel

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

图片沿三维圆环排布，可惯性拖动、吸附定位并点击聚焦。

触发：拖动、滚动或点击图片

作用层：layout、content

### 实现方法

DOM图片卡以三维旋转矩阵排成圆环，拖动惯性改变角度，接近正面的卡片吸附并可进入聚焦态。

1. 在React客户端引入锁定registry的CircularCarousel.css、CircularCarousel.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按cardWidth与gap计算环半径，维护拖动速度和目标角度，逐卡投影位置并按深度排序，点击时切换焦点布局。
3. 使用源码已提供的items、preset、intro、cardWidth、aspectRatio、gap等属性配置；触发依据：拖动、滚动或点击图片。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- items：锁定源码默认：DEFAULT_ITEMS
- preset：锁定源码默认：'cylinder'
- intro：锁定源码默认：'rise'
- cardWidth：锁定源码默认：220
- aspectRatio：锁定源码默认：1
- gap：锁定源码默认：25
- autoplay：锁定源码默认：'drift'
- speed：锁定源码默认：14
- interval：锁定源码默认：3
- direction：锁定源码默认：'left'
- draggable：锁定源码默认：true
- momentum：锁定源码默认：0.6
- snap：锁定源码默认：true
- pauseOnHover：锁定源码默认：true
- focusOnClick：锁定源码默认：true
- parallax：锁定源码默认：0.3
- stretch：锁定源码默认：0.5
- depthFade：锁定源码默认：0.55
- fadeColor：锁定源码默认：'#000000'
- innerShade：锁定源码默认：0.6
- cornerRadius：锁定源码默认：12
- captions：锁定源码默认：false

### 适用场景

- 摄影作品浏览
- 精选产品展示

避免用于：

- 密集资料检索结果

### 限制与接入建议

- 需要控制同时可见卡数与图片体积；环形视觉不适合替代完整可扫描的项目目录。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的autoplay控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/CircularCarousel-JS-CSS.json；资料核对时间：2026-10-25T07:53:01.777Z；SHA256：685d07c4abfb523cbe52a8a3850322d012280367a8497e6b4f7c6bba55b18aa7；哈希对象：registry-response；文件：CircularCarousel.css、CircularCarousel.jsx

---

## 液态边缘图片带 · Flex Carousel

案例ID：60a03c81df543f6a

来源：https://reactbits.dev/components/flex-carousel

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

无限图片横排穿过两端的液态玻璃区域，可弯曲、加速挤压并点击聚焦。

触发：持续流动；拖动或点击图片

作用层：layout、content

### 实现方法

OGL将无限横排图片绘制为纹理平面，边缘镜片着色器对经过两端的图像做弯曲与折射。

1. 在React客户端引入锁定registry的FlexCarousel.css、FlexCarousel.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 维护循环滚动偏移，cardVertex计算图片位置，lensFragment在边缘区域重采样，squeeze与fit调整形变和裁切。
3. 使用源码已提供的items、preset、intro、cardHeight、gap、radius等属性配置；触发依据：持续流动；拖动或点击图片。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- items：锁定源码默认：DEFAULT_ITEMS
- preset：锁定源码默认：'liquid'
- intro：锁定源码默认：'rise'
- cardHeight：锁定源码默认：0.5
- gap：锁定源码默认：12
- radius：锁定源码默认：0
- fit：锁定源码默认：'natural'
- squeeze：锁定源码默认：0.2
- focusOnClick：锁定源码默认：true
- autoplay：锁定源码默认：false
- interval：锁定源码默认：4
- captions：锁定源码默认：true
- captureWheel：锁定源码默认：true

### 适用场景

- 时尚作品图片带
- 品牌商品画廊

避免用于：

- 文档与文字截图列表

### 限制与接入建议

- 两端的液态玻璃是视觉采样区域，不改变原图；跨域图片需满足纹理读取条件。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的autoplay控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/FlexCarousel-JS-CSS.json；资料核对时间：2026-10-25T07:53:02.112Z；SHA256：212d61eb955f2b6bc608403d5f06a202a01175384b4c7bd956043571772f7343；哈希对象：registry-response；文件：FlexCarousel.css、FlexCarousel.jsx

---

## 无限螺旋图片墙 · Infinite Spiral

案例ID：1e1931c26a201a92

来源：https://reactbits.dev/components/infinite-spiral

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

图片沿三维螺旋轨道首尾循环运动，形成有纵深的图片展示。

触发：持续循环；按配置响应交互

作用层：content

### 实现方法

DOM图片卡沿三维螺旋公式定位，持续或滚动驱动相位，超出纵向区间的卡片循环回到另一端。

1. 在React客户端引入锁定registry的InfiniteSpiral.css、InfiniteSpiral.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 使用radius、verticalSpacing和perspective建立螺旋，以speed及animationMode更新进度，按深度调整层级与可见性。
3. 使用源码已提供的items、speed、direction、animationMode、radius、cardWidth等属性配置；触发依据：持续循环；按配置响应交互。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- items：锁定源码默认：[]
- speed：锁定源码默认：0.55
- direction：锁定源码默认：'up'
- animationMode：锁定源码默认：'auto'
- radius：锁定源码默认：170
- cardWidth：锁定源码默认：100
- cardHeight：锁定源码默认：100
- verticalSpacing：锁定源码默认：60
- perspective：锁定源码默认：1000
- cardsPerTurn：锁定源码默认：7
- rotation：锁定源码默认：0
- cardTilt：锁定源码默认：0
- cardRadius：锁定源码默认：10
- centerScale：锁定源码默认：1.2
- edgeFade：锁定源码默认：0.3
- edgeBlur：锁定源码默认：6
- pauseOnHover：锁定源码默认：true
- imageFit：锁定源码默认：'cover'
- grayscale：锁定源码默认：0

### 适用场景

- 沉浸式摄影首屏
- 艺术展品集合

避免用于：

- 重要目录导航

### 限制与接入建议

- 无限循环需要准备合适图片数量与清晰点击区；文字说明应在稳定独立区域呈现。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：检查短屏滚动行程、内部滚动与外部页面的分工，适度减少可见层数，保留全部内容和可直接操作入口。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/InfiniteSpiral-JS-CSS.json；资料核对时间：2026-10-25T07:53:02.160Z；SHA256：f4602c833525ad049bff29f07cc3c866dbb77cd329b9ece68b5e0603481adaba；哈希对象：registry-response；文件：InfiniteSpiral.css、InfiniteSpiral.jsx

---

## 纵深轨道轮播 · Depth Carousel

案例ID：39867ab00dbd6820

来源：https://reactbits.dev/components/depth-carousel

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

卡片沿三维轨道向深处排列，可拖动、键盘切换或自动前进。

触发：拖动、方向键或自动切换

作用层：layout、content

### 实现方法

GSAP驱动卡片在纵深轨道中的位置、缩放、倾斜和明暗，拖动、滚轮或按钮更新浮点索引。

1. 在React客户端引入锁定registry的DepthCarousel.css、DepthCarousel.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 把当前位置pos映射到各卡相对槽位，用radius、depth、spread和tilt计算姿态，再以时间线趋近新索引。
3. 使用源码已提供的items、cardWidth、cardHeight、radius、tint、depth等属性配置；触发依据：拖动、方向键或自动切换。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：gsap@^3.13.0

参数：

- items：锁定源码默认：DEFAULT_ITEMS
- cardWidth：锁定源码默认：300
- cardHeight：锁定源码默认：380
- radius：锁定源码默认：18
- tint：锁定源码默认：'#05060a'
- depth：锁定源码默认：220
- spread：锁定源码默认：90
- tilt：锁定源码默认：22
- tiltDirection：锁定源码默认：'right'
- perspective：锁定源码默认：1400
- visibleCards：锁定源码默认：4
- falloff：锁定源码默认：0.2
- blur：锁定源码默认：6
- duration：锁定源码默认：700
- ease：锁定源码默认：'power3.out'
- autoplay：锁定源码默认：false
- autoplayDelay：锁定源码默认：3200
- loop：锁定源码默认：true
- showControls：锁定源码默认：true
- showIndicators：锁定源码默认：true

### 适用场景

- 案例精选浏览
- 产品功能介绍

避免用于：

- 需要同时比较大量数据的界面

### 限制与接入建议

- 属于模拟空间卡片排列，不是WebGL三维场景；必须保留明确前后切换入口。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的autoplay控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/DepthCarousel-JS-CSS.json；资料核对时间：2026-10-25T07:53:02.227Z；SHA256：65e44ab71d2b23bd06eb3cf758ba8ab3eba6c0a6da8bf36c869f81abb3786d92；哈希对象：registry-response；文件：DepthCarousel.css、DepthCarousel.jsx

---

## 液体形变图片切换 · Morph Slider

案例ID：98308cb464a3d478

来源：https://reactbits.dev/components/morph-slider

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

滑块切换图片时，图像通过位移扭曲像熔化一样过渡到下一张。

触发：切换滑块图片

作用层：content

### 实现方法

OGL使用前后两张纹理和位移函数，GSAP推进transition进度，使图像弯曲、熔化或色散后交接。

1. 在React客户端引入锁定registry的MorphSlider.css、MorphSlider.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 预加载相邻图像纹理，切换时设置两张图及方向，按duration和intensity插值纹理坐标与混合权重。
3. 使用源码已提供的items、startIndex、transition、duration、ease、intensity等属性配置；触发依据：切换滑块图片。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11、gsap@^3.13.0

参数：

- items：锁定源码默认：DEFAULT_ITEMS
- startIndex：锁定源码默认：0
- transition：锁定源码默认：'melt'
- duration：锁定源码默认：1.1
- ease：锁定源码默认：'power2.inOut'
- intensity：锁定源码默认：0.55
- scale：锁定源码默认：2.4
- aberration：锁定源码默认：0.35
- drift：锁定源码默认：0.4
- autoplay：锁定源码默认：false
- autoplayDelay：锁定源码默认：4
- loop：锁定源码默认：true
- radius：锁定源码默认：16
- overlayColor：锁定源码默认：'#000000'
- showCaptions：锁定源码默认：true
- showControls：锁定源码默认：true
- showIndicators：锁定源码默认：true

### 适用场景

- 摄影主视觉切图
- 品牌宣传图轮播

避免用于：

- 正文阅读和数据表格

### 限制与接入建议

- 图片需满足跨域纹理条件；过渡不会自动保存业务表单状态，也不应扭曲文字。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的autoplay控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/MorphSlider-JS-CSS.json；资料核对时间：2026-10-25T07:53:02.256Z；SHA256：c0256421992c29604f17652e2ae328f74151435acc4bbfb09502b2722a50f021；哈希对象：registry-response；文件：MorphSlider.css、MorphSlider.jsx

---

## 漂移透视图片墙 · Drift Wall

案例ID：ae8842d7d28e77b0

来源：https://reactbits.dev/components/drift-wall

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

图片块组成无限透视墙并持续飘过，悬停的图片抬起。

触发：持续漂移；鼠标悬停抬起

作用层：content

### 实现方法

DOM图片按列复制成循环轨道，整个墙面施加透视与倾斜，各列以不同速度漂移并支持悬停抬升。

1. 在React客户端引入锁定registry的DriftWall.css、DriftWall.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 根据columns和tile尺寸分列，记录每列循环长度与偏移，逐帧取模滚动并在悬停时降低相应列速度。
3. 使用源码已提供的items、columns、tileWidth、tileHeight、gap、radius等属性配置；触发依据：持续漂移；鼠标悬停抬起。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- items：锁定源码默认：DEFAULT_ITEMS
- columns：锁定源码默认：5
- tileWidth：锁定源码默认：200
- tileHeight：锁定源码默认：132
- gap：锁定源码默认：18
- radius：锁定源码默认：14
- tilt：锁定源码默认：16
- turn：锁定源码默认：-14
- roll：锁定源码默认：0
- perspective：锁定源码默认：1200
- depth：锁定源码默认：120
- speed：锁定源码默认：42
- direction：锁定源码默认：'up'
- variance：锁定源码默认：0.45
- parallax：锁定源码默认：0.6
- pauseOnHover：锁定源码默认：false
- lift：锁定源码默认：64
- fade：锁定源码默认：0.6
- dim：锁定源码默认：0.55
- grayscale：锁定源码默认：false
- overlayColor：锁定源码默认：'#060010'

### 适用场景

- 作品集背景墙
- 摄影展览入口

避免用于：

- 主要业务列表

### 限制与接入建议

- 复制图片需要控制焦点与替代文字重复；自动墙不是完整的可筛选图片管理器。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/DriftWall-JS-CSS.json；资料核对时间：2026-10-25T07:53:02.277Z；SHA256：d88e7baedd313668b2997f1ba7b5ee57beb69d4ebcaf63a3d64d822cf74d0828；哈希对象：registry-response；文件：DriftWall.css、DriftWall.jsx

---

## 手风琴展开画廊 · Accordion Gallery

案例ID：d7d0a0a0e895db95

来源：https://reactbits.dev/components/accordion-gallery

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

一排图片面板在悬停或聚焦时展开，露出带视差的图像和文字。

触发：鼠标悬停或键盘聚焦

作用层：layout、content

### 实现方法

GSAP动态分配横向或纵向面板比例，活动面板展开并同步图像视差、文字及进度装饰。

1. 在React客户端引入锁定registry的AccordionGallery.css、AccordionGallery.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以defaultIndex指定活动项，测量容器可用尺寸，按expandRatio重分配面板大小并过渡媒体和文本姿态。
3. 使用源码已提供的items、defaultIndex、accentColor、overlayColor、textColor、height等属性配置；触发依据：鼠标悬停或键盘聚焦。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：gsap@^3.13.0

参数：

- items：锁定源码默认：DEFAULT_ITEMS
- defaultIndex：锁定源码默认：2
- accentColor：锁定源码默认：'#ffffff'
- overlayColor：锁定源码默认：'#060010'
- textColor：锁定源码默认：'#ffffff'
- height：锁定源码默认：460
- gap：锁定源码默认：10
- radius：锁定源码默认：16
- expandRatio：锁定源码默认：0.52
- orientation：锁定源码默认：'horizontal'
- duration：锁定源码默认：0.6
- ease：锁定源码默认：'power3.out'
- parallax：锁定源码默认：0.5
- tilt：锁定源码默认：8
- stagger：锁定源码默认：0.06
- trigger：锁定源码默认：'hover'
- showLabels：锁定源码默认：true
- grayscale：锁定源码默认：true

### 适用场景

- 旅行目的地介绍
- 产品系列展廊

避免用于：

- 每项信息同等重要的比较表

### 限制与接入建议

- 窄屏同时展开全部面板会挤压内容；所有面板仍应有触屏和键盘可到达的触发。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/AccordionGallery-JS-CSS.json；资料核对时间：2026-10-25T07:53:02.647Z；SHA256：a176e546b9436774e3ac10a49e6c5c2dc3d0035c0dd723185cb9f9765ee19cec；哈希对象：registry-response；文件：AccordionGallery.css、AccordionGallery.jsx

---

## 玻璃高光按钮 · Specular Button

案例ID：f5516684852f347f

来源：https://reactbits.dev/components/specular-button

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

玻璃按钮边缘出现清晰反光，高光移向距离指针最近的位置。

触发：鼠标在按钮附近移动

作用层：surface

### 实现方法

真实button承载交互，独立WebGL画布沿圆角轮廓计算指针最近高光，并合成玻璃折射与描边反射。

1. 在React客户端引入锁定registry的SpecularButton.css、SpecularButton.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量按钮轮廓，把指针投影到边缘，使用radius、blur和tint设置材质，按位置移动反光而保留按钮文本。
3. 使用源码已提供的size、radius、tint、tintOpacity、blur、textColor等属性配置；触发依据：鼠标在按钮附近移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- children：锁定源码默认：'Get Started'
- size：锁定源码默认：'lg'
- radius：锁定源码默认：18
- tint：锁定源码默认：'#ffffff'
- tintOpacity：锁定源码默认：0.04
- blur：锁定源码默认：0
- textColor：锁定源码默认：'#f5f5f5'
- lineColor：锁定源码默认：'#ffffff'
- baseColor：锁定源码默认：'#525252'
- intensity：锁定源码默认：1
- idleIntensity：锁定源码默认：0.35
- shineSize：锁定源码默认：10
- shineFade：锁定源码默认：34
- thickness：锁定源码默认：1.2
- glow：锁定源码默认：1
- speed：锁定源码默认：0.35
- followMouse：锁定源码默认：true
- proximity：锁定源码默认：250
- autoAnimate：锁定源码默认：false
- disabled：锁定源码默认：false
- type：锁定源码默认：'button'

### 适用场景

- 品牌主操作按钮
- 精致工具操作

避免用于：

- 全部密集表格按钮

### 限制与接入建议

- 高光是按钮装饰，不能改变点击命中区域；玻璃背景仍需保证文字对比。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的autoAnimate控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/SpecularButton-JS-CSS.json；资料核对时间：2026-10-25T07:53:02.625Z；SHA256：293bc04dc3cf2ceef738fd2175e65282d5fbb08d5ebe0375ede470a1b9d01acd；哈希对象：registry-response；文件：SpecularButton.css、SpecularButton.jsx

---

## 弯曲滚轮选择器 · Option Wheel

案例ID：8b55134e125aa1d7

来源：https://reactbits.dev/components/option-wheel

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

选项沿弯曲轨道排列，滚动、拖动或方向键使其转动，非选中项倾斜淡出。

触发：滚动、拖动或方向键

作用层：content

### 实现方法

DOM选项沿弯曲坐标排列，通过滚轮或拖动改变连续索引，弹簧收敛到最近选项并淡化两侧。

1. 在React客户端引入锁定registry的OptionWheel.css、OptionWheel.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以spacing和curve计算各行相对位置，维护target与selected索引，选中变化后触发回调并更新可见状态。
3. 使用源码已提供的items、defaultSelected、textColor、activeColor、side、fontSize等属性配置；触发依据：滚动、拖动或方向键。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- items：锁定源码默认：DEFAULT_ITEMS
- defaultSelected：锁定源码默认：3
- textColor：锁定源码默认：'#a6a6a6'
- activeColor：锁定源码默认：'#ffffff'
- side：锁定源码默认：'left'
- fontSize：锁定源码默认：3
- spacing：锁定源码默认：1.4
- curve：锁定源码默认：1
- tilt：锁定源码默认：6
- blur：锁定源码默认：2
- fade：锁定源码默认：0.25
- minOpacity：锁定源码默认：0.05
- smoothing：锁定源码默认：200
- inset：锁定源码默认：80
- loop：锁定源码默认：false
- draggable：锁定源码默认：true
- soundUrl：锁定源码默认：''
- soundVolume：锁定源码默认：0.5

### 适用场景

- 偏好参数选择
- 日期或分类选择

避免用于：

- 大量多选条件筛选

### 限制与接入建议

- 不能只依靠鼠标滚轮，需验证方向键与触屏；弧形显示不应隐藏当前选中值。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/OptionWheel-JS-CSS.json；资料核对时间：2026-10-25T07:53:02.788Z；SHA256：f875eae265e54a3c33c7e9eabf85395e5b220cd93a3fb20bb7aecd51e6350779；哈希对象：registry-response；文件：OptionWheel.css、OptionWheel.jsx

---

## 弧形输入栏 · Curved Input

案例ID：2b6fe3131110c1f4

来源：https://reactbits.dev/components/curved-input

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

输入框、文字光标与提交按钮沿同一弧线弯曲排列。

触发：输入文字与提交

作用层：content

### 实现方法

SVG弧线路径与真实输入元素配合，将文字光标和视觉按钮映射到同一弧形几何中。

1. 在React客户端引入锁定registry的CurvedInput.css、CurvedInput.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用width、bend和cornerRadius计算弧形边界与textPath，保留真实input处理编辑，再同步显示文字和提交状态。
3. 使用源码已提供的defaultValue、placeholder、buttonText、type、theme、width等属性配置；触发依据：输入文字与提交。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- defaultValue：锁定源码默认：''
- placeholder：锁定源码默认：'Enter your email'
- buttonText：锁定源码默认：'Get Started'
- type：锁定源码默认：'email'
- theme：锁定源码默认：'dark'
- width：锁定源码默认：450
- bend：锁定源码默认：28
- height：锁定源码默认：64
- cornerRadius：锁定源码默认：18
- borderWidth：锁定源码默认：1.5
- fontSize：锁定源码默认：16
- shadowSize：锁定源码默认：'md'
- showButton：锁定源码默认：true
- showIcon：锁定源码默认：true

### 适用场景

- 创意搜索入口
- 活动问答表单

避免用于：

- 长文编辑器

### 限制与接入建议

- 弯曲视觉不等于原生输入能力，中文输入法、选择文本和无障碍需在目标浏览器验证。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/CurvedInput-JS-CSS.json；资料核对时间：2026-10-25T07:53:02.712Z；SHA256：01abe8cbc83e24b4314d828c92f39921fd16004debd7f281a799b02b8ded1516；哈希对象：registry-response；文件：CurvedInput.css、CurvedInput.jsx

---

## 鼠标邻近偏移侧栏 · Line Sidebar

案例ID：df5661b7459c5304

来源：https://reactbits.dev/components/line-sidebar

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

静态侧栏链接在指针接近时偏移并突出附近项目。

触发：鼠标在侧栏移动

作用层：layout、content

### 实现方法

DOM链接列表根据指针纵向距离计算衰减偏移，邻近项目突出并以平滑追随形成波形侧栏。

1. 在React客户端引入锁定registry的LineSidebar.css、LineSidebar.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 缓存每项中心位置，以proximityRadius与falloff计算目标横向位移，再按smoothing逐帧趋近。
3. 使用源码已提供的items、accentColor、textColor、markerColor、showIndex、showMarker等属性配置；触发依据：鼠标在侧栏移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- items：锁定源码默认：DEFAULT_ITEMS
- accentColor：锁定源码默认：'#A855F7'
- textColor：锁定源码默认：'#c4c4c4'
- markerColor：锁定源码默认：'#6c6c6c'
- showIndex：锁定源码默认：true
- showMarker：锁定源码默认：true
- proximityRadius：锁定源码默认：100
- maxShift：锁定源码默认：30
- falloff：锁定源码默认：'smooth'
- markerLength：锁定源码默认：60
- markerGap：锁定源码默认：0
- tickScale：锁定源码默认：0.5
- scaleTick：锁定源码默认：true
- itemGap：锁定源码默认：20
- fontSize：锁定源码默认：1.1
- smoothing：锁定源码默认：100
- defaultActive：锁定源码默认：null

### 适用场景

- 作品集章节导航
- 创意栏目侧栏

避免用于：

- 密集管理后台主导航

### 限制与接入建议

- 主要链接与焦点必须始终可见，不能让平移破坏键盘导航或点击区域。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/LineSidebar-JS-CSS.json；资料核对时间：2026-10-25T07:53:02.746Z；SHA256：9d8877a490ca089b5be70d3a1981d49ab32b7f30a61bedcd0d59e1f867324b1c；哈希对象：registry-response；文件：LineSidebar.css、LineSidebar.jsx

---

## 错峰出现的列表 · Animated List

案例ID：d9540a6c5c9d475f

来源：https://reactbits.dev/components/animated-list

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

列表项目按顺序以时间差进入画面，形成连贯的列表揭示。

触发：列表入场；选择项目

作用层：layout、content

### 实现方法

DOM列表支持按可见状态错峰进入，同时维护活动项、键盘导航、高亮指示器与边缘渐隐。

1. 在React客户端引入锁定registry的AnimatedList.css、AnimatedList.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以items建立稳定键值，按animation与stagger安排入场，更新selected索引后平滑移动高亮并确保活动行可见。
3. 使用源码已提供的items、initialSelectedIndex、selectOnHover、enableArrowNavigation、loop、animation等属性配置；触发依据：列表入场；选择项目。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- items：锁定源码默认：DEFAULT_ITEMS
- initialSelectedIndex：锁定源码默认：-1
- selectOnHover：锁定源码默认：true
- enableArrowNavigation：锁定源码默认：true
- loop：锁定源码默认：false
- animation：锁定源码默认：'pop'
- animateOnce：锁定源码默认：false
- stagger：锁定源码默认：0.05
- showGradients：锁定源码默认：true
- fadeSize：锁定源码默认：56
- displayScrollbar：锁定源码默认：true
- frame：锁定源码默认：true
- theme：锁定源码默认：'dark'
- radius：锁定源码默认：14
- gap：锁定源码默认：8
- width：锁定源码默认：420
- maxHeight：锁定源码默认：440
- itemClassName：锁定源码默认：''

### 适用场景

- 搜索结果选择
- 智能体任务列表

避免用于：

- 无边界的超长日志

### 限制与接入建议

- 选中与悬停状态应分开，列表数据很长时仍需要分页或虚拟化策略。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：检查短屏滚动行程、内部滚动与外部页面的分工，适度减少可见层数，保留全部内容和可直接操作入口。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/AnimatedList-JS-CSS.json；资料核对时间：2026-10-25T07:53:03.087Z；SHA256：88ef0c85d7358823fc435c387aa167a2cee9eb2c2492aa16abbb6bce64d4f298；哈希对象：registry-response；文件：AnimatedList.css、AnimatedList.jsx

---

## 滚动层叠卡片 · Scroll Stack

案例ID：e660f0d8e851f193

来源：https://reactbits.dev/components/scroll-stack

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

卡片随页面滚动逐张重叠到前方，形成有纵深的堆叠。

触发：页面滚动经过卡片区

作用层：layout、content

### 实现方法

DOM卡片随容器或window滚动计算固定堆叠位置，缩放、遮罩与明暗表现层叠，平滑滚动和吸附可配置。

1. 在React客户端引入锁定registry的ScrollStack.css、ScrollStack.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量每卡起点与高度，以stackPosition、itemDistance和itemStackDistance计算停靠点，再按滚动进度写入位移、缩放与dimAmount。
3. 使用源码已提供的itemDistance、itemStackDistance、stackPosition、itemScale、baseScale、dimAmount等属性配置；触发依据：页面滚动经过卡片区。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- itemDistance：锁定源码默认：100
- itemStackDistance：锁定源码默认：24
- stackPosition：锁定源码默认：'15%'
- itemScale：锁定源码默认：0.05
- baseScale：锁定源码默认：0.8
- dimAmount：锁定源码默认：0.2
- blurAmount：锁定源码默认：0
- tiltAmount：锁定源码默认：0
- rotationAmount：锁定源码默认：0
- holdDistance：锁定源码默认：200
- smoothScroll：锁定源码默认：true
- snap：锁定源码默认：false
- useWindowScroll：锁定源码默认：false

### 适用场景

- 分步骤故事展示
- 连续方案介绍

避免用于：

- 要求所有卡同时完整可读的比较表

### 限制与接入建议

- 它由用户滚动驱动，不是自动定时置顶的CardSwap；内部滚动与页面滚动需要正确分工。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：检查短屏滚动行程、内部滚动与外部页面的分工，适度减少可见层数，保留全部内容和可直接操作入口。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ScrollStack-JS-CSS.json；资料核对时间：2026-10-25T07:53:03.192Z；SHA256：b6c6e69f53bd4cc4f7475b9b5ab9f03351df62e2139a61a57b969d04c409da3c；哈希对象：registry-response；文件：ScrollStack.css、ScrollStack.jsx

---

## 气泡展开菜单 · Bubble Menu

案例ID：17ab357eb710296e

来源：https://reactbits.dev/components/bubble-menu

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

圆形浮动菜单展开后，菜单项按顺序出现。

触发：点击菜单按钮展开或收起

作用层：layout、content

### 实现方法

浮动菜单按钮控制覆盖层，GSAP为气泡容器和标签建立错峰弹出及收回时间线。

1. 在React客户端引入锁定registry的BubbleMenu.css、BubbleMenu.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 维护open状态并计算移动端或桌面布局，按animationDuration与staggerDelay依次显示菜单项。
3. 使用源码已提供的menuAriaLabel、menuBg、menuContentColor、useFixedPosition、animationEase、animationDuration等属性配置；触发依据：点击菜单按钮展开或收起。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：gsap@^3.13.0

参数：

- menuAriaLabel：锁定源码默认：'Toggle menu'
- menuBg：锁定源码默认：'#fff'
- menuContentColor：锁定源码默认：'#111'
- useFixedPosition：锁定源码默认：false
- animationEase：锁定源码默认：'back.out(1.5)'
- animationDuration：锁定源码默认：0.5
- staggerDelay：锁定源码默认：0.12

### 适用场景

- 创意站点主菜单
- 活动导航

避免用于：

- 高频多级管理菜单

### 限制与接入建议

- 菜单不是装饰粒子，需保证关闭、Escape、焦点与每项链接可操作。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/BubbleMenu-JS-CSS.json；资料核对时间：2026-10-25T07:53:03.163Z；SHA256：c968d36591b8801b97823d94c02f00fb964cb33f3245498b347b605ec4df4421；哈希对象：registry-response；文件：BubbleMenu.css、BubbleMenu.jsx

---

## 互动便当网格 · Magic Bento

案例ID：3c6dae64620f79ef

来源：https://reactbits.dev/components/magic-bento

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

大小不一的功能卡片组成网格，配合可配置的悬停、粒子与聚光反馈。

触发：展示网格；鼠标悬停与点击

作用层：layout、content

### 实现方法

CSS Grid组织大小不同卡片，指针光斑、边缘发光、倾斜和粒子各自作为独立可配置效果层。

1. 在React客户端引入锁定registry的MagicBento.css、MagicBento.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按columns与rowHeight排版，按enableSpotlight和enableBorderGlow初始化局部反馈，避免粒子Canvas覆盖文字与链接。
3. 使用源码已提供的items、columns、rowHeight、gap、radius、theme等属性配置；触发依据：展示网格；鼠标悬停与点击。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- items：锁定源码默认：DEFAULT_ITEMS
- columns：锁定源码默认：4
- rowHeight：锁定源码默认：200
- gap：锁定源码默认：12
- radius：锁定源码默认：20
- theme：锁定源码默认：'dark'
- textAutoHide：锁定源码默认：true
- enableBorderGlow：锁定源码默认：true
- enableSpotlight：锁定源码默认：true
- spotlightRadius：锁定源码默认：300
- enableStars：锁定源码默认：false
- particleCount：锁定源码默认：24
- enableTilt：锁定源码默认：false
- enableMagnetism：锁定源码默认：false
- clickEffect：锁定源码默认：true
- intro：锁定源码默认：true
- disableAnimations：锁定源码默认：false

### 适用场景

- 智能工具能力总览
- 功能导航首页

避免用于：

- 主视觉必须持续运动的唯一实现

### 限制与接入建议

- 网格构图和可选局部交互不等于持续空间主视觉，不应为了效果开启全部选项。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：检查短屏滚动行程、内部滚动与外部页面的分工，适度减少可见层数，保留全部内容和可直接操作入口。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/MagicBento-JS-CSS.json；资料核对时间：2026-10-25T07:53:03.238Z；SHA256：24c1b2c2f38db957695a4be8b44fcade3ae04da39c79b649157306c54a29079a；哈希对象：registry-response；文件：MagicBento.css、MagicBento.jsx

---

## 弧形循环画廊 · Circular Gallery

案例ID：3ba0dffea03e31a6

来源：https://reactbits.dev/components/circular-gallery

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

图片沿弧形轨道移动，形成可循环浏览的环形画廊。

触发：拖动或滚动画廊

作用层：layout、content

### 实现方法

WebGL图片平面随循环滚动沿弧线弯曲，文字标签单独生成纹理，按位置更新平面姿态和尺寸。

1. 在React客户端引入锁定registry的CircularGallery.css、CircularGallery.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 预加载图片和字体，按bend与gap建立循环轨道，滚轮或拖动改变scroll值并对越界媒体循环定位。
3. 使用源码已提供的bend、textColor、borderRadius、font、scrollSpeed、scrollEase等属性配置；触发依据：拖动或滚动画廊。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- bend：锁定源码默认：3
- textColor：锁定源码默认：'#ffffff'
- borderRadius：锁定源码默认：0.05
- font：锁定源码默认：DEFAULT_FONT
- scrollSpeed：锁定源码默认：2
- scrollEase：锁定源码默认：0.05
- itemSize：锁定源码默认：1
- itemAspect：锁定源码默认：0.78
- gap：锁定源码默认：0.26
- wave：锁定源码默认：1
- fadeEdges：锁定源码默认：0.12
- shadow：锁定源码默认：0.25
- grayscale：锁定源码默认：false
- showTitles：锁定源码默认：true
- snap：锁定源码默认：true
- autoScroll：锁定源码默认：0
- openOnClick：锁定源码默认：true
- intro：锁定源码默认：true

### 适用场景

- 摄影展览浏览
- 创意项目画廊

避免用于：

- 主要文本资料列表

### 限制与接入建议

- 图片标签在GPU中绘制时需额外保留语义说明；跨域图片和字体加载决定最终结果。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/CircularGallery-JS-CSS.json；资料核对时间：2026-10-25T07:53:03.271Z；SHA256：f197114a223bfdf1292e7dbe1120dd3da9b318f0d310cfb662ac2b275d15e706；哈希对象：registry-response；文件：CircularGallery.css、CircularGallery.jsx

---

## 实时倒影卡片 · Reflective Card

案例ID：e943c9b41e404c28

来源：https://reactbits.dev/components/reflective-card

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

卡片以摄像头画面形成动态反射，并随鼠标方向改变眩光。

触发：允许摄像头后反射；鼠标移动改变眩光

作用层：surface

### 实现方法

摄像头或指定反射源经过Canvas/WebGL采样与模糊合成，卡片倾斜和眩光随局部指针变化。

1. 在React客户端引入锁定registry的ReflectiveCard.css、ReflectiveCard.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 配置webcam或替代源后初始化纹理，以卡片比例裁切反射图，再合成玻璃表面、信息层和边缘光。
3. 使用源码已提供的name、role、badge、status、statusColor、idLabel等属性配置；触发依据：允许摄像头后反射；鼠标移动改变眩光。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- name：锁定源码默认：'Alexander Doe'
- role：锁定源码默认：'Senior Developer'
- badge：锁定源码默认：'Verified'
- status：锁定源码默认：'Active'
- statusColor：锁定源码默认：'#22c55e'
- idLabel：锁定源码默认：'ID number'
- idValue：锁定源码默认：'8901 2345 6789'
- theme：锁定源码默认：'dark'
- webcam：锁定源码默认：false
- tint：锁定源码默认：'#ffffff'
- metalness：锁定源码默认：1
- roughness：锁定源码默认：0.3
- blurStrength：锁定源码默认：6
- grayscale：锁定源码默认：1
- warp：锁定源码默认：0.6
- warpScale：锁定源码默认：1
- shine：锁定源码默认：1
- bevel：锁定源码默认：3
- glare：锁定源码默认：0.5
- enableTilt：锁定源码默认：true
- tiltStrength：锁定源码默认：12
- intro：锁定源码默认：true
- width：锁定源码默认：320
- height：锁定源码默认：500
- radius：锁定源码默认：24

### 适用场景

- 可控权限的互动名片
- 展览体验装置

避免用于：

- 默认需要隐私友好的普通资料卡

### 限制与接入建议

- 真实摄像头需单独授权且不可在示例中暗中开启；视频反射并非真实物理镜面。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。
- 真实摄像头或麦克风分支必须单独授权并清理媒体轨道；默认演示不代表已获取用户媒体或已接入识别服务。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ReflectiveCard-JS-CSS.json；资料核对时间：2026-10-25T07:53:03.571Z；SHA256：6a989acfc539343f8ea268e9115e8eea3d4e97d4a518dbbe63c4cbf2dae435bd；哈希对象：registry-response；文件：ReflectiveCard.css、ReflectiveCard.jsx

---

## 卡片式展开导航 · Card Nav

案例ID：7ac3667e90ea8213

来源：https://reactbits.dev/components/card-nav

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

导航栏展开成多个卡片面板，每个面板包含一组相关链接。

触发：点击导航按钮展开或收起

作用层：layout、content

### 实现方法

GSAP在紧凑导航条与多张导航卡之间改变容器高度，并让分组卡片错峰显现。

1. 在React客户端引入锁定registry的CardNav.css、CardNav.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量折叠顶栏与展开内容高度，建立高度和卡片动画时间线，窗口变化时重新计算并保持当前展开状态。
3. 使用源码已提供的logoAlt、ease、baseColor等属性配置；触发依据：点击导航按钮展开或收起。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：gsap@^3.13.0、react-icons@^5.5.0

参数：

- logoAlt：锁定源码默认：'Logo'
- ease：锁定源码默认：'power3.out'
- baseColor：锁定源码默认：'#fff'

### 适用场景

- 产品分类导航
- 创意品牌菜单

避免用于：

- 极深层级的后台导航

### 限制与接入建议

- 导航展开不能只改变视觉而遗漏焦点与可交互状态；移动端需检查内容高度。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/CardNav-JS-CSS.json；资料核对时间：2026-10-25T07:53:03.623Z；SHA256：10ee876f9b5c9bd03699acfbc57c555c667d82a50ef07eb6a0748765cf9a8b37；哈希对象：registry-response；文件：CardNav.css、CardNav.jsx

---

## 可拖拽卡片堆 · Stack

案例ID：4e01d5ff26ed95c8

来源：https://reactbits.dev/components/stack

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

卡片层叠成一堆，可拖、甩或点击切换，移出的卡片收回到堆底。

触发：拖动、甩动或点击

作用层：layout、content

### 实现方法

Motion管理叠放卡片的位置和三维姿态，拖动或甩动达到阈值后将前卡移出并重排到底层。

1. 在React客户端引入锁定registry的Stack.css、Stack.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 维护卡片顺序与可见槽位，按spread、depth和tilt布置；由释放速度和距离决定切换或弹回。
3. 使用源码已提供的layout、visible、spread、depth、radius、frame等属性配置；触发依据：拖动、甩动或点击。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：motion@^12.23.12

参数：

- layout：锁定源码默认：'fan'
- visible：锁定源码默认：4
- spread：锁定源码默认：0.5
- depth：锁定源码默认：0.5
- radius：锁定源码默认：16
- frame：锁定源码默认：0
- frameColor：锁定源码默认：'#ffffff'
- shadow：锁定源码默认：true
- tilt：锁定源码默认：30
- threshold：锁定源码默认：90
- speed：锁定源码默认：1
- sendToBackOnClick：锁定源码默认：false
- autoplay：锁定源码默认：false
- autoplayDelay：锁定源码默认：3000
- pauseOnHover：锁定源码默认：false

### 适用场景

- 精选图片浏览
- 短信息卡片

避免用于：

- 大量资料的唯一目录

### 限制与接入建议

- 手势卡堆不是滚动层叠，也不是自动换位；必须保留点击或按钮替代操作。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的autoplay控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Stack-JS-CSS.json；资料核对时间：2026-10-25T07:53:03.651Z；SHA256：5371e3eac061f4480f372a3939bb1800db365384a5b5134b906f970cf89366ec；哈希对象：registry-response；文件：Stack.css、Stack.jsx

---

## 流体折射玻璃 · Fluid Glass

案例ID：328a512818185592

来源：https://reactbits.dev/components/fluid-glass

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

玻璃容器产生流动扭曲与折射，使后面的内容像通过液态镜片观看。

触发：玻璃持续显示；按配置移动透镜

作用层：surface

### 实现方法

React Three Fiber场景将背后内容渲染到离屏缓冲，再用Drei透射材质的镜片、立方体或玻璃条折射采样。

1. 在React客户端引入锁定registry的FluidGlass/FluidGlass.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 建立离屏场景缓冲与玻璃网格，按modeProps调整透射材质，followPointer决定镜片是否跟随指针。
3. 使用源码已提供的lockToBottom、followPointer、modeProps、backgroundColor等属性配置；触发依据：玻璃持续显示；按配置移动透镜。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：three@^0.180.0、@react-three/fiber@^9.3.0、@react-three/drei@^10.7.4、maath@^0.10.8

参数：

- lockToBottom：锁定源码默认：false
- followPointer：锁定源码默认：true
- modeProps：锁定源码默认：{}
- backgroundColor：锁定源码默认：'#120F17'

### 适用场景

- 产品空间展示
- 艺术作品折射舞台

避免用于：

- 大面积正文与表单背景

### 限制与接入建议

- 这是真实WebGL场景采样，不可用普通backdrop-filter声称完整复刻；需要其Three/R3F/Drei依赖。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：检查短屏滚动行程、内部滚动与外部页面的分工，适度减少可见层数，保留全部内容和可直接操作入口。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/FluidGlass-JS-CSS.json；资料核对时间：2026-10-25T07:53:03.715Z；SHA256：6f3ab260e8d5c8697941b98db70035650b1a456d3211ac85f19e17205b29a661；哈希对象：registry-response；文件：FluidGlass/FluidGlass.jsx

---

## 胶囊导航 · Pill Nav

案例ID：3b7d78827eeda39c

来源：https://reactbits.dev/components/pill-nav

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

导航项置于胶囊形容器，活动高亮在不同项目间平滑滑动。

触发：选择导航项目或悬停

作用层：layout、content

### 实现方法

DOM胶囊导航配合GSAP圆形填充与文字翻动，活动项保持独立高亮，移动端另有展开菜单。

1. 在React客户端引入锁定registry的PillNav.css、PillNav.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量胶囊尺寸计算悬停圆半径，用时间线推动背景和两层标签，路由活动态与悬停态分别维护。
3. 使用源码已提供的logoAlt、ease、baseColor、pillColor、hoveredPillTextColor、initialLoadAnimation等属性配置；触发依据：选择导航项目或悬停。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：react-router-dom@^6.30.1、gsap@^3.13.0

参数：

- logoAlt：锁定源码默认：'Logo'
- ease：锁定源码默认：'power3.easeOut'
- baseColor：锁定源码默认：'#fff'
- pillColor：锁定源码默认：'#120F17'
- hoveredPillTextColor：锁定源码默认：'#120F17'
- initialLoadAnimation：锁定源码默认：true

### 适用场景

- 品牌站主导航
- 轻量产品导航

避免用于：

- 复杂树形管理菜单

### 限制与接入建议

- 需要与实际路由体系匹配，悬停反馈不能代替当前页面标识或键盘焦点。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/PillNav-JS-CSS.json；资料核对时间：2026-10-25T07:53:03.741Z；SHA256：231ada38dcdbb8ee9c0ef3706a4175af51f29806de236587e0808e3800d8404f；哈希对象：registry-response；文件：PillNav.css、PillNav.jsx

---

## 瀑布流图片布局 · Masonry

案例ID：0359369419ce0f38

来源：https://reactbits.dev/components/masonry

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

不同高度的图片以紧密瀑布流排列，窗口变化时动画重排以优化空隙。

触发：页面展示；容器尺寸变化重排

作用层：layout、content

### 实现方法

依据响应式列数把图片分配给当前最短列，得到绝对定位矩形，再由GSAP动画布局重排和入场。

1. 在React客户端引入锁定registry的Masonry.css、Masonry.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 等待图像尺寸和容器宽度，计算每列累计高度，生成各项x、y与高宽并在resize后重新布局。
3. 使用源码已提供的ease、duration、stagger、animateFrom、scaleOnHover、hoverScale等属性配置；触发依据：页面展示；容器尺寸变化重排。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：gsap@^3.13.0

参数：

- ease：锁定源码默认：'power3.out'
- duration：锁定源码默认：0.6
- stagger：锁定源码默认：0.05
- animateFrom：锁定源码默认：'bottom'
- scaleOnHover：锁定源码默认：true
- hoverScale：锁定源码默认：0.95
- blurToFocus：锁定源码默认：true
- colorShiftOnHover：锁定源码默认：false

### 适用场景

- 摄影作品集
- 图片素材浏览

避免用于：

- 按行严格对齐的比较表

### 限制与接入建议

- 图片尺寸未准备好会导致布局跳动；大量图片需要懒加载或分页，不能无限堆DOM。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Masonry-JS-CSS.json；资料核对时间：2026-10-25T07:53:04.035Z；SHA256：4303f0bef7ace732d39840c666cac73c686be770b5f128a801aba0172d8a741b；哈希对象：registry-response；文件：Masonry.css、Masonry.jsx

---

## 三维穹顶图片展厅 · Dome Gallery

案例ID：321f1184c636898d

来源：https://reactbits.dev/components/dome-gallery

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

图片映射到半球表面，拖动视角可以浏览沉浸式穹顶画廊。

触发：拖动视角；选择图片

作用层：layout、content

### 实现方法

DOM图片瓦片按球面角坐标分布到穹顶，拖动更新视角旋转并可选中图片展开查看。

1. 在React客户端引入锁定registry的DomeGallery.css、DomeGallery.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 根据半径和行列坐标构造CSS三维位置，限制纵向旋转范围，拖动惯性更新旋转并区分点击与拖拽。
3. 使用源码已提供的images、fit、fitBasis、minRadius、maxRadius、padFactor等属性配置；触发依据：拖动视角；选择图片。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：@use-gesture/react@^10.2.27

参数：

- images：锁定源码默认：DEFAULT_IMAGES
- fit：锁定源码默认：0.5
- fitBasis：锁定源码默认：'auto'
- minRadius：锁定源码默认：600
- maxRadius：锁定源码默认：Infinity
- padFactor：锁定源码默认：0.25
- overlayBlurColor：锁定源码默认：'#120F17'
- maxVerticalRotationDeg：锁定源码默认：DEFAULTS.maxVerticalRotationDeg
- dragSensitivity：锁定源码默认：DEFAULTS.dragSensitivity
- enlargeTransitionMs：锁定源码默认：DEFAULTS.enlargeTransitionMs
- segments：锁定源码默认：DEFAULTS.segments
- dragDampening：锁定源码默认：2
- openedImageWidth：锁定源码默认：'400px'
- openedImageHeight：锁定源码默认：'400px'
- imageBorderRadius：锁定源码默认：'30px'
- openedImageBorderRadius：锁定源码默认：'30px'
- grayscale：锁定源码默认：true

### 适用场景

- 沉浸式摄影展
- 艺术作品入口

避免用于：

- 高效检索大量课程资料

### 限制与接入建议

- 穹顶是视觉浏览结构，不是自动可搜索的图库；减少动态时需提供平面列表。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/DomeGallery-JS-CSS.json；资料核对时间：2026-10-25T07:53:04.083Z；SHA256：27c4362e7092f208f854c2ee667ee12f11788f345389d9dd893e2c2fc48fe8d6；哈希对象：registry-response；文件：DomeGallery.css、DomeGallery.jsx

---

## 局部显色网格 · Chroma Grid

案例ID：e6149787eb1b8dbf

来源：https://reactbits.dev/components/chroma-grid

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

网格图片先呈灰度，鼠标附近恢复色彩，形成局部彩色窗口。

触发：鼠标在图片网格移动

作用层：content

### 实现方法

CSS网格图片保持灰度，独立径向mask根据指针位置揭示局部原色，并平滑衰减与淡出。

1. 在React客户端引入锁定registry的ChromaGrid.css、ChromaGrid.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量局部坐标，按radius、softness和damping移动显色窗口，在原图上方叠加灰度遮罩而非修改原图。
3. 使用源码已提供的columns、minCardWidth、gap、radius、softness、damping等属性配置；触发依据：鼠标在图片网格移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- columns：锁定源码默认：3
- minCardWidth：锁定源码默认：180
- gap：锁定源码默认：12
- radius：锁定源码默认：260
- softness：锁定源码默认：0.6
- damping：锁定源码默认：0.45
- fadeOut：锁定源码默认：0.6
- grayscale：锁定源码默认：1
- dim：锁定源码默认：0.12
- glow：锁定源码默认：0.5
- borderGlow：锁定源码默认：1
- reveal：锁定源码默认：'spotlight'
- aspectRatio：锁定源码默认：'3 / 2'
- cardRadius：锁定源码默认：22
- showInfo：锁定源码默认：true
- frame：锁定源码默认：false
- theme：锁定源码默认：'dark'

### 适用场景

- 作品封面网格
- 摄影或团队介绍

避免用于：

- 按颜色编码的重要状态表

### 限制与接入建议

- 色彩不能作为唯一信息区分；触屏不能依赖悬停来识别内容。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ChromaGrid-JS-CSS.json；资料核对时间：2026-10-25T07:53:04.120Z；SHA256：02b46874ebe33f95908f9b0cc17fb23445f01fa335f52035a3a0738d17bbd80c；哈希对象：registry-response；文件：ChromaGrid.css、ChromaGrid.jsx

---

## 展开文件夹卡片 · Folder

案例ID：7e31e4db25559d5b

来源：https://reactbits.dev/components/folder

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

文件夹悬停或交互时打开，内部内容以平滑运动显露出来。

触发：鼠标悬停或操作文件夹

作用层：layout、content

### 实现方法

CSS三维层与可选材质Canvas表现文件夹盖板、纸张和书页，不同mode/variant决定展开、散列或取出行为。

1. 在React客户端引入锁定registry的Folder.css、Folder.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按items生成内部纸张和盖板层，依据openOn或受控状态改变折叠角度、纸张位移及阴影，点击项另行接业务。
3. 使用源码已提供的mode、variant、color、paperColor、tabPosition、layout等属性配置；触发依据：鼠标悬停或操作文件夹。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- mode：锁定源码默认：'flap'
- variant：锁定源码默认：'solid'
- color：锁定源码默认：'#3d8bff'
- paperColor：锁定源码默认：'#ffffff'
- tabPosition：锁定源码默认：'right'
- layout：锁定源码默认：'spread'
- size：锁定源码默认：1
- openOn：锁定源码默认：'click'
- defaultOpen：锁定源码默认：false
- draggable：锁定源码默认：true
- zoomOnClick：锁定源码默认：true
- peek：锁定源码默认：true
- intro：锁定源码默认：true
- tilt：锁定源码默认：0.5
- bounce：锁定源码默认：0.4
- speed：锁定源码默认：1
- frost：锁定源码默认：0.25
- closeOnOutsideClick：锁定源码默认：true
- theme：锁定源码默认：'dark'

### 适用场景

- 资料分类入口
- 创意项目卡

避免用于：

- 声称已连接本机文件系统

### 限制与接入建议

- 视觉文件夹并非真实文件系统，不自动提供上传、权限或文件读写。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Folder-JS-CSS.json；资料核对时间：2026-10-25T07:53:04.304Z；SHA256：b3491ddcd1aaeb754b3b0a282cb4fec708d556c0b78b19e90a55f08f99a958b9；哈希对象：registry-response；文件：Folder.css、Folder.jsx

---

## 错峰滑入大菜单 · Staggered Menu

案例ID：4f7dfed7b95c6a92

来源：https://reactbits.dev/components/staggered-menu

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

菜单展开和关闭时，背景面板与菜单文字分批错峰运动。

触发：点击菜单开关

作用层：layout、content

### 实现方法

GSAP依次滑入多层背景面板与菜单文字，开关图标、标签和颜色共享展开时间线。

1. 在React客户端引入锁定registry的StaggeredMenu.css、StaggeredMenu.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用position确定面板方向，打开时先移动背景再错峰显现项目，关闭时回收并禁用不可见项命中。
3. 使用源码已提供的position、colors、items、socialItems、displaySocials、displayItemNumbering等属性配置；触发依据：点击菜单开关。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：gsap@^3.13.0

参数：

- position：锁定源码默认：'right'
- colors：锁定源码默认：['#B497CF', '#5227FF']
- items：锁定源码默认：[]
- socialItems：锁定源码默认：[]
- displaySocials：锁定源码默认：true
- displayItemNumbering：锁定源码默认：true
- logoUrl：锁定源码默认：'/src/assets/logos/reactbits-gh-white.svg'
- menuButtonColor：锁定源码默认：'#fff'
- openMenuButtonColor：锁定源码默认：'#fff'
- accentColor：锁定源码默认：'#5227FF'
- changeMenuColorOnOpen：锁定源码默认：true
- isFixed：锁定源码默认：false
- closeOnClickAway：锁定源码默认：true

### 适用场景

- 创意全屏导航
- 品牌站菜单

避免用于：

- 需保持大量工具始终可见的界面

### 限制与接入建议

- 覆盖式菜单需处理焦点返回和滚动锁定；不能让关闭后的链接仍可聚焦。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/StaggeredMenu-JS-CSS.json；资料核对时间：2026-10-25T07:53:04.211Z；SHA256：ae759a6eef80f7059194bd226cbc86549832990f355e1f1f107930be847c3540；哈希对象：registry-response；文件：StaggeredMenu.css、StaggeredMenu.jsx

---

## 可旋转三维模型 · Model Viewer

案例ID：d6e751bd72c36181

来源：https://reactbits.dev/components/model-viewer

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

展示三维模型，提供环绕查看与可调灯光预设。

触发：拖动旋转、缩放；切换灯光

作用层：content

### 实现方法

React Three Fiber按模型扩展名选择GLTF、FBX或OBJ加载器，居中归一化模型并配置环境、曝光与环绕控制。

1. 在React客户端引入锁定registry的ModelViewer/ModelViewer.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 加载实际模型资源并计算包围盒，按尺寸缩放到可见范围，使用environment和exposure照明，拖动改变查看角度。
3. 使用源码已提供的width、height、environment、environmentIntensity、exposure、autoRotate等属性配置；触发依据：拖动旋转、缩放；切换灯光。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：@react-three/fiber@^9.3.0、@react-three/drei@^10.7.4、three@^0.180.0

参数：

- width：锁定源码默认：400
- height：锁定源码默认：400
- environment：锁定源码默认：'studio'
- environmentIntensity：锁定源码默认：1
- exposure：锁定源码默认：1
- autoRotate：锁定源码默认：true
- autoRotateSpeed：锁定源码默认：0.4
- autoRotateDelay：锁定源码默认：2
- dragRotate：锁定源码默认：true
- turntable：锁定源码默认：false
- zoom：锁定源码默认：true
- minZoom：锁定源码默认：0.7
- maxZoom：锁定源码默认：2
- hoverTilt：锁定源码默认：0.15
- float：锁定源码默认：0.3
- shadow：锁定源码默认：true
- shadowOpacity：锁定源码默认：0.45
- intro：锁定源码默认：'rise'
- startAngle：锁定源码默认：-30
- tilt：锁定源码默认：10
- offsetX：锁定源码默认：0
- offsetY：锁定源码默认：0
- fit：锁定源码默认：0.8
- resetOnDoubleClick：锁定源码默认：true

### 适用场景

- 产品模型展示
- 可交互教学模型

避免用于：

- 没有真实模型的准确科学结构展示

### 限制与接入建议

- 示例模型不等于用户业务资产；模型文件、纹理、授权与跨域路径需由接入方提供。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ModelViewer-JS-CSS.json；资料核对时间：2026-10-25T07:53:04.576Z；SHA256：45905846fe71e6193f445c8982e9bf8509790b7d623b0e0df518e41ac0878681；哈希对象：registry-response；文件：ModelViewer/ModelViewer.jsx

---

## 可拉扯三维吊牌 · Lanyard

案例ID：84d36ac034de5589

来源：https://reactbits.dev/components/lanyard

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

三维吊牌挂在弹性织带上，可拖拽、拉伸、甩动或点击翻面。

触发：拖动、拉伸、松开或点击翻面

作用层：content

### 实现方法

Three.js自建吊带节点约束和卡牌几何，拖拽向节点施力，迭代约束后以带状网格和卡面材质绘制。

1. 在React客户端引入锁定registry的Lanyard.css、Lanyard.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 建立吊带节点与长度约束，按anchor、strapLength和节点迭代计算摆动；拖拽卡体并更新材质、光照和朝向。
3. 使用源码已提供的imageFit、cardColor、orientation、finish、cornerRadius、size等属性配置；触发依据：拖动、拉伸、松开或点击翻面。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：three@^0.180.0

参数：

- imageFit：锁定源码默认：'cover'
- cardColor：锁定源码默认：'#ffffff'
- orientation：锁定源码默认：'portrait'
- finish：锁定源码默认：'glossy'
- cornerRadius：锁定源码默认：0.3
- size：锁定源码默认：0.6
- anchor：锁定源码默认：'center'
- strapLength：锁定源码默认：0.5
- strapColor：锁定源码默认：'#111111'
- strapWidth：锁定源码默认：0.65
- metal：锁定源码默认：'silver'
- gravity：锁定源码默认：1
- damping：锁定源码默认：0.5
- elasticity：锁定源码默认：0.5
- breeze：锁定源码默认：0.5
- interactive：锁定源码默认：true
- intro：锁定源码默认：true

### 适用场景

- 个人数字名牌
- 活动品牌吊牌

避免用于：

- 真实证件核验功能

### 限制与接入建议

- 该锁定版使用Three.js自有约束模拟，不能凭旧教程宣称依赖Rapier；不提供真实身份认证。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Lanyard-JS-CSS.json；资料核对时间：2026-10-25T07:53:04.665Z；SHA256：be3a04d16f87ddfc7a500ebf257bbedec9e963f64d8073de6eb47b5d2f77b278；哈希对象：registry-response；文件：Lanyard.css、Lanyard.jsx

---

## 立体高光个人卡 · Profile Card

案例ID：356c34ccaf53edf1

来源：https://reactbits.dev/components/profile-card

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

个人资料卡随鼠标三维倾斜，表面眩光和色彩响应角度变化。

触发：鼠标悬停与移动

作用层：surface

### 实现方法

DOM卡片与独立箔纹、高光层通过局部指针坐标驱动三维倾斜，文字和联系按钮在稳定内容层。

1. 在React客户端引入锁定registry的ProfileCard.css、ProfileCard.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按头像和用户信息建立卡片，把指针归一化后更新tilt和光照CSS变量，离开后平滑回正。
3. 使用源码已提供的avatarUrl、name、title、handle、status、statusColor等属性配置；触发依据：鼠标悬停与移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- avatarUrl：锁定源码默认：''
- name：锁定源码默认：'Javi A. Torres'
- title：锁定源码默认：'Software Engineer'
- handle：锁定源码默认：'javicodes'
- status：锁定源码默认：'Online'
- statusColor：锁定源码默认：'#22c55e'
- contactText：锁定源码默认：'Contact'
- showUserInfo：锁定源码默认：true
- theme：锁定源码默认：'dark'
- radius：锁定源码默认：16
- holo：锁定源码默认：0.8
- glare：锁定源码默认：0.5
- enableTilt：锁定源码默认：true
- tiltStrength：锁定源码默认：12
- parallax：锁定源码默认：8
- enableMobileTilt：锁定源码默认：false
- mobileTiltSensitivity：锁定源码默认：5
- intro：锁定源码默认：true

### 适用场景

- 个人介绍
- 团队成员展示

避免用于：

- 长篇个人档案正文

### 限制与接入建议

- 个人信息是展示数据，联系按钮需真实业务链接；卡片高光不等于用户认证。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ProfileCard-JS-CSS.json；资料核对时间：2026-10-25T07:53:04.592Z；SHA256：a2cd4728e455f68a6a19fe337684999c614f0a93ffcfa8be356104a583d35273；哈希对象：registry-response；文件：ProfileCard.css、ProfileCard.jsx

---

## 放大式底部图标栏 · Dock

案例ID：b556d3ba6d6e38fd

来源：https://reactbits.dev/components/dock

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

一排应用图标像桌面 Dock 一样在鼠标靠近时放大，可带启动弹跳和角标。

触发：鼠标悬停与点击；按配置弹出菜单

作用层：layout、content

### 实现方法

DOM图标栏按鼠标距离计算每项放大曲线，保留布局插槽并支持启动弹跳、角标及可选菜单。

1. 在React客户端引入锁定registry的Dock.css、Dock.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 缓存各图标中心，以distance与magnification计算缩放和占位，指针离开后恢复，触发onClick另行接业务。
3. 使用源码已提供的items、position、theme、baseItemSize、magnification、distance等属性配置；触发依据：鼠标悬停与点击；按配置弹出菜单。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：react-dom@^19.0.0

参数：

- items：锁定源码默认：[]
- position：锁定源码默认：'bottom'
- theme：锁定源码默认：'dark'
- baseItemSize：锁定源码默认：50
- magnification：锁定源码默认：70
- distance：锁定源码默认：200
- panelHeight：锁定源码默认：68
- gap：锁定源码默认：10
- roundness：锁定源码默认：0.5
- spring：锁定源码默认：{ mass: 0.1, stiffness: 150, damping: 12 }
- bounce：锁定源码默认：true
- autoHide：锁定源码默认：false
- tiles：锁定源码默认：true
- showLabels：锁定源码默认：true
- showIndicators：锁定源码默认：true
- showBadges：锁定源码默认：true
- badgeColor：锁定源码默认：'#ff453a'
- accentColor：锁定源码默认：'#0a84ff'

### 适用场景

- 轻量应用启动栏
- 作品集底部导航

避免用于：

- 数十项以上的复杂主导航

### 限制与接入建议

- 放大图标不能遮挡相邻命中区；触屏和键盘应能稳定访问每个项目。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：检查短屏滚动行程、内部滚动与外部页面的分工，适度减少可见层数，保留全部内容和可直接操作入口。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Dock-JS-CSS.json；资料核对时间：2026-10-25T07:53:04.782Z；SHA256：3898bdc1e453f22f57939853cb299a9970af5aa1f3468ec622f15ce20677fdcc；哈希对象：registry-response；文件：Dock.css、Dock.jsx

---

## 粘液高亮导航 · Gooey Nav

案例ID：2d55f4b3aa59ef07

来源：https://reactbits.dev/components/gooey-nav

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

活动导航指示器以融化、拉伸的液态形变在项目之间移动。

触发：点击导航项目

作用层：layout、content

### 实现方法

真实导航按钮上叠加WebGL液态高亮场，活动项变化时圆角指示体拉伸、融合并生成小液滴。

1. 在React客户端引入锁定registry的GooeyNav.css、GooeyNav.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量旧新按钮矩形，按animationTime插值位置与形状，把particleCount等参数写入独立高亮渲染层。
3. 使用源码已提供的items、initialActiveIndex、theme、colors、size、frame等属性配置；触发依据：点击导航项目。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- items：锁定源码默认：DEFAULT_ITEMS
- initialActiveIndex：锁定源码默认：0
- theme：锁定源码默认：'dark'
- colors：锁定源码默认：[]
- size：锁定源码默认：'md'
- frame：锁定源码默认：true
- animationTime：锁定源码默认：600
- particleCount：锁定源码默认：15
- timeVariance：锁定源码默认：300
- spread：锁定源码默认：56
- gooeyness：锁定源码默认：0.5
- wobble：锁定源码默认：0.5
- hoverEffect：锁定源码默认：true

### 适用场景

- 品牌页栏目切换
- 轻量标签导航

避免用于：

- 高密度数据表导航

### 限制与接入建议

- 液态效果只承担活动指示，真实链接和键盘状态仍由DOM按钮负责。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低particleCount并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及particleCount，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/GooeyNav-JS-CSS.json；资料核对时间：2026-10-25T07:53:04.770Z；SHA256：29559c6f4a822c24e453264e27a79dc6604af58d3978a4ab110f6a9515e16b16；哈希对象：registry-response；文件：GooeyNav.css、GooeyNav.jsx

---

## 像素展开卡片 · Pixel Card

案例ID：612ce5b16d2f0edf

来源：https://reactbits.dev/components/pixel-card

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

悬停卡片时像素块扩散和变化，突出内容与边缘。

触发：鼠标悬停或聚焦

作用层：surface

### 实现方法

Canvas在卡片内部按网格生成像素单元，悬停、焦点或配置触发改变像素的显现、颜色与退场。

1. 在React客户端引入锁定registry的PixelCard.css、PixelCard.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 依据pixelSize与shape建立像素场，按origin和revealDuration安排扩散顺序，把spotlight和glow作为局部可选层。
3. 使用源码已提供的variant、pixelSize、shape、origin、revealDuration、spotlight等属性配置；触发依据：鼠标悬停或聚焦。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- variant：锁定源码默认：'default'
- pixelSize：锁定源码默认：2
- shape：锁定源码默认：'square'
- origin：锁定源码默认：'center'
- revealDuration：锁定源码默认：600
- spotlight：锁定源码默认：0.5
- glow：锁定源码默认：0.5
- opacity：锁定源码默认：1
- fade：锁定源码默认：0
- trigger：锁定源码默认：'hover'
- clickPulse：锁定源码默认：true
- intro：锁定源码默认：true
- introDelay：锁定源码默认：0
- theme：锁定源码默认：'dark'
- radius：锁定源码默认：24

### 适用场景

- 复古项目封面
- 创意功能卡

避免用于：

- 长时间阅读区域

### 限制与接入建议

- 像素应在内容下方，不可用细小闪变覆盖正文；不能自动提供卡片业务点击。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/PixelCard-JS-CSS.json；资料核对时间：2026-10-25T07:53:05.081Z；SHA256：fa027f6e46d95160ac27c078f530c53d2c40c2e1b6cabd93f323a5422cdc428a；哈希对象：registry-response；文件：PixelCard.css、PixelCard.jsx

---

## 可滑动功能轮播 · Carousel

案例ID：44d21281ba24b77f

来源：https://reactbits.dev/components/carousel

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

卡片可滑动浏览，可选多种过渡与自动播放计时。

触发：拖动、切换按钮或自动播放

作用层：layout、content

### 实现方法

DOM轨道用弹簧位置管理当前卡片，按effect计算相邻卡的位移、缩放或旋转，并维护指示器和可选自动播放。

1. 在React客户端引入锁定registry的Carousel.css、Carousel.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 依据baseWidth、gap和peek建立槽位，手势或前后按钮更新目标索引，自动播放需在交互时暂停。
3. 使用源码已提供的items、baseWidth、aspectRatio、peek、gap、radius等属性配置；触发依据：拖动、切换按钮或自动播放。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- items：锁定源码默认：DEFAULT_ITEMS
- baseWidth：锁定源码默认：300
- aspectRatio：锁定源码默认：1.25
- peek：锁定源码默认：0
- gap：锁定源码默认：16
- radius：锁定源码默认：12
- frame：锁定源码默认：true
- effect：锁定源码默认：'tilt'
- indicator：锁定源码默认：'dots'
- arrows：锁定源码默认：false
- autoplay：锁定源码默认：false
- autoplayDelay：锁定源码默认：3000
- pauseOnHover：锁定源码默认：false
- loop：锁定源码默认：false
- draggable：锁定源码默认：true
- round：锁定源码默认：false
- initialIndex：锁定源码默认：0
- theme：锁定源码默认：'dark'

### 适用场景

- 产品功能精选
- 短内容卡片展示

避免用于：

- 必须同时比较的关键选项

### 限制与接入建议

- 不是所有过渡都适合正文卡；核心功能不可只存在自动滚过的隐藏项。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的autoplay控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Carousel-JS-CSS.json；资料核对时间：2026-10-25T07:53:05.055Z；SHA256：27c19102898d45a51d1b023d486b61e68a742be90b2cc15e7f76d3042c62062b；哈希对象：registry-response；文件：Carousel.css、Carousel.jsx

---

## 沿方向显现的边缘光 · Border Glow

案例ID：cc2d5e3bcfe1faf6

来源：https://reactbits.dev/components/border-glow

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

网格渐变光沿边框随指针方向移动，在接近边缘时更亮。

触发：鼠标在卡片附近移动

作用层：border、outer-glow

### 实现方法

边缘距离和指针方向驱动CSS渐变描边及外侧光晕，背景和内容作为独立层保留。

1. 在React客户端引入锁定registry的BorderGlow.css、BorderGlow.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用edgeSensitivity测量接近程度，将方向映射到渐变位置，以glowRadius与glowIntensity调节边缘光。
3. 使用源码已提供的edgeSensitivity、glowColor、backgroundColor、borderRadius、glowRadius、glowIntensity等属性配置；触发依据：鼠标在卡片附近移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在border、outer-glow层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- edgeSensitivity：锁定源码默认：30
- glowColor：锁定源码默认：'40 80 80'
- backgroundColor：锁定源码默认：'#120F17'
- borderRadius：锁定源码默认：28
- glowRadius：锁定源码默认：40
- glowIntensity：锁定源码默认：1.0
- coneSpread：锁定源码默认：25
- animated：锁定源码默认：false
- colors：锁定源码默认：['#c084fc', '#f472b6', '#38bdf8']
- fillOpacity：锁定源码默认：0.5

### 适用场景

- 重点信息卡边缘
- 商品展示容器

避免用于：

- 替换玻璃卡内部材质

### 限制与接入建议

- 边缘追光不等于整面渐变，也不是自动沿路径旋转的BorderBeam；静态或自动模式须按实际参数说明。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/BorderGlow-JS-CSS.json；资料核对时间：2026-10-25T07:53:05.118Z；SHA256：db1cc35798973fe1f0cddafa117ddb3c0a17a7f658bc3b61c426eb10fdefb576；哈希对象：registry-response；文件：BorderGlow.css、BorderGlow.jsx

---

## 滚动飞行海报 · Flying Posters

案例ID：214963649be25b25

来源：https://reactbits.dev/components/flying-posters

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

海报在无限纵向画廊中随滚动或拖动产生三维扭转与翻转。

触发：滚动或拖动画廊

作用层：content

### 实现方法

WebGL将海报铺成可循环纵向平面，滚动速度影响网格顶点扭曲与翻转，摄像机投影提供纵深。

1. 在React客户端引入锁定registry的FlyingPosters.css、FlyingPosters.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 依据planeWidth、planeHeight和columns生成海报几何，维护连续滚动与scrollEase，distortion驱动顶点位移。
3. 使用源码已提供的items、planeWidth、planeHeight、distortion、scrollEase、cameraFov等属性配置；触发依据：滚动或拖动画廊。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- items：锁定源码默认：[]
- planeWidth：锁定源码默认：320
- planeHeight：锁定源码默认：320
- distortion：锁定源码默认：3
- scrollEase：锁定源码默认：0.01
- cameraFov：锁定源码默认：45
- cameraZ：锁定源码默认：20
- columns：锁定源码默认：1
- columnGap：锁定源码默认：40
- alternate：锁定源码默认：true
- radius：锁定源码默认：0
- rotation：锁定源码默认：180
- axis：锁定源码默认：'vertical'
- speed：锁定源码默认：0
- lean：锁定源码默认：0
- fade：锁定源码默认：0
- shading：锁定源码默认：0
- wheel：锁定源码默认：true
- drag：锁定源码默认：true
- pageScroll：锁定源码默认：0

### 适用场景

- 艺术海报展
- 电影作品展示

避免用于：

- 密集资料检索正文

### 限制与接入建议

- 需要图像纹理和WebGL，海报文字在扭曲时不可作为唯一阅读版本。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/FlyingPosters-JS-CSS.json；资料核对时间：2026-10-25T07:53:05.308Z；SHA256：51828f56ca9922c42bc6bebe30653b910d6f3a32ad8c394df241b5264a19df96；哈希对象：registry-response；文件：FlyingPosters.css、FlyingPosters.jsx

---

## 轮流换位的卡片 · Card Swap

案例ID：e5e7c867913b19cb

来源：https://reactbits.dev/components/card-swap

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

一叠卡片通过平滑的位移和层级切换交换前后位置。

触发：自动按间隔换位

作用层：layout、content

### 实现方法

DOM卡片按槽位保持三维倾斜与层级，通过有阶段的位移轨迹将前卡送到底部并提升后卡。

1. 在React客户端引入锁定registry的CardSwap.css、CardSwap.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 由cardDistance、verticalDistance和depth计算堆叠，autoplay与delay决定换位时机，悬停或手动操作可中断。
3. 使用源码已提供的width、height、cardDistance、verticalDistance、depth、skewAmount等属性配置；触发依据：自动按间隔换位。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- width：锁定源码默认：460
- height：锁定源码默认：340
- cardDistance：锁定源码默认：60
- verticalDistance：锁定源码默认：70
- depth：锁定源码默认：90
- skewAmount：锁定源码默认：6
- visibleCards：锁定源码默认：4
- delay：锁定源码默认：4000
- autoplay：锁定源码默认：true
- pauseOnHover：锁定源码默认：true
- draggable：锁定源码默认：true
- speed：锁定源码默认：1
- bounce：锁定源码默认：0.35
- parallax：锁定源码默认：0.5
- hoverSpread：锁定源码默认：0.12
- dim：锁定源码默认：0.5
- cardRadius：锁定源码默认：18
- intro：锁定源码默认：true
- theme：锁定源码默认：'dark'

### 适用场景

- 精选案例轮播
- 短产品介绍

避免用于：

- 需要稳定阅读的长卡片

### 限制与接入建议

- 这是自动或手动的卡片换位，不是ScrollStack的滚动停靠；主要按钮不要放在持续移动的槽位。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的autoplay控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/CardSwap-JS-CSS.json；资料核对时间：2026-10-25T07:53:05.262Z；SHA256：4a4ecdff39ca09aecddbc40d063ef6c35a5128e206648ac9818cdf53815d3ce6；哈希对象：registry-response；文件：CardSwap.css、CardSwap.jsx

---

## 折射玻璃图标 · Glass Icons

案例ID：c9a0ad8ca60e062f

来源：https://reactbits.dev/components/glass-icons

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

图标呈液态玻璃质感，折射背后的颜色与光线。

触发：持续显示；鼠标悬停反馈

作用层：surface

### 实现方法

DOM图标外观以玻璃板、SVG轮廓和WebGL折射合成，指针倾斜改变高光、色散与边缘明暗。

1. 在React客户端引入锁定registry的GlassIcons.css、GlassIcons.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 为每个图标建立独立圆角板或轮廓材质，按refraction、bevel与dispersion配置折射，再叠加稳定图标语义。
3. 使用源码已提供的items、size、gap、columns、roundness、refraction等属性配置；触发依据：持续显示；鼠标悬停反馈。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- items：锁定源码默认：[]
- size：锁定源码默认：82
- gap：锁定源码默认：66
- columns：锁定源码默认：3
- roundness：锁定源码默认：0.6
- refraction：锁定源码默认：0.8
- bevel：锁定源码默认：0.6
- dispersion：锁定源码默认：0
- frost：锁定源码默认：0.2
- shine：锁定源码默认：0.85
- tint：锁定源码默认：'#dfdfdf'
- tintOpacity：锁定源码默认：0.2
- plate：锁定源码默认：'tilt'
- tilt：锁定源码默认：30
- spread：锁定源码默认：0.5
- hover：锁定源码默认：'press'
- parallax：锁定源码默认：1
- labels：锁定源码默认：'hover'
- intro：锁定源码默认：true
- theme：锁定源码默认：'dark'

### 适用场景

- 精致分类入口
- 品牌能力图标

避免用于：

- 无文字说明的关键操作

### 限制与接入建议

- 图标材质不是功能本身；小尺寸和强折射可能使图形难以识别。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/GlassIcons-JS-CSS.json；资料核对时间：2026-10-25T07:53:05.525Z；SHA256：545fd02e41fdcaedb142fa57348ada25261a07229dd177a09fa9ad469de42a7a；哈希对象：registry-response；文件：GlassIcons.css、GlassIcons.jsx

---

## 鼠标撕裂融化图片 · Decay Card

案例ID：716b762175b12712

来源：https://reactbits.dev/components/decay-card

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

图片卡片随指针运动出现撕扯、融化和位移，随后恢复完整。

触发：鼠标在图片上移动

作用层：surface

### 实现方法

WebGL将图像纹理坐标按指针速度与局部噪声位移，形成撕扯和融化，再以恢复系数回到原位。

1. 在React客户端引入锁定registry的DecayCard.css、DecayCard.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 读取image并建立材质，记录指针位置差，依据intensity、sensitivity和hoverDecay写入扭曲场，离开时衰减。
3. 使用源码已提供的image、width、height、intensity、sensitivity、hoverDecay等属性配置；触发依据：鼠标在图片上移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在surface层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- image：锁定源码默认：'https://images.unsplash.com/photo-1762846818262-33c197852fa8?w=900&q=80&auto=format&fit=crop'
- width：锁定源码默认：300
- height：锁定源码默认：400
- intensity：锁定源码默认：0.5
- sensitivity：锁定源码默认：0.5
- hoverDecay：锁定源码默认：0.05
- recovery：锁定源码默认：0.6
- grain：锁定源码默认：0.25
- detail：锁定源码默认：5
- pattern：锁定源码默认：4
- idle：锁定源码默认：0.35
- flow：锁定源码默认：0
- chroma：锁定源码默认：0
- travel：锁定源码默认：50
- tilt：锁定源码默认：10
- radius：锁定源码默认：0
- grayscale：锁定源码默认：false

### 适用场景

- 创意摄影封面
- 艺术品牌卡

避免用于：

- 文档截图或证件展示

### 限制与接入建议

- 仅扭曲展示图，不真实修改图片文件；文字覆盖层应保持稳定。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/DecayCard-JS-CSS.json；资料核对时间：2026-10-25T07:53:05.552Z；SHA256：f591f1cef88d22fe2bc4a5aa44079af189bba6229f962c11b535cbf098996d53；哈希对象：registry-response；文件：DecayCard.css、DecayCard.jsx

---

## 流动预览菜单 · Flowing Menu

案例ID：936788dc9b93b361

来源：https://reactbits.dev/components/flowing-menu

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

悬停菜单项时出现横向流动的文字与图片带，形成动态预览。

触发：鼠标进入与离开菜单项

作用层：layout、content

### 实现方法

菜单行悬停时按最近的上/下边缘滑入图片文字marquee，GSAP让重复内容水平循环，移出时收回。

1. 在React客户端引入锁定registry的FlowingMenu.css、FlowingMenu.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 计算指针进入边缘并重建足够的marquee副本，先揭示整条预览带，再线性移动内部轨道。
3. 以源码实际接口和受控状态配置；触发依据：鼠标进入与离开菜单项。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：gsap@^3.13.0

参数：

未提取原始默认值，不自行补造。

### 适用场景

- 作品集项目目录
- 视觉品牌菜单

避免用于：

- 依靠悬停才暴露的核心导航

### 限制与接入建议

- 这是悬停图文预览，不是活动菜单指示器；触屏必须保留可点击链接和静态摘要。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/FlowingMenu-JS-CSS.json；资料核对时间：2026-10-25T07:53:05.577Z；SHA256：173bc6387062ed31fde5c4aece8630ddb9fef3efc29fb4e6c3954a6e1eafe74c；哈希对象：registry-response；文件：FlowingMenu.css、FlowingMenu.jsx

---

## 弹性滑动条 · Elastic Slider

案例ID：22a88f7578020307

来源：https://reactbits.dev/components/elastic-slider

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

拖动滑块时把手与轨道产生弹性拉伸，松开后以弹簧运动回位。

触发：拖动滑块与松开

作用层：content

### 实现方法

真实滑动条值由指针位置计算，Motion对超出轨道的位移做非线性衰减，松手后弹回有效范围。

1. 在React客户端引入锁定registry的ElasticSlider.css、ElasticSlider.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 将clientX映射到startingValue与maxValue，按isStepped和stepSize吸附数值，overflow只用于弹性外观。
3. 使用源码已提供的defaultValue、startingValue、maxValue、isStepped、stepSize、leftIcon等属性配置；触发依据：拖动滑块与松开。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12、@chakra-ui/react@^3.20.0、react-icons@^5.5.0

参数：

- defaultValue：锁定源码默认：50
- startingValue：锁定源码默认：0
- maxValue：锁定源码默认：100
- isStepped：锁定源码默认：false
- stepSize：锁定源码默认：1
- leftIcon：锁定源码默认：<Icon as={RiVolumeDownFill} />
- rightIcon：锁定源码默认：<Icon as={RiVolumeUpFill} />

### 适用场景

- 音量或偏好参数
- 创意属性面板

避免用于：

- 要求极高精度的数值编辑

### 限制与接入建议

- 显示值与装饰溢出要分开，不能让超界视觉变成非法业务数值。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ElasticSlider-JS-CSS.json；资料核对时间：2026-10-25T07:53:05.804Z；SHA256：57fa19a202a6bf3e61ca7f7f3ebbfbefe720a9d568053d4c7315bc396cf244f9；哈希对象：registry-response；文件：ElasticSlider.css、ElasticSlider.jsx

---

## 滚动数字计数器 · Counter

案例ID：e4cd0e1fd6fdccc1

来源：https://reactbits.dev/components/counter

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

数字变化时，各数位分别滚动切换到新值，形成机械计数器感觉。

触发：数值更新

作用层：content

### 实现方法

每个数位用Motion spring驱动纵向数字卷轴，根据位权和新旧值选择最近滚动方向并显示格式符。

1. 在React客户端引入锁定registry的Counter.css、Counter.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按places或数值位权拆解数字，分别计算各位轮转，保留小数点和分隔符，数值来源由业务传入。
3. 使用源码已提供的fontSize、padding、gap、borderRadius、horizontalPadding、textColor等属性配置；触发依据：数值更新。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12

参数：

- fontSize：锁定源码默认：100
- padding：锁定源码默认：0
- gap：锁定源码默认：8
- borderRadius：锁定源码默认：4
- horizontalPadding：锁定源码默认：8
- textColor：锁定源码默认：'inherit'
- fontWeight：锁定源码默认：'inherit'
- gradientHeight：锁定源码默认：16
- gradientFrom：锁定源码默认：'black'
- gradientTo：锁定源码默认：'transparent'

### 适用场景

- 价格或积分变化
- 统计卡片

避免用于：

- 高频实时告警读数

### 限制与接入建议

- 滚动数字是显示过渡，不产生真实统计；快速频繁更新会影响辨读。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Counter-JS-CSS.json；资料核对时间：2026-10-25T07:53:05.782Z；SHA256：3a5bc8632911d43f005d8386fec4ec14bf6f0772833d816e71c14b7b027b8f17；哈希对象：registry-response；文件：Counter.css、Counter.jsx

---

## 球面无限图片菜单 · Infinite Menu

案例ID：eb7ca3f10e1f1e40

来源：https://reactbits.dev/components/infinite-menu

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

图片块覆盖可拖动球体，最近的项目吸附到前方并显示名称、说明与链接。

触发：拖动球面；项目吸附到前方

作用层：layout、content

### 实现方法

WebGL将图片瓦片分布到球面，用四元数拖动旋转与惯性更新视角，并把最近正面的项目吸附为活动项。

1. 在React客户端引入锁定registry的InfiniteMenu.css、InfiniteMenu.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 将图片加载到纹理并按球面采样排布，拖动更新旋转四元数，活动项单独显示名称、说明和链接。
3. 使用源码已提供的items、count、tileSize、roundness、zoom、pullBack等属性配置；触发依据：拖动球面；项目吸附到前方。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- items：锁定源码默认：[]
- count：锁定源码默认：160
- tileSize：锁定源码默认：0.63
- roundness：锁定源码默认：0.2
- zoom：锁定源码默认：1.65
- pullBack：锁定源码默认：1
- stretch：锁定源码默认：0.6
- inertia：锁定源码默认：0.6
- autoplay：锁定源码默认：3
- grayscale：锁定源码默认：true
- dim：锁定源码默认：0.5
- intro：锁定源码默认：true
- showInfo：锁定源码默认：true
- theme：锁定源码默认：'dark'

### 适用场景

- 品牌项目探索
- 艺术作品导航

避免用于：

- 高效率课程资料查找

### 限制与接入建议

- 球面展示不等于内容搜索；项目过多时应提供独立平面目录或筛选。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低count并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的autoplay控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及count，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/InfiniteMenu-JS-CSS.json；资料核对时间：2026-10-25T07:53:05.985Z；SHA256：5e981504516e65d5183d4a296c7325e66985e391a69f4d8b1dd34b7d79c40402；哈希对象：registry-response；文件：InfiniteMenu.css、InfiniteMenu.jsx

---

## 分步流程面板 · Stepper

案例ID：819b61711d943890

来源：https://reactbits.dev/components/stepper

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

用步骤指示器和动画状态切换组织多步内容，并显示当前进度。

触发：点击下一步、上一步或步骤

作用层：layout、content

### 实现方法

DOM步骤指示器、连接轨道和当前内容用状态机组织，切换时动画移动指示并过渡步骤面板高度。

1. 在React客户端引入锁定registry的Stepper.css、Stepper.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以initialStep或受控current值维护步骤，linear决定是否允许跳转，前后按钮更新状态并由业务校验数据。
3. 使用源码已提供的initialStep、indicator、orientation、transition、linear、disableStepIndicators等属性配置；触发依据：点击下一步、上一步或步骤。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- initialStep：锁定源码默认：1
- indicator：锁定源码默认：'numbers'
- orientation：锁定源码默认：'horizontal'
- transition：锁定源码默认：'slide'
- linear：锁定源码默认：false
- disableStepIndicators：锁定源码默认：false
- showFooter：锁定源码默认：true
- backButtonText：锁定源码默认：'Back'
- nextButtonText：锁定源码默认：'Continue'
- completeButtonText：锁定源码默认：'Complete'
- backButtonProps：锁定源码默认：{}
- nextButtonProps：锁定源码默认：{}
- theme：锁定源码默认：'dark'
- frame：锁定源码默认：true
- radius：锁定源码默认：24
- width：锁定源码默认：440
- stepCircleContainerClassName：锁定源码默认：''
- stepContainerClassName：锁定源码默认：''
- contentClassName：锁定源码默认：''
- footerClassName：锁定源码默认：''

### 适用场景

- 注册或配置流程
- 分步报告表单

避免用于：

- 伪造真实任务处理进度

### 限制与接入建议

- 动画流程组件不自带后台提交、校验或真实进度，需要接入业务回调。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Stepper-JS-CSS.json；资料核对时间：2026-10-25T07:53:06.074Z；SHA256：2494fd764b356e605081f950e5c394cafe2c870eb42f845169594584ec2c65b7；哈希对象：registry-response；文件：Stepper.css、Stepper.jsx

---

## 弹入扇形照片卡 · Bounce Cards

案例ID：5f6db6faf42a1a39

来源：https://reactbits.dev/components/bounce-cards

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

照片卡片呈扇形弹入，悬停时周围卡片散开，当前卡片扶正。

触发：入场弹跳；鼠标悬停

作用层：content

### 实现方法

多张DOM图片按扇形初始位置用弹簧进入，悬停时邻卡散开、当前卡扶正并提升层级。

1. 在React客户端引入锁定registry的BounceCards.css、BounceCards.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 根据spread、rotation和arc生成基础姿态，按animationDelay错峰入场，指针激活时重算邻卡偏移。
3. 使用源码已提供的images、containerWidth、containerHeight、cardSize、spread、rotation等属性配置；触发依据：入场弹跳；鼠标悬停。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- images：锁定源码默认：[]
- containerWidth：锁定源码默认：400
- containerHeight：锁定源码默认：400
- cardSize：锁定源码默认：200
- spread：锁定源码默认：85
- rotation：锁定源码默认：10
- arc：锁定源码默认：0
- animationDelay：锁定源码默认：0.5
- animationStagger：锁定源码默认：0.06
- bounciness：锁定源码默认：0.6
- enableHover：锁定源码默认：true
- pushDistance：锁定源码默认：160
- hoverScale：锁定源码默认：1.06
- borderWidth：锁定源码默认：5
- borderColor：锁定源码默认：'#ffffff'
- radius：锁定源码默认：25
- shadow：锁定源码默认：true

### 适用场景

- 旅行照片精选
- 个人项目封面

避免用于：

- 长篇资料列表

### 限制与接入建议

- 仅适合少量精选图片；持续移动的卡片不应承载核心表单控件。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/BounceCards-JS-CSS.json；资料核对时间：2026-10-25T07:53:06.031Z；SHA256：a52fe79d726ce1bad01b6efa7a6e7ea0ec39547191cde2906935e20e14a1c885；哈希对象：registry-response；文件：BounceCards.css、BounceCards.jsx

---

## 发光磁流线背景 · Flux Lines

案例ID：9d1460b1bef8c4e1

来源：https://reactbits.dev/backgrounds/flux-lines

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

彩色发光线纹沿指定方向流动，指针产生局部磁力扭曲，点击可激起旋涡。

触发：入场揭示；持续流动；鼠标移动与点击

作用层：page-background

### 实现方法

原生WebGL2片元着色器以多尺度噪声与场函数生成发光流线，局部指针力和点击旋涡改变线纹方向。

1. 在React客户端引入锁定registry的FluxLines.css、FluxLines.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 创建全屏三角形与GLSL300程序，flowDirection推进时间流，mouseStrength与mouseRadius扭曲局部场，clickSwirl叠加短时旋转。
3. 使用源码已提供的colors、speed、scale、turbulence、fluidity、rimWidth等属性配置；触发依据：入场揭示；持续流动；鼠标移动与点击。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- colors：锁定源码默认：['#ffffff', '#ffffff', '#ffffff']
- speed：锁定源码默认：0.5
- scale：锁定源码默认：1.6
- turbulence：锁定源码默认：1
- fluidity：锁定源码默认：0.1
- rimWidth：锁定源码默认：0.2
- sharpness：锁定源码默认：2.5
- shimmer：锁定源码默认：1.5
- glow：锁定源码默认：2
- lineWidth：锁定源码默认：1
- flowDirection：锁定源码默认：'down'
- opacity：锁定源码默认：1
- mouseInteraction：锁定源码默认：true
- mouseStrength：锁定源码默认：1
- mouseRadius：锁定源码默认：0.35
- mouseDampening：锁定源码默认：0.15
- clickSwirl：锁定源码默认：true
- intro：锁定源码默认：true
- lightMode：锁定源码默认：false
- transparent：锁定源码默认：true
- paused：锁定源码默认：false

### 适用场景

- 科学主题氛围
- 定向品牌主视觉

避免用于：

- 真实磁力或流速测量

### 限制与接入建议

- 锁定源码无Three依赖，要求WebGL2；是程序流线纹理，不是已求解的真实磁场或化学流动。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/FluxLines-JS-CSS.json；资料核对时间：2026-10-25T07:53:06.239Z；SHA256：ada9e60e8ae1f404a5c99c515553815ad92872138478b0379c0bbc2095934434；哈希对象：registry-response；文件：FluxLines.css、FluxLines.jsx

---

## 图案波浪背景 · Pattern Waves

案例ID：49356f2a830db282

来源：https://reactbits.dev/backgrounds/pattern-waves

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

点、线、十字或字形铺成起伏表面，波浪像丝绸展开，鼠标可激起涟漪。

触发：持续波浪；鼠标移动产生涟漪

作用层：page-background

### 实现方法

OGL片元着色器将点、线或字形图集映射到起伏表面，按波场和指针涟漪改变图案位置及亮度。

1. 在React客户端引入锁定registry的PatternWaves.css、PatternWaves.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 由preset、characters和图案类型构建采样图集，以波形和时间更新表面，再把局部指针扰动写入涟漪状态。
3. 使用源码已提供的preset、color、backgroundColor、opacity、fade、fadeSize等属性配置；触发依据：持续波浪；鼠标移动产生涟漪。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- preset：锁定源码默认：'silk'
- color：锁定源码默认：'#ffffff'
- backgroundColor：锁定源码默认：'#000000'
- opacity：锁定源码默认：1
- fade：锁定源码默认：'edges'
- fadeSize：锁定源码默认：0.5
- characters：锁定源码默认：DEFAULT_CHARACTERS
- interactive：锁定源码默认：true
- cursorSize：锁定源码默认：50
- cursorStrength：锁定源码默认：0.6
- intro：锁定源码默认：true
- paused：锁定源码默认：false

### 适用场景

- 文化活动舞台
- 科学探索页面氛围

避免用于：

- 测量型波形图表

### 限制与接入建议

- 图案波场是装饰渲染，字形图集需等待字体，不能当作真实水面或科学波数据。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/PatternWaves-JS-CSS.json；资料核对时间：2026-10-25T07:53:06.275Z；SHA256：627ed0e11029c84bebbc614af47245d4996da623d0b11920fc8f788ba5822cb0；哈希对象：registry-response；文件：PatternWaves.css、PatternWaves.jsx

---

## 微型条片海面 · Micro Slats

案例ID：72739122a433abd2

来源：https://reactbits.dev/backgrounds/micro-slats

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

密集细条在透视中起伏成海面，波峰反光，指针可搅动流体。

触发：入场从地平线展开；持续起伏与鼠标搅动

作用层：page-background

### 实现方法

OGL流体多pass模拟产生高度和速度场，透视条片着色器用该场计算波峰反光与条片海面。

1. 在React客户端引入锁定registry的MicroSlats.css、MicroSlats.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 初始化流体速度、旋度与压力缓冲，指针注入力，压力迭代后以slatWidth、slatHeight和gap渲染密集条片。
3. 使用源码已提供的preset、color、glintColor、backgroundColor、slatWidth、slatHeight等属性配置；触发依据：入场从地平线展开；持续起伏与鼠标搅动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- preset：锁定源码默认：'swell'
- color：锁定源码默认：'#A855F7'
- glintColor：锁定源码默认：'#ffffff'
- backgroundColor：锁定源码默认：'#000000'
- slatWidth：锁定源码默认：10
- slatHeight：锁定源码默认：25
- gap：锁定源码默认：3
- roundness：锁定源码默认：0.75
- interactive：锁定源码默认：true
- cursorStrength：锁定源码默认：1
- cursorSize：锁定源码默认：40
- swirl：锁定源码默认：0
- trail：锁定源码默认：1.4
- lean：锁定源码默认：0
- intro：锁定源码默认：true
- introDuration：锁定源码默认：1.5
- paused：锁定源码默认：false

### 适用场景

- 材料品牌视觉
- 海洋主题互动背景

避免用于：

- 低性能设备的整页多层背景

### 限制与接入建议

- 条片海面包含流体迭代与高密度片元计算，不能把其当作轻量CSS条纹。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/MicroSlats-JS-CSS.json；资料核对时间：2026-10-25T07:53:06.475Z；SHA256：609b3f9227cf0cf2a5b970014469301b96d7cb67ca73c249cdf22d80008d05b4；哈希对象：registry-response；文件：MicroSlats.css、MicroSlats.jsx

---

## 深蓝发光纤维场 · Ghost Fibers

案例ID：f4f35306c9faad95

来源：https://reactbits.dev/backgrounds/ghost-fibers

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

深蓝纤维层层递归，发光色带向径向扭转，周围带柔和辉光。

触发：页面展示后持续动画

作用层：page-background

### 实现方法

WebGL片元着色器递归叠加纤维层和波纹扭曲，按径向位置与时间合成深蓝光丝及辉光。

1. 在React客户端引入锁定registry的GhostFibers.css、GhostFibers.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 创建独立Canvas，用layers、waves、twist和threads配置场密度，rotation与rotationSpeed决定整体朝向和相位。
3. 使用源码已提供的glowColor、speed、scale、rotation、rotationSpeed、layers等属性配置；触发依据：页面展示后持续动画。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- glowColor：锁定源码默认：'#2f5bff'
- speed：锁定源码默认：0.2
- scale：锁定源码默认：2
- rotation：锁定源码默认：0
- rotationSpeed：锁定源码默认：0.25
- layers：锁定源码默认：4
- waves：锁定源码默认：0.015
- twist：锁定源码默认：0.1
- threads：锁定源码默认：1
- spread：锁定源码默认：1
- thickness：锁定源码默认：1
- glow：锁定源码默认：2
- brightness：锁定源码默认：1.4
- vignette：锁定源码默认：0.8
- grain：锁定源码默认：0.03
- mouseInteraction：锁定源码默认：true
- intro：锁定源码默认：true
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 深色科技氛围
- 沉浸式展览入口

避免用于：

- 真实显微图像分析

### 限制与接入建议

- 纤维层数和发光强度需受控，明暗纹理不代表真实纤维结构数据。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/GhostFibers-JS-CSS.json；资料核对时间：2026-10-25T07:53:06.500Z；SHA256：ef7748a3eaad19e3fa2df0aa92f5fe2486809a15efd73b7b157eded808720dd3；哈希对象：registry-response；文件：GhostFibers.css、GhostFibers.jsx

---

## 弯曲老电视光场 · CRT Warp

案例ID：04d69f2aeda5c46f

来源：https://reactbits.dev/backgrounds/crt-warp

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

画面呈 CRT 曲面扭曲、扫描线与辉光，等离子色彩铺满背景并响应指针。

触发：持续光场动画；鼠标移动

作用层：page-background

### 实现方法

Three.js全屏ShaderMaterial把动态色场进行曲面畸变，叠加扫描线、波动和辉光形成CRT屏幕外观。

1. 在React客户端引入锁定registry的CRTWarp.css、CRTWarp.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 把curvature、scanlineStrength和waveAmplitude写入uniform，逐帧推进颜色与扭曲，并由指针平滑位置影响画面。
3. 使用源码已提供的color、backgroundColor、speed、curvature、scanlineStrength、scanlineFrequency等属性配置；触发依据：持续光场动画；鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：three@^0.180.0

参数：

- color：锁定源码默认：'#c755f7'
- backgroundColor：锁定源码默认：'#05010a'
- speed：锁定源码默认：0.5
- curvature：锁定源码默认：0.25
- scanlineStrength：锁定源码默认：0.25
- scanlineFrequency：锁定源码默认：200
- waveAmplitude：锁定源码默认：0.3
- waveFrequency：锁定源码默认：2.5
- bloom：锁定源码默认：1.5
- bloomRadius：锁定源码默认：1
- noise：锁定源码默认：0.1
- vignette：锁定源码默认：0
- brightness：锁定源码默认：1.25
- pixelation：锁定源码默认：1
- rgbShift：锁定源码默认：0.015
- mouseReact：锁定源码默认：true
- mouseStrength：锁定源码默认：0.5
- dpr：锁定源码默认：1
- fps：锁定源码默认：30
- paused：锁定源码默认：false

### 适用场景

- 复古游戏主题
- 电子艺术海报

避免用于：

- 正文与代码阅读

### 限制与接入建议

- CRT闪动和扫描线降低细小文字可读性；背景模拟不等于真实终端或显示器校准。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低dpr并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及dpr，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/CRTWarp-JS-CSS.json；资料核对时间：2026-10-25T07:53:06.529Z；SHA256：d83c0974636baa3669b41adbd44a0bf34a4b8222a4326615310cb04ec5f2ebfe；哈希对象：registry-response；文件：CRTWarp.css、CRTWarp.jsx

---

## 熔融金属光丝 · Molten Metal

案例ID：f86234a5a3effbc3

来源：https://reactbits.dev/backgrounds/molten-metal

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

盘旋的焦散光丝带有白热核心，形成像熔化金属的高亮流动纹理。

触发：页面展示后持续流动

作用层：page-background

### 实现方法

OGL片元着色器把旋涡形场与细节噪声映射为高亮焦散光丝，亮核与周边色调产生熔融金属感。

1. 在React客户端引入锁定registry的MoltenMetal.css、MoltenMetal.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 依据color1至color3设置材质色，speed推进纹理，scale、detail、coreSize与swirl控制光丝尺度和卷曲。
3. 使用源码已提供的color1、color2、color3、speed、scale、detail等属性配置；触发依据：页面展示后持续流动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- color1：锁定源码默认：'#5227FF'
- color2：锁定源码默认：'#FF9FFC'
- color3：锁定源码默认：'#FFFFFF'
- speed：锁定源码默认：0.35
- scale：锁定源码默认：4
- detail：锁定源码默认：3
- glow：锁定源码默认：1.6
- coreSize：锁定源码默认：0.1
- swirl：锁定源码默认：1
- fold：锁定源码默认：-0.2
- blackPoint：锁定源码默认：0.05
- brightness：锁定源码默认：1.3
- colorMode：锁定源码默认：'molten'
- grain：锁定源码默认：true
- grainIntensity：锁定源码默认：0.05
- mouseInteraction：锁定源码默认：true
- mouseStrength：锁定源码默认：0.3
- opacity：锁定源码默认：1.0
- backgroundColor：锁定源码默认：'#FFFFFF'
- lightMode：锁定源码默认：false

### 适用场景

- 金属产品宣传
- 工业艺术首屏

避免用于：

- 工程材料测量

### 限制与接入建议

- 视觉是程序着色，不是真实金属温度、流速或材料仿真。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/MoltenMetal-JS-CSS.json；资料核对时间：2026-10-25T07:53:07.349Z；SHA256：e30f6196c4776bf04e8ffb2bb6eacf6aa4337cb4d76fdd0d4bd2b8c4ccccf54e；哈希对象：registry-response；文件：MoltenMetal.css、MoltenMetal.jsx

---

## 渐变地平线波浪 · Gradient Waves

案例ID：107d986a5cba79cf

来源：https://reactbits.dev/backgrounds/gradient-waves

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

渐变正弦波向柔和、雾状地平线滚动，呈现有深度的波浪场。

触发：页面展示后持续波浪

作用层：page-background

### 实现方法

OGL着色器使用多层波场生成远近变化的波面，以渐变、波峰颜色和雾化地平线形成纵深。

1. 在React客户端引入锁定registry的GradientWaves.css、GradientWaves.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以waveScale和amplitude建立波高，speed推进相位，waveRatio、swell与turbulence调节波形混合和远处消隐。
3. 使用源码已提供的horizonColor、waveColor、crestColor、speed、amplitude、waveScale等属性配置；触发依据：页面展示后持续波浪。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- horizonColor：锁定源码默认：'#5227FF'
- waveColor：锁定源码默认：'#FF9FFC'
- crestColor：锁定源码默认：'#FFFFFF'
- speed：锁定源码默认：0.4
- amplitude：锁定源码默认：2.5
- waveScale：锁定源码默认：0.6
- waveRatio：锁定源码默认：0.9
- swell：锁定源码默认：35
- turbulence：锁定源码默认：20
- tilt：锁定源码默认：1.11
- zoom：锁定源码默认：1.0
- height：锁定源码默认：5.5
- fogDepth：锁定源码默认：15
- detail：锁定源码默认：'medium'
- brightness：锁定源码默认：1.0
- opacity：锁定源码默认：1.0
- mouseInteraction：锁定源码默认：true
- parallaxStrength：锁定源码默认：0.5
- grain：锁定源码默认：true
- grainIntensity：锁定源码默认：0.05

### 适用场景

- 海洋旅行品牌
- 自然主题首屏

避免用于：

- 气象海况仪表

### 限制与接入建议

- 波浪外观不能代替真实海况或地形数据；地平线需要与正文位置隔离。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/GradientWaves-JS-CSS.json；资料核对时间：2026-10-25T07:53:06.826Z；SHA256：2bb5d7eab7cf20cb87b4ea002523e8b90c8a270af2a4bea79aab5debfed5b18b；哈希对象：registry-response；文件：GradientWaves.css、GradientWaves.jsx

---

## 汇聚光点的编织光丝 · Web Threads

案例ID：d4968ae364bc4208

来源：https://reactbits.dev/backgrounds/web-threads

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

发光正弦丝线织向明亮的汇聚点，形成有方向的线束背景。

触发：页面展示后持续线丝运动

作用层：page-background

### 实现方法

OGL着色器将正弦光丝朝汇聚点编织，曲线距离与渐变着色形成有方向的细线束。

1. 在React客户端引入锁定registry的WebThreads.css、WebThreads.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 由threadCount、frequency、spread和taper建立扇形线场，position控制汇聚点，时间与指针改变局部方向。
3. 使用源码已提供的color1、color2、color3、speed、threadCount、frequency等属性配置；触发依据：页面展示后持续线丝运动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- color1：锁定源码默认：'#5227FF'
- color2：锁定源码默认：'#FF9FFC'
- color3：锁定源码默认：'#FFFFFF'
- speed：锁定源码默认：0.2
- threadCount：锁定源码默认：6
- frequency：锁定源码默认：5.0
- spread：锁定源码默认：0.18
- taper：锁定源码默认：1.0
- position：锁定源码默认：0.5
- fanMode：锁定源码默认：'center'
- glow：锁定源码默认：0.02
- falloff：锁定源码默认：0.6
- thickness：锁定源码默认：1.1
- brightness：锁定源码默认：0.6
- opacity：锁定源码默认：1.0
- mirror：锁定源码默认：true
- shimmer：锁定源码默认：false
- grain：锁定源码默认：true
- grainIntensity：锁定源码默认：0.05
- mouseInteraction：锁定源码默认：true
- mouseStrength：锁定源码默认：0.3
- backgroundColor：锁定源码默认：'#FFFFFF'
- lightMode：锁定源码默认：false

### 适用场景

- 通信主题品牌
- 研究团队首屏

避免用于：

- 可编辑流程关系图

### 限制与接入建议

- 多条线是一个着色器图案，不原生支持逐条选择或业务连线。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低threadCount并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及threadCount，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/WebThreads-JS-CSS.json；资料核对时间：2026-10-25T07:53:06.920Z；SHA256：67c193691b14ee4ea8c136f3d2a1ed8dbd54cd9ae315f19c1a92b52f30f77dbd；哈希对象：registry-response；文件：WebThreads.css、WebThreads.jsx

---

## 发光等高线地图 · Topography

案例ID：e5682fdf7f5c92ef

来源：https://reactbits.dev/backgrounds/topography

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

等高线随表面高低变化，线条带辉光与按高度变化的颜色。

触发：页面展示后持续地形变化

作用层：page-background

### 实现方法

OGL片元着色器对动态高度场按band取等值线，以高度分段配色并给线条叠加辉光。

1. 在React客户端引入锁定registry的Topography.css、Topography.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以scale与morphAmount生成起伏场，通过bands和thickness提取轮廓，morphSpeed推进形态并混合低中高色。
3. 使用源码已提供的lowColor、midColor、highColor、speed、morphAmount、morphSpeed等属性配置；触发依据：页面展示后持续地形变化。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- lowColor：锁定源码默认：'#5227FF'
- midColor：锁定源码默认：'#FF9FFC'
- highColor：锁定源码默认：'#FFFFFF'
- speed：锁定源码默认：0.35
- morphAmount：锁定源码默认：3.0
- morphSpeed：锁定源码默认：0.05
- bands：锁定源码默认：2.0
- thickness：锁定源码默认：0.01
- scale：锁定源码默认：1.0
- pixelSize：锁定源码默认：1.0
- glow：锁定源码默认：0.5
- colorMode：锁定源码默认：'elevation'
- contrast：锁定源码默认：3.0
- brightness：锁定源码默认：1.0
- fillBands：锁定源码默认：false
- opacity：锁定源码默认：1.0
- grain：锁定源码默认：true
- grainIntensity：锁定源码默认：0.05
- mouseInteraction：锁定源码默认：true
- mouseRadius：锁定源码默认：0.3
- mouseStrength：锁定源码默认：0.4
- lightMode：锁定源码默认：false

### 适用场景

- 花园地形氛围
- 户外品牌背景

避免用于：

- 真实地图或GIS分析

### 限制与接入建议

- 这是程序等高线纹理，不包含真实地理坐标或可量测海拔。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Topography-JS-CSS.json；资料核对时间：2026-10-25T07:53:06.953Z；SHA256：c91a6b487d0bff5816d8be3a56d2312ba70c0592b1e44c5568850eaa8bee318e；哈希对象：registry-response；文件：Topography.css、Topography.jsx

---

## 光纤纵深隧道 · Light Tunnel

案例ID：50c0b4edfc4cfbe3

来源：https://reactbits.dev/backgrounds/light-tunnel

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

径向光纤形成隧道，光脉冲沿线条快速深入远处。

触发：页面展示后持续光脉冲

作用层：page-background

### 实现方法

WebGL在透视隧道坐标中绘制径向光缆，沿线传播的周期脉冲形成向纵深穿梭感。

1. 在React客户端引入锁定registry的LightTunnel.css、LightTunnel.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 配置cableColor和隧道底色，以flowDirection与speed推进场景，pulseSpeed、pulseLength和pulseBlend控制光脉冲。
3. 使用源码已提供的cableColor、pulseColor、tunnelColor、tunnelOpacity、speed、flowDirection等属性配置；触发依据：页面展示后持续光脉冲。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- cableColor：锁定源码默认：'#ffffff'
- pulseColor：锁定源码默认：'#ffffff'
- tunnelColor：锁定源码默认：'#ffffff'
- tunnelOpacity：锁定源码默认：0
- speed：锁定源码默认：0.1
- flowDirection：锁定源码默认：'inward'
- pulseSpeed：锁定源码默认：2
- pulseLength：锁定源码默认：0.28
- pulseBlend：锁定源码默认：0.6
- pulseWidth：锁定源码默认：1
- pulseDensity：锁定源码默认：0.5
- cableCount：锁定源码默认：56
- thickness：锁定源码默认：0.35
- rimWidth：锁定源码默认：0.15
- waviness：锁定源码默认：0.3
- sway：锁定源码默认：0.5
- bend：锁定源码默认：0.4
- size：锁定源码默认：1
- centerX：锁定源码默认：0
- centerY：锁定源码默认：0
- glow：锁定源码默认：1
- fadeNear：锁定源码默认：0.5
- fadeFar：锁定源码默认：2
- brightness：锁定源码默认：1
- colorVariance：锁定源码默认：true
- grain：锁定源码默认：false
- grainIntensity：锁定源码默认：0.05
- opacity：锁定源码默认：1
- mouseInteraction：锁定源码默认：true
- mouseStrength：锁定源码默认：0.1
- clickSurge：锁定源码默认：true
- intro：锁定源码默认：true
- variation：锁定源码默认：0
- lightMode：锁定源码默认：false

### 适用场景

- 科幻电影入口
- 网络通信主视觉

避免用于：

- 长时间阅读背景

### 限制与接入建议

- 纵深是着色器视觉而非真实道路或可导航三维空间；运动强度需可暂停。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低pulseDensity、cableCount并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及pulseDensity、cableCount，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/LightTunnel-JS-CSS.json；资料核对时间：2026-10-25T07:53:07.074Z；SHA256：1fec9b522fc62e7423864be5b2d6c6308bf74cbe9b0f342ef56080e66a1c9b08；哈希对象：registry-response；文件：LightTunnel.css、LightTunnel.jsx

---

## 切片彩色光浪 · Sliced Waves

案例ID：615e57c8ecce0da5

来源：https://reactbits.dev/backgrounds/sliced-waves

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

彩色波浪切成发光条带，在透视空间中起伏，焦点随指针移动。

触发：持续起伏；鼠标移动调整焦点

作用层：page-background

### 实现方法

WebGL把正弦波面裁成有间距的发光条片，投影深度与指针焦点改变彩带起伏的空间感。

1. 在React客户端引入锁定registry的SlicedWaves.css、SlicedWaves.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按ribbons、spacing和barWidth分片，使用ribbonHeight、amplitude与spread计算波面，颜色分层合成。
3. 使用源码已提供的color1、color2、color3、ribbons、spacing、barWidth等属性配置；触发依据：持续起伏；鼠标移动调整焦点。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- color1：锁定源码默认：'#ffd9a8'
- color2：锁定源码默认：'#ff5fa2'
- color3：锁定源码默认：'#5b8cff'
- ribbons：锁定源码默认：3
- spacing：锁定源码默认：28
- barWidth：锁定源码默认：0.5
- ribbonHeight：锁定源码默认：0.26
- spread：锁定源码默认：0.1
- amplitude：锁定源码默认：0.1
- frequency：锁定源码默认：1
- speed：锁定源码默认：1
- perspective：锁定源码默认：0.45
- curve：锁定源码默认：0.5
- blur：锁定源码默认：0.6
- glow：锁定源码默认：1
- brightness：锁定源码默认：1.25
- position：锁定源码默认：0.78
- rotation：锁定源码默认：0
- slices：锁定源码默认：0
- grain：锁定源码默认：0.08
- mouseInteraction：锁定源码默认：true
- intro：锁定源码默认：true
- fade：锁定源码默认：0
- opacity：锁定源码默认：1
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 音乐活动舞台
- 创意科技品牌

避免用于：

- 统计图表

### 限制与接入建议

- 条片是程序视觉，不能把每条当作对应真实数据序列的图线。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/SlicedWaves-JS-CSS.json；资料核对时间：2026-10-25T07:53:07.364Z；SHA256：06add496e69b2fff8cf128a814d43676aa5606891b4d10aaec1f0a7e8af29871；哈希对象：registry-response；文件：SlicedWaves.css、SlicedWaves.jsx

---

## 层叠方形光廊 · Acid Squares

案例ID：c42ffcedfaa7ae94

来源：https://reactbits.dev/backgrounds/acid-squares

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多层方形组成晶体走廊，光圈沿纵深朝观看者移动。

触发：页面展示后持续推进

作用层：page-background

### 实现方法

WebGL按层叠方形或配置轮廓构成透视走廊，沿纵深推进发光脉冲并叠加闪点。

1. 在React客户端引入锁定registry的AcidSquares.css、AcidSquares.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 由shape与层间几何建立距离场，以pulseSpeed、pulseSpacing和pulseWidth推进光圈，speed控制整体运动。
3. 使用源码已提供的color、accentColor、shape、pulse、pulseSpeed、pulseSpacing等属性配置；触发依据：页面展示后持续推进。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- color：锁定源码默认：'#120f17'
- accentColor：锁定源码默认：'#c6ff3d'
- shape：锁定源码默认：'square'
- pulse：锁定源码默认：1
- pulseSpeed：锁定源码默认：0.45
- pulseSpacing：锁定源码默认：1
- pulseWidth：锁定源码默认：1
- sparkle：锁定源码默认：0.04
- speed：锁定源码默认：0.7
- breathe：锁定源码默认：1
- zoom：锁定源码默认：1.3
- depth：锁定源码默认：10
- edges：锁定源码默认：0.45
- twist：锁定源码默认：0
- roll：锁定源码默认：0
- brightness：锁定源码默认：1
- mouseInteraction：锁定源码默认：true
- mouseStrength：锁定源码默认：1
- mouseRadius：锁定源码默认：0.35
- detail：锁定源码默认：'medium'
- grain：锁定源码默认：0.03
- fade：锁定源码默认：0
- opacity：锁定源码默认：1
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 游戏活动入口
- 数字艺术背景

避免用于：

- 阅读和考试界面

### 限制与接入建议

- 高亮走廊和闪点可能形成强刺激，不能放在需要长时间聚焦的阅读区域。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/AcidSquares-JS-CSS.json；资料核对时间：2026-10-25T07:53:07.374Z；SHA256：7e0856bddfc97c80ee2e2a35b682d0d357194eb02933b4655dd24372a67f5485；哈希对象：registry-response；文件：AcidSquares.css、AcidSquares.jsx

---

## 示波器扫描条纹 · Scanner

案例ID：a84c12fe4b367a06

来源：https://reactbits.dev/backgrounds/scanner

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

平静的干涉条带持续横扫画面，形成类似示波器的扫描纹理。

触发：页面展示后持续扫描

作用层：page-background

### 实现方法

OGL着色器叠加周期干涉条纹与横扫扫描带，扫描中心按时间移动并通过衰减控制亮度。

1. 在React客户端引入锁定registry的Scanner.css、Scanner.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用frequency与scale配置条带密度，以sweepSpeed、sweepWidth和sweepFalloff驱动扫描窗。
3. 使用源码已提供的color1、color2、color3、speed、sweepSpeed、sweepWidth等属性配置；触发依据：页面展示后持续扫描。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- color1：锁定源码默认：'#5227FF'
- color2：锁定源码默认：'#FF9FFC'
- color3：锁定源码默认：'#FFFFFF'
- speed：锁定源码默认：0.5
- sweepSpeed：锁定源码默认：0.25
- sweepWidth：锁定源码默认：1.6
- sweepFalloff：锁定源码默认：6
- scale：锁定源码默认：1.5
- frequency：锁定源码默认：2
- ripple：锁定源码默认：0.22
- bandDensity：锁定源码默认：11
- lineSharpness：锁定源码默认：5.5
- glow：锁定源码默认：0.22
- scanDirection：锁定源码默认：'vertical'
- colorSpread：锁定源码默认：0.7
- brightness：锁定源码默认：1.0
- contrast：锁定源码默认：1.15
- softness：锁定源码默认：1.4
- vignette：锁定源码默认：0.45
- scanline：锁定源码默认：true
- grain：锁定源码默认：true
- grainIntensity：锁定源码默认：0.05
- opacity：锁定源码默认：1.0
- mouseInteraction：锁定源码默认：true
- mouseRadius：锁定源码默认：0.5
- mouseStrength：锁定源码默认：0.5

### 适用场景

- 实验室主题首屏
- 电子产品演示

避免用于：

- 伪装真实扫描结果

### 限制与接入建议

- 扫描效果仅是装饰，不代表真实设备正在识别、诊断或扫描用户资料。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低bandDensity并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及bandDensity，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Scanner-JS-CSS.json；资料核对时间：2026-10-25T07:53:07.412Z；SHA256：c0095514a5c350233d38ff30f12df366120e4e8cb685f6181cf03c662db8e063；哈希对象：registry-response；文件：Scanner.css、Scanner.jsx

---

## 磁性流体等高线 · Ferrofluid

案例ID：95ca6e63302df6e0

来源：https://reactbits.dev/backgrounds/ferrofluid

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

磁性流体持续翻涌，发光轮廓勾出液面，指针像磁铁一样牵引流体。

触发：持续翻涌；鼠标移动牵引

作用层：page-background

### 实现方法

WebGL用流动噪声、尖峰与等值轮廓构造磁性液面，指针力改变局部高度与方向。

1. 在React客户端引入锁定registry的Ferrofluid.css、Ferrofluid.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 依据scale和spikeHeight生成表面，sharpness调节峰形，magnetism与指针局部位置更新扰动，再提取彩色轮廓。
3. 使用源码已提供的colors、speed、scale、spikeHeight、sharpness、turbulence等属性配置；触发依据：持续翻涌；鼠标移动牵引。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- colors：锁定源码默认：['#ffffff', '#ffffff', '#ffffff']
- speed：锁定源码默认：0.5
- scale：锁定源码默认：1.6
- spikeHeight：锁定源码默认：1
- sharpness：锁定源码默认：2.5
- turbulence：锁定源码默认：1
- fluidity：锁定源码默认：0.5
- tilt：锁定源码默认：48
- magnetism：锁定源码默认：1
- variation：锁定源码默认：0
- flowDirection：锁定源码默认：'down'
- brightness：锁定源码默认：1
- mouseInteraction：锁定源码默认：true
- mouseStrength：锁定源码默认：1
- mouseRadius：锁定源码默认：0.22
- mouseDampening：锁定源码默认：0.15
- clickPulse：锁定源码默认：true
- intro：锁定源码默认：true
- lightMode：锁定源码默认：false
- transparent：锁定源码默认：true
- opacity：锁定源码默认：1
- paused：锁定源码默认：false

### 适用场景

- 磁性材料品牌
- 科学探索氛围

避免用于：

- 真实磁性流体计算

### 限制与接入建议

- 不是基于磁场单位或材料参数的求解器，不能用于定量教学验证。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Ferrofluid-JS-CSS.json；资料核对时间：2026-10-25T07:53:07.545Z；SHA256：a69ceb9d333219f9f64c4c2f8465935a34f5bdc493bdc5dc2ac337819d88af51；哈希对象：registry-response；文件：Ferrofluid.css、Ferrofluid.jsx

---

## 隧道落下的光雨 · Lightfall

案例ID：0339fea6b68d9351

来源：https://reactbits.dev/backgrounds/lightfall

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

彩色光条沿发光隧道落下，指针附近增加局部光亮。

触发：持续光雨；鼠标移动

作用层：page-background

### 实现方法

WebGL在纵深隧道中生成按时间下落的光条，长度、密度与辉光决定光雨层次。

1. 在React客户端引入锁定registry的Lightfall.css、Lightfall.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以streakCount和density分配光条相位，speed推进下落位置，streakLength、glow和局部指针光增强形成层次。
3. 使用源码已提供的colors、backgroundColor、speed、streakCount、streakWidth、streakLength等属性配置；触发依据：持续光雨；鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- colors：锁定源码默认：['#ffffff']
- backgroundColor：锁定源码默认：'#94a3b8'
- speed：锁定源码默认：0.3
- streakCount：锁定源码默认：2
- streakWidth：锁定源码默认：0.8
- streakLength：锁定源码默认：1
- glow：锁定源码默认：1
- density：锁定源码默认：0.6
- twinkle：锁定源码默认：0.3
- zoom：锁定源码默认：3
- backgroundGlow：锁定源码默认：0.1
- headGlow：锁定源码默认：0.6
- depth：锁定源码默认：0.5
- bloom：锁定源码默认：0.35
- opacity：锁定源码默认：1
- mouseInteraction：锁定源码默认：true
- mouseStrength：锁定源码默认：0.4
- mouseRadius：锁定源码默认：0.45
- mouseDampening：锁定源码默认：0.15
- lens：锁定源码默认：0.5
- holdToWarp：锁定源码默认：true
- intro：锁定源码默认：true
- fade：锁定源码默认：0
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 音乐活动入场
- 科幻内容封面

避免用于：

- 正文资料区

### 限制与接入建议

- 大量明亮光条与高glow会降低文字对比，不应作为长篇资料阅读底图。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低streakCount、density并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及streakCount、density，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Lightfall-JS-CSS.json；资料核对时间：2026-10-25T07:53:07.832Z；SHA256：9cdee1ae6210c22662ec62d7942fc075c52a7a47a34c65dafe524ac0b8492ba1；哈希对象：registry-response；文件：Lightfall.css、Lightfall.jsx

---

## 互动彩色液体 · Liquid Ether

案例ID：08ea2449be06f172

来源：https://reactbits.dev/backgrounds/liquid-ether

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

可定制色彩的液体随着流动与指针扰动产生涡流和形变。

触发：持续流动；鼠标或触摸扰动

作用层：page-background

### 实现方法

锁定版以Three.js的WebGLRenderer和多渲染目标实现二维速度场：平流、可选BFECC、粘性与压力Poisson迭代形成持续液体流动，鼠标/触摸注入力并用调色板着色；不是单纯移动CSS渐变。

1. 在有明确宽高的容器初始化WebGLRenderer、速度/散度/压力纹理与调色板，resolution决定模拟尺寸。
2. 按dt执行速度平流、可选BFECC修正及粘性迭代，再用Poisson压力迭代和压力梯度修正速度，最后输出颜色场。
3. 将指针/触摸位置换算到局部场坐标，以mouseForce与cursorSize注入力；autoDemo在无人操作时提供自动驱动轨迹。
4. 使用源码的ResizeObserver、IntersectionObserver与动画清理；接入建议将canvas置于独立背景层，表单与正文保持稳定。

依赖：three@^0.180.0

参数：

- mouseForce：锁定源码默认：20
- cursorSize：锁定源码默认：100
- isViscous：锁定源码默认：false
- viscous：锁定源码默认：30
- iterationsViscous：锁定源码默认：32
- iterationsPoisson：锁定源码默认：32
- dt：锁定源码默认：0.014
- BFECC：锁定源码默认：true
- resolution：锁定源码默认：0.5
- isBounce：锁定源码默认：false
- colors：锁定源码默认：['#5227FF', '#FF9FFC', '#B497CF']
- autoDemo：锁定源码默认：true
- autoSpeed：锁定源码默认：0.5
- autoIntensity：锁定源码默认：2.2
- takeoverDuration：锁定源码默认：0.25
- autoResumeDelay：锁定源码默认：1000
- autoRampDuration：锁定源码默认：0.6
- backgroundColor：锁定源码默认：'#FFFFFF'
- lightMode：锁定源码默认：false

### 适用场景

- 互动品牌首屏的颜料或流体氛围
- 创意展览、音乐或科学主题的装饰背景

避免用于：

- 需要真实流体测量、化学反应或CFD计算结果的科学可视化

### 限制与接入建议

- 该锁定版本依赖Three.js和可用WebGL，不能按当前官网同名新版的无依赖实现说明。
- 多次粘性和压力迭代增加GPU负担；流体色场是装饰模拟，不代表真实实验数据或化学过程。

手机：项目接入建议：降低resolution、iterationsPoisson和iterationsViscous后实机观察，保留低成本自动流动，触屏拖动不要阻断页面滚动。

减少动态：项目接入建议：用户暂停或系统减少动态时停止推进模拟并显示静态取色画面，核心操作仍可用。

性能：项目接入建议：优先减少模拟分辨率和压力迭代，离屏暂停、卸载释放WebGL资源；不要同时叠加第二个全屏流体模拟。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/LiquidEther-JS-CSS.json；资料核对时间：2026-10-25T07:53:07.876Z；SHA256：fe6df3cd72cc4e0fd39e009870710f8ef71b715a50ac636743df1492f82eb247；哈希对象：registry-response；文件：LiquidEther.css、LiquidEther.jsx

---

## 旋转发光棱镜 · Prism

案例ID：6dcb08d9f60c4ed9

来源：https://reactbits.dev/backgrounds/prism

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

棱镜随时间旋转，光强、尺寸与颜色可调整，形成几何光学主视觉。

触发：页面展示后持续旋转

作用层：page-background

### 实现方法

OGL着色器以棱镜几何场和光照计算形成发光棱镜，时间或交互驱动角度与色相变化。

1. 在React客户端引入锁定registry的Prism.css、Prism.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 配置height、baseWidth和scale确定几何比例，animationType控制运动，glow、hueShift和noise处理光感。
3. 使用源码已提供的height、baseWidth、animationType、glow、offset、noise等属性配置；触发依据：页面展示后持续旋转。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- height：锁定源码默认：3.5
- baseWidth：锁定源码默认：5.5
- animationType：锁定源码默认：'rotate'
- glow：锁定源码默认：1
- offset：锁定源码默认：{ x: 0, y: 0 }
- noise：锁定源码默认：0.5
- transparent：锁定源码默认：true
- scale：锁定源码默认：3.6
- hueShift：锁定源码默认：0
- colorFrequency：锁定源码默认：1
- hoverStrength：锁定源码默认：2
- inertia：锁定源码默认：0.05
- bloom：锁定源码默认：1
- suspendWhenOffscreen：锁定源码默认：false
- timeScale：锁定源码默认：0.5
- lightMode：锁定源码默认：false

### 适用场景

- 光学主题展示
- 科技品牌主图

避免用于：

- 定量光谱教学模型

### 限制与接入建议

- 棱镜是程序渲染视觉，不自动支持真实折射率或光谱实验参数。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Prism-JS-CSS.json；资料核对时间：2026-10-25T07:53:08.040Z；SHA256：2b28c5b07156a4ce5919764e2db1b78efeab67ccd7c42f7db365366b3a00a70c；哈希对象：registry-response；文件：Prism.css、Prism.jsx

---

## 深色流动幕布 · Dark Veil

案例ID：a84dfef1365dc129

来源：https://reactbits.dev/backgrounds/dark-veil

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

深色纹理以平滑动画和后期辉光变化，形成低干扰的动态背景。

触发：页面展示后持续动画

作用层：page-background

### 实现方法

原生WebGL色场经多层流动扭曲与明暗高光合成，形成深色缎幕和低对比光褶。

1. 在React客户端引入锁定registry的DarkVeil.css、DarkVeil.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以scale、rotation和flow组织纹理方向，warp与variation调节形变，speed推进时间并用brightness控制亮度。
3. 使用源码已提供的color、speed、scale、rotation、flow、warp等属性配置；触发依据：页面展示后持续动画。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- color：锁定源码默认：'#6b12ff'
- speed：锁定源码默认：0.5
- scale：锁定源码默认：1
- rotation：锁定源码默认：0
- flow：锁定源码默认：1
- warp：锁定源码默认：0
- variation：锁定源码默认：0
- brightness：锁定源码默认：1
- sheen：锁定源码默认：0
- glow：锁定源码默认：0.4
- grain：锁定源码默认：0.03
- quality：锁定源码默认：0.5
- mouseInteraction：锁定源码默认：true
- mouseStrength：锁定源码默认：1
- intro：锁定源码默认：true
- fade：锁定源码默认：0
- opacity：锁定源码默认：1
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 高端产品首屏
- 深色创意作品

避免用于：

- 低对比文字背景

### 限制与接入建议

- 背景过暗或高光过强都可能影响对比；它不是内容面板的真实布料材质。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低quality并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及quality，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/DarkVeil-JS-CSS.json；资料核对时间：2026-10-25T07:53:07.976Z；SHA256：a446eee388f7c0a5ff83b313e99fa4300fa72d33dfd13594f328bb82b7d73733；哈希对象：registry-response；文件：DarkVeil.css、DarkVeil.jsx

---

## 发光垂直光柱 · Light Pillar

案例ID：3260c657755ad6ea

来源：https://reactbits.dev/backgrounds/light-pillar

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

垂直光柱带柔和辉光，光线强弱与表面纹理形成动态照明感。

触发：页面展示后持续光柱动画

作用层：page-background

### 实现方法

WebGL着色器按垂直方向合成光柱、体积感纹理与上下渐变，时间旋转和点击脉冲改变能量。

1. 在React客户端引入锁定registry的LightPillar.css、LightPillar.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 设置topColor、bottomColor与intensity，用rotationSpeed和flow驱动场，interactive与clickPulse控制局部响应。
3. 使用源码已提供的topColor、bottomColor、intensity、rotationSpeed、flow、interactive等属性配置；触发依据：页面展示后持续光柱动画。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- topColor：锁定源码默认：'#5227FF'
- bottomColor：锁定源码默认：'#FF9FFC'
- intensity：锁定源码默认：1.0
- rotationSpeed：锁定源码默认：0.3
- flow：锁定源码默认：1
- interactive：锁定源码默认：true
- clickPulse：锁定源码默认：true
- glowAmount：锁定源码默认：0.002
- bloom：锁定源码默认：0.5
- pillarWidth：锁定源码默认：3.0
- pillarHeight：锁定源码默认：0.4
- pillarRotation：锁定源码默认：25
- twist：锁定源码默认：0.4
- detail：锁定源码默认：4
- noiseIntensity：锁定源码默认：0.5
- fade：锁定源码默认：0
- intro：锁定源码默认：true
- mixBlendMode：锁定源码默认：'screen'
- quality：锁定源码默认：'high'
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 发布会首屏
- 空间科技入口

避免用于：

- 要求物理准确的照明工具

### 限制与接入建议

- 光柱是氛围视觉，不等于实际灯光投射或场景几何照明。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低quality并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及quality，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/LightPillar-JS-CSS.json；资料核对时间：2026-10-25T07:53:08.014Z；SHA256：93ad744c49b171b70fc1cee43920f8585117d04bbdd43a6e15ad89bd603edb64；哈希对象：registry-response；文件：LightPillar.css、LightPillar.jsx

---

## 柔光丝绸背景 · Silk

案例ID：c9ac7c82a1934228

来源：https://reactbits.dev/backgrounds/silk

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

柔和灯光照在起伏波面上，呈现丝绸般流动褶皱。

触发：页面展示后持续波动

作用层：page-background

### 实现方法

WebGL将动态波纹与光照梯度混合为丝绸褶皱，独立噪声和高光色决定柔和材质层次。

1. 在React客户端引入锁定registry的Silk.css、Silk.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 通过speed、scale与rotation控制褶皱运动，以sheen、sheenColor、depth和noiseIntensity调节表面明暗。
3. 使用源码已提供的speed、scale、color、sheenColor、noiseIntensity、rotation等属性配置；触发依据：页面展示后持续波动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- speed：锁定源码默认：5
- scale：锁定源码默认：1
- color：锁定源码默认：'#7B7481'
- sheenColor：锁定源码默认：'#ffffff'
- noiseIntensity：锁定源码默认：1.5
- rotation：锁定源码默认：0
- sheen：锁定源码默认：0.5
- depth：锁定源码默认：0.5
- glow：锁定源码默认：0.3
- ripple：锁定源码默认：1
- wave：锁定源码默认：1
- variation：锁定源码默认：0
- mouseInteraction：锁定源码默认：true
- interactionStrength：锁定源码默认：1
- clickRipple：锁定源码默认：true
- intro：锁定源码默认：true
- fade：锁定源码默认：0
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 服装品牌
- 温暖自然主题背景

避免用于：

- 材质力学教学

### 限制与接入建议

- 程序丝绸不是真实布料模拟；过高细节与辉光不应压过正文。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Silk-JS-CSS.json；资料核对时间：2026-10-25T07:53:08.299Z；SHA256：824ccc6ac73d34ebbc8e3dd7c5e525efd834cd97959b02f5364c6ce28e8b3d7f；哈希对象：registry-response；文件：Silk.css、Silk.jsx

---

## 漂浮三维线带 · Floating Lines

案例ID：86cafd741ca27db9

来源：https://reactbits.dev/backgrounds/floating-lines

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多条有纵深的线带悬浮运动，随指针移动改变形态。

触发：持续线带运动；鼠标移动

作用层：page-background

### 实现方法

WebGL多组线带按波函数和相位形成有纵深的曲线层，指针平滑偏移扭曲不同波层。

1. 在React客户端引入锁定registry的FloatingLines.css、FloatingLines.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用enabledWaves选择实际波组，lineCount和lineDistance确定数量间距，animationSpeed与amplitude决定连续运动。
3. 使用源码已提供的linesGradient、enabledWaves、lineCount、lineDistance、animationSpeed、amplitude等属性配置；触发依据：持续线带运动；鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- linesGradient：锁定源码默认：['#e945f5', '#ffffff']
- enabledWaves：锁定源码默认：['top', 'middle', 'bottom']
- lineCount：锁定源码默认：10
- lineDistance：锁定源码默认：6
- animationSpeed：锁定源码默认：1
- amplitude：锁定源码默认：1
- lineWidth：锁定源码默认：1
- lineStyle：锁定源码默认：'solid'
- glow：锁定源码默认：1
- brightness：锁定源码默认：1
- depthOfField：锁定源码默认：0.5
- edgeFade：锁定源码默认：0
- interactive：锁定源码默认：true
- bendRadius：锁定源码默认：5
- bendStrength：锁定源码默认：-0.5
- mouseDamping：锁定源码默认：0.05
- parallax：锁定源码默认：true
- parallaxStrength：锁定源码默认：0.2
- clickSwirl：锁定源码默认：true
- intro：锁定源码默认：true
- mixBlendMode：锁定源码默认：'screen'
- lightMode：锁定源码默认：false
- opacity：锁定源码默认：1

### 适用场景

- 创意工具品牌
- 音乐或科技舞台

避免用于：

- 真实时序分析图

### 限制与接入建议

- 线带是装饰场，不是数据曲线；多层数量过多会使片元处理显著增加。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低lineCount并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及lineCount，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/FloatingLines-JS-CSS.json；资料核对时间：2026-10-25T07:53:08.425Z；SHA256：4cddbc9dfcf17b5c0f5a18cb036296c879a8b1762697fdccd6668d838bb111e5；哈希对象：registry-response；文件：FloatingLines.css、FloatingLines.jsx

---

## 侧面射入光线 · Side Rays

案例ID：ea992f33a99c04c8

来源：https://reactbits.dev/backgrounds/side-rays

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

彩色光束从画面侧边射入并动态变化，颜色和速度可调整。

触发：页面展示后持续光线运动

作用层：page-background

### 实现方法

OGL片元着色器从配置侧向origin发射彩色射线，时间调制强度、扩散与噪声造成穿透感。

1. 在React客户端引入锁定registry的SideRays.css、SideRays.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以origin、tilt和spread确定方向场，rayColor1和rayColor2混合颜色，speed与intensity更新光束明暗。
3. 使用源码已提供的speed、rayColor1、rayColor2、intensity、spread、origin等属性配置；触发依据：页面展示后持续光线运动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- speed：锁定源码默认：2.5
- rayColor1：锁定源码默认：'#EAB308'
- rayColor2：锁定源码默认：'#96c8ff'
- intensity：锁定源码默认：2
- spread：锁定源码默认：2
- origin：锁定源码默认：'top-right'
- tilt：锁定源码默认：0
- saturation：锁定源码默认：1.5
- blend：锁定源码默认：0.75
- falloff：锁定源码默认：1.6
- opacity：锁定源码默认：1.0

### 适用场景

- 活动舞台侧光
- 品牌背景

避免用于：

- 真实场景灯光模拟

### 限制与接入建议

- 不自动识别页面物体投影和遮挡；接入方需给正文留独立可读表面。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/SideRays-JS-CSS.json；资料核对时间：2026-10-25T07:53:08.509Z；SHA256：d5d69bbc2571ab9f38dc999009ba5e35e18f6d0c62210991950ed1827880812c；哈希对象：registry-response；文件：SideRays.css、SideRays.jsx

---

## 体积光束背景 · Light Rays

案例ID：2e43890744734192

来源：https://reactbits.dev/backgrounds/light-rays

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

可调方向的光束铺在背景中，形成空气里可见的照明射线。

触发：页面展示后持续光线变化

作用层：page-background

### 实现方法

OGL着色器从可选起点计算径向光束与衰减，脉动和指针影响改变射线方向及亮度。

1. 在React客户端引入锁定registry的LightRays.css、LightRays.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 配置raysOrigin、lightSpread与rayLength，再用fadeDistance和pulsating控制能量，followMouse写入指针uniform。
3. 使用源码已提供的raysOrigin、raysColor、raysSpeed、lightSpread、rayLength、pulsating等属性配置；触发依据：页面展示后持续光线变化。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- raysOrigin：锁定源码默认：'top-center'
- raysColor：锁定源码默认：DEFAULT_COLOR
- raysSpeed：锁定源码默认：1
- lightSpread：锁定源码默认：1
- rayLength：锁定源码默认：2
- pulsating：锁定源码默认：false
- fadeDistance：锁定源码默认：1.0
- saturation：锁定源码默认：1.0
- followMouse：锁定源码默认：true
- mouseInfluence：锁定源码默认：0.1
- noiseAmount：锁定源码默认：0.0
- distortion：锁定源码默认：0.0
- lightMode：锁定源码默认：false

### 适用场景

- 剧场或展览入口
- 重点内容照明氛围

避免用于：

- 工程照明设计

### 限制与接入建议

- 光束不会自动与DOM几何做体积遮挡，不能声称已实现物理体积光。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/LightRays-JS-CSS.json；资料核对时间：2026-10-25T07:53:08.561Z；SHA256：e50a5e77e2f1459711a87b75f6497603e1fa33af5584d92a7951d41a234929b8；哈希对象：registry-response；文件：LightRays.css、LightRays.jsx

---

## 像素爆发背景 · Pixel Blast

案例ID：c39b87bd28208fda

来源：https://reactbits.dev/backgrounds/pixel-blast

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

像素颗粒形成爆发式波动，可配合液体后期形变。

触发：持续像素波动；按配置响应点击与指针

作用层：page-background

### 实现方法

Three.js点状图案着色与后处理组合，指针脉冲改变像素场，可额外启用液体位移后处理。

1. 在React客户端引入锁定registry的PixelBlast.css、PixelBlast.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 由variant、pixelSize和patternDensity建立像素图案，交互写入液体或波动状态，antialias控制边缘处理。
3. 使用源码已提供的variant、pixelSize、color、antialias、patternScale、patternDensity等属性配置；触发依据：持续像素波动；按配置响应点击与指针。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：postprocessing@^6.36.0、three@^0.180.0

参数：

- variant：锁定源码默认：'square'
- pixelSize：锁定源码默认：3
- color：锁定源码默认：'#B497CF'
- antialias：锁定源码默认：true
- patternScale：锁定源码默认：2
- patternDensity：锁定源码默认：1
- liquid：锁定源码默认：false
- liquidStrength：锁定源码默认：0.1
- liquidRadius：锁定源码默认：1
- pixelSizeJitter：锁定源码默认：0
- enableRipples：锁定源码默认：true
- rippleIntensityScale：锁定源码默认：1
- rippleThickness：锁定源码默认：0.1
- rippleSpeed：锁定源码默认：0.3
- liquidWobbleSpeed：锁定源码默认：4.5
- autoPauseOffscreen：锁定源码默认：true
- speed：锁定源码默认：0.5
- transparent：锁定源码默认：true
- edgeFade：锁定源码默认：0.5
- noiseAmount：锁定源码默认：0

### 适用场景

- 数字创意品牌
- 游戏互动背景

避免用于：

- 低性能设备的多层全屏叠加

### 限制与接入建议

- 启用liquid会叠加后处理成本；离散像素视觉不代表真实粒子或事件数据。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低patternDensity并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及patternDensity，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/PixelBlast-JS-CSS.json；资料核对时间：2026-10-25T07:53:08.567Z；SHA256：4387a1adae061690bcc6252a4511d93eeee711508a2ed455ae659d8c03ad7b3d；哈希对象：registry-response；文件：PixelBlast.css、PixelBlast.jsx

---

## 弯曲流动色带 · Color Bends

案例ID：8efc173167387304

来源：https://reactbits.dev/backgrounds/color-bends

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

高饱和色带平滑弯曲与流动，形成层次分明的抽象渐变背景。

触发：页面展示后持续流动

作用层：page-background

### 实现方法

Three.js全屏片元着色器将多色带映射到随噪声弯曲的坐标场，时间与指针共同改变扭曲。

1. 在React客户端引入锁定registry的ColorBends.css、ColorBends.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 把colors传为调色参数，rotation、scale与frequency决定空间结构，warpStrength和mouseInfluence改变曲率。
3. 使用源码已提供的rotation、speed、colors、transparent、autoRotate、scale等属性配置；触发依据：页面展示后持续流动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：three@^0.180.0

参数：

- rotation：锁定源码默认：90
- speed：锁定源码默认：0.2
- colors：锁定源码默认：[]
- transparent：锁定源码默认：true
- autoRotate：锁定源码默认：0
- scale：锁定源码默认：1
- frequency：锁定源码默认：1
- warpStrength：锁定源码默认：1
- mouseInfluence：锁定源码默认：1
- parallax：锁定源码默认：0.5
- noise：锁定源码默认：0.15
- iterations：锁定源码默认：1
- intensity：锁定源码默认：1.5
- bandWidth：锁定源码默认：6

### 适用场景

- 艺术品牌首屏
- 色彩主题活动

避免用于：

- 正文和公式表面

### 限制与接入建议

- 它是抽象背景，不应当作某一科学流场的准确图像，也不能铺进所有输入表面。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ColorBends-JS-CSS.json；资料核对时间：2026-10-25T07:53:08.764Z；SHA256：e562db3364ac1ccff731caf071b093bb28a34911c2b411b5d69303164ac6a5c8；哈希对象：registry-response；文件：ColorBends.css、ColorBends.jsx

---

## 彩色线条波浪 · Line Waves

案例ID：c3183d21c9a5e468

来源：https://reactbits.dev/backgrounds/line-waves

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

线条组成连续波面，在彩色扭曲中动态起伏。

触发：页面展示后持续波动

作用层：page-background

### 实现方法

OGL将内外多组线条叠加成波场，旋转和扭曲坐标让不同颜色的线面连续起伏。

1. 在React客户端引入锁定registry的LineWaves.css、LineWaves.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用innerLineCount、outerLineCount和warpIntensity确定细节，colorCycleSpeed推进色彩，edgeFadeWidth处理边缘。
3. 使用源码已提供的speed、innerLineCount、outerLineCount、warpIntensity、rotation、edgeFadeWidth等属性配置；触发依据：页面展示后持续波动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- speed：锁定源码默认：0.3
- innerLineCount：锁定源码默认：32.0
- outerLineCount：锁定源码默认：36.0
- warpIntensity：锁定源码默认：1.0
- rotation：锁定源码默认：-45
- edgeFadeWidth：锁定源码默认：0.0
- colorCycleSpeed：锁定源码默认：1.0
- brightness：锁定源码默认：0.2
- color1：锁定源码默认：'#ffffff'
- color2：锁定源码默认：'#ffffff'
- color3：锁定源码默认：'#ffffff'
- enableMouseInteraction：锁定源码默认：true
- mouseInfluence：锁定源码默认：2.0
- lightMode：锁定源码默认：false

### 适用场景

- 音乐视觉
- 流线主题创意背景

避免用于：

- 真实波形仪表

### 限制与接入建议

- 线条数量增加GPU计算，图案不包含真实数据单位或采样时间。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低innerLineCount、outerLineCount并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及innerLineCount、outerLineCount，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/LineWaves-JS-CSS.json；资料核对时间：2026-10-25T07:53:08.955Z；SHA256：72a1793e7c0ff2ac6c2ea1b279f64f5f72be65e0e6460768e84dc838aa6c1540；哈希对象：registry-response；文件：LineWaves.css、LineWaves.jsx

---

## 余辉雷达扫描 · Radar

案例ID：508abc3c4c64fa23

来源：https://reactbits.dev/backgrounds/radar

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

雷达扫线绕圆面转动，留下荧光余辉并捕捉运动目标，可呈平面或透视。

触发：页面展示后持续扫描与目标运动

作用层：page-background

### 实现方法

WebGL在圆面或透视平面中绘制刻度、扫描线与衰减余辉，目标点随时间或交互显现。

1. 在React客户端引入锁定registry的Radar.css、Radar.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以ringCount、spokeCount和ticks建立刻度，speed推进扫线，trail控制余辉衰减，mode确定投影。
3. 使用源码已提供的color、backgroundColor、mode、speed、trail、scale等属性配置；触发依据：页面展示后持续扫描与目标运动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- color：锁定源码默认：'#3ef09a'
- backgroundColor：锁定源码默认：'transparent'
- mode：锁定源码默认：'sweep'
- speed：锁定源码默认：1
- trail：锁定源码默认：0.35
- scale：锁定源码默认：0.9
- ringCount：锁定源码默认：6
- spokeCount：锁定源码默认：12
- ticks：锁定源码默认：true
- targets：锁定源码默认：6
- clutter：锁定源码默认：0.35
- glow：锁定源码默认：1
- brightness：锁定源码默认：1
- gridOpacity：锁定源码默认：1
- lineWidth：锁定源码默认：1
- tilt：锁定源码默认：0
- centerX：锁定源码默认：0.5
- centerY：锁定源码默认：0.5
- mouseInteraction：锁定源码默认：true
- intro：锁定源码默认：true
- grain：锁定源码默认：0.03
- fade：锁定源码默认：0
- opacity：锁定源码默认：1
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 探测主题品牌
- 模拟控制台背景

避免用于：

- 实际定位监控

### 限制与接入建议

- 目标和扫描仅是演示装饰，不代表雷达设备或真实对象位置。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低ringCount、spokeCount并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及ringCount、spokeCount，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Radar-JS-CSS.json；资料核对时间：2026-10-25T07:53:09.234Z；SHA256：3dddf17b23b3163bccee9122757f1dc9cb3462e372df323b34b1ee65377e3639；哈希对象：registry-response；文件：Radar.css、Radar.jsx

---

## 柔和极光背景 · Soft Aurora

案例ID：cef8de298c1faecd

来源：https://reactbits.dev/backgrounds/soft-aurora

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

三维噪声与柔和彩色渐变组成缓慢变化的极光幕。

触发：页面展示后持续极光变化

作用层：page-background

### 实现方法

OGL以三维噪声和带状渐变合成柔和极光，分层高度和时间相位形成连续色幕。

1. 在React客户端引入锁定registry的SoftAurora.css、SoftAurora.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用noiseFrequency、noiseAmplitude和bandHeight生成极光形态，bandSpread控制展开，speed更新噪声相位。
3. 使用源码已提供的speed、scale、brightness、color1、color2、noiseFrequency等属性配置；触发依据：页面展示后持续极光变化。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- speed：锁定源码默认：0.6
- scale：锁定源码默认：1.5
- brightness：锁定源码默认：1.0
- color1：锁定源码默认：'#f7f7f7'
- color2：锁定源码默认：'#e100ff'
- noiseFrequency：锁定源码默认：2.5
- noiseAmplitude：锁定源码默认：1.0
- bandHeight：锁定源码默认：0.5
- bandSpread：锁定源码默认：1.0
- octaveDecay：锁定源码默认：0.1
- layerOffset：锁定源码默认：0
- colorSpeed：锁定源码默认：1.0
- enableMouseInteraction：锁定源码默认：true
- mouseInfluence：锁定源码默认：0.25
- lightMode：锁定源码默认：false

### 适用场景

- 自然疗愈主题
- 天文活动氛围

避免用于：

- 真实天文数据呈现

### 限制与接入建议

- 极光是程序图案而非真实天文观测；颜色和亮度不能妨碍重要文字。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/SoftAurora-JS-CSS.json；资料核对时间：2026-10-25T07:53:09.018Z；SHA256：4c25b1d690a27f82a7a9ebde7ac848b0625a9c26401610444121d9ff4c673f57；哈希对象：registry-response；文件：SoftAurora.css、SoftAurora.jsx

---

## 流动极光色幕 · Aurora

案例ID：464ab000e19f001a

来源：https://reactbits.dev/backgrounds/aurora

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

渐变色幕起伏、流动，形成极光般的彩色背景。

触发：页面展示后持续流动

作用层：page-background

### 实现方法

WebGL片元场使用噪声位移形成极光幕边界，在多色调色板之间混合并叠加光辉。

1. 在React客户端引入锁定registry的Aurora.css、Aurora.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 依据colorStops构造渐变，以amplitude、height和scale控制幕形，speed推进相位，blend和glow控制融合。
3. 使用源码已提供的colorStops、amplitude、blend、speed、height、scale等属性配置；触发依据：页面展示后持续流动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- colorStops：锁定源码默认：['#5227FF', '#7cff67', '#5227FF']
- amplitude：锁定源码默认：1
- blend：锁定源码默认：0.5
- speed：锁定源码默认：1
- height：锁定源码默认：0.45
- scale：锁定源码默认：1
- glow：锁定源码默认：0.6
- brightness：锁定源码默认：1
- layers：锁定源码默认：1
- direction：锁定源码默认：'top'
- mouseInteraction：锁定源码默认：true
- intro：锁定源码默认：true
- opacity：锁定源码默认：1
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 创意产品首屏
- 天文主题背景

避免用于：

- 精确图像或数据分析

### 限制与接入建议

- 抽象极光不等于真实极地天空；多个类似渐变背景不宜为凑数量重复叠加。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Aurora-JS-CSS.json；资料核对时间：2026-10-25T07:53:09.119Z；SHA256：9e60b2be9452c0c0c04d747ab6ccde5d2764eba8711873c39fa865dbe48fee72；哈希对象：registry-response；文件：Aurora.css、Aurora.jsx

---

## 暗处缎面光褶 · Plasma

案例ID：9bbc56bb0979e302

来源：https://reactbits.dev/backgrounds/plasma

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

明亮高光穿过暗处的缎面光褶，缓慢扭转并随指针改变方向。

触发：持续光褶动画；鼠标移动

作用层：page-background

### 实现方法

WebGL片元着色器将扭转波面与亮带合成为暗处缎面光褶，指针和时间改变局部方向。

1. 在React客户端引入锁定registry的Plasma.css、Plasma.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用direction、scale和twist决定光褶结构，wave与softness控制曲面，高光由shine和brightness调节。
3. 使用源码已提供的color、speed、direction、scale、twist、wave等属性配置；触发依据：持续光褶动画；鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- color：锁定源码默认：'#a6a3b8'
- speed：锁定源码默认：1
- direction：锁定源码默认：'forward'
- scale：锁定源码默认：1
- twist：锁定源码默认：1
- wave：锁定源码默认：1
- softness：锁定源码默认：0.5
- shine：锁定源码默认：1
- brightness：锁定源码默认：1
- grain：锁定源码默认：0.04
- quality：锁定源码默认：0.75
- mouseInteractive：锁定源码默认：true
- intro：锁定源码默认：true
- fade：锁定源码默认：0
- opacity：锁定源码默认：1
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 高端品牌
- 抽象光影首屏

避免用于：

- 等离子实验测量

### 限制与接入建议

- 这是光褶纹理，不是高温等离子物理仿真；亮部要与正文区域分离。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低quality并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及quality，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Plasma-JS-CSS.json；资料核对时间：2026-10-25T07:53:09.255Z；SHA256：b9e1eea9c53292c4779ae6c7e7a3359b15eb5acbb159267944828f5e6986e875；哈希对象：registry-response；文件：Plasma.css、Plasma.jsx

---

## 交织等离子光带 · Plasma Wave

案例ID：c192c5b4ab1389f2

来源：https://reactbits.dev/backgrounds/plasma-wave

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

两条发光等离子丝带互相卷绕，白热核心周围带柔光，指针可搅动。

触发：持续光带动画；鼠标移动

作用层：page-background

### 实现方法

WebGL中两组独立速度、方向和弯曲的发光带缠绕，亮核与柔光共同构成交织光波。

1. 在React客户端引入锁定registry的PlasmaWave.css、PlasmaWave.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 分别设置speed1、speed2和dir2，bend1、bend2控制两带形变，thickness与focalLength调整空间和边缘。
3. 使用源码已提供的colors、speed、speed1、speed2、dir2、bend1等属性配置；触发依据：持续光带动画；鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- colors：锁定源码默认：['#A855F7', '#06B6D4']
- speed：锁定源码默认：1
- speed1：锁定源码默认：0.05
- speed2：锁定源码默认：0.05
- dir2：锁定源码默认：1
- bend1：锁定源码默认：1
- bend2：锁定源码默认：0.5
- thickness：锁定源码默认：0.3
- focalLength：锁定源码默认：1.25
- rotationDeg：锁定源码默认：0
- xOffset：锁定源码默认：0
- yOffset：锁定源码默认：0
- brightness：锁定源码默认：1
- glow：锁定源码默认：1
- core：锁定源码默认：0.6
- grain：锁定源码默认：0.03
- quality：锁定源码默认：1
- mouseInteraction：锁定源码默认：true
- intro：锁定源码默认：true
- fade：锁定源码默认：0
- opacity：锁定源码默认：1
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 音乐科技活动
- 能量主题封面

避免用于：

- 真实粒子束分析

### 限制与接入建议

- 两个发光带是装饰场，不应描述为真实粒子束轨迹。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低quality并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及quality，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/PlasmaWave-JS-CSS.json；资料核对时间：2026-10-25T07:53:09.478Z；SHA256：f4f7f3c351195ffdef11b5ff81a03f5d5e01e6acea7422e64b2fd75c55f19b59；哈希对象：registry-response；文件：PlasmaWave.css、PlasmaWave.jsx

---

## 漂浮粒子背景 · Particles

案例ID：f9e52b85f5bfc88a

来源：https://reactbits.dev/backgrounds/particles

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

粒子在空间中漂浮，数量、尺寸和运动等参数可定制。

触发：页面展示后持续粒子运动

作用层：page-background

### 实现方法

WebGL批量绘制空间粒子，以随机种子与时间计算位置，指针可给粒子群增加视差或局部运动。

1. 在React客户端引入锁定registry的Particles.css、Particles.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按particleCount与particleSpread初始化点，设置particleBaseSize和随机尺寸，speed推进位移，hover开关控制指针影响。
3. 使用源码已提供的particleCount、particleSpread、speed、particleColors、moveParticlesOnHover、particleHoverFactor等属性配置；触发依据：页面展示后持续粒子运动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- particleCount：锁定源码默认：200
- particleSpread：锁定源码默认：10
- speed：锁定源码默认：0.1
- particleColors：锁定源码默认：['#ffffff']
- moveParticlesOnHover：锁定源码默认：true
- particleHoverFactor：锁定源码默认：1
- alphaParticles：锁定源码默认：false
- particleBaseSize：锁定源码默认：100
- sizeRandomness：锁定源码默认：1
- cameraDistance：锁定源码默认：20
- disableRotation：锁定源码默认：false
- shape：锁定源码默认：'circle'
- glow：锁定源码默认：0.5
- twinkle：锁定源码默认：0.3
- depthOfField：锁定源码默认：0
- connections：锁定源码默认：false
- connectionDistance：锁定源码默认：110
- hoverEffect：锁定源码默认：'parallax'
- hoverRadius：锁定源码默认：140
- clickBurst：锁定源码默认：true
- drift：锁定源码默认：'none'
- driftSpeed：锁定源码默认：1
- variation：锁定源码默认：0
- intro：锁定源码默认：true
- opacity：锁定源码默认：1
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 空间品牌首屏
- 探索型背景

避免用于：

- 真实分子结构教学

### 限制与接入建议

- 粒子不对应真实数据或分子；数量、透明叠加和尺寸会增加填充成本。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低particleCount并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及particleCount，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Particles-JS-CSS.json；资料核对时间：2026-10-25T07:53:09.544Z；SHA256：580a03c3cb3fdd30bde8e0112709b4f51345c378da7e9121679c768c6b61c8fc；哈希对象：registry-response；文件：Particles.css、Particles.jsx

---

## 渐变百叶光带 · Gradient Blinds

案例ID：ed618ca34f223c93

来源：https://reactbits.dev/backgrounds/gradient-blinds

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

渐变分层成百叶状条带，聚光与噪声形变让表面呈现动态光感。

触发：持续渐变；鼠标位置控制聚光

作用层：page-background

### 实现方法

OGL把渐变切成百叶条带，噪声形变与鼠标聚光共同控制条带明暗及表面折弯。

1. 在React客户端引入锁定registry的GradientBlinds.css、GradientBlinds.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 依据blindCount、blindMinWidth和angle分割条带，mirrorGradient处理颜色镜像，spotlightRadius与mouseDampening驱动局部光。
3. 使用源码已提供的paused、angle、noise、blindCount、blindMinWidth、mouseDampening等属性配置；触发依据：持续渐变；鼠标位置控制聚光。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- paused：锁定源码默认：false
- angle：锁定源码默认：0
- noise：锁定源码默认：0.3
- blindCount：锁定源码默认：16
- blindMinWidth：锁定源码默认：60
- mouseDampening：锁定源码默认：0.15
- mirrorGradient：锁定源码默认：false
- spotlightRadius：锁定源码默认：0.5
- spotlightSoftness：锁定源码默认：1
- spotlightOpacity：锁定源码默认：1
- distortAmount：锁定源码默认：0
- shineDirection：锁定源码默认：'left'
- mixBlendMode：锁定源码默认：'lighten'
- lightMode：锁定源码默认：false

### 适用场景

- 设计工具首屏
- 光影主题品牌

避免用于：

- 正文卡片的唯一阅读表面

### 限制与接入建议

- 百叶是背景材质，不能把聚光误当成沿按钮边缘移动的光束。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低blindCount并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及blindCount，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/GradientBlinds-JS-CSS.json；资料核对时间：2026-10-25T07:53:09.640Z；SHA256：a4099793ac91554593ccf1c5c04cf9c7b54179c3c16b8a37b411733897b1ec6f；哈希对象：registry-response；文件：GradientBlinds.css、GradientBlinds.jsx

---

## 颗粒流动渐变 · Grainient

案例ID：bececab1c32bb05e

来源：https://reactbits.dev/backgrounds/grainient

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

带细颗粒的渐变漩涡随柔和波动扭曲，形成有印刷质感的色面。

触发：页面展示后持续色面运动

作用层：page-background

### 实现方法

OGL着色器在流动渐变色团中加入坐标扭曲、旋转和细颗粒，形成有印刷质感的动态色面。

1. 在React客户端引入锁定registry的Grainient.css、Grainient.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以timeSpeed更新相位，warpStrength与warpFrequency决定弯曲，blendAngle和blendSoftness调整颜色过渡。
3. 使用源码已提供的timeSpeed、colorBalance、warpStrength、warpFrequency、warpSpeed、warpAmplitude等属性配置；触发依据：页面展示后持续色面运动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- timeSpeed：锁定源码默认：0.25
- colorBalance：锁定源码默认：0.0
- warpStrength：锁定源码默认：1.0
- warpFrequency：锁定源码默认：5.0
- warpSpeed：锁定源码默认：2.0
- warpAmplitude：锁定源码默认：50.0
- blendAngle：锁定源码默认：0.0
- blendSoftness：锁定源码默认：0.05
- rotationAmount：锁定源码默认：500.0
- noiseScale：锁定源码默认：2.0
- grainAmount：锁定源码默认：0.1
- grainScale：锁定源码默认：2.0
- grainAnimated：锁定源码默认：false
- contrast：锁定源码默认：1.5
- gamma：锁定源码默认：1.0
- saturation：锁定源码默认：1.0
- centerX：锁定源码默认：0.0
- centerY：锁定源码默认：0.0
- zoom：锁定源码默认：0.9
- color1：锁定源码默认：'#FF9FFC'
- color2：锁定源码默认：'#5227FF'
- color3：锁定源码默认：'#B497CF'
- lightMode：锁定源码默认：false

### 适用场景

- 创意编辑品牌
- 文化活动视觉

避免用于：

- 数据图表和长文背景

### 限制与接入建议

- 颗粒会损失细字和图表对比，渐变色面应放在内容背景而非文字层。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Grainient-JS-CSS.json；资料核对时间：2026-10-25T07:53:09.754Z；SHA256：0176f19d2717f21bd6b67995237e5a4c0cb987a2db3aec8ef02ff5cceebb67d6；哈希对象：registry-response；文件：Grainient.css、Grainient.jsx

---

## 三维网格扫描室 · Grid Scan

案例ID：49f5a8dc7f011753

来源：https://reactbits.dev/backgrounds/grid-scan

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

网格构成三维房间，扫描光带移动经过格线，产生纵深空间感。

触发：页面展示后持续扫描

作用层：page-background

### 实现方法

Three.js透视网格和扫描后处理构成空间房间，可选摄像头人脸定位分支用于视角响应。

1. 在React客户端引入锁定registry的GridScan.css、GridScan.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 先以linesColor、gridScale与lineThickness建立网格，scanColor和scanOpacity控制扫描；只有明确启用enableWebcam才进入摄像头模型流程。
3. 使用源码已提供的enableWebcam、showPreview、modelsPath、sensitivity、lineThickness、linesColor等属性配置；触发依据：页面展示后持续扫描。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：face-api.js@^0.22.2、postprocessing@^6.36.0、three@^0.180.0

参数：

- enableWebcam：锁定源码默认：false
- showPreview：锁定源码默认：false
- modelsPath：锁定源码默认：'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights'
- sensitivity：锁定源码默认：0.55
- lineThickness：锁定源码默认：1
- linesColor：锁定源码默认：'#2F293A'
- scanColor：锁定源码默认：'#FF9FFC'
- scanOpacity：锁定源码默认：0.4
- gridScale：锁定源码默认：0.1
- lineStyle：锁定源码默认：'solid'
- lineJitter：锁定源码默认：0.1
- scanDirection：锁定源码默认：'pingpong'
- enablePost：锁定源码默认：true
- bloomIntensity：锁定源码默认：0
- bloomThreshold：锁定源码默认：0
- bloomSmoothing：锁定源码默认：0
- chromaticAberration：锁定源码默认：0.002
- noiseIntensity：锁定源码默认：0.01
- scanGlow：锁定源码默认：0.5
- scanSoftness：锁定源码默认：2
- scanPhaseTaper：锁定源码默认：0.9
- scanDuration：锁定源码默认：2.0
- scanDelay：锁定源码默认：2.0
- enableGyro：锁定源码默认：false
- scanOnClick：锁定源码默认：false
- snapBackDelay：锁定源码默认：250
- lightMode：锁定源码默认：false

### 适用场景

- 科幻控制台氛围
- 空间科技入口

避免用于：

- 暗中启动摄像头的普通页面

### 限制与接入建议

- 摄像头与face-api模型需额外权限、资源和隐私说明；默认装饰扫描不代表真实识别结果。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。
- 真实摄像头或麦克风分支必须单独授权并清理媒体轨道；默认演示不代表已获取用户媒体或已接入识别服务。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/GridScan-JS-CSS.json；资料核对时间：2026-10-25T07:53:09.813Z；SHA256：0e032e21532a0fd6330cf8fa232d1e4d8dc338511f651aa322343d1b19c68906；哈希对象：registry-response；文件：GridScan.css、GridScan.jsx

---

## 交错发光条带 · Beams

案例ID：23f7b395fdbca769

来源：https://reactbits.dev/backgrounds/beams

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

发光条带交错穿过画面，光照与材质细节形成立体动态背景。

触发：页面展示后持续条带运动

作用层：page-background

### 实现方法

WebGL按空间方向绘制交错条带，通过波形、材质明暗和深度渐变形成有厚度的发光梁。

1. 在React客户端引入锁定registry的Beams.css、Beams.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用beamWidth与rotation建立条带方向，waveLength和twist改变波形，depth、sharpness与fillLight控制立体感。
3. 使用源码已提供的color、beamWidth、rotation、speed、waveLength、depth等属性配置；触发依据：页面展示后持续条带运动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- color：锁定源码默认：'#ffffff'
- beamWidth：锁定源码默认：140
- rotation：锁定源码默认：30
- speed：锁定源码默认：1
- waveLength：锁定源码默认：233
- depth：锁定源码默认：1
- sharpness：锁定源码默认：0.6
- twist：锁定源码默认：0
- fillLight：锁定源码默认：0.3
- glow：锁定源码默认：0.6
- brightness：锁定源码默认：1.6
- variation：锁定源码默认：0
- grain：锁定源码默认：0.35
- quality：锁定源码默认：0.75
- mouseInteraction：锁定源码默认：true
- mouseStrength：锁定源码默认：1
- intro：锁定源码默认：true
- fade：锁定源码默认：0
- opacity：锁定源码默认：1
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 发布会品牌首屏
- 音乐舞台背景

避免用于：

- 工程照明计算

### 限制与接入建议

- 条带并非真实场景光源，不会自动照亮其他DOM元素。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低quality并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及quality，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Beams-JS-CSS.json；资料核对时间：2026-10-25T07:53:10.189Z；SHA256：b1d5e46f10d9aa9e356c550d0b18de4239482ba105b0c5b1d66829859700c40d；哈希对象：registry-response；文件：Beams.css、Beams.jsx

---

## 像素雪花背景 · Pixel Snow

案例ID：51b783e9ea251dbd

来源：https://reactbits.dev/backgrounds/pixel-snow

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多层像素雪花带柔光飘落，风影响方向，指针可拨开附近雪花。

触发：持续飘雪；鼠标移动

作用层：page-background

### 实现方法

WebGL以不同深度和相位生成像素雪粒，风与摇摆改变下落路径，指针扰动附近粒子。

1. 在React客户端引入锁定registry的PixelSnow.css、PixelSnow.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按density、flakeSize和pixelSize建立雪层，speed、wind与sway推进运动，depth控制远近尺寸。
3. 使用源码已提供的color、variant、density、speed、wind、sway等属性配置；触发依据：持续飘雪；鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- color：锁定源码默认：'#ffffff'
- variant：锁定源码默认：'snowflake'
- density：锁定源码默认：0.5
- speed：锁定源码默认：1
- wind：锁定源码默认：0.25
- sway：锁定源码默认：0.5
- flakeSize：锁定源码默认：1
- pixelSize：锁定源码默认：3
- depth：锁定源码默认：0.6
- brightness：锁定源码默认：1
- glow：锁定源码默认：0.8
- twinkle：锁定源码默认：0.35
- accumulate：锁定源码默认：false
- mouseInteraction：锁定源码默认：true
- intro：锁定源码默认：true
- fade：锁定源码默认：0
- opacity：锁定源码默认：1
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 冬季活动页面
- 节庆展示

避免用于：

- 真实气象监测

### 限制与接入建议

- 装饰降雪不是天气数据，密度与光晕过高会影响阅读和GPU填充。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低density并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及density，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/PixelSnow-JS-CSS.json；资料核对时间：2026-10-25T07:53:10.114Z；SHA256：b2e9bd4b6dc5283cfb2f5ca86e912ab2ef9ddd8c502e91eda81ff53e87aa4fb3；哈希对象：registry-response；文件：PixelSnow.css、PixelSnow.jsx

---

## 分叉闪电背景 · Lightning

案例ID：904f278b52d12a31

来源：https://reactbits.dev/backgrounds/lightning

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

程序生成的闪电分支带辉光闪烁，呈现电流突然出现的效果。

触发：页面展示后持续闪电动画

作用层：page-background

### 实现方法

WebGL程序噪声与分支路径生成短时闪电，亮核和辉光按时间闪现并可响应指针。

1. 在React客户端引入锁定registry的Lightning.css、Lightning.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以bolts、branches和spread分配分叉结构，用thickness、glow和色彩设置发光，时间函数控制出现。
3. 使用源码已提供的color、bolts、spread、branches、xOffset、angle等属性配置；触发依据：页面展示后持续闪电动画。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- color：锁定源码默认：'#4d6bff'
- bolts：锁定源码默认：1
- spread：锁定源码默认：0.6
- branches：锁定源码默认：0.5
- xOffset：锁定源码默认：0
- angle：锁定源码默认：0
- size：锁定源码默认：1
- thickness：锁定源码默认：1
- glow：锁定源码默认：1
- intensity：锁定源码默认：1
- speed：锁定源码默认：1
- flicker：锁定源码默认：0.6
- mouseInteraction：锁定源码默认：true
- mouseStrength：锁定源码默认：1
- clickStrike：锁定源码默认：true
- intro：锁定源码默认：true
- fade：锁定源码默认：0
- opacity：锁定源码默认：1
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 游戏宣传
- 能量主题短时开场

避免用于：

- 学习正文背景

### 限制与接入建议

- 闪电含强明暗变化，不适合长时间阅读背景，也不是电力分析结果。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Lightning-JS-CSS.json；资料核对时间：2026-10-25T07:53:10.438Z；SHA256：d2fc98ace24bbb657a76fb8b47a0a159a9183de2122725d208afcfdb05f70a7c；哈希对象：registry-response；文件：Lightning.css、Lightning.jsx

---

## 棱彩射线爆发 · Prismatic Burst

案例ID：7f1ca4f3bc37da46

来源：https://reactbits.dev/backgrounds/prismatic-burst

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

彩色光线从中心向外爆发，数量、颜色与扭曲可调整。

触发：页面展示后持续光线动画

作用层：page-background

### 实现方法

WebGL在中心径向坐标中合成多条棱彩射线，扭曲、缩放和时间流动形成向外爆发。

1. 在React客户端引入锁定registry的PrismaticBurst.css、PrismaticBurst.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 设置rayCount与rayWidth生成光线，distort、twist和zoom调整径向坐标，animationType决定时间运动。
3. 使用源码已提供的intensity、speed、animationType、distort、rayCount、rayWidth等属性配置；触发依据：页面展示后持续光线动画。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- intensity：锁定源码默认：2
- speed：锁定源码默认：0.5
- animationType：锁定源码默认：'rotate3d'
- distort：锁定源码默认：0
- rayCount：锁定源码默认：0
- rayWidth：锁定源码默认：1
- zoom：锁定源码默认：1
- twist：锁定源码默认：0
- flow：锁定源码默认：0
- centerFade：锁定源码默认：1
- grain：锁定源码默认：0.8
- glow：锁定源码默认：0
- mouseInteraction：锁定源码默认：true
- mouseStrength：锁定源码默认：0.5
- hoverDampness：锁定源码默认：0.25
- clickBurst：锁定源码默认：true
- intro：锁定源码默认：true
- fade：锁定源码默认：0
- quality：锁定源码默认：'high'
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 活动发布瞬间
- 数字艺术主图

避免用于：

- 定量光谱分析

### 限制与接入建议

- 爆发视觉不代表真实光谱或辐射数据；避免持续高强度覆盖正文。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低rayCount、quality并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及rayCount、quality，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/PrismaticBurst-JS-CSS.json；资料核对时间：2026-10-25T07:53:10.277Z；SHA256：508802fbec9ea59c7e8acfac911a33919f7f26a93e005eeac29ab4323ae6bb20；哈希对象：registry-response；文件：PrismaticBurst.css、PrismaticBurst.jsx

---

## 视差星河背景 · Galaxy

案例ID：1f9fac0087195dfe

来源：https://reactbits.dev/backgrounds/galaxy

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

星点组成有纵深的星河，随指针产生视差移动。

触发：持续星点动画；鼠标移动

作用层：page-background

### 实现方法

WebGL将星点分布到多层深度场，时间旋转和指针视差改变星群位置及亮度。

1. 在React客户端引入锁定registry的Galaxy.css、Galaxy.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用density与glowIntensity控制星点，focal和rotation定义视角，starSpeed与speed推进运动，mouseInteraction决定视差。
3. 使用源码已提供的focal、rotation、starSpeed、density、hueShift、disableAnimation等属性配置；触发依据：持续星点动画；鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- focal：锁定源码默认：[0.5, 0.5]
- rotation：锁定源码默认：[1.0, 0.0]
- starSpeed：锁定源码默认：0.5
- density：锁定源码默认：1
- hueShift：锁定源码默认：140
- disableAnimation：锁定源码默认：false
- speed：锁定源码默认：1.0
- mouseInteraction：锁定源码默认：true
- glowIntensity：锁定源码默认：0.3
- saturation：锁定源码默认：0.0
- mouseRepulsion：锁定源码默认：true
- repulsionStrength：锁定源码默认：2
- twinkleIntensity：锁定源码默认：0.3
- rotationSpeed：锁定源码默认：0.1
- autoCenterRepulsion：锁定源码默认：0
- transparent：锁定源码默认：true
- lightMode：锁定源码默认：false
- starSize：锁定源码默认：1
- flareIntensity：锁定源码默认：1
- layers：锁定源码默认：4
- direction：锁定源码默认：'forward'
- clickWarp：锁定源码默认：true
- intro：锁定源码默认：true
- opacity：锁定源码默认：1

### 适用场景

- 天文兴趣入口
- 科幻内容首屏

避免用于：

- 真实星图导航

### 限制与接入建议

- 星空为程序装饰，不包含真实星表坐标；闪烁和快速旋转需可停。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低density并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的disableAnimation控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及density，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Galaxy-JS-CSS.json；资料核对时间：2026-10-25T07:53:10.351Z；SHA256：36c0951a2e96a303a092ca35cf31c5ac97e608380040d69f0d851849a4255731；哈希对象：registry-response；文件：Galaxy.css、Galaxy.jsx

---

## 复古抖色纹理 · Dither

案例ID：679505985f285534

来源：https://reactbits.dev/backgrounds/dither

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

噪声与波动转为离散像素抖色，形成老式印刷或低色数画面的质感。

触发：页面展示后持续噪声动画

作用层：page-background

### 实现方法

WebGL把连续波动噪声场按有限色数和像素格离散化，输出复古抖色或点阵纹理。

1. 在React客户端引入锁定registry的Dither.css、Dither.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用waveFrequency、waveAmplitude和waveSpeed生成场，以colorNum和pixelSize量化颜色与空间，按鼠标开关调整扰动。
3. 使用源码已提供的waveSpeed、waveFrequency、waveAmplitude、waveColor、backgroundColor、colorNum等属性配置；触发依据：页面展示后持续噪声动画。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- waveSpeed：锁定源码默认：0.05
- waveFrequency：锁定源码默认：3
- waveAmplitude：锁定源码默认：0.3
- waveColor：锁定源码默认：[0.5, 0.5, 0.5]
- backgroundColor：锁定源码默认：[0, 0, 0]
- colorNum：锁定源码默认：4
- pixelSize：锁定源码默认：2
- disableAnimation：锁定源码默认：false
- enableMouseInteraction：锁定源码默认：true
- mouseRadius：锁定源码默认：1
- ditherMode：锁定源码默认：'bayer'
- scale：锁定源码默认：1
- contrast：锁定源码默认：1
- brightness：锁定源码默认：0
- mouseEffect：锁定源码默认：'erase'
- mouseStrength：锁定源码默认：1
- trail：锁定源码默认：0.5
- clickRipple：锁定源码默认：true
- intro：锁定源码默认：true

### 适用场景

- 复古数码品牌
- 像素艺术背景

避免用于：

- 保真图像查看

### 限制与接入建议

- 低色数是视觉风格，不用于要求保真颜色的图像或数据内容。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的disableAnimation控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Dither-JS-CSS.json；资料核对时间：2026-10-25T07:53:10.678Z；SHA256：5a5b015c82e56d041c6fafd8f197ae5d33518c065fa4ef0b6906c591c830d174；哈希对象：registry-response；文件：Dither.css、Dither.jsx

---

## 故障终端格纹 · Faulty Terminal

案例ID：7f70e6e524e90b1c

来源：https://reactbits.dev/backgrounds/faulty-terminal

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

方格、扫描线、闪烁和噪声组成类似故障 CRT 终端的动态背景。

触发：页面展示后持续闪烁与噪声

作用层：page-background

### 实现方法

OGL片元场组合格纹、数字噪声、扫描线和故障闪变，指针可扰动局部终端图案。

1. 在React客户端引入锁定registry的FaultyTerminal.css、FaultyTerminal.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 配置gridMul和digitSize确定纹理密度，scanlineIntensity、glitchAmount、flickerAmount与noiseAmp调整故障层。
3. 使用源码已提供的scale、gridMul、digitSize、timeScale、pause、scanlineIntensity等属性配置；触发依据：页面展示后持续闪烁与噪声。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- scale：锁定源码默认：1
- gridMul：锁定源码默认：[2, 1]
- digitSize：锁定源码默认：1.5
- timeScale：锁定源码默认：0.3
- pause：锁定源码默认：false
- scanlineIntensity：锁定源码默认：0.3
- glitchAmount：锁定源码默认：1
- flickerAmount：锁定源码默认：1
- noiseAmp：锁定源码默认：1
- chromaticAberration：锁定源码默认：0
- dither：锁定源码默认：0
- curvature：锁定源码默认：0.2
- tint：锁定源码默认：'#ffffff'
- mouseReact：锁定源码默认：true
- mouseStrength：锁定源码默认：0.2
- pageLoadAnimation：锁定源码默认：true
- brightness：锁定源码默认：1
- lightMode：锁定源码默认：false

### 适用场景

- 复古科技封面
- 游戏活动背景

避免用于：

- 真实操作日志界面

### 限制与接入建议

- 图案不是真实终端输出或任务日志；高闪烁不应覆盖学习和办公内容。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的pause控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/FaultyTerminal-JS-CSS.json；资料核对时间：2026-10-25T07:53:10.715Z；SHA256：97076c4ff9427b5a2945b63c9cb2b8173785f0dc5568ac4029c1a0afa9048eaf；哈希对象：registry-response；文件：FaultyTerminal.css、FaultyTerminal.jsx

---

## 涟漪网格背景 · Ripple Grid

案例ID：1e2cba52b91836a8

来源：https://reactbits.dev/backgrounds/ripple-grid

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

规则网格随连续涟漪起伏，线条的形变呈现波纹向外传播。

触发：页面展示后持续涟漪动画

作用层：page-background

### 实现方法

WebGL规则网格以径向波纹场改变位置或亮度，自动脉冲和点击扰动可独立配置。

1. 在React客户端引入锁定registry的RippleGrid.css、RippleGrid.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按cellSize与lineWidth建立格子，以rippleStrength、rippleSpeed和rippleSize推进波纹，autoRipple控制无人操作时的变化。
3. 使用源码已提供的color、variant、cellSize、lineWidth、glow、rippleStrength等属性配置；触发依据：页面展示后持续涟漪动画。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- color：锁定源码默认：'#ffffff'
- variant：锁定源码默认：'lines'
- cellSize：锁定源码默认：48
- lineWidth：锁定源码默认：1
- glow：锁定源码默认：0.6
- rippleStrength：锁定源码默认：1
- rippleSpeed：锁定源码默认：1
- rippleSize：锁定源码默认：1
- autoRipple：锁定源码默认：'center'
- rippleInterval：锁定源码默认：2.6
- tilt：锁定源码默认：0
- rotation：锁定源码默认：0
- mouseInteraction：锁定源码默认：true
- clickRipple：锁定源码默认：true
- intro：锁定源码默认：true
- fade：锁定源码默认：0.5
- opacity：锁定源码默认：1
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 科学主题氛围
- 工具首页背景

避免用于：

- 数据表格

### 限制与接入建议

- 网格波纹是装饰，不提供真实数据坐标和交互单元选择。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/RippleGrid-JS-CSS.json；资料核对时间：2026-10-25T07:53:10.731Z；SHA256：de6f59cae7baa908fcd8c1464775033b482c267f3c87be9ae7fcf690c7e063b5；哈希对象：registry-response；文件：RippleGrid.css、RippleGrid.jsx

---

## 互动凸起点阵 · Dot Field

案例ID：dd8f826257e9fe77

来源：https://reactbits.dev/backgrounds/dot-field

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

点阵在指针附近凸起、发光或闪烁，并可形成波浪反馈。

触发：鼠标移动；按配置产生波动

作用层：page-background

### 实现方法

Canvas点阵用指针径向力、凸起场和波形更新每个点的位置与亮度，局部高光表现空间感。

1. 在React客户端引入锁定registry的DotField.css、DotField.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以dotRadius与dotSpacing生成点，cursorRadius和cursorForce控制影响，bulgeStrength与waveAmplitude叠加凸起波动。
3. 使用源码已提供的dotRadius、dotSpacing、cursorRadius、cursorForce、bulgeOnly、bulgeStrength等属性配置；触发依据：鼠标移动；按配置产生波动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- dotRadius：锁定源码默认：1.5
- dotSpacing：锁定源码默认：14
- cursorRadius：锁定源码默认：500
- cursorForce：锁定源码默认：0.1
- bulgeOnly：锁定源码默认：true
- bulgeStrength：锁定源码默认：67
- glowRadius：锁定源码默认：160
- sparkle：锁定源码默认：false
- waveAmplitude：锁定源码默认：0
- gradientFrom：锁定源码默认：'rgba(168, 85, 247, 0.35)'
- gradientTo：锁定源码默认：'rgba(180, 151, 207, 0.25)'
- glowColor：锁定源码默认：'#120F17'

### 适用场景

- 互动工具入口
- 立体设计背景

避免用于：

- 精确统计散点图

### 限制与接入建议

- 点阵是装饰网面，不能用点位变化暗示真实统计数据。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/DotField-JS-CSS.json；资料核对时间：2026-10-25T07:53:10.861Z；SHA256：af87b311f19f1a11da34e090a46ac9d185243ef378c3fd06f44512d02caf2d11；哈希对象：registry-response；文件：DotField.css、DotField.jsx

---

## 鼠标拨开丝线 · Threads

案例ID：09b8e5c8fc798712

来源：https://reactbits.dev/backgrounds/threads

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

流动细线可呈丝绸或等高线质感，指针靠近时线条散开、让出空间。

触发：持续线丝运动；鼠标移动

作用层：page-background

### 实现方法

WebGL曲线距离场绘制多组流动细线，指针位置使局部线束偏移或让出空间，形成连续的波形轮廓。

1. 在React客户端引入锁定registry的Threads.css、Threads.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 由lineCount、thickness与distance确定线密度，amplitude和waves定义波形，enableMouseInteraction决定局部扰动。
3. 使用源码已提供的color、amplitude、distance、enableMouseInteraction、lineCount、thickness等属性配置；触发依据：持续线丝运动；鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- color：锁定源码默认：[1, 1, 1]
- amplitude：锁定源码默认：1.7
- distance：锁定源码默认：0.4
- enableMouseInteraction：锁定源码默认：false
- lineCount：锁定源码默认：90
- thickness：锁定源码默认：0.6
- softness：锁定源码默认：1.3
- speed：锁定源码默认：0.6
- waves：锁定源码默认：1.05
- split：锁定源码默认：0.04
- fray：锁定源码默认：0.5
- angle：锁定源码默认：25
- seed：锁定源码默认：0
- parting：锁定源码默认：0
- taper：锁定源码默认：0.85
- brightness：锁定源码默认：1.4
- fade：锁定源码默认：0
- opacity：锁定源码默认：1
- paused：锁定源码默认：false

### 适用场景

- 研究品牌首屏
- 轻量创意背景

避免用于：

- 业务流程编辑器

### 限制与接入建议

- 不是逐根DOM线或真实流程连接，不能将装饰线束当作可编辑关系图。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低lineCount并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及lineCount，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Threads-JS-CSS.json；资料核对时间：2026-10-25T07:53:10.894Z；SHA256：2da53215da07fe85e99061432ecb770f1090291f89c9d21108a34d0566ca043b；哈希对象：registry-response；文件：Threads.css、Threads.jsx

---

## 高速公路光轨 · Hyperspeed

案例ID：7a14abb3494424ce

来源：https://reactbits.dev/backgrounds/hyperspeed

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

发光车道与车辆尾迹沿弯曲道路前进，按住时进入高速穿梭状态。

触发：持续光轨；按住鼠标或触摸加速

作用层：page-background

### 实现方法

Three.js道路几何、车灯实例与光轨着色共同构成高速穿梭场景，按住交互改变速度与视场。

1. 在React客户端引入锁定registry的Hyperspeed.css、Hyperspeed.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按lanes、roadWidth和curve构建道路与车灯流，speed推进轨迹，boost与boostFov在交互时改变运动和摄像机。
3. 使用源码已提供的curve、curvature、speed、boost、fov、boostFov等属性配置；触发依据：持续光轨；按住鼠标或触摸加速。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：three@^0.180.0

参数：

- curve：锁定源码默认：'winding'
- curvature：锁定源码默认：1
- speed：锁定源码默认：1
- boost：锁定源码默认：3
- fov：锁定源码默认：90
- boostFov：锁定源码默认：130
- lanes：锁定源码默认：3
- roadWidth：锁定源码默认：10
- medianWidth：锁定源码默认：2
- density：锁定源码默认：40
- trailLength：锁定源码默认：1
- lightSize：锁定源码默认：1
- poles：锁定源码默认：20
- poleHeight：锁定源码默认：1
- dust：锁定源码默认：100
- glow：锁定源码默认：0.6
- reflections：锁定源码默认：0.5
- steer：锁定源码默认：0.35
- roadOpacity：锁定源码默认：0.1
- theme：锁定源码默认：'dark'
- interactive：锁定源码默认：true
- boosting：锁定源码默认：false

### 适用场景

- 赛车活动
- 速度主题发布页

避免用于：

- 长时间学习阅读

### 限制与接入建议

- 高速透视运动可能引起不适，必须能暂停；道路不是真实地图或交通模拟。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低density并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及density，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Hyperspeed-JS-CSS.json；资料核对时间：2026-10-25T07:53:11.238Z；SHA256：6b8e7d5b4b9e0ce5c4ea391df1e0a1b8a44d3db0147dfdcee4c2daa4028c7e86；哈希对象：registry-response；文件：Hyperspeed.css、Hyperspeed.jsx

---

## 虹彩液态表面 · Iridescence

案例ID：17fa4426bd6915c5

来源：https://reactbits.dev/backgrounds/iridescence

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

表面褶皱不断折射虹彩，鼠标移动可搅动流动纹理。

触发：持续纹理变化；鼠标移动

作用层：page-background

### 实现方法

WebGL片元场按动态波纹法线和颜色相位合成虹彩褶皱，指针扰动改变局部流动。

1. 在React客户端引入锁定registry的Iridescence.css、Iridescence.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 设置scale、detail与amplitude构造起伏场，speed和rotation推进相位，mouseReact决定交互混入。
3. 使用源码已提供的color、speed、amplitude、mouseReact、scale、detail等属性配置；触发依据：持续纹理变化；鼠标移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- color：锁定源码默认：[1, 1, 1]
- speed：锁定源码默认：1
- amplitude：锁定源码默认：0.1
- mouseReact：锁定源码默认：true
- scale：锁定源码默认：1
- detail：锁定源码默认：8
- rotation：锁定源码默认：0
- warp：锁定源码默认：1
- hueShift：锁定源码默认：0
- saturation：锁定源码默认：1
- brightness：锁定源码默认：1.5
- contrast：锁定源码默认：1
- stir：锁定源码默认：0.5
- sheen：锁定源码默认：0.3
- clickSwirl：锁定源码默认：true
- grain：锁定源码默认：0
- fade：锁定源码默认：0
- opacity：锁定源码默认：1
- resolution：锁定源码默认：1
- paused：锁定源码默认：false

### 适用场景

- 美妆或材料品牌
- 艺术作品首屏

避免用于：

- 颜色校准工具

### 限制与接入建议

- 虹彩是程序着色，不代表真实薄膜干涉参数；避免影响内容色彩判断。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低resolution并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及resolution，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Iridescence-JS-CSS.json；资料核对时间：2026-10-25T07:53:11.433Z；SHA256：09b1c49d2bf4c70bd5c73950ac2230af79d804708c8f0ece53e113766fb69cf6；哈希对象：registry-response；文件：Iridescence.css、Iridescence.jsx

---

## 分层曲线波浪 · Waves

案例ID：81a15c8383335520

来源：https://reactbits.dev/backgrounds/waves

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

分层线条持续组成平滑波浪，并可随指针产生扰动。

触发：持续波浪；按配置响应鼠标

作用层：page-background

### 实现方法

WebGL以多层线条和波函数构建曲面网格，指针施加局部扰动，背景颜色与线条可独立设置。

1. 在React客户端引入锁定registry的Waves.css、Waves.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 使用spacing、lineWidth与rotation组织线场，amplitude、scale和twist控制波形，指针位置进入局部uniform。
3. 使用源码已提供的lineColor、backgroundColor、lineStyle、spacing、lineWidth、rotation等属性配置；触发依据：持续波浪；按配置响应鼠标。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- lineColor：锁定源码默认：'#ffffff'
- backgroundColor：锁定源码默认：'transparent'
- lineStyle：锁定源码默认：'solid'
- spacing：锁定源码默认：10
- lineWidth：锁定源码默认：1
- rotation：锁定源码默认：0
- amplitude：锁定源码默认：32
- scale：锁定源码默认：1
- twist：锁定源码默认：1
- speed：锁定源码默认：1
- variation：锁定源码默认：0
- mouseInteraction：锁定源码默认：true
- mouseRadius：锁定源码默认：175
- mouseStrength：锁定源码默认：1
- bounce：锁定源码默认：0.5
- returnDuration：锁定源码默认：1.4
- clickRipple：锁定源码默认：true
- intro：锁定源码默认：true
- fade：锁定源码默认：0
- opacity：锁定源码默认：1
- lightMode：锁定源码默认：false
- paused：锁定源码默认：false

### 适用场景

- 自然主题品牌
- 创意工具首页

避免用于：

- 真实测量波形图

### 限制与接入建议

- 线波是装饰，不应给每条线赋予未经提供的数据含义。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Waves-JS-CSS.json；资料核对时间：2026-10-25T07:53:11.275Z；SHA256：263fa1578469aed0508b76fb212f821193c0ed25500977874f0d7ffbf1f3fb7d；哈希对象：registry-response；文件：Waves.css、Waves.jsx

---

## 鼠标扭曲图片网格 · Grid Distortion

案例ID：68d80b3867d6cb9f

来源：https://reactbits.dev/backgrounds/grid-distortion

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

图片在鼠标附近分成位移格块，离开后格块回到原位。

触发：鼠标在图片区域移动

作用层：page-background

### 实现方法

WebGL通过位移网格纹理扭曲源图，指针激励附近网格单元，松开后按relaxation衰减恢复。

1. 在React客户端引入锁定registry的GridDistortion.css、GridDistortion.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 加载图片并按grid初始化位移场，以radius和strength写入力，mode、softness与chroma调节重采样合成。
3. 使用源码已提供的grid、radius、strength、relaxation、mode、softness等属性配置；触发依据：鼠标在图片区域移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- grid：锁定源码默认：15
- radius：锁定源码默认：0.18
- strength：锁定源码默认：0.15
- relaxation：锁定源码默认：0.96
- mode：锁定源码默认：'drag'
- softness：锁定源码默认：0
- chroma：锁定源码默认：0
- idle：锁定源码默认：0.3
- clickRipple：锁定源码默认：true
- intro：锁定源码默认：true

### 适用场景

- 摄影互动封面
- 艺术项目卡

避免用于：

- 文档与证件阅读

### 限制与接入建议

- 图像只在显示上扭曲，不修改原文件；文字截图与图表不适合强位移。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/GridDistortion-JS-CSS.json；资料核对时间：2026-10-25T07:53:11.377Z；SHA256：e04d734af5da8eb1168ad70dfb2ce26edad1345189fc10dc9c7ee3857aa3eaf2；哈希对象：registry-response；文件：GridDistortion.css、GridDistortion.jsx

---

## 彩色弹跳球池 · Ballpit

案例ID：4c946fb9557624f8

来源：https://reactbits.dev/backgrounds/ballpit

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

多枚彩色三维球体以物理方式碰撞、弹跳，形成可以互动的球池。

触发：持续物理模拟；按配置指针推动

作用层：page-background

### 实现方法

Three.js批量球体按简化物理碰撞与边界约束更新位置，鼠标跟随体参与碰撞形成互动球池。

1. 在React客户端引入锁定registry的Ballpit/Ballpit.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 初始化球体尺寸和位置，按每帧步长求解碰撞与回弹，followCursor决定指针是否推动球群，再更新实例矩阵。
3. 使用源码已提供的followCursor等属性配置；触发依据：持续物理模拟；按配置指针推动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：three@^0.180.0

参数：

- followCursor：锁定源码默认：true

### 适用场景

- 趣味活动首页
- 创意玩具品牌

避免用于：

- 真实力学测量

### 限制与接入建议

- 球池是轻量装饰模拟，不是精确物理实验；数量和接触计算需受控。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Ballpit-JS-CSS.json；资料核对时间：2026-10-25T07:53:11.422Z；SHA256：fa96fede3132549c7bf0e8250566db8bc3dbad6788dc3ee084af87861b60e999；哈希对象：registry-response；文件：Ballpit/Ballpit.jsx

---

## 漂浮能量光球 · Orb

案例ID：6ebabc779110f699

来源：https://reactbits.dev/backgrounds/orb

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

发光能量球在中心漂浮，悬停时可改变旋转或强度。

触发：持续光球动画；鼠标悬停

作用层：page-background

### 实现方法

WebGL片元着色器围绕中心能量球绘制波动轮廓、高光与泄光，悬停可改变旋转或强度。

1. 在React客户端引入锁定registry的Orb.css、Orb.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用size、wobble和glow配置球体距离场，colors与hue设置颜色，时间和交互驱动表面纹理。
3. 使用源码已提供的colors、hue、backgroundColor、size、glow、bleed等属性配置；触发依据：持续光球动画；鼠标悬停。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- colors：锁定源码默认：['#9c43fe', '#4cc2e9', '#101499']
- hue：锁定源码默认：0
- backgroundColor：锁定源码默认：'#000000'
- size：锁定源码默认：1
- glow：锁定源码默认：1
- bleed：锁定源码默认：1
- wobble：锁定源码默认：1
- highlight：锁定源码默认：1
- trail：锁定源码默认：1
- tiltX：锁定源码默认：0
- tiltY：锁定源码默认：0
- speed：锁定源码默认：1
- hoverIntensity：锁定源码默认：1
- rotateOnHover：锁定源码默认：true
- forceHoverState：锁定源码默认：false
- followCursor：锁定源码默认：true
- clickPulse：锁定源码默认：true
- intro：锁定源码默认：true
- opacity：锁定源码默认：1
- paused：锁定源码默认：false

### 适用场景

- 智能体视觉入口
- 能量主题首屏

避免用于：

- 准确分子教学模型

### 限制与接入建议

- 是二维着色器球体外观，不是可旋转的真实三维球模型或原子结构。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Orb-JS-CSS.json；资料核对时间：2026-10-25T07:53:11.704Z；SHA256：8a7e9ee9375fdaf689bef7d4221e49913c51875426f2d5e3ec546f36c22d9e87；哈希对象：registry-response；文件：Orb.css、Orb.jsx

---

## 字符故障矩阵 · Letter Glitch

案例ID：46bf6b92d95855c3

来源：https://reactbits.dev/backgrounds/letter-glitch

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

密集字符不断换字和换色，形成类似矩阵终端的随机跳动背景。

触发：页面展示后持续字符更新

作用层：page-background

### 实现方法

WebGL字符图集覆盖网格，单元按随机相位换字和换色，并用平滑混合或扫描区域形成故障矩阵。

1. 在React客户端引入锁定registry的LetterGlitch.css、LetterGlitch.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以characters、fontSize和spacing生成字形图集，按glitchAmount、speed和smooth更新单元状态。
3. 使用源码已提供的characters、fontFamily、fontSize、spacing、density、baseOpacity等属性配置；触发依据：页面展示后持续字符更新。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- characters：锁定源码默认：DEFAULT_CHARACTERS
- fontFamily：锁定源码默认：DEFAULT_FONT
- fontSize：锁定源码默认：14
- spacing：锁定源码默认：0.6
- density：锁定源码默认：0.9
- baseOpacity：锁定源码默认：0.16
- glitchAmount：锁定源码默认：0.5
- speed：锁定源码默认：1
- smooth：锁定源码默认：true
- interactive：锁定源码默认：true
- cursorRadius：锁定源码默认：140
- clickEffect：锁定源码默认：'tear'
- flow：锁定源码默认：0.5
- edgeFade：锁定源码默认：0
- centerFade：锁定源码默认：0
- intro：锁定源码默认：true
- lightMode：锁定源码默认：false

### 适用场景

- 电子艺术背景
- 复古科技封面

避免用于：

- 真实任务日志

### 限制与接入建议

- 随机字符不是真实代码、日志或加密结果，应与实际信息显示区域分开。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低density并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及density，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/LetterGlitch-JS-CSS.json；资料核对时间：2026-10-25T07:53:11.752Z；SHA256：686129120810d3cd2ddafdf4c94e2234440f6f1b83cc4ceba98c83d22adeb7d6；哈希对象：registry-response；文件：LetterGlitch.css、LetterGlitch.jsx

---

## 倾斜流动内容墙 · Grid Motion

案例ID：f54537d48d15cbc5

来源：https://reactbits.dev/backgrounds/grid-motion

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

照片、文字或内容块组成倾斜墙面，随指针滑动，停留处亮起。

触发：持续漂移；鼠标移动与停留

作用层：page-background

### 实现方法

DOM图片或文字块铺成倾斜网格，分行循环位移并接受指针速度或位置影响，悬停项可突出。

1. 在React客户端引入锁定registry的GridMotion.css、GridMotion.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按rows、aspectRatio和gap分布内容，angle与tilt设置墙面姿态，speed和direction驱动行间移动。
3. 使用源码已提供的items、rows、aspectRatio、gap、radius、angle等属性配置；触发依据：持续漂移；鼠标移动与停留。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- items：锁定源码默认：[]
- rows：锁定源码默认：4
- aspectRatio：锁定源码默认：1.33
- gap：锁定源码默认：16
- radius：锁定源码默认：14
- angle：锁定源码默认：-12
- tilt：锁定源码默认：0
- speed：锁定源码默认：24
- direction：锁定源码默认：'alternate'
- parallax：锁定源码默认：0.5
- spotlight：锁定源码默认：0.6
- dim：锁定源码默认：0.35
- grayscale：锁定源码默认：false
- fade：锁定源码默认：0.5
- theme：锁定源码默认：'dark'

### 适用场景

- 作品集内容墙
- 品牌图片背景

避免用于：

- 主要资料列表

### 限制与接入建议

- 连续流动的内容不适合作为唯一可访问目录，复制项需处理焦点与替代文字。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/GridMotion-JS-CSS.json；资料核对时间：2026-10-25T07:53:11.854Z；SHA256：bc3369a2ad04823e30e8d413e9ddeb63f76f2eefb2cc50244c7b2cf331711de7；哈希对象：registry-response；文件：GridMotion.css、GridMotion.jsx

---

## 移动几何网格 · Shape Grid

案例ID：7db027773c30b3f2

来源：https://reactbits.dev/backgrounds/shape-grid

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

正方、六边、圆或三角网格按设定方向连续移动，形成几何铺底。

触发：页面展示后持续移动

作用层：page-background

### 实现方法

Canvas按正方、六边形、圆或三角铺网格，整体坐标随时间移动，鼠标单元可变色或填充。

1. 在React客户端引入锁定registry的ShapeGrid.css、ShapeGrid.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用shape、cellSize和lineWidth生成几何单元，以direction和speed推进循环偏移，hoverColor处理指针命中。
3. 使用源码已提供的shape、cellSize、lineWidth、direction、speed、lineColor等属性配置；触发依据：页面展示后持续移动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- shape：锁定源码默认：'square'
- cellSize：锁定源码默认：40
- lineWidth：锁定源码默认：1
- direction：锁定源码默认：'diagonal'
- speed：锁定源码默认：0.5
- lineColor：锁定源码默认：'#2a2734'
- hoverColor：锁定源码默认：'#ffffff'
- fillOpacity：锁定源码默认：0.15
- rainbow：锁定源码默认：false
- tiltX：锁定源码默认：0
- tiltY：锁定源码默认：0
- radius：锁定源码默认：1.5
- trail：锁定源码默认：0.6
- glow：锁定源码默认：0.35
- twinkle：锁定源码默认：0
- fade：锁定源码默认：1
- clickCascade：锁定源码默认：true
- intro：锁定源码默认：true
- opacity：锁定源码默认：1
- backgroundColor：锁定源码默认：'transparent'
- paused：锁定源码默认：false

### 适用场景

- 几何品牌首屏
- 工具页面空白背景

避免用于：

- 可操作数据表

### 限制与接入建议

- 移动网格只是背景，不具备表格数据或游戏棋盘规则。
- 接入限制：需要保留真实内容、语义与键盘操作；装饰层不应拦截事件或把唯一内容藏在悬停状态。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的paused控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ShapeGrid-JS-CSS.json；资料核对时间：2026-10-25T07:53:11.897Z；SHA256：af127e52370d59e44f8fafb762927e66f7b7ec6815f52c9e1c63190edba8911f；哈希对象：registry-response；文件：ShapeGrid.css、ShapeGrid.jsx

---

## 液态铬反光背景 · Liquid Chrome

案例ID：5f1bca2991ee5a32

来源：https://reactbits.dev/backgrounds/liquid-chrome

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

金属铬般的表面不断流动，反光与褶皱形成液态质感。

触发：页面展示后持续流动

作用层：page-background

### 实现方法

OGL片元着色器用周期噪声扭曲表面采样，并以高对比反射带和基色形成液态铬质感。

1. 在React客户端引入锁定registry的LiquidChrome.css、LiquidChrome.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. baseColor决定底色，frequencyX与frequencyY控制纹理尺度，amplitude、speed和interactive改变流动。
3. 使用源码已提供的baseColor、speed、amplitude、frequencyX、frequencyY、interactive等属性配置；触发依据：页面展示后持续流动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- baseColor：锁定源码默认：[0.1, 0.1, 0.1]
- speed：锁定源码默认：0.2
- amplitude：锁定源码默认：0.3
- frequencyX：锁定源码默认：3
- frequencyY：锁定源码默认：3
- interactive：锁定源码默认：true

### 适用场景

- 金属或潮流品牌
- 数字艺术背景

避免用于：

- 真实材质标定

### 限制与接入建议

- 金属反光是程序近似，不采样真实环境或材料物理参数。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/LiquidChrome-JS-CSS.json；资料核对时间：2026-10-25T07:53:11.962Z；SHA256：3de0b888a130aa9841e7b2bac2ea9c494cfa9fdc91c7388a0d863e3df5a51f33；哈希对象：registry-response；文件：LiquidChrome.css、LiquidChrome.jsx

---

## 旋涡扑克牌风格背景 · Balatro

案例ID：801a0fbdfac7af1e

来源：https://reactbits.dev/backgrounds/balatro

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

红蓝等色彩在圆形漩涡中旋转流动，形成 Balatro 风格的像素化光场。

触发：持续旋涡动画；按配置响应鼠标

作用层：page-background

### 实现方法

OGL按旋转坐标与噪声场混合三色漩涡，再用像素化和对比处理形成扑克游戏风格背景。

1. 在React客户端引入锁定registry的Balatro.css、Balatro.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 设置spinRotation、spinSpeed和offset控制旋转中心，color1至color3构建色带，lighting和contrast调节层次。
3. 使用源码已提供的spinRotation、spinSpeed、offset、color1、color2、color3等属性配置；触发依据：持续旋涡动画；按配置响应鼠标。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在page-background层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：ogl@^1.0.11

参数：

- spinRotation：锁定源码默认：-2.0
- spinSpeed：锁定源码默认：7.0
- offset：锁定源码默认：[0.0, 0.0]
- color1：锁定源码默认：'#DE443B'
- color2：锁定源码默认：'#006BB4'
- color3：锁定源码默认：'#162325'
- contrast：锁定源码默认：3.5
- lighting：锁定源码默认：0.4
- spinAmount：锁定源码默认：0.25
- pixelFilter：锁定源码默认：745.0
- spinEase：锁定源码默认：1.0
- isRotate：锁定源码默认：false
- mouseInteraction：锁定源码默认：true

### 适用场景

- 复古游戏活动
- 像素艺术封面

避免用于：

- 真实游戏状态分析

### 限制与接入建议

- 这是风格化漩涡，不代表游戏规则、概率或动态数据。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低绘制分辨率和同时可见元素数量并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积与资源分辨率，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Balatro-JS-CSS.json；资料核对时间：2026-10-25T07:53:12.247Z；SHA256：239402b77a766fc697c2b0b9edc90bb70aff1bea6c90da4aaed8b472d9e72200；哈希对象：registry-response；文件：Balatro.css、Balatro.jsx

---

## 绕卡片流动的霓虹亮边 · Opal Border Glow Feature Highlight Interaction

案例ID：e9efab30a393690e

来源：https://60fps.design/shots/opal-border-glow-feature-highlight-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

深色功能卡片的圆角边缘有青色、白色与黄绿色高光，沿四周平滑循环扫过；持续的柔光突出上方重点卡片，周围列表保持安静。

触发：卡片显示后持续自动循环；原案例不依赖鼠标悬停

作用层：border、outer-glow

### 实现方法

圆角卡片边缘的霓虹高光循环扫过，内面和邻近列表保持安静。

1. 建立独立的卡面、边框装饰和外晕层
2. 用圆角路径光点或掏空渐变描边模拟周边扫光
3. 让外晕随描边同步但不覆盖文字
4. 暂停时保留静态强调边界

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：重点功能卡片
- 项目适配场景：移动端亮点介绍

避免用于：

- 没有强调层级而所有卡片同时持续发光的列表

### 限制与接入建议

- 仅改变边缘，不能把彩色渐变铺满内部；轨迹与周期是网页适配选择而非Opal原代码。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：触屏无需hover即可看到主要信息与操作；按容器重排并提供足够命中区，状态变化保持可理解。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/opal-border-glow-feature-highlight-interaction；资料核对时间：2026-10-12T07:14:34.296Z；SHA256：602e52b0548ec128de96076e9bc983e8ca186a8c1a2f140699d7e5967f8d9e78；哈希对象：page-response

---

## 铃铛标签切换 · Bell Toggle

案例ID：4dcf995aa23130df

来源：https://reactbits.dev/micro/bell-toggle

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

点击胶囊按钮时铃铛摇响，标签以模糊交叉过渡切换，按钮随文字长度伸展。

触发：点击切换开关状态

作用层：content

### 实现方法

按钮以选中状态控制铃铛SVG图标摇动、标签模糊交叉过渡和容器宽度弹簧变化，关闭与开启标签分层交接。

1. 在React客户端引入锁定registry的BellToggle.css、BellToggle.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 维护on/off状态，依据offLabel与onLabel测量标签宽度，以ringAmplitude摇动图标并切换内容。
3. 使用源码已提供的offLabel、onLabel、color、background、onColor、onBackground等属性配置；触发依据：点击切换开关状态。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12、@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- offLabel：锁定源码默认：'Notify me'
- onLabel：锁定源码默认："You'll be notified"
- color：锁定源码默认：'#f5f5f5'
- background：锁定源码默认：'#27272a'
- onColor：锁定源码默认：'#18181b'
- onBackground：锁定源码默认：'#f5f5f5'
- size：锁定源码默认：'md'
- radius：锁定源码默认：22
- ringAmplitude：锁定源码默认：17
- ringPasses：锁定源码默认：5
- ringDecay：锁定源码默认：1
- ringDuration：锁定源码默认：820
- ringPivot：锁定源码默认：16
- crossfadeMs：锁定源码默认：200
- revealBounce：锁定源码默认：0
- count：锁定源码默认：0
- badge：锁定源码默认：true
- badgeColor：锁定源码默认：'#ef4444'
- badgeTextColor：锁定源码默认：'#ffffff'
- waves：锁定源码默认：true
- clapper：锁定源码默认：false
- defaultPressed：锁定源码默认：false
- disabled：锁定源码默认：false

### 适用场景

- 通知偏好
- 关注状态切换

避免用于：

- 声称已启用系统推送

### 限制与接入建议

- 只是本地切换反馈，不自动订阅通知或获取系统通知权限。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/BellToggle-JS-CSS.json；资料核对时间：2026-10-25T07:53:12.210Z；SHA256：fcc242ff73b427f0538e530f5e312a94839bb923e2c3690a417771632c47844e；哈希对象：registry-response；文件：BellToggle.css、BellToggle.jsx

---

## 树枝展开菜单 · Branched Menu

案例ID：8c066244db53ce5a

来源：https://reactbits.dev/micro/branched-menu

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

分组菜单展开成树干与弯曲枝线，强调线沿分支移动到选中项目。

触发：展开分组；点击子项

作用层：layout、content

### 实现方法

DOM分组菜单配合SVG树干枝线，展开时逐项显现，活动项目改变强调线的路径长度和位置。

1. 在React客户端引入锁定registry的BranchedMenu.css、BranchedMenu.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以items建立层级，测量行高与缩进，defaultOpen和defaultActive初始化状态，选中后更新分支高亮。
3. 使用源码已提供的items、defaultOpen、defaultActive、color、accentColor、lineColor等属性配置；触发依据：展开分组；点击子项。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在layout、content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- items：锁定源码默认：DEFAULT_ITEMS
- defaultOpen：锁定源码默认：0
- defaultActive：锁定源码默认：''
- color：锁定源码默认：'#f5f5f5'
- accentColor：锁定源码默认：'#f5f5f5'
- lineColor：锁定源码默认：'#3f3f46'
- width：锁定源码默认：240
- rowHeight：锁定源码默认：36
- indent：锁定源码默认：40
- trunk：锁定源码默认：14
- radius：锁定源码默认：10
- lineWidth：锁定源码默认：1.5
- fontSize：锁定源码默认：14
- drawDuration：锁定源码默认：400
- foldDuration：锁定源码默认：300

### 适用场景

- 知识分类入口
- 轻量工具菜单

避免用于：

- 大规模复杂权限树

### 限制与接入建议

- 仅负责菜单结构和视觉，不替业务决定权限、路由或数据树查询。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/BranchedMenu-JS-CSS.json；资料核对时间：2026-10-25T07:53:12.374Z；SHA256：996589b42ccc8d490a415637affaafb3060683730a299403a627860cf5b37ca2；哈希对象：registry-response；文件：BranchedMenu.css、BranchedMenu.jsx

---

## 工具调用状态胶囊 · Call Chip

案例ID：37d8f3e7fef3f4a4

来源：https://reactbits.dev/micro/call-chip

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

工具执行时填色扫过胶囊并显示耗时，成功变绿，失败停住、变红抖动并显示重试。

触发：工具状态与耗时更新；点击重试

作用层：content

### 实现方法

工具状态胶囊根据外部status在等待、执行、成功或失败之间转换，以填色扫动和耗时显示表现运行。

1. 在React客户端引入锁定registry的CallChip.css、CallChip.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 根据name、argument和status渲染标签，执行时计时并推进填充，错误时显示失败与重试回调入口。
3. 使用源码已提供的icon、name、argument、status、expectedMs、size等属性配置；触发依据：工具状态与耗时更新；点击重试。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- icon：锁定源码默认：'terminal'
- name：锁定源码默认：'bash'
- argument：锁定源码默认：'npm test'
- status：锁定源码默认：'running'
- expectedMs：锁定源码默认：2500
- size：锁定源码默认：34
- radius：锁定源码默认：10
- color：锁定源码默认：'currentColor'
- surfaceColor：锁定源码默认：'#27272a'
- progressColor：锁定源码默认：'currentColor'
- progressOpacity：锁定源码默认：0.08
- doneColor：锁定源码默认：'#22c55e'
- errorColor：锁定源码默认：'#ef4444'
- washOpacity：锁定源码默认：0.14
- shake：锁定源码默认：6
- showTimer：锁定源码默认：true

### 适用场景

- 智能体工具调用展示
- 工作流步骤状态

避免用于：

- 伪造后台任务成功

### 限制与接入建议

- 视觉胶囊不执行真实工具，也不能把expectedMs估算进度冒充服务端真实进度。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/CallChip-JS-CSS.json；资料核对时间：2026-10-25T07:53:12.356Z；SHA256：657e23df733d1e7698c490fc01499d107fc8342188ef002eb99cf6edee3370b1；哈希对象：registry-response；文件：CallChip.css、CallChip.jsx

---

## 弹性验证码格 · Code Slots

案例ID：76c99acabd7f6c55

来源：https://reactbits.dev/micro/code-slots

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

验证码各格的数字弹入、底色从中心膨胀，错误时依次清空，成功时合成统一强调色。

触发：输入、粘贴或自动填充；验证结果变化

作用层：content

### 实现方法

多格验证码输入维护单一值，Motion为各格数字和底色安排进入、错误清除及成功合并状态。

1. 在React客户端引入锁定registry的CodeSlots.css、CodeSlots.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以length拆分值并处理输入或粘贴，mask决定视觉隐藏，status更新错误序列或成功色，保持焦点位置。
3. 使用源码已提供的length、defaultValue、status、mask、caret、disabled等属性配置；触发依据：输入、粘贴或自动填充；验证结果变化。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12、@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- length：锁定源码默认：6
- defaultValue：锁定源码默认：''
- status：锁定源码默认：'idle'
- mask：锁定源码默认：false
- caret：锁定源码默认：true
- disabled：锁定源码默认：false
- autoFocus：锁定源码默认：false
- accentColor：锁定源码默认：'#f5f5f5'
- inkColor：锁定源码默认：'#f5f5f5'
- slotColor：锁定源码默认：'#27272a'
- digitColor：锁定源码默认：'#18181b'
- dangerColor：锁定源码默认：'#ff3b30'
- slotSize：锁定源码默认：44
- gap：锁定源码默认：8
- radius：锁定源码默认：12
- bounce：锁定源码默认：0.2
- settle：锁定源码默认：0.3
- rise：锁定源码默认：8
- cascade：锁定源码默认：20
- ariaLabel：锁定源码默认：'One-time code'

### 适用场景

- 登录验证码输入
- 短码确认

避免用于：

- 声称已完成身份认证

### 限制与接入建议

- 不自带验证码校验、发送短信或安全认证，需接入真实后端与适当输入语义。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/CodeSlots-JS-CSS.json；资料核对时间：2026-10-25T07:53:12.496Z；SHA256：cccc7126c34d553926b30d040f8aaa934475c8f63f1aa9151245a2081d9153d8；哈希对象：registry-response；文件：CodeSlots.css、CodeSlots.jsx

---

## 彗星刻度旋钮 · Comet Dial

案例ID：c790109d7bf987ba

来源：https://reactbits.dev/micro/comet-dial

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

旋钮沿角度拨动，读数以弹簧跟随，高亮头部拖出随速度变化的彗星尾迹。

触发：拖动或甩动旋钮

作用层：content

### 实现方法

旋钮将指针角度映射到数值，弹簧平滑读数，SVG刻度高亮按角速度拖出彗星尾迹。

1. 在React客户端引入锁定registry的CometDial.css、CometDial.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按min、max和step确定取值，拖动时计算相对圆心角度并钳制，尾迹根据旋转速度衰减。
3. 使用源码已提供的defaultValue、min、max、step、unit、label等属性配置；触发依据：拖动或甩动旋钮。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：motion@^12.23.12

参数：

- defaultValue：锁定源码默认：62
- min：锁定源码默认：0
- max：锁定源码默认：100
- step：锁定源码默认：1
- unit：锁定源码默认：'%'
- label：锁定源码默认：'Level'
- accent：锁定源码默认：'#f5f5f5'
- ink：锁定源码默认：'#fdfdfd'
- size：锁定源码默认：250
- sweep：锁定源码默认：320
- thickness：锁定源码默认：5
- speed：锁定源码默认：25
- tapBounce：锁定源码默认：0.2
- flickBounce：锁定源码默认：0.1
- momentum：锁定源码默认：1
- cometReach：锁定源码默认：180
- cometWidth：锁定源码默认：12
- disabled：锁定源码默认：false

### 适用场景

- 音频参数
- 创意属性旋钮

避免用于：

- 极高精度测量调节

### 限制与接入建议

- 需提供键盘或数值输入替代，装饰彗星不能影响实际选中值和单位。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/CometDial-JS-CSS.json；资料核对时间：2026-10-25T07:53:12.662Z；SHA256：cdc64c2b3026c72fc268369f2903d2992fbcb7baccddfb47bc81643889478933；哈希对象：registry-response；文件：CometDial.css、CometDial.jsx

---

## 躲避鼠标的元素 · Dodge Field

案例ID：6d800efa8749c949

来源：https://reactbits.dev/micro/dodge-field

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

容器中的元素在有限区域内躲开指针，多次接近后不再躲避并滑回原位。

触发：指针接近元素

作用层：content

### 实现方法

Motion驱动容器内目标躲开指针，局部距离场决定逃离方向，并在限定尝试后回归可点击位置。

1. 在React客户端引入锁定registry的DodgeField.css、DodgeField.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用reach与radius计算接近程度，在fieldHeight限定区域内生成逃离目标，再按fleeDuration回位并更新提示。
3. 使用源码已提供的taunts、notice、inkColor、contrastColor、fieldHeight、reach等属性配置；触发依据：指针接近元素。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：motion@^12.23.12

参数：

- taunts：锁定源码默认：DEFAULT_TAUNTS
- notice：锁定源码默认：''
- inkColor：锁定源码默认：'#f5f5f5'
- contrastColor：锁定源码默认：'#18181b'
- fieldHeight：锁定源码默认：240
- reach：锁定源码默认：72
- radius：锁定源码默认：120
- falloff：锁定源码默认：2
- fleeDuration：锁定源码默认：130
- returnDuration：锁定源码默认：620
- returnBounce：锁定源码默认：0.1
- axis：锁定源码默认：'both'
- wall：锁定源码默认：'clamp'
- patience：锁定源码默认：4
- disabled：锁定源码默认：false

### 适用场景

- 游戏化趣味展示
- 可选互动彩蛋

避免用于：

- 关键提交和关闭按钮

### 限制与接入建议

- 不能用于必须可靠点击的提交、关闭或同意按钮；趣味躲避不应阻碍任务完成。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：检查短屏滚动行程、内部滚动与外部页面的分工，适度减少可见层数，保留全部内容和可直接操作入口。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/DodgeField-JS-CSS.json；资料核对时间：2026-10-25T07:53:12.765Z；SHA256：c8e5a1a5fcc7bd75423e9329532ffc02204c4f7dc7aaf6573f1cf51953d2f2a8；哈希对象：registry-response；文件：DodgeField.css、DodgeField.jsx

---

## 弹簧双面翻转卡 · Flip Card

案例ID：97891d41cb98ef59

来源：https://reactbits.dev/micro/flip-card

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

卡片可点击、拖动或甩动来三维翻面，松手速度影响回弹，可带指针倾斜与高光。

触发：点击、拖动或甩动

作用层：content

### 实现方法

Motion以绕X或Y轴的三维旋转切换前后两面，拖动距离和释放速度决定翻转或弹回。

1. 在React客户端引入锁定registry的FlipCard.css、FlipCard.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 保留front、back两层并设置背面不可见，axis控制翻转轴，点击或dragDistance阈值更新翻面状态。
3. 使用源码已提供的front、back、defaultFlipped、axis、flipOnClick、draggable等属性配置；触发依据：点击、拖动或甩动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12

参数：

- front：锁定源码默认：null
- back：锁定源码默认：null
- defaultFlipped：锁定源码默认：false
- axis：锁定源码默认：'y'
- flipOnClick：锁定源码默认：true
- draggable：锁定源码默认：true
- dragDistance：锁定源码默认：0
- tilt：锁定源码默认：true
- tiltMax：锁定源码默认：12
- glare：锁定源码默认：true
- glareOpacity：锁定源码默认：0.22
- hoverScale：锁定源码默认：1.03
- perspective：锁定源码默认：1100
- stiffness：锁定源码默认：170
- damping：锁定源码默认：20
- width：锁定源码默认：300
- height：锁定源码默认：400
- radius：锁定源码默认：22
- background：锁定源码默认：'#27272a'
- color：锁定源码默认：'#f5f5f5'
- shadow：锁定源码默认：true
- shadowColor：锁定源码默认：'#000000'
- shadowOpacity：锁定源码默认：0.45
- disabled：锁定源码默认：false
- ariaLabel：锁定源码默认：'Flip card'

### 适用场景

- 学习记忆卡
- 产品双面介绍

避免用于：

- 主要表单填写面

### 限制与接入建议

- 背面隐藏内容不可作为唯一重要信息，触屏和键盘应有明确翻面入口。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/FlipCard-JS-CSS.json；资料核对时间：2026-10-25T07:53:12.894Z；SHA256：670cb3b3933c9d82ce34e857b1c377186842abf12703b52c03a3d413cd9d8303；哈希对象：registry-response；文件：FlipCard.css、FlipCard.jsx

---

## 浮出笔记的文件夹 · Folder Float

案例ID：5d28bb2c5ec3cbeb

来源：https://reactbits.dev/micro/folder-float

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

悬停或按下文件夹后盖板前倾，笔记从背后弹成可选择的浮动云，关闭时收回。

触发：鼠标悬停或按下；选择笔记

作用层：content

### 实现方法

文件夹盖板旋转后，笔记项以弹簧或Matter.js物理云浮出，选择或关闭时回收到文件夹内。

1. 在React客户端引入锁定registry的FolderFloat.css、FolderFloat.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按items构造笔记卡，trigger控制开合，physics与drift决定浮动方式，closeOnSelect控制选择后的回收。
3. 使用源码已提供的items、label、sublabel、trigger、defaultOpen、closeOnSelect等属性配置；触发依据：鼠标悬停或按下；选择笔记。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：matter-js@^0.20.0

参数：

- items：锁定源码默认：DEFAULT_ITEMS
- label：锁定源码默认：'Design feedback'
- sublabel：锁定源码默认：''
- trigger：锁定源码默认：'hover'
- defaultOpen：锁定源码默认：false
- closeOnSelect：锁定源码默认：true
- physics：锁定源码默认：true
- drift：锁定源码默认：0.5
- folderColor：锁定源码默认：'#3f3f46'
- frontColor：锁定源码默认：'#52525b'
- paperColor：锁定源码默认：'#f5f5f5'
- itemColor：锁定源码默认：'#f5f5f5'
- itemTextColor：锁定源码默认：'#18181b'
- labelColor：锁定源码默认：'#f5f5f5'
- width：锁定源码默认：200
- height：锁定源码默认：148
- radius：锁定源码默认：14
- spread：锁定源码默认：180
- lift：锁定源码默认：26
- tilt：锁定源码默认：8
- flapAngle：锁定源码默认：34
- restAngle：锁定源码默认：16
- openDuration：锁定源码默认：520
- stagger：锁定源码默认：45
- bounce：锁定源码默认：0.3

### 适用场景

- 创意资料入口
- 笔记选择器

避免用于：

- 真实文件系统操作

### 限制与接入建议

- 是视觉分类选择，不是真实文件夹；动态笔记应保留稳定可点击命中与文字。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/FolderFloat-JS-CSS.json；资料核对时间：2026-10-25T07:53:12.914Z；SHA256：f191eded4a8d9526fce19660eb91e547035ba430955d92c356fefc23cc2c4b09；哈希对象：registry-response；文件：FolderFloat.css、FolderFloat.jsx

---

## 带倒计时撤销的按钮 · Fuse Button

案例ID：114eeaec814ff8e6

来源：https://reactbits.dev/micro/fuse-button

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

操作完成后标签切为撤销，细线燃尽表示撤销窗口，点击撤销或 Escape 可退回。

触发：点击操作；点击撤销或按 Escape

作用层：content

### 实现方法

完成操作后按钮暂时切换到撤销标签，计时线表示undoWindow剩余时间，点击或Escape可回退状态。

1. 在React客户端引入锁定registry的FuseButton.css、FuseButton.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 先由业务确认动作已执行再显示撤销窗，维护倒计时和undo回调，到期切换doneLabel并清理定时器。
3. 使用源码已提供的label、undoLabel、doneLabel、color、background、fuseColor等属性配置；触发依据：点击操作；点击撤销或按 Escape。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- label：锁定源码默认：'Archive'
- undoLabel：锁定源码默认：'Undo'
- doneLabel：锁定源码默认：'Archived'
- color：锁定源码默认：'#f5f5f5'
- background：锁定源码默认：'#27272a'
- fuseColor：锁定源码默认：'#f5a524'
- size：锁定源码默认：'md'
- radius：锁定源码默认：22
- undoWindow：锁定源码默认：4000
- fuse：锁定源码默认：'outline'
- fuseThickness：锁定源码默认：1.5
- crossfadeMs：锁定源码默认：200
- commitOn：锁定源码默认：'press'
- pauseOnHover：锁定源码默认：true
- settle：锁定源码默认：'reset'
- disabled：锁定源码默认：false
- type：锁定源码默认：'button'

### 适用场景

- 可撤回的列表操作
- 轻量收藏变更

避免用于：

- 不可逆操作的假撤销

### 限制与接入建议

- 按钮只提供撤销交互外观，真正的数据回滚必须由业务实现，不能假装删除已撤销。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/FuseButton-JS-CSS.json；资料核对时间：2026-10-25T07:53:13.033Z；SHA256：890b58dfe0d611a251d2afdcf4b607e84625575480d1ffc33038bcc0cc8a9efc；哈希对象：registry-response；文件：FuseButton.css、FuseButton.jsx

---

## 滑动高亮下拉菜单 · Glide Select

案例ID：47e6f214558b4616

来源：https://reactbits.dev/micro/glide-select

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

选择菜单从芯片角部展开，统一高亮在行之间滑动，再进入时从上次位置续接。

触发：展开菜单；悬停与选择项目

作用层：content

### 实现方法

下拉菜单以芯片角部为展开原点，统一高亮层在各行之间滑动，重新进入时可从上次位置继续。

1. 在React客户端引入锁定registry的GlideSelect.css、GlideSelect.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用options建立可选择项，按hover与selected分别维护高亮位置，菜单开合时同步焦点和选中标签。
3. 使用源码已提供的options、placeholder、showTags、accentColor、surfaceColor、highlightColor等属性配置；触发依据：展开菜单；悬停与选择项目。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- options：锁定源码默认：DEFAULT_OPTIONS
- placeholder：锁定源码默认：'Select…'
- showTags：锁定源码默认：true
- accentColor：锁定源码默认：'#f5f5f5'
- surfaceColor：锁定源码默认：'#27272a'
- highlightColor：锁定源码默认：'#3f3f46'
- textColor：锁定源码默认：'#f5f5f5'
- size：锁定源码默认：'md'
- radius：锁定源码默认：10
- menuWidth：锁定源码默认：176
- placement：锁定源码默认：'bottom'
- align：锁定源码默认：'left'
- popDuration：锁定源码默认：180
- glideDuration：锁定源码默认：220
- rememberPosition：锁定源码默认：true
- disabled：锁定源码默认：false
- ariaLabel：锁定源码默认：'Select'

### 适用场景

- 模型或分类选择
- 短偏好菜单

避免用于：

- 大量复杂筛选项

### 限制与接入建议

- 高亮视觉不等于选择提交；需验证Escape、方向键、外部点击和移动端可达性。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/GlideSelect-JS-CSS.json；资料核对时间：2026-10-25T07:53:13.421Z；SHA256：bd75bdee568d85c11e1e1825fe0584c8339c1e5994c16a93f288f7b43c30d739；哈希对象：registry-response；文件：GlideSelect.css、GlideSelect.jsx

---

## 长按蓄满确认按钮 · Hold Button

案例ID：790b295e0d64dc88

来源：https://reactbits.dev/micro/hold-button

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

按住按钮时液体填色上升，提前松开回退，蓄满后标签通过模糊过渡变为完成。

触发：按住、提前松开或长按完成

作用层：content

### 实现方法

按住按钮时内部填色随时间上升，提前释放会回退，蓄满后切换为完成状态并触发回调。

1. 在React客户端引入锁定registry的HoldButton.css、HoldButton.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 记录按下时间并逐帧计算保持进度，把fillColor限制到按钮内部；释放、取消或触摸移出都应结束当前蓄力。
3. 使用源码已提供的doneLabel、icon、doneIcon、backgroundColor、fillColor、textColor等属性配置；触发依据：按住、提前松开或长按完成。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- children：锁定源码默认：'Hold to delete'
- doneLabel：锁定源码默认：'Deleted'
- icon：锁定源码默认：null
- doneIcon：锁定源码默认：null
- backgroundColor：锁定源码默认：'#27272a'
- fillColor：锁定源码默认：'#5227FF'
- textColor：锁定源码默认：'#f5f5f5'
- fillTextColor：锁定源码默认：'#ffffff'
- size：锁定源码默认：'md'
- radius：锁定源码默认：14
- fillDirection：锁定源码默认：'right'
- holdTime：锁定源码默认：2000
- releaseTime：锁定源码默认：200
- pressScale：锁定源码默认：0.97
- wave：锁定源码默认：true
- waveAmplitude：锁定源码默认：6
- glow：锁定源码默认：true
- resetAfter：锁定源码默认：1200
- disabled：锁定源码默认：false

### 适用场景

- 趣味确认
- 低风险启动操作

避免用于：

- 高风险或不可逆动作的唯一确认方式

### 限制与接入建议

- 只是长按确认手势，不代表真实后台动作完成；必须考虑键盘与辅助操作替代。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/HoldButton-JS-CSS.json；资料核对时间：2026-10-25T07:53:13.299Z；SHA256：229f70485ce7996798db1e46999ee52f0fc05e59963d65502cf2a51f11fa6e7d；哈希对象：registry-response；文件：HoldButton.css、HoldButton.jsx

---

## 果冻单选芯片 · Jelly Radio

案例ID：5a3616248414fadb

来源：https://reactbits.dev/micro/jelly-radio

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

选中的芯片先变宽再变高，并以连续弹簧运动把相邻项目推开。

触发：选择单选项目

作用层：content

### 实现方法

Motion使选中芯片先沿横向膨胀再纵向回弹，相邻项目通过布局动画顺势让位。

1. 在React客户端引入锁定registry的JellyRadio.css、JellyRadio.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 根据items维护单选值，按swell和尺寸更新选中胶囊与文字颜色，状态变化后触发业务回调。
3. 使用源码已提供的items、chipColor、activeColor、textColor、activeTextColor、size等属性配置；触发依据：选择单选项目。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12

参数：

- items：锁定源码默认：DEFAULT_ITEMS
- chipColor：锁定源码默认：'#27272a'
- activeColor：锁定源码默认：'#f5f5f5'
- textColor：锁定源码默认：'#f5f5f5'
- activeTextColor：锁定源码默认：'#18181b'
- size：锁定源码默认：'md'
- gap：锁定源码默认：8
- radius：锁定源码默认：18
- swell：锁定源码默认：0.2
- barge：锁定源码默认：6
- shrink：锁定源码默认：0.05
- jelly：锁定源码默认：1
- bounce：锁定源码默认：0.25
- stagger：锁定源码默认：22
- stiffness：锁定源码默认：580
- disabled：锁定源码默认：false
- ariaLabel：锁定源码默认：'Options'

### 适用场景

- 少量风格选择
- 偏好标签

避免用于：

- 密集复杂多选表单

### 限制与接入建议

- 视觉果冻不能改变实际单选规则，选中态需通过颜色以外的方式可识别。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/JellyRadio-JS-CSS.json；资料核对时间：2026-10-25T07:53:13.341Z；SHA256：2c677235bd9611d52b49859e59ff330ee4fbcf84f1441cd207e1db52580f087c；哈希对象：registry-response；文件：JellyRadio.css、JellyRadio.jsx

---

## 网格任务状态行 · Lattice Loader

案例ID：d3f3b48b177d5848

来源：https://reactbits.dev/micro/lattice-loader

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

小网格单元按相位波动依次亮起，旁边显示任务与计时，完成后变为勾或叉。

触发：任务运行、成功或失败状态变化

作用层：content

### 实现方法

DOM小格子按时间相位和pattern形成亮度波，外部status完成后改为勾或叉与状态文字。

1. 在React客户端引入锁定registry的LatticeLoader.css、LatticeLoader.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 根据grid与shape建立有限格子，运行时推进格子相位和计时，收到完成或错误状态后停止循环。
3. 使用源码已提供的label、doneLabel、errorLabel、status、pattern、grid等属性配置；触发依据：任务运行、成功或失败状态变化。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- label：锁定源码默认：'Thinking'
- doneLabel：锁定源码默认：'Done in'
- errorLabel：锁定源码默认：'Failed after'
- status：锁定源码默认：'working'
- pattern：锁定源码默认：'orbit'
- grid：锁定源码默认：3
- shape：锁定源码默认：'round'
- color：锁定源码默认：'currentColor'
- doneColor：锁定源码默认：'#22c55e'
- errorColor：锁定源码默认：'#ef4444'
- cellSize：锁定源码默认：6
- gap：锁定源码默认：2
- fontSize：锁定源码默认：14
- step：锁定源码默认：90
- idleOpacity：锁定源码默认：0.15
- glow：锁定源码默认：false
- glowColor：锁定源码默认：''
- showTimer：锁定源码默认：true

### 适用场景

- 智能体任务等待
- 后台步骤反馈

避免用于：

- 未经真实接口的完成证明

### 限制与接入建议

- 不能用固定时间假装真实任务完成，任务状态必须由业务传入。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/LatticeLoader-JS-CSS.json；资料核对时间：2026-10-25T07:53:13.418Z；SHA256：8782cd8cf47641c1768b4dc93213a80e4549053cecb47a4cd71393058d4d0faf；哈希对象：registry-response；文件：LatticeLoader.css、LatticeLoader.jsx

---

## 可抓揉纸张图片 · Paper Crumple

案例ID：8e3f1509bf02f915

来源：https://reactbits.dev/micro/paper-crumple

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

按住图像时纸张折成立体皱褶并跟随抓取点，可松成纸球、展开或保留折痕。

触发：按住、拖动、松开或展开

作用层：content

### 实现方法

Three.js细分纸面网格根据抓取点和折皱场变形，保持正反面纹理并在释放时收拢或展开。

1. 在React客户端引入锁定registry的PaperCrumple.css、PaperCrumple.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 加载图片并建立网格，指针拖动改变局部折皱与抓取位置，以crumpleAmount和releaseBehavior控制释放目标。
3. 使用源码已提供的alt、backSrc、width、height、sceneHeight、imageFit等属性配置；触发依据：按住、拖动、松开或展开。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；销毁时释放GPU纹理/缓冲和实例监听，避免同一对象重复挂载渲染器。

依赖：three@^0.180.0

参数：

- alt：锁定源码默认：'Crumplable image'
- backSrc：锁定源码默认：''
- width：锁定源码默认：320
- height：锁定源码默认：400
- sceneHeight：锁定源码默认：560
- imageFit：锁定源码默认：'cover'
- releaseBehavior：锁定源码默认：'restore'
- crumpleAmount：锁定源码默认：0.85
- crumpleDuration：锁定源码默认：0.55
- releaseDuration：锁定源码默认：0.4
- foldCount：锁定源码默认：6
- foldSharpness：锁定源码默认：0.6
- wrinkleDepth：锁定源码默认：0.65
- creaseStrength：锁定源码默认：0.18
- paperColor：锁定源码默认：'#f4f0e8'
- roughness：锁定源码默认：0.92
- paperTexture：锁定源码默认：0.08
- lightIntensity：锁定源码默认：1.8
- lightAngle：锁定源码默认：-35
- shadow：锁定源码默认：true
- shadowOpacity：锁定源码默认：0.08
- draggable：锁定源码默认：true
- dragRotation：锁定源码默认：10
- dragRadius：锁定源码默认：180
- returnToOrigin：锁定源码默认：true
- rotation：锁定源码默认：0
- seed：锁定源码默认：7
- detail：锁定源码默认：64
- disabled：锁定源码默认：false
- resetKey：锁定源码默认：0

### 适用场景

- 艺术作品互动
- 创意商品说明

避免用于：

- 重要文档原文展示

### 限制与接入建议

- 纸张效果是视觉近似，不是真实材料仿真；图片资源和WebGL需可用。
- 接入限制：包含WebGL/GPU渲染，需在目标浏览器实测能力、资源加载与回退，源码已获取不等于完成浏览器兼容验收。

手机：项目接入建议：降低foldCount并做手机实测，保留主题主视觉，交互与页面滚动分工且不依赖悬停。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制GPU绘制面积及foldCount，离屏暂停，释放纹理和渲染器；避免同屏叠加多个重型全屏效果。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/PaperCrumple-JS-CSS.json；资料核对时间：2026-10-25T07:53:13.612Z；SHA256：27a9b0ed3f32a6b8736e27389e6b0396b1301df348f1ab4c94e2deb86ec6d5a7；哈希对象：registry-response；文件：PaperCrumple.css、PaperCrumple.jsx

---

## 预览波浪星级评分 · Peek Rating

案例ID：c8505751d8186935

来源：https://reactbits.dev/micro/peek-rating

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

指针扫过星星时逐颗抬起，提示标签跟随移动，点击后弹跳确认评分。

触发：悬停预览；点击确认

作用层：content

### 实现方法

星级项根据指针悬停索引依次抬起，提示标签跟随预览，点击后保存评分并播放确认弹跳。

1. 在React客户端引入锁定registry的PeekRating.css、PeekRating.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 维护preview与value两个状态，按count和labels渲染选项，移出恢复已选值，点击才触发评分回调。
3. 使用源码已提供的defaultValue、count、shape、labels、activeColor、idleColor等属性配置；触发依据：悬停预览；点击确认。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- defaultValue：锁定源码默认：0
- count：锁定源码默认：5
- shape：锁定源码默认：'star'
- labels：锁定源码默认：[]
- activeColor：锁定源码默认：'#f5b400'
- idleColor：锁定源码默认：'#52525b'
- tipColor：锁定源码默认：'#27272a'
- tipTextColor：锁定源码默认：'#f5f5f5'
- size：锁定源码默认：28
- lift：锁定源码默认：6
- magnify：锁定源码默认：1.15
- riseDuration：锁定源码默认：320
- popScale：锁定源码默认：1.3
- showTip：锁定源码默认：true
- allowClear：锁定源码默认：true
- readOnly：锁定源码默认：false
- disabled：锁定源码默认：false
- ariaLabel：锁定源码默认：'Rating'

### 适用场景

- 内容评分
- 轻量满意度反馈

避免用于：

- 必须精确量化的专业评估

### 限制与接入建议

- 预览不等于提交，真实评分存储与防重复提交需业务实现。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/PeekRating-JS-CSS.json；资料核对时间：2026-10-25T07:53:13.755Z；SHA256：3a3689cb6958ba9fffb354a9f9724938a1a66511870dd8ed5d8f38361a5438d3；哈希对象：registry-response；文件：PeekRating.css、PeekRating.jsx

---

## 多入口智能体输入栏 · Prompt Bar

案例ID：e3aaeefc863b70e7

来源：https://reactbits.dev/micro/prompt-bar

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

输入栏可显示来源、命令和模型选择菜单，以及附件与语音入口；发送图标在忙碌时变成停止。

触发：输入文字；打开菜单；发送或停止

作用层：content

### 实现方法

输入栏把真实文本编辑与来源、命令、模型等选择菜单组合，外部busy状态将发送入口切换为停止。

1. 在React客户端引入锁定registry的PromptBar.css、PromptBar.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 管理输入、附件与菜单选择，用sources、commands、models构造选项；发送和停止只调用接入方提供的回调。
3. 使用源码已提供的placeholder、sources、commands、models、defaultModel、efforts等属性配置；触发依据：输入文字；打开菜单；发送或停止。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：motion@^12.23.12、@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- placeholder：锁定源码默认：'Ask anything'
- sources：锁定源码默认：DEFAULT_SOURCES
- commands：锁定源码默认：DEFAULT_COMMANDS
- models：锁定源码默认：DEFAULT_MODELS
- defaultModel：锁定源码默认：''
- efforts：锁定源码默认：DEFAULT_EFFORTS
- defaultEffort：锁定源码默认：''
- busy：锁定源码默认：false
- background：锁定源码默认：'#27272a'
- color：锁定源码默认：'#f5f5f5'
- menuBackground：锁定源码默认：'#323236'
- sparkColor：锁定源码默认：'#b39dff'
- sparkBoost：锁定源码默认：1
- width：锁定源码默认：400
- radius：锁定源码默认：16
- maxRows：锁定源码默认：5
- morphDuration：锁定源码默认：240
- squash：锁定源码默认：0.12
- tilt：锁定源码默认：8
- pressScale：锁定源码默认：0.96

### 适用场景

- 智能体聊天输入
- 创作工具提问栏

避免用于：

- 声称已接通模型或识别服务

### 限制与接入建议

- 不自带大模型、语音识别或文件解析；附件预览和模拟状态不能冒称已上传或分析。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/PromptBar-JS-CSS.json；资料核对时间：2026-10-25T07:53:14.040Z；SHA256：3f063eea844eb75b64f01bb45f02288a81d331df28bc34dd3913921c57cbb3f2；哈希对象：registry-response；文件：PromptBar.css、PromptBar.jsx

---

## 收缩回弹点赞按钮 · Pulse Heart

案例ID：eb721cb0a78f16ca

来源：https://reactbits.dev/micro/pulse-heart

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

爱心先收缩成点，在最小处变色，再弹回新状态，同时替换计数字符。

触发：点击点赞或取消

作用层：content

### 实现方法

爱心图形先缩小到接近一点，在最小尺度切换颜色与选中态，再回弹并替换计数字符。

1. 在React客户端引入锁定registry的PulseHeart.css、PulseHeart.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 区分liked状态和count显示，点击时串联收缩、换色和弹回时间线，业务回调负责保存真实点赞。
3. 使用源码已提供的defaultLiked、count、showCount、icon、idleOutline、size等属性配置；触发依据：点击点赞或取消。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：@hugeicons/core-free-icons@^4.3.3

参数：

- defaultLiked：锁定源码默认：false
- count：锁定源码默认：0
- showCount：锁定源码默认：true
- icon：锁定源码默认：'heart'
- idleOutline：锁定源码默认：true
- size：锁定源码默认：40
- corner：锁定源码默认：32
- likedColor：锁定源码默认：'#ff4d6d'
- idleColor：锁定源码默认：'#8b8b93'
- pillColor：锁定源码默认：'#232326'
- textColor：锁定源码默认：'#f5f5f5'
- duration：锁定源码默认：560
- dotSize：锁定源码默认：0.3
- overshoot：锁定源码默认：1.7
- beat：锁定源码默认：3
- rollDuration：锁定源码默认：350
- disabled：锁定源码默认：false
- label：锁定源码默认：'Like'

### 适用场景

- 作品收藏
- 内容点赞

避免用于：

- 真实点赞数未经验证的营销展示

### 限制与接入建议

- 动画与计数是UI状态，不自带用户身份、防重点赞或后端统计。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/PulseHeart-JS-CSS.json；资料核对时间：2026-10-25T07:53:13.948Z；SHA256：e3f926497cc3e724b9017b855703e61be200432192a06935d7bd4d6c35d50b5c；哈希对象：registry-response；文件：PulseHeart.css、PulseHeart.jsx

---

## 生成进度媒体框 · Refine Frame

案例ID：a6833a77c4f5b849

来源：https://reactbits.dev/micro/refine-frame

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

媒体框固定比例，排队、生成、优化与完成阶段用模糊、饱和度和缩放过渡；错误显示重试。

触发：媒体生成状态更新；点击重试

作用层：content

### 实现方法

固定比例媒体框把排队、生成、优化、完成和错误映射到不同的模糊、饱和度、缩放及状态覆盖层。

1. 在React客户端引入锁定registry的RefineFrame.css、RefineFrame.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 由外部status驱动阶段，媒体加载后保持aspectRatio，stageDuration只控制视觉过渡，错误显示重试入口。
3. 使用源码已提供的status、aspectRatio、width、radius、background、color等属性配置；触发依据：媒体生成状态更新；点击重试。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- status：锁定源码默认：'generating'
- aspectRatio：锁定源码默认：'4 / 3'
- width：锁定源码默认：320
- radius：锁定源码默认：16
- background：锁定源码默认：'#27272a'
- color：锁定源码默认：'#f5f5f5'
- stageDuration：锁定源码默认：400
- sweep：锁定源码默认：true
- showStatus：锁定源码默认：true
- hideAfter：锁定源码默认：1200
- labels：锁定源码默认：DEFAULT_LABELS
- retryLabel：锁定源码默认：'Retry'

### 适用场景

- AI媒体任务预览
- 渲染结果面板

避免用于：

- 伪造图片生成结果

### 限制与接入建议

- 不生成真实图片，也不凭计时自行宣称生成完成；图像结果与状态应由服务端提供。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/RefineFrame-JS-CSS.json；资料核对时间：2026-10-25T07:53:13.989Z；SHA256：6dac61985221d24f7ed427f8a59fc3b551295f769368db00919c114b7762ebda；哈希对象：registry-response；文件：RefineFrame.css、RefineFrame.jsx

---

## 橡皮滑块分段选择 · Rubber Segment

案例ID：b51af7fe12edb082

来源：https://reactbits.dev/micro/rubber-segment

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

选择滑块跨越间距时拉长并在目标处压缩，也可拖拽和甩动切换选项。

触发：点击、拖动或甩动

作用层：content

### 实现方法

Motion共享滑块在分段选项间移动，跨间距时拉长并在目标处压缩，拖动释放速度影响切换。

1. 在React客户端引入锁定registry的RubberSegment.css、RubberSegment.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量各slot边界，按equalSlots和inset计算滑块目标，拖动时插值形状并在释放后吸附到有效索引。
3. 使用源码已提供的trackColor、thumbColor、textColor、activeTextColor、size、radius等属性配置；触发依据：点击、拖动或甩动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12

参数：

- trackColor：锁定源码默认：'#27272a'
- thumbColor：锁定源码默认：'#fafafa'
- textColor：锁定源码默认：'#fafafa'
- activeTextColor：锁定源码默认：'#18181b'
- size：锁定源码默认：'md'
- radius：锁定源码默认：10
- inset：锁定源码默认：3
- equalSlots：锁定源码默认：true
- stretch：锁定源码默认：100
- squash：锁定源码默认：3
- speed：锁定源码默认：1
- glide：锁定源码默认：75
- draggable：锁定源码默认：true
- disabled：锁定源码默认：false
- 'aria-label'：锁定源码默认：'Segmented control'

### 适用场景

- 视图切换
- 少量模式选择

避免用于：

- 大量选项导航

### 限制与接入建议

- 只改变选择反馈，受控值与键盘切换需要正确接入，不能依赖拖拽才能选择。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/RubberSegment-JS-CSS.json；资料核对时间：2026-10-25T07:53:14.088Z；SHA256：dd938ada85600efc4584cba1f9b6dc15fd645dfc5d4fe134c1f53ed1fcf1049a；哈希对象：registry-response；文件：RubberSegment.css、RubberSegment.jsx

---

## 可拖动数值芯片 · Scrub Field

案例ID：c9c6cd47270734b4

来源：https://reactbits.dev/micro/scrub-field

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

横向拖动直接调节数值，超出范围时产生橡皮回弹，单击可改为输入。

触发：拖动调节；单击输入

作用层：content

### 实现方法

数值芯片把横向拖动差映射到值，超出范围时视觉橡皮衰减，点击切换为真实数值输入。

1. 在React客户端引入锁定registry的ScrubField.css、ScrubField.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 依据sensitivity和step累计拖动量并钳制min/max，拖动结束提交值，单击编辑时使用输入框与suffix单位。
3. 使用源码已提供的label、suffix、defaultValue、min、max、step等属性配置；触发依据：拖动调节；单击输入。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12

参数：

- label：锁定源码默认：'Radius'
- suffix：锁定源码默认：'px'
- defaultValue：锁定源码默认：24
- min：锁定源码默认：0
- max：锁定源码默认：100
- step：锁定源码默认：1
- size：锁定源码默认：'md'
- sensitivity：锁定源码默认：2
- rubberReach：锁定源码默认：8
- returnDuration：锁定源码默认：300
- coarseMultiplier：锁定源码默认：10
- fineMultiplier：锁定源码默认：0.1
- showDelta：锁定源码默认：true
- showDirty：锁定源码默认：false
- showFill：锁定源码默认：true
- accent：锁定源码默认：'#f5f5f5'
- chipColor：锁定源码默认：'#27272a'
- disabled：锁定源码默认：false

### 适用场景

- 设计属性面板
- 尺寸与强度调节

避免用于：

- 只有拖动的精密数值输入

### 限制与接入建议

- 装饰溢出不能写入非法值；精确输入和键盘调整必须保留。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ScrubField-JS-CSS.json；资料核对时间：2026-10-25T07:53:14.212Z；SHA256：749a70439427283d549dcd4e88c6c61c930adc2b2c5113398cb0b0fdb98a6f15；哈希对象：registry-response；文件：ScrubField.css、ScrubField.jsx

---

## 拖入碎纸机的列表 · Shredder

案例ID：97a9f5a045f281cc

来源：https://reactbits.dev/micro/shredder

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

把列表行拖入底部缝隙后，滚轴将其拉入并切成卷曲纸条，其他项目弹性补位。

触发：拖动列表行进入缝隙

作用层：content

### 实现方法

DOM列表行拖入缝隙后由Canvas或分片层切成纸条，纸条卷曲下落，剩余列表弹性补位。

1. 在React客户端引入锁定registry的Shredder.css、Shredder.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量拖动行与slit位置，进入投喂区后按feedSpeed推进分片，完成视觉后通过回调移除对应业务项。
3. 使用源码已提供的items、width、height、inset、gap、slitHeight等属性配置；触发依据：拖动列表行进入缝隙。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：react-dom@^19.0.0

参数：

- items：锁定源码默认：[]
- width：锁定源码默认：340
- height：锁定源码默认：460
- inset：锁定源码默认：14
- gap：锁定源码默认：10
- slitHeight：锁定源码默认：4
- fallHeight：锁定源码默认：140
- feedSpeed：锁定源码默认：180
- bite：锁定源码默认：18
- autoFeed：锁定源码默认：true
- stripWidth：锁定源码默认：10
- curl：锁定源码默认：1
- autoAnimate：锁定源码默认：false
- loop：锁定源码默认：false
- loopAfterDelete：锁定源码默认：false
- dragTilt：锁定源码默认：6
- lift：锁定源码默认：1.02
- slitColor：锁定源码默认：'#3f3f46'
- color：锁定源码默认：'#f5f5f5'
- disabled：锁定源码默认：false

### 适用场景

- 创意待办删除
- 低风险列表整理

避免用于：

- 真实文件安全销毁

### 限制与接入建议

- 碎纸视觉不代表安全删除文件，重要数据删除应有业务确认或撤销能力。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；使用实际提供的autoAnimate控制或宿主开关停止持续运动，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/Shredder-JS-CSS.json；资料核对时间：2026-10-25T07:53:14.407Z；SHA256：786729a43024818083880911f15bcc756ea40cacb697a86851661e780067e641；哈希对象：registry-response；文件：Shredder.css、Shredder.jsx

---

## 滑动确认进度按钮 · Slide Commit

案例ID：450745deb2ca4e32

来源：https://reactbits.dev/micro/slide-commit

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

把手滑到末端后显示运行转圈，成功时展开完成标签，失败时抖动并弹回。

触发：拖动把手确认；动作成功或失败

作用层：content

### 实现方法

可拖动把手沿轨道推进，达到末端才进入执行状态，成功展开完成标签，失败回弹并显示错误。

1. 在React客户端引入锁定registry的SlideCommit.css、SlideCommit.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 把拖动位置规范化为进度，阈值满足后调用业务动作，外部结果驱动done/error而非用滑到底直接判成功。
3. 使用源码已提供的label、doneLabel、errorLabel、trackColor、handleColor、successColor等属性配置；触发依据：拖动把手确认；动作成功或失败。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12、@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- label：锁定源码默认：'Slide to pay'
- doneLabel：锁定源码默认：'Paid'
- errorLabel：锁定源码默认：'Payment failed'
- trackColor：锁定源码默认：'#262626'
- handleColor：锁定源码默认：'#f5f5f5'
- successColor：锁定源码默认：'#22c55e'
- dangerColor：锁定源码默认：'#e5484d'
- width：锁定源码默认：280
- height：锁定源码默认：56
- radius：锁定源码默认：28
- speed：锁定源码默认：50
- returnBounce：锁定源码默认：0.38
- landingDip：锁定源码默认：0.026
- holdMs：锁定源码默认：1500
- disabled：锁定源码默认：false

### 适用场景

- 低风险确认操作
- 趣味任务启动

避免用于：

- 不可访问的唯一提交入口

### 限制与接入建议

- 手势只是确认方式，不自带真实提交；键盘和辅助输入应有等价确认入口。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/SlideCommit-JS-CSS.json；资料核对时间：2026-10-25T07:53:14.514Z；SHA256：9bc4eb1859429d5b46284dbfc6db09e9b65899c91356011ff75233c7891ffed9；哈希对象：registry-response；文件：SlideCommit.css、SlideCommit.jsx

---

## 弹弓拉动发送按钮 · Sling Button

案例ID：0358d2c8476d3047

来源：https://reactbits.dev/micro/sling-button

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

发送按钮像弹弓一样向后拉伸，力度弧线显示蓄力，释放后触发动作。

触发：向后拖动并释放

作用层：content

### 实现方法

Motion与SVG把拖动发送键表现为弹弓，拉力弧线和弹簧回弹对应拖动距离与释放状态。

1. 在React客户端引入锁定registry的SlingButton.css、SlingButton.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 记录按钮相对原点的拉伸，按armAt和maxPull计算有效蓄力，满足阈值释放后调用动作并回收绳线。
3. 使用源码已提供的padColor、iconColor、accentColor、wellColor、bandColor、size等属性配置；触发依据：向后拖动并释放。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：motion@^12.23.12、@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- padColor：锁定源码默认：'#f5f5f5'
- iconColor：锁定源码默认：'#18181b'
- accentColor：锁定源码默认：'#f5f5f5'
- wellColor：锁定源码默认：'#27272a'
- bandColor：锁定源码默认：'#52525b'
- size：锁定源码默认：56
- strokeWidth：锁定源码默认：3
- armAt：锁定源码默认：48
- maxPull：锁定源码默认：160
- launchSpeed：锁定源码默认：2600
- recoil：锁定源码默认：0.2
- flight：锁定源码默认：120
- particles：锁定源码默认：14
- spread：锁定源码默认：60
- axis：锁定源码默认：'any'
- tapSends：锁定源码默认：true
- disabled：锁定源码默认：false
- ariaLabel：锁定源码默认：'Send'

### 适用场景

- 创意聊天彩蛋
- 游戏化发送

避免用于：

- 效率优先的正式输入界面

### 限制与接入建议

- 不负责真实消息发送；应提供普通点击或键盘替代，避免拖动与页面滚动冲突。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/SlingButton-JS-CSS.json；资料核对时间：2026-10-25T07:53:14.573Z；SHA256：ce67a803086688738bb1724d7a61a8d67819c25a1b12f5f2ca1e35ae8b184c6c；哈希对象：registry-response；文件：SlingButton.css、SlingButton.jsx

---

## 晃动液位仪表 · Slosh Gauge

案例ID：55dbdee51563b644

来源：https://reactbits.dev/micro/slosh-gauge

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

液体以惯性追随数值，随速度倾斜，充满时拍打顶部，也可配置为竖向滑块。

触发：数值变化；可选竖向拖动

作用层：content

### 实现方法

CSS或DOM液面随数值改变目标高度，速度与惯性驱动倾斜及波浪，支持可选竖向拖动。

1. 在React客户端引入锁定registry的SloshGauge.css、SloshGauge.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 将值映射到容器液面高度，维护高度变化速度与衰减，满液位时处理顶部冲击，interactive才绑定拖动。
3. 使用源码已提供的defaultValue、interactive、showValue、disabled、liquidColor、glassColor等属性配置；触发依据：数值变化；可选竖向拖动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- defaultValue：锁定源码默认：60
- interactive：锁定源码默认：false
- showValue：锁定源码默认：true
- disabled：锁定源码默认：false
- liquidColor：锁定源码默认：'#f5f5f5'
- glassColor：锁定源码默认：'#27272a'
- width：锁定源码默认：88
- height：锁定源码默认：180
- radius：锁定源码默认：20
- ticks：锁定源码默认：4
- viscosity：锁定源码默认：0.15
- tilt：锁定源码默认：0.45
- splash：锁定源码默认：0.42
- unit：锁定源码默认：'%'
- ariaLabel：锁定源码默认：'Level'

### 适用场景

- 进度展示
- 趣味参数仪表

避免用于：

- 精确科学液位测量

### 限制与接入建议

- 液体仪表是数值外观，不是真实液体体积、温度或压力模拟。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/SloshGauge-JS-CSS.json；资料核对时间：2026-10-25T07:53:14.659Z；SHA256：6f74c9b6a98d6db68055394318319473d4655b8b1ebcafb16ae9883daafe949f；哈希对象：registry-response；文件：SloshGauge.css、SloshGauge.jsx

---

## 弹簧勾选待办 · Spring Check

案例ID：a0e9d2c9b324058e

来源：https://reactbits.dev/micro/spring-check

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

一次勾选同步填充方框、画出勾、划掉文字并淡化标签。

触发：点击复选框

作用层：content

### 实现方法

勾选状态同步驱动方框填色、SVG勾线绘制、标签划线与透明度，Motion弹簧统一安排反馈。

1. 在React客户端引入锁定registry的SpringCheck.css、SpringCheck.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 先维护checked业务值，再以同一状态更新box、check与label，disabled时禁止交互且保留语义选中态。
3. 使用源码已提供的label、defaultChecked、disabled、color、fillColor、checkColor等属性配置；触发依据：点击复选框。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12、@hugeicons/core-free-icons@^4.3.3

参数：

- label：锁定源码默认：'Ship the build'
- defaultChecked：锁定源码默认：false
- disabled：锁定源码默认：false
- color：锁定源码默认：'#ffffff'
- fillColor：锁定源码默认：'#ffffff'
- checkColor：锁定源码默认：'#0b0b0f'
- boxSize：锁定源码默认：28
- boxRadius：锁定源码默认：9
- fontSize：锁定源码默认：18
- bounce：锁定源码默认：0.2
- strikeLag：锁定源码默认：0.12
- doneOpacity：锁定源码默认：0.42
- strike：锁定源码默认：'left'

### 适用场景

- 待办清单
- 步骤检查项

避免用于：

- 未经确认的业务完成证明

### 限制与接入建议

- 动画不代表待办任务已经由后端完成，实际完成状态需调用方确认。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/SpringCheck-JS-CSS.json；资料核对时间：2026-10-25T07:53:14.736Z；SHA256：24b126702b5909ab961985ce25a26b1afbf5b44e165f2d819fd2227b935589af；哈希对象：registry-response；文件：SpringCheck.css、SpringCheck.jsx

---

## 挤压拖动开关 · Squish Switch

案例ID：3ef941163bbaa332

来源：https://reactbits.dev/micro/squish-switch

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

开关滑块随速度拉伸，过中点翻转，快速甩动后在轨道末端压缩回弹。

触发：拖动、点击或甩动

作用层：content

### 实现方法

Motion把开关滑块的拖动速度映射为横向拉长与末端压缩，跨过阈值后切换checked。

1. 在React客户端引入锁定registry的SquishSwitch.css、SquishSwitch.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 测量轨道有效行程，点击或拖动更新目标，释放时依据位置和速度决定吸附，再用弹簧恢复形状。
3. 使用源码已提供的defaultChecked、label、disabled、trackColor、trackOnColor、thumbColor等属性配置；触发依据：拖动、点击或甩动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12

参数：

- defaultChecked：锁定源码默认：false
- label：锁定源码默认：''
- disabled：锁定源码默认：false
- trackColor：锁定源码默认：'#27272a'
- trackOnColor：锁定源码默认：'#f5f5f5'
- thumbColor：锁定源码默认：''
- thumbOnColor：锁定源码默认：''
- width：锁定源码默认：76
- height：锁定源码默认：38
- radius：锁定源码默认：19
- speed：锁定源码默认：50
- stretch：锁定源码默认：36
- hoverScale：锁定源码默认：1.035
- colorDuration：锁定源码默认：320

### 适用场景

- 偏好开关
- 轻量设置

避免用于：

- 没有语义状态的纯装饰开关

### 限制与接入建议

- 仅是开关交互，实际设置修改、权限和失败回滚需要业务接入。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/SquishSwitch-JS-CSS.json；资料核对时间：2026-10-25T07:53:14.942Z；SHA256：402ed23b6b08261391188cb4bf267535089b853f2f0184ab8dda991a2f777910；哈希对象：registry-response；文件：SquishSwitch.css、SquishSwitch.jsx

---

## 就地变形任务图标 · Status Mark

案例ID：103e215ede8c0764

来源：https://reactbits.dev/micro/status-mark

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

小状态图标从虚线待机环变为旋转或真实进度弧，结束时在原位画勾或叉。

触发：任务状态或进度更新

作用层：content

### 实现方法

SVG状态标记从虚线环、旋转或进度弧过渡到原位勾叉，形变与路径长度对应外部状态。

1. 在React客户端引入锁定registry的StatusMark.css、StatusMark.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 用status选择idle、running、done或error，按进度值绘制弧长，完成后交接到勾叉而保持标记占位。
3. 使用源码已提供的status、color、doneColor、errorColor、size、strokeWidth等属性配置；触发依据：任务状态或进度更新。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12

参数：

- status：锁定源码默认：'pending'
- color：锁定源码默认：'currentColor'
- doneColor：锁定源码默认：'#22c55e'
- errorColor：锁定源码默认：'#ef4444'
- size：锁定源码默认：20
- strokeWidth：锁定源码默认：2
- dashes：锁定源码默认：8
- fontSize：锁定源码默认：14
- spinDuration：锁定源码默认：1100
- arcLength：锁定源码默认：0.68
- drawDuration：锁定源码默认：240
- fillOpacity：锁定源码默认：0.06
- strike：锁定源码默认：true
- strikeDelay：锁定源码默认：60

### 适用场景

- 工作流步骤
- 智能体任务行

避免用于：

- 真实状态不可知的成功展示

### 限制与接入建议

- 不可通过本地计时假装任务成功；颜色和图形需同时表达状态。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/StatusMark-JS-CSS.json；资料核对时间：2026-10-25T07:53:15.033Z；SHA256：702ecb289c082431602f240173cd048c6e6b5e43c3835d776d094e5db5461075；哈希对象：registry-response；文件：StatusMark.css、StatusMark.jsx

---

## 滑动露出操作列表行 · Swipe Row

案例ID：3d48bb81a1221c5a

来源：https://reactbits.dev/micro/swipe-row

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

列表行左右滑动显露操作，快速甩动吸附，完整滑动以操作色铺满并移除条目。

触发：拖动或甩动列表行

作用层：content

### 实现方法

Motion让列表行横向位移以露出操作抽屉，释放速度决定吸附，完整滑动可触发动作并移除行。

1. 在React客户端引入锁定registry的SwipeRow.css、SwipeRow.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按actions与actionWidth布置抽屉，追踪拖动距离和速度，满足full-swipe阈值后才调用指定业务回调。
3. 使用源码已提供的actions、actionColor、drawerColor、rowColor、textColor、height等属性配置；触发依据：拖动或甩动列表行。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12、@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- actions：锁定源码默认：DEFAULT_ACTIONS
- actionColor：锁定源码默认：'#e5484d'
- drawerColor：锁定源码默认：'#3f3f46'
- rowColor：锁定源码默认：'#27272a'
- textColor：锁定源码默认：'#f5f5f5'
- height：锁定源码默认：64
- radius：锁定源码默认：16
- actionWidth：锁定源码默认：80
- direction：锁定源码默认：'left'
- snapBounce：锁定源码默认：0.2
- resistance：锁定源码默认：0.55
- collapseMs：锁定源码默认：200
- commitAt：锁定源码默认：0.6
- fullSwipe：锁定源码默认：true
- disabled：锁定源码默认：false
- closeOnAction：锁定源码默认：true
- haptic：锁定源码默认：true
- label：锁定源码默认：'List item'

### 适用场景

- 消息或任务列表
- 移动端轻量操作

避免用于：

- 不可逆的隐藏删除入口

### 限制与接入建议

- 滑动不能成为删除等操作的唯一入口；误触与真正数据撤销需业务处理。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/SwipeRow-JS-CSS.json；资料核对时间：2026-10-25T07:53:15.101Z；SHA256：d71d0f524da1f7e766193f3aea7da3b8903fd8bd542f565d13bfc1d214514f1d；哈希对象：registry-response；文件：SwipeRow.css、SwipeRow.jsx

---

## 可滑走的倒计时提示 · Swipe Toast

案例ID：917bbb2e4c0525fc

来源：https://reactbits.dev/micro/swipe-toast

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

提示从底部升起，细线显示剩余时间，悬停暂停，可向下甩动关闭。

触发：提示出现；悬停；向下滑动

作用层：content

### 实现方法

提示条从边缘进入并显示剩余时间，悬停暂停倒计时，拖动下滑或动作回调关闭。

1. 在React客户端引入锁定registry的SwipeToast.css、SwipeToast.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 由open控制生命周期，以duration或计时状态计算细线，暂停与恢复累计剩余时间，关闭后清理定时器。
3. 使用源码已提供的title、description、actionLabel、open、background、color等属性配置；触发依据：提示出现；悬停；向下滑动。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：motion@^12.23.12、@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- title：锁定源码默认：'File archived'
- description：锁定源码默认：''
- actionLabel：锁定源码默认：''
- open：锁定源码默认：true
- background：锁定源码默认：'#27272a'
- color：锁定源码默认：'#f5f5f5'
- fuseColor：锁定源码默认：'#f5a524'
- width：锁定源码默认：356
- radius：锁定源码默认：12
- slideMs：锁定源码默认：400
- settleBounce：锁定源码默认：0.2
- swipeDistance：锁定源码默认：40
- duration：锁定源码默认：4000
- fuse：锁定源码默认：'bottom'
- pauseOnHover：锁定源码默认：true
- closeButton：锁定源码默认：false
- inline：锁定源码默认：false
- dismissible：锁定源码默认：true

### 适用场景

- 操作反馈
- 轻量任务通知

避免用于：

- 不可恢复的重要故障说明

### 限制与接入建议

- 短时提示不能承载唯一关键错误信息，应有可再次访问的状态或记录。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/SwipeToast-JS-CSS.json；资料核对时间：2026-10-25T07:53:15.192Z；SHA256：236de0dc2a7f2f9e83c3601fb7181c2be52f20b9d7e530d38172ae6dc7072bff；哈希对象：registry-response；文件：SwipeToast.css、SwipeToast.jsx

---

## 手撕票根卡片 · Tear Ticket

案例ID：19c7ddbb6be306f8

来源：https://reactbits.dev/micro/tear-ticket

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

拖动票根时纸纤维逐根拉断，锯齿边缘形成撕口，票根悬落，主体盖上已使用印记。

触发：拖动票根撕开；悬停产生视差

作用层：content

### 实现方法

DOM票根与SVG纤维连线随拖动逐段断开，票根旋转下落，主体在撕开后显示已使用视觉状态。

1. 在React客户端引入锁定registry的TearTicket.css、TearTicket.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 按orientation布置主体与stub，记录拖动位移和纤维阈值，撕开完成后调用回调并安排票根退场。
3. 使用源码已提供的stub、image、imageAlt、scrim、imageRadius、orientation等属性配置；触发依据：拖动票根撕开；悬停产生视差。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：motion@^12.23.12

参数：

- children：锁定源码默认：null
- stub：锁定源码默认：null
- image：锁定源码默认：''
- imageAlt：锁定源码默认：''
- scrim：锁定源码默认：true
- imageRadius：锁定源码默认：8
- orientation：锁定源码默认：'horizontal'
- defaultTorn：锁定源码默认：false
- width：锁定源码默认：460
- height：锁定源码默认：250
- stubSize：锁定源码默认：150
- radius：锁定源码默认：16
- holes：锁定源码默认：12
- holeSize：锁定源码默认：6
- notch：锁定源码默认：3
- roughness：锁定源码默认：0
- tearAngle：锁定源码默认：30
- stretch：锁定源码默认：30
- resistance：锁定源码默认：0.45
- rotate：锁定源码默认：4
- tilt：锁定源码默认：true
- tiltMax：锁定源码默认：9
- tiltReach：锁定源码默认：260
- parallax：锁定源码默认：6
- perspective：锁定源码默认：1000
- background：锁定源码默认：'#27272a'
- color：锁定源码默认：'#f5f5f5'
- border：锁定源码默认：true
- borderColor：锁定源码默认：''
- borderWidth：锁定源码默认：1
- stubBackground：锁定源码默认：''
- recenter：锁定源码默认：true
- disabled：锁定源码默认：false
- ariaLabel：锁定源码默认：'Tear off the stub'

### 适用场景

- 活动票券演示
- 趣味领取卡

避免用于：

- 真实票券核销的唯一依据

### 限制与接入建议

- 视觉撕开不等于真实核销、支付或优惠券生效，需服务端确认业务状态。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/TearTicket-JS-CSS.json；资料核对时间：2026-10-25T07:53:15.274Z；SHA256：a9588a685c0113de25c0a7e86a35574b72ab01ceb6876a9211fe4ca451f171b8；哈希对象：registry-response；文件：TearTicket.css、TearTicket.jsx

---

## 思考过程折叠标题 · Thought Line

案例ID：187e7f7bde53d65c

来源：https://reactbits.dev/micro/thought-line

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

思考时图标与标题呼吸，计时与步骤展开，结束后淡变为耗时并收拢过程。

触发：思考开始、步骤更新与完成

作用层：content

### 实现方法

状态标题按思考开始、步骤更新和结束维护计时及折叠，图标呼吸与文案变化对应外部进程。

1. 在React客户端引入锁定registry的ThoughtLine.css、ThoughtLine.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 以steps建立可展开过程，运行时计时并更新图标，结束后替换为耗时，collapseOnSettle决定是否收拢。
3. 使用源码已提供的label、doneLabel、glyph、steps、collapsible、collapseOnSettle等属性配置；触发依据：思考开始、步骤更新与完成。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12、@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- label：锁定源码默认：'Thinking…'
- doneLabel：锁定源码默认：''
- glyph：锁定源码默认：'sparkle'
- steps：锁定源码默认：EMPTY_STEPS
- collapsible：锁定源码默认：true
- collapseOnSettle：锁定源码默认：true
- color：锁定源码默认：'currentColor'
- glyphColor：锁定源码默认：''
- fontSize：锁定源码默认：16
- breathPeriod：锁定源码默认：1.6
- breathDepth：锁定源码默认：0.45
- shimmer：锁定源码默认：true
- shimmerDuration：锁定源码默认：1.8
- settleDuration：锁定源码默认：350
- settleBlur：锁定源码默认：2
- working：锁定源码默认：true
- settleAfter：锁定源码默认：0
- showTimer：锁定源码默认：true

### 适用场景

- 智能体任务摘要
- 多步骤工具反馈

避免用于：

- 伪造模型思考内容

### 限制与接入建议

- 组件只展示提供的过程，不能编造模型内部推理、步骤或真实执行进度。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/ThoughtLine-JS-CSS.json；资料核对时间：2026-10-25T07:53:15.494Z；SHA256：738f91626ddf1d27ab15c78cf8cee3c309d57635f910dd8dccb41017fe954355；哈希对象：registry-response；文件：ThoughtLine.css、ThoughtLine.jsx

---

## 语音电平胶囊按钮 · Voice Pill

案例ID：96f6dfa483d63b00

来源：https://reactbits.dev/micro/voice-pill

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

麦克风按钮在按住或切换时伸为胶囊，显示电平条和计时，结束后缩回；默认使用模拟语音。

触发：按住或切换录音状态；真实麦克风需单独启用

作用层：content

### 实现方法

麦克风按钮根据按住或切换状态伸展为胶囊，绘制音量条与计时，结束或取消后缩回。

1. 在React客户端引入锁定registry的VoicePill.css、VoicePill.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 维护录音交互状态与取消手势，默认模拟波形；实际麦克风分支须明确启用并把真实电平传入显示。
3. 使用源码已提供的accentColor、iconColor、background、size、shape、reach等属性配置；触发依据：按住或切换录音状态；真实麦克风需单独启用。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：@hugeicons/react@^1.1.10、@hugeicons/core-free-icons@^4.3.3

参数：

- accentColor：锁定源码默认：'#f5f5f5'
- iconColor：锁定源码默认：'#a1a1aa'
- background：锁定源码默认：'#27272a'
- size：锁定源码默认：28
- shape：锁定源码默认：'pill'
- reach：锁定源码默认：8
- showTime：锁定源码默认：true
- waveform：锁定源码默认：true
- slideToCancel：锁定源码默认：true
- cancelDistance：锁定源码默认：64
- attack：锁定源码默认：40
- release：锁定源码默认：240
- sensitivity：锁定源码默认：1
- floor：锁定源码默认：0.1
- openDuration：锁定源码默认：200
- pressScale：锁定源码默认：0.95
- mode：锁定源码默认：'auto'
- holdAfter：锁定源码默认：300
- reactive：锁定源码默认：'simulated'
- disabled：锁定源码默认：false
- ariaLabel：锁定源码默认：'Dictate'

### 适用场景

- 智能体语音输入演示
- 聊天录音控制

避免用于：

- 暗中开启麦克风或声称已转写

### 限制与接入建议

- 默认演示不是语音识别；真实麦克风需要用户授权、停止清理与单独的识别服务。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。
- 真实摄像头或麦克风分支必须单独授权并清理媒体轨道；默认演示不代表已获取用户媒体或已接入识别服务。

手机：项目接入建议：保持真实DOM操作和触控尺寸，以点击与焦点状态提供等价反馈，不把核心内容或状态仅放在hover里。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：控制Canvas像素面积与元素密度，缓存字体和图形测量，按需要节流重绘，离屏暂停并清理本实例资源。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/VoicePill-JS-CSS.json；资料核对时间：2026-10-25T07:53:15.562Z；SHA256：09886aa376b01353a0d4ded4ce130960832414c7fd7a269dd2a0c457152b9a43；哈希对象：registry-response；文件：VoicePill.css、VoicePill.jsx

---

## 尾波条形滑动条 · Wake Slider

案例ID：0ffadba3589467d7

来源：https://reactbits.dev/micro/wake-slider

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

细条组成无传统把手的滑块，拖动速度激起滞后的尾波，静止时重新铺平。

触发：拖动滑动条

作用层：content

### 实现方法

Motion驱动一排竖条围绕滑块当前位置形成速度相关尾波，静止后条高恢复，值保持规范化。

1. 在React客户端引入锁定registry的WakeSlider.css、WakeSlider.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 将指针横坐标映射到min/max与step，按拖动速度计算邻条延迟抬升，松手后以弹簧收回波形。
3. 使用源码已提供的defaultValue、min、max、step、bars、height等属性配置；触发依据：拖动滑动条。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例时间线、定时器与事件；保留语义和真实业务状态。

依赖：motion@^12.23.12

参数：

- defaultValue：锁定源码默认：50
- min：锁定源码默认：0
- max：锁定源码默认：100
- step：锁定源码默认：1
- bars：锁定源码默认：32
- height：锁定源码默认：56
- restHeight：锁定源码默认：12
- gap：锁定源码默认：4
- fillColor：锁定源码默认：'#f5f5f5'
- trackColor：锁定源码默认：'#27272a'
- crestColor：锁定源码默认：''
- sensitivity：锁定源码默认：1
- reach：锁定源码默认：6
- skew：锁定源码默认：0.6
- glide：锁定源码默认：0.3
- smoothing：锁定源码默认：100
- showValue：锁定源码默认：false
- disabled：锁定源码默认：false
- ariaLabel：锁定源码默认：'Value'

### 适用场景

- 音量或强度调节
- 创意参数面板

避免用于：

- 真实音频测量仪表

### 限制与接入建议

- 尾波表示交互速度，不是真实音频电平；需额外显示精确当前值与键盘调整。
- 接入限制：业务值、实际执行、持久化与接口错误由宿主提供；界面动画不能作为真实服务成功的证明。

手机：项目接入建议：为拖动区域与页面滚动明确分工，触控目标保持易点按，并提供点击、按钮或数值输入等可访问替代，不只依赖手势。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/WakeSlider-JS-CSS.json；资料核对时间：2026-10-25T07:53:15.626Z；SHA256：db8b340f6494e99daf13d8342c10e0d3a71743f3b59287c95598baa1673d3a01；哈希对象：registry-response；文件：WakeSlider.css、WakeSlider.jsx

---

## 连续温热提示组 · Warm Tooltip

案例ID：01d55334d91cbac4

来源：https://reactbits.dev/micro/warm-tooltip

资料性质：官方源码机制整理（静态分析，未在目标工程运行）

### 具体行为与作用层

首个悬停提示稍候弹出，同组下一项即时出现，可带随移动速度变化的倾斜。

触发：首次悬停延迟；同组相邻悬停即时提示

作用层：content

### 实现方法

Portal与Motion把同组提示的延迟共享，首次悬停等待、连续项快速切换，指针速度可带动轻微倾斜。

1. 在React客户端引入锁定registry的WarmTooltip.css、WarmTooltip.jsx，按dependencies安装实际外部依赖，容器尺寸与资源地址由页面工程提供。
2. 在分组状态中维护warm窗口，进入目标时决定延迟并定位浮层，移出或Escape关闭，目标切换时复用过渡。
3. 以源码实际接口和受控状态配置；触发依据：首次悬停延迟；同组相邻悬停即时提示。业务数据、额外按钮或新触发方式均须标为接入适配。
4. 项目接入建议：限制在content层，保留原有正文、输入与布局；卸载时清理本实例requestAnimationFrame、定时器和事件监听，避免后台空转。

依赖：react-dom@^19.0.0、motion@^12.23.12

参数：

未提取原始默认值，不自行补造。

### 适用场景

- 图标工具栏说明
- 辅助标签

避免用于：

- 触屏唯一的功能说明

### 限制与接入建议

- 提示只能补充说明，核心操作文案不可仅在悬停显示；需同时支持键盘焦点。
- 接入限制：滚动容器、内容高度与触发区间必须匹配；字体或图像加载后需重新测量，避免移动端短屏出现跳动。

手机：项目接入建议：检查短屏滚动行程、内部滚动与外部页面的分工，适度减少可见层数，保留全部内容和可直接操作入口。

减少动态：项目接入建议：遵循用户暂停和prefers-reduced-motion；由宿主提供暂停或静态状态并停止持续时间线，以稳定最终状态保留可读内容与功能，不将此建议冒称源码原生已实现。

性能：项目接入建议：缓存尺寸测量，尽量用transform和opacity完成过渡，避免每帧React重渲染或反复强制布局，限制重复DOM和同时运动项。

依据catalog锁定commit e2eb04d89d5be5a633dba7b2d4adfd274e053767的官方registry源码整理；源码已实际获取并静态分析，未在目标工程安装或执行。适用场景、限制和接入建议属于项目编辑说明；参数为AST提取的原始默认表达式，不代表推荐最终取值。

### 依据

- registry：https://raw.githubusercontent.com/DavidHDev/react-bits/e2eb04d89d5be5a633dba7b2d4adfd274e053767/public/r/WarmTooltip-JS-CSS.json；资料核对时间：2026-10-25T07:53:15.730Z；SHA256：6e18db0ad81ff4154f4c33e7886c4bd5b8c7c419b0fc54deb463c268aa8b6050；哈希对象：registry-response；文件：WarmTooltip.css、WarmTooltip.jsx

---

## 按下有弹性的分类胶囊 · Airbnb Tactile Tab Button Interaction

案例ID：acbbbd63d54c2f9b

来源：https://60fps.design/shots/airbnb-tactile-tab-button-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

横向分类胶囊在点击时轻微压缩，选中底色平滑移到新项目；下方先显示内容骨架，再交叉淡入对应列表，分类与内容切换形成一个连续动作。

触发：点击分类标签，先显示按压反馈，再切换选中状态和下方内容

作用层：layout、surface、content

### 实现方法

分类胶囊按下压缩，活动底板迁移，下方骨架与内容完成连续交接。

1. 为分类和内容建立稳定选中索引
2. pointerdown立即缩小目标胶囊，松手恢复
3. 共享布局过渡活动背景到新标签
4. 真实加载时显示骨架，内容就绪后交叉淡入

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：移动端分类导航
- 项目适配场景：信息流顶部

避免用于：

- 分类变化不能触发任何内容切换的装饰菜单

### 限制与接入建议

- 骨架必须关联真实加载或明确演示，不应每次点击固定假装等待；活动项与焦点语义保持同步。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：触屏无需hover即可看到主要信息与操作；按容器重排并提供足够命中区，状态变化保持可理解。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/airbnb-tactile-tab-button-interaction；资料核对时间：2026-10-12T08:09:49.927Z；SHA256：8eab7dd68fca0b16e82b145adf392db287fe7b366187a89d89d901b385693e05；哈希对象：page-response

---

## 下拉收起的全屏播放器 · Apple Music Player Controls Collapse Interaction

案例ID：a75cbb8f1792076b

来源：https://60fps.design/shots/apple-music-player-controls-collapse-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

向下拖动播放器面板时，它紧跟手势下移，背后的页面逐渐放大并解除遮罩；拖过阈值松手后，面板带弹性减速退出，回到主页面。

触发：向下拖拽全屏面板；松手超过阈值后关闭

作用层：layout、content

### 实现方法

全屏面板下拉时随手势移动，背景恢复缩放与亮度，超阈值松手收起。

1. 建立open、dragging与closing状态并保存拖动起点
2. pointer capture跟随向下位移，内部滚动到顶后才接管
3. 位移比例联动背景缩放和遮罩透明度
4. 松手按位置与速度选择关闭或回弹，关闭后恢复触发焦点

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：移动端播放器
- 项目适配场景：可下拉关闭的详情面板

避免用于：

- 没有关闭替代按钮或内部滚动会误触退出的详情

### 限制与接入建议

- 网页不能直接复刻iOS系统级手势；阈值和弹簧参数须按目标设备实测，内部滚动与面板拖动要分派。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：使用Pointer Events区分点击、拖动与内部滚动；处理pointercancel、安全区和软键盘变化；始终提供可点击/键盘操作的同等替代。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/apple-music-player-controls-collapse-interaction；资料核对时间：2026-10-12T08:09:50.126Z；SHA256：1d05a3dfd190a16483b998f7d86e52fbf1bb8420adf84261bc7a30d164d90632；哈希对象：page-response

---

## 弹起后退到队尾的照片堆 · Airbnb Photo Pop and Slide Animation

案例ID：8bcbfcc3839721fb

来源：https://60fps.design/shots/airbnb-photo-pop-and-slide-animation

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

操作照片堆时，最上面的照片先放大、旋转并向上滑出，再退到叠层后方；余下照片向前补位，形成可以循环浏览的有厚度相册。

触发：操作照片堆触发顶部卡片换位，其余卡片同步前移

作用层：content、surface

### 实现方法

照片堆顶卡先弹起转动，再退出到队尾，其余照片同步补位。

1. 为照片顺序、当前顶卡和切换阶段建状态
2. 顶卡先放大并向上旋出
3. 退出结束后把顶卡移到队尾
4. 其余卡按新索引过渡位置、缩放与层级

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：照片画廊
- 项目适配场景：目的地介绍
- 项目适配场景：作品卡片堆

避免用于：

- 所有照片都必须同时完整可见的对照页面

### 限制与接入建议

- 换序必须发生在适当动画阶段避免瞬间跳层；照片说明和手动前后切换需直接可用。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：触屏无需hover即可看到主要信息与操作；按容器重排并提供足够命中区，状态变化保持可理解。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/airbnb-photo-pop-and-slide-animation；资料核对时间：2026-10-12T08:09:50.202Z；SHA256：0f275b335b3fd63534892200fafe71b11599d76b58cee3e8ace168c34b4a1984；哈希对象：page-response

---

## 人数增加时弹出的小人物 · Airbnb Add Guests in Sheet Interaction

案例ID：d349e6e81ac0f421

来源：https://60fps.design/shots/airbnb-add-guests-in-sheet-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

底部人数面板点击加号时，数字更新并有新人物从底部弹入横向队列，原人物向左让位保持居中；原案例增加到16人以上会出现羊驼彩蛋。

触发：点击人数加号逐个新增人物；原案例16+触发彩蛋

作用层：content、layout

### 实现方法

人数面板的数值增加与人物队列弹入、横向让位形成因果反馈。

1. 建立人数数值和可见人物队列
2. 点击加号先更新合法人数并生成入场人物
3. 队列整体横移保持焦点居中
4. 减少人数时移除末项并反向补位

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：预约人数选择
- 项目适配场景：多人活动表单

避免用于：

- 人数大范围输入却用无限人物堆叠造成混乱的表单

### 限制与接入建议

- 16+羊驼只是原产品彩蛋，不是业务必需；不能让人物队列成为唯一人数读数。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：使用Pointer Events区分点击、拖动与内部滚动；处理pointercancel、安全区和软键盘变化；始终提供可点击/键盘操作的同等替代。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/airbnb-add-guests-in-sheet-interaction；资料核对时间：2026-10-12T08:09:50.367Z；SHA256：ec24043aec389a009a42c69695bf1e5e30499f8a5fa932c6693e91673dd836c9；哈希对象：page-response

---

## 键盘与选项面板顺滑接替 · Linear Issue Actions Popup Interaction

案例ID：b49c756b6c31c240

来源：https://60fps.design/shots/linear-issue-actions-popup-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

创建任务时点击优先级、团队或标签，系统键盘向下退出，选项面板从底部接替上来；选择或关闭后，选项面板退下，键盘回到原处。

触发：点击元数据按钮切换键盘与选项面板；选择或关闭后返回输入

作用层：layout、content

### 实现方法

输入时选项面板接替键盘占据底部空间，选完后回到原输入上下文。

1. 记录当前输入焦点和选择字段
2. 点击元数据入口时blur输入并打开网页底部选项层
3. 选择后保存值并收起面板
4. 在用户操作允许时恢复输入焦点并保持草稿

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：移动端任务创建
- 项目适配场景：带辅助选项的输入表单

避免用于：

- 必须程序化控制系统键盘每帧运动的网页

### 限制与接入建议

- 网页无法精确控制系统键盘动画或高度；需用VisualViewport与实际设备校验，不能承诺无缝接管iOS键盘。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：使用Pointer Events区分点击、拖动与内部滚动；处理pointercancel、安全区和软键盘变化；始终提供可点击/键盘操作的同等替代。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/linear-issue-actions-popup-interaction；资料核对时间：2026-10-12T08:09:51.220Z；SHA256：26f31ca45ae2b87bfdc059b51d2079a506566a688f6fdc7fdd923d230a6c470c；哈希对象：page-response

---

## 沿圆环拖动的数值选择器 · Revolut RevPoints Circular Slider Interaction

案例ID：4af56fa95058067f

来源：https://60fps.design/shots/revolut-revpoints-circular-slider-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

拖动圆环上的滑块时，弧形进度跟着绘出，中央倍数在吸附到整数时弹跳；原案例达到最大值后，圆心由蓝色扩散填满并出现徽章，下方数值同步更新。

触发：沿圆形轨道拖动滑块；整数吸附和最大值触发对应反馈

作用层：content、surface

### 实现方法

圆环拖动映射数值与弧长，整数吸附给读数反馈，最大值触发中心庆祝。

1. 用圆心和pointer坐标计算归一化角度
2. 把角度映射到受限数值并绘制SVG弧长
3. 靠近整数时吸附并短暂强调中央读数
4. 达到最大值时播放一次中心扩散并保持最终值

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：数值调节
- 项目适配场景：额度或倍率选择

避免用于：

- 要求非常精确连续小数输入却没有数字输入替代的控件

### 限制与接入建议

- 角度跨0度边界和拖动方向需处理；颜色/庆祝不应替代实际数值，也不包含真实积分业务。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：使用Pointer Events区分点击、拖动与内部滚动；处理pointercancel、安全区和软键盘变化；始终提供可点击/键盘操作的同等替代。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/revolut-revpoints-circular-slider-interaction；资料核对时间：2026-10-12T08:09:51.384Z；SHA256：afefa1044a3108665fc0b500b2d12093265722a1976780136d308ecbc9c5eb67；哈希对象：page-response

---

## 展开后变高的嵌套选项面板 · Perplexity Model Selection Sheet Morph Interaction

案例ID：fee04c2c29ab4679

来源：https://60fps.design/shots/perplexity-model-selection-sheet-morph-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

先从底部打开模式选择面板并模糊背景，再点击模型入口时，同一面板伸高显示逐项淡入的模型列表；选好后面板缩回原高度并更新结果。

触发：点击模式入口打开；点击模型入口扩展；选择后缩回

作用层：layout、content

### 实现方法

同一底部面板从模式选择伸高为模型列表，选择后收回并更新原字段。

1. 建立closed、mode与model三级视图状态
2. 打开时锁定背景滚动并显示遮罩
3. 切到model时在同一容器过渡高度并错相显示列表
4. 选中后更新实际选项并回到mode，保留关闭入口

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：模型选择
- 项目适配场景：移动端设置
- 项目适配场景：多级选项

避免用于：

- 把展示型号清单冒充已获得模型调用权限的产品

### 限制与接入建议

- 面板内焦点与返回层级要明确；模型列表是传入数据，不代表已经接入这些模型。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：使用Pointer Events区分点击、拖动与内部滚动；处理pointercancel、安全区和软键盘变化；始终提供可点击/键盘操作的同等替代。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/perplexity-model-selection-sheet-morph-interaction；资料核对时间：2026-10-12T08:09:51.481Z；SHA256：5ef43d70546a27e04125ee7f6cd927b1acef6883bb738a8d6d75b7ca760a5e2d；哈希对象：page-response

---

## 完成后统一庆祝的任务清单 · Google Todo Check Interaction

案例ID：e336505a427b4e3d

来源：https://60fps.design/shots/google-todo-check-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

任务清单中的未完成项显示转圈，完成时圆形等待图标弹性变为勾选；所有项结束后，顶部插画活动起来，标题更新，主要行动按钮从底部滑入。

触发：任务状态从处理中变为完成；全部完成触发整体收尾反馈

作用层：content、layout

### 实现方法

单项处理图标转为勾选，全部完成后出现统一插画、标题与行动按钮。

1. 以真实任务状态保存pending、running、done或error
2. 每项完成后过渡等待圆环为勾选
3. 仅全部任务满足成功条件时进入overall-done
4. 整体收尾插画与行动入口一次入场，失败项允许重试

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：新手引导
- 项目适配场景：设置检查清单
- 项目适配场景：准备任务页

避免用于：

- 用完成动画替代真实任务状态的进度流程

### 限制与接入建议

- 不能按计时器把真实失败任务自动标为完成；庆祝后仍要显示清单结果与错误。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：触屏无需hover即可看到主要信息与操作；按容器重排并提供足够命中区，状态变化保持可理解。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/google-todo-check-interaction；资料核对时间：2026-10-12T08:09:51.657Z；SHA256：91136e70c30135f87b4db7112cda7db043b700527afbf2e5dc4aad1fd739a245；哈希对象：page-response

---

## 从搜索条铺开的全屏界面 · Google AI Mode Search Morph Interaction

案例ID：64c0e568d28654ea

来源：https://60fps.design/shots/google-ai-mode-search-morph-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

点击搜索条里的AI入口后，紧凑输入条形变扩展为全屏搜索界面，背景转暗，建议胶囊和键盘滑入；退出时界面缩回原搜索条。

触发：点击搜索条中的入口展开；返回操作逆向收回

作用层：layout、content

### 实现方法

紧凑搜索入口扩展为全屏搜索视图，背景变暗，建议和输入区域接续出现。

1. 保存入口元素的起始矩形和返回焦点
2. 展开为独立全屏层并共享几何过渡
3. 显示建议胶囊并聚焦实际输入
4. 退出时逆向缩回入口并恢复页面滚动位置

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：移动端搜索
- 项目适配场景：AI工具入口

避免用于：

- 缺少可返回入口或把原始草稿覆盖掉的全屏搜索

### 限制与接入建议

- 键盘出现受浏览器用户手势限制，不能保证程序化自动弹出；搜索能力需业务接入。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：触屏无需hover即可看到主要信息与操作；按容器重排并提供足够命中区，状态变化保持可理解。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/google-ai-mode-search-morph-interaction；资料核对时间：2026-10-12T08:09:52.486Z；SHA256：41210d70dcafe2500da99147873c52aeacd1faf35346df4f071799c85724aaac；哈希对象：page-response

---

## 展开进度卡并推开内容的状态栏 · Google Photos Logo Spin to Backup Loader Animation

案例ID：d7999f6a0d76dfe0

来源：https://60fps.design/shots/google-photos-logo-spin-to-backup-loader-animation

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

顶部备份状态行点击后向下展开成详细卡片，露出圆形进度、剩余时间和说明；下面的内容随面板扩展平滑下移，而不是被突然遮住。

触发：点击顶部备份状态入口展开进度卡

作用层：layout、content

### 实现方法

顶部状态行展开为带进度与说明的卡片，下方内容随着高度变化平滑下移。

1. 将简略状态行与详情卡放在正常文档流中
2. 点击切换expanded并过渡容器高度
3. 同步显示任务进度、剩余时间与说明
4. 完成或收起后恢复简略行，保留当前滚动锚点

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：上传状态
- 项目适配场景：同步进度
- 项目适配场景：顶部任务状态

避免用于：

- 必须悬浮覆盖而不推动下方内容的通知提示

### 限制与接入建议

- 记录对应展开状态而非根据slug推断Logo旋转；进度与剩余时间须真实或标注模拟。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：使用Pointer Events区分点击、拖动与内部滚动；处理pointercancel、安全区和软键盘变化；始终提供可点击/键盘操作的同等替代。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/google-photos-logo-spin-to-backup-loader-animation；资料核对时间：2026-10-12T08:09:52.638Z；SHA256：77095cc4cb26616997b9ceb7ecc4d074f78c64fe1744157c3aeceb50a22bb28d；哈希对象：page-response

---

## 竖向流动的能力介绍清单 · Notion AI Sheet Intro Action Trail Transition

案例ID：5e5b3722d2eb3996

来源：https://60fps.design/shots/notion-ai-sheet-intro-action-trail-transition

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

引导底部面板中多条能力胶囊持续向上滚动，左侧角色插画保持固定，底部行动按钮始终可见；用流动清单展示工具能完成的不同任务。

触发：打开引导面板后能力胶囊自动持续向上移动

作用层：layout、content

### 实现方法

固定角色旁的能力胶囊持续竖向流动，底部主行动入口保持静止。

1. 在底部介绍面板中分开固定角色和滚动能力列
2. 复制胶囊序列形成可循环轨道
3. 线性向上移动并在遮罩边缘淡出
4. 主行动按钮独立固定，暂停后仍能读到能力说明

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：工具能力引导
- 项目适配场景：移动端入门面板

避免用于：

- 每项文案都需完整精读的合同或教程步骤

### 限制与接入建议

- 能力文案只描述实际支持功能；自动流动需可暂停，重复节点不应被读屏重复朗读。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：触屏无需hover即可看到主要信息与操作；按容器重排并提供足够命中区，状态变化保持可理解。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/notion-ai-sheet-intro-action-trail-transition；资料核对时间：2026-10-12T08:09:52.777Z；SHA256：41dcb67c5165e685e721fd01c07952291bfbb8f54a7eddd2a88895dc1338c3c9；哈希对象：page-response

---

## 随设备倾斜反光的身份卡 · Airbnb Identity Verification Card Flip Scan Interaction

案例ID：7a2ac53756b4c164

来源：https://60fps.design/shots/airbnb-identity-verification-card-flip-scan-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

点击人物页的认证徽章后进入立体身份卡，卡片随手机倾斜旋转，表面全息光泽显露安全水印；返回时卡片顺滑收回个人页里的原位置。

触发：点击徽章展开；设备陀螺仪倾斜控制卡片角度；返回收起

作用层：surface、content、outer-glow

### 实现方法

认证入口展开为立体卡片，设备倾斜改变卡面角度与全息反光，返回收回原位。

1. 保存徽章与展开卡的共享位置关系
2. 点击后显示独立卡片层
3. 经用户授权的设备方向或指针输入映射受限倾角和反光
4. 关闭时复位并缩回徽章，提供无传感器替代

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：移动端认证展示
- 项目适配场景：数字会员卡

避免用于：

- 把装饰卡片等同真实身份证明或安全认证的业务

### 限制与接入建议

- 设备方向权限仅部分浏览器支持且需用户授权；动画不证明身份已认证，真实身份状态由后端给出。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：使用Pointer Events区分点击、拖动与内部滚动；处理pointercancel、安全区和软键盘变化；始终提供可点击/键盘操作的同等替代。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/airbnb-identity-verification-card-flip-scan-interaction；资料核对时间：2026-10-12T08:09:52.921Z；SHA256：20670d16d6871f274de516c4a1c996551cad8e24cb431027a9fca29d01108831；哈希对象：page-response

---

## 背景跟随徽章换色的展示轮播 · GitHub Badges Showcase Interaction

案例ID：094ec132bb2affc0

来源：https://60fps.design/shots/github-badges-showcase-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

徽章在弹层中横向轮播，滑动时立体图形轻微绕竖轴旋转并吸附到中央；背景颜色跟随当前徽章交融变化，文字淡入更新，关闭时弹层缩小退出。

触发：横向滑动切换徽章；点击关闭缩小退出

作用层：content、surface、layout

### 实现方法

徽章横向吸附切换，立体轻旋转与背景换色、说明更新同步发生。

1. 给徽章、背景主题和说明建立同一索引
2. 横向拖动后计算最近目标并吸附居中
3. 拖动进度映射当前与相邻徽章旋转
4. 索引落定后交融背景并更新稳定文本，关闭时退出弹层

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：成就展示
- 项目适配场景：个人档案徽章
- 项目适配场景：收藏轮播

避免用于：

- 依赖大量徽章同时比较细节的管理表

### 限制与接入建议

- 徽章成果需真实数据或标注示例；背景变化不能降低说明对比，不应仅用颜色表示选中。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：触屏无需hover即可看到主要信息与操作；按容器重排并提供足够命中区，状态变化保持可理解。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/github-badges-showcase-interaction；资料核对时间：2026-10-12T08:09:53.751Z；SHA256：50a3379e2a087be66d39044082eabf1dd472f58175222fd0d7ac5ca5810b2671；哈希对象：page-response

---

## 拖动图表时跟随发光的数据点 · Revolut Graph Glow Drag Interaction

案例ID：f0d39e6511b80f02

来源：https://60fps.design/shots/revolut-graph-glow-drag-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

拖动折线图时，竖向指示线与发光点沿曲线跟随，价格和时间实时更新；选到上涨或下跌位置时颜色分别转绿或转红，切换时间范围时曲线平滑变形。

触发：在折线图上横向拖动查看数据；点击时间范围切换曲线

作用层：content、outer-glow

### 实现方法

横向拖动沿折线定位指示线和光点，读数与时间更新，换范围时曲线形变。

1. 用同一数据数组生成曲线与坐标映射
2. pointer横坐标定位最近数据点
3. 同步移动竖线、高亮点和可读数值标签
4. 切换时间范围时对兼容路径插值并说明数据来源

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：趋势图表
- 项目适配场景：数据探索
- 项目适配场景：分析面板

避免用于：

- 需要真实投资行情却只提供演示曲线的页面

### 限制与接入建议

- 曲线插值不代表插入真实数据；金融数值必须真实或标注模拟，正负不只靠红绿表示。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：使用Pointer Events区分点击、拖动与内部滚动；处理pointercancel、安全区和软键盘变化；始终提供可点击/键盘操作的同等替代。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/revolut-graph-glow-drag-interaction；资料核对时间：2026-10-12T08:09:53.998Z；SHA256：4bb2a3c025cb607af0ad3ae269349f7b1834b011995cc1e4797bb0551f863579；哈希对象：page-response

---

## 可翻面换色的立体产品卡 · Revolut 3D Card Rotate Interaction

案例ID：f76c6bca9cb40907

来源：https://60fps.design/shots/revolut-3d-card-rotate-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

横向滑动切换不同卡片，卡片带透视深度过渡；点击后完整翻到背面，点下方色点可平滑更换卡面颜色，金属反射随角度变化。

触发：横向滑动切换卡片；点击翻面；点色点更换外观

作用层：surface、content

### 实现方法

产品卡横向切换保留透视深度，点击翻面，色点控制卡面材质颜色。

1. 维护卡片索引、正反面和色款状态
2. 横向切换以深度与旋转区分前后层
3. 点击时围绕纵轴翻面并设置背面可见性
4. 色点更新材质颜色与稳定名称，保留返回正面入口

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：产品款式展示
- 项目适配场景：数字卡片选择

避免用于：

- 以翻面视觉冒充支付、开卡或实体材质验证

### 限制与接入建议

- 卡面金属光泽是网页近似材质；真实卡号或支付操作不应放在仅靠动画隐藏的背面。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：触屏无需hover即可看到主要信息与操作；按容器重排并提供足够命中区，状态变化保持可理解。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/revolut-3d-card-rotate-interaction；资料核对时间：2026-10-12T08:09:54.031Z；SHA256：1b95aa4ba5a7092e8a8813ee66d68b955698ab1c2ba52809b1ad5346c8fc6ed2；哈希对象：page-response

---

## 选择后向上飘散的表情回应 · Apple Music Emoji Reaction Interaction

案例ID：40c39712362ae2d0

来源：https://60fps.design/shots/apple-music-emoji-reaction-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

点回应入口后，一排表情弹性放大出现；选择某个表情，菜单收起，同时多枚同类表情向上漂浮、缩小并淡出，形成轻量的回应庆祝。

触发：点击回应入口打开；选择表情触发上浮粒子并关闭菜单

作用层：content、outer-glow

### 实现方法

回应菜单弹出，选择表情后菜单收起并生成一组上浮淡出的同类表情。

1. 建立回应菜单的开闭与活动选择
2. 弹性入场显示有限表情选项
3. 选择后先更新回应状态并关闭菜单
4. 创建短命表情粒子上浮、缩小、淡出后清理

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：内容回应
- 项目适配场景：评论互动
- 项目适配场景：播放器回应

避免用于：

- 高频点击造成无限粒子累积或遮挡聊天内容

### 限制与接入建议

- 庆祝粒子不能拦截页面点击；实际点赞计数和多人同步需真实服务，不能由动画推断。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：触屏无需hover即可看到主要信息与操作；按容器重排并提供足够命中区，状态变化保持可理解。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/apple-music-emoji-reaction-interaction；资料核对时间：2026-10-12T08:09:54.233Z；SHA256：69bb6f1b3e10385fdff679ca1844129ff55d19cf6773fcba8fddfc1ce3f06235；哈希对象：page-response

---

## 拖进目标区后自动置顶的卡片 · Google Chrome Drag Tab to Pin Interaction

案例ID：cb0a91c3b30c7181

来源：https://60fps.design/shots/google-chrome-drag-tab-to-pin-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

拖动普通标签卡到下方指定区域时，卡片缩小，目标区变蓝并显示预览；松手后卡片飞到顶部固定行，原网格中的其他项平滑补齐空位。

触发：拖拽卡片进入置顶目标区域；松手完成固定

作用层：layout、content

### 实现方法

拖入目标区时卡片缩小并高亮接收区域，松手后卡片移到置顶行，原网格补位。

1. 为普通列表和置顶列表分别保存稳定ID
2. 拖动时计算与接收区的命中并显示预览
3. 有效松手后从原集合移除并加入置顶集合
4. 用FLIP或共享布局让卡片飞入置顶行并补齐原位

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：卡片收藏
- 项目适配场景：固定快捷入口
- 项目适配场景：标签管理

避免用于：

- 没有可撤销操作或持久化策略的关键任务排序

### 限制与接入建议

- 状态变更和视觉过渡需一致；必须提供键盘置顶/取消置顶入口，防止只能拖拽操作。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：使用Pointer Events区分点击、拖动与内部滚动；处理pointercancel、安全区和软键盘变化；始终提供可点击/键盘操作的同等替代。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/google-chrome-drag-tab-to-pin-interaction；资料核对时间：2026-10-12T08:09:55.035Z；SHA256：663177bdf459e06fde22753199887849a2b17bd3354046ade52b4c9f710df3f1；哈希对象：page-response

---

## 拖动时实时让位的卡片网格 · Google Chrome Drag Tabs to Arrange Interaction

案例ID：86d81551dba0aa56

来源：https://60fps.design/shots/google-chrome-drag-tabs-to-arrange-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

长按卡片后它略微抬起并出现阴影，拖过其他卡片时，周围项目即时滑动预览新位置；松手后被拖卡片带轻微弹性吸附到目标格。

触发：长按并拖拽卡片；松手完成排序

作用层：layout、content

### 实现方法

长按抬起卡片，拖过网格时其他卡实时让位，松手后吸附到新格位。

1. 长按达到阈值后进入拖动而非立即拦截滚动
2. 根据指针落点计算目标索引
3. 拖动中暂排其他卡片并播放布局过渡
4. 松手提交顺序并把拖动卡吸附到目标格

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：卡片排序
- 项目适配场景：相册管理
- 项目适配场景：可定制网格

避免用于：

- 不允许改变顺序或需要精确位置存档却无保存逻辑的清单

### 限制与接入建议

- 长按/拖动要与页面滚动分派；需要键盘移动和取消，重排顺序是否持久化由业务决定。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：使用Pointer Events区分点击、拖动与内部滚动；处理pointercancel、安全区和软键盘变化；始终提供可点击/键盘操作的同等替代。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/google-chrome-drag-tabs-to-arrange-interaction；资料核对时间：2026-10-12T08:09:55.360Z；SHA256：97aac7f761a329e595a133a49eb8ba57fff35cb6eff0829d990ed176fabcfd95；哈希对象：page-response

---

## 整页缩回标签卡的空间过渡 · Google Chrome Tabs Switch Scale Interaction

案例ID：7c54471b8ab97c00

来源：https://60fps.design/shots/google-chrome-tabs-switch-scale-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

打开标签切换时，当前整个页面平滑缩小并收进底部对应的标签胶囊，背景转暗，其他标签进入队列，清楚展示原页面在列表中的位置。

触发：点击标签切换入口，当前页缩入对应卡片

作用层：layout、content

### 实现方法

整页缩回对应标签胶囊，让用户看到当前页面在多页队列中的位置。

1. 保存当前页面与目标标签卡的边界矩形
2. 把页面快照或展示层提升为过渡层
3. 缩放移动到对应卡片同时加深背景
4. 交接到标签选择视图，返回时逆向恢复原页面状态

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：多页工作台
- 项目适配场景：标签切换
- 项目适配场景：移动端页面管理

避免用于：

- 跨域页面无法获得真实快照却承诺完整页面复刻

### 限制与接入建议

- 不能把真实表单/iframe随意复制为交互快照；过渡层不接收业务输入，需保持原页面状态和焦点。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：触屏无需hover即可看到主要信息与操作；按容器重排并提供足够命中区，状态变化保持可理解。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/google-chrome-tabs-switch-scale-interaction；资料核对时间：2026-10-12T08:09:55.465Z；SHA256：4751cca9d08ae6dc9c23cc7a26283f5ee525ee9d4b68cb7044b321e9b6f10947；哈希对象：page-response

---

## 每一步都会交融换底色的引导页 · Google Docs Value Prop Full Screen Color Transition

案例ID：3a865035626f460b

来源：https://60fps.design/shots/google-docs-value-prop-full-screen-color-transition

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

分步介绍切换时，整屏背景平滑从一种鲜明色彩交融到另一种，插画和文案横向滑动并带轻微视差，使不同步骤形成一致的视觉节奏。

触发：切换新手引导步骤时同步改变背景色、插画和文案

作用层：page-background、content、layout

### 实现方法

引导步骤切换时整屏底色交融，插画和文案横向滑动并有轻微视差。

1. 以当前步骤关联背景色、插画和文案
2. 前后两套背景交叉淡化避免突然换色
3. 插画与文字用不同偏移系数滑入
4. 步骤落定后聚焦标题并保持下一步/返回入口稳定

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：新手引导
- 项目适配场景：产品价值介绍
- 项目适配场景：移动端入门

避免用于：

- 需要固定底色准确比较图像颜色的流程

### 限制与接入建议

- 换色应保持文字对比与减少动态替代；不能用与实际产品不符的价值文案。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：使用Pointer Events区分点击、拖动与内部滚动；处理pointercancel、安全区和软键盘变化；始终提供可点击/键盘操作的同等替代。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/google-docs-value-prop-full-screen-color-transition；资料核对时间：2026-10-12T08:09:55.844Z；SHA256：8daa44743b9c861fe388ade4d9e5b0b85d7059a7bd005cc6f432f5d0ba40a07e；哈希对象：page-response

---

## 展开后出现声波与字幕的预览卡 · Spotify Podcast Card Preview Sound Wave Animation

案例ID：c3badddd8d1bc80e

来源：https://60fps.design/shots/spotify-podcast-card-preview-sound-wave-animation

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

点击播客预览后，卡片向下扩展，封面成为背景，圆形声波随播放脉冲变化；底部字幕与音频同步上移淡入，让音频预览同时可看和可读。

触发：点击预览按钮展开；播放中声波与字幕联动

作用层：layout、surface、content

### 实现方法

预览卡向下展开，封面成为背景，圆环声波和字幕与播放时序联动。

1. 点击预览后扩展卡片并保留其他列表上下文
2. 由真实播放状态控制封面与圆环可见性
3. 有音频权限和数据时以分析值驱动声波，否则明确演示
4. 按字幕时间轴更新当前行，暂停时同时冻结声波与字幕

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：音频内容预览
- 项目适配场景：播客列表
- 项目适配场景：媒体卡片

避免用于：

- 没有音频或字幕数据却声称真实播放和转录

### 限制与接入建议

- 真实音频需用户手势与可播放资源；无分析数据的脉冲只能叫演示声波，不代表音频识别或实时转录。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：触屏无需hover即可看到主要信息与操作；按容器重排并提供足够命中区，状态变化保持可理解。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：限制装饰粒子或音频绘制数，离屏暂停，卸载清理帧循环和媒体资源；演示动画不冒充真实音频分析或产品服务。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/spotify-podcast-card-preview-sound-wave-animation；资料核对时间：2026-10-12T08:09:56.279Z；SHA256：aa6d86c256f3a26cabf5a5051b6006e2aac17ea95b46e51c4e785b3aba4d2761；哈希对象：page-response

---

## 滑到位后出现勾选的开关 · Airbnb Price Toggle Interaction

案例ID：67b41b5ea8fa2f24

来源：https://60fps.design/shots/airbnb-price-toggle-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

点击开关时，背景由浅灰变成深色，白色滑块滑到右侧；滑块落定时内部勾选轻微放大淡入，反向点击会同时收起勾选并滑回。

触发：点击开关切换状态；勾选在开启位置落定后出现

作用层：surface、content

### 实现方法

开关滑块移动并换底色，落到开启位置后勾选才出现。

1. 使用受控布尔值和switch语义
2. 点击或键盘切换后滑动拇指并过渡背景
3. 在开启过渡接近完成时显现内部勾选
4. 反向切换先撤销勾选并回到关闭位置

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：设置选项
- 项目适配场景：价格筛选
- 项目适配场景：偏好表单

避免用于：

- 有真实保存延迟却让动画立即冒充成功的设置

### 限制与接入建议

- 勾选只是开关状态，不代表后端保存成功；需禁用、加载和保存失败回退。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：使用Pointer Events区分点击、拖动与内部滚动；处理pointercancel、安全区和软键盘变化；始终提供可点击/键盘操作的同等替代。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/airbnb-price-toggle-interaction；资料核对时间：2026-10-12T08:09:56.634Z；SHA256：377d465307490d353c8fe3b411696012304b78bb785871062e5aa26140c11d4b；哈希对象：page-response

---

## 滑动标尺来选数值的底部面板 · Spotify Speed Slider Interaction

案例ID：341989b5bb432cfe

来源：https://60fps.design/shots/spotify-speed-slider-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

速度面板从底部展开，水平拖动时标尺刻度滑过固定位置，中央读数实时更新并转为强调色；点快捷数值时，标尺快速滑到对应刻度。

触发：点击速度入口打开；水平拖动标尺或点击快捷数值

作用层：content、layout

### 实现方法

底部面板中的标尺横移经过固定中心线，中央读数实时更新并支持快捷值。

1. 打开面板并建立当前数值、范围和步长
2. 水平拖动标尺反向映射中心刻度数值
3. 在有效步长吸附时同步读数与强调色
4. 点击快捷值平滑移到对应刻度，并提供数字/键盘替代

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：播放速度设置
- 项目适配场景：精细数值调节
- 项目适配场景：移动端设置

避免用于：

- 需要超高精度输入却没有直接数值输入的参数面板

### 限制与接入建议

- 标尺单位和范围需由业务定义，拖动不能超限；改变显示速度不等于已经控制实际媒体播放。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：使用Pointer Events区分点击、拖动与内部滚动；处理pointercancel、安全区和软键盘变化；始终提供可点击/键盘操作的同等替代。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/spotify-speed-slider-interaction；资料核对时间：2026-10-12T08:09:56.710Z；SHA256：7df318f229c56c4346a254d32ecbc063a1af943a70838c32b5b9d8ceb5605e4b；哈希对象：page-response

---

## 按顺序弹出的三档评价菜单 · Netflix Rate Interaction

案例ID：036667938bbc4e78

来源：https://60fps.design/shots/netflix-rate-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

点击推荐按钮后，深色评价菜单在按钮上方放大淡入，三档拇指选项错开时间弹性出现；周围背景略暗，让注意力集中到评价选择。

触发：点击评价入口打开菜单，选项依次入场

作用层：content、layout

### 实现方法

评价入口上方放大淡入浮层，三档图标按顺序弹出，背景弱化。

1. 点击入口建立菜单并定位到触发按钮
2. 独立遮罩弱化背景且保留关闭行为
3. 三档选项按短stagger入场
4. 选择后保存明确评价值并关闭，必要时处理提交失败

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：内容评价
- 项目适配场景：推荐反馈
- 项目适配场景：视频详情

避免用于：

- 没有业务定义三档语义却直接复制产品手势图标

### 限制与接入建议

- 三档评价需要可访问文本而不是只有图标；选项显现不等于后端已保存偏好。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：触屏无需hover即可看到主要信息与操作；按容器重排并提供足够命中区，状态变化保持可理解。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/netflix-rate-interaction；资料核对时间：2026-10-12T08:09:57.076Z；SHA256：329d631b8cd8549254d03cfaa8a3aaed679ba92f2d76023399984e9564aed95a；哈希对象：page-response

---

## 播放状态改变时升降的封面 · Apple Music Play Pause Interaction

案例ID：904ec593c2876db5

来源：https://60fps.design/shots/apple-music-play-pause-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

点击播放后封面放大、阴影扩散，像从背景中浮起；暂停后封面缩小、阴影收紧，播放与暂停图标也同步产生有弹性的变化。

触发：点击播放或暂停按钮，封面、阴影与图标一起切换

作用层：surface、content

### 实现方法

播放时封面放大与阴影扩散，暂停时收回，控制图标同步变换。

1. 维护实际媒体play/pause/error状态
2. 用户播放成功后扩大封面和阴影
3. 同步切换按钮图标和可访问名称
4. 暂停或播放失败时恢复封面并显示真实状态

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：播放器
- 项目适配场景：音频卡片
- 项目适配场景：媒体控制区

避免用于：

- 播放未成功却让动画显示正在播放的播放器

### 限制与接入建议

- 浏览器可能拒绝自动播放，必须等play成功再显示播放态；演示时需明确没有真实音频。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：触屏无需hover即可看到主要信息与操作；按容器重排并提供足够命中区，状态变化保持可理解。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/apple-music-play-pause-interaction；资料核对时间：2026-10-12T08:09:57.568Z；SHA256：f975895bc57538d83d6a9845b2b9813c49adf0c24dee56ca707ffd77d4e7539a；哈希对象：page-response

---

## 中心歌词清晰其余淡出的阅读视图 · Apple Music Lyrics Interaction

案例ID：ab4b60af9afb7bb3

来源：https://60fps.design/shots/apple-music-lyrics-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

点击歌词入口，封面缩小移到左上，歌词向上淡入；滚动歌词时，中间当前行放大变亮，其他行变暗、变小并模糊，封面色彩构成流动背景。

触发：点击歌词入口切换视图；滚动改变当前聚焦行

作用层：layout、text、content

### 实现方法

歌词视图展开时封面缩到角落，当前行放大清晰，其他行弱化并随阅读移动。

1. 建立封面模式与歌词模式并共享封面位置
2. 打开歌词后在独立滚动区渲染完整歌词
3. 依据时间轴或明确的手动阅读位置确定当前行
4. 当前行清晰，周边行适度弱化并允许暂停自动跟随

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：歌词阅读
- 项目适配场景：逐行稿件
- 项目适配场景：引导式文字阅读

避免用于：

- 学术正文或公式推导必须全段同等清晰的阅读区

### 限制与接入建议

- 歌词需合法数据与可访问全文；模糊不能让用户无法阅读其余内容，自动时间同步必须有真实时间轴。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：触屏无需hover即可看到主要信息与操作；按容器重排并提供足够命中区，状态变化保持可理解。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/apple-music-lyrics-interaction；资料核对时间：2026-10-12T08:09:57.875Z；SHA256：ce45094d725f47aefd422f61d5372154c67aeaa0289b27dcfcec7910f1ad13e0；哈希对象：page-response

---

## 自动轮流聚焦的功能徽章 · Vercel Preview Feature Interaction

案例ID：f02bad609a375ec0

来源：https://60fps.design/shots/vercel-preview-feature-interaction

资料性质：公开视频行为适配建议（非原产品源码）

### 具体行为与作用层

多个彩色功能徽章围绕中央工具条，动画依次让一个徽章保持清晰与完整亮度，其余徽章模糊变暗，用焦点轮换逐个介绍复杂界面的能力。

触发：展示区自动循环切换聚焦徽章；不是鼠标悬停触发

作用层：content、surface

### 实现方法

多个功能徽章围绕工具条自动轮流聚焦，非活动徽章弱化，当前说明同步更新。

1. 把功能徽章与说明组织为固定序列
2. 按周期切换活动索引并控制opacity/blur
3. 活动徽章提高可读性，中心工具条保持静止
4. 提供暂停和手动选择，离屏停止循环

依赖：本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。

参数：

- 项目建议（非原产品参数）：先按可见状态建立可逆交互与正确数据结果，再为目标页面确定时长、幅度、拖动阈值和弹簧；需设备实测，不声称来源提供原值。

### 适用场景

- 项目适配场景：产品功能展示
- 项目适配场景：工具能力介绍
- 项目适配场景：首屏演示

避免用于：

- 所有徽章都必须同时可读的任务操作面板

### 限制与接入建议

- 它是自动功能演示，不是hover触发；文案应只列实际能力，模糊不应藏住唯一操作。
- 公开资料为产品视频与行为说明，未提供原App源码；本条步骤属于网页行为适配建议，不证明原产品内部算法或已接入原产品服务。

手机：项目建议：触屏无需hover即可看到主要信息与操作；按容器重排并提供足够命中区，状态变化保持可理解。

减少动态：项目建议：保留真实数据与状态切换，取消非必要位移、旋转、模糊、循环和粒子；需要时立即呈现最终状态，保持返回、关闭与操作反馈。

性能：项目建议：用独立过渡层与transform/opacity避免每帧重排，测量布局集中执行；完成、取消和卸载时清理动画与监听。

根据已存原站视频页面行为说明整理网页实现方案；依赖空数组表示未宣称原产品技术栈。可按目标工程选择CSS/SVG/Web Animations或已安装Motion，不是官方依赖清单；适用场景和限制是项目建议。

### 依据

- video-page：https://60fps.design/shots/vercel-preview-feature-interaction；资料核对时间：2026-10-12T08:09:57.997Z；SHA256：475184dad9c676b1114e70d50dfd16a4f2ac14786fb1fb8be789d0ec852ad514；哈希对象：page-response
