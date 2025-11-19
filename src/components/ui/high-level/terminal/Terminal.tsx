import { ColorResources, resolveBasicColor } from "@/main";
import { For } from "@chakra-ui/react";
import { format, lastIndex } from "@wavy/fn";
import { useEffect } from "react";
import BasicDiv from "../../low-level/html/div/BasicDiv";
import {Tag} from "../../low-level/tag/Tag";
import { TaskLog } from "@wavy/types";

interface TerminalProps {
  initialMessage?: string;
  logs: TaskLog[];
}

const initialLog: TaskLog = {
  timestamp: Date.now(),
  status: "info",
  response: "Hello World!",
  // response: {
  //   tag: "Started",
  //   message: "Process started...",
  // },
};
function Terminal(props: TerminalProps) {
  useEffect(() => {
    if (props.initialMessage) {
      initialLog.response = props.initialMessage;
    }
  }, []);

  const logs = [initialLog, ...props.logs];
  return (
    <BasicDiv
      size="full"
      spill={{ x: "hidden", y: "auto" }}
      padding={"lg"}
      corners={"md"}
      borderColor={"outlineVariant"}
      backgroundColor={"outlineVariant[0.1]"}
      gap={"sm"}
      maxHeight={"full"}
    >
      <For each={logs}>
        {(log, i) => (
          <Log key={i} {...log} scrollIntoView={i === lastIndex(logs)} />
        )}
      </For>
    </BasicDiv>
  );
}

function Log(props: TaskLog & { scrollIntoView: boolean }) {
  const statusColorMapper: Record<
    typeof props.status,
    keyof typeof ColorResources
  > = {
    error: "error",
    success: "carlsbergGreen",
    info: "teal",
  };

  // const messageStyle: CSSProperties = ;
  return (
    <span
      ref={(r) => {
        if (r && props.scrollIntoView) r.scrollIntoView();
      }}
      style={{ fontSize: ".85rem", wordSpacing: ".25rem" }}
    >
      <span
        style={{ opacity: 0.5, wordSpacing: "normal" }}
        children={format("date", props.timestamp, "hh:mm:ss A")}
      />
      &nbsp;
      <span
        style={{
          fontWeight: "bold",
          color: resolveBasicColor(statusColorMapper[props.status]),
        }}
        children={`[${props.status}]`}
      />
      &nbsp;
      {typeof props.response === "object" && (
        <>
          <Tag labelOpacity={0.75} label={props.response.tag} />
          &nbsp;
        </>
      )}
      <span
        style={{
          wordSpacing: "normal",
          backgroundColor:
            props.status === "info"
              ? undefined
              : resolveBasicColor(`${statusColorMapper[props.status]}[0.25]`),
          padding: `0px .2rem`,
        }}
      >
        {typeof props.response === "object"
          ? props.response.message
          : props.response}
      </span>
    </span>
  );
}

export default Terminal;
