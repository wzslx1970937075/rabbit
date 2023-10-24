<script setup lang="ts">
// 如果在调用该组件时传递了 v-model 则进行双向数据绑定
// 否则在组件内部维护复选框的是否选中状态并通过自定义事件将该状态传递到组件外部
const props = withDefaults(
  defineProps<{ modelValue?: boolean; defaultWithoutVModel?: boolean }>(),
  {
    modelValue: undefined,
    defaultWithoutVModel: undefined,
  }
);
// 声明组件要触发的自定义事件
const emit = defineEmits(["update:modelValue"]);
// 是否使用双向数据绑定
const isVModel = typeof props.modelValue !== "undefined";

// 声明复选框是否选中状态
let isChecked = isVModel
  ? useVModel(props, "modelValue", emit)
  : ref(props.defaultWithoutVModel || false);

// 切换复选框选中、取消选中状态
const toggle = () => {
  // 切换状态
  isChecked.value = !isChecked.value;
  // 如果未使用双向数据绑定, 手动触发自定义事件将状态传递到组件外部
  // 如果使用了双向数据绑定, 则 useVModel 内部自动触发自定义事件
  if (!isVModel) emit("update:modelValue", isChecked.value);
};
</script>

<template>
  <div class="xtx-checkbox" @click="toggle">
    <i class="iconfont icon-checked" v-if="isChecked"></i>
    <i class="iconfont icon-unchecked" v-else></i>
    <span v-if="$slots.default"><slot></slot></span>
  </div>
</template>

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
