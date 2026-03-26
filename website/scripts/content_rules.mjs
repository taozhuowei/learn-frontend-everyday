/**
 * Module: content_rules
 * Purpose: Share practice-content parsing rules between build scripts and tests.
 */

export const BASIC_CASE_COUNT = 3
export const MIN_FULL_CASE_COUNT = 5
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

const CASE_TYPE_LABEL_MAP = Object.freeze({
  basic: '基础用例',
  edge: '边界用例',
  exception: '异常用例',
  large: '大数据用例',
})

/**
 * Convert a slug-like value into a readable title.
 *
 * @param {string} value
 * @returns {string}
 */
export function humanizeSlug(value) {
  return value
    .split(/[_-]/g)
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ')
}

/**
 * Resolve a category label from a category id.
 *
 * @param {string} categoryId
 * @returns {string}
 */
export function getCategoryName(categoryId) {
  return CATEGORY_NAME_MAP[categoryId] ?? humanizeSlug(categoryId)
}

/**
 * Extract the leading JSDoc block from a source file.
 *
 * @param {string} source
 * @returns {string}
 */
export function getHeaderComment(source) {
  const match = source.match(/^\s*(\/\*\*[\s\S]*?\*\/)/)
  return match ? match[1] : ''
}

/**
 * Check whether the source file is marked to skip practice import.
 *
 * @param {string} source
 * @returns {boolean}
 */
export function hasSkipTag(source) {
  return /@skip\b/.test(getHeaderComment(source))
}

/**
 * Resolve how a source file should be executed in the website.
 *
 * @param {string} sourceType
 * @returns {{ executionMode: 'browser' | 'local', launcherPath: string | null }}
 */
export function getExecutionConfig(sourceType) {
  if (sourceType === 'jsx' || sourceType === 'tsx') {
    return {
      executionMode: 'local',
      launcherPath: 'docs/实践/with_react/launcher',
    }
  }

  if (sourceType === 'vue') {
    return {
      executionMode: 'local',
      launcherPath: 'docs/实践/with_vue/launcher',
    }
  }

  return {
    executionMode: 'browser',
    launcherPath: null,
  }
}

/**
 * Normalize the simplified test-case definition into full website cases.
 *
 * @param {unknown} rawCases
 * @param {string} relativePath
 * @returns {Array<{
 *   id: string,
 *   type: 'basic' | 'edge' | 'exception' | 'large',
 *   description: string,
 *   input: string,
 *   expected: unknown,
 *   timeoutMs: number,
 * }>}
 */
export function normalizeCaseDefinitions(rawCases, relativePath) {
  if (!Array.isArray(rawCases)) {
    throw new Error(`${relativePath} 必须导出测试数组。`)
  }

  if (rawCases.length < MIN_FULL_CASE_COUNT) {
    throw new Error(`${relativePath} 至少需要 ${MIN_FULL_CASE_COUNT} 条完整用例。`)
  }

  const counters = {
    basic: 0,
    edge: 0,
    exception: 0,
    large: 0,
  }

  return rawCases.map((rawCase, index) => {
    if (!rawCase || typeof rawCase !== 'object') {
      throw new Error(`${relativePath} 的第 ${index + 1} 条用例必须是对象。`)
    }

    if (!Object.prototype.hasOwnProperty.call(rawCase, 'input')) {
      throw new Error(`${relativePath} 的第 ${index + 1} 条用例缺少 input。`)
    }

    if (!Object.prototype.hasOwnProperty.call(rawCase, 'expected')) {
      throw new Error(`${relativePath} 的第 ${index + 1} 条用例缺少 expected。`)
    }

    if (typeof rawCase.input !== 'string') {
      throw new Error(`${relativePath} 的第 ${index + 1} 条用例 input 必须是字符串。`)
    }

    const type = getCaseTypeByIndex(index)
    counters[type] += 1

    return {
      id: `case-${index + 1}`,
      type,
      description: `${CASE_TYPE_LABEL_MAP[type]} ${counters[type]}`,
      input: rawCase.input,
      expected: rawCase.expected,
      timeoutMs: DEFAULT_TIMEOUT_MS,
    }
  })
}

/**
 * Return the basic cases slice from a full case list.
 *
 * @param {Array<unknown>} fullCases
 * @returns {Array<unknown>}
 */
export function getBasicCases(fullCases) {
  return fullCases.slice(0, BASIC_CASE_COUNT)
}

/**
 * Resolve the default case type by its progressive order.
 *
 * @param {number} index
 * @returns {'basic' | 'edge' | 'exception' | 'large'}
 */
export function getCaseTypeByIndex(index) {
  if (index < BASIC_CASE_COUNT) {
    return 'basic'
  }

  if (index === BASIC_CASE_COUNT) {
    return 'edge'
  }

  if (index === BASIC_CASE_COUNT + 1) {
    return 'exception'
  }

  return 'large'
}
