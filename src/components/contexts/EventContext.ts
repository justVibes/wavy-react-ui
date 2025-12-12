import { UnsubscribeFunction } from "@wavy/types";
import { createContext } from "react";

const EventContext = createContext<{
  dettach: (event: string) => boolean;
  emit: (event: string, payload?: any) => void;
  on: (event: string, cb: (payload?: any) => void) => UnsubscribeFunction;
  listeners: (event: string) => number;
}>(null);

export { EventContext };
