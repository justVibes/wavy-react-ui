import { createContext } from "react";

export const RootStoreContext = createContext<{
  getItem: (key: string) => unknown;
  setItem: (key: string, value: unknown) => void;
  removeItem: (key: string) => void
  onConflict: (resolver: "throw" | "update") => void;
}>(null);
