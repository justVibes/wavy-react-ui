import { useContext } from "react";
import { RootStoreContext } from "../contexts/RootStoreContext";

function useRootStore<EventMapper extends { [key: string]: any }>(
  options?: Partial<{ onConflict: "update" | "throw"; persist: boolean }>
) {
  const { getItem, setItem, removeItem, onConflict } = useContext(RootStoreContext);

//   useEffect(() => {
//     onConflict(options?.onConflict || "throw");
//     if (!options?.persist) {
//         const cleanup = () => {
// removeItem()
//         }
//     }
//   }, []);

  return {
    getItem: <Key extends keyof EventMapper>(key: Key): EventMapper[Key] => {
      return getItem(key) as any;
    },
    setItem: <Key extends keyof EventMapper>(
      key: Key,
      value: EventMapper[Key]
    ) => {
      setItem(key, value);
    },
  };
}

export default useRootStore;
