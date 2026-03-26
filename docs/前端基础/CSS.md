# CSS

## link 和 @import 的区别？

`link` 是 HTML 标签，加载的 CSS 会和页面同时加载；权重高于 `@import`。实际开发中，推荐使用 `link`。

`@import` 是 CSS 语法。`@import` 引入的 CSS 会等页面加载完再加载。

## 移动端适配的方式

1. 固定宽度，两侧留白。基础做法，不推荐。
2. 固定宽度，通过 `@media`（媒体查询）在不同尺寸断点生效对应的布局。
3. `rem` 单位。通过设置 HTML 根节点字体大小作为锚点，其他布局尺寸使用 `rem` 作为单位。当界面尺寸变化时，改变 HTML 根节点字体大小来同步改变内部布局尺寸。
4. `vw`/`vh` 单位。使用 viewport 视口宽度和高度作为参照，将其等份为 100 份，其中 1 份是 `1vw`/`1vh`。
5. 百分比单位。通过设置百分比来控制元素占据父元素的尺寸百分比，实现自适应。
6. Flex 布局。通过设置 Flex 来控制元素在主轴空间上占据多少比例的尺寸，以及如何分布间距。
7. Grid 布局。通过设置 Grid 布局来控制元素应该占据多少格，并按比例分配空间。
8. 栅格化布局。一些 CSS 框架或前端组件库提供了栅格化布局。本质上还是将屏幕尺寸等分为若干个栅格，然后控制每个元素应该占几份。

## PX 转 Rem

目标 REM 值 = PX 值 / 根元素字体大小。

## 前端动画实现的方式

1. CSS Transition（过渡动画）
2. CSS Animation（关键帧动画）
3. `requestAnimationFrame`（JS 动画）
4. Canvas 动画
5. SVG 动画

## 盒模型是什么？标准盒模型 & IE 盒模型区别？

CSS 中可通过 `box-sizing` 属性来切换盒模型。

- 设置为标准盒模型：使用 `box-sizing: content-box;`，这是 CSS 的默认盒模型，元素的 `width` 和 `height` 仅指内容区的宽度和高度，内边距（`padding`）和边框（`border`）会增加元素的总尺寸。
- 设置为怪异盒模型（IE 盒模型）：使用 `box-sizing: border-box;`，此时元素的 `width` 和 `height` 包含了内容区、内边距和边框，内边距和边框不会增加元素总尺寸，而是会压缩内容区域。

## 行内元素、块级元素有哪些？区别是什么？

### 块级元素

`<div>`、`<p>`、`<h1>`~`<h6>`、`<ul>`、`<ol>`、`<li>`、`<table>` 等。独占一行，可设宽高、内外边距。

### 行内元素

- `<span>`、`<a>`、`<img>`、`<input>`、`<button>`、`<label>` 等。
- 只占自身宽度，不换行，设置 `width`/`height` 无效（`<img>` 等替换元素除外）。

### 区别要点

- 是否独占一行。
- 能否设置宽高。
- 垂直方向的 `padding`/`margin` 行内元素不占空间。

## CSS 选择器优先级怎么算？

优先级从高到低：

1. `!important`
2. 行内样式（`style="..."`）
3. ID 选择器（`#id`）
4. 类选择器（`.class`）、属性选择器（`[attr]`）、伪类（`:hover`）
5. 标签选择器（`div`）、伪元素（`::before`）
6. 通配符 `*`

### 权重计算方式（近似）

- 行内样式：1000
- ID：100
- 类/属性/伪类：10
- 标签/伪元素：1

比较时，按位比较，数值越大优先级越高。

## 如何隐藏一个元素？各种方式有什么区别？

- `display: none`：隐藏元素不存在于 DOM 结构中，触发后会导致重排影响性能。
- `visibility: hidden`：元素仍然在 DOM 中，只触发重绘。
- `opacity: 0`：元素仍然在 DOM 中，只触发重绘，仍可交互。
- `position: absolute; left: -9999px`：移出视口。
- `height: 0; overflow: hidden`：高度塌陷。

## display: none 和 visibility: hidden 区别？

