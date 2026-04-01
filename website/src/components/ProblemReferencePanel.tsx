import { useEffect, useState } from 'react'
import type { ProblemRecord } from '../types/content'
import { CodePreview } from './CodePreview'
import { MarkdownContent } from './MarkdownContent'

type ReferenceTab = 'description' | 'approach' | 'solution' | 'sequence'

type SidebarItem = {
  id: string
  label: string
  status: string
  score?: number
}

export function ProblemReferencePanel({
  problem,
  items,
  currentProblemId,
  onSelect,
  showApproach = false,
  showSolution = true,
  showSequence = false,
}: {
  problem: ProblemRecord
  items: SidebarItem[]
  currentProblemId: string
  onSelect: (problemId: string) => void
  showApproach?: boolean
  showSolution?: boolean
  showSequence?: boolean
}) {
  const [activeTab, setActiveTab] = useState<ReferenceTab>('description')

  useEffect(() => {
    setActiveTab('description')
  }, [problem.id])

  return (
    <aside className="lc-panel lc-reference-panel">
      <div aria-label="题目信息切换" className="lc-tabs" role="tablist">
        <button
          aria-selected={activeTab === 'description'}
          className={`lc-tab ${activeTab === 'description' ? 'lc-tab-active' : ''}`}
          onClick={() => setActiveTab('description')}
          role="tab"
          type="button"
        >
          题目
        </button>
        {showApproach ? (
          <button
            aria-selected={activeTab === 'approach'}
            className={`lc-tab ${activeTab === 'approach' ? 'lc-tab-active' : ''}`}
            onClick={() => setActiveTab('approach')}
            role="tab"
            type="button"
          >
            思路
          </button>
        ) : null}
        {showSolution ? (
          <button
            aria-selected={activeTab === 'solution'}
            className={`lc-tab ${activeTab === 'solution' ? 'lc-tab-active' : ''}`}
            onClick={() => setActiveTab('solution')}
            role="tab"
            type="button"
          >
            答案
          </button>
        ) : null}
        {showSequence ? (
          <button
            aria-selected={activeTab === 'sequence'}
            className={`lc-tab ${activeTab === 'sequence' ? 'lc-tab-active' : ''}`}
            onClick={() => setActiveTab('sequence')}
            role="tab"
            type="button"
          >
            列表
          </button>
        ) : null}
      </div>

      <div className="lc-reference-content">
        {activeTab === 'description' ? (
          <div className="lc-reference-section">
            <div className="lc-problem-header">
              <h2 className="lc-problem-title">{problem.title}</h2>
              <span className="lc-problem-category">{problem.categoryName}</span>
            </div>
            <div className="lc-problem-description">
              <p>{problem.description}</p>
            </div>
            <div className="lc-problem-meta">
              <div className="lc-meta-item">
                <span className="lc-meta-label">入参</span>
                <div className="lc-meta-content">
                  <MarkdownContent markdown={problem.paramsText} />
                </div>
              </div>
              <div className="lc-meta-item">
                <span className="lc-meta-label">返回值</span>
                <div className="lc-meta-content">
                  <MarkdownContent markdown={problem.returnText} />
                </div>
              </div>
            </div>
            {problem.executionMode === 'local' && problem.launcherPath ? (
              <div className="lc-meta-item lc-meta-local">
                <span className="lc-meta-label">本地联调</span>
                <code className="lc-meta-code">{problem.launcherPath}</code>
              </div>
            ) : null}
          </div>
        ) : null}

        {activeTab === 'approach' && showApproach ? (
          <div className="lc-reference-section">
            <div className="lc-section-header">
              <h3 className="lc-section-title">解题思路</h3>
            </div>
            <div className="lc-section-content">
              <MarkdownContent markdown={problem.approachText} />
            </div>
          </div>
        ) : null}

        {activeTab === 'solution' && showSolution ? (
          <div className="lc-reference-section">
            <div className="lc-section-header">
              <h3 className="lc-section-title">标准答案</h3>
              <span className="lc-section-subtitle">{problem.sourcePath}</span>
            </div>
            <div className="lc-code-block">
              <CodePreview
                code={problem.solutionCode}
                language={problem.sourceType === 'vue' ? 'markup' : problem.sourceType}
              />
            </div>
          </div>
        ) : null}

        {activeTab === 'sequence' && showSequence ? (
          <div className="lc-reference-section">
            <div className="lc-section-header">
              <h3 className="lc-section-title">题目序列</h3>
              <span className="lc-section-subtitle">{items.length} 题</span>
            </div>

            <ul className="lc-problem-list">
              {items.map((item, index) => (
                <li key={item.id}>
                  <button
                    className={`lc-problem-list-item ${item.id === currentProblemId ? 'lc-problem-list-item-active' : ''}`}
                    onClick={() => onSelect(item.id)}
                    type="button"
                  >
                    <span className="lc-problem-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="lc-problem-info">
                      <span className="lc-problem-name">{item.label}</span>
                      <span className="lc-problem-status">{item.status}</span>
                    </span>
                    {typeof item.score === 'number' ? (
                      <span className="lc-problem-score">{item.score} 分</span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
