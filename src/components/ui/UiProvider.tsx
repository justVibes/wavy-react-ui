import { Provider } from "@/chakra/ui/provider";
import React from "react";
import { EventContainer } from "./low-level/event-container/EventContainer";

function UiProvider(props: { children: React.ReactNode }) {
  return (
    <Provider>
      <EventContainer>{props.children}</EventContainer>
    </Provider>
  );
}

export default UiProvider;
