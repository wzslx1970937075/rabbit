import { defineRule } from "vee-validate";

// 必填
defineRule("required", (value: string): true | string => {
  if (!value) return "该字段必填";
  return true;
});

// 用户名
defineRule("account", (value: string): true | string => {
  if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return "字母开头且6-20个字符";
  return true;
});

// 密码
defineRule("password", (value: string): true | string => {
  if (!/^\w{6,24}$/.test(value)) return "密码是6-24个字符";
  return true;
});

// 手机号
defineRule("phoneNumber", (value: string): true | string => {
  if (!/^1[3-9]\d{9}$/.test(value)) return "手机号格式错误";
  return true;
});

// 验证码
defineRule("msgNumber", (value: string): true | string => {
  if (!/^\d{6}$/.test(value)) return "验证码是6个数字";
  return true;
});

// 是否同意协议
defineRule("isAgree", (value: boolean): true | string => {
  if (value === false) return "请勾选同意用户协议";
  return true;
});
