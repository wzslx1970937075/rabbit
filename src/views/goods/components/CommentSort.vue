<script setup lang="ts">
import type { EvaluateRequestParams } from "@/types/Goods";

const props = defineProps<{ reqParams: EvaluateRequestParams }>();
const emit = defineEmits(["update:reqParams"]);

// 请求参数(双向数据绑定)
const reqParams = useVModel(props, "reqParams", emit);

// 更新请求参数
function updateParams(target: Partial<EvaluateRequestParams>) {
  reqParams.value = {
    // 获取原有值
    ...reqParams.value,
    // 使用新值覆盖原有值(sortField)
    ...target,
    // 每次点击排序条件时重置页码
    page: 1,
  };
}
</script>

<template>
  <div class="sort">
    <span>排序：</span>
    <a
      @click="updateParams({ sortField: '' })"
      :class="{ active: reqParams.sortField === '' }"
      href="javascript:"
      >默认</a
    >
    <a
      @click="updateParams({ sortField: 'praiseCount' })"
      href="javascript:"
      :class="{ active: reqParams.sortField === 'praiseCount' }"
      >最新</a
    >
    <a
      @click="updateParams({ sortField: 'createTime' })"
      href="javascript:"
      :class="{ active: reqParams.sortField === 'createTime' }"
      >最热</a
    >
  </div>
</template>
<style scoped lang="less">
.sort {
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
  margin: 0 20px;
  color: #666;
  > span {
    margin-left: 20px;
  }
  > a {
    margin-left: 30px;
    &.active,
    &:hover {
      color: @xtxColor;
    }
  }
}
</style>
