import { useMemo, useState } from "react";
import { scanComponents, type ComponentInfo } from "./componentLoader";
import "./index.css";

/**
 * 模块名称：React launcher 主界面
 * 用途：展示自动扫描到的组件列表，并渲染当前选中的组件预览。
 */

function App() {
  const components = useMemo<ComponentInfo[]>(() => scanComponents(), []);
  const [selected_component_id, setSelectedComponentId] = useState<string | null>(
    components[0]?.id ?? null,
  );

  const selected_component =
    components.find((component) => component.id === selected_component_id) ?? null;

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="sidebar-title">组件列表</h2>
        <ul className="component-list">
          {components.map((component) => (
            <li
              key={component.id}
              className={`component-item ${
                selected_component?.id === component.id ? "active" : ""
              }`}
              onClick={() => setSelectedComponentId(component.id)}
            >
              {component.name}
            </li>
          ))}
        </ul>
        {components.length === 0 && <p className="no-components">暂未发现可预览组件</p>}
      </aside>

      <main className="main-content">
        {selected_component ? (
          <>
            <div className="preview-header">
              <h1>{selected_component.name}</h1>
              <span className="file-path">
                {selected_component.path}
                {selected_component.export_name === "default"
                  ? ""
                  : ` · ${selected_component.export_name}`}
              </span>
            </div>
            <div className="preview-container">
              <selected_component.Component />
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>请把可渲染的 `.jsx` 或 `.tsx` 组件文件放到 launcher 同级目录。</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
