module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: { target: "({ a: 1, b: { c: 2 } })", args: [] },
      expected: { a: 1, b: { c: 2 } },
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: { target: "[1, [2, 3]]", args: [] },
      expected: [1, [2, 3]],
    },
  ],
};
