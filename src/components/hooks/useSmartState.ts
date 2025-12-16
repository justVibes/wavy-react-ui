import { useRef } from "react";
import { useRerender } from "./useRerender";
import { CastFn } from "@wavy/types";
import { castReturn } from "@wavy/fn";

/**A hook that allows you to optionally skip re-rendering on state change  */
function useSmartState<T>(value?: CastFn<T>) {
  const { triggerRerender } = useRerender();
  const valueRef = useRef<T>(castReturn(value));

  const handleSetValue = (
    value: T | ((previousValue: T) => T),
    options = { skipRender: false }
  ) => {
    valueRef.current =
      typeof value === "function" ? (value as any)(valueRef.current) : value;

    if (!options.skipRender) triggerRerender();
  };

  return [valueRef.current, handleSetValue] as const;
}

export { useSmartState };
