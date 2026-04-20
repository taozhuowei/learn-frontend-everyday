/**
 * @description 实现一个与 Array.prototype.map 语义一致的 myMap 方法。它需要遍历当前数组，把每个实际存在的元素交给回调函数处理，并把回调结果放到新数组的对应位置。实现时要保持原数组不变，支持 thisArg，保留稀疏数组的空槽位置，并处理 this 非法或回调不是函数等常见边界。
 * @approach
 * 先完成 this 和回调的合法性校验，再按原数组长度创建结果数组；遍历时只处理真实存在的索引，把回调返回值写入结果数组相同位置，这样既能保留索引结构，也不会修改原数组。
 * @params
 * callback：用于生成新元素的回调函数，参数依次为当前元素、当前索引和原数组。
 * thisArg：可选的回调执行上下文；如果传入，则在调用 callback 时作为 this 使用。
 * @return
 * 返回一个新数组，长度与原数组一致，已存在元素的位置会被映射成回调返回值，空槽会被保留。
 */
Array.prototype.myMap = function (callback, thisArg) {
  if (this == null) {
    throw new TypeError("Cannot read property 'myMap' of null or undefined");
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  // 将调用者转为对象，获取长度
  const array = Object(this);
  // 使用位运算符确保 length 是一个非负整数，同时为结果数组预分配空间
  const len = array.length >>> 0;
  const result = new Array(len);

  for (let i = 0; i < len; i++) {
    if (i in array) {
      result[i] = callback.call(thisArg, array[i], i, array);
    }
  }

  return result;
};

export default Array.prototype.myMap;
