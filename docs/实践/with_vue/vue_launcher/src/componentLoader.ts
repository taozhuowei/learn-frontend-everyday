import type { Component } from 'vue'

// 自动扫描上级目录的 .vue 组件文件
const modules = import.meta.glob<{ default: Component }>('../*.vue', { eager: true })

export interface ComponentInfo {
  name: string
  path: string
  component: Component
}

// 提取文件名（去掉扩展名）
function getFileName(path: string): string {
  const match = path.match(/\/([^/]+)\.vue$/)
  return match ? match[1] : path
}

// 扫描所有组件
export function scanComponents(): ComponentInfo[] {
  const components: ComponentInfo[] = []

  // 处理 .vue 文件
  Object.entries(modules).forEach(([path, module]) => {
    if (module.default) {
      components.push({
        name: getFileName(path),
        path,
        component: module.default
      })
    }
  })

  // 按名称排序
  return components.sort((a, b) => a.name.localeCompare(b.name))
}
