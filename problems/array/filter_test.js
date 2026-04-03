module.exports = [
  {
    input: "[1, 2, 3, 4].myFilter((value) => value % 2 === 0)",
    expected: [2, 4],
  },
  {
    input:
      "[3, 4, 5].myFilter(function (value) { return value > this.limit }, { limit: 3 })",
    expected: [4, 5],
  },
  {
    input:
      "(() => { const array = [1, , 3, 0]; return array.myFilter(Boolean) })()",
    expected: [1, 3],
  },
  {
    input: "[].myFilter(() => true)",
    expected: [],
  },
  {
    input:
      "(() => { try { [1].myFilter(null) } catch (error) { return error instanceof TypeError } })()",
    expected: true,
  },
];
