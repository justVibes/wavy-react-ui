import { BasicButton } from "@/main";
import { MdVerifiedUser } from "react-icons/md";

interface VerifyButtonProps {
  onClick?: () => void;
}
function VerifyButton(props: VerifyButtonProps) {
  return (
    <BasicButton
      padding={"sm"}
      gap={"sm"}
      size={"xs"}
      leadingEl={<MdVerifiedUser />}
      backgroundColor={"primaryContainer"}
      color={"onPrimaryContainer"}
      text="Verify"
      onClick={props.onClick}
    />
  );
}

export default VerifyButton;
