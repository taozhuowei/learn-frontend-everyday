/**
 * Page: ExamEntryPage
 * Purpose: 考试入口页，展示考试规则配置、可用题目池统计，并提供"开始考试"入口。
 * executionMode !== 'local' 的题均可参与考试（browser + component）。
 */

import { Settings2, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { useAppState } from '../context/AppStateContext'
import { problems } from '../generated/problems'
import { pickExamProblems } from '../utils/exam'

export function ExamEntryPage() {
  const { categories, openSettingsPanel, startExam, state } = useAppState()
  const navigate = useNavigate()

  // browser + component 题均可参与考试
  const executableProblems = problems.filter((p) => p.executionMode !== 'local')

  function handleStartExam() {
    const selected = pickExamProblems(problems, state.settings)
    startExam(selected.map((p) => p.id))
    navigate('/exam/session')
  }

  return (
    <AppShell
      actions={
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-secondary)] transition-colors"
          onClick={openSettingsPanel}
          type="button"
        >
          <Settings2 size={13} />
          调整规则
        </button>
      }
      title="准备好进入模拟考试了吗？"
    >
      <div className="h-full overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-5">
          {/* Hero */}
          <section className="text-center py-2 sm:py-4">
            <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-primary-soft)] flex items-center justify-center mx-auto mb-2">
              <Trophy size={22} className="text-[var(--color-primary)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-ink)] mb-2">完整模拟考试链路</h2>
            <p className="text-sm text-[var(--color-ink-secondary)] leading-relaxed max-w-md mx-auto mb-6 px-2">
              系统将根据当前配置随机抽取题目，保留计时、切题、运行与提交的完整流程。
              浏览器可自动判题的题目（JS 函数题和组件题）均纳入题库。
            </p>
            <button
              className="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-strong)] transition-colors shadow-sm"
              onClick={handleStartExam}
              type="button"
            >
              开始考试
            </button>
          </section>

          {/* 规则 + 题库统计 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 当前规则 */}
            <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-muted)] mb-4">
                当前考试规则
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: '考试时长', value: `${state.settings.durationMinutes} 分钟` },
                  { label: '题目数量', value: `${state.settings.questionCount} 题` },
                  {
                    label: '覆盖分类',
                    value: `${state.settings.categoryIds.length || categories.length} 个`,
                  },
                  { label: '及格线', value: `${state.settings.passingScore} 分` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-lg font-bold text-[var(--color-ink)]">{value}</span>
                    <span className="text-[0.7rem] text-[var(--color-ink-muted)]">{label}</span>
                  </div>
                ))}
              </div>
              <button
                className="mt-4 text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-strong)] transition-colors"
                onClick={openSettingsPanel}
                type="button"
              >
                修改规则 →
              </button>
            </div>

            {/* 题库统计 */}
            <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-muted)] mb-4">
                可用题库
              </h3>
              <div className="flex flex-col gap-0.5 mb-4">
                <span className="text-3xl font-extrabold text-[var(--color-primary)]">
                  {executableProblems.length}
                </span>
                <span className="text-xs text-[var(--color-ink-muted)]">道可参与考试的题目</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => {
                  const count = executableProblems.filter((p) => p.categoryId === cat.id).length
                  return (
                    <div key={cat.id} className="flex items-center justify-between text-xs">
                      <span className="text-[var(--color-ink-secondary)]">{cat.label}</span>
                      <span className="font-semibold text-[var(--color-ink)]">{count} 题</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
