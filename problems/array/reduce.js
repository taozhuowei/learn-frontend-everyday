/**
 * @description 实现一个与 Array.prototype.reduce 语义一致的 myReduce 方法。它需要把数组元素按顺序累积到一个结果上，回调每次接收上一次的累加值和当前元素，并返回新的累加值。实现时要正确处理是否传入初始值、空数组、稀疏数组空槽以及 this 或回调非法的情况，且不能修改原数组内容。
 * @approach
 * 先完成 this 与回调校验，再根据是否显式传入 initialValue 决定累加器起点；随后从正确的索引开始遍历每个真实存在的元素，持续用回调返回值更新累加器，最终返回累计结果。
 * @params
 * callback：用于合并累加值和当前元素的回调函数，参数依次为累加器、当前元素、当前索引和原数组。
 * initialValue：可选的初始累加值；如果未传入，则需要从数组中找到第一个真实存在的元素作为起点。
 * @return
 * 返回整个归并过程结束后的最终累加结果，结果类型由 callback 的返回值决定。
 */
Array.prototype.myReduce = function (callback, initialValue) {
  if (this == null) {
    throw new TypeError("Cannot read property 'myReduce' of null or undefined");
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  // 将调用者转为对象，获取长度
  const array = Object(this);
  // 使用位运算符确保 length 是一个非负整数，同时为结果数组预分配空间
  const len = array.length >>> 0;
  // accumulator 用于存储累加结果，k 是当前索引
  let k = 0;
  let accumulator;

  // 处理初始值：如果没有提供 initialValue，使用数组中第一个存在的元素作为初始值
  if (initialValue === undefined) {
    let isValueSet = false;
    // 找到第一个存在的元素作为初始值
    for (; k < len; k++) {
      if (k in array) {
        accumulator = array[k];
        isValueSet = true;
        k++;
        break;
      }
    }
    if (!isValueSet) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
  } else {
    accumulator = initialValue;
  }

  for (; k < len; k++) {
    if (k in array) {
      accumulator = callback(accumulator, array[k], k, array);
    }
  }

  return accumulator;
};
