import {
  BasicDiv,
  CssSpacing,
  isSpanMultiLine,
  resolveBasicColor,
} from "@/main";
import { useState } from "react";
import { IconType } from "react-icons";
import {
  BsExclamationCircle,
  BsExclamationTriangle,
  BsInfoCircle,
} from "react-icons/bs";
import applyBasicStyle, { HtmlElementDim } from "../html/BasicStyle";
import { BasicDivProps } from "../html/div/BasicDiv";
import BasicSpan, { BasicSpanProps } from "../html/span/BasicSpan";

interface DisclaimerProps
  extends Partial<
    Record<"top" | "left" | "bottom" | "right", HtmlElementDim | 0>
  > {
  severity: "warning" | "error" | "info";
  message: string;
  pos?: BasicDivProps["pos"];
  /**
   * @default false
   */
  disableShadow?: boolean;
  facade?: (
    severity: DisclaimerProps["severity"]
  ) => DisclaimerProps["severity"];
  width?: BasicDivProps["width"];
  /**
   * @default "1rem"
   */
  iconSize?: HtmlElementDim;
  /**
   * @default "md"
   */
  gap?: BasicSpanProps["gap"];
  /**
   * @default "md"
   */
  padding?: BasicDivProps["padding"];
  /**
   * @default "md"
   */
  corners?: BasicDivProps["corners"];
  /**
   * @default "sm"
   */
  fontSize?: BasicSpanProps["fontSize"];
  /**
   * @default false
   */
  hideLabel?: boolean;
}
function Disclaimer(props: DisclaimerProps) {
  const [isMultiline, setIsMultiline] = useState(false);
  const iconMapper: Record<typeof props.severity, IconType> = {
    error: BsExclamationCircle,
    info: BsInfoCircle,
    warning: BsExclamationTriangle,
  };
  const Icon = iconMapper[props.severity];
  const iconSize = props.iconSize || "1rem";
  const gap = props.gap || "md";
  const IconEl = <Icon size={iconSize} style={{ flexShrink: 0 }} />;
  return (
    <BasicDiv
      row={props.hideLabel}
      top={props.top}
      left={props.left}
      right={props.right}
      bottom={props.bottom}
      pos={props.pos}
      width={props.width}
      gap={props.hideLabel ? gap : undefined}
      corners={"md"}
      backgroundColor={resolveBasicColor(props.severity + "[0.5]", {
        preference: "res",
      })}
      color="white"
      padding={"md"}
      align={isMultiline || !props.hideLabel ? "start" : "center"}
      style={{
        boxShadow: props.disableShadow
          ? "none"
          : "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      }}
    >
      {props.hideLabel ? (
        IconEl
      ) : (
        <BasicDiv row gap={gap} align="center">
          {IconEl}
          <BasicSpan
            fontWeight="bold"
            fontSize="xs"
            text={(
              props.facade?.(props.severity) || props.severity
            ).toUpperCase()}
          />
        </BasicDiv>
      )}

      <span
        ref={(ref) => {
          if (ref) setIsMultiline(isSpanMultiLine(ref));
        }}
        style={applyBasicStyle({
          fontSize: props.fontSize || "sm",
          fade: props.hideLabel ? 1 : 0.75,
          style: {
            paddingLeft: props.hideLabel
              ? undefined
              : `calc(${iconSize} + ${applyBasicStyle({ gap }).gap})`,
          },
        })}
        children={props.message}
      />
    </BasicDiv>
  );
}

export { Disclaimer, type DisclaimerProps };
