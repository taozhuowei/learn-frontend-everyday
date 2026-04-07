/**
 * forEach 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: "(value) => { sum += value }); return sum })(",
      },
      expected: 6,
    },
    {
      input: {
        args: "function (value) { total += value + this.base }, context); return total })(",
      },
      expected: 23,
    },
    {
      input: {
        args: "() => { count += 1 }); return count })(",
      },
      expected: 2,
    },
  ],

  hidden: [
    {
      input: {
        args: "() => { called = true }); return called })(",
      },
      expected: false,
    },
    {
      input: {
        args: "'nope') } catch (error) { return error instanceof TypeError } })(",
      },
      expected: true,
    },
  ],
};
