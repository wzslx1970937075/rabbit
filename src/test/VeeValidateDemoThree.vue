<script setup lang="ts">
import { Field, ErrorMessage, Form } from "vee-validate";

// 验证用户名
function username(value: unknown) {
  if (!value) return "请输入用户名";
  if (typeof value !== "string") return "用户名类型错误";
  if (value.length < 2) return "用户名的长度不能小于2";
  return true;
}

// 验证密码
function password(value: unknown) {
  if (!value) return "请输入密码";
  if (typeof value !== "string") return "密码类型错误";
  if (value.length < 6) return "密码的长度不能小于6";
  return true;
}

function onSubmit(formValues: any) {
  console.log(formValues);
}
</script>
<template>
  <!--
    Form 组件默认被渲染成 form 标记
    通过 as 属性可以更改为其他标记
  -->
  <Form
    :validate-on-mount="false"
    :initial-values="{ username: '李四', password: '654321' }"
    v-slot="{ handleSubmit, handleReset, setFieldValue }"
    as=""
  >
    <form class="container mt-6" @submit.prevent="handleSubmit(onSubmit)">
      <!-- 
      Field 组件默认不被渲染成标记
      通过 as 属性可以指定 Field 组件被渲染成什么标记
    -->
      <Field
        :validateOnInput="true"
        name="username"
        class="field"
        as="div"
        :rules="username"
        v-slot="{ field }"
      >
        <label class="label">用户名</label>
        <div class="control has-icons-left">
          <input
            class="input"
            v-bind="field"
            type="text"
            placeholder="请输入用户名"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </div>
        <ErrorMessage name="username" v-slot="{ message }">
          <p class="help is-danger">{{ message }}</p>
        </ErrorMessage>
      </Field>
      <Field
        :validateOnInput="true"
        name="password"
        class="field"
        as="div"
        :rules="password"
        v-slot="{ field }"
      >
        <label class="label">密码</label>
        <div class="control has-icons-left">
          <input
            v-bind="field"
            class="input"
            type="password"
            placeholder="请输入密码"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-key"></i>
          </span>
        </div>
        <ErrorMessage name="password" v-slot="{ message }">
          <p class="help is-danger">{{ message }}</p>
        </ErrorMessage>
      </Field>
      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">提交</button>
        </div>
        <div class="control">
          <button
            @click="handleReset"
            type="button"
            class="button is-link is-light"
          >
            重置
          </button>
        </div>
        <div class="control">
          <button
            type="button"
            class="button is-link is-light"
            @click="
              setFieldValue('username', '李四');
              setFieldValue('password', '654321');
            "
          >
            设置表单值
          </button>
        </div>
      </div>
    </form>
  </Form>
</template>

<style lang="less" scoped>
@import "https://bulma.io/vendor/fontawesome-free-5.15.2-web/css/all.min.css";
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";
</style>
