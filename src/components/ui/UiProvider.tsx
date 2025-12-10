import { Provider } from "@/chakra/ui/provider";
import React, { useEffect, useRef } from "react";
import { EventContext } from "../contexts/EventContext";
import { UnsubscribeFunction } from "@wavy/types";

function UiProvider(props: { children: React.ReactNode }) {
  const map = useRef(new Map<string | number | Symbol, Function>());

  useEffect(() => {
    const cleanup = () => {
      map.current.clear();
    };

    return cleanup;
  }, []);

  return (
    <Provider>
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
    </Provider>
  );
}

export default UiProvider;
