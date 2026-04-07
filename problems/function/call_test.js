/**
 * call 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: "a, b) { return this.base + a + b } return add.myCall({ base: 1 }, 2, 3) })(",
      },
      expected: 6,
    },
    {
      input: {
        args: "extra) { return this.base + extra } const result = read.myCall(null, 2); delete globalThis.base; return result })(",
      },
      expected: 7,
    },
    {
      input: {
        args: ") { return Object.prototype.toString.call(this) } return tag.myCall('hi') })(",
      },
      expected: "[object String]",
    },
  ],

  hidden: [
    {
      input: {
        args: ") { return this.value } return getValue.myCall({ value: 'ok' }) })(",
      },
      expected: "ok",
    },
    {
      input: {
        args: "{}, null) } catch (error) { return error instanceof TypeError } })(",
      },
      expected: true,
    },
  ],
};
