/**
 * @description 实现一个通用的深拷贝函数，用于把输入值完整复制成一个新的结构，而不是只复制最外层引用。它需要在遇到普通对象、数组、Date、RegExp 等可复制对象时创建新的副本，对基础类型直接返回原值，并处理对象之间的循环引用，避免递归时进入死循环。拷贝结果不能与原对象共享可变嵌套引用。
 * @approach
 * 先把基础类型和特殊对象分开处理，再借助 WeakMap 记录已经拷贝过的引用；对于普通对象和数组，递归遍历自身所有键并继续深拷贝对应值，这样就能同时解决嵌套复制和循环引用问题。
 * @params
 * obj：需要被深拷贝的输入值，可以是对象、数组或其他任意类型。
 * cache：内部用于记录已拷贝引用的 WeakMap，默认自动创建，外部通常不需要手动传入。
 * @return
 * 返回一个与原值结构等价但引用独立的新结果；基础类型会直接返回自身。
 */
function deepClone(obj, cache = new WeakMap()) {
  // 1. 基础类型处理：null 或非对象直接返回
  if (obj === null || typeof obj !== "object") return obj;

  // 2. 特殊对象处理：Date 和 RegExp 使用构造函数创建新实例
  if (obj instanceof Date) return new Date(obj.getTime());
  // RegExp 对象的属性（如 lastIndex）也需要复制，直接使用构造函数创建新实例
  if (obj instanceof RegExp) return new RegExp(obj);

  // 3. 循环引用处理：使用 WeakMap 缓存已拷贝的对象
  if (cache.has(obj)) return cache.get(obj);

  // 4. 递归拷贝：遍历对象所有键（包括 Symbol），递归深拷贝每个值
  const clone = Array.isArray(obj) ? [] : {};
  cache.set(obj, clone);

  // 使用 Reflect.ownKeys 获取对象的所有键（包括 Symbol），确保完整拷贝
  Reflect.ownKeys(obj).forEach((key) => {
    clone[key] = deepClone(obj[key], cache);
  });

  return clone;
}

const deepCopy = deepClone;
