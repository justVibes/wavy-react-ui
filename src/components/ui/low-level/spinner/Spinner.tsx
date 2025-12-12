import {
  Spinner as ChakraSpinner,
  type SpinnerProps as ChakraSpinnerProps,
} from "@chakra-ui/react";
import applyBasicStyle, {
  BasicColor,
  BasicStyleProps,
  ElementDim,
  ElementSize,
} from "../html/BasicStyle";
import { resolveBasicColor } from "@/main";

const sizes = ["sm", "md", "lg", "xl", "xs"] as const;
interface SpinnerProps
  extends Pick<ChakraSpinnerProps, "animationDelay" | "animationDirection"> {
  /**@default "sm" */
  size?: ElementSize | (typeof sizes)[number];
  /**@default ".1rem" */
  thickness?: ElementDim;
  /**@default "slowest" */
  animationDuration?: ChakraSpinnerProps["animationDuration"];
  /**@default "blue.500" */
  color?: BasicColor | ChakraSpinnerProps["color"];
}
function Spinner(props: SpinnerProps) {
  const {
    animationDelay,
    animationDirection,
    animationDuration = "slowest",
    size = "sm",
  } = props;

  const isSizePredefined = (
    value: SpinnerProps["size"]
  ): value is (typeof sizes)[number] => {
    return (
      value &&
      typeof value === "string" &&
      ([...sizes] as string[]).includes(value)
    );
  };

  return (
    <ChakraSpinner
      size={isSizePredefined(size) ? size : undefined}
      animationDelay={animationDelay}
      animationDirection={animationDirection}
      animationDuration={animationDuration}
      //@ts-ignore
      color={props.color ? resolveBasicColor(props.color) : "blue.500"}
      borderWidth={props.thickness || ".1rem"}
      style={{
        padding: isSizePredefined(size) ? undefined : size
        // height: isSizePredefined(size) ? undefined : size,
        // height: isSizePredefined(size) ? undefined : size,
        // aspectRatio: 1,
      }}
    />
  );
}

export { Spinner, type SpinnerProps };
