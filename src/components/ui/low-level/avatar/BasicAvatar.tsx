import { Avatar, AvatarRootProps } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { BasicColor } from "../html/BasicStyle";
import { resolveBasicColor } from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import React from "react";

interface BasicAvatarProps {
  size?: AvatarRootProps["size"];
  fallback?: string | IconType | JSX.Element;
  disableFallback?: boolean;
  src?: string | undefined;
  backgroundColor?: BasicColor;
  color?: BasicColor;
}
function BasicAvatar(props: BasicAvatarProps) {
  const Fallback = () => {
    if (props.disableFallback) return;
    if (typeof props.fallback === "string")
      return <Avatar.Fallback name={props.fallback} />;
    if (props.fallback && React.isValidElement(props.fallback))
      return props.fallback as JSX.Element;
    if (props.fallback) {
      const Icon = props.fallback as IconType;
      return <Icon size={"50%"} />;
    }
    return <Avatar.Fallback />;
  };
  return (
    <Avatar.Root
      size={props.size || "md"}
      backgroundColor={resolveBasicColor(props.backgroundColor)}
      color={resolveBasicColor(props.color)}
    >
      <Fallback />
      <Avatar.Image src={props.src} />
    </Avatar.Root>
  );
}

export default BasicAvatar;
export type { BasicAvatarProps };
