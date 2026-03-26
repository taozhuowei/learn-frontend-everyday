module.exports = [
  {
    input:
      "(() => { function Person(name) { this.name = name } Person.prototype.getName = function () { return this.name }; return myNew(Person, 'Tom').getName() })()",
    expected: "Tom",
  },
  {
    input:
      "(() => { function Factory() { this.value = 1; return { value: 2 } } return myNew(Factory).value })()",
    expected: 2,
  },
  {
    input:
      "(() => { function Factory() { this.value = 3; return 4 } return myNew(Factory).value })()",
    expected: 3,
  },
  {
    input:
      "(() => { try { myNew(null) } catch (error) { return error instanceof TypeError } })()",
    expected: true,
  },
  {
    input:
      "(() => { function Sum(a, b) { this.total = a + b } return myNew(Sum, 3, 4).total })()",
    expected: 7,
  },
];
