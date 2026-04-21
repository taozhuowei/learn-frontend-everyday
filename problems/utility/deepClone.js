/**\n * @skip
 * @description 实现一个更完整的深拷贝函数 deepClone。它需要复制普通对象、数组、Date、RegExp、Map、Set 等常见可遍历结构，使返回结果与原始数据在值层面保持等价，但在引用层面完全独立。实现时还要处理循环引用，避免因为对象之间互相引用而导致无限递归，同时保证 Symbol 键也能被复制。
 * @approach
 * 先把基础类型、特殊对象和普通对象分开处理，再使用 WeakMap 记录已经克隆过的引用；对于数组和普通对象递归复制自身所有键，对于 Map 和 Set 则递归复制其中的键和值或成员，从而兼顾深层结构和循环引用。
 * @params
 * obj：需要被深拷贝的输入值，可能是普通对象、数组或其他引用类型。
 * cache：内部使用的 WeakMap 缓存，用来记录已经处理过的引用，默认自动创建。
 * @return
 * 返回一个与原值结构等价但引用独立的新结果；如果传入的是基础类型，则直接返回原值。
 */
function deepClone(obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;

  if (cache.has(obj)) return cache.get(obj);

  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof RegExp) return new RegExp(obj);

  if (obj instanceof Map) {
    const clonedMap = new Map();
    cache.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, cache), deepClone(value, cache));
    });
    return clonedMap;
  }

  if (obj instanceof Set) {
    const clonedSet = new Set();
    cache.set(obj, clonedSet);
    obj.forEach((value) => clonedSet.add(deepClone(value, cache)));
    return clonedSet;
  }

  const clonedObj = Array.isArray(obj) ? [] : {};
  cache.set(obj, clonedObj);

  Reflect.ownKeys(obj).forEach((key) => {
    clonedObj[key] = deepClone(obj[key], cache);
  });

  return clonedObj;
}

export default deepClone;
