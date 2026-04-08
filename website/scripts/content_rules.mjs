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

  // 验证每个用例格式（支持新格式 input 对象和旧格式 target+args 直接）
  const validateCase = (c, i, type) => {
    if (!c || typeof c !== 'object') {
      throw new Error(`${relativePath} ${type}[${i}] 必须是对象。`)
    }
    // 新格式: 有 input 对象（包含 target, args, steps 等）
    if ('input' in c && typeof c.input === 'object') {
      // New format with input object - already valid
      // optional: validate c.id and c.hidden if needed
    }
    // 旧格式: target + args + expected 直接在 case 上
    else if ('target' in c && 'args' in c) {
      if (typeof c.target !== 'string') {
        throw new Error(`${relativePath} ${type}[${i}] target 必须是字符串。`)
      }
      if (!Array.isArray(c.args)) {
        throw new Error(`${relativePath} ${type}[${i}] args 必须是数组。`)
      }
    }
    // 旧格式: display + execute + expected
    else if (c.display && c.execute) {
      if (!c.display || typeof c.display !== 'object') {
        throw new Error(`${relativePath} ${type}[${i}] 必须有 display 对象。`)
      }
      if (!c.execute || typeof c.execute !== 'object') {
        throw new Error(`${relativePath} ${type}[${i}] 必须有 execute 对象。`)
      }
    }
    else {
      throw new Error(
        `${relativePath} ${type}[${i}] 必须有 input 对象或 target+args 或 display+execute。`,
      )
    }
    if (!('expected' in c)) {
      throw new Error(`${relativePath} ${type}[${i}] 必须有 expected 字段。`)
    }
  }

  testCases.examples.forEach((c, i) => validateCase(c, i, 'examples'))
  testCases.hidden.forEach((c, i) => validateCase(c, i, 'hidden'))
}
