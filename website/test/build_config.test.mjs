/**
 * Module: build_config.test
 * Purpose: Verify shared bundle chunk rules used by the production build.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import { getManualChunk } from '../scripts/build_config.mjs'

test('manual chunk rules split editor and markdown dependencies', () => {
  assert.equal(getManualChunk('/workspace/website/src/generated/knowledge.ts'), 'knowledge-data')
  assert.equal(getManualChunk('/workspace/website/src/generated/problems.ts'), 'problem-data')
  assert.equal(
    getManualChunk('/workspace/website/node_modules/@monaco-editor/react/dist/index.js'),
    'editor-react',
  )
  assert.equal(
    getManualChunk('/workspace/website/node_modules/monaco-editor/esm/vs/editor/editor.api.js'),
    'editor-core',
  )
  assert.equal(
    getManualChunk(
      '/workspace/website/node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js',
    ),
    'editor-language',
  )
  assert.equal(
    getManualChunk('/workspace/website/node_modules/react-markdown/index.js'),
    'markdown-runtime',
  )
  assert.equal(
    getManualChunk('/workspace/website/node_modules/react-syntax-highlighter/dist/esm/index.js'),
    'syntax-highlighter',
  )
})
