/**
 * Component: ExamResultPage
 * Purpose: Display exam results with score breakdown, pass/fail status,
 *          and expandable failure details for each problem.
 */

import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../context/AppStateContext'
import type { SubmittedProblemResult } from '../types/exam'

function ProblemResultCard({
  result,
  problemTitle,
}: {
  result: SubmittedProblemResult
  problemTitle: string
}) {
  const [expanded, setExpanded] = useState(false)
  const hasFailures = result.failures.length > 0
  const isPassed = result.ratio >= 1

  return (
    <div
      className={`rounded-lg border bg-white overflow-hidden ${
        isPassed ? 'border-[var(--color-success)]' : 'border-[var(--color-danger)]'
      }`}
    >
      <button
        className="w-full px-4 py-3 flex items-center justify-between gap-4 text-left"
        onClick={() => hasFailures && setExpanded(!expanded)}
        type="button"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`shrink-0 w-2 h-2 rounded-full ${
              isPassed ? 'bg-[var(--color-success)]' : 'bg-[var(--color-danger)]'
            }`}
          />
          <span className="font-medium text-[var(--color-ink)] truncate">{problemTitle}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`text-sm font-semibold px-2 py-0.5 rounded ${
              isPassed
                ? 'bg-[var(--color-success-light)] text-[var(--color-success)]'
                : 'bg-[var(--color-danger-light)] text-[var(--color-danger)]'
            }`}
          >
            {result.score}分
          </span>
          <span className="text-sm text-[var(--color-ink-secondary)]">
            {result.passedCount}/{result.totalCount}
          </span>
          {hasFailures ? (
            expanded ? (
              <ChevronUp size={16} className="text-[var(--color-ink-tertiary)]" />
            ) : (
              <ChevronDown size={16} className="text-[var(--color-ink-tertiary)]" />
            )
          ) : null}
        </div>
      </button>

      {expanded && hasFailures ? (
        <div className="border-t border-[var(--color-border)] px-4 py-3 space-y-3">
          {result.failures.map((failure) => (
            <div
              key={failure.caseId}
              className="rounded-md bg-[var(--color-surface-secondary)] p-3 space-y-2"
            >
              <p className="text-sm font-medium text-[var(--color-ink)]">{failure.description}</p>
              {failure.error ? (
                <p className="text-sm text-[var(--color-danger)]">{failure.error}</p>
              ) : null}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[var(--color-ink-muted)] block mb-1">预期</span>
                  <code className="block bg-white rounded px-2 py-1 text-[var(--color-success)] font-mono truncate">
                    {String(failure.expected)}
                  </code>
                </div>
                <div>
                  <span className="text-[var(--color-ink-muted)] block mb-1">实际</span>
                  <code className="block bg-white rounded px-2 py-1 text-[var(--color-danger)] font-mono truncate">
                    {String(failure.actual)}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function ExamResultPage() {
  const navigate = useNavigate()
  const { state, clearExam, getProblemById } = useAppState()

  if (!state.result) {
    return <Navigate replace to="/exam" />
  }

  const handleRestart = () => {
    clearExam()
    navigate('/exam')
  }

  const actions = (
    <>
      <button
        className="px-4 h-9 rounded-md bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-strong)] transition-colors"
        onClick={handleRestart}
        type="button"
      >
        再来一轮
      </button>
      <button
        className="px-4 h-9 rounded-md border border-[var(--color-border)] bg-white text-[var(--color-ink)] text-sm font-semibold hover:bg-[var(--color-surface-secondary)] transition-colors"
        onClick={() => navigate('/learn')}
        type="button"
      >
        返回学习
      </button>
    </>
  )

  return (
    <AppShell
      eyebrow="结果"
      title={state.result.passed ? '本轮通过' : '本轮未通过'}
      actions={actions}
    >
      <div className="h-full flex flex-col bg-[var(--color-canvas)]">
        {/* Metrics Row */}
        <div className="px-5 py-4 bg-white border-b border-[var(--color-border)]">
          <div className="flex items-center gap-8">
            <div>
              <div className="text-3xl font-bold text-[var(--color-ink)]">
                {state.result.totalScore}
              </div>
              <div className="text-xs text-[var(--color-ink-tertiary)] mt-0.5">总分</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[var(--color-ink)]">
                {state.result.passingScore}
              </div>
              <div className="text-xs text-[var(--color-ink-tertiary)] mt-0.5">及格线</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[var(--color-ink)]">
                {state.result.perProblem.length}
              </div>
              <div className="text-xs text-[var(--color-ink-tertiary)] mt-0.5">已评题数</div>
            </div>
          </div>
        </div>

        {/* Result Cards List */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="max-w-3xl mx-auto space-y-3">
            {state.result.perProblem.map((result) => {
              const problem = getProblemById(result.problemId)
              if (!problem) return null
              return (
                <ProblemResultCard
                  key={result.problemId}
                  result={result}
                  problemTitle={problem.title}
                />
              )
            })}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
