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
  const visibleTabCount = [true, showApproach, showSolution, showSequence].filter(Boolean).length
  const [activeTab, setActiveTab] = useState<ReferenceTab>('description')

  useEffect(() => {
    setActiveTab('description')
  }, [problem.id])

  return (
    <aside className="panel reference-panel">
      <div
        aria-label="题目信息切换"
        className={`reference-tabs ${visibleTabCount === 2 ? 'reference-tabs-double' : ''} ${visibleTabCount >= 4 ? 'reference-tabs-quad' : ''}`}
        role="tablist"
      >
        <button
          aria-selected={activeTab === 'description'}
          className={`reference-tab ${activeTab === 'description' ? 'active' : ''}`}
          onClick={() => setActiveTab('description')}
          role="tab"
          type="button"
        >
          题目说明
        </button>
        {showApproach ? (
          <button
            aria-selected={activeTab === 'approach'}
            className={`reference-tab ${activeTab === 'approach' ? 'active' : ''}`}
            onClick={() => setActiveTab('approach')}
            role="tab"
            type="button"
          >
            解题思路
          </button>
        ) : null}
        {showSolution ? (
          <button
            aria-selected={activeTab === 'solution'}
            className={`reference-tab ${activeTab === 'solution' ? 'active' : ''}`}
            onClick={() => setActiveTab('solution')}
            role="tab"
            type="button"
          >
            标准答案
          </button>
        ) : null}
        {showSequence ? (
          <button
            aria-selected={activeTab === 'sequence'}
            className={`reference-tab ${activeTab === 'sequence' ? 'active' : ''}`}
            onClick={() => setActiveTab('sequence')}
            role="tab"
            type="button"
          >
            题目序列
          </button>
        ) : null}
      </div>

      <div className="reference-scroll">
        {activeTab === 'description' ? (
          <div className="reference-section">
            <div className="panel-heading">
              <span className="panel-title">{problem.title}</span>
              <span className="panel-caption">{problem.categoryName}</span>
            </div>
            <p className="reference-description">{problem.description}</p>
            <div className="reference-block">
              <strong>入参</strong>
              <MarkdownContent markdown={problem.paramsText} />
            </div>
            <div className="reference-block">
              <strong>返回值</strong>
              <MarkdownContent markdown={problem.returnText} />
            </div>
            {problem.executionMode === 'local' && problem.launcherPath ? (
              <div className="reference-block">
                <strong>本地联调</strong>
                <p>{problem.launcherPath}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        {activeTab === 'approach' && showApproach ? (
          <div className="reference-section">
            <div className="panel-heading">
              <span className="panel-title">解题思路</span>
              <span className="panel-caption">@approach</span>
            </div>
            <div className="reference-block">
              <MarkdownContent markdown={problem.approachText} />
            </div>
          </div>
        ) : null}

        {activeTab === 'solution' && showSolution ? (
          <div className="reference-section">
            <div className="panel-heading">
              <span className="panel-title">标准答案</span>
              <span className="panel-caption">{problem.sourcePath}</span>
            </div>
            <CodePreview
              className="reference-code-block"
              code={problem.solutionCode}
              language={problem.sourceType === 'vue' ? 'markup' : problem.sourceType}
            />
          </div>
        ) : null}

        {activeTab === 'sequence' && showSequence ? (
          <div className="reference-section">
            <div className="panel-heading">
              <span className="panel-title">题目序列</span>
              <span className="panel-caption">{items.length} 题</span>
            </div>

            <ul className="problem-nav">
              {items.map((item, index) => (
                <li key={item.id}>
                  <button
                    className={`problem-nav-item ${item.id === currentProblemId ? 'active' : ''}`}
                    onClick={() => onSelect(item.id)}
                    type="button"
                  >
                    <span className="problem-nav-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="problem-nav-copy">
                      <strong>{item.label}</strong>
                      <span>{item.status}</span>
                    </span>
                    {typeof item.score === 'number' ? <em>{item.score} 分</em> : null}
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
