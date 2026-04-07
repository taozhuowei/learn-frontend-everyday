/**
 * instanceof 测试用例
 */

module.exports = {
  examples: [
    {
      input: {
        args: ") {} const person = new Person(); return myInstanceof(person, Person) })(",
      },
      expected: true,
    },
    {
      input: {
        args: ") {} function Animal() {} const person = new Person(); return myInstanceof(person, Animal) })(",
      },
      expected: false,
    },
    {
      input: {
        args: "'text', String",
      },
      expected: false,
    },
  ],

  hidden: [
    {
      input: {
        args: "function demo() {}, Function",
      },
      expected: true,
    },
    {
      input: {
        args: "{}, {}",
      },
      expected: false,
    },
  ],
};
