import { GoodsAPI } from "@/api/GoodsAPI";
import type {
  EvaluateInfo,
  Evaluate,
  Goods,
  GoodsDetailInfo,
  EvaluateRequestParams,
} from "@/types/Goods";
import type { Pagination } from "@/types/Response";
import type { Status } from "@/types/Status";
import _ from "lodash";

// 声明组件向外部传递的状态的类型规范
export interface Data {
  price: string;
  oldPrice: string;
  inventory: number;
  skuId: string;
}

type State = {
  // 商品信息
  goodsInfo: {
    status: Status;
    result: Goods;
  };
  // 同类商品和猜你喜欢
  relevantAndLike: {
    // 加载状态
    status: Status;
    // 同类商品
    relevantGoods: { [id: string]: Goods[][] };
    // 猜你喜欢
    likeGoods: Goods[][];
  };
  // 榜单状态
  hotSaleGoods: {
    status: Status;
    result: {
      // 24小时榜
      1: Goods[];
      // 周榜
      2: Goods[];
      // 总榜
      3: Goods[];
    };
  };
  // 商品评价信息
  evaluateInfo: {
    result: EvaluateInfo;
    status: Status;
  };
  // 商品评价列表
  evaluateList: {
    result: Pagination<Evaluate>;
    status: Status;
  };
};

type Actions = {
  // 根据商品id获取商品信息
  getGoodsInfo(id: string): Promise<void>;
  // 更新商品信息(规格更新)
  updateGoods(data: Data): void;
  // 获取同类商品(猜你喜欢)
  getRelevantLikeGoods(args?: { id?: string; limit?: number }): Promise<void>;
  // 获取榜单
  getHotSaleGoods(id: string, type: 1 | 2 | 3, limit: number): Promise<void>;
  // 获取评价头部信息
  getEvaluateInfo(id: string): Promise<void>;
  // 获取评价列表
  getEvaluateList(id: string, reqParams: EvaluateRequestParams): Promise<void>;
};

type Getters = {
  // 获取商品图片
  mainPictures(): string[];
  // 获取商品基本信息
  baseInfo(): Pick<Goods, "name" | "desc" | "price" | "oldPrice">;
  // 获取商品详情信息
  goodsProperties(): GoodsDetailInfo;
};

export const useGoodsStore = defineStore<"Goods", State, Getters, Actions>(
  "Goods",
  {
    state: () => ({
      // 商品信息
      goodsInfo: {
        status: "idle",
        result: {
          id: "",
          name: "",
          desc: "",
          price: "",
          picture: "",
          discount: null,
          orderNum: null,
          spuCode: "",
          oldPrice: "",
          inventory: 0,
          brand: [],
          salesCount: 0,
          commentCount: 0,
          collectCount: 0,
          mainVideos: [],
          videoScale: 0,
          mainPictures: [],
          specs: [],
          skus: [],
          categories: [],
          details: {
            pictures: [],
            properties: [],
          },
          isPreSale: false,
          isCollect: false,
          userAddresses: null,
          similarProducts: [],
          hotByDay: [],
          evaluationInfo: null,
        },
      },
      // 同类商品和猜你喜欢
      relevantAndLike: {
        // 加载状态
        status: "idle",
        // 同类商品
        relevantGoods: {},
        // 猜你喜欢
        likeGoods: [],
      },
      // 榜单
      hotSaleGoods: {
        status: "idle",
        result: {
          1: [],
          2: [],
          3: [],
        },
      },
      // 商品评价信息
      evaluateInfo: {
        result: {
          salesCount: 0,
          praisePercent: "",
          evaluateCount: 0,
          hasPictureCount: 0,
          tags: [],
        },
        status: "idle",
      },
      // 商品评价列表
      evaluateList: {
        result: {
          page: 0,
          pages: 0,
          pageSize: 0,
          counts: 0,
          items: [],
        },
        status: "idle",
      },
    }),
    actions: {
      // 根据商品id获取商品信息
      async getGoodsInfo(id) {
        // 更新加载状态
        this.goodsInfo.status = "loading";
        // 捕获错误
        try {
          // 发送请求, 根据商品 id 获取商品详细信息
          let response = await GoodsAPI.getGoodsInfo(id);
          // 存储商品详细信息
          this.goodsInfo.result = response.result;
          // 更新加载状态
          this.goodsInfo.status = "success";
        } catch (e) {
          // 更新加载状态
          this.goodsInfo.status = "error";
        }
      },
      // 更新商品信息(规格更新)
      updateGoods(data) {
        this.goodsInfo.result.price = data.price;
        this.goodsInfo.result.oldPrice = data.oldPrice;
        this.goodsInfo.result.inventory = data.inventory;
      },
      // 获取同类商品
      async getRelevantLikeGoods(args) {
        // 更新加载状态
        this.relevantAndLike.status = "loading";
        // 捕获错误
        try {
          // 发送请求获取同类商品
          let response = await GoodsAPI.getRelevantGoods(args);
          // 为商品进行分组, 4个商品一组
          let result = _.chunk(response.result, 4);
          // 存储同类商品
          if (args?.id) {
            this.relevantAndLike.relevantGoods[args.id] = result;
          } else {
            // 存储猜你喜欢
            this.relevantAndLike.likeGoods = result;
          }
          // 更新加载状态
          this.relevantAndLike.status = "success";
        } catch (e) {
          // 更新加载状态
          this.relevantAndLike.status = "error";
        }
      },
      // 获取榜单
      async getHotSaleGoods(id, type, limit) {
        // 更新加载状态
        this.hotSaleGoods.status = "loading";
        // 捕获错误
        try {
          // 发送请求获取榜单商品
          let response = await GoodsAPI.getHotSaleGoods(id, type, limit);
          // 按照榜单类别存储榜单商品
          this.hotSaleGoods.result[type] = response.result;
          // 更新加载状态
          this.hotSaleGoods.status = "success";
        } catch (e) {
          // 更新加载状态
          this.hotSaleGoods.status = "error";
        }
      },
      // 获取评价头部信息
      async getEvaluateInfo(id) {
        // 更新加载状态
        this.evaluateInfo.status = "loading";
        // 捕获错误
        try {
          // 发送请求获取评价头部信息
          let response = await GoodsAPI.getEvaluateInfo(id);
          // 存储评价头部信息
          this.evaluateInfo.result = response.result;
          // 更新加载状态
          this.evaluateInfo.status = "success";
        } catch (e) {
          // 更新加载状态
          this.evaluateInfo.status = "error";
        }
      },
      // 获取评价列表
      async getEvaluateList(id, reqParams) {
        // 更新加载状态
        this.evaluateList.status = "loading";
        // 捕获错误
        try {
          // 发送请求获取评价列表
          let response = await GoodsAPI.getEvaluateList(id, reqParams);
          // 存储评价列表
          this.evaluateList.result = response.result;
          // 更新加载状态
          this.evaluateList.status = "success";
        } catch (e) {
          // 更新加载状态
          this.evaluateList.status = "error";
        }
      },
    },
    getters: {
      // 获取商品图片
      mainPictures() {
        return this.goodsInfo.result.mainPictures;
      },
      // 获取商品基本信息
      baseInfo() {
        const { name, desc, price, oldPrice } = this.goodsInfo.result;
        return {
          name,
          desc,
          price,
          oldPrice,
        };
      },
      // 获取商品详情信息
      goodsProperties() {
        return {
          pictures: this.goodsInfo.result.details.pictures,
          properties: this.goodsInfo.result.details.properties,
        };
      },
    },
  }
);
