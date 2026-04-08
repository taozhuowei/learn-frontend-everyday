export interface MockFn {
  (...args: unknown[]): void
  callCount: number
  calls: Array<{ args: unknown[]; thisArg: unknown }>
  reset(): void
}

export function createMockFn(): MockFn {
  const mock_fn = function (this: unknown, ...args: unknown[]): void {
    mock_fn.callCount++
    mock_fn.calls.push({ args, thisArg: this })
  } as MockFn

  mock_fn.callCount = 0
  mock_fn.calls = []
  mock_fn.reset = function (): void {
    mock_fn.callCount = 0
    mock_fn.calls = []
  }

  return mock_fn
}
