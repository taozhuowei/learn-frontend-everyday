import { describe, it, expect } from 'vitest'
import { extractExport } from '../../src/sandbox/entry_extractor'
import { runInWorkerSandbox } from '../../src/sandbox/sandbox_builder'

describe('Sandbox Security Escapes', () => {
  describe('entry_extractor', () => {
    it('should NOT allow access to Node.js process via new Function', async () => {
      const maliciousCode = 'export default function malicious() { return typeof process !== "undefined" ? process.env : null; }'
      const fnCode = extractExport(maliciousCode, 'unknown')
      const contract = { problemId: 'unknown', entry: { type: 'function', name: 'default' }, runner: 'function-call' } as any
      const testCase = { input: { target: 'null', args: [] } } as any
      const { actual } = await runInWorkerSandbox(contract, testCase, fnCode)
      expect(actual).toBeNull()
    })
  })
})