// Extracts prototype method: wraps user code and returns the expression string to evaluate
export function extractPrototype(code: string, host: string, name: string): string {
  return `
    (function() {
      ${code}
      return ${host}.prototype.${name};
    })()
  `
}

// Extracts export default function/const: wraps code in module pattern and returns expression string
export function extractExport(code: string): string {
  const transformed_code = code
    .replace(/export\s+default\s+function\s+(\w+)/g, 'module.exports.default = function $1')
    .replace(/export\s+default\s+class\s+(\w+)/g, 'module.exports.default = class $1')
    .replace(/export\s+default\s+/g, 'module.exports.default = ')

  return `
    (function() {
      const module = { exports: {} };
      ${transformed_code}
      return module.exports.default;
    })()
  `
}

// Extracts export default class
export function extractClass(code: string): string {
  const transformed_code = code
    .replace(/export\s+default\s+class\s+(\w+)/g, 'module.exports.default = class $1')
    .replace(/export\s+default\s+class/g, 'module.exports.default = class')

  return `
    (function() {
      const module = { exports: {} };
      ${transformed_code}
      return module.exports.default;
    })()
  `
}

