import { NoButton, YesButton } from "@/main";
import BasicDiv from "../../low-level/html/div/BasicDiv";

interface YesNoButtonGroupProps {
  onYesClick: () => void;
  onNoClick: () => void;
}
function YesNoButtonGroup(props: YesNoButtonGroupProps) {
  return (
    <BasicDiv row gap={"md"}>
      <NoButton onClick={props.onNoClick} />
      <YesButton onClick={props.onYesClick} />
    </BasicDiv>
  );
}

export default YesNoButtonGroup;
