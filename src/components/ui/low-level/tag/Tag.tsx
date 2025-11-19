import { Tag as ChakraTag } from "@chakra-ui/react";
import { BasicColor } from "../html/BasicStyle";
import { resolveBasicColor } from "@/main";

interface TagProps {
  label: string;
  opacity?: number;
  labelOpacity?: number;
  color?: BasicColor;
}
function Tag(props: TagProps) {
  return (
    <ChakraTag.Root
      opacity={props.opacity}
      padding={"1"}
      color={resolveBasicColor(props.color)}
      height={"fit-content"}
      flexShrink={0}
      display={"inline-flex"}
    >
      <ChakraTag.Label opacity={props.labelOpacity}>
        {props.label}
      </ChakraTag.Label>
    </ChakraTag.Root>
  );
}

export { Tag, type TagProps };
