import { describe, it, expect } from 'vitest'
import { behavioralValidator } from '@judge/validators/behavioral_validator'

describe('behavioralValidator', () => {
  describe('callCount', () => {
    it('should pass when callCount matches', () => {
      const result = behavioralValidator({ callCount: 3 }, { callCount: 3 })
      expect(result.passed).toBe(true)
    })

    it('should not pass when callCount mismatches with reason', () => {
      const result = behavioralValidator({ callCount: 2 }, { callCount: 3 })
      expect(result.passed).toBe(false)
      expect(result.reason).toContain('callCount')
      expect(result.reason).toContain('3')
      expect(result.reason).toContain('2')
    })
  })

  describe('maxConcurrent', () => {
    it('should pass when maxConcurrent matches', () => {
      const result = behavioralValidator(
        { callCount: 1, maxConcurrent: 2 },
        { maxConcurrent: 2 }
      )
      expect(result.passed).toBe(true)
    })

    it('should not pass when maxConcurrent mismatches', () => {
      const result = behavioralValidator(
        { callCount: 1, maxConcurrent: 3 },
        { maxConcurrent: 2 }
      )
      expect(result.passed).toBe(false)
    })
  })

  describe('hasError', () => {
    it('should pass when hasError is true and actual has error', () => {
      const result = behavioralValidator(
        { callCount: 0, error: new Error('x') },
        { hasError: true }
      )
      expect(result.passed).toBe(true)
    })

    it('should pass when hasError is false and actual has no error', () => {
      const result = behavioralValidator({ callCount: 0 }, { hasError: false })
      expect(result.passed).toBe(true)
    })

    it('should not pass when hasError mismatches', () => {
      const result = behavioralValidator(
        { callCount: 0 },
        { hasError: true }
      )
      expect(result.passed).toBe(false)
    })
  })

  describe('multiple and partial checks', () => {
    it('should pass when all fields match', () => {
      const result = behavioralValidator(
        { callCount: 5, maxConcurrent: 3, error: new Error('test') },
        { callCount: 5, maxConcurrent: 3, hasError: true }
      )
      expect(result.passed).toBe(true)
    })

    it('should pass when only callCount specified and matches, ignoring others', () => {
      const result = behavioralValidator(
        { callCount: 3, maxConcurrent: 5, error: new Error('test') },
        { callCount: 3 }
      )
      expect(result.passed).toBe(true)
    })
  })
})
