import type { Status } from "@/types/Status";
import type { CollectionParams, CollectionResponse } from "@/types/Member";
import type { Pagination } from "@/types/Response";
import { MemberAPI } from "@/api/MemberAPI";

type State = {
  // 我的收藏
  collections: {
    // 1. 商品  2. 专题  3. 品牌
    [type in 1 | 2 | 3]: {
      result: Pagination<CollectionResponse>;
      status: Status;
    };
  };
};
type Getters = {};
type Actions = {
  // 获取我的收藏
  getCollections(params: CollectionParams): Promise<void>;
};

export const useMemberStore = defineStore<"member", State, Getters, Actions>(
  "member",
  {
    state: () => ({
      collections: {
        1: {
          result: {
            page: 0,
            pages: 0,
            pageSize: 0,
            counts: 0,
            items: [],
          },
          status: "idle",
        },
        2: {
          result: {
            page: 0,
            pages: 0,
            pageSize: 0,
            counts: 0,
            items: [],
          },
          status: "idle",
        },
        3: {
          result: {
            page: 0,
            pages: 0,
            pageSize: 0,
            counts: 0,
            items: [],
          },
          status: "idle",
        },
      },
    }),
    actions: {
      // 获取我的收藏
      async getCollections(params) {
        // 更新加载状态
        this.collections[params.collectType].status = "loading";
        // 捕获错误
        try {
          // 发送请求 获取我的收藏
          const response = await MemberAPI.getCollections(params);
          console.log(response);
          // 存储我的收藏状态
          this.collections[params.collectType].result = response.result;
          // 更新加载状态
          this.collections[params.collectType].status = "success";
        } catch (error) {
          // 更新加载状态
          this.collections[params.collectType].status = "error";
        }
      },
    },
  }
);
