/**
 * myFilter 测试用例
 */

module.exports = {
  // 示例用例（3个）- 学习模式可见
  examples: [
    {
      input: {
        arr: [1, 2, 3, 4],
        fn: "x => x % 2 === 0",
      },
      expected: [2, 4],
    },
    {
      input: {
        arr: [5, 6, 7, 8],
        fn: "x => x > 6",
      },
      expected: [7, 8],
    },
    {
      input: {
        arr: [1, , 3, 0],
        fn: "Boolean",
      },
      expected: [1, 3],
    },
  ],

  // 隐藏用例 - 判题时使用
  hidden: [
    // 边界
    { input: { arr: [], fn: "() => true" }, expected: [] },
    { input: { arr: [1, 2, 3], fn: "() => false" }, expected: [] },
    { input: { arr: [1, 2, 3], fn: "() => true" }, expected: [1, 2, 3] },
    { input: { arr: [, , 3], fn: "x => x > 0" }, expected: [3] },

    // 异常
    { input: { arr: [1, 2, 3], fn: null }, expected: { error: "TypeError" } },
    {
      input: { arr: [1, 2, 3], fn: undefined },
      expected: { error: "TypeError" },
    },
    { input: { arr: [1, 2, 3], fn: 123 }, expected: { error: "TypeError" } },
    {
      input: { arr: null, fn: "() => true" },
      expected: { error: "TypeError" },
    },
    {
      input: { arr: undefined, fn: "() => true" },
      expected: { error: "TypeError" },
    },

    // thisArg
    {
      input: {
        arr: [3, 4, 5],
        fn: "function(x) { return x > this.min }",
        thisArg: { min: 3 },
      },
      expected: [4, 5],
    },

    // 大数据
    {
      input: {
        arr: "Array(10000).fill(0).map((_,i)=>i)",
        fn: "x => x % 2 === 0",
      },
      expected: "Array(5000).fill(0).map((_,i)=>i*2)",
    },
  ],
};
