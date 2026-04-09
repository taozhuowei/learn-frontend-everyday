module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: {
        target: "function Person(name) { this.name = name; }",
        args: ['"Alice"'],
      },
      expected: { name: "Alice" },
    },
    {
      id: "example-2",
      hidden: false,
      input: { target: "function Counter() { this.count = 0; }", args: [] },
      expected: { count: 0 },
    },
    {
      id: "example-3",
      hidden: false,
      input: {
        target: "function Point(x, y) { this.x = x; this.y = y; }",
        args: ["3", "4"],
      },
      expected: { x: 3, y: 4 },
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: {
        target: "function Fn() { this.a = 1; return { b: 2 }; }",
        args: [],
      },
      expected: { b: 2 },
    },
    {
      id: "hidden-2",
      hidden: true,
      input: { target: "function Fn() { return 42; }", args: [] },
      expected: {},
    },
    {
      id: "hidden-3",
      hidden: true,
      input: {
        target: "function Fn(a, b, c) { this.sum = a + b + c; }",
        args: ["1", "2", "3"],
      },
      expected: { sum: 6 },
    },
    {
      id: "hidden-4",
      hidden: true,
      input: {
        target: "function Fn() { this.args = arguments.length; }",
        args: ["1", "2"],
      },
      expected: { args: 2 },
    },
    {
      id: "hidden-5",
      hidden: true,
      input: {
        target: "class MyClass { constructor(x) { this.x = x; } }",
        args: ["10"],
      },
      expected: { x: 10 },
    },
  ],
};
