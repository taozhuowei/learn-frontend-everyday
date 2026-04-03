import type { JudgeCase } from '../types/content'
import type { ExecutionCaseResult, ExecutionRequest, ExecutionResponse } from '../types/exam'

function sanitizeSource(source: string) {
  return source
    .replace(/^\s*export\s+default\s+.*?;?\s*$/gm, '')
    .replace(/^\s*export\s+\{[\s\S]*?\};?\s*$/gm, '')
    .replace(/^\s*export\s+(function|class|const|let|var)\s+/gm, '$1 ')
    .trim()
}

function normalize(value: unknown, seen = new Set<unknown>()): unknown {
  if (typeof value === 'undefined') {
    return { __type: 'undefined' }
  }
  if (typeof value === 'number' && Number.isNaN(value)) {
    return { __type: 'nan' }
  }
  if (Array.isArray(value)) {
    if (seen.has(value)) return { __type: 'circular' }
    seen.add(value)
    return value.map((item) => normalize(item, seen))
  }
  if (value && typeof value === 'object') {
    if (seen.has(value)) return { __type: 'circular' }
    seen.add(value)
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        normalize(entry, seen),
      ]),
    )
  }
  return value
}

function deepEqual(left: unknown, right: unknown) {
  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right))
}

function stringifyLogEntry(value: unknown) {
  if (typeof value === 'string') {
    return value
  }
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

async function runSingleCase(
  evaluator: (input: string) => Promise<unknown>,
  testCase: JudgeCase,
): Promise<ExecutionCaseResult> {
  const start = performance.now()
  try {
    const actual = await Promise.race([
      evaluator(testCase.input),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('执行超时')), testCase.timeoutMs ?? 1500)
      }),
    ])
    return {
      caseId: testCase.id,
      description: testCase.description,
      passed: deepEqual(actual, testCase.expected),
      expected: normalize(testCase.expected),
      actual: normalize(actual),
      logs: [],
      durationMs: Math.round(performance.now() - start),
    }
  } catch (error) {
    return {
      caseId: testCase.id,
      description: testCase.description,
      passed: false,
      expected: normalize(testCase.expected),
      actual: { __type: 'error' },
      logs: [],
      error: error instanceof Error ? error.message : String(error),
      durationMs: Math.round(performance.now() - start),
    }
  }
}

function createEvaluator(source: string) {
  const buffer: string[] = []
  const shadowConsole = {
    log: (...args: unknown[]) => buffer.push(args.map((arg) => stringifyLogEntry(arg)).join(' ')),
    info: (...args: unknown[]) => buffer.push(args.map((arg) => stringifyLogEntry(arg)).join(' ')),
    warn: (...args: unknown[]) => buffer.push(args.map((arg) => stringifyLogEntry(arg)).join(' ')),
    error: (...args: unknown[]) => buffer.push(args.map((arg) => stringifyLogEntry(arg)).join(' ')),
  }

  const evaluatorFactory = new Function(
    'console',
    'setTimeout',
    'clearTimeout',
    'setInterval',
    'clearInterval',
    'fetch',
    'XMLHttpRequest',
    'WebSocket',
    `
      ${sanitizeSource(source)}
      return async function runInput(input) {
        return await eval(input)
      }
    `,
  ) as (
    console: typeof shadowConsole,
    setTimeout: typeof globalThis.setTimeout,
    clearTimeout: typeof globalThis.clearTimeout,
    setInterval: typeof globalThis.setInterval,
    clearInterval: typeof globalThis.clearInterval,
    fetch: undefined,
    XMLHttpRequest: undefined,
    WebSocket: undefined,
  ) => (input: string) => Promise<unknown>

  const execute = evaluatorFactory(
    console as unknown as typeof shadowConsole,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    undefined,
    undefined,
    undefined,
  )

  return { buffer, execute }
}

async function executeRequest(request: ExecutionRequest): Promise<ExecutionResponse> {
  const user = createEvaluator(request.source)
  const solution = request.solutionCode ? createEvaluator(request.solutionCode) : null
  const results: ExecutionCaseResult[] = []

  for (const testCase of request.cases) {
    const before = user.buffer.length
    let result: ExecutionCaseResult

    // 自定义用例：先用标准答案获取期望输出，再与用户代码输出比对
    if (solution && testCase.id.startsWith('custom-')) {
      const start = performance.now()
      try {
        const expected = await Promise.race([
          solution.execute(testCase.input),
          new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('执行超时')), testCase.timeoutMs ?? 1500)
          }),
        ])
        result = await runSingleCase(user.execute, { ...testCase, expected } as JudgeCase)
      } catch {
        result = {
          caseId: testCase.id,
          description: testCase.description,
          passed: false,
          expected: { __type: 'error' },
          actual: { __type: 'error' },
          logs: [],
          error: '请检查用例：标准答案运行此用例失败',
          durationMs: Math.round(performance.now() - start),
        }
      }
    } else {
      result = await runSingleCase(user.execute, testCase)
    }

    result.logs = user.buffer.slice(before)
    results.push(result)
  }

  return {
    summary: {
      passedCount: results.filter((r) => r.passed).length,
      totalCount: results.length,
    },
    results,
  }
}

self.onmessage = async (event: MessageEvent<{ id: number; payload: ExecutionRequest }>) => {
  try {
    const response = await executeRequest(event.data.payload)
    self.postMessage({ id: event.data.id, ok: true, response })
  } catch (error) {
    self.postMessage({
      id: event.data.id,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
