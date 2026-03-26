module.exports = [
  {
    input:
      "(async () => { const result = []; await execute([() => Promise.resolve(result.push(1)), () => Promise.resolve(result.push(2))], 100, 1); return result })()",
    expected: [1, 2],
  },
  {
    input:
      '(async () => { const value = await runTask(() => Promise.resolve("ok"), 0, 100, 1); return value })()',
    expected: "ok",
  },
  {
    input:
      '(async () => { let count = 0; const value = await runTask(() => { count += 1; return count < 2 ? Promise.reject(new Error("retry")) : Promise.resolve("done") }, 0, 100, 2); return value })()',
    expected: "done",
  },
  {
    input:
      "(async () => { try { await execute([123], 100, 1) } catch (error) { return error instanceof TypeError } })()",
    expected: true,
  },
  {
    input:
      "(async () => { const tasks = Array.from({ length: 20 }, (_, index) => () => Promise.resolve(index)); await execute(tasks, 100, 1); return tasks.length })()",
    expected: 20,
  },
];
