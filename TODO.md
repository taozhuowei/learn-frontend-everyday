# CodeForge (Learn Frontend Everyday) - 开发与重构计划 (TODO)

## 📌 核心治理规则 (Rules & Mandates)

本重构计划严格遵循全局 `GEMINI.md` 规范。任何 Agent 违反以下禁令，视为任务执行失败：

1. **强制测试先行**：在修改任何业务代码或修复漏洞前，必须先在 Phase A 完善对应的测试用例（包括暴露漏洞的恶意用例）。禁止在无测试保护网的情况下重构。
2. **强制隔离审计**：每一次代码变更（即使是一行代码），必须经过独立的 `Code Reviewer` 审计。**写代码的 Agent 绝对不能审查自己写的代码。**
3. **审计依赖文档**：`Code Reviewer` 在审计时，**必须强制加载并核查 `judge/DESIGN.md`、`PRD.md` 等相关设计文档**，确保改动没有破坏既有架构边界或偏离需求。禁止脱离设计文档的“盲审”。
4. **禁止跳过验收**：任何 Phase 结束前，必须严格执行**阶段验收门 (Acceptance Gates)**，并输出包含测试结果的验收报告。禁止以“代码看起来正确”为由直接推进状态。

---

## 🤖 Agent 分工与协同机制 (Agent Roles & Workflow)

为了保障系统架构完整性和代码质量，本次重构采用多 Agent 协同流转模式：

### 1. 角色定义
* **Orchestrator (主控/规划者)**: 负责维护本 `TODO.md`，制定计划，向实现 Agent 下发标准 Brief，检查各阶段验收门，推进任务状态。**不直接编写业务代码**。
* **Developer Agents (实现者)**: 
  * `test-results-analyzer`: 专职补全 E2E 测试、沙盒逃逸测试架构与用例。
  * `security-engineer`: 专职修复沙盒环境提权与隔离漏洞。
  * `optimize`: 专职负责 Vite/Monaco 构建性能调优。
  * `frontend-developer` & `animate`: 专职负责 UI 骨架屏、交互动效重构。
* **Code Reviewer (独立审计员 - 强制环节)**: 专职代码审计。接收变更文件与 Brief，核对设计文档。**输出二选一结论：`PASS` 或 `NEEDS WORK`（附具体修改建议）。**

### 2. 标准 Brief 格式
Orchestrator 向 Developer Agent 分发任务时，必须采用以下格式：
```text
FILE: <待修改文件路径>
DO: <具体要实现的逻辑>
REF: <相关的 DESIGN.md 章节或 PRD 需求>
CONSTRAINTS: <关键约束，如：必须维持响应时间低于200ms>
FORBIDDEN: <明确禁止项，如：禁止使用 eval>
```

### 3. 多步骤状态流转机制 (Definition of Done)
任务必须按以下状态依序流转，禁止跳阶：
* `[ ]` **待处理**: 初始状态。
* `[>]` **开发完成 (待审计)**: Developer Agent 已提交代码，并在本地运行基础测试通过。任务移交 `Code Reviewer`。
* `[?]` **审计通过 (待验收)**: `Code Reviewer` 审查通过，确认符合 `DESIGN.md` 和代码规范。等待最后的全量测试跑通或人工走查。
* `[x]` **彻底完成**: 阶段验收门通过，测试全绿，报告已输出。

---

## 📅 阶段验收策略 (Phase Acceptance Gates)

在进入下一个 Phase 之前，Orchestrator 必须确保当前 Phase 满足以下全部验收条件，并出具**验收报告**：

1. **审计闭环**: 当前阶段的所有子任务均有 `Code Reviewer` 的明确 `PASS` 记录。如果仍有 `NEEDS WORK` 状态的任务，禁止进入下一阶段。
2. **测试全绿**: 运行全量测试（如 `vitest run`、`playwright test`），覆盖率未下降，所有红队用例（逃逸用例）和正常业务用例全部通过。
3. **架构一致性检查**: 确认重构后的模块依赖关系未破坏 `judge/DESIGN.md` 规定的单向执行管道。
4. **性能/安全验证**: 针对安全 Phase，必须证明原有漏洞用例已失效；针对性能 Phase，构建产物大小及警告符合预期。

---

## 🚀 阶段执行计划 (Phases & Tasks)

### 🛡️ Phase A: 自动化测试架构与用例补全 (优先基建)
*目标：在重构高危逻辑前，建立稳固的回归测试安全网。*
*协同流转：`test-results-analyzer` 实现 -> `code-reviewer` 审计*

