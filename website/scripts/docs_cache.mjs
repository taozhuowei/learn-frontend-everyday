/**
 * Module: docs_cache
 * Purpose: Compute and persist docs input state for build-time cache reuse.
 */

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const GENERATED_FILES = Object.freeze([
  'knowledge.ts',
  'manifest.ts',
  'problems.ts',
  'test-manifest.ts',
])

/**
 * Collect docs input files that affect generated website content.
 *
 * @param {string} docsRoot
 * @returns {string[]}
 */
export function collectDocsInputFiles(docsRoot) {
  const files = []

  walkDocsTree(docsRoot, files)

  return files.sort()
}

/**
 * Create a stable state object for the current docs inputs.
 *
 * @param {string} repoRoot
 * @param {string[]} files
 * @returns {{ hash: string, files: string[] }}
 */
export function createDocsInputsState(repoRoot, files) {
  const hash = crypto.createHash('sha1')
  const relativeFiles = files.map((filePath) =>
    path.relative(repoRoot, filePath).replace(/\\/g, '/'),
  )

  files.forEach((filePath, index) => {
    hash.update(relativeFiles[index])
    hash.update('\n')
    hash.update(fs.readFileSync(filePath))
    hash.update('\n')
  })

  return {
    hash: hash.digest('hex'),
    files: relativeFiles,
  }
}

/**
 * Read the previously saved docs cache state.
 *
 * @param {string} statePath
 * @returns {{ hash: string, files: string[] } | null}
 */
export function readDocsInputsState(statePath) {
  if (!fs.existsSync(statePath)) {
    return null
  }

  try {
    return JSON.parse(fs.readFileSync(statePath, 'utf8'))
  } catch {
    return null
  }
}

/**
 * Persist the current docs cache state.
 *
 * @param {string} statePath
 * @param {{ hash: string, files: string[] }} state
 * @returns {void}
 */
export function writeDocsInputsState(statePath, state) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true })
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8')
}

/**
 * Check whether generated content artifacts already exist.
 *
 * @param {string} websiteRoot
 * @returns {boolean}
 */
export function hasGeneratedArtifacts(websiteRoot) {
  return GENERATED_FILES.every((fileName) =>
    fs.existsSync(path.join(websiteRoot, 'src', 'generated', fileName)),
  )
}

/**
 * Return the default on-disk cache path for docs state.
 *
 * @param {string} websiteRoot
 * @returns {string}
 */
export function getDocsStatePath(websiteRoot) {
  return path.join(websiteRoot, '.cache', 'docs-input-state.json')
}

/**
 * Decide whether a docs directory entry should be skipped.
 *
 * @param {string} entryName
 * @returns {boolean}
 */
function shouldSkipDir(entryName) {
  return (
    entryName === 'node_modules' ||
    entryName === 'dist' ||
    entryName === '.git' ||
    entryName.endsWith('_launcher')
  )
}

/**
 * Walk the docs directory tree and collect relevant source files.
 *
 * @param {string} currentDir
 * @param {string[]} files
 * @returns {void}
 */
function walkDocsTree(currentDir, files) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name)

    if (entry.isDirectory()) {
      if (shouldSkipDir(entry.name)) {
        continue
      }

      walkDocsTree(fullPath, files)
      continue
    }

    if (!entry.isFile()) {
      continue
    }

    if (/\.(md|js|jsx|tsx|vue)$/i.test(entry.name)) {
      files.push(fullPath)
    }
  }
}
