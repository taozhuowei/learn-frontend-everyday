import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'

export function NotFoundPage() {
  return (
    <AppShell eyebrow="404" title="页面不存在">
      <section className="panel compact-panel not-found-panel">
        <div className="spotlight-actions">
          <Link className="action-button primary" to="/">
            返回首页
          </Link>
        </div>
      </section>
    </AppShell>
  )
}
