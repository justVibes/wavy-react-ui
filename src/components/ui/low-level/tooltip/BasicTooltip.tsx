import { Tooltip, TooltipProps } from "@/chakra/ui/tooltip";
import { JSX } from "@emotion/react/jsx-runtime";
import React from "react";
import applyBasicStyle, { BasicColor } from "../html/BasicStyle";
import { BasicDivProps } from "../html/div/BasicDiv";

type BasicTooltipPlacement = TooltipProps["positioning"]["placement"];
interface BasicTooltipProps {
  asChild?: boolean;
  children: JSX.Element;
  tooltip: React.ReactNode;
  arrow?: boolean;
  placement?: BasicTooltipPlacement;
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
function BasicTooltip(props: BasicTooltipProps) {
  if (props.asChild) return props.children;
  const { padding, borderRadius, color, backgroundColor } = applyBasicStyle({
    padding: props.padding || "sm",
    corners: props.corners || "sm",
    color: props.color || "onSurface",
    backgroundColor: props.backgroundColor || "onSurface[0.1]",
  });
  return (
    <Tooltip
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
    </Tooltip>
  );
}

export default BasicTooltip;
export type { BasicTooltipProps, BasicTooltipPlacement };
