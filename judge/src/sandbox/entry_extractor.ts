// Extracts prototype method: wraps user code and reads host.prototype[name]
export function extractPrototype(code: string, host: string, name: string): Function {
  const wrapped_code = `
    ${code}
    return ${host}.prototype.${name};
  `
  const fn = new Function(wrapped_code)
  const result = fn()

  if (typeof result !== 'function') {
    throw new Error(`Expected ${host}.prototype.${name} to be a function`)
  }

  return result
}

// Extracts export default function/const: wraps code in module pattern and returns default export
export function extractExport(code: string): unknown {
  const transformed_code = code
    .replace(/export\s+default\s+function\s+(\w+)/g, 'module.exports.default = function $1')
    .replace(/export\s+default\s+class\s+(\w+)/g, 'module.exports.default = class $1')
    .replace(/export\s+default\s+/g, 'module.exports.default = ')

  const wrapped_code = `
    const module = { exports: {} };
    ${transformed_code}
    return module.exports.default;
  `
  const fn = new Function(wrapped_code)
  return fn()
}

// Extracts export default class
export function extractClass(code: string): new (...args: unknown[]) => unknown {
  const transformed_code = code
    .replace(/export\s+default\s+class\s+(\w+)/g, 'module.exports.default = class $1')
    .replace(/export\s+default\s+class/g, 'module.exports.default = class')

  const wrapped_code = `
    const module = { exports: {} };
    ${transformed_code}
    return module.exports.default;
  `
  const fn = new Function(wrapped_code)
  const result = fn()

  if (typeof result !== 'function') {
    throw new Error('Expected class export')
  }

  return result as new (...args: unknown[]) => unknown
}
