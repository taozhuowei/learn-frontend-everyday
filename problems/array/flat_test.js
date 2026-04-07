/**
 * flat 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        arr: "1, [2, 3]",
        fn: "() => {}",
      },
      expected: [1, 2, 3],
    },
    {
      input: {
        arr: "1, [2, [3, [4]]]",
        fn: "2",
      },
      expected: [1, 2, 3, [4]],
    },
    {
      input: {
        arr: "1, [2, [3]]",
        fn: "1",
      },
      expected: [1, 2, [3]],
    },
  ],

  hidden: [
    {
      input: {
        arr: "1, [2]",
        fn: "0",
      },
      expected: [1, [2]],
    },
    {
      input: {
        arr: "1, [2, [3, [4, [5]]]]",
        fn: "Infinity",
      },
      expected: [1, 2, 3, 4, 5],
    },
  ],
};
