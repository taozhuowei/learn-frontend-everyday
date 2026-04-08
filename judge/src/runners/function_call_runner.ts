import type { ProblemContract, TestCase } from '../core/types'
import { extractExport } from '../sandbox/entry_extractor'
import { buildSandbox } from '../sandbox/sandbox_builder'
import { arrayToList, listToArray, arrayToTree, treeToArray } from '../sandbox/helpers'

export async function functionCallRunner(
  contract: ProblemContract,
  testCase: TestCase,
  userCode: string
): Promise<unknown> {
  // 1. Extract user function
  const fn = extractExport(userCode) as (...args: unknown[]) => unknown

  // 2. Evaluate target in sandbox
  const sandbox = buildSandbox({
    Array,
    Object,
    JSON,
    console
  })

  const raw = sandbox(`return (${testCase.input.target});`)

  // 3. Convert input if helpers specified
  let input = raw
  const helpers = contract.context?.helpers ?? []

  if (helpers.includes('arrayToList')) {
    input = arrayToList(raw as number[])
  } else if (helpers.includes('arrayToTree')) {
    input = arrayToTree(raw as (number | null)[])
  }

  // 4. Evaluate extra args, convert to data structures if needed
  const extra_args = (testCase.input.args ?? []).map((arg) => {
    const val = sandbox(`return (${arg});`)
    if (helpers.includes('arrayToList')) {
      return arrayToList(val as number[])
    }
    if (helpers.includes('arrayToTree')) {
      return arrayToTree(val as (number | null)[])
    }
    return val
  })

  // 5. Call the function
  const result = fn(input, ...extra_args)

  // 6. Convert result if helpers specified
  if (helpers.includes('listToArray')) {
    return listToArray(result as ListNode | null)
  } else if (helpers.includes('treeToArray')) {
    return treeToArray(result as TreeNode | null)
  }

  return result
}

// Import types for type reference
import type { ListNode, TreeNode } from '../sandbox/helpers'
