import { BasicButton, BasicColor } from "@/main";
import { BsTrash, BsTrashFill } from "react-icons/bs";
import { BasicButtonProps } from "../../low-level/html/button/BasicButton";

interface DeleteButtonProps {
  disabled?: boolean;
  iconOnly?: boolean;
  /**
   * @default "outlined"
   */
  iconVariant?: "filled" | "outlined";
  /**
   * @default "delete"
   */
  backgroundColor?: BasicColor;
  /**
   * @default "white"
   */
  color?: BasicColor;
  corners?: BasicButtonProps["corners"];
  iconSize?: BasicButtonProps["iconSize"];
  fontSize?: BasicButtonProps["fontSize"];
  size?: BasicButtonProps["size"];
  gap?: BasicButtonProps["gap"];
  onClick?: () => void;
}
function DeleteButton(props: DeleteButtonProps) {
  return (
    <BasicButton
      disabled={props.disabled}
      size={props.size}
      corners={props.corners}
      gap={props.gap}
      iconSize={props.iconSize}
      fontSize={props.fontSize}
      leadingEl={
        !props.iconVariant || props.iconVariant === "outlined"
          ? BsTrash
          : BsTrashFill
      }
      backgroundColor={props.backgroundColor || "delete"}
      color={props.color || "white"}
      text={props.iconOnly ? undefined : "Delete"}
      onClick={props.onClick}
    />
  );
}

export default DeleteButton;
