import type { ProblemRecord } from '../types/content'
import type { ExamConfig, ExamResult, ExamSession, SubmittedProblemResult } from '../types/exam'

export const DEFAULT_EXAM_CONFIG: ExamConfig = {
  durationMinutes: 60,
  questionCount: 6,
  categoryIds: [],
  passingScore: 90,
}

function shuffle<T>(values: T[]) {
  const clone = [...values]
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const temp = clone[index]
    clone[index] = clone[randomIndex]
    clone[randomIndex] = temp
  }
  return clone
}

export function pickExamProblems(allProblems: ProblemRecord[], config: ExamConfig) {
  const filtered =
    config.categoryIds.length > 0
      ? allProblems.filter(
          (problem) =>
            problem.executionMode === 'browser' && config.categoryIds.includes(problem.categoryId),
        )
      : allProblems.filter((problem) => problem.executionMode === 'browser')

  return shuffle(filtered).slice(0, Math.max(1, Math.min(config.questionCount, filtered.length)))
}

export function createExamSession(
  problemIds: string[],
  problems: ProblemRecord[],
  config: ExamConfig,
) {
  const answers = Object.fromEntries(
    problemIds.map((problemId) => {
      const problem = problems.find((item) => item.id === problemId)
      return [problemId, problem?.template ?? '']
    }),
  ) as Record<string, string>

  const session: ExamSession = {
    problemIds,
    answers,
    currentIndex: 0,
    remainingSeconds: config.durationMinutes * 60,
    submittedMap: {},
  }

  const deadline = Date.now() + config.durationMinutes * 60 * 1000

  return { session, deadline }
}

export function clampConfig(
  config: ExamConfig,
  categoriesCount: number,
  problemsCount: number,
): ExamConfig {
  return {
    durationMinutes: Math.max(5, Math.min(180, Math.round(config.durationMinutes))),
    questionCount: Math.max(1, Math.min(problemsCount, Math.round(config.questionCount))),
    categoryIds: config.categoryIds.slice(0, categoriesCount),
    passingScore: Math.max(1, Math.min(100, Math.round(config.passingScore))),
  }
}

export function computeProblemScore(ratio: number, questionCount: number) {
  const perProblemScore = 100 / Math.max(questionCount, 1)
  return Math.round(perProblemScore * ratio)
}

export function buildExamResult(
  session: ExamSession,
  passingScore: number,
  questionCount: number,
): ExamResult {
  const perProblem: SubmittedProblemResult[] = session.problemIds.map((problemId) => {
    const existing = session.submittedMap[problemId]
    if (existing) {
      return {
        ...existing,
        score: computeProblemScore(existing.ratio, questionCount),
      }
    }

    return {
      problemId,
      passedCount: 0,
      totalCount: 0,
      ratio: 0,
      score: 0,
      failures: [],
      successfulCaseIds: [],
      submittedAt: new Date().toISOString(),
    }
  })

  const totalScore = perProblem.reduce((sum, item) => sum + item.score, 0)

  return {
    perProblem,
    totalScore,
    passingScore,
    passed: totalScore >= passingScore,
  }
}

export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
