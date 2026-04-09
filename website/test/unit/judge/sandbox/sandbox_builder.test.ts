import { describe, it, expect } from 'vitest'
import { buildSandbox, disableNativeMethod } from '@judge/sandbox/sandbox_builder'

describe('buildSandbox', () => {
  it('returns a function', () => {
    const sandbox = buildSandbox({})
    expect(typeof sandbox).toBe('function')
  })

  it('sandbox returns context variable value', () => {
    const sandbox = buildSandbox({ x: 42 })
    const result = sandbox('return x')
    expect(result).toBe(42)
  })

  it('can set variables in context via sandbox code', () => {
    const context: Record<string, unknown> = {}
    const sandbox = buildSandbox(context)
    sandbox('y = 100')
    expect(context.y).toBe(100)
  })

  it('accessing undefined vars returns undefined due to Proxy has trap', () => {
    const sandbox = buildSandbox({})
    const result = sandbox('return typeof undefined_var')
    expect(result).toBe('undefined')
  })
})

describe('disableNativeMethod', () => {
  it('disables Array.prototype.filter and restore function restores it', () => {
    const original = Array.prototype.filter
    expect(typeof original).toBe('function')

    const restore = disableNativeMethod('Array.prototype.filter')
    expect(Array.prototype.filter).toBeUndefined()

    restore()
    expect(Array.prototype.filter).toBe(original)
  })
})
