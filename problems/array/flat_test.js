module.exports = [
  {
    input: "[1, [2, 3]].myFlat()",
    expected: [1, 2, 3],
  },
  {
    input: "[1, [2, [3, [4]]]].myFlat(2)",
    expected: [1, 2, 3, [4]],
  },
  {
    input: "[1, [2, [3]]].myFlat(1)",
    expected: [1, 2, [3]],
  },
  {
    input: "[1, [2]].myFlat(0)",
    expected: [1, [2]],
  },
  {
    input: "[1, [2, [3, [4, [5]]]]].myFlat(Infinity)",
    expected: [1, 2, 3, 4, 5],
  },
];
