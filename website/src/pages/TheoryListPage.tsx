/**
 * Page: TheoryListPage
 * Route: /theory
 * Purpose: Article list with full-text search
 */

import { useDeferredValue, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FileText } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { knowledgeArticles } from '../generated/knowledge'
import type { KnowledgeArticle } from '../types/content'

function groupArticlesByCategory(articles: KnowledgeArticle[]): Map<string, KnowledgeArticle[]> {
  const groups = new Map<string, KnowledgeArticle[]>()

  for (const article of articles) {
    const category = article.category || '未分类'
    if (!groups.has(category)) {
      groups.set(category, [])
    }
    groups.get(category)!.push(article)
  }

  // Sort articles within each group by title
  for (const [category, groupArticles] of groups) {
    groups.set(
      category,
      groupArticles.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN')),
    )
  }

  return groups
}

export function TheoryListPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const deferredQuery = useDeferredValue(searchQuery)

  const filteredArticles = useMemo(() => {
    if (!deferredQuery.trim()) {
      return knowledgeArticles
    }
    const query = deferredQuery.toLowerCase()
    return knowledgeArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.searchText.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query),
    )
  }, [deferredQuery])

  const groupedArticles = useMemo(() => {
    return groupArticlesByCategory(filteredArticles)
  }, [filteredArticles])

  const sortedCategories = useMemo(() => {
    return Array.from(groupedArticles.keys()).sort((a, b) => a.localeCompare(b, 'zh-CN'))
  }, [groupedArticles])

  return (
    <AppShell eyebrow="理论知识" title="知识文库">
      <div className="h-full flex flex-col bg-[var(--color-surface-secondary)]">
        {/* Search Bar */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 bg-white border-b border-[var(--color-border)] shrink-0">
          <div className="relative w-full max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-[var(--color-ink-tertiary)]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章标题或内容..."
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-[var(--color-surface-secondary)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
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
          <div className="mt-2 text-xs text-[var(--color-ink-tertiary)]">
            共 {filteredArticles.length} 篇文章
            {deferredQuery && deferredQuery !== searchQuery && ' (搜索中...)'}
          </div>
        </div>

        {/* Article List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {sortedCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--color-ink-tertiary)]">
              <FileText size={48} className="mb-4 opacity-50" />
              <p className="text-sm">未找到匹配的文章</p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8 max-w-5xl">
              {sortedCategories.map((category) => (
                <section key={category}>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-tertiary)] mb-3 px-1">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {groupedArticles.get(category)!.map((article) => (
                      <button
                        key={article.slug}
                        onClick={() => navigate(`/theory/${article.slug}`)}
                        className="text-left p-4 bg-white rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-semibold text-[var(--color-ink)] text-sm leading-snug group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--color-surface-secondary)] text-[10px] font-medium text-[var(--color-ink-tertiary)]">
                            {article.headings.length}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-[var(--color-ink-tertiary)] truncate">
                          {article.sourcePath}
                        </p>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
