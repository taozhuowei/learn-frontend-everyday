# Learn Frontend Everyday Website PRD

## 1. 目标

- `website` 只负责展示、交互、浏览器执行纯 `.js` 题目，以及承载学习和考试流程。
- 所有理论文章、题库源码、标准答案和测试定义都来自 `../docs`。
- 学习模式和考试模式共用三栏工作区，交互体验接近在线判题平台。

## 2. 内容来源

### 2.1 理论知识

- 来源：`../docs/**/*.md`
- 用途：理论知识页、文章目录、正文渲染与检索

### 2.2 题库源码

- 来源：`../docs/实践/**/*.{js,jsx,tsx,vue}`
- 排除：`*_test.js`、`*_launcher`、`dist`、`node_modules`
- 约束：
  - 每个题目都必须包含 `@description`、`@approach`、`@params`、`@return`
  - `@description` 必须详细说明题目要实现的功能、输入输出语义、边界条件和限制
  - 如果一个文件有多个实现，每个实现都必须有独立注释块，且 `@approach` 只解释当前实现
  - 纯 `.js` 题目不能保留 `export`、`export default`、`module.exports`
  - 带独立标签 `@skip` 的文件不导入题库

### 2.3 测试定义

- 来源：`../docs/实践/<分类>/<题目>_test.js`
- 结构：最小输入输出数组
- 规则：
  - 非 `@skip` 题目至少 5 条用例
  - 前 3 条为基础用例
  - 全部用例为完整用例，且完整用例包含基础用例
  - 用例顺序应渐进式组织：基础 -> 边界 -> 异常 -> 大数据量或补充
  - 构建阶段自动补齐 `id`、`description`、`timeoutMs`

### 2.4 执行模式

- `.js` => `browser`
- `.jsx` / `.tsx` => `local`，使用 React launcher
- `.vue` => `local`，使用 Vue launcher

## 3. 页面目标

### 首页

- 提供学习、考试、题库、理论知识四个核心入口。

### 学习页

- 左侧显示题目说明、参数、返回值、思路和参考实现。
- 中间提供代码编辑器。
- 右侧展示基础用例、运行结果和提交反馈。
- `运行` 只执行基础用例。
- `提交` 执行完整用例。

### 考试页

- 延续三栏布局。
- 提供计时、切题、运行、提交、交卷和结果反馈。
- 运行使用基础用例，交卷和最终评分使用完整用例。

### 题库与理论页

- 题库页按分类展示题目列表，并显示基础用例数与完整用例数。
- 理论页展示文章列表、正文与目录导航。

## 4. 构建要求

对外只保留以下命令：

```bash
yarn build
```

`yarn build` 必须完成：

1. 格式化 website 自身代码。
2. 判定 docs 输入缓存是否可复用。
3. 必要时格式化 docs 内容并生成 `src/generated/*`。
4. 执行 TypeScript 构建和 Vite 打包。

限制：

- `yarn build` 不启动本地预览服务。
- `yarn build` 不再依赖额外的 yarn 测试脚本。
- 除 `build` 外不再暴露新的 yarn 脚本；若后续必须新增脚本，必须说明其无法并入 `build` 的原因，并在脚本文件头注释中标明用途。

## 5. docs 缓存

- 缓存文件：`website/.cache/docs-input-state.json`
- 命中条件：
  - docs 输入摘要未变化
  - `src/generated/knowledge.ts`、`manifest.ts`、`problems.ts`、`test-manifest.ts` 全部存在
- 失效条件：
  - 理论文章变更
  - 题目源码变更
- 同级 `*_test.js` 变更
- 题目头注释中 `@skip` 增删

## 6. 部署要求

- 仓库推送到 `main` 后，GitHub Actions 需要自动执行 `website/yarn build`。
- Pages 发布产物固定为 `website/dist`。
- Vite 构建时必须根据仓库名自动设置 Pages `base`，避免子路径部署后静态资源 404。
- GitHub Pages 部署来源固定为 `GitHub Actions`。

## 7. 协作原则

- 构建脚本、内容生成脚本和缓存脚本统一收口在 `website/scripts/`。
- 详细的内容规则由 [docs/README.md](../docs/README.md) 维护。
- website 的构建职责、页面目标和数据模型由本文档维护。
