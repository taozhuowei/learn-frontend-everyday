/**
 * findCycleEntry 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: "head).val })(",
      },
      expected: 2,
    },
    {
      input: {
        args: "node).val })(",
      },
      expected: 1,
    },
    {
      input: {
        args: "null",
      },
      expected: null,
    },
  ],

  hidden: [
    {
      input: {
        args: "head) })(",
      },
      expected: null,
    },
    {
      input: {
        args: "{ length: 200 }, (_, index) => ({ val: index, next: null })); for (let index = 0; index < nodes.length - 1; index += 1) nodes[index].next = nodes[index + 1]; nodes[nodes.length - 1].next = nodes[120]; return detectCycle(nodes[0]).val })(",
      },
      expected: 120,
    },
  ],
};
