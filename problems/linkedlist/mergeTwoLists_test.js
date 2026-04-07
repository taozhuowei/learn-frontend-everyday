/**
 * mergeTwoLists 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: "l1, l2); const values = []; let current = head; while (current) { values.push(current.val); current = current.next } return values })(",
      },
      expected: [1, 2, 3, 4],
    },
    {
      input: {
        args: "null, { val: 1, next: null }); const values = []; let current = head; while (current) { values.push(current.val); current = current.next } return values })(",
      },
      expected: [1],
    },
    {
      input: {
        args: "null, null); return head })(",
      },
      expected: null,
    },
  ],

  hidden: [
    {
      input: {
        args: "l1, l2); const values = []; let current = head; while (current) { values.push(current.val); current = current.next } return values })(",
      },
      expected: [1, 1, 1, 2],
    },
    {
      input: {
        args: "let index = start; index < 200; index += 2) { tail.next = { val: index, next: null }; tail = tail.next } return dummy.next }; const head = mergeTwoLists(build(0), build(1)); let current = head; let count = 0; while (current) { count += 1; current = current.next } return count })(",
      },
      expected: 200,
    },
  ],
};
