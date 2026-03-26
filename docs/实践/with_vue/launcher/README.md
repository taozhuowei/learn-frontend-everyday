# Vue Launcher

`launcher` 用于本地预览 `docs/实践/with_vue/` 目录下的 Vue 单文件组件。

## 自动扫描规则

- 启动后会自动扫描 launcher 同级目录中的所有 `.vue` 文件。
- 文件名以 `_test.vue` 结尾的测试文件会被自动忽略。
- 每个被识别到的单文件组件都会自动出现在左侧列表中，点击即可在右侧预览。

## 启动方式

```bash
yarn install
yarn dev
```

## 组件放置方式

把 `.vue` 组件文件直接放在 `launcher` 的上一级目录，例如：

```text
with_vue/
├─ cascader.vue
└─ launcher/
```

不需要手动注册组件，也不需要额外修改入口文件。
