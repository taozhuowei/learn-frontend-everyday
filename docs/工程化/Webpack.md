# Webpack

Webpack，前端打包构建工具。

## 构建流程

### 1. 初始化阶段

- 读取配置：从 `webpack.config.js` 或 CLI 参数中合并得到最终配置。
- 创建 `Compiler` 实例：这是 Webpack 的核心引擎，负责管理整个编译周期。
- 注册插件：执行所有配置的插件，监听编译生命周期的钩子（hooks）。

### 2. 编译阶段

- 入口分析：从配置的 `entry` 入口文件开始，启动编译。
- 依赖解析：使用 `enhanced-resolve` 解析模块路径，递归查找所有依赖模块。
- 模块转换：对每个模块，根据配置的 `rules` 使用对应的 Loader 进行编译（如 Babel 转译 ES6、Sass 转 CSS），生成可执行代码。
- 生成模块依赖图：将所有模块及其依赖关系组织成一个依赖图（Dependency Graph）。

### 3. 生成阶段

- Chunk 生成：根据依赖图和配置的代码分割规则，将模块组合成多个 Chunk。
- 资源优化：执行代码压缩、Tree Shaking、Scope Hoisting 等优化操作。
- 输出文件：将优化后的 Chunk 写入到配置的 `output` 目录，生成最终的 bundle 文件。

## 打包速度优化

- **缩小 Loader 处理范围**：在 `module.rules` 中使用 `include` 和 `exclude` 明确指定需要/不需要处理的文件目录，避免遍历整个项目。
- **优化 `resolve` 配置**：
  - 配置 `resolve.extensions` 减少文件扩展名尝试次数。
  - 配置 `resolve.modules` 明确模块搜索路径，避免向上递归查找。
- **Loader 缓存**：为 `babel-loader` 等开启缓存，将编译结果缓存到文件系统。
- **Webpack 5 持久化缓存**：直接在配置中开启，缓存整个编译过程。
- **多线程/多进程并行处理**：`thread-loader`（写在第一个 loader），将耗时的 Loader 任务放到 worker 池里并行执行。
- **代码分割与资源优化**：`optimization` 中配置 `splitChunks`，分离公共依赖和第三方库，避免重复打包，减小单个 bundle 体积。
- **动态 `import` 懒加载**：将非首屏代码按需加载，减少初始 bundle 大小。
- **Source Map 优化**：开发环境使用 `eval-cheap-module-source-map`，生产环境使用 `hidden-source-map` 或不生成，减少 Source Map 生成时间。

## Webpack 分块（Chunk）

### 分的对象

分块操作的核心是 chunk（代码块），而非直接分割"依赖（dependency）"。依赖是构成 chunk 的基本单元（比如一个文件、一个模块），Webpack 会先分析依赖关系，再将相关依赖打包成不同的 chunk。

### 分块依据

1. **入口起点（entry）**：每个 `entry` 默认生成一个 chunk（单入口只有 1 个主 chunk，多入口会生成多个入口 chunk）。
2. **代码分割规则**：
   - 显式分割：通过 `import()` 动态导入、`splitChunks` 配置主动拆分（如抽离公共代码、第三方库）。
   - 隐式分割：Webpack 内置规则（如异步加载的模块自动拆分为独立 chunk）。
3. **缓存策略**：`splitChunks` 中 `minChunks`（模块被引用次数）、`minSize`（chunk 最小体积）等参数决定是否拆分。

### 分块过程

Webpack 先构建依赖图（记录模块间的引用关系），再根据上述规则将依赖图中的模块分组，每组形成一个 chunk，最终输出为单独的文件（如 `main.js`、`vendors~main.js`）。

## 按需引入

按需引入的核心是"运行时动态加载模块" + "Webpack 的代码分割"，具体逻辑：

1. **编译时**：Webpack 遇到 `import('./module.js')`（动态导入语法）时，会将该模块拆分为独立 chunk，生成对应的异步加载文件（如 `0.js`），并在主 chunk 中插入"加载逻辑代码"。
2. **运行时**：
   - 代码执行到 `import()` 时，先判断该 chunk 是否已加载：未加载则通过 JSONP（或 `fetch`）请求对应的异步文件；
   - 文件加载完成后，将其挂载到全局（或执行模块代码），返回 `Promise`；
   - 开发者通过 `.then()` 接收模块导出内容，实现"用到时才加载"。
3. **路由级按需引入**（如 Vue Router/React Router）：本质是将路由组件作为异步 chunk，只有当用户访问该路由时，才触发 `import()` 加载对应的组件 chunk。

## 单入口下"引用次数 minChunks"指什么？

单入口只有 1 个"入口 chunk"，此时"引用次数"是指：该模块被入口 chunk 中的多少个不同子模块引用。

- 举例：单入口 `main.js` 中，`a.js` 引用了 `lodash`，`b.js` 也引用了 `lodash`，则 `lodash` 的引用次数为 2。若 `minChunks=2`，Webpack 会将 `lodash` 抽离为独立 chunk（vendors）。
- 同一模块多次 `import`（如同一文件内多次导入）只算 1 次引用，核心是"不同引用源"的数量。

