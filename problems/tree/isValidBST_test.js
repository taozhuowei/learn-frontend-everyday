module.exports = [
  {
    input:
      "isValidBST({ val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } })",
    expected: true,
  },
  {
    input:
      "isValidBST({ val: 5, left: { val: 1, left: null, right: null }, right: { val: 4, left: { val: 3, left: null, right: null }, right: { val: 6, left: null, right: null } } })",
    expected: false,
  },
  {
    input:
      "isValidBST({ val: 10, left: { val: 5, left: null, right: { val: 12, left: null, right: null } }, right: { val: 15, left: null, right: null } })",
    expected: false,
  },
  {
    input: "isValidBST({ val: 1, left: null, right: null })",
    expected: true,
  },
  {
    input: "isValidBST(null)",
    expected: true,
  },
];
