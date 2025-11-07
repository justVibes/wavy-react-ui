import { createContext } from "react";

const BasicPopoverContext = createContext<{
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
}>(null);

export { BasicPopoverContext };
