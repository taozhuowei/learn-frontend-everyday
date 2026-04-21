module.exports = {
  noCustomCase: true,
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: {
        target: "new MyPromise(resolve => resolve(42))",
        args: [],
      },
      expected: 42,
    },
    {
      id: "example-2",
      hidden: false,
      input: {
        target: 'new MyPromise((resolve, reject) => reject(new Error("fail")))',
        args: [],
      },
      expected: { error: "fail" },
    },
    {
      id: "example-3",
      hidden: false,
      input: {
        target: "new MyPromise(resolve => resolve(5)).then(v => v * 2)",
        args: [],
      },
      expected: 10,
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: {
        target: "new MyPromise(resolve => setTimeout(() => resolve(100), 10))",
        args: [],
      },
      expected: 100,
    },
    {
      id: "hidden-2",
      hidden: true,
      input: {
        target:
          "new MyPromise(resolve => resolve(1)).then(v => v + 1).then(v => v * 2)",
        args: [],
      },
      expected: 4,
    },
    {
      id: "hidden-3",
      hidden: true,
      input: {
        target: 'new MyPromise((resolve, reject) => reject("error"))',
        args: [],
      },
      expected: { error: "error" },
    },
    {
      id: "hidden-4",
      hidden: true,
      input: {
        target:
          "new MyPromise(resolve => resolve({ a: 1 })).then(obj => obj.a)",
        args: [],
      },
      expected: 1,
    },
    {
      id: "hidden-5",
      hidden: true,
      input: {
        target: "MyPromise.resolve(10)",
        args: [],
      },
      expected: 10,
    },
  ],
};
