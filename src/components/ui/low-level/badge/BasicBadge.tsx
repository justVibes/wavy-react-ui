import { Box, Float, FloatProps } from "@chakra-ui/react";
import { JSX } from "@emotion/react/jsx-runtime";
import React, { useRef } from "react";
import { HtmlElementDim } from "../html/BasicStyle";

interface BasicBadgeProps {
  children: JSX.Element;
  badge: React.ReactNode;
  /**
   * @default "top-end"
   */
  placement?: FloatProps["placement"];
  circleChild?: boolean;
  asChild?: boolean;
  offset?: HtmlElementDim;
}
function BasicBadge(props: BasicBadgeProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  if (props.asChild) return props.children;
  return (
    <Box position={"relative"} ref={boxRef}>
      {props.children}
      <Float
        ref={floatRef}
        // Use a formula to calculate the offset derived from the size
        // of the Box and the Float.
        offset={props.offset || (props.circleChild ? ".25rem" : undefined)}
        placement={props.placement}
      >
        {props.badge}
      </Float>
    </Box>
  );
}

export default BasicBadge;
