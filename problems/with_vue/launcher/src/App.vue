<script setup lang="ts">
import { computed, ref } from "vue";
import { scanComponents, type ComponentInfo } from "./componentLoader";

const components: ComponentInfo[] = scanComponents();
const selected_component_id = ref<string | null>(components[0]?.id ?? null);

const selected_component = computed<ComponentInfo | null>(() => {
  return (
    components.find((component) => component.id === selected_component_id.value) ?? null
  );
});

const current_component = computed(() => {
  return selected_component.value?.component ?? null;
});

function selectComponent(component: ComponentInfo): void {
  selected_component_id.value = component.id;
}
</script>

<template>
  <div class="app">
    <aside class="sidebar">
      <h2 class="sidebar-title">组件列表</h2>
      <ul class="component-list">
        <li
          v-for="component in components"
          :key="component.id"
          class="component-item"
          :class="{ active: selected_component?.id === component.id }"
          @click="selectComponent(component)"
        >
          {{ component.name }}
        </li>
      </ul>
      <p v-if="components.length === 0" class="no-components">暂未发现可预览组件</p>
    </aside>

    <main class="main-content">
      <template v-if="selected_component && current_component">
        <div class="preview-header">
          <h1>{{ selected_component.name }}</h1>
          <span class="file-path">{{ selected_component.path }}</span>
        </div>
        <div class="preview-container">
          <component :is="current_component" />
        </div>
      </template>
      <div v-else class="empty-state">
        <p>请把可渲染的 `.vue` 组件文件放到 launcher 同级目录。</p>
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
