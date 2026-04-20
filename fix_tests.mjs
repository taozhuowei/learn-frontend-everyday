import fs from 'fs';
import path from 'path';

const bindFix = `module.exports = {
  examples: [
    {
      id: "example-1",
      hidden: false,
      input: {
        target: "((function(a, b) { return this.x + a + b; }).myBind({ x: 10 }, 1)(2))",
        args: [],
      },
      expected: 13,
    },
    {
      id: "example-2",
      hidden: false,
      input: {
        target: "((function() { return this.name; }).myBind({ name: 'bound' })())",
        args: [],
      },
      expected: "bound",
    },
    {
      id: "example-3",
      hidden: false,
      input: {
        target: "((function(a, b, c) { return a + b + c; }).myBind({}, 1, 2)(3))",
        args: [],
      },
      expected: 6,
    },
  ],
  hidden: [
    {
      id: "hidden-1",
      hidden: true,
      input: { target: "((function() { return this; }).myBind({ a: 1 })())", args: [] },
      expected: { a: 1 },
    },
    {
      id: "hidden-2",
      hidden: true,
      input: { target: "((function() { return !!new.target; }).myBind({})())", args: [] },
      expected: false,
    },
    {
      id: "hidden-3",
      hidden: true,
      input: {
        target: "((function(x) { return this.val + x; }).myBind({ val: 5 })(10))",
        args: [],
      },
      expected: 15,
    },
  ],
};`;

fs.writeFileSync('problems/function/bind_test.js', bindFix);

const flatFix = fs.readFileSync('problems/array/flat_test.js', 'utf8')
  .replace('expected: [[1]]', 'expected: [1]');
fs.writeFileSync('problems/array/flat_test.js', flatFix);

const flattenFix = fs.readFileSync('problems/utility/flatten_test.js', 'utf8')
  .replace('expected: [[1]]', 'expected: [1]');
fs.writeFileSync('problems/utility/flatten_test.js', flattenFix);

const deepCloneFix = fs.readFileSync('problems/utility/deepClone_test.js', 'utf8')
  .replace('expected: { a: null, c: null }', 'expected: { a: null, b: undefined, c: null }');
fs.writeFileSync('problems/utility/deepClone_test.js', deepCloneFix);

// Also fix deep_copy_test.js
const deepCopyFix = fs.readFileSync('problems/object/deep_copy_test.js', 'utf8')
  .replace('expected: { a: null, c: null }', 'expected: { a: null, b: undefined, c: null }');
fs.writeFileSync('problems/object/deep_copy_test.js', deepCopyFix);
