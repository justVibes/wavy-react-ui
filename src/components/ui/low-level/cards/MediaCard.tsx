import { BasicDiv, BasicImg } from "@/main";
import React, { type JSX } from "react";
import type { IconType } from "react-icons";
import { PiImageBrokenLight } from "react-icons/pi";
import applyBasicStyle from "../html/BasicStyle";
import { BasicDivProps } from "../html/div/BasicDiv";
import { SafeOmit } from "@wavy/types";
import { BasicSpanProps } from "../html/span/BasicSpan";

function Root(props: MediaCardProps.RootProps) {
  const FallBack = () => {
    if (typeof props.fallback === "string") return props.fallback;
    if (React.isValidElement(props.fallback)) return props.fallback;
    const Icon = (props.fallback as IconType) || PiImageBrokenLight;
    return <Icon size={"3rem"} />;
  };
  const corners: BasicDivProps["corners"] = "lg";
  return (
    <BasicDiv
      className={props.className}
      padding={"1px"}
      corners={corners}
      backgroundColor="onSurface"
      color="surface"
      gap={"sm"}
      spill={"hidden"}
      fade={props.fade}
      height={props.height ?? "fit-content"}
      width={props.width ?? "14rem"}
      style={{ ...props.style, boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
    >
      <BasicDiv
        centerContent
        height={props.mediaHeight ?? "7rem"}
        width={"full"}
        backgroundColor="surface"
        color="onSurface"
        borderColor={"surface"}
        corners={{ top: corners }}
        spill={"hidden"}
      >
        {props.src ? (
          <BasicImg
            cover={props.coverImg ?? true}
            size={props.imgSize ?? "full"}
            corners={props.imgCorners ?? "md"}
            spill={"hidden"}
            src={props.src}
            style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
          />
        ) : (
          <FallBack />
        )}
      </BasicDiv>
      <BasicDiv
        width={"full"}
        gap={"md"}
        padding={"md"}
        align="start"
        spill={"hidden"}
      >
        <BasicDiv width={"full"} gap={0} spill={"hidden"}>
          <span
            children={props.title}
            style={applyBasicStyle({
              fontSize: props.titleFontSize ?? "md",
            })}
          />
          {props.description && (
            <span
              children={props.description}
              style={applyBasicStyle({
                fontSize: props.descriptionFontSize ?? "xs",
                fade: 0.5,
              })}
            />
          )}
        </BasicDiv>
        {props.children}
      </BasicDiv>
    </BasicDiv>
  );
}

function Content(props: MediaCardProps.ContentProps) {
  return (
    <BasicDiv
      {...{
        ...props,
        width: props.width ?? "full",
        spill: props.spill || "hidden",
      }}
    >
      {props.children}
    </BasicDiv>
  );
}

const MediaCard = { Root, Content };

declare namespace MediaCardProps {
  interface RootProps {
    className?: string;
    title: string;
    height?: BasicDivProps["height"];
    /**
     * @default "14rem"
     */
    width?: BasicDivProps["width"];
    /**
     * @default "7rem"
     */
    mediaHeight?: BasicDivProps["height"];
    /**
     * @default true
     */
    coverImg?: boolean;
    /**
     * @default "full"
     */
    imgSize?: BasicDivProps["size"];
    description?: string;
    children?: JSX.Element;
    src?: string;
    /**
     * @default "md"
     */
    titleFontSize?: BasicSpanProps["fontSize"];
    /**
     * @default "xs"
     */
    descriptionFontSize?: BasicSpanProps["fontSize"];
    /**
     * @default "md"
     */
    imgCorners?: BasicDivProps["corners"];
    fallback?: IconType | JSX.Element | string;
    fade?: BasicDivProps["fade"];
    style?: BasicDivProps["style"];
  }

  type ContentProps = SafeOmit<
    BasicDivProps,
    "decreaseYFaderPadding" | "updateScrollPosDeps" | "rememberScrollPos"
  > & { children: React.ReactNode };
}

export { MediaCard, type MediaCardProps };
