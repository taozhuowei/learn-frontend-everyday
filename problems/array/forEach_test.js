module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: { target: "[1, 2, 3]", args: ["x => console.log(x)"] },
      expected: undefined,
    },
    {
      id: "example-2",
      hidden: false,
      input: {
        target: '["a", "b", "c"]',
        args: ["(x, i) => console.log(i, x)"],
      },
      expected: undefined,
    },
    {
      id: "example-3",
      hidden: false,
      input: { target: "[]", args: ["x => x * 2"] },
      expected: undefined,
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: {
        target: "[1, 2, 3]",
        args: ["(x, i, arr) => console.log(arr.length)"],
      },
      expected: undefined,
    },
    {
      id: "hidden-2",
      hidden: true,
      input: {
        target: "[1, 2, 3]",
        args: ["function(x) { this.sum += x; }"],
        thisArg: "{ sum: 0 }",
      },
      expected: undefined,
    },
    {
      id: "hidden-3",
      hidden: true,
      input: { target: "[1, 2, 3]", args: ["x => x"] },
      expected: undefined,
    },
    {
      id: "hidden-4",
      hidden: true,
      input: { target: "[1, , 3]", args: ["x => console.log(x)"] },
      expected: undefined,
    },
    {
      id: "hidden-5",
      hidden: true,
      input: { target: "new Array(3)", args: ["(x, i) => console.log(i)"] },
      expected: undefined,
    },
  ],
};
