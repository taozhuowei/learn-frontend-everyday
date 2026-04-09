# Learn Front-end Everyday

Browser-based front-end practice platform. Users write code in Monaco editor, the judge engine evaluates it in real-time, and the site deploys automatically to GitHub Pages.

## Directory Structure

```
.
├── website/        # React SPA, build scripts, tests         → see website/README.md
├── judge/          # Sandboxed judge engine (4 runners)      → see judge/README.md
├── problems/       # Problem source code + test case data    → see problems/README.md
├── docs/           # Knowledge-base markdown articles        → see docs/README.md
└── .github/        # CI/CD workflow
```

## Data Flow

```
problems/ ──┐
             ├─ build-content.ts ─→ website/src/generated/*.ts ─→ React SPA
docs/    ──┘                                                        │
                                                                     ├─ Monaco Editor
judge/src/ ──────── @judge alias ──→ codeRunnerWorker.ts ──────────┘
```

- `build-content.ts` scans `problems/` and `docs/` at build time, outputs static TypeScript data files.
- The SPA loads these files at runtime. User code is sent to a Web Worker that invokes `@judge` for evaluation.
- `judge/` is referenced via Vite alias (`@judge → ../judge/src`), compiled together with the website — no separate build step.

## CI/CD

Workflow: `.github/workflows/deploy-pages.yml`

```
push to main
    │
    ├─ test    Vitest (unit + integration) → Playwright (E2E)
    │
    ├─ build   yarn build → upload artifact
    │
    └─ deploy  GitHub Pages
```

Tests must pass before build. Build must pass before deploy.

## Local Development

```bash
cd website
yarn install
yarn start          # dev server at http://127.0.0.1:5173
```

## Testing

```bash
cd website
yarn test:unit              # Vitest unit + integration
yarn test:unit:coverage     # with coverage report
yarn test:e2e               # Playwright E2E (needs Chrome)
yarn test:e2e:headed        # E2E with visible browser
yarn test                   # all tests
```

## Conventions

- File/directory names: `snake_case`
- Components/classes: `PascalCase`
- Functions: `camelCase`
- Variables: `snake_case`
- Commit format: `type: description` (feat / fix / refactor / test / docs / chore)
- All code comments and terminal commands in English. User-facing reports in Chinese.
