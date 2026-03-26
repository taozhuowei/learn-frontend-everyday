module.exports = [
  {
    input:
      "(() => { const node2 = { val: 2, next: null }; const head = { val: 1, next: node2 }; node2.next = head; return hasCycle(head) })()",
    expected: true,
  },
  {
    input:
      "(() => { const head = { val: 1, next: { val: 2, next: null } }; return hasCycle(head) })()",
    expected: false,
  },
  {
    input: "hasCycle(null)",
    expected: false,
  },
  {
    input:
      "(() => { const node = { val: 1, next: null }; node.next = node; return hasCycle(node) })()",
    expected: true,
  },
  {
    input:
      "(() => { const nodes = Array.from({ length: 300 }, (_, index) => ({ val: index, next: null })); for (let index = 0; index < nodes.length - 1; index += 1) nodes[index].next = nodes[index + 1]; return hasCycle(nodes[0]) })()",
    expected: false,
  },
];
