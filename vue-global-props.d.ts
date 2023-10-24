import Confirm from "./src/components/library/Confirm";
import Message from "./src/components/library/Message";

declare module "vue" {
  interface ComponentCustomProperties {
    $message: typeof Message;
    $confirm: typeof Confirm;
  }
}

declare global {
  interface Window {
    QC: any;
  }
}
