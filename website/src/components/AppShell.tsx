/**
 * Component: AppShell
 * Purpose: 全局布局框架，包含 48px 顶栏导航（品牌 CF + CodeForge）和页面容器结构。
 */

import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ChevronLeft, Settings2 } from 'lucide-react'
import { useAppState } from '../context/AppStateContext'
import { SettingsDrawer } from './SettingsDrawer'

export function AppShell({
  eyebrow,
  title,
  actions,
  headerRight,
  children,
  showTopbar = true,
  showPageHeader = true,
  showSettings = true,
  backTo,
  backLabel,
}: {
  eyebrow?: string
  title: string
  actions?: ReactNode
  headerRight?: ReactNode
  children: ReactNode
  showTopbar?: boolean
  showPageHeader?: boolean
  showSettings?: boolean
  /** Route to navigate back to when back button is clicked */
  backTo?: string
  /** Label shown next to the back arrow (default: "返回") */
  backLabel?: string
}) {
  const navigate = useNavigate()
  const {
    state: { settingsDrawerOpen },
    toggleSettingsPanel,
  } = useAppState()

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {showTopbar ? (
        <header className="h-12 flex items-center justify-between px-3 sm:px-5 bg-white border-b border-[var(--color-border)] shrink-0 z-50">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <NavLink
              className="flex items-center gap-2 font-extrabold text-[0.95rem] tracking-tight shrink-0"
              to="/"
            >
              <span
                className="w-7 h-7 rounded-[7px] bg-[var(--color-primary)] text-white text-xs font-extrabold flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                CF
              </span>
              <span className="text-[var(--color-ink)] hidden sm:inline">CodeForge</span>
            </NavLink>

            {backTo && !showPageHeader ? (
              <button
                className="flex items-center gap-0.5 px-1 sm:px-2 h-7 rounded-md text-xs font-semibold text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-secondary)] transition-colors shrink-0"
                onClick={() => navigate(backTo)}
                type="button"
              >
                <ChevronLeft size={14} />
                <span className="hidden sm:inline">{backLabel ?? '返回'}</span>
              </button>
            ) : null}

            <nav
              aria-label="主导航"
              className="flex items-center gap-0 sm:gap-1 overflow-x-auto no-scrollbar mask-image-fade"
            >
              {[
                { to: '/', label: '首页', end: true },
                { to: '/learn', label: '学习' },
                { to: '/exam', label: '考试' },
                { to: '/theory', label: '理论' },
              ].map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  className={({ isActive }) =>
                    `px-2 sm:px-3 h-12 flex items-center text-sm font-semibold border-b-2 transition-colors shrink-0 ${
                      isActive
                        ? 'border-[var(--color-primary)] text-[var(--color-ink)]'
                        : 'border-transparent text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)]'
                    }`
                  }
                  end={end}
                  to={to}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-2">
            {headerRight ? <div className="flex items-center">{headerRight}</div> : null}
            {showSettings ? (
              <button
                aria-expanded={settingsDrawerOpen}
                aria-label="打开配置面板"
                className="w-8 h-8 flex items-center justify-center rounded-md text-[var(--color-ink-tertiary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-ink)] transition-colors"
                onClick={toggleSettingsPanel}
                title="考试设置"
                type="button"
              >
                <Settings2 size={16} />
              </button>
            ) : null}
          </div>
        </header>
      ) : null}

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {showPageHeader ? (
          <div className="px-5 pt-2 pb-2 border-b border-[var(--color-border)] bg-white shrink-0">
            {eyebrow ? (
              <span className="text-[0.625rem] font-bold uppercase tracking-widest text-[var(--color-primary-ink)] block mb-0.5">
                {eyebrow}
              </span>
            ) : null}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                {backTo ? (
                  <button
                    className="flex items-center gap-0.5 shrink-0 text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] transition-colors"
                    onClick={() => navigate(backTo)}
                    type="button"
                    aria-label="返回上一页"
                  >
                    <ChevronLeft size={16} />
                  </button>
                ) : null}
                <h1 className="text-base font-bold tracking-tight text-[var(--color-ink)] truncate">
                  {title}
                </h1>
              </div>
              {actions ? <div className="flex items-center gap-2 shrink-0">{actions}</div> : null}
            </div>
          </div>
        ) : null}

        <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
      </main>

      {settingsDrawerOpen ? <SettingsDrawer /> : null}
    </div>
  )
}
