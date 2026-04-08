# Judge System Design

前端本地判题系统架构设计文档。

---

## 定位与边界

| 模块 | 职责 |
|------|------|
| `problems/` | 题目源码、测试用例数据 |
| `judge/` | 判题执行逻辑（本模块） |
| `website/` | UI 展示，构建时引入 judge |

judge 在浏览器中运行（随 website 打包为静态资源），**不依赖任何 Node.js API**。所有执行与沙箱逻辑均基于浏览器原生能力实现。

---

## 核心模型

### 执行管道

每次判题经历五个阶段，阶段间通过统一接口传递数据：

```
userCode + problemId
    │
    ▼
① ProblemRegistry      → 读取 ProblemContract（题目契约）
    │
    ▼
② SandboxBuilder       → 构造隔离执行环境（注入 helpers、禁用原生方法）
    │
    ▼
③ EntryExtractor       → 从用户代码中提取实现（prototype / export / class）
    │
    ▼
④ Runner               → 按题型执行用例（method-call / behavioral / async / component）
    │
    ▼
⑤ Validator            → 验证结果，输出 CaseResult[]
```

### 题目契约（ProblemContract）

每道题声明一个契约，驱动管道各阶段的行为：

```typescript
interface ProblemContract {
  // 用户代码应暴露的内容
  entry: {
    type: 'prototype'   // 扩展原型方法，如 Array.prototype.myFilter
         | 'export'     // export default function / const
         | 'class'      // export default class
         | 'component'  // export default Vue/React 组件
    name: string        // 方法名或导出名，如 'myFilter' | 'default' | 'MyPromise'
    host?: string       // prototype 专用，宿主对象，如 'Array' | 'Function'
  }

  // 运行策略
  runner: 'method-call'    // target.method(...args)
        | 'function-call'  // fn(target, ...args)
        | 'behavioral'     // 步骤脚本驱动，用于时序行为测试
        | 'async'          // await expression（Promise 题）
        | 'component'      // mount + interact + DOM assert

  // 验证策略
  validator: 'deep-equal'   // 深比较返回值
           | 'error-match'  // 期望抛出指定错误类型
           | 'behavioral'   // 验证 callCount / timing 等行为指标
           | 'dom'          // DOM 结构断言

  // 执行环境配置
  context?: {
    helpers?: HelperName[]        // 注入辅助函数（数据结构转换等）
    virtualClock?: boolean        // 注入虚拟时钟（用于防抖/节流）
    disableNative?: string[]      // 禁用原生方法，如 'Array.prototype.filter'
  }
}

type HelperName = 'arrayToList' | 'listToArray' | 'arrayToTree' | 'treeToArray'
```

**各题型契约示例：**

```js
// Array polyfill（filter / map / reduce 等）
{
  entry: { type: 'prototype', name: 'myFilter', host: 'Array' },
  runner: 'method-call',
  validator: 'deep-equal',
  context: { disableNative: ['Array.prototype.filter'] }
}

// 链表算法（reverseList / hasCycle 等）
{
  entry: { type: 'export', name: 'default' },
  runner: 'function-call',
  validator: 'deep-equal',
  context: { helpers: ['arrayToList', 'listToArray'] }
}

// 防抖（行为测试）
{
  entry: { type: 'export', name: 'default' },
  runner: 'behavioral',
  validator: 'behavioral',
  context: { virtualClock: true }
}

// MyPromise
{
  entry: { type: 'class', name: 'default' },
  runner: 'async',
  validator: 'deep-equal'
}

// Vue 组件
{
  entry: { type: 'component', name: 'default' },
  runner: 'component',
  validator: 'dom'
}
```

---

## 测试用例格式

所有题型共享同一格式，部分字段按 runner 类型启用：

```typescript
interface TestCase {
  id: string
  hidden: boolean  // 隐藏用例不在学习模式展示

  input: {
    target?: string    // eval 后作为 this 或第一入参，如 "[1,2,3,4]"
    args?: string[]    // eval 后作为额外参数，如 ["x => x > 2"]
    steps?: Step[]     // behavioral 专用：交互步骤序列
    props?: object     // component 专用：初始 props
  }

  expected:
    | any                           // deep-equal：深比较期望值
    | { error: string }             // error-match：期望抛出的错误类型
    | { callCount?: number          // behavioral：行为指标
        maxConcurrent?: number
        hasError?: boolean }
    | { assertions: DomAssertion[] } // dom：DOM 结构断言
}
```

