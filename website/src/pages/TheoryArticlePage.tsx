/**
 * Page: TheoryArticlePage
 * Route: /theory/:slug
 * Purpose: Article detail with TOC, recitation mode, in-doc search
 */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EyeOff, Search, ChevronUp, ChevronDown, X } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { MarkdownContent } from '../components/MarkdownContent'
import { knowledgeArticles } from '../generated/knowledge'
import type { KnowledgeHeading } from '../types/content'

export function TheoryArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)
  const [activeHeadingSlug, setActiveHeadingSlug] = useState<string>('')
  const [recitationMode, setRecitationMode] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const marksRef = useRef<HTMLElement[]>([])

  const article = useMemo(() => {
    return knowledgeArticles.find((a) => a.slug === slug)
  }, [slug])

  // Redirect if article not found
  useEffect(() => {
    if (!article) {
      navigate('/theory', { replace: true })
    }
  }, [article, navigate])

  if (!article) {
    return null
  }

  return (
    <AppShell title={article.title} showPageHeader={false} backTo="/theory" backLabel="知识库">
      <div className="h-full flex flex-col bg-white">
        {/* Top Action Bar */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-[var(--color-border)] bg-white shrink-0">
          <button
            onClick={() => navigate('/theory')}
            className="text-sm text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] transition-colors"
          >
            ← 返回列表
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setRecitationMode((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                recitationMode
                  ? 'bg-amber-100 text-amber-700'
                  : 'text-[var(--color-ink-tertiary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-ink)]'
              }`}
              title="背诵模式"
            >
              <EyeOff size={16} />
              <span className="hidden sm:inline">背诵模式</span>
            </button>
            <button
              onClick={() => setSearchVisible((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                searchVisible
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'text-[var(--color-ink-tertiary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-ink)]'
              }`}
              title="文档内搜索"
            >
              <Search size={16} />
              <span className="hidden sm:inline">搜索</span>
            </button>
          </div>
        </div>

        {/* In-doc Search Bar */}
        {searchVisible && (
          <InDocSearchBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            currentMatchIndex={currentMatchIndex}
            totalMatches={marksRef.current.length}
            onPrev={() => {
              const newIndex =
                currentMatchIndex > 0 ? currentMatchIndex - 1 : marksRef.current.length - 1
              setCurrentMatchIndex(newIndex)
              highlightCurrentMatch(newIndex)
            }}
            onNext={() => {
              const newIndex =
                currentMatchIndex < marksRef.current.length - 1 ? currentMatchIndex + 1 : 0
              setCurrentMatchIndex(newIndex)
              highlightCurrentMatch(newIndex)
            }}
            onClose={() => {
              setSearchVisible(false)
              setSearchQuery('')
            }}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div
              ref={contentRef}
              className={`max-w-[760px] mx-auto px-6 py-8 transition-opacity duration-200 ${
                recitationMode ? 'cf-recitation-mode' : ''
              }`}
            >
              <h1 className="text-2xl font-bold text-[var(--color-ink)] mb-6">{article.title}</h1>
              <MarkdownContent markdown={article.markdown} />
            </div>
          </div>

          {/* TOC Sidebar */}
          <TocSidebar
            headings={article.headings}
            activeSlug={activeHeadingSlug}
            onHeadingClick={(headingSlug) => {
              const element = document.getElementById(headingSlug)
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          />
        </div>

        {/* Intersection Observer for Active Heading */}
        <ActiveHeadingObserver
          headings={article.headings}
          contentRef={contentRef}
          onActiveChange={setActiveHeadingSlug}
        />

        {/* Search Highlighter */}
        {searchVisible && (
          <SearchHighlighter
            containerRef={contentRef}
            query={searchQuery}
            marksRef={marksRef}
            currentMatchIndex={currentMatchIndex}
            onMatchesChange={(count) => {
              setCurrentMatchIndex(count > 0 ? 0 : -1)
            }}
          />
        )}
      </div>
    </AppShell>
  )
}

function InDocSearchBar({
  query,
  onQueryChange,
  currentMatchIndex,
  totalMatches,
  onPrev,
  onNext,
  onClose,
}: {
  query: string
  onQueryChange: (query: string) => void
  currentMatchIndex: number
  totalMatches: number
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)] shrink-0">
      <div className="flex items-center gap-3 max-w-[760px]">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-tertiary)]"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="在文档中搜索..."
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-[var(--color-border)] rounded-md text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            disabled={totalMatches === 0}
            className="p-1.5 rounded-md text-[var(--color-ink-tertiary)] hover:bg-white hover:text-[var(--color-ink)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="上一个匹配"
          >
            <ChevronUp size={18} />
          </button>
          <span className="text-sm text-[var(--color-ink-tertiary)] min-w-[4rem] text-center">
            {totalMatches > 0 ? `${currentMatchIndex + 1} / ${totalMatches}` : '0 / 0'}
          </span>
          <button
            onClick={onNext}
            disabled={totalMatches === 0}
            className="p-1.5 rounded-md text-[var(--color-ink-tertiary)] hover:bg-white hover:text-[var(--color-ink)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="下一个匹配"
          >
            <ChevronDown size={18} />
          </button>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-[var(--color-ink-tertiary)] hover:bg-white hover:text-[var(--color-ink)] transition-colors"
          title="关闭搜索"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

function TocSidebar({
  headings,
  activeSlug,
  onHeadingClick,
}: {
  headings: KnowledgeHeading[]
  activeSlug: string
  onHeadingClick: (slug: string) => void
}) {
  return (
    <aside className="hidden lg:block w-56 shrink-0 border-l border-[var(--color-border)] bg-white overflow-y-auto">
      <div className="sticky top-0 p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-tertiary)] mb-3">
          目录
        </h3>
        <nav className="space-y-1">
          {headings.map((heading) => (
            <button
              key={heading.slug}
              onClick={() => onHeadingClick(heading.slug)}
              className={`w-full text-left text-sm py-1.5 px-2 rounded-md transition-colors ${
                activeSlug === heading.slug
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                  : 'text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-ink)]'
              }`}
              style={{ paddingLeft: `${0.75 * (heading.depth - 1) + 0.5}rem` }}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}

function ActiveHeadingObserver({
  headings,
  contentRef,
  onActiveChange,
}: {
  headings: KnowledgeHeading[]
  contentRef: React.RefObject<HTMLDivElement | null>
  onActiveChange: (slug: string) => void
}) {
  useEffect(() => {
    if (!contentRef.current || headings.length === 0) return

    const headingElements = headings
      .map((h) => document.getElementById(h.slug))
      .filter(Boolean) as HTMLElement[]

    if (headingElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting)
        if (visibleEntries.length > 0) {
          // Get the first visible heading
          const firstVisible = visibleEntries.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0]
          onActiveChange(firstVisible.target.id)
        }
      },
      {
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0,
      },
    )

    headingElements.forEach((el) => observer.observe(el))

    // Set initial active heading
    onActiveChange(headingElements[0]?.id || '')

    return () => observer.disconnect()
  }, [headings, contentRef, onActiveChange])

  return null
}

function SearchHighlighter({
  containerRef,
  query,
  marksRef,
  currentMatchIndex,
  onMatchesChange,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>
  query: string
  marksRef: React.MutableRefObject<HTMLElement[]>
  currentMatchIndex: number
  onMatchesChange: (count: number) => void
}) {
  // Clear previous highlights
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clear existing marks
    container.querySelectorAll('mark.cf-search-mark').forEach((m) => {
      const mark = m as HTMLElement
      mark.replaceWith(mark.textContent ?? '')
    })
    container.normalize()
    marksRef.current = []

    if (!query.trim()) {
      onMatchesChange(0)
      return
    }

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        // Skip code blocks and pre elements
        let parent = node.parentElement
        while (parent) {
          if (
            parent.tagName === 'CODE' ||
            parent.tagName === 'PRE' ||
            parent.classList.contains('cf-search-mark')
          ) {
            return NodeFilter.FILTER_REJECT
          }
          parent = parent.parentElement
        }
        return NodeFilter.FILTER_ACCEPT
      },
    })

    const textNodes: Text[] = []
    let node: Node | null
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text)
    }

    const lowerQuery = query.toLowerCase()
    const newMarks: HTMLElement[] = []

    for (const textNode of textNodes) {
      const text = textNode.textContent || ''
      const lowerText = text.toLowerCase()
      let index = lowerText.indexOf(lowerQuery)

      if (index === -1) continue

      const fragment = document.createDocumentFragment()
      let lastIndex = 0

      while (index !== -1) {
        // Text before match
        if (index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, index)))
        }

        // Create mark element
        const mark = document.createElement('mark')
        mark.className = 'cf-search-mark bg-amber-200 text-amber-900 rounded px-0.5'
        mark.textContent = text.slice(index, index + query.length)
        fragment.appendChild(mark)
        newMarks.push(mark)

        lastIndex = index + query.length
        index = lowerText.indexOf(lowerQuery, lastIndex)
      }

      // Remaining text
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)))
      }

      textNode.parentNode?.replaceChild(fragment, textNode)
    }

    marksRef.current = newMarks
    onMatchesChange(newMarks.length)

    // Scroll first match into view
    if (newMarks.length > 0) {
      newMarks[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [query, containerRef, marksRef, onMatchesChange])

  // Highlight current match
  useLayoutEffect(() => {
    marksRef.current.forEach((mark, index) => {
      if (index === currentMatchIndex) {
        mark.classList.add('ring-2', 'ring-amber-400')
        mark.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        mark.classList.remove('ring-2', 'ring-amber-400')
      }
    })
  }, [currentMatchIndex, marksRef])

  return null
}

function highlightCurrentMatch(_index: number) {
  // This is handled by the useLayoutEffect in SearchHighlighter
}
