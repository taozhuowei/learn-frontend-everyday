import type { ProblemRecord } from '../types/content'
import type { SubmittedProblemResult } from '../types/exam'

export function ResultBreakdownCard({
  problem,
  result,
}: {
  problem: ProblemRecord
  result: SubmittedProblemResult
}) {
  return (
    <article className="result-card">
      <header>
        <div>
          <span className="eyebrow">#{String(problem.sequence).padStart(2, '0')}</span>
          <h3>{problem.title}</h3>
        </div>
        <strong>{result.score} 分</strong>
      </header>
      <p>{problem.description}</p>
      <div className="result-stats">
        <span>
          通过 {result.passedCount} / {result.totalCount || 0} 个用例
        </span>
        <span>通过率 {(result.ratio * 100).toFixed(0)}%</span>
      </div>
      {result.failures.length > 0 ? (
        <div className="result-failures">
          {result.failures.slice(0, 3).map((failure) => (
            <div className="result-failure-item" key={failure.caseId}>
              <strong>{failure.description}</strong>
              <span>期望：{JSON.stringify(failure.expected)}</span>
              <span>实际：{JSON.stringify(failure.actual)}</span>
              {failure.error ? <span>错误：{failure.error}</span> : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="success-copy">该题全部判卷用例已通过。</p>
      )}
      <details>
        <summary>查看标准答案</summary>
        <pre>{problem.solutionCode}</pre>
      </details>
    </article>
  )
}
