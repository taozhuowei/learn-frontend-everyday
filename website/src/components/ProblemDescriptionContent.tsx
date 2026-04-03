/**
 * Component: ProblemDescriptionContent
 * Purpose: Render shared problem description, parameter, return value, and sample-case content.
 * Data flow: Read immutable problem metadata and render a consistent description block for learn and exam pages.
 */

import type { ProblemRecord } from '../types/content'
import { MarkdownContent } from './MarkdownContent'

export function ProblemDescriptionContent({ problem }: { problem: ProblemRecord }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-base font-bold text-[var(--color-ink)]">{problem.title}</h2>
        <span className="text-xs font-bold text-[var(--color-primary-ink)] bg-[var(--color-primary-soft)] px-2 py-0.5 rounded-full shrink-0">
          {problem.categoryName}
        </span>
      </div>

      <div className="text-sm text-[var(--color-ink-secondary)] leading-relaxed">
        <MarkdownContent markdown={problem.description} />
      </div>

      {(problem.paramsText || problem.returnText) && (
        <div className="flex flex-col gap-3 pt-1">
          {problem.paramsText ? (
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-muted)] block mb-1.5">
                入参
              </span>
              <div className="text-sm text-[var(--color-ink-secondary)]">
                <MarkdownContent markdown={problem.paramsText} />
              </div>
            </div>
          ) : null}
          {problem.returnText ? (
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-muted)] block mb-1.5">
                返回值
              </span>
              <div className="text-sm text-[var(--color-ink-secondary)]">
                <MarkdownContent markdown={problem.returnText} />
              </div>
            </div>
          ) : null}
        </div>
      )}

      {problem.basicCases.length > 0 ? (
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-muted)] block mb-2">
            示例
          </span>
          <div className="flex flex-col gap-2">
            {problem.basicCases.map((singleCase) => (
              <div
                className="rounded-md border border-[var(--color-border)] px-3 py-2 text-xs font-mono bg-[var(--color-surface-secondary)]"
                key={singleCase.id}
              >
                <div className="text-[var(--color-ink-muted)] mb-0.5">输入</div>
                <div className="mb-1 break-all">{singleCase.input}</div>
                <div className="text-[var(--color-ink-muted)] mb-0.5">期望输出</div>
                <div>{JSON.stringify(singleCase.expected)}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
