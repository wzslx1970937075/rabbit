import type { Status } from "@/types/Status";
import type {
  Address,
  EditAdressObject,
  OrderResponse,
  OrderOfCreateResponse,
  SubmitOrderObject,
  SubmitOrderResponse,
  LogisticsResponse,
} from "@/types/Order";
import { OrderAPI } from "@/api/OrderAPI";
import type { Pagination } from "@/types/Response";

type State = {
  // 被创建的临时订单信息
  orderOfCreate: {
    result: OrderOfCreateResponse;
    status: Status;
  };
  // 收货地址列表
  address: {
    result: Address[];
    status: Status;
  };
  // 订单详细信息
  orderInfo: {
    result: OrderResponse;
    status: Status;
  };
  // 我的订单列表
  myOrderList: {
    [orderStatus in 0 | 1 | 2 | 3 | 4 | 5 | 6]: {
      result: Pagination<OrderResponse>;
      status: Status;
    };
  };
  // 物流信息
  logistics: {
    result: LogisticsResponse;
    status: Status;
  };
};

type Getters = {};

type Actions = {
  // 创建订单
  createOrder(): Promise<void>;
  // 添加收货地址
  addAddress(address: EditAdressObject): Promise<string>;
  // 获取收货地址列表
  getAddress(): Promise<void>;
  // 修改收货地址
  updateAddress(address: EditAdressObject): Promise<string>;
  // 提交订单
  submitOrder(order: SubmitOrderObject): Promise<SubmitOrderResponse>;
  // 获取订单详细信息
  getOrderInfoById(id: string): Promise<void>;
  // 获取我的订单列表
  getMyOrders(arg: {
    page: number;
    pageSize: number;
    orderState: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  }): Promise<void>;
  // 取消订单
  cancelOrder(id: string, cancelReason: string): Promise<OrderResponse>;
  // 删除订单
  removeOrder(ids: string[]): Promise<null>;
  // 确认收货
  confirmReceiptGoods(id: string): Promise<OrderResponse>;
  // 获取物流信息
  viewLogistics(id: string): Promise<void>;
  // 再次购买
  createOrderById(id: string): Promise<void>;
};

