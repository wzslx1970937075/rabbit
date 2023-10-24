// 1. 导入单文件组件对象
// 2. 将单文件组件转换为虚拟节点对象
// 3. 将虚拟节点对象渲染到真实DOM中
// 4. 延迟3秒销毁组件

// 1). 导入单文件组件对象
import XtxMessage from "@/components/XtxMessage.vue";
import type { Props } from "@/components/XtxMessage.vue";
import { h, render } from "vue";

// 用于渲染组件的方法
export default function Message(props: Props) {
  // 2. 将单文件组件转换为虚拟节点对象
  const vNode = h(XtxMessage, props);
  // 创建渲染容器
  const container = document.createElement("div");
  // 将消息提示框渲染在页面中
  document.body.appendChild(container);
  // 3. 将虚拟节点对象渲染到真实DOM中
  render(vNode, container);

  // 4) 延迟3秒执行离场动画
  setTimeout(() => {
    // 获取用于渲染、销毁消息框的响应式状态
    const toggle = vNode.component?.exposed?.toggle;
    // 判断该状态是否存在
    if (typeof toggle !== "undefined") {
      // 执行离场动画
      toggle.value = false;
      // 延迟 800 毫秒等待动画执行完成销毁元素
      setTimeout(() => {
        document.body.removeChild(container);
      }, 800);
    }
  }, 3000);
}
