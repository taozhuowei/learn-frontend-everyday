module.exports = {
  noCustomCase: true,
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: {
        target:
          "promiseAll([MyPromise.resolve(1), MyPromise.resolve(2), MyPromise.resolve(3)])",
        args: [],
      },
      expected: [1, 2, 3],
    },
    {
      id: "example-2",
      hidden: false,
      input: {
        target: "promiseAll([])",
        args: [],
      },
      expected: [],
    },
    {
      id: "example-3",
      hidden: false,
      input: {
        target: 'promiseAll([MyPromise.resolve("a"), MyPromise.resolve("b")])',
        args: [],
      },
      expected: ["a", "b"],
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: {
        target: "promiseAll([1, 2, 3])",
        args: [],
      },
      expected: [1, 2, 3],
    },
    {
      id: "hidden-2",
      hidden: true,
      input: {
        target:
          'promiseAll([MyPromise.resolve(1), MyPromise.reject(new Error("err"))])',
        args: [],
      },
      expected: { error: "err" },
    },
    {
      id: "hidden-3",
      hidden: true,
      input: {
        target:
          "promiseAll([new MyPromise(r => setTimeout(() => r(1), 10)), MyPromise.resolve(2)])",
        args: [],
      },
      expected: [1, 2],
    },
    {
      id: "hidden-4",
      hidden: true,
      input: {
        target:
          "promiseAll([MyPromise.resolve({ x: 1 }), MyPromise.resolve({ y: 2 })])",
        args: [],
      },
      expected: [{ x: 1 }, { y: 2 }],
    },
    {
      id: "hidden-5",
      hidden: true,
      input: {
        target: 'promiseAll([MyPromise.reject("fail"), MyPromise.resolve(1)])',
        args: [],
      },
      expected: { error: "fail" },
    },
  ],
};
