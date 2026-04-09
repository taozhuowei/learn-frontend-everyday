module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: {
        target: "2",
        steps: [
          { type: "call", args: ["() => Promise.resolve()"] },
          { type: "call", args: ["() => Promise.resolve()"] },
          { type: "call", args: ["() => Promise.resolve()"] },
          { type: "await" },
        ],
      },
      expected: { callCount: 3 },
    },
    {
      id: "example-2",
      hidden: false,
      input: {
        target: "1",
        steps: [
          { type: "call", args: ["() => Promise.resolve()"] },
          { type: "call", args: ["() => Promise.resolve()"] },
          { type: "await" },
        ],
      },
      expected: { callCount: 2, maxConcurrent: 1 },
    },
    {
      id: "example-3",
      hidden: false,
      input: {
        target: "3",
        steps: [
          { type: "call", args: ["() => Promise.resolve()"] },
          { type: "call", args: ["() => Promise.resolve()"] },
          { type: "await" },
        ],
      },
      expected: { callCount: 2, maxConcurrent: 2 },
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: {
        target: "2",
        steps: [
          { type: "call", args: ["() => Promise.resolve(1)"] },
          { type: "call", args: ["() => Promise.resolve(2)"] },
          { type: "call", args: ["() => Promise.resolve(3)"] },
          { type: "call", args: ["() => Promise.resolve(4)"] },
          { type: "await" },
        ],
      },
      expected: { callCount: 4, maxConcurrent: 2 },
    },
    {
      id: "hidden-2",
      hidden: true,
      input: {
        target: "1",
        steps: [
          { type: "call", args: ["() => Promise.resolve()"] },
          { type: "call", args: ["() => Promise.resolve()"] },
          { type: "call", args: ["() => Promise.resolve()"] },
          { type: "call", args: ["() => Promise.resolve()"] },
          { type: "await" },
        ],
      },
      expected: { callCount: 4, maxConcurrent: 1 },
    },
    {
      id: "hidden-3",
      hidden: true,
      input: {
        target: "5",
        steps: [
          { type: "call", args: ["() => Promise.resolve()"] },
          { type: "call", args: ["() => Promise.resolve()"] },
          { type: "call", args: ["() => Promise.resolve()"] },
          { type: "await" },
        ],
      },
      expected: { callCount: 3, maxConcurrent: 3 },
    },
    {
      id: "hidden-4",
      hidden: true,
      input: {
        target: "2",
        steps: [
          { type: "call", args: ['() => Promise.reject(new Error("err"))'] },
          { type: "call", args: ["() => Promise.resolve()"] },
          { type: "await" },
        ],
      },
      expected: { callCount: 2, hasError: true },
    },
    {
      id: "hidden-5",
      hidden: true,
      input: {
        target: "2",
        steps: [
          {
            type: "call",
            args: ["() => new Promise(r => setTimeout(r, 100))"],
          },
          { type: "tick", ms: 50 },
          { type: "call", args: ["() => Promise.resolve()"] },
          { type: "tick", ms: 100 },
          { type: "await" },
        ],
      },
      expected: { callCount: 2, maxConcurrent: 2 },
    },
  ],
};
