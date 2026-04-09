module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: { target: "[3, 9, 20, null, null, 15, 7]" },
      expected: [[3], [9, 20], [15, 7]],
    },
    {
      id: "example-2",
      hidden: false,
      input: { target: "[1]" },
      expected: [[1]],
    },
    {
      id: "example-3",
      hidden: false,
      input: { target: "[]" },
      expected: [],
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: { target: "[1, 2, 3, 4, 5]" },
      expected: [[1], [2, 3], [4, 5]],
    },
    {
      id: "hidden-2",
      hidden: true,
      input: { target: "[1, 2, 3, null, null, 4, 5]" },
      expected: [[1], [2, 3], [4, 5]],
    },
    {
      id: "hidden-3",
      hidden: true,
      input: { target: "[1, 2]" },
      expected: [[1], [2]],
    },
    {
      id: "hidden-4",
      hidden: true,
      input: { target: "[1, null, 2]" },
      expected: [[1], [2]],
    },
    {
      id: "hidden-5",
      hidden: true,
      input: { target: "[1, 2, 3, 4, null, null, 5]" },
      expected: [[1], [2, 3], [4, 5]],
    },
  ],
};
