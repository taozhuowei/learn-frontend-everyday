import type { JudgeCase, ProblemRecord } from './content'

export interface ExamConfig {
  durationMinutes: number
  questionCount: number
  categoryIds: string[]
  passingScore: number
}

export interface SubmittedProblemResult {
  problemId: string
  passedCount: number
  totalCount: number
  ratio: number
  score: number
  failures: Array<{
    caseId: string
    description: string
    expected: unknown
    actual: unknown
    logs: string[]
    error?: string
  }>
  successfulCaseIds: string[]
  submittedAt: string
}

export interface ExamSession {
  problemIds: string[]
  answers: Record<string, string>
  currentIndex: number
  remainingSeconds: number
  submittedMap: Record<string, SubmittedProblemResult>
}

export interface ExamResult {
  perProblem: SubmittedProblemResult[]
  totalScore: number
  passingScore: number
  passed: boolean
}

export interface ExecutionCaseResult {
  caseId: string
  description: string
  passed: boolean
  expected: unknown
  actual: unknown
  logs: string[]
  error?: string
  durationMs: number
}

export interface ExecutionResponse {
  summary: {
    passedCount: number
    totalCount: number
  }
  results: ExecutionCaseResult[]
}

export interface ExecutionRequest {
  source: string
  cases: JudgeCase[]
  /** 标准答案代码，用于为自定义用例自动生成期望输出 */
  solutionCode?: string
}

export interface ProblemSummaryCard {
  problem: ProblemRecord
  score?: number
}
