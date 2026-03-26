/**
 * @description 实现一个与 Promise.race 语义一致的 Promise.myRace 方法。它需要让一组 Promise 或普通值同时参与竞争，只要其中任意一项最先兑现或拒绝，返回的 Promise 就立刻采用该结果并结束。实现时要兼容传入普通值、thenable、空可迭代对象，以及后续慢任务不应再改写最终结果的情况。
 * @approach
 * 1. 先把传入的可迭代对象转成数组，便于统一遍历。
 * 2. 空数组时保持返回 Promise 挂起，这与原生 Promise.race 的行为一致。
 * 3. 使用 Promise.resolve 包装每一项，保证普通值也能参与竞速。
 * 4. 通过 is_settled 标记只接受第一个完成结果，后续结果全部忽略。
 * @params
 * promises：参与竞速的可迭代对象，内部元素可以是 Promise、thenable 或普通值。
 * @return
 * 返回一个新的 Promise，其状态由最先完成的任务决定。
 */
Promise.myRace = function (promises) {
  return new Promise((resolve, reject) => {
    const queue = Array.from(promises);

    if (queue.length === 0) {
      return;
    }

    let is_settled = false;

    queue.forEach((item) => {
      Promise.resolve(item)
        .then((value) => {
          if (is_settled) {
            return;
          }

          is_settled = true;
          resolve(value);
        })
        .catch((reason) => {
          if (is_settled) {
            return;
          }

          is_settled = true;
          reject(reason);
        });
    });
  });
};
