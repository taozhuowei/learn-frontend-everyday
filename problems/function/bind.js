/**
 * @description 实现一个与 Function.prototype.bind 行为接近的 myBind 方法。它需要返回一个新的函数，这个新函数会把原函数的 this 固定为指定对象，并支持在绑定时预置一部分参数，后续调用时再继续补参。实现时还要兼顾被 new 调用的场景，保证构造调用时 this 指向新实例而不是绑定对象，并尽量保留原型链关系。
 * @approach
 * 先保存原函数和预置参数，再返回一个包装函数；包装函数执行时把预置参数和本次参数拼接起来，并根据是否以构造函数方式调用来决定最终的 this，从而同时覆盖普通调用和 new 调用两种场景。
 * @params
 * context：绑定后的默认 this；普通调用时会作为原函数执行上下文。
 * presetArgs：在 bind 阶段提前固定的参数列表，后续调用时会排在新参数前面。
 * @return
 * 返回一个新的绑定函数，它会记住指定的 this 和预置参数，并支持继续接收剩余参数。
 */
Function.prototype.myBind = function (context, ...presetArgs) {
  // 1. 调用者必须是函数
  if (typeof this !== "function") {
    throw new TypeError("Bind must be called on a function");
  }

  const originalFn = this; // 保存原函数

  // 2. 返回绑定函数
  function boundFn(...args) {
    return originalFn.call(
      new.target === boundFn ? this : context, // 判断是不是 new 调用, new 的时候 this 指向实例，否则指向绑定的 context
      ...presetArgs,
      ...args,
    );
  }

  // 3. 正确处理原型：用 Object.create 继承，不直接赋值
  if (originalFn.prototype) {
    boundFn.prototype = Object.create(originalFn.prototype);
  }

  return boundFn;
};

export default Function.prototype.myBind;
