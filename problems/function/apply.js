/**
 * @description 实现一个与 Function.prototype.apply 行为接近的 myApply 方法。它需要让当前函数在指定上下文上执行，并把第二个参数中的数组或类数组批量展开为实参列表。实现时要处理 context 为 null 或 undefined 的回退逻辑、原始值装箱、参数列表缺省、以及执行结束后的临时属性清理。
 * @approach
 * 先把 context 规范成对象，再把参数列表统一视为可展开集合；随后把当前函数临时挂到 context 上执行一次，并在拿到执行结果后删除临时属性，保证调用前后的上下文对象尽量不被污染。
 * @params
 * context：函数执行时要绑定的 this；传入 null 或 undefined 时回退到 globalThis。
 * argsArray：要批量传给目标函数的数组或类数组对象；未传入时按空参数列表处理。
 * @return
 * 返回目标函数在指定上下文下执行后的结果。
 */
Function.prototype.myApply = function (context, argsArray) {
  // 1. 处理上下文：null/undefined 转为 globalThis，其他转为对象
  context =
    context === null || context === undefined ? globalThis : Object(context);

  // 2. 处理参数数组：null/undefined 时使用空数组，否则转为数组
  argsArray = argsArray == null ? [] : Array.from(argsArray);

  // 3. 临时绑定：将函数作为上下文的属性，使用 Symbol 避免命名冲突
  const fnSymbol = Symbol("fn");
  context[fnSymbol] = this;

  // 4. 执行函数，统一展开参数数组
  const result = context[fnSymbol](...argsArray);

  delete context[fnSymbol];
  return result;
};
