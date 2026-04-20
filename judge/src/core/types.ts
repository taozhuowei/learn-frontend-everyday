export type HelperName =
  | "arrayToList"
  | "listToArray"
  | "arrayToTree"
  | "treeToArray";

export interface ProblemContract {
  entry: {
    type: "prototype" | "export" | "class" | "component";
    name: string;
    host?: string; // e.g. 'Array', 'Function'
  };
  runner:
    | "method-call"
    | "function-call"
    | "behavioral"
    | "async"
    | "component";
  validator: "deep-equal" | "error-match" | "behavioral" | "dom";
  context?: {
    helpers?: HelperName[];
    virtualClock?: boolean;
    disableNative?: string[]; // e.g. ['Array.prototype.filter']
  };
}

export type Step =
  | { type: "call"; args?: any[] }
  | { type: "tick"; ms: number }
  | { type: "await" }
  | { type: "assert"; check: string; expected: any };

export type DomAssertion =
  | { type: "text"; selector: string; expected: string }
  | { type: "visible"; selector: string; expected: boolean }
  | { type: "count"; selector: string; expected: number }
  | { type: "attr"; selector: string; attr: string; expected: string };

export interface TestCase {
  id: string;
  hidden: boolean;
  input: {
    target?: string;
    args?: string[];
    steps?: Step[];
    props?: Record<string, unknown>;
  };
  expected:
    | unknown
    | { error: string }
    | { callCount?: number; maxConcurrent?: number; hasError?: boolean }
    | { assertions: DomAssertion[] };
}

export interface CaseResult {
  id: string;
  passed: boolean;
  actual: unknown;
  expected: unknown;
  error?: string;
  meta?: {
    callCount?: number;
    timing?: number;
    maxConcurrent?: number;
  };
}

export interface JudgeResult {
  problemId: string;
  passed: boolean;
  cases: CaseResult[];
  duration: number;
}

export interface TestFile {
  examples: TestCase[];
  hidden: TestCase[];
}
