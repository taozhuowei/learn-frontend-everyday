/**
 * @description 实现一个简化版 Promise 类 MyPromise，并尽量遵循 Promise/A+ 的核心规则。它需要支持 pending、fulfilled、rejected 三种状态，支持在构造阶段立即执行 executor，支持 then 链式调用、值穿透、错误冒泡，以及 then 返回普通值、Promise 或 thenable 时的统一解析。实现时还要避免状态被重复修改，并处理链式解析中的循环引用问题。
 * @approach
 * 先围绕状态与回调队列搭建最小 Promise 核心：pending 时缓存回调，状态落定后异步派发；then 再始终返回一个新的 MyPromise，并把回调返回值交给 resolvePromise 统一解析，从而兼顾链式调用和 thenable 展开。
 * @params
 * executor：创建 Promise 时立即执行的函数，接收 resolve 和 reject 两个参数。
 * onFulfilled：可选的成功回调，在 Promise 兑现后接收成功值。
 * onRejected：可选的失败回调，在 Promise 拒绝后接收失败原因。
 * @return
 * 返回一个可继续链式调用的 MyPromise 实例；then 也会返回新的 MyPromise。
 */
class MyPromise {
  /**
   * @param {Function} executor - 执行器函数
   */
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onFulfilledCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (reason) => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  /**
   * @param {Function} [onFulfilled] - 成功回调
   * @param {Function} [onRejected] - 失败回调
   * @returns {MyPromise} 新 Promise 支持链式调用
   */
  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === "fulfilled") {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.state === "rejected") {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.state === "pending") {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });

    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(callback) {
    return this.then(
      (value) => MyPromise.resolve(callback()).then(() => value),
      (reason) =>
        MyPromise.resolve(callback()).then(() => {
          throw reason;
        }),
    );
  }

  static resolve(value) {
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new TypeError("Chaining cycle detected for promise"));
    return;
  }

  let called = false;
  if (x != null && (typeof x === "object" || typeof x === "function")) {
    try {
      const then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          },
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}
