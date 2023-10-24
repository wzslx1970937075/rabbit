<script setup lang="ts">
import { toFormValidator } from "@vee-validate/zod";
import * as zod from "zod";
import { Form, Field, ErrorMessage } from "vee-validate";
import { AuthAPI } from "@/api/AuthAPI";
import { AxiosError } from "axios";
import useCountdown from "@/logics/useCountdown";
import { useUserStore } from "@/stores/userStore";

const $ = getCurrentInstance();
const { start, count, isActive } = useCountdown();
const userStore = useUserStore();
const props = defineProps<{ unionId: string }>();

// 验证用户名是否唯一
const checkAccountUnique = zod.string().refine(
  async (account) => {
    // 发送请求检测用户名是否唯一
    const response = await AuthAPI.checkAccountUnique(account);
    // valid: true 用户名已存在
    // valid: false 用户名可以注册
    // 对于当前的验证函数来说 返回 true 才表示验证通过, 正好和服务端的响应是相反的
    // 所以返回一个取反的值
    return !response.result.valid;
  },
  {
    message: "用户名已存在",
  }
);

// 表单验证规则
const validationSchema = toFormValidator(
  zod
    .object({
      account: zod
        .string({ required_error: "请输入用户名" })
        .regex(/^[a-zA-Z]\w{5,19}$/, "字母开头且6-20个字符"),
      mobile: zod
        .string({ required_error: "请输入手机号" })
        .regex(/^1[3-9]\d{9}$/, "请输入正确的手机号"),
      code: zod
        .string({ required_error: "请输入验证码" })
        .regex(/^\d{6}$/, "验证码格式错误"),
      password: zod
        .string({ required_error: "请输入密码" })
        .regex(/^\w{6,24}$/, "密码是6-24个字符"),
      confirm: zod.string({ required_error: "请再次输入密码" }),
    })
    .refine((data) => data.password === data.confirm, {
      message: "两次密码输入不一致",
      path: ["confirm"],
    })
);

// 创建表单验证对象
const { handleSubmit, validateField, values, setFieldError } = useForm<{
  account: string;
  mobile: string;
  code: string;
  password: string;
}>({
  validationSchema,
});

// 表单提交
const onSubmit = handleSubmit(async (formValues) => {
  try {
    // 检测用户名是否唯一
    await checkAccountUnique.parseAsync(formValues.account);
    // 发送请求 注册账号 绑定QQ
    userStore.login(() =>
      AuthAPI.loginByBindNewAccount(props.unionId, formValues)
    );
  } catch (error) {
    // 如果是验证类型的错误对象
    if (error instanceof zod.ZodError) {
      // 设置错误信息
      setFieldError("account", error.errors[0].message);
    }
  }
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
    await AuthAPI.sendMsgCodeOfRegister(values.mobile);
    // 消息提示
    $?.proxy?.$message({ type: "success", msg: "手机验证码发送成功" });
    // 开始倒计时
    start(60);
  } catch (error) {
    // 消息提示
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
  <form @submit.prevent="onSubmit" class="xtx-form">
    <div class="xtx-form-item">
      <Field as="div" name="account" class="field" v-slot="{ field }">
        <i class="icon iconfont icon-user"></i>
        <input
          v-bind="field"
          class="input"
          type="text"
          placeholder="请输入用户名"
        />
      </Field>
      <ErrorMessage as="div" name="account" class="error"></ErrorMessage>
    </div>
    <div class="xtx-form-item">
      <Field as="div" name="mobile" class="field" v-slot="{ field }">
        <i class="icon iconfont icon-phone"></i>
        <input
          v-bind="field"
          class="input"
          type="text"
          placeholder="请输入手机号"
        />
      </Field>
      <ErrorMessage as="div" name="mobile" class="error"></ErrorMessage>
    </div>
    <div class="xtx-form-item">
      <Field name="code" as="div" class="field" v-slot="{ field }">
        <i class="icon iconfont icon-code"></i>
        <input
          v-bind="field"
          class="input"
          type="text"
          placeholder="请输入验证码"
        />
        <span class="code" @click="sendMsgCode">{{
          isActive ? `剩余${count}秒` : "发送验证码"
        }}</span>
      </Field>
      <ErrorMessage as="div" name="code" class="error"></ErrorMessage>
    </div>
    <div class="xtx-form-item">
      <Field as="div" name="password" class="field" v-slot="{ field }">
        <i class="icon iconfont icon-lock"></i>
        <input
          v-bind="field"
          class="input"
          type="password"
          placeholder="请输入密码"
          autocomplete="on"
        />
      </Field>
      <ErrorMessage as="div" name="password" class="error"></ErrorMessage>
    </div>
    <div class="xtx-form-item">
      <Field as="div" name="confirm" class="field" v-slot="{ field }">
        <i class="icon iconfont icon-lock"></i>
        <input
          v-bind="field"
          class="input"
          type="password"
          placeholder="请确认密码"
          autocomplete="on"
        />
      </Field>
      <ErrorMessage as="div" name="confirm" class="error"></ErrorMessage>
    </div>
    <input type="submit" class="submit" value="立即绑定" />
  </form>
</template>

<style scoped lang="less">
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
