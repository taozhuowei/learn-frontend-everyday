import { describe, it, expect } from 'vitest'
import type { ProblemRecord } from '@/types/content'
import type { ExamConfig, ExamSession } from '@/types/exam'
import {
  pickExamProblems,
  createExamSession,
  computeProblemScore,
  buildExamResult,
  formatDuration,
  clampConfig,
} from '@/utils/exam'

function create_mock_problem(overrides: Partial<ProblemRecord> = {}): ProblemRecord {
  return {
    id: 'test-id',
    slug: 'test-slug',
    sequence: 1,
    title: 'Test Problem',
    categoryId: 'array',
    categoryName: '数组方法',
    sourceType: 'js',
    executionMode: 'browser',
    launcherPath: null,
    description: '',
    paramsText: '',
    returnText: '',
    approachText: '',
    template: 'function test() {}',
    solutionCode: '',
    testCases: { examples: [], hidden: [] },
    isComponent: false,
    ...overrides,
  }
}

describe('pickExamProblems', () => {
  const mock_problems: ProblemRecord[] = [
    create_mock_problem({ id: 'p1', categoryId: 'array', executionMode: 'browser' }),
    create_mock_problem({ id: 'p2', categoryId: 'array', executionMode: 'local' }),
    create_mock_problem({ id: 'p3', categoryId: 'promise', executionMode: 'browser' }),
    create_mock_problem({ id: 'p4', categoryId: 'function', executionMode: 'browser' }),
    create_mock_problem({ id: 'p5', categoryId: 'array', executionMode: 'browser' }),
  ]

  it('filters out executionMode=local problems', () => {
    const config: ExamConfig = {
      durationMinutes: 60,
      questionCount: 10,
      categoryIds: [],
      passingScore: 60,
    }
    const result = pickExamProblems(mock_problems, config)
    expect(result.some((p) => p.id === 'p2')).toBe(false)
    expect(result.length).toBeLessThanOrEqual(4)
  })

  it('returns all non-local problems when categoryIds is empty', () => {
    const config: ExamConfig = {
      durationMinutes: 60,
      questionCount: 10,
      categoryIds: [],
      passingScore: 60,
    }
    const result = pickExamProblems(mock_problems, config)
    expect(result.length).toBe(4)
    expect(result.every((p) => p.executionMode !== 'local')).toBe(true)
  })

  it('returns only problems from specified categories', () => {
    const config: ExamConfig = {
      durationMinutes: 60,
      questionCount: 10,
      categoryIds: ['array'],
      passingScore: 60,
    }
    const result = pickExamProblems(mock_problems, config)
    expect(result.every((p) => p.categoryId === 'array')).toBe(true)
    expect(result.every((p) => p.executionMode !== 'local')).toBe(true)
    expect(result.length).toBe(2)
  })

  it('returns at most config.questionCount problems', () => {
    const config: ExamConfig = {
      durationMinutes: 60,
      questionCount: 2,
      categoryIds: [],
      passingScore: 60,
    }
    const result = pickExamProblems(mock_problems, config)
    expect(result.length).toBe(2)
  })

  it('returns at least 1 problem when filtered list is empty', () => {
    const config: ExamConfig = {
      durationMinutes: 60,
      questionCount: 0,
      categoryIds: [],
      passingScore: 60,
    }
    const result = pickExamProblems(mock_problems, config)
    expect(result.length).toBe(1)
  })

  it('returns a subset of filtered problems in randomized order', () => {
    const config: ExamConfig = {
      durationMinutes: 60,
      questionCount: 3,
      categoryIds: [],
      passingScore: 60,
    }
    const all_ids = new Set<string>()
    for (let index = 0; index < 20; index += 1) {
      const result = pickExamProblems(mock_problems, config)
      result.forEach((p) => all_ids.add(p.id))
    }
    expect(all_ids.size).toBeGreaterThan(1)
  })
})

describe('createExamSession', () => {
  const mock_problems: ProblemRecord[] = [
    create_mock_problem({ id: 'p1', template: 'template1' }),
    create_mock_problem({ id: 'p2', template: 'template2' }),
    create_mock_problem({ id: 'p3', template: 'template3' }),
  ]

  const config: ExamConfig = {
    durationMinutes: 30,
    questionCount: 3,
    categoryIds: [],
    passingScore: 60,
  }

  it('returns session and deadline', () => {
    const { session, deadline } = createExamSession(['p1', 'p2'], mock_problems, config)
    expect(session).toBeDefined()
    expect(typeof deadline).toBe('number')
  })

  it('session.problemIds matches input', () => {
    const problem_ids = ['p1', 'p2']
    const { session } = createExamSession(problem_ids, mock_problems, config)
    expect(session.problemIds).toEqual(problem_ids)
  })

  it('session.answers has keys for each problemId with template values', () => {
    const { session } = createExamSession(['p1', 'p2'], mock_problems, config)
    expect(session.answers).toHaveProperty('p1', 'template1')
    expect(session.answers).toHaveProperty('p2', 'template2')
  })

  it('session.currentIndex is 0', () => {
    const { session } = createExamSession(['p1'], mock_problems, config)
    expect(session.currentIndex).toBe(0)
  })

  it('session.remainingSeconds equals config.durationMinutes * 60', () => {
    const { session } = createExamSession(['p1'], mock_problems, config)
    expect(session.remainingSeconds).toBe(30 * 60)
  })

  it('session.submittedMap is empty object', () => {
    const { session } = createExamSession(['p1'], mock_problems, config)
    expect(session.submittedMap).toEqual({})
  })

  it('deadline is approximately Date.now() + durationMinutes * 60 * 1000', () => {
    const before = Date.now()
    const { deadline } = createExamSession(['p1'], mock_problems, config)
    const after = Date.now()
    const expected = 30 * 60 * 1000
    expect(deadline).toBeGreaterThanOrEqual(before + expected - 100)
    expect(deadline).toBeLessThanOrEqual(after + expected + 100)
  })
})

