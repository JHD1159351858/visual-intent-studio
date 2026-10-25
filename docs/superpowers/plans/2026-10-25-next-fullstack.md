# Next.js 全栈迁移与发布计划

**目标：** 以Next.js App Router单进程提供现有工作台、14个API与资源服务，构建可直接运行的standalone包，测试通过后推送现有GitHub仓库。

**架构：** React界面保留，App Router客户端挂载门保护localStorage；Web Request/Response业务入口供Next Route Handlers直接调用。Node测试适配器复用同一入口，不保留Express服务或内部HTTP转发。媒体保留原位置及URL，通过支持Range的Route Handler提供；构建时复制数据和素材到standalone。

**方案修正：** 保留测试/采集工具和配置示例；不删除无关videos目录；SSE输出字节流并传播取消；不把'use client'误当禁止SSR；不复制.env或个人历史。平台未知的发布大小、代理时限和持久化能力不冒称已验证。

- [x] 前端入口、水合与浏览器草稿保护 → SSR回归及浏览器刷新恢复。
- [x] JSON/SSE API、并发更新和视频服务 → 原回归、Web直测、真实Next端口流式取消及Range。
- [x] Next依赖、standalone打包和启动文档 → 构建产物独立启动，350条素材验证，无密钥和历史文件。

**发布流程：** 完整测试后审查分支差异和敏感内容，再提交推送并读回远端提交；实际GitHub提交和核验结果在最终交付消息中报告，不在提交前预先宣称已发布。

## 本地验收

- `npm.cmd test`：35文件、450项通过，原业务回归仍覆盖同一Web处理器。
- `npm.cmd run build`：Next.js 16.4.3、TypeScript与standalone打包通过。
- `npm.cmd run test:e2e`：独立5185生产进程、Next静态JS、350条目录、来源/设计范例/导出/错误协议、350视频Range/HEAD/416通过；实际Next路由的假DeepSeek搜索→读取→生成流和取消通过，思考不进入UI。
- 浏览器1440px/390px没有页面异常，三类来源视频可解码、放大弹窗可用；另验三阶段换组0模型请求、重置刷新保留空态且不删除聊天与其他对话。
- 生产测试只用本地模型协议fixture，未调用付费模型。记录在 `artifacts/next-migration-20261025/standalone-check.json`；测试写入只位于standalone，发布前再次打包清理。
- 本地工作台沿用5174端口，保持原浏览器存储站点；模型与350条参考正常加载。未验证未知外部平台实际发布、包限额、反代时限或持久卷。
