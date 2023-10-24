import type { Pagination, XtxResponse } from "@/types/Response";
import type { Category } from "@/types/Category";
import type { Goods, GoodsRequestParams } from "@/types/Goods";
import XtxRequestManager from "@/utils/XtxRequestManager";

export class CategoryAPI {
  // 获取导航分类数据
  static getCategories() {
    return XtxRequestManager.instance.request<XtxResponse<Category[]>>({
      url: "/home/category/head",
    });
  }
  // 根据一级分类ID获取一级分类下的具体信息
  static getTopCategoryById(id: string) {
    return XtxRequestManager.instance.request<
      XtxResponse<Category>,
      { id: string }
    >({
      url: "/category",
      data: { id },
    });
  }
  // 根据二级分类ID获取该分类下的商品的筛选条件
  static getSubCategoryFilters(id: string) {
    return XtxRequestManager.instance.request<
      XtxResponse<Category>,
      { id: string }
    >({
      url: "/category/sub/filter",
      data: { id },
    });
  }
  // 获取商品列表
  static getCategoryGoods(
    categoryId: GoodsRequestParams["categoryId"],
    reqParams?: Partial<Omit<GoodsRequestParams, "categoryId">>
  ) {
    return XtxRequestManager.instance.request<
      XtxResponse<Pagination<Goods>>,
      Partial<GoodsRequestParams>
    >({
      url: "/category/goods",
      method: "post",
      data: { categoryId, ...reqParams },
    });
  }
}
