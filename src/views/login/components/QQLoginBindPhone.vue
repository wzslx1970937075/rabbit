<script setup lang="ts">
import { toFormValidator } from "@vee-validate/zod";
import * as zod from "zod";
import { Field, ErrorMessage } from "vee-validate";
import { AuthAPI } from "@/api/AuthAPI";
import useCountdown from "@/logics/useCountdown";
import { AxiosError } from "axios";
import { useUserStore } from "@/stores/userStore";

const props = defineProps<{ unionId: string }>();
const $ = getCurrentInstance();
const { count, start, isActive } = useCountdown();
const userStore = useUserStore();

// 用于存储QQy用户信息
const QQUserInfo = reactive({
  nickname: "",
  figureurl: "",
});
// 获取QQ用户的头像和昵称
window.QC.api("get_user_info").success(function (response: any) {
  // 存储头像url
  QQUserInfo.figureurl = response.data.figureurl_1;
  // 存储昵称
  QQUserInfo.nickname = response.data.nickname;
});

// 表单验证规则
const validationSchema = toFormValidator(
  zod.object({
    mobile: zod
      .string({ required_error: "请输入手机号" })
      .regex(/^1[3-9]\d{9}$/, "请输入正确的手机号"),
    code: zod
      .string({ required_error: "请输入验证码" })
      .regex(/^\d{6}$/, "验证码格式错误"),
  })
);

const { handleSubmit, validateField, values } = useForm<{
  mobile: string;
  code: string;
}>({
  validationSchema,
});

// 表单提交
const onSubmit = handleSubmit((formValues) => {
  // 发送请求 绑定已有账号
  userStore.login(() =>
    AuthAPI.loginByBindAccount(
      formValues.mobile,
      formValues.code,
      props.unionId
    )
  );
});

// 发送手机验证码
async function sendMsgCode() {
  // 验证用户是否填写了手机号
  let { valid } = await validateField("mobile");
  // 验证未通过
  if (!valid) return;
  // 如果正在倒计时
  if (isActive.value) return;
  // 捕获错误
  try {
    // 发送手机验证码
    await AuthAPI.sendMsgCodeOfBindQQ(values.mobile, props.unionId, 1);
    // 消息提示
    $?.proxy?.$message({ type: "success", msg: "验证码发送成功" });
    // 开启倒计时
    start(60);
  } catch (error) {
    if (error instanceof AxiosError) {
      // 消息提示
      $?.proxy?.$message({ type: "error", msg: error.response?.data.message });
    } else {
      // 消息提示
      $?.proxy?.$message({ type: "error", msg: "手机验证码发送失败" });
    }
  }
}
</script>

<template>
  <form class="xtx-form" @submit.prevent="onSubmit">
    <div class="user-info">
      <img :src="QQUserInfo.figureurl" alt="" />
      <p>
        Hi, {{ QQUserInfo.nickname }} 欢迎来小兔鲜,
        完成绑定后可以QQ账号一键登录哦~
      </p>
    </div>
    <div class="xtx-form-item">
      <Field as="div" name="mobile" class="field" v-slot="{ field }">
        <i class="icon iconfont icon-phone"></i>
        <input
          v-bind="field"
          class="input"
          type="text"
          placeholder="绑定的手机号"
        />
      </Field>
      <ErrorMessage as="div" name="mobile" class="error"></ErrorMessage>
    </div>
    <div class="xtx-form-item">
      <Field as="div" name="code" class="field" v-slot="{ field }">
        <i class="icon iconfont icon-code"></i>
        <input
          v-bind="field"
          class="input"
          type="text"
          placeholder="短信验证码"
        />
        <span class="code" @click="sendMsgCode">{{
          isActive ? `剩余${count}秒` : "发送验证码"
        }}</span>
      </Field>
      <ErrorMessage as="div" name="code" class="error"></ErrorMessage>
    </div>
    <input type="submit" class="submit" value="立即绑定" />
  </form>
</template>

<style scoped lang="less">
.user-info {
  width: 320px;
  height: 70px;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin: 0 auto 20px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
