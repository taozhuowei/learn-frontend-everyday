# Website

`website` 是仓库唯一的前端工程，负责消费 `../docs` 中的理论文章和题库内容，并产出可部署的静态站点。

## 目标

- 展示理论知识文章。
- 提供学习模式、考试模式和题库详情页。
- 在浏览器中执行纯 `.js` 题目。
- 为 React/Vue 题目保留本地联调入口，但这些联调工程仍放在 `../docs/实践/*_launcher/`。

## 目录说明

```text
website/
├─ package.json
├─ PRD.md
├─ README.md
├─ vite.config.ts
├─ scripts/
│  ├─ build.mjs                # 唯一对外构建入口
│  ├─ build-content.ts         # 扫描 docs 并生成 src/generated/*
│  ├─ build_config.mjs         # 构建分包配置
│  ├─ build_pipeline.mjs       # build 的流水线执行器
│  ├─ content_rules.mjs        # 题目与测试规则
│  └─ docs_cache.mjs           # docs 输入缓存
├─ src/
│  ├─ components/
│  ├─ context/
│  ├─ generated/
│  ├─ pages/
│  ├─ route/
│  ├─ types/
│  ├─ utils/
│  └─ workers/
└─ test/
   ├─ build_config.test.mjs
   ├─ content_rules.test.mjs
   └─ docs_cache.test.mjs
```

## 命令

在 `website` 目录执行：

```bash
yarn build
```

说明：

- `package.json` 只保留这一个 yarn 脚本。
- `yarn build` 会完成 website 自身格式化、docs 缓存判定、必要时的 docs 内容生成、TypeScript 构建和 Vite 打包。
- 如果未来必须新增脚本，只能用于 `build` 无法承载的独立职责，并且要在脚本文件头注明用途。

## GitHub Pages

- 仓库根目录提供 [deploy-pages.yml](../.github/workflows/deploy-pages.yml) 工作流，推送到 `main` 后会自动构建 `website` 并发布 `website/dist`。
- [vite.config.ts](./vite.config.ts) 会在 GitHub Actions 环境下自动读取仓库名并设置 Pages `base`，本地开发仍保持根路径。
- Pages 需要在仓库设置中使用 `GitHub Actions` 作为部署来源。

## 内容导入规则

### 理论文章

- 来源：`../docs/**/*.md`

### 题库源码

- 来源：`../docs/实践/**/*.{js,jsx,tsx,vue}`
- 排除：`*_test.js`、`*_launcher`、`dist`、`node_modules`

每个题目文件头部必须包含：

```js
/**
 * @description 详细描述题目功能、输入输出语义、边界条件和限制
 * @approach 只解释当前实现写法的思路
 * @params 入参说明
 * @return 返回值说明
 */
```

补充规则：

- `@description` 不能只写概括性标题，必须把题目要求和边界写完整。
- 如果一个文件里有多个实现，每个实现都要有独立注释块，且各自的 `@approach` 只解释当前实现。
- 纯 `.js` 题目不能保留 `export`、`export default`、`module.exports`。
- 头部注释里出现独立标签 `@skip` 的文件不会导入 website，也不要求存在测试文件。

### 测试文件

- 位置：与题目源码同级
- 命名：`<题目名>_test.js`

最小结构：

```js
module.exports = [
  { input: "..." , expected: ... },
  { input: "..." , expected: ... },
]
```

规则：

- 非 `@skip` 题目至少 5 条用例。
- 前 3 条为基础用例，生成到 `basicCases`。
- 全部条目为完整用例，生成到 `fullCases`。
- 完整用例天然包含基础用例。
- 用例顺序应渐进式组织：基础 -> 边界 -> 异常 -> 大数据量或补充。

### 执行模式推断

- `.js` => `browser`
- `.jsx` / `.tsx` => `local`，使用 `docs/实践/with_react/react_launcher`
- `.vue` => `local`，使用 `docs/实践/with_vue/vue_launcher`

## 前端数据模型

- `ProblemRecord.basicCases`：运行时展示和快速验证使用的基础用例。
- `ProblemRecord.fullCases`：提交时使用的完整用例。
- Learn 和 Exam 页面都以 `basicCases` 作为“运行”入口，以 `fullCases` 作为“提交”入口。

## docs 缓存

- `scripts/docs_cache.mjs` 会计算 docs 输入摘要并写入 `website/.cache/docs-input-state.json`。
- 当 docs 未变化且 `src/generated/knowledge.ts`、`manifest.ts`、`problems.ts`、`test-manifest.ts` 全部存在时，`yarn build` 会跳过 docs 格式化和内容生成。
- 理论文章、同级测试文件、题目源码内容、题目头注释里的 `@skip` 变化，都会让缓存失效。

## 协作边界

- 题目源码、理论文章和测试定义只在 `../docs` 维护。
- `src/generated/*` 和 `dist/` 只允许构建产物写入，不做人工维护。
- 题库规则或构建流程变化时，需同步更新 [docs/README.md](../docs/README.md) 和 [PRD.md](./PRD.md)。
