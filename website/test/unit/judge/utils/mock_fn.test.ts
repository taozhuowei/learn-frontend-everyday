import { describe, it, expect } from 'vitest'
import { createMockFn } from '@judge/utils/mock_fn'

describe('createMockFn', () => {
  it('should have initial state with callCount 0 and empty calls', () => {
    const mock_fn = createMockFn()
    expect(mock_fn.callCount).toBe(0)
    expect(mock_fn.calls).toEqual([])
  })

  it('should increment callCount and record args after calling', () => {
    const mock_fn = createMockFn()
    mock_fn('arg1', 'arg2')
    expect(mock_fn.callCount).toBe(1)
    expect(mock_fn.calls).toHaveLength(1)
    expect(mock_fn.calls[0].args).toEqual(['arg1', 'arg2'])
  })

  it('should track multiple calls with correct callCount and calls array', () => {
    const mock_fn = createMockFn()
    mock_fn('first')
    mock_fn('second', 123)
    mock_fn(true)
    expect(mock_fn.callCount).toBe(3)
    expect(mock_fn.calls).toHaveLength(3)
    expect(mock_fn.calls[0].args).toEqual(['first'])
    expect(mock_fn.calls[1].args).toEqual(['second', 123])
    expect(mock_fn.calls[2].args).toEqual([true])
  })

  it('should track thisArg when called with call', () => {
    const mock_fn = createMockFn()
    const some_obj = { name: 'test' }
    mock_fn.call(some_obj, 'arg')
    expect(mock_fn.callCount).toBe(1)
    expect(mock_fn.calls[0].thisArg).toBe(some_obj)
    expect(mock_fn.calls[0].args).toEqual(['arg'])
  })

  it('should reset callCount and calls to initial state', () => {
    const mock_fn = createMockFn()
    mock_fn('arg1')
    mock_fn('arg2')
    expect(mock_fn.callCount).toBe(2)
    expect(mock_fn.calls).toHaveLength(2)
    mock_fn.reset()
    expect(mock_fn.callCount).toBe(0)
    expect(mock_fn.calls).toEqual([])
  })
})
