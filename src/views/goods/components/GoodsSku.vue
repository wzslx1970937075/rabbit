<script setup lang="ts">
import type { Sku, Spec } from "@/types/Goods";
import type { Data } from "@/stores/GoodsStore";
import bwPowerSet from "@/vendors/power-set";
// 接收外部传递的状态
// specs: 在页面中展示的规格状态
// skus: 当前商品的所有可组合的规格集合
// skuId: 默认选中的规格集合 id
const props = defineProps<{ specs: Spec[]; skus: Sku[]; skuId?: string }>();
// 创建 UI 状态 (选中、禁用)
const UIState = reactive(createUIStatus(props.specs));
// 获取规格查询字典
const pathMap = createPathMap();

// 用户选择规格时的 UI 状态类型
interface UIStatus {
  // 选中
  selected: boolean;
  // 禁用
  disabled: boolean;
}

// 根据规格状态创建其对应的 UI 状态
function createUIStatus(specs: Spec[]) {
  // UI 状态数组
  const uiStates: UIStatus[][] = [];
  // 遍历源规格分组
  specs.forEach((spec) => {
    // 创建规格分组
    const group: UIStatus[] = [];
    // 将规格组对象添加到拷贝结果数组中
    uiStates.push(group);
    // 遍历具体的规格选项
    spec.values.forEach(() => {
      // 设置每一个规格选项的选中状态和禁用状态(初始值)
      group.push({ selected: false, disabled: false });
    });
  });
  // 返回 UI 状态数组
  return uiStates;
}

// 设置规格的选中状态
function setSelectedUIState(index: number, i: number) {
  // 获取当前用户点击的规格
  const current = UIState[index][i];
  // 获取当前用户点击的规格对应的规格组
  const group = UIState[index];
  // 如果当前规格已经是禁用状态, 不能被选择, 所以阻止代码继续执行
  if (current.disabled) return;
  // 如果用户点击的规格已经是选中的
  if (current.selected) {
    // 让其取消选中
    current.selected = false;
  } else {
    // 先将该规格中的所有规格取消选中
    group.forEach((item) => (item.selected = false));
    // 将当前用户点击的规格设置为选中
    current.selected = true;
  }
  // 用户选择规格后更新规格的禁用状态
  setDisabledUIState();
  // 用户选择规格后更新商品信息
  // this.updateGoodsInfoBySku();
}

// 规格查询字典类型规范
interface PathMap {
  [key: string]: string | null;
}

// 创建规格查询字典
function createPathMap() {
  // 用于存储最终的规格查询对象
  const pathMap: PathMap = {};
  // 过滤出有库存的商品规格组合
  props.skus
    .filter((sku) => sku.inventory > 0)
    // 遍历有库存的商品规格组合
    .forEach((sku) => {
      // 将当前遍历的规格组合中的规格名称临时存到一个数组中
      // ['蓝色', '20cm', '中国']
      const valueNames = sku.specs.map((spec) => spec.valueName);
      // 获取用户可以选择的所有可能的规格及规格组合
      // ['蓝色', '20cm', '中国']
      // [['蓝色'], ['20cm'], ['中国'], ['蓝色', '20cm'], ['蓝色', '中国'], ['20cm', '中国'], ['蓝色', '20cm', '中国']]
      const sets = bwPowerSet(valueNames).filter((set) => set.length > 0);
      // 获取当前商品的规格数量, 将用于判断某个规格是否是完整的
      const max = valueNames.length;
      // 遍历用户可以选择的所有可能的规格及规格组合
      sets.forEach((set) => {
        // 将规格名称以 _ 进行拼接
        const key = set.join("_");
        // 用于判断当前规格是否是完整的
        const isCompleted = set.length === max;
        // 判断规格查询对象中是否已经存储了当前规格
        if (!(key in pathMap)) {
          // 如果当前规格是完整的
          if (isCompleted) {
            // 将当前规格或规格组合添加到规格查询对象中并赋值 sku id
            pathMap[key] = sku.id;
          } else {
            // 将当前规格或规格组合添加到规格查询对象中
            pathMap[key] = null;
          }
        }
      });
    });
  return pathMap;
}

