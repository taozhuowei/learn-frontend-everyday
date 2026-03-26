# Docs

`docs` 是仓库唯一的内容源目录。`website` 在构建时只读取这里的理论文章、题库源码和同级测试定义，再生成展示所需的 `src/generated/*` 文件。

## 目录约定

```text
docs/
├─ README.md
├─ **/*.md                              # 理论文章
├─ 实践/
│  ├─ <分类>/*.{js,jsx,tsx,vue}         # 题库源码
│  ├─ <分类>/*_test.js                  # 与题目同级的测试文件
│  ├─ with_react/launcher/              # React 本地联调工程，会自动扫描同级 .jsx/.tsx 组件
│  └─ with_vue/launcher/                # Vue 本地联调工程，会自动扫描同级 .vue 组件
└─ 其他分类目录
```

## 题库源码规范

每个题目文件头部都必须包含统一注释块：

```js
/**
 * @description 详细描述题目要实现的功能、输入输出语义、边界条件和限制
 * @approach 只解释当前实现写法的思路
 * @params 入参说明
 * @return 返回值说明
 */
```

补充规则：

- `@description` 必须把题目目标写完整，至少说明要实现什么、输入是什么、输出是什么、空值或非法值怎么处理、是否要保持原对象或原数组不变。
- `@approach` 只解释当前紧邻实现的思路；如果一个文件里有多个实现，每个实现都要有自己独立的注释块，不能共用一段思路说明。
- `@params`、`@return` 要直接面向学习者，避免占位文字、脏格式或“请在函数签名中补充”之类的提示语。
- 纯 `.js` 题目不能包含 `export`、`export default`、`module.exports`。
- 如果文件只用于讲解概念、不适合进入题库，可以在头部注释块中添加独立标签 `@skip`，该文件会被 `website` 构建流程忽略。

## 测试文件规范

每个题目的测试文件必须与源码同级，并使用 `<题目名>_test.js` 命名：

- `实践/utility/scheduler.js`
- `实践/utility/scheduler_test.js`

测试文件只导出最小输入输出数组：

```js
module.exports = [
  { input: "..." , expected: ... },
  { input: "..." , expected: ... },
]
```

测试约束：

- 非 `@skip` 题目至少提供 5 条用例。
- 前 3 条固定作为“基础用例”，构建后会自动映射到 `basicCases`。
- 全部用例会作为“完整用例”，构建后会自动映射到 `fullCases`，并且完整用例天然包含基础用例。
- 用例顺序必须渐进式组织，推荐顺序为：基础情况 -> 边界情况 -> 异常情况 -> 大数据量或补充情况。
- 测试文件中不再写 `runner`、`launcherPath`、`visibility`、`timeoutMs` 等字段，这些信息由构建脚本自动补齐或推断。

## 构建约束

- `website` 构建时会扫描 `docs/**/*.md` 和 `docs/实践/**/*.{js,jsx,tsx,vue}`。
- `website` 会缓存 docs 输入状态；如果 `docs` 未变更且已有 `src/generated/*`，会跳过 docs 格式化和内容生成。
- 同级 `*_test.js` 变更、题目注释中的 `@skip` 增删、理论文章变更，都会让缓存失效并触发重新导入。

## 协作规则

- `docs` 只维护内容源，不维护镜像数据或手写生成结果。
- React launcher 会自动导入同级目录中的 `.jsx`、`.tsx` 组件，并忽略 `_test` 文件。
- Vue launcher 会自动导入同级目录中的 `.vue` 组件，并忽略 `_test` 文件。
- React/Vue 联调逻辑只放在对应 `launcher` 目录，不混入通用题库源码。
- 内容结构、测试协议或题库导入规则变化时，必须同步更新 [website/README.md](../website/README.md) 和 [website/PRD.md](../website/PRD.md)。
