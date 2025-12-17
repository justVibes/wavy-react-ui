import {
  Avatar as ChakraAvatar,
  AvatarRootProps as ChakraAvatarRootProps,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { BasicColor } from "../html/BasicStyle";
import { resolveBasicColor } from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import React from "react";
import { BasicDivProps } from "../html/div/BasicDiv";

interface AvatarProps {
  size?: ChakraAvatarRootProps["size"];
  fallback?: string | IconType | JSX.Element;
  disableFallback?: boolean;
  src?: string | undefined;
  backgroundColor?: BasicColor;
  color?: BasicColor;
  style?: BasicDivProps["style"];
  fallbackStyle?: BasicDivProps["style"];
}
function Avatar(props: AvatarProps) {
  const Fallback = () => {
    const style = {
      ...props.fallbackStyle,
      display: props.fallbackStyle?.display || "flex",
      alignItems: props.fallbackStyle?.alignItems || "center",
      justifyContent: props.fallbackStyle?.justifyContent || "center",
    };
    if (props.disableFallback) return;
    if (typeof props.fallback === "string") {
      return <ChakraAvatar.Fallback name={props.fallback} style={style} />;
    }
    if (props.fallback && React.isValidElement(props.fallback))
      return props.fallback as JSX.Element;
    if (props.fallback) {
      const Icon = props.fallback as IconType;
      return <Icon size={"50%"} style={style} />;
    }
    return <ChakraAvatar.Fallback style={style} />;
  };
  return (
    <ChakraAvatar.Root
      size={props.size || "md"}
      backgroundColor={resolveBasicColor(props.backgroundColor)}
      color={resolveBasicColor(props.color)}
      style={props.style}>
      <Fallback />
      <ChakraAvatar.Image src={props.src} />
    </ChakraAvatar.Root>
  );
}

export { Avatar, type AvatarProps };
