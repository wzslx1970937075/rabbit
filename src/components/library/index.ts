import Message from "@/components/library/Message";
import Confirm from "@/components/library/Confirm";
import type { App } from "vue";

export default {
  install(app: App) {
    app.config.globalProperties.$message = Message;
    app.config.globalProperties.$confirm = Confirm;
  },
};
