<script setup lang="ts">
import { useCartStore } from "@/stores/cartStore";
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const cartStore = useCartStore();
const router = useRouter();
const { profile } = storeToRefs(userStore);

function logout() {
  // 清除用户信息
  userStore.$reset();
  // 清空购物车信息
  cartStore.$reset();
  // 跳转到首页
  router.push("/login");
}
</script>
<template>
  <nav class="app-top-nav">
    <div class="container">
      <ul>
        <template v-if="profile.result.token">
          <li>
            <RouterLink to="/member/home">
              <i class="iconfont icon-user"></i>
              {{ profile.result.account }}
            </RouterLink>
          </li>
          <li><a href="javascript:" @click="logout">退出登录</a></li>
        </template>
        <template v-else>
          <li><RouterLink to="/login">请先登录</RouterLink></li>
          <li><a href="javascript:">免费注册</a></li>
        </template>
        <li><a href="javascript:">我的订单</a></li>
        <li><a href="javascript:">会员中心</a></li>
        <li><a href="javascript:">帮助中心</a></li>
        <li><a href="javascript:">关于我们</a></li>
        <li>
          <a href="javascript:"><i class="iconfont icon-phone"></i>手机版</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped lang="less">
.app-top-nav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
