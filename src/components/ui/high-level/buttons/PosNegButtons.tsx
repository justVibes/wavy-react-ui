import { BasicButton } from "@/main";
import { IconType } from "react-icons";
import { BsDash, BsPlus } from "react-icons/bs";
import { BasicColor, ElementDim } from "../../low-level/html/BasicStyle";
import { Icon } from "@chakra-ui/react";
import { BasicDivProps } from "../../low-level/html/div/BasicDiv";

interface Props {
  size?: ElementDim;
  disabled?: boolean;
  backgroundColor?: BasicColor;
  color?: BasicColor;
  iconSize?: ElementDim;
  padding?: BasicDivProps["padding"];
  onClick?: () => void;
}
function createButton(Sign: IconType) {
  return (props: Props) => (
    <BasicButton
      disabled={props.disabled}
      size={props.size}
      padding={props.padding}
      corners={"circle"}
      backgroundColor={props.backgroundColor || "onSurface[0.25]"}
      color={props.color || "surface"}
      fontSize={props.iconSize}
      onClick={props.onClick}
    >
      <Icon as={Sign} boxSize={props.iconSize} />
    </BasicButton>
  );
}
const PositiveButton = createButton(BsPlus);
const NegativeButton = createButton(BsDash);

export { NegativeButton, PositiveButton };
