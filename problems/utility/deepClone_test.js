module.exports = [
  {
    input:
      "(() => { const source = { nested: { value: 1 } }; const cloned = deepClone(source); cloned.nested.value = 2; return [source.nested.value, cloned.nested.value] })()",
    expected: [1, 2],
  },
  {
    input:
      "(() => { const source = [1, [2, 3]]; const cloned = deepClone(source); cloned[1][0] = 9; return [source[1][0], cloned[1][0]] })()",
    expected: [2, 9],
  },
  {
    input:
      "(() => { const source = { name: 'loop' }; source.self = source; const cloned = deepClone(source); return cloned !== source && cloned.self === cloned })()",
    expected: true,
  },
  {
    input:
      "(() => { const source = new Map([[{ id: 1 }, new Set([1, 2])]]); const cloned = deepClone(source); const [[key, value]] = cloned.entries(); return [key.id, Array.from(value)] })()",
    expected: [1, [1, 2]],
  },
  {
    input:
      "(() => { const source = { date: new Date('2024-01-01T00:00:00.000Z'), pattern: /abc/gi }; const cloned = deepClone(source); return [cloned.date instanceof Date, cloned.date.getTime() === source.date.getTime(), cloned.pattern.source, cloned.pattern.flags] })()",
    expected: [true, true, "abc", "gi"],
  },
];
