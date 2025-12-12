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

  const dettach = (key: keyof EventMapper) => {
    if (typeof key !== "string") return invalidKey(key);
    return ctx.dettach(key);
  };

  return {
    /**Emits an event to the closest EventContainer (defaults to the one in `WavyUi`) */
    emit,
    /**Subscribes to an event in the closest EventContainer (defaults to the one in `WavyUi`) */
    on,
    /**Gets the total amount of listeners on an event */
    listeners,
    /**Removes an event from the registry in the closest EventContainer (unsubscribing all listeners in the process) */
    dettach,
  };
}


export { useEvent };
