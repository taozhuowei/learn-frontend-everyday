/**
 * promise_all 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: ") => Promise.myAll([Promise.resolve(1), Promise.resolve(2)]))(",
      },
      expected: [1, 2],
    },
    {
      input: {
        args: ") => Promise.myAll([1, Promise.resolve(2), 3]))(",
      },
      expected: [1, 2, 3],
    },
    {
      input: {
        args: ") => Promise.myAll([]))(",
      },
      expected: [],
    },
  ],

  hidden: [
    {
      input: {
        args: ") => { try { await Promise.myAll([Promise.resolve(1), Promise.reject(new Error('fail'))]) } catch (error) { return error.message } })(",
      },
      expected: "fail",
    },
    {
      input: {
        args: ") => Promise.myAll([new Promise((resolve) => setTimeout(() => resolve('slow'), 20)), Promise.resolve('fast')]))(",
      },
      expected: ["slow", "fast"],
    },
  ],
};
