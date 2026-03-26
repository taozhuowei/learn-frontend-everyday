module.exports = [
  {
    input:
      "(() => { const entry = { val: 2, next: { val: 3, next: null } }; const head = { val: 1, next: entry }; entry.next.next = entry; return detectCycle(head).val })()",
    expected: 2,
  },
  {
    input:
      "(() => { const node = { val: 1, next: null }; node.next = node; return detectCycle(node).val })()",
    expected: 1,
  },
  {
    input: "detectCycle(null)",
    expected: null,
  },
  {
    input:
      "(() => { const head = { val: 1, next: { val: 2, next: null } }; return detectCycle(head) })()",
    expected: null,
  },
  {
    input:
      "(() => { const nodes = Array.from({ length: 200 }, (_, index) => ({ val: index, next: null })); for (let index = 0; index < nodes.length - 1; index += 1) nodes[index].next = nodes[index + 1]; nodes[nodes.length - 1].next = nodes[120]; return detectCycle(nodes[0]).val })()",
    expected: 120,
  },
];
