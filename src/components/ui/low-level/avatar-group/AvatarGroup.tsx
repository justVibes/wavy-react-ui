import { BasicColor, resolveBasicColor } from "@/main";
import {
  AvatarGroup as ChakraAvatarGroup,
  AvatarGroupProps as ChakraAvatarGroupProps,
} from "@chakra-ui/react";
import { JSX } from "@emotion/react/jsx-runtime";

interface AvatarGroupProps {
  stacking?: ChakraAvatarGroupProps["stacking"];
  children: JSX.Element | JSX.Element[];
}
function AvatarGroup(props: AvatarGroupProps) {
  return (
    <ChakraAvatarGroup stacking={props.stacking}>
      {props.children}
    </ChakraAvatarGroup>
  );
}

export { AvatarGroup, type AvatarGroupProps };
