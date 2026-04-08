/**
 * Component: ProblemDescriptionContent
 * Purpose: Render shared problem description, parameter, return value, and sample-case content.
 * Data flow: Read immutable problem metadata and render a consistent description block for learn and exam pages.
 */

import type { ProblemRecord, TestCase, JudgeCase } from '../types/content'
import { isNewTestCase, getTestCaseTarget, getTestCaseArgs } from '../types/content'
import { MarkdownContent } from './MarkdownContent'

/**
 * 根据题目类型格式化测试用例显示
 * 使用简化格式：target + args（支持新旧两种格式）
 */
function formatTestCaseDisplay(problemId: string, testCase: TestCase): string {
  const target = getTestCaseTarget(testCase) ?? ''
  const args = getTestCaseArgs(testCase)
  const method = problemId

  // Array 方法: target.myMethod(args)
  const arrayMethodMap: Record<string, string> = {
    filter: 'myFilter',
    map: 'myMap',
    forEach: 'myForEach',
    reduce: 'myReduce',
    flat: 'myFlat',
  }
  if (method in arrayMethodMap) {
    return `${target}.${arrayMethodMap[method]}(${args.join(', ')})`
  }

  // Function 方法: target.myMethod(args)
  const functionMethodMap: Record<string, string> = {
    apply: 'myApply',
    call: 'myCall',
    bind: 'myBind',
  }
  if (method in functionMethodMap) {
    return `${target}.${functionMethodMap[method]}(${args.join(', ')})`
  }

  // Object 方法
  if (method === 'new') {
    return `myNew(${target}${args.length ? ', ' + args.join(', ') : ''})`
  }
  if (method === 'instanceof') {
    return `myInstanceof(${target}, ${args[0] || 'Constructor'})`
  }
  if (method === 'deep_copy') {
    return `deepCopy(${target})`
  }
  if (method === 'extends') {
    return `myExtends(${target}, ${args[0] || 'Child'})`
  }

  // LinkedList 方法
  const linkedListMethods = ['reverseList', 'mergeTwoLists', 'hasCycle', 'findCycleEntry']
  if (linkedListMethods.includes(method)) {
    if (method === 'mergeTwoLists') {
      return `${method}(arrayToList(${target}), arrayToList(${args[0] || '[]'}))`
    }
    return `${method}(arrayToList(${target}))`
  }

  // Tree 方法
  const treeMethods = ['preorder', 'inorder', 'postorder', 'levelorder', 'maxDepth', 'isValidBST']
  if (treeMethods.includes(method)) {
    return `${method}(arrayToTree(${target}))`
  }

  // Promise 方法
  if (method === 'promise') {
    return `new MyPromise(executor).then(${args[0] || 'handler'})`
  }
  if (method === 'promise_all') {
    return `MyPromise.all(${target})`
  }
  if (method === 'promise_race') {
    return `MyPromise.race(${target})`
  }

  // Utility 工具函数: method(target, args)
  return `${method}(${target}${args.length ? ', ' + args.join(', ') : ''})`
}

/**
 * 格式化期望输出
 */
function formatExpected(expected: unknown): string {
  if (expected === undefined) return 'undefined'
  if (expected === null) return 'null'
  return JSON.stringify(expected)
}

/**
 * 检查是否是 JudgeCase（用于 basicCases/fullCases）
 */
function isJudgeCase(item: TestCase | JudgeCase): item is JudgeCase {
  return 'input' in item && typeof item.input === 'string'
}

export function ProblemDescriptionContent({ problem }: { problem: ProblemRecord }) {
  // 优先使用新格式 testCases.examples，回退到 basicCases
  const examples: (TestCase | JudgeCase)[] =
    problem.testCases?.examples?.length > 0 ? problem.testCases.examples : problem.basicCases

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-base font-bold text-[var(--color-ink)]">{problem.title}</h2>
        <span className="text-xs font-bold text-[var(--color-primary-ink)] bg-[var(--color-primary-soft)] px-2 py-0.5 rounded-full shrink-0">
          {problem.categoryName}
        </span>
      </div>

      <div className="text-sm text-[var(--color-ink-secondary)] leading-relaxed">
        <MarkdownContent markdown={problem.description} />
      </div>

      {(problem.paramsText || problem.returnText) && (
        <div className="flex flex-col gap-3 pt-1">
          {problem.paramsText ? (
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-muted)] block mb-1.5">
                入参
              </span>
              <div className="text-sm text-[var(--color-ink-secondary)]">
                <MarkdownContent markdown={problem.paramsText} />
              </div>
            </div>
          ) : null}
          {problem.returnText ? (
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-muted)] block mb-1.5">
                返回值
              </span>
              <div className="text-sm text-[var(--color-ink-secondary)]">
                <MarkdownContent markdown={problem.returnText} />
              </div>
            </div>
          ) : null}
        </div>
      )}

      {examples.length > 0 ? (
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-muted)] block mb-2">
            示例
          </span>
          <div className="flex flex-col gap-2">
            {examples.map((item, index) => {
              // 判断类型并获取显示内容
              let inputDisplay: string
              let expectedValue: unknown

              if (isJudgeCase(item)) {
                // JudgeCase 格式（来自 basicCases/fullCases）
                inputDisplay = item.input
                expectedValue = item.expected
              } else {
                // TestCase 格式（新/旧格式统一处理）
                inputDisplay = formatTestCaseDisplay(problem.id, item)
                expectedValue = item.expected
              }

              return (
                <div
                  className="rounded-md border border-[var(--color-border)] px-3 py-2 text-xs font-mono bg-[var(--color-surface-secondary)]"
                  key={index}
                >
                  <div className="text-[var(--color-ink-muted)] mb-0.5">输入</div>
                  <div className="mb-1 break-all">{inputDisplay}</div>
                  <div className="text-[var(--color-ink-muted)] mb-0.5">期望输出</div>
                  <div>{formatExpected(expectedValue)}</div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
