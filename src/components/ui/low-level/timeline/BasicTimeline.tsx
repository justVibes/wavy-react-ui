import { For, Timeline } from "@chakra-ui/react";
import { JSX } from "@emotion/react/jsx-runtime";
import React from "react";

interface BasicTimelineProps {
  items: {
    indicator?: JSX.Element;
    title: React.ReactNode;
    description: React.ReactNode;
  }[];
}
function BasicTimeline(props: BasicTimelineProps) {
  return (
    <Timeline.Root size={"xl"} variant={"subtle"} rowGap={"3"}>
      <For each={props.items}>
        {(item, idx) => (
          <Timeline.Item >
            <Timeline.Connector>
              <Timeline.Separator />
              <Timeline.Indicator>
                {item.indicator || idx + 1}
              </Timeline.Indicator>
            </Timeline.Connector>
            <Timeline.Content>
              <Timeline.Title>{item.title}</Timeline.Title>
              <Timeline.Description>{item.description}</Timeline.Description>
            </Timeline.Content>
          </Timeline.Item>
        )}
      </For>
    </Timeline.Root>
  );
}

export default BasicTimeline;
