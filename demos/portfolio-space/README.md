# 数字创作空间 · 第二版作品集 Demo

按用户提供的新提示词单独实现，旧版 `demos/portfolio-wall` 保留。React + Tailwind CSS + Vite，全部业务交互为本地预设，不连接后端。

## 预览与构建

在本目录运行 `npm.cmd install`，再运行 `npm.cmd run dev`，浏览器访问 http://127.0.0.1:5181/。

`npm.cmd run build` 生成静态文件到 `dist/`。发布或分享时完整保留 `dist/` 的目录结构，通过静态服务器访问；不承诺双击 HTML 文件运行。

开发服务启动后，`npm.cmd run verify` 执行浏览器检查。使用工作区已安装的 Playwright；独立移出工作区后需准备 Playwright 与 Chromium。

## 实现范围

- 大尺寸轻康作品主视觉、两张辅助缩略图、独立图层的鼠标视差与持续浮动。
- 六件概念作品，两个宽卡与四个普通卡，封面比例4:3；悬停轻微透视，正文不继承旋转。
- 卡片位置展开与收回的项目详情、遮罩/Esc关闭、背景滚动锁定和焦点恢复。
- 三个预设聊天问题、手动输入演示反馈、会话内历史保留、演示邮箱复制。
- 移动导航、平板与手机布局、触屏长按反馈、暂停入口、系统减少动态。
- 本地字体资源：Inter Tight / Inter；中文字形由 Noto Sans SC 与系统回退承担。字体和图片无需第三方运行时请求。

## 提示词中的冲突处理

- 不使用“10+项目覆盖千万用户”等未经提供证据的履历成绩。
- 680×480并不是4:3：保留680px主图目标宽度，按4:3展示；小屏按容器缩放。
- 长标题在35%栏宽下无法按指定的两行72px容纳：保留文案含义，将姓名作为介绍，主标题为“专注数字产品 / 体验设计”。
- 手机图文总高度超过85vh时使用内容高度，避免溢出；小于390px继续支持到320px。
- 静态服务器访问与双击本地HTML分开，本Demo采用前者。
- 页脚年份使用本次日期2026年。

## 参考行为与来源

以下ID与来源已在本地目录核对。本页为按行为制作的适配和自主组合，未宣称安装或完整复用来源组件源码。

- 3949bfe57700b184：https://ui.aceternity.com/components/parallax-hero-images
- aceternity-bento-grid：https://ui.aceternity.com/components/bento-grid
- 22fa77bef9456d26：https://ui.aceternity.com/components/3d-card-effect
- aceternity-layout-grid：https://ui.aceternity.com/components/layout-grid
- 5f6db6faf42a1a39：https://reactbits.dev/components/bounce-cards

## 视觉资产

主图使用内置 image_gen 生成，保存为 `public/assets/qingkang-hero.png`；其余封面为本地原创 DOM/SVG。完整生成提示词见 [ASSETS.md](./ASSETS.md)。页面人物、作品及联系方式均为演示内容，邮箱使用保留的example.com域名。
