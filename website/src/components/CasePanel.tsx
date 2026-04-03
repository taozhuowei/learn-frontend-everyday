/**
 * Component: CasePanel
 * Purpose: 右侧用例面板，展示测试用例、自定义用例和控制台日志。
 * actions 独立于 panel header，位于 tabs 上方的专属 action bar 中。
 * 用户可在基础用例下追加自定义用例（不计入正式提交判题）。
 */

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { JudgeCase } from '../types/content'
import type { ExecutionResponse } from '../types/exam'

type PanelTab = 'cases' | 'console'

export function CasePanel({
  title,
  cases,
  execution,
  consoleExecution,
  customCaseInput,
  onCustomInputChange,
  actions,
  hideConsoleDetails = false,
}: {
  title: string
  cases: JudgeCase[]
  execution: ExecutionResponse | null
  consoleExecution?: ExecutionResponse | null
  customCaseInput?: string
  onCustomInputChange?: (value: string) => void
  actions?: ReactNode
  /** 考试模式传 true：控制台只显示通过率摘要，不展示用例详情 */
  hideConsoleDetails?: boolean
}) {
  const hasCustomInput = typeof customCaseInput === 'string' && Boolean(onCustomInputChange)
  const activeConsoleExecution = consoleExecution ?? execution
  const [activeTab, setActiveTab] = useState<PanelTab>('cases')

  useEffect(() => {
    setActiveTab('cases')
  }, [cases])

  return (
    <aside className="flex flex-col h-full bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 h-11 border-b border-[var(--color-border)] shrink-0">
        <span className="text-sm font-bold text-[var(--color-ink)]">{title}</span>
        <span className="text-xs text-[var(--color-ink-muted)] font-semibold">
          {cases.length} 个用例
        </span>
      </div>

      {/* Tabs */}
      <div
        aria-label="右侧信息切换"
        className="flex border-b border-[var(--color-border)] shrink-0"
        role="tablist"
      >
        <button
          aria-selected={activeTab === 'cases'}
          className={`cf-tab ${activeTab === 'cases' ? 'active' : ''}`}
          onClick={() => setActiveTab('cases')}
          role="tab"
          type="button"
        >
          测试用例
        </button>
        <button
          aria-selected={activeTab === 'console'}
          className={`cf-tab ${activeTab === 'console' ? 'active' : ''}`}
          onClick={() => setActiveTab('console')}
          role="tab"
          type="button"
        >
          控制台
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* 测试用例 tab */}
        {activeTab === 'cases' ? (
          <div className="flex flex-col gap-3">
            {cases.map((testCase) => {
              const result = execution?.results.find((item) => item.caseId === testCase.id)
              const hasPassed = result?.passed === true
              const hasFailed = result?.passed === false

              return (
                <div
                  className={`rounded-md border p-4 text-xs font-mono ${
                    hasPassed
                      ? 'border-[var(--color-success)] bg-[var(--color-success-light)]'
                      : hasFailed
                        ? 'border-[var(--color-danger)] bg-[var(--color-danger-light)]'
                        : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)]'
                  }`}
                  key={testCase.id}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-semibold text-[var(--color-ink-secondary)] not-italic font-sans text-[0.6875rem]">
                      {testCase.description}
                    </span>
                    {result ? (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[0.6rem] font-bold font-sans ${
                          result.passed
                            ? 'bg-[var(--color-success)] text-white'
                            : 'bg-[var(--color-danger)] text-white'
                        }`}
                      >
                        {result.passed ? '通过' : '失败'}
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[0.6rem] font-bold font-sans bg-[var(--color-border)] text-[var(--color-ink-muted)]">
                        待运行
                      </span>
                    )}
                  </div>
                  {result ? (
                    <>
                      <div className="mb-0.5">
                        <span className="text-[var(--color-ink-muted)]">期望：</span>
                        <span className="text-[var(--color-success)]">
                          {JSON.stringify(result.expected)}
                        </span>
                      </div>
                      <div className="mb-0.5">
                        <span className="text-[var(--color-ink-muted)]">实际：</span>
                        <span
                          className={
                            result.passed
                              ? 'text-[var(--color-success)]'
                              : 'text-[var(--color-danger)]'
                          }
                        >
                          {JSON.stringify(result.actual)}
                        </span>
                      </div>
                      {result.error ? (
                        <div className="text-[var(--color-danger)] mt-1 break-all">
                          <span className="text-[var(--color-ink-muted)]">错误：</span>
                          {result.error}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div>
                      <span className="text-[var(--color-ink-muted)]">期望：</span>
                      <span>{JSON.stringify(testCase.expected)}</span>
                    </div>
                  )}
                </div>
              )
            })}

            {/* 自定义用例区 */}
            {hasCustomInput ? (
              <div className="mt-2 rounded-md border border-dashed border-[var(--color-border-strong)] p-3 flex flex-col gap-2">
                <span className="text-[0.6875rem] font-bold text-[var(--color-ink-tertiary)] uppercase tracking-wide">
                  自定义用例（不计入提交）
                </span>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[var(--color-ink-secondary)] font-semibold">
                    输入表达式
                  </label>
                  <textarea
                    className="px-2.5 py-2 rounded-md border border-[var(--color-border)] text-xs font-mono bg-white resize-none focus:border-[var(--color-primary)] transition-colors"
                    onChange={(event) => onCustomInputChange?.(event.target.value)}
                    placeholder="例如：sum(1, 2)"
                    rows={3}
                    value={customCaseInput}
                  />
                </div>
                <p className="text-xs text-[var(--color-ink-tertiary)]">
                  期望输出由标准答案自动生成，运行后显示
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* 控制台 tab */}
        {activeTab === 'console' ? (
          <div className="flex flex-col gap-2">
            {/* 通过率摘要 */}
            <div className="flex items-center justify-between py-2 px-3 rounded-md bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
              <span className="text-xs font-semibold text-[var(--color-ink-secondary)]">
                运行结果
              </span>
              <span
                className={`text-xs font-bold ${
                  activeConsoleExecution
                    ? activeConsoleExecution.summary.passedCount ===
                      activeConsoleExecution.summary.totalCount
                      ? 'text-[var(--color-success)]'
                      : 'text-[var(--color-danger)]'
                    : 'text-[var(--color-ink-muted)]'
                }`}
              >
                {activeConsoleExecution
                  ? `${activeConsoleExecution.summary.passedCount}/${activeConsoleExecution.summary.totalCount} 通过`
                  : '尚未运行'}
              </span>
            </div>

            {/* 日志详情（考试模式隐藏具体用例） */}
            {!hideConsoleDetails && activeConsoleExecution ? (
              <div className="flex flex-col gap-1.5">
                {activeConsoleExecution.results.map((result) =>
                  result.logs.length > 0 || result.error ? (
                    <div
                      className="rounded-md border border-[var(--color-border)] p-2.5 bg-[#1a1e2e]"
                      key={result.caseId}
                    >
                      <div className="text-[0.65rem] font-semibold text-[#64748b] mb-1">
                        {result.description}
                      </div>
                      {result.logs.map((log, index) => (
                        <pre
                          className="text-[0.7rem] text-[#e2e8f0] font-mono whitespace-pre-wrap"
                          key={`${result.caseId}-${index}`}
                        >
                          {log}
                        </pre>
                      ))}
                      {result.error ? (
                        <pre className="text-[0.7rem] text-[#f87171] font-mono whitespace-pre-wrap mt-1">
                          {result.error}
                        </pre>
                      ) : null}
                    </div>
                  ) : null,
                )}
              </div>
            ) : null}

            {!activeConsoleExecution ? (
              <p className="text-xs text-[var(--color-ink-muted)] text-center py-4">
                运行样例或提交判题后，这里会显示日志、报错和判题摘要。
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Bottom actions bar */}
      {actions ? (
        <div className="px-4 py-2.5 border-t border-[var(--color-border)] shrink-0 flex justify-end bg-white">
          {actions}
        </div>
      ) : null}
    </aside>
  )
}
