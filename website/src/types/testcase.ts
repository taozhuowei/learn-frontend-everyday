/**
 * 测试用例类型 - 参考 LeetCode 简化设计
 */

export interface TestCase {
  /** 输入参数 */
  input: Record<string, unknown> & { thisArg?: string }
  /** 期望输出 */
  expected: unknown
}

/** 题目测试用例 */
export interface ProblemTestCases {
  /** 示例用例（学习模式可见，3个） */
  examples: TestCase[]
  /** 隐藏用例（判题时使用） */
  hidden: TestCase[]
}

/** 判题结果 */
export interface TestResult {
  passed: boolean
  input: Record<string, unknown>
  expected: unknown
  actual: unknown
  error?: string
  logs: string[]
}

/** 判题响应 */
export interface JudgementResponse {
  passed: boolean
  total: number
  passedCount: number
  /** 失败的用例结果（学习模式返回，考试模式不返回） */
  failures?: TestResult[]
}
