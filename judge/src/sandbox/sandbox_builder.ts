export function buildSandbox(context: Record<string, unknown>): (code: string) => unknown {
  return function (code: string): unknown {
    const proxy = new Proxy(context, {
      has(): boolean {
        return true
      },
      get(target, key): unknown {
        return target[key as string]
      },
      set(target, key, value): boolean {
        target[key as string] = value
        return true
      }
    })

    const wrapped_code = `
      with (sandbox) {
        return (function() {
          ${code}
        })();
      }
    `

    const fn = new Function('sandbox', wrapped_code)
    return fn(proxy)
  }
}

// Disable a native method by dotted path, returns a restore function
// Example: disableNativeMethod('Array.prototype.filter') sets Array.prototype.filter = undefined
export function disableNativeMethod(path: string): () => void {
  const parts = path.split('.')
  let current: unknown = globalThis

  for (let i = 0; i < parts.length - 1; i++) {
    current = (current as Record<string, unknown>)[parts[i]]
  }

  const last_key = parts[parts.length - 1]
  const original = (current as Record<string, unknown>)[last_key]

  ;(current as Record<string, unknown>)[last_key] = undefined

  return function restore(): void {
    ;(current as Record<string, unknown>)[last_key] = original
  }
}
