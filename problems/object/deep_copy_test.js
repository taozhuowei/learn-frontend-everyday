module.exports = [
  {
    input:
      "(() => { const source = { a: 1, nested: { b: 2 } }; const clone = deepCopy(source); clone.nested.b = 3; return source.nested.b })()",
    expected: 2,
  },
  {
    input:
      "(() => { const source = [1, { value: 2 }]; const clone = deepCopy(source); clone[1].value = 4; return source[1].value })()",
    expected: 2,
  },
  {
    input:
      '(() => { const source = { date: new Date("2024-01-01T00:00:00.000Z") }; const clone = deepCopy(source); return clone.date instanceof Date })()',
    expected: true,
  },
  {
    input:
      "(() => { const source = { a: 1 }; source.self = source; const clone = deepCopy(source); return clone !== source && clone.self === clone })()",
    expected: true,
  },
  {
    input:
      "(() => { const source = { list: Array.from({ length: 200 }, (_, index) => ({ index })) }; const clone = deepCopy(source); clone.list[0].index = 999; return source.list[0].index })()",
    expected: 0,
  },
];
