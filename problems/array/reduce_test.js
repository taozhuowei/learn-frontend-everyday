module.exports = [
  {
    input: "[1, 2, 3].myReduce((sum, value) => sum + value, 0)",
    expected: 6,
  },
  {
    input: "[1, 2, 3].myReduce((sum, value) => sum + value)",
    expected: 6,
  },
  {
    input:
      "[{ count: 1 }, { count: 2 }].myReduce((sum, item) => sum + item.count, 0)",
    expected: 3,
  },
  {
    input:
      "(() => { const array = [, 1, 2]; return array.myReduce((sum, value) => sum + value, 0) })()",
    expected: 3,
  },
  {
    input:
      "(() => { try { [].myReduce((sum, value) => sum + value) } catch (error) { return error instanceof TypeError } })()",
    expected: true,
  },
];
