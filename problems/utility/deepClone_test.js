/**
 * deepClone 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: "source); cloned.nested.value = 2; return [source.nested.value, cloned.nested.value] })(",
      },
      expected: [1, 2],
    },
    {
      input: {
        args: "source); cloned[1][0] = 9; return [source[1][0], cloned[1][0]] })(",
      },
      expected: [2, 9],
    },
    {
      input: {
        args: "source); return cloned !== source && cloned.self === cloned })(",
      },
      expected: true,
    },
  ],

  hidden: [
    {
      input: {
        args: "[[{ id: 1 }, new Set([1, 2])]]); const cloned = deepClone(source); const [[key, value]] = cloned.entries(); return [key.id, Array.from(value)] })(",
      },
      expected: [1, [1, 2]],
    },
    {
      input: {
        args: "'2024-01-01T00:00:00.000Z'), pattern: /abc/gi }; const cloned = deepClone(source); return [cloned.date instanceof Date, cloned.date.getTime() === source.date.getTime(), cloned.pattern.source, cloned.pattern.flags] })(",
      },
      expected: [true, true, "abc", "gi"],
    },
  ],
};
