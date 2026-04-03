module.exports = [
  {
    input:
      "levelOrder({ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } })",
    expected: [[1], [2, 3]],
  },
  {
    input: "levelOrder(null)",
    expected: [],
  },
  {
    input: "levelOrder({ val: 9, left: null, right: null })",
    expected: [[9]],
  },
  {
    input:
      "levelOrder({ val: 1, left: { val: 2, left: { val: 4, left: null, right: null }, right: null }, right: { val: 3, left: null, right: { val: 5, left: null, right: null } } })",
    expected: [[1], [2, 3], [4, 5]],
  },
  {
    input:
      "(() => { let root = { val: 0, left: null, right: null }; let current = root; for (let index = 1; index <= 80; index += 1) { current.right = { val: index, left: null, right: null }; current = current.right } return levelOrder(root).length })()",
    expected: 81,
  },
];
