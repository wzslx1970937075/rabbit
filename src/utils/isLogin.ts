import type { User } from "@/types/User";

export default function isLogin() {
  // 获取本地存储中的 user 字符串
  let localStoreUser = localStorage.getItem("user");
  // 用于存储 user 对象
  let user: { profile: { result: User } } | undefined = undefined;
  // 如果从本地存储中获取到了 user
  if (localStoreUser != null) {
    // 将 user 字符串转换成 user 对象
    user = JSON.parse(localStoreUser);
  }
  // user 值有两种情况
  // undefined: 未登录(一次都没有)
  // {profile: {result: {}}} 登录再退出
  return !(
    typeof user == "undefined" ||
    typeof user.profile.result.token === "undefined"
  );
}
