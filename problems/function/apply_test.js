module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: {
        target: "function(a, b) { return this.x + a + b; }",
        args: ["{ x: 10 }", "[1, 2]"],
      },
      expected: 13,
    },
    {
      id: "example-2",
      hidden: false,
      input: {
        target: "function() { return this.name; }",
        args: ['{ name: "test" }', "[]"],
      },
      expected: "test",
    },
    {
      id: "example-3",
      hidden: false,
      input: { target: "Math.max", args: ["null", "[1, 5, 3]"] },
      expected: 5,
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: { target: "function() { return this; }", args: ["null", "[]"] },
      expected: null,
    },
    {
      id: "hidden-2",
      hidden: true,
      input: {
        target: "function() { return arguments.length; }",
        args: ["{}", "[1, 2, 3, 4]"],
      },
      expected: 4,
    },
    {
      id: "hidden-3",
      hidden: true,
      input: { target: "Array.prototype.concat", args: ["[1, 2]", "[3, 4]"] },
      expected: [1, 2, 3, 4],
    },
    {
      id: "hidden-4",
      hidden: true,
      input: {
        target: "function(a, b, c) { return a + b + c; }",
        args: ["{}", "[1, 2, 3]"],
      },
      expected: 6,
    },
    {
      id: "hidden-5",
      hidden: true,
      input: { target: "String.prototype.slice", args: ['"hello"', "[1, 4]"] },
      expected: "ell",
    },
  ],
};
