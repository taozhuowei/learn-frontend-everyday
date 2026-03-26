module.exports = [
  {
    input: "maxDepth(null)",
    expected: 0,
  },
  {
    input: "maxDepth({ val: 1, left: null, right: null })",
    expected: 1,
  },
  {
    input:
      "maxDepth({ val: 1, left: { val: 2, left: { val: 3, left: null, right: null }, right: null }, right: null })",
    expected: 3,
  },
  {
    input:
      "maxDepth({ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: { val: 4, left: null, right: null }, right: { val: 5, left: null, right: null } } })",
    expected: 3,
  },
  {
    input:
      "maxDepthBFS({ val: 1, left: { val: 2, left: { val: 4, left: null, right: null }, right: null }, right: { val: 3, left: null, right: { val: 5, left: { val: 6, left: null, right: null }, right: null } } })",
    expected: 4,
  },
];
