/**
 * Component: ExamProblemPanel
 * Purpose: Render the exam-only left panel with problem navigation and the current problem statement.
 * Data flow: Receive the current problem and session item metadata from ExamSessionPage; emit only the selected problem id.
 */

import type { ProblemRecord } from '../types/content'
import { ProblemDescriptionContent } from './ProblemDescriptionContent'

export type ExamSidebarItem = {
  id: string
  label: string
  status?: string
  score?: number
}

export function ExamProblemPanel({
  problem,
  items,
  currentProblemId,
  onSelect,
}: {
  problem: ProblemRecord
  items: ExamSidebarItem[]
  currentProblemId: string
  onSelect: (problemId: string) => void
}) {
  return (
    <aside className="flex flex-col h-full bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
      <div className="shrink-0 max-h-48 overflow-y-auto border-b border-[var(--color-border)]">
        <ul>
          {items.map((item, index) => {
            const isActive = item.id === currentProblemId

            return (
              <li key={item.id}>
                <button
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                    isActive
                      ? 'bg-[var(--color-primary-soft)] text-[var(--color-ink)]'
                      : 'hover:bg-[var(--color-surface-secondary)] text-[var(--color-ink-secondary)]'
                  }`}
                  onClick={() => onSelect(item.id)}
                  type="button"
                >
                  <span
                    className={`shrink-0 text-[0.6rem] font-bold font-mono w-6 text-right ${
                      isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-ink-muted)]'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 truncate text-sm font-semibold">{item.label}</span>
                  {item.status ? (
                    <span
                      className={`shrink-0 text-[0.6rem] font-bold ${
                        item.status === '已提交'
                          ? 'text-[var(--color-success)]'
                          : 'text-[var(--color-ink-muted)]'
                      }`}
                    >
                      {item.status}
                    </span>
                  ) : null}
                  {typeof item.score === 'number' ? (
                    <span className="shrink-0 text-[0.6rem] font-bold text-[var(--color-primary)]">
                      {item.score}分
                    </span>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <ProblemDescriptionContent problem={problem} />
      </div>
    </aside>
  )
}
