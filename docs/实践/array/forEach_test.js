module.exports = [
  {
    input:
      "(() => { let sum = 0; [1, 2, 3].myForEach((value) => { sum += value }); return sum })()",
    expected: 6,
  },
  {
    input:
      "(() => { const context = { base: 10 }; let total = 0; [1, 2].myForEach(function (value) { total += value + this.base }, context); return total })()",
    expected: 23,
  },
  {
    input:
      "(() => { let count = 0; const array = [1, , 3]; array.myForEach(() => { count += 1 }); return count })()",
    expected: 2,
  },
  {
    input:
      "(() => { let called = false; [].myForEach(() => { called = true }); return called })()",
    expected: false,
  },
  {
    input:
      "(() => { try { [1].myForEach('nope') } catch (error) { return error instanceof TypeError } })()",
    expected: true,
  },
];
