<script lang="ts" setup>
import { useCategoryStore } from "@/stores/categoryStore";
import { CATEGORIES } from "@/contants/categories";

// 获取用于存储分类的 store
const categoryStore = useCategoryStore();
// 获取分类数据
const { categories } = storeToRefs(categoryStore);
// 获取请求分类数据的方法和切换二级分类显示隐藏的方法
const { toggle, getCategories } = categoryStore;
// 发送请求获取分类数据
getCategories();
</script>

<template>
  <ul class="app-header-nav">
    <li class="home"><router-link to="/">首页</router-link></li>
    <template v-if="categories.status !== 'success'">
      <li v-for="category in CATEGORIES" :key="category.id">
        <RouterLink :to="`/category/${category.id}`">
          {{ category.name }}
        </RouterLink>
      </li>
    </template>
    <template v-else>
      <li
        v-for="category in categories.headerNav"
        :key="category.id"
        @mouseenter="toggle(category.id, true)"
        @mouseleave="toggle(category.id, false)"
        @click="toggle(category.id, false)"
      >
        <RouterLink :to="`/category/${category.id}`">{{
          category.name
        }}</RouterLink>
        <div class="layer" :class="{ open: category.isOpen }">
          <ul>
            <li v-for="subCategory in category.children">
              <RouterLink
                :to="`/category/sub/${category.id}/${subCategory.id}`"
              >
                <img :src="subCategory.picture" alt="" />
                <p>{{ subCategory.name }}</p>
              </RouterLink>
            </li>
          </ul>
        </div>
      </li>
    </template>
  </ul>
</template>

<style scoped lang="less">
.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 998;

  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;

    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }

    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
    }
  }
  .layer {
    width: 1240px;
    background-color: #fff;
    position: absolute;
    left: -200px;
    top: 56px;
    height: 0;
    overflow: hidden;
    opacity: 0;
    box-shadow: 0 0 5px #ccc;
    transition: all 0.2s 0.1s;
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0 70px;
      align-items: center;
      height: 132px;
      li {
        width: 110px;
        text-align: center;
        img {
          width: 60px;
          height: 60px;
        }
        p {
          padding-top: 10px;
        }
        &:hover {
          p {
            color: @xtxColor;
          }
        }
      }
    }
    &.open {
      height: 132px;
      opacity: 1;
    }
  }
}
</style>
