/**
 * Component: ProblemReferencePanel
 * Purpose: 学习/考试模式左侧栏。
 * 学习模式：搜索框 + 分类筛选 + 题目列表 + 底部题目说明/思路/答案 Tabs。
 * 考试模式（mode='exam'）：仅题目列表 + 题目说明 Tab，无思路/答案。
 */

import { useState } from 'react'
import type { ProblemRecord } from '../types/content'
import { MarkdownContent } from './MarkdownContent'

type DetailTab = 'description' | 'approach' | 'solution'

type SidebarItem = {
  id: string
  label: string
  status?: string
  score?: number
}

export function ProblemReferencePanel({
  problem,
  allProblems,
  items,
  currentProblemId,
  onSelect,
  mode = 'learn',
}: {
  problem: ProblemRecord
  /** 学习模式下传所有题目，用于搜索和分类筛选 */
  allProblems?: ProblemRecord[]
  items: SidebarItem[]
  currentProblemId: string
  onSelect: (problemId: string) => void
  mode?: 'learn' | 'exam'
}) {
  const [activeTab, setActiveTab] = useState<DetailTab>('description')
  const [solutionExpanded, setSolutionExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // 切换题目时重置答案展开状态
  const [lastProblemId, setLastProblemId] = useState(currentProblemId)
  if (lastProblemId !== currentProblemId) {
    setLastProblemId(currentProblemId)
    setSolutionExpanded(false)
    setActiveTab('description')
  }

  // 分类列表（学习模式）
  const categories =
    mode === 'learn' && allProblems
      ? Array.from(new Map(allProblems.map((p) => [p.categoryId, p.categoryName])).entries())
      : []

  // 过滤后的题目列表
  const filteredItems =
    mode === 'learn' && allProblems
      ? allProblems
          .filter((p) => {
            const matchSearch =
              !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase())
            const matchCategory = !selectedCategory || p.categoryId === selectedCategory
            return matchSearch && matchCategory
          })
          .map((p) => ({
            id: p.id,
            label: p.title,
            category: p.categoryName,
            executionMode: p.executionMode,
          }))
      : items.map((item) => ({ ...item, category: undefined, executionMode: undefined }))

  return (
    <aside className="flex flex-col h-full bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
      {/* ── 搜索 + 分类（仅学习模式） ── */}
      {mode === 'learn' ? (
        <div className="shrink-0 px-3 pt-3 pb-2 border-b border-[var(--color-border)] flex flex-col gap-2">
          <input
            className="w-full px-3 py-1.5 rounded-md border border-[var(--color-border)] text-sm bg-white focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] transition-all placeholder:text-[var(--color-ink-muted)] outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索题目..."
            type="text"
            value={searchQuery}
          />
          <div className="flex flex-wrap gap-1">
            <button
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all ${
                !selectedCategory
                  ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                  : 'bg-white border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-primary)]'
              }`}
              onClick={() => setSelectedCategory(null)}
              type="button"
            >
              全部
            </button>
            {categories.map(([id, name]) => (
              <button
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all ${
                  selectedCategory === id
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                    : 'bg-white border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-primary)]'
                }`}
                key={id}
                onClick={() => setSelectedCategory(id === selectedCategory ? null : id)}
                type="button"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* ── 题目列表 ── */}
      <div className="shrink-0 max-h-48 overflow-y-auto border-b border-[var(--color-border)]">
        <ul>
          {filteredItems.map((item, index) => {
            const isActive = item.id === currentProblemId
            return (
              <li key={item.id}>
                <button
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                    isActive
                      ? 'bg-[var(--color-primary-soft)] text-[var(--color-ink)]'
                      : 'hover:bg-[var(--color-surface-secondary)] text-[var(--color-ink-secondary)]'
                  }`}
                  onClick={() => onSelect(item.id)}
                  type="button"
                >
                  <span
                    className={`shrink-0 text-[0.6rem] font-bold font-mono w-6 text-right ${
                      isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-ink-muted)]'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 truncate text-sm font-semibold">{item.label}</span>
                  {'status' in item && item.status ? (
                    <span
                      className={`shrink-0 text-[0.6rem] font-bold ${
                        item.status === '已提交'
                          ? 'text-[var(--color-success)]'
                          : 'text-[var(--color-ink-muted)]'
                      }`}
                    >
                      {item.status}
                    </span>
                  ) : null}
                  {'score' in item && typeof item.score === 'number' ? (
                    <span className="shrink-0 text-[0.6rem] font-bold text-[var(--color-primary)]">
                      {item.score}分
                    </span>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* ── Tabs ── */}
      <div
        aria-label="题目信息切换"
        className="flex shrink-0 border-b border-[var(--color-border)]"
        role="tablist"
      >
        <button
          aria-selected={activeTab === 'description'}
          className={`cf-tab ${activeTab === 'description' ? 'active' : ''}`}
          onClick={() => setActiveTab('description')}
          role="tab"
          type="button"
        >
          题目说明
        </button>
        {mode === 'learn' ? (
          <button
            aria-selected={activeTab === 'approach'}
            className={`cf-tab ${activeTab === 'approach' ? 'active' : ''}`}
            onClick={() => setActiveTab('approach')}
            role="tab"
            type="button"
          >
            思路
          </button>
        ) : null}
        {mode === 'learn' ? (
          <button
            aria-selected={activeTab === 'solution'}
            className={`cf-tab ${activeTab === 'solution' ? 'active' : ''}`}
            onClick={() => setActiveTab('solution')}
            role="tab"
            type="button"
          >
            答案
          </button>
        ) : null}
      </div>

      {/* ── Tab 内容 ── */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'description' ? (
          <div className="flex flex-col gap-3">
            <div>
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <h2 className="text-sm font-bold text-[var(--color-ink)]">{problem.title}</h2>
                <span className="text-[0.65rem] font-bold text-[var(--color-primary-ink)] bg-[var(--color-primary-soft)] px-1.5 py-0.5 rounded-full shrink-0">
                  {problem.categoryName}
                </span>
              </div>
              <p className="text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                {problem.description}
              </p>
            </div>

            {/* 入参 & 返回值 */}
            <div className="flex flex-col gap-2">
              <div>
                <span className="text-[0.65rem] font-bold uppercase tracking-wide text-[var(--color-ink-muted)] block mb-1">
                  入参
                </span>
                <div className="text-xs text-[var(--color-ink-secondary)]">
                  <MarkdownContent markdown={problem.paramsText} />
                </div>
              </div>
              <div>
                <span className="text-[0.65rem] font-bold uppercase tracking-wide text-[var(--color-ink-muted)] block mb-1">
                  返回值
                </span>
                <div className="text-xs text-[var(--color-ink-secondary)]">
                  <MarkdownContent markdown={problem.returnText} />
                </div>
              </div>
            </div>

            {/* 本地环境说明 */}
            {problem.executionMode === 'local' && problem.launcherPath ? (
              <div className="rounded-md bg-[var(--color-surface-secondary)] border border-[var(--color-border)] p-2.5">
                <span className="text-[0.65rem] font-bold uppercase tracking-wide text-[var(--color-ink-muted)] block mb-1">
                  本地环境
                </span>
                <code className="text-xs text-[var(--color-ink-secondary)] font-mono">
                  {problem.launcherPath}
                </code>
                <p className="text-[0.65rem] text-[var(--color-ink-muted)] mt-1">
                  请自行在本机 Node.js 环境下判题
                </p>
              </div>
            ) : null}

            {/* 基础用例预览（前 3 条） */}
            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-wide text-[var(--color-ink-muted)] block mb-1">
                基础用例预览
              </span>
              <div className="flex flex-col gap-1.5">
                {problem.basicCases.map((c) => (
                  <div
                    className="rounded-md border border-[var(--color-border)] px-2.5 py-1.5 text-[0.7rem] font-mono bg-[var(--color-surface-secondary)]"
                    key={c.id}
                  >
                    <div>
                      <span className="text-[var(--color-ink-muted)]">输入 </span>
                      {c.input}
                    </div>
                    <div>
                      <span className="text-[var(--color-ink-muted)]">期望 </span>
                      {JSON.stringify(c.expected)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'approach' && mode === 'learn' ? (
          <div>
            <h3 className="text-sm font-bold text-[var(--color-ink)] mb-2">解题思路</h3>
            <MarkdownContent markdown={problem.approachText} />
          </div>
        ) : null}

        {activeTab === 'solution' && mode === 'learn' ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[var(--color-ink)]">标准答案</h3>
              <button
                className="text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-strong)] transition-colors"
                onClick={() => setSolutionExpanded((prev) => !prev)}
                type="button"
              >
                {solutionExpanded ? '收起答案' : '查看答案'}
              </button>
            </div>
            {solutionExpanded ? (
              <pre className="rounded-md bg-[var(--color-surface-secondary)] p-3 text-xs font-mono overflow-x-auto text-[var(--color-ink-secondary)]">
                {problem.solutionCode}
              </pre>
            ) : (
              <div className="rounded-md border border-dashed border-[var(--color-border-strong)] py-8 text-center">
                <p className="text-xs text-[var(--color-ink-muted)]">点击"查看答案"展开标准实现</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </aside>
  )
}
