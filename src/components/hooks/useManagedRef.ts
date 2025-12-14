import { buildArray } from "@wavy/fn";
import { NonFunction } from "@wavy/types";
import { useRef } from "react";

function useManagedRef<T extends NonFunction<unknown>>(
  initialValue: T,
  options?: Partial<{ onChange: (curr: T, prev: T) => void }>
) {
  type UpdaterFunction<T> = (value: T) => T;
  const ref = useRef<{ recent: T; stale: T }>({
    recent: initialValue,
    stale: undefined,
  });

  return {
    debug: () => {
      const previousRef = ref.current.stale;
      const currentRef = ref.current.recent;

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
      const newValue =
        typeof value === "function"
          ? (value as UpdaterFunction<T>)(ref.current.recent)
          : value;
      const prevRef = ref.current.recent;

      ref.current = {
        recent: newValue,
        stale: prevRef,
      };
      options?.onChange?.(newValue, prevRef);
    },
    read: () => {
      return ref.current.recent;
    },
    delete: () => {
      ref.current = undefined;
    },
  };
}

export { useManagedRef };
