/**
 * 题目相关的类型定义
 */

// ============================================
// 测试用例格式（支持新旧两种格式）
// ============================================

/** 新格式测试用例（来自 judge） */
export interface NewTestCase {
  id: string
  hidden: boolean
  input: {
    target?: string
    args?: string[]
    steps?: unknown[]
    props?: Record<string, unknown>
  }
  expected: unknown
}

/** 旧格式测试用例（直接 target + args） */
export interface OldTestCase {
  /** 目标数据（字符串表示） */
  target: string
  /** 参数数组（字符串表示） */
  args: string[]
  /** 期望输出 */
  expected: unknown
  /** 验证原数组是否被修改（用于 map/filter 等纯函数测试） */
  verifyOriginal?: unknown
  /** 不适合自定义用例的题目标记 */
  noCustomCase?: boolean
}

/** 统一测试用例类型 */
export type TestCase = NewTestCase | OldTestCase

/** 检查是否是新格式测试用例 */
export function isNewTestCase(tc: TestCase): tc is NewTestCase {
  return 'input' in tc && typeof tc.input === 'object' && tc.input !== null
}

/** 获取测试用例的 target */
export function getTestCaseTarget(tc: TestCase): string | undefined {
  if (isNewTestCase(tc)) {
    return tc.input.target
  }
  return tc.target
}

/** 获取测试用例的 args */
export function getTestCaseArgs(tc: TestCase): string[] {
  if (isNewTestCase(tc)) {
    return tc.input.args ?? []
  }
  return tc.args
}

export interface ProblemTestCases {
  /** 示例用例（学习模式可见，3个） */
  examples: TestCase[]
  /** 隐藏用例（判题时使用） */
  hidden: TestCase[]
  /** 不适合自定义用例的题目标记 */
  noCustomCase?: boolean
}

/** @deprecated 使用 KnowledgeItem */
export interface KnowledgeArticle extends KnowledgeItem {}

// ============================================
// 兼容性导出（旧格式）
// ============================================

/** @deprecated 使用 TestCase */
export interface JudgeCase {
  id: string
  type: 'basic' | 'edge' | 'exception' | 'large' | 'performance'
  description: string
  input: string
  /** Structured display: the target object (e.g., array or function) */
  displayTarget?: string
  /** Structured display: the argument expressions */
  displayArgs?: string[]
  expected?: unknown
  timeoutMs?: number
}

/** @deprecated 旧格式兼容 */
export interface DisplayInfo {
  /** 目标对象（如数组、函数等） */
  target: string
  /** 调用的方法名 */
  method: string
  /** 传递给方法的参数 */
  args?: unknown[]
  /** 执行上下文（this 值） */
  context?: string | null
}

// ============================================
// 题目记录
// ============================================

export interface ProblemRecord {
  id: string
  slug: string
  sequence: number
  categoryId: string
  categoryName: string
  title: string
  sourceType: string
  executionMode: 'browser' | 'component' | 'local'
  launcherPath: string | null
  description: string
  paramsText: string
  returnText: string
  template: string
  solutionCode: string
  approachText: string

  // 新格式测试用例
  testCases: ProblemTestCases

  // 兼容性字段
  basicCases: JudgeCase[]
  fullCases: JudgeCase[]

  // 是否为组件题（无需判题，人工确认）
  isComponent: boolean

  sourcePath: string
  testPath: string
}

// ============================================
// 知识库类型
// ============================================

export interface KnowledgeHeading {
  depth: number
  text: string
  slug: string
}

export interface KnowledgeItem {
  slug: string
  title: string
  category: string
  sourcePath: string
  markdown: string
  headings: KnowledgeHeading[]
  searchText: string
}
