/**
 * Page: LearnPage
 * Route: /learn/:problemId
 * Purpose: Render the learn workspace with problem details, editor, and judge panel.
 * Data flow: Resolve the current problem from route params, edit source locally, then run browser-safe cases through the code runner.
 */

import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Check, Hand, MousePointer2, Play } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { CasePanel } from '../components/CasePanel'
import { CodeBlock, type CodeBlockInteractionMode } from '../components/CodeBlock'
import type { CodeEditorHandle } from '../components/CodeWorkspace'
import { LoadingPanel } from '../components/LoadingPanel'
import { MarkdownContent } from '../components/MarkdownContent'
import { ProblemDescriptionContent } from '../components/ProblemDescriptionContent'
import { SplitPane } from '../components/SplitPane'
import { problems } from '../generated/problems'
import type { JudgeCase, ProblemRecord } from '../types/content'
import type { ExecutionResponse } from '../types/exam'
import { runCode } from '../utils/codeRunner'

const CodeWorkspace = lazy(() =>
  import('../components/CodeWorkspace').then((module) => ({ default: module.CodeWorkspace })),
)

const firstProblemId = problems[0]?.id ?? ''
const SOLUTION_INTERACTION_MODE_STORAGE_KEY = 'practice_solution_interaction_mode'
const DEFAULT_SOLUTION_INTERACTION_MODE: CodeBlockInteractionMode = 'pan'

function readStoredSolutionInteractionMode(): CodeBlockInteractionMode {
  if (typeof window === 'undefined') {
    return DEFAULT_SOLUTION_INTERACTION_MODE
  }

  const storedMode = window.localStorage.getItem(SOLUTION_INTERACTION_MODE_STORAGE_KEY)
  return storedMode === 'pan' || storedMode === 'select'
    ? storedMode
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

  return <LearnProblemView key={problem.id} problem={problem} />
}

function LearnProblemView({ problem }: { problem: ProblemRecord }) {
  const editorRef = useRef<CodeEditorHandle>(null)
  const [source, setSource] = useState(() => createInitialSource(problem))
  const sourceRef = useRef(source)
  const [sampleExecution, setSampleExecution] = useState<ExecutionResponse | null>(null)
  const [consoleExecution, setConsoleExecution] = useState<ExecutionResponse | null>(null)
  const [busyAction, setBusyAction] = useState<'run' | 'submit' | null>(null)
  const [customCaseInput, setCustomCaseInput] = useState('')
  const [activeTab, setActiveTab] = useState<DetailTab>('description')
  const [solutionInteractionMode, setSolutionInteractionMode] = useState<CodeBlockInteractionMode>(
    () => readStoredSolutionInteractionMode(),
  )

  useEffect(() => {
    window.localStorage.setItem(SOLUTION_INTERACTION_MODE_STORAGE_KEY, solutionInteractionMode)
  }, [solutionInteractionMode])

  function updateSource(nextSource: string) {
    sourceRef.current = nextSource
    setSource(nextSource)
  }

  function parseCustomCase(): JudgeCase | null {
    if (!customCaseInput.trim()) return null

    return {
      id: 'custom-run-case',
      type: 'basic',
      description: '自定义用例',
      input: customCaseInput,
      expected: undefined,
    }
  }

  async function executeCases(kind: 'run' | 'submit') {
    if (problem.executionMode !== 'browser') return

    const sourceCode = editorRef.current?.getValue() ?? sourceRef.current
    const baseCases = kind === 'run' ? problem.basicCases : problem.fullCases
    const customCase = kind === 'run' ? parseCustomCase() : null
    const cases = customCase ? [...baseCases, customCase] : baseCases
    setBusyAction(kind)

    try {
      const response = await runCode({
        source: sourceCode,
        cases,
        solutionCode: problem.solutionCode,
      })
      if (kind === 'run') {
        setSampleExecution(response)
      }
      setConsoleExecution(response)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const response: ExecutionResponse = {
        summary: { passedCount: 0, totalCount: cases.length },
        results: cases.map((singleCase) => ({
          caseId: singleCase.id,
          description: singleCase.description,
          passed: false,
          expected: singleCase.expected,
          actual: null,
          logs: [],
          error: message,
          durationMs: 0,
        })),
      }
      if (kind === 'run') {
        setSampleExecution(response)
      }
      setConsoleExecution(response)
    } finally {
      setBusyAction(null)
    }
  }

  const isAutoJudge = problem.executionMode === 'browser'
  const actionTitle =
    problem.executionMode === 'local'
      ? '本地环境题，请在本机 Node.js 环境下判题'
      : problem.executionMode === 'component'
        ? '组件题，请打开本地 Launcher 调试'
        : undefined

  return (
    <AppShell eyebrow="学习模式" title={problem.title} showPageHeader={false}>
      <div className="h-full p-2">
        <SplitPane
          className="h-full"
          defaultSize={400}
          direction="horizontal"
          first={
            <div className="h-full pr-1">
              <ProblemInfoPanel
                activeTab={activeTab}
                onSolutionInteractionModeChange={setSolutionInteractionMode}
                onTabChange={setActiveTab}
                problem={problem}
                solutionInteractionMode={solutionInteractionMode}
              />
            </div>
          }
          firstClassName="h-full"
          minFirstSize={260}
          minSecondSize={360}
          second={
            <div className="h-full pl-1">
              <SplitPane
                className="h-full"
                defaultSizeRatio={0.6}
                direction="vertical"
                first={
                  <div className="h-full pb-1">
                    <Suspense fallback={<LoadingPanel />}>
                      <CodeWorkspace
                        ref={editorRef}
                        description={problem.description}
                        language={problem.sourceType}
                        onChange={updateSource}
                        title={`#${String(problem.sequence).padStart(2, '0')} ${problem.title}`}
                        value={source}
                      />
                    </Suspense>
                  </div>
                }
                firstClassName="h-full"
                minFirstSize={160}
                minSecondSize={120}
                second={
                  <div className="h-full pt-1">
                    <CasePanel
                      actions={
                        <div className="flex gap-2">
                          <button
                            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            disabled={!isAutoJudge || busyAction !== null}
                            onClick={() => executeCases('run')}
                            title={actionTitle}
                            type="button"
                          >
                            <Play size={12} />
                            {busyAction === 'run' ? '运行中...' : '运行'}
                          </button>
                          <button
                            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            disabled={!isAutoJudge || busyAction !== null}
                            onClick={() => executeCases('submit')}
                            title={actionTitle}
                            type="button"
                          >
                            <Check size={12} />
                            {busyAction === 'submit' ? '判题中...' : '提交'}
                          </button>
                        </div>
                      }
                      cases={problem.basicCases}
                      consoleExecution={consoleExecution}
                      customCaseInput={isAutoJudge ? customCaseInput : undefined}
                      execution={sampleExecution}
                      onCustomInputChange={isAutoJudge ? setCustomCaseInput : undefined}
                      title="测试与判题"
                    />
                  </div>
                }
                secondClassName="h-full"
              />
            </div>
          }
          secondClassName="h-full"
        />
      </div>
    </AppShell>
  )
}
