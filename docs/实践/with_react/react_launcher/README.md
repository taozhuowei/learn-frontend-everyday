# React Launcher

用于预览 `docs/手撕代码/with_react/` 目录下的 React 组件。

## 结构

```
react_launcher/
├── package.json          # 启动器依赖
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
├── index.html            # HTML 入口
└── src/
    ├── main.tsx          # 应用入口
    ├── App.tsx           # 主应用
    ├── componentLoader.ts # 扫描上级目录的组件
    └── index.css         # 样式
```

## 使用

```bash
npm install
npm run dev
```

启动后会自动扫描 `../` 目录下的所有 `.tsx` 和 `.jsx` 组件文件。

## 组件规范

在 `docs/手撕代码/with_react/` 目录下创建组件：

- 文件名：PascalCase（如 `Countdown.jsx`）
- 必须导出默认组件：`export default ComponentName`
