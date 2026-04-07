/**
 * bind 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: "a, b) { return this.base + a + b } const bound = add.myBind({ base: 1 }, 2); return bound(3) })(",
      },
      expected: 6,
    },
    {
      input: {
        args: "name) { this.name = name } Person.prototype.getName = function () { return this.name }; const BoundPerson = Person.myBind({ ignored: true }); const person = new BoundPerson('Tom'); return person.getName() })(",
      },
      expected: "Tom",
    },
    {
      input: {
        args: "a, b, c) { return a * b * c } const bound = multiply.myBind(null, 2, 3); return bound(4) })(",
      },
      expected: 24,
    },
  ],

  hidden: [
    {
      input: {
        args: ") { return Object.prototype.toString.call(this) } const bound = read.myBind('x'); return bound() })(",
      },
      expected: "[object String]",
    },
    {
      input: {
        args: "{}, null) } catch (error) { return error instanceof TypeError } })(",
      },
      expected: true,
    },
  ],
};
