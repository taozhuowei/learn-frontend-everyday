/**
 * @description 实现一个模拟 instanceof 判断逻辑的 myInstanceof 函数。它需要判断给定对象是否出现在某个构造函数的原型链上，也就是沿着对象的隐式原型不断向上查找，看看能否遇到 constructor.prototype。实现时要正确处理左侧是 null、undefined、基础类型或函数，右侧不是函数，以及原型链走到尽头仍未命中的情况。
 * @approach
 * 先排除不可能形成原型链匹配的非法输入，再取出 constructor.prototype 作为查找目标；随后从对象的直接原型开始逐层向上遍历，只要命中目标原型就返回 true，走到 null 仍未命中就返回 false。
 * @params
 * obj：需要被判断的值，通常是对象实例，也可能是函数对象。
 * constructor：右侧构造函数，用它的 prototype 作为原型链查找目标。
 * @return
 * 如果 obj 的原型链上存在 constructor.prototype，则返回 true；否则返回 false。
 */
function myInstanceof(obj, constructor) {
  if (
    obj == null ||
    (typeof obj !== "object" && typeof obj !== "function") ||
    typeof constructor !== "function"
  ) {
    return false;
  }

  let proto = Object.getPrototypeOf(obj);
  const prototype = constructor.prototype;

  while (proto !== null) {
    if (proto === prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }

  return false;
}
