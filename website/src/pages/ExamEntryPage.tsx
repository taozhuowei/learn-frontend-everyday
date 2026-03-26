import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../context/AppStateContext'
import { problems } from '../generated/problems'
import { pickExamProblems } from '../utils/exam'

export function ExamEntryPage() {
  const { categories, openSettingsPanel, startExam, state } = useAppState()
  const navigate = useNavigate()
  const executableProblems = problems.filter((problem) => problem.executionMode === 'browser')

  function handleStartExam() {
    const selectedProblems = pickExamProblems(problems, state.settings)
    startExam(selectedProblems.map((problem) => problem.id))
    navigate('/exam/session')
  }

  return (
    <AppShell
      actions={
        <button className="action-button ghost" onClick={openSettingsPanel} type="button">
          调整规则
        </button>
      }
      description="考试模式只抽取可在浏览器内运行与判题的题目。"
      eyebrow="考试模式"
      title="准备进入整轮模拟了吗？"
    >
      <div className="exam-entry-layout">
        <section className="exam-hero">
          <span className="eyebrow">Mock Exam</span>
          <h2>保持三栏工作区，把注意力留给题目、代码和判题结果。</h2>
          <p>
            首页与题库会展示所有题目，但考试只会抽取网页可运行的 JavaScript 题。本地 React/Vue
            题保留在题库和学习页里，通过 launcher 自行联调。
          </p>
          <div className="spotlight-actions">
            <button className="action-button primary" onClick={handleStartExam} type="button">
              开始整轮考试
            </button>
          </div>
        </section>

        <div className="page-grid page-grid-home exam-entry-grid">
          <section className="panel compact-panel exam-rules-panel">
            <div className="panel-heading">
              <span className="panel-title">考试规则</span>
              <span className="panel-caption">当前会话生效</span>
            </div>
            <div className="metric-strip exam-config-strip">
              <div>
                <strong>{state.settings.durationMinutes} 分钟</strong>
                <span>考试时长</span>
              </div>
              <div>
                <strong>{state.settings.questionCount} 题</strong>
                <span>随机题量</span>
              </div>
              <div>
                <strong>{state.settings.categoryIds.length || categories.length}</strong>
                <span>覆盖分类</span>
              </div>
              <div>
                <strong>{state.settings.passingScore} 分</strong>
                <span>及格线</span>
              </div>
            </div>
            <p className="panel-description">
              规则面板只保留与考试直接相关的配置，题目总池会自动过滤掉本地环境题。
            </p>
          </section>

          <section className="panel exam-value-panel">
            <div className="exam-value-copy">
              <span className="eyebrow">Available Pool</span>
              <strong>{executableProblems.length} 道网页可判题</strong>
              <p>考试、运行、提交、日志与代码提示都围绕同一套浏览器判题链路工作。</p>
            </div>
            <div className="exam-value-footer">
              <button className="action-button primary" onClick={handleStartExam} type="button">
                直接开考
              </button>
            </div>
          </section>
        </div>

        <section className="exam-prep-strip">
          {categories.map((category) => {
            const count = executableProblems.filter(
              (problem) => problem.categoryId === category.id,
            ).length
            return (
              <article className="compact-card exam-prep-card" key={category.id}>
                <span className="eyebrow">{category.id}</span>
                <strong>{category.label}</strong>
                <p>{count} 道可参与考试的题目。</p>
              </article>
            )
          })}
        </section>
      </div>
    </AppShell>
  )
}
