/**
 * Module: content_rules
 * Purpose: Share practice-content parsing rules between build scripts and tests.
 */

export const DEFAULT_TIMEOUT_MS = 2000

const CATEGORY_NAME_MAP = Object.freeze({
  array: '数组方法',
  function: '函数方法',
  linkedlist: '链表',
  object: '对象方法',
  promise: 'Promise 实现',
  tree: '树结构',
  utility: '工具函数',
  with_react: 'React 组件',
  with_vue: 'Vue 组件',
})

/**
 * Convert a slug-like value into a readable title.
 */
export function humanizeSlug(value) {
  return value
    .split(/[_-]/g)
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ')
}

/**
 * Resolve a category label from a category id.
 */
export function getCategoryName(categoryId) {
  return CATEGORY_NAME_MAP[categoryId] ?? humanizeSlug(categoryId)
}

/**
 * Extract the leading JSDoc block from a source file.
 */
export function getHeaderComment(source) {
  const match = source.match(/^\s*(\/\*\*[\s\S]*?\*\/)/)
  return match ? match[1] : ''
}

/**
 * Check whether the source file is marked to skip practice import.
 */
export function hasSkipTag(source) {
  return /@skip\b/.test(getHeaderComment(source))
}

/**
 * Resolve how a source file should be executed in the website.
 */
export function getExecutionConfig(sourceType) {
  if (sourceType === 'jsx' || sourceType === 'tsx') {
    return {
      executionMode: 'component',
      launcherPath: 'problems/with_react/launcher',
    }
  }

  if (sourceType === 'vue') {
    return {
      executionMode: 'component',
      launcherPath: 'problems/with_vue/launcher',
    }
  }

  return {
    executionMode: 'browser',
    launcherPath: null,
  }
}

/**
 * 验证测试用例格式
 */
export function validateTestCases(testCases, relativePath) {
  if (!testCases || typeof testCases !== 'object') {
    throw new Error(`${relativePath} 必须导出对象。`)
  }

  if (!Array.isArray(testCases.examples)) {
    throw new Error(`${relativePath} 必须包含 examples 数组。`)
  }

  if (!Array.isArray(testCases.hidden)) {
    throw new Error(`${relativePath} 必须包含 hidden 数组。`)
  }

  if (testCases.examples.length < 1) {
    throw new Error(`${relativePath} 至少需要 1 个示例用例。`)
  }

  // 验证每个用例格式
  const validateCase = (c, i, type) => {
    if (!c || typeof c !== 'object') {
      throw new Error(`${relativePath} ${type}[${i}] 必须是对象。`)
    }
    if (!c.input || typeof c.input !== 'object') {
      throw new Error(`${relativePath} ${type}[${i}] 必须有 input 对象。`)
    }
    if (!('expected' in c)) {
      throw new Error(`${relativePath} ${type}[${i}] 必须有 expected 字段。`)
    }
  }

  testCases.examples.forEach((c, i) => validateCase(c, i, 'examples'))
  testCases.hidden.forEach((c, i) => validateCase(c, i, 'hidden'))
}
