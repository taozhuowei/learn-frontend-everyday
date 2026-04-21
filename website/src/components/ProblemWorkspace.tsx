/**
 * Component: ProblemWorkspace
 * Purpose: A unified workspace for both Learn and Exam modes.
 * Consolidates layout, editor, and judge logic to avoid duplication.
 */

import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Play, Trophy } from 'lucide-react'
import confetti from 'canvas-confetti'
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
  renderHeaderRight,
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

    const isSuccess = result.summary.passedCount === result.summary.totalCount

    if (kind === 'submit') {
      if (isSuccess) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#10b981'],
        })
      }

      if (mode === 'learn') {
        setToast({
          message: isSuccess
            ? `全部通过！即将锻造完成`
            : `未完全通过 (${result.summary.passedCount}/${result.summary.totalCount})`,
          type: isSuccess ? 'success' : 'error',
        })
        setTimeout(() => setToast(null), 4000)
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
            initial={{ opacity: 0, y: -20, scale: 0.9, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: -20, scale: 0.9, x: '-50%' }}
            className="absolute top-10 left-1/2 z-[100] pointer-events-none"
          >
            <div
              className={`px-6 py-3 rounded-2xl shadow-2xl border-2 flex items-center gap-3 ${
                toast.type === 'success'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-red-50 border-red-500 text-red-800'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}
              >
                {toast.type === 'success' ? <Trophy size={18} /> : <X size={18} />}
              </div>
              <div>
                <div className="font-black text-sm uppercase tracking-wider leading-none mb-1">
                  {toast.type === 'success' ? 'Forge Success' : 'Forge Failed'}
                </div>
                <div className="text-xs font-bold opacity-80">{toast.message}</div>
              </div>
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
                      headerRight={renderHeaderRight?.()}
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
