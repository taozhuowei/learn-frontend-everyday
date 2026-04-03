module.exports = [
  {
    input:
      "(() => { const head = { val: 1, next: { val: 2, next: { val: 3, next: null } } }; const reversed = reverseList(head); const values = []; let current = reversed; while (current) { values.push(current.val); current = current.next } return values })()",
    expected: [3, 2, 1],
  },
  {
    input: "reverseList(null)",
    expected: null,
  },
  {
    input:
      "(() => { const head = { val: 9, next: null }; return reverseList(head).val })()",
    expected: 9,
  },
  {
    input:
      "(() => { const head = { val: 1, next: { val: 2, next: null } }; const reversed = reverseList(head); return reversed.next.val })()",
    expected: 1,
  },
  {
    input:
      "(() => { let head = null; for (let index = 0; index < 200; index += 1) head = { val: index, next: head }; const reversed = reverseList(head); let current = reversed; let count = 0; while (current) { count += 1; current = current.next } return count })()",
    expected: 200,
  },
];
