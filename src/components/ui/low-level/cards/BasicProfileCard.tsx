import { BasicAvatar, BasicColor, BasicSpan, ellipsis } from "@/main";
import { type JSX } from "react";
import { BasicAvatarProps } from "../../low-level/avatar/BasicAvatar";
import BasicDiv, { BasicDivProps } from "../../low-level/html/div/BasicDiv";
import { BasicSpanProps } from "../../low-level/html/span/BasicSpan";
import { AddPrefix } from "@wavy/types";
import applyBasicStyle from "../html/BasicStyle";

interface BasicProfileCardProps
  extends Partial<
      AddPrefix<
        {
          fontSize: BasicSpanProps["fontSize"];
          fade: BasicDivProps["fade"];
          fontWeight: BasicSpanProps["fontWeight"];
        },
        "title" | "description"
      >
    >,
    Partial<
      AddPrefix<
        {
          size: BasicAvatarProps["size"];
          src: BasicAvatarProps["src"];
          fallback: BasicAvatarProps["fallback"];
          backgroundColor?: BasicColor;
          color?: BasicColor;
        },
        "avatar"
      >
    > {
  className?: string;
  title: string;
  description: string;
  children?: JSX.Element;
  backgroundColor?: BasicColor;
  color?: BasicColor;
  width?: BasicDivProps["width"];
  height?: BasicDivProps["height"];
  padding?: BasicDivProps["padding"];
  corners?: BasicDivProps["corners"];
  disableBoxShadow?: boolean;
  style?: BasicDivProps["style"];
}
function BasicProfileCard(props: BasicProfileCardProps) {
  const defaults: Partial<BasicProfileCardProps> = {
    backgroundColor: "onSurface",
    color: "surface",
    padding: "md",
    corners: "lg",
  };
  const getParentProp = <Key extends keyof BasicProfileCardProps>(key: Key) =>
    props[key] ?? defaults[key];
  const getProp = <Key extends keyof BasicProfileCardProps>(key: Key) => {
    if (props.children) return;
    return props[key] || defaults[key];
  };
  const boxShadow = props.disableBoxShadow
    ? "none"
    : props.style?.boxShadow || "rgba(0, 0, 0, 0.35) 0px 5px 15px";
  return (
    <BasicDiv
      className={props.className}
      asChildren={!props.children}
      height={getParentProp("height")}
      width={getParentProp("width")}
      backgroundColor={getParentProp("backgroundColor")}
      color={getParentProp("color")}
      padding={getParentProp("padding")}
      corners={getParentProp("corners")}
      gap={"md"}
      spill={"hidden"}
      style={{
        ...props.style,
        boxShadow,
      }}
    >
      <BasicDiv
        row
        className={props.children ? undefined : props.className}
        gap={"md"}
        align="center"
        height={getProp("height")}
        width={getProp("width")}
        backgroundColor={getProp("backgroundColor")}
        color={getProp("color")}
        padding={getProp("padding")}
        corners={getProp("corners")}
        spill={"hidden"}
        style={props.children ? undefined : { ...props.style, boxShadow }}
      >
        <BasicAvatar
          src={props.avatarSrc}
          size={props.avatarSize ?? "sm"}
          fallback={props.avatarFallback}
          backgroundColor={props.avatarBackgroundColor}
          color={props.avatarColor}
        />
        <BasicDiv width={"full"} spill={"hidden"}>
          <span
            children={props.title}
            style={ellipsis(
              applyBasicStyle({
                fontSize: props.titleFontSize ?? "sm",
                fontWeight: props.titleFontWeight,
                fade: props.titleFade,
              })
            )}
          />
          <span
            children={props.description}
            style={ellipsis(
              applyBasicStyle({
                fade: props.descriptionFade ?? 0.5,
                fontSize: props.descriptionFontSize ?? "xs",
                fontWeight: props.descriptionFontWeight,
              })
            )}
          />
        </BasicDiv>
      </BasicDiv>
      {props.children}
    </BasicDiv>
  );
}

BasicProfileCard.Content = BasicDiv;

export default BasicProfileCard;
