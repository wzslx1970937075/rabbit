import type { FunctionalComponent } from "vue";

const XtxTabPane: FunctionalComponent<{
  label: string;
  name: string;
  isActive?: boolean;
}> = (props, context) => {
  return props.isActive ? <div>{context.slots.default?.()}</div> : null;
};

export default XtxTabPane;
