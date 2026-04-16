/**
 * Page: ComponentLearnPage
 * Purpose: 组件题学习页面（React/Vue）
 * 三栏布局：题目说明 | 代码编辑器 | 实时预览
 * 无需判题，人工确认完成
 */

import { Suspense, lazy, useRef, useState } from 'react'
import { Check, Code, Eye, FileText } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { LoadingPanel } from '../components/LoadingPanel'
import { MarkdownContent } from '../components/MarkdownContent'
import { SplitPane } from '../components/SplitPane'
import type { CodeEditorHandle } from '../components/CodeWorkspace'
import type { ProblemRecord } from '../types/content'
import { useAppState } from '../context/AppStateContext'

const CodeWorkspace = lazy(() =>
  import('../components/CodeWorkspace').then((module) => ({ default: module.CodeWorkspace })),
)

type LeftTab = 'description' | 'approach'

interface ComponentLearnPageProps {
  problem: ProblemRecord
}

function createInitialSource(problem: ProblemRecord) {
  if (problem.template) return problem.template
  if (problem.sourceType === 'vue') return `<!-- 完成组件实现：${problem.title} -->\n`
  return `// 完成组件实现：${problem.title}\n`
}

export function ComponentLearnPage({ problem }: ComponentLearnPageProps) {
  const { state: { isMobile } } = useAppState()
  const editorRef = useRef<CodeEditorHandle>(null)
  const [source, setSource] = useState(() => createInitialSource(problem))
  const [activeTab, setActiveTab] = useState<LeftTab>('description')
  const [mobileActiveTab, setMobileActiveTab] = useState<'info' | 'code' | 'preview'>('info')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  // 预览 URL（使用 launcher）
  const previewUrl = problem.launcherPath ? `/${problem.launcherPath}/index.html` : null

  const handleSubmit = () => {
    setIsSubmitting(true)
    // 模拟保存代码
    setTimeout(() => {
      setIsSubmitting(false)
      setShowConfirm(true)
    }, 500)
  }

  const handleConfirmComplete = () => {
    setIsCompleted(true)
    setShowConfirm(false)
    // 这里可以添加保存完成状态到 localStorage 或服务器
  }

  const renderInfoPanel = () => (
    <aside className="flex flex-col h-full bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
      <div className="flex shrink-0 border-b border-[var(--color-border)]">
        <button
          className={`cf-tab ${activeTab === 'description' ? 'active' : ''}`}
          onClick={() => setActiveTab('description')}
          type="button"
        >
          <FileText size={14} className="mr-1.5" />
          需求
        </button>
        <button
          className={`cf-tab ${activeTab === 'approach' ? 'active' : ''}`}
          onClick={() => setActiveTab('approach')}
          type="button"
        >
          <Code size={14} className="mr-1.5" />
          思路
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'description' ? (
          <div>
            <h3 className="text-sm font-bold text-[var(--color-ink)] mb-3">组件需求</h3>
            <div className="text-sm text-[var(--color-ink-secondary)] leading-relaxed">
              <MarkdownContent markdown={problem.description} />
            </div>

            {problem.paramsText && (
              <>
                <h4 className="text-xs font-bold text-[var(--color-ink-secondary)] mt-4 mb-2 uppercase tracking-wide">
                  Props
                </h4>
                <div className="text-sm text-[var(--color-ink-secondary)]">
                  <MarkdownContent markdown={problem.paramsText} />
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-sm font-bold text-[var(--color-ink)] mb-3">实现思路</h3>
            <div className="text-sm text-[var(--color-ink-secondary)] leading-relaxed">
              <MarkdownContent markdown={problem.approachText || '暂无思路说明'} />
            </div>
          </div>
        )}
      </div>

      {/* 提交按钮 */}
      <div className="px-4 py-3 border-t border-[var(--color-border)] shrink-0">
        <button
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
            isCompleted
              ? 'bg-[var(--color-success)] text-white'
              : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)]'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={isSubmitting || isCompleted}
          onClick={handleSubmit}
          type="button"
        >
          <Check size={14} />
          {isCompleted ? '已完成' : isSubmitting ? '保存中...' : '提交'}
        </button>

        {isCompleted && (
          <p className="mt-2 text-xs text-center text-[var(--color-success)]">
            ✓ 你已确认完成此组件
          </p>
        )}
      </div>
    </aside>
  )

  const renderCodeWorkspace = () => (
    <Suspense fallback={<LoadingPanel />}>
      <CodeWorkspace
        ref={editorRef}
        description={problem.description}
        language={problem.sourceType}
        onChange={setSource}
        title={`${problem.title}`}
        value={source}
      />
    </Suspense>
  )

  const renderPreviewPanel = () => (
    <aside className="flex flex-col h-full bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
      <div className="flex items-center justify-between px-4 h-11 border-b border-[var(--color-border)] shrink-0">
        <span className="text-sm font-bold text-[var(--color-ink)] flex items-center gap-2">
          <Eye size={14} />
          实时预览
        </span>
        {previewUrl && (
          <button
            className="text-xs text-[var(--color-primary)] hover:underline"
            onClick={() => window.open(previewUrl, '_blank')}
            type="button"
          >
            新窗口打开
          </button>
        )}
      </div>

      <div className="flex-1 bg-[var(--color-surface-secondary)] relative">
        {previewUrl ? (
          <iframe
            className="w-full h-full border-0"
            src={previewUrl}
            title="Component Preview"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--color-ink-muted)] text-sm">
            预览加载失败
          </div>
        )}
      </div>
    </aside>
  )

  if (isMobile) {
    return (
      <AppShell eyebrow="组件实践" title={problem.title} showPageHeader={false} backTo="/learn" backLabel="列表">
        <div className="h-full flex flex-col bg-[var(--color-canvas)]">
          <div className="flex-1 min-h-0 overflow-hidden p-2">
            {mobileActiveTab === 'info' && renderInfoPanel()}
            {mobileActiveTab === 'code' && renderCodeWorkspace()}
            {mobileActiveTab === 'preview' && renderPreviewPanel()}
          </div>
          
          <div className="h-14 shrink-0 bg-white border-t border-[var(--color-border)] flex items-stretch">
            {[
              { id: 'info' as const, label: '需求', icon: FileText },
              { id: 'code' as const, label: '代码', icon: Code },
              { id: 'preview' as const, label: '预览', icon: Eye },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = mobileActiveTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setMobileActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                    isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-ink-tertiary)]'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-[10px] font-bold">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
        {/* 确认完成弹窗 */}
        {showConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--color-border)]">
                <h3 className="text-lg font-bold text-[var(--color-ink)]">确认完成</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-[var(--color-ink-secondary)] mb-4">
                  请确认你的组件已实现所有需求：
                </p>
                <div className="bg-[var(--color-surface-secondary)] rounded-md p-3 text-sm text-[var(--color-ink)] mb-4">
                  <p className="font-medium mb-1">{problem.title}</p>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-[var(--color-border)] flex gap-3 justify-end">
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-secondary)] transition-colors"
                  onClick={() => setShowConfirm(false)}
                  type="button"
                >
                  继续完善
                </button>
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium bg-[var(--color-success)] text-white hover:bg-[var(--color-success-strong)] transition-colors"
                  onClick={handleConfirmComplete}
                  type="button"
                >
                  确认完成
                </button>
              </div>
            </div>
          </div>
        )}
      </AppShell>
    )
  }

  return (
    <AppShell eyebrow="组件实践" title={problem.title} showPageHeader={false}>
      <div className="h-full p-2">
        <SplitPane
          className="h-full"
          defaultSize={280}
          direction="horizontal"
          first={
            <div className="h-full pr-1">
              {renderInfoPanel()}
            </div>
          }
          firstClassName="h-full"
          minFirstSize={240}
          minSecondSize={400}
          second={
            <div className="h-full pl-1">
              <SplitPane
                className="h-full"
                defaultSizeRatio={0.5}
                direction="horizontal"
                first={
                  <div className="h-full pr-1">
                    {renderCodeWorkspace()}
                  </div>
                }
                firstClassName="h-full"
                minFirstSize={300}
                minSecondSize={300}
                second={
                  <div className="h-full pl-1">
                    {renderPreviewPanel()}
                  </div>
                }
                secondClassName="h-full"
              />
            </div>
          }
          secondClassName="h-full"
        />
      </div>

      {/* 确认完成弹窗 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)]">
              <h3 className="text-lg font-bold text-[var(--color-ink)]">确认完成</h3>
            </div>

            <div className="px-6 py-4">
              <p className="text-sm text-[var(--color-ink-secondary)] mb-4">
                请确认你的组件已实现所有需求：
              </p>

              <div className="bg-[var(--color-surface-secondary)] rounded-md p-3 text-sm text-[var(--color-ink)] mb-4">
                <p className="font-medium mb-1">{problem.title}</p>
                <p className="text-xs text-[var(--color-ink-tertiary)] line-clamp-2">
                  {problem.description.slice(0, 100)}...
                </p>
              </div>

              <div className="text-xs text-[var(--color-ink-muted)]">
                <p>提示：目前为人工确认，后续将支持自动化测试验证。</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[var(--color-border)] flex gap-3 justify-end">
              <button
                className="px-4 py-2 rounded-md text-sm font-medium text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-secondary)] transition-colors"
                onClick={() => setShowConfirm(false)}
                type="button"
              >
                继续完善
              </button>
              <button
                className="px-4 py-2 rounded-md text-sm font-medium bg-[var(--color-success)] text-white hover:bg-[var(--color-success-strong)] transition-colors"
                onClick={handleConfirmComplete}
                type="button"
              >
                确认完成
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
