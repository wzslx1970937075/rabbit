<script setup lang="ts">
import { useCartStore } from "@/stores/cartStore";
// 获取购物车 store 对象
const cartStore = useCartStore();

// 获取组件实例对象
const $ = getCurrentInstance();

// 删除购物车中的商品
async function removeGoodsOfCart(skuIds: string[]) {
  // 捕获用户选择的是确定还是取消
  try {
    // 和用户进行确认
    await $?.proxy?.$confirm({ content: "您确定要删除该商品吗?" });
    // 捕获请求是否错误
    try {
      // 发送请求删除该商品
      await cartStore.removeGoodsOfCart({ ids: skuIds });
      // 消息提示
      $?.proxy?.$message({ type: "success", msg: "商品删除成功" });
    } catch (error) {
      $?.proxy?.$message({ type: "error", msg: "商品删除失败" });
    }
  } catch (error) {
    // 用户点击了取消
  }
}
// 删除购物车中的商品(批量)
async function removeGoodsOfCartMany() {
  // 获取要删除的商品的 skuId
  const skuIds = cartStore.selectedGoods.map((item) => item.skuId);
  // 发送请求删除商品
  removeGoodsOfCart(skuIds);
}
</script>

<template>
  <div class="cart-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem path="/">首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th>
                <XtxCheckbox
                  :model-value="cartStore.isAllSelected"
                  @update:model-value="
                    cartStore.selecteAndDeselect(!cartStore.isAllSelected)
                  "
                  >全选</XtxCheckbox
                >
              </th>
              <th>商品信息</th>
              <th>单价</th>
              <th>数量</th>
              <th>小计</th>
              <th>操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr v-for="item in cartStore.effectiveGoods" :key="item.id">
              <td>
                <XtxCheckbox
                  :model-value="item.selected"
                  @update:model-value="
                    cartStore.alterCartGoods({
                      id: item.skuId,
                      selected: !item.selected,
                    })
                  "
                />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/goods/${item.id}`"
                    ><img :src="item.picture" :alt="item.name"
                  /></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ item.name }}</p>
                    <!-- 选择规格组件 -->
                    <CartSku :skuId="item.skuId" :attrs-text="item.attrsText" />
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.nowPrice }}</p>
                <p>
                  比加入时降价
                  <span class="red"
                    >&yen;{{
                      parseFloat(item.price) - parseFloat(item.nowPrice)
                    }}</span
                  >
                </p>
              </td>
              <td class="tc">
                <XtxNumberBox
                  :max="item.stock"
                  :count="item.count"
                  label=""
                  @update:count="
                    cartStore.alterCartGoods({ id: item.skuId, count: $event })
                  "
                />
              </td>
              <td class="tc">
                <p class="f16 red">
                  &yen;{{ parseFloat(item.nowPrice) * item.count }}
                </p>
              </td>
              <td class="tc">
                <p><a href="javascript:">移入收藏夹</a></p>
                <p>
                  <a
                    @click="removeGoodsOfCart([item.skuId])"
                    class="green"
                    href="javascript:"
                    >删除</a
                  >
                </p>
                <p><a href="javascript:">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody>
            <tr>
              <td colspan="6"><h3 class="tit">失效商品</h3></td>
            </tr>
            <tr v-for="item in cartStore.invalidGoods" :key="item.id">
              <td></td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/goods/${item.id}`"
                    ><img :src="item.picture" :alt="item.name"
                  /></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ item.name }}</p>
                    <p class="attr">{{ item.attrsText }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.nowPrice }}</p>
              </td>
              <td class="tc">{{ item.count }}</td>
              <td class="tc">
                <p>&yen;{{ parseFloat(item.nowPrice) * item.count }}</p>
              </td>
              <td class="tc">
                <p><a class="green" href="javascript:">删除</a></p>
                <p><a href="javascript:">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XtxCheckbox
            :model-value="cartStore.isAllSelected"
            @update:model-value="
              cartStore.selecteAndDeselect(!cartStore.isAllSelected)
            "
            >全选</XtxCheckbox
          >
          <a href="javascript:" @click="removeGoodsOfCartMany()">删除商品</a>
          <a href="javascript:">移入收藏夹</a>
          <a
            href="javascript:"
            @click="cartStore.removeGoodsOfCart({ clearInvalid: true })"
            >清空失效商品</a
          >
        </div>
        <div class="total">
          共 {{ cartStore.effectiveTotalQuantity }} 件商品，已选择
          {{ cartStore.selectedQuantity }}
          件，商品合计：
          <span class="red">¥{{ cartStore.selectedPrice }}</span>
          <XtxButton to="/checkout/order" type="primary">下单结算</XtxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodsRelevant />
    </div>
  </div>
</template>

<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-number-box {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor;
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      width: 100%;
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
