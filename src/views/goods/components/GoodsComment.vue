<script setup lang="ts">
import type { EvaluateRequestParams } from "@/types/Goods";
import { useGoodsStore } from "@/stores/GoodsStore";

// 获取用于存储商品信息的 store 对象
const goodsStore = useGoodsStore();
// 评价列表
const { evaluateList } = storeToRefs(goodsStore);

// 获取评价列表的请求参数
const reqParams = ref<EvaluateRequestParams>({
  page: 1,
  pageSize: 10,
  hasPicture: false,
  tag: "全部评价",
  sortField: "",
});
</script>

<template>
  <div class="goods-comment">
    <!-- 评价筛选 -->
    <CommentScreen v-model:reqParams="reqParams" />
    <!-- 评价排序 -->
    <CommentSort v-model:reqParams="reqParams" />
    <!-- 评价列表 -->
    <CommentList :reqParams="reqParams" />
    <!-- 分页组件 -->
    <XtxPagination
      v-if="evaluateList.result.pages > 1"
      v-model:page="reqParams.page"
      :pages="evaluateList.result.pages"
      :maxVisiblePages="6"
    />
  </div>
</template>
