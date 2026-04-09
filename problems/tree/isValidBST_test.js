module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: { target: "[2, 1, 3]" },
      expected: true,
    },
    {
      id: "example-2",
      hidden: false,
      input: { target: "[5, 1, 4, null, null, 3, 6]" },
      expected: false,
    },
    {
      id: "example-3",
      hidden: false,
      input: { target: "[]" },
      expected: true,
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: { target: "[1]" },
      expected: true,
    },
    {
      id: "hidden-2",
      hidden: true,
      input: { target: "[1, 1]" },
      expected: false,
    },
    {
      id: "hidden-3",
      hidden: true,
      input: { target: "[10, 5, 15, null, null, 6, 20]" },
      expected: false,
    },
    {
      id: "hidden-4",
      hidden: true,
      input: { target: "[3, null, 30, 10, null, null, 15, null, 45]" },
      expected: false,
    },
    {
      id: "hidden-5",
      hidden: true,
      input: { target: "[0, -1]" },
      expected: true,
    },
  ],
};
