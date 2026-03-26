# HTML

## DOCTYPE 是什么？严格模式 & 混杂模式怎么触发？

`DOCTYPE` 是用来告诉浏览器用哪种规范解析页面。

有两种模式：

- **严格模式（标准模式）**：浏览器按 W3C 标准解析渲染。
- **混杂模式（怪异模式）**：浏览器兼容老版本页面，行为类似老 IE。

如果 HTML 文档最上面写了一个正确的 `<!DOCTYPE html>`，就进入严格模式；如果没写、写错、或者上面有其他内容（比如注释、XML 声明），就可能触发混杂模式。

## HTML 语义化是什么？为什么要语义化？

HTML 语义化就是：用合适的标签表达内容含义，而不是全用 `<div>` + `<span>`。

好处：

1. 对开发者：结构清晰，易读易维护。
2. 对搜索引擎：SEO 更友好，爬虫能理解页面结构。
3. 对无障碍：屏幕阅读器能更好"读"网页。

常见语义标签：

- `<header>`、`<footer>`、`<nav>`、`<article>`、`<section>`、`<aside>` 等。

## data- 开头的元素属性是什么？

`data-` 开头的元素属性被称为自定义数据属性（Custom data attributes）。它们允许开发者向 HTML 元素添加额外的、自定义的数据，这些数据可以通过 JavaScript 进行访问和操作，常用于在 DOM 元素中存储与应用程序相关的信息，而不会影响文档的呈现或语义。

在 JavaScript 中可以通过 `dataset` 访问，但属性名中的 `-` 会被忽略，并且后续单词首字母大写。

## <script> 标签有哪些属性，有什么作用？

### src

用于指定外部脚本文件的 URL。当设置了 `src` 属性后，`<script>` 标签内部的代码将被忽略，浏览器会从指定的 URL 获取并执行脚本。

### async

HTML5 新增，用于异步加载和执行脚本。当浏览器遇到带有 `async` 属性的 `<script>` 标签时，会在下载脚本的同时继续解析 HTML 文档，脚本下载完成后立即执行，不会阻塞页面的解析。

### defer

HTML5 新增，同样用于异步加载脚本。与 `async` 不同的是，带有 `defer` 属性的脚本会在 HTML 文档解析完成后，`DOMContentLoaded` 事件触发之前执行。这意味着脚本的执行顺序与它们在文档中的出现顺序一致，适用于那些需要操作 DOM 元素且依赖于 HTML 结构已经解析完成的脚本。

### type

指定脚本的 MIME 类型。在 HTML5 之前，该属性用于明确脚本语言，例如 `type="text/javascript"`。在 HTML5 中，默认值为 `text/javascript`，当使用其他类型的脚本（如 WebAssembly 的 JavaScript 绑定脚本时），需要明确指定类型，例如 `type="module"` 用于定义 JavaScript 模块。

### charset

指定引用脚本的字符编码。浏览器通常会根据页面的整体字符编码来处理脚本。如果脚本的编码与页面编码不一致，使用该属性可以指定脚本的正确编码。

### crossorigin

用于处理跨域脚本的加载。它有两个值：`anonymous` 和 `use-credentials`。

- `anonymous` 表示以匿名方式跨域加载脚本，不会发送身份凭证（如 Cookie）。
- `use-credentials` 则表示在跨域加载脚本时发送身份凭证。

该属性对于从 CDN 等外部源加载脚本时处理跨域资源共享（CORS）相关问题很有用。

### integrity

与 `crossorigin` 属性配合使用，用于验证从外部源加载的脚本的完整性。它的值是脚本内容的加密哈希值（如 SHA-256、SHA-384 等）。浏览器在加载脚本时会计算脚本的哈希值，并与 `integrity` 属性的值进行比较，如果不匹配则拒绝执行脚本，从而防止脚本被篡改。

## async 和 defer 区别？

`async` 和 `defer` 都异步下载脚本、不阻塞 HTML 解析，`defer` 按顺序在 DOM 解析完、`DOMContentLoaded` 前执行，`async` 下载完就立即执行、顺序不确定。

## DOMContentLoaded 的触发时机

`DOMContentLoaded` 是浏览器 `document` 对象的核心事件，它的触发满足两个核心条件，且不等待外部资源加载：

1. 浏览器已完全解析完 HTML 文档，并构建出完整的 DOM 树（所有 HTML 标签都被解析为 DOM 节点）；
2. 所有带有 `defer` 属性的脚本执行完毕（`async` 脚本不影响该事件，因为 `async` 脚本是异步加载、执行，不阻塞 DOM 解析）。

## DOMContentLoaded 和 window.onload 的区别

