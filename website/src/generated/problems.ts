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
    "template": "Array.prototype.myFilter = function (callback, thisArg) {\n  // 1. 检查 this 是否合法\n  if (this === null || this === undefined) {\n    throw new TypeError(\"Array.prototype.myFilter called on null or undefined\");\n  }\n\n  // 2. 检查回调必须是函数\n  if (typeof callback !== \"function\") {\n    throw new TypeError(callback + \" is not a function\");\n  }\n\n  // 3. 拿到数组 & 长度\n  const arr = this;\n  // 使用位运算符确保 length 是一个非负整数，同时为结果数组预分配空间\n  const len = arr.length >>> 0;\n  const result = [];\n\n  // 4. 遍历 + 过滤\n  for (let i = 0; i < len; i++) {\n    // 只处理真实存在的元素（跳过空元素）\n    if (i in arr) {\n      // 回调返回 true，就放进结果数组\n      if (callback(arr[i], i, arr)) {\n        result.push(arr[i]);\n      }\n    }\n  }\n\n  // 5. 返回新数组\n  return result;\n};",
    "solutionCode": "Array.prototype.myFilter = function (callback, thisArg) {\n  // 1. 检查 this 是否合法\n  if (this === null || this === undefined) {\n    throw new TypeError(\"Array.prototype.myFilter called on null or undefined\");\n  }\n\n  // 2. 检查回调必须是函数\n  if (typeof callback !== \"function\") {\n    throw new TypeError(callback + \" is not a function\");\n  }\n\n  // 3. 拿到数组 & 长度\n  const arr = this;\n  // 使用位运算符确保 length 是一个非负整数，同时为结果数组预分配空间\n  const len = arr.length >>> 0;\n  const result = [];\n\n  // 4. 遍历 + 过滤\n  for (let i = 0; i < len; i++) {\n    // 只处理真实存在的元素（跳过空元素）\n    if (i in arr) {\n      // 回调返回 true，就放进结果数组\n      if (callback(arr[i], i, arr)) {\n        result.push(arr[i]);\n      }\n    }\n  }\n\n  // 5. 返回新数组\n  return result;\n};",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "[1, 2, 3, 4].myFilter((value) => value % 2 === 0)",
        "expected": [
          2,
          4
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "[3, 4, 5].myFilter(function (value) { return value > this.limit }, { limit: 3 })",
        "expected": [
          4,
          5
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { const array = [1, , 3, 0]; return array.myFilter(Boolean) })()",
        "expected": [
          1,
          3
        ],
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "[1, 2, 3, 4].myFilter((value) => value % 2 === 0)",
        "expected": [
          2,
          4
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "[3, 4, 5].myFilter(function (value) { return value > this.limit }, { limit: 3 })",
        "expected": [
          4,
          5
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { const array = [1, , 3, 0]; return array.myFilter(Boolean) })()",
        "expected": [
          1,
          3
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "[].myFilter(() => true)",
        "expected": [],
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { try { [1].myFilter(null) } catch (error) { return error instanceof TypeError } })()",
        "expected": true,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/array/filter.js",
    "testPath": "docs/实践/array/filter_test.js"
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
    "template": "Array.prototype.myFlat = function (depth = 1) {\n  // 1. 检查 this 合法性\n  if (this == null) {\n    throw new TypeError(\"Cannot read property 'myFlat' of null or undefined\");\n  }\n\n  // 2. 把调用者转成对象（规范写法）\n  const arr = this;\n  const result = [];\n\n  // 3. 定义递归拍平函数\n  function flatDeep(array, currentDepth) {\n    for (const item of array) {\n      // 判断是否是数组 && 是否还能继续拍平\n      if (Array.isArray(item) && currentDepth < depth) {\n        flatDeep(item, currentDepth + 1); // 递归\n      } else {\n        result.push(item); // 不是数组直接放入结果\n      }\n    }\n  }\n\n  // 4. 开始递归拍平，默认深度从 0 开始\n  flatDeep(arr, 0);\n\n  return result;\n};",
    "solutionCode": "Array.prototype.myFlat = function (depth = 1) {\n  // 1. 检查 this 合法性\n  if (this == null) {\n    throw new TypeError(\"Cannot read property 'myFlat' of null or undefined\");\n  }\n\n  // 2. 把调用者转成对象（规范写法）\n  const arr = this;\n  const result = [];\n\n  // 3. 定义递归拍平函数\n  function flatDeep(array, currentDepth) {\n    for (const item of array) {\n      // 判断是否是数组 && 是否还能继续拍平\n      if (Array.isArray(item) && currentDepth < depth) {\n        flatDeep(item, currentDepth + 1); // 递归\n      } else {\n        result.push(item); // 不是数组直接放入结果\n      }\n    }\n  }\n\n  // 4. 开始递归拍平，默认深度从 0 开始\n  flatDeep(arr, 0);\n\n  return result;\n};",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "[1, [2, 3]].myFlat()",
        "expected": [
          1,
          2,
          3
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "[1, [2, [3, [4]]]].myFlat(2)",
        "expected": [
          1,
          2,
          3,
          [
            4
          ]
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "[1, [2, [3]]].myFlat(1)",
        "expected": [
          1,
          2,
          [
            3
          ]
        ],
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "[1, [2, 3]].myFlat()",
        "expected": [
          1,
          2,
          3
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "[1, [2, [3, [4]]]].myFlat(2)",
        "expected": [
          1,
          2,
          3,
          [
            4
          ]
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "[1, [2, [3]]].myFlat(1)",
        "expected": [
          1,
          2,
          [
            3
          ]
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "[1, [2]].myFlat(0)",
        "expected": [
          1,
          [
            2
          ]
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "[1, [2, [3, [4, [5]]]]].myFlat(Infinity)",
        "expected": [
          1,
          2,
          3,
          4,
          5
        ],
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/array/flat.js",
    "testPath": "docs/实践/array/flat_test.js"
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
    "template": "Array.prototype.myForEach = function (callback, thisArg) {\n  if (this == null) {\n    throw new TypeError(\n      \"Cannot read property 'myForEach' of null or undefined\",\n    );\n  }\n  if (typeof callback !== \"function\") {\n    throw new TypeError(callback + \" is not a function\");\n  }\n\n  // 将调用者转为对象，获取长度\n  const array = Object(this);\n  // 使用位运算符确保 length 是一个非负整数，同时为结果数组预分配空间\n  const len = array.length >>> 0;\n\n  for (let i = 0; i < len; i++) {\n    if (i in array) {\n      callback.call(thisArg, array[i], i, array);\n    }\n  }\n};",
    "solutionCode": "Array.prototype.myForEach = function (callback, thisArg) {\n  if (this == null) {\n    throw new TypeError(\n      \"Cannot read property 'myForEach' of null or undefined\",\n    );\n  }\n  if (typeof callback !== \"function\") {\n    throw new TypeError(callback + \" is not a function\");\n  }\n\n  // 将调用者转为对象，获取长度\n  const array = Object(this);\n  // 使用位运算符确保 length 是一个非负整数，同时为结果数组预分配空间\n  const len = array.length >>> 0;\n\n  for (let i = 0; i < len; i++) {\n    if (i in array) {\n      callback.call(thisArg, array[i], i, array);\n    }\n  }\n};",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { let sum = 0; [1, 2, 3].myForEach((value) => { sum += value }); return sum })()",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { const context = { base: 10 }; let total = 0; [1, 2].myForEach(function (value) { total += value + this.base }, context); return total })()",
        "expected": 23,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { let count = 0; const array = [1, , 3]; array.myForEach(() => { count += 1 }); return count })()",
        "expected": 2,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { let sum = 0; [1, 2, 3].myForEach((value) => { sum += value }); return sum })()",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { const context = { base: 10 }; let total = 0; [1, 2].myForEach(function (value) { total += value + this.base }, context); return total })()",
        "expected": 23,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { let count = 0; const array = [1, , 3]; array.myForEach(() => { count += 1 }); return count })()",
        "expected": 2,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(() => { let called = false; [].myForEach(() => { called = true }); return called })()",
        "expected": false,
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { try { [1].myForEach('nope') } catch (error) { return error instanceof TypeError } })()",
        "expected": true,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/array/forEach.js",
    "testPath": "docs/实践/array/forEach_test.js"
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
    "template": "Array.prototype.myMap = function (callback, thisArg) {\n  if (this == null) {\n    throw new TypeError(\"Cannot read property 'myMap' of null or undefined\");\n  }\n  if (typeof callback !== \"function\") {\n    throw new TypeError(callback + \" is not a function\");\n  }\n\n  // 将调用者转为对象，获取长度\n  const array = Object(this);\n  // 使用位运算符确保 length 是一个非负整数，同时为结果数组预分配空间\n  const len = array.length >>> 0;\n  const result = new Array(len);\n\n  for (let i = 0; i < len; i++) {\n    if (i in array) {\n      result[i] = callback.call(thisArg, array[i], i, array);\n    }\n  }\n\n  return result;\n};",
    "solutionCode": "Array.prototype.myMap = function (callback, thisArg) {\n  if (this == null) {\n    throw new TypeError(\"Cannot read property 'myMap' of null or undefined\");\n  }\n  if (typeof callback !== \"function\") {\n    throw new TypeError(callback + \" is not a function\");\n  }\n\n  // 将调用者转为对象，获取长度\n  const array = Object(this);\n  // 使用位运算符确保 length 是一个非负整数，同时为结果数组预分配空间\n  const len = array.length >>> 0;\n  const result = new Array(len);\n\n  for (let i = 0; i < len; i++) {\n    if (i in array) {\n      result[i] = callback.call(thisArg, array[i], i, array);\n    }\n  }\n\n  return result;\n};",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "[1, 2, 3].myMap((value) => value * 2)",
        "expected": [
          2,
          4,
          6
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "['a', 'b'].myMap(function (value) { return this.prefix + value }, { prefix: 'x-' })",
        "expected": [
          "x-a",
          "x-b"
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { const result = [1, , 3].myMap((value) => value * 2); return [result.length, 1 in result, 2 in result, result[0], result[2]] })()",
        "expected": [
          3,
          false,
          true,
          2,
          6
        ],
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "[1, 2, 3].myMap((value) => value * 2)",
        "expected": [
          2,
          4,
          6
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "['a', 'b'].myMap(function (value) { return this.prefix + value }, { prefix: 'x-' })",
        "expected": [
          "x-a",
          "x-b"
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { const result = [1, , 3].myMap((value) => value * 2); return [result.length, 1 in result, 2 in result, result[0], result[2]] })()",
        "expected": [
          3,
          false,
          true,
          2,
          6
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "[].myMap(() => 1)",
        "expected": [],
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { try { [1].myMap(null) } catch (error) { return error instanceof TypeError } })()",
        "expected": true,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/array/map.js",
    "testPath": "docs/实践/array/map_test.js"
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
    "template": "Array.prototype.myReduce = function (callback, initialValue) {\n  if (this == null) {\n    throw new TypeError(\"Cannot read property 'myReduce' of null or undefined\");\n  }\n  if (typeof callback !== \"function\") {\n    throw new TypeError(callback + \" is not a function\");\n  }\n\n  // 将调用者转为对象，获取长度\n  const array = Object(this);\n  // 使用位运算符确保 length 是一个非负整数，同时为结果数组预分配空间\n  const len = array.length >>> 0;\n  // accumulator 用于存储累加结果，k 是当前索引\n  let k = 0;\n  let accumulator;\n\n  // 处理初始值：如果没有提供 initialValue，使用数组中第一个存在的元素作为初始值\n  if (initialValue === undefined) {\n    let isValueSet = false;\n    // 找到第一个存在的元素作为初始值\n    for (; k < len; k++) {\n      if (k in array) {\n        accumulator = array[k];\n        isValueSet = true;\n        k++;\n        break;\n      }\n    }\n    if (!isValueSet) {\n      throw new TypeError(\"Reduce of empty array with no initial value\");\n    }\n  } else {\n    accumulator = initialValue;\n  }\n\n  for (; k < len; k++) {\n    if (k in array) {\n      accumulator = callback(accumulator, array[k], k, array);\n    }\n  }\n\n  return accumulator;\n};",
    "solutionCode": "Array.prototype.myReduce = function (callback, initialValue) {\n  if (this == null) {\n    throw new TypeError(\"Cannot read property 'myReduce' of null or undefined\");\n  }\n  if (typeof callback !== \"function\") {\n    throw new TypeError(callback + \" is not a function\");\n  }\n\n  // 将调用者转为对象，获取长度\n  const array = Object(this);\n  // 使用位运算符确保 length 是一个非负整数，同时为结果数组预分配空间\n  const len = array.length >>> 0;\n  // accumulator 用于存储累加结果，k 是当前索引\n  let k = 0;\n  let accumulator;\n\n  // 处理初始值：如果没有提供 initialValue，使用数组中第一个存在的元素作为初始值\n  if (initialValue === undefined) {\n    let isValueSet = false;\n    // 找到第一个存在的元素作为初始值\n    for (; k < len; k++) {\n      if (k in array) {\n        accumulator = array[k];\n        isValueSet = true;\n        k++;\n        break;\n      }\n    }\n    if (!isValueSet) {\n      throw new TypeError(\"Reduce of empty array with no initial value\");\n    }\n  } else {\n    accumulator = initialValue;\n  }\n\n  for (; k < len; k++) {\n    if (k in array) {\n      accumulator = callback(accumulator, array[k], k, array);\n    }\n  }\n\n  return accumulator;\n};",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "[1, 2, 3].myReduce((sum, value) => sum + value, 0)",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "[1, 2, 3].myReduce((sum, value) => sum + value)",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "[{ count: 1 }, { count: 2 }].myReduce((sum, item) => sum + item.count, 0)",
        "expected": 3,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "[1, 2, 3].myReduce((sum, value) => sum + value, 0)",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "[1, 2, 3].myReduce((sum, value) => sum + value)",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "[{ count: 1 }, { count: 2 }].myReduce((sum, item) => sum + item.count, 0)",
        "expected": 3,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(() => { const array = [, 1, 2]; return array.myReduce((sum, value) => sum + value, 0) })()",
        "expected": 3,
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { try { [].myReduce((sum, value) => sum + value) } catch (error) { return error instanceof TypeError } })()",
        "expected": true,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/array/reduce.js",
    "testPath": "docs/实践/array/reduce_test.js"
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
    "template": "Function.prototype.myApply = function (context, argsArray) {\n  // 1. 处理上下文：null/undefined 转为 globalThis，其他转为对象\n  context =\n    context === null || context === undefined ? globalThis : Object(context);\n\n  // 2. 处理参数数组：确保 argsArray 为数组或类数组，否则使用空数组\n  if (typeof argsArray !== \"object\" && typeof argsArray !== \"function\") {\n    throw new TypeError(\"CreateListFromArrayLike called on non-object\");\n  }\n  argsArray = Array.from(argsArray);\n\n  // 3. 临时绑定：将函数作为上下文的属性，使用 Symbol 避免命名冲突\n  const fnSymbol = Symbol(\"fn\");\n  context[fnSymbol] = this;\n\n  let result;\n  if (argsArray == null) {\n    result = context[fnSymbol]();\n  } else {\n    result = context[fnSymbol](...argsArray);\n  }\n\n  delete context[fnSymbol];\n  return result;\n};",
    "solutionCode": "Function.prototype.myApply = function (context, argsArray) {\n  // 1. 处理上下文：null/undefined 转为 globalThis，其他转为对象\n  context =\n    context === null || context === undefined ? globalThis : Object(context);\n\n  // 2. 处理参数数组：确保 argsArray 为数组或类数组，否则使用空数组\n  if (typeof argsArray !== \"object\" && typeof argsArray !== \"function\") {\n    throw new TypeError(\"CreateListFromArrayLike called on non-object\");\n  }\n  argsArray = Array.from(argsArray);\n\n  // 3. 临时绑定：将函数作为上下文的属性，使用 Symbol 避免命名冲突\n  const fnSymbol = Symbol(\"fn\");\n  context[fnSymbol] = this;\n\n  let result;\n  if (argsArray == null) {\n    result = context[fnSymbol]();\n  } else {\n    result = context[fnSymbol](...argsArray);\n  }\n\n  delete context[fnSymbol];\n  return result;\n};",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { function add(a, b) { return this.base + a + b } return add.myApply({ base: 1 }, [2, 3]) })()",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { globalThis.base = 4; function read(extra) { return this.base + extra } const result = read.myApply(null, [2]); delete globalThis.base; return result })()",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { function tag() { return Object.prototype.toString.call(this) } return tag.myApply('hi') })()",
        "expected": "[object String]",
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { function add(a, b) { return this.base + a + b } return add.myApply({ base: 1 }, [2, 3]) })()",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { globalThis.base = 4; function read(extra) { return this.base + extra } const result = read.myApply(null, [2]); delete globalThis.base; return result })()",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { function tag() { return Object.prototype.toString.call(this) } return tag.myApply('hi') })()",
        "expected": "[object String]",
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(() => { function join(a, b) { return [a, b].join('-') } return join.myApply({}, { 0: 'x', 1: 'y', length: 2 }) })()",
        "expected": "x-y",
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { try { Function.prototype.myApply.call({}, null, []) } catch (error) { return error instanceof TypeError } })()",
        "expected": true,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/function/apply.js",
    "testPath": "docs/实践/function/apply_test.js"
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
    "template": "Function.prototype.myBind = function (context, ...presetArgs) {\n  // 1. 调用者必须是函数\n  if (typeof this !== \"function\") {\n    throw new TypeError(\"Bind must be called on a function\");\n  }\n\n  const originalFn = this; // 保存原函数\n\n  // 2. 返回绑定函数\n  function boundFn(...args) {\n    return originalFn.call(\n      new.target === boundFn ? this : context, // 判断是不是 new 调用, new 的时候 this 指向实例，否则指向绑定的 context\n      ...presetArgs,\n      ...args,\n    );\n  }\n\n  // 3. 正确处理原型：用 Object.create 继承，不直接赋值\n  if (originalFn.prototype) {\n    boundFn.prototype = Object.create(originalFn.prototype);\n  }\n\n  return boundFn;\n};",
    "solutionCode": "Function.prototype.myBind = function (context, ...presetArgs) {\n  // 1. 调用者必须是函数\n  if (typeof this !== \"function\") {\n    throw new TypeError(\"Bind must be called on a function\");\n  }\n\n  const originalFn = this; // 保存原函数\n\n  // 2. 返回绑定函数\n  function boundFn(...args) {\n    return originalFn.call(\n      new.target === boundFn ? this : context, // 判断是不是 new 调用, new 的时候 this 指向实例，否则指向绑定的 context\n      ...presetArgs,\n      ...args,\n    );\n  }\n\n  // 3. 正确处理原型：用 Object.create 继承，不直接赋值\n  if (originalFn.prototype) {\n    boundFn.prototype = Object.create(originalFn.prototype);\n  }\n\n  return boundFn;\n};",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { function add(a, b) { return this.base + a + b } const bound = add.myBind({ base: 1 }, 2); return bound(3) })()",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { function Person(name) { this.name = name } Person.prototype.getName = function () { return this.name }; const BoundPerson = Person.myBind({ ignored: true }); const person = new BoundPerson('Tom'); return person.getName() })()",
        "expected": "Tom",
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { function multiply(a, b, c) { return a * b * c } const bound = multiply.myBind(null, 2, 3); return bound(4) })()",
        "expected": 24,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { function add(a, b) { return this.base + a + b } const bound = add.myBind({ base: 1 }, 2); return bound(3) })()",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { function Person(name) { this.name = name } Person.prototype.getName = function () { return this.name }; const BoundPerson = Person.myBind({ ignored: true }); const person = new BoundPerson('Tom'); return person.getName() })()",
        "expected": "Tom",
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { function multiply(a, b, c) { return a * b * c } const bound = multiply.myBind(null, 2, 3); return bound(4) })()",
        "expected": 24,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(() => { function read() { return Object.prototype.toString.call(this) } const bound = read.myBind('x'); return bound() })()",
        "expected": "[object String]",
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { try { Function.prototype.myBind.call({}, null) } catch (error) { return error instanceof TypeError } })()",
        "expected": true,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/function/bind.js",
    "testPath": "docs/实践/function/bind_test.js"
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
    "template": "Function.prototype.myCall = function (context, ...args) {\n  // 1. 调用者必须是函数\n  if (typeof this !== \"function\") {\n    throw new TypeError(\"Call must be called on a function\");\n  }\n\n  // 2. 处理上下文：null/undefined 转为 globalThis，其他转为对象\n  context =\n    context === null || context === undefined ? globalThis : Object(context);\n\n  // 3. 临时绑定：将函数作为上下文的属性，使用 Symbol 避免命名冲突\n  const fnSymbol = Symbol(\"fn\");\n  context[fnSymbol] = this;\n\n  // 4. 执行调用：展开参数列表调用函数\n  const result = context[fnSymbol](...args);\n\n  // 5. 清理恢复：删除临时属性，返回函数执行结果\n  delete context[fnSymbol];\n\n  return result;\n};",
    "solutionCode": "Function.prototype.myCall = function (context, ...args) {\n  // 1. 调用者必须是函数\n  if (typeof this !== \"function\") {\n    throw new TypeError(\"Call must be called on a function\");\n  }\n\n  // 2. 处理上下文：null/undefined 转为 globalThis，其他转为对象\n  context =\n    context === null || context === undefined ? globalThis : Object(context);\n\n  // 3. 临时绑定：将函数作为上下文的属性，使用 Symbol 避免命名冲突\n  const fnSymbol = Symbol(\"fn\");\n  context[fnSymbol] = this;\n\n  // 4. 执行调用：展开参数列表调用函数\n  const result = context[fnSymbol](...args);\n\n  // 5. 清理恢复：删除临时属性，返回函数执行结果\n  delete context[fnSymbol];\n\n  return result;\n};",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { function add(a, b) { return this.base + a + b } return add.myCall({ base: 1 }, 2, 3) })()",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { globalThis.base = 5; function read(extra) { return this.base + extra } const result = read.myCall(null, 2); delete globalThis.base; return result })()",
        "expected": 7,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { function tag() { return Object.prototype.toString.call(this) } return tag.myCall('hi') })()",
        "expected": "[object String]",
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { function add(a, b) { return this.base + a + b } return add.myCall({ base: 1 }, 2, 3) })()",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { globalThis.base = 5; function read(extra) { return this.base + extra } const result = read.myCall(null, 2); delete globalThis.base; return result })()",
        "expected": 7,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { function tag() { return Object.prototype.toString.call(this) } return tag.myCall('hi') })()",
        "expected": "[object String]",
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(() => { function getValue() { return this.value } return getValue.myCall({ value: 'ok' }) })()",
        "expected": "ok",
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { try { Function.prototype.myCall.call({}, null) } catch (error) { return error instanceof TypeError } })()",
        "expected": true,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/function/call.js",
    "testPath": "docs/实践/function/call_test.js"
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
    "template": "function detectCycle(head) {\n  if (!head || !head.next) return null;\n\n  let slow = head;\n  let fast = head;\n\n  while (fast !== null && fast.next !== null) {\n    slow = slow.next;\n    fast = fast.next.next;\n\n    if (slow === fast) {\n      let ptr1 = head;\n      let ptr2 = slow;\n\n      while (ptr1 !== ptr2) {\n        ptr1 = ptr1.next;\n        ptr2 = ptr2.next;\n      }\n\n      return ptr1;\n    }\n  }\n\n  return null;\n}",
    "solutionCode": "function detectCycle(head) {\n  if (!head || !head.next) return null;\n\n  let slow = head;\n  let fast = head;\n\n  while (fast !== null && fast.next !== null) {\n    slow = slow.next;\n    fast = fast.next.next;\n\n    if (slow === fast) {\n      let ptr1 = head;\n      let ptr2 = slow;\n\n      while (ptr1 !== ptr2) {\n        ptr1 = ptr1.next;\n        ptr2 = ptr2.next;\n      }\n\n      return ptr1;\n    }\n  }\n\n  return null;\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { const entry = { val: 2, next: { val: 3, next: null } }; const head = { val: 1, next: entry }; entry.next.next = entry; return detectCycle(head).val })()",
        "expected": 2,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { const node = { val: 1, next: null }; node.next = node; return detectCycle(node).val })()",
        "expected": 1,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "detectCycle(null)",
        "expected": null,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { const entry = { val: 2, next: { val: 3, next: null } }; const head = { val: 1, next: entry }; entry.next.next = entry; return detectCycle(head).val })()",
        "expected": 2,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { const node = { val: 1, next: null }; node.next = node; return detectCycle(node).val })()",
        "expected": 1,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "detectCycle(null)",
        "expected": null,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(() => { const head = { val: 1, next: { val: 2, next: null } }; return detectCycle(head) })()",
        "expected": null,
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { const nodes = Array.from({ length: 200 }, (_, index) => ({ val: index, next: null })); for (let index = 0; index < nodes.length - 1; index += 1) nodes[index].next = nodes[index + 1]; nodes[nodes.length - 1].next = nodes[120]; return detectCycle(nodes[0]).val })()",
        "expected": 120,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/linkedlist/findCycleEntry.js",
    "testPath": "docs/实践/linkedlist/findCycleEntry_test.js"
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
    "template": "function hasCycle(head) {\n  if (!head || !head.next) return false;\n\n  let slow = head;\n  let fast = head;\n\n  while (fast !== null && fast.next !== null) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n\n  return false;\n}",
    "solutionCode": "function hasCycle(head) {\n  if (!head || !head.next) return false;\n\n  let slow = head;\n  let fast = head;\n\n  while (fast !== null && fast.next !== null) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n\n  return false;\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { const node2 = { val: 2, next: null }; const head = { val: 1, next: node2 }; node2.next = head; return hasCycle(head) })()",
        "expected": true,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { const head = { val: 1, next: { val: 2, next: null } }; return hasCycle(head) })()",
        "expected": false,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "hasCycle(null)",
        "expected": false,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { const node2 = { val: 2, next: null }; const head = { val: 1, next: node2 }; node2.next = head; return hasCycle(head) })()",
        "expected": true,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { const head = { val: 1, next: { val: 2, next: null } }; return hasCycle(head) })()",
        "expected": false,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "hasCycle(null)",
        "expected": false,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(() => { const node = { val: 1, next: null }; node.next = node; return hasCycle(node) })()",
        "expected": true,
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { const nodes = Array.from({ length: 300 }, (_, index) => ({ val: index, next: null })); for (let index = 0; index < nodes.length - 1; index += 1) nodes[index].next = nodes[index + 1]; return hasCycle(nodes[0]) })()",
        "expected": false,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/linkedlist/hasCycle.js",
    "testPath": "docs/实践/linkedlist/hasCycle_test.js"
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
    "template": "function mergeTwoLists(list1, list2) {\n  const dummy = { val: 0, next: null };\n  let tail = dummy;\n\n  while (list1 !== null && list2 !== null) {\n    if (list1.val <= list2.val) {\n      tail.next = list1;\n      list1 = list1.next;\n    } else {\n      tail.next = list2;\n      list2 = list2.next;\n    }\n    tail = tail.next;\n  }\n\n  tail.next = list1 !== null ? list1 : list2;\n\n  return dummy.next;\n}\n\n/**\n * @description 使用递归方式合并两个升序链表。函数需要在每一层递归中比较两个头节点，把较小节点作为当前结果头节点，再把剩余部分继续递归合并。实现时同样要处理任意一条链表为空、两边长度不同，以及递归终止后直接返回剩余链表的情况。\n * @approach\n * 1. 递归出口是其中一条链表为空，此时直接返回另一条链表。\n * 2. 比较两个头节点的值，较小节点作为当前层返回结果的头节点。\n * 3. 较小节点的 next 指向“剩余节点继续合并”的递归结果。\n * @params\n * list1：第一条升序链表的头节点。\n * list2：第二条升序链表的头节点。\n * @return\n * 返回合并后的链表头节点。\n */\nfunction mergeTwoListsRecursive(list1, list2) {\n  if (!list1) {\n    return list2;\n  }\n\n  if (!list2) {\n    return list1;\n  }\n\n  if (list1.val <= list2.val) {\n    list1.next = mergeTwoListsRecursive(list1.next, list2);\n    return list1;\n  }\n\n  list2.next = mergeTwoListsRecursive(list1, list2.next);\n  return list2;\n}",
    "solutionCode": "function mergeTwoLists(list1, list2) {\n  const dummy = { val: 0, next: null };\n  let tail = dummy;\n\n  while (list1 !== null && list2 !== null) {\n    if (list1.val <= list2.val) {\n      tail.next = list1;\n      list1 = list1.next;\n    } else {\n      tail.next = list2;\n      list2 = list2.next;\n    }\n    tail = tail.next;\n  }\n\n  tail.next = list1 !== null ? list1 : list2;\n\n  return dummy.next;\n}\n\n/**\n * @description 使用递归方式合并两个升序链表。函数需要在每一层递归中比较两个头节点，把较小节点作为当前结果头节点，再把剩余部分继续递归合并。实现时同样要处理任意一条链表为空、两边长度不同，以及递归终止后直接返回剩余链表的情况。\n * @approach\n * 1. 递归出口是其中一条链表为空，此时直接返回另一条链表。\n * 2. 比较两个头节点的值，较小节点作为当前层返回结果的头节点。\n * 3. 较小节点的 next 指向“剩余节点继续合并”的递归结果。\n * @params\n * list1：第一条升序链表的头节点。\n * list2：第二条升序链表的头节点。\n * @return\n * 返回合并后的链表头节点。\n */\nfunction mergeTwoListsRecursive(list1, list2) {\n  if (!list1) {\n    return list2;\n  }\n\n  if (!list2) {\n    return list1;\n  }\n\n  if (list1.val <= list2.val) {\n    list1.next = mergeTwoListsRecursive(list1.next, list2);\n    return list1;\n  }\n\n  list2.next = mergeTwoListsRecursive(list1, list2.next);\n  return list2;\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { const l1 = { val: 1, next: { val: 3, next: null } }; const l2 = { val: 2, next: { val: 4, next: null } }; const head = mergeTwoLists(l1, l2); const values = []; let current = head; while (current) { values.push(current.val); current = current.next } return values })()",
        "expected": [
          1,
          2,
          3,
          4
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { const head = mergeTwoLists(null, { val: 1, next: null }); const values = []; let current = head; while (current) { values.push(current.val); current = current.next } return values })()",
        "expected": [
          1
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { const head = mergeTwoLists(null, null); return head })()",
        "expected": null,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { const l1 = { val: 1, next: { val: 3, next: null } }; const l2 = { val: 2, next: { val: 4, next: null } }; const head = mergeTwoLists(l1, l2); const values = []; let current = head; while (current) { values.push(current.val); current = current.next } return values })()",
        "expected": [
          1,
          2,
          3,
          4
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { const head = mergeTwoLists(null, { val: 1, next: null }); const values = []; let current = head; while (current) { values.push(current.val); current = current.next } return values })()",
        "expected": [
          1
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { const head = mergeTwoLists(null, null); return head })()",
        "expected": null,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(() => { const l1 = { val: 1, next: { val: 1, next: null } }; const l2 = { val: 1, next: { val: 2, next: null } }; const head = mergeTwoLists(l1, l2); const values = []; let current = head; while (current) { values.push(current.val); current = current.next } return values })()",
        "expected": [
          1,
          1,
          1,
          2
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { const build = (start) => { let dummy = { val: 0, next: null }; let tail = dummy; for (let index = start; index < 200; index += 2) { tail.next = { val: index, next: null }; tail = tail.next } return dummy.next }; const head = mergeTwoLists(build(0), build(1)); let current = head; let count = 0; while (current) { count += 1; current = current.next } return count })()",
        "expected": 200,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/linkedlist/mergeTwoLists.js",
    "testPath": "docs/实践/linkedlist/mergeTwoLists_test.js"
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
    "template": "function reverseList(head) {\n  let prev = null;\n  let current = head;\n\n  while (current !== null) {\n    const next = current.next;\n    current.next = prev;\n    prev = current;\n    current = next;\n  }\n\n  return prev;\n}\n\n/**\n * @description 使用递归方式反转单链表。函数需要先让更靠后的子链表完成反转，再在回溯阶段把当前节点接到已经反转好的链表尾部，最终返回新的头节点。实现时要处理空链表和单节点链表，并在回溯时断开旧的 next 指向，避免形成环。\n * @approach\n * 1. 递归出口是空节点或单节点，此时它本身就是反转后的头节点。\n * 2. 先递归反转 head.next 后面的链表，拿到新的头节点。\n * 3. 回溯时把当前节点挂到原下一个节点的后面，再断开当前节点旧的 next 指向。\n * @params\n * head：待反转链表的头节点。\n * @return\n * 返回反转后的链表头节点。\n */\nfunction reverseListRecursive(head) {\n  if (!head || !head.next) {\n    return head;\n  }\n\n  const newHead = reverseListRecursive(head.next);\n  head.next.next = head;\n  head.next = null;\n\n  return newHead;\n}",
    "solutionCode": "function reverseList(head) {\n  let prev = null;\n  let current = head;\n\n  while (current !== null) {\n    const next = current.next;\n    current.next = prev;\n    prev = current;\n    current = next;\n  }\n\n  return prev;\n}\n\n/**\n * @description 使用递归方式反转单链表。函数需要先让更靠后的子链表完成反转，再在回溯阶段把当前节点接到已经反转好的链表尾部，最终返回新的头节点。实现时要处理空链表和单节点链表，并在回溯时断开旧的 next 指向，避免形成环。\n * @approach\n * 1. 递归出口是空节点或单节点，此时它本身就是反转后的头节点。\n * 2. 先递归反转 head.next 后面的链表，拿到新的头节点。\n * 3. 回溯时把当前节点挂到原下一个节点的后面，再断开当前节点旧的 next 指向。\n * @params\n * head：待反转链表的头节点。\n * @return\n * 返回反转后的链表头节点。\n */\nfunction reverseListRecursive(head) {\n  if (!head || !head.next) {\n    return head;\n  }\n\n  const newHead = reverseListRecursive(head.next);\n  head.next.next = head;\n  head.next = null;\n\n  return newHead;\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { const head = { val: 1, next: { val: 2, next: { val: 3, next: null } } }; const reversed = reverseList(head); const values = []; let current = reversed; while (current) { values.push(current.val); current = current.next } return values })()",
        "expected": [
          3,
          2,
          1
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "reverseList(null)",
        "expected": null,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { const head = { val: 9, next: null }; return reverseList(head).val })()",
        "expected": 9,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { const head = { val: 1, next: { val: 2, next: { val: 3, next: null } } }; const reversed = reverseList(head); const values = []; let current = reversed; while (current) { values.push(current.val); current = current.next } return values })()",
        "expected": [
          3,
          2,
          1
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "reverseList(null)",
        "expected": null,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { const head = { val: 9, next: null }; return reverseList(head).val })()",
        "expected": 9,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(() => { const head = { val: 1, next: { val: 2, next: null } }; const reversed = reverseList(head); return reversed.next.val })()",
        "expected": 1,
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { let head = null; for (let index = 0; index < 200; index += 1) head = { val: index, next: head }; const reversed = reverseList(head); let current = reversed; let count = 0; while (current) { count += 1; current = current.next } return count })()",
        "expected": 200,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/linkedlist/reverseList.js",
    "testPath": "docs/实践/linkedlist/reverseList_test.js"
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
    "template": "function deepClone(obj, cache = new WeakMap()) {\n  // 1. 基础类型处理：null 或非对象直接返回\n  if (obj === null || typeof obj !== \"object\") return obj;\n\n  // 2. 特殊对象处理：Date 和 RegExp 使用构造函数创建新实例\n  if (obj instanceof Date) return new Date(obj.getTime());\n  // RegExp 对象的属性（如 lastIndex）也需要复制，直接使用构造函数创建新实例\n  if (obj instanceof RegExp) return new RegExp(obj);\n\n  // 3. 循环引用处理：使用 WeakMap 缓存已拷贝的对象\n  if (cache.has(obj)) return cache.get(obj);\n\n  // 4. 递归拷贝：遍历对象所有键（包括 Symbol），递归深拷贝每个值\n  const clone = Array.isArray(obj) ? [] : {};\n  cache.set(obj, clone);\n\n  // 使用 Reflect.ownKeys 获取对象的所有键（包括 Symbol），确保完整拷贝\n  Reflect.ownKeys(obj).forEach((key) => {\n    clone[key] = deepClone(obj[key], cache);\n  });\n\n  return clone;\n}",
    "solutionCode": "function deepClone(obj, cache = new WeakMap()) {\n  // 1. 基础类型处理：null 或非对象直接返回\n  if (obj === null || typeof obj !== \"object\") return obj;\n\n  // 2. 特殊对象处理：Date 和 RegExp 使用构造函数创建新实例\n  if (obj instanceof Date) return new Date(obj.getTime());\n  // RegExp 对象的属性（如 lastIndex）也需要复制，直接使用构造函数创建新实例\n  if (obj instanceof RegExp) return new RegExp(obj);\n\n  // 3. 循环引用处理：使用 WeakMap 缓存已拷贝的对象\n  if (cache.has(obj)) return cache.get(obj);\n\n  // 4. 递归拷贝：遍历对象所有键（包括 Symbol），递归深拷贝每个值\n  const clone = Array.isArray(obj) ? [] : {};\n  cache.set(obj, clone);\n\n  // 使用 Reflect.ownKeys 获取对象的所有键（包括 Symbol），确保完整拷贝\n  Reflect.ownKeys(obj).forEach((key) => {\n    clone[key] = deepClone(obj[key], cache);\n  });\n\n  return clone;\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { const source = { a: 1, nested: { b: 2 } }; const clone = deepCopy(source); clone.nested.b = 3; return source.nested.b })()",
        "expected": 2,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { const source = [1, { value: 2 }]; const clone = deepCopy(source); clone[1].value = 4; return source[1].value })()",
        "expected": 2,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { const source = { date: new Date(\"2024-01-01T00:00:00.000Z\") }; const clone = deepCopy({ date }); return clone.date instanceof Date })()",
        "expected": true,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { const source = { a: 1, nested: { b: 2 } }; const clone = deepCopy(source); clone.nested.b = 3; return source.nested.b })()",
        "expected": 2,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { const source = [1, { value: 2 }]; const clone = deepCopy(source); clone[1].value = 4; return source[1].value })()",
        "expected": 2,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { const source = { date: new Date(\"2024-01-01T00:00:00.000Z\") }; const clone = deepCopy({ date }); return clone.date instanceof Date })()",
        "expected": true,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(() => { const source = { a: 1 }; source.self = source; const clone = deepCopy(source); return clone !== source && clone.self === clone })()",
        "expected": true,
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { const source = { list: Array.from({ length: 200 }, (_, index) => ({ index })) }; const clone = deepCopy(source); clone.list[0].index = 999; return source.list[0].index })()",
        "expected": 0,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/object/deep_copy.js",
    "testPath": "docs/实践/object/deep_copy_test.js"
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
    "template": "function myInstanceof(obj, constructor) {\n  if (\n    obj == null ||\n    (typeof obj !== \"object\" && typeof obj !== \"function\") ||\n    typeof constructor !== \"function\"\n  ) {\n    return false;\n  }\n\n  let proto = Object.getPrototypeOf(obj);\n  const prototype = constructor.prototype;\n\n  while (proto !== null) {\n    if (proto === prototype) {\n      return true;\n    }\n    proto = Object.getPrototypeOf(proto);\n  }\n\n  return false;\n}",
    "solutionCode": "function myInstanceof(obj, constructor) {\n  if (\n    obj == null ||\n    (typeof obj !== \"object\" && typeof obj !== \"function\") ||\n    typeof constructor !== \"function\"\n  ) {\n    return false;\n  }\n\n  let proto = Object.getPrototypeOf(obj);\n  const prototype = constructor.prototype;\n\n  while (proto !== null) {\n    if (proto === prototype) {\n      return true;\n    }\n    proto = Object.getPrototypeOf(proto);\n  }\n\n  return false;\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { function Person() {} const person = new Person(); return myInstanceof(person, Person) })()",
        "expected": true,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { function Person() {} function Animal() {} const person = new Person(); return myInstanceof(person, Animal) })()",
        "expected": false,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "myInstanceof('text', String)",
        "expected": false,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { function Person() {} const person = new Person(); return myInstanceof(person, Person) })()",
        "expected": true,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { function Person() {} function Animal() {} const person = new Person(); return myInstanceof(person, Animal) })()",
        "expected": false,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "myInstanceof('text', String)",
        "expected": false,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "myInstanceof(function demo() {}, Function)",
        "expected": true,
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "myInstanceof({}, {})",
        "expected": false,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/object/instanceof.js",
    "testPath": "docs/实践/object/instanceof_test.js"
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
    "template": "function myNew(constructor, ...args) {\n  // 1. 输入校验：constructor 必须是函数\n  if (typeof constructor !== \"function\") {\n    throw new TypeError(\"Constructor must be a function\");\n  }\n\n  // 2. 创建空对象：使用 Object.create 创建以构造函数原型为原型的对象\n  const obj = Object.create(constructor.prototype);\n  // 3. 绑定 this：使用 apply 调用构造函数，将新对象作为 this\n  const result = constructor.apply(obj, args);\n\n  return result !== null &&\n    (typeof result === \"object\" || typeof result === \"function\")\n    ? result\n    : obj;\n}",
    "solutionCode": "function myNew(constructor, ...args) {\n  // 1. 输入校验：constructor 必须是函数\n  if (typeof constructor !== \"function\") {\n    throw new TypeError(\"Constructor must be a function\");\n  }\n\n  // 2. 创建空对象：使用 Object.create 创建以构造函数原型为原型的对象\n  const obj = Object.create(constructor.prototype);\n  // 3. 绑定 this：使用 apply 调用构造函数，将新对象作为 this\n  const result = constructor.apply(obj, args);\n\n  return result !== null &&\n    (typeof result === \"object\" || typeof result === \"function\")\n    ? result\n    : obj;\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { function Person(name) { this.name = name } Person.prototype.getName = function () { return this.name }; return myNew(Person, 'Tom').getName() })()",
        "expected": "Tom",
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { function Factory() { this.value = 1; return { value: 2 } } return myNew(Factory).value })()",
        "expected": 2,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { function Factory() { this.value = 3; return 4 } return myNew(Factory).value })()",
        "expected": 3,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { function Person(name) { this.name = name } Person.prototype.getName = function () { return this.name }; return myNew(Person, 'Tom').getName() })()",
        "expected": "Tom",
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { function Factory() { this.value = 1; return { value: 2 } } return myNew(Factory).value })()",
        "expected": 2,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { function Factory() { this.value = 3; return 4 } return myNew(Factory).value })()",
        "expected": 3,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(() => { try { myNew(null) } catch (error) { return error instanceof TypeError } })()",
        "expected": true,
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { function Sum(a, b) { this.total = a + b } return myNew(Sum, 3, 4).total })()",
        "expected": 7,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/object/new.js",
    "testPath": "docs/实践/object/new_test.js"
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
    "template": "class MyPromise {\n  /**\n   * @param {Function} executor - 执行器函数\n   */\n  constructor(executor) {\n    this.state = \"pending\";\n    this.value = undefined;\n    this.reason = undefined;\n    this.onFulfilledCallbacks = [];\n    this.onRejectedCallbacks = [];\n\n    const resolve = (value) => {\n      if (this.state === \"pending\") {\n        this.state = \"fulfilled\";\n        this.value = value;\n        this.onFulfilledCallbacks.forEach((fn) => fn());\n      }\n    };\n\n    const reject = (reason) => {\n      if (this.state === \"pending\") {\n        this.state = \"rejected\";\n        this.reason = reason;\n        this.onRejectedCallbacks.forEach((fn) => fn());\n      }\n    };\n\n    try {\n      executor(resolve, reject);\n    } catch (error) {\n      reject(error);\n    }\n  }\n\n  /**\n   * @param {Function} [onFulfilled] - 成功回调\n   * @param {Function} [onRejected] - 失败回调\n   * @returns {MyPromise} 新 Promise 支持链式调用\n   */\n  then(onFulfilled, onRejected) {\n    onFulfilled =\n      typeof onFulfilled === \"function\" ? onFulfilled : (value) => value;\n    onRejected =\n      typeof onRejected === \"function\"\n        ? onRejected\n        : (reason) => {\n            throw reason;\n          };\n\n    const promise2 = new MyPromise((resolve, reject) => {\n      if (this.state === \"fulfilled\") {\n        setTimeout(() => {\n          try {\n            const x = onFulfilled(this.value);\n            resolvePromise(promise2, x, resolve, reject);\n          } catch (error) {\n            reject(error);\n          }\n        }, 0);\n      }\n\n      if (this.state === \"rejected\") {\n        setTimeout(() => {\n          try {\n            const x = onRejected(this.reason);\n            resolvePromise(promise2, x, resolve, reject);\n          } catch (error) {\n            reject(error);\n          }\n        }, 0);\n      }\n\n      if (this.state === \"pending\") {\n        this.onFulfilledCallbacks.push(() => {\n          setTimeout(() => {\n            try {\n              const x = onFulfilled(this.value);\n              resolvePromise(promise2, x, resolve, reject);\n            } catch (error) {\n              reject(error);\n            }\n          }, 0);\n        });\n\n        this.onRejectedCallbacks.push(() => {\n          setTimeout(() => {\n            try {\n              const x = onRejected(this.reason);\n              resolvePromise(promise2, x, resolve, reject);\n            } catch (error) {\n              reject(error);\n            }\n          }, 0);\n        });\n      }\n    });\n\n    return promise2;\n  }\n\n  catch(onRejected) {\n    return this.then(null, onRejected);\n  }\n\n  finally(callback) {\n    return this.then(\n      (value) => MyPromise.resolve(callback()).then(() => value),\n      (reason) =>\n        MyPromise.resolve(callback()).then(() => {\n          throw reason;\n        }),\n    );\n  }\n\n  static resolve(value) {\n    return new MyPromise((resolve) => resolve(value));\n  }\n\n  static reject(reason) {\n    return new MyPromise((_, reject) => reject(reason));\n  }\n}\n\nfunction resolvePromise(promise2, x, resolve, reject) {\n  if (promise2 === x) {\n    reject(new TypeError(\"Chaining cycle detected for promise\"));\n    return;\n  }\n\n  let called = false;\n  if (x != null && (typeof x === \"object\" || typeof x === \"function\")) {\n    try {\n      const then = x.then;\n      if (typeof then === \"function\") {\n        then.call(\n          x,\n          (y) => {\n            if (called) return;\n            called = true;\n            resolvePromise(promise2, y, resolve, reject);\n          },\n          (r) => {\n            if (called) return;\n            called = true;\n            reject(r);\n          },\n        );\n      } else {\n        resolve(x);\n      }\n    } catch (error) {\n      if (called) return;\n      called = true;\n      reject(error);\n    }\n  } else {\n    resolve(x);\n  }\n}",
    "solutionCode": "class MyPromise {\n  /**\n   * @param {Function} executor - 执行器函数\n   */\n  constructor(executor) {\n    this.state = \"pending\";\n    this.value = undefined;\n    this.reason = undefined;\n    this.onFulfilledCallbacks = [];\n    this.onRejectedCallbacks = [];\n\n    const resolve = (value) => {\n      if (this.state === \"pending\") {\n        this.state = \"fulfilled\";\n        this.value = value;\n        this.onFulfilledCallbacks.forEach((fn) => fn());\n      }\n    };\n\n    const reject = (reason) => {\n      if (this.state === \"pending\") {\n        this.state = \"rejected\";\n        this.reason = reason;\n        this.onRejectedCallbacks.forEach((fn) => fn());\n      }\n    };\n\n    try {\n      executor(resolve, reject);\n    } catch (error) {\n      reject(error);\n    }\n  }\n\n  /**\n   * @param {Function} [onFulfilled] - 成功回调\n   * @param {Function} [onRejected] - 失败回调\n   * @returns {MyPromise} 新 Promise 支持链式调用\n   */\n  then(onFulfilled, onRejected) {\n    onFulfilled =\n      typeof onFulfilled === \"function\" ? onFulfilled : (value) => value;\n    onRejected =\n      typeof onRejected === \"function\"\n        ? onRejected\n        : (reason) => {\n            throw reason;\n          };\n\n    const promise2 = new MyPromise((resolve, reject) => {\n      if (this.state === \"fulfilled\") {\n        setTimeout(() => {\n          try {\n            const x = onFulfilled(this.value);\n            resolvePromise(promise2, x, resolve, reject);\n          } catch (error) {\n            reject(error);\n          }\n        }, 0);\n      }\n\n      if (this.state === \"rejected\") {\n        setTimeout(() => {\n          try {\n            const x = onRejected(this.reason);\n            resolvePromise(promise2, x, resolve, reject);\n          } catch (error) {\n            reject(error);\n          }\n        }, 0);\n      }\n\n      if (this.state === \"pending\") {\n        this.onFulfilledCallbacks.push(() => {\n          setTimeout(() => {\n            try {\n              const x = onFulfilled(this.value);\n              resolvePromise(promise2, x, resolve, reject);\n            } catch (error) {\n              reject(error);\n            }\n          }, 0);\n        });\n\n        this.onRejectedCallbacks.push(() => {\n          setTimeout(() => {\n            try {\n              const x = onRejected(this.reason);\n              resolvePromise(promise2, x, resolve, reject);\n            } catch (error) {\n              reject(error);\n            }\n          }, 0);\n        });\n      }\n    });\n\n    return promise2;\n  }\n\n  catch(onRejected) {\n    return this.then(null, onRejected);\n  }\n\n  finally(callback) {\n    return this.then(\n      (value) => MyPromise.resolve(callback()).then(() => value),\n      (reason) =>\n        MyPromise.resolve(callback()).then(() => {\n          throw reason;\n        }),\n    );\n  }\n\n  static resolve(value) {\n    return new MyPromise((resolve) => resolve(value));\n  }\n\n  static reject(reason) {\n    return new MyPromise((_, reject) => reject(reason));\n  }\n}\n\nfunction resolvePromise(promise2, x, resolve, reject) {\n  if (promise2 === x) {\n    reject(new TypeError(\"Chaining cycle detected for promise\"));\n    return;\n  }\n\n  let called = false;\n  if (x != null && (typeof x === \"object\" || typeof x === \"function\")) {\n    try {\n      const then = x.then;\n      if (typeof then === \"function\") {\n        then.call(\n          x,\n          (y) => {\n            if (called) return;\n            called = true;\n            resolvePromise(promise2, y, resolve, reject);\n          },\n          (r) => {\n            if (called) return;\n            called = true;\n            reject(r);\n          },\n        );\n      } else {\n        resolve(x);\n      }\n    } catch (error) {\n      if (called) return;\n      called = true;\n      reject(error);\n    }\n  } else {\n    resolve(x);\n  }\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(async () => { const result = await new MyPromise((resolve) => resolve(1)).then((value) => value + 1); return result })()",
        "expected": 2,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(async () => { const result = await new MyPromise((resolve) => setTimeout(() => resolve(\"ok\"), 10)); return result })()",
        "expected": "ok",
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(async () => { const result = await new MyPromise((resolve) => resolve(2)).then((value) => value * 3); return result })()",
        "expected": 6,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(async () => { const result = await new MyPromise((resolve) => resolve(1)).then((value) => value + 1); return result })()",
        "expected": 2,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(async () => { const result = await new MyPromise((resolve) => setTimeout(() => resolve(\"ok\"), 10)); return result })()",
        "expected": "ok",
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(async () => { const result = await new MyPromise((resolve) => resolve(2)).then((value) => value * 3); return result })()",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(async () => { try { await new MyPromise((resolve, reject) => reject(new Error(\"fail\"))) } catch (error) { return error.message } })()",
        "expected": "fail",
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(async () => { let current = new MyPromise((resolve) => resolve(0)); for (let index = 0; index < 20; index += 1) current = current.then((value) => value + 1); return current })()",
        "expected": 20,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/promise/promise.js",
    "testPath": "docs/实践/promise/promise_test.js"
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
    "template": "Promise.myAll = function (promises) {\n  return new Promise((resolve, reject) => {\n    const queue = Array.from(promises);\n    const length = queue.length;\n\n    if (length === 0) {\n      resolve([]);\n      return;\n    }\n\n    const results = new Array(length);\n    let completedCount = 0;\n    let isRejected = false;\n\n    queue.forEach((item, index) => {\n      Promise.resolve(item)\n        .then((value) => {\n          if (isRejected) return;\n          results[index] = value;\n          completedCount++;\n          if (completedCount === length) resolve(results);\n        })\n        .catch((reason) => {\n          if (isRejected) return;\n          isRejected = true;\n          reject(reason);\n        });\n    });\n  });\n};\nPromise.myAll;",
    "solutionCode": "Promise.myAll = function (promises) {\n  return new Promise((resolve, reject) => {\n    const queue = Array.from(promises);\n    const length = queue.length;\n\n    if (length === 0) {\n      resolve([]);\n      return;\n    }\n\n    const results = new Array(length);\n    let completedCount = 0;\n    let isRejected = false;\n\n    queue.forEach((item, index) => {\n      Promise.resolve(item)\n        .then((value) => {\n          if (isRejected) return;\n          results[index] = value;\n          completedCount++;\n          if (completedCount === length) resolve(results);\n        })\n        .catch((reason) => {\n          if (isRejected) return;\n          isRejected = true;\n          reject(reason);\n        });\n    });\n  });\n};\nPromise.myAll;",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(async () => Promise.myAll([Promise.resolve(1), Promise.resolve(2)]))()",
        "expected": [
          1,
          2
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(async () => Promise.myAll([1, Promise.resolve(2), 3]))()",
        "expected": [
          1,
          2,
          3
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(async () => Promise.myAll([]))()",
        "expected": [],
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(async () => Promise.myAll([Promise.resolve(1), Promise.resolve(2)]))()",
        "expected": [
          1,
          2
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(async () => Promise.myAll([1, Promise.resolve(2), 3]))()",
        "expected": [
          1,
          2,
          3
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(async () => Promise.myAll([]))()",
        "expected": [],
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(async () => { try { await Promise.myAll([Promise.resolve(1), Promise.reject(new Error('fail'))]) } catch (error) { return error.message } })()",
        "expected": "fail",
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(async () => Promise.myAll([new Promise((resolve) => setTimeout(() => resolve('slow'), 20)), Promise.resolve('fast')]))()",
        "expected": [
          "slow",
          "fast"
        ],
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/promise/promise_all.js",
    "testPath": "docs/实践/promise/promise_all_test.js"
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
    "template": "Promise.myRace = function (promises) {\n  return new Promise((resolve, reject) => {\n    const queue = Array.from(promises);\n\n    if (queue.length === 0) {\n      return;\n    }\n\n    let is_settled = false;\n\n    queue.forEach((item) => {\n      Promise.resolve(item)\n        .then((value) => {\n          if (is_settled) {\n            return;\n          }\n\n          is_settled = true;\n          resolve(value);\n        })\n        .catch((reason) => {\n          if (is_settled) {\n            return;\n          }\n\n          is_settled = true;\n          reject(reason);\n        });\n    });\n  });\n};",
    "solutionCode": "Promise.myRace = function (promises) {\n  return new Promise((resolve, reject) => {\n    const queue = Array.from(promises);\n\n    if (queue.length === 0) {\n      return;\n    }\n\n    let is_settled = false;\n\n    queue.forEach((item) => {\n      Promise.resolve(item)\n        .then((value) => {\n          if (is_settled) {\n            return;\n          }\n\n          is_settled = true;\n          resolve(value);\n        })\n        .catch((reason) => {\n          if (is_settled) {\n            return;\n          }\n\n          is_settled = true;\n          reject(reason);\n        });\n    });\n  });\n};",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(async () => Promise.myRace([new Promise((resolve) => setTimeout(() => resolve('slow'), 20)), Promise.resolve('fast')]))()",
        "expected": "fast",
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(async () => { try { await Promise.myRace([new Promise((_, reject) => setTimeout(() => reject(new Error('boom')), 10)), new Promise((resolve) => setTimeout(() => resolve('ok'), 20))]) } catch (error) { return error.message } })()",
        "expected": "boom",
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(async () => Promise.myRace([3, Promise.resolve(4)]))()",
        "expected": 3,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(async () => Promise.myRace([new Promise((resolve) => setTimeout(() => resolve('slow'), 20)), Promise.resolve('fast')]))()",
        "expected": "fast",
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(async () => { try { await Promise.myRace([new Promise((_, reject) => setTimeout(() => reject(new Error('boom')), 10)), new Promise((resolve) => setTimeout(() => resolve('ok'), 20))]) } catch (error) { return error.message } })()",
        "expected": "boom",
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(async () => Promise.myRace([3, Promise.resolve(4)]))()",
        "expected": 3,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(async () => { const pending = Promise.myRace([]); let settled = false; pending.then(() => { settled = true }, () => { settled = true }); await new Promise((resolve) => setTimeout(resolve, 20)); return settled })()",
        "expected": false,
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(async () => Promise.myRace([new Promise((resolve) => setTimeout(() => resolve('first'), 5)), new Promise((resolve) => setTimeout(() => resolve('second'), 15))]))()",
        "expected": "first",
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/promise/promise_race.js",
    "testPath": "docs/实践/promise/promise_race_test.js"
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
    "template": "function inorderTraversal(root) {\n  const result = [];\n\n  function traverse(node) {\n    if (!node) {\n      return;\n    }\n\n    traverse(node.left);\n    result.push(node.val);\n    traverse(node.right);\n  }\n\n  traverse(root);\n  return result;\n}\n\n/**\n * @description 使用显式栈实现二叉树中序遍历。目标仍然是按“左子树 -> 根节点 -> 右子树”的顺序返回节点值，但这一版不能依赖函数递归调用，而是要手动维护遍历路径。实现时要处理空树，并保证输出顺序与递归版本完全一致。\n * @approach\n * 1. 先一路向左，把沿途节点全部压栈。\n * 2. 弹出栈顶节点时，说明它的左子树已经处理完，可以记录当前值。\n * 3. 然后转向该节点的右子树，重复同样过程。\n * @params\n * root：二叉树根节点，空树时传入 null。\n * @return\n * 返回按中序遍历顺序组成的数组。\n */\nfunction inorderTraversalIterative(root) {\n  if (!root) {\n    return [];\n  }\n\n  const result = [];\n  const stack = [];\n  let current = root;\n\n  while (current || stack.length > 0) {\n    while (current) {\n      stack.push(current);\n      current = current.left;\n    }\n\n    current = stack.pop();\n    result.push(current.val);\n    current = current.right;\n  }\n\n  return result;\n}",
    "solutionCode": "function inorderTraversal(root) {\n  const result = [];\n\n  function traverse(node) {\n    if (!node) {\n      return;\n    }\n\n    traverse(node.left);\n    result.push(node.val);\n    traverse(node.right);\n  }\n\n  traverse(root);\n  return result;\n}\n\n/**\n * @description 使用显式栈实现二叉树中序遍历。目标仍然是按“左子树 -> 根节点 -> 右子树”的顺序返回节点值，但这一版不能依赖函数递归调用，而是要手动维护遍历路径。实现时要处理空树，并保证输出顺序与递归版本完全一致。\n * @approach\n * 1. 先一路向左，把沿途节点全部压栈。\n * 2. 弹出栈顶节点时，说明它的左子树已经处理完，可以记录当前值。\n * 3. 然后转向该节点的右子树，重复同样过程。\n * @params\n * root：二叉树根节点，空树时传入 null。\n * @return\n * 返回按中序遍历顺序组成的数组。\n */\nfunction inorderTraversalIterative(root) {\n  if (!root) {\n    return [];\n  }\n\n  const result = [];\n  const stack = [];\n  let current = root;\n\n  while (current || stack.length > 0) {\n    while (current) {\n      stack.push(current);\n      current = current.left;\n    }\n\n    current = stack.pop();\n    result.push(current.val);\n    current = current.right;\n  }\n\n  return result;\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "inorderTraversal({ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } })",
        "expected": [
          2,
          1,
          3
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "inorderTraversal(null)",
        "expected": [],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "inorderTraversal({ val: 9, left: null, right: null })",
        "expected": [
          9
        ],
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "inorderTraversal({ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } })",
        "expected": [
          2,
          1,
          3
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "inorderTraversal(null)",
        "expected": [],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "inorderTraversal({ val: 9, left: null, right: null })",
        "expected": [
          9
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "inorderTraversal({ val: 1, left: { val: 2, left: { val: 4, left: null, right: null }, right: null }, right: { val: 3, left: null, right: { val: 5, left: null, right: null } } })",
        "expected": [
          4,
          2,
          1,
          3,
          5
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { let root = { val: 0, left: null, right: null }; let current = root; for (let index = 1; index <= 80; index += 1) { current.right = { val: index, left: null, right: null }; current = current.right } return inorderTraversal(root).length })()",
        "expected": 81,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/tree/inorder.js",
    "testPath": "docs/实践/tree/inorder_test.js"
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
    "template": "function isValidBST(root) {\n  let prev = null;\n  let isValid = true;\n\n  function inorder(node) {\n    if (!node || !isValid) {\n      return;\n    }\n\n    inorder(node.left);\n\n    if (prev !== null && node.val <= prev) {\n      isValid = false;\n      return;\n    }\n    prev = node.val;\n\n    inorder(node.right);\n  }\n\n  inorder(root);\n  return isValid;\n}\n\n/**\n * @description 使用上下界递归约束验证一棵二叉树是否满足 BST 条件。函数需要在遍历过程中持续记录当前节点允许落入的最小值和最大值，只要某个节点越过了这个合法区间，就说明整棵树不是二叉搜索树。实现时要正确处理空树，以及非法节点可能出现在任意深层位置的情况。\n * @approach\n * 1. 递归时为每个节点携带最小值和最大值边界。\n * 2. 当前节点必须严格大于最小边界，且严格小于最大边界。\n * 3. 左子树继承上界为当前节点值，右子树继承下界为当前节点值。\n * @params\n * root：二叉树根节点，空树时传入 null。\n * @return\n * 如果是有效 BST 返回 true，否则返回 false。\n */\nfunction isValidBSTRecursive(root) {\n  function validate(node, min, max) {\n    if (!node) {\n      return true;\n    }\n\n    if (\n      (min !== null && node.val <= min) ||\n      (max !== null && node.val >= max)\n    ) {\n      return false;\n    }\n\n    return (\n      validate(node.left, min, node.val) && validate(node.right, node.val, max)\n    );\n  }\n\n  return validate(root, null, null);\n}",
    "solutionCode": "function isValidBST(root) {\n  let prev = null;\n  let isValid = true;\n\n  function inorder(node) {\n    if (!node || !isValid) {\n      return;\n    }\n\n    inorder(node.left);\n\n    if (prev !== null && node.val <= prev) {\n      isValid = false;\n      return;\n    }\n    prev = node.val;\n\n    inorder(node.right);\n  }\n\n  inorder(root);\n  return isValid;\n}\n\n/**\n * @description 使用上下界递归约束验证一棵二叉树是否满足 BST 条件。函数需要在遍历过程中持续记录当前节点允许落入的最小值和最大值，只要某个节点越过了这个合法区间，就说明整棵树不是二叉搜索树。实现时要正确处理空树，以及非法节点可能出现在任意深层位置的情况。\n * @approach\n * 1. 递归时为每个节点携带最小值和最大值边界。\n * 2. 当前节点必须严格大于最小边界，且严格小于最大边界。\n * 3. 左子树继承上界为当前节点值，右子树继承下界为当前节点值。\n * @params\n * root：二叉树根节点，空树时传入 null。\n * @return\n * 如果是有效 BST 返回 true，否则返回 false。\n */\nfunction isValidBSTRecursive(root) {\n  function validate(node, min, max) {\n    if (!node) {\n      return true;\n    }\n\n    if (\n      (min !== null && node.val <= min) ||\n      (max !== null && node.val >= max)\n    ) {\n      return false;\n    }\n\n    return (\n      validate(node.left, min, node.val) && validate(node.right, node.val, max)\n    );\n  }\n\n  return validate(root, null, null);\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "isValidBST({ val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } })",
        "expected": true,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "isValidBST({ val: 5, left: { val: 1, left: null, right: null }, right: { val: 4, left: { val: 3, left: null, right: null }, right: { val: 6, left: null, right: null } } })",
        "expected": false,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "isValidBST({ val: 10, left: { val: 5, left: null, right: { val: 12, left: null, right: null } }, right: { val: 15, left: null, right: null } })",
        "expected": false,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "isValidBST({ val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } })",
        "expected": true,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "isValidBST({ val: 5, left: { val: 1, left: null, right: null }, right: { val: 4, left: { val: 3, left: null, right: null }, right: { val: 6, left: null, right: null } } })",
        "expected": false,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "isValidBST({ val: 10, left: { val: 5, left: null, right: { val: 12, left: null, right: null } }, right: { val: 15, left: null, right: null } })",
        "expected": false,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "isValidBST({ val: 1, left: null, right: null })",
        "expected": true,
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "isValidBST(null)",
        "expected": true,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/tree/isValidBST.js",
    "testPath": "docs/实践/tree/isValidBST_test.js"
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
    "description": "使用广度优先搜索实现二叉树层序遍历。函数需要从根节点开始，按“从上到下、从左到右”的顺序逐层访问节点，并把每一层节点值收集成一个子数组，最终返回二维数组。实现时要处理空树、只有一层的树，以及不同层宽度不一致的情况。",
    "approachText": "使用队列维护当前待访问节点；每轮循环先记录当前层节点数，只消费这一层的节点并收集它们的值，同时把下一层的左右子节点按顺序加入队列，从而实现按层输出。",
    "paramsText": "root：二叉树根节点；如果为 null，表示输入是一棵空树。",
    "returnText": "返回一个二维数组，其中每个子数组表示一层的节点值，层与层之间保持从上到下的顺序。",
    "template": "function levelOrder(root) {\n  if (!root) return [];\n\n  const result = [];\n  const queue = [root];\n\n  while (queue.length > 0) {\n    const node = queue.shift();\n    result.push(node.val);\n    if (node.left) queue.push(node.left);\n    if (node.right) queue.push(node.right);\n  }\n\n  return result;\n}\n\n/**\n * 二叉树层序遍历（分层输出，二维数组）\n * @param {TreeNode} root - 二叉树根节点\n * @returns {Array} 每层节点作为子数组的二维数组\n */\nfunction levelOrderWithLevels(root) {\n  if (!root) return [];\n\n  const result = [];\n  let queue = [root];\n\n  while (queue.length > 0) {\n    const levelSize = queue.length;\n    const currentLevel = [];\n    const nextQueue = [];\n\n    for (let i = 0; i < levelSize; i++) {\n      const node = queue[i];\n      currentLevel.push(node.val);\n      if (node.left) nextQueue.push(node.left);\n      if (node.right) nextQueue.push(node.right);\n    }\n\n    result.push(currentLevel);\n    queue = nextQueue;\n  }\n\n  return result;\n}",
    "solutionCode": "function levelOrder(root) {\n  if (!root) return [];\n\n  const result = [];\n  const queue = [root];\n\n  while (queue.length > 0) {\n    const node = queue.shift();\n    result.push(node.val);\n    if (node.left) queue.push(node.left);\n    if (node.right) queue.push(node.right);\n  }\n\n  return result;\n}\n\n/**\n * 二叉树层序遍历（分层输出，二维数组）\n * @param {TreeNode} root - 二叉树根节点\n * @returns {Array} 每层节点作为子数组的二维数组\n */\nfunction levelOrderWithLevels(root) {\n  if (!root) return [];\n\n  const result = [];\n  let queue = [root];\n\n  while (queue.length > 0) {\n    const levelSize = queue.length;\n    const currentLevel = [];\n    const nextQueue = [];\n\n    for (let i = 0; i < levelSize; i++) {\n      const node = queue[i];\n      currentLevel.push(node.val);\n      if (node.left) nextQueue.push(node.left);\n      if (node.right) nextQueue.push(node.right);\n    }\n\n    result.push(currentLevel);\n    queue = nextQueue;\n  }\n\n  return result;\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "levelOrder({ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } })",
        "expected": [
          [
            1
          ],
          [
            2,
            3
          ]
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "levelOrder(null)",
        "expected": [],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "levelOrder({ val: 9, left: null, right: null })",
        "expected": [
          9
        ],
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "levelOrder({ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } })",
        "expected": [
          [
            1
          ],
          [
            2,
            3
          ]
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "levelOrder(null)",
        "expected": [],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "levelOrder({ val: 9, left: null, right: null })",
        "expected": [
          9
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "levelOrder({ val: 1, left: { val: 2, left: { val: 4, left: null, right: null }, right: null }, right: { val: 3, left: null, right: { val: 5, left: null, right: null } } })",
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
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { let root = { val: 0, left: null, right: null }; let current = root; for (let index = 1; index <= 80; index += 1) { current.right = { val: index, left: null, right: null }; current = current.right } return levelOrder(root).length })()",
        "expected": 81,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/tree/levelorder.js",
    "testPath": "docs/实践/tree/levelorder_test.js"
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
    "template": "function maxDepth(root) {\n  if (!root) {\n    return 0;\n  }\n\n  const leftDepth = maxDepth(root.left);\n  const rightDepth = maxDepth(root.right);\n\n  return Math.max(leftDepth, rightDepth) + 1;\n}\n\n/**\n * @description 使用层序遍历计算二叉树最大深度。函数需要按层从上到下遍历整棵树，每处理完一整层就把深度加一，直到所有节点都遍历完成。实现时要处理空树，并保证每一层的节点都只被统计一次。\n * @approach\n * 1. 队列中始终保存当前层的所有节点。\n * 2. 每轮循环先记录当前层节点数，确保只处理这一层。\n * 3. 本层处理结束后，把下一层节点收集起来，并把 depth 加一。\n * @params\n * root：二叉树根节点，空树时传入 null。\n * @return\n * 返回二叉树的最大深度。\n */\nfunction maxDepthBFS(root) {\n  if (!root) {\n    return 0;\n  }\n\n  let depth = 0;\n  let queue = [root];\n\n  while (queue.length > 0) {\n    depth++;\n    const levelSize = queue.length;\n    const nextQueue = [];\n\n    for (let i = 0; i < levelSize; i++) {\n      const node = queue[i];\n      if (node.left) {\n        nextQueue.push(node.left);\n      }\n      if (node.right) {\n        nextQueue.push(node.right);\n      }\n    }\n\n    queue = nextQueue;\n  }\n\n  return depth;\n}",
    "solutionCode": "function maxDepth(root) {\n  if (!root) {\n    return 0;\n  }\n\n  const leftDepth = maxDepth(root.left);\n  const rightDepth = maxDepth(root.right);\n\n  return Math.max(leftDepth, rightDepth) + 1;\n}\n\n/**\n * @description 使用层序遍历计算二叉树最大深度。函数需要按层从上到下遍历整棵树，每处理完一整层就把深度加一，直到所有节点都遍历完成。实现时要处理空树，并保证每一层的节点都只被统计一次。\n * @approach\n * 1. 队列中始终保存当前层的所有节点。\n * 2. 每轮循环先记录当前层节点数，确保只处理这一层。\n * 3. 本层处理结束后，把下一层节点收集起来，并把 depth 加一。\n * @params\n * root：二叉树根节点，空树时传入 null。\n * @return\n * 返回二叉树的最大深度。\n */\nfunction maxDepthBFS(root) {\n  if (!root) {\n    return 0;\n  }\n\n  let depth = 0;\n  let queue = [root];\n\n  while (queue.length > 0) {\n    depth++;\n    const levelSize = queue.length;\n    const nextQueue = [];\n\n    for (let i = 0; i < levelSize; i++) {\n      const node = queue[i];\n      if (node.left) {\n        nextQueue.push(node.left);\n      }\n      if (node.right) {\n        nextQueue.push(node.right);\n      }\n    }\n\n    queue = nextQueue;\n  }\n\n  return depth;\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "maxDepth(null)",
        "expected": 0,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "maxDepth({ val: 1, left: null, right: null })",
        "expected": 1,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "maxDepth({ val: 1, left: { val: 2, left: { val: 3, left: null, right: null }, right: null }, right: null })",
        "expected": 3,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "maxDepth(null)",
        "expected": 0,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "maxDepth({ val: 1, left: null, right: null })",
        "expected": 1,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "maxDepth({ val: 1, left: { val: 2, left: { val: 3, left: null, right: null }, right: null }, right: null })",
        "expected": 3,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "maxDepth({ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: { val: 4, left: null, right: null }, right: { val: 5, left: null, right: null } } })",
        "expected": 3,
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "maxDepthBFS({ val: 1, left: { val: 2, left: { val: 4, left: null, right: null }, right: null }, right: { val: 3, left: null, right: { val: 5, left: { val: 6, left: null, right: null }, right: null } } })",
        "expected": 4,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/tree/maxDepth.js",
    "testPath": "docs/实践/tree/maxDepth_test.js"
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
    "template": "function postorderTraversal(root) {\n  const result = [];\n\n  function traverse(node) {\n    if (!node) {\n      return;\n    }\n\n    traverse(node.left);\n    traverse(node.right);\n    result.push(node.val);\n  }\n\n  traverse(root);\n  return result;\n}\n\n/**\n * @description 使用迭代方式实现二叉树后序遍历。它通过先生成“根 -> 右 -> 左”的访问序列，再整体反转结果，得到真正的“左 -> 右 -> 根”顺序。实现时要处理空树，并确保手动栈版本的输出与递归版保持一致。\n * @approach\n * 1. 先按“根 -> 左 -> 右”的镜像顺序把节点值压入结果数组。\n * 2. 为了得到这个镜像顺序，栈中要先压左子节点，再压右子节点。\n * 3. 最终把结果数组整体反转，就能得到标准后序遍历顺序。\n * @params\n * root：二叉树根节点，空树时传入 null。\n * @return\n * 返回按后序遍历顺序组成的数组。\n */\nfunction postorderTraversalIterative(root) {\n  if (!root) {\n    return [];\n  }\n\n  const result = [];\n  const stack = [root];\n\n  while (stack.length > 0) {\n    const node = stack.pop();\n    result.push(node.val);\n    if (node.left) {\n      stack.push(node.left);\n    }\n    if (node.right) {\n      stack.push(node.right);\n    }\n  }\n\n  return result.reverse();\n}",
    "solutionCode": "function postorderTraversal(root) {\n  const result = [];\n\n  function traverse(node) {\n    if (!node) {\n      return;\n    }\n\n    traverse(node.left);\n    traverse(node.right);\n    result.push(node.val);\n  }\n\n  traverse(root);\n  return result;\n}\n\n/**\n * @description 使用迭代方式实现二叉树后序遍历。它通过先生成“根 -> 右 -> 左”的访问序列，再整体反转结果，得到真正的“左 -> 右 -> 根”顺序。实现时要处理空树，并确保手动栈版本的输出与递归版保持一致。\n * @approach\n * 1. 先按“根 -> 左 -> 右”的镜像顺序把节点值压入结果数组。\n * 2. 为了得到这个镜像顺序，栈中要先压左子节点，再压右子节点。\n * 3. 最终把结果数组整体反转，就能得到标准后序遍历顺序。\n * @params\n * root：二叉树根节点，空树时传入 null。\n * @return\n * 返回按后序遍历顺序组成的数组。\n */\nfunction postorderTraversalIterative(root) {\n  if (!root) {\n    return [];\n  }\n\n  const result = [];\n  const stack = [root];\n\n  while (stack.length > 0) {\n    const node = stack.pop();\n    result.push(node.val);\n    if (node.left) {\n      stack.push(node.left);\n    }\n    if (node.right) {\n      stack.push(node.right);\n    }\n  }\n\n  return result.reverse();\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "postorderTraversal({ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } })",
        "expected": [
          2,
          3,
          1
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "postorderTraversal(null)",
        "expected": [],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "postorderTraversal({ val: 9, left: null, right: null })",
        "expected": [
          9
        ],
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "postorderTraversal({ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } })",
        "expected": [
          2,
          3,
          1
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "postorderTraversal(null)",
        "expected": [],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "postorderTraversal({ val: 9, left: null, right: null })",
        "expected": [
          9
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "postorderTraversal({ val: 1, left: { val: 2, left: { val: 4, left: null, right: null }, right: null }, right: { val: 3, left: null, right: { val: 5, left: null, right: null } } })",
        "expected": [
          4,
          2,
          5,
          3,
          1
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { let root = { val: 0, left: null, right: null }; let current = root; for (let index = 1; index <= 80; index += 1) { current.right = { val: index, left: null, right: null }; current = current.right } return postorderTraversal(root).length })()",
        "expected": 81,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/tree/postorder.js",
    "testPath": "docs/实践/tree/postorder_test.js"
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
    "template": "function preorderTraversal(root) {\n  const result = [];\n\n  function traverse(node) {\n    if (!node) {\n      return;\n    }\n\n    result.push(node.val);\n    traverse(node.left);\n    traverse(node.right);\n  }\n\n  traverse(root);\n  return result;\n}\n\n/**\n * @description 使用显式栈实现二叉树前序遍历。目标仍然是按“根节点 -> 左子树 -> 右子树”的顺序返回节点值，但通过手动维护栈来替代递归。实现时要处理空树，并通过正确的入栈顺序保证左子树先于右子树被访问。\n * @approach\n * 1. 栈先放入根节点，每轮弹出一个节点并记录其值。\n * 2. 因为栈是后进先出，所以需要先压入右子节点，再压入左子节点。\n * 3. 这样下一轮弹出时会先处理左子树，顺序与递归前序遍历一致。\n * @params\n * root：二叉树根节点，空树时传入 null。\n * @return\n * 返回按前序遍历顺序组成的数组。\n */\nfunction preorderTraversalIterative(root) {\n  if (!root) {\n    return [];\n  }\n\n  const result = [];\n  const stack = [root];\n\n  while (stack.length > 0) {\n    const node = stack.pop();\n    result.push(node.val);\n    if (node.right) {\n      stack.push(node.right);\n    }\n    if (node.left) {\n      stack.push(node.left);\n    }\n  }\n\n  return result;\n}",
    "solutionCode": "function preorderTraversal(root) {\n  const result = [];\n\n  function traverse(node) {\n    if (!node) {\n      return;\n    }\n\n    result.push(node.val);\n    traverse(node.left);\n    traverse(node.right);\n  }\n\n  traverse(root);\n  return result;\n}\n\n/**\n * @description 使用显式栈实现二叉树前序遍历。目标仍然是按“根节点 -> 左子树 -> 右子树”的顺序返回节点值，但通过手动维护栈来替代递归。实现时要处理空树，并通过正确的入栈顺序保证左子树先于右子树被访问。\n * @approach\n * 1. 栈先放入根节点，每轮弹出一个节点并记录其值。\n * 2. 因为栈是后进先出，所以需要先压入右子节点，再压入左子节点。\n * 3. 这样下一轮弹出时会先处理左子树，顺序与递归前序遍历一致。\n * @params\n * root：二叉树根节点，空树时传入 null。\n * @return\n * 返回按前序遍历顺序组成的数组。\n */\nfunction preorderTraversalIterative(root) {\n  if (!root) {\n    return [];\n  }\n\n  const result = [];\n  const stack = [root];\n\n  while (stack.length > 0) {\n    const node = stack.pop();\n    result.push(node.val);\n    if (node.right) {\n      stack.push(node.right);\n    }\n    if (node.left) {\n      stack.push(node.left);\n    }\n  }\n\n  return result;\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "preorderTraversal({ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } })",
        "expected": [
          1,
          2,
          3
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "preorderTraversal(null)",
        "expected": [],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "preorderTraversal({ val: 9, left: null, right: null })",
        "expected": [
          9
        ],
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "preorderTraversal({ val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } })",
        "expected": [
          1,
          2,
          3
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "preorderTraversal(null)",
        "expected": [],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "preorderTraversal({ val: 9, left: null, right: null })",
        "expected": [
          9
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "preorderTraversal({ val: 1, left: { val: 2, left: { val: 4, left: null, right: null }, right: null }, right: { val: 3, left: null, right: { val: 5, left: null, right: null } } })",
        "expected": [
          1,
          2,
          4,
          3,
          5
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { let root = { val: 0, left: null, right: null }; let current = root; for (let index = 1; index <= 80; index += 1) { current.right = { val: index, left: null, right: null }; current = current.right } return preorderTraversal(root).length })()",
        "expected": 81,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/tree/preorder.js",
    "testPath": "docs/实践/tree/preorder_test.js"
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
    "template": "function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n\n    return function (...nextArgs) {\n      const mergedArgs = args.concat(nextArgs);\n\n      return curried.apply(this, mergedArgs);\n    };\n  };\n}",
    "solutionCode": "function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n\n    return function (...nextArgs) {\n      const mergedArgs = args.concat(nextArgs);\n\n      return curried.apply(this, mergedArgs);\n    };\n  };\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "curry((a, b, c) => a + b + c)(1)(2)(3)",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "curry((a, b, c) => a + b + c)(1, 2)(3)",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "curry((a, b, c) => a + b + c)(1)(2, 3)",
        "expected": 6,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "curry((a, b, c) => a + b + c)(1)(2)(3)",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "curry((a, b, c) => a + b + c)(1, 2)(3)",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "curry((a, b, c) => a + b + c)(1)(2, 3)",
        "expected": 6,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "curry((a, b, c) => a * b * c)(2)(3)(4)",
        "expected": 24,
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "curry((a, b) => a - b)(10, 3)",
        "expected": 7,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/utility/curry.js",
    "testPath": "docs/实践/utility/curry_test.js"
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
    "template": "function debounce(task, delay) {\n  if (typeof task !== \"function\") {\n    throw new TypeError(\"debounce can only run with functions\");\n  }\n\n  let timer = null;\n\n  return function (...args) {\n    if (timer !== null) {\n      clearTimeout(timer);\n    }\n\n    timer = setTimeout(() => {\n      task.apply(this, args);\n    }, delay);\n  };\n}\n\ndebounce;",
    "solutionCode": "function debounce(task, delay) {\n  if (typeof task !== \"function\") {\n    throw new TypeError(\"debounce can only run with functions\");\n  }\n\n  let timer = null;\n\n  return function (...args) {\n    if (timer !== null) {\n      clearTimeout(timer);\n    }\n\n    timer = setTimeout(() => {\n      task.apply(this, args);\n    }, delay);\n  };\n}\n\ndebounce;",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(async () => { let count = 0; const fn = debounce(() => { count += 1 }, 30); fn(); fn(); fn(); await new Promise((resolve) => setTimeout(resolve, 60)); return count })()",
        "expected": 1,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(async () => { let value = 0; const fn = debounce((next) => { value = next }, 20); fn(1); fn(2); await new Promise((resolve) => setTimeout(resolve, 50)); return value })()",
        "expected": 2,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(async () => { let count = 0; const fn = debounce(() => { count += 1 }, 10); fn(); await new Promise((resolve) => setTimeout(resolve, 20)); fn(); await new Promise((resolve) => setTimeout(resolve, 20)); return count })()",
        "expected": 2,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(async () => { let count = 0; const fn = debounce(() => { count += 1 }, 30); fn(); fn(); fn(); await new Promise((resolve) => setTimeout(resolve, 60)); return count })()",
        "expected": 1,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(async () => { let value = 0; const fn = debounce((next) => { value = next }, 20); fn(1); fn(2); await new Promise((resolve) => setTimeout(resolve, 50)); return value })()",
        "expected": 2,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(async () => { let count = 0; const fn = debounce(() => { count += 1 }, 10); fn(); await new Promise((resolve) => setTimeout(resolve, 20)); fn(); await new Promise((resolve) => setTimeout(resolve, 20)); return count })()",
        "expected": 2,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(async () => { let scopeValue = 0; const context = { set(value) { scopeValue = value } }; const fn = debounce(function(value) { this.set(value) }, 10).bind(context); fn(5); await new Promise((resolve) => setTimeout(resolve, 30)); return scopeValue })()",
        "expected": 5,
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(async () => { let count = 0; const fn = debounce(() => { count += 1 }, 5); for (let index = 0; index < 100; index += 1) fn(); await new Promise((resolve) => setTimeout(resolve, 20)); return count })()",
        "expected": 1,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/utility/debounce.js",
    "testPath": "docs/实践/utility/debounce_test.js"
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
    "template": "function deepClone(obj, cache = new WeakMap()) {\n  if (obj === null || typeof obj !== \"object\") return obj;\n\n  if (cache.has(obj)) return cache.get(obj);\n\n  if (obj instanceof Date) return new Date(obj.getTime());\n  if (obj instanceof RegExp) return new RegExp(obj);\n\n  if (obj instanceof Map) {\n    const clonedMap = new Map();\n    cache.set(obj, clonedMap);\n    obj.forEach((value, key) => {\n      clonedMap.set(deepClone(key, cache), deepClone(value, cache));\n    });\n    return clonedMap;\n  }\n\n  if (obj instanceof Set) {\n    const clonedSet = new Set();\n    cache.set(obj, clonedSet);\n    obj.forEach((value) => clonedSet.add(deepClone(value, cache)));\n    return clonedSet;\n  }\n\n  const clonedObj = Array.isArray(obj) ? [] : {};\n  cache.set(obj, clonedObj);\n\n  Reflect.ownKeys(obj).forEach((key) => {\n    clonedObj[key] = deepClone(obj[key], cache);\n  });\n\n  return clonedObj;\n}",
    "solutionCode": "function deepClone(obj, cache = new WeakMap()) {\n  if (obj === null || typeof obj !== \"object\") return obj;\n\n  if (cache.has(obj)) return cache.get(obj);\n\n  if (obj instanceof Date) return new Date(obj.getTime());\n  if (obj instanceof RegExp) return new RegExp(obj);\n\n  if (obj instanceof Map) {\n    const clonedMap = new Map();\n    cache.set(obj, clonedMap);\n    obj.forEach((value, key) => {\n      clonedMap.set(deepClone(key, cache), deepClone(value, cache));\n    });\n    return clonedMap;\n  }\n\n  if (obj instanceof Set) {\n    const clonedSet = new Set();\n    cache.set(obj, clonedSet);\n    obj.forEach((value) => clonedSet.add(deepClone(value, cache)));\n    return clonedSet;\n  }\n\n  const clonedObj = Array.isArray(obj) ? [] : {};\n  cache.set(obj, clonedObj);\n\n  Reflect.ownKeys(obj).forEach((key) => {\n    clonedObj[key] = deepClone(obj[key], cache);\n  });\n\n  return clonedObj;\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { const source = { nested: { value: 1 } }; const cloned = deepClone(source); cloned.nested.value = 2; return [source.nested.value, cloned.nested.value] })()",
        "expected": [
          1,
          2
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { const source = [1, [2, 3]]; const cloned = deepClone(source); cloned[1][0] = 9; return [source[1][0], cloned[1][0]] })()",
        "expected": [
          2,
          9
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { const source = { name: 'loop' }; source.self = source; const cloned = deepClone(source); return cloned !== source && cloned.self === cloned })()",
        "expected": true,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(() => { const source = { nested: { value: 1 } }; const cloned = deepClone(source); cloned.nested.value = 2; return [source.nested.value, cloned.nested.value] })()",
        "expected": [
          1,
          2
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(() => { const source = [1, [2, 3]]; const cloned = deepClone(source); cloned[1][0] = 9; return [source[1][0], cloned[1][0]] })()",
        "expected": [
          2,
          9
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { const source = { name: 'loop' }; source.self = source; const cloned = deepClone(source); return cloned !== source && cloned.self === cloned })()",
        "expected": true,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(() => { const source = new Map([[{ id: 1 }, new Set([1, 2])]]); const cloned = deepClone(source); const [[key, value]] = cloned.entries(); return [key.id, Array.from(value)] })()",
        "expected": [
          1,
          [
            1,
            2
          ]
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(() => { const source = { date: new Date('2024-01-01T00:00:00.000Z'), pattern: /abc/gi }; const cloned = deepClone(source); return [cloned.date instanceof Date, cloned.date.getTime() === source.date.getTime(), cloned.pattern.source, cloned.pattern.flags] })()",
        "expected": [
          true,
          true,
          "abc",
          "gi"
        ],
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/utility/deepClone.js",
    "testPath": "docs/实践/utility/deepClone_test.js"
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
    "template": "function flatten(arr, depth = Infinity) {\n  if (depth <= 0) {\n    return arr.slice();\n  }\n\n  const result = [];\n\n  for (const item of arr) {\n    if (Array.isArray(item) && depth > 0) {\n      result.push(...flatten(item, depth - 1));\n    } else {\n      result.push(item);\n    }\n  }\n\n  return result;\n}\n\n/**\n * @description 使用 reduce 改写数组扁平化逻辑。目标仍然是把嵌套数组在指定深度内展开成一个新数组，但这一版强调用累加器逐步汇总结果，而不是手动维护外部结果数组。它同样需要保留原顺序、支持 depth 控制，并且不能修改传入数组。\n * @approach\n * 1. 仍然沿用“深度减一”的递归规则，只是把遍历过程交给 reduce。\n * 2. 每轮都返回新的累加结果，写法更偏函数式。\n * 3. 子数组递归展开后用 concat 拼接，普通值直接追加到累加器末尾。\n * @params\n * arr：需要被扁平化的数组。\n * depth：允许展开的最大深度，默认展开到最深层。\n * @return\n * 返回扁平化后的新数组。\n */\nfunction flattenReduce(arr, depth = Infinity) {\n  if (depth <= 0) {\n    return arr.slice();\n  }\n\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item) && depth > 0) {\n      return acc.concat(flattenReduce(item, depth - 1));\n    }\n    return acc.concat(item);\n  }, []);\n}\n\n/**\n * @description 使用显式栈实现数组扁平化。它要完成与递归版相同的功能：把嵌套数组在指定深度内展开成新数组，但通过手动维护栈来避免层级过深时递归调用栈溢出。实现时需要额外记录当前元素所处深度，并保证最终输出顺序与原数组一致。\n * @approach\n * 1. 先把顶层元素连同当前深度一起压入栈中。\n * 2. 每次弹出一个元素处理；如果仍可展开，就把子数组从右向左压栈。\n * 3. 从右向左压栈是为了保证后续弹出时依然保持原始顺序。\n * @params\n * arr：需要被扁平化的数组。\n * depth：允许展开的最大深度，默认展开到最深层。\n * @return\n * 返回扁平化后的新数组。\n */\nfunction flattenIterative(arr, depth = Infinity) {\n  const result = [];\n  const stack = arr.map((item) => ({ item, currentDepth: 0 }));\n\n  while (stack.length > 0) {\n    const { item, currentDepth } = stack.pop();\n\n    if (Array.isArray(item) && currentDepth < depth) {\n      for (let i = item.length - 1; i >= 0; i--) {\n        stack.push({ item: item[i], currentDepth: currentDepth + 1 });\n      }\n    } else {\n      result.push(item);\n    }\n  }\n\n  return result;\n}",
    "solutionCode": "function flatten(arr, depth = Infinity) {\n  if (depth <= 0) {\n    return arr.slice();\n  }\n\n  const result = [];\n\n  for (const item of arr) {\n    if (Array.isArray(item) && depth > 0) {\n      result.push(...flatten(item, depth - 1));\n    } else {\n      result.push(item);\n    }\n  }\n\n  return result;\n}\n\n/**\n * @description 使用 reduce 改写数组扁平化逻辑。目标仍然是把嵌套数组在指定深度内展开成一个新数组，但这一版强调用累加器逐步汇总结果，而不是手动维护外部结果数组。它同样需要保留原顺序、支持 depth 控制，并且不能修改传入数组。\n * @approach\n * 1. 仍然沿用“深度减一”的递归规则，只是把遍历过程交给 reduce。\n * 2. 每轮都返回新的累加结果，写法更偏函数式。\n * 3. 子数组递归展开后用 concat 拼接，普通值直接追加到累加器末尾。\n * @params\n * arr：需要被扁平化的数组。\n * depth：允许展开的最大深度，默认展开到最深层。\n * @return\n * 返回扁平化后的新数组。\n */\nfunction flattenReduce(arr, depth = Infinity) {\n  if (depth <= 0) {\n    return arr.slice();\n  }\n\n  return arr.reduce((acc, item) => {\n    if (Array.isArray(item) && depth > 0) {\n      return acc.concat(flattenReduce(item, depth - 1));\n    }\n    return acc.concat(item);\n  }, []);\n}\n\n/**\n * @description 使用显式栈实现数组扁平化。它要完成与递归版相同的功能：把嵌套数组在指定深度内展开成新数组，但通过手动维护栈来避免层级过深时递归调用栈溢出。实现时需要额外记录当前元素所处深度，并保证最终输出顺序与原数组一致。\n * @approach\n * 1. 先把顶层元素连同当前深度一起压入栈中。\n * 2. 每次弹出一个元素处理；如果仍可展开，就把子数组从右向左压栈。\n * 3. 从右向左压栈是为了保证后续弹出时依然保持原始顺序。\n * @params\n * arr：需要被扁平化的数组。\n * depth：允许展开的最大深度，默认展开到最深层。\n * @return\n * 返回扁平化后的新数组。\n */\nfunction flattenIterative(arr, depth = Infinity) {\n  const result = [];\n  const stack = arr.map((item) => ({ item, currentDepth: 0 }));\n\n  while (stack.length > 0) {\n    const { item, currentDepth } = stack.pop();\n\n    if (Array.isArray(item) && currentDepth < depth) {\n      for (let i = item.length - 1; i >= 0; i--) {\n        stack.push({ item: item[i], currentDepth: currentDepth + 1 });\n      }\n    } else {\n      result.push(item);\n    }\n  }\n\n  return result;\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "flatten([1, [2, 3]])",
        "expected": [
          1,
          2,
          3
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "flatten([1, [2, [3, [4]]]], 2)",
        "expected": [
          1,
          2,
          3,
          [
            4
          ]
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { const source = [1, [2]]; const result = flatten(source, 0); return [JSON.stringify(result), result !== source] })()",
        "expected": [
          "[1,[2]]",
          true
        ],
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "flatten([1, [2, 3]])",
        "expected": [
          1,
          2,
          3
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "flatten([1, [2, [3, [4]]]], 2)",
        "expected": [
          1,
          2,
          3,
          [
            4
          ]
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(() => { const source = [1, [2]]; const result = flatten(source, 0); return [JSON.stringify(result), result !== source] })()",
        "expected": [
          "[1,[2]]",
          true
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "flatten([], Infinity)",
        "expected": [],
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "flatten([1, [2, [3, [4, [5]]]]], Infinity)",
        "expected": [
          1,
          2,
          3,
          4,
          5
        ],
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/utility/flatten.js",
    "testPath": "docs/实践/utility/flatten_test.js"
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
    "template": "class Scheduler {\n  constructor(limit) {\n    this.limit = limit;\n    this.count = 0;\n    this.queue = [];\n  }\n\n  /**\n   * @description 向调度器中加入一个异步任务；如果当前并发未满就立即执行，否则先排队等待。\n   * @approach 将任务函数和它对应的 resolve、reject 一起压入等待队列，然后统一交给 run 处理，这样每个任务都能在未来拿到自己的执行结果。\n   * @params\n   * task：一个无参函数，调用后必须返回 Promise，用来描述真正的异步工作。\n   * @return\n   * 返回一个 Promise；当对应任务执行成功时兑现结果，失败时拒绝错误。\n   */\n  add(task) {\n    return new Promise((resolve, reject) => {\n      this.queue.push({ task, resolve, reject });\n      this.run();\n    });\n  }\n\n  run() {\n    if (this.count >= this.limit || this.queue.length === 0) return;\n\n    this.count++;\n    const { task, resolve, reject } = this.queue.shift();\n\n    task()\n      .then(resolve)\n      .catch(reject)\n      .finally(() => {\n        this.count--;\n        this.run();\n      });\n  }\n}",
    "solutionCode": "class Scheduler {\n  constructor(limit) {\n    this.limit = limit;\n    this.count = 0;\n    this.queue = [];\n  }\n\n  /**\n   * @description 向调度器中加入一个异步任务；如果当前并发未满就立即执行，否则先排队等待。\n   * @approach 将任务函数和它对应的 resolve、reject 一起压入等待队列，然后统一交给 run 处理，这样每个任务都能在未来拿到自己的执行结果。\n   * @params\n   * task：一个无参函数，调用后必须返回 Promise，用来描述真正的异步工作。\n   * @return\n   * 返回一个 Promise；当对应任务执行成功时兑现结果，失败时拒绝错误。\n   */\n  add(task) {\n    return new Promise((resolve, reject) => {\n      this.queue.push({ task, resolve, reject });\n      this.run();\n    });\n  }\n\n  run() {\n    if (this.count >= this.limit || this.queue.length === 0) return;\n\n    this.count++;\n    const { task, resolve, reject } = this.queue.shift();\n\n    task()\n      .then(resolve)\n      .catch(reject)\n      .finally(() => {\n        this.count--;\n        this.run();\n      });\n  }\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(async () => { const scheduler = new Scheduler(2); const result = []; const createTask = (value, delay) => () => new Promise((resolve) => setTimeout(() => { result.push(value); resolve(value) }, delay)); await Promise.all([scheduler.add(createTask(\"A\", 20)), scheduler.add(createTask(\"B\", 10)), scheduler.add(createTask(\"C\", 5))]); return result.includes(\"A\") && result.includes(\"B\") && result.includes(\"C\") })()",
        "expected": true,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(async () => { const scheduler = new Scheduler(1); const timeline = []; const createTask = (label, delay) => () => new Promise((resolve) => setTimeout(() => { timeline.push(label); resolve(label) }, delay)); await Promise.all([scheduler.add(createTask(\"first\", 10)), scheduler.add(createTask(\"second\", 5))]); return timeline.join(\",\") })()",
        "expected": "first,second",
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(async () => { const scheduler = new Scheduler(2); const value = await scheduler.add(() => Promise.resolve(\"ok\")); return value })()",
        "expected": "ok",
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(async () => { const scheduler = new Scheduler(2); const result = []; const createTask = (value, delay) => () => new Promise((resolve) => setTimeout(() => { result.push(value); resolve(value) }, delay)); await Promise.all([scheduler.add(createTask(\"A\", 20)), scheduler.add(createTask(\"B\", 10)), scheduler.add(createTask(\"C\", 5))]); return result.includes(\"A\") && result.includes(\"B\") && result.includes(\"C\") })()",
        "expected": true,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(async () => { const scheduler = new Scheduler(1); const timeline = []; const createTask = (label, delay) => () => new Promise((resolve) => setTimeout(() => { timeline.push(label); resolve(label) }, delay)); await Promise.all([scheduler.add(createTask(\"first\", 10)), scheduler.add(createTask(\"second\", 5))]); return timeline.join(\",\") })()",
        "expected": "first,second",
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(async () => { const scheduler = new Scheduler(2); const value = await scheduler.add(() => Promise.resolve(\"ok\")); return value })()",
        "expected": "ok",
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(async () => { const scheduler = new Scheduler(2); try { await scheduler.add(() => Promise.reject(new Error(\"fail\"))) } catch (error) { return error.message } })()",
        "expected": "fail",
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(async () => { const scheduler = new Scheduler(5); const results = await Promise.all(Array.from({ length: 30 }, (_, index) => scheduler.add(() => Promise.resolve(index)))); return results.length })()",
        "expected": 30,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/utility/scheduler.js",
    "testPath": "docs/实践/utility/scheduler_test.js"
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
    "template": "async function execute(tasks, timeout, retries) {\n  if (!Array.isArray(tasks)) {\n    throw new TypeError(\"execute function can only execute array of tasks\");\n  }\n\n  for (let i = 0; i < tasks.length; i++) {\n    const task = tasks[i];\n    if (typeof task !== \"function\") {\n      throw new TypeError(`Task at index ${i} is not a function`);\n    }\n    await runTask(task, i, timeout, retries);\n  }\n}\n\n/**\n * 执行单个任务，支持超时和重试\n * @param {Function} task - 任务函数\n * @param {number} index - 任务索引\n * @param {number} timeout - 超时时间\n * @param {number} retries - 最大重试次数\n * @returns {Promise<*>}\n */\nfunction runTask(task, index, timeout, retries) {\n  let currentTries = 0;\n\n  return new Promise((resolve, reject) => {\n    const attempt = async () => {\n      currentTries++;\n\n      try {\n        const result = await Promise.race([\n          task(),\n          new Promise((_, rejectTimeout) => {\n            setTimeout(() => {\n              rejectTimeout(\n                new Error(`Task ${index} execute timeout after ${timeout}ms`),\n              );\n            }, timeout);\n          }),\n        ]);\n        resolve(result);\n      } catch (err) {\n        if (currentTries < retries) {\n          attempt();\n        } else {\n          reject(\n            new Error(\n              `Task ${index} failed after ${retries} retries: ${err.message}`,\n            ),\n          );\n        }\n      }\n    };\n\n    attempt();\n  });\n}",
    "solutionCode": "async function execute(tasks, timeout, retries) {\n  if (!Array.isArray(tasks)) {\n    throw new TypeError(\"execute function can only execute array of tasks\");\n  }\n\n  for (let i = 0; i < tasks.length; i++) {\n    const task = tasks[i];\n    if (typeof task !== \"function\") {\n      throw new TypeError(`Task at index ${i} is not a function`);\n    }\n    await runTask(task, i, timeout, retries);\n  }\n}\n\n/**\n * 执行单个任务，支持超时和重试\n * @param {Function} task - 任务函数\n * @param {number} index - 任务索引\n * @param {number} timeout - 超时时间\n * @param {number} retries - 最大重试次数\n * @returns {Promise<*>}\n */\nfunction runTask(task, index, timeout, retries) {\n  let currentTries = 0;\n\n  return new Promise((resolve, reject) => {\n    const attempt = async () => {\n      currentTries++;\n\n      try {\n        const result = await Promise.race([\n          task(),\n          new Promise((_, rejectTimeout) => {\n            setTimeout(() => {\n              rejectTimeout(\n                new Error(`Task ${index} execute timeout after ${timeout}ms`),\n              );\n            }, timeout);\n          }),\n        ]);\n        resolve(result);\n      } catch (err) {\n        if (currentTries < retries) {\n          attempt();\n        } else {\n          reject(\n            new Error(\n              `Task ${index} failed after ${retries} retries: ${err.message}`,\n            ),\n          );\n        }\n      }\n    };\n\n    attempt();\n  });\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(async () => { const result = []; await execute([() => Promise.resolve(result.push(1)), () => Promise.resolve(result.push(2))], 100, 1); return result })()",
        "expected": [
          1,
          2
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(async () => { const value = await runTask(() => Promise.resolve(\"ok\"), 0, 100, 1); return value })()",
        "expected": "ok",
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(async () => { let count = 0; const value = await runTask(() => { count += 1; return count < 2 ? Promise.reject(new Error(\"retry\")) : Promise.resolve(\"done\") }, 0, 100, 2); return value })()",
        "expected": "done",
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(async () => { const result = []; await execute([() => Promise.resolve(result.push(1)), () => Promise.resolve(result.push(2))], 100, 1); return result })()",
        "expected": [
          1,
          2
        ],
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(async () => { const value = await runTask(() => Promise.resolve(\"ok\"), 0, 100, 1); return value })()",
        "expected": "ok",
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(async () => { let count = 0; const value = await runTask(() => { count += 1; return count < 2 ? Promise.reject(new Error(\"retry\")) : Promise.resolve(\"done\") }, 0, 100, 2); return value })()",
        "expected": "done",
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(async () => { try { await execute([123], 100, 1) } catch (error) { return error instanceof TypeError } })()",
        "expected": true,
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(async () => { const tasks = Array.from({ length: 20 }, (_, index) => () => Promise.resolve(index)); await execute(tasks, 100, 1); return tasks.length })()",
        "expected": 20,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/utility/task_queue_runner.js",
    "testPath": "docs/实践/utility/task_queue_runner_test.js"
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
    "template": "function throttle(task, requireTime) {\n  if (typeof task !== \"function\") {\n    throw new TypeError(\"throttle can only run with functions\");\n  }\n\n  let lastTime = 0;\n\n  return function (...args) {\n    const now = Date.now();\n\n    if (now - lastTime >= requireTime) {\n      task.apply(this, args);\n      lastTime = now;\n    }\n  };\n}",
    "solutionCode": "function throttle(task, requireTime) {\n  if (typeof task !== \"function\") {\n    throw new TypeError(\"throttle can only run with functions\");\n  }\n\n  let lastTime = 0;\n\n  return function (...args) {\n    const now = Date.now();\n\n    if (now - lastTime >= requireTime) {\n      task.apply(this, args);\n      lastTime = now;\n    }\n  };\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(async () => { let count = 0; const fn = throttle(() => { count += 1 }, 30); fn(); fn(); fn(); await new Promise((resolve) => setTimeout(resolve, 40)); return count })()",
        "expected": 1,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(async () => { let count = 0; const fn = throttle(() => { count += 1 }, 20); fn(); await new Promise((resolve) => setTimeout(resolve, 30)); fn(); return count })()",
        "expected": 2,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(async () => { let value = 0; const fn = throttle((next) => { value = next }, 20); fn(1); fn(2); await new Promise((resolve) => setTimeout(resolve, 30)); return value })()",
        "expected": 1,
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "(async () => { let count = 0; const fn = throttle(() => { count += 1 }, 30); fn(); fn(); fn(); await new Promise((resolve) => setTimeout(resolve, 40)); return count })()",
        "expected": 1,
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "(async () => { let count = 0; const fn = throttle(() => { count += 1 }, 20); fn(); await new Promise((resolve) => setTimeout(resolve, 30)); fn(); return count })()",
        "expected": 2,
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "(async () => { let value = 0; const fn = throttle((next) => { value = next }, 20); fn(1); fn(2); await new Promise((resolve) => setTimeout(resolve, 30)); return value })()",
        "expected": 1,
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "(async () => { let count = 0; const context = { increase() { count += 1 } }; const fn = throttle(function() { this.increase() }.bind(context), 10); fn(); await new Promise((resolve) => setTimeout(resolve, 20)); return count })()",
        "expected": 1,
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "(async () => { let count = 0; const fn = throttle(() => { count += 1 }, 5); for (let index = 0; index < 50; index += 1) fn(); await new Promise((resolve) => setTimeout(resolve, 15)); return count })()",
        "expected": 1,
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/utility/throttle.js",
    "testPath": "docs/实践/utility/throttle_test.js"
  },
  {
    "id": "cascader",
    "slug": "cascader",
    "sequence": 32,
    "title": "Cascader",
    "categoryId": "with_react",
    "categoryName": "React 组件",
    "sourceType": "jsx",
    "executionMode": "local",
    "launcherPath": "docs/实践/with_react/launcher",
    "description": "三级联动选择器，支持省市区选择",
    "approachText": "先明确输入输出，再按稳定步骤展开实现。\n优先使用清晰变量名、显式分支和可读循环，避免技巧式缩写。",
    "paramsText": "请在函数签名中明确列出入参含义。",
    "returnText": "* {JSX.Element} 级联选择器",
    "template": "import { useState } from \"react\";\n\nconst areaData = [\n  {\n    id: 1,\n    name: \"辽宁省\",\n    children: [\n      {\n        id: 11,\n        name: \"沈阳市\",\n        children: [\n          { id: 111, name: \"和平区\" },\n          { id: 112, name: \"沈河区\" },\n          { id: 113, name: \"皇姑区\" },\n        ],\n      },\n      {\n        id: 12,\n        name: \"大连市\",\n        children: [\n          { id: 121, name: \"中山区\" },\n          { id: 122, name: \"西岗区\" },\n        ],\n      },\n    ],\n  },\n  {\n    id: 2,\n    name: \"山东省\",\n    children: [\n      {\n        id: 21,\n        name: \"济南市\",\n        children: [\n          { id: 211, name: \"历下区\" },\n          { id: 212, name: \"市中区\" },\n        ],\n      },\n    ],\n  },\n];\n\nconst LEVEL_COUNT = 3;\nexport default function Cascader() {\n  const [selected, setSelected] = useState([]);\n\n  const getOptionsByLevel = (level) => {\n    if (level === 0) return areaData;\n\n    if (level === 1) {\n      const pid = selected[0];\n      const province = areaData.find((item) => item.id === pid);\n      return province?.children || [];\n    }\n\n    if (level === 2) {\n      const pid = selected[0];\n      const cid = selected[1];\n      const province = areaData.find((item) => item.id === pid);\n      const city = province?.children?.find((item) => item.id === cid);\n      return city?.children || [];\n    }\n\n    return [];\n  };\n\n  const handleChange = (val, level) => {\n    const newSelected = [...selected];\n    newSelected[level] = val;\n\n    for (let i = level + 1; i < LEVEL_COUNT; i++) {\n      newSelected[i] = undefined;\n    }\n\n    setSelected(newSelected);\n  };\n\n  const getSelectedText = () => {\n    const names = [];\n    let list = areaData;\n    for (let i = 0; i < LEVEL_COUNT; i++) {\n      const id = selected[i];\n      const item = list.find((it) => it.id === id);\n      if (item) {\n        names.push(item.name);\n        list = item.children || [];\n      } else {\n        break;\n      }\n    }\n    return names.join(\" / \");\n  };\n\n  return (\n    <div style={{ padding: 20 }}>\n      <h3>级联选择器</h3>\n      <div style={{ display: \"flex\", gap: 10 }}>\n        {Array.from({ length: LEVEL_COUNT }).map((_, level) => (\n          <select\n            key={level}\n            value={selected[level] || \"\"}\n            onChange={(e) => handleChange(Number(e.target.value), level)}\n          >\n            <option value=\"\">请选择</option>\n            {getOptionsByLevel(level).map((item) => (\n              <option key={item.id} value={item.id}>\n                {item.name}\n              </option>\n            ))}\n          </select>\n        ))}\n      </div>\n      <p>已选择: {getSelectedText() || \"未选择\"}</p>\n    </div>\n  );\n}",
    "solutionCode": "import { useState } from \"react\";\n\nconst areaData = [\n  {\n    id: 1,\n    name: \"辽宁省\",\n    children: [\n      {\n        id: 11,\n        name: \"沈阳市\",\n        children: [\n          { id: 111, name: \"和平区\" },\n          { id: 112, name: \"沈河区\" },\n          { id: 113, name: \"皇姑区\" },\n        ],\n      },\n      {\n        id: 12,\n        name: \"大连市\",\n        children: [\n          { id: 121, name: \"中山区\" },\n          { id: 122, name: \"西岗区\" },\n        ],\n      },\n    ],\n  },\n  {\n    id: 2,\n    name: \"山东省\",\n    children: [\n      {\n        id: 21,\n        name: \"济南市\",\n        children: [\n          { id: 211, name: \"历下区\" },\n          { id: 212, name: \"市中区\" },\n        ],\n      },\n    ],\n  },\n];\n\nconst LEVEL_COUNT = 3;\nexport default function Cascader() {\n  const [selected, setSelected] = useState([]);\n\n  const getOptionsByLevel = (level) => {\n    if (level === 0) return areaData;\n\n    if (level === 1) {\n      const pid = selected[0];\n      const province = areaData.find((item) => item.id === pid);\n      return province?.children || [];\n    }\n\n    if (level === 2) {\n      const pid = selected[0];\n      const cid = selected[1];\n      const province = areaData.find((item) => item.id === pid);\n      const city = province?.children?.find((item) => item.id === cid);\n      return city?.children || [];\n    }\n\n    return [];\n  };\n\n  const handleChange = (val, level) => {\n    const newSelected = [...selected];\n    newSelected[level] = val;\n\n    for (let i = level + 1; i < LEVEL_COUNT; i++) {\n      newSelected[i] = undefined;\n    }\n\n    setSelected(newSelected);\n  };\n\n  const getSelectedText = () => {\n    const names = [];\n    let list = areaData;\n    for (let i = 0; i < LEVEL_COUNT; i++) {\n      const id = selected[i];\n      const item = list.find((it) => it.id === id);\n      if (item) {\n        names.push(item.name);\n        list = item.children || [];\n      } else {\n        break;\n      }\n    }\n    return names.join(\" / \");\n  };\n\n  return (\n    <div style={{ padding: 20 }}>\n      <h3>级联选择器</h3>\n      <div style={{ display: \"flex\", gap: 10 }}>\n        {Array.from({ length: LEVEL_COUNT }).map((_, level) => (\n          <select\n            key={level}\n            value={selected[level] || \"\"}\n            onChange={(e) => handleChange(Number(e.target.value), level)}\n          >\n            <option value=\"\">请选择</option>\n            {getOptionsByLevel(level).map((item) => (\n              <option key={item.id} value={item.id}>\n                {item.name}\n              </option>\n            ))}\n          </select>\n        ))}\n      </div>\n      <p>已选择: {getSelectedText() || \"未选择\"}</p>\n    </div>\n  );\n}",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "Render the component in the local launcher.",
        "expected": "The component should mount correctly.",
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "Trigger the main user interaction once.",
        "expected": "The main visible state should update once.",
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "Repeat the main interaction several times.",
        "expected": "The component should keep responding without stale state.",
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "Render the component in the local launcher.",
        "expected": "The component should mount correctly.",
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "Trigger the main user interaction once.",
        "expected": "The main visible state should update once.",
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "Repeat the main interaction several times.",
        "expected": "The component should keep responding without stale state.",
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "Use an empty or boundary input state in the launcher.",
        "expected": "The component should stay stable and render fallback UI.",
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "Keep the component mounted in a longer interactive session.",
        "expected": "The component should remain responsive.",
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/with_react/cascader.jsx",
    "testPath": "docs/实践/with_react/cascader_test.js"
  },
  {
    "id": "countdown",
    "slug": "countdown",
    "sequence": 33,
    "title": "Countdown",
    "categoryId": "with_react",
    "categoryName": "React 组件",
    "sourceType": "jsx",
    "executionMode": "local",
    "launcherPath": "docs/实践/with_react/launcher",
    "description": "使用 requestAnimationFrame 实现高精度倒计时",
    "approachText": "先明确输入输出，再按稳定步骤展开实现。\n优先使用清晰变量名、显式分支和可读循环，避免技巧式缩写。",
    "paramsText": "请在函数签名中明确列出入参含义。",
    "returnText": "* {JSX.Element} 倒计时组件",
    "template": "import { useEffect, useRef, useState } from \"react\";\n\nconst ONE_DAY = 24 * 60 * 60 * 1000;\nconst ONE_HOUR = 60 * 60 * 1000;\nconst ONE_MINUTE = 60 * 1000;\nconst ONE_SECOND = 1000;\nfunction CountDown({ totalSeconds = 60, onEnd, showMs = false }) {\n  const [timeLeft, setTimeLeft] = useState(totalSeconds * 1000);\n  const timer = useRef(null);\n  const lastTimestamp = useRef(null);\n\n  useEffect(() => {\n    if (timeLeft <= 0) {\n      onEnd?.();\n      cancelAnimationFrame(timer.current);\n      return;\n    }\n\n    const update = () => {\n      const now = performance.now();\n      if (!lastTimestamp.current) {\n        lastTimestamp.current = now;\n      }\n\n      setTimeLeft((timeLeft) =>\n        Math.max(0, timeLeft - (now - lastTimestamp.current)),\n      );\n      lastTimestamp.current = now;\n\n      timer.current = requestAnimationFrame(update);\n    };\n\n    timer.current = requestAnimationFrame(update);\n\n    return () => {\n      cancelAnimationFrame(timer.current);\n    };\n  }, [timeLeft, onEnd]);\n\n  const format = (ms) => {\n    const days = Math.floor(ms / ONE_DAY)\n      .toString()\n      .padStart(2, \"0\");\n    const hours = Math.floor((ms % ONE_DAY) / ONE_HOUR)\n      .toString()\n      .padStart(2, \"0\");\n    const minutes = Math.floor((ms % ONE_HOUR) / ONE_MINUTE)\n      .toString()\n      .padStart(2, \"0\");\n    const seconds = Math.floor((ms % ONE_MINUTE) / ONE_SECOND)\n      .toString()\n      .padStart(2, \"0\");\n    const milliseconds = Math.floor(ms % 1000)\n      .toString()\n      .padStart(3, \"0\");\n    return showMs\n      ? `${days} days, ${hours}:${minutes}:${seconds}:${milliseconds}`\n      : `${days} days, ${hours}:${minutes}:${seconds}`;\n  };\n\n  return <div>{format(timeLeft)}</div>;\n}\n\nexport default CountDown;",
    "solutionCode": "import { useEffect, useRef, useState } from \"react\";\n\nconst ONE_DAY = 24 * 60 * 60 * 1000;\nconst ONE_HOUR = 60 * 60 * 1000;\nconst ONE_MINUTE = 60 * 1000;\nconst ONE_SECOND = 1000;\nfunction CountDown({ totalSeconds = 60, onEnd, showMs = false }) {\n  const [timeLeft, setTimeLeft] = useState(totalSeconds * 1000);\n  const timer = useRef(null);\n  const lastTimestamp = useRef(null);\n\n  useEffect(() => {\n    if (timeLeft <= 0) {\n      onEnd?.();\n      cancelAnimationFrame(timer.current);\n      return;\n    }\n\n    const update = () => {\n      const now = performance.now();\n      if (!lastTimestamp.current) {\n        lastTimestamp.current = now;\n      }\n\n      setTimeLeft((timeLeft) =>\n        Math.max(0, timeLeft - (now - lastTimestamp.current)),\n      );\n      lastTimestamp.current = now;\n\n      timer.current = requestAnimationFrame(update);\n    };\n\n    timer.current = requestAnimationFrame(update);\n\n    return () => {\n      cancelAnimationFrame(timer.current);\n    };\n  }, [timeLeft, onEnd]);\n\n  const format = (ms) => {\n    const days = Math.floor(ms / ONE_DAY)\n      .toString()\n      .padStart(2, \"0\");\n    const hours = Math.floor((ms % ONE_DAY) / ONE_HOUR)\n      .toString()\n      .padStart(2, \"0\");\n    const minutes = Math.floor((ms % ONE_HOUR) / ONE_MINUTE)\n      .toString()\n      .padStart(2, \"0\");\n    const seconds = Math.floor((ms % ONE_MINUTE) / ONE_SECOND)\n      .toString()\n      .padStart(2, \"0\");\n    const milliseconds = Math.floor(ms % 1000)\n      .toString()\n      .padStart(3, \"0\");\n    return showMs\n      ? `${days} days, ${hours}:${minutes}:${seconds}:${milliseconds}`\n      : `${days} days, ${hours}:${minutes}:${seconds}`;\n  };\n\n  return <div>{format(timeLeft)}</div>;\n}\n\nexport default CountDown;",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "Render the component in the local launcher.",
        "expected": "The component should mount correctly.",
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "Trigger the main user interaction once.",
        "expected": "The main visible state should update once.",
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "Repeat the main interaction several times.",
        "expected": "The component should keep responding without stale state.",
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "Render the component in the local launcher.",
        "expected": "The component should mount correctly.",
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "Trigger the main user interaction once.",
        "expected": "The main visible state should update once.",
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "Repeat the main interaction several times.",
        "expected": "The component should keep responding without stale state.",
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "Use an empty or boundary input state in the launcher.",
        "expected": "The component should stay stable and render fallback UI.",
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "Keep the component mounted in a longer interactive session.",
        "expected": "The component should remain responsive.",
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/with_react/countdown.jsx",
    "testPath": "docs/实践/with_react/countdown_test.js"
  },
  {
    "id": "cascader",
    "slug": "cascader",
    "sequence": 34,
    "title": "Cascader",
    "categoryId": "with_vue",
    "categoryName": "Vue 组件",
    "sourceType": "vue",
    "executionMode": "local",
    "launcherPath": "docs/实践/with_vue/launcher",
    "description": "实现一个三级联动选择器，用户可以依次选择省、市、区。组件内置演示数据，在未选择上级时下级列表为空；切换省份时会清空城市和区县，切换城市时会清空区县。该题依赖本地\nVue launcher。 *",
    "approachText": "使用三个选中索引管理当前层级状态，再通过计算属性派生可选城市、可选区县和当前展示结果。每次上级选项变化时显式重置下级选择，避免遗留无效状态。",
    "paramsText": "本题为自渲染 Vue 单文件组件，不接收外部\nprops；内置数据仅用于演示级联联动逻辑。 *",
    "returnText": "返回一个可在本地 launcher\n中直接运行的 Vue 三级级联选择组件，界面会实时展示当前选中的省、市、区。",
    "template": "<script setup>\nimport { computed, ref } from \"vue\";\n\nconst area_data = [\n  {\n    name: \"广东省\",\n    cities: [\n      {\n        name: \"广州市\",\n        areas: [\"天河区\", \"越秀区\", \"海珠区\"],\n      },\n      {\n        name: \"深圳市\",\n        areas: [\"南山区\", \"福田区\", \"罗湖区\"],\n      },\n    ],\n  },\n  {\n    name: \"浙江省\",\n    cities: [\n      {\n        name: \"杭州市\",\n        areas: [\"西湖区\", \"上城区\", \"拱墅区\"],\n      },\n      {\n        name: \"宁波市\",\n        areas: [\"海曙区\", \"江北区\", \"鄞州区\"],\n      },\n    ],\n  },\n];\n\nconst EMPTY_VALUE = \"\";\n\nconst selected_province = ref(EMPTY_VALUE);\nconst selected_city = ref(EMPTY_VALUE);\nconst selected_area = ref(EMPTY_VALUE);\n\nfunction hasSelection(value) {\n  return value !== EMPTY_VALUE;\n}\n\nfunction toIndex(value) {\n  return Number(value);\n}\n\nconst city_options = computed(() => {\n  if (!hasSelection(selected_province.value)) {\n    return [];\n  }\n\n  return area_data[toIndex(selected_province.value)]?.cities ?? [];\n});\n\nconst area_options = computed(() => {\n  if (\n    !hasSelection(selected_province.value) ||\n    !hasSelection(selected_city.value)\n  ) {\n    return [];\n  }\n\n  const selected_city_item = city_options.value[toIndex(selected_city.value)];\n\n  return selected_city_item?.areas ?? [];\n});\n\nconst selected_result = computed(() => {\n  const result = {\n    province: \"\",\n    city: \"\",\n    area: \"\",\n  };\n\n  if (!hasSelection(selected_province.value)) {\n    return result;\n  }\n\n  const province_item = area_data[toIndex(selected_province.value)];\n  result.province = province_item?.name ?? \"\";\n\n  if (!hasSelection(selected_city.value)) {\n    return result;\n  }\n\n  const city_item = province_item?.cities[toIndex(selected_city.value)];\n  result.city = city_item?.name ?? \"\";\n\n  if (!hasSelection(selected_area.value)) {\n    return result;\n  }\n\n  result.area = city_item?.areas[toIndex(selected_area.value)] ?? \"\";\n\n  return result;\n});\n\nfunction onSelectProvince() {\n  selected_city.value = EMPTY_VALUE;\n  selected_area.value = EMPTY_VALUE;\n}\n\nfunction onSelectCity() {\n  selected_area.value = EMPTY_VALUE;\n}\n</script>\n\n<template>\n  <div class=\"cascader\">\n    <p class=\"result\">\n      当前选择：\n      {{ selected_result.province || \"未选择省份\" }}\n      <template v-if=\"selected_result.city\">\n        / {{ selected_result.city }}</template\n      >\n      <template v-if=\"selected_result.area\">\n        / {{ selected_result.area }}</template\n      >\n    </p>\n\n    <div class=\"selector_group\">\n      <select\n        v-model=\"selected_province\"\n        class=\"selector\"\n        @change=\"onSelectProvince\"\n      >\n        <option :value=\"EMPTY_VALUE\">请选择省份</option>\n        <option\n          v-for=\"(province, province_index) in area_data\"\n          :key=\"province.name\"\n          :value=\"String(province_index)\"\n        >\n          {{ province.name }}\n        </option>\n      </select>\n\n      <select v-model=\"selected_city\" class=\"selector\" @change=\"onSelectCity\">\n        <option :value=\"EMPTY_VALUE\">请选择城市</option>\n        <option\n          v-for=\"(city, city_index) in city_options\"\n          :key=\"city.name\"\n          :value=\"String(city_index)\"\n        >\n          {{ city.name }}\n        </option>\n      </select>\n\n      <select v-model=\"selected_area\" class=\"selector\">\n        <option :value=\"EMPTY_VALUE\">请选择区县</option>\n        <option\n          v-for=\"(area, area_index) in area_options\"\n          :key=\"area\"\n          :value=\"String(area_index)\"\n        >\n          {{ area }}\n        </option>\n      </select>\n    </div>\n  </div>\n</template>\n\n<style scoped>\n.cascader {\n  display: grid;\n  gap: 16px;\n  max-width: 560px;\n  padding: 24px;\n  border-radius: 16px;\n  background: linear-gradient(180deg, #f7fbff 0%, #eef5ff 100%);\n  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);\n}\n\n.result {\n  margin: 0;\n  color: #1f2937;\n  font-weight: 600;\n}\n\n.selector_group {\n  display: grid;\n  gap: 12px;\n}\n\n.selector {\n  min-height: 40px;\n  padding: 0 12px;\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  background: #ffffff;\n  color: #111827;\n}\n</style>",
    "solutionCode": "<script setup>\nimport { computed, ref } from \"vue\";\n\nconst area_data = [\n  {\n    name: \"广东省\",\n    cities: [\n      {\n        name: \"广州市\",\n        areas: [\"天河区\", \"越秀区\", \"海珠区\"],\n      },\n      {\n        name: \"深圳市\",\n        areas: [\"南山区\", \"福田区\", \"罗湖区\"],\n      },\n    ],\n  },\n  {\n    name: \"浙江省\",\n    cities: [\n      {\n        name: \"杭州市\",\n        areas: [\"西湖区\", \"上城区\", \"拱墅区\"],\n      },\n      {\n        name: \"宁波市\",\n        areas: [\"海曙区\", \"江北区\", \"鄞州区\"],\n      },\n    ],\n  },\n];\n\nconst EMPTY_VALUE = \"\";\n\nconst selected_province = ref(EMPTY_VALUE);\nconst selected_city = ref(EMPTY_VALUE);\nconst selected_area = ref(EMPTY_VALUE);\n\nfunction hasSelection(value) {\n  return value !== EMPTY_VALUE;\n}\n\nfunction toIndex(value) {\n  return Number(value);\n}\n\nconst city_options = computed(() => {\n  if (!hasSelection(selected_province.value)) {\n    return [];\n  }\n\n  return area_data[toIndex(selected_province.value)]?.cities ?? [];\n});\n\nconst area_options = computed(() => {\n  if (\n    !hasSelection(selected_province.value) ||\n    !hasSelection(selected_city.value)\n  ) {\n    return [];\n  }\n\n  const selected_city_item = city_options.value[toIndex(selected_city.value)];\n\n  return selected_city_item?.areas ?? [];\n});\n\nconst selected_result = computed(() => {\n  const result = {\n    province: \"\",\n    city: \"\",\n    area: \"\",\n  };\n\n  if (!hasSelection(selected_province.value)) {\n    return result;\n  }\n\n  const province_item = area_data[toIndex(selected_province.value)];\n  result.province = province_item?.name ?? \"\";\n\n  if (!hasSelection(selected_city.value)) {\n    return result;\n  }\n\n  const city_item = province_item?.cities[toIndex(selected_city.value)];\n  result.city = city_item?.name ?? \"\";\n\n  if (!hasSelection(selected_area.value)) {\n    return result;\n  }\n\n  result.area = city_item?.areas[toIndex(selected_area.value)] ?? \"\";\n\n  return result;\n});\n\nfunction onSelectProvince() {\n  selected_city.value = EMPTY_VALUE;\n  selected_area.value = EMPTY_VALUE;\n}\n\nfunction onSelectCity() {\n  selected_area.value = EMPTY_VALUE;\n}\n</script>\n\n<template>\n  <div class=\"cascader\">\n    <p class=\"result\">\n      当前选择：\n      {{ selected_result.province || \"未选择省份\" }}\n      <template v-if=\"selected_result.city\">\n        / {{ selected_result.city }}</template\n      >\n      <template v-if=\"selected_result.area\">\n        / {{ selected_result.area }}</template\n      >\n    </p>\n\n    <div class=\"selector_group\">\n      <select\n        v-model=\"selected_province\"\n        class=\"selector\"\n        @change=\"onSelectProvince\"\n      >\n        <option :value=\"EMPTY_VALUE\">请选择省份</option>\n        <option\n          v-for=\"(province, province_index) in area_data\"\n          :key=\"province.name\"\n          :value=\"String(province_index)\"\n        >\n          {{ province.name }}\n        </option>\n      </select>\n\n      <select v-model=\"selected_city\" class=\"selector\" @change=\"onSelectCity\">\n        <option :value=\"EMPTY_VALUE\">请选择城市</option>\n        <option\n          v-for=\"(city, city_index) in city_options\"\n          :key=\"city.name\"\n          :value=\"String(city_index)\"\n        >\n          {{ city.name }}\n        </option>\n      </select>\n\n      <select v-model=\"selected_area\" class=\"selector\">\n        <option :value=\"EMPTY_VALUE\">请选择区县</option>\n        <option\n          v-for=\"(area, area_index) in area_options\"\n          :key=\"area\"\n          :value=\"String(area_index)\"\n        >\n          {{ area }}\n        </option>\n      </select>\n    </div>\n  </div>\n</template>\n\n<style scoped>\n.cascader {\n  display: grid;\n  gap: 16px;\n  max-width: 560px;\n  padding: 24px;\n  border-radius: 16px;\n  background: linear-gradient(180deg, #f7fbff 0%, #eef5ff 100%);\n  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);\n}\n\n.result {\n  margin: 0;\n  color: #1f2937;\n  font-weight: 600;\n}\n\n.selector_group {\n  display: grid;\n  gap: 12px;\n}\n\n.selector {\n  min-height: 40px;\n  padding: 0 12px;\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  background: #ffffff;\n  color: #111827;\n}\n</style>",
    "basicCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "Render the component in the local launcher.",
        "expected": "The component should mount correctly.",
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "Select a province option once.",
        "expected": "The city dropdown should show only the cities under that province.",
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "Select a province and city, then change to another province.",
        "expected": "The city and area selections should reset to avoid stale state.",
        "timeoutMs": 2000
      }
    ],
    "fullCases": [
      {
        "id": "case-1",
        "type": "basic",
        "description": "基础用例 1",
        "input": "Render the component in the local launcher.",
        "expected": "The component should mount correctly.",
        "timeoutMs": 2000
      },
      {
        "id": "case-2",
        "type": "basic",
        "description": "基础用例 2",
        "input": "Select a province option once.",
        "expected": "The city dropdown should show only the cities under that province.",
        "timeoutMs": 2000
      },
      {
        "id": "case-3",
        "type": "basic",
        "description": "基础用例 3",
        "input": "Select a province and city, then change to another province.",
        "expected": "The city and area selections should reset to avoid stale state.",
        "timeoutMs": 2000
      },
      {
        "id": "case-4",
        "type": "edge",
        "description": "边界用例 1",
        "input": "Keep the city and area dropdowns empty before choosing upper levels.",
        "expected": "The component should remain stable and show empty dependent options.",
        "timeoutMs": 2000
      },
      {
        "id": "case-5",
        "type": "exception",
        "description": "异常用例 1",
        "input": "Complete a province, city, and area selection flow.",
        "expected": "The current selection summary should update with all three levels.",
        "timeoutMs": 2000
      }
    ],
    "sourcePath": "docs/实践/with_vue/cascader.vue",
    "testPath": "docs/实践/with_vue/cascader_test.js"
  }
]
