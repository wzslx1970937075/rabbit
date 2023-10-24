<script setup lang="ts">
// useField<string>: 该泛型设置的是要绑定的值的类型, 即 value 的类型

// 用户名字段
const {
  value: usernameField,
  errorMessage: usernameError,
  meta: usernameMeta,
  resetField: usernameReset,
  setValue: setValueOfUsername,
  validate: usernameValidate,
  // value 类型
} = useField<string>("username", username, { initialValue: "李四" });
// 密码字段
const {
  value: passwordField,
  errorMessage: passwordError,
  meta: passwordMeta,
  resetField: passwordReset,
  setValue: setValueOfPassword,
  validate: passwordValidate,
} = useField<string>("password", password, { initialValue: "654321" });

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

// 表单提交
function onSubmit() {
  usernameValidate();
  passwordValidate();
  if (!usernameMeta.valid) return;
  if (!passwordMeta.valid) return;
  console.log(usernameField.value);
  console.log(passwordField.value);
}

// 重置表单
function onReset() {
  // 重置表单表示将每个表单重置为默认值状态而不是清空
  usernameReset();
  passwordReset();
}

// 设置表单值
function onSet() {
  setValueOfUsername("张三");
  setValueOfPassword("123456");
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="container mt-6">
    <div class="field">
      <label class="label">用户名</label>
      <div class="control has-icons-left">
        <input
          class="input"
          type="text"
          placeholder="请输入用户名"
          v-model="usernameField"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
      </div>
      <p class="help is-danger" v-if="usernameError">{{ usernameError }}</p>
    </div>
    <div class="field">
      <label class="label">密码</label>
      <div class="control has-icons-left">
        <input
          class="input"
          type="password"
          placeholder="请输入密码"
          v-model="passwordField"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-key"></i>
        </span>
      </div>
      <p class="help is-danger" v-if="passwordError">{{ passwordError }}</p>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link">提交</button>
      </div>
      <div class="control">
        <button @click="onReset" type="button" class="button is-link is-light">
          重置
        </button>
      </div>
      <div class="control">
        <button type="button" class="button is-link is-light" @click="onSet">
          设置表单值
        </button>
      </div>
    </div>
  </form>
</template>

<style lang="less" scoped>
@import "https://bulma.io/vendor/fontawesome-free-5.15.2-web/css/all.min.css";
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";
</style>
