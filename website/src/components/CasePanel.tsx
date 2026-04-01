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
    <aside className="lc-panel lc-case-panel">
      <div className="lc-panel-header lc-case-header">
        <div className="lc-panel-header-left">
          <span className="lc-panel-title">{title}</span>
          <span className="lc-panel-subtitle">{cases.length} 个用例</span>
        </div>
        {actions ? <div className="lc-panel-actions">{actions}</div> : null}
      </div>

      <div aria-label="右侧信息切换" className="lc-tabs" role="tablist">
        <button
          aria-selected={activeTab === 'cases'}
          className={`lc-tab ${activeTab === 'cases' ? 'lc-tab-active' : ''}`}
          onClick={() => setActiveTab('cases')}
          role="tab"
          type="button"
        >
          测试用例
        </button>
        {hasCustomTab ? (
          <button
            aria-selected={activeTab === 'custom'}
            className={`lc-tab ${activeTab === 'custom' ? 'lc-tab-active' : ''}`}
            onClick={() => setActiveTab('custom')}
            role="tab"
            type="button"
          >
            自定义
          </button>
        ) : null}
        <button
          aria-selected={activeTab === 'console'}
          className={`lc-tab ${activeTab === 'console' ? 'lc-tab-active' : ''}`}
          onClick={() => setActiveTab('console')}
          role="tab"
          type="button"
        >
          控制台
        </button>
      </div>

      <div className="lc-case-content">
        {activeTab === 'cases' ? (
          <div className="lc-case-list">
            {cases.map((testCase) => {
              const result = execution?.results.find((item) => item.caseId === testCase.id)

              return (
                <div
                  className={`lc-case-item ${result ? (result.passed ? 'lc-case-pass' : 'lc-case-fail') : ''}`}
                  key={testCase.id}
                >
                  <div className="lc-case-header-row">
                    <span className="lc-case-name">{testCase.description}</span>
                    {result ? (
                      <span
                        className={`lc-case-badge ${result.passed ? 'lc-badge-success' : 'lc-badge-error'}`}
                      >
                        {result.passed ? '通过' : '失败'}
                      </span>
                    ) : (
                      <span className="lc-case-badge lc-badge-pending">待运行</span>
                    )}
                  </div>
                  <div className="lc-case-input">
                    <span className="lc-case-label">输入：</span>
                    <code>{testCase.input}</code>
                  </div>
                  {result ? (
                    <div className="lc-case-result">
                      <div className="lc-result-row">
                        <span className="lc-result-label">期望：</span>
                        <span className="lc-result-value lc-result-expected">
                          {JSON.stringify(result.expected)}
                        </span>
                      </div>
                      <div className="lc-result-row">
                        <span className="lc-result-label">实际：</span>
                        <span
                          className={`lc-result-value ${result.passed ? 'lc-result-expected' : 'lc-result-actual'}`}
                        >
                          {JSON.stringify(result.actual)}
                        </span>
                      </div>
                      {result.error ? (
                        <div className="lc-result-error">
                          <span className="lc-result-label">错误：</span>
                          <span>{result.error}</span>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="lc-case-expected">
                      <span className="lc-case-label">期望：</span>
                      <span>{JSON.stringify(testCase.expected)}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : null}

        {activeTab === 'custom' && hasCustomTab ? (
          <div className="lc-custom-case">
            <div className="lc-custom-field">
              <label className="lc-custom-label">输入表达式</label>
              <textarea
                className="lc-textarea"
                onChange={(event) => onCustomInputChange?.(event.target.value)}
                placeholder="输入要执行的表达式，例如：[1, 2, 3].map((value) => value * 2)"
                rows={4}
                value={customCaseInput}
              />
            </div>
            <div className="lc-custom-field">
              <label className="lc-custom-label">期望输出 (JSON)</label>
              <textarea
                className="lc-textarea"
                onChange={(event) => onCustomExpectedChange?.(event.target.value)}
                placeholder="输入期望值 JSON，例如：[2, 4, 6]"
                rows={3}
                value={customCaseExpected}
              />
            </div>
          </div>
        ) : null}

        {activeTab === 'console' ? (
          <div className="lc-console">
            <div className="lc-console-header">
              <span className="lc-console-title">运行结果</span>
              <span className="lc-console-summary">
                {activeConsoleExecution
                  ? `${activeConsoleExecution.summary.passedCount}/${activeConsoleExecution.summary.totalCount} 通过`
                  : '尚未运行'}
              </span>
            </div>
            {activeConsoleExecution ? (
              <div className="lc-console-logs">
                {activeConsoleExecution.results.map((result) =>
                  result.logs.length > 0 || result.error ? (
                    <div className="lc-console-log-item" key={result.caseId}>
                      <div className="lc-log-title">{result.description}</div>
                      {result.logs.map((log, index) => (
                        <pre key={`${result.caseId}-${index}`} className="lc-log-content">
                          {log}
                        </pre>
                      ))}
                      {result.error ? <pre className="lc-log-error">{result.error}</pre> : null}
                    </div>
                  ) : null,
                )}
              </div>
            ) : (
              <div className="lc-console-empty">
                <p>运行样例或提交判题后，这里会显示日志、报错和判题摘要。</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </aside>
  )
}
