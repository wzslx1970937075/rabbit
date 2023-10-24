import type { Cart } from "@/types/Cart";
import type { Sku, Spec } from "@/types/Goods";
import type { XtxResponse } from "@/types/Response";
import XtxRequestManager from "@/utils/XtxRequestManager";

export class CartAPI {
  // 将商品加入购物车
  static addProductToCart(skuId: string, count: number) {
    return XtxRequestManager.instance.request<
      XtxResponse<Cart>,
      { skuId: string; count: number }
    >({
      url: "/member/cart",
      method: "post",
      data: { skuId, count },
    });
  }
  // 获取购物车商品列表
  static getCarts() {
    return XtxRequestManager.instance.request<XtxResponse<Cart[]>>({
      url: "/member/cart",
    });
  }
  // 删除购物车中的商品
  static removeGoodsOfCart(args: {
    ids?: string[];
    clearAll?: boolean;
    clearInvalid?: boolean;
  }) {
    return XtxRequestManager.instance.request<
      XtxResponse<boolean>,
      { ids?: string[]; clearAll?: boolean; clearInvalid?: boolean }
    >({
      url: "/member/cart",
      method: "delete",
      data: args,
    });
  }
  // 修改购物车商品信息
  static alterCartGoods(args: {
    id: string;
    selected?: boolean;
    count?: number;
  }) {
    return XtxRequestManager.instance.request<
      XtxResponse<Cart>,
      {
        id: string;
        selected?: boolean;
        count?: number;
      }
    >({
      url: `/member/cart/${args.id}`,
      method: "put",
      data: args,
    });
  }
  // 全选、取消全选
  static selecteAndDeselect(selected: boolean) {
    return XtxRequestManager.instance.request<
      XtxResponse<null>,
      { selected: boolean }
    >({
      url: "/member/cart/selected",
      method: "put",
      data: {
        selected,
      },
    });
  }
  // 获取商品规格信息
  // id -> skuid
  static getSkuInfo(id: string) {
    return XtxRequestManager.instance.request<
      XtxResponse<{ specs: Spec[]; skus: Sku[] }>
    >({
      url: `/goods/sku/${id}`,
    });
  }
}
