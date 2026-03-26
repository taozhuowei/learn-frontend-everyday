<template>
  <div class="casscader">
    <div>
      你选择的是：{{ result.province }} - {{ result.city }} - {{ result.area }}
    </div>

    <select v-model="selectedProvince" @change="onSelectProvince">
      <option value="">请选择省份</option>
      <option v-for="(province, i) in data" :key="i" :value="i">
        {{ province.name }}
      </option>
    </select>

    <select v-model="selectedCity" @change="onSelectCity">
      <option value="">请选择城市</option>
      <option v-for="(city, i) in citiesList" :key="i" :value="i">
        {{ city.name }}
      </option>
    </select>

    <select v-model="selectedArea">
      <option value="">请选择区域</option>
      <option v-for="(area, i) in areasList" :key="i" :value="i">
        {{ area }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

const data = reactive([
  {
    name: "广东",
    cities: [
      {
        name: "广州",
        areas: ["天河区", "越秀区", "海珠区"],
      },
      {
        name: "深圳",
        areas: ["南山区", "福田区", "罗湖区"],
      },
    ],
  },
  {
    name: "浙江",
    cities: [
      {
        name: "杭州",
        areas: ["西湖区", "上城区", "下城区"],
      },
      {
        name: "宁波",
        areas: ["海曙区", "江北区", "鄞州区"],
      },
    ],
  },
]);

const selectedProvince = ref("");
const selectedCity = ref("");
const selectedArea = ref("");

const citiesList = computed(() => {
  console.log("citiesList: ", selectedProvince.value);
  if (selectedProvince.value === "") {
    return [];
  }

  console.log(data[selectedProvince.value].cities);
  return data[selectedProvince.value].cities;
});

const areasList = computed(() => {
  console.log("areasList: ", selectedCity.value);

  if (selectedCity.value === "") {
    return [];
  }

  const cities = data[selectedProvince.value].cities;
  console.log(cities[selectedCity.value].areas);
  return cities[selectedCity.value].areas;
});

const onSelectProvince = () => {
  selectedCity.value = "";
  selectedArea.value = "";
};

const onSelectCity = () => {
  selectedArea.value = "";
};

const result = computed(() => {
  const pIndex = selectedProvince.value;
  const cIndex = selectedCity.value;
  const aIndex = selectedArea.value;

  const res = { province: "", city: "", area: "" };

  if (!pIndex || !data.length) {
    return res;
  }
  res.province = data[pIndex].name;

  const cities = data[pIndex].cities;
  if (!cIndex || !cities.length) {
    return res;
  }
  res.city = cities[cIndex].name;

  const areas = cities[cIndex].areas;
  if (!aIndex || !areas.length) {
    return res;
  }
  res.area = areas[aIndex];
  return res;
});
</script>

<style lang="scss" scoped></style>
