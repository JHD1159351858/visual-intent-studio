# 全参考库逐项实现知识 Implementation Plan

**Goal:** 为首版350条已验证案例补充可溯源的方法、场景和限制，并让提示词生成对全库取得同规格知识。

**Architecture:** 独立sidecar知识文件按真实案例ID和来源URL绑定，不改变目录、备注、视频或来源同步结构。每次请求对全部可用案例加入紧凑知识，完整说明与来源证据保留在本地。20项原生演示仅作为明确选择的补充或旧资料缺失时的兼容资料。

**Tech Stack:** 现有Node/TypeScript、JSON、Zod、Vitest与DeepSeek SSE。

## Constraints

- React Bits使用目录锁定commit的官方registry；Aceternity使用已保存源码证据，并保留实际采集时间。
- 60fps没有原产品源码，一律标为基于行为的网页适配建议；不编造依赖或原始参数。
- 逐项记录实现概要、3–6步方法、依赖及参数、至少2个场景、避免场景、作用层、限制、手机/减少动态/性能建议、证据和性质说明。
- 方法与场景须贴合具体案例，不以换标题的通用文字代替；接入建议与来源原生事实分开。
- 不修改catalog、seed、用户备注、发布名单和视频，不上传Coze；不声称已安装或运行350个原组件。

## Tasks and verification

1. [x] 来源知识：生成 `data/case-knowledge/reactbits.json`、`aceternity.json`、`60fps.json` 与可重跑脚本。验证213+109+28覆盖、对应URL和源码hash；抽查流体/玻璃/路径图片/边框/滚动/原生App适配。
2. [x] 读取与校验：新增 `shared/case-knowledge.ts`、`server/case-knowledge.ts` 和先红后绿的 `tests/case-knowledge.test.ts`。缺文件兼容；损坏、重复、串条必须报错，不补假资料。
3. [x] 提示词集成：在 `server/design-prompt.ts` 全库每条加入知识；移除已完整覆盖案例的固定20项突出资料。测试真实来源绑定、全库注入、旧夹具兼容、静态要求和无源码正文。
4. [x] 数据与交付：增加350条完整性/机制差异测试，生成可读知识导出与覆盖报告；测量实际请求大小，运行相关测试和构建，再做隔离的实际模型调用。报告选材证据与页面渲染未验收的边界，不承诺零重复。
