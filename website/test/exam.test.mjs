/**
 * Module: exam.test
 * Purpose: Verify exam logic including problem picking, session creation, scoring, and config clamping.
 */

import test from 'node:test'
import assert from 'node:assert/strict'

// Inline exam utility functions from src/utils/exam.ts (transpiled to JS)

const DEFAULT_EXAM_CONFIG = {
  durationMinutes: 60,
  questionCount: 6,
  categoryIds: [],
  passingScore: 90,
}

function shuffle(values) {
  const clone = [...values]
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const temp = clone[index]
    clone[index] = clone[randomIndex]
    clone[randomIndex] = temp
  }
  return clone
}

function pickExamProblems(allProblems, config) {
  const filtered =
    config.categoryIds.length > 0
      ? allProblems.filter(
          (problem) =>
            problem.executionMode === 'browser' && config.categoryIds.includes(problem.categoryId),
        )
      : allProblems.filter((problem) => problem.executionMode === 'browser')

  return shuffle(filtered).slice(0, Math.max(1, Math.min(config.questionCount, filtered.length)))
}

function createExamSession(problemIds, problems, config) {
  const answers = Object.fromEntries(
    problemIds.map((problemId) => {
      const problem = problems.find((item) => item.id === problemId)
      return [problemId, problem?.template ?? '']
    }),
  )

  const session = {
    problemIds,
    answers,
    currentIndex: 0,
    remainingSeconds: config.durationMinutes * 60,
    submittedMap: {},
  }

  const deadline = Date.now() + config.durationMinutes * 60 * 1000

  return { session, deadline }
}

function clampConfig(config, categoriesCount, problemsCount) {
  return {
    durationMinutes: Math.max(5, Math.min(180, Math.round(config.durationMinutes))),
    questionCount: Math.max(1, Math.min(problemsCount, Math.round(config.questionCount))),
    categoryIds: config.categoryIds.slice(0, categoriesCount),
    passingScore: Math.max(1, Math.min(100, Math.round(config.passingScore))),
  }
}

function computeProblemScore(ratio, questionCount) {
  const perProblemScore = 100 / Math.max(questionCount, 1)
  return Math.round(perProblemScore * ratio)
}

