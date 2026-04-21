/**
 * Module: build-content
 * Purpose: Scan docs sources, apply practice import rules, and generate website content artifacts.
 */

import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import {
  getCategoryName,
  getExecutionConfig,
  hasSkipTag,
  humanizeSlug,
  validateTestCases,
} from './content_rules.mjs'

// New format test case (from judge)
interface NewTestCase {
  id: string
  hidden: boolean
  input: {
    target?: string
    args?: string[]
    steps?: unknown[]
    props?: Record<string, unknown>
  }
  expected: unknown
}

// Old format test case (legacy)
interface OldTestCase {
  target: string
  args: string[]
  expected: unknown
  noCustomCase?: boolean
}

type AnyTestCase = NewTestCase | OldTestCase

interface TestCases {
  examples: AnyTestCase[]
  hidden: AnyTestCase[]
  noCustomCase?: boolean
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

function extractSkeleton(rawSource: string, isComponent: boolean): string {
  const source = stripHeaderComment(rawSource)

  if (isComponent) {
    // For components, we want to keep imports and constants at the top,
    // but empty out the bodies of functions and classes.
    // A simple regex-based approach for common React/Vue patterns:
    return source
      .replace(
        /(export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{)([\s\S]*?)(\})/g,
        '$1\n  // 在此编写你的实现\n$3',
      )
      .replace(
        /(export\s+default\s+class\s+\w+[\s\S]*?\{)([\s\S]*?)(\})/g,
        '$1\n  // 在此编写你的实现\n$3',
      )
  }

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
          result += depth === 0 ? indent + '\n}' : indent + '\n}\n'
        } else {
          result += c
        }
      } else if (depth === 0) {
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

function validateJsSource(_relativePath: string, _source: string) {
  // Logic removed: We now allow and encourage export default in JS files
  // for judge compatibility.
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
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extractHeadings(markdown: string) {
  const counters = new Map<string, number>()
  const headings: Array<{ depth: number; text: string; slug: string }> = []

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

function buildDisplayInput(tc: AnyTestCase): string {
  // new format
  if ('input' in tc && typeof tc.input === 'object') {
    const newTc = tc as NewTestCase
    if (newTc.input.steps && newTc.input.steps.length > 0) {
      return `[${newTc.input.steps.length} steps]`
    }
    const target = newTc.input.target ?? ''
    const args = (newTc.input.args ?? []).join(', ')
    return args ? `${target}(${args})` : target
  }
  // old format
  const oldTc = tc as OldTestCase
  const args = oldTc.args.join(', ')
  return args ? `${oldTc.target}(${args})` : oldTc.target
}

function buildDisplayParts(tc: AnyTestCase): { displayTarget?: string; displayArgs?: string[] } {
  if ('input' in tc && typeof tc.input === 'object') {
    const newTc = tc as NewTestCase
    if (newTc.input.steps && newTc.input.steps.length > 0) return {}
    return {
      displayTarget: newTc.input.target,
      // Copy the array to avoid circular reference in safeStringify (WeakSet detects same ref twice)
      displayArgs: newTc.input.args ? [...newTc.input.args] : undefined,
    }
  }
  const oldTc = tc as OldTestCase
  return {
    displayTarget: oldTc.target,
    displayArgs: oldTc.args ? [...oldTc.args] : undefined,
  }
}

function getCaseId(tc: AnyTestCase, index: number, prefix: string): string {
  if ('id' in tc && typeof tc.id === 'string') return tc.id
  return `${prefix}-${index + 1}`
}

function loadTestCases(filePath: string, categoryId: string): TestCases {
  // 组件题（Vue/React）不需要测试文件，人工确认即可
  if (categoryId === 'with_vue' || categoryId === 'with_react') {
    return { examples: [], hidden: [] }
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`${toPosix(path.relative(repoRoot, filePath))} 缺少同级测试文件。`)
  }

  const sandbox = {
    module: { exports: {} as TestCases },
    exports: {},
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Promise,
  }

  const source = fs.readFileSync(filePath, 'utf8')
  vm.runInNewContext(source, sandbox, { filename: filePath, timeout: 1000 })

  const testCases = sandbox.module.exports
  validateTestCases(testCases, toPosix(path.relative(repoRoot, filePath)))

  return testCases as TestCases
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
    const categoryId = relativeKey.split('/')[0]
    const testCases = loadTestCases(testPath, categoryId)

    const stem = path.basename(relativeKey)
    const sourceType = path.extname(filePath).slice(1)
    const executionConfig = getExecutionConfig(sourceType)

    const isComponent = executionConfig.executionMode === 'component'

    // Build Template with LeetCode-style definitions and automatic export
    let template = extractSkeleton(source, isComponent)

    if (executionConfig.executionMode === 'browser') {
      const dataStructureDefinitions: Record<string, string> = {
        linkedlist: `/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n\n`,
        tree: `/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n\n`,
      }

      const header = dataStructureDefinitions[categoryId] || ''

      // Find actual function name in the source to avoid keyword or mismatch issues
      const firstFuncMatch = source.match(/^function\s+([\w$]+)/m)
      const exportName = firstFuncMatch ? firstFuncMatch[1] : stem

      // Append export default if not already present in the skeleton
      const footer = template.includes('export default') ? '' : `\n\nexport default ${exportName}`
      template = header + template + footer
    }

    const solutionCodeFull = stripHeaderComment(source)
    let solutionCode = solutionCodeFull
    if (
      executionConfig.executionMode === 'browser' &&
      !solutionCodeFull.includes('export default')
    ) {
      const firstFuncMatch = source.match(/^function\s+([\w$]+)/m)
      const exportName = firstFuncMatch ? firstFuncMatch[1] : stem
      if (!/^(new|instanceof|extends)$/.test(exportName)) {
        solutionCode += `\n\nexport default ${exportName}`
      }
    }

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
      template,
      solutionCode,
      testCases,
      // 兼容性字段（支持新旧两种格式）
      basicCases: testCases.examples.map((c, i) => ({
        id: getCaseId(c, i, 'example'),
        type: 'basic' as const,
        description: `示例 ${i + 1}`,
        input: buildDisplayInput(c),
        ...buildDisplayParts(c),
        expected: c.expected,
      })),
      fullCases: [
        ...testCases.examples.map((c, i) => ({
          id: getCaseId(c, i, 'example'),
          type: 'basic' as const,
          description: `示例 ${i + 1}`,
          input: buildDisplayInput(c),
          ...buildDisplayParts(c),
          expected: c.expected,
        })),
        ...testCases.hidden.map((c, i) => ({
          id: getCaseId(c, i, 'hidden'),
          type: 'edge' as const,
          description: `隐藏 ${i + 1}`,
          input: buildDisplayInput(c),
          ...buildDisplayParts(c),
          expected: c.expected,
        })),
      ],
      // 组件题标记（无需判题，人工确认）
      isComponent: executionConfig.executionMode === 'component',
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

/**
 * 安全的 JSON 序列化，处理循环引用和 undefined 值
 */
function safeStringify(obj: unknown): string {
  const seen = new WeakSet()
  return JSON.stringify(
    obj,
    (key, value) => {
      // 处理 undefined 值，转换为特殊标记保留
      if (value === undefined) {
        return '__UNDEFINED__'
      }
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]'
        }
        seen.add(value)
      }
      return value
    },
    2,
  ).replace(/"__UNDEFINED__"/g, 'undefined')
}

function main() {
  const problems = buildProblems()
  const knowledgeArticles = buildKnowledge()
  const browserProblems = problems.filter((problem) => problem.executionMode === 'browser')
  const componentProblems = problems.filter((problem) => problem.executionMode === 'component')
  const localProblems = problems.filter((problem) => problem.executionMode === 'local')

  writeGeneratedFile(
    'problems.ts',
    `import type { ProblemRecord } from '../types/content'

export const problems: ProblemRecord[] = ${safeStringify(problems)}
`,
  )

  writeGeneratedFile(
    'knowledge.ts',
    `import type { KnowledgeArticle } from '../types/content'

export const knowledgeArticles: KnowledgeArticle[] = ${safeStringify(knowledgeArticles)}
`,
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
        basicCaseCount: problem.testCases.examples.length,
        fullCaseCount: problem.testCases.examples.length + problem.testCases.hidden.length,
      })),
      null,
      2,
    )}
`,
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
    )}
`,
  )

  console.log(
    `Generated ${problems.length} problems and ${knowledgeArticles.length} knowledge articles.`,
  )
}

main()
