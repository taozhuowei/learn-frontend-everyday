module.exports = [
  {
    input: "[1, 2, 3].myMap((value) => value * 2)",
    expected: [2, 4, 6],
  },
  {
    input:
      "['a', 'b'].myMap(function (value) { return this.prefix + value }, { prefix: 'x-' })",
    expected: ["x-a", "x-b"],
  },
  {
    input:
      "(() => { const result = [1, , 3].myMap((value) => value * 2); return [result.length, 1 in result, 2 in result, result[0], result[2]] })()",
    expected: [3, false, true, 2, 6],
  },
  {
    input: "[].myMap(() => 1)",
    expected: [],
  },
  {
    input:
      "(() => { try { [1].myMap(null) } catch (error) { return error instanceof TypeError } })()",
    expected: true,
  },
];
