module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: { target: "[1, [2, 3], 4]", args: ["1"] },
      expected: [1, 2, 3, 4],
    },
    {
      id: "example-2",
      hidden: false,
      input: { target: "[1, [2, [3, [4]]]]", args: ["1"] },
      expected: [1, 2, [3, [4]]],
    },
    {
      id: "example-3",
      hidden: false,
      input: { target: "[1, 2, 3]", args: ["1"] },
      expected: [1, 2, 3],
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: { target: "[1, [2, [3, [4]]]]", args: ["2"] },
      expected: [1, 2, 3, [4]],
    },
    {
      id: "hidden-2",
      hidden: true,
      input: { target: "[1, [2, [3, [4]]]]", args: ["Infinity"] },
      expected: [1, 2, 3, 4],
    },
    {
      id: "hidden-3",
      hidden: true,
      input: { target: "[]", args: ["1"] },
      expected: [],
    },
    {
      id: "hidden-4",
      hidden: true,
      input: { target: "[[[[1]]]]", args: ["3"] },
      expected: [[1]],
    },
    {
      id: "hidden-5",
      hidden: true,
      input: { target: "[1, [], 2, [], 3]", args: ["1"] },
      expected: [1, 2, 3],
    },
  ],
};
