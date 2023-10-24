<script setup lang="ts">
import { useOrderStore } from "@/stores/orderStore";
import { XtxSteps } from "@/components/XtxSteps";
import { XtxStepItem } from "@/components/XtxStepItem";

// 获取订单 store 对象
const orderStore = useOrderStore();
// 获取路由信息对象
const route = useRoute();
// 发送请求 获取订单详细信息
orderStore.getOrderInfoById(route.params.id as string);
</script>

<template>
  <div class="order-detail-page">
    <!-- 操作栏 -->
    <OrderStatus />
    <!-- 步骤条-->
    <!-- 如果订单是取消状态只能说明用户提交过订单 -->
    <XtxSteps
      :active="
        orderStore.orderInfo.result.orderState === 6
          ? 1
          : orderStore.orderInfo.result.orderState
      "
    >
      <XtxStepItem
        title="提交订单"
        :desc="orderStore.orderInfo.result.createTime"
      ></XtxStepItem>
      <XtxStepItem
        title="付款成功"
        :desc="orderStore.orderInfo.result.payTime"
      ></XtxStepItem>
      <XtxStepItem
        title="商品发货"
        :desc="orderStore.orderInfo.result.consignTime"
      ></XtxStepItem>
      <XtxStepItem
        title="确认收货"
        :desc="orderStore.orderInfo.result.endTime"
      ></XtxStepItem>
      <XtxStepItem
        title="订单完成"
        :desc="orderStore.orderInfo.result.evaluationTime"
      ></XtxStepItem>
    </XtxSteps>
    <!-- 物流栏 -->
    <!-- 注意: 只有订单状态为待收货、待评价、已完成时才渲染物流显示组件 -->
    <DetailLogistics
      v-if="[3, 4, 5].includes(orderStore.orderInfo.result.orderState)"
    />
    <!-- 订单商品信息 -->
    <DetailOrderGooods />
  </div>
</template>

<style scoped lang="less">
.order-detail-page {
  background: #fff;
  height: 100%;
}
</style>
