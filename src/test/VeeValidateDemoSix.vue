<script setup lang="ts">
import { Field } from "vee-validate";

const { handleSubmit } = useForm({
  initialValues: {
    users: [],
  },
});
const { remove, push, fields } = useFieldArray<{
  username: string;
  password: string;
}>("users");

const onSubmit = handleSubmit((values) => {
  console.log(values);
});
</script>
<template>
  <form class="container mt-6" @submit="onSubmit">
    <template v-for="(item, idx) in fields" :key="item.key">
      <Field
        as="div"
        :name="`users[${idx}].username`"
        class="field"
        v-slot="{ field }"
      >
        <label class="label">用户名</label>
        <div class="control has-icons-left">
          <input
            v-bind="field"
            class="input"
            type="text"
            placeholder="请输入用户名"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </div>
      </Field>
      <Field
        as="div"
        :name="`users[${idx}].password`"
        class="field"
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
      </Field>
      <div class="field">
        <div class="control">
          <button @click="remove(idx)" type="button" class="button is-danger">
            删除当前用户
          </button>
        </div>
      </div>
    </template>
    <div class="field is-grouped">
      <div class="control">
        <button v-if="fields.length" type="submit" class="button is-link">
          提交
        </button>
        <button
          class="button is-primary"
          @click="push({ username: '', password: '' })"
        >
          添加
        </button>
      </div>
    </div>
  </form>
</template>

<style lang="less" scoped>
@import "https://bulma.io/vendor/fontawesome-free-5.15.2-web/css/all.min.css";
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";
</style>
