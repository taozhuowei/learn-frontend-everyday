/**
 * Page: LearnPage
 * Route: /learn/:problemId
 * Purpose: Render the learn workspace with problem details, editor, and judge panel.
 */

import { useEffect, useState } from 'react'
import { Navigate, useParams, useNavigate } from 'react-router-dom'
import { Hand, MousePointer2, ChevronLeft, ChevronRight } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { CodeBlock, type CodeBlockInteractionMode } from '../components/CodeBlock'
import { MarkdownContent } from '../components/MarkdownContent'
import { ProblemDescriptionContent } from '../components/ProblemDescriptionContent'
import { problems } from '../generated/problems'
import type { ProblemRecord } from '../types/content'
import { ComponentLearnPage } from './ComponentLearnPage'
import { useAppState } from '../context/AppStateContext'
import { ProblemWorkspace } from '../components/ProblemWorkspace'

const firstProblemId = problems[0]?.id ?? ''
const SOLUTION_INTERACTION_MODE_STORAGE_KEY = 'practice_solution_interaction_mode'
const DEFAULT_SOLUTION_INTERACTION_MODE: CodeBlockInteractionMode = 'pan'

function readStoredSolutionInteractionMode(): CodeBlockInteractionMode {
  if (typeof window === 'undefined') {
    return DEFAULT_SOLUTION_INTERACTION_MODE
  }
  const storedMode = window.localStorage.getItem(SOLUTION_INTERACTION_MODE_STORAGE_KEY)
  return storedMode === 'pan' || storedMode === 'select'
    ? (storedMode as CodeBlockInteractionMode)
    : DEFAULT_SOLUTION_INTERACTION_MODE
}

function createInitialSource(problem: ProblemRecord) {
  if (problem.template) return problem.template
  if (problem.sourceType === 'vue') return `<!-- 根据题目说明完成实现：${problem.title} -->\n`
  return `// 根据题目说明完成实现：${problem.title}\n`
}

type DetailTab = 'description' | 'approach' | 'solution'

function ProblemInfoPanel({
  problem,
  activeTab,
  onTabChange,
  solutionInteractionMode,
  onSolutionInteractionModeChange,
}: {
  problem: ProblemRecord
  activeTab: DetailTab
  onTabChange: (tab: DetailTab) => void
  solutionInteractionMode: CodeBlockInteractionMode
  onSolutionInteractionModeChange: (mode: CodeBlockInteractionMode) => void
}) {
  return (
    <aside className="flex flex-col h-full bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
      <div
        aria-label="题目信息切换"
        className="flex shrink-0 border-b border-[var(--color-border)]"
        role="tablist"
      >
        {(['description', 'approach', 'solution'] as const).map((tab) => (
          <button
            key={tab}
            aria-selected={activeTab === tab}
            className={`cf-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onTabChange(tab)}
            role="tab"
            type="button"
          >
            {tab === 'description' ? '题目说明' : tab === 'approach' ? '思路' : '答案'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'description' ? <ProblemDescriptionContent problem={problem} /> : null}

        {activeTab === 'approach' ? (
          <div>
            <h3 className="text-sm font-bold text-[var(--color-ink)] mb-3">解题思路</h3>
            <div className="text-sm text-[var(--color-ink-secondary)] leading-relaxed">
              <MarkdownContent markdown={problem.approachText || '暂无思路说明'} />
            </div>
          </div>
        ) : null}

        {activeTab === 'solution' ? (
          <div>
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="pt-1 text-sm font-bold text-[var(--color-ink)]">标准答案</h3>
              <div
                aria-label="答案代码浏览模式"
                className="flex items-center gap-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-1"
                role="tablist"
              >
                {[
                  { icon: Hand, id: 'pan' as const, label: '手型浏览' },
                  { icon: MousePointer2, id: 'select' as const, label: '文本选择' },
                ].map((option) => {
                  const Icon = option.icon
                  const isActive = solutionInteractionMode === option.id

                  return (
                    <button
                      aria-label={option.label}
                      aria-selected={isActive}
                      className={`flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] transition-colors ${
                        isActive
                          ? 'bg-white text-[var(--color-ink)] shadow-sm'
                          : 'text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)]'
                      }`}
                      key={option.id}
                      onClick={() => onSolutionInteractionModeChange(option.id)}
                      role="tab"
                      title={option.label}
                      type="button"
                    >
                      <Icon size={14} />
                    </button>
                  )
                })}
              </div>
            </div>
            <CodeBlock
              code={problem.solutionCode}
              interactionMode={solutionInteractionMode}
              language={problem.sourceType}
            />
          </div>
        ) : null}
      </div>
    </aside>
  )
}

export function LearnPage() {
  const { problemId } = useParams()
  const problem = problems.find((singleProblem) => singleProblem.id === problemId)

  if (!problem) {
    return <Navigate replace to={`/learn/${firstProblemId}`} />
  }

  // 组件题使用专门的页面
  if (problem.isComponent) {
    return <ComponentLearnPage problem={problem} />
  }

  return <LearnProblemView key={problem.id} problem={problem} />
}

function LearnProblemView({ problem }: { problem: ProblemRecord }) {
  const {
    state: { isMobile },
  } = useAppState()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<DetailTab>('description')
  const [solutionInteractionMode, setSolutionInteractionMode] = useState<CodeBlockInteractionMode>(
    () => readStoredSolutionInteractionMode(),
  )

  useEffect(() => {
    window.localStorage.setItem(SOLUTION_INTERACTION_MODE_STORAGE_KEY, solutionInteractionMode)
  }, [solutionInteractionMode])

  const currentIndex = problems.findIndex((p) => p.id === problem.id)
  const prevProblem = currentIndex > 0 ? problems[currentIndex - 1] : null
  const nextProblem = currentIndex < problems.length - 1 ? problems[currentIndex + 1] : null

  if (isMobile) {
    return (
      <AppShell eyebrow="学习模式" title={problem.title} showPageHeader={false} backTo="/learn">
        <div className="h-full flex flex-col items-center justify-center bg-white p-8 text-center text-sm text-[var(--color-ink-tertiary)]">
          学习模式暂不支持移动端，请在 PC 端打开。
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell
      eyebrow="学习模式"
      title={problem.title}
      showPageHeader={false}
      backTo="/learn"
      backLabel="题目列表"
    >
      <ProblemWorkspace
        key={problem.id}
        problem={problem}
        mode="learn"
        initialSource={createInitialSource(problem)}
        renderInfoPanel={() => (
          <ProblemInfoPanel
            activeTab={activeTab}
            onSolutionInteractionModeChange={setSolutionInteractionMode}
            onTabChange={setActiveTab}
            problem={problem}
            solutionInteractionMode={solutionInteractionMode}
          />
        )}
        renderHeaderRight={() => (
          <div className="flex items-center gap-1.5 ml-2 border-l border-[var(--color-border)] pl-3">
            <button
              disabled={!prevProblem}
              onClick={() => navigate(`/learn/${prevProblem?.id}`)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--color-ink-tertiary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-ink)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="上一题"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[10px] font-bold text-[var(--color-ink-muted)] tabular-nums min-w-[40px] text-center">
              {currentIndex + 1} / {problems.length}
            </span>
            <button
              disabled={!nextProblem}
              onClick={() => navigate(`/learn/${nextProblem?.id}`)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--color-ink-tertiary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-ink)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="下一题"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      />
    </AppShell>
  )
}
