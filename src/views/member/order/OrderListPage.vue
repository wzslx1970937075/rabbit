<script setup lang="ts">
import { orderStatus } from "@/contants/orderStatus";
import XtxTabs from "@/components/XtxTabs";
import XtxTabPane from "@/components/XtxTabPane";
import { useOrderStore } from "@/stores/orderStore";

// 默认激活的订单状态名称
const name = ref("all");
// 获取用于存储订单信息的 store 对象
const orderStore = useOrderStore();
// 请求订单列表的参数
const reqParams = ref<{
  page: number;
  pageSize: number;
  orderState: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}>({ page: 1, pageSize: 10, orderState: 0 });
// 当请求参数变化后重新获取订单列表
watchEffect(() => orderStore.getMyOrders(reqParams.value));

// 取消订单弹框实例对象
const cancelOrderInstance = ref();
// 当取消订单按钮被点击时
function onCancelOrder(id: string) {
  // 显示弹框
  cancelOrderInstance.value.visible = true;
  // 存储要取消的订单 id
  cancelOrderInstance.value.orderId = id;
}

// 物流信息弹框实例对象
const orderLogisticsInstance = ref();
// 查看物流信息
function viewLogistics(id: string) {
  // 显示弹框
  orderLogisticsInstance.value.visible = true;
  // 发送请求 获取物流信息
  orderStore.viewLogistics(id);
}
</script>

<template>
  <div class="member-order">
    <XtxTabs
      v-model:name="name"
      @on-tab-click="
        reqParams.page = 1;
        reqParams.orderState = $event;
      "
    >
      <XtxTabPane
        v-for="item in orderStatus"
        :label="item.label"
        :name="item.name"
        :key="item.name"
      >
        <div class="order-list">
          <div
            class="loading"
            v-if="
              orderStore.myOrderList[reqParams.orderState].status === 'loading'
            "
          ></div>
          <div
            class="none"
            v-if="
              orderStore.myOrderList[reqParams.orderState].result.items
                .length === 0
            "
          >
            暂无数据
          </div>
          <OrderItem
            v-else
            v-for="item in orderStore.myOrderList[reqParams.orderState].result
              .items"
            :key="item.id"
            :item="item"
            @on-cancel-order="onCancelOrder"
            @remove-order-success="orderStore.getMyOrders(reqParams)"
            @confirm-receipt-goods-success="orderStore.getMyOrders(reqParams)"
            @view-logistics="viewLogistics"
          />
        </div>
        <XtxPagination
          v-model:page="reqParams.page"
          :pages="orderStore.myOrderList[reqParams.orderState].result.pages"
          v-if="orderStore.myOrderList[reqParams.orderState].result.pages > 1"
        />
      </XtxTabPane>
    </XtxTabs>
  </div>
  <!-- 取消订单弹框 -->
  <CancelOrder
    ref="cancelOrderInstance"
    @on-cancel-order-success="orderStore.getMyOrders(reqParams)"
  />
  <!-- 物流信息弹框 -->
  <OrderLogistics ref="orderLogisticsInstance" />
</template>

<style lang="less" scoped>
.member-order {
  height: 100%;
  background: #fff;
  position: relative;
}
.order-list {
  background: #fff;
  padding: 20px;
  position: relative;
  .loading {
    height: calc(100% - 60px);
    width: 100%;
    min-height: 400px;
    position: absolute;
    left: 0;
    top: 60px;
    background: rgba(255, 255, 255, 0.9) url(@/assets/images/loading.gif)
      no-repeat center 18%;
  }
  .none {
    height: 400px;
    text-align: center;
    line-height: 400px;
    color: #999;
    background: rgba(255, 255, 255, 0.9);
  }
}
</style>
