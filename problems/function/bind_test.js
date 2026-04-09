module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: {
        target: "function(a, b) { return this.x + a + b; }",
        args: ["{ x: 10 }", "1"],
      },
      expected: "bind_result",
    },
    {
      id: "example-2",
      hidden: false,
      input: {
        target: "function() { return this.name; }",
        args: ['{ name: "bound" }'],
      },
      expected: "bind_result",
    },
    {
      id: "example-3",
      hidden: false,
      input: {
        target: "function(a, b, c) { return a + b + c; }",
        args: ["{}", "1", "2"],
      },
      expected: "bind_result",
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: { target: "function() { return this; }", args: ["{ a: 1 }"] },
      expected: "bind_result",
    },
    {
      id: "hidden-2",
      hidden: true,
      input: { target: "function() { return new.target; }", args: ["{}"] },
      expected: "bind_result",
    },
    {
      id: "hidden-3",
      hidden: true,
      input: {
        target: "function(x) { return this.val + x; }",
        args: ["{ val: 5 }"],
      },
      expected: "bind_result",
    },
    {
      id: "hidden-4",
      hidden: true,
      input: {
        target: "function(a, b) { return a * b; }",
        args: ["null", "3"],
      },
      expected: "bind_result",
    },
    {
      id: "hidden-5",
      hidden: true,
      input: { target: "Array.prototype.push", args: ["[1, 2]"] },
      expected: "bind_result",
    },
  ],
};
