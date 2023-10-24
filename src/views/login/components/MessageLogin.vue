<script setup lang="ts">
import { AuthAPI } from "@/api/AuthAPI";
import { toFormValidator } from "@vee-validate/zod";
import { Field, ErrorMessage } from "vee-validate";
import useCountdown from "@/logics/useCountdown";
import * as zod from "zod";
import { AxiosError } from "axios";
import { useUserStore } from "@/stores/userStore";

// 获取组件实例对象
const $ = getCurrentInstance();
// 获取倒计时逻辑
const { start, isActive, count } = useCountdown();
// 获取用于存储用户信息的 store
const userStore = useUserStore();

// 创建表单验证规则
const validationSchema = toFormValidator(
  zod.object({
    mobile: zod
      .string({ required_error: "请输入手机号" })
      .regex(/^1[3-9]\d{9}$/, "请输入正确的手机号"),
    code: zod
      .string({ required_error: "请输入验证码" })
      .regex(/^\d{6}$/, "验证码格式错误"),
    isAgree: zod.literal(true, {
      errorMap: () => ({ message: "请勾选同意用户协议" }),
    }),
  })
);

// 创建表单验证对象
const { handleSubmit, values, validateField, setFieldValue } = useForm<{
  mobile: string;
  code: string;
  isAgree: boolean;
}>({
  validationSchema: validationSchema,
});

// 表单提交
const onSubmit = handleSubmit((formValue) => {
  // 发送登录请求
  userStore.login(() =>
    AuthAPI.loginByMobileMsgCode(formValue.mobile, formValue.code)
  );
});

async function sendMsgCode() {
  // 验证是否填写手机号
  let { valid } = await validateField("mobile");
  // 验证不通过 代码停止执行
  if (!valid) return;
  // 正在倒计时 代码停止执行
  if (isActive.value) return;
  // 捕获错误
  try {
    // 验证通过 发送手机验证码
    await AuthAPI.sendMsgCodeOfMobileLogin(values.mobile);
    // 消息提示
    $?.proxy?.$message({ type: "success", msg: "手机验证码发送成功" });
    // 倒计时
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
  <form @submit="onSubmit">
    <Field name="mobile" as="div" class="form-item" v-slot="{ field }">
      <div class="input">
        <i class="iconfont icon-user"></i>
        <input v-bind="field" type="text" placeholder="请输入手机号" />
      </div>
      <ErrorMessage name="mobile" v-slot="{ message }">
        <div class="error">
          <i class="iconfont icon-warning"></i>{{ message }}
        </div>
      </ErrorMessage>
    </Field>
    <Field name="code" as="div" class="form-item" v-slot="{ field }">
      <div class="input">
        <i class="iconfont icon-code"></i>
        <input v-bind="field" type="password" placeholder="请输入验证码" />
        <span class="code" @click="sendMsgCode">{{
          isActive ? `剩余${count}秒` : "发送验证码"
        }}</span>
      </div>
      <ErrorMessage name="code" v-slot="{ message }">
        <div class="error">
          <i class="iconfont icon-warning"></i> {{ message }}
        </div>
      </ErrorMessage>
    </Field>
    <Field name="isAgree" as="div" class="form-item">
      <div class="agree">
        <XtxCheckbox
          :default-without-v-model="values.isAgree"
          @update:model-value="
            setFieldValue('isAgree', $event);
            validateField('isAgree');
          "
        />
        <span>我已同意</span>
        <a href="javascript:">《隐私条款》</a>
        <span>和</span>
        <a href="javascript:">《服务条款》</a>
      </div>
      <ErrorMessage name="isAgree" v-slot="{ message }">
        <div class="error">
          <i class="iconfont icon-warning"></i> {{ message }}
        </div>
      </ErrorMessage>
    </Field>
    <button type="submit" class="btn">登录</button>
  </form>
</template>
