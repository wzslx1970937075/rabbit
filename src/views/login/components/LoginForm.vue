<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
// 获取组件实例
const $ = getCurrentInstance();
// 获取路由对象
const router = useRouter();
// 获取路由信息对象
const route = useRoute();

// 是否为账号登录
const accountLogin = ref(true);

// 监听登录状态
watch(
  () => userStore.profile.status,
  (status) => {
    // 如果登录成功
    if (status === "success") {
      // 消息提示
      $?.proxy?.$message({ type: "success", msg: "登录成功" });
      // 检测路由地址中是否存在 return 参数
      // return: string | null
      console.log(route.query);
      if (typeof route.query.return !== "undefined") {
        // 跳转到目标页面
        router.push(route.query.return as string);
      } else {
        // 跳转到首页
        router.push("/");
      }
    } else if (status === "error") {
      // 如果登录失败
      $?.proxy?.$message({ type: "error", msg: userStore.profile.error });
    }
  }
);
</script>

<template>
  <div class="account-box">
    <div class="toggle">
      <button v-if="!accountLogin" @click="accountLogin = true">
        <i class="iconfont icon-user"></i> 使用账号登录
      </button>
      <button v-else @click="accountLogin = false">
        <i class="iconfont icon-msg"></i> 使用短信登录
      </button>
    </div>
    <div class="form">
      <!-- 账户登录 -->
      <AccountLogin v-if="accountLogin" />
      <!-- 短信登录 -->
      <MessageLogin v-else />
    </div>
    <div class="action">
      <a
        href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback"
        id="qqLoginBtn"
      >
        <img
          src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
          alt=""
        />
      </a>

      <div class="url">
        <a href="javascript:">忘记密码</a>
        <a href="javascript:">免费注册</a>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    button {
      color: @xtxColor;
      background: none;
      border: none;
      cursor: pointer;
      i {
        font-size: 14px;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
