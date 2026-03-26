import { Suspense, lazy, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { CasePanel } from '../components/CasePanel'
import { ProblemReferencePanel } from '../components/ProblemReferencePanel'
import { problems } from '../generated/problems'
import type { ExecutionResponse } from '../types/exam'
import { runCode } from '../utils/codeRunner'

const CodeWorkspace = lazy(() =>
  import('../components/CodeWorkspace').then((module) => ({ default: module.CodeWorkspace })),
)

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
  const [source, setSource] = useState(problem.template)
  const [sampleExecution, setSampleExecution] = useState<ExecutionResponse | null>(null)
  const [consoleExecution, setConsoleExecution] = useState<ExecutionResponse | null>(null)
  const [busyAction, setBusyAction] = useState<'run' | 'submit' | null>(null)
  const sourceRef = useRef(problem.template)

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
        <Link className="action-button ghost" to={`/library/${problem.id}`}>
          题库详情
        </Link>
      }
      eyebrow="学习"
      title={problem.title}
    >
      <div className="workspace-grid workspace-grid-learning">
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
            <section className="panel workspace-panel route-loading-panel">
              <span className="panel-title">Loading editor...</span>
              <p className="panel-description">Monaco is loaded only when coding starts.</p>
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
            <div className="panel-actions-row">
              <button
                className="action-button primary action-wide"
                disabled={problem.executionMode !== 'browser'}
                onClick={() => executeCases('run')}
                type="button"
              >
                {busyAction === 'run' ? '运行中...' : '运行'}
              </button>
              <button
                className="action-button ghost action-wide"
                disabled={problem.executionMode !== 'browser'}
                onClick={() => executeCases('submit')}
                type="button"
              >
                {busyAction === 'submit' ? '判题中...' : '提交'}
              </button>
            </div>
          }
          cases={problem.basicCases}
          consoleExecution={consoleExecution}
          execution={sampleExecution}
          title={problem.executionMode === 'browser' ? '调试与判题' : '本地环境说明'}
        />
      </div>
    </AppShell>
  )
}
