<script setup lang="ts">
import { useCartStore } from "@/stores/cartStore";
import { useOrderStore } from "@/stores/orderStore";
import type { SubmitOrderObject } from "@/types/Order";
// 获取用于存储订单信息的 store 对象
const orderStore = useOrderStore();
// 获取路由信息对象
const route = useRoute();
// 如果传递了路由参数则表示再次购买
if (route.query.id) {
  orderStore.createOrderById(route.query.id as string);
} else {
  // 根据服务端购物车创建订单
  orderStore.createOrder();
}
// 收货地址组件实例对象
const receivingAddressInstance = ref();
// 获取路由对象
const router = useRouter();
// 获取当前组件实例
const $ = getCurrentInstance();
// 获取购物车 store 对象
const cartStore = useCartStore();

// 提交订单
async function submitOrder() {
  // 订单对象
  const order: SubmitOrderObject = {
    // 商品集合
    goods: orderStore.orderOfCreate.result.goods.map((item) => ({
      skuId: item.skuId,
      count: item.count,
    })),
    // 收货地址 id
    addressId: receivingAddressInstance.value.addressId(),
    // 配送时间 1 不限
    deliveryTimeType: 1,
    // 支付方式 1 支付宝
    payType: 1,
    // 支付渠道 1 为在线支付
    payChannel: 1,
    // 买家留言
    buyerMessage: "",
  };
  // 判断用户是否选择了收货地址
  if (!order.addressId)
    return $?.proxy?.$message({ type: "warn", msg: "请选择收货地址" });
  // 捕获错误
  try {
    // 发送请求 提交订单
    const response = await orderStore.submitOrder(order);
    // 订单提交后, 重新获取购物车状态
    cartStore.getCarts();
    // 跳转到支付页面
    router.push({ path: "/checkout/pay", query: { orderId: response.id } });
  } catch (error) {
    $?.proxy?.$message({ type: "error", msg: "订单提交失败" });
  }
}
</script>

<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem path="/">首页</XtxBreadItem>
        <XtxBreadItem path="/cart">购物车</XtxBreadItem>
        <XtxBreadItem>填写订单</XtxBreadItem>
      </XtxBread>
      <div class="wrapper">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <ReceivingAddress ref="receivingAddressInstance" />
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th>商品信息</th>
                <th>单价</th>
                <th>数量</th>
                <th>小计</th>
                <th>实付</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in orderStore.orderOfCreate.result.goods"
                :key="item.id"
              >
                <td>
                  <a href="javascript:" class="info">
                    <img :src="item.picture" :alt="item.name" />
                    <div class="right">
                      <p>{{ item.name }}</p>
                      <p>{{ item.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{ item.price }}</td>
                <td>{{ item.count }}</td>
                <td>&yen;{{ item.totalPrice }}</td>
                <td>&yen;{{ item.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:"
            >不限送货时间：周一至周日</a
          >
          <a class="my-btn" href="javascript:">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:">在线支付</a>
          <a class="my-btn" href="javascript:">货到付款</a>
          <span style="color: #999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>
                {{ orderStore.orderOfCreate.result.summary.goodsCount }}件
              </dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>
                ¥ {{ orderStore.orderOfCreate.result.summary.totalPrice }}
              </dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥{{ orderStore.orderOfCreate.result.summary.postFee }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">
                ¥{{ orderStore.orderOfCreate.result.summary.totalPayPrice }}
              </dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <XtxButton @click="submitOrder" type="primary">提交订单</XtxButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.xtx-pay-checkout-page {
  .wrapper {
    background: #fff;
    padding: 0 20px;
    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }
    .box-body {
      padding: 20px 0;
    }
  }
}

.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  .info {
    display: flex;
    text-align: left;
    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }
    .right {
      line-height: 24px;
      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }
  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }
    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;
      &:first-child {
        border-left: 1px solid #f5f5f5;
      }
      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}
.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;
  &.active,
  &:hover {
    border-color: @xtxColor;
  }
}
.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;
    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }
    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;
      &.price {
        font-size: 20px;
        color: @priceColor;
      }
    }
  }
}
.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}
</style>
