import { useContext } from "react";
import { EventContext } from "../contexts/EventContext";

function useEvent<EventMapper extends Record<string, any>>() {
  const ctx = useContext(EventContext);

  const invalidKey = (key: unknown) => {
    throw new Error(`Invalid key used in useEvent`, {
      cause: `${key} with type "${typeof key}" provided, but a key with type "string" was expected.`,
    });
  };

  const emit = <Key extends keyof EventMapper>(
    key: Key,
    ...args: EventMapper[Key] extends null ? [] : [payload: EventMapper[Key]]
  ) => {
    if (typeof key !== "string") return invalidKey(key);
    ctx.emit(key, args?.[0]);
  };
  const on = <Key extends keyof EventMapper>(
    key: Key,
    cb: (
      ...args: EventMapper[Key] extends null ? [] : [payload: EventMapper[Key]]
    ) => void
  ) => {
    if (typeof key !== "string") return invalidKey(key);

    return ctx.on(key, cb);
  };

  const listeners = (key: keyof EventMapper) => {
    if (typeof key !== "string") return invalidKey(key);
    return ctx.listeners(key);
  };

  return { emit, on, listeners };
}

export { useEvent };
