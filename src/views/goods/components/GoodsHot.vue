<script setup lang="ts">
import { useGoodsStore } from "@/stores/GoodsStore";

// id: 商品 id
// type: 榜单类型
const props = defineProps<{ id: string; type: 1 | 2 | 3 }>();
// 获取用于存储商品信息的 store 对象
const goodsStore = useGoodsStore();
// 用于获取榜单状态的方法
const { getHotSaleGoods } = goodsStore;
// 榜单状态
const { hotSaleGoods } = storeToRefs(goodsStore);
// 获取榜单
getHotSaleGoods(props.id, props.type, 3);
// 榜单名称
const listNames = { 1: "24小时热销榜", 2: "周热销榜", 3: "总热销榜" };
</script>

<template>
  <div class="goods-hot">
    <h3>{{ listNames[type] }}</h3>
    <GoodsItem :goods="goods" v-for="goods in hotSaleGoods.result[type]" />
  </div>
</template>

<style scoped lang="less">
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  :deep(.goods-item) {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