多入口下"引用次数"是指模块被多少个入口 chunk 引用（如两个入口都引用 `lodash`，次数为 2）。

## resolve 配置

`resolve` 是 Webpack 用于解析模块路径的配置，核心配置项：

### （1）路径解析规则

- `extensions`：自动补全文件后缀，如 `['.js', '.vue', '.json']`，导入 `./a` 时会依次查找 `a.js`、`a.vue`、`a.json`。
- `alias`：路径别名，如 `{ '@': path.resolve(__dirname, 'src') }`，简化 `import '@/components'` 的写法。
- `modules`：指定模块查找目录，默认 `['node_modules']`，可添加自定义目录（如 `src/components`）。

### （2）文件解析优先级

- `mainFiles`：指定目录的入口文件，默认 `['index']`，查找 `./dir` 时会找 `./dir/index.js`。
- `descriptionFiles`：读取包描述文件，默认 `['package.json']`，优先按 `package.json` 的 `main` 字段解析。

### （3）符号链接解析

- `symlinks`：是否解析符号链接（软链），默认 `true`，设为 `false` 可避免软链路径解析错误。

## Loader 和 Plugin 的区别

### Loader（模块转换器）

- **作用**：对单个模块（文件）的内容进行转换处理。Webpack 本身只能处理 JavaScript 和 JSON 文件，Loader 让 Webpack 能够处理其他类型的文件（如 CSS、图片、TypeScript 等）。
- **运行时机**：在模块加载阶段，Webpack 解析到某个模块时，根据 `module.rules` 匹配对应的 Loader 进行转换。
- **配置位置**：在 `module.rules` 中配置。
- **本质**：一个导出为函数的模块，接收源文件内容作为参数，返回转换后的内容。
- **执行顺序**：从右到左、从下到上依次执行（链式调用）。

### Plugin（构建扩展器）

- **作用**：扩展 Webpack 整个构建流程的能力。Plugin 可以在 Webpack 构建的各个生命周期钩子中执行自定义操作，如打包优化、资源管理、注入环境变量等。
- **运行时机**：贯穿整个编译生命周期，通过监听 Webpack 的 hooks（钩子）在特定时机执行。
- **配置位置**：在 `plugins` 数组中配置，传入 `new` 实例。
- **本质**：一个具有 `apply` 方法的类，`apply` 方法接收 `compiler` 对象，通过它可以访问 Webpack 的所有生命周期钩子。

### 核心区别

- **职责：** Loader负责转换模块内容（文件级别），Plugin扩展整个构建流程（全局级别）。
- **作用范围：** Loader作用于单个文件的转换，Plugin贯穿整个编译生命周期。
- **配置位置：** Loader在`module.rules`中配置，Plugin在`plugins`数组中配置。
- **运行时机：** Loader在模块加载时执行，Plugin在编译各阶段的钩子中执行。

## WebPack Tree Shaking 原理

Tree Shaking 是一种消除未使用代码（Dead Code）的优化技术，Webpack 在生产模式下默认开启。

### 实现原理

1. **依赖 ES Module 的静态结构**：ES Module 的 `import`/`export` 是静态声明（编译时确定依赖关系，不能在条件语句中动态导入），Webpack 可以在编译阶段对模块的导入导出进行静态分析，精确判断哪些导出被使用、哪些未被使用。CommonJS 的 `require` 是动态的（运行时才确定），因此无法进行 Tree Shaking。
2. **标记未使用的导出**：Webpack 在构建模块依赖图时，会分析每个模块的导出是否被其他模块引用。对于未被任何模块引用的导出，Webpack 会在生成的代码中添加标记注释（如 `/*unused harmony export*/`）。
3. **压缩工具删除死代码**：最终由代码压缩工具（如 Terser）读取这些标记，在压缩阶段将未使用的代码彻底删除，从而减小打包体积。

### 生效条件

- 必须使用 ES Module 语法（`import`/`export`），不能使用 CommonJS（`require`/`module.exports`）。
- 生产模式（`mode: 'production'`）下默认开启。
- 模块不能有副作用，或需要通过 `sideEffects` 属性声明（见下文）。

## package.json 里 sideEffects 属性作用

`sideEffects` 用于告知 Webpack 当前包中的哪些模块是"无副作用"的，从而帮助 Webpack 更安全地进行 Tree Shaking。

### 什么是副作用

副作用是指模块在被 `import` 时，除了导出内容之外，还会执行一些影响全局的操作。例如：修改全局变量、添加 CSS 样式（`import './style.css'`）、注册 polyfill 等。

### sideEffects 的作用

如果不声明 `sideEffects`，Webpack 在做 Tree Shaking 时会比较保守——即使某个模块的导出没有被使用，Webpack 也不敢直接删除它，因为担心它有副作用代码需要执行。

通过在 `package.json` 中配置 `sideEffects`，可以明确告诉 Webpack：`"sideEffects": false` 表示该包中的所有模块都没有副作用，Webpack 可以放心地删除所有未被引用的模块。也可以指定有副作用的文件列表（如 `["*.css", "*.less", "./src/polyfill.js"]`），其余模块均视为无副作用，Webpack 会保留 CSS 和 polyfill 的副作用，对其他未被引用的模块执行 Tree Shaking。
