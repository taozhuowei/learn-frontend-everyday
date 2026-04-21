/**
 * Page: ExamEntryPage
 * Purpose: 考试入口页，展示考试规则配置、可用题目池统计，并提供"开始考试"入口。
 * executionMode !== 'local' 的题均可参与考试（browser + component）。
 */

import { Settings2, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
      <div className="h-full flex flex-col justify-center items-center p-6 sm:p-8 bg-[var(--color-surface-secondary)] overflow-hidden">
        <div className="max-w-4xl w-full flex flex-col gap-6 sm:gap-8">
          {/* Hero Section */}
          <section className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-2xl bg-[var(--color-primary-soft)] flex items-center justify-center mx-auto mb-4 shadow-sm"
            >
              <Trophy size={32} className="text-[var(--color-primary)]" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)] mb-3 tracking-tight">
              完整模拟考试链路
            </h2>
            <p className="text-sm text-[var(--color-ink-tertiary)] leading-relaxed max-w-lg mx-auto mb-8">
              系统将根据当前配置随机抽取题目，保留计时、切题、运行与提交的完整流程。
              浏览器可自动判题的题目（JS 函数题和组件题）均纳入题库。
            </p>
            <button
              className="inline-flex items-center gap-2 px-12 py-3.5 rounded-xl bg-[var(--color-primary)] text-white text-base font-bold hover:bg-[var(--color-primary-strong)] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-200"
              onClick={handleStartExam}
              type="button"
            >
              立即开始考试
            </button>
          </section>

          {/* Rules & Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Rules */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-muted)] mb-5">
                当前考试规则
              </h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 flex-1">
                {[
                  { label: '考试时长', value: `${state.settings.durationMinutes} min` },
                  { label: '题目数量', value: `${state.settings.questionCount} 题` },
                  {
                    label: '覆盖分类',
                    value: `${state.settings.categoryIds.length || categories.length} 个`,
                  },
                  { label: '及格分数', value: `${state.settings.passingScore} pt` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="text-xl font-black text-[var(--color-ink)] tabular-nums">
                      {value}
                    </span>
                    <span className="text-[0.65rem] font-bold text-[var(--color-ink-muted)] uppercase tracking-wider">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <button
                className="mt-6 text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                onClick={openSettingsPanel}
                type="button"
              >
                修改规则配置 <Settings2 size={12} />
              </button>
            </motion.div>

            {/* Question Pool Stats */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-muted)] mb-5">
                可用题库统计
              </h3>
              <div className="flex items-baseline gap-2 mb-6 border-b border-[var(--color-border)] pb-4">
                <span className="text-4xl font-black text-[var(--color-primary)] tabular-nums">
                  {executableProblems.length}
                </span>
                <span className="text-xs font-bold text-[var(--color-ink-tertiary)] uppercase tracking-wider">
                  Total Questions
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 flex-1 overflow-y-auto pr-2 no-scrollbar">
                {categories.map((cat) => {
                  const count = executableProblems.filter((p) => p.categoryId === cat.id).length
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between text-[0.7rem] border-b border-[var(--color-surface-secondary)] py-1.5 last:border-0"
                    >
                      <span className="font-medium text-[var(--color-ink-secondary)]">
                        {cat.label}
                      </span>
                      <span className="font-black text-[var(--color-ink)]">{count}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
