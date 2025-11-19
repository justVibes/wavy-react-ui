import { ColorResources } from "@/main";
import BasicDiv from "../html/div/BasicDiv";
import BasicSpan from "../html/span/BasicSpan";
import { upperFirst } from "@wavy/fn";
import { HtmlElementDim } from "../html/BasicStyle";
import { TaskResultStatus } from "@wavy/types";

interface StatusProps {
  status: TaskResultStatus;
  indicatorSize?: HtmlElementDim;
  indicatorOnly?: boolean;
}
function Status(props: StatusProps) {
  const colorMap: Record<StatusProps["status"], keyof typeof ColorResources> = {
    pending: "gray",
    success: "carlsbergGreen",
    error: "error",
  };
  const size = props.indicatorSize || (".3rem" as const);

  return (
    <BasicDiv
      row
      disableSelection
      align="center"
      gap={"md"}
      corners={"md"}
      padding={"sm"}
      backgroundColor={`${colorMap[props.status]}[0.5]`} // Last updated 10/10/2025 1:53 pm
      style={{ zIndex: 3 }}
    >
      <BasicDiv
        corners={size}
        size={size}
        backgroundColor={colorMap[props.status]}
      />
      {!props.indicatorOnly && (
        <BasicSpan
          style={{ fontWeight: 500 }}
          fontSize=".85rem"
          color={`${colorMap[props.status]}[0.75]`}
          text={upperFirst(props.status)}
        />
      )}
    </BasicDiv>
  );
}

export { Status, type StatusProps  };
