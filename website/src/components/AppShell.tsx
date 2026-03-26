import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppState } from '../context/AppStateContext'
import { SettingsDrawer } from './SettingsDrawer'

function SettingsIcon() {
  return (
    <svg aria-hidden="true" className="settings-icon" viewBox="0 0 24 24">
      <path
        d="M10.95 2.6a1 1 0 0 1 2.1 0l.22 1.63a7.86 7.86 0 0 1 1.9.79l1.32-.98a1 1 0 0 1 1.49.18l1.22 1.72a1 1 0 0 1-.2 1.4l-1.3.96c.2.61.32 1.25.36 1.9l1.6.23a1 1 0 0 1 .84 1v2.1a1 1 0 0 1-.84 1l-1.6.23a7.84 7.84 0 0 1-.79 1.9l.98 1.32a1 1 0 0 1-.18 1.49l-1.72 1.22a1 1 0 0 1-1.4-.2l-.96-1.3c-.61.2-1.25.32-1.9.36l-.23 1.6a1 1 0 0 1-1 .84h-2.1a1 1 0 0 1-1-.84l-.23-1.6a7.84 7.84 0 0 1-1.9-.79l-1.32.98a1 1 0 0 1-1.49-.18L3.8 18.4a1 1 0 0 1 .2-1.4l1.3-.96a7.9 7.9 0 0 1-.36-1.9l-1.6-.23a1 1 0 0 1-.84-1v-2.1a1 1 0 0 1 .84-1l1.6-.23c.1-.66.36-1.3.79-1.9l-.98-1.32a1 1 0 0 1 .18-1.49L6.65 4a1 1 0 0 1 1.4.2l.96 1.3c.61-.2 1.25-.32 1.9-.36l.23-1.6ZM12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function AppShell({
  eyebrow,
  title,
  description,
  actions,
  children,
  showTopbar = true,
  showPageHeader = true,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  showTopbar?: boolean
  showPageHeader?: boolean
}) {
  const {
    state: { settingsDrawerOpen },
    toggleSettingsPanel,
  } = useAppState()

  return (
    <div className={`site-shell ${showTopbar ? '' : 'site-shell-topbarless'}`}>
      {showTopbar ? (
        <header className="site-topbar">
          <div className="brand-lockup">
            <NavLink className="brand-mark" to="/">
              AtelierCode
            </NavLink>
            <span className="brand-caption">Docs Driven Practice</span>
          </div>

          <nav aria-label="主导航" className="site-nav">
            <NavLink
              className={({ isActive }) => `site-nav-link ${isActive ? 'active' : ''}`}
              end
              to="/"
            >
              首页
            </NavLink>
            <NavLink
              className={({ isActive }) => `site-nav-link ${isActive ? 'active' : ''}`}
              to="/learn"
            >
              学习模式
            </NavLink>
            <NavLink
              className={({ isActive }) => `site-nav-link ${isActive ? 'active' : ''}`}
              to="/library"
            >
              题库
            </NavLink>
            <NavLink
              className={({ isActive }) => `site-nav-link ${isActive ? 'active' : ''}`}
              to="/exam"
            >
              考试模式
            </NavLink>
            <NavLink
              className={({ isActive }) => `site-nav-link ${isActive ? 'active' : ''}`}
              to="/theory"
            >
              理论知识
            </NavLink>
          </nav>

          <div className="topbar-utilities">
            <button
              aria-expanded={settingsDrawerOpen}
              aria-label="打开配置面板"
              className="icon-button"
              onClick={toggleSettingsPanel}
              type="button"
            >
              <SettingsIcon />
            </button>
            <span aria-hidden="true" className="status-avatar">
              A
            </span>
          </div>
        </header>
      ) : null}

      <main className={`page-frame ${showPageHeader ? '' : 'page-frame-headerless'}`}>
        {showPageHeader ? (
          <section className="page-header">
            <div className="page-heading">
              {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
              <h1>{title}</h1>
              {description ? <p>{description}</p> : null}
            </div>
            {actions ? <div className="page-actions">{actions}</div> : null}
          </section>
        ) : null}

        <section className="page-content">{children}</section>
      </main>

      {settingsDrawerOpen ? <SettingsDrawer /> : null}
    </div>
  )
}
