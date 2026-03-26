/**
 * 模块名称：React launcher Vite 配置
 * 用途：让 launcher 能稳定解析并预览同级目录中的 React 组件文件。
 */

import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const src_alias = fileURLToPath(new URL("./src", import.meta.url));
const react_entry = fileURLToPath(new URL("./node_modules/react/index.js", import.meta.url));
const react_jsx_runtime_entry = fileURLToPath(
  new URL("./node_modules/react/jsx-runtime.js", import.meta.url),
);
const react_jsx_dev_runtime_entry = fileURLToPath(
  new URL("./node_modules/react/jsx-dev-runtime.js", import.meta.url),
);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^react\/jsx-runtime$/, replacement: react_jsx_runtime_entry },
      { find: /^react\/jsx-dev-runtime$/, replacement: react_jsx_dev_runtime_entry },
      { find: /^react$/, replacement: react_entry },
      { find: "@", replacement: src_alias },
    ],
    dedupe: ["react", "react-dom"],
  },
});
