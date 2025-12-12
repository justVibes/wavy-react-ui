import { EventContext } from "@/components/contexts/EventContext";
import { UnsubscribeFunction } from "@wavy/types";
import React, { useEffect, useRef } from "react";
import { v4 } from "uuid";

interface EventContainerProps {
  /**The max amount of listeners allowed per event.
   * @default Infinity */
  maxListeners?: number;
  onListenerAccepted?: <T extends string>(event: T) => void;
  /**Handle the rejection of listeners
   * @note If a listener is rejected and this is falsy (undefined) an error will be thrown
   */
  onListenerRejected?: <T extends string>(event: T) => void;
  /**Removes all events and unsubscribes all listeners. */
  clearRegistry?: boolean;
  children: React.ReactNode;
}

function EventContainer(props: EventContainerProps) {
  const maxListeners = Math.abs(props.maxListeners) ?? Infinity;
  const map = useRef(
    new Map<string | number | Symbol, { uid: string; method: Function }[]>()
  );

  useEffect(() => {
    if (props.clearRegistry) {
      map.current.clear();
    }
  }, [props.clearRegistry]);

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
          const listeners = map.current.get(event) || [];

          for (const { method } of listeners) {
            method?.(payload);
          }
        },
        on: (event, cb): UnsubscribeFunction => {
          const newUid = v4();
          const listeners = map.current.get(event) || [];

          if (listeners.length >= maxListeners) {
            if (props.onListenerRejected) {
              props.onListenerRejected(event);
              return () => {};
            } else {
              throw new Error(`Max listeners reached for event: '${event}'`, {
                cause: `${event} is only allowed to have ${maxListeners} listeners, but an attempt was made to register ${
                  maxListeners + 1
                } listeners.`,
              });
            }
          }

          map.current.set(event, [...listeners, { uid: newUid, method: cb }]);
          props.onListenerAccepted?.(event);

          const unsub = () => {
            const listeners = map.current.get(event) || [];

            if (listeners.length === 0) {
              map.current.delete(event);
            } else {
              map.current.set(
                event,
                listeners.filter(({ uid }) => uid !== newUid)
              );
            }
          };

          return unsub;
        },
        dettach: (event) => {
          if (map.current.has(event)) {
            map.current.delete(event);
            return true;
          }
          return false;
        },
        listeners: (event) => {
          return map.current.get(event)?.length;
        },
      }}
    >
      {props.children}
    </EventContext.Provider>
  );
}

export { EventContainer, type EventContainerProps };
