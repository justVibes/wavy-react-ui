import {
  HStack,
  Separator as ChakraSeparator,
  SeparatorProps as ChakraSeparatorProps,
  Text,
} from "@chakra-ui/react";
import { BasicColor } from "../html/BasicStyle";
import { resolveBasicColor } from "@/main";

type BaseProps = {
  size?: ChakraSeparatorProps["size"];
  color?: BasicColor;
  variant?: ChakraSeparatorProps["variant"];
  orientation?: ChakraSeparatorProps["orientation"];
};

type OptionalProps =
  | {
      label: string;
      labelPosition: "left" | "center" | "right";
      labelColor?: BasicColor;
    }
  | { label?: never; labelPosition?: never; labelColor?: never };

type SeparatorProps = BaseProps & OptionalProps;
function Separator(props: SeparatorProps) {
  const SeparatorRef = () => (
    <ChakraSeparator
      flex="1"
      variant={props.variant}
      orientation={props.orientation}
      size={props.size}
      color={resolveBasicColor(props.color)}
    />
  );

  if (!props.label) return <SeparatorRef />;
  return (
    <HStack>
      {["center", "right"].includes(props.labelPosition) && <SeparatorRef />}
      <Text flexShrink="0" color={resolveBasicColor(props.labelColor)}>
        {props.label}
      </Text>
      {["center", "left"].includes(props.labelPosition) && <SeparatorRef />}
    </HStack>
  );
}

export { Separator, type SeparatorProps };
