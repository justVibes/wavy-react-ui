import { BasicButton } from "@/main";
import { IoMdSend } from "react-icons/io";
import { BasicButtonProps } from "../../low-level/html/button/BasicButton";

interface SendButtonProps {
  iconOnly?: boolean;
  disabled?: boolean;
  size?: BasicButtonProps["size"];
  onClick?: () => void | Promise<void>;
}
function SendButton(props: SendButtonProps) {
  return (
    <BasicButton
      async
      disabled={props.disabled}
      size={props.size}
      color={"white[0.85]"}
      spinnerColor={"gray"}
      trailingEl={<IoMdSend />}
      backgroundColor={"sendBlue"}
      text={props.iconOnly ? undefined : "Send"}
      onClick={props.onClick}
      corners={"xl"}
    />
  );
}

export default SendButton;
