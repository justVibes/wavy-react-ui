import { BasicButton } from "@/main";

interface SubmitButtonProps {
  disabled?: boolean;
  class?: string;
  onClick?: () => Promise<void>;
}
function SubmitButton(props: SubmitButtonProps) {
  return (
    <BasicButton
      async
      disabled={props.disabled}
      text={`Submit ${props.class || ""}`.trim()}
      onClick={props.onClick}
    />
  );
}

export default SubmitButton;
