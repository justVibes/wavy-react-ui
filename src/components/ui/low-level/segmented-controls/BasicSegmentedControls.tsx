import {
  SegmentGroup,
  SegmentGroupRootProps,
  SegmentGroupValueChangeDetails,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { BasicColor } from "../html/BasicStyle";

interface BasicSegmentedControlsProps<ControlType extends string> {
  controls: ControlType[] | { value: ControlType; icon: IconType }[];
  defaultValue?: ControlType;
  value?: ControlType;
  width?: SegmentGroupRootProps["width"];
  size?: SegmentGroupRootProps["size"];
  borderColor?: BasicColor | 0;
  onChange?: (control: ControlType) => void;
}
function BasicSegmentedControls<ControlType extends string>(
  props: BasicSegmentedControlsProps<ControlType>
) {
  const handleOnChange = (details: SegmentGroupValueChangeDetails) => {
    props.onChange?.(details.value as ControlType);
  };
  return (
    <SegmentGroup.Root
      size={props.size}
      width={props.width}
      defaultValue={props.defaultValue}
      value={props.value}
      onValueChange={handleOnChange}
      //   borderColor={props.borderColor === 0 ? "transparent" : convertBasicColor(props.borderColor)}
    >
      <SegmentGroup.Indicator />
      {props.controls.map((control) => {
        const label = typeof control === "string" ? control : control.value;
        return (
          <SegmentGroup.Item padding={"3"} key={label} value={label}>
            <SegmentGroup.ItemText>{label}</SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
        );
      })}
    </SegmentGroup.Root>
  );
}

export default BasicSegmentedControls;
