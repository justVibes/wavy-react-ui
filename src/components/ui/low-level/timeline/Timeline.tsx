import {
  applyBasicStyle,
  BasicColor,
  BasicDiv,
  BasicStyleProps,
  resolveBasicColor,
  useManagedRef,
} from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import React, { createContext, useContext, useEffect, useState } from "react";

const Context = createContext<{
  register: () => "first" | "last" | "both" | void;
  lineSeparatorColor: BasicColor;
} | null>(null);

function Root(props: TimelineProps.RootProps) {
  const childrenUids = useManagedRef<number[]>([]);
  const lineSeparatorColor = props.lineSeparatorColor || "onSurface[0.5]";
  const Children = Array.isArray(props.children)
    ? props.children
    : [props.children];
  const RenderedChildren =
    Children.length === 1
      ? Children
      : Children.map((child, i) => {
          if (i === 0 || !props.rowGap) return child;
          return (
            <>
              <p />
              <BasicDiv width={"full"} align="center">
                <p
                  style={{
                    width: "1px",
                    height: props.rowGap,
                    backgroundColor: resolveBasicColor(lineSeparatorColor),
                  }}
                />
              </BasicDiv>

              <p />
              {child}
            </>
          );
        });

  const handleRegister = () => {
    if (Children.length === 1) return "both";

    const uids = [...childrenUids.read(), 0];
    childrenUids.upsert(uids);

    if (uids.length === 1) return "first";
    else if (uids.length === Children.length) return "last";
  };

  return (
    <Context.Provider value={{ register: handleRegister, lineSeparatorColor }}>
      <BasicDiv
        grid
        width={props.width ?? "fit-content"}
        gridCols="auto auto auto"
        justify="end"
        // backgroundColor="billsRed[0.15]"
        style={{ columnGap: props.columnGap || ".5rem" }}
      >
        {RenderedChildren}
      </BasicDiv>
    </Context.Provider>
  );
}

function Item(props: TimelineProps.ItemProps) {
  const [pos, setPos] = useState<"first" | "last" | "both">();
  const { register } = useContext(Context)!;

  const { indicator, leadingEl, trailingEl } = props.styles || {};
  const { 0: LeadingEl, 1: TrailingEl } = Array.isArray(props.children)
    ? props.children
    : [props.children];

  useEffect(() => {
    const pos = register();
    if (typeof pos === "string") setPos(pos);
  }, [pos]);

  const isSepHidden = (position: typeof pos) => {
    return pos === position || pos === "both";
  };
  return (
    <>
      <ItemContent
        disabled={props.disabled}
        style={{ ...leadingEl, align: leadingEl?.align || "end" }}
      >
        {props.reverse ? TrailingEl : LeadingEl}
      </ItemContent>

      <BasicDiv align="center" height={"full"}>
        <LineSeparator hide={isSepHidden("first")} />
        <BasicDiv
          style={{
            ...applyBasicStyle({
              ...(indicator || {}),
              size: indicator?.size ?? ".6rem",
              corners: indicator?.corners || "circle",
              backgroundColor: indicator?.backgroundColor || "onSurface",
              centerContent: indicator?.centerContent ?? true
            }),
            flexShrink: 0,
          }}
        >
          {props.indicator}
        </BasicDiv>

        <LineSeparator hide={isSepHidden("last")} />
      </BasicDiv>

      <ItemContent disabled={props.disabled} style={trailingEl}>
        {props.reverse ? LeadingEl : TrailingEl}
      </ItemContent>
    </>
  );
}
function ItemContent(props: {
  children: React.ReactNode;
  disabled?: boolean;
  style?: BasicStyleProps;
}) {
  return (
    <BasicDiv
      size={"full"}
      style={{
        ...applyBasicStyle({
          ...(props.style || {}),
          fade: props.disabled ? 0.5 : props.style?.fade,
        }),
        justifyContent: "center",
        flexGrow: 1,
      }}
    >
      {props.children}
    </BasicDiv>
  );
}
function LineSeparator(props: { hide: boolean }) {
  const { lineSeparatorColor } = useContext(Context)!;
  return (
    <BasicDiv
      width={"1px"}
      height={"full"}
      backgroundColor={lineSeparatorColor}
      fade={props.hide ? 0 : 1}
    />
  );
}

const Timeline = {
  Root,
  Item,
};
declare namespace TimelineProps {
  interface RootProps {
    /**@default "fit-content" */
    width?: BasicStyleProps["width"];
    /**@default "onSurface[0.5]" */
    lineSeparatorColor?: BasicColor;
    rowGap?: string;
    /**@default ".5rem" */
    columnGap?: string;
    children: JSX.Element | JSX.Element[];
  }

  interface ItemProps {
    indicator?: React.ReactNode;
    // /**The node that should be placed `before` (to the left of) the separator */
    // before?: React.ReactNode;
    // /**The node that should be placed `after` (to the right of) the separator */
    // after?: React.ReactNode;
    children: React.ReactElement | [React.ReactElement, React.ReactElement];
    disabled?: boolean;
    reverse?: boolean;
    styles?: Partial<
      Record<"leadingEl" | "trailingEl", BasicStyleProps> & {
        indicator: Partial<
          BasicStyleProps & {
            /**@default ".6rem" */
            size: BasicStyleProps["size"];
            /**@default "circle" */
            corners: BasicStyleProps["corners"];
            /**@default "onSurface" */
            backgroundColor: BasicColor;
          }
        >;
      }
    >;
  }
}

export { Timeline, type TimelineProps };
