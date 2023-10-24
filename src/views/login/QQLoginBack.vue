<script setup lang="ts">
import { AuthAPI } from "@/api/AuthAPI";
import { useUserStore } from "@/stores/userStore";

const hasAccount = ref(true);
// 获取QQ联合中和登录相关的API
const Login = window.QC.Login;
// 获取路由信息对象
const router = useRouter();
// 获取用于存储用户信息的store 对象
const userStore = useUserStore();
// 获取组件实例对象
const $ = getCurrentInstance();

// 用于存储 openid
const unionId = ref("");

// 1. 获取地址栏中的 access_token 值
// 2. 向QQ互联服务器发送请求使用 access_token 换取用户的唯一标识 openid
// https://graph.qq.com/oauth2.0/me?access_token=B204C56879FC0C2818AF844746BD6959
Login.getMe((openid: string) => {
  // 存储 openid
  unionId.value = openid;
  // 发送请求, 进行账号绑定的监测
  userStore.login(() => AuthAPI.loginByQQOpenid(openid, 1));
});

watch(
  () => userStore.profile.status,
  (status) => {
    // 如果登录成功
    if (status === "success") {
      // 消息提示
      $?.proxy?.$message({ type: "success", msg: "登录成功" });
      // 跳转到首页
      router.push("/");
    } else if (status === "error") {
      // 如果登录失败
      $?.proxy?.$message({
        type: "error",
        msg: userStore.profile.error + ", 请绑定账号",
      });
    }
  }
);
</script>

<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="userStore.profile.status == 'loading'">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a
        @click="hasAccount = true"
        :class="{ active: hasAccount }"
        href="javascript:"
      >
        <i class="iconfont icon-bind"></i>
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a
        @click="hasAccount = false"
        :class="{ active: !hasAccount }"
        href="javascript:"
      >
        <i class="iconfont icon-edit"></i>
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <QQLoginBindPhone :unionId="unionId" />
    </div>
    <div class="tab-content" v-else>
      <QQLoginRegisterNew :unionId="unionId" />
    </div>
  </section>
  <LoginFooter />
</template>

<style scoped lang="less">
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
}
.unbind {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 25px 0;
  z-index: 99;
  .loading {
    height: 100%;
    background: #fff url(@/assets/images/load.gif) no-repeat center / 100px
      100px;
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
