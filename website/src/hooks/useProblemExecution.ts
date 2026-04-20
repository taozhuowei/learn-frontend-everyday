import { useState, useCallback, useRef } from 'react'
import { runCode } from '../utils/codeRunner'
import type { ExecutionResponse } from '../types/exam'
import type { ProblemRecord } from '../types/content'
import type { CustomCase } from '../components/CasePanel'

export type ExecutionKind = 'run' | 'submit'

export interface ProblemExecutionOptions {
  problem: ProblemRecord
  sourceCode: string
  customCases?: CustomCase[]
}

/**
 * 💡 架构重构分析 (D4):
 * 原有代码在 LearnPage 和 ExamSessionPage 中存在高度重复的执行逻辑，
 * 且对 'submit' 模式的处理不一致导致了反馈缺失的 Bug。
 *
 * 本 Hook 统一了:
 * 1. 判题引擎 (runCode) 的调用流程。
 * 2. 状态更新 (sampleExecution, consoleExecution, busyAction)。
 * 3. 错误处理边界。
 */
export function useProblemExecution() {
  const [sampleExecution, setSampleExecution] = useState<ExecutionResponse | null>(null)
  const [consoleExecution, setConsoleExecution] = useState<ExecutionResponse | null>(null)
  const [busyAction, setBusyAction] = useState<ExecutionKind | null>(null)

  // 用于追踪最新代码，避免闭包捕获旧状态
  const sourceRef = useRef('')

  const resetExecution = useCallback(() => {
    setSampleExecution(null)
    setConsoleExecution(null)
    setBusyAction(null)
  }, [])

  const execute = useCallback(async (kind: ExecutionKind, options: ProblemExecutionOptions) => {
    const { problem, sourceCode, customCases = [] } = options
    sourceRef.current = sourceCode

    if (problem.executionMode !== 'browser') return null

    setBusyAction(kind)

    // 🏆 根因分析: 原有代码在 kind === 'submit' 时漏掉了 setSampleExecution 的更新
    // 导致 CasePanel (它监听 sampleExecution) 无法感知判定结果。

    // 1. 确定测试范围: 运行模式只跑示例，提交模式跑全量（示例+隐藏）
    const testFile = problem.testCases
      ? kind === 'run'
        ? { examples: problem.testCases.examples, hidden: [] }
        : problem.testCases
      : undefined

    // 2. 只有 'run' 模式才混入用户自定义的输入用例
    const customCasesParsed =
      kind === 'run'
        ? customCases
            .filter((c) => c.target.trim())
            .map((c, index) => ({
              id: c.id,
              hidden: false,
              input: {
                target: c.target,
                args: c.args,
              },
              expected: undefined,
              description: `自定义用例 ${index + 1}`,
            }))
        : []

    try {
      // 执行系统用例
      const judgeResponse = await runCode({
        source: sourceCode,
        cases: [],
        solutionCode: problem.solutionCode,
        problemId: problem.id,
        testFile: testFile as any,
      })

      // 如果有自定义用例，额外执行一次并合并
      let finalResponse = judgeResponse
      if (customCasesParsed.length > 0) {
        const customResponse = await runCode({
          source: sourceCode,
          cases: customCasesParsed as any,
          solutionCode: problem.solutionCode,
          problemId: undefined,
          testFile: undefined,
        })
        finalResponse = {
          summary: {
            passedCount: judgeResponse.summary.passedCount + customResponse.summary.passedCount,
            totalCount: judgeResponse.summary.totalCount + customResponse.summary.totalCount,
          },
          results: [...judgeResponse.results, ...customResponse.results],
        }
      }

      // ✅ 修复点: 无论是 run 还是 submit，都必须更新 sampleExecution 以触发 UI 反馈
      setSampleExecution(finalResponse)
      setConsoleExecution(finalResponse)

      return finalResponse
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const baseCases = kind === 'run' ? problem.basicCases : problem.fullCases
      const allCases = [...baseCases, ...customCasesParsed]

      const errResponse: ExecutionResponse = {
        summary: { passedCount: 0, totalCount: allCases.length },
        results: allCases.map((c) => ({
          caseId: c.id,
          description: c.description,
          passed: false,
          expected: c.expected,
          actual: null,
          logs: [],
          error: message,
          durationMs: 0,
        })),
      }

      setSampleExecution(errResponse)
      setConsoleExecution(errResponse)
      return errResponse
    } finally {
      setBusyAction(null)
    }
  }, [])

  return {
    sampleExecution,
    consoleExecution,
    busyAction,
    execute,
    resetExecution,
  }
}
