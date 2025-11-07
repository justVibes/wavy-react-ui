import {
  BasicColor,
  BasicDiv,
  BasicSpan,
  ellipsis,
  restrictLineCount,
} from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import applyBasicStyle from "../html/BasicStyle";
import { BasicDivProps } from "../html/div/BasicDiv";
import { BasicSpanProps } from "../html/span/BasicSpan";
import { createContext, useContext } from "react";
import { Prettify, SafeOmit } from "@wavy/types";

const GapContext = createContext<{ gap: BasicDivProps["gap"] }>(null);

interface BasicCardProps
  extends Partial<
    Record<"width" | `${"max" | "min"}Width`, BasicDivProps["width"]>
  > {
  backgroundColor?: BasicColor;
  color?: BasicColor;
  /**
   * @default "lg"
   */
  corners?: BasicDivProps["corners"];
  /**
   * @default "md"
   */
  padding?: BasicDivProps["padding"];
  /**
   * @default "md"
   */
  gap?: BasicDivProps["gap"];
  height?: BasicDivProps["height"];
  clickable?: boolean;
  style?: BasicDivProps["style"];
  sx?: BasicDivProps["sx"];
  spill?: BasicDivProps["spill"];
  children:
    | JSX.Element
    | [JSX.Element, JSX.Element]
    | [JSX.Element, JSX.Element, JSX.Element];
}
function BasicCard(props: BasicCardProps) {
  return (
    <GapContext.Provider value={{ gap: props.gap }}>
      <BasicDiv
        row
        clickable={props.clickable}
        gap={props.gap ?? "md"}
        padding={props.padding ?? "md"}
        corners={props.corners ?? "lg"}
        height={props.height}
        width={props.width}
        maxWidth={props.maxWidth}
        minWidth={props.minWidth}
        backgroundColor={props.backgroundColor}
        color={props.color}
        align="center"
        style={props.style}
        spill={props.spill ?? "hidden"}
        sx={props.sx}
      >
        {props.children}
      </BasicDiv>
    </GapContext.Provider>
  );
}

function createAddOnEl<SingleChild extends boolean>(singleChild: SingleChild) {
  return (
    props: BasicDivProps & {
      children: SingleChild extends true
        ? JSX.Element
        : JSX.Element[] | JSX.Element;
    }
  ) => {
    const {
      children,
      className,
      row = true,
      spill = "hidden",
      centerContent = true,
      align: align = "center",
      ...rest
    } = props;

    return (
      <BasicDiv
        className={className}
        {...{
          ...rest,
          row,
          spill,
          centerContent,
          align: align,
        }}
      >
        {children}
      </BasicDiv>
    );
  };
}

function createTextNode(defaultStyle?: BasicSpanProps) {
  return (
    props: Prettify<{
      value: string;
      fontSize?: BasicSpanProps["fontSize"];
      fontWeight?: BasicSpanProps["fontWeight"];
      fade?: BasicSpanProps["fade"];
      color?: BasicColor;
      truncateStyle?: "ellipsis" | { lineCount: number } | "none";
    }>
  ) => {
    const getStyle = () => {
      const style = applyBasicStyle({
        ...defaultStyle,
        fontSize: props.fontSize || defaultStyle.fontSize,
        fontWeight: props.fontWeight || defaultStyle.fontWeight,
        fade: props.fade || defaultStyle.fade,
        color: props.color || defaultStyle.color || "inherit",
      });

      if (!props.truncateStyle || props.truncateStyle === "none") return style;
      if (props.truncateStyle === "ellipsis") return ellipsis(style);
      return restrictLineCount(props.truncateStyle.lineCount, style);
    };
    return <span style={getStyle()}>{props.value}</span>;
  };
}

BasicCard.LeadingAddOn = createAddOnEl(true);
BasicCard.TrailingAddOn = createAddOnEl(false);
BasicCard.Content = (
  props: SafeOmit<BasicDivProps, "asChildren"> & {
    children: JSX.Element | [JSX.Element, JSX.Element];
  }
) => {
  const { gap = props.gap } = useContext(GapContext);

  return (
    <BasicDiv
      gap={gap}
      {...{
        ...props,
        spill: props.spill || "hidden",
        maxWidth: props.maxWidth || "full",
      }}
    >
      {props.children}
    </BasicDiv>
  );
};

BasicCard.Label = createTextNode({
  fontWeight: "bold",
  fontSize: "xs",
  fade: 0.75,
});
BasicCard.Item = createTextNode({ fontSize: "sm" });

export default BasicCard;
