import { buildArray } from "@wavy/fn";
import { NonFunction } from "@wavy/types";
import { useRef } from "react";

function useManagedRef<T extends NonFunction<unknown>>(initialValue: T) {
  type UpdaterFunction<T> = (value: T) => T;
  const ref = useRef<{ current: T; previous: T }>({
    current: initialValue,
    previous: undefined,
  });

  return {
    debug: () => {
      const previousRef = ref.current.previous;
      const currentRef = ref.current.current;

      const changes = (): Record<"from" | "to" | "difference", T | T[]> => {
        if (Array.isArray(previousRef)) {
          const lastRef = previousRef as T[];
          const current = currentRef as T[];
          return {
            from: previousRef,
            to: currentRef,
            difference: current.filter((v, idx) => {
              if (idx < lastRef.length) return lastRef[idx] !== v;
              return false;
            }),
          };
        }

        switch (typeof previousRef) {
          case "string":
            return {
              from: previousRef,
              to: currentRef,
              difference: (currentRef as string).replace(previousRef, "") as T,
            };
          case "object":
            return {
              from: previousRef,
              to: currentRef,
              difference: Object.fromEntries(
                Object.keys(previousRef)
                  .map((key) => {
                    const validKey = key as keyof T;
                    if (currentRef[validKey] !== previousRef[validKey]) {
                      return [validKey, currentRef[validKey]];
                    }
                  })
                  .filter((v) => Boolean(v))
              ),
            };
          default:
            throw new Error("Not yet implemented bro!");
        }
      };

      const markerLength = 250;
      console.log(
        buildArray(markerLength, (idx): string => {
          if (idx === 0 || idx === markerLength) return "/";
          return "*";
        }).join(""),
        changes()
      );
      return changes();
    },
    upsert: (value: T | UpdaterFunction<T>) => {
      const updRefVal =
        typeof value === "function"
          ? (value as UpdaterFunction<T>)(ref.current.current)
          : value;
      const prevRef = ref.current.current;

      ref.current = {
        current: updRefVal,
        previous: prevRef,
      };
    },
    read: () => {
      return ref.current.current;
    },
    delete: () => {
      ref.current = undefined;
    },
  };
}

export default useManagedRef;
