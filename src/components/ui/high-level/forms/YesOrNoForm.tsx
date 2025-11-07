import { Text } from "@chakra-ui/react";
import { IconType } from "react-icons";
import YesNoButtonGroup from "../../cluster/button-group/YesNoButtonGroup";
import BasicDiv from "../../low-level/html/div/BasicDiv";

type BaseProps = {
  icon?: IconType;
  question: string;
};
type OptionalProps =
  | {
      onNoClick: () => void;
      onYesClick: () => void;
      onOptionClick?: never;
    }
  | {
      onNoClick?: never;
      onYesClick?: never;
      onOptionClick: (option: "yes" | "no") => void;
    };
function YesOrNoForm(props: BaseProps & OptionalProps) {
  return (
    <BasicDiv centerContent size="full" gap={"md"}>
      {props.icon && <props.icon opacity={0.15} size={"5rem"} />}
      <Text fontSize={"1.5rem"} opacity={0.75} children={props.question} />
      <YesNoButtonGroup
        onNoClick={() => {
          props.onNoClick?.();
          props.onOptionClick?.("no");
        }}
        onYesClick={() => {
          props.onYesClick?.();
          props?.onOptionClick?.("yes");
        }}
      />
    </BasicDiv>
  );
}

export default YesOrNoForm;
