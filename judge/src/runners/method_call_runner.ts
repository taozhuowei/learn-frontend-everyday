import type { ProblemContract, TestCase } from '../core/types'
import { extractPrototype } from '../sandbox/entry_extractor'
import { buildSandbox, disableNativeMethod } from '../sandbox/sandbox_builder'

export async function methodCallRunner(
  contract: ProblemContract,
  testCase: TestCase,
  userCode: string
): Promise<unknown> {
  const restore_funcs: Array<() => void> = []

  try {
    // 1. Disable native methods if specified
    if (contract.context?.disableNative) {
      for (const path of contract.context.disableNative) {
        restore_funcs.push(disableNativeMethod(path))
      }
    }

    // 2. Get target object via eval
    const sandbox = buildSandbox({
      Array,
      Function,
      Object,
      String,
      Number,
      Boolean,
      Date,
      Math,
      JSON,
      console
    })

    const target = sandbox(`return (${testCase.input.target});`) as Record<string, unknown>

    // 3. Extract user implementation
    const user_impl = extractPrototype(
      userCode,
      contract.entry.host!,
      contract.entry.name
    )

    // 4. Inject user implementation
    target[contract.entry.name] = user_impl.bind(target)

    // 5. Evaluate args
    const args = (testCase.input.args ?? []).map((arg) => {
      return sandbox(`return (${arg});`)
    })

    // 6. Call the method
    const result = target[contract.entry.name](...args)

    return result
  } finally {
    // 7. Restore all disabled native methods
    for (const restore of restore_funcs) {
      restore()
    }
  }
}
