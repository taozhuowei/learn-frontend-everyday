import type { ProblemContract, TestCase, TestFile, CaseResult, JudgeResult } from './types'
import { getContract } from './problem_registry'
import { methodCallRunner } from '../runners/method_call_runner'
import { functionCallRunner } from '../runners/function_call_runner'
import { behavioralRunner } from '../runners/behavioral_runner'
import { asyncRunner } from '../runners/async_runner'
import { deepEqualValidator } from '../validators/deep_equal_validator'
import { behavioralValidator } from '../validators/behavioral_validator'

type Runner = (contract: ProblemContract, testCase: TestCase, userCode: string) => Promise<unknown>
type Validator = (actual: unknown, expected: unknown) => { passed: boolean; reason?: string }

const runners: Record<string, Runner> = {
  'method-call': methodCallRunner,
  'function-call': functionCallRunner,
  'behavioral': behavioralRunner,
  'async': asyncRunner
}

const validators: Record<string, Validator> = {
  'deep-equal': deepEqualValidator,
  'behavioral': behavioralValidator as Validator
}

export class JudgeCore {
  async run(problemId: string, userCode: string, testFile: TestFile): Promise<JudgeResult> {
    const start_time = Date.now()

    // 1. Look up ProblemContract
    const contract = getContract(problemId)
    if (!contract) {
      throw new Error(`Problem "${problemId}" not found`)
    }

    // 2. Combine all test cases
    const all_cases = [...testFile.examples, ...testFile.hidden]

    // 3. Run each test case
    const case_results: CaseResult[] = []

    for (const testCase of all_cases) {
      const result = await this.runTestCase(contract, testCase, userCode)
      case_results.push(result)
    }

    // 4. Build JudgeResult
    const all_passed = case_results.every((r) => r.passed)
    const duration = Date.now() - start_time

    return {
      problemId,
      passed: all_passed,
      cases: case_results,
      duration
    }
  }

  private async runTestCase(
    contract: ProblemContract,
    testCase: TestCase,
    userCode: string
  ): Promise<CaseResult> {
    const runner = runners[contract.runner]
    if (!runner) {
      return {
        id: testCase.id,
        passed: false,
        actual: null,
        expected: testCase.expected,
        error: `Unknown runner: ${contract.runner}`
      }
    }

    const validator = validators[contract.validator]
    if (!validator) {
      return {
        id: testCase.id,
        passed: false,
        actual: null,
        expected: testCase.expected,
        error: `Unknown validator: ${contract.validator}`
      }
    }

    try {
      // Run the test
      const actual = await runner(contract, testCase, userCode)

      // Validate the result
      const validation = validator(actual, testCase.expected)

      return {
        id: testCase.id,
        passed: validation.passed,
        actual,
        expected: testCase.expected,
        error: validation.reason,
        meta: extractMeta(actual)
      }
    } catch (error) {
      return {
        id: testCase.id,
        passed: false,
        actual: null,
        expected: testCase.expected,
        error: (error as Error).message ?? String(error)
      }
    }
  }
}

function extractMeta(actual: unknown): CaseResult['meta'] {
  if (typeof actual === 'object' && actual !== null) {
    const meta: CaseResult['meta'] = {}
    const obj = actual as Record<string, unknown>

    if ('callCount' in obj && typeof obj.callCount === 'number') {
      meta.callCount = obj.callCount
    }
    if ('maxConcurrent' in obj && typeof obj.maxConcurrent === 'number') {
      meta.maxConcurrent = obj.maxConcurrent
    }

    return meta
  }
  return undefined
}
