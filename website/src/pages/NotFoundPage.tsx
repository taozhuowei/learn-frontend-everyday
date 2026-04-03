/**
 * Page: NotFoundPage
 * Purpose: 404 页面，页面不存在时的兜底展示。
 */

import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'

export function NotFoundPage() {
  return (
    <AppShell eyebrow="404" title="页面不存在">
      <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
        <div className="text-center">
          <p className="text-6xl font-extrabold text-[var(--color-border-strong)] mb-4">404</p>
          <p className="text-sm text-[var(--color-ink-secondary)]">
            你访问的页面不存在或已被移除。
          </p>
        </div>
        <Link
          className="inline-flex items-center px-4 py-2 rounded-md bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-strong)] transition-colors"
          to="/"
        >
          返回首页
        </Link>
      </div>
    </AppShell>
  )
}