**behavioral 步骤格式（`Step`）：**

```typescript
type Step =
  | { type: 'call'; args?: any[] }              // 调用被测函数
  | { type: 'tick'; ms: number }                // 虚拟时钟快进
  | { type: 'await' }                           // 等待微任务队列清空
  | { type: 'assert'; check: string; expected: any }  // 中间断言
```

**component 断言格式（`DomAssertion`）：**

```typescript
type DomAssertion =
  | { type: 'text';    selector: string; expected: string }
  | { type: 'visible'; selector: string; expected: boolean }
  | { type: 'count';   selector: string; expected: number }
  | { type: 'attr';    selector: string; attr: string; expected: string }
```

---

## 各 Runner 实现

### method-call（Array / Function / Object polyfill）

```
适用：filter、map、reduce、call、apply、bind、instanceof、new 等
```

```js
// 沙箱内执行流程
const target = eval(input.target)           // 构造调用者
target[entry.name] = userImpl               // 注入用户实现
const result = target[entry.name](
  ...input.args.map(a => eval(a))
)
```

反作弊：执行前将 `Array.prototype.filter`（等）设为 `undefined`，防止用户直接调用原生。

### function-call（Utility / LinkedList / Tree）

```
适用：deepClone、curry、flatten、reverseList、preorder 等
```

```js
const fn = extractExport(userCode)
const raw = eval(input.target)

// 数据结构题：输入自动转换
const arg = contract.context?.helpers?.includes('arrayToList')
  ? helpers.arrayToList(raw)
  : raw

const result = fn(arg, ...input.args.map(a => eval(a)))

// 数据结构题：结果自动反转换
return contract.context?.helpers?.includes('listToArray')
  ? helpers.listToArray(result)
  : result
```

### behavioral（Debounce / Throttle / Scheduler / TaskQueue）

```
适用：有时序依赖、需要验证调用行为而非返回值的题型
```

```js
const fn = extractExport(userCode)
const mockFn = createMockFn()    // 记录 callCount、参数、this
const clock = new VirtualClock() // 替换 setTimeout/setInterval

// 注入：debounce(mockFn, delay)
const wrapped = fn(mockFn, parseDelay(input))

for (const step of input.steps) {
  switch (step.type) {
    case 'call':   wrapped(...(step.args ?? []));  break
    case 'tick':   clock.tick(step.ms);            break
    case 'await':  await flushMicrotasks();        break
    case 'assert': runStepAssert(step, { mockFn, clock }); break
  }
}

return { callCount: mockFn.callCount, ... }
```

**VirtualClock 实现原理：**  
在用户代码执行前，将 `setTimeout` / `setInterval` / `clearTimeout` / `Date.now` 替换为受控版本，`clock.tick(ms)` 同步触发到期的所有回调。执行结束后恢复原始函数。

### async（Promise 实现题）

```
适用：MyPromise、promise.all、promise.race 等
```

```js
const MyPromise = extractExport(userCode)

// target 是完整 Promise 表达式，在注入 MyPromise 后 eval
const ctx = { MyPromise, Promise: MyPromise }
const result = await evalInContext(input.target, ctx)
// 示例 target: "new MyPromise(r => r(42)).then(v => v * 2)"
```

### component（Vue / React 组件）

```
适用：Cascader、Countdown 等 UI 组件题
```

```js
const component = extractExport(userCode)
const wrapper = mount(component, { props: testCase.input.props })

// 执行交互序列
for (const action of testCase.input.interactions ?? []) {
  await interact(wrapper, action)
  // click(selector) / input(selector, value) / wait(ms)
}

// 验证 DOM 断言
for (const assertion of testCase.expected.assertions) {
  const actual = queryDom(wrapper, assertion)
  assert.equal(actual, assertion.expected)
}
```

---

## 沙箱层

**约束**：judge 在浏览器中运行，不可使用 Node.js `vm` 模块。

**基础沙箱（`Function` + `Proxy`）：**

```js
function createSandbox(context) {
  // 使用 with + Proxy 拦截变量访问
  const sandbox = new Proxy(context, {
    has: () => true,        // 所有变量查找都落在 sandbox
    get: (t, k) => t[k],
  })
  return new Function('sandbox',
    'with (sandbox) { return (function() { ' + userCode + ' })() }'
  ).call(null, sandbox)
}
```