describe('computeProblemScore', () => {
  it('ratio=1.0, questionCount=5 returns 20', () => {
    expect(computeProblemScore(1.0, 5)).toBe(20)
  })

  it('ratio=0.5, questionCount=4 returns 13 (Math.round(25*0.5))', () => {
    expect(computeProblemScore(0.5, 4)).toBe(13)
  })

  it('ratio=0, questionCount=6 returns 0', () => {
    expect(computeProblemScore(0, 6)).toBe(0)
  })

  it('questionCount=0 uses Math.max(0,1) so perProblemScore=100', () => {
    expect(computeProblemScore(1.0, 0)).toBe(100)
    expect(computeProblemScore(0.5, 0)).toBe(50)
  })
})

describe('buildExamResult', () => {
  const create_mock_session = (submitted_map = {}): ExamSession => ({
    problemIds: ['p1', 'p2', 'p3'],
    answers: { p1: '', p2: '', p3: '' },
    currentIndex: 0,
    remainingSeconds: 1000,
    submittedMap: submitted_map,
  })

  it('calculates correct totalScore with submitted results', () => {
    const session = create_mock_session({
      p1: {
        problemId: 'p1',
        passedCount: 5,
        totalCount: 5,
        ratio: 1.0,
        score: 0,
        failures: [],
        successfulCaseIds: [],
        submittedAt: new Date().toISOString(),
      },
      p2: {
        problemId: 'p2',
        passedCount: 3,
        totalCount: 6,
        ratio: 0.5,
        score: 0,
        failures: [],
        successfulCaseIds: [],
        submittedAt: new Date().toISOString(),
      },
    })
    const result = buildExamResult(session, 60, 3)
    expect(result.totalScore).toBe(50)
  })

  it('unsubmitted problems get score 0', () => {
    const session = create_mock_session({
      p1: {
        problemId: 'p1',
        passedCount: 5,
        totalCount: 5,
        ratio: 1.0,
        score: 0,
        failures: [],
        successfulCaseIds: [],
        submittedAt: new Date().toISOString(),
      },
    })
    const result = buildExamResult(session, 60, 3)
    const unsubmitted = result.perProblem.find((p) => p.problemId === 'p2')
    expect(unsubmitted?.score).toBe(0)
    expect(unsubmitted?.ratio).toBe(0)
  })

  it('passed = totalScore >= passingScore', () => {
    const session = create_mock_session({
      p1: {
        problemId: 'p1',
        passedCount: 5,
        totalCount: 5,
        ratio: 1.0,
        score: 0,
        failures: [],
        successfulCaseIds: [],
        submittedAt: new Date().toISOString(),
      },
    })
    const passing_result = buildExamResult(session, 30, 3)
    expect(passing_result.passed).toBe(true)

    const failing_result = buildExamResult(session, 40, 3)
    expect(failing_result.passed).toBe(false)
  })
})

describe('formatDuration', () => {
  it('0 seconds returns 00:00', () => {
    expect(formatDuration(0)).toBe('00:00')
  })

  it('90 seconds returns 01:30', () => {
    expect(formatDuration(90)).toBe('01:30')
  })

  it('3600 seconds returns 60:00', () => {
    expect(formatDuration(3600)).toBe('60:00')
  })

  it('5 seconds returns 00:05', () => {
    expect(formatDuration(5)).toBe('00:05')
  })
})

describe('clampConfig', () => {
  it('clamps durationMinutes to [5, 180]', () => {
    expect(clampConfig({ durationMinutes: 3, questionCount: 5, categoryIds: [], passingScore: 50 }, 5, 10).durationMinutes).toBe(5)
    expect(clampConfig({ durationMinutes: 200, questionCount: 5, categoryIds: [], passingScore: 50 }, 5, 10).durationMinutes).toBe(180)
    expect(clampConfig({ durationMinutes: 60, questionCount: 5, categoryIds: [], passingScore: 50 }, 5, 10).durationMinutes).toBe(60)
  })

  it('clamps questionCount to [1, problemsCount]', () => {
    expect(clampConfig({ durationMinutes: 60, questionCount: 0, categoryIds: [], passingScore: 50 }, 5, 10).questionCount).toBe(1)
    expect(clampConfig({ durationMinutes: 60, questionCount: 20, categoryIds: [], passingScore: 50 }, 5, 10).questionCount).toBe(10)
    expect(clampConfig({ durationMinutes: 60, questionCount: 5, categoryIds: [], passingScore: 50 }, 5, 10).questionCount).toBe(5)
  })

  it('clamps passingScore to [1, 100]', () => {
    expect(clampConfig({ durationMinutes: 60, questionCount: 5, categoryIds: [], passingScore: 0 }, 5, 10).passingScore).toBe(1)
    expect(clampConfig({ durationMinutes: 60, questionCount: 5, categoryIds: [], passingScore: 150 }, 5, 10).passingScore).toBe(100)
    expect(clampConfig({ durationMinutes: 60, questionCount: 5, categoryIds: [], passingScore: 75 }, 5, 10).passingScore).toBe(75)
  })
})
