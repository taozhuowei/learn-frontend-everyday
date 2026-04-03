/**
 * @description 实现一个任务队列执行器 execute。它需要按顺序串行执行一组异步任务，并为每个任务提供超时控制与失败重试能力；如果某个任务在规定时间内没有完成，或者执行时报错，就要在未超过重试上限时重新尝试。这个函数的目标是把一批异步任务稳定地顺序跑完，同时把失败位置和原因明确暴露出来。
 * @approach
 * 使用 for 循环按顺序消费任务数组，并把单个任务包装进 Promise.race 中实现超时控制；某次执行失败就根据 retries 决定是否继续重试，直到成功或达到上限，再决定进入下一个任务或直接抛出错误。
 * @params
 * tasks：按执行顺序排列的任务函数数组，每个任务函数都应返回 Promise。
 * timeout：单个任务允许执行的最长毫秒数，超过该时间会按超时失败处理。
 * retries：单个任务失败后允许额外重试的最大次数，不包含第一次执行。
 * @return
 * 当所有任务都按顺序执行完成时返回一个已完成的 Promise；只要有任务最终失败，就返回被拒绝的 Promise。
 */
async function execute(tasks, timeout, retries) {
  if (!Array.isArray(tasks)) {
    throw new TypeError("execute function can only execute array of tasks");
  }

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (typeof task !== "function") {
      throw new TypeError(`Task at index ${i} is not a function`);
    }
    await runTask(task, i, timeout, retries);
  }
}

/**
 * 执行单个任务，支持超时和重试
 * @param {Function} task - 任务函数
 * @param {number} index - 任务索引
 * @param {number} timeout - 超时时间
 * @param {number} retries - 最大重试次数
 * @returns {Promise<*>}
 */
function runTask(task, index, timeout, retries) {
  let currentTries = 0;

  return new Promise((resolve, reject) => {
    const attempt = async () => {
      currentTries++;

      try {
        const result = await Promise.race([
          task(),
          new Promise((_, rejectTimeout) => {
            setTimeout(() => {
              rejectTimeout(
                new Error(`Task ${index} execute timeout after ${timeout}ms`),
              );
            }, timeout);
          }),
        ]);
        resolve(result);
      } catch (err) {
        if (currentTries < retries) {
          attempt();
        } else {
          reject(
            new Error(
              `Task ${index} failed after ${retries} retries: ${err.message}`,
            ),
          );
        }
      }
    };

    attempt();
  });
}
