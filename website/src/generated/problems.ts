import type { ProblemRecord } from '../types/content'

export const problems: ProblemRecord[] = [
  {
    "id": "filter",
    "slug": "filter",
    "sequence": 1,
    "title": "Filter",
    "categoryId": "array",
    "categoryName": "数组方法",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个与 Array.prototype.filter 行为一致的 myFilter 方法。它需要遍历当前数组，对每个实际存在的元素执行回调函数；当回调返回真值时，把该元素按原顺序放入新的结果数组中。实现时不能修改原数组，需要支持可选的 thisArg，并正确处理 this 为 null 或 undefined、回调不是函数、数组存在空槽等基础边界。",
    "approachText": "先校验调用者和回调是否合法，再按索引顺序遍历数组；只有当前索引真实存在时才执行回调，回调返回真值就把该元素推入结果数组，从而得到不改变原数组的新结果。",
    "paramsText": "callback：用于决定元素是否保留的回调函数，参数依次为当前元素、当前索引和原数组。\nthisArg：可选的回调执行上下文；如果传入，则在调用 callback 时作为 this 使用。",
    "returnText": "返回一个新数组，里面包含所有通过回调判断的元素，元素顺序与原数组保持一致。",
    "template": "Array.prototype.myFilter = function (callback, thisArg) {\n\n};\n\nexport default Array.prototype.myFilter;",
    "solutionCode": "Array.prototype.myFilter = function (callback, thisArg) {\n  // 1. 检查 this 是否合法\n  if (this === null || this === undefined) {\n    throw new TypeError(\"Array.prototype.myFilter called on null or undefined\");\n  }\n\n  // 2. 检查回调必须是函数\n  if (typeof callback !== \"function\") {\n    throw new TypeError(callback + \" is not a function\");\n  }\n\n  // 3. 拿到数组 & 长度\n  const arr = this;\n  // 使用位运算符确保 length 是一个非负整数，同时为结果数组预分配空间\n  const len = arr.length >>> 0;\n  const result = [];\n\n  // 4. 遍历 + 过滤\n  for (let i = 0; i < len; i++) {\n    // 只处理真实存在的元素（跳过空元素）\n    if (i in arr) {\n      // 回调返回 true，就放进结果数组\n      if (callback.call(thisArg, arr[i], i, arr)) {\n        result.push(arr[i]);\n      }\n    }\n  }\n\n  // 5. 返回新数组\n  return result;\n};\n\nexport default Array.prototype.myFilter;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[1, 2, 3, 4, 5, 6]",
            "args": [
              "x => x % 2 === 0"
            ]
          },
          "expected": [
            2,
            4,
            6
          ]
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "[1, 2, 3, 4]",
            "args": [
              "x => x > 2"
            ]
          },
          "expected": [
            3,
            4
          ]
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[\"a\", \"bb\", \"ccc\", \"d\"]",
            "args": [
              "s => s.length > 1"
            ]
          },
          "expected": [
            "bb",
            "ccc"
          ]
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[]",
            "args": [
              "x => true"
            ]
          },
          "expected": []
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3]",
            "args": [
              "x => true"
            ]
          },
          "expected": [
            1,
            2,
            3
          ]
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3]",
            "args": [
              "x => false"
            ]
          },
          "expected": []
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3, 4]",
            "args": [
              "(x, i) => i > 1"
            ]
          },
          "expected": [
            3,
            4
          ]
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "[{a: 1}, {a: 2}, {a: 3}]",
            "args": [
              "x => x.a > 1"
            ]
          },
          "expected": [
            {
              "a": 2
            },
            {
              "a": 3
            }
          ]
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, 2, 3, 4, 5, 6](x => x % 2 === 0)",
        "displayTarget": "[1, 2, 3, 4, 5, 6]",
        "displayArgs": [
          "x => x % 2 === 0"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1, 2, 3, 4](x => x > 2)",
        "displayTarget": "[1, 2, 3, 4]",
        "displayArgs": [
          "x => x > 2"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[\"a\", \"bb\", \"ccc\", \"d\"](s => s.length > 1)",
        "displayTarget": "[\"a\", \"bb\", \"ccc\", \"d\"]",
        "displayArgs": [
          "s => s.length > 1"
        ],
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, 2, 3, 4, 5, 6](x => x % 2 === 0)",
        "displayTarget": "[1, 2, 3, 4, 5, 6]",
        "displayArgs": [
          "x => x % 2 === 0"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1, 2, 3, 4](x => x > 2)",
        "displayTarget": "[1, 2, 3, 4]",
        "displayArgs": [
          "x => x > 2"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[\"a\", \"bb\", \"ccc\", \"d\"](s => s.length > 1)",
        "displayTarget": "[\"a\", \"bb\", \"ccc\", \"d\"]",
        "displayArgs": [
          "s => s.length > 1"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[](x => true)",
        "displayTarget": "[]",
        "displayArgs": [
          "x => true"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[1, 2, 3](x => true)",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "x => true"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[1, 2, 3](x => false)",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "x => false"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[1, 2, 3, 4]((x, i) => i > 1)",
        "displayTarget": "[1, 2, 3, 4]",
        "displayArgs": [
          "(x, i) => i > 1"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[{a: 1}, {a: 2}, {a: 3}](x => x.a > 1)",
        "displayTarget": "[{a: 1}, {a: 2}, {a: 3}]",
        "displayArgs": [
          "x => x.a > 1"
        ],
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/array/filter.js",
    "testPath": "problems/array/filter_test.js"
  },
  {
    "id": "flat",
    "slug": "flat",
    "sequence": 2,
    "title": "Flat",
    "categoryId": "array",
    "categoryName": "数组方法",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个与 Array.prototype.flat 类似的 myFlat 方法。它需要把当前数组中的嵌套数组按指定深度逐层展开，深度耗尽后保留剩余嵌套结构，并返回一个新的扁平化数组。实现时不能修改原数组，需要正确处理 depth 的默认值、Infinity、0、负数，以及数组空槽和 this 非法等边界。",
    "approachText": "先校验调用者并规范化 depth，再通过递归遍历当前数组；当元素仍是数组且剩余深度大于 0 时继续展开，否则直接把元素放入结果数组，这样就能精确控制展开层数。",
    "paramsText": "depth：可选的展开深度，默认展开一层；传入 Infinity 时表示尽可能展开到最深层。",
    "returnText": "返回一个新的数组，其中嵌套数组会在允许的深度范围内被展开，原数组保持不变。",
    "template": "Array.prototype.myFlat = function (depth = 1) {\n\n};\n\nexport default Array.prototype.myFlat;",
    "solutionCode": "Array.prototype.myFlat = function (depth = 1) {\n  // 1. 检查 this 合法性\n  if (this == null) {\n    throw new TypeError(\"Cannot read property 'myFlat' of null or undefined\");\n  }\n\n  // 2. 规范化 depth，如果小于等于 0 则直接返回原数组副本\n  if (depth <= 0) {\n    return Array.from(this);\n  }\n\n  const arr = this;\n  const result = [];\n\n  // 3. 定义递归拍平函数\n  function flatDeep(array, currentDepth) {\n    for (const item of array) {\n      // 判断是否是数组 && 是否还能继续拍平\n      if (Array.isArray(item) && currentDepth < depth) {\n        flatDeep(item, currentDepth + 1); // 递归\n      } else {\n        result.push(item); // 不是数组直接放入结果\n      }\n    }\n  }\n\n  // 4. 开始递归拍平，默认深度从 0 开始\n  flatDeep(arr, 0);\n\n  return result;\n};\n\nexport default Array.prototype.myFlat;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[1, [2, 3], 4]",
            "args": [
              "1"
            ]
          },
          "expected": [
            1,
            2,
            3,
            4
          ]
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "[1, [2, [3, [4]]]]",
            "args": [
              "1"
            ]
          },
          "expected": [
            1,
            2,
            [
              3,
              [
                4
              ]
            ]
          ]
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[1, 2, 3]",
            "args": [
              "1"
            ]
          },
          "expected": [
            1,
            2,
            3
          ]
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[1, [2, [3, [4]]]]",
            "args": [
              "2"
            ]
          },
          "expected": [
            1,
            2,
            3,
            [
              4
            ]
          ]
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "[1, [2, [3, [4]]]]",
            "args": [
              "Infinity"
            ]
          },
          "expected": [
            1,
            2,
            3,
            4
          ]
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[]",
            "args": [
              "1"
            ]
          },
          "expected": []
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "[[[[1]]]]",
            "args": [
              "3"
            ]
          },
          "expected": [
            1
          ]
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "[1, [], 2, [], 3]",
            "args": [
              "1"
            ]
          },
          "expected": [
            1,
            2,
            3
          ]
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, [2, 3], 4](1)",
        "displayTarget": "[1, [2, 3], 4]",
        "displayArgs": [
          "1"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1, [2, [3, [4]]]](1)",
        "displayTarget": "[1, [2, [3, [4]]]]",
        "displayArgs": [
          "1"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[1, 2, 3](1)",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "1"
        ],
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, [2, 3], 4](1)",
        "displayTarget": "[1, [2, 3], 4]",
        "displayArgs": [
          "1"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1, [2, [3, [4]]]](1)",
        "displayTarget": "[1, [2, [3, [4]]]]",
        "displayArgs": [
          "1"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[1, 2, 3](1)",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "1"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[1, [2, [3, [4]]]](2)",
        "displayTarget": "[1, [2, [3, [4]]]]",
        "displayArgs": [
          "2"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[1, [2, [3, [4]]]](Infinity)",
        "displayTarget": "[1, [2, [3, [4]]]]",
        "displayArgs": [
          "Infinity"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[](1)",
        "displayTarget": "[]",
        "displayArgs": [
          "1"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[[[[1]]]](3)",
        "displayTarget": "[[[[1]]]]",
        "displayArgs": [
          "3"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[1, [], 2, [], 3](1)",
        "displayTarget": "[1, [], 2, [], 3]",
        "displayArgs": [
          "1"
        ],
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/array/flat.js",
    "testPath": "problems/array/flat_test.js"
  },
  {
    "id": "forEach",
    "slug": "forEach",
    "sequence": 3,
    "title": "ForEach",
    "categoryId": "array",
    "categoryName": "数组方法",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个与 Array.prototype.forEach 行为一致的 myForEach 方法。它需要按索引顺序遍历当前数组，对每个实际存在的元素执行一次回调函数，但不会收集返回值，也不会返回新的数组。实现时要支持可选的 thisArg，跳过稀疏数组中的空槽，并在 this 非法或回调不是函数时抛出错误。",
    "approachText": "先校验调用环境，再顺序遍历数组；只有当前索引存在元素时才调用回调函数，并把当前元素、索引和原数组传入，整个过程只负责副作用执行，最后保持返回值为 undefined。",
    "paramsText": "callback：对每个元素执行的回调函数，参数依次为当前元素、当前索引和原数组。\nthisArg：可选的回调执行上下文；如果传入，则在调用 callback 时作为 this 使用。",
    "returnText": "不返回结果数组，函数执行完成后始终得到 undefined。",
    "template": "Array.prototype.myForEach = function (callback, thisArg) {\n\n};\n\nexport default Array.prototype.myForEach;",
    "solutionCode": "Array.prototype.myForEach = function (callback, thisArg) {\n  if (this == null) {\n    throw new TypeError(\n      \"Cannot read property 'myForEach' of null or undefined\",\n    );\n  }\n  if (typeof callback !== \"function\") {\n    throw new TypeError(callback + \" is not a function\");\n  }\n\n  // 将调用者转为对象，获取长度\n  const array = Object(this);\n  // 使用位运算符确保 length 是一个非负整数，同时为结果数组预分配空间\n  const len = array.length >>> 0;\n\n  for (let i = 0; i < len; i++) {\n    if (i in array) {\n      callback.call(thisArg, array[i], i, array);\n    }\n  }\n};\n\nexport default Array.prototype.myForEach;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[1, 2, 3]",
            "args": [
              "x => console.log(x)"
            ]
          },
          "expected": undefined
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "[\"a\", \"b\", \"c\"]",
            "args": [
              "(x, i) => console.log(i, x)"
            ]
          },
          "expected": undefined
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[]",
            "args": [
              "x => x * 2"
            ]
          },
          "expected": undefined
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3]",
            "args": [
              "(x, i, arr) => console.log(arr.length)"
            ]
          },
          "expected": undefined
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3]",
            "args": [
              "function(x) { this.sum += x; }"
            ],
            "thisArg": "{ sum: 0 }"
          },
          "expected": undefined
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3]",
            "args": [
              "x => x"
            ]
          },
          "expected": undefined
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "[1, , 3]",
            "args": [
              "x => console.log(x)"
            ]
          },
          "expected": undefined
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "new Array(3)",
            "args": [
              "(x, i) => console.log(i)"
            ]
          },
          "expected": undefined
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, 2, 3](x => console.log(x))",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "x => console.log(x)"
        ],
        "expected": undefined
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[\"a\", \"b\", \"c\"]((x, i) => console.log(i, x))",
        "displayTarget": "[\"a\", \"b\", \"c\"]",
        "displayArgs": [
          "(x, i) => console.log(i, x)"
        ],
        "expected": undefined
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[](x => x * 2)",
        "displayTarget": "[]",
        "displayArgs": [
          "x => x * 2"
        ],
        "expected": undefined
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, 2, 3](x => console.log(x))",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "x => console.log(x)"
        ],
        "expected": undefined
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[\"a\", \"b\", \"c\"]((x, i) => console.log(i, x))",
        "displayTarget": "[\"a\", \"b\", \"c\"]",
        "displayArgs": [
          "(x, i) => console.log(i, x)"
        ],
        "expected": undefined
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[](x => x * 2)",
        "displayTarget": "[]",
        "displayArgs": [
          "x => x * 2"
        ],
        "expected": undefined
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[1, 2, 3]((x, i, arr) => console.log(arr.length))",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "(x, i, arr) => console.log(arr.length)"
        ],
        "expected": undefined
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[1, 2, 3](function(x) { this.sum += x; })",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "function(x) { this.sum += x; }"
        ],
        "expected": undefined
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[1, 2, 3](x => x)",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "x => x"
        ],
        "expected": undefined
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[1, , 3](x => console.log(x))",
        "displayTarget": "[1, , 3]",
        "displayArgs": [
          "x => console.log(x)"
        ],
        "expected": undefined
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "new Array(3)((x, i) => console.log(i))",
        "displayTarget": "new Array(3)",
        "displayArgs": [
          "(x, i) => console.log(i)"
        ],
        "expected": undefined
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/array/forEach.js",
    "testPath": "problems/array/forEach_test.js"
  },
  {
    "id": "map",
    "slug": "map",
    "sequence": 4,
    "title": "Map",
    "categoryId": "array",
    "categoryName": "数组方法",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个与 Array.prototype.map 语义一致的 myMap 方法。它需要遍历当前数组，把每个实际存在的元素交给回调函数处理，并把回调结果放到新数组的对应位置。实现时要保持原数组不变，支持 thisArg，保留稀疏数组的空槽位置，并处理 this 非法或回调不是函数等常见边界。",
    "approachText": "先完成 this 和回调的合法性校验，再按原数组长度创建结果数组；遍历时只处理真实存在的索引，把回调返回值写入结果数组相同位置，这样既能保留索引结构，也不会修改原数组。",
    "paramsText": "callback：用于生成新元素的回调函数，参数依次为当前元素、当前索引和原数组。\nthisArg：可选的回调执行上下文；如果传入，则在调用 callback 时作为 this 使用。",
    "returnText": "返回一个新数组，长度与原数组一致，已存在元素的位置会被映射成回调返回值，空槽会被保留。",
    "template": "Array.prototype.myMap = function (callback, thisArg) {\n\n};\n\nexport default Array.prototype.myMap;",
    "solutionCode": "Array.prototype.myMap = function (callback, thisArg) {\n  if (this == null) {\n    throw new TypeError(\"Cannot read property 'myMap' of null or undefined\");\n  }\n  if (typeof callback !== \"function\") {\n    throw new TypeError(callback + \" is not a function\");\n  }\n\n  // 将调用者转为对象，获取长度\n  const array = Object(this);\n  // 使用位运算符确保 length 是一个非负整数，同时为结果数组预分配空间\n  const len = array.length >>> 0;\n  const result = new Array(len);\n\n  for (let i = 0; i < len; i++) {\n    if (i in array) {\n      result[i] = callback.call(thisArg, array[i], i, array);\n    }\n  }\n\n  return result;\n};\n\nexport default Array.prototype.myMap;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[1, 2, 3]",
            "args": [
              "x => x * 2"
            ]
          },
          "expected": [
            2,
            4,
            6
          ]
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "[1, 2, 3]",
            "args": [
              "x => String(x)"
            ]
          },
          "expected": [
            "1",
            "2",
            "3"
          ]
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[1, 2, 3]",
            "args": [
              "x => x * x"
            ]
          },
          "expected": [
            1,
            4,
            9
          ]
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[]",
            "args": [
              "x => x * 2"
            ]
          },
          "expected": []
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3]",
            "args": [
              "(x, i) => x + i"
            ]
          },
          "expected": [
            1,
            3,
            5
          ]
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[1, , 3]",
            "args": [
              "x => x * 2"
            ]
          },
          "expected": [
            2,
            undefined,
            6
          ]
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3]",
            "args": [
              "x => ({ value: x })"
            ]
          },
          "expected": [
            {
              "value": 1
            },
            {
              "value": 2
            },
            {
              "value": 3
            }
          ]
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "[\"a\", \"b\", \"c\"]",
            "args": [
              "(x, i, arr) => x + i + arr.length"
            ]
          },
          "expected": [
            "a03",
            "b13",
            "c23"
          ]
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, 2, 3](x => x * 2)",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "x => x * 2"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1, 2, 3](x => String(x))",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "x => String(x)"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[1, 2, 3](x => x * x)",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "x => x * x"
        ],
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, 2, 3](x => x * 2)",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "x => x * 2"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1, 2, 3](x => String(x))",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "x => String(x)"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[1, 2, 3](x => x * x)",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "x => x * x"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[](x => x * 2)",
        "displayTarget": "[]",
        "displayArgs": [
          "x => x * 2"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[1, 2, 3]((x, i) => x + i)",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "(x, i) => x + i"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[1, , 3](x => x * 2)",
        "displayTarget": "[1, , 3]",
        "displayArgs": [
          "x => x * 2"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[1, 2, 3](x => ({ value: x }))",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "x => ({ value: x })"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[\"a\", \"b\", \"c\"]((x, i, arr) => x + i + arr.length)",
        "displayTarget": "[\"a\", \"b\", \"c\"]",
        "displayArgs": [
          "(x, i, arr) => x + i + arr.length"
        ],
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/array/map.js",
    "testPath": "problems/array/map_test.js"
  },
  {
    "id": "reduce",
    "slug": "reduce",
    "sequence": 5,
    "title": "Reduce",
    "categoryId": "array",
    "categoryName": "数组方法",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个与 Array.prototype.reduce 语义一致的 myReduce 方法。它需要把数组元素按顺序累积到一个结果上，回调每次接收上一次的累加值和当前元素，并返回新的累加值。实现时要正确处理是否传入初始值、空数组、稀疏数组空槽以及 this 或回调非法的情况，且不能修改原数组内容。",
    "approachText": "先完成 this 与回调校验，再根据是否显式传入 initialValue 决定累加器起点；随后从正确的索引开始遍历每个真实存在的元素，持续用回调返回值更新累加器，最终返回累计结果。",
    "paramsText": "callback：用于合并累加值和当前元素的回调函数，参数依次为累加器、当前元素、当前索引和原数组。\ninitialValue：可选的初始累加值；如果未传入，则需要从数组中找到第一个真实存在的元素作为起点。",
    "returnText": "返回整个归并过程结束后的最终累加结果，结果类型由 callback 的返回值决定。",
    "template": "Array.prototype.myReduce = function (callback, initialValue) {\n\n};\n\nexport default Array.prototype.myReduce;",
    "solutionCode": "Array.prototype.myReduce = function (callback, initialValue) {\n  if (this == null) {\n    throw new TypeError(\"Cannot read property 'myReduce' of null or undefined\");\n  }\n  if (typeof callback !== \"function\") {\n    throw new TypeError(callback + \" is not a function\");\n  }\n\n  // 将调用者转为对象，获取长度\n  const array = Object(this);\n  // 使用位运算符确保 length 是一个非负整数，同时为结果数组预分配空间\n  const len = array.length >>> 0;\n  // accumulator 用于存储累加结果，k 是当前索引\n  let k = 0;\n  let accumulator;\n\n  // 处理初始值：如果没有提供 initialValue，使用数组中第一个存在的元素作为初始值\n  if (initialValue === undefined) {\n    let isValueSet = false;\n    // 找到第一个存在的元素作为初始值\n    for (; k < len; k++) {\n      if (k in array) {\n        accumulator = array[k];\n        isValueSet = true;\n        k++;\n        break;\n      }\n    }\n    if (!isValueSet) {\n      throw new TypeError(\"Reduce of empty array with no initial value\");\n    }\n  } else {\n    accumulator = initialValue;\n  }\n\n  for (; k < len; k++) {\n    if (k in array) {\n      accumulator = callback(accumulator, array[k], k, array);\n    }\n  }\n\n  return accumulator;\n};\n\nexport default Array.prototype.myReduce;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[1, 2, 3, 4]",
            "args": [
              "(acc, x) => acc + x",
              "0"
            ]
          },
          "expected": 10
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "[1, 2, 3, 4]",
            "args": [
              "(acc, x) => acc * x",
              "1"
            ]
          },
          "expected": 24
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[[1, 2], [3, 4], [5]]",
            "args": [
              "(acc, x) => acc.concat(x)",
              "[]"
            ]
          },
          "expected": [
            1,
            2,
            3,
            4,
            5
          ]
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3]",
            "args": [
              "(acc, x) => acc + x"
            ]
          },
          "expected": 6
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "[1]",
            "args": [
              "(acc, x) => acc + x"
            ]
          },
          "expected": 1
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[\"a\", \"b\", \"c\"]",
            "args": [
              "(acc, x) => acc + x",
              "\"\""
            ]
          },
          "expected": "abc"
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "[{a: 1}, {a: 2}, {a: 3}]",
            "args": [
              "(acc, x) => ({ a: acc.a + x.a })"
            ]
          },
          "expected": {
            "a": 6
          }
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3, 4]",
            "args": [
              "(acc, x, i) => acc + x * i",
              "0"
            ]
          },
          "expected": 20
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, 2, 3, 4]((acc, x) => acc + x, 0)",
        "displayTarget": "[1, 2, 3, 4]",
        "displayArgs": [
          "(acc, x) => acc + x",
          "0"
        ],
        "expected": 10
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1, 2, 3, 4]((acc, x) => acc * x, 1)",
        "displayTarget": "[1, 2, 3, 4]",
        "displayArgs": [
          "(acc, x) => acc * x",
          "1"
        ],
        "expected": 24
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[[1, 2], [3, 4], [5]]((acc, x) => acc.concat(x), [])",
        "displayTarget": "[[1, 2], [3, 4], [5]]",
        "displayArgs": [
          "(acc, x) => acc.concat(x)",
          "[]"
        ],
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, 2, 3, 4]((acc, x) => acc + x, 0)",
        "displayTarget": "[1, 2, 3, 4]",
        "displayArgs": [
          "(acc, x) => acc + x",
          "0"
        ],
        "expected": 10
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1, 2, 3, 4]((acc, x) => acc * x, 1)",
        "displayTarget": "[1, 2, 3, 4]",
        "displayArgs": [
          "(acc, x) => acc * x",
          "1"
        ],
        "expected": 24
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[[1, 2], [3, 4], [5]]((acc, x) => acc.concat(x), [])",
        "displayTarget": "[[1, 2], [3, 4], [5]]",
        "displayArgs": [
          "(acc, x) => acc.concat(x)",
          "[]"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[1, 2, 3]((acc, x) => acc + x)",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "(acc, x) => acc + x"
        ],
        "expected": 6
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[1]((acc, x) => acc + x)",
        "displayTarget": "[1]",
        "displayArgs": [
          "(acc, x) => acc + x"
        ],
        "expected": 1
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[\"a\", \"b\", \"c\"]((acc, x) => acc + x, \"\")",
        "displayTarget": "[\"a\", \"b\", \"c\"]",
        "displayArgs": [
          "(acc, x) => acc + x",
          "\"\""
        ],
        "expected": "abc"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[{a: 1}, {a: 2}, {a: 3}]((acc, x) => ({ a: acc.a + x.a }))",
        "displayTarget": "[{a: 1}, {a: 2}, {a: 3}]",
        "displayArgs": [
          "(acc, x) => ({ a: acc.a + x.a })"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[1, 2, 3, 4]((acc, x, i) => acc + x * i, 0)",
        "displayTarget": "[1, 2, 3, 4]",
        "displayArgs": [
          "(acc, x, i) => acc + x * i",
          "0"
        ],
        "expected": 20
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/array/reduce.js",
    "testPath": "problems/array/reduce_test.js"
  },
  {
    "id": "apply",
    "slug": "apply",
    "sequence": 6,
    "title": "Apply",
    "categoryId": "function",
    "categoryName": "函数方法",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个与 Function.prototype.apply 行为接近的 myApply 方法。它需要让当前函数在指定上下文上执行，并把第二个参数中的数组或类数组批量展开为实参列表。实现时要处理 context 为 null 或 undefined 的回退逻辑、原始值装箱、参数列表缺省、以及执行结束后的临时属性清理。",
    "approachText": "先把 context 规范成对象，再把参数列表统一视为可展开集合；随后把当前函数临时挂到 context 上执行一次，并在拿到执行结果后删除临时属性，保证调用前后的上下文对象尽量不被污染。",
    "paramsText": "context：函数执行时要绑定的 this；传入 null 或 undefined 时回退到 globalThis。\nargsArray：要批量传给目标函数的数组或类数组对象；未传入时按空参数列表处理。",
    "returnText": "返回目标函数在指定上下文下执行后的结果。",
    "template": "Function.prototype.myApply = function (context, argsArray) {\n\n};\n\nexport default Function.prototype.myApply;",
    "solutionCode": "Function.prototype.myApply = function (context, argsArray) {\n  // 1. 处理上下文：null/undefined 转为 globalThis，其他转为对象\n  context =\n    context === null || context === undefined ? globalThis : Object(context);\n\n  // 2. 处理参数数组：null/undefined 时使用空数组，否则转为数组\n  argsArray = argsArray == null ? [] : Array.from(argsArray);\n\n  // 3. 临时绑定：将函数作为上下文的属性，使用 Symbol 避免命名冲突\n  const fnSymbol = Symbol(\"fn\");\n  context[fnSymbol] = this;\n\n  // 4. 执行函数，统一展开参数数组\n  const result = context[fnSymbol](...argsArray);\n\n  delete context[fnSymbol];\n  return result;\n};\n\nexport default Function.prototype.myApply;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "function(a, b) { return this.x + a + b; }",
            "args": [
              "{ x: 10 }",
              "[1, 2]"
            ]
          },
          "expected": 13
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "function() { return this.name; }",
            "args": [
              "{ name: \"test\" }",
              "[]"
            ]
          },
          "expected": "test"
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "Math.max",
            "args": [
              "null",
              "[1, 5, 3]"
            ]
          },
          "expected": 5
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "function() { return this; }",
            "args": [
              "null",
              "[]"
            ]
          },
          "expected": null
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "function() { return arguments.length; }",
            "args": [
              "{}",
              "[1, 2, 3, 4]"
            ]
          },
          "expected": 4
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "Array.prototype.concat",
            "args": [
              "[1, 2]",
              "[3, 4]"
            ]
          },
          "expected": [
            1,
            2,
            3,
            4
          ]
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "function(a, b, c) { return a + b + c; }",
            "args": [
              "{}",
              "[1, 2, 3]"
            ]
          },
          "expected": 6
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "String.prototype.slice",
            "args": [
              "\"hello\"",
              "[1, 4]"
            ]
          },
          "expected": "ell"
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "function(a, b) { return this.x + a + b; }({ x: 10 }, [1, 2])",
        "displayTarget": "function(a, b) { return this.x + a + b; }",
        "displayArgs": [
          "{ x: 10 }",
          "[1, 2]"
        ],
        "expected": 13
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "function() { return this.name; }({ name: \"test\" }, [])",
        "displayTarget": "function() { return this.name; }",
        "displayArgs": [
          "{ name: \"test\" }",
          "[]"
        ],
        "expected": "test"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "Math.max(null, [1, 5, 3])",
        "displayTarget": "Math.max",
        "displayArgs": [
          "null",
          "[1, 5, 3]"
        ],
        "expected": 5
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "function(a, b) { return this.x + a + b; }({ x: 10 }, [1, 2])",
        "displayTarget": "function(a, b) { return this.x + a + b; }",
        "displayArgs": [
          "{ x: 10 }",
          "[1, 2]"
        ],
        "expected": 13
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "function() { return this.name; }({ name: \"test\" }, [])",
        "displayTarget": "function() { return this.name; }",
        "displayArgs": [
          "{ name: \"test\" }",
          "[]"
        ],
        "expected": "test"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "Math.max(null, [1, 5, 3])",
        "displayTarget": "Math.max",
        "displayArgs": [
          "null",
          "[1, 5, 3]"
        ],
        "expected": 5
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "function() { return this; }(null, [])",
        "displayTarget": "function() { return this; }",
        "displayArgs": [
          "null",
          "[]"
        ],
        "expected": null
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "function() { return arguments.length; }({}, [1, 2, 3, 4])",
        "displayTarget": "function() { return arguments.length; }",
        "displayArgs": [
          "{}",
          "[1, 2, 3, 4]"
        ],
        "expected": 4
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "Array.prototype.concat([1, 2], [3, 4])",
        "displayTarget": "Array.prototype.concat",
        "displayArgs": [
          "[1, 2]",
          "[3, 4]"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "function(a, b, c) { return a + b + c; }({}, [1, 2, 3])",
        "displayTarget": "function(a, b, c) { return a + b + c; }",
        "displayArgs": [
          "{}",
          "[1, 2, 3]"
        ],
        "expected": 6
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "String.prototype.slice(\"hello\", [1, 4])",
        "displayTarget": "String.prototype.slice",
        "displayArgs": [
          "\"hello\"",
          "[1, 4]"
        ],
        "expected": "ell"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/function/apply.js",
    "testPath": "problems/function/apply_test.js"
  },
  {
    "id": "bind",
    "slug": "bind",
    "sequence": 7,
    "title": "Bind",
    "categoryId": "function",
    "categoryName": "函数方法",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个与 Function.prototype.bind 行为接近的 myBind 方法。它需要返回一个新的函数，这个新函数会把原函数的 this 固定为指定对象，并支持在绑定时预置一部分参数，后续调用时再继续补参。实现时还要兼顾被 new 调用的场景，保证构造调用时 this 指向新实例而不是绑定对象，并尽量保留原型链关系。",
    "approachText": "先保存原函数和预置参数，再返回一个包装函数；包装函数执行时把预置参数和本次参数拼接起来，并根据是否以构造函数方式调用来决定最终的 this，从而同时覆盖普通调用和 new 调用两种场景。",
    "paramsText": "context：绑定后的默认 this；普通调用时会作为原函数执行上下文。\npresetArgs：在 bind 阶段提前固定的参数列表，后续调用时会排在新参数前面。",
    "returnText": "返回一个新的绑定函数，它会记住指定的 this 和预置参数，并支持继续接收剩余参数。",
    "template": "Function.prototype.myBind = function (context, ...presetArgs) {\n\n};\n\nexport default Function.prototype.myBind;",
    "solutionCode": "Function.prototype.myBind = function (context, ...presetArgs) {\n  // 1. 调用者必须是函数\n  if (typeof this !== \"function\") {\n    throw new TypeError(\"Bind must be called on a function\");\n  }\n\n  const originalFn = this; // 保存原函数\n\n  // 2. 返回绑定函数\n  function boundFn(...args) {\n    return originalFn.call(\n      new.target === boundFn ? this : context, // 判断是不是 new 调用, new 的时候 this 指向实例，否则指向绑定的 context\n      ...presetArgs,\n      ...args,\n    );\n  }\n\n  // 3. 正确处理原型：用 Object.create 继承，不直接赋值\n  if (originalFn.prototype) {\n    boundFn.prototype = Object.create(originalFn.prototype);\n  }\n\n  return boundFn;\n};\n\nexport default Function.prototype.myBind;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "((function(a, b) { return this.x + a + b; }).myBind({ x: 10 }, 1)(2))",
            "args": []
          },
          "expected": 13
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "((function() { return this.name; }).myBind({ name: 'bound' })())",
            "args": []
          },
          "expected": "bound"
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "((function(a, b, c) { return a + b + c; }).myBind({}, 1, 2)(3))",
            "args": []
          },
          "expected": 6
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "((function() { return this; }).myBind({ a: 1 })())",
            "args": []
          },
          "expected": {
            "a": 1
          }
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "((function() { return !!new.target; }).myBind({})())",
            "args": []
          },
          "expected": false
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "((function(x) { return this.val + x; }).myBind({ val: 5 })(10))",
            "args": []
          },
          "expected": 15
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "((function(a, b) { return this.x + a + b; }).myBind({ x: 10 }, 1)(2))",
        "displayTarget": "((function(a, b) { return this.x + a + b; }).myBind({ x: 10 }, 1)(2))",
        "displayArgs": [],
        "expected": 13
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "((function() { return this.name; }).myBind({ name: 'bound' })())",
        "displayTarget": "((function() { return this.name; }).myBind({ name: 'bound' })())",
        "displayArgs": [],
        "expected": "bound"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "((function(a, b, c) { return a + b + c; }).myBind({}, 1, 2)(3))",
        "displayTarget": "((function(a, b, c) { return a + b + c; }).myBind({}, 1, 2)(3))",
        "displayArgs": [],
        "expected": 6
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "((function(a, b) { return this.x + a + b; }).myBind({ x: 10 }, 1)(2))",
        "displayTarget": "((function(a, b) { return this.x + a + b; }).myBind({ x: 10 }, 1)(2))",
        "displayArgs": [],
        "expected": 13
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "((function() { return this.name; }).myBind({ name: 'bound' })())",
        "displayTarget": "((function() { return this.name; }).myBind({ name: 'bound' })())",
        "displayArgs": [],
        "expected": "bound"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "((function(a, b, c) { return a + b + c; }).myBind({}, 1, 2)(3))",
        "displayTarget": "((function(a, b, c) { return a + b + c; }).myBind({}, 1, 2)(3))",
        "displayArgs": [],
        "expected": 6
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "((function() { return this; }).myBind({ a: 1 })())",
        "displayTarget": "((function() { return this; }).myBind({ a: 1 })())",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "((function() { return !!new.target; }).myBind({})())",
        "displayTarget": "((function() { return !!new.target; }).myBind({})())",
        "displayArgs": [],
        "expected": false
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "((function(x) { return this.val + x; }).myBind({ val: 5 })(10))",
        "displayTarget": "((function(x) { return this.val + x; }).myBind({ val: 5 })(10))",
        "displayArgs": [],
        "expected": 15
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/function/bind.js",
    "testPath": "problems/function/bind_test.js"
  },
  {
    "id": "call",
    "slug": "call",
    "sequence": 8,
    "title": "Call",
    "categoryId": "function",
    "categoryName": "函数方法",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个与 Function.prototype.call 行为接近的 myCall 方法。它需要让任意函数在指定的上下文对象上立即执行，并把后续参数逐个传给目标函数。实现时要正确处理 context 为 null 或 undefined 时回退到全局对象、原始值装箱、临时属性避免命名冲突，以及调用结束后清理现场。",
    "approachText": "先把 context 规范成可挂载属性的对象，再把当前函数临时挂到该对象上，通过展开参数立即执行；执行完成后删除临时属性，并把原函数返回值直接交还给调用方。",
    "paramsText": "context：函数执行时要绑定的 this；传入 null 或 undefined 时回退到 globalThis。\nargs：要按位置依次传给目标函数的参数列表。",
    "returnText": "返回目标函数在指定上下文和参数下执行后的结果。",
    "template": "Function.prototype.myCall = function (context, ...args) {\n\n};\n\nexport default Function.prototype.myCall;",
    "solutionCode": "Function.prototype.myCall = function (context, ...args) {\n  // 1. 调用者必须是函数\n  if (typeof this !== \"function\") {\n    throw new TypeError(\"Call must be called on a function\");\n  }\n\n  // 2. 处理上下文：null/undefined 转为 globalThis，其他转为对象\n  context =\n    context === null || context === undefined ? globalThis : Object(context);\n\n  // 3. 临时绑定：将函数作为上下文的属性，使用 Symbol 避免命名冲突\n  const fnSymbol = Symbol(\"fn\");\n  context[fnSymbol] = this;\n\n  // 4. 执行调用：展开参数列表调用函数\n  const result = context[fnSymbol](...args);\n\n  // 5. 清理恢复：删除临时属性，返回函数执行结果\n  delete context[fnSymbol];\n\n  return result;\n};\n\nexport default Function.prototype.myCall;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "function(a, b) { return this.x + a + b; }",
            "args": [
              "{ x: 10 }",
              "1",
              "2"
            ]
          },
          "expected": 13
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "function() { return this.name; }",
            "args": [
              "{ name: \"test\" }"
            ]
          },
          "expected": "test"
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "String.prototype.slice",
            "args": [
              "\"hello world\"",
              "0",
              "5"
            ]
          },
          "expected": "hello"
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "function() { return this; }",
            "args": [
              "null"
            ]
          },
          "expected": null
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "function() { return this; }",
            "args": [
              "undefined"
            ]
          },
          "expected": undefined
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "function(a, b, c) { return a + b + c; }",
            "args": [
              "{}",
              "1",
              "2",
              "3"
            ]
          },
          "expected": 6
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "Math.max",
            "args": [
              "null",
              "1",
              "5",
              "3"
            ]
          },
          "expected": 5
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "Array.prototype.join",
            "args": [
              "[\"a\", \"b\", \"c\"]",
              "\"-\""
            ]
          },
          "expected": "a-b-c"
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "function(a, b) { return this.x + a + b; }({ x: 10 }, 1, 2)",
        "displayTarget": "function(a, b) { return this.x + a + b; }",
        "displayArgs": [
          "{ x: 10 }",
          "1",
          "2"
        ],
        "expected": 13
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "function() { return this.name; }({ name: \"test\" })",
        "displayTarget": "function() { return this.name; }",
        "displayArgs": [
          "{ name: \"test\" }"
        ],
        "expected": "test"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "String.prototype.slice(\"hello world\", 0, 5)",
        "displayTarget": "String.prototype.slice",
        "displayArgs": [
          "\"hello world\"",
          "0",
          "5"
        ],
        "expected": "hello"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "function(a, b) { return this.x + a + b; }({ x: 10 }, 1, 2)",
        "displayTarget": "function(a, b) { return this.x + a + b; }",
        "displayArgs": [
          "{ x: 10 }",
          "1",
          "2"
        ],
        "expected": 13
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "function() { return this.name; }({ name: \"test\" })",
        "displayTarget": "function() { return this.name; }",
        "displayArgs": [
          "{ name: \"test\" }"
        ],
        "expected": "test"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "String.prototype.slice(\"hello world\", 0, 5)",
        "displayTarget": "String.prototype.slice",
        "displayArgs": [
          "\"hello world\"",
          "0",
          "5"
        ],
        "expected": "hello"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "function() { return this; }(null)",
        "displayTarget": "function() { return this; }",
        "displayArgs": [
          "null"
        ],
        "expected": null
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "function() { return this; }(undefined)",
        "displayTarget": "function() { return this; }",
        "displayArgs": [
          "undefined"
        ],
        "expected": undefined
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "function(a, b, c) { return a + b + c; }({}, 1, 2, 3)",
        "displayTarget": "function(a, b, c) { return a + b + c; }",
        "displayArgs": [
          "{}",
          "1",
          "2",
          "3"
        ],
        "expected": 6
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "Math.max(null, 1, 5, 3)",
        "displayTarget": "Math.max",
        "displayArgs": [
          "null",
          "1",
          "5",
          "3"
        ],
        "expected": 5
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "Array.prototype.join([\"a\", \"b\", \"c\"], \"-\")",
        "displayTarget": "Array.prototype.join",
        "displayArgs": [
          "[\"a\", \"b\", \"c\"]",
          "\"-\""
        ],
        "expected": "a-b-c"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/function/call.js",
    "testPath": "problems/function/call_test.js"
  },
  {
    "id": "findCycleEntry",
    "slug": "findCycleEntry",
    "sequence": 9,
    "title": "FindCycleEntry",
    "categoryId": "linkedlist",
    "categoryName": "链表",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "找出单链表中环的入口节点。如果链表带环，需要返回第一次进入这个环的位置；如果链表无环，则返回 null。实现时要处理空链表、单节点链表，以及入口节点可能恰好是头节点或位于链表中间的情况。",
    "approachText": "先使用快慢指针判断链表是否存在环并找到第一次相遇点；一旦相遇，让其中一个指针回到头节点，两个指针再以相同速度前进，它们下一次相遇的节点就是环的入口。",
    "paramsText": "head：待查找的链表头节点，可能是空链表，也可能是一条带环链表。",
    "returnText": "如果链表存在环则返回环入口节点；如果不存在环则返回 null。",
    "template": "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n\nfunction detectCycle(head) {\n\n}\n\nexport default detectCycle;",
    "solutionCode": "function detectCycle(head) {\n  if (!head || !head.next) return null;\n\n  let slow = head;\n  let fast = head;\n\n  while (fast !== null && fast.next !== null) {\n    slow = slow.next;\n    fast = fast.next.next;\n\n    if (slow === fast) {\n      let ptr1 = head;\n      let ptr2 = slow;\n\n      while (ptr1 !== ptr2) {\n        ptr1 = ptr1.next;\n        ptr2 = ptr2.next;\n      }\n\n      return ptr1;\n    }\n  }\n\n  return null;\n}\n\nexport default detectCycle;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[3, 2, 0, -4]"
          },
          "expected": null
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "[1, 2]"
          },
          "expected": null
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[1]"
          },
          "expected": null
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[]"
          },
          "expected": null
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3, 4, 5]"
          },
          "expected": null
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3]"
          },
          "expected": null
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "[0, 0, 0]"
          },
          "expected": null
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3, 4]"
          },
          "expected": null
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[3, 2, 0, -4]",
        "displayTarget": "[3, 2, 0, -4]",
        "displayArgs": undefined,
        "expected": null
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1, 2]",
        "displayTarget": "[1, 2]",
        "displayArgs": undefined,
        "expected": null
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[1]",
        "displayTarget": "[1]",
        "displayArgs": undefined,
        "expected": null
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[3, 2, 0, -4]",
        "displayTarget": "[3, 2, 0, -4]",
        "displayArgs": undefined,
        "expected": null
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1, 2]",
        "displayTarget": "[1, 2]",
        "displayArgs": undefined,
        "expected": null
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[1]",
        "displayTarget": "[1]",
        "displayArgs": undefined,
        "expected": null
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": undefined,
        "expected": null
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[1, 2, 3, 4, 5]",
        "displayTarget": "[1, 2, 3, 4, 5]",
        "displayArgs": undefined,
        "expected": null
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[1, 2, 3]",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": undefined,
        "expected": null
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[0, 0, 0]",
        "displayTarget": "[0, 0, 0]",
        "displayArgs": undefined,
        "expected": null
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[1, 2, 3, 4]",
        "displayTarget": "[1, 2, 3, 4]",
        "displayArgs": undefined,
        "expected": null
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/linkedlist/findCycleEntry.js",
    "testPath": "problems/linkedlist/findCycleEntry_test.js"
  },
  {
    "id": "hasCycle",
    "slug": "hasCycle",
    "sequence": 10,
    "title": "HasCycle",
    "categoryId": "linkedlist",
    "categoryName": "链表",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "判断单链表中是否存在环。输入是链表头节点，如果链表中的某个节点 next 最终会重新指回前面已经访问过的节点，就说明该链表带环；如果指针最终会走到 null，则说明无环。实现时需要同时兼顾空链表、只有一个节点的链表，以及环可能从任意位置开始的情况。",
    "approachText": "使用快慢指针同时从头节点出发；慢指针每次走一步，快指针每次走两步，只要链表里存在环，快指针最终一定会在环内追上慢指针，否则快指针会先走到链表末尾。",
    "paramsText": "head：待检测链表的头节点；可能为 null，也可能是一条普通链表或带环链表。",
    "returnText": "如果链表中存在环则返回 true；如果不存在环则返回 false。",
    "template": "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n\nfunction hasCycle(head) {\n\n}\n\nexport default hasCycle;",
    "solutionCode": "function hasCycle(head) {\n  if (!head || !head.next) return false;\n\n  let slow = head;\n  let fast = head;\n\n  while (fast !== null && fast.next !== null) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n\n  return false;\n}\n\nexport default hasCycle;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[3, 2, 0, -4]"
          },
          "expected": false
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "[1, 2]"
          },
          "expected": false
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[1]"
          },
          "expected": false
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[]"
          },
          "expected": false
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3, 4, 5]"
          },
          "expected": false
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3]"
          },
          "expected": false
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "[0, 0, 0]"
          },
          "expected": false
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3, 4]"
          },
          "expected": false
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[3, 2, 0, -4]",
        "displayTarget": "[3, 2, 0, -4]",
        "displayArgs": undefined,
        "expected": false
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1, 2]",
        "displayTarget": "[1, 2]",
        "displayArgs": undefined,
        "expected": false
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[1]",
        "displayTarget": "[1]",
        "displayArgs": undefined,
        "expected": false
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[3, 2, 0, -4]",
        "displayTarget": "[3, 2, 0, -4]",
        "displayArgs": undefined,
        "expected": false
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1, 2]",
        "displayTarget": "[1, 2]",
        "displayArgs": undefined,
        "expected": false
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[1]",
        "displayTarget": "[1]",
        "displayArgs": undefined,
        "expected": false
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": undefined,
        "expected": false
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[1, 2, 3, 4, 5]",
        "displayTarget": "[1, 2, 3, 4, 5]",
        "displayArgs": undefined,
        "expected": false
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[1, 2, 3]",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": undefined,
        "expected": false
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[0, 0, 0]",
        "displayTarget": "[0, 0, 0]",
        "displayArgs": undefined,
        "expected": false
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[1, 2, 3, 4]",
        "displayTarget": "[1, 2, 3, 4]",
        "displayArgs": undefined,
        "expected": false
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/linkedlist/hasCycle.js",
    "testPath": "problems/linkedlist/hasCycle_test.js"
  },
  {
    "id": "mergeTwoLists",
    "slug": "mergeTwoLists",
    "sequence": 11,
    "title": "MergeTwoLists",
    "categoryId": "linkedlist",
    "categoryName": "链表",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "使用迭代方式合并两个已经按升序排列的链表。函数需要同时读取 list1 和 list2 的当前节点，把较小值对应的节点依次接到结果链表尾部，最终得到一条新的升序链表。实现时要正确处理其中一条链表为空、两条链表长度不同、以及某一方先遍历完毕后直接拼接剩余节点的情况。",
    "approachText": "1. 创建哑节点统一处理头节点拼接逻辑，避免第一步需要单独分支。\n2. 用 tail 始终指向新链表末尾，每次把较小节点接到 tail 后面。\n3. 当任意一条链表遍历结束时，直接把另一条链表剩余部分整体接上。",
    "paramsText": "list1：第一条升序链表的头节点。\nlist2：第二条升序链表的头节点。",
    "returnText": "返回合并后的链表头节点。",
    "template": "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n\nfunction mergeTwoLists(l1, l2) {\n\n}\n\nexport default mergeTwoLists;",
    "solutionCode": "function mergeTwoLists(l1, l2) {\n  if (!l1) return l2;\n  if (!l2) return l1;\n  if (l1.val <= l2.val) {\n    l1.next = mergeTwoLists(l1.next, l2);\n    return l1;\n  } else {\n    l2.next = mergeTwoLists(l1, l2.next);\n    return l2;\n  }\n}\n\nexport default mergeTwoLists;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[1, 2, 4]",
            "args": [
              "[1, 3, 4]"
            ]
          },
          "expected": [
            1,
            1,
            2,
            3,
            4,
            4
          ]
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "[]",
            "args": [
              "[]"
            ]
          },
          "expected": []
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[]",
            "args": [
              "[0]"
            ]
          },
          "expected": [
            0
          ]
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[1]",
            "args": [
              "[2]"
            ]
          },
          "expected": [
            1,
            2
          ]
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "[1, 3, 5]",
            "args": [
              "[2, 4, 6]"
            ]
          },
          "expected": [
            1,
            2,
            3,
            4,
            5,
            6
          ]
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3]",
            "args": [
              "[]"
            ]
          },
          "expected": [
            1,
            2,
            3
          ]
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "[1, 1, 1]",
            "args": [
              "[1, 1]"
            ]
          },
          "expected": [
            1,
            1,
            1,
            1,
            1
          ]
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "[-3, -1, 0]",
            "args": [
              "[-2, 2]"
            ]
          },
          "expected": [
            -3,
            -2,
            -1,
            0,
            2
          ]
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, 2, 4]([1, 3, 4])",
        "displayTarget": "[1, 2, 4]",
        "displayArgs": [
          "[1, 3, 4]"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[]([])",
        "displayTarget": "[]",
        "displayArgs": [
          "[]"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[]([0])",
        "displayTarget": "[]",
        "displayArgs": [
          "[0]"
        ],
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, 2, 4]([1, 3, 4])",
        "displayTarget": "[1, 2, 4]",
        "displayArgs": [
          "[1, 3, 4]"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[]([])",
        "displayTarget": "[]",
        "displayArgs": [
          "[]"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[]([0])",
        "displayTarget": "[]",
        "displayArgs": [
          "[0]"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[1]([2])",
        "displayTarget": "[1]",
        "displayArgs": [
          "[2]"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[1, 3, 5]([2, 4, 6])",
        "displayTarget": "[1, 3, 5]",
        "displayArgs": [
          "[2, 4, 6]"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[1, 2, 3]([])",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "[]"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[1, 1, 1]([1, 1])",
        "displayTarget": "[1, 1, 1]",
        "displayArgs": [
          "[1, 1]"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[-3, -1, 0]([-2, 2])",
        "displayTarget": "[-3, -1, 0]",
        "displayArgs": [
          "[-2, 2]"
        ],
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/linkedlist/mergeTwoLists.js",
    "testPath": "problems/linkedlist/mergeTwoLists_test.js"
  },
  {
    "id": "reverseList",
    "slug": "reverseList",
    "sequence": 12,
    "title": "ReverseList",
    "categoryId": "linkedlist",
    "categoryName": "链表",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "使用迭代方式反转单链表。函数需要把链表中每个节点的 next 指针方向逐个翻转，让原来的尾节点变成新的头节点。实现时要正确处理空链表、只有一个节点的链表，以及反转过程中不能丢失后续节点引用的问题。",
    "approachText": "1. 使用 prev 保存已经反转好的前半段链表头节点。\n2. 使用 current 指向当前待处理节点，next 临时保存后继节点。\n3. 每轮先保存 next，再把 current.next 指回 prev，最后整体向前推进三个指针。",
    "paramsText": "head：待反转链表的头节点。",
    "returnText": "返回反转后的链表头节点。",
    "template": "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n\nfunction reverseList(head) {\n\n}\n\nfunction reverseListRecursive(head) {\n\n}\n\nexport default reverseList;",
    "solutionCode": "function reverseList(head) {\n  let prev = null;\n  let current = head;\n\n  while (current !== null) {\n    const next = current.next;\n    current.next = prev;\n    prev = current;\n    current = next;\n  }\n\n  return prev;\n}\n\n/**\n * @description 使用递归方式反转单链表。函数需要先让更靠后的子链表完成反转，再在回溯阶段把当前节点接到已经反转好的链表尾部，最终返回新的头节点。实现时要处理空链表和单节点链表，并在回溯时断开旧的 next 指向，避免形成环。\n * @approach\n * 1. 递归出口是空节点或单节点，此时它本身就是反转后的头节点。\n * 2. 先递归反转 head.next 后面的链表，拿到新的头节点。\n * 3. 回溯时把当前节点挂到原下一个节点的后面，再断开当前节点旧的 next 指向。\n * @params\n * head：待反转链表的头节点。\n * @return\n * 返回反转后的链表头节点。\n */\nfunction reverseListRecursive(head) {\n  if (!head || !head.next) {\n    return head;\n  }\n\n  const newHead = reverseListRecursive(head.next);\n  head.next.next = head;\n  head.next = null;\n\n  return newHead;\n}\n\nexport default reverseList;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[1, 2, 3]"
          },
          "expected": [
            3,
            2,
            1
          ]
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "[1]"
          },
          "expected": [
            1
          ]
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[]"
          },
          "expected": []
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[1, 2]"
          },
          "expected": [
            2,
            1
          ]
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "[5, 4, 3, 2, 1]"
          },
          "expected": [
            1,
            2,
            3,
            4,
            5
          ]
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3, 4]"
          },
          "expected": [
            4,
            3,
            2,
            1
          ]
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "[1, 1, 1, 1]"
          },
          "expected": [
            1,
            1,
            1,
            1
          ]
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "[10, 20, 30, 40, 50]"
          },
          "expected": [
            50,
            40,
            30,
            20,
            10
          ]
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, 2, 3]",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1]",
        "displayTarget": "[1]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, 2, 3]",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1]",
        "displayTarget": "[1]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[1, 2]",
        "displayTarget": "[1, 2]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[5, 4, 3, 2, 1]",
        "displayTarget": "[5, 4, 3, 2, 1]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[1, 2, 3, 4]",
        "displayTarget": "[1, 2, 3, 4]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[1, 1, 1, 1]",
        "displayTarget": "[1, 1, 1, 1]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[10, 20, 30, 40, 50]",
        "displayTarget": "[10, 20, 30, 40, 50]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/linkedlist/reverseList.js",
    "testPath": "problems/linkedlist/reverseList_test.js"
  },
  {
    "id": "deep_copy",
    "slug": "deep_copy",
    "sequence": 13,
    "title": "Deep Copy",
    "categoryId": "object",
    "categoryName": "对象方法",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个通用的深拷贝函数，用于把输入值完整复制成一个新的结构，而不是只复制最外层引用。它需要在遇到普通对象、数组、Date、RegExp 等可复制对象时创建新的副本，对基础类型直接返回原值，并处理对象之间的循环引用，避免递归时进入死循环。拷贝结果不能与原对象共享可变嵌套引用。",
    "approachText": "先把基础类型和特殊对象分开处理，再借助 WeakMap 记录已经拷贝过的引用；对于普通对象和数组，递归遍历自身所有键并继续深拷贝对应值，这样就能同时解决嵌套复制和循环引用问题。",
    "paramsText": "obj：需要被深拷贝的输入值，可以是对象、数组或其他任意类型。\ncache：内部用于记录已拷贝引用的 WeakMap，默认自动创建，外部通常不需要手动传入。",
    "returnText": "返回一个与原值结构等价但引用独立的新结果；基础类型会直接返回自身。",
    "template": "function deepClone(obj, cache = new WeakMap()) {\n\n}\n\nconst deepCopy = deepClone;\n\nexport default deepClone;",
    "solutionCode": "function deepClone(obj, cache = new WeakMap()) {\n  // 1. 基础类型处理：null 或非对象直接返回\n  if (obj === null || typeof obj !== \"object\") return obj;\n\n  // 2. 特殊对象处理：Date 和 RegExp 使用构造函数创建新实例\n  if (obj instanceof Date) return new Date(obj.getTime());\n  // RegExp 对象的属性（如 lastIndex）也需要复制，直接使用构造函数创建新实例\n  if (obj instanceof RegExp) return new RegExp(obj);\n\n  // 3. 循环引用处理：使用 WeakMap 缓存已拷贝的对象\n  if (cache.has(obj)) return cache.get(obj);\n\n  // 4. 递归拷贝：遍历对象所有键（包括 Symbol），递归深拷贝每个值\n  const clone = Array.isArray(obj) ? [] : {};\n  cache.set(obj, clone);\n\n  // 使用 Reflect.ownKeys 获取对象的所有键（包括 Symbol），确保完整拷贝\n  Reflect.ownKeys(obj).forEach((key) => {\n    clone[key] = deepClone(obj[key], cache);\n  });\n\n  return clone;\n}\n\nconst deepCopy = deepClone;\n\nexport default deepClone;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "({ a: 1, b: 2 })",
            "args": []
          },
          "expected": {
            "a": 1,
            "b": 2
          }
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "({ arr: [1, 2, 3] })",
            "args": []
          },
          "expected": {
            "arr": [
              1,
              2,
              3
            ]
          }
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "({ nested: { a: 1 } })",
            "args": []
          },
          "expected": {
            "nested": {
              "a": 1
            }
          }
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[]",
            "args": []
          },
          "expected": []
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "({ a: { b: { c: 1 } } })",
            "args": []
          },
          "expected": {
            "a": {
              "b": {
                "c": 1
              }
            }
          }
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[1, [2, [3]]]",
            "args": []
          },
          "expected": [
            1,
            [
              2,
              [
                3
              ]
            ]
          ]
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "({ a: null, b: undefined })",
            "args": []
          },
          "expected": {
            "a": null,
            "b": undefined
          }
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "({ date: new Date(2024, 0, 1) })",
            "args": []
          },
          "expected": {
            "date": "2023-12-31T16:00:00.000Z"
          }
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "({ a: 1, b: 2 })",
        "displayTarget": "({ a: 1, b: 2 })",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "({ arr: [1, 2, 3] })",
        "displayTarget": "({ arr: [1, 2, 3] })",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "({ nested: { a: 1 } })",
        "displayTarget": "({ nested: { a: 1 } })",
        "displayArgs": [],
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "({ a: 1, b: 2 })",
        "displayTarget": "({ a: 1, b: 2 })",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "({ arr: [1, 2, 3] })",
        "displayTarget": "({ arr: [1, 2, 3] })",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "({ nested: { a: 1 } })",
        "displayTarget": "({ nested: { a: 1 } })",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "({ a: { b: { c: 1 } } })",
        "displayTarget": "({ a: { b: { c: 1 } } })",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[1, [2, [3]]]",
        "displayTarget": "[1, [2, [3]]]",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "({ a: null, b: undefined })",
        "displayTarget": "({ a: null, b: undefined })",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "({ date: new Date(2024, 0, 1) })",
        "displayTarget": "({ date: new Date(2024, 0, 1) })",
        "displayArgs": [],
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/object/deep_copy.js",
    "testPath": "problems/object/deep_copy_test.js"
  },
  {
    "id": "instanceof",
    "slug": "instanceof",
    "sequence": 14,
    "title": "Instanceof",
    "categoryId": "object",
    "categoryName": "对象方法",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个模拟 instanceof 判断逻辑的 myInstanceof 函数。它需要判断给定对象是否出现在某个构造函数的原型链上，也就是沿着对象的隐式原型不断向上查找，看看能否遇到 constructor.prototype。实现时要正确处理左侧是 null、undefined、基础类型或函数，右侧不是函数，以及原型链走到尽头仍未命中的情况。",
    "approachText": "先排除不可能形成原型链匹配的非法输入，再取出 constructor.prototype 作为查找目标；随后从对象的直接原型开始逐层向上遍历，只要命中目标原型就返回 true，走到 null 仍未命中就返回 false。",
    "paramsText": "obj：需要被判断的值，通常是对象实例，也可能是函数对象。\nconstructor：右侧构造函数，用它的 prototype 作为原型链查找目标。",
    "returnText": "如果 obj 的原型链上存在 constructor.prototype，则返回 true；否则返回 false。",
    "template": "function myInstanceof(obj, constructor) {\n\n}\n\nexport default myInstanceof;",
    "solutionCode": "function myInstanceof(obj, constructor) {\n  if (\n    obj == null ||\n    (typeof obj !== \"object\" && typeof obj !== \"function\") ||\n    typeof constructor !== \"function\"\n  ) {\n    return false;\n  }\n\n  let proto = Object.getPrototypeOf(obj);\n  const prototype = constructor.prototype;\n\n  while (proto !== null) {\n    if (proto === prototype) {\n      return true;\n    }\n    proto = Object.getPrototypeOf(proto);\n  }\n\n  return false;\n}\n\nexport default myInstanceof;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[]",
            "args": [
              "Array"
            ]
          },
          "expected": true
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "({})",
            "args": [
              "Array"
            ]
          },
          "expected": false
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "new Date()",
            "args": [
              "Date"
            ]
          },
          "expected": true
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "(function() {})",
            "args": [
              "Function"
            ]
          },
          "expected": true
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "/abc/",
            "args": [
              "RegExp"
            ]
          },
          "expected": true
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "new String(\"hello\")",
            "args": [
              "String"
            ]
          },
          "expected": true
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "null",
            "args": [
              "Object"
            ]
          },
          "expected": false
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "Object.create(null)",
            "args": [
              "Object"
            ]
          },
          "expected": false
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[](Array)",
        "displayTarget": "[]",
        "displayArgs": [
          "Array"
        ],
        "expected": true
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "({})(Array)",
        "displayTarget": "({})",
        "displayArgs": [
          "Array"
        ],
        "expected": false
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "new Date()(Date)",
        "displayTarget": "new Date()",
        "displayArgs": [
          "Date"
        ],
        "expected": true
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[](Array)",
        "displayTarget": "[]",
        "displayArgs": [
          "Array"
        ],
        "expected": true
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "({})(Array)",
        "displayTarget": "({})",
        "displayArgs": [
          "Array"
        ],
        "expected": false
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "new Date()(Date)",
        "displayTarget": "new Date()",
        "displayArgs": [
          "Date"
        ],
        "expected": true
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "(function() {})(Function)",
        "displayTarget": "(function() {})",
        "displayArgs": [
          "Function"
        ],
        "expected": true
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "/abc/(RegExp)",
        "displayTarget": "/abc/",
        "displayArgs": [
          "RegExp"
        ],
        "expected": true
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "new String(\"hello\")(String)",
        "displayTarget": "new String(\"hello\")",
        "displayArgs": [
          "String"
        ],
        "expected": true
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "null(Object)",
        "displayTarget": "null",
        "displayArgs": [
          "Object"
        ],
        "expected": false
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "Object.create(null)(Object)",
        "displayTarget": "Object.create(null)",
        "displayArgs": [
          "Object"
        ],
        "expected": false
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/object/instanceof.js",
    "testPath": "problems/object/instanceof_test.js"
  },
  {
    "id": "new",
    "slug": "new",
    "sequence": 15,
    "title": "New",
    "categoryId": "object",
    "categoryName": "对象方法",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个模拟 new 操作符行为的 myNew 函数。它需要接收构造函数和构造参数，创建一个以构造函数 prototype 为原型的新对象，再让构造函数以该对象作为 this 执行初始化逻辑。实现时要正确处理“构造函数显式返回对象或函数时覆盖默认实例”的规则，并在传入的 constructor 不是函数时抛出错误。",
    "approachText": "先根据构造函数的 prototype 创建一个空对象，再用 apply 让构造函数在这个新对象上执行；最后按照原生 new 的规则，优先返回构造函数显式返回的对象值，否则返回刚刚创建的实例对象。",
    "paramsText": "constructor：要被模拟调用的构造函数，负责在新对象上初始化实例属性。\nargs：传给构造函数的参数列表，会原样透传给 constructor。",
    "returnText": "返回按照 new 语义创建出来的实例；如果构造函数主动返回对象或函数，则返回该返回值。",
    "template": "function myNew(constructor, ...args) {\n\n}\n\nexport default myNew;",
    "solutionCode": "function myNew(constructor, ...args) {\n  // 1. 输入校验：constructor 必须是函数\n  if (typeof constructor !== \"function\") {\n    throw new TypeError(\"Constructor must be a function\");\n  }\n\n  // 2. 创建空对象：使用 Object.create 创建以构造函数原型为原型的对象\n  const obj = Object.create(constructor.prototype);\n  // 3. 绑定 this：使用 apply 调用构造函数，将新对象作为 this\n  const result = constructor.apply(obj, args);\n\n  return result !== null &&\n    (typeof result === \"object\" || typeof result === \"function\")\n    ? result\n    : obj;\n}\n\nexport default myNew;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "function Person(name) { this.name = name; }",
            "args": [
              "\"Alice\""
            ]
          },
          "expected": {
            "name": "Alice"
          }
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "function Counter() { this.count = 0; }",
            "args": []
          },
          "expected": {
            "count": 0
          }
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "function Point(x, y) { this.x = x; this.y = y; }",
            "args": [
              "3",
              "4"
            ]
          },
          "expected": {
            "x": 3,
            "y": 4
          }
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "function Fn() { this.a = 1; return { b: 2 }; }",
            "args": []
          },
          "expected": {
            "b": 2
          }
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "function Fn() { return 42; }",
            "args": []
          },
          "expected": {}
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "function Fn(a, b, c) { this.sum = a + b + c; }",
            "args": [
              "1",
              "2",
              "3"
            ]
          },
          "expected": {
            "sum": 6
          }
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "function Fn() { this.args = arguments.length; }",
            "args": [
              "1",
              "2"
            ]
          },
          "expected": {
            "args": 2
          }
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "class MyClass { constructor(x) { this.x = x; } }",
            "args": [
              "10"
            ]
          },
          "expected": {
            "x": 10
          }
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "function Person(name) { this.name = name; }(\"Alice\")",
        "displayTarget": "function Person(name) { this.name = name; }",
        "displayArgs": [
          "\"Alice\""
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "function Counter() { this.count = 0; }",
        "displayTarget": "function Counter() { this.count = 0; }",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "function Point(x, y) { this.x = x; this.y = y; }(3, 4)",
        "displayTarget": "function Point(x, y) { this.x = x; this.y = y; }",
        "displayArgs": [
          "3",
          "4"
        ],
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "function Person(name) { this.name = name; }(\"Alice\")",
        "displayTarget": "function Person(name) { this.name = name; }",
        "displayArgs": [
          "\"Alice\""
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "function Counter() { this.count = 0; }",
        "displayTarget": "function Counter() { this.count = 0; }",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "function Point(x, y) { this.x = x; this.y = y; }(3, 4)",
        "displayTarget": "function Point(x, y) { this.x = x; this.y = y; }",
        "displayArgs": [
          "3",
          "4"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "function Fn() { this.a = 1; return { b: 2 }; }",
        "displayTarget": "function Fn() { this.a = 1; return { b: 2 }; }",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "function Fn() { return 42; }",
        "displayTarget": "function Fn() { return 42; }",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "function Fn(a, b, c) { this.sum = a + b + c; }(1, 2, 3)",
        "displayTarget": "function Fn(a, b, c) { this.sum = a + b + c; }",
        "displayArgs": [
          "1",
          "2",
          "3"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "function Fn() { this.args = arguments.length; }(1, 2)",
        "displayTarget": "function Fn() { this.args = arguments.length; }",
        "displayArgs": [
          "1",
          "2"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "class MyClass { constructor(x) { this.x = x; } }(10)",
        "displayTarget": "class MyClass { constructor(x) { this.x = x; } }",
        "displayArgs": [
          "10"
        ],
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/object/new.js",
    "testPath": "problems/object/new_test.js"
  },
  {
    "id": "promise",
    "slug": "promise",
    "sequence": 16,
    "title": "Promise",
    "categoryId": "promise",
    "categoryName": "Promise 实现",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个简化版 Promise 类 MyPromise，并尽量遵循 Promise/A+ 的核心规则。它需要支持 pending、fulfilled、rejected 三种状态，支持在构造阶段立即执行 executor，支持 then 链式调用、值穿透、错误冒泡，以及 then 返回普通值、Promise 或 thenable 时的统一解析。实现时还要避免状态被重复修改，并处理链式解析中的循环引用问题。",
    "approachText": "先围绕状态与回调队列搭建最小 Promise 核心：pending 时缓存回调，状态落定后异步派发；then 再始终返回一个新的 MyPromise，并把回调返回值交给 resolvePromise 统一解析，从而兼顾链式调用和 thenable 展开。",
    "paramsText": "executor：创建 Promise 时立即执行的函数，接收 resolve 和 reject 两个参数。\nonFulfilled：可选的成功回调，在 Promise 兑现后接收成功值。\nonRejected：可选的失败回调，在 Promise 拒绝后接收失败原因。",
    "returnText": "返回一个可继续链式调用的 MyPromise 实例；then 也会返回新的 MyPromise。",
    "template": "class MyPromise {\n  \n  constructor(executor) {\n  \n}\n\n  \n  then(onFulfilled, onRejected) {\n  \n}\n\n  catch(onRejected) {\n  \n}\n\n  finally(callback) {\n  \n}\n\n  static resolve(value) {\n  \n}\n\n  static reject(reason) {\n  \n}\n\n}\n\nfunction resolvePromise(promise2, x, resolve, reject) {\n\n}\n\nexport default MyPromise;",
    "solutionCode": "class MyPromise {\n  /**\n   * @param {Function} executor - 执行器函数\n   */\n  constructor(executor) {\n    this.state = \"pending\";\n    this.value = undefined;\n    this.reason = undefined;\n    this.onFulfilledCallbacks = [];\n    this.onRejectedCallbacks = [];\n\n    const resolve = (value) => {\n      if (this.state === \"pending\") {\n        this.state = \"fulfilled\";\n        this.value = value;\n        this.onFulfilledCallbacks.forEach((fn) => fn());\n      }\n    };\n\n    const reject = (reason) => {\n      if (this.state === \"pending\") {\n        this.state = \"rejected\";\n        this.reason = reason;\n        this.onRejectedCallbacks.forEach((fn) => fn());\n      }\n    };\n\n    try {\n      executor(resolve, reject);\n    } catch (error) {\n      reject(error);\n    }\n  }\n\n  /**\n   * @param {Function} [onFulfilled] - 成功回调\n   * @param {Function} [onRejected] - 失败回调\n   * @returns {MyPromise} 新 Promise 支持链式调用\n   */\n  then(onFulfilled, onRejected) {\n    onFulfilled =\n      typeof onFulfilled === \"function\" ? onFulfilled : (value) => value;\n    onRejected =\n      typeof onRejected === \"function\"\n        ? onRejected\n        : (reason) => {\n            throw reason;\n          };\n\n    const promise2 = new MyPromise((resolve, reject) => {\n      if (this.state === \"fulfilled\") {\n        setTimeout(() => {\n          try {\n            const x = onFulfilled(this.value);\n            resolvePromise(promise2, x, resolve, reject);\n          } catch (error) {\n            reject(error);\n          }\n        }, 0);\n      }\n\n      if (this.state === \"rejected\") {\n        setTimeout(() => {\n          try {\n            const x = onRejected(this.reason);\n            resolvePromise(promise2, x, resolve, reject);\n          } catch (error) {\n            reject(error);\n          }\n        }, 0);\n      }\n\n      if (this.state === \"pending\") {\n        this.onFulfilledCallbacks.push(() => {\n          setTimeout(() => {\n            try {\n              const x = onFulfilled(this.value);\n              resolvePromise(promise2, x, resolve, reject);\n            } catch (error) {\n              reject(error);\n            }\n          }, 0);\n        });\n\n        this.onRejectedCallbacks.push(() => {\n          setTimeout(() => {\n            try {\n              const x = onRejected(this.reason);\n              resolvePromise(promise2, x, resolve, reject);\n            } catch (error) {\n              reject(error);\n            }\n          }, 0);\n        });\n      }\n    });\n\n    return promise2;\n  }\n\n  catch(onRejected) {\n    return this.then(null, onRejected);\n  }\n\n  finally(callback) {\n    return this.then(\n      (value) => MyPromise.resolve(callback()).then(() => value),\n      (reason) =>\n        MyPromise.resolve(callback()).then(() => {\n          throw reason;\n        }),\n    );\n  }\n\n  static resolve(value) {\n    return new MyPromise((resolve) => resolve(value));\n  }\n\n  static reject(reason) {\n    return new MyPromise((_, reject) => reject(reason));\n  }\n}\n\nfunction resolvePromise(promise2, x, resolve, reject) {\n  if (promise2 === x) {\n    reject(new TypeError(\"Chaining cycle detected for promise\"));\n    return;\n  }\n\n  let called = false;\n  if (x != null && (typeof x === \"object\" || typeof x === \"function\")) {\n    try {\n      const then = x.then;\n      if (typeof then === \"function\") {\n        then.call(\n          x,\n          (y) => {\n            if (called) return;\n            called = true;\n            resolvePromise(promise2, y, resolve, reject);\n          },\n          (r) => {\n            if (called) return;\n            called = true;\n            reject(r);\n          },\n        );\n      } else {\n        resolve(x);\n      }\n    } catch (error) {\n      if (called) return;\n      called = true;\n      reject(error);\n    }\n  } else {\n    resolve(x);\n  }\n}\n\nexport default MyPromise;",
    "testCases": {
      "noCustomCase": true,
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "new MyPromise(resolve => resolve(42))",
            "args": []
          },
          "expected": 42
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "new MyPromise((resolve, reject) => reject(new Error(\"fail\")))",
            "args": []
          },
          "expected": {
            "error": "fail"
          }
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "new MyPromise(resolve => resolve(5))",
            "args": [
              "v => v * 2"
            ]
          },
          "expected": 10
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "new MyPromise(resolve => setTimeout(() => resolve(100), 10))",
            "args": []
          },
          "expected": 100
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "new MyPromise(resolve => resolve(1))",
            "args": [
              "v => v + 1",
              "v => v * 2"
            ]
          },
          "expected": 4
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "new MyPromise((resolve, reject) => reject(\"error\"))",
            "args": []
          },
          "expected": {
            "error": "error"
          }
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "new MyPromise(resolve => resolve({ a: 1 }))",
            "args": [
              "obj => obj.a"
            ]
          },
          "expected": 1
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "MyPromise.resolve(10)",
            "args": []
          },
          "expected": 10
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "new MyPromise(resolve => resolve(42))",
        "displayTarget": "new MyPromise(resolve => resolve(42))",
        "displayArgs": [],
        "expected": 42
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "new MyPromise((resolve, reject) => reject(new Error(\"fail\")))",
        "displayTarget": "new MyPromise((resolve, reject) => reject(new Error(\"fail\")))",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "new MyPromise(resolve => resolve(5))(v => v * 2)",
        "displayTarget": "new MyPromise(resolve => resolve(5))",
        "displayArgs": [
          "v => v * 2"
        ],
        "expected": 10
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "new MyPromise(resolve => resolve(42))",
        "displayTarget": "new MyPromise(resolve => resolve(42))",
        "displayArgs": [],
        "expected": 42
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "new MyPromise((resolve, reject) => reject(new Error(\"fail\")))",
        "displayTarget": "new MyPromise((resolve, reject) => reject(new Error(\"fail\")))",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "new MyPromise(resolve => resolve(5))(v => v * 2)",
        "displayTarget": "new MyPromise(resolve => resolve(5))",
        "displayArgs": [
          "v => v * 2"
        ],
        "expected": 10
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "new MyPromise(resolve => setTimeout(() => resolve(100), 10))",
        "displayTarget": "new MyPromise(resolve => setTimeout(() => resolve(100), 10))",
        "displayArgs": [],
        "expected": 100
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "new MyPromise(resolve => resolve(1))(v => v + 1, v => v * 2)",
        "displayTarget": "new MyPromise(resolve => resolve(1))",
        "displayArgs": [
          "v => v + 1",
          "v => v * 2"
        ],
        "expected": 4
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "new MyPromise((resolve, reject) => reject(\"error\"))",
        "displayTarget": "new MyPromise((resolve, reject) => reject(\"error\"))",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "new MyPromise(resolve => resolve({ a: 1 }))(obj => obj.a)",
        "displayTarget": "new MyPromise(resolve => resolve({ a: 1 }))",
        "displayArgs": [
          "obj => obj.a"
        ],
        "expected": 1
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "MyPromise.resolve(10)",
        "displayTarget": "MyPromise.resolve(10)",
        "displayArgs": [],
        "expected": 10
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/promise/promise.js",
    "testPath": "problems/promise/promise_test.js"
  },
  {
    "id": "promise_all",
    "slug": "promise_all",
    "sequence": 17,
    "title": "Promise All",
    "categoryId": "promise",
    "categoryName": "Promise 实现",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个与 Promise.all 语义一致的 Promise.myAll 方法。它需要接收一个可迭代对象，把其中每一项都当作 Promise 或普通值统一处理；只有当所有任务都成功完成时，才按原顺序返回结果数组。只要有任意一个任务先失败，返回的 Promise 就应立即以该错误拒绝。实现时还要处理空可迭代对象和普通值混入的情况。",
    "approachText": "先把输入统一转换成数组，便于按索引稳定收集结果；随后使用 Promise.resolve 包装每一项，让普通值也能参与统一流程，并用完成计数器判断是否全部成功，若中途有任何一项拒绝则立即 reject。",
    "paramsText": "promises：参与聚合的可迭代对象，内部元素可以是 Promise、thenable 或普通值。",
    "returnText": "返回一个新的 Promise；全部成功时兑现按原顺序组成的结果数组，任意一项失败时立即拒绝。",
    "template": "function promiseAll(promises) {\n\n}\n\nexport default promiseAll;",
    "solutionCode": "function promiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    const queue = Array.from(promises);\n    const length = queue.length;\n\n    if (length === 0) {\n      resolve([]);\n      return;\n    }\n\n    const results = new Array(length);\n    let completedCount = 0;\n    let isRejected = false;\n\n    queue.forEach((item, index) => {\n      Promise.resolve(item)\n        .then((value) => {\n          if (isRejected) return;\n          results[index] = value;\n          completedCount++;\n          if (completedCount === length) resolve(results);\n        })\n        .catch((reason) => {\n          if (isRejected) return;\n          isRejected = true;\n          reject(reason);\n        });\n    });\n  });\n}\n\nexport default promiseAll;",
    "testCases": {
      "noCustomCase": true,
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "promiseAll([MyPromise.resolve(1), MyPromise.resolve(2), MyPromise.resolve(3)])",
            "args": []
          },
          "expected": [
            1,
            2,
            3
          ]
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "promiseAll([])",
            "args": []
          },
          "expected": []
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "promiseAll([MyPromise.resolve(\"a\"), MyPromise.resolve(\"b\")])",
            "args": []
          },
          "expected": [
            "a",
            "b"
          ]
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "promiseAll([1, 2, 3])",
            "args": []
          },
          "expected": [
            1,
            2,
            3
          ]
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "promiseAll([MyPromise.resolve(1), MyPromise.reject(new Error(\"err\"))])",
            "args": []
          },
          "expected": {
            "error": "err"
          }
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "promiseAll([new MyPromise(r => setTimeout(() => r(1), 10)), MyPromise.resolve(2)])",
            "args": []
          },
          "expected": [
            1,
            2
          ]
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "promiseAll([MyPromise.resolve({ x: 1 }), MyPromise.resolve({ y: 2 })])",
            "args": []
          },
          "expected": [
            {
              "x": 1
            },
            {
              "y": 2
            }
          ]
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "promiseAll([MyPromise.reject(\"fail\"), MyPromise.resolve(1)])",
            "args": []
          },
          "expected": {
            "error": "fail"
          }
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "promiseAll([MyPromise.resolve(1), MyPromise.resolve(2), MyPromise.resolve(3)])",
        "displayTarget": "promiseAll([MyPromise.resolve(1), MyPromise.resolve(2), MyPromise.resolve(3)])",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "promiseAll([])",
        "displayTarget": "promiseAll([])",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "promiseAll([MyPromise.resolve(\"a\"), MyPromise.resolve(\"b\")])",
        "displayTarget": "promiseAll([MyPromise.resolve(\"a\"), MyPromise.resolve(\"b\")])",
        "displayArgs": [],
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "promiseAll([MyPromise.resolve(1), MyPromise.resolve(2), MyPromise.resolve(3)])",
        "displayTarget": "promiseAll([MyPromise.resolve(1), MyPromise.resolve(2), MyPromise.resolve(3)])",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "promiseAll([])",
        "displayTarget": "promiseAll([])",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "promiseAll([MyPromise.resolve(\"a\"), MyPromise.resolve(\"b\")])",
        "displayTarget": "promiseAll([MyPromise.resolve(\"a\"), MyPromise.resolve(\"b\")])",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "promiseAll([1, 2, 3])",
        "displayTarget": "promiseAll([1, 2, 3])",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "promiseAll([MyPromise.resolve(1), MyPromise.reject(new Error(\"err\"))])",
        "displayTarget": "promiseAll([MyPromise.resolve(1), MyPromise.reject(new Error(\"err\"))])",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "promiseAll([new MyPromise(r => setTimeout(() => r(1), 10)), MyPromise.resolve(2)])",
        "displayTarget": "promiseAll([new MyPromise(r => setTimeout(() => r(1), 10)), MyPromise.resolve(2)])",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "promiseAll([MyPromise.resolve({ x: 1 }), MyPromise.resolve({ y: 2 })])",
        "displayTarget": "promiseAll([MyPromise.resolve({ x: 1 }), MyPromise.resolve({ y: 2 })])",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "promiseAll([MyPromise.reject(\"fail\"), MyPromise.resolve(1)])",
        "displayTarget": "promiseAll([MyPromise.reject(\"fail\"), MyPromise.resolve(1)])",
        "displayArgs": [],
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/promise/promise_all.js",
    "testPath": "problems/promise/promise_all_test.js"
  },
  {
    "id": "promise_race",
    "slug": "promise_race",
    "sequence": 18,
    "title": "Promise Race",
    "categoryId": "promise",
    "categoryName": "Promise 实现",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个与 Promise.race 语义一致的 Promise.myRace 方法。它需要让一组 Promise 或普通值同时参与竞争，只要其中任意一项最先兑现或拒绝，返回的 Promise 就立刻采用该结果并结束。实现时要兼容传入普通值、thenable、空可迭代对象，以及后续慢任务不应再改写最终结果的情况。",
    "approachText": "1. 先把传入的可迭代对象转成数组，便于统一遍历。\n2. 空数组时保持返回 Promise 挂起，这与原生 Promise.race 的行为一致。\n3. 使用 Promise.resolve 包装每一项，保证普通值也能参与竞速。\n4. 通过 is_settled 标记只接受第一个完成结果，后续结果全部忽略。",
    "paramsText": "promises：参与竞速的可迭代对象，内部元素可以是 Promise、thenable 或普通值。",
    "returnText": "返回一个新的 Promise，其状态由最先完成的任务决定。",
    "template": "function promiseRace(promises) {\n\n}\n\nexport default promiseRace;",
    "solutionCode": "function promiseRace(promises) {\n  return new Promise((resolve, reject) => {\n    const queue = Array.from(promises);\n\n    if (queue.length === 0) {\n      return;\n    }\n\n    let is_settled = false;\n\n    queue.forEach((item) => {\n      Promise.resolve(item)\n        .then((value) => {\n          if (is_settled) {\n            return;\n          }\n\n          is_settled = true;\n          resolve(value);\n        })\n        .catch((reason) => {\n          if (is_settled) {\n            return;\n          }\n\n          is_settled = true;\n          reject(reason);\n        });\n    });\n  });\n}\n\nexport default promiseRace;",
    "testCases": {
      "noCustomCase": true,
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "promiseRace([MyPromise.resolve(1), MyPromise.resolve(2)])",
            "args": []
          },
          "expected": 1
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "promiseRace([])",
            "args": []
          },
          "expected": {
            "error": ""
          }
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "promiseRace([MyPromise.reject(new Error(\"err\")), MyPromise.resolve(1)])",
            "args": []
          },
          "expected": {
            "error": "err"
          }
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "promiseRace([1, 2, 3])",
            "args": []
          },
          "expected": 1
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "promiseRace([MyPromise.resolve(\"first\"), MyPromise.resolve(\"second\")])",
            "args": []
          },
          "expected": "first"
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "promiseRace([new MyPromise(r => setTimeout(() => r(1), 100)), MyPromise.resolve(2)])",
            "args": []
          },
          "expected": 2
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "promiseRace([MyPromise.resolve({ a: 1 })])",
            "args": []
          },
          "expected": {
            "a": 1
          }
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "promiseRace([MyPromise.reject(\"fail\"), MyPromise.reject(\"error\")])",
            "args": []
          },
          "expected": {
            "error": "fail"
          }
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "promiseRace([MyPromise.resolve(1), MyPromise.resolve(2)])",
        "displayTarget": "promiseRace([MyPromise.resolve(1), MyPromise.resolve(2)])",
        "displayArgs": [],
        "expected": 1
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "promiseRace([])",
        "displayTarget": "promiseRace([])",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "promiseRace([MyPromise.reject(new Error(\"err\")), MyPromise.resolve(1)])",
        "displayTarget": "promiseRace([MyPromise.reject(new Error(\"err\")), MyPromise.resolve(1)])",
        "displayArgs": [],
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "promiseRace([MyPromise.resolve(1), MyPromise.resolve(2)])",
        "displayTarget": "promiseRace([MyPromise.resolve(1), MyPromise.resolve(2)])",
        "displayArgs": [],
        "expected": 1
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "promiseRace([])",
        "displayTarget": "promiseRace([])",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "promiseRace([MyPromise.reject(new Error(\"err\")), MyPromise.resolve(1)])",
        "displayTarget": "promiseRace([MyPromise.reject(new Error(\"err\")), MyPromise.resolve(1)])",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "promiseRace([1, 2, 3])",
        "displayTarget": "promiseRace([1, 2, 3])",
        "displayArgs": [],
        "expected": 1
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "promiseRace([MyPromise.resolve(\"first\"), MyPromise.resolve(\"second\")])",
        "displayTarget": "promiseRace([MyPromise.resolve(\"first\"), MyPromise.resolve(\"second\")])",
        "displayArgs": [],
        "expected": "first"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "promiseRace([new MyPromise(r => setTimeout(() => r(1), 100)), MyPromise.resolve(2)])",
        "displayTarget": "promiseRace([new MyPromise(r => setTimeout(() => r(1), 100)), MyPromise.resolve(2)])",
        "displayArgs": [],
        "expected": 2
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "promiseRace([MyPromise.resolve({ a: 1 })])",
        "displayTarget": "promiseRace([MyPromise.resolve({ a: 1 })])",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "promiseRace([MyPromise.reject(\"fail\"), MyPromise.reject(\"error\")])",
        "displayTarget": "promiseRace([MyPromise.reject(\"fail\"), MyPromise.reject(\"error\")])",
        "displayArgs": [],
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/promise/promise_race.js",
    "testPath": "problems/promise/promise_race_test.js"
  },
  {
    "id": "inorder",
    "slug": "inorder",
    "sequence": 19,
    "title": "Inorder",
    "categoryId": "tree",
    "categoryName": "树结构",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "使用递归方式实现二叉树中序遍历。函数需要接收根节点，按照“左子树 -> 根节点 -> 右子树”的顺序访问整棵树，并把访问结果按顺序收集到数组中返回。实现时要处理空树、只有单个节点的树，以及左右子树深度不同的情况。",
    "approachText": "1. 递归版本直接按照中序规则访问左右子树和当前节点，代码最直观。\n2. 递归过程中把访问到的节点值依次推入结果数组。\n3. 同时提供迭代版本，使用栈来模拟递归调用栈，方便理解非递归写法。",
    "paramsText": "root：二叉树根节点，空树时传入 null。",
    "returnText": "返回按中序遍历顺序组成的数组。",
    "template": "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n\nfunction inorderTraversal(root) {\n\n}\n\nfunction inorderTraversalIterative(root) {\n\n}\n\nexport default inorderTraversal;",
    "solutionCode": "function inorderTraversal(root) {\n  const result = [];\n\n  function traverse(node) {\n    if (!node) {\n      return;\n    }\n\n    traverse(node.left);\n    result.push(node.val);\n    traverse(node.right);\n  }\n\n  traverse(root);\n  return result;\n}\n\n/**\n * @description 使用显式栈实现二叉树中序遍历。目标仍然是按“左子树 -> 根节点 -> 右子树”的顺序返回节点值，但这一版不能依赖函数递归调用，而是要手动维护遍历路径。实现时要处理空树，并保证输出顺序与递归版本完全一致。\n * @approach\n * 1. 先一路向左，把沿途节点全部压栈。\n * 2. 弹出栈顶节点时，说明它的左子树已经处理完，可以记录当前值。\n * 3. 然后转向该节点的右子树，重复同样过程。\n * @params\n * root：二叉树根节点，空树时传入 null。\n * @return\n * 返回按中序遍历顺序组成的数组。\n */\nfunction inorderTraversalIterative(root) {\n  if (!root) {\n    return [];\n  }\n\n  const result = [];\n  const stack = [];\n  let current = root;\n\n  while (current || stack.length > 0) {\n    while (current) {\n      stack.push(current);\n      current = current.left;\n    }\n\n    current = stack.pop();\n    result.push(current.val);\n    current = current.right;\n  }\n\n  return result;\n}\n\nexport default inorderTraversal;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[1, null, 2, 3]"
          },
          "expected": [
            1,
            3,
            2
          ]
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "[]"
          },
          "expected": []
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[1]"
          },
          "expected": [
            1
          ]
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3]"
          },
          "expected": [
            2,
            1,
            3
          ]
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3, 4, 5, 6, 7]"
          },
          "expected": [
            4,
            2,
            5,
            1,
            6,
            3,
            7
          ]
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[1, null, 2, null, 3]"
          },
          "expected": [
            1,
            2,
            3
          ]
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "[3, 9, 20, null, null, 15, 7]"
          },
          "expected": [
            9,
            3,
            15,
            20,
            7
          ]
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "[2, 1, 3]"
          },
          "expected": [
            1,
            2,
            3
          ]
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, null, 2, 3]",
        "displayTarget": "[1, null, 2, 3]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[1]",
        "displayTarget": "[1]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, null, 2, 3]",
        "displayTarget": "[1, null, 2, 3]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[1]",
        "displayTarget": "[1]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[1, 2, 3]",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[1, 2, 3, 4, 5, 6, 7]",
        "displayTarget": "[1, 2, 3, 4, 5, 6, 7]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[1, null, 2, null, 3]",
        "displayTarget": "[1, null, 2, null, 3]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[3, 9, 20, null, null, 15, 7]",
        "displayTarget": "[3, 9, 20, null, null, 15, 7]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[2, 1, 3]",
        "displayTarget": "[2, 1, 3]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/tree/inorder.js",
    "testPath": "problems/tree/inorder_test.js"
  },
  {
    "id": "isValidBST",
    "slug": "isValidBST",
    "sequence": 20,
    "title": "IsValidBST",
    "categoryId": "tree",
    "categoryName": "树结构",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "使用中序遍历规则验证一棵二叉树是否是合法的二叉搜索树。合法 BST 需要满足：任意节点左子树中的值都严格小于当前节点，右子树中的值都严格大于当前节点，因此整棵树的中序遍历结果应该是严格递增的。实现时要处理空树、只有一个节点的树、以及某个深层节点破坏 BST 条件的情况。",
    "approachText": "1. 对 BST 来说，中序遍历得到的节点值序列必须严格递增。\n2. 使用 prev 记录上一个访问过的节点值。\n3. 遍历过程中一旦发现当前值小于等于 prev，就可以提前判定整棵树非法。",
    "paramsText": "root：二叉树根节点，空树时传入 null。",
    "returnText": "如果是有效 BST 返回 true，否则返回 false。",
    "template": "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n\nfunction isValidBST(root) {\n\n}\n\nfunction isValidBSTRecursive(root) {\n\n}\n\nexport default isValidBST;",
    "solutionCode": "function isValidBST(root) {\n  let prev = null;\n  let isValid = true;\n\n  function inorder(node) {\n    if (!node || !isValid) {\n      return;\n    }\n\n    inorder(node.left);\n\n    if (prev !== null && node.val <= prev) {\n      isValid = false;\n      return;\n    }\n    prev = node.val;\n\n    inorder(node.right);\n  }\n\n  inorder(root);\n  return isValid;\n}\n\n/**\n * @description 使用上下界递归约束验证一棵二叉树是否满足 BST 条件。函数需要在遍历过程中持续记录当前节点允许落入的最小值和最大值，只要某个节点越过了这个合法区间，就说明整棵树不是二叉搜索树。实现时要正确处理空树，以及非法节点可能出现在任意深层位置的情况。\n * @approach\n * 1. 递归时为每个节点携带最小值和最大值边界。\n * 2. 当前节点必须严格大于最小边界，且严格小于最大边界。\n * 3. 左子树继承上界为当前节点值，右子树继承下界为当前节点值。\n * @params\n * root：二叉树根节点，空树时传入 null。\n * @return\n * 如果是有效 BST 返回 true，否则返回 false。\n */\nfunction isValidBSTRecursive(root) {\n  function validate(node, min, max) {\n    if (!node) {\n      return true;\n    }\n\n    if (\n      (min !== null && node.val <= min) ||\n      (max !== null && node.val >= max)\n    ) {\n      return false;\n    }\n\n    return (\n      validate(node.left, min, node.val) && validate(node.right, node.val, max)\n    );\n  }\n\n  return validate(root, null, null);\n}\n\nexport default isValidBST;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[2, 1, 3]"
          },
          "expected": true
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "[5, 1, 4, null, null, 3, 6]"
          },
          "expected": false
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[]"
          },
          "expected": true
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[1]"
          },
          "expected": true
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "[1, 1]"
          },
          "expected": false
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[10, 5, 15, null, null, 6, 20]"
          },
          "expected": false
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "[3, null, 30, 10, null, null, 15, null, 45]"
          },
          "expected": false
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "[0, -1]"
          },
          "expected": true
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[2, 1, 3]",
        "displayTarget": "[2, 1, 3]",
        "displayArgs": undefined,
        "expected": true
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[5, 1, 4, null, null, 3, 6]",
        "displayTarget": "[5, 1, 4, null, null, 3, 6]",
        "displayArgs": undefined,
        "expected": false
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": undefined,
        "expected": true
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[2, 1, 3]",
        "displayTarget": "[2, 1, 3]",
        "displayArgs": undefined,
        "expected": true
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[5, 1, 4, null, null, 3, 6]",
        "displayTarget": "[5, 1, 4, null, null, 3, 6]",
        "displayArgs": undefined,
        "expected": false
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": undefined,
        "expected": true
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[1]",
        "displayTarget": "[1]",
        "displayArgs": undefined,
        "expected": true
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[1, 1]",
        "displayTarget": "[1, 1]",
        "displayArgs": undefined,
        "expected": false
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[10, 5, 15, null, null, 6, 20]",
        "displayTarget": "[10, 5, 15, null, null, 6, 20]",
        "displayArgs": undefined,
        "expected": false
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[3, null, 30, 10, null, null, 15, null, 45]",
        "displayTarget": "[3, null, 30, 10, null, null, 15, null, 45]",
        "displayArgs": undefined,
        "expected": false
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[0, -1]",
        "displayTarget": "[0, -1]",
        "displayArgs": undefined,
        "expected": true
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/tree/isValidBST.js",
    "testPath": "problems/tree/isValidBST_test.js"
  },
  {
    "id": "levelorder",
    "slug": "levelorder",
    "sequence": 21,
    "title": "Levelorder",
    "categoryId": "tree",
    "categoryName": "树结构",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "使用广度优先搜索实现二叉树层序遍历。函数需要从根节点开始，按\"从上到下、从左到右\"的顺序逐层访问节点，并把每一层节点值收集成一个子数组，最终返回二维数组。实现时要处理空树、只有一层的树，以及不同层宽度不一致的情况。",
    "approachText": "使用队列维护当前待访问节点；每轮循环先记录当前层节点数，只消费这一层的节点并收集它们的值，同时把下一层的左右子节点按顺序加入新队列，从而实现按层输出。",
    "paramsText": "root：二叉树根节点；如果为 null，表示输入是一棵空树。",
    "returnText": "返回一个二维数组，其中每个子数组表示一层的节点值，层与层之间保持从上到下的顺序。",
    "template": "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n\nfunction levelOrder(root) {\n\n}\n\nfunction levelOrderWithLevels(root) {\n\n}\n\nexport default levelOrder;",
    "solutionCode": "function levelOrder(root) {\n  if (!root) return [];\n\n  const result = [];\n  let queue = [root];\n\n  while (queue.length > 0) {\n    const levelSize = queue.length;\n    const currentLevel = [];\n    const nextQueue = [];\n\n    for (let i = 0; i < levelSize; i++) {\n      const node = queue[i];\n      currentLevel.push(node.val);\n      if (node.left) nextQueue.push(node.left);\n      if (node.right) nextQueue.push(node.right);\n    }\n\n    result.push(currentLevel);\n    queue = nextQueue;\n  }\n\n  return result;\n}\n\n/**\n * 二叉树层序遍历（分层输出，二维数组）\n * @param {TreeNode} root - 二叉树根节点\n * @returns {Array} 每层节点作为子数组的二维数组\n */\nfunction levelOrderWithLevels(root) {\n  if (!root) return [];\n\n  const result = [];\n  let queue = [root];\n\n  while (queue.length > 0) {\n    const levelSize = queue.length;\n    const currentLevel = [];\n    const nextQueue = [];\n\n    for (let i = 0; i < levelSize; i++) {\n      const node = queue[i];\n      currentLevel.push(node.val);\n      if (node.left) nextQueue.push(node.left);\n      if (node.right) nextQueue.push(node.right);\n    }\n\n    result.push(currentLevel);\n    queue = nextQueue;\n  }\n\n  return result;\n}\n\nexport default levelOrder;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[3, 9, 20, null, null, 15, 7]"
          },
          "expected": [
            [
              3
            ],
            [
              9,
              20
            ],
            [
              15,
              7
            ]
          ]
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "[1]"
          },
          "expected": [
            [
              1
            ]
          ]
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[]"
          },
          "expected": []
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3, 4, 5]"
          },
          "expected": [
            [
              1
            ],
            [
              2,
              3
            ],
            [
              4,
              5
            ]
          ]
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3, null, null, 4, 5]"
          },
          "expected": [
            [
              1
            ],
            [
              2,
              3
            ],
            [
              4,
              5
            ]
          ]
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[1, 2]"
          },
          "expected": [
            [
              1
            ],
            [
              2
            ]
          ]
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "[1, null, 2]"
          },
          "expected": [
            [
              1
            ],
            [
              2
            ]
          ]
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3, 4, null, null, 5]"
          },
          "expected": [
            [
              1
            ],
            [
              2,
              3
            ],
            [
              4,
              5
            ]
          ]
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[3, 9, 20, null, null, 15, 7]",
        "displayTarget": "[3, 9, 20, null, null, 15, 7]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1]",
        "displayTarget": "[1]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[3, 9, 20, null, null, 15, 7]",
        "displayTarget": "[3, 9, 20, null, null, 15, 7]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1]",
        "displayTarget": "[1]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[1, 2, 3, 4, 5]",
        "displayTarget": "[1, 2, 3, 4, 5]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[1, 2, 3, null, null, 4, 5]",
        "displayTarget": "[1, 2, 3, null, null, 4, 5]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[1, 2]",
        "displayTarget": "[1, 2]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[1, null, 2]",
        "displayTarget": "[1, null, 2]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[1, 2, 3, 4, null, null, 5]",
        "displayTarget": "[1, 2, 3, 4, null, null, 5]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/tree/levelorder.js",
    "testPath": "problems/tree/levelorder_test.js"
  },
  {
    "id": "maxDepth",
    "slug": "maxDepth",
    "sequence": 22,
    "title": "MaxDepth",
    "categoryId": "tree",
    "categoryName": "树结构",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "使用递归方式计算二叉树的最大深度。这里的深度定义为从根节点到最远叶子节点经过的节点层数，因此空树深度为 0，只有根节点的树深度为 1。实现时需要分别考虑左右子树的深度，并返回其中较大的那一侧再加上当前根节点这一层。",
    "approachText": "1. 空节点深度为 0，作为递归出口。\n2. 分别递归计算左子树和右子树的最大深度。\n3. 当前节点的深度等于两侧较大值再加 1。",
    "paramsText": "root：二叉树根节点，空树时传入 null。",
    "returnText": "返回二叉树的最大深度。",
    "template": "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n\nfunction maxDepth(root) {\n\n}\n\nfunction maxDepthBFS(root) {\n\n}\n\nexport default maxDepth;",
    "solutionCode": "function maxDepth(root) {\n  if (!root) {\n    return 0;\n  }\n\n  const leftDepth = maxDepth(root.left);\n  const rightDepth = maxDepth(root.right);\n\n  return Math.max(leftDepth, rightDepth) + 1;\n}\n\n/**\n * @description 使用层序遍历计算二叉树最大深度。函数需要按层从上到下遍历整棵树，每处理完一整层就把深度加一，直到所有节点都遍历完成。实现时要处理空树，并保证每一层的节点都只被统计一次。\n * @approach\n * 1. 队列中始终保存当前层的所有节点。\n * 2. 每轮循环先记录当前层节点数，确保只处理这一层。\n * 3. 本层处理结束后，把下一层节点收集起来，并把 depth 加一。\n * @params\n * root：二叉树根节点，空树时传入 null。\n * @return\n * 返回二叉树的最大深度。\n */\nfunction maxDepthBFS(root) {\n  if (!root) {\n    return 0;\n  }\n\n  let depth = 0;\n  let queue = [root];\n\n  while (queue.length > 0) {\n    depth++;\n    const levelSize = queue.length;\n    const nextQueue = [];\n\n    for (let i = 0; i < levelSize; i++) {\n      const node = queue[i];\n      if (node.left) {\n        nextQueue.push(node.left);\n      }\n      if (node.right) {\n        nextQueue.push(node.right);\n      }\n    }\n\n    queue = nextQueue;\n  }\n\n  return depth;\n}\n\nexport default maxDepth;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[3, 9, 20, null, null, 15, 7]"
          },
          "expected": 3
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "[1, null, 2]"
          },
          "expected": 2
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[]"
          },
          "expected": 0
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[1]"
          },
          "expected": 1
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3, 4, 5, 6, 7]"
          },
          "expected": 3
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[1, 2, null, 3, null, 4]"
          },
          "expected": 4
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3, null, null, null, 4]"
          },
          "expected": 3
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "[5, 4, 7, 3, null, 2, null, 1]"
          },
          "expected": 4
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[3, 9, 20, null, null, 15, 7]",
        "displayTarget": "[3, 9, 20, null, null, 15, 7]",
        "displayArgs": undefined,
        "expected": 3
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1, null, 2]",
        "displayTarget": "[1, null, 2]",
        "displayArgs": undefined,
        "expected": 2
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": undefined,
        "expected": 0
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[3, 9, 20, null, null, 15, 7]",
        "displayTarget": "[3, 9, 20, null, null, 15, 7]",
        "displayArgs": undefined,
        "expected": 3
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1, null, 2]",
        "displayTarget": "[1, null, 2]",
        "displayArgs": undefined,
        "expected": 2
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": undefined,
        "expected": 0
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[1]",
        "displayTarget": "[1]",
        "displayArgs": undefined,
        "expected": 1
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[1, 2, 3, 4, 5, 6, 7]",
        "displayTarget": "[1, 2, 3, 4, 5, 6, 7]",
        "displayArgs": undefined,
        "expected": 3
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[1, 2, null, 3, null, 4]",
        "displayTarget": "[1, 2, null, 3, null, 4]",
        "displayArgs": undefined,
        "expected": 4
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[1, 2, 3, null, null, null, 4]",
        "displayTarget": "[1, 2, 3, null, null, null, 4]",
        "displayArgs": undefined,
        "expected": 3
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[5, 4, 7, 3, null, 2, null, 1]",
        "displayTarget": "[5, 4, 7, 3, null, 2, null, 1]",
        "displayArgs": undefined,
        "expected": 4
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/tree/maxDepth.js",
    "testPath": "problems/tree/maxDepth_test.js"
  },
  {
    "id": "postorder",
    "slug": "postorder",
    "sequence": 23,
    "title": "Postorder",
    "categoryId": "tree",
    "categoryName": "树结构",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "使用递归方式实现二叉树后序遍历。函数需要按照“左子树 -> 右子树 -> 根节点”的顺序访问整棵树，并把节点值依次收集到数组中返回。实现时要处理空树、单节点树，以及左右子树层级不一致的情况。",
    "approachText": "1. 先递归遍历左子树。\n2. 再递归遍历右子树。\n3. 最后记录当前节点值，保证根节点最后被访问。",
    "paramsText": "root：二叉树根节点，空树时传入 null。",
    "returnText": "返回按后序遍历顺序组成的数组。",
    "template": "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n\nfunction postorderTraversal(root) {\n\n}\n\nfunction postorderTraversalIterative(root) {\n\n}\n\nexport default postorderTraversal;",
    "solutionCode": "function postorderTraversal(root) {\n  const result = [];\n\n  function traverse(node) {\n    if (!node) {\n      return;\n    }\n\n    traverse(node.left);\n    traverse(node.right);\n    result.push(node.val);\n  }\n\n  traverse(root);\n  return result;\n}\n\n/**\n * @description 使用迭代方式实现二叉树后序遍历。它通过先生成“根 -> 右 -> 左”的访问序列，再整体反转结果，得到真正的“左 -> 右 -> 根”顺序。实现时要处理空树，并确保手动栈版本的输出与递归版保持一致。\n * @approach\n * 1. 先按“根 -> 左 -> 右”的镜像顺序把节点值压入结果数组。\n * 2. 为了得到这个镜像顺序，栈中要先压左子节点，再压右子节点。\n * 3. 最终把结果数组整体反转，就能得到标准后序遍历顺序。\n * @params\n * root：二叉树根节点，空树时传入 null。\n * @return\n * 返回按后序遍历顺序组成的数组。\n */\nfunction postorderTraversalIterative(root) {\n  if (!root) {\n    return [];\n  }\n\n  const result = [];\n  const stack = [root];\n\n  while (stack.length > 0) {\n    const node = stack.pop();\n    result.push(node.val);\n    if (node.left) {\n      stack.push(node.left);\n    }\n    if (node.right) {\n      stack.push(node.right);\n    }\n  }\n\n  return result.reverse();\n}\n\nexport default postorderTraversal;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[1, null, 2, 3]"
          },
          "expected": [
            3,
            2,
            1
          ]
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "[]"
          },
          "expected": []
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[1]"
          },
          "expected": [
            1
          ]
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3]"
          },
          "expected": [
            2,
            3,
            1
          ]
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3, 4, 5, 6, 7]"
          },
          "expected": [
            4,
            5,
            2,
            6,
            7,
            3,
            1
          ]
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[1, null, 2, null, 3]"
          },
          "expected": [
            3,
            2,
            1
          ]
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "[3, 9, 20, null, null, 15, 7]"
          },
          "expected": [
            9,
            15,
            7,
            20,
            3
          ]
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "[2, 1, 3]"
          },
          "expected": [
            1,
            3,
            2
          ]
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, null, 2, 3]",
        "displayTarget": "[1, null, 2, 3]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[1]",
        "displayTarget": "[1]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, null, 2, 3]",
        "displayTarget": "[1, null, 2, 3]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[1]",
        "displayTarget": "[1]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[1, 2, 3]",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[1, 2, 3, 4, 5, 6, 7]",
        "displayTarget": "[1, 2, 3, 4, 5, 6, 7]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[1, null, 2, null, 3]",
        "displayTarget": "[1, null, 2, null, 3]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[3, 9, 20, null, null, 15, 7]",
        "displayTarget": "[3, 9, 20, null, null, 15, 7]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[2, 1, 3]",
        "displayTarget": "[2, 1, 3]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/tree/postorder.js",
    "testPath": "problems/tree/postorder_test.js"
  },
  {
    "id": "preorder",
    "slug": "preorder",
    "sequence": 24,
    "title": "Preorder",
    "categoryId": "tree",
    "categoryName": "树结构",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "使用递归方式实现二叉树前序遍历。函数需要从根节点开始，按照“根节点 -> 左子树 -> 右子树”的顺序访问所有节点，并把节点值依次收集到数组中返回。实现时要兼容空树、单节点树和左右子树不平衡的情况。",
    "approachText": "1. 先访问当前节点并记录节点值。\n2. 然后递归遍历左子树。\n3. 最后递归遍历右子树。",
    "paramsText": "root：二叉树根节点，空树时传入 null。",
    "returnText": "返回按前序遍历顺序组成的数组。",
    "template": "/**\n * Definition for a binary tree node.\n * function TreeNode(val, left, right) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.left = (left===undefined ? null : left)\n *     this.right = (right===undefined ? null : right)\n * }\n */\n\nfunction preorderTraversal(root) {\n\n}\n\nfunction preorderTraversalIterative(root) {\n\n}\n\nexport default preorderTraversal;",
    "solutionCode": "function preorderTraversal(root) {\n  const result = [];\n\n  function traverse(node) {\n    if (!node) {\n      return;\n    }\n\n    result.push(node.val);\n    traverse(node.left);\n    traverse(node.right);\n  }\n\n  traverse(root);\n  return result;\n}\n\n/**\n * @description 使用显式栈实现二叉树前序遍历。目标仍然是按“根节点 -> 左子树 -> 右子树”的顺序返回节点值，但通过手动维护栈来替代递归。实现时要处理空树，并通过正确的入栈顺序保证左子树先于右子树被访问。\n * @approach\n * 1. 栈先放入根节点，每轮弹出一个节点并记录其值。\n * 2. 因为栈是后进先出，所以需要先压入右子节点，再压入左子节点。\n * 3. 这样下一轮弹出时会先处理左子树，顺序与递归前序遍历一致。\n * @params\n * root：二叉树根节点，空树时传入 null。\n * @return\n * 返回按前序遍历顺序组成的数组。\n */\nfunction preorderTraversalIterative(root) {\n  if (!root) {\n    return [];\n  }\n\n  const result = [];\n  const stack = [root];\n\n  while (stack.length > 0) {\n    const node = stack.pop();\n    result.push(node.val);\n    if (node.right) {\n      stack.push(node.right);\n    }\n    if (node.left) {\n      stack.push(node.left);\n    }\n  }\n\n  return result;\n}\n\nexport default preorderTraversal;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[1, null, 2, 3]"
          },
          "expected": [
            1,
            2,
            3
          ]
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "[]"
          },
          "expected": []
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[1]"
          },
          "expected": [
            1
          ]
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3]"
          },
          "expected": [
            1,
            2,
            3
          ]
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3, 4, 5, 6, 7]"
          },
          "expected": [
            1,
            2,
            4,
            5,
            3,
            6,
            7
          ]
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[1, null, 2, null, 3]"
          },
          "expected": [
            1,
            2,
            3
          ]
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "[3, 9, 20, null, null, 15, 7]"
          },
          "expected": [
            3,
            9,
            20,
            15,
            7
          ]
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "[1, 2]"
          },
          "expected": [
            1,
            2
          ]
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, null, 2, 3]",
        "displayTarget": "[1, null, 2, 3]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[1]",
        "displayTarget": "[1]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, null, 2, 3]",
        "displayTarget": "[1, null, 2, 3]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[1]",
        "displayTarget": "[1]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[1, 2, 3]",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[1, 2, 3, 4, 5, 6, 7]",
        "displayTarget": "[1, 2, 3, 4, 5, 6, 7]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[1, null, 2, null, 3]",
        "displayTarget": "[1, null, 2, null, 3]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[3, 9, 20, null, null, 15, 7]",
        "displayTarget": "[3, 9, 20, null, null, 15, 7]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[1, 2]",
        "displayTarget": "[1, 2]",
        "displayArgs": undefined,
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/tree/preorder.js",
    "testPath": "problems/tree/preorder_test.js"
  },
  {
    "id": "curry",
    "slug": "curry",
    "sequence": 25,
    "title": "Curry",
    "categoryId": "utility",
    "categoryName": "工具函数",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个基础柯里化函数 curry。它需要把一个接受多个参数的普通函数转换成可分多次传参的函数：只要当前收集到的参数数量还不足，就继续返回函数等待后续补参；当参数数量达到原函数声明所需时，再一次性执行原函数并返回结果。实现时要保证参数按调用顺序累积，并尽量保留调用时的 this 上下文。",
    "approachText": "先读取原函数的形参数量作为触发执行的阈值；每次调用都把当前参数暂存起来，参数足够就立即执行原函数，不够就返回一个新的收集函数继续拼接后续参数。",
    "paramsText": "fn：需要被柯里化的原函数，最终会在参数数量满足条件时被调用。",
    "returnText": "返回一个支持多次分步传参的新函数；累计参数达到要求后会返回原函数执行结果。",
    "template": "function curry(fn) {\n\n}\n\nexport default curry;",
    "solutionCode": "function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n\n    return function (...nextArgs) {\n      const mergedArgs = args.concat(nextArgs);\n\n      return curried.apply(this, mergedArgs);\n    };\n  };\n}\n\nexport default curry;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "(a, b, c) => a + b + c",
            "args": [
              "1",
              "2",
              "3"
            ]
          },
          "expected": 6
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "(x, y) => x * y",
            "args": [
              "2",
              "5"
            ]
          },
          "expected": 10
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "(a) => a",
            "args": [
              "42"
            ]
          },
          "expected": 42
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "(a, b, c, d) => a + b + c + d",
            "args": [
              "1",
              "2",
              "3",
              "4"
            ]
          },
          "expected": 10
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "() => 42",
            "args": []
          },
          "expected": 42
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "(a, b) => ({ a, b })",
            "args": [
              "1",
              "2"
            ]
          },
          "expected": {
            "a": 1,
            "b": 2
          }
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "(str, prefix, suffix) => prefix + str + suffix",
            "args": [
              "\"hello\"",
              "\"<\"",
              "\">\""
            ]
          },
          "expected": "<hello>"
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "(arr, fn) => arr.map(fn)",
            "args": [
              "[1, 2, 3]",
              "x => x * 2"
            ]
          },
          "expected": [
            2,
            4,
            6
          ]
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "(a, b, c) => a + b + c(1, 2, 3)",
        "displayTarget": "(a, b, c) => a + b + c",
        "displayArgs": [
          "1",
          "2",
          "3"
        ],
        "expected": 6
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "(x, y) => x * y(2, 5)",
        "displayTarget": "(x, y) => x * y",
        "displayArgs": [
          "2",
          "5"
        ],
        "expected": 10
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "(a) => a(42)",
        "displayTarget": "(a) => a",
        "displayArgs": [
          "42"
        ],
        "expected": 42
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "(a, b, c) => a + b + c(1, 2, 3)",
        "displayTarget": "(a, b, c) => a + b + c",
        "displayArgs": [
          "1",
          "2",
          "3"
        ],
        "expected": 6
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "(x, y) => x * y(2, 5)",
        "displayTarget": "(x, y) => x * y",
        "displayArgs": [
          "2",
          "5"
        ],
        "expected": 10
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "(a) => a(42)",
        "displayTarget": "(a) => a",
        "displayArgs": [
          "42"
        ],
        "expected": 42
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "(a, b, c, d) => a + b + c + d(1, 2, 3, 4)",
        "displayTarget": "(a, b, c, d) => a + b + c + d",
        "displayArgs": [
          "1",
          "2",
          "3",
          "4"
        ],
        "expected": 10
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "() => 42",
        "displayTarget": "() => 42",
        "displayArgs": [],
        "expected": 42
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "(a, b) => ({ a, b })(1, 2)",
        "displayTarget": "(a, b) => ({ a, b })",
        "displayArgs": [
          "1",
          "2"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "(str, prefix, suffix) => prefix + str + suffix(\"hello\", \"<\", \">\")",
        "displayTarget": "(str, prefix, suffix) => prefix + str + suffix",
        "displayArgs": [
          "\"hello\"",
          "\"<\"",
          "\">\""
        ],
        "expected": "<hello>"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "(arr, fn) => arr.map(fn)([1, 2, 3], x => x * 2)",
        "displayTarget": "(arr, fn) => arr.map(fn)",
        "displayArgs": [
          "[1, 2, 3]",
          "x => x * 2"
        ],
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/utility/curry.js",
    "testPath": "problems/utility/curry_test.js"
  },
  {
    "id": "debounce",
    "slug": "debounce",
    "sequence": 26,
    "title": "Debounce",
    "categoryId": "utility",
    "categoryName": "工具函数",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个基础防抖函数 debounce。它需要接收一个待执行任务和等待时间，返回新的包装函数；当包装函数在短时间内被连续触发时，前面的计划执行都要被取消，只保留最后一次触发，并在停止触发满 delay 毫秒后再真正执行任务。实现时要保留最后一次调用时的 this 和参数，并在传入的 task 不是函数时抛出错误。",
    "approachText": "用闭包保存唯一的定时器标识；每次触发先清掉旧定时器，再重新安排一次延迟执行，这样只有最后一次触发能存活到计时结束，并用最后一次触发时的上下文和参数执行任务。",
    "paramsText": "task：需要被防抖包装的目标函数，真正的业务逻辑会在静默期结束后执行。\ndelay：连续触发停止后还需要再等待多少毫秒才执行 task。",
    "returnText": "返回一个新的防抖函数；调用它不会立刻执行 task，而是按防抖规则延后执行。",
    "template": "function debounce(task, delay) {\n\n}\n\ndebounce;\n\nexport default debounce;",
    "solutionCode": "function debounce(task, delay) {\n  if (typeof task !== \"function\") {\n    throw new TypeError(\"debounce can only run with functions\");\n  }\n\n  let timer = null;\n\n  return function (...args) {\n    if (timer !== null) {\n      clearTimeout(timer);\n    }\n\n    timer = setTimeout(() => {\n      task.apply(this, args);\n    }, delay);\n  };\n}\n\ndebounce;\n\nexport default debounce;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "200",
            "steps": [
              {
                "type": "call",
                "args": []
              },
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 200
              }
            ]
          },
          "expected": {
            "callCount": 1
          }
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "100",
            "steps": [
              {
                "type": "call",
                "args": [
                  "\"a\""
                ]
              },
              {
                "type": "tick",
                "ms": 50
              },
              {
                "type": "call",
                "args": [
                  "\"b\""
                ]
              },
              {
                "type": "tick",
                "ms": 100
              }
            ]
          },
          "expected": {
            "callCount": 1
          }
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "100",
            "steps": [
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 150
              },
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 150
              }
            ]
          },
          "expected": {
            "callCount": 2
          }
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "100",
            "steps": [
              {
                "type": "call",
                "args": [
                  "1"
                ]
              },
              {
                "type": "tick",
                "ms": 100
              }
            ]
          },
          "expected": {
            "callCount": 1
          }
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "50",
            "steps": [
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 25
              },
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 25
              },
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 50
              }
            ]
          },
          "expected": {
            "callCount": 1
          }
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "100",
            "steps": [
              {
                "type": "call",
                "args": [
                  "\"first\""
                ]
              },
              {
                "type": "tick",
                "ms": 50
              },
              {
                "type": "call",
                "args": [
                  "\"second\""
                ]
              },
              {
                "type": "tick",
                "ms": 50
              },
              {
                "type": "call",
                "args": [
                  "\"third\""
                ]
              },
              {
                "type": "tick",
                "ms": 100
              }
            ]
          },
          "expected": {
            "callCount": 1
          }
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "0",
            "steps": [
              {
                "type": "call",
                "args": []
              },
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 0
              }
            ]
          },
          "expected": {
            "callCount": 1
          }
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "100",
            "steps": [
              {
                "type": "call",
                "args": [
                  "1",
                  "2",
                  "3"
                ]
              },
              {
                "type": "tick",
                "ms": 100
              }
            ]
          },
          "expected": {
            "callCount": 1
          }
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[3 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[4 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[4 steps]",
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[3 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[4 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[4 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[2 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[6 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[6 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[3 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[2 steps]",
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/utility/debounce.js",
    "testPath": "problems/utility/debounce_test.js"
  },
  {
    "id": "deepClone",
    "slug": "deepClone",
    "sequence": 27,
    "title": "DeepClone",
    "categoryId": "utility",
    "categoryName": "工具函数",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个更完整的深拷贝函数 deepClone。它需要复制普通对象、数组、Date、RegExp、Map、Set 等常见可遍历结构，使返回结果与原始数据在值层面保持等价，但在引用层面完全独立。实现时还要处理循环引用，避免因为对象之间互相引用而导致无限递归，同时保证 Symbol 键也能被复制。",
    "approachText": "先把基础类型、特殊对象和普通对象分开处理，再使用 WeakMap 记录已经克隆过的引用；对于数组和普通对象递归复制自身所有键，对于 Map 和 Set 则递归复制其中的键和值或成员，从而兼顾深层结构和循环引用。",
    "paramsText": "obj：需要被深拷贝的输入值，可能是普通对象、数组或其他引用类型。\ncache：内部使用的 WeakMap 缓存，用来记录已经处理过的引用，默认自动创建。",
    "returnText": "返回一个与原值结构等价但引用独立的新结果；如果传入的是基础类型，则直接返回原值。",
    "template": "function deepClone(obj, cache = new WeakMap()) {\n\n}\n\nexport default deepClone;",
    "solutionCode": "function deepClone(obj, cache = new WeakMap()) {\n  if (obj === null || typeof obj !== \"object\") return obj;\n\n  if (cache.has(obj)) return cache.get(obj);\n\n  if (obj instanceof Date) return new Date(obj.getTime());\n  if (obj instanceof RegExp) return new RegExp(obj);\n\n  if (obj instanceof Map) {\n    const clonedMap = new Map();\n    cache.set(obj, clonedMap);\n    obj.forEach((value, key) => {\n      clonedMap.set(deepClone(key, cache), deepClone(value, cache));\n    });\n    return clonedMap;\n  }\n\n  if (obj instanceof Set) {\n    const clonedSet = new Set();\n    cache.set(obj, clonedSet);\n    obj.forEach((value) => clonedSet.add(deepClone(value, cache)));\n    return clonedSet;\n  }\n\n  const clonedObj = Array.isArray(obj) ? [] : {};\n  cache.set(obj, clonedObj);\n\n  Reflect.ownKeys(obj).forEach((key) => {\n    clonedObj[key] = deepClone(obj[key], cache);\n  });\n\n  return clonedObj;\n}\n\nexport default deepClone;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "({ a: 1, b: 2 })",
            "args": []
          },
          "expected": {
            "a": 1,
            "b": 2
          }
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "({ nested: { x: 1 } })",
            "args": []
          },
          "expected": {
            "nested": {
              "x": 1
            }
          }
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[1, [2, 3]]",
            "args": []
          },
          "expected": [
            1,
            [
              2,
              3
            ]
          ]
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[]",
            "args": []
          },
          "expected": []
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "({ a: { b: { c: { d: 1 } } } })",
            "args": []
          },
          "expected": {
            "a": {
              "b": {
                "c": {
                  "d": 1
                }
              }
            }
          }
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "({ arr: [1, 2, { x: 3 }] })",
            "args": []
          },
          "expected": {
            "arr": [
              1,
              2,
              {
                "x": 3
              }
            ]
          }
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "({ a: null, b: undefined, c: NaN })",
            "args": []
          },
          "expected": {
            "a": null,
            "b": undefined,
            "c": null
          }
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "({ d: new Date(2024, 0, 1) })",
            "args": []
          },
          "expected": {
            "d": "2023-12-31T16:00:00.000Z"
          }
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "({ a: 1, b: 2 })",
        "displayTarget": "({ a: 1, b: 2 })",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "({ nested: { x: 1 } })",
        "displayTarget": "({ nested: { x: 1 } })",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[1, [2, 3]]",
        "displayTarget": "[1, [2, 3]]",
        "displayArgs": [],
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "({ a: 1, b: 2 })",
        "displayTarget": "({ a: 1, b: 2 })",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "({ nested: { x: 1 } })",
        "displayTarget": "({ nested: { x: 1 } })",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[1, [2, 3]]",
        "displayTarget": "[1, [2, 3]]",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[]",
        "displayTarget": "[]",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "({ a: { b: { c: { d: 1 } } } })",
        "displayTarget": "({ a: { b: { c: { d: 1 } } } })",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "({ arr: [1, 2, { x: 3 }] })",
        "displayTarget": "({ arr: [1, 2, { x: 3 }] })",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "({ a: null, b: undefined, c: NaN })",
        "displayTarget": "({ a: null, b: undefined, c: NaN })",
        "displayArgs": [],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "({ d: new Date(2024, 0, 1) })",
        "displayTarget": "({ d: new Date(2024, 0, 1) })",
        "displayArgs": [],
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/utility/deepClone.js",
    "testPath": "problems/utility/deepClone_test.js"
  },
  {
    "id": "flatten",
    "slug": "flatten",
    "sequence": 28,
    "title": "Flatten",
    "categoryId": "utility",
    "categoryName": "工具函数",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "使用递归方式实现数组扁平化。函数需要接收一个可能包含多层嵌套数组的输入，并在指定深度范围内逐层展开子数组；当 depth 用尽时，剩余的嵌套结构需要原样保留。实现时不能修改原数组，深度为 0 或负数时应返回原数组的浅拷贝。",
    "approachText": "1. 当 depth 小于等于 0 时，直接返回原数组的浅拷贝，表示不再继续展开。\n2. 顺序遍历数组元素，保证结果顺序与原数组一致。\n3. 遇到子数组时递归处理剩余深度；遇到普通值时直接放入结果数组。",
    "paramsText": "arr：需要被扁平化的数组。\ndepth：允许展开的最大深度，默认展开到最深层。",
    "returnText": "返回扁平化后的新数组。",
    "template": "function flatten(arr, depth = Infinity) {\n\n}\n\nfunction flattenReduce(arr, depth = Infinity) {\n\n}\n\nfunction flattenIterative(arr, depth = Infinity) {\n\n}\n\nexport default flatten;",
    "solutionCode": "function flatten(arr, depth = Infinity) {\n  if (depth <= 0) {\n    return arr.slice();\n  }\n\n  const result = [];\n\n  for (const item of arr) {\n    if (Array.isArray(item) && depth > 0) {\n      result.push(...flatten(item, depth - 1));\n    } else {\n      result.push(item);\n    }\n  }\n\n  return result;\n}\n\n/**\n * @description 使用 reduce 改写数组扁平化逻辑。目标仍然是把嵌套数组在指定深度内展开成一个新数组，但这一版强调用累加器逐步汇总结果，而不是手动维护外部结果数组。它同样需要保留原顺序、支持 depth 控制，并且不能修改传入数组。\n * @approach\n * 1. 仍然沿用“深度减一”的递归规则，只是把遍历过程交给 reduce。\n * 2. 每轮都返回新的累加结果，写法更偏函数式。\n * 3. 子数组递归展开后用 concat 拼接，普通值直接追加到累加器末尾。\n * @params\n * arr：需要被扁平化的数组。\n * depth：允许展开的最大深度，默认展开到最深层。\n * @return\n * 返回扁平化后的新数组。\n */\nfunction flattenReduce(arr, depth = Infinity) {\n  if (depth <= 0) {\n    return arr.slice();\n  }\n\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item) && depth > 0) {\n      return acc.concat(flattenReduce(item, depth - 1));\n    }\n    return acc.concat(item);\n  }, []);\n}\n\n/**\n * @description 使用显式栈实现数组扁平化。它要完成与递归版相同的功能：把嵌套数组在指定深度内展开成新数组，但通过手动维护栈来避免层级过深时递归调用栈溢出。实现时需要额外记录当前元素所处深度，并保证最终输出顺序与原数组一致。\n * @approach\n * 1. 先把顶层元素连同当前深度一起压入栈中。\n * 2. 每次弹出一个元素处理；如果仍可展开，就把子数组从右向左压栈。\n * 3. 从右向左压栈是为了保证后续弹出时依然保持原始顺序。\n * @params\n * arr：需要被扁平化的数组。\n * depth：允许展开的最大深度，默认展开到最深层。\n * @return\n * 返回扁平化后的新数组。\n */\nfunction flattenIterative(arr, depth = Infinity) {\n  const result = [];\n  const stack = arr.map((item) => ({ item, currentDepth: 0 }));\n\n  while (stack.length > 0) {\n    const { item, currentDepth } = stack.pop();\n\n    if (Array.isArray(item) && currentDepth < depth) {\n      for (let i = item.length - 1; i >= 0; i--) {\n        stack.push({ item: item[i], currentDepth: currentDepth + 1 });\n      }\n    } else {\n      result.push(item);\n    }\n  }\n\n  return result;\n}\n\nexport default flatten;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "[1, [2, 3], 4]",
            "args": [
              "1"
            ]
          },
          "expected": [
            1,
            2,
            3,
            4
          ]
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "[1, [2, [3, [4]]]]",
            "args": [
              "2"
            ]
          },
          "expected": [
            1,
            2,
            3,
            [
              4
            ]
          ]
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "[]",
            "args": [
              "1"
            ]
          },
          "expected": []
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "[1, [2, [3, [4]]]]",
            "args": [
              "Infinity"
            ]
          },
          "expected": [
            1,
            2,
            3,
            4
          ]
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "[1, 2, 3]",
            "args": [
              "1"
            ]
          },
          "expected": [
            1,
            2,
            3
          ]
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "[[[[1]]]]",
            "args": [
              "3"
            ]
          },
          "expected": [
            1
          ]
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "[1, [], 2, [3, []]]",
            "args": [
              "1"
            ]
          },
          "expected": [
            1,
            2,
            3,
            []
          ]
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "[1, [2, [3, [4, [5]]]]]",
            "args": [
              "0"
            ]
          },
          "expected": [
            1,
            [
              2,
              [
                3,
                [
                  4,
                  [
                    5
                  ]
                ]
              ]
            ]
          ]
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, [2, 3], 4](1)",
        "displayTarget": "[1, [2, 3], 4]",
        "displayArgs": [
          "1"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1, [2, [3, [4]]]](2)",
        "displayTarget": "[1, [2, [3, [4]]]]",
        "displayArgs": [
          "2"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[](1)",
        "displayTarget": "[]",
        "displayArgs": [
          "1"
        ],
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[1, [2, 3], 4](1)",
        "displayTarget": "[1, [2, 3], 4]",
        "displayArgs": [
          "1"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[1, [2, [3, [4]]]](2)",
        "displayTarget": "[1, [2, [3, [4]]]]",
        "displayArgs": [
          "2"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[](1)",
        "displayTarget": "[]",
        "displayArgs": [
          "1"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[1, [2, [3, [4]]]](Infinity)",
        "displayTarget": "[1, [2, [3, [4]]]]",
        "displayArgs": [
          "Infinity"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[1, 2, 3](1)",
        "displayTarget": "[1, 2, 3]",
        "displayArgs": [
          "1"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[[[[1]]]](3)",
        "displayTarget": "[[[[1]]]]",
        "displayArgs": [
          "3"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[1, [], 2, [3, []]](1)",
        "displayTarget": "[1, [], 2, [3, []]]",
        "displayArgs": [
          "1"
        ],
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[1, [2, [3, [4, [5]]]]](0)",
        "displayTarget": "[1, [2, [3, [4, [5]]]]]",
        "displayArgs": [
          "0"
        ],
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/utility/flatten.js",
    "testPath": "problems/utility/flatten_test.js"
  },
  {
    "id": "scheduler",
    "slug": "scheduler",
    "sequence": 29,
    "title": "Scheduler",
    "categoryId": "utility",
    "categoryName": "工具函数",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个并发调度器 Scheduler。它需要在构造时接收并发上限 limit，然后通过 add 方法持续加入返回 Promise 的异步任务；调度器必须保证同一时刻最多只有 limit 个任务处于执行中，超出的任务先进入等待队列，等已有任务完成后再按加入顺序继续执行。每个 add 调用都要返回一个 Promise，用来拿到对应任务的最终结果或错误。",
    "approachText": "用队列缓存暂时不能执行的任务，再用 count 记录当前运行中的任务数量；每次 add 后尝试启动任务，只有并发未满时才真正取出队列头部执行，任务结束后递减计数并继续触发下一轮调度。",
    "paramsText": "limit：调度器允许同时运行的最大任务数，通常为正整数。",
    "returnText": "返回一个 Scheduler 实例；后续通过它的 add 方法接收任务并控制并发。",
    "template": "class Scheduler {\n  constructor(limit) {\n  \n}\n\n  \n  add(task) {\n  \n}\n\n  run() {\n  \n}\n\n}\n\nexport default Scheduler;",
    "solutionCode": "class Scheduler {\n  constructor(limit) {\n    this.limit = limit;\n    this.count = 0;\n    this.queue = [];\n  }\n\n  /**\n   * @description 向调度器中加入一个异步任务；如果当前并发未满就立即执行，否则先排队等待。\n   * @approach 将任务函数和它对应的 resolve、reject 一起压入等待队列，然后统一交给 run 处理，这样每个任务都能在未来拿到自己的执行结果。\n   * @params\n   * task：一个无参函数，调用后必须返回 Promise，用来描述真正的异步工作。\n   * @return\n   * 返回一个 Promise；当对应任务执行成功时兑现结果，失败时拒绝错误。\n   */\n  add(task) {\n    return new Promise((resolve, reject) => {\n      this.queue.push({ task, resolve, reject });\n      this.run();\n    });\n  }\n\n  run() {\n    if (this.count >= this.limit || this.queue.length === 0) return;\n\n    this.count++;\n    const { task, resolve, reject } = this.queue.shift();\n\n    task()\n      .then(resolve)\n      .catch(reject)\n      .finally(() => {\n        this.count--;\n        this.run();\n      });\n  }\n}\n\nexport default Scheduler;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "2",
            "steps": [
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve()"
                ]
              },
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve()"
                ]
              },
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve()"
                ]
              },
              {
                "type": "await"
              }
            ]
          },
          "expected": {
            "callCount": 3
          }
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "1",
            "steps": [
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve()"
                ]
              },
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve()"
                ]
              },
              {
                "type": "await"
              }
            ]
          },
          "expected": {
            "callCount": 2,
            "maxConcurrent": 1
          }
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "3",
            "steps": [
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve()"
                ]
              },
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve()"
                ]
              },
              {
                "type": "await"
              }
            ]
          },
          "expected": {
            "callCount": 2,
            "maxConcurrent": 2
          }
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "2",
            "steps": [
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve(1)"
                ]
              },
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve(2)"
                ]
              },
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve(3)"
                ]
              },
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve(4)"
                ]
              },
              {
                "type": "await"
              }
            ]
          },
          "expected": {
            "callCount": 4,
            "maxConcurrent": 2
          }
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "1",
            "steps": [
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve()"
                ]
              },
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve()"
                ]
              },
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve()"
                ]
              },
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve()"
                ]
              },
              {
                "type": "await"
              }
            ]
          },
          "expected": {
            "callCount": 4,
            "maxConcurrent": 1
          }
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "5",
            "steps": [
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve()"
                ]
              },
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve()"
                ]
              },
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve()"
                ]
              },
              {
                "type": "await"
              }
            ]
          },
          "expected": {
            "callCount": 3,
            "maxConcurrent": 3
          }
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "2",
            "steps": [
              {
                "type": "call",
                "args": [
                  "() => Promise.reject(new Error(\"err\"))"
                ]
              },
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve()"
                ]
              },
              {
                "type": "await"
              }
            ]
          },
          "expected": {
            "callCount": 2,
            "hasError": true
          }
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "2",
            "steps": [
              {
                "type": "call",
                "args": [
                  "() => new Promise(r => setTimeout(r, 100))"
                ]
              },
              {
                "type": "tick",
                "ms": 50
              },
              {
                "type": "call",
                "args": [
                  "() => Promise.resolve()"
                ]
              },
              {
                "type": "tick",
                "ms": 100
              },
              {
                "type": "await"
              }
            ]
          },
          "expected": {
            "callCount": 2,
            "maxConcurrent": 2
          }
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[4 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[3 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[3 steps]",
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[4 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[3 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[3 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[5 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[5 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[4 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[3 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[5 steps]",
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/utility/scheduler.js",
    "testPath": "problems/utility/scheduler_test.js"
  },
  {
    "id": "task_queue_runner",
    "slug": "task_queue_runner",
    "sequence": 30,
    "title": "Task Queue Runner",
    "categoryId": "utility",
    "categoryName": "工具函数",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个任务队列执行器 execute。它需要按顺序串行执行一组异步任务，并为每个任务提供超时控制与失败重试能力；如果某个任务在规定时间内没有完成，或者执行时报错，就要在未超过重试上限时重新尝试。这个函数的目标是把一批异步任务稳定地顺序跑完，同时把失败位置和原因明确暴露出来。",
    "approachText": "使用 for 循环按顺序消费任务数组，并把单个任务包装进 Promise.race 中实现超时控制；某次执行失败就根据 retries 决定是否继续重试，直到成功或达到上限，再决定进入下一个任务或直接抛出错误。",
    "paramsText": "tasks：按执行顺序排列的任务函数数组，每个任务函数都应返回 Promise。\ntimeout：单个任务允许执行的最长毫秒数，超过该时间会按超时失败处理。\nretries：单个任务失败后允许额外重试的最大次数，不包含第一次执行。",
    "returnText": "当所有任务都按顺序执行完成时返回一个已完成的 Promise；只要有任务最终失败，就返回被拒绝的 Promise。",
    "template": "async function execute(tasks, timeout, retries) {\n\n}\n\nfunction runTask(task, index, timeout, retries) {\n\n}\n\nexport default execute;",
    "solutionCode": "async function execute(tasks, timeout, retries) {\n  if (!Array.isArray(tasks)) {\n    throw new TypeError(\"execute function can only execute array of tasks\");\n  }\n\n  for (let i = 0; i < tasks.length; i++) {\n    const task = tasks[i];\n    if (typeof task !== \"function\") {\n      throw new TypeError(`Task at index ${i} is not a function`);\n    }\n    await runTask(task, i, timeout, retries);\n  }\n}\n\n/**\n * 执行单个任务，支持超时和重试\n * @param {Function} task - 任务函数\n * @param {number} index - 任务索引\n * @param {number} timeout - 超时时间\n * @param {number} retries - 最大重试次数\n * @returns {Promise<*>}\n */\nfunction runTask(task, index, timeout, retries) {\n  let currentTries = 0;\n\n  return new Promise((resolve, reject) => {\n    const attempt = async () => {\n      currentTries++;\n\n      try {\n        const result = await Promise.race([\n          task(),\n          new Promise((_, rejectTimeout) => {\n            setTimeout(() => {\n              rejectTimeout(\n                new Error(`Task ${index} execute timeout after ${timeout}ms`),\n              );\n            }, timeout);\n          }),\n        ]);\n        resolve(result);\n      } catch (err) {\n        if (currentTries < retries) {\n          attempt();\n        } else {\n          reject(\n            new Error(\n              `Task ${index} failed after ${retries} retries: ${err.message}`,\n            ),\n          );\n        }\n      }\n    };\n\n    attempt();\n  });\n}\n\nexport default execute;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "",
            "steps": [
              {
                "type": "call",
                "args": [
                  "[]"
                ]
              },
              {
                "type": "await"
              }
            ]
          },
          "expected": {
            "callCount": 0
          }
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "",
            "steps": [
              {
                "type": "call",
                "args": [
                  "[() => Promise.resolve()]"
                ]
              },
              {
                "type": "await"
              }
            ]
          },
          "expected": {
            "callCount": 1
          }
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "",
            "steps": [
              {
                "type": "call",
                "args": [
                  "[() => Promise.resolve(), () => Promise.resolve()]"
                ]
              },
              {
                "type": "await"
              }
            ]
          },
          "expected": {
            "callCount": 2
          }
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "",
            "steps": [
              {
                "type": "call",
                "args": [
                  "[() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)]"
                ]
              },
              {
                "type": "await"
              }
            ]
          },
          "expected": {
            "callCount": 3
          }
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "",
            "steps": [
              {
                "type": "call",
                "args": [
                  "[() => Promise.reject(new Error(\"err\"))]"
                ]
              },
              {
                "type": "await"
              }
            ]
          },
          "expected": {
            "callCount": 1,
            "hasError": true
          }
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "",
            "steps": [
              {
                "type": "call",
                "args": [
                  "[() => new Promise(r => setTimeout(r, 100))]"
                ]
              },
              {
                "type": "tick",
                "ms": 100
              },
              {
                "type": "await"
              }
            ]
          },
          "expected": {
            "callCount": 1
          }
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "",
            "steps": [
              {
                "type": "call",
                "args": [
                  "[() => Promise.resolve(), () => Promise.resolve()]"
                ]
              },
              {
                "type": "call",
                "args": [
                  "[() => Promise.resolve()]"
                ]
              },
              {
                "type": "await"
              }
            ]
          },
          "expected": {
            "callCount": 3
          }
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "",
            "steps": [
              {
                "type": "call",
                "args": [
                  "[() => Promise.resolve(1)]"
                ]
              },
              {
                "type": "await"
              },
              {
                "type": "call",
                "args": [
                  "[() => Promise.resolve(2)]"
                ]
              },
              {
                "type": "await"
              }
            ]
          },
          "expected": {
            "callCount": 2
          }
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[2 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[2 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[2 steps]",
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[2 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[2 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[2 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[2 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[2 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[3 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[3 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[4 steps]",
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/utility/task_queue_runner.js",
    "testPath": "problems/utility/task_queue_runner_test.js"
  },
  {
    "id": "throttle",
    "slug": "throttle",
    "sequence": 31,
    "title": "Throttle",
    "categoryId": "utility",
    "categoryName": "工具函数",
    "sourceType": "js",
    "executionMode": "browser",
    "launcherPath": null,
    "description": "实现一个基础节流函数 throttle。它需要接收目标函数和时间间隔，返回新的包装函数；当包装函数被高频触发时，只有距离上一次真正执行已经超过指定间隔时才允许再次执行。这样可以限制任务执行频率，常用于滚动、拖拽、窗口 resize 等高频事件。实现时要保留调用时的 this 和参数，并在 task 非函数时抛出错误。",
    "approachText": "用 lastTime 记录上一次真实执行的时间戳；每次触发时先比较当前时间与 lastTime 的差值，只有达到 requireTime 才执行目标函数，并把最新时间写回 lastTime。",
    "paramsText": "task：需要被节流包装的目标函数，只有满足时间间隔时才会被执行。\nrequireTime：两次真实执行之间至少要间隔的毫秒数。",
    "returnText": "返回一个新的节流函数；高频调用时会按固定节奏执行 task，而不是每次都执行。",
    "template": "function throttle(task, requireTime) {\n\n}\n\nexport default throttle;",
    "solutionCode": "function throttle(task, requireTime) {\n  if (typeof task !== \"function\") {\n    throw new TypeError(\"throttle can only run with functions\");\n  }\n\n  let lastTime = null; // 使用 null 区分从未执行的状态\n\n  return function (...args) {\n    const now = Date.now();\n\n    // 第一次执行，或者距离上一次执行已过指定时间\n    if (lastTime === null || now - lastTime >= requireTime) {\n      task.apply(this, args);\n      lastTime = now;\n    }\n  };\n}\n\nexport default throttle;",
    "testCases": {
      "examples": [
        {
          "id": "example-1",
          "hidden": false,
          "input": {
            "target": "100",
            "steps": [
              {
                "type": "call",
                "args": []
              },
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 100
              }
            ]
          },
          "expected": {
            "callCount": 1
          }
        },
        {
          "id": "example-2",
          "hidden": false,
          "input": {
            "target": "100",
            "steps": [
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 100
              },
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 100
              },
              {
                "type": "call",
                "args": []
              }
            ]
          },
          "expected": {
            "callCount": 3
          }
        },
        {
          "id": "example-3",
          "hidden": false,
          "input": {
            "target": "50",
            "steps": [
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 25
              },
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 25
              },
              {
                "type": "call",
                "args": []
              }
            ]
          },
          "expected": {
            "callCount": 2
          }
        }
      ],
      "hidden": [
        {
          "id": "hidden-1",
          "hidden": true,
          "input": {
            "target": "100",
            "steps": [
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 50
              },
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 50
              },
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 50
              },
              {
                "type": "call",
                "args": []
              }
            ]
          },
          "expected": {
            "callCount": 3
          }
        },
        {
          "id": "hidden-2",
          "hidden": true,
          "input": {
            "target": "200",
            "steps": [
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 100
              },
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 100
              },
              {
                "type": "call",
                "args": []
              }
            ]
          },
          "expected": {
            "callCount": 2
          }
        },
        {
          "id": "hidden-3",
          "hidden": true,
          "input": {
            "target": "100",
            "steps": [
              {
                "type": "call",
                "args": []
              },
              {
                "type": "call",
                "args": []
              },
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 100
              },
              {
                "type": "call",
                "args": []
              }
            ]
          },
          "expected": {
            "callCount": 2
          }
        },
        {
          "id": "hidden-4",
          "hidden": true,
          "input": {
            "target": "50",
            "steps": [
              {
                "type": "call",
                "args": [
                  "1"
                ]
              },
              {
                "type": "tick",
                "ms": 50
              },
              {
                "type": "call",
                "args": [
                  "2"
                ]
              },
              {
                "type": "tick",
                "ms": 50
              },
              {
                "type": "call",
                "args": [
                  "3"
                ]
              }
            ]
          },
          "expected": {
            "callCount": 3
          }
        },
        {
          "id": "hidden-5",
          "hidden": true,
          "input": {
            "target": "100",
            "steps": [
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 300
              },
              {
                "type": "call",
                "args": []
              },
              {
                "type": "tick",
                "ms": 300
              },
              {
                "type": "call",
                "args": []
              }
            ]
          },
          "expected": {
            "callCount": 3
          }
        }
      ]
    },
    "basicCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[3 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[5 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[5 steps]",
        "expected": "[Circular]"
      }
    ],
    "fullCases": [
      {
        "id": "example-1",
        "type": "basic",
        "description": "示例 1",
        "input": "[3 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "example-2",
        "type": "basic",
        "description": "示例 2",
        "input": "[5 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "example-3",
        "type": "basic",
        "description": "示例 3",
        "input": "[5 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-1",
        "type": "edge",
        "description": "隐藏 1",
        "input": "[7 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-2",
        "type": "edge",
        "description": "隐藏 2",
        "input": "[5 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-3",
        "type": "edge",
        "description": "隐藏 3",
        "input": "[5 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-4",
        "type": "edge",
        "description": "隐藏 4",
        "input": "[5 steps]",
        "expected": "[Circular]"
      },
      {
        "id": "hidden-5",
        "type": "edge",
        "description": "隐藏 5",
        "input": "[5 steps]",
        "expected": "[Circular]"
      }
    ],
    "isComponent": false,
    "sourcePath": "problems/utility/throttle.js",
    "testPath": "problems/utility/throttle_test.js"
  },
  {
    "id": "cascader",
    "slug": "cascader",
    "sequence": 32,
    "title": "Cascader",
    "categoryId": "with_react",
    "categoryName": "React 组件",
    "sourceType": "jsx",
    "executionMode": "component",
    "launcherPath": "problems/with_react/launcher",
    "description": "三级联动选择器，支持省市区选择",
    "approachText": "先明确输入输出，再按稳定步骤展开实现。\n优先使用清晰变量名、显式分支和可读循环，避免技巧式缩写。",
    "paramsText": "请在函数签名中明确列出入参含义。",
    "returnText": "* {JSX.Element} 级联选择器",
    "template": "import { useState } from \"react\";\n\nconst areaData = [\n  {\n    id: 1,\n    name: \"辽宁省\",\n    children: [\n      {\n        id: 11,\n        name: \"沈阳市\",\n        children: [\n          { id: 111, name: \"和平区\" },\n          { id: 112, name: \"沈河区\" },\n          { id: 113, name: \"皇姑区\" },\n        ],\n      },\n      {\n        id: 12,\n        name: \"大连市\",\n        children: [\n          { id: 121, name: \"中山区\" },\n          { id: 122, name: \"西岗区\" },\n        ],\n      },\n    ],\n  },\n  {\n    id: 2,\n    name: \"山东省\",\n    children: [\n      {\n        id: 21,\n        name: \"济南市\",\n        children: [\n          { id: 211, name: \"历下区\" },\n          { id: 212, name: \"市中区\" },\n        ],\n      },\n    ],\n  },\n];\n\nconst LEVEL_COUNT = 3;\nexport default function Cascader() {\n  const [selected, setSelected] = useState([]);\n\n  const getOptionsByLevel = (level) => {\n    if (level === 0) return areaData;\n\n    if (level === 1) {\n      const pid = selected[0];\n      const province = areaData.find((item) => item.id === pid);\n      return province?.children || [];\n    }\n\n    if (level === 2) {\n      const pid = selected[0];\n      const cid = selected[1];\n      const province = areaData.find((item) => item.id === pid);\n      const city = province?.children?.find((item) => item.id === cid);\n      return city?.children || [];\n    }\n\n    return [];\n  };\n\n  const handleChange = (val, level) => {\n    const newSelected = [...selected];\n    newSelected[level] = val;\n\n    for (let i = level + 1; i < LEVEL_COUNT; i++) {\n      newSelected[i] = undefined;\n    }\n\n    setSelected(newSelected);\n  };\n\n  const getSelectedText = () => {\n    const names = [];\n    let list = areaData;\n    for (let i = 0; i < LEVEL_COUNT; i++) {\n      const id = selected[i];\n      const item = list.find((it) => it.id === id);\n      if (item) {\n        names.push(item.name);\n        list = item.children || [];\n      } else {\n        break;\n      }\n    }\n    return names.join(\" / \");\n  };\n\n  return (\n    <div style={{ padding: 20 }}>\n      <h3>级联选择器</h3>\n      <div style={{ display: \"flex\", gap: 10 }}>\n        {Array.from({ length: LEVEL_COUNT }).map((_, level) => (\n          <select\n            key={level}\n            value={selected[level] || \"\"}\n            onChange={(e) => handleChange(Number(e.target.value), level)}\n          >\n            <option value=\"\">请选择</option>\n            {getOptionsByLevel(level).map((item) => (\n              <option key={item.id} value={item.id}>\n                {item.name}\n              </option>\n            ))}\n          </select>\n        ))}\n      </div>\n      <p>已选择: {getSelectedText() || \"未选择\"}</p>\n    </div>\n  );\n}",
    "solutionCode": "import { useState } from \"react\";\n\nconst areaData = [\n  {\n    id: 1,\n    name: \"辽宁省\",\n    children: [\n      {\n        id: 11,\n        name: \"沈阳市\",\n        children: [\n          { id: 111, name: \"和平区\" },\n          { id: 112, name: \"沈河区\" },\n          { id: 113, name: \"皇姑区\" },\n        ],\n      },\n      {\n        id: 12,\n        name: \"大连市\",\n        children: [\n          { id: 121, name: \"中山区\" },\n          { id: 122, name: \"西岗区\" },\n        ],\n      },\n    ],\n  },\n  {\n    id: 2,\n    name: \"山东省\",\n    children: [\n      {\n        id: 21,\n        name: \"济南市\",\n        children: [\n          { id: 211, name: \"历下区\" },\n          { id: 212, name: \"市中区\" },\n        ],\n      },\n    ],\n  },\n];\n\nconst LEVEL_COUNT = 3;\nexport default function Cascader() {\n  const [selected, setSelected] = useState([]);\n\n  const getOptionsByLevel = (level) => {\n    if (level === 0) return areaData;\n\n    if (level === 1) {\n      const pid = selected[0];\n      const province = areaData.find((item) => item.id === pid);\n      return province?.children || [];\n    }\n\n    if (level === 2) {\n      const pid = selected[0];\n      const cid = selected[1];\n      const province = areaData.find((item) => item.id === pid);\n      const city = province?.children?.find((item) => item.id === cid);\n      return city?.children || [];\n    }\n\n    return [];\n  };\n\n  const handleChange = (val, level) => {\n    const newSelected = [...selected];\n    newSelected[level] = val;\n\n    for (let i = level + 1; i < LEVEL_COUNT; i++) {\n      newSelected[i] = undefined;\n    }\n\n    setSelected(newSelected);\n  };\n\n  const getSelectedText = () => {\n    const names = [];\n    let list = areaData;\n    for (let i = 0; i < LEVEL_COUNT; i++) {\n      const id = selected[i];\n      const item = list.find((it) => it.id === id);\n      if (item) {\n        names.push(item.name);\n        list = item.children || [];\n      } else {\n        break;\n      }\n    }\n    return names.join(\" / \");\n  };\n\n  return (\n    <div style={{ padding: 20 }}>\n      <h3>级联选择器</h3>\n      <div style={{ display: \"flex\", gap: 10 }}>\n        {Array.from({ length: LEVEL_COUNT }).map((_, level) => (\n          <select\n            key={level}\n            value={selected[level] || \"\"}\n            onChange={(e) => handleChange(Number(e.target.value), level)}\n          >\n            <option value=\"\">请选择</option>\n            {getOptionsByLevel(level).map((item) => (\n              <option key={item.id} value={item.id}>\n                {item.name}\n              </option>\n            ))}\n          </select>\n        ))}\n      </div>\n      <p>已选择: {getSelectedText() || \"未选择\"}</p>\n    </div>\n  );\n}",
    "testCases": {
      "examples": [],
      "hidden": []
    },
    "basicCases": [],
    "fullCases": [],
    "isComponent": true,
    "sourcePath": "problems/with_react/cascader.jsx",
    "testPath": "problems/with_react/cascader_test.js"
  },
  {
    "id": "countdown",
    "slug": "countdown",
    "sequence": 33,
    "title": "Countdown",
    "categoryId": "with_react",
    "categoryName": "React 组件",
    "sourceType": "jsx",
    "executionMode": "component",
    "launcherPath": "problems/with_react/launcher",
    "description": "使用 requestAnimationFrame 实现高精度倒计时",
    "approachText": "先明确输入输出，再按稳定步骤展开实现。\n优先使用清晰变量名、显式分支和可读循环，避免技巧式缩写。",
    "paramsText": "请在函数签名中明确列出入参含义。",
    "returnText": "* {JSX.Element} 倒计时组件",
    "template": "import { useEffect, useRef, useState } from \"react\";\n\nconst ONE_DAY = 24 * 60 * 60 * 1000;\nconst ONE_HOUR = 60 * 60 * 1000;\nconst ONE_MINUTE = 60 * 1000;\nconst ONE_SECOND = 1000;\nfunction CountDown({ totalSeconds = 60, onEnd, showMs = false }) {\n  const [timeLeft, setTimeLeft] = useState(totalSeconds * 1000);\n  const timer = useRef(null);\n  const lastTimestamp = useRef(null);\n\n  useEffect(() => {\n    if (timeLeft <= 0) {\n      onEnd?.();\n      cancelAnimationFrame(timer.current);\n      return;\n    }\n\n    const update = () => {\n      const now = performance.now();\n      if (!lastTimestamp.current) {\n        lastTimestamp.current = now;\n      }\n\n      setTimeLeft((timeLeft) =>\n        Math.max(0, timeLeft - (now - lastTimestamp.current)),\n      );\n      lastTimestamp.current = now;\n\n      timer.current = requestAnimationFrame(update);\n    };\n\n    timer.current = requestAnimationFrame(update);\n\n    return () => {\n      cancelAnimationFrame(timer.current);\n    };\n  }, [timeLeft, onEnd]);\n\n  const format = (ms) => {\n    const days = Math.floor(ms / ONE_DAY)\n      .toString()\n      .padStart(2, \"0\");\n    const hours = Math.floor((ms % ONE_DAY) / ONE_HOUR)\n      .toString()\n      .padStart(2, \"0\");\n    const minutes = Math.floor((ms % ONE_HOUR) / ONE_MINUTE)\n      .toString()\n      .padStart(2, \"0\");\n    const seconds = Math.floor((ms % ONE_MINUTE) / ONE_SECOND)\n      .toString()\n      .padStart(2, \"0\");\n    const milliseconds = Math.floor(ms % 1000)\n      .toString()\n      .padStart(3, \"0\");\n    return showMs\n      ? `${days} days, ${hours}:${minutes}:${seconds}:${milliseconds}`\n      : `${days} days, ${hours}:${minutes}:${seconds}`;\n  };\n\n  return <div>{format(timeLeft)}</div>;\n}\n\nexport default CountDown;",
    "solutionCode": "import { useEffect, useRef, useState } from \"react\";\n\nconst ONE_DAY = 24 * 60 * 60 * 1000;\nconst ONE_HOUR = 60 * 60 * 1000;\nconst ONE_MINUTE = 60 * 1000;\nconst ONE_SECOND = 1000;\nfunction CountDown({ totalSeconds = 60, onEnd, showMs = false }) {\n  const [timeLeft, setTimeLeft] = useState(totalSeconds * 1000);\n  const timer = useRef(null);\n  const lastTimestamp = useRef(null);\n\n  useEffect(() => {\n    if (timeLeft <= 0) {\n      onEnd?.();\n      cancelAnimationFrame(timer.current);\n      return;\n    }\n\n    const update = () => {\n      const now = performance.now();\n      if (!lastTimestamp.current) {\n        lastTimestamp.current = now;\n      }\n\n      setTimeLeft((timeLeft) =>\n        Math.max(0, timeLeft - (now - lastTimestamp.current)),\n      );\n      lastTimestamp.current = now;\n\n      timer.current = requestAnimationFrame(update);\n    };\n\n    timer.current = requestAnimationFrame(update);\n\n    return () => {\n      cancelAnimationFrame(timer.current);\n    };\n  }, [timeLeft, onEnd]);\n\n  const format = (ms) => {\n    const days = Math.floor(ms / ONE_DAY)\n      .toString()\n      .padStart(2, \"0\");\n    const hours = Math.floor((ms % ONE_DAY) / ONE_HOUR)\n      .toString()\n      .padStart(2, \"0\");\n    const minutes = Math.floor((ms % ONE_HOUR) / ONE_MINUTE)\n      .toString()\n      .padStart(2, \"0\");\n    const seconds = Math.floor((ms % ONE_MINUTE) / ONE_SECOND)\n      .toString()\n      .padStart(2, \"0\");\n    const milliseconds = Math.floor(ms % 1000)\n      .toString()\n      .padStart(3, \"0\");\n    return showMs\n      ? `${days} days, ${hours}:${minutes}:${seconds}:${milliseconds}`\n      : `${days} days, ${hours}:${minutes}:${seconds}`;\n  };\n\n  return <div>{format(timeLeft)}</div>;\n}\n\nexport default CountDown;",
    "testCases": {
      "examples": [],
      "hidden": []
    },
    "basicCases": [],
    "fullCases": [],
    "isComponent": true,
    "sourcePath": "problems/with_react/countdown.jsx",
    "testPath": "problems/with_react/countdown_test.js"
  },
  {
    "id": "cascader",
    "slug": "cascader",
    "sequence": 34,
    "title": "Cascader",
    "categoryId": "with_vue",
    "categoryName": "Vue 组件",
    "sourceType": "vue",
    "executionMode": "component",
    "launcherPath": "problems/with_vue/launcher",
    "description": "实现一个三级联动选择器，用户可以依次选择省、市、区。组件内置演示数据，在未选择上级时下级列表为空；切换省份时会清空城市和区县，切换城市时会清空区县。该题依赖本地\nVue launcher。 *",
    "approachText": "使用三个选中索引管理当前层级状态，再通过计算属性派生可选城市、可选区县和当前展示结果。每次上级选项变化时显式重置下级选择，避免遗留无效状态。",
    "paramsText": "本题为自渲染 Vue 单文件组件，不接收外部\nprops；内置数据仅用于演示级联联动逻辑。 *",
    "returnText": "返回一个可在本地 launcher\n中直接运行的 Vue 三级级联选择组件，界面会实时展示当前选中的省、市、区。",
    "template": "<script setup>\nimport { computed, ref } from \"vue\";\n\nconst area_data = [\n  {\n    name: \"广东省\",\n    cities: [\n      {\n        name: \"广州市\",\n        areas: [\"天河区\", \"越秀区\", \"海珠区\"],\n      },\n      {\n        name: \"深圳市\",\n        areas: [\"南山区\", \"福田区\", \"罗湖区\"],\n      },\n    ],\n  },\n  {\n    name: \"浙江省\",\n    cities: [\n      {\n        name: \"杭州市\",\n        areas: [\"西湖区\", \"上城区\", \"拱墅区\"],\n      },\n      {\n        name: \"宁波市\",\n        areas: [\"海曙区\", \"江北区\", \"鄞州区\"],\n      },\n    ],\n  },\n];\n\nconst EMPTY_VALUE = \"\";\n\nconst selected_province = ref(EMPTY_VALUE);\nconst selected_city = ref(EMPTY_VALUE);\nconst selected_area = ref(EMPTY_VALUE);\n\nfunction hasSelection(value) {\n  return value !== EMPTY_VALUE;\n}\n\nfunction toIndex(value) {\n  return Number(value);\n}\n\nconst city_options = computed(() => {\n  if (!hasSelection(selected_province.value)) {\n    return [];\n  }\n\n  return area_data[toIndex(selected_province.value)]?.cities ?? [];\n});\n\nconst area_options = computed(() => {\n  if (\n    !hasSelection(selected_province.value) ||\n    !hasSelection(selected_city.value)\n  ) {\n    return [];\n  }\n\n  const selected_city_item = city_options.value[toIndex(selected_city.value)];\n\n  return selected_city_item?.areas ?? [];\n});\n\nconst selected_result = computed(() => {\n  const result = {\n    province: \"\",\n    city: \"\",\n    area: \"\",\n  };\n\n  if (!hasSelection(selected_province.value)) {\n    return result;\n  }\n\n  const province_item = area_data[toIndex(selected_province.value)];\n  result.province = province_item?.name ?? \"\";\n\n  if (!hasSelection(selected_city.value)) {\n    return result;\n  }\n\n  const city_item = province_item?.cities[toIndex(selected_city.value)];\n  result.city = city_item?.name ?? \"\";\n\n  if (!hasSelection(selected_area.value)) {\n    return result;\n  }\n\n  result.area = city_item?.areas[toIndex(selected_area.value)] ?? \"\";\n\n  return result;\n});\n\nfunction onSelectProvince() {\n  selected_city.value = EMPTY_VALUE;\n  selected_area.value = EMPTY_VALUE;\n}\n\nfunction onSelectCity() {\n  selected_area.value = EMPTY_VALUE;\n}\n</script>\n\n<template>\n  <div class=\"cascader\">\n    <p class=\"result\">\n      当前选择：\n      {{ selected_result.province || \"未选择省份\" }}\n      <template v-if=\"selected_result.city\">\n        / {{ selected_result.city }}</template\n      >\n      <template v-if=\"selected_result.area\">\n        / {{ selected_result.area }}</template\n      >\n    </p>\n\n    <div class=\"selector_group\">\n      <select\n        v-model=\"selected_province\"\n        class=\"selector\"\n        @change=\"onSelectProvince\"\n      >\n        <option :value=\"EMPTY_VALUE\">请选择省份</option>\n        <option\n          v-for=\"(province, province_index) in area_data\"\n          :key=\"province.name\"\n          :value=\"String(province_index)\"\n        >\n          {{ province.name }}\n        </option>\n      </select>\n\n      <select v-model=\"selected_city\" class=\"selector\" @change=\"onSelectCity\">\n        <option :value=\"EMPTY_VALUE\">请选择城市</option>\n        <option\n          v-for=\"(city, city_index) in city_options\"\n          :key=\"city.name\"\n          :value=\"String(city_index)\"\n        >\n          {{ city.name }}\n        </option>\n      </select>\n\n      <select v-model=\"selected_area\" class=\"selector\">\n        <option :value=\"EMPTY_VALUE\">请选择区县</option>\n        <option\n          v-for=\"(area, area_index) in area_options\"\n          :key=\"area\"\n          :value=\"String(area_index)\"\n        >\n          {{ area }}\n        </option>\n      </select>\n    </div>\n  </div>\n</template>\n\n<style scoped>\n.cascader {\n  display: grid;\n  gap: 16px;\n  max-width: 560px;\n  padding: 24px;\n  border-radius: 16px;\n  background: linear-gradient(180deg, #f7fbff 0%, #eef5ff 100%);\n  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);\n}\n\n.result {\n  margin: 0;\n  color: #1f2937;\n  font-weight: 600;\n}\n\n.selector_group {\n  display: grid;\n  gap: 12px;\n}\n\n.selector {\n  min-height: 40px;\n  padding: 0 12px;\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  background: #ffffff;\n  color: #111827;\n}\n</style>",
    "solutionCode": "<script setup>\nimport { computed, ref } from \"vue\";\n\nconst area_data = [\n  {\n    name: \"广东省\",\n    cities: [\n      {\n        name: \"广州市\",\n        areas: [\"天河区\", \"越秀区\", \"海珠区\"],\n      },\n      {\n        name: \"深圳市\",\n        areas: [\"南山区\", \"福田区\", \"罗湖区\"],\n      },\n    ],\n  },\n  {\n    name: \"浙江省\",\n    cities: [\n      {\n        name: \"杭州市\",\n        areas: [\"西湖区\", \"上城区\", \"拱墅区\"],\n      },\n      {\n        name: \"宁波市\",\n        areas: [\"海曙区\", \"江北区\", \"鄞州区\"],\n      },\n    ],\n  },\n];\n\nconst EMPTY_VALUE = \"\";\n\nconst selected_province = ref(EMPTY_VALUE);\nconst selected_city = ref(EMPTY_VALUE);\nconst selected_area = ref(EMPTY_VALUE);\n\nfunction hasSelection(value) {\n  return value !== EMPTY_VALUE;\n}\n\nfunction toIndex(value) {\n  return Number(value);\n}\n\nconst city_options = computed(() => {\n  if (!hasSelection(selected_province.value)) {\n    return [];\n  }\n\n  return area_data[toIndex(selected_province.value)]?.cities ?? [];\n});\n\nconst area_options = computed(() => {\n  if (\n    !hasSelection(selected_province.value) ||\n    !hasSelection(selected_city.value)\n  ) {\n    return [];\n  }\n\n  const selected_city_item = city_options.value[toIndex(selected_city.value)];\n\n  return selected_city_item?.areas ?? [];\n});\n\nconst selected_result = computed(() => {\n  const result = {\n    province: \"\",\n    city: \"\",\n    area: \"\",\n  };\n\n  if (!hasSelection(selected_province.value)) {\n    return result;\n  }\n\n  const province_item = area_data[toIndex(selected_province.value)];\n  result.province = province_item?.name ?? \"\";\n\n  if (!hasSelection(selected_city.value)) {\n    return result;\n  }\n\n  const city_item = province_item?.cities[toIndex(selected_city.value)];\n  result.city = city_item?.name ?? \"\";\n\n  if (!hasSelection(selected_area.value)) {\n    return result;\n  }\n\n  result.area = city_item?.areas[toIndex(selected_area.value)] ?? \"\";\n\n  return result;\n});\n\nfunction onSelectProvince() {\n  selected_city.value = EMPTY_VALUE;\n  selected_area.value = EMPTY_VALUE;\n}\n\nfunction onSelectCity() {\n  selected_area.value = EMPTY_VALUE;\n}\n</script>\n\n<template>\n  <div class=\"cascader\">\n    <p class=\"result\">\n      当前选择：\n      {{ selected_result.province || \"未选择省份\" }}\n      <template v-if=\"selected_result.city\">\n        / {{ selected_result.city }}</template\n      >\n      <template v-if=\"selected_result.area\">\n        / {{ selected_result.area }}</template\n      >\n    </p>\n\n    <div class=\"selector_group\">\n      <select\n        v-model=\"selected_province\"\n        class=\"selector\"\n        @change=\"onSelectProvince\"\n      >\n        <option :value=\"EMPTY_VALUE\">请选择省份</option>\n        <option\n          v-for=\"(province, province_index) in area_data\"\n          :key=\"province.name\"\n          :value=\"String(province_index)\"\n        >\n          {{ province.name }}\n        </option>\n      </select>\n\n      <select v-model=\"selected_city\" class=\"selector\" @change=\"onSelectCity\">\n        <option :value=\"EMPTY_VALUE\">请选择城市</option>\n        <option\n          v-for=\"(city, city_index) in city_options\"\n          :key=\"city.name\"\n          :value=\"String(city_index)\"\n        >\n          {{ city.name }}\n        </option>\n      </select>\n\n      <select v-model=\"selected_area\" class=\"selector\">\n        <option :value=\"EMPTY_VALUE\">请选择区县</option>\n        <option\n          v-for=\"(area, area_index) in area_options\"\n          :key=\"area\"\n          :value=\"String(area_index)\"\n        >\n          {{ area }}\n        </option>\n      </select>\n    </div>\n  </div>\n</template>\n\n<style scoped>\n.cascader {\n  display: grid;\n  gap: 16px;\n  max-width: 560px;\n  padding: 24px;\n  border-radius: 16px;\n  background: linear-gradient(180deg, #f7fbff 0%, #eef5ff 100%);\n  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);\n}\n\n.result {\n  margin: 0;\n  color: #1f2937;\n  font-weight: 600;\n}\n\n.selector_group {\n  display: grid;\n  gap: 12px;\n}\n\n.selector {\n  min-height: 40px;\n  padding: 0 12px;\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  background: #ffffff;\n  color: #111827;\n}\n</style>",
    "testCases": {
      "examples": [],
      "hidden": []
    },
    "basicCases": [],
    "fullCases": [],
    "isComponent": true,
    "sourcePath": "problems/with_vue/cascader.vue",
    "testPath": "problems/with_vue/cascader_test.js"
  }
]
