/**
 * Component: ProblemWorkspace
 * Purpose: A unified workspace for both Learn and Exam modes.
 * Consolidates layout, editor, and judge logic to avoid duplication.
 */

import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Play } from 'lucide-react'
import { SplitPane } from './SplitPane'
import { LoadingPanel } from './LoadingPanel'
import { CasePanel, type CustomCase } from './CasePanel'
import type { CodeEditorHandle } from './CodeWorkspace'
import { useProblemExecution, type ExecutionKind } from '../hooks/useProblemExecution'
import type { ProblemRecord } from '../types/content'
import type { ExecutionResponse } from '../types/exam'

const CodeWorkspace = lazy(() =>
  import('./CodeWorkspace').then((module) => ({ default: module.CodeWorkspace })),
)

interface ProblemWorkspaceProps {
  problem: ProblemRecord
  mode: 'learn' | 'exam'
  initialSource: string
  onSourceChange?: (value: string) => void
  renderInfoPanel: () => ReactNode
  renderHeaderRight?: () => ReactNode
  onSubmit?: (result: ExecutionResponse) => void
  onRun?: (result: ExecutionResponse) => void
  submitButtonLabel?: string
}

export function ProblemWorkspace({
  problem,
  mode,
  initialSource,
  onSourceChange,
  renderInfoPanel,
  onSubmit,
  onRun,
  submitButtonLabel = '提交',
}: ProblemWorkspaceProps) {
  const editorRef = useRef<CodeEditorHandle>(null)
  const [source, setSource] = useState(initialSource)
  const sourceRef = useRef(source)
  const [customCases, setCustomCases] = useState<CustomCase[]>([])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { sampleExecution, consoleExecution, busyAction, execute, resetExecution } =
    useProblemExecution()

  useEffect(() => {
    setSource(initialSource)
    sourceRef.current = initialSource
    setCustomCases([])
    resetExecution()
    setToast(null)
  }, [problem.id, initialSource, resetExecution])

  const handleSourceChange = (value: string) => {
    sourceRef.current = value
    setSource(value)
    onSourceChange?.(value)
  }

  const handleExecute = async (kind: ExecutionKind) => {
    const sourceCode = editorRef.current?.getValue() ?? sourceRef.current
    const result = await execute(kind, {
      problem,
      sourceCode,
      customCases,
    })

    if (!result) return

    if (kind === 'submit') {
      const isSuccess = result.summary.passedCount === result.summary.totalCount
      if (mode === 'learn') {
        setToast({
          message: isSuccess
            ? `判题通过！(${result.summary.passedCount}/${result.summary.totalCount})`
            : `判题未通过 (${result.summary.passedCount}/${result.summary.totalCount})`,
          type: isSuccess ? 'success' : 'error',
        })
        setTimeout(() => setToast(null), 3000)
      }
      onSubmit?.(result)
    } else {
      onRun?.(result)
    }
  }

  const isAutoJudge = problem.executionMode === 'browser'
  const actionTitle =
    problem.executionMode === 'local'
      ? '本地环境题，请在本机 Node.js 环境下判题'
      : problem.executionMode === 'component'
        ? '组件题，请打开本地 Launcher 调试'
        : undefined

  return (
    <div className="h-full p-2 relative overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
          >
            <div
              className={`px-4 py-2 rounded-lg shadow-xl border text-sm font-bold flex items-center gap-2 ${
                toast.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              {toast.type === 'success' ? (
                <Check className="shrink-0" size={16} />
              ) : (
                <X className="shrink-0" size={16} />
              )}
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SplitPane
        className="h-full"
        defaultSize={mode === 'learn' ? 400 : 340}
        direction="horizontal"
        first={<div className="h-full pr-1">{renderInfoPanel()}</div>}
        firstClassName="h-full"
        minFirstSize={260}
        minSecondSize={360}
        second={
          <div className="h-full pl-1">
            <SplitPane
              className="h-full"
              defaultSizeRatio={0.6}
              direction="vertical"
              first={
                <div className="h-full pb-1">
                  <Suspense fallback={<LoadingPanel />}>
                    <CodeWorkspace
                      ref={editorRef}
                      description={problem.description}
                      language={problem.sourceType}
                      onChange={handleSourceChange}
                      title={`#${String(problem.sequence).padStart(2, '0')} ${problem.title}`}
                      value={source}
                    />
                  </Suspense>
                </div>
              }
              firstClassName="h-full"
              minFirstSize={160}
              minSecondSize={120}
              second={
                <div className="h-full pt-1">
                  <CasePanel
                    actions={
                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <div className="flex gap-2">
                          <button
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            disabled={!isAutoJudge || busyAction !== null}
                            onClick={() => handleExecute('run')}
                            title={actionTitle}
                            type="button"
                          >
                            <Play size={12} />
                            {busyAction === 'run' ? '运行中...' : '运行'}
                          </button>
                          <button
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            disabled={!isAutoJudge || busyAction !== null}
                            onClick={() => handleExecute('submit')}
                            title={actionTitle}
                            type="button"
                          >
                            <Check size={12} />
                            {busyAction === 'submit' ? '判题中...' : submitButtonLabel}
                          </button>
                        </div>
                      </div>
                    }
                    cases={problem.basicCases}
                    consoleExecution={consoleExecution}
                    customCases={isAutoJudge ? customCases : undefined}
                    execution={sampleExecution}
                    mode={mode}
                    onCustomCasesChange={isAutoJudge ? setCustomCases : undefined}
                    title="测试与判题"
                  />
                </div>
              }
              secondClassName="h-full"
            />
          </div>
        }
        secondClassName="h-full"
      />
    </div>
  )
}
