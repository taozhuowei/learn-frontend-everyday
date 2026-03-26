import { useDeferredValue, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { SearchBar } from '../components/SearchBar'
import { useAppState } from '../context/AppStateContext'
import { problems } from '../generated/problems'

export function LibraryPage() {
  const { categories } = useAppState()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const deferredSearch = useDeferredValue(search)

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesCategory = activeCategory === 'all' || problem.categoryId === activeCategory
      const matchesSearch =
        deferredSearch.trim().length === 0 ||
        `${problem.title} ${problem.description} ${problem.categoryName}`
          .toLowerCase()
          .includes(deferredSearch.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, deferredSearch])

  const groupedProblems = useMemo(() => {
    return categories
      .map((category) => ({
        id: category.id,
        label: category.label,
        problems: filteredProblems.filter((problem) => problem.categoryId === category.id),
      }))
      .filter((group) => group.problems.length > 0)
  }, [categories, filteredProblems])

  return (
    <AppShell eyebrow="题库" title="题库概览">
      <div className="library-page-layout library-page-layout-catalog">
        <section className="panel filter-panel compact-panel library-filter-panel library-filter-panel-compact">
          <SearchBar
            label="搜索题目"
            onChange={setSearch}
            placeholder="输入标题、描述或分类"
            value={search}
          />
          <div className="chip-group">
            <button
              className={`chip ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
              type="button"
            >
              全部
            </button>
            {categories.map((category) => (
              <button
                className={`chip ${activeCategory === category.id ? 'active' : ''}`}
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                type="button"
              >
                {category.label}
              </button>
            ))}
          </div>
        </section>

        <div className="library-catalog-scroll">
          {groupedProblems.map((group) => (
            <section className="library-category-section" key={group.id}>
              <header className="library-section-header">
                <div>
                  <span className="eyebrow">{group.id}</span>
                  <h2>{group.label}</h2>
                </div>
                <span className="library-section-count">{group.problems.length} 题</span>
              </header>

              <div className="library-section-grid">
                {group.problems.map((problem) => (
                  <Link
                    className="panel library-card library-card-link"
                    key={problem.id}
                    to={`/library/${problem.id}`}
                  >
                    <div className="library-card-top">
                      <span className="library-card-index">
                        {String(problem.sequence).padStart(2, '0')}
                      </span>
                      <span className="eyebrow">
                        {problem.executionMode === 'browser' ? problem.categoryName : '本地环境题'}
                      </span>
                    </div>
                    <h3>{problem.title}</h3>
                    <p>{problem.description}</p>
                    <div className="library-meta">
                      <span>{problem.basicCases.length} 个基础用例</span>
                      <span>{problem.fullCases.length} 个完整用例</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
