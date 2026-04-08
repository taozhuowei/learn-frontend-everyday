import type { ProblemContract, TestCase, Step } from '../core/types'
import { extractExport } from '../sandbox/entry_extractor'
import { createMockFn, type MockFn } from '../utils/mock_fn'
import { VirtualClock } from '../sandbox/virtual_clock'
import { buildSandbox } from '../sandbox/sandbox_builder'

interface BehavioralResult {
  callCount: number
  calls: unknown[]
  maxConcurrent?: number
  error?: Error
}

export async function behavioralRunner(
  contract: ProblemContract,
  testCase: TestCase,
  userCode: string
): Promise<BehavioralResult> {
  const fn = extractExport(userCode) as (...args: unknown[]) => (...args: unknown[]) => void
  const mock_fn = createMockFn()
  const clock = new VirtualClock()

  let max_concurrent = 0
  let current_concurrent = 0

  // Wrap mock to track concurrent calls
  const tracking_mock = function (this: unknown, ...args: unknown[]): void {
    mock_fn.apply(this, args)
  }

  Object.defineProperty(tracking_mock, 'callCount', {
    get: () => mock_fn.callCount
  })

  clock.install()

  try {
    const delay = testCase.input.target ? parseInt(testCase.input.target, 10) : undefined
    const wrapped = fn(tracking_mock, delay)

    for (const step of testCase.input.steps ?? []) {
      await executeStep(step, wrapped, clock, mock_fn)
    }

    return {
      callCount: mock_fn.callCount,
      calls: mock_fn.calls,
      maxConcurrent: max_concurrent
    }
  } catch (error) {
    return {
      callCount: mock_fn.callCount,
      calls: mock_fn.calls,
      maxConcurrent: max_concurrent,
      error: error as Error
    }
  } finally {
    clock.uninstall()
  }
}

async function executeStep(
  step: Step,
  wrapped: (...args: unknown[]) => void,
  clock: VirtualClock,
  mockFn: MockFn
): Promise<void> {
  switch (step.type) {
    case 'call':
      wrapped(...(step.args ?? []))
      break
    case 'tick':
      clock.tick(step.ms)
      break
    case 'await':
      await new Promise((resolve) => setTimeout(resolve, 0))
      break
    case 'assert': {
      const sandbox = buildSandbox({ mockFn, clock })
      const actual = sandbox(`return (${step.check});`)
      if (JSON.stringify(actual) !== JSON.stringify(step.expected)) {
        throw new Error(`Assertion failed: expected ${JSON.stringify(step.expected)}, got ${JSON.stringify(actual)}`)
      }
      break
    }
  }
}
