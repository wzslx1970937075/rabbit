<script setup lang="ts">
import { useGoodsStore } from "@/stores/GoodsStore";

// 接收商品 id 作为参数
const props = defineProps<{ goodsId?: string }>();
// 获取用于存储商品信息的 store 对象
const goodsStore = useGoodsStore();
// 用于获取相关商品的方法
const { getRelevantLikeGoods } = goodsStore;
// 用于存储相关商品的对象
const { relevantAndLike } = storeToRefs(goodsStore);
// 发送请求获取相关商品或猜你喜欢
getRelevantLikeGoods({ id: props.goodsId });
</script>

<template>
  <div class="goods-relevant">
    <div class="header">
      <i class="icon"></i>
      <span class="title">{{ goodsId ? "同类商品" : "猜你喜欢" }}</span>
    </div>
    <!-- 复用轮播图组件 -->
    <XtxCarousel
      v-if="relevantAndLike.status === 'success'"
      :count="
        goodsId
          ? relevantAndLike.relevantGoods[goodsId].length
          : relevantAndLike.likeGoods.length
      "
    >
      <template
        v-for="(group, index) in goodsId
          ? relevantAndLike.relevantGoods[goodsId]
          : relevantAndLike.likeGoods"
        v-slot:[`default-${index}`]
      >
        <div class="slider">
          <router-link
            v-for="item in group"
            :key="item.id"
            :to="`/goods/${item.id}`"
          >
            <img :src="item.picture" :alt="item.name" />
            <p class="name ellipsis">{{ item.name }}</p>
            <p class="price">&yen;{{ item.price }}</p>
          </router-link>
        </div>
      </template>
    </XtxCarousel>
  </div>
</template>

<style scoped lang="less">
.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;
  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    .title {
      font-size: 20px;
      padding-left: 10px;
    }
    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-top: 4px solid @xtxColor;
      border-right: 4px solid @xtxColor;
      box-sizing: border-box;
      position: relative;
      transform: rotate(45deg);
      &::before {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 2px;
        background: lighten(@xtxColor, 40%);
      }
    }
  }
  :deep(.xtx-carousel) {
    height: 380px;
    .carousel {
      &-indicator {
        bottom: 30px;
        span {
          &.active {
            background: @xtxColor;
          }
        }
      }
      &-btn {
        top: 110px;
        opacity: 1;
        background: rgba(0, 0, 0, 0);
        color: #ddd;
        i {
          font-size: 30px;
        }
      }
    }
  }
  .slider {
    display: flex;
    justify-content: space-around;
    padding: 0 40px;
    > a {
      width: 240px;
      text-align: center;
      img {
        padding: 20px;
        width: 230px !important;
        height: 230px !important;
      }
      .name {
        font-size: 16px;
        color: #666;
        padding: 0 40px;
      }
      .price {
        font-size: 16px;
        color: @priceColor;
        margin-top: 15px;
      }
    }
  }
}
</style>
