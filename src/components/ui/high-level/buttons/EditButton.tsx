import { SafeOmit } from "@wavy/util";
import BasicButton, {
  BasicButtonProps,
} from "../../low-level/html/button/BasicButton";

import { BasicColor } from "@/main";
import { LuPencilLine } from "react-icons/lu";

interface EditButtonProps
  extends SafeOmit<
    BasicButtonProps,
    "text" | "leadingEl" | "trailingEl" | "children"
  > {
  iconOnly?: boolean;
  /**@default "transparent" */
  backgroundColor?: BasicColor;
  /**@default "onSurface[0.25]"*/
  borderColor?: BasicColor;
  /**@default "onSurface" */
  color?: BasicColor;
  /**@default "sm" */
  corners?: BasicButtonProps["corners"];
}
function EditButton(props: EditButtonProps) {
  const { iconOnly, ...rest } = props;
  return (
    <BasicButton
      {...rest}
      leadingEl={LuPencilLine}
      text={iconOnly ? undefined : "Edit"}
      backgroundColor={props.backgroundColor || "transparent"}
      borderColor={props.borderColor || "onSurface[0.25]"}
      color={props.color || "onSurface"}
      corners={props.corners || "sm"}
    />
  );
}

export default EditButton;
