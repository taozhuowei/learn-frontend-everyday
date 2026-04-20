import { WORKER_CODE } from "./worker_script";
import type { ProblemContract, TestCase } from "../core/types";

export async function runInWorkerSandbox(
  contract: ProblemContract,
  testCase: TestCase,
  fnCode: string,
): Promise<{ actual?: unknown; meta?: any }> {
  return new Promise(async (resolve, reject) => {
    let worker: any = null;
    let timeoutId: any = null;

    const handleResult = (result: any) => {
      if (timeoutId) clearTimeout(timeoutId);
      if (worker) {
        worker.terminate ? worker.terminate() : worker.terminate?.();
      }
      if (result.success) {
        resolve({ actual: result.actual, meta: result.meta });
      } else {
        reject(new Error(result.error));
      }
    };

    try {
      if (typeof Worker !== "undefined") {
        // Browser environment
        const blob = new Blob([WORKER_CODE], {
          type: "application/javascript",
        });
        const url = URL.createObjectURL(blob);
        worker = new Worker(url);
        worker.onmessage = (e: MessageEvent) => handleResult(e.data);
        worker.onerror = (err: ErrorEvent) => {
          if (timeoutId) clearTimeout(timeoutId);
          reject(new Error(err.message));
        };
        worker.postMessage({ contract, testCase, fnCode });
      } else {
        // Node.js environment (Vitest)
        const { Worker: NodeWorker } = await import("node:worker_threads");
        worker = new NodeWorker(WORKER_CODE, { eval: true });
        worker.on("message", handleResult);
        worker.on("error", (err: Error) => {
          if (timeoutId) clearTimeout(timeoutId);
          reject(err);
        });
        worker.postMessage({ contract, testCase, fnCode });
      }

      // 10 second timeout for any execution
      timeoutId = setTimeout(() => {
        if (worker)
          worker.terminate ? worker.terminate() : worker.terminate?.();
        reject(new Error("Execution Timeout"));
      }, 10000);
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      reject(err);
    }
  });
}
