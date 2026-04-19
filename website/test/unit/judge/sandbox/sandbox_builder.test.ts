import { describe, it, expect } from 'vitest'
import { runInWorkerSandbox } from '@judge/sandbox/sandbox_builder'

describe('runInWorkerSandbox', () => {
  it('runs function-call runner in isolated worker', async () => {
    const contract: any = {
      runner: 'function-call',
      entry: { type: 'export', name: 'default' },
    }
    const testCase: any = {
      id: 'test-1',
      input: { target: '10', args: ['20'] }
    }
    const fnCode = `
      (function() {
        const module = { exports: {} };
        module.exports.default = (a, b) => a + b;
        return module.exports.default;
      })()
    `
    const { actual, meta } = await runInWorkerSandbox(contract, testCase, fnCode)
    expect(actual).toBe(30)
  })

  it('sandbox restricts access to node process object', async () => {
    const contract: any = {
      runner: 'function-call',
      entry: { type: 'export', name: 'default' },
    }
    const testCase: any = {
      id: 'test-2',
      input: { target: 'null' }
    }
    const fnCode = `
      (function() {
        return function() {
          return typeof process !== 'undefined' ? process.pid : null;
        }
      })()
    `
    const { actual } = await runInWorkerSandbox(contract, testCase, fnCode)
    // worker_threads in Node.js do not have `process` globally unless explicitly passed,
    // but a proper web worker has no process. It should return null.
    expect(actual).toBeNull()
  })
})
