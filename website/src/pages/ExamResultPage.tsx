import { Link, Navigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { ResultBreakdownCard } from '../components/ResultBreakdownCard'
import { useAppState } from '../context/AppStateContext'

export function ExamResultPage() {
  const { clearExam, getProblemById, state } = useAppState()

  if (!state.result) {
    return <Navigate replace to="/exam" />
  }

  return (
    <AppShell eyebrow="结果" title={state.result.passed ? '本轮通过' : '本轮未通过'}>
      <section className="panel result-summary compact-panel">
        <div className="metric-strip">
          <div>
            <strong>{state.result.totalScore}</strong>
            <span>总分</span>
          </div>
          <div>
            <strong>{state.result.passingScore}</strong>
            <span>及格线</span>
          </div>
          <div>
            <strong>{state.result.perProblem.length}</strong>
            <span>已评题数</span>
          </div>
        </div>
        <div className="spotlight-actions">
          <Link className="action-button primary" onClick={() => clearExam()} to="/exam">
            再来一轮
          </Link>
          <Link className="action-button ghost" to="/library">
            返回题库
          </Link>
        </div>
      </section>

      <div className="result-grid result-grid-scroll">
        {state.result.perProblem.map((result) => {
          const problem = getProblemById(result.problemId)
          return problem ? (
            <ResultBreakdownCard key={problem.id} problem={problem} result={result} />
          ) : null
        })}
      </div>
    </AppShell>
  )
}
