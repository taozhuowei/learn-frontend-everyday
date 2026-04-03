module.exports = [
  {
    input: "curry((a, b, c) => a + b + c)(1)(2)(3)",
    expected: 6,
  },
  {
    input: "curry((a, b, c) => a + b + c)(1, 2)(3)",
    expected: 6,
  },
  {
    input: "curry((a, b, c) => a + b + c)(1)(2, 3)",
    expected: 6,
  },
  {
    input: "curry((a, b, c) => a * b * c)(2)(3)(4)",
    expected: 24,
  },
  {
    input: "curry((a, b) => a - b)(10, 3)",
    expected: 7,
  },
];
