# Website

React SPA that consumes `problems/` and `docs/` content, provides a browser-based code practice environment, and deploys to GitHub Pages.

## Tech Stack

| Layer     | Choice                                 |
| --------- | -------------------------------------- |
| Framework | React 19 + React Router 7 (HashRouter) |
| Styling   | Tailwind CSS 4                         |
| Editor    | Monaco Editor                          |
| Build     | Vite 8                                 |
| Unit Test | Vitest 4 + @vitest/coverage-v8         |
| E2E Test  | Playwright                             |
| Language  | TypeScript 5.9                         |

## Directory Structure

```
website/
├── vite.config.ts              # Vite config (aliases: @→src, @judge→../judge/src)
├── vitest.config.ts            # Vitest config (unit + integration tests)
├── playwright.config.ts        # Playwright config (CI-compatible)
├── scripts/
│   ├── start.mjs               # Dev server + build entry
│   ├── build-content.ts        # Scans problems/ + docs/ → src/generated/*
│   ├── build_pipeline.mjs      # Build orchestrator (format, cache, tsc, vite)
│   ├── build_config.mjs        # Chunk splitting config
│   ├── content_rules.mjs       # Category names, execution mode, test validation
│   └── docs_cache.mjs          # Docs input hash cache
├── src/
│   ├── pages/                  # Route pages
│   │   ├── HomePage.tsx            # Navigation hub
│   │   ├── LearnListPage.tsx       # Problem list
│   │   ├── LearnPage.tsx           # Practice mode (editor + judge)
│   │   ├── ComponentLearnPage.tsx  # React/Vue component practice
│   │   ├── ExamEntryPage.tsx       # Exam configuration
│   │   ├── ExamSessionPage.tsx     # Exam session (timer + multi-problem)
│   │   ├── ExamResultPage.tsx      # Score display
│   │   ├── TheoryListPage.tsx      # Knowledge article list
│   │   └── TheoryArticlePage.tsx   # Article reader
│   ├── components/             # Shared UI components
│   │   ├── CodeWorkspace.tsx       # Monaco editor wrapper
│   │   ├── CasePanel.tsx           # Test results + console logs
│   │   ├── SplitPane.tsx           # Draggable split layout
│   │   └── ...
│   ├── context/
│   │   └── AppStateContext.tsx     # Exam state (useReducer + localStorage)
│   ├── route/
│   │   └── AppRoutes.tsx          # Route definitions
│   ├── types/                  # TypeScript interfaces
│   ├── utils/                  # Pure utility functions
│   ├── workers/
│   │   └── codeRunnerWorker.ts    # Web Worker: invokes @judge for evaluation
│   └── generated/              # Build output (DO NOT edit manually)
│       ├── problems.ts
│       ├── knowledge.ts
│       ├── manifest.ts
│       └── test-manifest.ts
└── test/
    ├── unit/
    │   ├── judge/              # Judge module unit tests (sandbox, validators, utils)
    │   ├── utils/              # exam.ts tests
    │   └── scripts/            # content_rules tests
    ├── integration/
    │   └── judge/              # JudgeCore full-flow tests (all 4 runner types)
    └── e2e/
        ├── learn_path.spec.ts  # Learn mode E2E
        └── exam_path.spec.ts   # Exam mode E2E
```

## Commands

```bash
yarn start              # Dev server (http://127.0.0.1:5173)
yarn build              # Full production build (format → content gen → tsc → vite)
yarn test:unit          # Vitest unit + integration
yarn test:unit:coverage # With V8 coverage report
yarn test:e2e           # Playwright E2E (headless)
yarn test:e2e:headed    # Playwright E2E (visible browser)
yarn test               # All tests
```

## Content Pipeline

```
problems/**/*.js  ─┐
problems/**/*_test.js ─┤  build-content.ts  ─→  src/generated/problems.ts
docs/**/*.md      ─┘                        ─→  src/generated/knowledge.ts
```

- Build scans directories, extracts JSDoc metadata, loads test cases, generates typed TypeScript data files.
- Docs input is cached (`.cache/docs-input-state.json`); unchanged content skips regeneration.
- Validation at build time: missing JSDoc tags, missing test files, invalid test format → build failure.

## Deployment

- GitHub Actions workflow: `.github/workflows/deploy-pages.yml`
- Pipeline: `test → build → deploy` (tests gate the build)
- `vite.config.ts` auto-detects `GITHUB_REPOSITORY` and sets `base` for Pages subpath
- HashRouter avoids GitHub Pages SPA routing issues

## Aliases

| Alias    | Target         | Used by                           |
| -------- | -------------- | --------------------------------- |
| `@`      | `./src`        | All source files                  |
| `@judge` | `../judge/src` | `codeRunnerWorker.ts`, test files |
