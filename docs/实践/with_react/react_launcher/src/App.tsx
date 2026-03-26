import { useState } from "react";
import { scanComponents, ComponentInfo } from "./componentLoader";
import "./index.css";

function App() {
  const [components] = useState<ComponentInfo[]>(() => scanComponents());
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentInfo | null>(
      components.length > 0 ? components[0] : null,
    );

  return (
    <div className="app">
      {/* 侧边栏 - 组件列表 */}
      <aside className="sidebar">
        <h2 className="sidebar-title">组件列表</h2>
        <ul className="component-list">
          {components.map((component) => (
            <li
              key={component.path}
              className={`component-item ${
                selectedComponent?.path === component.path ? "active" : ""
              }`}
              onClick={() => setSelectedComponent(component)}
            >
              {component.name}
            </li>
          ))}
        </ul>
        {components.length === 0 && <p className="no-components">暂无组件</p>}
      </aside>

      {/* 主区域 - 组件预览 */}
      <main className="main-content">
        {selectedComponent ? (
          <>
            <div className="preview-header">
              <h1>{selectedComponent.name}</h1>
              <span className="file-path">{selectedComponent.path}</span>
            </div>
            <div className="preview-container">
              <selectedComponent.Component />
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>请添加 .tsx 或 .jsx 组件文件到上级目录</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
