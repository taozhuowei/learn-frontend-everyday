/**
 * Component: CasePanel
 * Purpose: 右侧用例面板，展示测试用例、自定义用例和控制台日志。
 */

import type { ReactNode } from 'react'
import { useEffect, useState, useMemo } from 'react'
import { Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { JudgeCase } from '../types/content'
import type { ExecutionResponse } from '../types/exam'

type PanelTab = 'cases' | 'console'

export interface CustomCase {
  id: string
  /** Target expression, e.g. "[1,2,3]" or "function foo(){}" */
  target: string
  /** Argument expressions, one entry per arg */
  args: string[]
}

interface LogEntry {
  level: 'log' | 'info' | 'warn' | 'error'
  args: string[]
  timestamp?: string
}

/**
 * 从测试用例输入表达式中提取入参
 * 例如: "[1,2,3,4].myFilter((value) => value % 2 === 0)"
 * 提取: 数组 [1,2,3,4], 回调函数 (value) => value % 2 === 0
 */
function extractParams(input: string): string {
  // 尝试匹配数组方法调用的格式
  // [array].method(callback, thisArg)
  const arrayMethodMatch = input.match(/^\[(.*?)\]\.(\w+)\((.*)\)$/s)
  if (arrayMethodMatch) {
    const [, arrContent, methodName, argsContent] = arrayMethodMatch
    return `[${arrContent.trim()}].${methodName}(${argsContent.trim()})`
  }

  // 函数调用格式: func(arg1, arg2)
  const funcCallMatch = input.match(/^(\w+)\((.*)\)$/s)
  if (funcCallMatch) {
    const [, funcName, args] = funcCallMatch
    return `${funcName}(${args.trim()})`
  }

  // 默认返回简化后的输入
  if (input.length > 60) {
    return input.substring(0, 57) + '...'
  }
  return input
}

/**
 * 合并所有用例的 console 输出，按时间顺序排列
 */
function mergeConsoleLogs(execution: ExecutionResponse | null): LogEntry[] {
  if (!execution) return []

  const allLogs: LogEntry[] = []
  execution.results.forEach((result) => {
    result.logs.forEach((log) => {
      const entry =
        typeof log === 'string' ? { level: 'log' as const, args: [log] } : (log as LogEntry)
      allLogs.push(entry)
    })
  })
  return allLogs
}

function getLogLevelColor(level: LogEntry['level']): string {
  switch (level) {
    case 'error':
      return 'text-[#ff6b6b]'
    case 'warn':
      return 'text-[#feca57]'
    case 'info':
      return 'text-[#48dbfb]'
    case 'log':
    default:
      return 'text-[#f1f3f5]'
  }
}

function getLogLevelPrefix(level: LogEntry['level']): string {
  switch (level) {
    case 'error':
      return '✖'
    case 'warn':
      return '⚠'
    case 'info':
      return 'ℹ'
    case 'log':
    default:
      return '›'
  }
}

export function CasePanel({
  title,
  cases,
  execution,
  consoleExecution,
  customCases,
  onCustomCasesChange,
  actions,
}: {
  title: string
  cases: JudgeCase[]
  execution: ExecutionResponse | null
  consoleExecution?: ExecutionResponse | null
  customCases?: CustomCase[]
  onCustomCasesChange?: (cases: CustomCase[]) => void
  actions?: ReactNode
}) {
  const hasCustomCases = Array.isArray(customCases) && Boolean(onCustomCasesChange)
  const activeConsoleExecution = consoleExecution ?? execution
  const [activeTab, setActiveTab] = useState<PanelTab>('cases')

  // Infer arg count from the first sample case's displayArgs
  const argCount = cases[0]?.displayArgs?.length ?? 1

  // 合并所有用例的 console 日志
  const mergedLogs = useMemo(
    () => mergeConsoleLogs(activeConsoleExecution),
    [activeConsoleExecution],
  )

  useEffect(() => {
    setActiveTab('cases')
  }, [cases])

  const handleAddCustomCase = () => {
    if (!onCustomCasesChange) return
    const newCase: CustomCase = {
      id: `custom-${Date.now()}`,
      target: '',
      args: Array.from({ length: argCount }, () => ''),
    }
    onCustomCasesChange([...(customCases || []), newCase])
  }

  const handleUpdateCustomCaseTarget = (id: string, target: string) => {
    if (!onCustomCasesChange) return
    onCustomCasesChange((customCases || []).map((c) => (c.id === id ? { ...c, target } : c)))
  }

  const handleUpdateCustomCaseArg = (id: string, argIndex: number, value: string) => {
    if (!onCustomCasesChange) return
    onCustomCasesChange(
      (customCases || []).map((c) => {
        if (c.id !== id) return c
        const nextArgs = [...c.args]
        nextArgs[argIndex] = value
        return { ...c, args: nextArgs }
      }),
    )
  }

  const handleDeleteCustomCase = (id: string) => {
    if (!onCustomCasesChange) return
    onCustomCasesChange((customCases || []).filter((c) => c.id !== id))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 350, damping: 25 },
    },
  }

  const allPassed =
    execution?.summary?.passedCount === execution?.summary?.totalCount &&
    (execution?.summary?.totalCount ?? 0) > 0

  const firstFailedHiddenCase = useMemo(() => {
    if (!execution) return null
    return execution.results.find((r) => r.caseId.startsWith('hidden') && !r.passed)
  }, [execution])

  return (
    <aside
      className="relative flex flex-col h-full bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden"
      data-testid="case-panel"
    >
      {/* Success Delight Overlay */}
      <AnimatePresence>
        {allPassed && activeTab === 'cases' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="absolute top-16 right-4 z-10 pointer-events-none"
          >
            <div className="bg-[var(--color-success)] text-white p-2 rounded-full shadow-lg flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          <motion.div
            className="flex flex-col gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={execution ? 'executed' : 'idle'}
          >
            {/* 基础用例 */}
            {cases.map((testCase) => {
              const result = execution?.results.find((item) => item.caseId === testCase.id)
              const hasPassed = result?.passed === true
              const hasFailed = result?.passed === false

              return (
                <motion.div
                  variants={itemVariants}
                  className={`rounded-md border p-3 text-xs font-mono ${
                    hasPassed
                      ? 'border-[var(--color-success)] bg-[var(--color-success-light)]'
                      : hasFailed
                        ? 'border-[var(--color-danger)] bg-[var(--color-danger-light)]'
                        : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)]'
                  }`}
                  key={testCase.id}
                >
                  <div className="flex items-center justify-between mb-1.5">
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
                  {testCase.displayTarget !== undefined ? (
                    <div className="flex flex-col gap-1">
                      <div>
                        <span className="text-[var(--color-ink-muted)] mr-1">调用对象</span>
                        <span className="break-all text-[var(--color-ink)]">
                          {testCase.displayTarget}
                        </span>
                      </div>
                      {testCase.displayArgs && testCase.displayArgs.length > 0 && (
                        <div>
                          <span className="text-[var(--color-ink-muted)] mr-1">入参</span>
                          <span className="break-all text-[var(--color-ink)]">
                            {testCase.displayArgs.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="break-all text-[var(--color-ink)]">
                      {extractParams(testCase.input)}
                    </div>
                  )}
                </motion.div>
              )
            })}

            {/* Hidden Case Failure (LeetCode style) */}
            {firstFailedHiddenCase && (
              <motion.div
                variants={itemVariants}
                className="rounded-md border p-3 text-xs font-mono border-[var(--color-danger)] bg-[var(--color-danger-light)]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-[var(--color-danger)] not-italic font-sans text-[0.6875rem]">
                    解答错误 (隐藏测试用例)
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[0.6rem] font-bold font-sans bg-[var(--color-danger)] text-white">
                    未通过
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-[var(--color-ink)]">
                  <div>
                    <span className="text-[var(--color-ink-muted)] mr-1">输入</span>
                    <span className="break-all">{firstFailedHiddenCase.description}</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-ink-muted)] mr-1">预期输出</span>
                    <span className="break-all text-[var(--color-success)] font-bold">
                      {JSON.stringify(firstFailedHiddenCase.expected)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--color-ink-muted)] mr-1">实际输出</span>
                    <span className="break-all text-[var(--color-danger)] font-bold">
                      {JSON.stringify(firstFailedHiddenCase.actual)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 自定义用例 */}
            {(customCases || []).map((customCase, index) => {
              const result = execution?.results.find((item) => item.caseId === customCase.id)
              const hasPassed = result?.passed === true
              const hasFailed = result?.passed === false

              return (
                <motion.div
                  variants={itemVariants}
                  className={`rounded-md border p-3 text-xs font-mono ${
                    hasPassed
                      ? 'border-[var(--color-success)] bg-[var(--color-success-light)]'
                      : hasFailed
                        ? 'border-[var(--color-danger)] bg-[var(--color-danger-light)]'
                        : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)]'
                  }`}
                  key={customCase.id}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-[var(--color-ink-secondary)] not-italic font-sans text-[0.6875rem]">
                      自定义用例 {index + 1}
                    </span>
                    <div className="flex items-center gap-1">
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
                      <button
                        onClick={() => handleDeleteCustomCase(customCase.id)}
                        className="p-1 rounded hover:bg-[var(--color-danger-light)] text-[var(--color-ink-tertiary)] hover:text-[var(--color-danger)] transition-colors"
                        title="删除"
                        type="button"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div>
                      <span className="text-[var(--color-ink-muted)] block mb-1">调用对象</span>
                      <input
                        className="w-full px-2.5 py-1.5 rounded-md border border-[var(--color-border)] text-xs font-mono bg-white focus:border-[var(--color-primary)] outline-none transition-colors"
                        onChange={(e) =>
                          handleUpdateCustomCaseTarget(customCase.id, e.target.value)
                        }
                        placeholder="例：[1, 2, 3, 4]"
                        type="text"
                        value={customCase.target}
                      />
                    </div>
                    {customCase.args.map((argVal, argIdx) => (
                      <div key={argIdx}>
                        <span className="text-[var(--color-ink-muted)] block mb-1">
                          {customCase.args.length === 1 ? '入参' : `入参 ${argIdx + 1}`}
                        </span>
                        <input
                          className="w-full px-2.5 py-1.5 rounded-md border border-[var(--color-border)] text-xs font-mono bg-white focus:border-[var(--color-primary)] outline-none transition-colors"
                          onChange={(e) =>
                            handleUpdateCustomCaseArg(customCase.id, argIdx, e.target.value)
                          }
                          placeholder="例：x => x > 2"
                          type="text"
                          value={argVal}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}

            {/* 添加自定义用例按钮 */}
            {hasCustomCases ? (
              <motion.button
                variants={itemVariants}
                onClick={handleAddCustomCase}
                className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-md border border-dashed border-[var(--color-border-strong)] text-xs font-semibold text-[var(--color-ink-tertiary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)] transition-colors"
                type="button"
              >
                <Plus size={14} />
                添加自定义用例
              </motion.button>
            ) : null}
          </motion.div>
        ) : null}

        {/* 控制台 tab - 终端风格 */}
        {activeTab === 'console' ? (
          <div className="flex flex-col h-full">
            {/* 终端标题栏 */}
            <div className="flex items-center justify-between py-2 px-3 rounded-t-md bg-[#1a1d29] border border-[#2a2f3f] border-b-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <span className="ml-2 text-[0.7rem] text-[#64748b] font-mono">Console</span>
              </div>
              {activeConsoleExecution && (
                <span
                  className={`text-[0.65rem] font-bold ${
                    activeConsoleExecution.summary.passedCount ===
                    activeConsoleExecution.summary.totalCount
                      ? 'text-[#27c93f]'
                      : 'text-[#ff5f56]'
                  }`}
                >
                  {activeConsoleExecution.summary.passedCount}/
                  {activeConsoleExecution.summary.totalCount} 通过
                </span>
              )}
            </div>

            {/* 终端内容区 */}
            <div className="flex-1 min-h-[200px] p-3 bg-[#0f1117] border border-[#2a2f3f] rounded-b-md font-mono text-[0.8rem] overflow-y-auto">
              {!activeConsoleExecution ? (
                <div className="text-[#64748b] italic">运行代码后，console 输出将显示在这里...</div>
              ) : mergedLogs.length === 0 ? (
                <div className="text-[#64748b] italic">(无 console 输出)</div>
              ) : (
                <motion.div
                  className="space-y-1"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {mergedLogs.map((log, index) => (
                    <motion.div key={index} variants={itemVariants} className="flex gap-2">
                      <span className={`${getLogLevelColor(log.level)} shrink-0 select-none`}>
                        {getLogLevelPrefix(log.level)}
                      </span>
                      <span className={getLogLevelColor(log.level)}>{log.args.join(' ')}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
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