- [x] **A1: E2E 测试环境配置与核心链路覆盖**
  - **范围**: `website/package.json`, `website/playwright.config.ts`, `website/test/e2e/`
  - **任务**: 配置完整的 Playwright 测试环境。编写核心 E2E 链路用例：“打开平台 -> 进入题目 -> 输入代码 -> 点击提交 -> 断言 DOM 结果为 Pass/Fail”。
  - **验收标准**: Playwright 配置正确可用，一条串联“加载、输入、运行、看结果”的 e2e 测试脚本可被重复执行通过。
  - **验收点**:
    1. 可运行 `npm run test:e2e` 不抛错。
    2. E2E 用例模拟真实点击、代码输入及 DOM 结构断言。
    3. `Code Reviewer` 审查确认选择器不易碎。

- [x] **A2: 补充 `judge/src/sandbox` 的逃逸测试用例**
  - **范围**: `judge/tests/sandbox/`
  - **任务**: 针对现有的 `sandbox_builder.ts` 和 `entry_extractor.ts` 编写单元测试。**必须编写出能够触发当前 XSS / 原型链逃逸漏洞的恶意用例**，证明漏洞存在（Red 阶段），为后续 B 阶段的修复提供明确的验收标准。
  - **验收标准**: 提供恶意输入并导致当前评测机提权或执行恶意脚本，使得当前 `vitest` 测试必定抛出安全警告或失败（验证漏洞存在）。
  - **验收点**:
    1. 包含针对 `new Function` 的 `entry_extractor.ts` 越权访问测试用例。
    2. 包含针对 `sandbox_builder.ts` 利用 `constructor.constructor` 逃逸的测试用例。
    3. 当前状态下运行该测试应表现为测试成功地“触发”了漏洞（攻击成功）。

### 🔐 Phase B: 沙盒安全漏洞修复 (P0/P1)
*目标：彻底消除 `entry_extractor` 和 `sandbox_builder` 的代码执行提权漏洞。*
*协同流转：`security-engineer` 实现 -> `code-reviewer` 审计*

- [x] **B1: 重构 `entry_extractor.ts` 消除裸露 `new Function`** (P0)
  - **范围**: `judge/src/sandbox/entry_extractor.ts`, `judge/package.json`
  - **任务**: 移除宿主环境下直接调用的 `new Function`。要求采用基于 AST（如 `acorn`）的静态分析方案或严格的 Worker 隔离方案提取用户代码。
  - **验收标准**: 取消使用原生 `new Function` 进行模块提取，且 A2 中的提取层逃逸测试用例由“攻击成功”变为“被安全拦截”。
  - **验收点**:
    1. 源码中不再存在全局调用的 `new Function`。
    2. 成功处理各类 ES6 `export default` 的源码转换。
    3. 所有核心评测用例回归全部 `PASS`。

- [x] **B2: 升级 `sandbox_builder.ts` 为强隔离层** (P1)
  - **范围**: `judge/src/sandbox/sandbox_builder.ts`, `judge/src/core/judge_core.ts`
  - **任务**: 依照 `judge/DESIGN.md`，将基于 `Proxy+with` 的基础沙盒升级为完全隔离的 Web Worker。所有通信必须通过 `postMessage` 序列化，杜绝任何对宿主环境原型链的访问。
  - **验收标准**: 执行代码运行在 Worker 或严格的 iframe 沙箱中，彻底阻断与主界面的 DOM 及全局对象的内存联系。
  - **验收点**:
    1. 采用 `Worker` / `iframe` API 实现环境隔离。
    2. 必须处理异步超时和并发场景，评测机正常判定。
    3. A2 中的原型链逃逸用例必须全部失败（攻击无法穿透沙箱）。

### ⚡ Phase C: 性能与工程化调优 (P2)
*目标：解决 `@monaco-editor/react` 带来的包体积膨胀与首屏阻塞问题。*
*协同流转：`optimize` 实现 -> `code-reviewer` 审计*

- [x] **C1: Monaco Editor 的极致异步分包**
  - **范围**: `website/vite.config.ts`, `website/scripts/build_config.mjs`, `website/src/components/CodeWorkspace.tsx`
  - **任务**: 将 monaco-editor 抽离为独立的 chunk。在 `CodeWorkspace.tsx` 中使用 `React.lazy` + `Suspense` 动态导入编辑器，确保首屏加载不被阻塞。
  - **验收标准**: `monaco-editor` 核心依赖被构建产物隔离，并实现按需异步加载，控制应用主 chunk (< 500KB)。
  - **验收点**:
    1. Vite build 后输出分析中 `monaco` 单独成包。
    2. 使用了 `React.lazy` 或类似动态 `import()` 包装。
    3. 运行项目首屏加载瀑布图中编辑器加载不阻断核心框架。

- [x] **C2: 首屏加载依赖与路由懒加载梳理**
  - **范围**: `website/src/App.tsx`, 路由配置文件
  - **任务**: 确保路由级别的懒加载全面生效，检查并消除由于错误的顶级 import 导致的代码全量打包问题。
  - **验收标准**: 页面级组件实现严格路由切分，`npm run build` 不出现巨大 Vendor Chunk 警告。
  - **验收点**:
    1. 各页面 (Page Components) 采用 `React.lazy`。
    2. React Router 配置中使用了 `Suspense` 作为路由占位。
    3. 构建警告控制在配置限额以内。

