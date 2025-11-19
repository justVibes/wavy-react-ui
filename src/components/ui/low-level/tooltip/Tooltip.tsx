import {
  Tooltip as ChakraTooltip,
  TooltipProps as ChakraTooltipProps,
} from "@/chakra/ui/tooltip";
import { JSX } from "@emotion/react/jsx-runtime";
import React from "react";
import applyBasicStyle, { BasicColor } from "../html/BasicStyle";
import { BasicDivProps } from "../html/div/BasicDiv";

type TooltipPlacement = ChakraTooltipProps["positioning"]["placement"];

interface TooltipProps {
  asChild?: boolean;
  children: JSX.Element;
  tooltip: React.ReactNode;
  arrow?: boolean;
  placement?: TooltipPlacement;
  backgroundColor?: BasicColor;
  color?: BasicColor;
  corners?: BasicDivProps["corners"];
  padding?: BasicDivProps["padding"];
  delay?: Partial<{ open: number; close: number }>;
  wrapChildren?: boolean;
  slotProps?: Partial<{
    spanWrapper: Partial<BasicDivProps>;
  }>;
}
function Tooltip(props: TooltipProps) {
  if (props.asChild) return props.children;
  const { padding, borderRadius, color, backgroundColor } = applyBasicStyle({
    padding: props.padding || "sm",
    corners: props.corners || "sm",
    color: props.color || "onSurface",
    backgroundColor: props.backgroundColor || "onSurface[0.1]",
  });
  return (
    <ChakraTooltip
      positioning={{ placement: props.placement }}
      showArrow={props.arrow}
      openDelay={props.delay?.open}
      closeDelay={props.delay?.close}
      content={props.tooltip}
      contentProps={{
        padding: padding,
        color,
        borderRadius,
        style: { backdropFilter: `blur(.25rem)` },
        css: {
          "--tooltip-bg": backgroundColor,
        },
      }}
    >
      {props.wrapChildren ? (
        <span
          style={
            props.slotProps?.spanWrapper
              ? { ...applyBasicStyle(props.slotProps.spanWrapper) }
              : undefined
          }
        >
          {props.children}
        </span>
      ) : (
        props.children
      )}
    </ChakraTooltip>
  );
}

export { Tooltip, type TooltipPlacement, type TooltipProps };
