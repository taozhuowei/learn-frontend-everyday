/**
 * Module: build-content
 * Purpose: Scan docs sources, apply practice import rules, and generate website content artifacts.
 */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import {
  getBasicCases,
  getCategoryName,
  getExecutionConfig,
  hasSkipTag,
  humanizeSlug,
  normalizeCaseDefinitions,
} from './content_rules.mjs'

type MinimalCase = {
  input: string
  expected: unknown
}

type KnowledgeHeading = {
  depth: number
  text: string
  slug: string
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const websiteRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(websiteRoot, '..')
const docsRoot = path.join(repoRoot, 'docs')
const practiceRoot = path.join(repoRoot, 'problems')
const generatedRoot = path.join(websiteRoot, 'src', 'generated')

function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function toPosix(filePath: string) {
  return filePath.replace(/\\/g, '/')
}

function cleanTagContent(block: string) {
  return block
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .filter(Boolean)
    .join('\n')
}

function extractTag(source: string, tagName: string) {
  const match = source.match(new RegExp(`@${tagName}([\\s\\S]*?)(?=@[a-zA-Z]+|\\*/)`))
  return match ? cleanTagContent(match[1]) : ''
}

function stripHeaderComment(source: string) {
  return source.replace(/^\s*\/\*\*[\s\S]*?\*\/\s*/m, '').trim()
}

/**
 * Extract a function/class skeleton from source code.
 * Keeps function and method signatures, replaces bodies with empty {}.
 * Handles: prototype extensions, standalone functions, class declarations.
 */
function extractSkeleton(rawSource: string): string {
  const source = stripHeaderComment(rawSource)

  let result = ''
  let i = 0
  let depth = 0
  const braceIsClass: boolean[] = []
  const braceIndent: string[] = []
  let inString = false
  let stringChar = ''
  let inLineComment = false
  let inBlockComment = false

  function isOutputting(): boolean {
    for (let d = 0; d < depth; d++) {
      if (!braceIsClass[d]) return false
    }
    return true
  }

  while (i < source.length) {
    const c = source[i]
    const next = source[i + 1] ?? ''

    if (inString) {
      if (isOutputting()) result += c
      if (c === '\\') {
        i++
        if (isOutputting()) result += source[i]
        i++
        continue
      }
      if (c === stringChar) inString = false
      i++
      continue
    }

    if (inLineComment) {
      if (c === '\n') {
        inLineComment = false
        if (isOutputting()) result += c
      }
      i++
      continue
    }

    if (inBlockComment) {
      if (c === '*' && next === '/') {
        inBlockComment = false
        i += 2
      } else {
        i++
      }
      continue
    }

    if (c === '/' && next === '/') {
      inLineComment = true
      i += 2
      continue
    }

    if (c === '/' && next === '*') {
      inBlockComment = true
      i += 2
      continue
    }

    if (c === '"' || c === "'" || c === '`') {
      inString = true
      stringChar = c
      if (isOutputting()) result += c
      i++
      continue
    }

    if (c === '{') {
      const lineStart = source.lastIndexOf('\n', i - 1) + 1
      const precedingLine = source.slice(lineStart, i)
      const isClass = /\bclass\b/.test(precedingLine)
      const indent = (precedingLine.match(/^(\s*)/) ?? ['', ''])[1]

      if (isOutputting()) {
        result += c
        if (!isClass) result += '\n'
      }

      braceIsClass[depth] = isClass
      braceIndent[depth] = indent
      depth++
      i++
      continue
    }

    if (c === '}') {
      depth--
      const wasClass = braceIsClass[depth]
      const indent = braceIndent[depth]
      braceIsClass.pop()
      braceIndent.pop()

      if (isOutputting()) {
        if (!wasClass) {
          // Add a blank line before closing brace so template has room to write code
          result += depth === 0 ? indent + '\n}' : indent + '\n}\n'
        } else {
          result += c
        }
      } else if (depth === 0) {
        // Closing the outermost function body
        result += '\n\n}'
      }

      i++
      continue
    }

    if (isOutputting()) result += c
    i++
  }

  return result.replace(/\n{3,}/g, '\n\n').trim()
}

function validateJsSource(relativePath: string, source: string) {
  if (!relativePath.endsWith('.js')) {
    return
  }

  if (/^\s*export\s+/m.test(source) || /module\.exports/.test(source)) {
    throw new Error(`${relativePath} 仍然包含导出语法，JS 题目源码需要保持为单一可执行实现。`)
  }
}

function walkMarkdownFiles(currentDir: string, bucket: string[] = []) {
  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    const fullPath = path.join(currentDir, entry.name)

    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name) || entry.name === 'launcher') {
        continue
      }

      walkMarkdownFiles(fullPath, bucket)
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      bucket.push(fullPath)
    }
  }

  return bucket
}

function walkProblemFiles(currentDir: string, bucket: string[] = []) {
  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    const fullPath = path.join(currentDir, entry.name)

    if (entry.isDirectory()) {
      if (['node_modules', 'dist'].includes(entry.name) || entry.name === 'launcher') {
        continue
      }

      walkProblemFiles(fullPath, bucket)
      continue
    }

    if (!entry.isFile()) {
      continue
    }

    if (!/\.(js|jsx|tsx|vue)$/i.test(entry.name)) {
      continue
    }

    if (/_test\.js$/i.test(entry.name)) {
      continue
    }

    bucket.push(fullPath)
  }

  return bucket.sort()
}

