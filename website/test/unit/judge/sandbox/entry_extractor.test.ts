import { describe, it, expect } from 'vitest'
import { extractPrototype, extractExport, extractClass } from '@judge/sandbox/entry_extractor'

describe('extractPrototype', () => {
  it('extracts function from Array.prototype.myFilter code', () => {
    const code = 'Array.prototype.myFilter = function(cb) { return this; }'
    const fnString = extractPrototype(code, 'Array', 'myFilter')
    expect(typeof fnString).toBe('string')
    expect(fnString).toContain('return Array.prototype.myFilter;')
  })
})

describe('extractExport', () => {
  it('extracts function from export default function', () => {
    const code = 'export default function add(a,b){return a+b}'
    const fnString = extractExport(code)
    expect(typeof fnString).toBe('string')
    expect(fnString).toContain('(function()')
    expect(fnString).toContain('var cleanCode')
    expect(fnString).toContain('eval(cleanCode)')
  })

  it('extracts arrow function from export default', () => {
    const code = 'export default (a,b)=>a+b'
    const fnString = extractExport(code)
    expect(typeof fnString).toBe('string')
    expect(fnString).toContain('__cf_default__ = ')
  })
})

describe('extractClass', () => {
  it('extracts class from export default class', () => {
    const code = 'export default class Foo { bar() { return 1; } }'
    const classString = extractClass(code)
    expect(typeof classString).toBe('string')
    expect(classString).toContain('class Foo')
  })
})
