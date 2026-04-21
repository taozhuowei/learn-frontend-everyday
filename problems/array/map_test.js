module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: { target: "[1, 2, 3]", args: ["x => x * 2"] },
      expected: [2, 4, 6],
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: { target: "[]", args: ["x => x * 2"] },
      expected: [],
    },
    {
      id: "hidden-2",
      hidden: true,
      input: { target: "[1, 2, 3]", args: ["(x, i) => x + i"] },
      expected: [1, 3, 5],
    },
    {
      id: "hidden-3",
      hidden: true,
      input: { target: "[1, 2, 3]", args: ["x => x * 2"] },
      expected: [2, 4, 6],
    },
  ],
};
