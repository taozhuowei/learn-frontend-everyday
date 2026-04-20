module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: {
        target:
          "((function(a, b) { return this.x + a + b; }).myBind({ x: 10 }, 1)(2))",
        args: [],
      },
      expected: 13,
    },
    {
      id: "example-2",
      hidden: false,
      input: {
        target:
          "((function() { return this.name; }).myBind({ name: 'bound' })())",
        args: [],
      },
      expected: "bound",
    },
    {
      id: "example-3",
      hidden: false,
      input: {
        target:
          "((function(a, b, c) { return a + b + c; }).myBind({}, 1, 2)(3))",
        args: [],
      },
      expected: 6,
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: {
        target: "((function() { return this; }).myBind({ a: 1 })())",
        args: [],
      },
      expected: { a: 1 },
    },
    {
      id: "hidden-2",
      hidden: true,
      input: {
        target: "((function() { return !!new.target; }).myBind({})())",
        args: [],
      },
      expected: false,
    },
    {
      id: "hidden-3",
      hidden: true,
      input: {
        target:
          "((function(x) { return this.val + x; }).myBind({ val: 5 })(10))",
        args: [],
      },
      expected: 15,
    },
  ],
};
