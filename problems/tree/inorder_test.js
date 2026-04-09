module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: { target: "[1, null, 2, 3]" },
      expected: [1, 3, 2],
    },
    {
      id: "example-2",
      hidden: false,
      input: { target: "[]" },
      expected: [],
    },
    {
      id: "example-3",
      hidden: false,
      input: { target: "[1]" },
      expected: [1],
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: { target: "[1, 2, 3]" },
      expected: [2, 1, 3],
    },
    {
      id: "hidden-2",
      hidden: true,
      input: { target: "[1, 2, 3, 4, 5, 6, 7]" },
      expected: [4, 2, 5, 1, 6, 3, 7],
    },
    {
      id: "hidden-3",
      hidden: true,
      input: { target: "[1, null, 2, null, 3]" },
      expected: [1, 2, 3],
    },
    {
      id: "hidden-4",
      hidden: true,
      input: { target: "[3, 9, 20, null, null, 15, 7]" },
      expected: [9, 3, 15, 20, 7],
    },
    {
      id: "hidden-5",
      hidden: true,
      input: { target: "[2, 1, 3]" },
      expected: [1, 2, 3],
    },
  ],
};
