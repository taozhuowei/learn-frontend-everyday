/**
 * curry 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: "(a, b, c) => a + b + c)(1)(2)(3",
      },
      expected: 6,
    },
    {
      input: {
        args: "(a, b, c) => a + b + c)(1, 2)(3",
      },
      expected: 6,
    },
    {
      input: {
        args: "(a, b, c) => a + b + c)(1)(2, 3",
      },
      expected: 6,
    },
  ],

  hidden: [
    {
      input: {
        args: "(a, b, c) => a * b * c)(2)(3)(4",
      },
      expected: 24,
    },
    {
      input: {
        args: "(a, b) => a - b)(10, 3",
      },
      expected: 7,
    },
  ],
};
