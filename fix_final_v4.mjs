import fs from 'fs';
import path from 'path';

const fixes = {
  'array/flat.js': \`function flat(depth = 1) {
  if (this == null) throw new TypeError();
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
  'object/deep_copy.js': \`function deep_copy(obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof RegExp) return new RegExp(obj);
  if (cache.has(obj)) return cache.get(obj);
  const clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  cache.set(obj, clone);
  Reflect.ownKeys(obj).forEach(key => { clone[key] = deep_copy(obj[key], cache); });
  return clone;
}
export default deep_copy;\`,
  'object/instanceof.js': \`function myInstanceof(left, right) {
  if (left === null || (typeof left !== 'object' && typeof left !== 'function')) return false;
  let proto = Object.getPrototypeOf(left);
  while (proto) {
    if (proto === right.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
export default myInstanceof;\`,
  'object/new.js': \`function myNew(constructor, ...args) {
  if (typeof constructor !== 'function') throw new TypeError();
  const obj = Object.create(constructor.prototype);
  const result = constructor.apply(obj, args);
  return (result !== null && (typeof result === 'object' || typeof result === 'function')) ? result : obj;
}
export default myNew;\`,
  'promise/promise.js': \`class MyPromise {
  constructor(executor) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = v => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = v;
        this.onResolvedCallbacks.forEach(f => f());
      }
    };
    const reject = r => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = r;
        this.onRejectedCallbacks.forEach(f => f());
      }
    };
    try { executor(resolve, reject); } catch (e) { reject(e); }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e; };
    const p2 = new MyPromise((resolve, reject) => {
      const wrap = (f, v) => {
        setTimeout(() => {
          try {
            const x = f(v);
            this.resolvePromise(p2, x, resolve, reject);
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
    return p2;
  }
  resolvePromise(p2, x, resolve, reject) {
    if (p2 === x) return reject(new TypeError('cycle'));
    if ((x !== null && typeof x === 'object') || typeof x === 'function') {
      let called = false;
      try {
        let then = x.then;
        if (typeof then === 'function') {
          then.call(x, y => { if (!called) { called = true; this.resolvePromise(p2, y, resolve, reject); } }, 
                       r => { if (!called) { called = true; reject(r); } });
        } else resolve(x);
      } catch (e) { if (!called) { called = true; reject(e); } }
    } else resolve(x);
  }
}
export default MyPromise;\`,
  'promise/promise_all.js': \`function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const res = [];
    let count = 0;
    const arr = Array.from(promises);
    if (arr.length === 0) return resolve([]);
    arr.forEach((p, i) => {
      Promise.resolve(p).then(v => {
        res[i] = v;
        count++;
        if (count === arr.length) resolve(res);
      }, reject);
    });
  });
}
export default promiseAll;\`,
  'promise/promise_race.js': \`function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    Array.from(promises).forEach(p => Promise.resolve(p).then(resolve, reject));
  });
}
export default promiseRace;\`,
  'utility/curry.js': \`function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...args2) => curried.apply(this, args.concat(args2));
  };
}
export default curry;\`,
  'utility/deepClone.js': \`function deepClone(obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof RegExp) return new RegExp(obj);
  if (cache.has(obj)) return cache.get(obj);
  const res = Array.isArray(obj) ? [] : {};
  cache.set(obj, res);
  Reflect.ownKeys(obj).forEach(k => { res[k] = deepClone(obj[k], cache); });
  return res;
}
export default deepClone;\`
};

for (const [relPath, body] of Object.entries(fixes)) {
  const p = path.join('problems', relPath);
  if (!fs.existsSync(p)) continue;
  const content = fs.readFileSync(p, 'utf8');
  const header = content.match(/^\\/\\*\\*[\\s\\S]*?\\*\\//)?.[0] || '';
  fs.writeFileSync(p, header + '\\n' + body + '\\n');
}