// 获取用户选择的规格名称数组
function getUserSelected() {
  // 声明用于存储用户选择的规格名称数组
  const names: (string | undefined)[] = [];
  // 遍历规格组
  props.specs.forEach((spec, index) => {
    // 查找当前规格组中被选中的规格的索引
    const selectedIndex = UIState[index].findIndex((item) => item.selected);
    // 如果找到了
    if (selectedIndex !== -1) {
      // 将该规格放在它自己的位置上
      names[index] = spec.values[selectedIndex].name;
    } else {
      // 如果没有找到, 当前规格使用 undefined 进行占位
      names[index] = undefined;
    }
  });
  // 返回用户选择的规格名称数组
  return names;
}

// 设置规格的禁用状态
function setDisabledUIState() {
  // 遍历每一组规格数据
  props.specs.forEach((spec, index) => {
    // 获取用户选择的规格名称数组
    const selected = getUserSelected();
    // 遍历这一组规格数据中的具体规格
    spec.values.forEach((value, i) => {
      // 如果当前规格已经被选中了, 说明它可以选, 不需要被禁用
      if (UIState[index][i].selected) return;
      // 将当前规格名称放入用户选择的规格数组名称中, 待匹配
      selected[index] = value.name;
      // 检测当前规格是否可以选择
      const key = selected.filter((name) => name).join("_");
      // 如不能选择, 设置当前规格的 disabled 为 true
      UIState[index][i].disabled = !(key in pathMap);
    });
  });
}

// 设置规格默认选中
function setSpecDefaultSelected() {
  if (typeof props.skuId !== "undefined") {
    // 查找默认选中的规格对象, 从中获取规格名称
    const selected = props.skus.find((sku) => sku.id === props.skuId);
    // 如果没有找到默认选中的规格对象, 阻止程序继续运行
    if (typeof selected === "undefined") return;
    // 获取默认选中的规格名称数组
    const names = selected.specs.map((spec) => spec.valueName);
    // 遍历页面中展示的规格(组)
    props.specs.forEach((spec, index) =>
      // 遍历页面中展示的每一个具体的规格
      spec.values.forEach((value, i) => {
        // 查看当前遍历的规格的名称是否被包含在默认选中的规格名称数组中
        if (names.includes(value.name)) {
          // 设置当前规格的选中状态
          UIState[index][i].selected = true;
        }
      })
    );
  }
}

// 声明当前组件触发的自定义事件
const emit = defineEmits<{
  (e: "complete", data: Data): void;
  (e: "incomplete"): void;
}>();

// 向父组件传递商品信息
function sendGoodsInfoToParent() {
  // 获取用户选择的规格名称数组
  const selected = getUserSelected().filter((item) => item);
  // 判断用户是否选择了完整的规格信息
  if (selected.length === props.specs.length) {
    // 获取规格 skuId
    const skuId = pathMap[selected.join("_")]!;
    // 根据 skuId 查找规格对象
    const sku = props.skus.find((sku) => sku.id === skuId);
    // 如果找到了规格对象
    if (typeof sku !== "undefined") {
      // 触发自定义事件, 向外部传递最新商品信息
      emit("complete", {
        price: sku.price,
        oldPrice: sku.oldPrice,
        inventory: sku.inventory,
        skuId: skuId,
      });
    }
  } else {
    // 用户没有选择完整的规则
    emit("incomplete");
  }
}

// 设置规格的默认选中状态
setSpecDefaultSelected();
// 更新规格的禁用状态 (初始化)
setDisabledUIState();
</script>

<template>
  <div class="goods-sku">
    <dl v-for="(spec, index) in specs" :key="spec.id">
      <dt>{{ spec.name }}</dt>
      <dd>
        <template v-for="(item, i) in spec.values">
          <img
            @click="
              setSelectedUIState(index, i);
              sendGoodsInfoToParent();
            "
            :class="{
              selected: UIState[index][i].selected,
              disabled: UIState[index][i].disabled,
            }"
            v-if="item.picture"
            :src="item.picture"
            :alt="item.name"
          />
          <span
            @click="
              setSelectedUIState(index, i);
              sendGoodsInfoToParent();
            "
            :class="{
              selected: UIState[index][i].selected,
              disabled: UIState[index][i].disabled,
            }"
            v-else
            >{{ item.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>

<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 5px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
