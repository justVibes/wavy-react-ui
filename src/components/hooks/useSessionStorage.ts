import { NonFunction } from "@wavy/types";
import { useState } from "react";

function useSessionStorage<Value extends NonFunction<any>>(
  key: string,
  initialValue: Value
) {
  const [storedValue, setStoredValue] = useState<Value>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (update: Value | ((previousValue: Value) => Value)) => {
    try {
      const valueToStore =
        update instanceof Function ? update(storedValue) : update;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteValue = () => {
    try {
      setStoredValue(initialValue);
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue, deleteValue] as const;
}

export { useSessionStorage };
