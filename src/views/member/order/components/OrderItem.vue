<script setup lang="ts">
import useCountdown from "@/logics/useCountdown";
import type { OrderResponse } from "@/types/Order";
import dayjs from "dayjs";
import { orderStatus } from "@/contants/orderStatus";
import { useOrderStore } from "@/stores/orderStore";
import Confirm from "@/components/library/Confirm";

const props = defineProps<{ item: OrderResponse }>();
// 获取倒计时
const { count, start, isActive } = useCountdown();
// 如果当前订单状态为待付款并且可以进行倒计时 开启倒计时
if (props.item.orderState === 1 && props.item.countdown > 0)
  start(props.item.countdown);
// 声明当前组件要触发的自定义事件
const emit = defineEmits<{
  // 取消订单
  (e: "onCancelOrder", id: string): void;
  // 删除订单成功
  (e: "removeOrderSuccess"): void;
  // 确认收货
  (e: "confirmReceiptGoodsSuccess"): void;
  // 查看物流
  (e: "viewLogistics", id: string): void;
}>();

// 获取用于存储订单信息的 store 对象
const orderStore = useOrderStore();
// 获取组件实例
const $ = getCurrentInstance();
// 删除订单
async function removeOrder(id: string) {
  try {
    // 和用户确认是否要删除订单
    await Confirm({ content: "您确定要删除该订单吗?" });
    // 用户点击了确认按钮
    try {
      // 发送请求删除订单
      await orderStore.removeOrder([id]);
      // 消息提示
      $?.proxy?.$message({ type: "success", msg: "订单删除成功" });
      // 通知父组件重新获取订单列表
      emit("removeOrderSuccess");
    } catch (error) {
      // 订单删除失败
      $?.proxy?.$message({ type: "error", msg: "订单删除失败" });
    }
  } catch (error) {
    // 用户点击了取消按钮
    $?.proxy?.$message({ type: "success", msg: "您取消了删除订单的操作" });
  }
}
// 确认收货
async function confirmReceiptGoods(id: string) {
  try {
    // 和用户进行确认是否要确认收货
    await Confirm({ content: "确定要进行收货吗" });
    // 捕获请求错误
    try {
      // 发送请求 确认收货
      await orderStore.confirmReceiptGoods(id);
      // 消息提示
      $?.proxy?.$message({ type: "success", msg: "确认收货成功" });
      // 通知父组件 重新获取订单列表
      emit("confirmReceiptGoodsSuccess");
    } catch (error) {
      // 消息提示
      $?.proxy?.$message({ type: "error", msg: "确认收货失败" });
    }
  } catch (error) {}
}
// 查看物流
async function viewLogistics(id: string) {
  // 通知父组件 用户要查看物流信息
  emit("viewLogistics", id);
}
</script>

<template>
  <div class="order-item">
    <div class="head">
      <span>下单时间: {{ item.createTime }}</span>
      <span>订单编号: {{ item.id }}</span>
      <!-- 订单状态为待付款(1)时渲染倒计时 -->
      <span class="down-time" v-if="item.orderState === 1 && isActive">
        <i class="iconfont icon-down-time"></i>
        <b>付款截止: {{ dayjs.unix(count).format("mm分ss秒") }}</b>
      </span>
      <!-- 订单状态为 已完成(5)或已取消(6)时可以删除订单 -->
      <a
        @click="removeOrder(item.id)"
        v-if="[5, 6].includes(item.orderState)"
        href="javascript:"
        class="del"
        >删除</a
      >
    </div>
    <div class="body">
      <div class="column goods">
        <ul>
          <li v-for="sku in item.skus" :key="sku.id">
            <a class="image" href="javascript:">
              <img :src="sku.image" :alt="sku.name" />
            </a>
            <div class="info">
              <p class="name ellipsis-2">{{ sku.name }}</p>
              <p class="attr ellipsis">
                <span>{{ sku.attrsText }}</span>
              </p>
            </div>
            <div class="price">¥{{ sku.realPay }}</div>
            <div class="count">x{{ sku.quantity }}</div>
          </li>
        </ul>
      </div>
      <div class="column state">
        <p>{{ orderStatus[item.orderState].label }}</p>
        <!-- 订单状态为待收货(3)时渲染查看物流 -->
        <a
          @click="viewLogistics(item.id)"
          v-if="item.orderState === 3"
          href="javascript:"
          class="green"
          >查看物流</a
        >
        <!-- 订单状态为待评价(4)时渲染评价商品 -->
        <a v-if="item.orderState === 4" href="javascript:" class="green"
          >评价商品</a
        >
        <!-- 订单状态为已完成(5)时渲染查看评价 -->
        <a v-if="item.orderState === 5" href="javascript:" class="green"
          >查看评价</a
        >
      </div>
      <div class="column amount">
        <p class="red">¥{{ item.payMoney }}</p>
        <p v-if="item.postFee > 0">(含运费: ¥{{ item.postFee }})</p>
        <p v-if="item.payType === 1">在线付款</p>
      </div>
      <div class="column action">
        <!-- 订单状态为待付款(1)时渲染立即付款 -->
        <XtxButton
          type="primary"
          size="small"
          v-if="item.orderState === 1"
          @click="
            $router.push({ path: '/checkout/pay', query: { orderId: item.id } })
          "
          >立即付款</XtxButton
        >
        <!-- 订单状态为待收货(3)时渲染确认收货 -->
        <XtxButton
          @click="confirmReceiptGoods(item.id)"
          v-if="item.orderState === 3"
          type="primary"
          size="small"
          >确认收货</XtxButton
        >
        <p>
          <RouterLink :to="`/member/order/${item.id}`">查看详情</RouterLink>
        </p>
        <!-- 订单状态为待付款(1)时渲染取消订单 -->
        <p v-if="item.orderState === 1">
          <a @click="emit('onCancelOrder', item.id)" href="javascript:"
            >取消订单</a
          >
        </p>
        <!-- 订单状态为待发货 (2)、待收货 (3)、待评价 (4)、已完成 (5) 渲染再次购买 -->
        <p v-if="[2, 3, 4, 5].includes(item.orderState)">
          <a href="javascript:">再次购买</a>
        </p>
        <!-- 订单状态为待评价 (4)、已完成 (5)渲染申请售后 -->
        <p v-if="[4, 5].includes(item.orderState)">
          <a href="javascript:">申请售后</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;
  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;
    span {
      margin-right: 20px;
      &.down-time {
        margin-right: 0;
        float: right;
        i {
          vertical-align: middle;
          margin-right: 3px;
        }
        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }
    }
    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }
  .body {
    display: flex;
    align-items: stretch;
    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;
      > p {
        padding-top: 10px;
      }
      &:first-child {
        border-left: none;
      }
      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;
        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;
            &:last-child {
              border-bottom: none;
            }
            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }
            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;
              p {
                margin-bottom: 5px;
                &.name {
                  height: 38px;
                }
                &.attr {
                  color: #999;
                  font-size: 12px;
                  span {
                    margin-right: 5px;
                  }
                }
              }
            }
            .price {
              width: 100px;
            }
            .count {
              width: 80px;
            }
          }
        }
      }
      &.state {
        width: 120px;
        .green {
          color: @xtxColor;
        }
      }
      &.amount {
        width: 200px;
        .red {
          color: @priceColor;
        }
      }
      &.action {
        width: 140px;
        a {
          display: block;
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
</style>
