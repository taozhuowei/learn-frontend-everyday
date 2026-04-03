/**
 * Page: LearnPage
 * Purpose: 学习模式页面，三栏工作区。
 * 左栏：题目列表 + 题目详情/思路/答案 Tabs。
 * 中栏：Monaco 代码编辑器。
 * 右栏：测试用例 + 控制台。
 * 组件题（executionMode === 'component'）禁用自动判题，提示使用本地 Launcher。
 */

import { Suspense, lazy, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Check, Play } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { CasePanel } from '../components/CasePanel'
import { ProblemReferencePanel } from '../components/ProblemReferencePanel'
import { ResizableWorkspace } from '../components/ResizableWorkspace'
import type { CodeEditorHandle } from '../components/CodeWorkspace'
import { problems } from '../generated/problems'
import type { JudgeCase } from '../types/content'
import type { ExecutionResponse } from '../types/exam'
import { runCode } from '../utils/codeRunner'

const CodeWorkspace = lazy(() =>
  import('../components/CodeWorkspace').then((m) => ({ default: m.CodeWorkspace })),
)

const firstProblemId = problems[0]?.id ?? ''

function createInitialSource(problem: (typeof problems)[number]) {
  if (problem.template) {
    return problem.template
  }
  if (problem.sourceType === 'vue') {
    return `<!-- 根据题目说明完成实现：${problem.title} -->\n`
  }
  return `// 根据题目说明完成实现：${problem.title}\n`
}

export function LearnPage() {
  const { problemId } = useParams()
  const problem = problems.find((p) => p.id === problemId)

  if (!problem) {
    return <Navigate replace to={`/learn/${firstProblemId}`} />
  }

  return <LearnProblemView key={problem.id} problem={problem} />
}

function LearnProblemView({ problem }: { problem: (typeof problems)[number] }) {
  const navigate = useNavigate()
  const editorRef = useRef<CodeEditorHandle>(null)
  const initial_source = createInitialSource(problem)
  const [source, setSource] = useState(initial_source)
  const [sampleExecution, setSampleExecution] = useState<ExecutionResponse | null>(null)
  const [consoleExecution, setConsoleExecution] = useState<ExecutionResponse | null>(null)
  const [busyAction, setBusyAction] = useState<'run' | 'submit' | null>(null)
  const [customCaseInput, setCustomCaseInput] = useState('')
  const [customCaseExpected, setCustomCaseExpected] = useState('')
  const sourceRef = useRef(initial_source)

  function updateSource(next: string) {
    sourceRef.current = next
    setSource(next)
  }

  function parseCustomCase(): JudgeCase | null {
    if (!customCaseInput.trim() || !customCaseExpected.trim()) return null
    try {
      return {
        id: 'custom-run-case',
        type: 'basic',
        description: '自定义用例',
        input: customCaseInput,
        expected: JSON.parse(customCaseExpected),
      }
    } catch {
      return null
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
      const response = await runCode({ source: sourceCode, cases })
      if (kind === 'run') setSampleExecution(response)
      setConsoleExecution(response)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const response: ExecutionResponse = {
        summary: { passedCount: 0, totalCount: cases.length },
        results: cases.map((c) => ({
          caseId: c.id,
          description: c.description,
          passed: false,
          expected: c.expected,
          actual: null,
          logs: [],
          error: message,
          durationMs: 0,
        })),
      }
      if (kind === 'run') setSampleExecution(response)
      setConsoleExecution(response)
    } finally {
      setBusyAction(null)
    }
  }

  const isLocal = problem.executionMode === 'local'
  const isComponent = problem.executionMode === 'component'
  const isAutoJudge = problem.executionMode === 'browser'

  const actionButtonDisabled = !isAutoJudge
  const actionTitle = isLocal
    ? '本地环境题，请在本机 Node.js 环境下判题'
    : isComponent
      ? '组件题，请打开本地 Launcher 调试'
      : undefined

  return (
    <AppShell eyebrow="学习模式" title={problem.title}>
      <ResizableWorkspace
        left={
          <ProblemReferencePanel
            allProblems={problems}
            currentProblemId={problem.id}
            items={[]}
            mode="learn"
            onSelect={(nextId) => navigate(`/learn/${nextId}`)}
            problem={problem}
          />
        }
        center={
          <Suspense
            fallback={
              <section className="flex-1 flex items-center justify-center bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)]">
                <p className="text-sm text-[var(--color-ink-muted)]">加载编辑器...</p>
              </section>
            }
          >
            <CodeWorkspace
              ref={editorRef}
              description={problem.description}
              language={problem.sourceType}
              onChange={updateSource}
              title={`题目 #${String(problem.sequence).padStart(2, '0')}`}
              value={source}
            />
          </Suspense>
        }
        right={
          <CasePanel
            actions={
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  disabled={actionButtonDisabled || busyAction !== null}
                  onClick={() => executeCases('run')}
                  title={actionTitle}
                  type="button"
                >
                  <Play size={12} />
                  {busyAction === 'run' ? '运行中...' : '运行'}
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  disabled={actionButtonDisabled || busyAction !== null}
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
            customCaseExpected={isAutoJudge ? customCaseExpected : undefined}
            execution={sampleExecution}
            onCustomInputChange={isAutoJudge ? setCustomCaseInput : undefined}
            onCustomExpectedChange={isAutoJudge ? setCustomCaseExpected : undefined}
            title="测试与判题"
          />
        }
      />
    </AppShell>
  )
}
