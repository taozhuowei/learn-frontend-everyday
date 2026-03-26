/** * @description 实现一个 Vue
响应式计数组件，支持点击交互和基础样式组织。该题依赖本地 Vue launcher。 *
@approach * 先明确输入输出，再按稳定步骤展开实现。 *
优先使用清晰变量名、显式分支和可读循环，避免技巧式缩写。 * @params *
请在函数签名中明确列出入参含义。 * @return * *
返回值应与题目要求一致，并覆盖空值或异常分支。 */
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
</script>

<template>
  <div class="hello">
    <h1>Hello Vue!</h1>
    <p>这是一个测试组件</p>
    <button @click="count++">点击次数: {{ count }}</button>
  </div>
</template>

<style scoped>
.hello {
  padding: 20px;
  text-align: center;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
}

button:hover {
  background: #369870;
}
</style>
