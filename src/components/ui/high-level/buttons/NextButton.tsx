import { BasicButton } from "@/main";

interface NextButtonProps {
  disabled?:boolean
  onClick?: () => void;
}
function NextButton(props: NextButtonProps) {
  return (
    <BasicButton
    disabled={props.disabled}
      text="Next"
      backgroundColor={"tertiaryContainer"}
      color={"onTertiaryContainer"}
      onClick={props.onClick}
    />
  );
}

export default NextButton;
