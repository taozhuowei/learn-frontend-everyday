interface ValidationResult {
  passed: boolean;
  reason?: string;
}

export function deepEqualValidator(
  actual: unknown,
  expected: unknown,
): ValidationResult {
  if (isErrorExpectation(expected)) {
    const passed = validateError(actual, expected.error);
    return {
      passed,
      reason: passed
        ? undefined
        : `Expected error "${expected.error}", got ${JSON.stringify(actual)}`,
    };
  }

  // Handle Date objects and markers
  const actualDate = toDate(actual);
  const expectedDate = toDate(expected);
  if (actualDate && expectedDate) {
    const passed = actualDate.getTime() === expectedDate.getTime();
    return {
      passed,
      reason: passed
        ? undefined
        : `Date mismatch: ${actualDate.toISOString()} vs ${expectedDate.toISOString()}`,
    };
  }

  const passed = deepEqual(actual, expected);
  return {
    passed,
    reason: passed
      ? undefined
      : `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
  };
}

function toDate(v: any): Date | null {
  if (v instanceof Date) return v;
  if (typeof v === "string") {
    if (v.startsWith("[Date ") && v.endsWith("]"))
      return new Date(v.slice(6, -1));
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v))
      return new Date(v);
  }
  return null;
}

function isErrorExpectation(obj: any): obj is { error: string } {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "error" in obj &&
    Object.keys(obj).length === 1
  );
}

function validateError(actual: any, expectedError: string): boolean {
  if (actual === null || actual === undefined) return false;
  const actualMsg =
    typeof actual === "string"
      ? actual
      : actual.error ||
        actual.message ||
        (actual.stack ? String(actual) : JSON.stringify(actual));
  return actualMsg.includes(expectedError);
}

function deepEqual(a: unknown, b: unknown, seen = new WeakMap()): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;

  const aDate = toDate(a);
  const bDate = toDate(b);
  if (aDate && bDate) return aDate.getTime() === bDate.getTime();

  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  ) {
    if (typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b))
      return true;
    return false;
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (seen.has(a)) return seen.get(a) === b;
  seen.set(a, b);

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      // Handle sparse arrays: check if both have the key or both don't
      const hasA = i in a;
      const hasB = i in b;
      if (hasA !== hasB) return false;
      if (hasA && !deepEqual(a[i], b[i], seen)) return false;
    }
    return true;
  }

  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual((a as any)[key], (b as any)[key], seen)) return false;
  }

  return true;
}
