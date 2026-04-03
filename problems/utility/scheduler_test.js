module.exports = [
  {
    input:
      '(async () => { const scheduler = new Scheduler(2); const result = []; const createTask = (value, delay) => () => new Promise((resolve) => setTimeout(() => { result.push(value); resolve(value) }, delay)); await Promise.all([scheduler.add(createTask("A", 20)), scheduler.add(createTask("B", 10)), scheduler.add(createTask("C", 5))]); return result.includes("A") && result.includes("B") && result.includes("C") })()',
    expected: true,
  },
  {
    input:
      '(async () => { const scheduler = new Scheduler(1); const timeline = []; const createTask = (label, delay) => () => new Promise((resolve) => setTimeout(() => { timeline.push(label); resolve(label) }, delay)); await Promise.all([scheduler.add(createTask("first", 10)), scheduler.add(createTask("second", 5))]); return timeline.join(",") })()',
    expected: "first,second",
  },
  {
    input:
      '(async () => { const scheduler = new Scheduler(2); const value = await scheduler.add(() => Promise.resolve("ok")); return value })()',
    expected: "ok",
  },
  {
    input:
      '(async () => { const scheduler = new Scheduler(2); try { await scheduler.add(() => Promise.reject(new Error("fail"))) } catch (error) { return error.message } })()',
    expected: "fail",
  },
  {
    input:
      "(async () => { const scheduler = new Scheduler(5); const results = await Promise.all(Array.from({ length: 30 }, (_, index) => scheduler.add(() => Promise.resolve(index)))); return results.length })()",
    expected: 30,
  },
];
