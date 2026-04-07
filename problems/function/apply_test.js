/**
 * apply 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: "a, b) { return this.base + a + b } return add.myApply({ base: 1 }, [2, 3]) })(",
      },
      expected: 6,
    },
    {
      input: {
        args: "extra) { return this.base + extra } const result = read.myApply(null, [2]); delete globalThis.base; return result })(",
      },
      expected: 6,
    },
    {
      input: {
        args: ") { return Object.prototype.toString.call(this) } return tag.myApply('hi') })(",
      },
      expected: "[object String]",
    },
  ],

  hidden: [
    {
      input: {
        args: "a, b) { return [a, b].join('-') } return join.myApply({}, { 0: 'x', 1: 'y', length: 2 }) })(",
      },
      expected: "x-y",
    },
    {
      input: {
        args: "{}, null, []) } catch (error) { return error instanceof TypeError } })(",
      },
      expected: true,
    },
  ],
};
