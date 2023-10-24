import type { Goods, GoodsRequestParams } from "@/types/Goods";
import type { Pagination } from "@/types/Response";
import type { Category } from "@/types/Category";
import { CategoryAPI } from "@/api/CategoryAPI";
import { CATEGORIES } from "@/contants/categories";
import type { Status } from "@/types/Status";
import type { Banner } from "@/types/Banner";
import { HomeAPI } from "@/api/HomeAPI";

// 定义 Store 对象中状态的类型
type State = {
  // 分类
  categories: {
    // 用于头部导航
    headerNav: (Category & { isOpen: boolean })[];
    // 用于首页左侧导航
    homeCategory: Category[];
    // 加载状态
    status: Status;
  };
  // 轮播图
  banners: {
    result: Banner[];
    status: Status;
  };
  // 一级分类具体信息
  topCategories: {
    result: {
      [id: string]: Category | undefined;
    };
    status: Status;
  };
  // 二级分类筛选条件
  subCategoryFilters: {
    result: {
      [id: string]: Category | undefined;
    };
    status: Status;
  };
  // 二级分类商品
  categoryGoods: {
    status: Status;
    result: Pagination<Goods>;
  };
};

// 定义 Getters 对象的类型
type Getters = {
  // 一级分类面包屑导航
  currentTop: (state: State) => (topCategoryId: string) => Category | undefined;
  // 二级分类面包屑导航
  currentTopAndSub: (
    state: State
  ) => (
    topCategoryId: string,
    subCategoryId: string
  ) => { topCategory: Category | undefined; subCategory: Category | undefined };
};

// 定义 Actions 对象的类型
type Actions = {
  // 获取分类
  getCategories(): Promise<void>;
  // 切换导航显示隐藏
  toggle(id: string, isOpen: boolean): void;
  // 获取轮播图
  getBanners(): Promise<void>;
  // 根据一级分类 id 获取分类信息
  getTopCategoryById(id: string): Promise<void>;
  // 根据二级分类 id 获取该分类下的商品的筛选条件
  getSubCategoryFilters(id: string): Promise<void>;
  // 获取二级分类商品
  getCategoryGoods(
    categoryId: GoodsRequestParams["categoryId"],
    reqParams?: Partial<Omit<GoodsRequestParams, "categoryId">>
  ): Promise<void>;
};

// 创建 categoryStore 对象, 返回用于获取 categoryStore 对象的方法
export const useCategoryStore = defineStore<
  "category",
  State,
  Getters,
  Actions
