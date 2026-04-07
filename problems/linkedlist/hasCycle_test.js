/**
 * hasCycle 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: "head) })(",
      },
      expected: true,
    },
    {
      input: {
        args: "head) })(",
      },
      expected: false,
    },
    {
      input: {
        args: "null",
      },
      expected: false,
    },
  ],

  hidden: [
    {
      input: {
        args: "node) })(",
      },
      expected: true,
    },
    {
      input: {
        args: "{ length: 300 }, (_, index) => ({ val: index, next: null })); for (let index = 0; index < nodes.length - 1; index += 1) nodes[index].next = nodes[index + 1]; return hasCycle(nodes[0]) })(",
      },
      expected: false,
    },
  ],
};
