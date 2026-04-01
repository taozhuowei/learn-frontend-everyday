/**
 * Module: code_runner.test
 * Purpose: Verify code execution worker logic including source sanitization, value normalization, and deep equality.
 */

import test from 'node:test'
import assert from 'node:assert/strict'

// Test the sanitizeSource function logic (from codeRunnerWorker.ts)
function sanitizeSource(source) {
  return source
    .replace(/^\s*export\s+default\s+.*?;?\s*$/gm, '')
    .replace(/^\s*export\s+\{[\s\S]*?\};?\s*$/gm, '')
    .trim()
}

// Test the normalize function logic (from codeRunnerWorker.ts)
function normalize(value) {
  if (typeof value === 'undefined') {
    return { __type: 'undefined' }
  }

  if (typeof value === 'number' && Number.isNaN(value)) {
    return { __type: 'nan' }
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalize(item))
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, normalize(entry)]))
  }

  return value
}

// Test the deepEqual function logic (from codeRunnerWorker.ts)
function deepEqual(left, right) {
  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right))
}

// Test the stringifyLogEntry function logic (from codeRunnerWorker.ts)
function stringifyLogEntry(value) {
  if (typeof value === 'string') {
    return value
  }

  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

test('sanitizeSource removes export default statements', () => {
  const source = `
    function test() {}
    export default test;
  `
  const sanitized = sanitizeSource(source)
  assert.ok(!sanitized.includes('export default'))
  assert.ok(sanitized.includes('function test()'))
})

test('sanitizeSource removes export block statements', () => {
  const source = `
    function test() {}
    export { test, helper };
  `
  const sanitized = sanitizeSource(source)
  assert.ok(!sanitized.includes('export'))
  assert.ok(sanitized.includes('function test()'))
})

test('sanitizeSource handles multiple export statements', () => {
  const source = `
    export default function main() {}
    export { helper };
    function helper() {}
  `
  const sanitized = sanitizeSource(source)
  assert.ok(!sanitized.includes('export default'))
  assert.ok(!sanitized.includes('export {'))
  // export default function main() {} gets removed entirely by the regex
  assert.ok(sanitized.includes('function helper()'))
})

test('sanitizeSource preserves non-export code', () => {
  const source = `
    const x = 1;
    function add(a, b) { return a + b; }
    const result = add(x, 2);
  `
  const sanitized = sanitizeSource(source)
  assert.equal(sanitized.trim(), source.trim())
})

test('normalize converts undefined to special object', () => {
  assert.deepEqual(normalize(undefined), { __type: 'undefined' })
})

test('normalize converts NaN to special object', () => {
  assert.deepEqual(normalize(NaN), { __type: 'nan' })
})

test('normalize preserves null', () => {
  assert.equal(normalize(null), null)
})

test('normalize preserves primitives', () => {
  assert.equal(normalize(42), 42)
  assert.equal(normalize('hello'), 'hello')
  assert.equal(normalize(true), true)
  assert.equal(normalize(false), false)
})

test('normalize recursively processes arrays', () => {
  const input = [1, undefined, NaN, [2, undefined]]
  const expected = [1, { __type: 'undefined' }, { __type: 'nan' }, [2, { __type: 'undefined' }]]
  assert.deepEqual(normalize(input), expected)
})

test('normalize recursively processes objects', () => {
  const input = { a: 1, b: undefined, c: { d: NaN } }
  const expected = { a: 1, b: { __type: 'undefined' }, c: { d: { __type: 'nan' } } }
  assert.deepEqual(normalize(input), expected)
})

test('deepEqual returns true for identical primitives', () => {
  assert.equal(deepEqual(1, 1), true)
  assert.equal(deepEqual('hello', 'hello'), true)
  assert.equal(deepEqual(true, true), true)
  assert.equal(deepEqual(null, null), true)
})

test('deepEqual returns false for different primitives', () => {
  assert.equal(deepEqual(1, 2), false)
  assert.equal(deepEqual('hello', 'world'), false)
  assert.equal(deepEqual(true, false), false)
  assert.equal(deepEqual(null, undefined), false)
})

test('deepEqual handles undefined values correctly', () => {
  assert.equal(deepEqual(undefined, undefined), true)
  assert.equal(deepEqual([undefined], [undefined]), true)
  assert.equal(deepEqual({ a: undefined }, { a: undefined }), true)
  assert.equal(deepEqual(undefined, null), false)
})

test('deepEqual handles NaN values correctly', () => {
  assert.equal(deepEqual(NaN, NaN), true) // NaN !== NaN normally, but our normalize handles it
  assert.equal(deepEqual([NaN], [NaN]), true)
  assert.equal(deepEqual({ a: NaN }, { a: NaN }), true)
})

test('deepEqual handles mixed undefined and NaN', () => {
  assert.equal(deepEqual([undefined, NaN], [undefined, NaN]), true)
  assert.equal(deepEqual({ u: undefined, n: NaN }, { u: undefined, n: NaN }), true)
})

test('deepEqual handles nested structures', () => {
  const a = { x: [1, { y: undefined }], z: NaN }
  const b = { x: [1, { y: undefined }], z: NaN }
  const c = { x: [1, { y: null }], z: NaN }

  assert.equal(deepEqual(a, b), true)
  assert.equal(deepEqual(a, c), false)
})

test('deepEqual handles arrays of different lengths', () => {
  assert.equal(deepEqual([1, 2], [1, 2, 3]), false)
  assert.equal(deepEqual([1, 2, 3], [1, 2]), false)
})

test('deepEqual handles objects with different keys', () => {
  assert.equal(deepEqual({ a: 1 }, { b: 1 }), false)
  assert.equal(deepEqual({ a: 1 }, { a: 1, b: 2 }), false)
})

test('stringifyLogEntry returns strings as-is', () => {
  assert.equal(stringifyLogEntry('hello'), 'hello')
  assert.equal(stringifyLogEntry(''), '')
})

test('stringifyLogEntry JSON stringifies objects', () => {
  assert.equal(stringifyLogEntry({ a: 1 }), '{\n  "a": 1\n}')
  assert.equal(stringifyLogEntry([1, 2, 3]), '[\n  1,\n  2,\n  3\n]')
})

test('stringifyLogEntry handles primitives', () => {
  assert.equal(stringifyLogEntry(42), '42')
  assert.equal(stringifyLogEntry(true), 'true')
  assert.equal(stringifyLogEntry(null), 'null')
  assert.equal(stringifyLogEntry(undefined), undefined)
})

test('stringifyLogEntry handles circular references gracefully', () => {
  const obj = { a: 1 }
  obj.self = obj
  // Should not throw, should return something
  const result = stringifyLogEntry(obj)
  assert.equal(typeof result, 'string')
})

// Integration tests simulating actual code execution scenarios
test('integration: simple arithmetic function execution', async () => {
  const source = `
    function add(a, b) {
      return a + b;
    }
  `
  // Simulate what the worker would do
  const sanitized = sanitizeSource(source)
  const factory = new Function(
    'console',
    'setTimeout',
    'clearTimeout',
    'setInterval',
    'clearInterval',
    `
    ${sanitized}
    return async function runInput(input) {
      return await eval(input);
    }
  `,
  )
  const runInput = factory(
    {},
    () => {},
    () => {},
    () => {},
    () => {},
  )

  const result = await runInput('add(2, 3)')
  assert.equal(result, 5)
})

test('integration: array method polyfill execution', async () => {
  const source = `
    Array.prototype.myMap = function(callback) {
      const result = [];
      for (let i = 0; i < this.length; i++) {
        result.push(callback(this[i], i, this));
      }
      return result;
    };
  `
  const sanitized = sanitizeSource(source)
  const factory = new Function(
    'console',
    'setTimeout',
    'clearTimeout',
    'setInterval',
    'clearInterval',
    `
    ${sanitized}
    return async function runInput(input) {
      return await eval(input);
    }
  `,
  )
  const runInput = factory(
    {},
    () => {},
    () => {},
    () => {},
    () => {},
  )

  const result = await runInput('[1, 2, 3].myMap(x => x * 2)')
  assert.deepEqual(result, [2, 4, 6])
})

test('integration: console capture during execution', async () => {
  const logs = []
  const mockConsole = {
    log: (...args) => logs.push(args.join(' ')),
    info: () => {},
    warn: () => {},
    error: () => {},
  }

  const source = `
    function greet(name) {
      console.log('Hello, ' + name);
      return 'Greeting sent';
    }
  `
  const sanitized = sanitizeSource(source)
  const factory = new Function(
    'console',
    'setTimeout',
    'clearTimeout',
    'setInterval',
    'clearInterval',
    `
    ${sanitized}
    return async function runInput(input) {
      return await eval(input);
    }
  `,
  )
  const runInput = factory(
    mockConsole,
    () => {},
    () => {},
    () => {},
    () => {},
  )

  const result = await runInput('greet("World")')
  assert.equal(result, 'Greeting sent')
  assert.equal(logs[0], 'Hello, World')
})
