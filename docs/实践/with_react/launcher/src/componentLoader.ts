import type { ComponentType } from "react";

/**
 * 模块名称：React 组件扫描器
 * 用途：扫描 launcher 同级目录中的 React 组件文件，并整理为可直接渲染的组件清单。
 */

type React_module = Record<string, unknown>;

interface React_component_candidate {
  export_name: string;
  component: ComponentType;
}

export interface ComponentInfo {
  id: string;
  name: string;
  path: string;
  export_name: string;
  Component: ComponentType;
}

const react_modules = import.meta.glob<React_module>(["../../*.jsx", "../../*.tsx"], {
  eager: true,
});

function getBaseName(path: string): string {
  const matched_result = path.match(/\/([^/]+)\.(jsx|tsx)$/);

  return matched_result ? matched_result[1] : path;
}

function isTestFile(path: string): boolean {
  return /_test\.(jsx|tsx)$/.test(path);
}

function isReactComponent(candidate: unknown): candidate is ComponentType {
  if (typeof candidate === "function") {
    return true;
  }

  if (typeof candidate === "object" && candidate !== null) {
    return "$$typeof" in candidate;
  }

  return false;
}

function pickDefaultExport(module: React_module): React_component_candidate | null {
  if (!("default" in module)) {
    return null;
  }

  const default_export = module.default;

  if (!isReactComponent(default_export)) {
    return null;
  }

  return {
    export_name: "default",
    component: default_export,
  };
}

function pickNamedExport(module: React_module): React_component_candidate | null {
  const export_entries = Object.entries(module);

  for (const [export_name, export_value] of export_entries) {
    if (export_name === "default") {
      continue;
    }

    if (!/^[A-Z]/.test(export_name)) {
      continue;
    }

    if (!isReactComponent(export_value)) {
      continue;
    }

    return {
      export_name,
      component: export_value,
    };
  }

  return null;
}

function pickComponent(module: React_module): React_component_candidate | null {
  const default_candidate = pickDefaultExport(module);

  if (default_candidate) {
    return default_candidate;
  }

  return pickNamedExport(module);
}

function getDisplayName(path: string, export_name: string): string {
  const base_name = getBaseName(path);

  if (export_name === "default") {
    return base_name;
  }

  return `${base_name}.${export_name}`;
}

export function scanComponents(): ComponentInfo[] {
  const components: ComponentInfo[] = [];

  for (const [path, module] of Object.entries(react_modules)) {
    if (isTestFile(path)) {
      continue;
    }

    const component_candidate = pickComponent(module);

    if (!component_candidate) {
      continue;
    }

    components.push({
      id: `${path}::${component_candidate.export_name}`,
      name: getDisplayName(path, component_candidate.export_name),
      path,
      export_name: component_candidate.export_name,
      Component: component_candidate.component,
    });
  }

  return components.sort((left_component, right_component) => {
    return left_component.name.localeCompare(right_component.name);
  });
}
