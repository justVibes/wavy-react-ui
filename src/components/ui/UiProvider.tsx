import { Provider } from "@/chakra/ui/provider";
import React from "react";

function UiProvider(props: { children: React.ReactNode }) {
  return <Provider>{props.children}</Provider>;
}

export default UiProvider;
