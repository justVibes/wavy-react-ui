import { BasicButton, BasicColor } from "@/main";
import { IoOpenOutline } from "react-icons/io5";
import { BasicButtonProps } from "../../low-level/html/button/BasicButton";

interface OpenButtonProps {
  iconOnly?: boolean;
  size?: BasicButtonProps["size"];
  iconSize?: BasicButtonProps["iconSize"];
  fontSize?: BasicButtonProps["fontSize"];
  backgroundColor?: BasicColor;
  corners?: BasicButtonProps["corners"];
  color?: BasicColor;
  borderColor?: BasicColor;
  disabled?: boolean;
  onClick?: () => void;
}
function OpenButton(props: OpenButtonProps) {
  return (
    <BasicButton
      disabled={props.disabled}
      leadingEl={IoOpenOutline}
      size={props.size}
      corners={props.corners}
      iconSize={props.iconSize}
      fontSize={props.fontSize}
      borderColor={props.borderColor || "onSurface[0.1]"}
      backgroundColor={props.backgroundColor || "transparent"}
      color={props.color || "onSurface"}
      text={props.iconOnly ? undefined : "Open"}
      onClick={props.onClick}
    />
  );
}

export default OpenButton;
