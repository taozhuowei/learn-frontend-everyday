import { describe, it, expect } from 'vitest'
import { JudgeCore } from '@judge/core/judge_core'
import '@judge/core/problem_registry'

describe('JudgeCore Integration', () => {
  const judge = new JudgeCore()

  describe('method-call runner (filter)', () => {
    const filter_code = `Array.prototype.myFilter = function (callback, thisArg) {
  if (this == null) throw new TypeError('this is null or undefined')
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function')
  const arr = this
  const len = arr.length >>> 0
  const result = []
  for (let i = 0; i < len; i++) {
    if (i in arr && callback.call(thisArg, arr[i], i, arr)) {
      result.push(arr[i])
    }
  }
  return result
}`

    const filter_test_file = {
      examples: [
        { id: 'ex-1', hidden: false, input: { target: '[1,2,3,4,5,6]', args: ['x => x % 2 === 0'] }, expected: [2, 4, 6] },
        { id: 'ex-2', hidden: false, input: { target: '[1,2,3,4]', args: ['x => x > 2'] }, expected: [3, 4] }
      ],
      hidden: [
        { id: 'h-1', hidden: true, input: { target: '[]', args: ['x => true'] }, expected: [] },
        { id: 'h-2', hidden: true, input: { target: '[1,2,3]', args: ['x => false'] }, expected: [] }
      ]
    }

    it('should pass all test cases for filter', async () => {
      const result = await judge.run('filter', filter_code, filter_test_file)

      expect(result.passed).toBe(true)
      expect(result.cases).toHaveLength(4)
      expect(result.cases.every(c => c.passed)).toBe(true)
    })
  })

  describe('function-call runner (reverseList)', () => {
    const reverse_code = `export default function reverseList(head) {
  let prev = null
  let current = head
  while (current !== null) {
    const next = current.next
    current.next = prev
    prev = current
    current = next
  }
  return prev
}`

    const reverse_test_file = {
      examples: [
        { id: 'ex-1', hidden: false, input: { target: '[1,2,3,4,5]' }, expected: [5, 4, 3, 2, 1] },
        { id: 'ex-2', hidden: false, input: { target: '[1,2]' }, expected: [2, 1] }
      ],
      hidden: [
        { id: 'h-1', hidden: true, input: { target: '[]' }, expected: [] },
        { id: 'h-2', hidden: true, input: { target: '[1]' }, expected: [1] }
      ]
    }

    it('should pass all test cases for reverseList', async () => {
      const result = await judge.run('reverseList', reverse_code, reverse_test_file)

      expect(result.passed).toBe(true)
    })
  })

  describe('behavioral runner (debounce)', () => {
    const debounce_code = `export default function debounce(task, delay) {
  if (typeof task !== 'function') throw new TypeError('debounce can only run with functions')
  let timer = null
  return function (...args) {
    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(() => { task.apply(this, args) }, delay)
  }
}`

    const debounce_test_file = {
      examples: [
        {
          id: 'ex-1',
          hidden: false,
          input: {
            target: '100',
            steps: [
              { type: 'call' as const },
              { type: 'call' as const },
              { type: 'call' as const },
              { type: 'tick' as const, ms: 100 }
            ]
          },
          expected: { callCount: 1 }
        }
      ],
      hidden: [
        {
          id: 'h-1',
          hidden: true,
          input: {
            target: '200',
            steps: [
              { type: 'call' as const },
              { type: 'tick' as const, ms: 100 },
              { type: 'call' as const },
              { type: 'tick' as const, ms: 200 }
            ]
          },
          expected: { callCount: 1 }
        }
      ]
    }

    it('should pass all test cases for debounce', async () => {
      const result = await judge.run('debounce', debounce_code, debounce_test_file)

      expect(result.passed).toBe(true)
    })
  })

  describe('async runner (promise_all)', () => {
    const promise_all_code = `export default function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const queue = Array.from(promises)
    const length = queue.length
    if (length === 0) { resolve([]); return }
    const results = new Array(length)
    let completedCount = 0
    let isRejected = false
    queue.forEach((item, index) => {
      Promise.resolve(item).then((value) => {
        if (isRejected) return
        results[index] = value
        completedCount++
        if (completedCount === length) resolve(results)
      }).catch((reason) => {
        if (isRejected) return
        isRejected = true
        reject(reason)
      })
    })
  })
}`

    const promise_all_test_file = {
      examples: [
        {
          id: 'ex-1',
          hidden: false,
          input: { target: 'promiseAll([MyPromise.resolve(1), MyPromise.resolve(2), MyPromise.resolve(3)])' },
          expected: [1, 2, 3]
        },
        {
          id: 'ex-2',
          hidden: false,
          input: { target: 'promiseAll([])' },
          expected: []
        }
      ],
      hidden: [
        {
          id: 'h-1',
          hidden: true,
          input: { target: 'promiseAll([1, 2, 3])' },
          expected: [1, 2, 3]
        }
      ]
    }

    it('should pass all test cases for promise_all', async () => {
      const result = await judge.run('promise_all', promise_all_code, promise_all_test_file)

      expect(result.passed).toBe(true)
    })
  })

  describe('failure case', () => {
    const wrong_code = 'Array.prototype.myFilter = function() { return [] }'

    const filter_test_file = {
      examples: [
        { id: 'ex-1', hidden: false, input: { target: '[1,2,3,4,5,6]', args: ['x => x % 2 === 0'] }, expected: [2, 4, 6] },
        { id: 'ex-2', hidden: false, input: { target: '[1,2,3,4]', args: ['x => x > 2'] }, expected: [3, 4] }
      ],
      hidden: [
        { id: 'h-1', hidden: true, input: { target: '[]', args: ['x => true'] }, expected: [] },
        { id: 'h-2', hidden: true, input: { target: '[1,2,3]', args: ['x => false'] }, expected: [] }
      ]
    }

    it('should fail when code is incorrect', async () => {
      const result = await judge.run('filter', wrong_code, filter_test_file)

      expect(result.passed).toBe(false)
      expect(result.cases.some(c => !c.passed)).toBe(true)
    })
  })

  describe('unknown problem', () => {
    it('should throw error for nonexistent problem', async () => {
      await expect(
        judge.run('nonexistent', '', { examples: [], hidden: [] })
      ).rejects.toThrow('not found')
    })
  })
})
