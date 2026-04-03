/**
 * @description 实现一个基础防抖函数 debounce。它需要接收一个待执行任务和等待时间，返回新的包装函数；当包装函数在短时间内被连续触发时，前面的计划执行都要被取消，只保留最后一次触发，并在停止触发满 delay 毫秒后再真正执行任务。实现时要保留最后一次调用时的 this 和参数，并在传入的 task 不是函数时抛出错误。
 * @approach
 * 用闭包保存唯一的定时器标识；每次触发先清掉旧定时器，再重新安排一次延迟执行，这样只有最后一次触发能存活到计时结束，并用最后一次触发时的上下文和参数执行任务。
 * @params
 * task：需要被防抖包装的目标函数，真正的业务逻辑会在静默期结束后执行。
 * delay：连续触发停止后还需要再等待多少毫秒才执行 task。
 * @return
 * 返回一个新的防抖函数；调用它不会立刻执行 task，而是按防抖规则延后执行。
 */
function debounce(task, delay) {
  if (typeof task !== "function") {
    throw new TypeError("debounce can only run with functions");
  }

  let timer = null;

  return function (...args) {
    if (timer !== null) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      task.apply(this, args);
    }, delay);
  };
}

debounce;
