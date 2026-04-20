interface ValidationResult {
  passed: boolean;
  reason?: string;
}

interface BehavioralActual {
  callCount: number;
  maxConcurrent?: number;
  error?: Error;
}

interface BehavioralExpected {
  callCount?: number;
  maxConcurrent?: number;
  hasError?: boolean;
}

export function behavioralValidator(
  actual: BehavioralActual,
  expected: BehavioralExpected,
): ValidationResult {
  // Check callCount
  if (expected.callCount !== undefined) {
    if (actual.callCount !== expected.callCount) {
      return {
        passed: false,
        reason: `Expected callCount ${expected.callCount}, got ${actual.callCount}`,
      };
    }
  }

  // Check maxConcurrent
  if (expected.maxConcurrent !== undefined) {
    if (actual.maxConcurrent !== expected.maxConcurrent) {
      return {
        passed: false,
        reason: `Expected maxConcurrent ${expected.maxConcurrent}, got ${actual.maxConcurrent}`,
      };
    }
  }

  // Check hasError
  if (expected.hasError !== undefined) {
    const has_error = actual.error !== undefined;
    if (has_error !== expected.hasError) {
      return {
        passed: false,
        reason: `Expected hasError ${expected.hasError}, got ${has_error}`,
      };
    }
  }

  return { passed: true };
}
