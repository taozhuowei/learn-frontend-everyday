module.exports = [
  {
    input:
      "(async () => { const result = await new MyPromise((resolve) => resolve(1)).then((value) => value + 1); return result })()",
    expected: 2,
  },
  {
    input:
      '(async () => { const result = await new MyPromise((resolve) => setTimeout(() => resolve("ok"), 10)); return result })()',
    expected: "ok",
  },
  {
    input:
      "(async () => { const result = await new MyPromise((resolve) => resolve(2)).then((value) => value * 3); return result })()",
    expected: 6,
  },
  {
    input:
      '(async () => { try { await new MyPromise((resolve, reject) => reject(new Error("fail"))) } catch (error) { return error.message } })()',
    expected: "fail",
  },
  {
    input:
      "(async () => { let current = new MyPromise((resolve) => resolve(0)); for (let index = 0; index < 20; index += 1) current = current.then((value) => value + 1); return current })()",
    expected: 20,
  },
];