- **`DOMContentLoaded`**：DOM 树构建完成（HTML 解析完），不等待图片、CSS、视频。
- **`window.onload`**：整个页面所有资源加载完成（包括图片/CSS 等），等待所有外部资源加载完。

## DOM 和 BOM

### DOM

DOM 是针对 HTML 和 XML 文档的一种 API，它将文档解析为一个由节点和对象（包含属性和方法）组成的树形结构，每个节点代表文档中的一个部分，如元素节点、文本节点、属性节点等。可以说 DOM 是 BOM 的一部分，BOM 涵盖了更广泛的与浏览器交互的功能，而 DOM 专注于文档内容的操作。

### BOM

BOM 是 JavaScript 与浏览器进行交互的接口，它提供了一系列对象来访问和操作浏览器的各个方面，如窗口、框架、导航栏、历史记录等。BOM 并没有一个官方的标准，不同浏览器的实现可能会有细微差异，但核心功能基本一致。

## BOM 中的 location 对象有哪些常用属性和方法？

### 常用属性

- `href`：获取或设置整个 URL，例如 `const currentUrl = window.location.href;`
- `protocol`：获取或设置 URL 的协议部分，如 `http:` 或 `https:`，`const protocol = window.location.protocol;`
- `host`：获取或设置主机名和端口号，例如 `example.com:80`，`const host = window.location.host;`
- `pathname`：获取或设置 URL 的路径部分，如 `/path/to/page`，`const path = window.location.pathname;`

### 常用方法

- `reload()`：重新加载当前页面，`window.location.reload();`
- `assign(url)`：导航到指定的 URL，`window.location.assign('new-url');`

## 设备 DPR 是否可以改变？

设备像素比（Device Pixel Ratio，DPR）在一般情况下，对于特定设备而言，在其正常使用过程中系统层面不可随意改变，但在开发和测试场景下，可以通过一些手段模拟不同的 DPR 值。

在 Chrome 浏览器的开发者工具中，通过 "Device toolbar" 可以选择不同的设备模式，其中就包括设置 DPR 的选项。

## DPR 对 Web 开发有什么影响？

- **图像资源加载**：为了在高 DPR 设备上显示清晰的图像，开发者需要提供更高分辨率的图像资源。例如，对于 DPR 为 2 的设备，需要提供两倍分辨率的图像，否则图像会显得模糊。可以通过使用 CSS 的 `srcset` 属性来根据 DPR 加载不同分辨率的图像，如 `<img src="image-lowres.jpg" srcset="image-lowres.jpg 1x, image-hires.jpg 2x" alt="example">`。
- **字体和图标显示**：在高 DPR 设备上，字体和图标可能会因为物理像素的增多而显得过小。开发者需要适当调整字体大小和图标尺寸，以保证在不同 DPR 设备上都有良好的可读性和视觉效果。可以使用相对单位（如 `em`、`rem`）来设置字体大小，这样字体大小会根据父元素或根元素的字体大小进行自适应调整。
- **布局和适配**：DPR 会影响页面的布局和适配。在响应式设计中，除了考虑不同屏幕尺寸，还需要考虑 DPR。例如，一些在低 DPR 设备上看起来合适的布局，在高 DPR 设备上可能因为物理像素的增加而显得拥挤。开发者可以使用媒体查询结合 DPR 来优化布局，如 `@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) { /* 针对DPR为2及以上的设备的样式 */ }`。

## HTML5 特性

1. 语义化标签
2. 本地存储
3. 多媒体支持（原生支持音频和视频播放，无需依赖第三方插件）
4. 画布（Canvas）
5. 地理定位（`navigator.geolocation`）
6. Web Workers
7. 拖放（Drag and Drop）

## Canvas 和 SVG 有什么区别？

### 绘制原理

- **Canvas**：基于像素绘制，通过 JavaScript 操作 2D Context 来绘制图形，绘制的图形是位图，放大后可能出现锯齿。
- **SVG**：基于矢量绘制，使用 XML 格式描述图形，图形由路径、形状等矢量元素组成，无论如何缩放都不会失真。

### 应用场景

- **Canvas**：适合绘制动态图形、游戏、数据可视化中对性能要求较高且不需要精确缩放的场景。
- **SVG**：适用于需要精确缩放的图形，如图标、地图等，并且支持事件绑定，可实现交互效果。

### 性能表现

- **Canvas**：在绘制大量简单图形或进行动画绘制时性能较好，因为它直接操作像素。
- **SVG**：在图形较复杂且需要频繁修改和交互时，由于其矢量特性，性能可能优于 Canvas，但如果图形过于复杂，渲染性能可能会下降。