- `display: none`：元素从文档流中消失，不占空间。会触发重排（回流）。
- `visibility: hidden`：元素不可见，但仍然占空间。只触发重绘，不重排。

## BFC 是什么？怎么触发？能解决什么问题？

BFC（Block Formatting Context，块级格式化上下文）是一个独立的渲染区域，内部元素不影响外部，外部也不影响内部。

### 触发条件（常见）

- 根元素 `<html>`
- 浮动元素：`float` 不为 `none`
- 绝对定位或固定定位元素：`position` 为 `absolute` 或 `fixed`
- `display` 为 `inline-block`、`table-cell`、`table-caption`、`flex`、`inline-flex`
- `overflow` 不为 `visible`
- `display: flow-root`

### 能解决的问题

- 避免 `margin` 重叠。
- 清除浮动（包含浮动子元素）。
- 实现自适应布局（比如左固定右自适应）。
- 避免父元素高度塌陷。

## 什么是重排（回流）和重绘？

重排是指由于元素的几何属性发生变化，导致浏览器重新计算元素的布局，进而重新构建渲染树的过程。

重绘是指当元素的外观发生变化，但不影响其几何属性（位置、大小等）时，浏览器重新绘制元素的过程。

### 常见的重排场景

- 改变元素的尺寸，如修改 `width`、`height`、`padding`、`margin` 等属性。
- 改变元素的位置，如修改 `top`、`left`、`right`、`bottom` 等属性。
- 改变元素的字体大小，因为这会影响文本的尺寸，进而影响元素的布局。
- 添加或删除可见的 DOM 元素。

### 常见的重绘场景

- 改变元素的颜色，如修改 `color` 属性。
- 改变元素的背景色，如修改 `background-color` 属性。
- 改变元素的边框样式，如修改 `border-style`、`border-color` 等属性。
- 改变元素的透明度，如修改 `opacity` 属性。

## 实现垂直居中

1. 块级元素垂直居中
   - `display: flex` + `align-items: center`
   - `display: grid` + `align-items: center`
   - 父元素设置 `position: relative`，子元素设置 `position: absolute` + `top: 50%`（将上边界移动到中间）+ `transform: translateY(-50%)`（向上移动一半的高度）
2. 行内元素垂直居中
   - `line-height` 设置为等同于元素的 `height`
   - `vertical-align: middle`

## 常见 CSS 布局：左固定宽，右自适应有几种实现？

- 左侧设置 `float: left`，固定宽度。右侧设置 `margin` 和左侧宽度相同。
- 左侧设置 `float: left`，固定宽度。右侧设置 `overflow: hidden` 触发 BFC，不与左侧重叠。
- Flex 布局。

## flex: 1 和 flex: auto 分别代表什么？二者有什么区别？

1. `flex: 1` 是 `flex-grow: 1; flex-shrink: 1; flex-basis: 0%` 的简写。
2. `flex: auto` 是 `flex-grow: 1; flex-shrink: 1; flex-basis: auto` 的简写。
3. `flex-grow` 属性控制对剩余空间的分配比例。
   - `flex-grow: 1` 表示如果有剩余空间，那么将剩余空间平分后，该元素额外占据 1 份空间。如果该值是大于 1 的数，则表示额外多占更多空间。
   - `flex-grow: 0` 表示即使有剩余空间，也不放大。
4. `flex-shrink` 属性控制剩余空间不足时，元素如何缩小。
   - `flex-shrink: 1` 表示如果剩余空间不足，那么将缺失的空间平分，该元素缩小 1 份空间的大小。如果该值大于 1，则表示更多缩小来适应空间。
   - `flex-shrink: 0` 表示即使空间不足，也不缩小。
5. `flex-basis` 属性表示该元素的基准尺寸。在 flex 布局中，这个属性的优先级高于元素本身的 `width` 属性。
   - `flex-basis: 0%` 表示该元素的基准尺寸是 0，那么它的放大缩小完全由 `flex-grow` 和 `flex-shrink` 控制。
   - `flex-basis: auto` 表示该元素的基准尺寸是该元素内容占据的空间。当需要放大或缩小时，会优先满足其内部元素的空间，然后再分配多余空间。
