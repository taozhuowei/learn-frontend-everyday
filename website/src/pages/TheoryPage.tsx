import { useDeferredValue, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { MarkdownContent } from '../components/MarkdownContent'
import { SearchBar } from '../components/SearchBar'
import { knowledgeArticles } from '../generated/knowledge'

export function TheoryPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)

  const filteredArticles = useMemo(() => {
    const keyword = deferredSearch.trim().toLowerCase()

    return knowledgeArticles.filter((article) => {
      if (!keyword) {
        return true
      }

      return article.searchText.includes(keyword)
    })
  }, [deferredSearch])

  const currentArticle =
    filteredArticles.find((article) => article.slug === slug) ?? filteredArticles[0]

  if (!currentArticle) {
    return <Navigate replace to="/" />
  }

  return (
    <AppShell eyebrow="理论知识" title={currentArticle.title}>
      <div className="theory-page-layout theory-page-layout-reading">
        <section className="panel filter-panel compact-panel theory-filter-panel">
          <SearchBar
            label="全文搜索"
            onChange={setSearch}
            placeholder="按标题、分类或正文内容搜索"
            value={search}
          />
        </section>

        <div className="theory-grid theory-grid-reading">
          <aside className="panel theory-sidebar">
            <div className="panel-heading">
              <span className="panel-title">文章列表</span>
              <span className="panel-caption">{filteredArticles.length} 篇</span>
            </div>
            <div className="scroll-region theory-sidebar-scroll">
              <div className="library-groups">
                {filteredArticles.map((article) => {
                  const isActive = article.slug === currentArticle.slug
                  return (
                    <button
                      className={`library-problem-card theory-sidebar-card ${isActive ? 'active' : ''}`}
                      key={article.slug}
                      onClick={() => navigate(`/theory/${article.slug}`)}
                      type="button"
                    >
                      <span className="library-problem-meta">{article.category}</span>
                      <strong>{article.title}</strong>
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>

          <article className="panel theory-article theory-article-reading">
            <div className="panel-heading">
              <span className="panel-title">{currentArticle.title}</span>
              <span className="panel-caption">{currentArticle.sourcePath}</span>
            </div>
            <div className="scroll-region theory-reading-scroll">
              <MarkdownContent markdown={currentArticle.markdown} />
            </div>
          </article>

          <aside className="panel theory-outline theory-outline-reading">
            <div className="panel-heading">
              <span className="panel-title">文章目录</span>
              <span className="panel-caption">{currentArticle.headings.length} 个标题</span>
            </div>
            <div className="outline-list">
              {currentArticle.headings.map((heading) => (
                <button
                  className="outline-link"
                  key={`${heading.slug}-${heading.depth}`}
                  onClick={() => {
                    navigate(`/theory/${currentArticle.slug}#${heading.slug}`)
                    window.location.hash = heading.slug
                  }}
                  style={{ paddingLeft: `${heading.depth * 0.75}rem` }}
                  type="button"
                >
                  {heading.text}
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}
