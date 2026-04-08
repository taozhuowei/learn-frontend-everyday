import type { ProblemContract, TestCase } from '../core/types'
import { extractExport, extractClass } from '../sandbox/entry_extractor'
import { buildSandbox } from '../sandbox/sandbox_builder'

export async function asyncRunner(
  contract: ProblemContract,
  testCase: TestCase,
  userCode: string
): Promise<unknown> {
  if (contract.entry.type === 'class') {
    return runClassAsync(testCase, userCode)
  } else {
    return runExportAsync(testCase, userCode)
  }
}

async function runClassAsync(testCase: TestCase, userCode: string): Promise<unknown> {
  const MyPromise = extractClass(userCode)

  const sandbox_code = `
    const MyPromise = ctx.MyPromise;
    const Promise = ctx.MyPromise;
    return ${testCase.input.target};
  `

  const sandbox = buildSandbox({
    ctx: { MyPromise, Promise: MyPromise }
  })

  try {
    const promise = sandbox(sandbox_code) as Promise<unknown>

    // Chain .then() calls if provided
    let result: unknown = promise
    const then_callbacks = testCase.input.args ?? []

    for (const callback_str of then_callbacks) {
      const then_sandbox = buildSandbox({})
      const callback = then_sandbox(`return (${callback_str});`) as (v: unknown) => unknown
      result = await (result as Promise<unknown>).then(callback)
    }

    return result
  } catch (error) {
    const err = error as Error | string
    return { error: typeof err === 'string' ? err : (err.message ?? String(err)) }
  }
}

async function runExportAsync(testCase: TestCase, userCode: string): Promise<unknown> {
  const fn = extractExport(userCode) as (...args: unknown[]) => unknown
  // Use function name so test expressions like `promiseAll([...])` can reference it directly.
  // Also inject MyPromise as the native Promise so test expressions can call MyPromise.resolve() etc.
  const fn_name = (fn as { name?: string }).name || 'exportedFn'

  const sandbox = buildSandbox({
    MyPromise: Promise,
    [fn_name]: fn
  })

  const sandbox_code = `return (${testCase.input.target});`

  try {
    const result = await sandbox(sandbox_code)
    return result
  } catch (error) {
    const err = error as Error | string
    return { error: typeof err === 'string' ? err : ((err as Error).message ?? String(err)) }
  }
}
