/**
 * 题目相关的类型定义
 */

// ============================================
// 测试用例（新格式）
// ============================================

export interface TestCase {
  input: Record<string, unknown>
  expected: unknown
}

export interface ProblemTestCases {
  examples: TestCase[]
  hidden: TestCase[]
}

// ============================================
// 兼容性导出（旧格式）
// ============================================

/** @deprecated 使用 TestCase */
export interface JudgeCase {
  id: string
  type: 'basic' | 'edge' | 'exception' | 'large' | 'performance'
  description: string
  input: string
  expected: unknown
  timeoutMs?: number
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

export interface KnowledgeArticle {
  slug: string
  title: string
  category: string
  sourcePath: string
  markdown: string
  headings: KnowledgeHeading[]
  searchText: string
}
