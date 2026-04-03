/**
 * @description 实现一个基础柯里化函数 curry。它需要把一个接受多个参数的普通函数转换成可分多次传参的函数：只要当前收集到的参数数量还不足，就继续返回函数等待后续补参；当参数数量达到原函数声明所需时，再一次性执行原函数并返回结果。实现时要保证参数按调用顺序累积，并尽量保留调用时的 this 上下文。
 * @approach
 * 先读取原函数的形参数量作为触发执行的阈值；每次调用都把当前参数暂存起来，参数足够就立即执行原函数，不够就返回一个新的收集函数继续拼接后续参数。
 * @params
 * fn：需要被柯里化的原函数，最终会在参数数量满足条件时被调用。
 * @return
 * 返回一个支持多次分步传参的新函数；累计参数达到要求后会返回原函数执行结果。
 */
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    return function (...nextArgs) {
      const mergedArgs = args.concat(nextArgs);

      return curried.apply(this, mergedArgs);
    };
  };
}
