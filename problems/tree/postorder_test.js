/**
 * postorder 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: "{ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } }",
      },
      expected: [2, 3, 1],
    },
    {
      input: {
        args: "null",
      },
      expected: [],
    },
    {
      input: {
        args: "{ val: 9, left: null, right: null }",
      },
      expected: [9],
    },
  ],

  hidden: [
    {
      input: {
        args: "{ val: 1, left: { val: 2, left: { val: 4, left: null, right: null }, right: null }, right: { val: 3, left: null, right: { val: 5, left: null, right: null } } }",
      },
      expected: [4, 2, 5, 3, 1],
    },
    {
      input: {
        args: "let index = 1; index <= 80; index += 1) { current.right = { val: index, left: null, right: null }; current = current.right } return postorderTraversal(root).length })(",
      },
      expected: 81,
    },
  ],
};
