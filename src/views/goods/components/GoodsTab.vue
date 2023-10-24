<script setup lang="ts">
import { useGoodsStore } from "@/stores/GoodsStore";
// GoodsDetail 展示商品详细信息
// GoodsComment 展示商品评论信息
const activeComponent = ref<"GoodsDetail" | "GoodsComment">("GoodsDetail");
// 获取用于存储商品信息的 store 对象
const goodsStore = useGoodsStore();
</script>

<template>
  <div class="goods-tabs">
    <nav>
      <a
        @click="activeComponent = 'GoodsDetail'"
        :class="{ active: activeComponent === 'GoodsDetail' }"
        href="javascript:"
        >商品详情</a
      >
      <a
        @click="activeComponent = 'GoodsComment'"
        :class="{ active: activeComponent === 'GoodsComment' }"
        href="javascript:"
        >商品评价<span
          >({{ goodsStore.evaluateInfo.result.evaluateCount }})</span
        ></a
      >
    </nav>
    <!-- 切换内容的地方 -->
    <GoodsDetail v-show="activeComponent === 'GoodsDetail'" />
    <GoodsComment v-show="activeComponent === 'GoodsComment'" />
  </div>
</template>

<style lang="less" scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
