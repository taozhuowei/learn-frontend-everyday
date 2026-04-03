import { markRaw, type Component } from "vue";

/**
 * 模块名称：Vue 组件扫描器
 * 用途：扫描 launcher 同级目录中的 Vue 单文件组件，并整理为可直接渲染的组件清单。
 */

interface Vue_module {
  default?: Component;
}

export interface ComponentInfo {
  id: string;
  name: string;
  path: string;
  component: Component;
}

const vue_modules = import.meta.glob<Vue_module>("../../*.vue", {
  eager: true,
});

function getBaseName(path: string): string {
  const matched_result = path.match(/\/([^/]+)\.vue$/);

  return matched_result ? matched_result[1] : path;
}

function isTestFile(path: string): boolean {
  return /_test\.vue$/.test(path);
}

export function scanComponents(): ComponentInfo[] {
  const components: ComponentInfo[] = [];

  for (const [path, module] of Object.entries(vue_modules)) {
    if (isTestFile(path)) {
      continue;
    }

    if (!module.default) {
      continue;
    }

    components.push({
      id: path,
      name: getBaseName(path),
      path,
      component: markRaw(module.default),
    });
  }

  return components.sort((left_component, right_component) => {
    return left_component.name.localeCompare(right_component.name);
  });
}
