module.exports = {
  noCustomCase: true,
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: {
        target: "promiseRace([MyPromise.resolve(1), MyPromise.resolve(2)])",
        args: [],
      },
      expected: 1,
    },
    {
      id: "example-2",
      hidden: false,
      input: {
        target: "promiseRace([])",
        args: [],
      },
      expected: { error: "" },
    },
    {
      id: "example-3",
      hidden: false,
      input: {
        target:
          'promiseRace([MyPromise.reject(new Error("err")), MyPromise.resolve(1)])',
        args: [],
      },
      expected: { error: "err" },
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: {
        target: "promiseRace([1, 2, 3])",
        args: [],
      },
      expected: 1,
    },
    {
      id: "hidden-2",
      hidden: true,
      input: {
        target:
          'promiseRace([MyPromise.resolve("first"), MyPromise.resolve("second")])',
        args: [],
      },
      expected: "first",
    },
    {
      id: "hidden-3",
      hidden: true,
      input: {
        target:
          "promiseRace([new MyPromise(r => setTimeout(() => r(1), 100)), MyPromise.resolve(2)])",
        args: [],
      },
      expected: 2,
    },
    {
      id: "hidden-4",
      hidden: true,
      input: {
        target: "promiseRace([MyPromise.resolve({ a: 1 })])",
        args: [],
      },
      expected: { a: 1 },
    },
    {
      id: "hidden-5",
      hidden: true,
      input: {
        target:
          'promiseRace([MyPromise.reject("fail"), MyPromise.reject("error")])',
        args: [],
      },
      expected: { error: "fail" },
    },
  ],
};
