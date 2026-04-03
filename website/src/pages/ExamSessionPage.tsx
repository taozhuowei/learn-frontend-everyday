/**
 * Page: ExamSessionPage
 * Purpose: 考试工作区，三栏布局。
 * 顶栏倒计时；左栏仅"题目说明"Tab；右栏支持运行/提交/上一题/下一题/交卷。
 * 提交后控制台仅显示通过率摘要（hideConsoleDetails）。
 */

import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { CasePanel } from '../components/CasePanel'
import { ProblemReferencePanel } from '../components/ProblemReferencePanel'
import { ResizableWorkspace } from '../components/ResizableWorkspace'
import type { CodeEditorHandle } from '../components/CodeWorkspace'
import { useAppState } from '../context/AppStateContext'
import type { JudgeCase } from '../types/content'
import type { ExecutionResponse, SubmittedProblemResult } from '../types/exam'
import { runCode } from '../utils/codeRunner'
import { computeProblemScore, formatDuration } from '../utils/exam'

const CodeWorkspace = lazy(() =>
  import('../components/CodeWorkspace').then((m) => ({ default: m.CodeWorkspace })),
)

function parseCustomCase(input: string, expected: string): JudgeCase | null {
  if (!input.trim() || !expected.trim()) return null
  try {
    return {
      id: 'custom-run-case',
      type: 'basic',
      description: '自定义运行用例',
      input,
      expected: JSON.parse(expected),
    }
  } catch {
    return null
  }
}

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
  const navigate = useNavigate()
  const editorRef = useRef<CodeEditorHandle>(null)
  const [sampleExecution, setSampleExecution] = useState<ExecutionResponse | null>(null)
  const [consoleExecution, setConsoleExecution] = useState<ExecutionResponse | null>(null)
  const [customCaseInput, setCustomCaseInput] = useState('')
  const [customCaseExpected, setCustomCaseExpected] = useState('')
  const [running, setRunning] = useState<'run' | 'submit' | null>(null)
  const latestCodeRef = useRef('')

  const session = state.session

  const handleFinishDueToTimeout = useCallback(() => {
    finishExam()
    navigate('/exam/result', { replace: true })
  }, [finishExam, navigate])

  useEffect(() => {
    if (!session) return
    syncRemainingSeconds()
    const id = window.setInterval(syncRemainingSeconds, 1000)
    return () => window.clearInterval(id)
  }, [session, syncRemainingSeconds])

  useEffect(() => {
    if (session && session.remainingSeconds <= 0) {
      handleFinishDueToTimeout()
    }
  }, [handleFinishDueToTimeout, session])

  if (!session) return <Navigate replace to="/exam" />

  const activeSession = session!
  const currentProblemId = activeSession.problemIds[activeSession.currentIndex]
  const currentProblem = currentProblemId ? getProblemById(currentProblemId) : undefined
  if (!currentProblem) return <Navigate replace to="/exam" />

  const activeProblem = currentProblem
  const currentCode = activeSession.answers[activeProblem.id] ?? activeProblem.template
  const isLastProblem = activeSession.currentIndex === activeSession.problemIds.length - 1

  latestCodeRef.current = currentCode

  const sidebarItems = activeSession.problemIds.map((pid) => {
    const p = getProblemById(pid)
    const submission = activeSession.submittedMap[pid]
    return {
      id: pid,
      label: p?.title ?? pid,
      status: submission ? '已提交' : '待作答',
      score: submission?.score,
    }
  })

  async function executeCases(kind: 'run' | 'submit', cases: JudgeCase[]) {
    const sourceCode = editorRef.current?.getValue() ?? latestCodeRef.current
    setRunning(kind)

    try {
      const response = await runCode({ source: sourceCode, cases })
      if (kind === 'run') setSampleExecution(response)
      setConsoleExecution(response)
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const response: ExecutionResponse = {
        summary: { passedCount: 0, totalCount: cases.length },
        results: cases.map((c) => ({
          caseId: c.id,
          description: c.description,
          passed: false,
          expected: c.expected,
          actual: null,
          logs: [],
          error: message,
          durationMs: 0,
        })),
      }
      if (kind === 'run') setSampleExecution(response)
      setConsoleExecution(response)
      return response
    } finally {
      setRunning(null)
    }
  }

  async function handleRunCode() {
    const customCase = parseCustomCase(customCaseInput, customCaseExpected)
    const cases = customCase ? [...activeProblem.basicCases, customCase] : activeProblem.basicCases
    await executeCases('run', cases)
  }

  async function handleSubmitCode() {
    const judgeResponse = await executeCases('submit', activeProblem.fullCases)
    const { passedCount, totalCount } = judgeResponse.summary
    const ratio = totalCount === 0 ? 0 : passedCount / totalCount

    const result: SubmittedProblemResult = {
      problemId: activeProblem.id,
      passedCount,
      totalCount,
      ratio,
      score: computeProblemScore(ratio, activeSession.problemIds.length),
      failures: judgeResponse.results
        .filter((r) => !r.passed)
        .map((r) => ({
          caseId: r.caseId,
          description: r.description,
          expected: r.expected,
          actual: r.actual,
          logs: r.logs,
          error: r.error,
        })),
      successfulCaseIds: judgeResponse.results.filter((r) => r.passed).map((r) => r.caseId),
      submittedAt: new Date().toISOString(),
    }

    setSubmission(result)

    if (isLastProblem) {
      if (window.confirm('确认交卷？')) {
        finishExam()
        navigate('/exam/result')
      }
      return
    }

    setSampleExecution(null)
    setConsoleExecution(null)
    setCurrentIndex(activeSession.currentIndex + 1)
  }

  const timerClass =
    activeSession.remainingSeconds <= 300
      ? 'text-[var(--color-danger)] font-extrabold tabular-nums'
      : 'text-[var(--color-ink)] font-bold tabular-nums'

  return (
    <AppShell
      actions={<span className={timerClass}>{formatDuration(activeSession.remainingSeconds)}</span>}
      eyebrow="考试中"
      title={activeProblem.title}
    >
      <ResizableWorkspace
        left={
          <ProblemReferencePanel
            currentProblemId={activeProblem.id}
            items={sidebarItems}
            mode="exam"
            onSelect={(pid) => {
              const idx = activeSession.problemIds.indexOf(pid)
              if (idx >= 0) {
                setCurrentIndex(idx)
                setSampleExecution(null)
                setConsoleExecution(null)
              }
            }}
            problem={activeProblem}
          />
        }
        center={
          <Suspense
            fallback={
              <section className="flex-1 flex items-center justify-center bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)]">
                <p className="text-sm text-[var(--color-ink-muted)]">加载编辑器...</p>
              </section>
            }
          >
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
        }
        right={
          <CasePanel
            actions={
              <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-2">
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    disabled={running !== null}
                    onClick={handleRunCode}
                    type="button"
                  >
                    <Play size={12} />
                    {running === 'run' ? '运行中...' : '运行'}
                  </button>
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                        Math.min(
                          activeSession.problemIds.length - 1,
                          activeSession.currentIndex + 1,
                        ),
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
            customCaseExpected={customCaseExpected}
            customCaseInput={customCaseInput}
            execution={sampleExecution}
            hideConsoleDetails
            onCustomExpectedChange={setCustomCaseExpected}
            onCustomInputChange={setCustomCaseInput}
            title="样例与判题"
          />
        }
      />
    </AppShell>
  )
}
