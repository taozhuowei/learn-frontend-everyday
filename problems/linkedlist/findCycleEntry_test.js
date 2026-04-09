module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: { target: "[3, 2, 0, -4]" },
      expected: null,
    },
    {
      id: "example-2",
      hidden: false,
      input: { target: "[1, 2]" },
      expected: null,
    },
    {
      id: "example-3",
      hidden: false,
      input: { target: "[1]" },
      expected: null,
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: { target: "[]" },
      expected: null,
    },
    {
      id: "hidden-2",
      hidden: true,
      input: { target: "[1, 2, 3, 4, 5]" },
      expected: null,
    },
    {
      id: "hidden-3",
      hidden: true,
      input: { target: "[1, 2, 3]" },
      expected: null,
    },
    {
      id: "hidden-4",
      hidden: true,
      input: { target: "[0, 0, 0]" },
      expected: null,
    },
    {
      id: "hidden-5",
      hidden: true,
      input: { target: "[1, 2, 3, 4]" },
      expected: null,
    },
  ],
};
