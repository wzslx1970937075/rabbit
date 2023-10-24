import type {
  Evaluate,
  EvaluateInfo,
  EvaluateRequestParams,
  Goods,
} from "@/types/Goods";
import type { Pagination, XtxResponse } from "@/types/Response";
import XtxRequestManager from "@/utils/XtxRequestManager";

export class GoodsAPI {
  // 根据商品 id 获取商品的详细信息
  static getGoodsInfo(id: string) {
    return XtxRequestManager.instance.request<
      XtxResponse<Goods>,
      { id: string }
    >({
      url: "/goods",
      data: { id },
    });
  }
  // 获取同类商品
  // id: 商品id, 传递了商品id表示同类推荐, 没传则表示猜你喜欢
  // limit: 限制请求的商品数量
  static getRelevantGoods(args?: { id?: string; limit?: number }) {
    // 如果传递了 arg 但是没有传递 limit
    if (typeof args !== "undefined" && typeof args.limit === "undefined") {
      args.limit = 16;
    } else {
      // 如果没有传递 arg
      args = { limit: 16 };
    }
    return XtxRequestManager.instance.request<
      XtxResponse<Goods[]>,
      { id?: string; limit?: number }
    >({
      url: "/goods/relevant",
      data: args,
    });
  }
  // 获取热榜
  static getHotSaleGoods(id: string, type: number, limit: number) {
    return XtxRequestManager.instance.request<
      XtxResponse<Goods[]>,
      { id: string; type: number; limit: number }
    >({
      url: "/goods/hot",
      data: { id, type, limit },
    });
  }
  // 获取商品评价信息
  static getEvaluateInfo(id: string) {
    return XtxRequestManager.instance.request<XtxResponse<EvaluateInfo>>({
      url: `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`,
    });
  }
  // 获取商品评价列表
  static getEvaluateList(id: string, reqParams: EvaluateRequestParams) {
    return XtxRequestManager.instance.request<
      XtxResponse<Pagination<Evaluate>>,
      EvaluateRequestParams
    >({
      url: `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`,
      data: reqParams,
    });
  }
}
