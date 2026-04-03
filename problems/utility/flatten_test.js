module.exports = [
  {
    input: "flatten([1, [2, 3]])",
    expected: [1, 2, 3],
  },
  {
    input: "flatten([1, [2, [3, [4]]]], 2)",
    expected: [1, 2, 3, [4]],
  },
  {
    input:
      "(() => { const source = [1, [2]]; const result = flatten(source, 0); return [JSON.stringify(result), result !== source] })()",
    expected: ["[1,[2]]", true],
  },
  {
    input: "flatten([], Infinity)",
    expected: [],
  },
  {
    input: "flatten([1, [2, [3, [4, [5]]]]], Infinity)",
    expected: [1, 2, 3, 4, 5],
  },
];
