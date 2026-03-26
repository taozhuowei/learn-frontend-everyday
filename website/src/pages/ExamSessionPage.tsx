import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { CasePanel } from '../components/CasePanel'
import { ProblemReferencePanel } from '../components/ProblemReferencePanel'
import { useAppState } from '../context/AppStateContext'
import type { JudgeCase } from '../types/content'
import type { ExecutionResponse, SubmittedProblemResult } from '../types/exam'
import { runCode } from '../utils/codeRunner'
import { computeProblemScore, formatDuration } from '../utils/exam'

const CodeWorkspace = lazy(() =>
  import('../components/CodeWorkspace').then((module) => ({ default: module.CodeWorkspace })),
)

function parseCustomCase(input: string, expectedText: string): JudgeCase | null {
  if (!input.trim() || !expectedText.trim()) {
    return null
  }

  try {
    return {
      id: 'custom-run-case',
      type: 'basic',
      description: '自定义运行用例',
      input,
      expected: JSON.parse(expectedText),
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
    if (!session) {
      return
    }

    syncRemainingSeconds()
    const timerId = window.setInterval(() => {
      syncRemainingSeconds()
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [session, syncRemainingSeconds])

  useEffect(() => {
    if (session && session.remainingSeconds <= 0) {
      handleFinishDueToTimeout()
    }
  }, [handleFinishDueToTimeout, session])

  if (!session) {
    return <Navigate replace to="/exam" />
  }

  const currentProblemId = session.problemIds[session.currentIndex]
  const currentProblem = currentProblemId ? getProblemById(currentProblemId) : undefined

  if (!currentProblem) {
    return <Navigate replace to="/exam" />
  }

  const activeSession = session
  const activeProblem = currentProblem
  const currentCode = activeSession.answers[activeProblem.id] ?? activeProblem.template
  const isLastProblem = activeSession.currentIndex === activeSession.problemIds.length - 1

  latestCodeRef.current = currentCode

  const sidebarItems = activeSession.problemIds.map((problemId) => {
    const problem = getProblemById(problemId)
    const submission = activeSession.submittedMap[problemId]

    return {
      id: problemId,
      label: problem?.title ?? problemId,
      status: submission ? '已提交' : '待作答',
      score: submission?.score,
    }
  })

  async function executeCases(kind: 'run' | 'submit', cases: JudgeCase[]) {
    const sourceCode = window.__getPracticeEditorValue__?.() ?? latestCodeRef.current
    setRunning(kind)

    try {
      const response = await runCode({ source: sourceCode, cases })
      if (kind === 'run') {
        setSampleExecution(response)
      }
      setConsoleExecution(response)
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const response: ExecutionResponse = {
        summary: {
          passedCount: 0,
          totalCount: cases.length,
        },
        results: cases.map((testCase) => ({
          caseId: testCase.id,
          description: testCase.description,
          passed: false,
          expected: testCase.expected,
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
    const customCase = parseCustomCase(customCaseInput, customCaseExpected)
    const executionCases = customCase
      ? [...activeProblem.basicCases, customCase]
      : activeProblem.basicCases
    await executeCases('run', executionCases)
  }

  async function handleSubmitCode() {
    const judgeResponse = await executeCases('submit', activeProblem.fullCases)
    const totalCount = judgeResponse.summary.totalCount
    const passedCount = judgeResponse.summary.passedCount
    const ratio = totalCount === 0 ? 0 : passedCount / totalCount

    const result: SubmittedProblemResult = {
      problemId: activeProblem.id,
      passedCount,
      totalCount,
      ratio,
      score: computeProblemScore(ratio, activeSession.problemIds.length),
      failures: judgeResponse.results
        .filter((item) => !item.passed)
        .map((item) => ({
          caseId: item.caseId,
          description: item.description,
          expected: item.expected,
          actual: item.actual,
          logs: item.logs,
          error: item.error,
        })),
      successfulCaseIds: judgeResponse.results
        .filter((item) => item.passed)
        .map((item) => item.caseId),
      submittedAt: new Date().toISOString(),
    }

    setSubmission(result)

    if (isLastProblem) {
      const confirmed = window.confirm('确认交卷？')
      if (confirmed) {
        finishExam()
        navigate('/exam/result')
      }
      return
    }

    setSampleExecution(null)
    setConsoleExecution(null)
    setCurrentIndex(activeSession.currentIndex + 1)
  }

  return (
    <AppShell
      actions={
        <span className="session-timer">{formatDuration(activeSession.remainingSeconds)}</span>
      }
      eyebrow="考试中"
      title={activeProblem.title}
    >
      <div className="workspace-grid workspace-grid-exam">
        <ProblemReferencePanel
          currentProblemId={activeProblem.id}
          items={sidebarItems}
          onSelect={(problemId) => {
            const nextIndex = activeSession.problemIds.indexOf(problemId)
            if (nextIndex >= 0) {
              setCurrentIndex(nextIndex)
              setSampleExecution(null)
              setConsoleExecution(null)
            }
          }}
          problem={activeProblem}
          showApproach={false}
          showSequence
          showSolution={false}
        />

        <Suspense
          fallback={
            <section className="panel workspace-panel route-loading-panel">
              <span className="panel-title">Loading editor...</span>
              <p className="panel-description">Monaco is loaded only when coding starts.</p>
            </section>
          }
        >
          <CodeWorkspace
            description={activeProblem.description}
            footer={null}
            language={activeProblem.sourceType === 'vue' ? 'html' : activeProblem.sourceType}
            onChange={(value) => {
              latestCodeRef.current = value
              updateAnswer(activeProblem.id, value)
            }}
            title={`题目 #${activeProblem.sequence.toString().padStart(2, '0')}`}
            value={currentCode}
          />
        </Suspense>

        <CasePanel
          actions={
            <>
              <div className="panel-actions-row">
                <button
                  className="action-button primary action-wide"
                  onClick={handleRunCode}
                  type="button"
                >
                  {running === 'run' ? '运行中...' : '运行'}
                </button>
                <button
                  className="action-button primary action-wide"
                  onClick={handleSubmitCode}
                  type="button"
                >
                  {running === 'submit' ? '判题中...' : isLastProblem ? '交卷' : '提交'}
                </button>
              </div>
              <div className="panel-actions-row">
                <button
                  className="action-button ghost action-wide"
                  disabled={activeSession.currentIndex === 0}
                  onClick={() => setCurrentIndex(Math.max(0, activeSession.currentIndex - 1))}
                  type="button"
                >
                  上一题
                </button>
                <button
                  className="action-button ghost action-wide"
                  disabled={isLastProblem}
                  onClick={() =>
                    setCurrentIndex(
                      Math.min(activeSession.problemIds.length - 1, activeSession.currentIndex + 1),
                    )
                  }
                  type="button"
                >
                  下一题
                </button>
              </div>
            </>
          }
          cases={activeProblem.basicCases}
          consoleExecution={consoleExecution}
          customCaseExpected={customCaseExpected}
          customCaseInput={customCaseInput}
          execution={sampleExecution}
          onCustomExpectedChange={setCustomCaseExpected}
          onCustomInputChange={setCustomCaseInput}
          title="样例与判题"
        />
      </div>
    </AppShell>
  )
}
