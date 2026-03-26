module.exports = [
  {
    input:
      "(() => { const l1 = { val: 1, next: { val: 3, next: null } }; const l2 = { val: 2, next: { val: 4, next: null } }; const head = mergeTwoLists(l1, l2); const values = []; let current = head; while (current) { values.push(current.val); current = current.next } return values })()",
    expected: [1, 2, 3, 4],
  },
  {
    input:
      "(() => { const head = mergeTwoLists(null, { val: 1, next: null }); const values = []; let current = head; while (current) { values.push(current.val); current = current.next } return values })()",
    expected: [1],
  },
  {
    input: "(() => { const head = mergeTwoLists(null, null); return head })()",
    expected: null,
  },
  {
    input:
      "(() => { const l1 = { val: 1, next: { val: 1, next: null } }; const l2 = { val: 1, next: { val: 2, next: null } }; const head = mergeTwoLists(l1, l2); const values = []; let current = head; while (current) { values.push(current.val); current = current.next } return values })()",
    expected: [1, 1, 1, 2],
  },
  {
    input:
      "(() => { const build = (start) => { let dummy = { val: 0, next: null }; let tail = dummy; for (let index = start; index < 200; index += 2) { tail.next = { val: index, next: null }; tail = tail.next } return dummy.next }; const head = mergeTwoLists(build(0), build(1)); let current = head; let count = 0; while (current) { count += 1; current = current.next } return count })()",
    expected: 200,
  },
];
