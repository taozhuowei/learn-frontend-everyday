/**
 * @description 实现一个并发调度器 Scheduler。它需要在构造时接收并发上限 limit，然后通过 add 方法持续加入返回 Promise 的异步任务；调度器必须保证同一时刻最多只有 limit 个任务处于执行中，超出的任务先进入等待队列，等已有任务完成后再按加入顺序继续执行。每个 add 调用都要返回一个 Promise，用来拿到对应任务的最终结果或错误。
 * @approach
 * 用队列缓存暂时不能执行的任务，再用 count 记录当前运行中的任务数量；每次 add 后尝试启动任务，只有并发未满时才真正取出队列头部执行，任务结束后递减计数并继续触发下一轮调度。
 * @params
 * limit：调度器允许同时运行的最大任务数，通常为正整数。
 * @return
 * 返回一个 Scheduler 实例；后续通过它的 add 方法接收任务并控制并发。
 */
class Scheduler {
  constructor(limit) {
    this.limit = limit;
    this.count = 0;
    this.queue = [];
  }

  /**
   * @description 向调度器中加入一个异步任务；如果当前并发未满就立即执行，否则先排队等待。
   * @approach 将任务函数和它对应的 resolve、reject 一起压入等待队列，然后统一交给 run 处理，这样每个任务都能在未来拿到自己的执行结果。
   * @params
   * task：一个无参函数，调用后必须返回 Promise，用来描述真正的异步工作。
   * @return
   * 返回一个 Promise；当对应任务执行成功时兑现结果，失败时拒绝错误。
   */
  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.run();
    });
  }

  run() {
    if (this.count >= this.limit || this.queue.length === 0) return;

    this.count++;
    const { task, resolve, reject } = this.queue.shift();

    task()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.count--;
        this.run();
      });
  }
}

export default Scheduler;
