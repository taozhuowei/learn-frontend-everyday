// 自动扫描上级目录的 .tsx 和 .jsx 组件文件
const modules = import.meta.glob<{
  default: React.ComponentType<any>
}>('../*.tsx', { eager: true });

const jsxModules = import.meta.glob<{
  default: React.ComponentType<any>
}>('../*.jsx', { eager: true });

export interface ComponentInfo {
  name: string;
  path: string;
  Component: React.ComponentType<any>;
}

// 提取文件名（去掉扩展名）
function getFileName(path: string): string {
  const match = path.match(/\/([^/]+)\.(tsx|jsx)$/);
  return match ? match[1] : path;
}

// 扫描所有组件
export function scanComponents(): ComponentInfo[] {
  const components: ComponentInfo[] = [];

  // 处理 .tsx 文件
  Object.entries(modules).forEach(([path, module]) => {
    if (module.default) {
      components.push({
        name: getFileName(path),
        path,
        Component: module.default
      });
    }
  });

  // 处理 .jsx 文件
  Object.entries(jsxModules).forEach(([path, module]) => {
    if (module.default) {
      components.push({
        name: getFileName(path),
        path,
        Component: module.default
      });
    }
  });

  // 按名称排序
  return components.sort((a, b) => a.name.localeCompare(b.name));
}