function buildExamResult(session, passingScore, questionCount) {
  const perProblem = session.problemIds.map((problemId) => {
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

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// Mock problem data for testing
const mockProblems = [
  {
    id: 'array-map',
    categoryId: 'array',
    executionMode: 'browser',
    template: 'function map() {}',
  },
  {
    id: 'array-filter',
    categoryId: 'array',
    executionMode: 'browser',
    template: 'function filter() {}',
  },
  {
    id: 'promise-all',
    categoryId: 'promise',
    executionMode: 'browser',
    template: 'Promise.myAll = function() {}',
  },
  {
    id: 'react-component',
    categoryId: 'with_react',
    executionMode: 'local',
    template: 'export default function() {}',
  },
  {
    id: 'vue-component',
    categoryId: 'with_vue',
    executionMode: 'local',
    template: '<template></template>',
  },
  {
    id: 'function-bind',
    categoryId: 'function',
    executionMode: 'browser',
    template: 'Function.prototype.myBind = function() {}',
  },
]

test('DEFAULT_EXAM_CONFIG has expected default values', () => {
  assert.equal(DEFAULT_EXAM_CONFIG.durationMinutes, 60)
  assert.equal(DEFAULT_EXAM_CONFIG.questionCount, 6)
  assert.deepEqual(DEFAULT_EXAM_CONFIG.categoryIds, [])
  assert.equal(DEFAULT_EXAM_CONFIG.passingScore, 90)
})

test('pickExamProblems filters only browser executable problems', () => {
  const config = { ...DEFAULT_EXAM_CONFIG, questionCount: 10 }
  const picked = pickExamProblems(mockProblems, config)

  // Should only pick browser executable problems (4 of them)
  assert.equal(picked.length, 4)
  assert.ok(picked.every((p) => p.executionMode === 'browser'))
})

test('pickExamProblems respects questionCount limit', () => {
  const config = { ...DEFAULT_EXAM_CONFIG, questionCount: 2 }
  const picked = pickExamProblems(mockProblems, config)

  assert.equal(picked.length, 2)
})

test('pickExamProblems filters by category when categoryIds specified', () => {
  const config = {
    ...DEFAULT_EXAM_CONFIG,
    questionCount: 10,
    categoryIds: ['array'],
  }
  const picked = pickExamProblems(mockProblems, config)

  assert.ok(picked.every((p) => p.categoryId === 'array'))
  assert.equal(picked.length, 2)
})

test('pickExamProblems returns at least 1 problem even with high questionCount', () => {
  const config = {
    ...DEFAULT_EXAM_CONFIG,
    questionCount: 0, // Invalid: should be clamped to at least 1
  }
  const picked = pickExamProblems(mockProblems, config)

  assert.ok(picked.length >= 1)
})

test('createExamSession creates session with correct structure', () => {
  const problemIds = ['array-map', 'array-filter']
  const config = DEFAULT_EXAM_CONFIG
  const { session, deadline } = createExamSession(problemIds, mockProblems, config)

  assert.deepEqual(session.problemIds, problemIds)
  assert.equal(session.currentIndex, 0)
  assert.equal(session.remainingSeconds, config.durationMinutes * 60)
  assert.deepEqual(session.submittedMap, {})

  // Check answers are populated with templates
  assert.ok(session.answers['array-map'])
  assert.ok(session.answers['array-filter'])
})

test('createExamSession calculates deadline based on duration', () => {
  const problemIds = ['array-map']
  const config = { ...DEFAULT_EXAM_CONFIG, durationMinutes: 30 }
  const beforeCreate = Date.now()
  const { deadline } = createExamSession(problemIds, mockProblems, config)
  const afterCreate = Date.now()

  const expectedDeadlineMin = beforeCreate + 30 * 60 * 1000
  const expectedDeadlineMax = afterCreate + 30 * 60 * 1000

  assert.ok(deadline >= expectedDeadlineMin && deadline <= expectedDeadlineMax)
})

test('clampConfig enforces minimum values', () => {
  const config = {
    durationMinutes: -10,
    questionCount: -5,
    categoryIds: ['a', 'b', 'c'],
    passingScore: -20,
  }
  const clamped = clampConfig(config, 2, 10)

  assert.equal(clamped.durationMinutes, 5) // min 5
  assert.equal(clamped.questionCount, 1) // min 1
  assert.equal(clamped.passingScore, 1) // min 1
})

test('clampConfig enforces maximum values', () => {
  const config = {
    durationMinutes: 500,
    questionCount: 1000,
    categoryIds: ['a', 'b', 'c', 'd', 'e'],
    passingScore: 150,
  }
  const clamped = clampConfig(config, 2, 10)

  assert.equal(clamped.durationMinutes, 180) // max 180
  assert.equal(clamped.questionCount, 10) // max problemsCount
  assert.equal(clamped.passingScore, 100) // max 100
  assert.equal(clamped.categoryIds.length, 2) // max categoriesCount
})

test('clampConfig rounds values to integers', () => {
  const config = {
    durationMinutes: 45.7,
    questionCount: 5.2,
    categoryIds: [],
    passingScore: 75.9,
  }
  const clamped = clampConfig(config, 10, 20)

  assert.equal(clamped.durationMinutes, 46)
  assert.equal(clamped.questionCount, 5)
  assert.equal(clamped.passingScore, 76)
})

test('computeProblemScore calculates correct score based on ratio', () => {
  // 100 / 4 = 25 points per problem
  assert.equal(computeProblemScore(1, 4), 25)
  assert.equal(computeProblemScore(0.5, 4), 13) // Math.round(25 * 0.5) = 13
  assert.equal(computeProblemScore(0, 4), 0)
  assert.equal(computeProblemScore(1, 1), 100)
})

test('computeProblemScore handles edge cases', () => {
  assert.equal(computeProblemScore(1, 0), 100) // Avoid division by zero
  assert.equal(computeProblemScore(0.333, 3), 11) // Rounding
})

test('buildExamResult calculates total score correctly', () => {
  const session = {
    problemIds: ['p1', 'p2', 'p3'],
    answers: { p1: '', p2: '', p3: '' },
    currentIndex: 0,
    remainingSeconds: 3000,
    submittedMap: {
      p1: {
        problemId: 'p1',
        passedCount: 5,
        totalCount: 5,
        ratio: 1,
        failures: [],
        successfulCaseIds: ['c1'],
        submittedAt: '2024-01-01',
      },
      p2: {
        problemId: 'p2',
        passedCount: 3,
        totalCount: 5,
        ratio: 0.6,
        failures: [],
        successfulCaseIds: ['c1', 'c2', 'c3'],
        submittedAt: '2024-01-01',
      },
      // p3 not submitted
    },
  }

  const result = buildExamResult(session, 60, 3)

  // p1: 100/3 * 1 = 33, p2: 100/3 * 0.6 = 20, p3: 0
  assert.equal(result.perProblem[0].score, 33)
  assert.equal(result.perProblem[1].score, 20)
  assert.equal(result.perProblem[2].score, 0)
  assert.equal(result.totalScore, 53)
  assert.equal(result.passingScore, 60)
  assert.equal(result.passed, false)
})

test('buildExamResult marks passed when totalScore >= passingScore', () => {
  const session = {
    problemIds: ['p1'],
    answers: { p1: '' },
    currentIndex: 0,
    remainingSeconds: 3000,
    submittedMap: {
      p1: {
        problemId: 'p1',
        passedCount: 5,
        totalCount: 5,
        ratio: 1,
        failures: [],
        successfulCaseIds: ['c1'],
        submittedAt: '2024-01-01',
      },
    },
  }

  const result = buildExamResult(session, 90, 1)

  assert.equal(result.totalScore, 100)
  assert.equal(result.passed, true)
})

test('buildExamResult creates default result for unsubmitted problems', () => {
  const session = {
    problemIds: ['p1'],
    answers: { p1: 'some code' },
    currentIndex: 0,
    remainingSeconds: 3000,
    submittedMap: {},
  }

  const result = buildExamResult(session, 60, 1)

  assert.equal(result.perProblem[0].score, 0)
  assert.equal(result.perProblem[0].passedCount, 0)
  assert.equal(result.perProblem[0].totalCount, 0)
  assert.equal(result.perProblem[0].ratio, 0)
})

test('formatDuration formats seconds to MM:SS', () => {
  assert.equal(formatDuration(0), '00:00')
  assert.equal(formatDuration(59), '00:59')
  assert.equal(formatDuration(60), '01:00')
  assert.equal(formatDuration(125), '02:05')
  assert.equal(formatDuration(3599), '59:59')
  assert.equal(formatDuration(3600), '60:00')
})
