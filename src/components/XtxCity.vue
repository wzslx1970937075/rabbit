<script lang="ts">
// 声明城市数据类型
interface City {
  code: string;
  level: number;
  name: string;
  areaList: City[];
}
// 城市码键
type AddressCodeKey = "provinceCode" | "cityCode" | "countyCode";
// 城市名键
type AddressNameKey = "provinceName" | "cityName" | "countyName";
// 城市码
type AddressCode = {
  [K in AddressCodeKey]?: string;
};
// 城市名
type AddressName = {
  [K in AddressNameKey]?: string;
};
</script>

<script setup lang="ts">
import type { Status } from "@/types/Status";
import axios from "axios";

// 用于控制弹框的显示和隐藏
const visible = ref(false);
// 用于存储城市选择组件的最外层元素
const target = ref<HTMLDivElement>();

// placeholder: 提示用户操作的文字
// fullLocation: 用户选择的省市区名称, 或默认展示的省市区名称
const props = withDefaults(
  defineProps<{ placeholder?: string; fullLocation?: string }>(),
  {
    placeholder: "请选择收货地址",
    fullLocation: "",
  }
);

// 声明城市数据
let cachedCities: City[] = [];
// 城市数据的加载状态
const loading = ref<Status>("idle");
// 控制弹框显示
async function show() {
  // 显示弹框
  visible.value = true;
  // 如果城市数据不存在
  if (cachedCities.length === 0) {
    // 更新城市数据加载状态
    loading.value = "loading";
    // 发送请求获取城市数据
    let response = await axios.get(
      "https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json"
    );
    // 存储城市数据
    cachedCities = response.data;
    // 更新城市数据加载状态
    loading.value = "success";
  }
  // 存储在页面中展示的城市状态
  cities.value = cachedCities;
}
// 控制弹框隐藏
function hide() {
  visible.value = false;
}
// 控制弹框切换
function toggle() {
  visible.value ? hide() : show();
}
// 在城市选择组件外部点击时隐藏该组件
onClickOutside(target, hide);

// 在页面中展示的城市状态
const cities = ref<City[]>();
// 在页面中展示用户的选择结果(城市名称)
const selectedCity = useVModel(props, "fullLocation");

// 记录用户选择的省市区编码
const addressCode: AddressCode = {};
// 记录用户选择的省市区名称
const addressName: AddressName = {};
// 城市级别与城市的键名的对应关系
const mapLevel: { [level: number]: AddressCodeKey } = {
  0: "provinceCode",
  1: "cityCode",
  2: "countyCode",
};
const mapName: { [level: number]: AddressNameKey } = {
  0: "provinceName",
  1: "cityName",
  2: "countyName",
};

// 定义要触发的自定义事件
const emit = defineEmits<{
  (e: "addressCodeChanged", addressCode: AddressCode): void;
}>();

// 更新城市弹层内容, 记录用户选择的城市编码
function updateCities(code: string, level: number, name: string) {
  // 更新城市弹层内容
  cities.value = cities.value?.find((city) => city.code === code)?.areaList;
  // 记录用户选择的城市编码
  addressCode[mapLevel[level]] = code;
  // 记录用户选择的城市名称
  addressName[mapName[level]] = name;
  // 如果选择到的县/区级
  if (level === 2) {
    // 重置页面中显示的城市数据
    cities.value = cachedCities;
    // 隐藏弹框
    hide();
    // 触发自定义事件, 将用户选择的城市码传递到组件外部
    emit("addressCodeChanged", addressCode);
    // 获取用户选择的省市区名称
    const { provinceName, cityName, countyName } = addressName;
    // 拼接用户选择的省市区名称
    selectedCity.value = provinceName! + cityName! + countyName!;
  }
}
</script>

<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle" :class="{ active: visible }">
      <span class="placeholder" v-if="!selectedCity">{{ placeholder }}</span>
      <span class="value" v-else>{{ selectedCity }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <template v-if="loading === 'success'">
        <span
          @click="updateCities(item.code, item.level, item.name)"
          class="ellipsis"
          v-for="item in cities"
          :key="item.code"
          >{{ item.name }}</span
        >
      </template>
      <template v-if="loading === 'loading'">
        <div class="loading"></div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(@/assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
