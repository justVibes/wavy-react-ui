import { BasicColor, BasicDiv } from "@/main";
import React from "react";
import { BasicDivProps } from "../html/div/BasicDiv";

enum Size {
  "2xl" = "2rem",
  xl = "1.75rem",
  lg = "1.5rem",
  md = "1.25rem",
  sm = "1rem",
  xs = ".85rem",
  "2xs" = ".5rem",
}

interface BasicIndicatorProps {
  content?: number | string;
  /**
   * @default "orange"
   */
  backgroundColor?: BasicColor;
  /**
   * @default "white"
   */
  color?: BasicColor;
  /**
   * @default "sm"
   */
  size?: keyof typeof Size;
  /**
   * @default "xxs"
   */
  fontSize?: BasicDivProps["fontSize"];
  /**
   * @default "xs"
   */
  padding?: BasicDivProps["padding"];
  hide?: boolean;
}
function BasicIndicator(props: BasicIndicatorProps) {
  const size = Size[props.size || "sm"];
  return (
    <BasicDiv
      hide={props.hide || (props.content !== undefined && !props.content)}
      padding={props.padding || "xs"}
      fontSize={props.fontSize || "xxs"}
      corners={size}
      size={size}
      centerContent
      backgroundColor={props.backgroundColor || "orange"}
      color={props.color || "white"}
      children={props.content}
    />
  );
}

export default BasicIndicator;
