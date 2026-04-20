/**
 * @description 实现一个与 Array.prototype.filter 行为一致的 myFilter 方法。它需要遍历当前数组，对每个实际存在的元素执行回调函数；当回调返回真值时，把该元素按原顺序放入新的结果数组中。实现时不能修改原数组，需要支持可选的 thisArg，并正确处理 this 为 null 或 undefined、回调不是函数、数组存在空槽等基础边界。
 * @approach
 * 先校验调用者和回调是否合法，再按索引顺序遍历数组；只有当前索引真实存在时才执行回调，回调返回真值就把该元素推入结果数组，从而得到不改变原数组的新结果。
 * @params
 * callback：用于决定元素是否保留的回调函数，参数依次为当前元素、当前索引和原数组。
 * thisArg：可选的回调执行上下文；如果传入，则在调用 callback 时作为 this 使用。
 * @return
 * 返回一个新数组，里面包含所有通过回调判断的元素，元素顺序与原数组保持一致。
 */
Array.prototype.myFilter = function (callback, thisArg) {
  // 1. 检查 this 是否合法
  if (this === null || this === undefined) {
    throw new TypeError("Array.prototype.myFilter called on null or undefined");
  }

  // 2. 检查回调必须是函数
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  // 3. 拿到数组 & 长度
  const arr = this;
  // 使用位运算符确保 length 是一个非负整数，同时为结果数组预分配空间
  const len = arr.length >>> 0;
  const result = [];

  // 4. 遍历 + 过滤
  for (let i = 0; i < len; i++) {
    // 只处理真实存在的元素（跳过空元素）
    if (i in arr) {
      // 回调返回 true，就放进结果数组
      if (callback.call(thisArg, arr[i], i, arr)) {
        result.push(arr[i]);
      }
    }
  }

  // 5. 返回新数组
  return result;
};

export default Array.prototype.myFilter;
