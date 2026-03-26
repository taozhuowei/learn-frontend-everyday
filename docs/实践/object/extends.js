/**
 * @description 这个文件用于演示 JavaScript 中“组合继承”的基本写法，而不是一道适合自动判题的函数题。示例需要同时展示三件事：父构造函数如何初始化实例属性、子构造函数如何借用父构造函数完成实例属性继承、以及子类型如何通过原型链继承父类型上的方法并修正 constructor 指向。因为它强调的是继承关系搭建过程而不是单一函数的输入输出，所以构建时需要跳过题库导入。
 * @approach
 * 先定义 Parent 负责公共实例属性，再在 Child 内通过 Parent.call(this, ...) 继承实例字段；随后用 Object.create(Parent.prototype) 连接原型链，并把 constructor 指回 Child，让示例同时覆盖实例属性继承和原型方法继承。
 * @params
 * Parent(name)：name 表示父构造函数初始化到实例上的姓名字段。
 * Child(name, little_name)：name 会透传给父构造函数，little_name 表示子构造函数额外维护的昵称字段。
 * @return
 * 该文件只用于展示继承关系的搭建方式，不提供单一判题返回值。
 * @skip
 */
function Parent(name) {
  this.name = name;
}

Parent.prototype.say = function say() {
  console.log("hi, I'm " + this.name);
};

function Child(name, little_name) {
  Parent.call(this, name);
  this.little_name = little_name;
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

Child.prototype.run = function run() {
  console.log("I'm " + this.little_name + ", I'm running.");
};
