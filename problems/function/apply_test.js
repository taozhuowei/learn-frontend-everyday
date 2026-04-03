module.exports = [
  {
    input:
      "(() => { function add(a, b) { return this.base + a + b } return add.myApply({ base: 1 }, [2, 3]) })()",
    expected: 6,
  },
  {
    input:
      "(() => { globalThis.base = 4; function read(extra) { return this.base + extra } const result = read.myApply(null, [2]); delete globalThis.base; return result })()",
    expected: 6,
  },
  {
    input:
      "(() => { function tag() { return Object.prototype.toString.call(this) } return tag.myApply('hi') })()",
    expected: "[object String]",
  },
  {
    input:
      "(() => { function join(a, b) { return [a, b].join('-') } return join.myApply({}, { 0: 'x', 1: 'y', length: 2 }) })()",
    expected: "x-y",
  },
  {
    input:
      "(() => { try { Function.prototype.myApply.call({}, null, []) } catch (error) { return error instanceof TypeError } })()",
    expected: true,
  },
];
