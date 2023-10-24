import { AxiosError } from "axios";
import type { Status } from "@/types/Status";
import type { User } from "@/types/User";
import type { XtxResponse } from "@/types/Response";

type State = {
  // 用户信息
  profile: {
    result: Partial<User>;
    status: Status;
    error: string;
  };
};

type Getters = {};

type Actions = {
  // 登录
  login(callback: () => Promise<XtxResponse<User>>): Promise<void>;
};

export const useUserStore = defineStore<"user", State, Getters, Actions>(
  "user",
  {
    state: () => ({
      // 用户信息
      profile: {
        result: {},
        status: "idle",
        error: "",
      },
    }),
    actions: {
      // 用户登录(账号密码、手机验证码、QQ openid 登录)
      async login(callback) {
        // 更新加载状态
        this.profile.status = "loading";
        // 重置错误信息
        this.profile.error = "";
        // 捕获错误
        try {
          // 服务端响应的状态类型
          let response = await callback();
          // 更新加载状态
          this.profile.status = "success";
          // 存储用户信息
          this.profile.result = response.result;
        } catch (error) {
          // 更新加载状态
          this.profile.status = "error";
          // 存储错误信息
          if (error instanceof AxiosError) {
            this.profile.error = error.response?.data.message;
          } else if (error instanceof Error) {
            this.profile.error = error.message;
          }
        }
      },
    },
    persist: true,
  }
);
