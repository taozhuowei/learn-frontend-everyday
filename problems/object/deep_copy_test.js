/**
 * deep_copy 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        obj: { a: 1, b: { c: 2 } },
      },
      expected: { a: 1, b: { c: 2 } },
    },
    {
      input: {
        obj: [1, [2, 3], { a: 4 }],
      },
      expected: [1, [2, 3], { a: 4 }],
    },
    {
      input: {
        obj: { date: "new Date()" },
      },
      expected: { date: "[Date]" },
    },
  ],

  hidden: [
    {
      input: {
        obj: { a: 1, self: null },
      },
      expected: { a: 1, self: null },
    },
    {
      input: {
        obj: "{ list: Array(100).fill(0).map((_, i) => ({ index: i })) }",
      },
      expected: { list: "Array(100).fill(0).map((_, i) => ({ index: i }))" },
    },
    {
      input: {
        obj: { regex: "/abc/gi" },
      },
      expected: { regex: "/abc/gi" },
    },
  ],
};
