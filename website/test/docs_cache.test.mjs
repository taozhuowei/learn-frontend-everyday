/**
 * Module: docs_cache.test
 * Purpose: Verify docs cache input discovery, hashing, and generated-artifact checks.
 */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  collectDocsInputFiles,
  createDocsInputsState,
  hasGeneratedArtifacts,
} from '../scripts/docs_cache.mjs'

test('collectDocsInputFiles ignores launcher directories and keeps same-directory tests', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-cache-'))
  const docsRoot = path.join(tempRoot, 'docs')
  const practiceRoot = path.join(docsRoot, '实践')
  const utilityRoot = path.join(practiceRoot, 'utility')
  const launcherRoot = path.join(practiceRoot, 'with_react', 'launcher')

  fs.mkdirSync(utilityRoot, { recursive: true })
  fs.mkdirSync(launcherRoot, { recursive: true })
  fs.writeFileSync(path.join(docsRoot, 'README.md'), '# Docs\n', 'utf8')
  fs.writeFileSync(path.join(utilityRoot, 'debounce.js'), 'function debounce() {}\n', 'utf8')
  fs.writeFileSync(
    path.join(utilityRoot, 'debounce_test.js'),
    "module.exports = [{ input: 'demo', expected: 1 }]\n",
    'utf8',
  )
  fs.writeFileSync(path.join(launcherRoot, 'index.html'), '<div></div>\n', 'utf8')

  const files = collectDocsInputFiles(docsRoot).map((filePath) =>
    path.relative(tempRoot, filePath).replace(/\\/g, '/'),
  )

  assert.deepEqual(files, [
    'docs/README.md',
    'docs/实践/utility/debounce.js',
    'docs/实践/utility/debounce_test.js',
  ])

  fs.rmSync(tempRoot, { recursive: true, force: true })
})

test('createDocsInputsState changes when docs sources change', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-state-'))
  const docsRoot = path.join(tempRoot, 'docs')

  fs.mkdirSync(docsRoot, { recursive: true })
  fs.writeFileSync(path.join(docsRoot, 'README.md'), '# One\n', 'utf8')

  const firstFiles = collectDocsInputFiles(docsRoot)
  const firstState = createDocsInputsState(tempRoot, firstFiles)

  fs.writeFileSync(path.join(docsRoot, 'README.md'), '# Two\n', 'utf8')

  const secondFiles = collectDocsInputFiles(docsRoot)
  const secondState = createDocsInputsState(tempRoot, secondFiles)

  assert.notEqual(firstState.hash, secondState.hash)

  fs.rmSync(tempRoot, { recursive: true, force: true })
})

test('hasGeneratedArtifacts requires all generated content files', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'generated-artifacts-'))
  const generatedRoot = path.join(tempRoot, 'src', 'generated')

  fs.mkdirSync(generatedRoot, { recursive: true })
  fs.writeFileSync(path.join(generatedRoot, 'knowledge.ts'), '', 'utf8')
  fs.writeFileSync(path.join(generatedRoot, 'manifest.ts'), '', 'utf8')
  fs.writeFileSync(path.join(generatedRoot, 'problems.ts'), '', 'utf8')

  assert.equal(hasGeneratedArtifacts(tempRoot), false)

  fs.writeFileSync(path.join(generatedRoot, 'test-manifest.ts'), '', 'utf8')

  assert.equal(hasGeneratedArtifacts(tempRoot), true)

  fs.rmSync(tempRoot, { recursive: true, force: true })
})
