import { Suspense, lazy, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { CasePanel } from '../components/CasePanel'
import { ProblemReferencePanel } from '../components/ProblemReferencePanel'
import { problems } from '../generated/problems'
import type { ExecutionResponse } from '../types/exam'
import { runCode } from '../utils/codeRunner'
import '../styles/leetcode-theme.css'

const CodeWorkspace = lazy(() =>
  import('../components/CodeWorkspace').then((module) => ({ default: module.CodeWorkspace })),
)

function createInitialSource(problem: (typeof problems)[number]) {
  if (problem.sourceType === 'vue') {
    return [
      '<!-- 根据题目说明完成实现。 -->',
      `<!-- 当前题目：${problem.title} -->`,
      '<!-- 左侧可查看题目说明、参数、返回值与参考答案。 -->',
      '',
    ].join('\n')
  }

  return [
    '// 根据题目说明完成实现。',
    `// 当前题目：${problem.title}`,
    '// 左侧可查看题目说明、参数、返回值与参考答案。',
    '',
  ].join('\n')
}

export function LearnPage() {
  const { problemId } = useParams()
  const currentProblemId = problemId ?? ''
  const problem = problems.find((item) => item.id === currentProblemId)

  if (!problem) {
    return <Navigate replace to="/library" />
  }

  return <LearnProblemView key={problem.id} problem={problem} />
}

function LearnProblemView({ problem }: { problem: (typeof problems)[number] }) {
  const navigate = useNavigate()
  const initial_source = createInitialSource(problem)
  const [source, setSource] = useState(initial_source)
  const [sampleExecution, setSampleExecution] = useState<ExecutionResponse | null>(null)
  const [consoleExecution, setConsoleExecution] = useState<ExecutionResponse | null>(null)
  const [busyAction, setBusyAction] = useState<'run' | 'submit' | null>(null)
  const sourceRef = useRef(initial_source)

  const sidebarItems = problems.map((item) => ({
    id: item.id,
    label: item.title,
    status:
      item.executionMode === 'browser' ? item.categoryName : `${item.categoryName} · 本地环境题`,
  }))

  function updateSource(nextSource: string) {
    sourceRef.current = nextSource
    setSource(nextSource)
  }

  async function executeCases(kind: 'run' | 'submit') {
    if (problem.executionMode !== 'browser') {
      return
    }

    const sourceCode = window.__getPracticeEditorValue__?.() ?? sourceRef.current
    const cases = kind === 'run' ? problem.basicCases : problem.fullCases
    setBusyAction(kind)

    try {
      const response = await runCode({ source: sourceCode, cases })
      if (kind === 'run') {
        setSampleExecution(response)
      }
      setConsoleExecution(response)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const response: ExecutionResponse = {
        summary: {
          passedCount: 0,
          totalCount: cases.length,
        },
        results: cases.map((testCase) => ({
          caseId: testCase.id,
          description: testCase.description,
          passed: false,
          expected: testCase.expected,
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

  return (
    <AppShell
      actions={
        <Link className="lc-btn lc-btn-ghost" to={`/library/${problem.id}`}>
          题库详情
        </Link>
      }
      eyebrow="学习模式"
      title={problem.title}
    >
      <div className="lc-workspace">
        <ProblemReferencePanel
          currentProblemId={problem.id}
          items={sidebarItems}
          onSelect={(nextProblemId) => navigate(`/learn/${nextProblemId}`)}
          problem={problem}
          showApproach
          showSequence={false}
          showSolution
        />

        <Suspense
          fallback={
            <section className="lc-panel lc-workspace-panel lc-panel-loading">
              <div className="lc-loading-content">
                <div className="lc-loading-spinner" />
                <span className="lc-loading-text">加载编辑器...</span>
                <p className="lc-loading-subtext">Monaco Editor 正在初始化</p>
              </div>
            </section>
          }
        >
          <CodeWorkspace
            description={problem.description}
            language={problem.sourceType === 'vue' ? 'html' : problem.sourceType}
            onChange={updateSource}
            title={`题目 #${problem.sequence.toString().padStart(2, '0')}`}
            value={source}
          />
        </Suspense>

        <CasePanel
          actions={
            <div className="lc-actions-row">
              <button
                className="lc-btn lc-btn-primary lc-btn-run"
                disabled={problem.executionMode !== 'browser'}
                onClick={() => executeCases('run')}
                type="button"
              >
                <svg className="lc-icon" fill="none" height="16" viewBox="0 0 24 24" width="16">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
                {busyAction === 'run' ? '运行中...' : '运行'}
              </button>
              <button
                className="lc-btn lc-btn-submit"
                disabled={problem.executionMode !== 'browser'}
                onClick={() => executeCases('submit')}
                type="button"
              >
                <svg className="lc-icon" fill="none" height="16" viewBox="0 0 24 24" width="16">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
                </svg>
                {busyAction === 'submit' ? '判题中...' : '提交'}
              </button>
            </div>
          }
          cases={problem.basicCases}
          consoleExecution={consoleExecution}
          execution={sampleExecution}
          title={problem.executionMode === 'browser' ? '测试与判题' : '本地环境说明'}
        />
      </div>
    </AppShell>
  )
}
