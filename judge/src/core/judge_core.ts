import type { ProblemContract, TestCase, TestFile, CaseResult, JudgeResult } from './types'
import { getContract } from './problem_registry'
import { extractExport, extractPrototype, extractClass } from '../sandbox/entry_extractor'
import { runInWorkerSandbox } from '../sandbox/sandbox_builder'
import { deepEqualValidator } from '../validators/deep_equal_validator'
import { behavioralValidator } from '../validators/behavioral_validator'

type Validator = (actual: unknown, expected: unknown) => { passed: boolean; reason?: string }

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

    // Extract user code
    let fnCode = '';
    try {
      if (contract.entry.type === 'prototype' && contract.entry.host) {
        fnCode = extractPrototype(userCode, contract.entry.host, contract.entry.name);
      } else if (contract.entry.type === 'class') {
        fnCode = extractClass(userCode);
      } else {
        fnCode = extractExport(userCode);
      }
    } catch (error) {
      return {
        problemId,
        passed: false,
        cases: [{ id: 'setup', passed: false, actual: null, expected: null, error: 'Failed to extract code: ' + error }],
        duration: 0
      }
    }

    // 2. Combine all test cases
    const all_cases = [...testFile.examples, ...testFile.hidden]

    // 3. Run each test case
    const case_results: CaseResult[] = []

    for (const testCase of all_cases) {
      const result = await this.runTestCase(contract, testCase, fnCode)
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
    fnCode: string
  ): Promise<CaseResult> {
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
      // Run the test inside isolated Web Worker sandbox
      const { actual, meta } = await runInWorkerSandbox(contract, testCase, fnCode)

      // Validate the result
      const validation = validator(actual, testCase.expected)

      return {
        id: testCase.id,
        passed: validation.passed,
        actual,
        expected: testCase.expected,
        error: validation.reason,
        meta
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

