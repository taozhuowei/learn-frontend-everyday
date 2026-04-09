# Judge

Sandboxed code evaluation engine. Compiles user code, runs it against test cases, and returns pass/fail results with diffs.

## Architecture

```
JudgeCore.run(problemId, userCode, testFile)
    │
    ├─ problem_registry  → ProblemContract (entry type, runner, validator, context)
    │
    ├─ Runner (execute user code)
    │   ├─ method_call_runner    Array.prototype.myFilter etc.
    │   ├─ function_call_runner  curry, reverseList etc.
    │   ├─ behavioral_runner     debounce, throttle (virtual clock)
    │   └─ async_runner          Promise, promiseAll
    │
    └─ Validator (compare result)
        ├─ deep_equal_validator  Structural equality (handles NaN, circular refs)
        └─ behavioral_validator  callCount, maxConcurrent, hasError
```

## Directory Structure

```
judge/src/
├── index.ts                    # Public API: exports JudgeCore + types
├── core/
│   ├── judge_core.ts           # Orchestrator: runner + validator per test case
│   ├── problem_registry.ts     # 34 problem contracts (entry, runner, validator, context)
│   └── types.ts                # ProblemContract, TestCase, CaseResult, JudgeResult
├── runners/
│   ├── method_call_runner.ts   # Injects user impl onto prototype, calls with args
│   ├── function_call_runner.ts # Extracts default export, converts data structures
│   ├── behavioral_runner.ts    # Virtual clock + mock function, executes step sequences
│   └── async_runner.ts         # Handles class-based Promise and export-based async fns
├── validators/
│   ├── deep_equal_validator.ts # Deep structural comparison with error-match support
│   └── behavioral_validator.ts # Checks callCount, maxConcurrent, hasError
├── sandbox/
│   ├── sandbox_builder.ts      # Proxy-based sandbox (with statement), disableNativeMethod
│   ├── entry_extractor.ts      # extractPrototype, extractExport, extractClass
│   ├── helpers.ts              # ListNode, TreeNode, arrayToList/Tree, listToArray/Tree
│   └── virtual_clock.ts        # Fake setTimeout/setInterval/Date.now with tick()
└── utils/
    └── mock_fn.ts              # Mock function with callCount/calls/reset
```

## Problem Contract

Each problem registers a contract in `problem_registry.ts`:

```ts
registerContract('filter', {
  entry: { type: 'prototype', name: 'myFilter', host: 'Array' },
  runner: 'method-call',
  validator: 'deep-equal',
  context: { disableNative: ['Array.prototype.filter'] }
})
```

| Field | Purpose |
|-------|---------|
| `entry.type` | How to extract user code: `prototype` / `export` / `class` |
| `runner` | Which runner executes the test case |
| `validator` | Which validator checks the result |
| `context.disableNative` | Native methods to disable during execution |
| `context.helpers` | Data structure converters: `arrayToList`, `arrayToTree`, etc. |
| `context.virtualClock` | Enable fake timers for behavioral tests |

## Integration

Not a standalone package. Referenced by `website` via Vite alias:

```ts
// website/vite.config.ts
resolve: { alias: { '@judge': path.resolve(__dirname, '../judge/src') } }
```

Adding a new problem requires:
1. Register contract in `problem_registry.ts`
2. Create `problems/<category>/<name>.js` with JSDoc
3. Create `problems/<category>/<name>_test.js` with test cases
