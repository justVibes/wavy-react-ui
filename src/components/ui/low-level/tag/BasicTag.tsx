import { Tag } from "@chakra-ui/react";
import { BasicColor } from "../html/BasicStyle";
import { resolveBasicColor } from "@/main";

interface BasicTagProps {
  label: string;
  opacity?: number;
  labelOpacity?: number;
  color?: BasicColor;
}
function BasicTag(props: BasicTagProps) {
  return (
    <Tag.Root
      opacity={props.opacity}
      padding={"1"}
      color={resolveBasicColor(props.color)}
      height={"fit-content"}
      flexShrink={0}
      display={"inline-flex"}
    >
      <Tag.Label opacity={props.labelOpacity}>{props.label}</Tag.Label>
    </Tag.Root>
  );
}

export default BasicTag;
