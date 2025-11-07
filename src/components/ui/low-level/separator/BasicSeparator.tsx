import { HStack, Separator, SeparatorProps, Text } from "@chakra-ui/react";
import { BasicColor } from "../html/BasicStyle";
import { resolveBasicColor } from "@/main";

type BaseProps = {
  size?: SeparatorProps["size"];
  color?: BasicColor;
  variant?: SeparatorProps["variant"];
  orientation?: SeparatorProps["orientation"];
};

type OptionalProps =
  | {
      label: string;
      labelPosition: "left" | "center" | "right";
      labelColor?: BasicColor;
    }
  | { label?: never; labelPosition?: never; labelColor?: never };

function BasicSeparator(props: BaseProps & OptionalProps) {
  const SeparatorRef = () => (
    <Separator
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

export default BasicSeparator;
