/**\n * @skip
 * @description 实现一个基础节流函数 throttle。它需要接收目标函数和时间间隔，返回新的包装函数；当包装函数被高频触发时，只有距离上一次真正执行已经超过指定间隔时才允许再次执行。这样可以限制任务执行频率，常用于滚动、拖拽、窗口 resize 等高频事件。实现时要保留调用时的 this 和参数，并在 task 非函数时抛出错误。
 * @approach
 * 用 lastTime 记录上一次真实执行的时间戳；每次触发时先比较当前时间与 lastTime 的差值，只有达到 requireTime 才执行目标函数，并把最新时间写回 lastTime。
 * @params
 * task：需要被节流包装的目标函数，只有满足时间间隔时才会被执行。
 * requireTime：两次真实执行之间至少要间隔的毫秒数。
 * @return
 * 返回一个新的节流函数；高频调用时会按固定节奏执行 task，而不是每次都执行。
 */
function throttle(task, requireTime) {
  if (typeof task !== "function") {
    throw new TypeError("throttle can only run with functions");
  }

  let lastTime = null; // 使用 null 区分从未执行的状态

  return function (...args) {
    const now = Date.now();

    // 第一次执行，或者距离上一次执行已过指定时间
    if (lastTime === null || now - lastTime >= requireTime) {
      task.apply(this, args);
      lastTime = now;
    }
  };
}

export default throttle;
