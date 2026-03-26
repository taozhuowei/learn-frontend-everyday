# Next.js

## Next.js 对比 React 做了哪些额外优化

### 1. 图片优化

通过使用 `next/Image` 组件可以生效图片优化，包含如下能力：

- 通过加载器自动补全 URL
- 自动采用现代图片格式
- 自动识别静态图片的宽高，保证始终提供正确的宽高，以减少累积布局偏移
- 图片仅在进入视口时加载，可选择模糊占位符
- 即使图片存储在远程服务器也可以按需调整图片大小
- 可以通过 `priority` 来调整优先级，优先加载最影响 LCP 的图片

### 2. 字体优化

通过使用 `next/Head` 组件可以生效字体优化，包含如下能力：

- 自动内联字体 CSS，减少服务器请求

### 3. Script 优化

通过使用 `next/Script` 组件可以生效脚本优化，包含如下能力：

- 使用 `strategy` 属性可以使开发者能够在应用中的任何位置设置第三方脚本的加载优先级，而无需直接追加到 `next/head`，从而节省开发时间并提升加载性能。
  - `beforeInteractive`：页面变为交互状态前加载
  - `afterInteractive`（默认）：页面变为交互状态后立即加载
  - `lazyOnload`：空闲时加载

## Next.js 的两种预渲染模式

### 静态生成（推荐）

HTML 在构建时生成，并在每次页面请求（request）时重用。通过 `export async getStaticProps` 获取数据。通过 `export async getStaticPaths` 获取动态路径。

### 服务器端渲染

在每次页面请求（request）时重新生成 HTML。通过在 page 中 `export` 一个名为 `getServerSideProps` 的 `async` 函数。服务器会在每次请求页面时调用此函数。

可以为每个页面选择预渲染的方式，创建一个"混合渲染"的 Next.js 应用程序。出于性能考虑，更推荐使用静态生成，这样可以只构建一次，然后托管在 CDN 上来获得更好的性能。但是，如果无法在用户请求前预渲染页面，则需要使用服务器端渲染。

## 静态生成获取动态数据

### 页面内容取决于外部数据

通过在页面的同一个文件中 `export` 一个名为 `getStaticProps` 的 `async` 函数来获取外部数据。该函数会在构建时被调用，并将数据作为 `props` 传递给页面。

### 页面路径（paths）取决于外部数据

通过在动态路由页面的同一个文件中 `export` 一个名为 `getStaticPaths` 的 `async` 函数来获取外部路径。后续，也需要通过 `getStaticProps` 来根据路径 id 对应的数据 id 来获取动态路由页面对应的数据。

## Next.js 的 Layout 组件的作用是什么

Layout 组件是 Next.js App Router（`app/` 目录）中的核心概念，通过在路由目录下创建 `layout.tsx`（或 `layout.js`）文件来定义。它的核心作用是**在多个页面之间共享 UI 布局，且在页面切换时不会重新渲染**。

### 核心特性

1. **共享布局**：Layout 包裹其子路由页面，定义通用的 UI 结构（如导航栏、侧边栏、页脚等），避免在每个页面中重复编写相同的布局代码。
2. **状态保持，不重新渲染**：当用户在同一个 Layout 下的不同页面之间导航时，Layout 组件不会被卸载和重新挂载，它的状态（如滚动位置、表单输入等）会被保持，只有页面内容部分会更新。
3. **嵌套布局**：Layout 支持嵌套。每个路由段都可以定义自己的 `layout.tsx`，子 Layout 会嵌套在父 Layout 内部，形成层级布局结构。例如 `/dashboard` 有一个带侧边栏的 Layout，`/dashboard/settings` 可以在此基础上再嵌套一个设置页专属的 Layout。
4. **根布局（Root Layout）**：`app/layout.tsx` 是必须存在的根布局，它替代了 Pages Router 中的 `_app.tsx` 和 `_document.tsx`，必须包含 `<html>` 和 `<body>` 标签。

访问 `/dashboard/settings` 时，页面结构为：`RootLayout` → `DashboardLayout` → `SettingsPage`，两层 Layout 嵌套渲染。
