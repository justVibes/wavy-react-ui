import { UnsubscribeFunction } from "@wavy/types";
import { PropsWithChildren, useEffect, useRef } from "react";
import { EventContext } from "../contexts/EventContext";

function EventManager(props: Required<PropsWithChildren>) {
  const map = useRef(new Map<string | number | Symbol, Function>());

  useEffect(() => {
    const cleanup = () => {
      map.current.clear();
    };

    return cleanup;
  }, []);

  return (
    <EventContext.Provider
      value={{
        //@ts-ignore
        emit: (event, payload) => {
          const cb = map.current.get?.(event);
          cb?.(payload);
        },
        on: (event, cb): UnsubscribeFunction => {
          map.current.set(event, cb);
          return () => {
            map.current.delete(event);
          };
        },
        listeners: (event) => {
          return map.current.has(event) ? 1 : 0;
        },
      }}
    >
      {props.children}
    </EventContext.Provider>
  );
}

export { EventManager };
