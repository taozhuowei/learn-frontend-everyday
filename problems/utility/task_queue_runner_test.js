module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: {
        target: "",
        steps: [{ type: "call", args: ["[]"] }, { type: "await" }],
      },
      expected: { callCount: 0 },
    },
    {
      id: "example-2",
      hidden: false,
      input: {
        target: "",
        steps: [
          { type: "call", args: ["[() => __MOCK__(() => Promise.resolve())]"] },
          { type: "await" },
        ],
      },
      expected: { callCount: 0 },
    },
    {
      id: "example-3",
      hidden: false,
      input: {
        target: "",
        steps: [
          {
            type: "call",
            args: [
              "[() => __MOCK__(() => Promise.resolve()), () => __MOCK__(() => Promise.resolve())]",
            ],
          },
          { type: "await" },
        ],
      },
      expected: { callCount: 0 },
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: {
        target: "",
        steps: [
          {
            type: "call",
            args: [
              "[() => __MOCK__(() => Promise.resolve(1)), () => __MOCK__(() => Promise.resolve(2)), () => __MOCK__(() => Promise.resolve(3))]",
            ],
          },
          { type: "await" },
        ],
      },
      expected: { callCount: 0 },
    },
    {
      id: "hidden-2",
      hidden: true,
      input: {
        target: "",
        steps: [
          {
            type: "call",
            args: ['[() => __MOCK__(() => Promise.reject(new Error("err")))]'],
          },
          { type: "await" },
        ],
      },
      expected: { callCount: 1, hasError: true },
    },
    {
      id: "hidden-3",
      hidden: true,
      input: {
        target: "",
        steps: [
          {
            type: "call",
            args: [
              "[() => __MOCK__(() => new Promise(r => setTimeout(r, 100)))]",
            ],
          },
          { type: "tick", ms: 100 },
          { type: "await" },
        ],
      },
      expected: { callCount: 1 },
    },
    {
      id: "hidden-4",
      hidden: true,
      input: {
        target: "",
        steps: [
          {
            type: "call",
            args: [
              "[() => __MOCK__(() => Promise.resolve()), () => __MOCK__(() => Promise.resolve())]",
            ],
          },
          { type: "call", args: ["[() => __MOCK__(() => Promise.resolve())]"] },
          { type: "await" },
        ],
      },
      expected: { callCount: 3 },
    },
    {
      id: "hidden-5",
      hidden: true,
      input: {
        target: "",
        steps: [
          {
            type: "call",
            args: ["[() => __MOCK__(() => Promise.resolve(1))]"],
          },
          { type: "await" },
          {
            type: "call",
            args: ["[() => __MOCK__(() => Promise.resolve(2))]"],
          },
          { type: "await" },
        ],
      },
      expected: { callCount: 0 },
    },
  ],
};
