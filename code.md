# 肌肉猫小程序代码规范

## 编辑器设置

- 使用 VS Code 打开 `muscle-cat-miniapp` 根目录，不要只打开 `dist` 目录。
- 安装工作区推荐扩展：Vue - Official（Volar）、Prettier、ESLint、EditorConfig。
- 保存文件时会自动运行 Prettier；ESLint 修复需要在状态栏或命令面板执行“ESLint: Fix all auto-fixable Problems”。
- 统一使用 UTF-8、LF 换行、2 个空格缩进，不使用 Tab。
- 源码目录保持 uni-app 根目录结构，`dist` 和 `unpackage` 仅作为构建产物，不手工编辑。

### 微信开发者工具编辑器边界

- 微信开发者工具内置编辑器不支持安装 VS Code 扩展，不能在其中安装 Volar 或 Vue Language Features。
- 因此，`.vue` 源文件在微信开发者工具中可能按纯文本显示，没有 Vue 模板、TypeScript 和 SCSS 高亮；这不影响编译和运行。
- 源码编辑、语法高亮、类型提示和自动格式化统一在 VS Code 中完成；请在 VS Code 安装 Vue - Official（Volar）、Prettier、ESLint 和 EditorConfig。
- 微信开发者工具只负责打开 `dist/dev/mp-weixin` 编译产物、运行模拟器和真机预览，不作为 `.vue` 源码编辑器使用。
- 页面背景图等静态资源统一放在 `assets/`，通过 TypeScript 导入后由组件引用；替换品牌图片时保留低对比度和文字可读性。

## JavaScript / TypeScript / Vue

- 字符串使用单引号，语句末尾不加分号。
- 对象、数组和函数参数使用尾逗号；单行长度超过 100 列时由 Prettier 自动换行。
- 类型、接口和组件名使用 PascalCase；变量、函数和事件使用 camelCase；常量使用 `UPPER_SNAKE_CASE`。
- 优先使用 `const` 和明确的 TypeScript 类型，避免新增 `any`。确需兼容第三方类型时，在最小范围内使用并说明原因。
- Vue 模板使用 kebab-case 属性名；复杂标签的属性按 Prettier 结果分行。
- 页面逻辑放在对应 `pages/**/index.vue`，接口请求集中放在 `services/`，领域类型集中放在 `types/`。

## 注释

- 注释说明“为什么这样做”或业务规则，不重复描述代码本身。
- 业务规则、平台兼容处理和临时限制使用中文短句；公共接口和复杂算法可补充输入、输出与副作用。
- TODO 注释使用 `TODO(姓名/日期): 说明`，完成后删除；禁止保留无上下文的 `TODO`。
- 不提交被注释掉的大段旧代码，历史实现交给 Git 记录。

## 质量检查

```bash
npm run format       # 自动格式化源码
npm run format:check # 只检查格式，不修改文件
npm run lint         # ESLint 语法与代码质量检查
npm run type-check   # vue-tsc 类型检查
npm run check        # 提交前一次性执行全部检查
```

提交前，Husky 会通过 `lint-staged` 只检查本次暂存的 `ts/vue/scss/json/md` 文件，并自动执行格式化和 ESLint 修复。修复后请重新执行 `npm run check`，确认没有错误再提交。

## 微信开发者工具工作流

1. VS Code 编辑并保存源码。
2. 在项目根目录运行 `npm run dev:mp-weixin`，保持该终端持续运行。
3. 微信开发者工具导入 `dist/dev/mp-weixin`，模拟器读取编译产物。
4. 保存源码后，Vite 会重新编译，模拟器刷新后即可看到改动。

不要在微信开发者工具中直接编辑构建产物，也不要把 `dist` 下的改动提交到版本库。
