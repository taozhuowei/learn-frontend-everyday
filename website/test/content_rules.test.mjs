/**
 * Module: content_rules.test
 * Purpose: Verify practice test normalization, execution inference, and skip-tag parsing.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import {
  BASIC_CASE_COUNT,
  getBasicCases,
  getExecutionConfig,
  hasSkipTag,
  normalizeCaseDefinitions,
} from '../scripts/content_rules.mjs'

test('normalizeCaseDefinitions keeps the first three cases as the basic suite', () => {
  const fullCases = normalizeCaseDefinitions(
    [
      { input: 'case-1', expected: 1 },
      { input: 'case-2', expected: 2 },
      { input: 'case-3', expected: 3 },
      { input: 'case-4', expected: 4 },
      { input: 'case-5', expected: 5 },
    ],
    'docs/实践/utility/example_test.js',
  )

  assert.equal(fullCases.length, 5)
  assert.deepEqual(
    fullCases.map((item) => item.type),
    ['basic', 'basic', 'basic', 'edge', 'exception'],
  )
  assert.deepEqual(
    fullCases.map((item) => item.description),
    ['基础用例 1', '基础用例 2', '基础用例 3', '边界用例 1', '异常用例 1'],
  )
  assert.equal(getBasicCases(fullCases).length, BASIC_CASE_COUNT)
})

test('normalizeCaseDefinitions rejects incomplete simplified test files', () => {
  assert.throws(
    () =>
      normalizeCaseDefinitions(
        [
          { input: 'case-1', expected: 1 },
          { input: 'case-2', expected: 2 },
        ],
        'docs/实践/utility/example_test.js',
      ),
    /至少需要 5 条完整用例/,
  )
})

test('execution config is inferred from the source type', () => {
  assert.deepEqual(getExecutionConfig('js'), {
    executionMode: 'browser',
    launcherPath: null,
  })
  assert.deepEqual(getExecutionConfig('jsx'), {
    executionMode: 'local',
    launcherPath: 'docs/实践/with_react/launcher',
  })
  assert.deepEqual(getExecutionConfig('vue'), {
    executionMode: 'local',
    launcherPath: 'docs/实践/with_vue/launcher',
  })
})

test('hasSkipTag only depends on the presence of the @skip marker', () => {
  assert.equal(
    hasSkipTag(
      ['/**', ' * @description demo', ' * @skip', ' * @return demo output', ' */'].join('\n'),
    ),
    true,
  )
  assert.equal(
    hasSkipTag(['/**', ' * @description demo', ' * @return demo output', ' */'].join('\n')),
    false,
  )
})
