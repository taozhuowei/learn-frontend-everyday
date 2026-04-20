import fs from 'fs';
import path from 'path';

const fixes = {
  'array/flat.js': \`function flat(depth = 1) {
  const d = depth === undefined ? 1 : Number(depth);
  const result = [];
  const flatDeep = (arr, currD) => {
    arr.forEach(item => {
      if (Array.isArray(item) && currD < d) flatDeep(item, currD + 1);
      else result.push(item);
    });
  };
  flatDeep(this, 0);
  return result;
}
Array.prototype.myFlat = flat;
export default flat;\`,
  'utility/flatten.js': \`function flatten(arr, depth = 1) {
  const d = Number(depth);
  const result = [];
  const exec = (a, c) => {
    a.forEach(i => {
      if (Array.isArray(i) && c < d) exec(i, c + 1);
      else result.push(i);
    });
  };
  exec(arr, 0);
  return result;
}
export default flatten;\`,
  'linkedlist/mergeTwoLists.js': \`function mergeTwoLists(l1, l2) {
  if (!l1) return l2;
  if (!l2) return l1;
  if (l1.val <= l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
}
export default mergeTwoLists;\`,
  'promise/promise.js': \`class MyPromise {
  constructor(executor) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };
    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };
    try { executor(resolve, reject); } catch (err) { reject(err); }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err; };
    const promise2 = new MyPromise((resolve, reject) => {
      const wrap = (fn, val) => {
        setTimeout(() => {
          try {
            const x = fn(val);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) { reject(e); }
        }, 0);
      };
      if (this.status === 'fulfilled') wrap(onFulfilled, this.value);
      else if (this.status === 'rejected') wrap(onRejected, this.reason);
      else {
        this.onResolvedCallbacks.push(() => wrap(onFulfilled, this.value));
        this.onRejectedCallbacks.push(() => wrap(onRejected, this.reason));
      }
    });
    return promise2;
  }
  resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) return reject(new TypeError('cycle'));
    if ((x !== null && typeof x === 'object') || typeof x === 'function') {
      let called = false;
      try {
        let then = x.then;
        if (typeof then === 'function') {
          then.call(x, y => { if (!called) { called = true; this.resolvePromise(promise2, y, resolve, reject); } }, 
                       r => { if (!called) { called = true; reject(r); } });
        } else resolve(x);
      } catch (e) { if (!called) { called = true; reject(e); } }
    } else resolve(x);
  }
}
export default MyPromise;\`,
  'object/new.js': \`function myNew(constructor, ...args) {
  if (typeof constructor !== 'function') throw new TypeError('Constructor must be a function');
  const obj = Object.create(constructor.prototype);
  const result = constructor.apply(obj, args);
  return (result !== null && (typeof result === 'object' || typeof result === 'function')) ? result : obj;
}
export default myNew;\`,
  'object/instanceof.js': \`function myInstanceof(left, right) {
  if (left === null || (typeof left !== 'object' && typeof left !== 'function')) return false;
  let proto = Object.getPrototypeOf(left);
  while (proto) {
    if (proto === right.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
export default myInstanceof;\`
};

for (const [relPath, body] of Object.entries(fixes)) {
  const p = path.join('problems', relPath);
  if (!fs.existsSync(p)) continue;
  const content = fs.readFileSync(p, 'utf8');
  const header = content.match(/^\\/\\*\\*[\\s\\S]*?\\*\\//)?.[0] || '';
  fs.writeFileSync(p, header + '\\n' + body + '\\n');
}