export const useOrderStore = defineStore<"order", State, Getters, Actions>(
  "order",
  {
    state: () => ({
      // 被创建的临时订单信息
      orderOfCreate: {
        result: {
          userAddresses: [],
          goods: [],
          summary: {
            goodsCount: 0,
            totalPrice: 0,
            totalPayPrice: 0,
            postFee: 0,
            discountPrice: 0,
          },
        },
        status: "idle",
      },
      // 收货地址列表
      address: {
        result: [],
        status: "idle",
      },
      // 订单详细信息
      orderInfo: {
        result: {
          id: "",
          createTime: "",
          payType: 1,
          orderState: 1,
          payLatestTime: "",
          countdown: 0,
          postFee: 0,
          payMoney: 0,
          payChannel: 1,
          payState: 0,
          totalMoney: 0,
          totalNum: 0,
          deliveryTimeType: 1,
          receiverContact: "",
          receiverMobile: 0,
          provinceCode: "",
          cityCode: "",
          countyCode: "",
          receiverAddress: "",
          payTime: "",
          consignTime: "",
          endTime: "",
          closeTime: "",
          evaluationTime: "",
          arrivalEstimatedTime: "",
          skus: [],
        },
        status: "idle",
      },
      // 我的订单列表
      myOrderList: {
        0: {
          result: {
            page: 0,
            pages: 0,
            pageSize: 0,
            counts: 0,
            items: [],
          },
          status: "idle",
        },
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
        4: {
          result: {
            page: 0,
            pages: 0,
            pageSize: 0,
            counts: 0,
            items: [],
          },
          status: "idle",
        },
        5: {
          result: {
            page: 0,
            pages: 0,
            pageSize: 0,
            counts: 0,
            items: [],
          },
          status: "idle",
        },
        6: {
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
      // 物流信息
      logistics: {
        result: {
          count: 0,
          picture: "",
          company: {
            name: "",
            number: "",
            tel: "",
          },
          list: [],
        },
        status: "idle",
      },
    }),
    actions: {
      // 创建订单
      async createOrder() {
        // 更新加载状态
        this.orderOfCreate.status = "loading";
        // 捕获错误
        try {
          // 发送请求创建订单
          const response = await OrderAPI.createOrder();
          // 存储订单信息
          this.orderOfCreate.result = response.result;
          // 更新加载状态
          this.orderOfCreate.status = "success";
        } catch (error) {
          // 更新加载状态
          this.orderOfCreate.status = "error";
        }
      },
      // 添加收货地址
      async addAddress(address) {
        // 发送添加收货地址的请求
        const response = await OrderAPI.addAddress(address);
        // 返回新添加的收货地址 id
        return response.result.id;
      },
      // 获取收货地址列表
      async getAddress() {
        // 更新加载状态
        this.address.status = "loading";
        // 捕获错误
        try {
          // 发送请求获取收货地址列表
          const response = await OrderAPI.getAddress();
          // 存储收货地址列表
          this.address.result = response.result;
          // 更新加载状态
          this.address.status = "success";
        } catch (error) {
          // 更新加载状态
          this.address.status = "error";
        }
      },
      // 修改收货地址
      async updateAddress(address) {
        // 获取要修改的收货地址的id和其他信息
        const { id, ...rest } = address;
        // 发送请求 修改收货地址
        const response = await OrderAPI.updateAddress(id!, rest);
        // 返回被修改的收货地址的 id
        return response.result.id;
      },
      // 提交订单
      async submitOrder(order) {
        // 发送请求 提交订单
        const response = await OrderAPI.submitOrder(order);
        // 返回服务端的响应状态
        return response.result;
      },
      // 获取订单详细信息
      async getOrderInfoById(id) {
        // 更新加载状态
        this.orderInfo.status = "loading";
        // 捕获错误
        try {
          // 发送请求获取订单详细信息
          const response = await OrderAPI.getOrderInfoById(id);
          // 存储订单详细信息
          this.orderInfo.result = response.result;
          // 更新加载状态
          this.orderInfo.status = "success";
        } catch (error) {
          // 更新加载状态
          this.orderInfo.status = "error";
        }
      },
      // 获取我的订单列表
      async getMyOrders(arg) {
        // 更新加载状态
        this.myOrderList[arg.orderState].status = "loading";
        // 捕获错误
        try {
          // 发送请求获取我的订单列表
          const response = await OrderAPI.getMyOrders(arg);
          // 存储我的订单列表
          this.myOrderList[arg.orderState].result = response.result;
          // 更新加载状态
          this.myOrderList[arg.orderState].status = "success";
        } catch (error) {
          // 更新加载状态
          this.myOrderList[arg.orderState].status = "error";
        }
      },
      // 取消订单
      async cancelOrder(id, cancelReason) {
        // 发送请求、取消订单
        const response = await OrderAPI.cancelOrder(id, cancelReason);
        // 返回响应
        return response.result;
      },
      // 删除订单
      async removeOrder(ids) {
        // 发送请求 删除订单
        const response = await OrderAPI.removeOrder(ids);
        // 返回响应
        return response.result;
      },
      // 确认收货
      async confirmReceiptGoods(id) {
        // 发送请求 确认收货
        const response = await OrderAPI.confirmReceiptGoods(id);
        // 返回响应
        return response.result;
      },
      // 获取物流信息
      async viewLogistics(id) {
        // 更新加载状态
        this.logistics.status = "loading";
        // 捕获请求错误
        try {
          // 发送请求获取物流信息
          const response = await OrderAPI.viewLogistics(id);
          // 存储物流信息
          this.logistics.result = response.result;
          // 更新加载状态
          this.logistics.status = "success";
        } catch (error) {
          // 更新加载状态
          this.logistics.status = "error";
        }
      },
      // 再次购买
      async createOrderById(id: string) {
        // 更新加载状态
        this.orderOfCreate.status = "loading";
        // 捕获请求错误
        try {
          // 发送请求 创建订单
          const response = await OrderAPI.createOrderById(id);
          // 存储订单信息
          this.orderOfCreate.result = response.result;
          // 更新加载状态
          this.orderOfCreate.status = "success";
        } catch (error) {
          // 更新加载状态
          this.orderOfCreate.status = "error";
        }
      },
    },
  }
);
