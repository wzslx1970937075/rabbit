import type { FunctionalComponent } from "vue";

export const LearnJsx: FunctionalComponent = () => {
  // 为 HelloWorld 组件传递 name 属性和 age 属性
  return <HelloWorld name="张三" age={20} />;
};

interface Props {
  name: string;
  age: number;
}

export const HelloWorld: FunctionalComponent<Props> = (props) => {
  // 通过函数参数的方式接收 props 对象
  return (
    <div>
      {props.name} {props.age}
    </div>
  );
};
