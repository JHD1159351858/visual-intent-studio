export type Project = {
  id: string;
  kind: string;
  name: string;
  subtitle: string;
  category: string;
  year: string;
  description: string;
  role: string;
  background: string;
  process: string[];
  outcome: string;
};

export const projects: Project[] = [
  { id: 'qingkang', kind: 'health', name: '轻康', subtitle: '把健康，放回日常。', category: '产品体验 · APP 设计', year: '2025', description: '让运动、饮水与休息，在清晰而轻盈的体验里成为习惯。', role: '产品策略 / 交互设计 / 视觉设计', background: '健康管理不应该是一份复杂的任务清单。这个概念项目探索如何通过温和的视觉反馈，帮助人们理解自己的日常节奏。', process: ['围绕每日计划、习惯记录与周回顾组织信息。', '用统一的进度环与轻量卡片减少认知负担。', '用原型串联从设定目标到完成记录的完整流程。'], outcome: '交付范围：概念方向、核心页面、交互流程与视觉规范。封面为专门生成的产品设计展示图，不代表已经上线的真实应用。' },
  { id: 'form', kind: 'brand', name: '形序 FORM', subtitle: '让秩序，成为辨识度。', category: '品牌视觉设计', year: '2025', description: '以形与留白，建立一套有节奏的品牌视觉语言。', role: '品牌方向 / 标识 / 视觉应用', background: '为一个虚构的创意品牌建立能够在不同载体上延展的视觉系统。', process: ['从几何结构中提取品牌字形。', '建立色彩、网格与排版关系。', '延展到海报、印刷品和数字页面。'], outcome: '完成品牌概念与应用方案，未关联真实客户或商业成效。' },
  { id: 'shore', kind: 'travel', name: '有岸', subtitle: '下一站，去感受生活。', category: '旅行产品 · UI 设计', year: '2024', description: '将目的地灵感与轻量行程整理连接起来。', role: '信息架构 / 产品界面 / 原型', background: '旅行规划常常被分散在不同的记录中。这个项目尝试用一种轻松的方式，让想去的地方成为可理解的旅程。', process: ['以目的地卡片组织灵感。', '建立可阅读的行程时间线。', '区分发现、收藏与出发三个阶段。'], outcome: '展示概念界面与体验流程，不提供真实预订、地图导航或出行服务。' },
  { id: 'still', kind: 'illustration', name: '蓝色静物', subtitle: '在形与光之间，停留一会儿。', category: '数字插画 · 视觉探索', year: '2025', description: '关于光、材质与日常物件的抽象静物练习。', role: '概念 / 构图 / 数字插画', background: '尝试用有限的冷色与简单物件，建立安静而有张力的视觉空间。', process: ['从花器与植物的轮廓构建画面。', '利用透明、反射和柔和阴影建立材质差异。', '将视觉拓展到海报及数字封面。'], outcome: '本地原创 SVG 视觉探索，作为作品集演示素材。' },
  { id: 'frame', kind: 'system', name: 'FRAME', subtitle: '让一致性，自然发生。', category: '设计系统 · 组件规范', year: '2024', description: '为数字产品建立统一、可延展的基础语言。', role: '设计语言 / 组件 / 文档', background: '当产品持续迭代，基础规则需要帮助团队保持清晰，同时给具体场景留出表达空间。', process: ['梳理颜色、排版与间距的语义层级。', '定义组件的主要状态和交互反馈。', '用场景组合检验组件之间的关系。'], outcome: '交付概念设计系统与界面组合示例，不代表已接入实际业务。' },
  { id: 'mountain', kind: 'culture', name: '观山', subtitle: '把观看，变成一场相遇。', category: '展览视觉 · 数字体验', year: '2025', description: '以山的轮廓和文字节奏，构建一个概念艺术展的视觉体验。', role: '艺术方向 / 视觉识别 / 网页设计', background: '让展览从一张海报延伸为能够探索内容的数字空间，同时保持鲜明的视觉识别。', process: ['提取山形、留白与水平线作为构图元素。', '以中西文排版建立海报节奏。', '将纸面构图延伸到展览网站。'], outcome: '虚构展览的概念创作，无真实参展、获奖或票务信息。' },
];
