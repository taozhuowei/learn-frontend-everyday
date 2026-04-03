/**
 * @description 实现一个与 Promise.all 语义一致的 Promise.myAll 方法。它需要接收一个可迭代对象，把其中每一项都当作 Promise 或普通值统一处理；只有当所有任务都成功完成时，才按原顺序返回结果数组。只要有任意一个任务先失败，返回的 Promise 就应立即以该错误拒绝。实现时还要处理空可迭代对象和普通值混入的情况。
 * @approach
 * 先把输入统一转换成数组，便于按索引稳定收集结果；随后使用 Promise.resolve 包装每一项，让普通值也能参与统一流程，并用完成计数器判断是否全部成功，若中途有任何一项拒绝则立即 reject。
 * @params
 * promises：参与聚合的可迭代对象，内部元素可以是 Promise、thenable 或普通值。
 * @return
 * 返回一个新的 Promise；全部成功时兑现按原顺序组成的结果数组，任意一项失败时立即拒绝。
 */
Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    const queue = Array.from(promises);
    const length = queue.length;

    if (length === 0) {
      resolve([]);
      return;
    }

    const results = new Array(length);
    let completedCount = 0;
    let isRejected = false;

    queue.forEach((item, index) => {
      Promise.resolve(item)
        .then((value) => {
          if (isRejected) return;
          results[index] = value;
          completedCount++;
          if (completedCount === length) resolve(results);
        })
        .catch((reason) => {
          if (isRejected) return;
          isRejected = true;
          reject(reason);
        });
    });
  });
};
Promise.myAll;
