module.exports = [
  {
    input:
      "(() => { function add(a, b) { return this.base + a + b } return add.myCall({ base: 1 }, 2, 3) })()",
    expected: 6,
  },
  {
    input:
      "(() => { globalThis.base = 5; function read(extra) { return this.base + extra } const result = read.myCall(null, 2); delete globalThis.base; return result })()",
    expected: 7,
  },
  {
    input:
      "(() => { function tag() { return Object.prototype.toString.call(this) } return tag.myCall('hi') })()",
    expected: "[object String]",
  },
  {
    input:
      "(() => { function getValue() { return this.value } return getValue.myCall({ value: 'ok' }) })()",
    expected: "ok",
  },
  {
    input:
      "(() => { try { Function.prototype.myCall.call({}, null) } catch (error) { return error instanceof TypeError } })()",
    expected: true,
  },
];
