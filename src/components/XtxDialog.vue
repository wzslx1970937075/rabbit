<script setup lang="ts">
const props = defineProps<{ title: string; visible: boolean }>();
// 双向数据绑定
const visible = useVModel(props, "visible");
// 控制元素的显示和隐藏
const domIsVisible = ref(false);
// 指定 v-fade
// 元素创建完成后为元素添加类名 fade
const vFade = {
  mounted(el: HTMLDivElement) {
    requestAnimationFrame(() => {
      el.classList.add("fade");
    });
  },
  beforeUnmount(el: HTMLDivElement) {
    el.removeEventListener("transitionend", onTransitionEnd);
  },
};
// 绑定对话框最外层元素
const target = ref();
// 过渡动画执行结束后
function onTransitionEnd() {
  // 销毁对话框
  domIsVisible.value = false;
}
// 销毁对话框
function destroy() {
  // 删除 fade 类名, 目的是执行动画
  target.value.classList.remove("fade");
  // 监听过渡动画结束事件, 销毁对话框
  target.value.addEventListener("transitionend", onTransitionEnd);
}
// 监听双向数据绑定的值的变化
watchEffect(() => {
  // 如果为 true 直接展示弹框
  if (props.visible) return (domIsVisible.value = props.visible);
  // 如果 为 false, 判断页面中是否已经渲染弹框, 如果已经渲染, 销毁它
  if (target.value) destroy();
});
</script>

<template>
  <div class="xtx-dialog" v-fade v-if="domIsVisible" ref="target">
    <div class="wrapper">
      <div class="header">
        <h3>{{ title }}</h3>
        <a
          href="JavaScript:"
          class="iconfont icon-close-new"
          @click="visible = false"
        ></a>
      </div>
      <div class="body">
        <slot name="body"></slot>
      </div>
      <div class="footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.xtx-dialog {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8887;
  background: rgba(0, 0, 0, 0);
  transition: all 0.4s;
  &.fade {
    background: rgba(0, 0, 0, 0.5);
    .wrapper {
      transform: translate(-50%, -50%);
      opacity: 1;
    }
  }
  .wrapper {
    transition: all 0.4s;
    width: 600px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    opacity: 0;
    .body {
      padding: 20px 40px;
      font-size: 16px;
      .icon-warning {
        color: @priceColor;
        margin-right: 3px;
        font-size: 16px;
      }
    }
    .footer {
      text-align: center;
      padding: 10px 0 30px 0;
    }
    .header {
      position: relative;
      height: 70px;
      line-height: 70px;
      padding: 0 20px;
      border-bottom: 1px solid #f5f5f5;
      h3 {
        font-weight: normal;
        font-size: 18px;
      }
      a {
        position: absolute;
        right: 25px;
        top: 25px;
        font-size: 24px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #999;
        &:hover {
          color: #666;
        }
      }
    }
  }
}
</style>
