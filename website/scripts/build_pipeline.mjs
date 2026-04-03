/**
 * Module: build_pipeline
 * Purpose: Execute the production build pipeline, including docs cache reuse.
 */

import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import {
  collectDocsInputFiles,
  createDocsInputsState,
  getDocsStatePath,
  hasGeneratedArtifacts,
  readDocsInputsState,
  writeDocsInputsState,
} from './docs_cache.mjs'

const scriptsDir = path.dirname(fileURLToPath(import.meta.url))
const websiteRoot = path.resolve(scriptsDir, '..')
const repoRoot = path.resolve(websiteRoot, '..')
const docsRoot = path.join(repoRoot, 'docs')
const problemsRoot = path.join(repoRoot, 'problems')

const prettierCli = path.join(websiteRoot, 'node_modules', 'prettier', 'bin', 'prettier.cjs')
const tsxCli = path.join(websiteRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs')
const tscCli = path.join(websiteRoot, 'node_modules', 'typescript', 'bin', 'tsc')
const viteCli = path.join(websiteRoot, 'node_modules', 'vite', 'bin', 'vite.js')
const buildContentScript = path.join(websiteRoot, 'scripts', 'build-content.ts')
const docsStatePath = getDocsStatePath(websiteRoot)

/**
 * Run a command and stream its output.
 *
 * @param {string} command
 * @param {string[]} args
 * @param {string} cwd
 * @returns {Promise<void>}
 */
function runCommand(command, args, cwd = websiteRoot) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: false,
    })

    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`))
    })

    child.on('error', reject)
  })
}

/**
 * Run Prettier for the website-owned source files.
 *
 * @returns {Promise<void>}
 */
async function formatWebsiteFiles() {
  await runCommand(
    process.execPath,
    [
      prettierCli,
      '--write',
      './README.md',
      './PRD.md',
      './src/**/*.{ts,tsx,css}',
      './scripts/**/*.{ts,mjs,json}',
      './test/**/*.{ts,mjs}',
    ],
    websiteRoot,
  )
}

/**
 * Run Prettier against docs inputs when the docs cache is stale.
 *
 * @param {string[]} docsFiles
 * @returns {Promise<void>}
 */
async function formatDocsFiles(docsFiles) {
  if (docsFiles.length === 0) {
    return
  }

  await runCommand(process.execPath, [prettierCli, '--write', ...docsFiles], repoRoot)
}

/**
 * Return the current docs state snapshot.
 *
 * @returns {{ docsFiles: string[], docsState: { hash: string, files: string[] } }}
 */
function getCurrentDocsState() {
  const docsFiles = [...collectDocsInputFiles(docsRoot), ...collectDocsInputFiles(problemsRoot)]
  const docsState = createDocsInputsState(repoRoot, docsFiles)

  return { docsFiles, docsState }
}

/**
 * Decide whether generated docs artifacts can be reused.
 *
 * @param {{ hash: string, files: string[] }} docsState
 * @returns {boolean}
 */
function canReuseDocsBuild(docsState) {
  const previousState = readDocsInputsState(docsStatePath)

  if (!previousState) {
    return false
  }

  if (!hasGeneratedArtifacts(websiteRoot)) {
    return false
  }

  return previousState.hash === docsState.hash
}

/**
 * Execute the only build pipeline exposed by the package.
 *
 * @returns {Promise<void>}
 */
export async function runBuildPipeline() {
  await formatWebsiteFiles()

  const initialDocsState = getCurrentDocsState()
  const shouldReuseDocs = canReuseDocsBuild(initialDocsState.docsState)

  if (shouldReuseDocs) {
    console.log('Docs unchanged, skip docs formatting and generated content rebuild.')
  } else {
    await formatDocsFiles(initialDocsState.docsFiles)
    await runCommand(process.execPath, [tsxCli, buildContentScript], repoRoot)

    const nextDocsState = getCurrentDocsState()
    writeDocsInputsState(docsStatePath, nextDocsState.docsState)
  }

  await runCommand(process.execPath, [tscCli, '-b'], websiteRoot)
  await runCommand(process.execPath, [viteCli, 'build'], websiteRoot)
}
