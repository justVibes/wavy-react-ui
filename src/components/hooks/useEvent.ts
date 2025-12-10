import { useContext } from "react";
import { EventContext } from "../contexts/EventContext";

function useEvent<EventMapper extends Record<string, any>>() {
  const ctx = useContext(EventContext);
  const emit = <Key extends keyof EventMapper>(
    key: Key,
    ...args: EventMapper[Key] extends null ? [] : [payload: EventMapper[Key]]
  ) => ctx.emit<EventMapper, Key>(key, ...args);
  const on = <Key extends keyof EventMapper>(
    key: Key,
    cb: (
      ...args: EventMapper[Key] extends null ? [] : [payload: EventMapper[Key]]
    ) => void
  ) => ctx.on<EventMapper, Key>(key, cb);

  return { emit, on };
}

export { useEvent };
