/**
 * reverseList 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: "head); const values = []; let current = reversed; while (current) { values.push(current.val); current = current.next } return values })(",
      },
      expected: [3, 2, 1],
    },
    {
      input: {
        args: "null",
      },
      expected: null,
    },
    {
      input: {
        args: "head).val })(",
      },
      expected: 9,
    },
  ],

  hidden: [
    {
      input: {
        args: "head); return reversed.next.val })(",
      },
      expected: 1,
    },
    {
      input: {
        args: "let index = 0; index < 200; index += 1) head = { val: index, next: head }; const reversed = reverseList(head); let current = reversed; let count = 0; while (current) { count += 1; current = current.next } return count })(",
      },
      expected: 200,
    },
  ],
};
