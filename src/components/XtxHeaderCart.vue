<script setup lang="ts">
import { useCartStore } from "@/stores/cartStore";
import isLogin from "@/utils/isLogin";

// 获取用于存储购车商品列表的 store 对象
const cartStore = useCartStore();
// 获取路由信息对象
const route = useRoute();
// 如果当前访问的是首页
if (route.path == "/") {
  // 并且用户登录了
  if (isLogin()) {
    // 获取购物车列表
    cartStore.getCarts();
  }
} else {
  // 不是首页 获取购物车列表
  cartStore.getCarts();
}
// 获取组件实例对象
const $ = getCurrentInstance();

// 删除购物车商品
async function remove(skuId: string) {
  try {
    // 删除确认
    await $?.proxy?.$confirm({
      content: "您确定要从购物车中删除该商品吗?",
    });
    try {
      // 发送请求删除商品
      await cartStore.removeGoodsOfCart({ ids: [skuId] });
      // 消息提示
      $?.proxy?.$message({ type: "success", msg: "商品删除成功" });
    } catch (error) {
      // 消息提示
      $?.proxy?.$message({ type: "error", msg: "商品删除失败" });
    }
  } catch (error) {
    // 消息提示
    $?.proxy?.$message({ type: "success", msg: "已取消删除" });
  }
}
</script>

<template>
  <div class="cart">
    <RouterLink to="/cart" class="curr">
      <i class="iconfont icon-cart"></i
      ><em>{{ cartStore.effectiveTotalQuantity }}</em>
    </RouterLink>
    <div class="layer" v-if="$route.path !== '/cart'">
      <div class="list">
        <div class="item" v-for="item in cartStore.carts.result" :key="item.id">
          <RouterLink :to="`/goods/${item.id}`">
            <img :src="item.picture" :alt="item.name" />
            <div class="center">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="attr ellipsis">{{ item.attrsText }}</p>
            </div>
            <div class="right">
              <p class="price">&yen;{{ item.nowPrice }}</p>
              <p class="count">x{{ item.count }}</p>
            </div>
          </RouterLink>
          <i class="iconfont icon-close-new" @click="remove(item.skuId)"></i>
        </div>
      </div>
      <div class="foot">
        <div class="total">
          <p>共 {{ cartStore.effectiveTotalQuantity }} 件商品</p>
          <p>&yen;{{ cartStore.effectiveTotalPrice }}</p>
        </div>
        <XtxButton type="plain">
          <RouterLink to="/cart">去购物车结算</RouterLink>
        </XtxButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.cart {
  width: 50px;
  position: relative;
  z-index: 600;
  .curr {
    height: 32px;
    line-height: 32px;
    text-align: center;
    position: relative;
    display: block;
    .icon-cart {
      font-size: 22px;
    }
    em {
      font-style: normal;
      position: absolute;
      right: 0;
      top: 0;
      padding: 1px 6px;
      line-height: 1;
      background: @helpColor;
      color: #fff;
      font-size: 12px;
      border-radius: 10px;
      font-family: Arial, serif;
    }
  }
  &:hover {
    .layer {
      opacity: 1;
      transform: none;
    }
  }
  .layer {
    opacity: 0;
    transition: all 0.4s 0.2s;
    transform: translateY(-200px) scale(1, 0);
    width: 400px;
    height: 400px;
    position: absolute;
    top: 50px;
    right: 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    background: #fff;
    border-radius: 4px;
    padding-top: 10px;
    &::before {
      content: "";
      position: absolute;
      right: 14px;
      top: -10px;
      width: 20px;
      height: 20px;
      background: #fff;
      transform: scale(0.6, 1) rotate(45deg);
      box-shadow: -3px -3px 5px rgba(0, 0, 0, 0.1);
    }
    .foot {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 70px;
      width: 100%;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      background: #f8f8f8;
      align-items: center;
      .total {
        padding-left: 10px;
        color: #999;
        p {
          &:last-child {
            font-size: 18px;
            color: @priceColor;
          }
        }
      }
    }
  }
  .list {
    height: 310px;
    overflow: auto;
    padding: 0 10px;
    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    &::-webkit-scrollbar-track {
      background: #f8f8f8;
      border-radius: 2px;
    }
    &::-webkit-scrollbar-thumb {
      background: #eee;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #ccc;
    }
    .item {
      border-bottom: 1px solid #f5f5f5;
      padding: 10px 0;
      position: relative;
      i {
        position: absolute;
        bottom: 38px;
        right: 0;
        opacity: 0;
        color: #666;
        transition: all 0.5s;
      }
      &:hover {
        i {
          opacity: 1;
          cursor: pointer;
        }
      }
      a {
        display: flex;
        align-items: center;
        img {
          height: 80px;
          width: 80px;
        }
        .center {
          padding: 0 10px;
          width: 200px;
          .name {
            font-size: 16px;
          }
          .attr {
            color: #999;
            padding-top: 5px;
          }
        }
        .right {
          width: 100px;
          padding-right: 20px;
          text-align: center;
          .price {
            font-size: 16px;
            color: @priceColor;
          }
          .count {
            color: #999;
            margin-top: 5px;
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
