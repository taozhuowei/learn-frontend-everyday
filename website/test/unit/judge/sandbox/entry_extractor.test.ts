import { describe, it, expect } from 'vitest'
import {
  extractPrototype,
  extractExport,
  extractClass
} from '@judge/sandbox/entry_extractor'

describe('extractPrototype', () => {
  it('extracts function from Array.prototype.myFilter code', () => {
    const code = 'Array.prototype.myFilter = function(cb) { return [] }'
    const fn = extractPrototype(code, 'Array', 'myFilter')
    expect(typeof fn).toBe('function')
  })

  it('throws when result is not a function', () => {
    const code = 'Array.prototype.myValue = 42'
    expect(() => extractPrototype(code, 'Array', 'myValue')).toThrow(
      'Expected Array.prototype.myValue to be a function'
    )
  })
})

describe('extractExport', () => {
  it('extracts function from export default function', () => {
    const code = 'export default function add(a,b){return a+b}'
    const fn = extractExport(code) as (a: number, b: number) => number
    expect(typeof fn).toBe('function')
    expect(fn(2, 3)).toBe(5)
  })

  it('extracts arrow function from export default', () => {
    const code = 'export default (a,b)=>a+b'
    const fn = extractExport(code) as (a: number, b: number) => number
    expect(typeof fn).toBe('function')
    expect(fn(3, 4)).toBe(7)
  })
})

describe('extractClass', () => {
  it('extracts class and new instance has bar method', () => {
    const code = 'export default class Foo { bar() { return 1 } }'
    const ClassRef = extractClass(code)
    expect(typeof ClassRef).toBe('function')
    const instance = new ClassRef()
    expect(typeof (instance as { bar: () => number }).bar).toBe('function')
    expect((instance as { bar: () => number }).bar()).toBe(1)
  })

  it('throws when export is not a class/function', () => {
    const code = 'export default 42'
    expect(() => extractClass(code)).toThrow()
  })
})
