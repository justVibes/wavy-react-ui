import { BasicButton, BasicColor } from "@/main";
import { MdMoreVert } from "react-icons/md";
import { BasicButtonProps } from "../../low-level/html/button/BasicButton";

interface OptionsButtonProps {
  disabled?: boolean;
  iconOnly?: boolean;
  /**
   * @default "md"
   */
  size?: BasicButtonProps["size"];
  iconSize?: BasicButtonProps["iconSize"];
  /**
   * @default "onSurface[0.1]"
   */
  borderColor?: BasicColor;
  /**
   * @default "transparent"
   */
  backgroundColor?: BasicColor;
  /**
   * @default "onSurface"
   */
  color?: BasicColor;
  onClick?: () => void;
}
function OptionsButton(props: OptionsButtonProps) {
  return (
    <BasicButton
      disabled={props.disabled}
      leadingEl={MdMoreVert}
      size={props.size}
      borderColor={props.borderColor || "onSurface[0.1]"}
      color={props.color || "onSurface"}
      backgroundColor={props.backgroundColor || "transparent"}
      iconSize={props.iconSize || "sm"}
      text={props.iconOnly ? undefined : "Options"}
      onClick={props.onClick}
    />
  );
}

export default OptionsButton;
