import { describe, it, expect } from 'vitest'
import { deepEqualValidator } from '@judge/validators/deep_equal_validator'

describe('deepEqualValidator', () => {
  describe('primitives', () => {
    it('should pass for same numbers', () => {
      const result = deepEqualValidator(42, 42)
      expect(result.passed).toBe(true)
    })

    it('should not pass for different numbers', () => {
      const result = deepEqualValidator(42, 43)
      expect(result.passed).toBe(false)
    })

    it('should pass for same strings', () => {
      const result = deepEqualValidator('hello', 'hello')
      expect(result.passed).toBe(true)
    })

    it('should not pass for different strings', () => {
      const result = deepEqualValidator('hello', 'world')
      expect(result.passed).toBe(false)
    })

    it('should pass for same booleans', () => {
      const result = deepEqualValidator(true, true)
      expect(result.passed).toBe(true)
    })

    it('should not pass for different booleans', () => {
      const result = deepEqualValidator(true, false)
      expect(result.passed).toBe(false)
    })
  })

  describe('null and undefined', () => {
    it('should pass for null === null', () => {
      const result = deepEqualValidator(null, null)
      expect(result.passed).toBe(true)
    })

    it('should not pass for null !== undefined', () => {
      const result = deepEqualValidator(null, undefined)
      expect(result.passed).toBe(false)
    })
  })

  describe('NaN handling', () => {
    it('should pass for NaN === NaN', () => {
      const result = deepEqualValidator(NaN, NaN)
      expect(result.passed).toBe(true)
    })
  })

  describe('arrays', () => {
    it('should pass for equal arrays', () => {
      const result = deepEqualValidator([1, 2, 3], [1, 2, 3])
      expect(result.passed).toBe(true)
    })

    it('should not pass for different arrays', () => {
      const result = deepEqualValidator([1, 2], [1, 3])
      expect(result.passed).toBe(false)
    })

    it('should pass for equal nested arrays', () => {
      const result = deepEqualValidator([[1, [2]]], [[1, [2]]])
      expect(result.passed).toBe(true)
    })

    it('should pass for empty arrays', () => {
      const result = deepEqualValidator([], [])
      expect(result.passed).toBe(true)
    })
  })

  describe('objects', () => {
    it('should pass for equal objects', () => {
      const result = deepEqualValidator({ a: 1, b: 2 }, { a: 1, b: 2 })
      expect(result.passed).toBe(true)
    })

    it('should not pass for different objects', () => {
      const result = deepEqualValidator({ a: 1 }, { a: 2 })
      expect(result.passed).toBe(false)
    })

    it('should pass for equal nested objects', () => {
      const result = deepEqualValidator({ a: { b: 1 } }, { a: { b: 1 } })
      expect(result.passed).toBe(true)
    })

    it('should pass for empty objects', () => {
      const result = deepEqualValidator({}, {})
      expect(result.passed).toBe(true)
    })
  })

  describe('mixed types', () => {
    it('should not pass for array !== object with same keys', () => {
      const result = deepEqualValidator([1, 2], { 0: 1, 1: 2 })
      expect(result.passed).toBe(false)
    })
  })

  describe('error expectations', () => {
    it('should pass when actual is Error and contains expected error string', () => {
      const result = deepEqualValidator(new Error('foo bar'), { error: 'foo' })
      expect(result.passed).toBe(true)
    })

    it('should pass when actual object has error property containing expected string', () => {
      const result = deepEqualValidator({ error: 'foo bar' }, { error: 'foo' })
      expect(result.passed).toBe(true)
    })

    it('should not pass when actual is not an error and does not match error expectation', () => {
      const result = deepEqualValidator('not error', { error: 'xyz' })
      expect(result.passed).toBe(false)
    })
  })

  describe('circular references', () => {
    it('should not throw for matching objects with circular references', () => {
      const obj_a: Record<string, unknown> = { name: 'a' }
      const obj_b: Record<string, unknown> = { name: 'a' }
      obj_a['ref'] = obj_b
      obj_b['ref'] = obj_a
      const result = deepEqualValidator(obj_a, obj_b)
      expect(result.passed).toBe(true)
    })
  })
})
