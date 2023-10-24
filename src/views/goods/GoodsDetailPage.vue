<script setup lang="ts">
import { useCartStore } from "@/stores/cartStore";
import { useGoodsStore } from "@/stores/GoodsStore";
import { AxiosError } from "axios";
import { onBeforeRouteUpdate } from "vue-router";

// 获取用于存储商品详情信息的 store 对象
const goodsStore = useGoodsStore();
// 获取商品信息
const { goodsInfo } = storeToRefs(goodsStore);
// 获取用于发送请求获取商品详情信息的方法
const { getGoodsInfo } = goodsStore;
// 获取路由信息对象
const route = useRoute();
const $ = getCurrentInstance();

// 获取商品详情信息
getGoodsInfo(route.params.id as string);
// 向服务器端发送请求获取商品详情信息
onBeforeRouteUpdate((to) => getGoodsInfo(to.params.id as string));

// 用户选择的商品数量
const count = ref(1);
// 用户选择的规格 skuId
const skuId = ref<string | undefined>();
// 获取用于存储购物车信息的 store 对象
const cartStore = useCartStore();

// 将商品添加到购物车
async function addProductToCart() {
  // 检查用户是否选择了完整的规格
  if (typeof skuId.value !== "undefined") {
    // 捕获错误
    try {
      // 发送请求将商品加入购物车
      await cartStore.addProductToCart(skuId.value, count.value);
      // 消息提示
      $?.proxy?.$message({ type: "success", msg: "已成功将商品加入购物车" });
    } catch (error) {
      // 加入购物车失败, 进行错误处理
      if (error instanceof AxiosError) {
        // token 验证失败的情况
        if (error.response?.data.code === "10019") {
          $?.proxy?.$message({
            type: "error",
            msg: `请登录`,
          });
        }
      }
    }
  } else {
    $?.proxy?.$message({ type: "warn", msg: "请选择商品规格" });
  }
}
</script>

<template>
  <div class="xtx-goods-page">
    <div class="container" v-if="goodsInfo.status === 'success'">
      <!-- 面包屑 -->
      <GoodsBread />
      <!-- 商品信息 -->
      <div class="goods-info">
        <!-- 左侧 -->
        <div class="media">
          <GoodsImages />
          <GoodsSales />
        </div>
        <!-- 右侧 -->
        <div class="spec">
          <GoodsInfo />
          <GoodsSku
            :specs="goodsInfo.result.specs"
            :skus="goodsInfo.result.skus"
            @complete="
              goodsStore.updateGoods($event);
              skuId = $event.skuId;
            "
            @incomplete="skuId = undefined"
          />
          <XtxNumberBox
            :max="goodsInfo.result.inventory"
            v-model:count="count"
            label="数量"
          />
          <XtxButton
            @click="addProductToCart"
            type="primary"
            :style="{ 'margin-top': '20px' }"
            >加入购物车</XtxButton
          >
        </div>
      </div>
      <!-- 同类商品 -->
      <GoodsRelevant :goods-id="goodsInfo.result.id"></GoodsRelevant>
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTab />
        </div>
        <!-- 24热榜 -->
        <div class="goods-aside">
          <GoodsHot :id="goodsInfo.result.id" :type="1" />
          <GoodsHot :id="goodsInfo.result.id" :type="2" />
          <GoodsHot :id="goodsInfo.result.id" :type="3" />
        </div>
      </div>
    </div>
    <div class="container loading-container" v-else>
      <img src="@/assets/images/loading.gif" />
    </div>
  </div>
</template>

<style scoped lang="less">
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;
  background: #fff;
}
</style>
