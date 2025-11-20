import { useState } from "react";

function useDialogController<Value>(defaultValue?: Value) {
  const [value, setValue] = useState(defaultValue);
  
  return {
    value,
    isOpen: !!value,
    show: (...args: Value extends boolean ? [] : [value: Value]) => {
      if (args[0] === undefined && typeof value !== "boolean") return;
      setValue(typeof value === "boolean" ? (true as Value) : args[0]);
    },
    hide: () =>
      setValue(typeof value === "boolean" ? (false as Value) : undefined),
  };
}

type UseDialogControllerReturn<T = {}> = ReturnType<typeof useDialogController<T>>;

export { useDialogController, type UseDialogControllerReturn };
