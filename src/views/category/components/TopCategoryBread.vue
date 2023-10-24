<script setup lang="ts">
import { useCategoryStore } from "@/stores/categoryStore";
// 获取用于存储分类状态的 store 对象
const categoryStore = useCategoryStore();
// 获取用于存储路由信息的对象
const route = useRoute();
// 获取当前页面的分类信息
const target = computed(() =>
  categoryStore.currentTop(route.params.id as string)
);
</script>
<template>
  <XtxBread>
    <XtxBreadItem path="/">首页</XtxBreadItem>
    <transition name="fade-right" mode="out-in">
      <XtxBreadItem :key="target?.id">{{ target?.name }}</XtxBreadItem>
    </transition>
  </XtxBread>
</template>
