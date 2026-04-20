/**
 * @description 使用递归方式实现数组扁平化。函数需要接收一个可能包含多层嵌套数组的输入，并在指定深度范围内逐层展开子数组；当 depth 用尽时，剩余的嵌套结构需要原样保留。实现时不能修改原数组，深度为 0 或负数时应返回原数组的浅拷贝。
 * @approach
 * 1. 当 depth 小于等于 0 时，直接返回原数组的浅拷贝，表示不再继续展开。
 * 2. 顺序遍历数组元素，保证结果顺序与原数组一致。
 * 3. 遇到子数组时递归处理剩余深度；遇到普通值时直接放入结果数组。
 * @params
 * arr：需要被扁平化的数组。
 * depth：允许展开的最大深度，默认展开到最深层。
 * @return
 * 返回扁平化后的新数组。
 */
function flatten(arr, depth = Infinity) {
  if (depth <= 0) {
    return arr.slice();
  }

  const result = [];

  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flatten(item, depth - 1));
    } else {
      result.push(item);
    }
  }

  return result;
}

/**
 * @description 使用 reduce 改写数组扁平化逻辑。目标仍然是把嵌套数组在指定深度内展开成一个新数组，但这一版强调用累加器逐步汇总结果，而不是手动维护外部结果数组。它同样需要保留原顺序、支持 depth 控制，并且不能修改传入数组。
 * @approach
 * 1. 仍然沿用“深度减一”的递归规则，只是把遍历过程交给 reduce。
 * 2. 每轮都返回新的累加结果，写法更偏函数式。
 * 3. 子数组递归展开后用 concat 拼接，普通值直接追加到累加器末尾。
 * @params
 * arr：需要被扁平化的数组。
 * depth：允许展开的最大深度，默认展开到最深层。
 * @return
 * 返回扁平化后的新数组。
 */
function flattenReduce(arr, depth = Infinity) {
  if (depth <= 0) {
    return arr.slice();
  }

  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      return acc.concat(flattenReduce(item, depth - 1));
    }
    return acc.concat(item);
  }, []);
}

/**
 * @description 使用显式栈实现数组扁平化。它要完成与递归版相同的功能：把嵌套数组在指定深度内展开成新数组，但通过手动维护栈来避免层级过深时递归调用栈溢出。实现时需要额外记录当前元素所处深度，并保证最终输出顺序与原数组一致。
 * @approach
 * 1. 先把顶层元素连同当前深度一起压入栈中。
 * 2. 每次弹出一个元素处理；如果仍可展开，就把子数组从右向左压栈。
 * 3. 从右向左压栈是为了保证后续弹出时依然保持原始顺序。
 * @params
 * arr：需要被扁平化的数组。
 * depth：允许展开的最大深度，默认展开到最深层。
 * @return
 * 返回扁平化后的新数组。
 */
function flattenIterative(arr, depth = Infinity) {
  const result = [];
  const stack = arr.map((item) => ({ item, currentDepth: 0 }));

  while (stack.length > 0) {
    const { item, currentDepth } = stack.pop();

    if (Array.isArray(item) && currentDepth < depth) {
      for (let i = item.length - 1; i >= 0; i--) {
        stack.push({ item: item[i], currentDepth: currentDepth + 1 });
      }
    } else {
      result.push(item);
    }
  }

  return result;
}

export default flatten;
