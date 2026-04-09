module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: { target: "(a, b, c) => a + b + c", args: ["1", "2", "3"] },
      expected: 6,
    },
    {
      id: "example-2",
      hidden: false,
      input: { target: "(x, y) => x * y", args: ["2", "5"] },
      expected: 10,
    },
    {
      id: "example-3",
      hidden: false,
      input: { target: "(a) => a", args: ["42"] },
      expected: 42,
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: {
        target: "(a, b, c, d) => a + b + c + d",
        args: ["1", "2", "3", "4"],
      },
      expected: 10,
    },
    {
      id: "hidden-2",
      hidden: true,
      input: { target: "() => 42", args: [] },
      expected: 42,
    },
    {
      id: "hidden-3",
      hidden: true,
      input: { target: "(a, b) => ({ a, b })", args: ["1", "2"] },
      expected: { a: 1, b: 2 },
    },
    {
      id: "hidden-4",
      hidden: true,
      input: {
        target: "(str, prefix, suffix) => prefix + str + suffix",
        args: ['"hello"', '"<"', '">"'],
      },
      expected: "<hello>",
    },
    {
      id: "hidden-5",
      hidden: true,
      input: {
        target: "(arr, fn) => arr.map(fn)",
        args: ["[1, 2, 3]", "x => x * 2"],
      },
      expected: [2, 4, 6],
    },
  ],
};
