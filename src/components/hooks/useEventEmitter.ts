import { useCallback, useEffect, useRef, useState } from "react";
import globalEventEmitter from "../events/EventEmitter";

type DispatchOptions = Partial<{ skipRender: boolean }>;

function useEventEmitter<T>(eventName: string) {
  const [data, setData] = useState<T>();
  const eventListener = useRef(new Map<string, (event: CustomEvent) => void>());
  const skipRender = useRef(false);

  useEffect(() => {
    const listener = (event: CustomEvent<T>) => {
      console.log(`Received ${event.detail} while listening to ${eventName}`);
      eventListener.current.get(eventName)?.(event);
      if (skipRender.current) {
        skipRender.current = false;
        return;
      }
      setData(event.detail);
    };
    globalEventEmitter.addEventListener(eventName, listener);

    // Clean up subscriptions if the event changed
    return () => {
      globalEventEmitter.removeEventListener(
        eventName,
        eventListener.current.get(eventName)
      );
      eventListener.current.delete(eventName);
    };
  }, [eventName, skipRender]);

  return {
    data,
    emit: useCallback(
      (data: T, options: DispatchOptions = { skipRender: true }) => {
        skipRender.current = !!options?.skipRender;

        console.log(`Emitting ${eventName} with ${data}...`);
        globalEventEmitter.dispatchEvent(
          new CustomEvent(eventName, { detail: data })
        );
      },
      [eventName]
    ),
    addListener: useCallback(
      (listener: (event: CustomEvent<T>) => void) => {
        eventListener.current.set(eventName, listener);
      },
      [eventName]
    ),
  };
}

export default useEventEmitter;
