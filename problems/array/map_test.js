/**
 * map 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        arr: "1, 2, 3",
        fn: "(value) => value * 2",
      },
      expected: [2, 4, 6],
    },
    {
      input: {
        arr: "'a', 'b'",
        fn: "function (value) { return this.prefix + value }, { prefix: 'x-' }",
      },
      expected: ["x-a", "x-b"],
    },
    {
      input: {
        args: "(value) => value * 2); return [result.length, 1 in result, 2 in result, result[0], result[2]] })(",
      },
      expected: [3, false, true, 2, 6],
    },
  ],

  hidden: [
    {
      input: {
        arr: "",
        fn: "() => 1",
      },
      expected: [],
    },
    {
      input: {
        args: "null) } catch (error) { return error instanceof TypeError } })(",
      },
      expected: true,
    },
  ],
};
