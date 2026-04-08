interface ValidationResult {
  passed: boolean
  reason?: string
}

export function deepEqualValidator(actual: unknown, expected: unknown): ValidationResult {
  // Check if expected is an error expectation
  if (isErrorExpected(expected)) {
    const expected_error = (expected as { error: string }).error
    if (isError(actual)) {
      const actual_message = (actual as Error).message ?? String(actual)
      if (actual_message.includes(expected_error)) {
        return { passed: true }
      }
      return { passed: false, reason: `Expected error containing "${expected_error}", got "${actual_message}"` }
    } else if (typeof actual === 'string') {
      if (actual.includes(expected_error)) {
        return { passed: true }
      }
      return { passed: false, reason: `Expected error containing "${expected_error}", got "${actual}"` }
    } else if (isObject(actual) && 'error' in actual) {
      const actual_error = String((actual as { error: unknown }).error)
      if (actual_error.includes(expected_error)) {
        return { passed: true }
      }
      return { passed: false, reason: `Expected error containing "${expected_error}", got "${actual_error}"` }
    }
    return { passed: false, reason: `Expected error "${expected_error}", got ${JSON.stringify(actual)}` }
  }

  // Deep equal comparison
  if (deepEqual(actual, expected)) {
    return { passed: true }
  }

  return { passed: false, reason: `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}` }
}

function isErrorExpected(value: unknown): boolean {
  return isObject(value) && 'error' in value && typeof (value as { error: unknown }).error === 'string'
}

function isError(value: unknown): boolean {
  return value instanceof Error || (isObject(value) && 'message' in value)
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function deepEqual(a: unknown, b: unknown, seen = new WeakMap<object, object>()): boolean {
  // Handle NaN
  if (typeof a === 'number' && typeof b === 'number') {
    return a === b || (Number.isNaN(a) && Number.isNaN(b))
  }

  // Strict equality for primitives
  if (a === b) {
    return true
  }

  // Handle null/undefined
  if (a === null || b === null) {
    return a === b
  }

  if (a === undefined || b === undefined) {
    return a === b
  }

  // Type mismatch
  if (typeof a !== typeof b) {
    return false
  }

  // Both are objects
  if (typeof a !== 'object' || typeof b !== 'object') {
    return false
  }

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false
    }
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], seen)) {
        return false
      }
    }
    return true
  }

  // One is array, other is not
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false
  }

  // Handle circular references
  if (seen.has(a)) {
    return seen.get(a) === b
  }

  seen.set(a, b as object)

  // Compare object keys and values
  const a_keys = Object.keys(a)
  const b_keys = Object.keys(b)

  if (a_keys.length !== b_keys.length) {
    return false
  }

  for (const key of a_keys) {
    if (!b_keys.includes(key)) {
      return false
    }
    if (!deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key], seen)) {
      return false
    }
  }

  return true
}
