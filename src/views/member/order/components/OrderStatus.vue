<script setup lang="ts">
import { useOrderStore } from "@/stores/orderStore";
import { orderStatus } from "@/contants/orderStatus";
import Confirm from "@/components/library/Confirm";

const orderStore = useOrderStore();
// 取消订单弹框实例
const cancelOrderInstance = ref();
// 取消订单
function cancelOrder(id: string) {
  // 渲染弹框
  cancelOrderInstance.value.visible = true;
  // 要取消的订单id
  cancelOrderInstance.value.orderId = id;
}

// 获取组件实例对象
const $ = getCurrentInstance();
// 确认收货
async function confirmReceipt(id: string) {
  // 捕获用户点击了确认按钮还是取消按钮
  try {
    // 和用户进行确认
    await Confirm({ content: "要确认收货吗?" });
    // 捕获请求错误
    try {
      // 发送请求 确认收货
      await orderStore.confirmReceiptGoods(id);
      // 用户提示
      $?.proxy?.$message({ type: "success", msg: "确认收货成功" });
      // 重新获取订单详情信息
      orderStore.getOrderInfoById(id);
    } catch (error) {
      // 用户提示
      $?.proxy?.$message({ type: "error", msg: "确认收货失败" });
    }
  } catch (error) {}
}
</script>

<template>
  <div class="detail-action">
    <div class="state">
      <span class="iconfont icon-order-unpay"></span>
      <p>{{ orderStatus[orderStore.orderInfo.result.orderState].label }}</p>
    </div>
    <div class="info">
      <p>订单编号: {{ orderStore.orderInfo.result.id }}</p>
      <p>下单时间: {{ orderStore.orderInfo.result.createTime }}</p>
    </div>
    <div class="btn">
      <!-- 待付款 -->
      <template v-if="orderStore.orderInfo.result.orderState === 1">
        <XtxButton
          @click="
            $router.push({
              path: '/member/pay',
              query: { orderId: orderStore.orderInfo.result.id },
            })
          "
          type="primary"
          size="small"
          >立即付款</XtxButton
        >
        <XtxButton
          type="gray"
          size="small"
          @click="cancelOrder(orderStore.orderInfo.result.id)"
          >取消订单</XtxButton
        >
      </template>
      <!-- 待发货 -->
      <template v-if="orderStore.orderInfo.result.orderState === 2">
        <XtxButton
          @click="
            $router.push(`/checkout/order?id=${orderStore.orderInfo.result.id}`)
          "
          type="primary"
          size="small"
          >再次购买</XtxButton
        >
      </template>
      <!-- 待收货 -->
      <template v-if="orderStore.orderInfo.result.orderState === 3">
        <XtxButton
          @click="confirmReceipt(orderStore.orderInfo.result.id)"
          type="primary"
          size="small"
          >确认收货</XtxButton
        >
        <XtxButton
          @click="
            $router.push(`/checkout/order?id=${orderStore.orderInfo.result.id}`)
          "
          type="plain"
          size="small"
          >再次购买</XtxButton
        >
      </template>
      <!-- 待评价 -->
      <template v-if="orderStore.orderInfo.result.orderState === 4">
        <XtxButton
          type="primary"
          size="small"
          @click="
            $router.push(`/checkout/order?id=${orderStore.orderInfo.result.id}`)
          "
          >再次购买</XtxButton
        >
        <XtxButton type="plain" size="small">评价商品</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 已完成 -->
      <template v-if="orderStore.orderInfo.result.orderState === 5">
        <XtxButton
          type="primary"
          size="small"
          @click="
            $router.push(`/checkout/order?id=${orderStore.orderInfo.result.id}`)
          "
          >再次购买</XtxButton
        >
        <XtxButton type="plain" size="small">查看评价</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 已取消 -->
    </div>
  </div>
  <CancelOrder
    ref="cancelOrderInstance"
    @on-cancel-order-success="
      orderStore.getOrderInfoById(orderStore.orderInfo.result.id)
    "
  />
</template>

<style scoped lang="less">
.detail-action {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  .state {
    width: 220px;
    text-align: center;
    .iconfont {
      font-size: 40px;
      color: @xtxColor;
    }
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
  }
  .info {
    width: 240px;
    line-height: 30px;
    p {
      color: #999;
    }
  }
  .btn {
    flex: 1;
    text-align: right;
    margin-right: 100px;
    .xtx-button {
      margin-left: 20px;
    }
  }
}
</style>
