import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { JudgeCase } from '../types/content'
import type { ExecutionResponse } from '../types/exam'

type PanelTab = 'cases' | 'custom' | 'console'

export function CasePanel({
  title,
  cases,
  execution,
  consoleExecution,
  customCaseInput,
  customCaseExpected,
  onCustomInputChange,
  onCustomExpectedChange,
  actions,
}: {
  title: string
  cases: JudgeCase[]
  execution: ExecutionResponse | null
  consoleExecution?: ExecutionResponse | null
  customCaseInput?: string
  customCaseExpected?: string
  onCustomInputChange?: (value: string) => void
  onCustomExpectedChange?: (value: string) => void
  actions?: ReactNode
}) {
  const hasCustomTab =
    typeof customCaseInput === 'string' &&
    Boolean(onCustomInputChange) &&
    Boolean(onCustomExpectedChange)
  const activeConsoleExecution = consoleExecution ?? execution
  const [activeTab, setActiveTab] = useState<PanelTab>('cases')

  useEffect(() => {
    setActiveTab('cases')
  }, [cases, hasCustomTab])

  return (
    <aside className="panel panel-side-detail">
      <div className="panel-heading panel-heading-stacked">
        <div className="panel-heading-copy">
          <span className="panel-title">{title}</span>
          <span className="panel-caption">{cases.length} 个基础用例</span>
        </div>
        {actions ? <div className="panel-actions-vertical">{actions}</div> : null}
      </div>

      <div
        aria-label="右侧信息切换"
        className={`reference-tabs ${hasCustomTab ? '' : 'reference-tabs-double'}`}
        role="tablist"
      >
        <button
          aria-selected={activeTab === 'cases'}
          className={`reference-tab ${activeTab === 'cases' ? 'active' : ''}`}
          onClick={() => setActiveTab('cases')}
          role="tab"
          type="button"
        >
          基础用例
        </button>
        {hasCustomTab ? (
          <button
            aria-selected={activeTab === 'custom'}
            className={`reference-tab ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
            role="tab"
            type="button"
          >
            自定义
          </button>
        ) : null}
        <button
          aria-selected={activeTab === 'console'}
          className={`reference-tab ${activeTab === 'console' ? 'active' : ''}`}
          onClick={() => setActiveTab('console')}
          role="tab"
          type="button"
        >
          控制台
        </button>
      </div>

      {activeTab === 'cases' ? (
        <div className="case-list">
          {cases.map((testCase) => {
            const result = execution?.results.find((item) => item.caseId === testCase.id)

            return (
              <article className="case-card" key={testCase.id}>
                <header>
                  <strong>{testCase.description}</strong>
                  {result ? (
                    <span className={`case-status ${result.passed ? 'pass' : 'fail'}`}>
                      {result.passed ? '通过' : '失败'}
                    </span>
                  ) : (
                    <span className="case-status idle">待运行</span>
                  )}
                </header>
                <code>{testCase.input}</code>
                {result ? (
                  <div className="case-result-copy">
                    <span>期望：{JSON.stringify(result.expected)}</span>
                    <span>实际：{JSON.stringify(result.actual)}</span>
                    {result.error ? <span>错误：{result.error}</span> : null}
                  </div>
                ) : (
                  <span className="case-result-copy">
                    期望：{JSON.stringify(testCase.expected)}
                  </span>
                )}
              </article>
            )
          })}
        </div>
      ) : null}

      {activeTab === 'custom' && hasCustomTab ? (
        <div className="custom-case-editor">
          <span className="panel-title">自定义运行用例</span>
          <textarea
            onChange={(event) => onCustomInputChange?.(event.target.value)}
            placeholder="输入要执行的表达式，例如：[1, 2, 3].map((value) => value * 2)"
            rows={4}
            value={customCaseInput}
          />
          <textarea
            onChange={(event) => onCustomExpectedChange?.(event.target.value)}
            placeholder="输入期望值 JSON，例如：[2, 4, 6]"
            rows={3}
            value={customCaseExpected}
          />
        </div>
      ) : null}

      {activeTab === 'console' ? (
        <div className="console-panel">
          <div className="panel-heading">
            <span className="panel-title">控制台输出</span>
            <span className="panel-caption">
              {activeConsoleExecution
                ? `${activeConsoleExecution.summary.passedCount}/${activeConsoleExecution.summary.totalCount} 通过`
                : '尚未运行'}
            </span>
          </div>
          {activeConsoleExecution ? (
            <div className="console-log">
              {activeConsoleExecution.results.map((result) =>
                result.logs.length > 0 || result.error ? (
                  <div key={result.caseId}>
                    <strong>{result.description}</strong>
                    {result.logs.map((log, index) => (
                      <pre key={`${result.caseId}-${index}`}>{log}</pre>
                    ))}
                    {result.error ? <pre>{result.error}</pre> : null}
                  </div>
                ) : null,
              )}
            </div>
          ) : (
            <p className="hint-copy">运行样例或提交判题后，这里会显示日志、报错和判题摘要。</p>
          )}
        </div>
      ) : null}
    </aside>
  )
}
