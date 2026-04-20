import { describe, it, expect } from 'vitest'
import { problems } from '../../src/generated/problems'
import { JudgeCore } from '../../../judge/src/core/judge_core'

/**
 * 🏆 全量题目自动化验证工具 (G4)
 * 位置: website/test/problem-verifier/
 * 职责: 读取所有题目的标准答案，并运行对应的全量测试用例。
 * 目标: 确保重构后的判题环境对标 LeetCode，且标准答案 100% 通过。
 */
describe('Standard Solution Full Sweep', () => {
  const judge = new JudgeCore()

  // 过滤出所有浏览器判题类的题目
  const browserProblems = problems.filter((p) => p.executionMode === 'browser')

  browserProblems.forEach((problem) => {
    it(`[${problem.categoryId}] ${problem.id}: 验证标准答案`, async () => {
      // 捕获潜在的异常，输出更友好的调试信息
      try {
        const result = await judge.run(problem.id, problem.solutionCode, problem.testCases as any)

        if (!result.passed) {
          const firstFailure = result.cases.find((c) => !c.passed)
          const errorMsg = firstFailure?.error
            ? `\n   - 错误信息: ${firstFailure.error}`
            : `\n   - 预期输出: ${JSON.stringify(firstFailure?.expected)}\n   - 实际输出: ${JSON.stringify(firstFailure?.actual)}`

          throw new Error(
            `题目 "${problem.id}" 的标准答案未通过用例 "${firstFailure?.id}"${errorMsg}`,
          )
        }

        expect(result.passed).toBe(true)
      } catch (err: any) {
        throw new Error(`题目 "${problem.id}" 执行时抛出致命错误: ${err.message}`)
      }
    }, 15000) // 设置 15s 超时，部分复杂题目可能较慢
  })

  // 报告非浏览器题目的覆盖率状态
  it('覆盖率摘要报告', () => {
    const total = problems.length
    const browserCount = browserProblems.length
    const nonBrowser = problems.filter((p) => p.executionMode !== 'browser')

    console.log(`\n========================================`)
    console.log(`覆盖率报告:`)
    console.log(`- 总题目数: ${total}`)
    console.log(
      `- 自动化验证覆盖 (Browser): ${browserCount} (${((browserCount / total) * 100).toFixed(1)}%)`,
    )
    console.log(
      `- 手动/本地验证 (Local/Component): ${nonBrowser.length} (${((nonBrowser.length / total) * 100).toFixed(1)}%)`,
    )
    console.log(`========================================\n`)

    expect(browserCount).toBeGreaterThan(0)
  })
})
