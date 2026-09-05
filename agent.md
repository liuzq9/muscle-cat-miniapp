# 肌肉猫小程序前端协作说明

## 项目概述

肌肉猫是面向健身工作室会员的微信小程序前端，基于 uni-app、Vue 3、TypeScript、Vite 和 SCSS 构建。第一版围绕“了解工作室 -> 选择教练和课程 -> 查看排期 -> 预约 -> 到店核销 -> 查看记录”闭环设计。

当前前端支持两种数据模式：默认使用 `services/mocks/` 内的 mock 数据，设置 `VITE_USE_MOCK=false` 后通过 `services/http/` 连接 NestJS 后端。小程序运行前必须先编译，微信开发者工具导入编译产物而不是源码目录。

详细功能、接口和验收要求见 [docs.md](./docs.md)。

## 第一版核心功能

以下功能属于第一版范围，详细规则以 `docs.md` 为准：

- 工作室成立介绍、地址、营业时间和联系方式展示。
- 教练列表、教练简介、擅长方向及其课程展示。
- 按教练选择课程、未来 7 天日期和 07:00-20:00 的整点时间段。
- 已被预约或关闭的时段置灰且不可选择，预约成功后展示预约码/二维码。
- 会员创建预约、查看预约、取消预约和改期；课程开始前 12 小时内不可取消或改期。
- “我的课程”查看待上课程和已完成上课记录。
- 教练/管理员扫码签到，以及扫码完成课程。
- mock 数据预览与后端 API 切换，不在前端直接访问 MongoDB。

## 常用命令

在本目录执行：

```bash
npm install
npm run dev:mp-weixin       # 微信小程序开发编译
npm run build:mp-weixin     # 微信小程序生产编译
npm run dev:h5              # H5 开发预览
npm run build:h5            # H5 生产构建
```

编译完成后，将 `dist/dev/mp-weixin` 导入微信开发者工具。不要导入 `muscle-cat-miniapp` 源码根目录。

配置真实后端时：

```bash
cp .env.example .env
# 设置 VITE_USE_MOCK=false，并按环境设置 VITE_API_BASE_URL
```

依赖安装使用项目内 `.npm-cache` 和 `.npmrc`；不要用 `sudo`、`--force` 或 `--legacy-peer-deps` 绕过版本冲突。

## 目录结构

```text
muscle-cat-miniapp/
├── pages/                     # 页面：首页、教练、预约、我的、扫码核销
├── services/http/             # Axios 风格、uni.request 传输层与统一响应处理
├── services/api/              # 按模块拆分的 API（studio、coach、course 等）
├── services/mocks/            # 按模块拆分的 Mock 数据
├── services/api.ts            # 兼容现有页面的 API 出口
├── types/domain.ts            # Studio、Coach、Course、Schedule 等领域类型
├── styles/tokens.scss         # 品牌色、间距、状态色等 SCSS 变量
├── App.vue                    # 应用入口
├── main.ts                    # Vue/uni-app 启动入口
├── pages.json                 # 页面路由、tabBar、全局样式
├── uni.scss                   # uni-app 全局样式
├── .env.example               # 环境变量模板
├── .npmrc                     # 项目级 npm 源和缓存配置
├── project.config.json        # 微信开发者工具配置
├── package.json               # 脚本和依赖
├── vite.config.ts
├── tsconfig.json
├── agent.md                   # 本文件
└── docs.md                    # 产品与技术需求
```

## 修改限制

- 只修改完成任务所需的文件，保持现有页面、路由和 API 适配层边界。
- 不要把后端、数据库或密钥写入小程序前端；页面只能通过 `services/api/` 或兼容出口 `services/api.ts` 访问 API。
- 不要删除或提交 `node_modules`、`.npm-cache`、`dist` 等生成物，除非任务明确要求。
- 不要将 `@dcloudio/uni-app` 或 `@dcloudio/vite-plugin-uni` 改成 `latest`；必须保持 Vue 3 兼容的 uni-app 3.x 版本范围。
- 不要为了安装通过 `npm install --force` 或 `npm install --legacy-peer-deps` 掩盖依赖问题。
- 需要新增页面时同步更新 `pages.json`；需要新增领域对象时先更新 `types/domain.ts`。
- 避免破坏 mock 模式；新接口应同时提供可用的 mock 分支或明确记录暂不支持 mock。
- 保留 `project.config.json` 的编译产物配置，微信工具目标目录为 `dist/dev/mp-weixin/`。
- 本项目只使用 uni-app CLI + Vite 生成根目录 `dist/`，不使用或生成 HBuilderX 的 `unpackage/` 目录。

## 代码规范

- 使用 Vue 3 `<script setup lang="ts">`，优先组合式 API 和明确的类型标注。
- 页面组件使用 PascalCase 之外的现有文件命名方式保持不变；变量、函数使用 camelCase，类型和接口使用 PascalCase。
- API 请求集中在 `services/http/` 和 `services/api/`，页面不直接调用 `uni.request` 或拼接重复的请求实现。
- 优先复用 `types/domain.ts` 的类型；避免 `any`，只有处理 uni-app 页面 options 等无类型对象时才局部使用。
- 样式使用 SCSS 和 `styles/tokens.scss` 变量；页面专属样式使用 `scoped`，嵌套不超过三层。
- 时间统一使用 `YYYY-MM-DD` 和 `HH:mm`；状态值使用领域类型中的固定字符串。
- 交互要处理加载、空数据、失败和不可用状态；异步操作避免重复提交，并给用户明确反馈。
- 文案、颜色、间距和状态样式保持现有设计语言，不引入无必要的组件库或全局重构。
- 完整的格式化、注释、编辑器、ESLint、类型检查和提交前校验规则见 [code.md](./code.md)；开始修改代码前必须先阅读该文件。

## 任务完成标准

- 需求对应的页面、交互和数据状态已实现，且不引入超出范围的功能。
- `npm run build:mp-weixin` 能成功完成，生成 `dist/dev/mp-weixin/app.json` 等产物。
- TypeScript、JSON 和 Vue 模板无新增语法/类型错误；至少完成相关页面的静态检查。
- mock 模式可启动并覆盖主流程；API 模式的请求路径、方法和数据结构与 `docs.md` 一致。
- 修改后检查微信工具导入路径、路由和 tabBar，确认不会再次出现“项目根目录未找到 app.json”。
- 在交付说明中列出修改文件、验证命令、未验证项和已知限制。
