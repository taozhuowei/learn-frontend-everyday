/**
 * isValidBST 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: "{ val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } }",
      },
      expected: true,
    },
    {
      input: {
        args: "{ val: 5, left: { val: 1, left: null, right: null }, right: { val: 4, left: { val: 3, left: null, right: null }, right: { val: 6, left: null, right: null } } }",
      },
      expected: false,
    },
    {
      input: {
        args: "{ val: 10, left: { val: 5, left: null, right: { val: 12, left: null, right: null } }, right: { val: 15, left: null, right: null } }",
      },
      expected: false,
    },
  ],

  hidden: [
    {
      input: {
        args: "{ val: 1, left: null, right: null }",
      },
      expected: true,
    },
    {
      input: {
        args: "null",
      },
      expected: true,
    },
  ],
};
