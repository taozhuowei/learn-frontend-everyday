/**
 * flatten 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: "[1, [2, 3]]",
      },
      expected: [1, 2, 3],
    },
    {
      input: {
        args: "[1, [2, [3, [4]]]], 2",
      },
      expected: [1, 2, 3, [4]],
    },
    {
      input: {
        args: "source, 0); return [JSON.stringify(result), result !== source] })(",
      },
      expected: ["[1,[2]]", true],
    },
  ],

  hidden: [
    {
      input: {
        args: "[], Infinity",
      },
      expected: [],
    },
    {
      input: {
        args: "[1, [2, [3, [4, [5]]]]], Infinity",
      },
      expected: [1, 2, 3, 4, 5],
    },
  ],
};
