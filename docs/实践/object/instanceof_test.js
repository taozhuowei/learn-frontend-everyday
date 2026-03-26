module.exports = [
  {
    input:
      "(() => { function Person() {} const person = new Person(); return myInstanceof(person, Person) })()",
    expected: true,
  },
  {
    input:
      "(() => { function Person() {} function Animal() {} const person = new Person(); return myInstanceof(person, Animal) })()",
    expected: false,
  },
  {
    input: "myInstanceof('text', String)",
    expected: false,
  },
  {
    input: "myInstanceof(function demo() {}, Function)",
    expected: true,
  },
  {
    input: "myInstanceof({}, {})",
    expected: false,
  },
];
