import {
  SegmentGroup,
  SegmentGroupItemContext,
  SegmentGroupRootProps,
  SegmentGroupValueChangeDetails,
  useSegmentGroupItemContext,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { BasicColor } from "../html/BasicStyle";
import { CssSpacing, FontSize, resolveBasicColor } from "@/main";
import { BasicDivProps } from "../html/div/BasicDiv";
import { useContext } from "react";

interface SegmentedControlsProps<ControlType extends string> {
  controls: ControlType[] | { value: ControlType; icon: IconType }[];
  defaultValue?: ControlType;
  value?: ControlType;
  width?: SegmentGroupRootProps["width"];
  size?: SegmentGroupRootProps["size"];
  borderColor?: BasicColor | 0;
  backgroundColor?: BasicColor;
  fontSize?: BasicDivProps["fontSize"];
  indicatorColor?: BasicColor;
  selectedColor?: BasicColor;
  color?: BasicColor;
  gap?: keyof typeof CssSpacing | (string & {});
  padding?: keyof typeof CssSpacing | (string & {});
  onChange?: (control: ControlType) => void;
}
function SegmentedControls<ControlType extends string>(
  props: SegmentedControlsProps<ControlType>
) {
  const handleOnChange = (details: SegmentGroupValueChangeDetails) => {
    props.onChange?.(details.value as ControlType);
  };
  const firstControl = props.controls[0];
  return (
    <SegmentGroup.Root
      size={props.size}
      width={props.width}
      defaultValue={
        props.defaultValue ||
        (typeof firstControl === "string" ? firstControl : firstControl?.value)
      }
      value={props.value}
      onValueChange={handleOnChange}
      style={{
        backgroundColor: props.backgroundColor
          ? resolveBasicColor(props.backgroundColor)
          : undefined,
        boxShadow: props.borderColor
          ? `${resolveBasicColor(props.borderColor)} 0px 0px 0px 1px`
          : undefined,
        gap:
          props.gap in CssSpacing
            ? CssSpacing[props.gap as keyof typeof CssSpacing]
            : props.gap,
      }}>
      <SegmentGroup.Indicator
        backgroundColor={
          props.indicatorColor
            ? resolveBasicColor(props.indicatorColor)
            : undefined
        }
      />
      {props.controls.map((control) => {
        const label = typeof control === "string" ? control : control.value;
        return (
          <SegmentGroup.Item
            cursor={"pointer"}
            padding={
              props.padding in CssSpacing
                ? CssSpacing[props.padding as keyof typeof CssSpacing]
                : props.padding || ".5rem"
            }
            key={label}
            value={label}
            style={{ height: "fit-content", border: 0 }}>
            <Text
              selectedColor={props.selectedColor}
              color={props.color}
              fontSize={props.fontSize}
            />
            <SegmentGroup.ItemHiddenInput style={{ border: 0 }} />
          </SegmentGroup.Item>
        );
      })}
    </SegmentGroup.Root>
  );
}

function Text(props: {
  color?: BasicColor;
  selectedColor?: BasicColor;
  fontSize?: SegmentedControlsProps<string>["fontSize"];
}) {
  const ctx = useSegmentGroupItemContext();
  return (
    <SegmentGroup.ItemText
      style={{
        fontSize:
          props.fontSize in FontSize
            ? FontSize[props.fontSize as keyof typeof FontSize]
            : props.fontSize,
        border: 0,
        color: resolveBasicColor(
          ctx.checked && props.selectedColor ? props.selectedColor : props.color
        ),
      }}>
      {ctx.value}
    </SegmentGroup.ItemText>
  );
}

export { SegmentedControls, type SegmentedControlsProps };
