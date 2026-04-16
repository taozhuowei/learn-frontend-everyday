# Problems

Problem source code and test case data. Each problem is a self-contained JS file with a same-level `_test.js` file.

## Directory Structure

```
problems/
├── array/          5 problems   Array.prototype polyfills (filter, map, reduce, forEach, flat)
├── function/       3 problems   Function.prototype polyfills (call, apply, bind)
├── object/         4 problems   Object utilities (new, instanceof, deep_copy, extends)
├── promise/        3 problems   Promise implementation (promise, promise_all, promise_race)
├── tree/           6 problems   Tree traversal (preorder, inorder, postorder, levelorder, maxDepth, isValidBST)
├── linkedlist/     4 problems   Linked list (reverseList, mergeTwoLists, hasCycle, findCycleEntry)
├── utility/        7 problems   Utility functions (curry, flatten, deepClone, debounce, throttle, scheduler, task_queue_runner)
├── with_react/     React component problems + launcher/
└── with_vue/       Vue component problems + launcher/
```

## Problem File Format

Every `.js` file must have a JSDoc header with all 4 tags:

```js
/**
 * @description What to implement, input/output semantics, edge cases
 * @approach Explanation of the solution strategy
 * @params Parameter descriptions
 * @return Return value description
 */
Array.prototype.myFilter = function (callback, thisArg) {
  // implementation
};
```

Rules:

- Pure `.js` files must NOT contain `export` / `module.exports` (the judge extracts code directly).
- Add `@skip` tag to exclude a file from the website build.
- First-level directory name = `categoryId` (maps to display name via `content_rules.mjs`).

## Test File Format

Named `<problem>_test.js`, same directory as the problem file.

```js
module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: { target: "[1,2,3]", args: ["x => x > 1"] },
      expected: [2, 3],
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: { target: "[]", args: ["x => true"] },
      expected: [],
    },
  ],
};
```

| Field          | Purpose                                                               |
| -------------- | --------------------------------------------------------------------- |
| `examples`     | Visible to user during practice, used for "Run"                       |
| `hidden`       | Only used for "Submit", not shown in advance                          |
| `input.target` | JS expression string, evaluated in sandbox                            |
| `input.args`   | Array of JS expression strings, evaluated as function arguments       |
| `input.steps`  | Behavioral sequence for debounce/throttle (call, tick, await, assert) |
| `expected`     | Expected return value, or `{ error: 'message' }` for error cases      |
| `noCustomCase` | Set `true` to disable user-defined custom test cases (e.g., Promise)  |

## Adding a New Problem

1. Create `problems/<category>/<name>.js` with JSDoc header + solution code.
2. Create `problems/<category>/<name>_test.js` with examples + hidden test cases.
3. Register the problem contract in `judge/src/core/problem_registry.ts`.
4. Run `cd website && yarn build` — the build script auto-discovers new files.
5. Verify: the problem appears in the website's learn list.

## Relationship to Other Modules

- `website/scripts/build-content.ts` scans this directory at build time, extracts JSDoc + skeleton + test cases, and writes `website/src/generated/problems.ts`.
- `judge/src/core/problem_registry.ts` maps each problem ID to its execution contract (runner type, validator, helpers).
- The directory name is the category ID; display names are mapped in `website/scripts/content_rules.mjs`.
