import type { ExecutionRequest, ExecutionResponse } from '../types/exam'

type WorkerSuccessMessage = {
  id: number
  ok: true
  response: ExecutionResponse
}

type WorkerErrorMessage = {
  id: number
  ok: false
  error: string
}

export function runCode(request: ExecutionRequest) {
  return new Promise<ExecutionResponse>((resolve, reject) => {
    const worker = new Worker(new URL('../workers/codeRunnerWorker.ts', import.meta.url), {
      type: 'module',
    })
    const timeoutId = window.setTimeout(() => {
      worker.terminate()
      reject(new Error('运行超时，Worker 未在预期时间内返回结果'))
    }, 10_000)

    worker.onmessage = (event: MessageEvent<WorkerSuccessMessage | WorkerErrorMessage>) => {
      window.clearTimeout(timeoutId)
      worker.terminate()

      if (event.data.ok) {
        resolve(event.data.response)
        return
      }

      reject(new Error(event.data.error))
    }

    worker.onerror = (event) => {
      window.clearTimeout(timeoutId)
      worker.terminate()
      reject(new Error(event.message))
    }

    worker.postMessage({
      id: 1,
      payload: request,
    })
  })
}
