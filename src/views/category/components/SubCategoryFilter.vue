<script setup lang="ts">
import { useCategoryStore } from "@/stores/categoryStore";
import { onBeforeRouteUpdate } from "vue-router";
import { transform } from "lodash";
import type { GoodsRequestParams } from "@/types/Goods";

const categoryStore = useCategoryStore();
const route = useRoute();

const emit = defineEmits<{
  (e: "onChanged", params: FilterParams): void;
}>();

// 获取二级分类对象 以便从中获取筛选条件
const subCategory = computed(() => {
  // 获取当前二级分类 id
  const subCategoryId = route.params.sub as string;
  // 根据二级分类 id 获取分类对象
  const subCategory = categoryStore.subCategoryFilters.result[subCategoryId];
  // 如果当前二级分类不存在
  if (subCategory === undefined)
    // 发送请求获取二级分类
    categoryStore.getSubCategoryFilters(subCategoryId);
  // 返回二级分类对象
  return subCategory;
});

// 用户选择的筛选条件数据接口规范
interface SelectedFilters {
  brandId?: string;
  [groupName: string]: string | undefined;
}

// 服务于商品列表请求参数的接口规范
type FilterParams = Partial<Pick<GoodsRequestParams, "brandId" | "attrs">>;

// 用于存储用户选择的筛选条件
const selectedFilters = reactive<SelectedFilters>({});

// 更新筛选条件时传递的筛选条件的类型规范
interface Arg {
  key: string;
  value: string;
}

// 更新并转换筛选条件并将转换后的筛选条件传递到父组件
function updateSelectedFilter(operator: "delete", arg: string): void;
function updateSelectedFilter(operator: "set", arg: Arg): void;
function updateSelectedFilter(operator: "delete" | "set", arg: string | Arg) {
  // 更新筛选条件
  if (operator === "delete" && typeof arg === "string") {
    delete selectedFilters[arg];
  } else if (operator === "set" && typeof arg !== "string") {
    selectedFilters[arg.key] = arg.value;
  }

  // 转换筛选条件数据格式
  const params = transform(
    // 要转换的数据
    selectedFilters,
    // 转换方法
    (params, value, key) => {
      key === "brandId"
        ? (params[key] = value)
        : params.attrs?.push({
            groupName: key,
            propertyName: value!,
          });
    },
    // 转换后的数据初始值
    { attrs: [] } as FilterParams
  );
  // 触发自定义事件, 将转换后的筛选条件数据传递到父组件供商品筛选组件使用
  emit("onChanged", params);
}

// 路由发生变化时重置筛选条件
onBeforeRouteUpdate(() => {
  Object.keys(selectedFilters).map((key) => delete selectedFilters[key]);
});
</script>

<template>
  <div
    class="sub-filter"
    v-if="categoryStore.subCategoryFilters.status === 'loading'"
  >
    <XtxSkeleton class="item" width="800px" height="25px" />
    <XtxSkeleton class="item" width="800px" height="25px" />
    <XtxSkeleton class="item" width="600px" height="25px" />
    <XtxSkeleton class="item" width="600px" height="25px" />
    <XtxSkeleton class="item" width="600px" height="25px" />
  </div>
  <div v-else class="sub-filter">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          :class="{ active: selectedFilters['brandId'] === undefined }"
          href="javascript:"
          @click="updateSelectedFilter('delete', 'brandId')"
          >全部</a
        >
        <a
          href="javascript:"
          v-for="brand in subCategory?.brands"
          :key="brand.id"
          @click="
            updateSelectedFilter('set', { key: 'brandId', value: brand.id })
          "
          :class="{ active: selectedFilters.brandId === brand.id }"
          >{{ brand.name }}</a
        >
      </div>
    </div>
    <div
      class="item"
      v-for="saleProperties in subCategory?.saleProperties"
      :key="saleProperties.id"
    >
      <div class="head">{{ saleProperties.name }}:</div>
      <div class="body">
        <a
          :class="{
            active: selectedFilters[saleProperties.name] === undefined,
          }"
          href="javascript:"
          @click="updateSelectedFilter('delete', saleProperties.name)"
          >全部</a
        >
        <a
          href="javascript:"
          v-for="property in saleProperties.properties"
          :key="property.id"
          @click="
            updateSelectedFilter('set', {
              key: saleProperties.name,
              value: property.name,
            })
          "
          :class="{
            active: selectedFilters[saleProperties.name] === property.name,
          }"
          >{{ property.name }}</a
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}

.xtx-skeleton {
  margin: 10px 0;
}
</style>
