/**
 * reduce 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        arr: "1, 2, 3",
        fn: "(sum, value) => sum + value, 0",
      },
      expected: 6,
    },
    {
      input: {
        arr: "1, 2, 3",
        fn: "(sum, value) => sum + value",
      },
      expected: 6,
    },
    {
      input: {
        arr: "{ count: 1 }, { count: 2 }",
        fn: "(sum, item) => sum + item.count, 0",
      },
      expected: 3,
    },
  ],

  hidden: [
    {
      input: {
        args: "(sum, value) => sum + value, 0) })(",
      },
      expected: 3,
    },
    {
      input: {
        args: "(sum, value) => sum + value) } catch (error) { return error instanceof TypeError } })(",
      },
      expected: true,
    },
  ],
};
