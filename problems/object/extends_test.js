module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: { target: "function Parent() {} function Child() {}", args: [] },
      expected: true,
    },
    {
      id: "example-2",
      hidden: false,
      input: { target: "class A {} class B extends A {}", args: [] },
      expected: true,
    },
    {
      id: "example-3",
      hidden: false,
      input: { target: "class A {} class B {}", args: [] },
      expected: false,
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: { target: "function Animal() {} function Dog() {}", args: [] },
      expected: true,
    },
    {
      id: "hidden-2",
      hidden: true,
      input: { target: "function Shape() {} function Circle() {}", args: [] },
      expected: true,
    },
    {
      id: "hidden-3",
      hidden: true,
      input: {
        target: "class Base { constructor() { this.x = 1; } }",
        args: [],
      },
      expected: true,
    },
    {
      id: "hidden-4",
      hidden: true,
      input: {
        target: "function A() {} function B() {} function C() {}",
        args: [],
      },
      expected: true,
    },
    {
      id: "hidden-5",
      hidden: true,
      input: {
        target: "class GrandParent {} class Parent extends GrandParent {}",
        args: [],
      },
      expected: true,
    },
  ],
};
