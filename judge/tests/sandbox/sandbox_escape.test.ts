import { describe, it, expect } from 'vitest'
import { extractExport, extractPrototype } from '../../src/sandbox/entry_extractor'
import { buildSandbox } from '../../src/sandbox/sandbox_builder'

describe('Sandbox Security Escapes', () => {
  describe('entry_extractor', () => {
    it('should NOT allow access to Node.js process via new Function', () => {
      // If the extractor uses new Function globally, this will succeed and return the process object.
      // We expect it to THROW or return undefined in a secure environment.
      const maliciousCode = `
        export default function malicious() {
          return typeof process !== 'undefined' ? process.env : null;
        }
      `
      
      // We expect the extraction itself or the execution of the extracted function to fail to access 'process'
      let fn;
      try {
        fn = extractExport(maliciousCode) as Function;
      } catch (e) {
        // If extraction throws due to strict parsing, that is secure.
        return;
      }
      
      // If extraction succeeds, execution must NOT return the process object.
      const result = fn();
      expect(result).toBeNull();
    })

    it('should NOT allow access to globalThis via prototype extraction', () => {
      const maliciousCode = `
        Array.prototype.malicious = function() {
          return globalThis;
        }
      `
      let fn;
      try {
        fn = extractPrototype(maliciousCode, 'Array', 'malicious') as Function;
      } catch(e) {
        return;
      }

      const result = fn();
      expect(result).not.toBe(globalThis);
    })
  })

  describe('sandbox_builder', () => {
    it('should prevent prototype chain escape via constructor.constructor', () => {
      const sandbox = buildSandbox({})
      
      const maliciousCode = `
        try {
          // Attempt to get the global Function constructor and execute code in global scope
          const globalFunction = this.constructor.constructor;
          const getProcess = globalFunction('return typeof process !== "undefined" ? process : null');
          return getProcess();
        } catch (e) {
          return null; // Secured if throws
        }
      `
      
      const result = sandbox(maliciousCode)
      // Secure sandbox should return null or undefined, not the actual process object
      expect(result).toBeNull()
    })
  })
})
