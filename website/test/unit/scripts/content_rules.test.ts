import { describe, it, expect } from 'vitest'
import {
  humanizeSlug as humanize_slug,
  getCategoryName as get_category_name,
  getHeaderComment as get_header_comment,
  hasSkipTag as has_skip_tag,
  getExecutionConfig as get_execution_config,
  validateTestCases as validate_test_cases,
} from '../../../scripts/content_rules.mjs'

describe('humanize_slug', () => {
  it("converts 'my_slug' to 'My Slug'", () => {
    expect(humanize_slug('my_slug')).toBe('My Slug')
  })

  it("converts 'hello-world' to 'Hello World'", () => {
    expect(humanize_slug('hello-world')).toBe('Hello World')
  })

  it("converts 'single' to 'Single'", () => {
    expect(humanize_slug('single')).toBe('Single')
  })
})

describe('get_category_name', () => {
  it("returns '数组方法' for 'array'", () => {
    expect(get_category_name('array')).toBe('数组方法')
  })

  it("returns 'Promise 实现' for 'promise'", () => {
    expect(get_category_name('promise')).toBe('Promise 实现')
  })

  it("returns '树结构' for 'tree'", () => {
    expect(get_category_name('tree')).toBe('树结构')
  })

  it('falls back to humanize_slug for unknown category', () => {
    expect(get_category_name('unknown_cat')).toBe('Unknown Cat')
  })
})

describe('get_header_comment', () => {
  it('extracts JSDoc block from source', () => {
    const source = `/** @description foo */
const x = 1`
    const result = get_header_comment(source)
    expect(result).toBe('/** @description foo */')
  })

  it('returns empty string when no JSDoc block', () => {
    const source = `const x = 1
// regular comment
function test() {}`
    expect(get_header_comment(source)).toBe('')
  })

  it('returns empty string for regular block comment', () => {
    const source = `/* regular block comment */
const x = 1`
    expect(get_header_comment(source)).toBe('')
  })
})

describe('has_skip_tag', () => {
  it('returns true for source with @skip tag', () => {
    const source = `/** @skip */
export default function() {}`
    expect(has_skip_tag(source)).toBe(true)
  })

  it('returns false for source without @skip tag', () => {
    const source = `/**
 * Regular doc
 */
export default function() {}`
    expect(has_skip_tag(source)).toBe(false)
  })
})

describe('get_execution_config', () => {
  it("returns browser config for 'js'", () => {
    const result = get_execution_config('js')
    expect(result).toEqual({
      executionMode: 'browser',
      launcherPath: null,
    })
  })

  it("returns component config for 'jsx'", () => {
    const result = get_execution_config('jsx')
    expect(result).toEqual({
      executionMode: 'component',
      launcherPath: 'problems/with_react/launcher',
    })
  })

  it("returns component config for 'tsx'", () => {
    const result = get_execution_config('tsx')
    expect(result).toEqual({
      executionMode: 'component',
      launcherPath: 'problems/with_react/launcher',
    })
  })

  it("returns component config for 'vue'", () => {
    const result = get_execution_config('vue')
    expect(result).toEqual({
      executionMode: 'component',
      launcherPath: 'problems/with_vue/launcher',
    })
  })
})

describe('validate_test_cases', () => {
  it('does not throw for valid test cases', () => {
    const valid_cases = {
      examples: [{ input: { target: '1' }, expected: 1 }],
      hidden: [{ input: { target: '2' }, expected: 2 }],
    }
    expect(() => validate_test_cases(valid_cases, 'test.js')).not.toThrow()
  })

  it('throws when examples is missing', () => {
    const invalid_cases = {
      hidden: [{ input: { target: '1' }, expected: 1 }],
    }
    expect(() => validate_test_cases(invalid_cases, 'test.js')).toThrow('必须包含 examples 数组')
  })

  it('throws when examples array is empty', () => {
    const invalid_cases = {
      examples: [],
      hidden: [{ input: { target: '1' }, expected: 1 }],
    }
    expect(() => validate_test_cases(invalid_cases, 'test.js')).toThrow('至少需要 1 个示例用例')
  })

  it('throws when hidden is missing', () => {
    const invalid_cases = {
      examples: [{ input: { target: '1' }, expected: 1 }],
    }
    expect(() => validate_test_cases(invalid_cases, 'test.js')).toThrow('必须包含 hidden 数组')
  })

  it('throws for invalid case format', () => {
    const invalid_cases = {
      examples: [{ expected: 1 }],
      hidden: [],
    }
    expect(() => validate_test_cases(invalid_cases, 'test.js')).toThrow(
      '必须有 input 对象或 target+args 或 display+execute',
    )
  })
})
