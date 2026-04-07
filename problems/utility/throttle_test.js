/**
 * throttle 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: ") => { let count = 0; const fn = throttle(() => { count += 1 }, 30); fn(); fn(); fn(); await new Promise((resolve) => setTimeout(resolve, 40)); return count })(",
      },
      expected: 1,
    },
    {
      input: {
        args: ") => { let count = 0; const fn = throttle(() => { count += 1 }, 20); fn(); await new Promise((resolve) => setTimeout(resolve, 30)); fn(); return count })(",
      },
      expected: 2,
    },
    {
      input: {
        args: ") => { let value = 0; const fn = throttle((next) => { value = next }, 20); fn(1); fn(2); await new Promise((resolve) => setTimeout(resolve, 30)); return value })(",
      },
      expected: 1,
    },
  ],

  hidden: [
    {
      input: {
        args: ") => { let count = 0; const context = { increase() { count += 1 } }; const fn = throttle(function() { this.increase() }.bind(context), 10); fn(); await new Promise((resolve) => setTimeout(resolve, 20)); return count })(",
      },
      expected: 1,
    },
    {
      input: {
        args: ") => { let count = 0; const fn = throttle(() => { count += 1 }, 5); for (let index = 0; index < 50; index += 1) fn(); await new Promise((resolve) => setTimeout(resolve, 15)); return count })(",
      },
      expected: 1,
    },
  ],
};
