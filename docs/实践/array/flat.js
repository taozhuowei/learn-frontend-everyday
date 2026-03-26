/**
 * @description 实现一个与 Array.prototype.flat 类似的 myFlat 方法。它需要把当前数组中的嵌套数组按指定深度逐层展开，深度耗尽后保留剩余嵌套结构，并返回一个新的扁平化数组。实现时不能修改原数组，需要正确处理 depth 的默认值、Infinity、0、负数，以及数组空槽和 this 非法等边界。
 * @approach
 * 先校验调用者并规范化 depth，再通过递归遍历当前数组；当元素仍是数组且剩余深度大于 0 时继续展开，否则直接把元素放入结果数组，这样就能精确控制展开层数。
 * @params
 * depth：可选的展开深度，默认展开一层；传入 Infinity 时表示尽可能展开到最深层。
 * @return
 * 返回一个新的数组，其中嵌套数组会在允许的深度范围内被展开，原数组保持不变。
 */
Array.prototype.myFlat = function (depth = 1) {
  // 1. 检查 this 合法性
  if (this == null) {
    throw new TypeError("Cannot read property 'myFlat' of null or undefined");
  }

  // 2. 把调用者转成对象（规范写法）
  const arr = this;
  const result = [];

  // 3. 定义递归拍平函数
  function flatDeep(array, currentDepth) {
    for (const item of array) {
      // 判断是否是数组 && 是否还能继续拍平
      if (Array.isArray(item) && currentDepth < depth) {
        flatDeep(item, currentDepth + 1); // 递归
      } else {
        result.push(item); // 不是数组直接放入结果
      }
    }
  }

  // 4. 开始递归拍平，默认深度从 0 开始
  flatDeep(arr, 0);

  return result;
};