### ✨ Phase D: 动效交互与情感化体验增强 (P2)
*目标：为生硬的 UI 注入生命力，提升“刷题”的情绪反馈，并遵循物理直觉的动画标准。*
*协同流转：`animate` 实现 -> `code-reviewer` 审计*

- [x] **D1: 编辑器与页面的骨架屏 (Skeleton) 过渡**
  - **范围**: `website/src/components/LoadingPanel.tsx`, `website/src/components/CodeWorkspace.tsx`
  - **任务**: 弃用干转的 Spinner，设计并实现符合 Tailwind v4 规范的脉冲骨架屏（Pulse Skeleton），平滑覆盖代码编辑器初始化与题目详情的加载态。
  - **验收标准**: 在任何模块加载延迟的场景下展示流畅的脉冲呼吸式骨架占位屏，符合视觉无感过渡要求。
  - **验收点**:
    1. 新增 `animate-pulse` 等基于 Tailwind v4 的骨架动画组件。
    2. 应用于 `React.lazy` 的 Fallback 以及组件初始化拉取数据时。
    3. 不再有生硬的空白闪烁现象。

- [x] **D2: 引入 `framer-motion` 重构状态流转**
  - **范围**: `website/package.json`, `website/src/components/CasePanel.tsx`, `website/src/pages/ExamSessionPage.tsx`
  - **任务**: 安装 `framer-motion`。将代码运行后从“执行中”到“展示用例结果”的 UI 切换，重构为带有物理缓动的级联展开动画（Staggered fade-in），时长约束在 150-300ms。
  - **验收标准**: 列表和面板在插入、切换和移除时有平滑且带有物理直觉的动画（基于 framer-motion）。
  - **验收点**:
    1. `package.json` 包含 `framer-motion`。
    2. Case 结果列表呈现交错进场（Stagger）动画，60fps 性能。
    3. 组件生命周期（挂载/卸载）由 `AnimatePresence` 托管。

- [x] **D3: 实现成功判定庆祝动效 (Success Delight)**
  - **范围**: `website/src/components/CasePanel.tsx` 或相关结果展示层
  - **任务**: 当判定所有 Case 均为 `passed: true` 时，触发微型庆祝交互（如平滑的绿色 Checkmark 连笔动画或局部的粒子效果）。确保动效不会阻断用户进行“下一题”等后续操作。
  - **验收标准**: 在全部测试用例通过后，界面上产生不阻塞流程的显著情绪正反馈（庆祝动画）。
  - **验收点**:
    1. 包含针对 `all_passed` 状态的专门动效渲染逻辑.
    2. 动画视觉上清晰（例如颜色转绿，SVG Checkmark drawing 或粒子系统）。
    3. 动效播完或交互后自动回收，不发生内存泄露。

- [x] **D4: 重构判题执行引擎状态逻辑并修复提交反馈**
  - **原因**: `LearnPage` 与 `ExamSessionPage` 存在大量重复的判题状态控制逻辑，且导致了提交后 UI 不更新的 Bug。
  - **任务**: 
    1. **重构优先**: 提取 `useProblemExecution` 自定义 Hook，统一管理 `running` 状态、`sampleExecution` 与 `consoleExecution`。
    2. **修复反馈**: 确保 `submit` 模式下正确更新状态。并在 `CasePanel` 中适配展示隐藏用例的失败详情（LeetCode 模式）。
  - **验收标准**: 点击提交后，学习与考试模式均能看到用例实时状态，隐藏用例失败可查。
  - **验收点**:
    1. 消除两个 Page 间的重复代码（DRY）。
    2. 提交后右侧列表立即显示判定结果。

- [x] **D5: 统一 Slug 算法修复理论知识目录跳转**
  - **原因**: 构建脚本生成的 Slug 丢弃了中文，导致与运行时 `rehype-slug` 生成的 ID 不匹配。
  - **任务**: 修改 `scripts/build-content.ts` 中的 `sanitizeSlug` 函数，使其兼容中文字符与 URL 规范。
  - **验收标准**: 目录点击能正确定位到正文中对应的中文标题。
  - **验收点**:
    1. `yarn build` 后生成的 `knowledge.ts` 中的 slug 包含中文拼音或原始中文（取决于算法选择）。
    2. 点击 TOC 侧边栏，页面平滑滚动。

- [x] **D6: 考试模式多题提交状态保持一致性**
  - **任务**: 确保考试模式下单题提交后，该题目的“已提交”状态能实时反馈在侧边栏。
  - **验收点**:
    1. 点击单题提交，侧边栏状态变更为“已提交”。
