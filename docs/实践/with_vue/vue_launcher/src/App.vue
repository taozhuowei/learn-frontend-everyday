<script setup lang="ts">
import { ref, computed } from "vue";
import { scanComponents, type ComponentInfo } from "./componentLoader";

const components = ref<ComponentInfo[]>(scanComponents());
const selectedComponent = ref<ComponentInfo | null>(
  components.value.length > 0 ? components.value[0] : null,
);

const currentComponent = computed(() => selectedComponent.value?.component);

function selectComponent(component: ComponentInfo) {
  selectedComponent.value = component;
}
</script>

<template>
  <div class="app">
    <!-- 侧边栏 - 组件列表 -->
    <aside class="sidebar">
      <h2 class="sidebar-title">组件列表</h2>
      <ul class="component-list">
        <li
          v-for="component in components"
          :key="component.path"
          class="component-item"
          :class="{ active: selectedComponent?.path === component.path }"
          @click="selectComponent(component)"
        >
          {{ component.name }}
        </li>
      </ul>
      <p v-if="components.length === 0" class="no-components">暂无组件</p>
    </aside>

    <!-- 主区域 - 组件预览 -->
    <main class="main-content">
      <template v-if="selectedComponent">
        <div class="preview-header">
          <h1>{{ selectedComponent.name }}</h1>
          <span class="file-path">{{ selectedComponent.path }}</span>
        </div>
        <div class="preview-container">
          <component :is="currentComponent" />
        </div>
      </template>
      <div v-else class="empty-state">
        <p>请添加 .vue 组件文件到上级目录</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  height: 100vh;
  width: 100%;
}
</style>
