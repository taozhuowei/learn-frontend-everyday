/**
 * Page: ExamSessionPage
 * Purpose: Render the timed exam workspace with problem navigation, editor, and judge results.
 * Data flow: Read the active session from context, update answers in place, and persist submission results back into the session store.
 */

import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { CasePanel } from '../components/CasePanel'
import { ExamProblemPanel } from '../components/ExamProblemPanel'
import { LoadingPanel } from '../components/LoadingPanel'
import { SplitPane } from '../components/SplitPane'
import type { CodeEditorHandle } from '../components/CodeWorkspace'
import { useAppState } from '../context/AppStateContext'
import type { JudgeCase } from '../types/content'
import type { CustomCase } from '../components/CasePanel'
import type { ExecutionResponse, SubmittedProblemResult } from '../types/exam'
import { runCode } from '../utils/codeRunner'
import { computeProblemScore, formatDuration } from '../utils/exam'

const CodeWorkspace = lazy(() =>
  import('../components/CodeWorkspace').then((module) => ({ default: module.CodeWorkspace })),
)

function buildCustomEvalInput(
  problemId: string,
  categoryId: string,
  target: string,
  args: string[],
): string {
  const argsStr = args.filter((a) => a.trim()).join(', ')
  const arrayMethodMap: Record<string, string> = {
    filter: 'myFilter',
    map: 'myMap',
    forEach: 'myForEach',
    reduce: 'myReduce',
    flat: 'myFlat',
  }
  const fnMethodMap: Record<string, string> = {
    apply: 'myApply',
    call: 'myCall',
    bind: 'myBind',
  }
  if (categoryId === 'array' && problemId in arrayMethodMap) {
    return `(${target}).${arrayMethodMap[problemId]}(${argsStr})`
  }
  if (categoryId === 'function' && problemId in fnMethodMap) {
    return `(${target}).${fnMethodMap[problemId]}(${argsStr})`
  }
  const allArgs = [target, ...args].filter((a) => a.trim()).join(', ')
  return `${problemId}(${allArgs})`
}

function parseCustomCases(cases: CustomCase[], problemId: string, categoryId: string): JudgeCase[] {
  return cases
    .filter((c) => c.target.trim())
    .map((c, index) => ({
      id: c.id,
      type: 'basic' as const,
      description: `自定义用例 ${index + 1}`,
      input: buildCustomEvalInput(problemId, categoryId, c.target, c.args),
      expected: undefined,
    }))
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
  const [customCases, setCustomCases] = useState<CustomCase[]>([])
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

  async function executeCases(kind: 'run' | 'submit', cases: JudgeCase[]) {
    const sourceCode = editorRef.current?.getValue() ?? latestCodeRef.current
    setRunning(kind)

    // Build testFile for JudgeCore - only for submit (full judging)
    const testFile =
      kind === 'submit' && activeProblem.testCases
        ? activeProblem.testCases
        : undefined

    try {
      const response = await runCode({
        source: sourceCode,
        cases,
        solutionCode: activeProblem.solutionCode,
        problemId: activeProblem.id,
        testFile: testFile as unknown as { examples: unknown[]; hidden: unknown[] },
      })
      if (kind === 'run') {
        setSampleExecution(response)
      }
      setConsoleExecution(response)
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const response: ExecutionResponse = {
        summary: { passedCount: 0, totalCount: cases.length },
        results: cases.map((singleCase) => ({
          caseId: singleCase.id,
          description: singleCase.description,
          passed: false,
          expected: singleCase.expected,
          actual: null,
          logs: [],
          error: message,
          durationMs: 0,
        })),
      }
      if (kind === 'run') {
        setSampleExecution(response)
      }
      setConsoleExecution(response)
      return response
    } finally {
      setRunning(null)
    }
  }

  async function handleRunCode() {
    const customCasesParsed = parseCustomCases(
      customCases,
      activeProblem.id,
      activeProblem.categoryId,
    )

    // Run JudgeCore for sample cases, eval runner for custom cases (separate calls, merge results)
    const testFile = activeProblem.testCases
      ? { examples: activeProblem.testCases.examples, hidden: [] as unknown[] }
      : undefined

    const sourceCode = editorRef.current?.getValue() ?? latestCodeRef.current
    setRunning('run')
    try {
      const judgeResponse = await runCode({
        source: sourceCode,
        cases: [],
        solutionCode: activeProblem.solutionCode,
        problemId: activeProblem.id,
        testFile: testFile as unknown as { examples: unknown[]; hidden: unknown[] },
      })

      let finalResponse = judgeResponse
      if (customCasesParsed.length > 0) {
        const customResponse = await runCode({
          source: sourceCode,
          cases: customCasesParsed,
          solutionCode: activeProblem.solutionCode,
          problemId: undefined,
          testFile: undefined,
        })
        finalResponse = {
          summary: {
            passedCount: judgeResponse.summary.passedCount + customResponse.summary.passedCount,
            totalCount: judgeResponse.summary.totalCount + customResponse.summary.totalCount,
          },
          results: [...judgeResponse.results, ...customResponse.results],
        }
      }

      setSampleExecution(finalResponse)
      setConsoleExecution(finalResponse)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const allCases = [...activeProblem.basicCases, ...customCasesParsed]
      const errResponse: ExecutionResponse = {
        summary: { passedCount: 0, totalCount: allCases.length },
        results: allCases.map((c) => ({
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
      setSampleExecution(errResponse)
      setConsoleExecution(errResponse)
    } finally {
      setRunning(null)
    }
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
      return
    }

    setSampleExecution(null)
    setConsoleExecution(null)
    setCurrentIndex(activeSession.currentIndex + 1)
  }

  const timerClassName =
    activeSession.remainingSeconds <= 300
      ? 'text-[var(--color-danger)] font-extrabold tabular-nums'
      : 'text-[var(--color-ink)] font-bold tabular-nums'

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
          first={
            <div className="h-full pr-1">
              <ExamProblemPanel
                currentProblemId={activeProblem.id}
                items={sidebarItems}
                onSelect={(problemId) => {
                  const nextIndex = activeSession.problemIds.indexOf(problemId)
                  if (nextIndex < 0) return
                  setCurrentIndex(nextIndex)
                  setSampleExecution(null)
                  setConsoleExecution(null)
                }}
                problem={activeProblem}
              />
            </div>
          }
          firstClassName="h-full"
          minFirstSize={280}
          minSecondSize={520}
          second={
            <div className="h-full pl-1">
              <SplitPane
                className="h-full"
                defaultSize={360}
                direction="horizontal"
                first={
                  <div className="h-full pr-1">
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
                  </div>
                }
                firstClassName="h-full"
                fixedPane="second"
                minFirstSize={360}
                minSecondSize={320}
                second={
                  <div className="h-full pl-1">
                    <CasePanel
                      actions={
                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex gap-2">
                            <button
                              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              data-testid="run-button"
                              disabled={running !== null}
                              onClick={handleRunCode}
                              type="button"
                            >
                              <Play size={12} />
                              {running === 'run' ? '运行中...' : '运行'}
                            </button>
                            <button
                              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                              onClick={() =>
                                setCurrentIndex(Math.max(0, activeSession.currentIndex - 1))
                              }
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
                      customCases={customCases}
                      execution={sampleExecution}
                      onCustomCasesChange={setCustomCases}
                      title="样例与判题"
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
    </AppShell>
  )
}
