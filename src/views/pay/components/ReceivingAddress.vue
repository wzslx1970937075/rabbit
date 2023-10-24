<script setup lang="ts">
import { useOrderStore } from "@/stores/orderStore";
import type { Address } from "@/types/Order";

// 获取收货地址编辑组件实例对象
const addressEdit = ref();
// 获取切换收货地址组件实例对象
const addressSwitch = ref();
// 获取订单 store 对象
const orderStore = useOrderStore();
// 发送请求获取收货地址列表
orderStore.getAddress();

// 用于存储用户新增的收货地址或用户选择的收货地址
const highestPriority = ref<Address | undefined>();

// 新增收货地址
function onAddressEdited(id: string) {
  highestPriority.value = orderStore.address.result.find(
    (item) => item.id === id
  );
}

// 最终的组件中渲染的收货地址
const finalAddress = computed(() => {
  // 1.返回用户新增的收货地址或者选择的收货地址
  if (typeof highestPriority.value !== "undefined")
    return highestPriority.value;
  // 2. 返回用户收货地址列表中的默认收货地址
  const defaultAddress = orderStore.address.result.find(
    (item) => item.isDefault === 0
  );
  if (typeof defaultAddress !== "undefined") return defaultAddress;
  // 3. 返回用户列表中的第一个收货地址
  const firstInList = orderStore.address.result[0];
  if (typeof firstInList !== "undefined") return firstInList;
});

// 修改收货地址
function alterAddress() {
  addressEdit.value.formValues = {
    ...finalAddress.value,
    isDefault: finalAddress.value?.isDefault === 0 ? true : false,
  };
  addressEdit.value.visible = true;
}

// 暴露用户选择的收货地址
defineExpose({ addressId: () => finalAddress.value?.id });
</script>

<template>
  <div class="address">
    <div class="text">
      <div class="none" v-if="!finalAddress">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-else>
        <li><span>收货人：</span>{{ finalAddress.receiver }}</li>
        <li>
          <span>联系方式：</span
          >{{ finalAddress.contact.replace(/(\d{3})\d{4}(\d{4})/, "$1****$3") }}
        </li>
        <li>
          <span>收货地址：</span>{{ finalAddress.fullLocation }}
          {{ finalAddress.address }}
        </li>
      </ul>
      <a href="javascript:" v-if="finalAddress" @click="alterAddress()"
        >修改地址</a
      >
    </div>
    <div class="action">
      <XtxButton class="btn" @click="addressSwitch.visible = true"
        >切换地址</XtxButton
      >
      <XtxButton class="btn" @click="addressEdit.visible = true"
        >添加地址</XtxButton
      >
    </div>
  </div>
  <!-- 添加和修改收货地址 -->
  <ReceivingAddressEdit ref="addressEdit" @address-edited="onAddressEdited" />
  <!-- 切换收货地址 -->
  <ReceivingAddressSwitch
    ref="addressSwitch"
    @address-switched="highestPriority = $event"
    :finalAddressId="finalAddress?.id"
  />
</template>

<style scoped lang="less">
.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
