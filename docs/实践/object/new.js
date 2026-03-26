/**
 * @description 实现一个模拟 new 操作符行为的 myNew 函数。它需要接收构造函数和构造参数，创建一个以构造函数 prototype 为原型的新对象，再让构造函数以该对象作为 this 执行初始化逻辑。实现时要正确处理“构造函数显式返回对象或函数时覆盖默认实例”的规则，并在传入的 constructor 不是函数时抛出错误。
 * @approach
 * 先根据构造函数的 prototype 创建一个空对象，再用 apply 让构造函数在这个新对象上执行；最后按照原生 new 的规则，优先返回构造函数显式返回的对象值，否则返回刚刚创建的实例对象。
 * @params
 * constructor：要被模拟调用的构造函数，负责在新对象上初始化实例属性。
 * args：传给构造函数的参数列表，会原样透传给 constructor。
 * @return
 * 返回按照 new 语义创建出来的实例；如果构造函数主动返回对象或函数，则返回该返回值。
 */
function myNew(constructor, ...args) {
  // 1. 输入校验：constructor 必须是函数
  if (typeof constructor !== "function") {
    throw new TypeError("Constructor must be a function");
  }

  // 2. 创建空对象：使用 Object.create 创建以构造函数原型为原型的对象
  const obj = Object.create(constructor.prototype);
  // 3. 绑定 this：使用 apply 调用构造函数，将新对象作为 this
  const result = constructor.apply(obj, args);

  return result !== null &&
    (typeof result === "object" || typeof result === "function")
    ? result
    : obj;
}
