import { createContext } from "react";

const EventContext = createContext<{
  emit: <
    EventMapper extends Record<string, any>,
    Key extends keyof EventMapper
  >(
    event: Key,
    ...args: EventMapper[Key] extends null ? [] : [payload: EventMapper[Key]]
  ) => void;
  on: <EventMapper extends Record<string, any>, Key extends keyof EventMapper>(
    event: Key,
    cb: (
      ...args: EventMapper[Key] extends null ? [] : [payload: EventMapper[Key]]
    ) => void
  ) => void;
}>(null);

export { EventContext };