**更强隔离（Web Worker / iframe）：**  
对于需要完全隔离的场景（防止用户代码访问全局 DOM / window），可在沙箱中创建一个隐藏的 `<iframe>` 或 Web Worker，在其独立 JS 环境中执行用户代码，通过 `postMessage` 传递结果。该策略用于组件题外的所有题型。

**反作弊（轻量级）：**

| 手段 | 目的 |
|------|------|
| 执行前 `Array.prototype.filter = undefined` | 禁用目标原生方法 |
| 静态扫描用户代码中的原生方法调用 | 提示"请实现原生方法" |
| 不封堵 `[].filter.call()` 等绕过路径 | 学习工具，非考试环境 |

---

## 统一结果格式

所有 runner 的输出统一为：

```typescript
interface CaseResult {
  id: string
  passed: boolean
  actual: any
  expected: any
  error?: string           // 执行异常信息
  meta?: {                 // behavioral runner 附加信息
    callCount?: number
    timing?: number
    maxConcurrent?: number
  }
}

interface JudgeResult {
  problemId: string
  passed: boolean          // 全部用例通过
  cases: CaseResult[]
  duration: number         // 总执行耗时 ms
}
```

---

## 题型与适配器对应表

| 题目 | runner | validator | 特殊上下文 |
|------|--------|-----------|-----------|
| filter / map / reduce / forEach | method-call | deep-equal | disableNative |
| call / apply / bind | method-call | deep-equal | disableNative |
| instanceof / new | function-call | deep-equal | — |
| deepClone / deepCopy | function-call | deep-equal | — |
| extends | function-call | deep-equal | — |
| reverseList / hasCycle / mergeTwoLists / findCycleEntry | function-call | deep-equal | arrayToList |
| preorder / inorder / postorder / levelorder / maxDepth / isValidBST | function-call | deep-equal | arrayToTree |
| curry / flatten / deepClone | function-call | deep-equal | — |
| debounce / throttle | behavioral | behavioral | virtualClock |
| scheduler / taskQueueRunner | behavioral | behavioral | virtualClock |
| MyPromise | async | deep-equal | — |
| promiseAll / promiseRace | async | deep-equal | — |
| Vue 组件（Cascader 等） | component | dom | jsdom / @vue/test-utils |
| React 组件（Countdown 等） | component | dom | jsdom / @testing-library/react |

---

## 目录结构

```
judge/
├── DESIGN.md                 # 本文档
├── src/
│   ├── index.ts              # 公开 API：JudgeCore.run(problemId, userCode)
│   ├── core/
│   │   ├── judge_core.ts     # 管道编排
│   │   ├── problem_registry.ts  # 题目契约注册表
│   │   └── types.ts          # 全局类型定义
│   ├── runners/
│   │   ├── method_call_runner.ts
│   │   ├── function_call_runner.ts
│   │   ├── behavioral_runner.ts
│   │   ├── async_runner.ts
│   │   └── component_runner.ts
│   ├── validators/
│   │   ├── deep_equal_validator.ts
│   │   ├── behavioral_validator.ts
│   │   └── dom_validator.ts
│   ├── sandbox/
│   │   ├── sandbox_builder.ts    # 构造沙箱环境
│   │   ├── entry_extractor.ts    # 从用户代码提取实现
│   │   ├── virtual_clock.ts      # 虚拟时间控制
│   │   └── helpers.ts            # arrayToList / arrayToTree 等
│   └── utils/
│       └── mock_fn.ts            # createMockFn（记录调用信息）
└── tests/
    ├── runners/              # 各 runner 单元测试
    ├── validators/           # 各 validator 单元测试
    └── sandbox/              # 沙箱隔离测试
```

**与 website 的集成（Vite path alias）：**

```ts
// website/vite.config.ts
resolve: {
  alias: {
    '@judge': path.resolve(__dirname, '../judge/src'),
  }
}

// website 内使用
import { JudgeCore } from '@judge'
```

---

## 扩展新题型

添加一种新题型只需：

1. 实现 `Runner` 接口（`src/runners/`，约 30-50 行）
2. 按需实现 `Validator` 接口（`src/validators/`，约 10-20 行）
3. 在 `ProblemContract` 的 runner/validator 联合类型中注册新类型名
4. 为新题目编写契约配置

已有题型的逻辑零影响。
