module.exports = [
  {
    input:
      "(async () => Promise.myAll([Promise.resolve(1), Promise.resolve(2)]))()",
    expected: [1, 2],
  },
  {
    input: "(async () => Promise.myAll([1, Promise.resolve(2), 3]))()",
    expected: [1, 2, 3],
  },
  {
    input: "(async () => Promise.myAll([]))()",
    expected: [],
  },
  {
    input:
      "(async () => { try { await Promise.myAll([Promise.resolve(1), Promise.reject(new Error('fail'))]) } catch (error) { return error.message } })()",
    expected: "fail",
  },
  {
    input:
      "(async () => Promise.myAll([new Promise((resolve) => setTimeout(() => resolve('slow'), 20)), Promise.resolve('fast')]))()",
    expected: ["slow", "fast"],
  },
];
