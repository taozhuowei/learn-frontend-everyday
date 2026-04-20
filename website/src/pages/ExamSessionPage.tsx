/**
 * Page: ExamSessionPage
 * Purpose: Render the timed exam workspace with problem navigation, editor, and judge results.
 * Data flow: Read the active session from context, update answers in place, and persist submission results back into the session store.
 */

import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, Play, Trophy } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { CasePanel } from '../components/CasePanel'
import { ExamProblemPanel } from '../components/ExamProblemPanel'
import { LoadingPanel } from '../components/LoadingPanel'
import { SplitPane } from '../components/SplitPane'
import type { CodeEditorHandle } from '../components/CodeWorkspace'
import { useAppState } from '../context/AppStateContext'
import type { CustomCase } from '../components/CasePanel'
import type { SubmittedProblemResult } from '../types/exam'
import { computeProblemScore, formatDuration } from '../utils/exam'
import { useProblemExecution } from '../hooks/useProblemExecution'

const CodeWorkspace = lazy(() =>
  import('../components/CodeWorkspace').then((module) => ({ default: module.CodeWorkspace })),
)

export function ExamSessionPage() {
  const {
    state,
    finishExam,
    getProblemById,
    setCurrentIndex,
    setSubmission,
    syncRemainingSeconds,
    updateAnswer,
  } = useAppState()
  const {
    state: { isMobile },
  } = useAppState()
  const navigate = useNavigate()
  const editorRef = useRef<CodeEditorHandle>(null)

  const {
    sampleExecution,
    consoleExecution,
    busyAction: running,
    execute,
    resetExecution,
  } = useProblemExecution()

  const [customCases, setCustomCases] = useState<CustomCase[]>([])
  const latestCodeRef = useRef('')

  const session = state.session

  const handleFinishDueToTimeout = useCallback(() => {
    finishExam()
    navigate('/exam/result', { replace: true })
  }, [finishExam, navigate])

  useEffect(() => {
    if (!session) return
    syncRemainingSeconds()
    const intervalId = window.setInterval(syncRemainingSeconds, 1000)
    return () => window.clearInterval(intervalId)
  }, [session, syncRemainingSeconds])

  useEffect(() => {
    if (session && session.remainingSeconds <= 0) {
      handleFinishDueToTimeout()
    }
  }, [handleFinishDueToTimeout, session])

  if (!session) return <Navigate replace to="/exam" />

  const activeSession = session
  const currentProblemId = activeSession.problemIds[activeSession.currentIndex]
  const currentProblem = currentProblemId ? getProblemById(currentProblemId) : undefined

  if (!currentProblem) return <Navigate replace to="/exam" />

  const activeProblem = currentProblem
  const currentCode = activeSession.answers[activeProblem.id] ?? activeProblem.template
  const isLastProblem = activeSession.currentIndex === activeSession.problemIds.length - 1
  latestCodeRef.current = currentCode

  const sidebarItems = activeSession.problemIds.map((problemId) => {
    const singleProblem = getProblemById(problemId)
    const submission = activeSession.submittedMap[problemId]

    return {
      id: problemId,
      label: singleProblem?.title ?? problemId,
      status: submission ? '已提交' : '待作答',
      score: submission?.score,
    }
  })

  async function handleRunCode() {
    const sourceCode = editorRef.current?.getValue() ?? latestCodeRef.current
    await execute('run', {
      problem: activeProblem,
      sourceCode,
      customCases,
    })
  }

  async function handleSubmitCode() {
    const sourceCode = editorRef.current?.getValue() ?? latestCodeRef.current
    const judgeResponse = await execute('submit', {
      problem: activeProblem,
      sourceCode,
    })

    if (!judgeResponse) return

    const { passedCount, totalCount } = judgeResponse.summary
    const ratio = totalCount === 0 ? 0 : passedCount / totalCount

    const result: SubmittedProblemResult = {
      problemId: activeProblem.id,
      passedCount,
      totalCount,
      ratio,
      score: computeProblemScore(ratio, activeSession.problemIds.length),
      failures: judgeResponse.results
        .filter((singleResult) => !singleResult.passed)
        .map((singleResult) => ({
          caseId: singleResult.caseId,
          description: singleResult.description,
          expected: singleResult.expected,
          actual: singleResult.actual,
          logs: singleResult.logs,
          error: singleResult.error,
        })),
      successfulCaseIds: judgeResponse.results
        .filter((singleResult) => singleResult.passed)
        .map((singleResult) => singleResult.caseId),
      submittedAt: new Date().toISOString(),
    }

    setSubmission(result)

    if (isLastProblem) {
      if (window.confirm('确认交卷？')) {
        finishExam()
        navigate('/exam/result')
      }
    }
  }

  const timerClassName =
    activeSession.remainingSeconds <= 300
      ? 'text-[var(--color-danger)] font-extrabold tabular-nums'
      : 'text-[var(--color-ink)] font-bold tabular-nums'

  const renderInfoPanel = () => (
    <ExamProblemPanel
      currentProblemId={activeProblem.id}
      items={sidebarItems}
      onSelect={(problemId) => {
        const nextIndex = activeSession.problemIds.indexOf(problemId)
        if (nextIndex < 0) return
        setCurrentIndex(nextIndex)
        resetExecution()
      }}
      problem={activeProblem}
    />
  )

  const renderCodeWorkspace = () => (
    <Suspense fallback={<LoadingPanel className="h-full" />}>
      <CodeWorkspace
        ref={editorRef}
        description={activeProblem.description}
        language={activeProblem.sourceType}
        onChange={(value) => {
          latestCodeRef.current = value
          updateAnswer(activeProblem.id, value)
        }}
        title={`题目 #${String(activeProblem.sequence).padStart(2, '0')}`}
        value={currentCode}
      />
    </Suspense>
  )

  const renderCasePanel = () => (
    <CasePanel
      actions={
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2">
            <button
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              data-testid="run-button"
              disabled={running !== null}
              onClick={handleRunCode}
              type="button"
            >
              <Play size={12} />
              {running === 'run' ? '运行中...' : '运行'}
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              data-testid="submit-button"
              disabled={running !== null}
              onClick={handleSubmitCode}
              type="button"
            >
              <Check size={12} />
              {running === 'submit' ? '判题中...' : isLastProblem ? '交卷' : '提交'}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-secondary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              disabled={activeSession.currentIndex === 0}
              onClick={() => setCurrentIndex(Math.max(0, activeSession.currentIndex - 1))}
              type="button"
            >
              <ChevronLeft size={12} />
              上一题
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-secondary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              disabled={isLastProblem}
              onClick={() =>
                setCurrentIndex(
                  Math.min(activeSession.problemIds.length - 1, activeSession.currentIndex + 1),
                )
              }
              type="button"
            >
              下一题
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      }
      cases={activeProblem.basicCases}
      consoleExecution={consoleExecution}
      customCases={customCases}
      execution={sampleExecution}
      onCustomCasesChange={setCustomCases}
      title="样例与判题"
    />
  )

  if (isMobile) {
    return (
      <AppShell
        headerRight={
          <span className={timerClassName}>{formatDuration(activeSession.remainingSeconds)}</span>
        }
        title={activeProblem.title}
        showPageHeader={false}
      >
        <div className="h-full flex flex-col items-center justify-center bg-white p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--color-surface-secondary)] flex items-center justify-center mb-4">
            <Trophy size={32} className="text-[var(--color-ink-muted)]" />
          </div>
          <h2 className="text-lg font-bold text-[var(--color-ink)] mb-2">考试模式暂不支持移动端</h2>
          <p className="text-sm text-[var(--color-ink-tertiary)] leading-relaxed max-w-xs">
            模拟考试包含完整的代码编写与判题流程，为了保证作答效率，请在 PC 端进行考试。
          </p>
          <button
            onClick={() => {
              if (window.confirm('退出考试？进度将不会保留。')) {
                navigate('/exam')
              }
            }}
            className="mt-6 px-6 py-2 rounded-md bg-[var(--color-danger)] text-white text-sm font-semibold"
          >
            退出考试
          </button>
        </div>
      </AppShell>
    )
  }
  return (
    <AppShell
      headerRight={
        <span className={timerClassName}>{formatDuration(activeSession.remainingSeconds)}</span>
      }
      title={activeProblem.title}
      showPageHeader={false}
    >
      <div className="h-full p-2">
        <SplitPane
          className="h-full"
          defaultSize={340}
          direction="horizontal"
          first={<div className="h-full pr-1">{renderInfoPanel()}</div>}
          firstClassName="h-full"
          minFirstSize={280}
          minSecondSize={520}
          second={
            <div className="h-full pl-1">
              <SplitPane
                className="h-full"
                defaultSize={360}
                direction="horizontal"
                first={<div className="h-full pr-1">{renderCodeWorkspace()}</div>}
                firstClassName="h-full"
                fixedPane="second"
                minFirstSize={360}
                minSecondSize={320}
                second={<div className="h-full pl-1">{renderCasePanel()}</div>}
                secondClassName="h-full"
              />
            </div>
          }
          secondClassName="h-full"
        />
      </div>
    </AppShell>
  )
}
