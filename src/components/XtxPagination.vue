<script setup lang="ts">
// page 当前页
// pages 总页数
// maxVisiblePages 页面中同时最多显示的页码数量
const props = withDefaults(
  defineProps<{ page: number; pages: number; maxVisiblePages?: number }>(),
  { maxVisiblePages: 5 }
);
const emit = defineEmits(["update:page"]);

// 当前页
const page = useVModel(props, "page", emit);
// 计算渲染分页组件需要的页码信息
// 显示着的开始页码、显示着的结束页码、页码值数组
const pageInfo = computed(() => {
  // 计算页码偏移量计算
  // 比如当前页为5, 页面中规格显示5个页码 => [3, 4, 5, 6, 7]
  const pageOffset = Math.floor(props.maxVisiblePages / 2);
  // 计算在页面中显示着的开始页码和结束页码
  // start: 当前页页码 - 偏移量
  let start = page.value - pageOffset;
  // 显示着的结束页码不能使用[当前页页码 + 偏移量]
  // 比如: 当前页: 5, 页面显示页码个数: 6, 偏移量: 3 => [2, 3, 4, 5, 6, 7, 8], 页码范围溢出
  // end: start + maxVisiblePages - 1
  let end = start + props.maxVisiblePages - 1;
  // 限制显示着的开始页码的范围
  if (start < 1) {
    // 如果开始显示着的页码小于1, 让它等于1
    start = 1;
    // 显示着的结束页码的计算使用到了显示着的开始页码, 显示着的开始页码被重新设置了, 所以结束页码也需要重新计算
    let end_tmp = start + props.maxVisiblePages - 1;
    // 重新计算显示着的结束页码, 计算完成之后要判断它是否大于了总页数
    // 如果重新计算的显示着的结束页码大于了总页数, 让它等于总页数
    // 如果重新计算的显示着的结束页码没有大于总页数, 就让它等于重新计算的显示着的结束页码
    end = end_tmp > props.pages ? props.pages : end_tmp;
  }
  // 限制显示着的结束页码的范围
  if (end > props.pages) {
    // 如果显示着的结束页码大于总页数, 让其等于总页数
    end = props.pages;
    // 重新计算显示着的开始页码
    let start_tmp = end - props.maxVisiblePages + 1;
    // 限制开始页码的范围
    start = start_tmp < 1 ? 1 : start_tmp;
  }
  // 用于存储页码值的数值
  const pagesArray = [];
  // 遍历生成页码值
  for (let i = start; i <= end; i++) {
    // 存储页码值
    pagesArray.push(i);
  }
  // 返回渲染分页组件需要的信息
  return { start, end, pagesArray };
});
</script>

<template>
  <div class="xtx-pagination">
    <a v-if="page > 1" @click="page--" href="javascript:">上一页</a>
    <span v-if="pageInfo.start > 1">...</span>
    <a
      v-for="item in pageInfo.pagesArray"
      :key="item"
      :class="{ active: item === page }"
      @click="page = item"
      href="javascript:"
      >{{ item }}</a
    >
    <span v-if="pageInfo.end < pages">...</span>
    <a v-if="page < pages" @click="page++" href="javascript:">下一页</a>
  </div>
</template>

<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
