<script setup lang="ts">
import { useCategoryStore } from "@/stores/categoryStore";
// 获取路由信息对象
const route = useRoute();
// 获取用于存储分类信息的 store 对象
const categoryStore = useCategoryStore();

// 获取当前一级分类的具体信息
let topCategory = computed(() => {
  // 获取当前一级分类的 id
  const id = route.params.id as string;
  // 根据一级分类 id 获取分类信息
  let topCategory = categoryStore.topCategories.result[id];
  // 返回一级分类信息
  return topCategory;
});
</script>

<template>
  <div class="ref-goods" v-for="subCategory in topCategory?.children">
    <div class="head">
      <h3>- {{ subCategory.name }} -</h3>
      <p class="tag">{{ subCategory.saleProperties }}</p>
      <XtxMore />
    </div>
    <div class="body">
      <GoodsItem
        :goods="goods"
        v-for="goods in subCategory.goods"
        :key="goods.id"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.ref-goods {
  background-color: #fff;
  margin-top: 20px;
  position: relative;
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .head {
    .xtx-more {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .tag {
      text-align: center;
      color: #999;
      font-size: 20px;
      position: relative;
      top: -20px;
    }
  }
  .body {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 65px 30px;
  }
}
</style>
