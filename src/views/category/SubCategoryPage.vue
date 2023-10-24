<script setup lang="ts">
import { useCategoryStore } from "@/stores/categoryStore";
import type { GoodsRequestParams } from "@/types/Goods";
import { onBeforeRouteUpdate } from "vue-router";

// 存储分类信息的 store 对象
const categoryStore = useCategoryStore();
// 当前二级分类下的推荐商品
const { categoryGoods } = storeToRefs(categoryStore);
// 用于向服务端发送请求获取分类商品的方法
const { getCategoryGoods } = categoryStore;
// 路由信息对象
const route = useRoute();
// 获取二级分类ID
const subCategoryId = route.params.sub as string;
// 获取商品列表的请求参数
let reqParams: Partial<GoodsRequestParams> = { pageSize: 5 };

// 筛选条件、排序条件、路由参数发生变化时执行
// 合并请求参数、发送请求获取商品列表
function sendRequest(categoryId: string, params?: Partial<GoodsRequestParams>) {
  // 合并请求参数、重置页码
  reqParams = { ...reqParams, ...params, page: 1 };
  // 重置加载状态
  categoryGoods.value.status = "loading";
  // 发送请求获取商品列表
  getCategoryGoods(categoryId, reqParams);
}

// 加载更多商品
// 组件初次挂载的时候会立即执行一次
function loadMore() {
  // 设置页码
  reqParams.page =
    typeof reqParams.page === "undefined" ? 1 : reqParams.page + 1;
  // 初始数据获取
  getCategoryGoods(route.params.sub as string, reqParams);
}

// 二级分类路由发生变化时重新获取分类商品
onBeforeRouteUpdate((to) => {
  // 传入新的二级分类id
  sendRequest(to.params.sub as string);
});
</script>
<template>
  <div class="container">
    <SubCategoryBread />
    <!-- 当筛选条件发生变化时重新获取分类商品 -->
    <SubCategoryFilter @onChanged="sendRequest(subCategoryId, $event)" />
    <div class="goods-list">
      <!-- 当排序条件发生变化时重新获取分类商品 -->
      <SubCategorySort @onChanged="sendRequest(subCategoryId, $event)" />
      <!-- 将商品列表传递到下层组件中 -->
      <GoodsList :goodsList="categoryGoods.result.items" />
      <!-- 加载更多 -->
      <XtxInfiniteLoading
        @infinite="loadMore"
        :loading="categoryGoods.status === 'loading'"
        :finished="categoryGoods.status === 'finished'"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
}
</style>