>("category", {
  state: () => ({
    // 导航分类信息
    categories: {
      // 用于存储头部导航分类列表
      // headerNav: CATEGORIES.map((cateogry) => ({ ...cateogry, isOpen: false })),
      headerNav: [],
      // 用于存储首页左侧导航分类列表
      homeCategory: [],
      // 记录分类数据的请求状态
      status: "idle",
    },
    // 轮播图
    banners: {
      result: [],
      status: "idle",
    },
    // 一级分类信息
    topCategories: {
      result: {},
      status: "idle",
    },
    // 二级分类筛选信息
    subCategoryFilters: {
      result: {},
      status: "idle",
    },
    // 二级分类商品
    categoryGoods: {
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
    // 根据 id 查找目标分类, 将它的 isOpen 属性值设置为 target
    toggle(id, target) {
      // 查找目标分类
      const category = this.categories.headerNav.find(
        (category) => category.id === id
      );
      // 如果目标分类存在, 设置它的 isOpen 属性值为 target
      if (category) category.isOpen = target;
    },
    // 用于获取分类列表
    async getCategories() {
      // 记录请求状态
      this.categories.status = "loading";
      // 捕获错误
      try {
        // 获取分类列表
        let response = await CategoryAPI.getCategories();
        // 存储头部导航分类列表
        this.categories.headerNav = response.result.map((category) => ({
          ...category,
          isOpen: false,
        }));
        // 头部首页左侧分类列表
        this.categories.homeCategory = response.result.map((category) => ({
          ...category,
          children: category.children?.slice(0, 2),
        }));
        // 记录请求状态
        this.categories.status = "success";
      } catch (error) {
        // 记录请求状态
        this.categories.status = "error";
      }
    },
    // 获取轮播图
    async getBanners() {
      // 更新加载状态
      this.banners.status = "loading";
      // 捕获错误
      try {
        // 发送请求获取轮播图
        let response = await HomeAPI.getBanners(2);
        // 存储轮播图
        this.banners.result = response.result;
        // 更新加载状态
        this.banners.status = "success";
      } catch (e) {
        // 更新加载状态
        this.banners.status = "error";
      }
    },
    // 根据一级分类 id 获取分类信息
    async getTopCategoryById(id) {
      // 更新加载状态
      this.topCategories.status = "loading";
      // 捕获错误
      try {
        // 发送请求根据一级分类 id 获取分类信息
        let response = await CategoryAPI.getTopCategoryById(id);
        // 存储一级分类信息
        this.topCategories.result[response.result.id] = response.result;
        // 更新加载状态
        this.topCategories.status = "success";
      } catch (e) {
        // 更新加载状态
        this.topCategories.status = "error";
      }
    },
    // 根据二级分类 id 获取该分类下的商品的筛选条件
    async getSubCategoryFilters(id) {
      // 更新加载状态
      this.subCategoryFilters.status = "loading";
      // 捕获错误
      try {
        // 发送请求获取二级分类商品筛选条件
        let response = await CategoryAPI.getSubCategoryFilters(id);
        // 存储商品筛选条件
        this.subCategoryFilters.result[response.result.id] = response.result;
        // 更新加载状态
        this.subCategoryFilters.status = "success";
      } catch (e) {
        // 更新加载状态
        this.subCategoryFilters.status = "error";
      }
    },
    // 获取二级分类商品
    async getCategoryGoods(categoryId, reqParams) {
      // 如果数据已经加载完成, 不再进行加载
      if (this.categoryGoods.status === "finished") return;
      // 更新加载状态
      this.categoryGoods.status = "loading";
      // 捕获错误
      try {
        // 发送请求获取二级分类商品数据
        let response = await CategoryAPI.getCategoryGoods(
          categoryId,
          reqParams
        );
        // 从服务端响应状态中获取到商品数据以及分页数据
        const { items, ...rest } = response.result;

        // 重新在本地存储分页数据以及商品数据
        if (reqParams?.page === 1) {
          // 存储状态
          this.categoryGoods.result = {
            ...rest,
            items,
          };
        } else {
          // 获取本地已存在的商品数据
          const currentItems = this.categoryGoods.result.items;
          // 累加状态
          this.categoryGoods.result = {
            ...rest,
            items: [...currentItems, ...items],
          };
        }
        // 如果当前请求页已经是最后一页或者服务端没有商品数据
        if (reqParams?.page === rest.pages || rest.pages === 0) {
          // 更新加载状态
          this.categoryGoods.status = "finished";
        } else {
          // 更新加载状态
          this.categoryGoods.status = "success";
        }
      } catch (e) {
        // 更新加载状态
        this.categoryGoods.status = "error";
      }
    },
  },
  getters: {
    // 一级分类面包屑导航
    currentTop(state) {
      return function (topCategoryId) {
        return state.categories.headerNav.find(
          (item) => item.id === topCategoryId
        );
      };
    },
    // 二级分类面包屑导航
    currentTopAndSub(state) {
      return function (topCategoryId, subCategoryId) {
        const topCategory = state.categories.headerNav.find(
          (item) => item.id === topCategoryId
        );
        const subCategory = topCategory?.children?.find(
          (item) => item.id === subCategoryId
        );
        return { topCategory, subCategory };
      };
    },
  },
});
