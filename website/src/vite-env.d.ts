/// <reference types="vite/client" />

import type { KnowledgeArticle, ProblemRecord } from './types/content'

declare global {
  interface Window {
    __PRACTICE_DEBUG__?: {
      problems: ProblemRecord[]
      knowledgeArticles: KnowledgeArticle[]
      generatedTestManifest?: Array<{
        problemId: string
        title: string
        categoryId: string
        categoryName: string
        executionMode: 'browser' | 'local'
        basicCaseCount: number
        fullCaseCount: number
      }>
    }
    __setPracticeEditorValue__?: (value: string) => void
    __getPracticeEditorValue__?: () => string
    __triggerPracticeSuggest__?: () => void
    __isPracticeSuggestVisible__?: () => boolean
  }
}
