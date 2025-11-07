import { BasicButton } from "@/main";

interface PreviousButtonProps {
  disabled?:boolean
  onClick?: () => void;
}
function PreviousButton(props: PreviousButtonProps) {
  return (
    <BasicButton
    disabled={props.disabled}
      border={"onSurface[0.15]"}
      color={"onSurface"}
      backgroundColor={"transparent"}
      text="Previous"
      onClick={props.onClick}
    />
  );
}

export default PreviousButton;
