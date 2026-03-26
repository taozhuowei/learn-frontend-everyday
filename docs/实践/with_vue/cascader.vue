/** * @description
实现一个三级联动选择器，用户可以依次选择省、市、区。组件内置演示数据，在未选择上级时下级列表为空；切换省份时会清空城市和区县，切换城市时会清空区县。该题依赖本地
Vue launcher。 * @approach
使用三个选中索引管理当前层级状态，再通过计算属性派生可选城市、可选区县和当前展示结果。每次上级选项变化时显式重置下级选择，避免遗留无效状态。
* @params 本题为自渲染 Vue 单文件组件，不接收外部
props；内置数据仅用于演示级联联动逻辑。 * @return 返回一个可在本地 launcher
中直接运行的 Vue 三级级联选择组件，界面会实时展示当前选中的省、市、区。 */
<script setup>
import { computed, ref } from "vue";

const area_data = [
  {
    name: "广东省",
    cities: [
      {
        name: "广州市",
        areas: ["天河区", "越秀区", "海珠区"],
      },
      {
        name: "深圳市",
        areas: ["南山区", "福田区", "罗湖区"],
      },
    ],
  },
  {
    name: "浙江省",
    cities: [
      {
        name: "杭州市",
        areas: ["西湖区", "上城区", "拱墅区"],
      },
      {
        name: "宁波市",
        areas: ["海曙区", "江北区", "鄞州区"],
      },
    ],
  },
];

const EMPTY_VALUE = "";

const selected_province = ref(EMPTY_VALUE);
const selected_city = ref(EMPTY_VALUE);
const selected_area = ref(EMPTY_VALUE);

function hasSelection(value) {
  return value !== EMPTY_VALUE;
}

function toIndex(value) {
  return Number(value);
}

const city_options = computed(() => {
  if (!hasSelection(selected_province.value)) {
    return [];
  }

  return area_data[toIndex(selected_province.value)]?.cities ?? [];
});

const area_options = computed(() => {
  if (
    !hasSelection(selected_province.value) ||
    !hasSelection(selected_city.value)
  ) {
    return [];
  }

  const selected_city_item = city_options.value[toIndex(selected_city.value)];

  return selected_city_item?.areas ?? [];
});

const selected_result = computed(() => {
  const result = {
    province: "",
    city: "",
    area: "",
  };

  if (!hasSelection(selected_province.value)) {
    return result;
  }

  const province_item = area_data[toIndex(selected_province.value)];
  result.province = province_item?.name ?? "";

  if (!hasSelection(selected_city.value)) {
    return result;
  }

  const city_item = province_item?.cities[toIndex(selected_city.value)];
  result.city = city_item?.name ?? "";

  if (!hasSelection(selected_area.value)) {
    return result;
  }

  result.area = city_item?.areas[toIndex(selected_area.value)] ?? "";

  return result;
});

function onSelectProvince() {
  selected_city.value = EMPTY_VALUE;
  selected_area.value = EMPTY_VALUE;
}

function onSelectCity() {
  selected_area.value = EMPTY_VALUE;
}
</script>

<template>
  <div class="cascader">
    <p class="result">
      当前选择：
      {{ selected_result.province || "未选择省份" }}
      <template v-if="selected_result.city">
        / {{ selected_result.city }}</template
      >
      <template v-if="selected_result.area">
        / {{ selected_result.area }}</template
      >
    </p>

    <div class="selector_group">
      <select
        v-model="selected_province"
        class="selector"
        @change="onSelectProvince"
      >
        <option :value="EMPTY_VALUE">请选择省份</option>
        <option
          v-for="(province, province_index) in area_data"
          :key="province.name"
          :value="String(province_index)"
        >
          {{ province.name }}
        </option>
      </select>

      <select v-model="selected_city" class="selector" @change="onSelectCity">
        <option :value="EMPTY_VALUE">请选择城市</option>
        <option
          v-for="(city, city_index) in city_options"
          :key="city.name"
          :value="String(city_index)"
        >
          {{ city.name }}
        </option>
      </select>

      <select v-model="selected_area" class="selector">
        <option :value="EMPTY_VALUE">请选择区县</option>
        <option
          v-for="(area, area_index) in area_options"
          :key="area"
          :value="String(area_index)"
        >
          {{ area }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.cascader {
  display: grid;
  gap: 16px;
  max-width: 560px;
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(180deg, #f7fbff 0%, #eef5ff 100%);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.result {
  margin: 0;
  color: #1f2937;
  font-weight: 600;
}

.selector_group {
  display: grid;
  gap: 12px;
}

.selector {
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;
  color: #111827;
}
</style>
