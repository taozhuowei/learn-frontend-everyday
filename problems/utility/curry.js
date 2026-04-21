/**\n * @skip
 * @description 实现一个通用柯里化函数 curry。
 * @approach 使用闭包收集参数，当参数达到长度时执行。
 * @params fn 函数
 * @return 柯里化后的函数
 */
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...args2) => curried.apply(this, args.concat(args2));
  };
}
export default curry;
