/**
 * Page: LearnListPage
 * Route: /learn
 * Purpose: Problem list with search and category filter
 */

import { useDeferredValue, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Code2 } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { problems } from '../generated/problems'

export function LearnListPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const deferredQuery = useDeferredValue(searchQuery)

  // Extract unique categories
  const categories = useMemo(() => {
    const categoryMap = new Map<string, string>()
    for (const problem of problems) {
      if (!categoryMap.has(problem.categoryId)) {
        categoryMap.set(problem.categoryId, problem.categoryName)
      }
    }
    return Array.from(categoryMap.entries()).sort((a, b) => a[1].localeCompare(b[1], 'zh-CN'))
  }, [])

  // Filter problems by search query and category
  const filteredProblems = useMemo(() => {
    let result = problems

    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === selectedCategory)
    }

    if (deferredQuery.trim()) {
      const query = deferredQuery.toLowerCase()
      result = result.filter((p) => p.title.toLowerCase().includes(query))
    }

    return result
  }, [deferredQuery, selectedCategory])

  // Get execution mode badge
  const getExecutionBadge = (mode: string) => {
    switch (mode) {
      case 'component':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-orange-100 text-orange-700">
            组件题
          </span>
        )
      case 'local':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-surface-secondary)] text-[var(--color-ink-tertiary)]">
            本地
          </span>
        )
      default:
        return null
    }
  }

  return (
    <AppShell title="题库">
      <div className="h-full flex flex-col bg-[var(--color-surface-secondary)]">
        {/* Search and Filter Bar */}
        <div className="px-5 py-4 bg-white border-b border-[var(--color-border)] shrink-0 space-y-3">
          {/* Search Input */}
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-[var(--color-ink-tertiary)]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索题目标题..."
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-surface-secondary)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)]"
              >
                <span className="text-xs">清除</span>
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface-secondary)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-secondary)]/80'
              }`}
            >
              全部
            </button>
            {categories.map(([categoryId, categoryName]) => (
              <button
                key={categoryId}
                onClick={() => setSelectedCategory(categoryId)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === categoryId
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface-secondary)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-secondary)]/80'
                }`}
              >
                {categoryName}
              </button>
            ))}
          </div>
        </div>

        {/* Problem List */}
        <div className="flex-1 overflow-y-auto">
          {filteredProblems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--color-ink-tertiary)]">
              <Code2 size={48} className="mb-4 opacity-50" />
              <p className="text-sm">未找到匹配题目</p>
            </div>
          ) : (
            <div className="bg-white">
              {filteredProblems.map((problem) => (
                <button
                  key={problem.id}
                  onClick={() => navigate(`/learn/${problem.id}`)}
                  className="w-full flex items-center gap-4 px-5 py-4 border-b border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)] transition-colors text-left"
                >
                  {/* Sequence Number */}
                  <span className="w-8 text-sm text-[var(--color-ink-tertiary)] font-mono">
                    {String(problem.sequence).padStart(2, '0')}
                  </span>

                  {/* Title */}
                  <span className="flex-1 text-sm font-medium text-[var(--color-ink)] truncate">
                    {problem.title}
                  </span>

                  {/* Execution Mode Badge */}
                  {getExecutionBadge(problem.executionMode)}

                  {/* Category Badge */}
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-surface-secondary)] text-[var(--color-ink-tertiary)]">
                    {problem.categoryName}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Result Count */}
        <div className="px-5 py-2 bg-white border-t border-[var(--color-border)] shrink-0">
          <span className="text-xs text-[var(--color-ink-tertiary)]">
            共 {filteredProblems.length} 道题目
            {deferredQuery && deferredQuery !== searchQuery && ' (搜索中...)'}
          </span>
        </div>
      </div>
    </AppShell>
  )
}
