import {
  BsArrowsAngleContract,
  BsArrowsAngleExpand,
  BsChevronBarContract,
  BsChevronBarExpand,
} from "react-icons/bs";
import BasicDiv from "../../low-level/html/div/BasicDiv";
import { useManagedRef } from "@/main";

interface ExpandableButtonProps {
  initialState?: "expanded" | "contracted";
  icon?: "arrow" | "chevron";
  onExpand: () => void;
  onContract: () => void;
}
function ExpandableButton(props: ExpandableButtonProps) {
  const expandedRef = useManagedRef(props.initialState === "expanded");

  const iconType: ExpandableButtonProps["icon"] = props.icon || "chevron";
  const ExpandIcon =
    iconType === "chevron" ? BsChevronBarExpand : BsArrowsAngleExpand;
  const ContractIcon =
    iconType === "chevron" ? BsChevronBarContract : BsArrowsAngleContract;
  const Icon = expandedRef.read() ? ContractIcon : ExpandIcon;

  const handleOnClick = () => {
    expandedRef.upsert((expanded) => {
      if (expanded) props.onContract();
      else props.onExpand();

      return !expanded;
    });
  };
  
  return (
    <BasicDiv clickable onClick={handleOnClick}>
      <Icon />
    </BasicDiv>
  );
}

export default ExpandableButton;