function sanitizeSlug(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extractHeadings(markdown: string) {
  const counters = new Map<string, number>()
  const headings: KnowledgeHeading[] = []

  for (const line of markdown.split('\n')) {
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (!match) {
      continue
    }

    const text = match[2].trim()
    const base = sanitizeSlug(text) || 'section'
    const nextCount = (counters.get(base) ?? 0) + 1
    counters.set(base, nextCount)

    headings.push({
      depth: match[1].length,
      text,
      slug: nextCount === 1 ? base : `${base}-${nextCount}`,
    })
  }

  return headings
}

function stripMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]+]\([^)]*\)/g, '$1')
    .replace(/[#>*_\-\n\r]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildKnowledge() {
  return walkMarkdownFiles(docsRoot).map((filePath, index) => {
    const markdown = fs.readFileSync(filePath, 'utf8')
    const relativePath = toPosix(path.relative(repoRoot, filePath))
    const fallbackTitle = path.basename(filePath, '.md')
    const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? fallbackTitle
    const category = relativePath.split('/')[1] ?? '未分类'

    return {
      slug: `${String(index + 1).padStart(3, '0')}-${sanitizeSlug(fallbackTitle) || 'article'}`,
      title,
      category,
      sourcePath: relativePath,
      markdown,
      headings: extractHeadings(markdown),
      searchText: `${title} ${category} ${stripMarkdown(markdown)}`.toLowerCase(),
    }
  })
}

function loadTestDefinition(filePath: string): MinimalCase[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${toPosix(path.relative(repoRoot, filePath))} 缺少同级测试文件。`)
  }

  const sandbox = {
    module: { exports: [] as MinimalCase[] },
    exports: {},
  }

  const source = fs.readFileSync(filePath, 'utf8')
  vm.runInNewContext(source, sandbox, { filename: filePath, timeout: 1000 })

  return sandbox.module.exports
}

function buildProblems() {
  const problemRecords = []

  for (const filePath of walkProblemFiles(practiceRoot)) {
    const relativePath = toPosix(path.relative(practiceRoot, filePath))
    const relativeKey = relativePath.replace(/\.(js|jsx|tsx|vue)$/i, '')
    const source = fs.readFileSync(filePath, 'utf8')

    validateJsSource(relativePath, source)

    if (hasSkipTag(source)) {
      continue
    }

    const description = extractTag(source, 'description')
    const approachText = extractTag(source, 'approach')
    const paramsText = extractTag(source, 'params')
    const returnText = extractTag(source, 'return')

    if (!description || !approachText || !paramsText || !returnText) {
      throw new Error(
        `${relativePath} 缺少统一注释字段，必须包含 description / approach / params / return。`,
      )
    }

    const testPath = path.join(path.dirname(filePath), `${path.basename(relativeKey)}_test.js`)
    const rawCases = loadTestDefinition(testPath)
    const fullCases = normalizeCaseDefinitions(rawCases, toPosix(path.relative(repoRoot, testPath)))
    const basicCases = getBasicCases(fullCases)
    const stem = path.basename(relativeKey)
    const categoryId = relativeKey.split('/')[0]
    const sourceType = path.extname(filePath).slice(1)
    const executionConfig = getExecutionConfig(sourceType)

    problemRecords.push({
      id: stem,
      slug: stem,
      sequence: problemRecords.length + 1,
      title: humanizeSlug(stem),
      categoryId,
      categoryName: getCategoryName(categoryId),
      sourceType,
      executionMode: executionConfig.executionMode,
      launcherPath: executionConfig.launcherPath,
      description,
      approachText,
      paramsText,
      returnText,
      // Component problems display the full source code; only function problems use the skeleton
      template:
        executionConfig.executionMode === 'component'
          ? stripHeaderComment(source)
          : extractSkeleton(source),
      solutionCode: stripHeaderComment(source),
      basicCases,
      fullCases,
      sourcePath: toPosix(path.relative(repoRoot, filePath)),
      testPath: toPosix(path.relative(repoRoot, testPath)),
    })
  }

  return problemRecords
}

function writeGeneratedFile(fileName: string, body: string) {
  ensureDir(generatedRoot)
  fs.writeFileSync(path.join(generatedRoot, fileName), body, 'utf8')
}

function main() {
  const problems = buildProblems()
  const knowledgeArticles = buildKnowledge()
  const browserProblems = problems.filter((problem) => problem.executionMode === 'browser')
  const componentProblems = problems.filter((problem) => problem.executionMode === 'component')
  const localProblems = problems.filter((problem) => problem.executionMode === 'local')

  writeGeneratedFile(
    'problems.ts',
    `import type { ProblemRecord } from '../types/content'\n\nexport const problems: ProblemRecord[] = ${JSON.stringify(problems, null, 2)}\n`,
  )

  writeGeneratedFile(
    'knowledge.ts',
    `import type { KnowledgeArticle } from '../types/content'\n\nexport const knowledgeArticles: KnowledgeArticle[] = ${JSON.stringify(knowledgeArticles, null, 2)}\n`,
  )

  writeGeneratedFile(
    'test-manifest.ts',
    `export const generatedTestManifest = ${JSON.stringify(
      problems.map((problem) => ({
        problemId: problem.id,
        title: problem.title,
        categoryId: problem.categoryId,
        categoryName: problem.categoryName,
        executionMode: problem.executionMode,
        basicCaseCount: problem.basicCases.length,
        fullCaseCount: problem.fullCases.length,
      })),
      null,
      2,
    )}\n`,
  )

  writeGeneratedFile(
    'manifest.ts',
    `export const generatedManifest = ${JSON.stringify(
      {
        problems: problems.length,
        browserProblems: browserProblems.length,
        componentProblems: componentProblems.length,
        localProblems: localProblems.length,
        knowledgeArticles: knowledgeArticles.length,
      },
      null,
      2,
    )}\n`,
  )

  console.log(
    `Generated ${problems.length} problems and ${knowledgeArticles.length} knowledge articles.`,
  )
}

main()
