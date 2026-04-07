/**
 * new 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: "name) { this.name = name } Person.prototype.getName = function () { return this.name }; return myNew(Person, 'Tom').getName() })(",
      },
      expected: "Tom",
    },
    {
      input: {
        args: ") { this.value = 1; return { value: 2 } } return myNew(Factory).value })(",
      },
      expected: 2,
    },
    {
      input: {
        args: ") { this.value = 3; return 4 } return myNew(Factory).value })(",
      },
      expected: 3,
    },
  ],

  hidden: [
    {
      input: {
        args: "null) } catch (error) { return error instanceof TypeError } })(",
      },
      expected: true,
    },
    {
      input: {
        args: "a, b) { this.total = a + b } return myNew(Sum, 3, 4).total })(",
      },
      expected: 7,
    },
  ],
};
