import type {
  OrderOfCreateResponse,
  EditAdressObject,
  Address,
  SubmitOrderObject,
  SubmitOrderResponse,
  OrderResponse,
  LogisticsResponse,
} from "@/types/Order";
import type { Pagination, XtxResponse } from "@/types/Response";
import XtxRequestManager from "@/utils/XtxRequestManager";

export class OrderAPI {
  // 生成订单
  static createOrder() {
    return XtxRequestManager.instance.request<
      XtxResponse<OrderOfCreateResponse>
    >({
      url: "/member/order/pre",
    });
  }
  // 添加收货地址
  static addAddress(address: EditAdressObject) {
    return XtxRequestManager.instance.request<
      XtxResponse<{ id: string }>,
      EditAdressObject
    >({
      url: "/member/address",
      method: "post",
      data: address,
    });
  }
  // 获取收货地址列表
  static getAddress() {
    return XtxRequestManager.instance.request<XtxResponse<Address[]>>({
      url: "/member/address",
    });
  }
  // 修改收货地址
  static updateAddress(id: string, address: EditAdressObject) {
    return XtxRequestManager.instance.request<
      XtxResponse<{ id: string }>,
      EditAdressObject
    >({
      url: `/member/address/${id}`,
      method: "put",
      data: address,
    });
  }
  // 提交订单
  static submitOrder(order: SubmitOrderObject) {
    return XtxRequestManager.instance.request<
      XtxResponse<SubmitOrderResponse>,
      SubmitOrderObject
    >({
      url: "/member/order",
      method: "post",
      data: order,
    });
  }
  // 获取订单详情
  static getOrderInfoById(id: string) {
    return XtxRequestManager.instance.request<XtxResponse<OrderResponse>>({
      url: `/member/order/${id}`,
    });
  }
  // 获取我的订单列表
  static getMyOrders(arg: {
    page: number;
    pageSize: number;
    orderState: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  }) {
    return XtxRequestManager.instance.request<
      XtxResponse<Pagination<OrderResponse>>,
      // orderState: 订单状态，0为全部、1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消
      { page: number; pageSize: number; orderState: 0 | 1 | 2 | 3 | 4 | 5 | 6 }
    >({
      url: "/member/order",
      data: arg,
    });
  }
  // 取消订单
  static cancelOrder(id: string, cancelReason: string) {
    return XtxRequestManager.instance.request<
      XtxResponse<OrderResponse>,
      { cancelReason: string }
    >({
      url: `/member/order/${id}/cancel`,
      method: "put",
      data: {
        cancelReason,
      },
    });
  }
  // 删除订单
  static removeOrder(ids: string[]) {
    return XtxRequestManager.instance.request<
      XtxResponse<null>,
      { ids: string[] }
    >({
      url: "/member/order",
      method: "delete",
      data: {
        ids,
      },
    });
  }
  // 确认收货
  static confirmReceiptGoods(id: string) {
    return XtxRequestManager.instance.request<XtxResponse<OrderResponse>>({
      url: `/member/order/${id}/receipt`,
      method: "put",
    });
  }
  // 查看物流信息
  static viewLogistics(id: string) {
    return XtxRequestManager.instance.request<XtxResponse<LogisticsResponse>>({
      url: `/member/order/${id}/logistics`,
    });
  }
  // 再次购买
  static createOrderById(id: string) {
    return XtxRequestManager.instance.request<
      XtxResponse<OrderOfCreateResponse>
    >({
      url: `/member/order/repurchase/${id}`,
    });
  }
}
