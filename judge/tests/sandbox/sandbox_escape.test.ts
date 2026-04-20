import { describe, it, expect } from 'vitest'
import { extractExport, extractPrototype } from '../../src/sandbox/entry_extractor'
import { runInWorkerSandbox } from '../../src/sandbox/sandbox_builder'

describe('Sandbox Security Escapes', () => {
  describe('entry_extractor', () => {
    it('should NOT allow access to Node.js process via new Function', async () => {
      const maliciousCode = `
        export default function malicious() {
          return typeof process !== 'undefined' ? process.env : null;
        }
      `
      
      const fnCode = extractExport(maliciousCode)
      const contract: any = { runner: 'function-call', entry: { type: 'export', name: 'default' } }
      const testCase: any = { input: { target: 'null', args: [] } }

      // Execution must NOT return the process object.
      const { actual } = await runInWorkerSandbox(contract, testCase, fnCode)
      expect(actual).toBeNull()
    })

    it('should NOT allow access to globalThis via prototype extraction', async () => {
      const maliciousCode = `
        Array.prototype.malicious = function() {
          return globalThis;
        }
      `
      
      const fnCode = extractPrototype(maliciousCode, 'Array', 'malicious')
      const contract: any = { runner: 'method-call', entry: { type: 'prototype', name: 'malicious' } }
      const testCase: any = { input: { target: '[]', args: [] } }

      try {
        const { actual } = await runInWorkerSandbox(contract, testCase, fnCode)
        // If it somehow manages to return it, ensure it's not the main thread process
        expect((actual as any)?.process).toBeUndefined()
      } catch (e: any) {
        // Cloning globalThis throws an error, which is the expected secure behavior
        expect(e.message).toContain('could not be cloned')
      }
    })
  })

  describe('sandbox_builder', () => {
    it('should prevent prototype chain escape via constructor.constructor', async () => {
      const maliciousCode = `
        export default function() {
          try {
            // Attempt to get the global Function constructor and execute code
            const globalFunction = this.constructor.constructor;
            const getProcess = globalFunction('return typeof process !== "undefined" ? process : null');
            return getProcess();
          } catch (e) {
            return null; // Secured if throws or undefined
          }
        }
      `
      
      const fnCode = extractExport(maliciousCode)
      const contract: any = { runner: 'function-call', entry: { type: 'export', name: 'default' } }
      const testCase: any = { input: { target: 'null', args: [] } }

      const { actual } = await runInWorkerSandbox(contract, testCase, fnCode)
      // In a Node Web Worker, process might be accessible if explicitly passed, but by default it isn't.
      // We expect it not to leak the main thread's process object.
      expect(actual).toBeNull()
    })
  })
})
