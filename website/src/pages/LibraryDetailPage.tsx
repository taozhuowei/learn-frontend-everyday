import { Link, Navigate, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { MarkdownContent } from '../components/MarkdownContent'
import { CodePreview } from '../components/CodePreview'
import { problems } from '../generated/problems'

export function LibraryDetailPage() {
  const { problemId } = useParams()
  const currentProblemId = problemId ?? ''
  const currentIndex = problems.findIndex((problem) => problem.id === currentProblemId)
  const problem = problems[currentIndex]

  if (!problem) {
    return <Navigate replace to="/library" />
  }

  const previousProblem = currentIndex > 0 ? problems[currentIndex - 1] : null
  const nextProblem = currentIndex < problems.length - 1 ? problems[currentIndex + 1] : null

  return (
    <AppShell eyebrow="题库详情" title={problem.title}>
      <section className="page-grid page-grid-detail">
        <article className="panel detail-article">
          <div className="scroll-region">
            <div className="panel-heading">
              <span className="panel-title">题目说明</span>
              <span className="panel-caption">{problem.categoryName}</span>
            </div>
            <p>{problem.description}</p>

            <h3>入参说明</h3>
            <MarkdownContent markdown={problem.paramsText} />

            <h3>返回值说明</h3>
            <MarkdownContent markdown={problem.returnText} />

            <h3>解题思路</h3>
            <MarkdownContent markdown={problem.approachText} />

            <h3>标准答案</h3>
            <CodePreview
              className="reference-code-block"
              code={problem.solutionCode}
              language={problem.sourceType === 'vue' ? 'markup' : problem.sourceType}
            />
          </div>

          <div className="spotlight-actions detail-actions">
            {previousProblem ? (
              <Link className="action-button ghost" to={`/library/${previousProblem.id}`}>
                上一题
              </Link>
            ) : null}
            {nextProblem ? (
              <Link className="action-button ghost" to={`/library/${nextProblem.id}`}>
                下一题
              </Link>
            ) : null}
            <Link className="action-button primary" to={`/learn/${problem.id}`}>
              {problem.executionMode === 'browser' ? '进入学习模式' : '查看本地环境题'}
            </Link>
          </div>
        </article>

        <aside className="panel detail-sidecard">
          <div className="panel-heading">
            <span className="panel-title">题库目录</span>
            <span className="panel-caption">{problems.length} 题</span>
          </div>
          <div className="knowledge-links">
            {problems.map((item) => (
              <Link
                className={`knowledge-link ${item.id === problem.id ? 'active' : ''}`}
                key={item.id}
                to={`/library/${item.id}`}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </AppShell>
  )
}
