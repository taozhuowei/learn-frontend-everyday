/**
 * Page: ExamSessionPage
 * Purpose: Render the timed exam workspace with problem navigation, editor, and judge results.
 */

import { useCallback, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { ExamProblemPanel } from '../components/ExamProblemPanel'
import { useAppState } from '../context/AppStateContext'
import type { SubmittedProblemResult } from '../types/exam'
import { computeProblemScore, formatDuration } from '../utils/exam'
import { ProblemWorkspace } from '../components/ProblemWorkspace'

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

  async function handleSubmitResult(judgeResponse: any) {
    const { passedCount, totalCount } = judgeResponse.summary
    const ratio = totalCount === 0 ? 0 : passedCount / totalCount

    const result: SubmittedProblemResult = {
      problemId: activeProblem.id,
      passedCount,
      totalCount,
      ratio,
      score: computeProblemScore(ratio, activeSession.problemIds.length),
      failures: judgeResponse.results
        .filter((singleResult: any) => !singleResult.passed)
        .map((singleResult: any) => ({
          caseId: singleResult.caseId,
          description: singleResult.description,
          expected: singleResult.expected,
          actual: singleResult.actual,
          logs: singleResult.logs,
          error: singleResult.error,
        })),
      successfulCaseIds: judgeResponse.results
        .filter((singleResult: any) => singleResult.passed)
        .map((singleResult: any) => singleResult.caseId),
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

  if (isMobile) {
    return (
      <AppShell
        headerRight={
          <span className={timerClassName}>{formatDuration(activeSession.remainingSeconds)}</span>
        }
        title={activeProblem.title}
        showPageHeader={false}
      >
        <div className="h-full flex flex-col items-center justify-center bg-white p-8 text-center text-sm text-[var(--color-ink-tertiary)]">
          考试模式暂不支持移动端，请在 PC 端进行考试。
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
      <ProblemWorkspace
        key={activeProblem.id}
        problem={activeProblem}
        mode="exam"
        initialSource={currentCode}
        onSourceChange={(value) => updateAnswer(activeProblem.id, value)}
        onSubmit={handleSubmitResult}
        submitButtonLabel={isLastProblem ? '交卷' : '提交'}
        renderInfoPanel={() => (
          <ExamProblemPanel
            currentProblemId={activeProblem.id}
            items={sidebarItems}
            onSelect={(problemId) => {
              const nextIndex = activeSession.problemIds.indexOf(problemId)
              if (nextIndex < 0) return
              setCurrentIndex(nextIndex)
            }}
            problem={activeProblem}
          />
        )}
      />
    </AppShell>
  )
}
