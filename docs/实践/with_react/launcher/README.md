# React Launcher

`launcher` 用于本地预览 `docs/实践/with_react/` 目录下的 React 组件。

## 自动扫描规则

- 启动后会自动扫描 launcher 同级目录中的所有 `.jsx` 和 `.tsx` 文件。
- 文件名以 `_test.jsx` 或 `_test.tsx` 结尾的测试文件会被自动忽略。
- 扫描时优先读取默认导出；如果没有默认导出，会继续尝试首个以大写字母开头的命名导出组件。
- 识别到的组件会自动出现在左侧列表中，点击即可在右侧预览。

## 启动方式

```bash
yarn install
yarn dev
```

## 组件放置方式

把可渲染的 React 组件文件直接放在 `launcher` 的上一级目录，例如：

```text
with_react/
├─ countdown.jsx
├─ cascader.jsx
└─ launcher/
```

不需要手动注册组件，也不需要修改 launcher 源码。
