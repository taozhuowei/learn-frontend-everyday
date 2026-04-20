/**
 * @description 实现一个与 Function.prototype.call 行为接近的 myCall 方法。它需要让任意函数在指定的上下文对象上立即执行，并把后续参数逐个传给目标函数。实现时要正确处理 context 为 null 或 undefined 时回退到全局对象、原始值装箱、临时属性避免命名冲突，以及调用结束后清理现场。
 * @approach
 * 先把 context 规范成可挂载属性的对象，再把当前函数临时挂到该对象上，通过展开参数立即执行；执行完成后删除临时属性，并把原函数返回值直接交还给调用方。
 * @params
 * context：函数执行时要绑定的 this；传入 null 或 undefined 时回退到 globalThis。
 * args：要按位置依次传给目标函数的参数列表。
 * @return
 * 返回目标函数在指定上下文和参数下执行后的结果。
 */
Function.prototype.myCall = function (context, ...args) {
  // 1. 调用者必须是函数
  if (typeof this !== "function") {
    throw new TypeError("Call must be called on a function");
  }

  // 2. 处理上下文：null/undefined 转为 globalThis，其他转为对象
  context =
    context === null || context === undefined ? globalThis : Object(context);

  // 3. 临时绑定：将函数作为上下文的属性，使用 Symbol 避免命名冲突
  const fnSymbol = Symbol("fn");
  context[fnSymbol] = this;

  // 4. 执行调用：展开参数列表调用函数
  const result = context[fnSymbol](...args);

  // 5. 清理恢复：删除临时属性，返回函数执行结果
  delete context[fnSymbol];

  return result;
};

export default Function.prototype.myCall;
