/**
 * promise_race 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: ") => Promise.myRace([new Promise((resolve) => setTimeout(() => resolve('slow'), 20)), Promise.resolve('fast')]))(",
      },
      expected: "fast",
    },
    {
      input: {
        args: ") => { try { await Promise.myRace([new Promise((_, reject) => setTimeout(() => reject(new Error('boom')), 10)), new Promise((resolve) => setTimeout(() => resolve('ok'), 20))]) } catch (error) { return error.message } })(",
      },
      expected: "boom",
    },
    {
      input: {
        args: ") => Promise.myRace([3, Promise.resolve(4)]))(",
      },
      expected: 3,
    },
  ],

  hidden: [
    {
      input: {
        args: ") => { const pending = Promise.myRace([]); let settled = false; pending.then(() => { settled = true }, () => { settled = true }); await new Promise((resolve) => setTimeout(resolve, 20)); return settled })(",
      },
      expected: false,
    },
    {
      input: {
        args: ") => Promise.myRace([new Promise((resolve) => setTimeout(() => resolve('first'), 5)), new Promise((resolve) => setTimeout(() => resolve('second'), 15))]))(",
      },
      expected: "first",
    },
  ],
};
