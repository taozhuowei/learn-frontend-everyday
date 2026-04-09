# Docs

Knowledge-base markdown articles. Scanned by `website/scripts/build-content.ts` at build time and served as the "Theory" section of the website.

## Directory Structure

```
docs/
├── AI/             AI-related articles
├── 前端基础/       HTML, CSS, JavaScript fundamentals
├── 前端框架/       React, Vue framework concepts
├── 工程化/         Build tools, bundlers, CI/CD
├── 算法/           Algorithm and data structure theory
├── 网络/           HTTP, TCP, browser networking
├── 运行时/         Browser runtime, event loop, V8
├── 面试准备/       Interview preparation materials
├── 其他语言/       Non-JavaScript language references
└── 实践/           Practice-related docs + component launchers
    ├── with_react/launcher/   React local dev environment
    └── with_vue/launcher/     Vue local dev environment
```

## Article Format

Standard Markdown. The first `# Heading` becomes the article title. All headings build the table of contents.

No special frontmatter or metadata required — the build script extracts everything it needs from the Markdown content.

## Build Integration

- `website/scripts/build-content.ts` scans `docs/**/*.md` (excluding `node_modules`, `dist`, `launcher`).
- Output: `website/src/generated/knowledge.ts` — array of `KnowledgeArticle` objects with markdown content, headings, and search text.
- The build caches docs input state; unchanged docs skip regeneration.

## Relationship to Other Modules

- Problem source code and test cases are in [problems/](../problems/README.md), not here.
- Component launchers (`实践/with_react/launcher`, `实践/with_vue/launcher`) are standalone Vite projects for local development of React/Vue component problems.
