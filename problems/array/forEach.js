/**
 * @description 实现一个与 Array.prototype.forEach 行为一致的 myForEach 方法。它需要按索引顺序遍历当前数组，对每个实际存在的元素执行一次回调函数，但不会收集返回值，也不会返回新的数组。实现时要支持可选的 thisArg，跳过稀疏数组中的空槽，并在 this 非法或回调不是函数时抛出错误。
 * @approach
 * 先校验调用环境，再顺序遍历数组；只有当前索引存在元素时才调用回调函数，并把当前元素、索引和原数组传入，整个过程只负责副作用执行，最后保持返回值为 undefined。
 * @params
 * callback：对每个元素执行的回调函数，参数依次为当前元素、当前索引和原数组。
 * thisArg：可选的回调执行上下文；如果传入，则在调用 callback 时作为 this 使用。
 * @return
 * 不返回结果数组，函数执行完成后始终得到 undefined。
 */
Array.prototype.myForEach = function (callback, thisArg) {
  if (this == null) {
    throw new TypeError(
      "Cannot read property 'myForEach' of null or undefined",
    );
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  // 将调用者转为对象，获取长度
  const array = Object(this);
  // 使用位运算符确保 length 是一个非负整数，同时为结果数组预分配空间
  const len = array.length >>> 0;

  for (let i = 0; i < len; i++) {
    if (i in array) {
      callback.call(thisArg, array[i], i, array);
    }
  }
};

export default Array.prototype.myForEach;
