module.exports = [
  {
    input:
      "inorderTraversal({ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } })",
    expected: [2, 1, 3],
  },
  {
    input: "inorderTraversal(null)",
    expected: [],
  },
  {
    input: "inorderTraversal({ val: 9, left: null, right: null })",
    expected: [9],
  },
  {
    input:
      "inorderTraversal({ val: 1, left: { val: 2, left: { val: 4, left: null, right: null }, right: null }, right: { val: 3, left: null, right: { val: 5, left: null, right: null } } })",
    expected: [4, 2, 1, 3, 5],
  },
  {
    input:
      "(() => { let root = { val: 0, left: null, right: null }; let current = root; for (let index = 1; index <= 80; index += 1) { current.right = { val: index, left: null, right: null }; current = current.right } return inorderTraversal(root).length })()",
    expected: 81,
  },
];
