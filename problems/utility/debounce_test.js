/**
 * debounce 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: ") => { let count = 0; const fn = debounce(() => { count += 1 }, 30); fn(); fn(); fn(); await new Promise((resolve) => setTimeout(resolve, 60)); return count })(",
      },
      expected: 1,
    },
    {
      input: {
        args: ") => { let value = 0; const fn = debounce((next) => { value = next }, 20); fn(1); fn(2); await new Promise((resolve) => setTimeout(resolve, 50)); return value })(",
      },
      expected: 2,
    },
    {
      input: {
        args: ") => { let count = 0; const fn = debounce(() => { count += 1 }, 10); fn(); await new Promise((resolve) => setTimeout(resolve, 20)); fn(); await new Promise((resolve) => setTimeout(resolve, 20)); return count })(",
      },
      expected: 2,
    },
  ],

  hidden: [
    {
      input: {
        args: ") => { let scopeValue = 0; const context = { set(value) { scopeValue = value } }; const fn = debounce(function(value) { this.set(value) }, 10).bind(context); fn(5); await new Promise((resolve) => setTimeout(resolve, 30)); return scopeValue })(",
      },
      expected: 5,
    },
    {
      input: {
        args: ") => { let count = 0; const fn = debounce(() => { count += 1 }, 5); for (let index = 0; index < 100; index += 1) fn(); await new Promise((resolve) => setTimeout(resolve, 20)); return count })(",
      },
      expected: 1,
    },
  ],
};
