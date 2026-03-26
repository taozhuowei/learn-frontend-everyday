/**
 * Module: build_config
 * Purpose: Share bundle chunking rules used by the production build.
 */

export const CHUNK_WARNING_LIMIT_KB = 800

/**
 * Map a module id to a stable manual chunk name.
 *
 * @param {string} moduleId
 * @returns {string | undefined}
 */
export function getManualChunk(moduleId) {
  const normalizedModuleId = moduleId.replace(/\\/g, '/')

  if (normalizedModuleId.endsWith('/src/generated/knowledge.ts')) {
    return 'knowledge-data'
  }

  if (normalizedModuleId.endsWith('/src/generated/problems.ts')) {
    return 'problem-data'
  }

  if (normalizedModuleId.endsWith('/src/generated/test-manifest.ts')) {
    return 'test-manifest'
  }

  if (!normalizedModuleId.includes('/node_modules/')) {
    return undefined
  }

  if (
    normalizedModuleId.includes('/node_modules/react/') ||
    normalizedModuleId.includes('/node_modules/react-dom/')
  ) {
    return 'react-vendor'
  }

  if (normalizedModuleId.includes('/node_modules/react-router')) {
    return 'router-vendor'
  }

  if (normalizedModuleId.includes('/node_modules/@monaco-editor/react/')) {
    return 'editor-react'
  }

  if (normalizedModuleId.includes('/node_modules/monaco-editor/')) {
    if (
      normalizedModuleId.includes('/vs/language/') ||
      normalizedModuleId.includes('/vs/basic-languages/')
    ) {
      return 'editor-language'
    }

    return 'editor-core'
  }

  if (normalizedModuleId.includes('/node_modules/react-syntax-highlighter/')) {
    return 'syntax-highlighter'
  }

  if (
    normalizedModuleId.includes('/node_modules/react-markdown/') ||
    normalizedModuleId.includes('/node_modules/remark-') ||
    normalizedModuleId.includes('/node_modules/rehype-') ||
    normalizedModuleId.includes('/node_modules/unified/') ||
    normalizedModuleId.includes('/node_modules/mdast-') ||
    normalizedModuleId.includes('/node_modules/hast-') ||
    normalizedModuleId.includes('/node_modules/micromark') ||
    normalizedModuleId.includes('/node_modules/unist-')
  ) {
    return 'markdown-runtime'
  }

  return 'vendor'
}
