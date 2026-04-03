export interface JudgeCase {
  id: string
  type: 'basic' | 'edge' | 'exception' | 'large'
  description: string
  input: string
  expected: unknown
  timeoutMs?: number
}

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
  basicCases: JudgeCase[]
  fullCases: JudgeCase[]
  sourcePath: string
  testPath: string
}

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

export type JudgeCaseMap = Record<string, JudgeCase[]>
